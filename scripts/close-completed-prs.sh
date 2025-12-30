#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  ./scripts/close-completed-prs.sh --dry-run      # default
#  ./scripts/close-completed-prs.sh --apply        # actually comment & close matching PRs
#  ./scripts/close-completed-prs.sh --apply --delete-branch   # also delete the remote branch (if it's in the same repo)

DRY_RUN=1
DELETE_BRANCH=0
LABEL_ONLY=0
JSON_OUT=""
REPORT_ISSUE=0
ISSUE_TITLE="Automated: PRs included in main (detected)"
COMMENT_BODY="Closing this PR because its changes appear to already be included in main. If this is incorrect, please reopen and say why."

while [[ $# -gt 0 ]]; do
  case $1 in
    --apply) DRY_RUN=0; shift;;
    --delete-branch) DELETE_BRANCH=1; shift;;
    --comment) COMMENT_BODY="$2"; shift 2;;
    --label-only) LABEL_ONLY=1; shift;;
    --json-out) JSON_OUT="$2"; shift 2;;
    --report-issue) REPORT_ISSUE=1; shift;;
    --issue-title) ISSUE_TITLE="$2"; shift 2;;
    --help) echo "Usage: $0 [--dry-run|--apply] [--delete-branch] [--label-only] [--json-out <file>] [--report-issue] [--issue-title <title>]"; exit 0;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

# Preconditions
if ! command -v gh >/dev/null 2>&1; then
  echo "Error: 'gh' is required. Install GitHub CLI: https://cli.github.com/" >&2
  exit 2
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "Error: 'jq' is required." >&2
  exit 2
fi

REPO_FULL=$(gh repo view --json name,owner --jq '.owner.login + "/" + .name')

# fetch main so we have up-to-date commit graph
git fetch origin main || true

open_prs=$(gh pr list --state open --json number,title,headRefName,headRefOid,headRepository,headRefOid --limit 200)
if [[ -z "$open_prs" || "$open_prs" == "[]" ]]; then
  echo "No open PRs found. Exiting."
  exit 0
fi

# Precompute stable patch ids for main (used to detect cherry-picks)
# This can be slow on very large histories; adjust if needed.
echo "Computing patch-ids for origin/main (this may take a moment)..."
main_patch_ids=$(git log origin/main -p --pretty=format:%H | git patch-id --stable | awk '{print $1}' | sort -u)

TMP_JSON=$(mktemp)
SUMMARY_TMP=$(mktemp)
# ensure files exist
> "$TMP_JSON"
> "$SUMMARY_TMP"

