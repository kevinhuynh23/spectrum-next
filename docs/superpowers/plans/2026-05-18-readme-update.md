# README Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stale `create-next-app` boilerplate README with an accurate, contributor-ready document reflecting the current stack, features, and architecture.

**Architecture:** Single-file rewrite of `README.md` in five sections: header + screenshots, features, getting started, architecture, contributing. Screenshots already captured and committed to `public/screenshots/`.

**Tech Stack:** Markdown, Playwright (screenshots already done), Git

---

### Task 1: Write the Header and Screenshots section

**Files:**
- Modify: `README.md` (full rewrite — overwrite all existing content)

- [ ] **Step 1: Overwrite README.md with the header block**

Replace the entire file with:

```markdown
# Spectrum

> A news aggregator that surfaces political bias so you can read across the spectrum.

| | |
|---|---|
| ![Home](public/screenshots/home.png) | ![About](public/screenshots/about.png) |
| ![Login](public/screenshots/login.png) | ![Sign Up](public/screenshots/signup.png) |

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![tRPC](https://img.shields.io/badge/tRPC-11-2596be?logo=trpc)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-c5f74f)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Vitest-green?logo=vitest)
```

- [ ] **Step 2: Verify the image paths resolve**

```bash
ls public/screenshots/home.png public/screenshots/about.png public/screenshots/login.png public/screenshots/signup.png
```

Expected: all four files listed with no errors.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README header with screenshots and stack badges"
```

---

### Task 2: Write the Features section

**Files:**
- Modify: `README.md` (append)

- [ ] **Step 1: Append the Features section**

```markdown

## Features

- **Bias detection** — every article tagged with a political lean via a curated ratings dataset
- **Full Spectrum view** — Left vs Right sourcing on the same headline, side by side
- **Category tabs** — filter by Headlines, Business, Entertainment, Health, Science, Sports, Tech
- **User dashboard** — reading stats, bias distribution chart, diversity score
- **Dark/light theme** — system-aware toggle
- **Auth** — sign up / sign in with NextAuth v5
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add features section to README"
```

---

### Task 3: Write the Getting Started section

**Files:**
- Modify: `README.md` (append)

- [ ] **Step 1: Append the Getting Started section**

```markdown

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm: `npm install -g pnpm`

### Install

\`\`\`bash
git clone https://github.com/<your-org>/spectrum-next.git
cd spectrum-next
pnpm run bootstrap
\`\`\`

### Environment variables

Create a `.env.local` file in the project root:

| Variable          | Description                               |
|-------------------|-------------------------------------------|
| `NEWSAPI_KEY`     | API key from [newsapi.org](https://newsapi.org) |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL`    | Base URL of the app, e.g. `http://localhost:3000` |

### Run

\`\`\`bash
pnpm dev      # Start dev server at http://localhost:3000
pnpm test     # Run Vitest test suite
pnpm lint     # ESLint + Prettier
pnpm build    # Production build
\`\`\`
```

- [ ] **Step 2: Verify env variable names match .env.local**

```bash
grep -oE '^[A-Z_]+=' .env.local
```

Expected output:
```
NEWSAPI_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add getting started section to README"
```

---

### Task 4: Write the Architecture section

**Files:**
- Modify: `README.md` (append)

- [ ] **Step 1: Append the Architecture section**

```markdown

## Architecture

### Routes

| Route                     | Description                              |
|---------------------------|------------------------------------------|
| `/`                       | News feed with category tabs             |
| `/fullspectrum/[title]`   | Left vs Right comparison for a headline  |
| `/user`                   | Personal dashboard & reading stats       |
| `/about`                  | About page                               |
| `/login`                  | Sign in                                  |
| `/signup`                 | Create account                           |

### tRPC Routers (`src/server/routers/`)

| Router    | Responsibilities                          |
|-----------|-------------------------------------------|
| `news`    | Fetch & cache articles from NewsAPI       |
| `auth`    | User registration, login, session         |
| `metrics` | Reading history, bias scores, diversity   |

### Key directories

\`\`\`
src/
├── app/          # Next.js App Router pages
├── components/   # Shared UI (Navbar, NewsCard, BiasChip, CategoryTabs)
├── server/       # tRPC routers + Drizzle schema
├── lib/          # bias.ts, newsapi.ts, db.ts
└── trpc/         # tRPC client setup
\`\`\`
```

- [ ] **Step 2: Verify the routers exist**

```bash
ls src/server/routers/
```

Expected: `auth.ts`, `metrics.ts`, `news.ts` (plus `__tests__/`)

- [ ] **Step 3: Verify the key directories exist**

```bash
ls src/app src/components src/server src/lib src/trpc
```

Expected: all directories listed with no errors.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add architecture section to README"
```

---

### Task 5: Write the Contributing section

**Files:**
- Modify: `README.md` (append)

- [ ] **Step 1: Append the Contributing section**

```markdown

## Contributing

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make your changes — ESLint and Prettier run automatically on commit via Husky
3. Add or update tests: `pnpm test`
4. Open a pull request against `main` with a clear description of what and why

Please keep PRs focused — one feature or fix per PR.
```

- [ ] **Step 2: Verify Husky is configured**

```bash
ls .husky/
```

Expected: at least one hook file (e.g. `pre-commit`).

- [ ] **Step 3: Final check — render README locally**

```bash
cat README.md | wc -l
```

Expected: 80–120 lines. If significantly outside that range, review the file for accidental duplication or missing sections.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add contributing section — complete README rewrite"
```
