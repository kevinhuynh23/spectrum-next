# Spectrum Modernization — Design Spec

**Date:** 2026-05-10  
**Branch:** feat/spectrum-migration  
**Status:** Approved

---

## Overview

Full-stack modernization of the spectrum-next app. The goal is to bring every layer of the stack up to current standards: Next.js App Router, HeroUI + Tailwind v4 for UI, tRPC for the API layer, and Auth.js v5 for authentication. The migration is executed as a big-bang rewrite on the existing branch — all Mantine/Apollo/NextAuth v4 code is replaced in one pass.

---

## Decisions

| Concern | Current | Target |
|---|---|---|
| Framework | Next.js 14 Pages Router | Next.js 15 App Router |
| UI library | Mantine v6 + Emotion CSS-in-JS | HeroUI (NextUI v2) + Tailwind CSS v4 |
| API layer | Apollo Client v3 + Apollo Server v4 | tRPC v11 |
| Auth | NextAuth v4 | Auth.js v5 |
| Theme | Dark hardcoded | Dark default + light/dark toggle (next-themes) |
| Database | SQLite + Drizzle ORM | Unchanged |
| Business logic | `lib/` directory | Unchanged — zero modifications |
| Migration strategy | — | Big-bang rewrite (single branch, single pass) |

---

## Architecture

### Folder Structure

```
src/
├── app/
│   ├── layout.tsx                        # Root layout — HeroUIProvider, ThemeProvider, SessionProvider, Navbar
│   ├── page.tsx                          # Home — news feed (client component)
│   ├── about/page.tsx                    # About (server component)
│   ├── login/page.tsx                    # Login form (client component)
│   ├── signup/page.tsx                   # Signup form (client component)
│   ├── user/page.tsx                     # User dashboard with Recharts (client component)
│   ├── fullspectrum/[title]/page.tsx     # Multi-source coverage (client component)
│   └── api/
│       ├── trpc/[trpc]/route.ts          # tRPC HTTP handler (fetchRequestHandler)
│       └── auth/[...nextauth]/route.ts   # Auth.js v5 route handlers
├── server/
│   ├── trpc.ts                           # tRPC init, context, protectedProcedure
│   ├── routers/
│   │   ├── news.ts                       # news.list, news.spectrum
│   │   ├── auth.ts                       # auth.signup
│   │   └── metrics.ts                    # metrics.trackRead, metrics.stats
│   └── root.ts                           # AppRouter (merged router + type export)
├── trpc/
│   ├── server.ts                         # Server-side caller for RSC
│   └── client.tsx                        # TRPCReactProvider + createTRPCReact client
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                    # HeroUI Navbar — auth-aware, theme toggle
│   │   └── ThemeToggle.tsx               # next-themes useTheme() client island
│   └── news/
│       ├── NewsCard.tsx                  # HeroUI Card + CardBody
│       ├── CategoryTabs.tsx              # HeroUI Tabs (replaces Embla carousel)
│       └── BiasChip.tsx                  # HeroUI Chip with lean→color map
├── auth.ts                               # Auth.js v5 config (CredentialsProvider)
├── middleware.ts                         # Auth.js v5 middleware (replaces NextAuth v4 withAuth)
└── lib/                                  # Unchanged: bias.ts, newsapi.ts, db.ts, schema.ts, bias-ratings.json
```

### RSC vs Client Component Split

Pages with no interactivity (About) are React Server Components. Pages that need session state, user interaction, or tRPC hooks are Client Components. The Navbar is a Server Component shell with `ThemeToggle` as a client island.

---

## UI Components

### Navbar
Uses `HeroUI Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarItem`. Session state read server-side via `auth()` and passed as a prop — avoids making the whole navbar a client component. `ThemeToggle` is the only client island.

### CategoryTabs
`HeroUI Tabs` with `selectedKey` bound to a `useState` variable that drives the tRPC `news.list` query. Replaces the Embla carousel — the category list (7 items) doesn't need drag/scroll behavior.

### NewsCard
`HeroUI Card` + `CardBody`. Renders article title, truncated description, `BiasChip`, timestamp, and a "Full Spectrum →" link (shown only on headline category).

### BiasChip
Single component replacing both `BiasIndicator` and the badge in `NewsCard`. Uses `HeroUI Chip` with a color variant map:

| Lean | Color |
|---|---|
| Left | Blue |
| Center-Left | Light blue |
| Center | Indigo |
| Center-Right | Light red |
| Right | Red |
| Unknown / null | Zinc |

---

## Data Flow (tRPC replacing Apollo)

### Procedure Mapping

