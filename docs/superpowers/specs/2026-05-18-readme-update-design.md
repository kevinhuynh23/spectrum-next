# README Update — Design Spec

**Date:** 2026-05-18  
**Audience:** Open source contributors / team  
**Approach:** Option A — Minimal, scannable

---

## Goal

Replace the boilerplate `create-next-app` README with an accurate, contributor-ready document that reflects the current stack, features, and architecture.

## Structure

### 1. Header & Screenshots

- `# Spectrum` heading with one-line project description
- 2×2 screenshot grid: home, about, login, signup (images in `public/screenshots/`)
- Badge row: Next.js 15 · tRPC · Drizzle · Tailwind v4 · Vitest

### 2. Features

Bullet list covering:
- Bias detection (curated ratings dataset)
- Full Spectrum view (Left vs Right on the same headline)
- Category tabs (Headlines, Business, Entertainment, Health, Science, Sports, Tech)
- User dashboard (reading stats, bias distribution, diversity score)
- Dark/light theme toggle
- Auth (NextAuth v5)

### 3. Getting Started

- Prerequisites: Node.js 18+, pnpm
- Clone + `pnpm run bootstrap`
- Environment variables table:

| Variable        | Description                             |
|-----------------|-----------------------------------------|
| NEWSAPI_KEY     | API key from newsapi.org                |
| NEXTAUTH_SECRET | Random secret (openssl rand -base64 32) |
| NEXTAUTH_URL    | Base URL e.g. http://localhost:3000     |

- Commands: `pnpm dev`, `pnpm test`, `pnpm lint`, `pnpm build`

### 4. Architecture

- Routes table (6 routes)
- tRPC routers table (news, auth, metrics)
- Key directories tree (app, components, server, lib, trpc)

### 5. Contributing

- Fork → branch (`feat/your-feature`) → PR against `main`
- ESLint + Prettier enforced on commit via Husky
- Tests required: `pnpm test`
- One feature/fix per PR

## Screenshots

Captured via Playwright and stored at `public/screenshots/`:
- `home.png` — news feed with category tabs and bias-tagged cards
- `about.png` — about page with feature highlights and team
- `login.png` — centered dark card auth form
- `signup.png` — registration form

## Out of Scope

- Deployment guide (Vercel/self-hosted)
- GraphQL documentation (project now uses tRPC)
- Roadmap section