for num in $(echo "$open_prs" | jq -r '.[].number'); do
  pr_json=$(echo "$open_prs" | jq -r ".[] | select(.number == $num) | @base64")
  _jq() { echo "$pr_json" | base64 --decode | jq -r "$1"; }
  head_oid=$(_jq '.headRefOid')
  head_ref=$(_jq '.headRefName')
  head_repo_full=$(echo "$pr_json" | base64 --decode | jq -r '.headRepository.fullName // empty')
  title=$(echo "$pr_json" | base64 --decode | jq -r '.title')
  url="$(gh pr view $num --json url --jq '.url')"

  echo "\nChecking PR #$num — $title ($head_repo_full:$head_ref)"

  # Ensure we can fetch the head ref into a temp ref
  tmp_ref="refs/heads/tmp-pr-$num"
  fetched=0
  if [[ -n "$head_repo_full" ]]; then
    # try to fetch from the fork directly first
    if git fetch "https://github.com/$head_repo_full.git" "$head_ref:$tmp_ref" 2>/dev/null; then
      fetched=1
    fi
  fi
  # fallback to origin
  if [[ $fetched -eq 0 ]]; then
    if git fetch origin "$head_ref:$tmp_ref" 2>/dev/null; then
      fetched=1
    fi
  fi
  # final fallback: use gh pr checkout
  if [[ $fetched -eq 0 ]]; then
    if gh pr checkout "$num" >/dev/null 2>&1; then
      tmp_ref="HEAD"
      fetched=1
    fi
  fi

  if [[ $fetched -eq 0 ]]; then
    echo "  Could not fetch PR branch $head_ref (skipping)"
    jq -n --arg num "$num" --arg title "$title" --arg url "$url" --arg reason "could-not-fetch" '{number: ($num|tonumber), title: $title, url: $url, reason: $reason}' >> "$TMP_JSON"
    continue
  fi

  # 1) Check if head commit is ancestor of origin/main (i.e., merged)
  included_by_merge=1
  if git merge-base --is-ancestor "$head_oid" origin/main 2>/dev/null; then
    included_by_merge=0
    reason="merged-into-main"
  fi

  if [[ $included_by_merge -eq 1 ]]; then
    # 2) If not merged, check if the *patches* for commits are present in main (detect cherry-picks)
    # discover commits in PR that aren't in main
    commits_in_pr=$(git rev-list "$head_oid" --not origin/main)
    if [[ -z "$commits_in_pr" ]]; then
      # no commits unique to the PR — maybe empty or all in main
      reason="no-unique-commits"
    else
      all_present=1
      for c in $commits_in_pr; do
        pid=$(git show "$c" -U0 | git patch-id --stable | awk '{print $1}') || pid=""
        if [[ -z "$pid" ]]; then
          all_present=0
          break
        fi
        if ! echo "$main_patch_ids" | grep -q "$pid"; then
          all_present=0
          break
        fi
      done
      if [[ $all_present -eq 1 ]]; then
        reason="cherry-picked-into-main"
      else
        reason="not-in-main"
      fi
    fi
  fi

  # Cleanup fetched tmp ref (if not HEAD)
  if [[ "$tmp_ref" != "HEAD" ]]; then
    git update-ref -d "$tmp_ref" 2>/dev/null || true
  fi

  if [[ "$reason" == "merged-into-main" || "$reason" == "cherry-picked-into-main" ]]; then
    echo "  -> PR #$num appears to be already included in main ($reason)."
    jq -n --arg num "$num" --arg title "$title" --arg url "$url" --arg reason "$reason" '{number: ($num|tonumber), title: $title, url: $url, reason: $reason}' >> "$TMP_JSON"
    if [[ $DRY_RUN -eq 1 ]]; then
      if [[ $LABEL_ONLY -eq 1 ]]; then
        echo "    DRY-RUN: would add label 'completed-elsewhere' and post comment."
      else
        echo "    DRY-RUN: would post comment and close."
      fi
    else
      if [[ $LABEL_ONLY -eq 1 ]]; then
        gh label create completed-elsewhere --color FFCC00 --description "Detected as already included in main by automation" >/dev/null 2>&1 || true
        echo "    Adding label 'completed-elsewhere' and commenting on PR #$num..."
        gh pr edit "$num" --add-label "completed-elsewhere"
        gh pr comment "$num" --body "$COMMENT_BODY\n\n(Detected reason: $reason)"
      else
        echo "    Posting comment and closing PR #$num..."
        gh pr comment "$num" --body "$COMMENT_BODY\n\n(Detected reason: $reason)"
        gh pr close "$num"
      fi
      if [[ $DELETE_BRANCH -eq 1 ]]; then
        # attempt to delete the branch in its repo if it's the same repo
        if [[ "$head_repo_full" == "$REPO_FULL" ]]; then
          echo "    Deleting branch $head_ref from ${REPO_FULL}..."
          gh api repos/$REPO_FULL/git/refs/heads/$head_ref -X DELETE || echo "      Failed to delete remote branch (you may need permissions)."
        else
          echo "    Not deleting branch: it's in fork $head_repo_full (skipping)."
        fi
      fi
    fi
  else
    echo "  -> PR #$num is not included in main (reason: $reason). Skipping."
    jq -n --arg num "$num" --arg title "$title" --arg url "$url" --arg reason "$reason" '{number: ($num|tonumber), title: $title, url: $url, reason: $reason}' >> "$TMP_JSON"
  fi

done

# Summary
if [[ -n "$JSON_OUT" ]]; then
  jq -s '.' "$TMP_JSON" > "$JSON_OUT" || true
fi

echo "\nSummary:"
jq -s -r '.[] | ("PR #"+(.number|tostring)+" — "+.title+" — "+.url+" — "+.reason)' "$TMP_JSON" || echo "  (no PRs processed)"

# Optionally create an issue listing PRs that were included in main
if [[ $REPORT_ISSUE -eq 1 ]]; then
  count=$(jq -s -r '.[] | select(.reason=="merged-into-main" or .reason=="cherry-picked-into-main") | .number' "$TMP_JSON" | wc -l | tr -d ' ')
  if [[ "$count" -gt 0 ]]; then
    body="Automated check found $count PR(s) already included in main:\n\n"
    body+=$(jq -s -r '.[] | select(.reason=="merged-into-main" or .reason=="cherry-picked-into-main") | ("- PR #"+(.number|tostring)+" — "+.title+" — "+.url+" — "+.reason)' "$TMP_JSON")
    if [[ $DRY_RUN -eq 1 ]]; then
      echo "DRY-RUN: would create issue titled '$ISSUE_TITLE' with body:\n$body"
    else
      echo "Creating issue..."
      gh issue create --title "$ISSUE_TITLE" --body "$body"
    fi
  else
    echo "No PRs included in main found; not creating issue."
  fi
fi

# Cleanup temp files
rm -f "$TMP_JSON" "$SUMMARY_TMP" || true

exit 0