| Apollo (removed) | tRPC procedure | Auth required |
|---|---|---|
| `GET_NEWS` query | `news.list({ category })` | No |
| `GET_SPECTRUM` query | `news.spectrum({ title })` | No |
| `TRACK_READ` mutation | `metrics.trackRead({ category, source })` | Yes |
| `signup` mutation | `auth.signup({ username, email, password })` | No |
| `login` mutation | Removed — Auth.js `signIn()` handles login | — |
| `getMetrics` query | `metrics.stats()` | Yes |

### tRPC Context

```ts
// server/trpc.ts
export const createTRPCContext = async (opts: { headers: Headers }) => ({
  db,                     // better-sqlite3 instance from lib/db.ts
  session: await auth(),  // Auth.js v5 server session
})

// protectedProcedure throws UNAUTHORIZED if session is null
```

### Client Setup

- `trpc/server.ts` — server-side caller for RSC (no HTTP round-trip, direct function call)
- `trpc/client.tsx` — `TRPCReactProvider` wrapping `app/layout.tsx`; `useQuery`/`useMutation` used in client components

The entire `lib/` directory (bias detection, NewsAPI integration, Drizzle schema, DB connection) is carried over without modification. Only the resolver/query layer changes.

---

## Auth (Auth.js v5)

### Config (`src/auth.ts`)

```ts
export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [CredentialsProvider({
    authorize: async ({ email, password }) => {
      // Same bcrypt verification logic as current GraphQL auth resolver
    }
  })],
  callbacks: { jwt, session },
})
```

### Route Handler (`app/api/auth/[...nextauth]/route.ts`)

```ts
export const { GET, POST } = handlers  // one-liner, no custom logic
```

### Session Access Pattern

| Context | v4 pattern (removed) | v5 pattern |
|---|---|---|
| Server Component / RSC | `getServerSession()` | `await auth()` |
| Client Component | `useSession()` | `useSession()` (unchanged) |
| Middleware | `withAuth()` wrapper | `auth` middleware export |
| API route / tRPC context | `getServerSession()` | `await auth()` |

### Registration

The `auth.signup` tRPC procedure handles new user registration: validates input, bcrypt-hashes the password, inserts via Drizzle. Logic is identical to the current GraphQL mutation — only the transport changes.

---

## Theming

Three pieces wired in `app/layout.tsx`:

1. `HeroUIProvider` with `attribute="class"` — applies HeroUI's dark/light class to `<html>`
2. `ThemeProvider` from `next-themes` with `defaultTheme="dark"` and `enableSystem={false}`
3. `ThemeToggle` client component — calls `useTheme().setTheme()` to switch, rendered inside the Navbar

The indigo/violet accent (`#6366f1` / `#8b5cf6`) is the primary brand color in both modes. Bias chip colors are defined as Tailwind utility classes with `dark:` variants.

---

## Migration Order of Operations

1. Install HeroUI, Tailwind CSS v4, next-themes; remove Mantine, Emotion, `@mantine/*`, Apollo Client, Apollo Server, `@as-integrations/next`
2. Install tRPC v11 (`@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@tanstack/react-query`); install Auth.js v5 (`next-auth@beta`)
3. Configure Tailwind v4 (`tailwind.config.ts`) and HeroUI plugin; replace `src/styles/globals.css` with Tailwind CSS entry point; delete `src/styles/Home.module.css`
4. Scaffold `app/layout.tsx` with providers (HeroUIProvider, ThemeProvider, SessionProvider) and Navbar
5. Set up tRPC: `server/trpc.ts` → routers → `server/root.ts` → `app/api/trpc/[trpc]/route.ts` → `trpc/client.tsx`
6. Set up Auth.js v5: `src/auth.ts` → `app/api/auth/[...nextauth]/route.ts` → update `middleware.ts`
7. Build shared components: `Navbar`, `ThemeToggle`, `NewsCard`, `CategoryTabs`, `BiasChip`
8. Migrate pages in order: Home → FullSpectrum → Login → Signup → User Dashboard → About
9. Delete `src/pages/`, `src/common/apollo-client.ts`, `src/common/gql/`, `src/graphql/`, `src/modules/`
10. Verify: `pnpm build` passes, auth flow works, news feed loads, bias chips display, Full Spectrum page renders

---

## Out of Scope

- Database migration (SQLite stays, schema unchanged)
- TipTap rich text editor (installed but unused — remove the package, don't replace)
- Recharts (stays for the user dashboard — no HeroUI equivalent needed)
- New features (this is a stack modernization, not a feature sprint)
