# Vercel Deployment Design — spectrum-next

**Date:** 2026-05-19  
**Status:** Approved  
**Approach:** Option A — Vercel-native, migrations in build

---

## Overview

Deploy spectrum-next (Next.js 15, tRPC, Drizzle) to Vercel with preview deployments per PR. The primary blocker is `better-sqlite3`, which uses a local file and a native binary — both incompatible with Vercel's serverless environment. The solution is to migrate to Turso (libSQL), which is a SQLite-compatible cloud database with a near-identical API.

---

## Section 1: Database — better-sqlite3 → Turso

### Package changes
- Remove: `better-sqlite3`, `@types/better-sqlite3`
- Add: `@libsql/client`
- Drizzle adapter switches from `drizzle-orm/better-sqlite3` to `drizzle-orm/libsql`

### `src/lib/db.ts` rewrite
```ts
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
```

The inline `CREATE TABLE IF NOT EXISTS` DDL block in the existing `db.ts` is removed. Schema creation is owned by Drizzle migrations going forward.

### `drizzle.config.ts` (new file at project root)
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './drizzle/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
})
```

### Two Turso databases
| Environment | DB name | Used by |
|---|---|---|
| Production | `spectrum-next-prod` | `main` branch deploys |
| Staging | `spectrum-next-staging` | All Vercel preview deployments |

Vercel's per-scope env var system maps each URL to the right deployment type.

---

## Section 2: Build & Deploy Pipeline

### Build command (set in Vercel project settings)
```
pnpm drizzle-kit migrate && next build
```

### How it works
1. `drizzle-kit migrate` reads migration files from `drizzle/migrations/` and applies any unapplied ones to the target Turso DB. Idempotent — already-applied migrations are skipped.
2. If migration fails, the build fails and nothing deploys.
3. `next build` runs only after successful migration.

### Local migration workflow
1. Edit `src/lib/schema.ts`
2. Run `pnpm drizzle-kit generate` — creates a new file in `drizzle/migrations/`
3. Commit the migration file alongside the schema change
4. Push/open PR → Vercel applies migration to staging DB on preview, prod DB on merge to `main`

### One-time bootstrap step
Before the first deploy, generate the initial migration from the existing schema:
```bash
pnpm drizzle-kit generate
```
Commit the generated `drizzle/migrations/` folder.

---

## Section 3: Vercel Project Setup & Environment Variables

### Project configuration
| Setting | Value |
|---|---|
| Repository | `kevinhuynh23/spectrum-next` |
| Framework preset | Next.js (auto-detected) |
| Root directory | `.` |
| Build command | `pnpm drizzle-kit migrate && next build` |
| Install command | `pnpm install` |
| Output directory | `.next` (default) |

### Environment variables
| Variable | Production | Preview | Development |
|---|---|---|---|
| `TURSO_DATABASE_URL` | prod DB URL | staging DB URL | `file:./spectrum.db` |
| `TURSO_AUTH_TOKEN` | prod token | staging token | *(omit — not needed for local file)* |
| `AUTH_SECRET` | `openssl rand -base64 32` | strong random value | local value |
| `OPENAI_API_KEY` | prod key | prod key | local value |
| `NEWS_API_KEY` | prod key | prod key | local value |

### Notes
- `NEXTAUTH_URL` does not need to be set. NextAuth v5 beta auto-detects the URL from Vercel's `VERCEL_URL` environment variable.
- For local development, `.env.local` continues to point to the local SQLite file — no local workflow changes.

---

## Section 4: Files Changed

| File | Change |
|---|---|
| `package.json` | Remove `better-sqlite3`, `@types/better-sqlite3`; add `@libsql/client`; remove `better-sqlite3` from `pnpm.onlyBuiltDependencies` |
| `src/lib/db.ts` | Replace entire file with libsql client setup; remove inline DDL |
| `drizzle.config.ts` | New file — Drizzle Kit config for Turso |
| `drizzle/migrations/` | New directory — initial migration generated from existing schema |

**No changes required** to tRPC routers, NextAuth config, middleware, or any page/component code. The Drizzle query API is identical between adapters.

---

## Out of Scope

- Custom domain (using default `*.vercel.app`)
- GitHub Actions CI (can be added later when test suite grows)
- Turso database branching per PR (shared staging DB is sufficient for now)
