# Spectrum Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Big-bang rewrite of spectrum-next from Next.js 14 Pages Router + Mantine v6 + Apollo GraphQL to Next.js 15 App Router + HeroUI + Tailwind v4 + tRPC + Auth.js v5, preserving all existing features.

**Architecture:** The `src/lib/` directory (bias detection, NewsAPI, Drizzle schema, DB connection) is carried over unchanged. GraphQL resolvers map 1:1 to tRPC procedures. Pages become Server or Client Components depending on whether they need hooks. The only client islands in otherwise-server layouts are the ThemeToggle and the Navbar auth buttons.

**Tech Stack:** Next.js 15, React 19, HeroUI v2 (`@heroui/react`), Tailwind CSS v4, next-themes, tRPC v11, TanStack Query v5, Auth.js v5 (`next-auth@beta`), Drizzle ORM, better-sqlite3, Recharts, Vitest.

---

## File Map

**Create:**
- `src/app/layout.tsx` — root layout with all providers + Navbar
- `src/app/page.tsx` — home news feed (client component)
- `src/app/about/page.tsx` — about page (server component)
- `src/app/login/page.tsx` — login form (client component)
- `src/app/signup/page.tsx` — signup form (client component)
- `src/app/user/page.tsx` — user dashboard with Recharts (client component)
- `src/app/fullspectrum/[title]/page.tsx` — multi-source coverage (client component)
- `src/app/api/trpc/[trpc]/route.ts` — tRPC HTTP handler
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js v5 route handlers
- `src/auth.ts` — Auth.js v5 config
- `src/server/trpc.ts` — tRPC init, context, publicProcedure, protectedProcedure
- `src/server/routers/news.ts` — news.list + news.spectrum procedures
- `src/server/routers/auth.ts` — auth.signup procedure
- `src/server/routers/metrics.ts` — metrics.trackRead + metrics.stats procedures
- `src/server/root.ts` — merged AppRouter + type export
- `src/trpc/server.ts` — server-side tRPC caller for RSC
- `src/trpc/client.tsx` — TRPCReactProvider + createTRPCReact client
- `src/components/layout/Navbar.tsx` — HeroUI Navbar (server component shell)
- `src/components/layout/ThemeToggle.tsx` — next-themes toggle (client component)
- `src/components/news/NewsCard.tsx` — HeroUI Card
- `src/components/news/CategoryTabs.tsx` — HeroUI Tabs
- `src/components/news/BiasChip.tsx` — HeroUI Chip with lean→color map
- `tailwind.config.ts` — Tailwind v4 + HeroUI plugin config
- `postcss.config.mjs` — Tailwind v4 PostCSS
- `src/server/routers/__tests__/news.test.ts` — tRPC news router tests (replaces graphql resolvers test)

**Modify:**
- `package.json` — swap dependencies
- `next.config.js` — upgrade to Next.js 15 config
- `src/middleware.ts` — replace NextAuth v4 withAuth with Auth.js v5
- `src/styles/globals.css` — replace Emotion globals with Tailwind entry point
- `tsconfig.json` — ensure `src/app` is included if needed

**Delete (Task 18):**
- `src/pages/` — entire directory
- `src/common/apollo-client.ts`
- `src/common/gql/mutations.ts`
- `src/common/gql/queries.ts`
- `src/graphql/` — entire directory
- `src/modules/` — entire directory
- `src/common/components/elements/header/`
- `src/common/components/elements/navbar/`
- `src/common/components/elements/footer/`
- `src/styles/Home.module.css`

**Keep unchanged:**
- `src/lib/bias.ts`, `src/lib/bias-ratings.json`, `src/lib/db.ts`
- `src/lib/newsapi.ts`, `src/lib/schema.ts`, `src/lib/auth-utils.ts`
- `src/common/types/news.ts`, `src/common/types/routes.ts`
- `src/auth/__tests__/auth.test.ts` — passes without changes
- `src/lib/__tests__/bias.test.ts`, `src/lib/__tests__/newsapi.test.ts`, `src/lib/__tests__/schema.test.ts`
- `public/` — static images used by About page

---

## Task 1: Swap Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove old packages**

```bash
pnpm remove \
  @mantine/carousel @mantine/core @mantine/dates @mantine/dropzone \
  @mantine/ds @mantine/form @mantine/hooks @mantine/modals @mantine/next \
  @mantine/notifications @mantine/nprogress @mantine/prism @mantine/spotlight \
  @mantine/tiptap \
  @emotion/react @emotion/server \
  @apollo/client @apollo/server @as-integrations/next \
  @graphql-tools/schema graphql \
  @tiptap/core @tiptap/extension-link @tiptap/react @tiptap/starter-kit \
  prosemirror-commands prosemirror-dropcursor prosemirror-gapcursor \
  prosemirror-history prosemirror-keymap prosemirror-model \
  prosemirror-schema-list prosemirror-state prosemirror-transform prosemirror-view \
  embla-carousel-react @floating-ui/react \
  prop-types @next/font \
  @tabler/icons @tabler/icons-react
```

- [ ] **Step 2: Install new packages**

```bash
pnpm add \
  next@15 react@19 react-dom@19 \
  @heroui/react framer-motion \
  tailwindcss @tailwindcss/postcss next-themes \
  @trpc/server @trpc/client @trpc/react-query \
  @tanstack/react-query \
  zod
```

- [ ] **Step 3: Upgrade Auth.js to v5**

```bash
pnpm add next-auth@beta
```

- [ ] **Step 4: Update React type packages**

```bash
pnpm add -D @types/react@19 @types/react-dom@19
```

- [ ] **Step 5: Verify install succeeded**

```bash
pnpm install
```

Expected: no errors. Warnings about peer deps are OK.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: swap to HeroUI+tRPC+Auth.js v5, remove Mantine+Apollo"
```

---

## Task 2: Configure Tailwind v4 + HeroUI

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Create `postcss.config.mjs`**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

- [ ] **Step 2: Create `tailwind.config.ts`**

```ts
import { heroui } from '@heroui/react'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  darkMode: 'class',
  plugins: [heroui()],
}

export default config
```

- [ ] **Step 3: Replace `src/styles/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Update `next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
```

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts postcss.config.mjs src/styles/globals.css next.config.js
git commit -m "chore: configure Tailwind v4 + HeroUI plugin"
```

---

## Task 3: Auth.js v5 Setup

**Files:**
- Create: `src/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Modify: `src/middleware.ts`

- [ ] **Step 1: Create `src/auth.ts`**

```ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authorizeUser } from '@/lib/auth-utils'

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        return authorizeUser(
          credentials.email as string,
          credentials.password as string,
        )
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as { username?: string }).username ?? user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as { username?: string }).username = token.username as string
      }
      return session
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
})
```

- [ ] **Step 2: Create `src/app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

- [ ] **Step 3: Update `src/middleware.ts`**

```ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/user/:path*'],
}
```

- [ ] **Step 4: Verify the existing auth tests still pass**

```bash
pnpm test
```

Expected: `src/auth/__tests__/auth.test.ts` passes (it tests `authorizeUser` in `lib/auth-utils.ts`, which is unchanged).

- [ ] **Step 5: Commit**

```bash
git add src/auth.ts src/app/api/auth src/middleware.ts
git commit -m "feat: add Auth.js v5 config, route handler, and middleware"
```

---

## Task 4: tRPC Server Setup

**Files:**
- Create: `src/server/trpc.ts`
- Create: `src/server/root.ts`
- Create: `src/app/api/trpc/[trpc]/route.ts`

- [ ] **Step 1: Create `src/server/trpc.ts`**

```ts
import { initTRPC, TRPCError } from '@trpc/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth()
  return { db, session }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, session: ctx.session } })
})
```

- [ ] **Step 2: Create placeholder `src/server/root.ts`** (updated in Task 5 when routers exist)

```ts
import { router } from './trpc'

export const appRouter = router({})

export type AppRouter = typeof appRouter
```

- [ ] **Step 3: Create `src/app/api/trpc/[trpc]/route.ts`**

```ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/root'
import { createTRPCContext } from '@/server/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ error }) => console.error('[tRPC]', error)
        : undefined,
  })

export { handler as GET, handler as POST }
```

- [ ] **Step 4: Commit**

```bash
git add src/server/trpc.ts src/server/root.ts src/app/api/trpc
git commit -m "feat: add tRPC server init, context, and HTTP handler"
```

---

## Task 5: tRPC Routers (news, auth, metrics)

**Files:**
- Create: `src/server/routers/news.ts`
- Create: `src/server/routers/auth.ts`
- Create: `src/server/routers/metrics.ts`
- Modify: `src/server/root.ts`

- [ ] **Step 1: Write the failing test for the news router**

Create `src/server/routers/__tests__/news.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/newsapi', () => ({
  fetchNewsByCategory: vi.fn().mockResolvedValue([
    {
      title: 'Test Article - Reuters',
      description: 'Test desc',
      url: 'https://example.com',
      urlToImage: null,
      publishedAt: '2024-01-01T00:00:00Z',
      source: { id: 'reuters', name: 'Reuters' },
    },
  ]),
  fetchSpectrum: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/lib/bias', () => ({
  getBiasForSource: vi.fn().mockReturnValue('Center'),
  getFramingAnalysis: vi.fn().mockResolvedValue({ framing: 'Neutral tone' }),
}))

vi.mock('@/lib/db', () => ({ db: {} }))
vi.mock('@/lib/schema', () => ({ users: {}, readingMetrics: {}, biasCache: {} }))
vi.mock('@/auth', () => ({ auth: vi.fn().mockResolvedValue(null) }))

describe('news router', () => {
  it('news.list returns articles with bias attached', async () => {
    const { newsRouter } = await import('../news')
    const caller = newsRouter.createCaller({ db: {} as any, session: null })
    const articles = await caller.list({ category: 'headline' })
    expect(articles).toHaveLength(1)
    expect(articles[0].title).toBe('Test Article - Reuters')
    expect(articles[0].sourceBias).toBe('Center')
  })

  it('news.list defaults to headline when no category given', async () => {
    const { newsRouter } = await import('../news')
    const caller = newsRouter.createCaller({ db: {} as any, session: null })
    const articles = await caller.list({})
    expect(articles).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm test src/server/routers/__tests__/news.test.ts
```

Expected: FAIL — `newsRouter` is not defined.

- [ ] **Step 3: Create `src/server/routers/news.ts`**

```ts
import { z } from 'zod'
import { fetchNewsByCategory, fetchSpectrum } from '@/lib/newsapi'
import { getBiasForSource, getFramingAnalysis } from '@/lib/bias'
import { publicProcedure, router } from '../trpc'

export const newsRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().default('headline') }))
    .query(async ({ input }) => {
      const articles = await fetchNewsByCategory(input.category)
      return articles.map(a => ({
        ...a,
        sourceBias: getBiasForSource(a.source.name) ?? null,
        framingAnalysis: null as string | null,
      }))
    }),

  spectrum: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ input }) => {
      const articles = await fetchSpectrum(input.title)
      return Promise.all(
        articles.map(async a => ({
          ...a,
          sourceBias: getBiasForSource(a.source.name) ?? null,
          framingAnalysis: (
            await getFramingAnalysis(a.url, a.title, a.description, a.source.name)
          ).framing,
        }))
      )
    }),
})
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
pnpm test src/server/routers/__tests__/news.test.ts
```

Expected: PASS — 2 tests pass.

- [ ] **Step 5: Create `src/server/routers/auth.ts`**

```ts
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users } from '@/lib/schema'
import { publicProcedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        passwordConf: z.string(),
        username: z.string().min(3),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.passwordConf) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Passwords do not match' })
      }
      const existing = ctx.db.select().from(users).where(eq(users.email, input.email)).all()
      if (existing.length > 0) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Registration failed. Please try again.' })
      }
      const passwordHash = await bcrypt.hash(input.password, 10)
      const result = ctx.db
        .insert(users)
        .values({
          email: input.email,
          passwordHash,
          username: input.username,
          firstName: input.firstName,
          lastName: input.lastName,
        })
        .run()
      const [newUser] = ctx.db
        .select()
        .from(users)
        .where(eq(users.id, Number(result.lastInsertRowid)))
        .all()
      return newUser
    }),
})
```

- [ ] **Step 6: Create `src/server/routers/metrics.ts`**

```ts
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { readingMetrics } from '@/lib/schema'
import { protectedProcedure, router } from '../trpc'

const METRIC_CATEGORIES = ['sports', 'health', 'business', 'entertainment', 'science', 'technology'] as const

export const metricsRouter = router({
  trackRead: protectedProcedure
    .input(z.object({ category: z.string(), source: z.string() }))
    .mutation(({ input, ctx }) => {
      const userId = Number(ctx.session.user.id)
      ctx.db.insert(readingMetrics).values({ userId, category: input.category, source: input.source }).run()
      return true
    }),

  stats: protectedProcedure.query(({ ctx }) => {
    const userId = Number(ctx.session.user.id)
    const counts: Record<string, number> = {}
    for (const cat of METRIC_CATEGORIES) {
      counts[cat] = ctx.db
        .select()
        .from(readingMetrics)
        .where(and(eq(readingMetrics.userId, userId), eq(readingMetrics.category, cat)))
        .all().length
    }
    return { categoryToNumArticles: counts }
  }),
})
```

- [ ] **Step 7: Update `src/server/root.ts`**

```ts
import { router } from './trpc'
import { newsRouter } from './routers/news'
import { authRouter } from './routers/auth'
import { metricsRouter } from './routers/metrics'

export const appRouter = router({
  news: newsRouter,
  auth: authRouter,
  metrics: metricsRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 8: Run all tests to confirm nothing regressed**

```bash
pnpm test
```

Expected: all existing tests pass + 2 new news router tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/server/routers src/server/root.ts
git commit -m "feat: add tRPC routers for news, auth, and metrics"
```

---

## Task 6: tRPC Client Setup

**Files:**
- Create: `src/trpc/client.tsx`
- Create: `src/trpc/server.ts`

- [ ] **Step 1: Create `src/trpc/client.tsx`**

```tsx
'use client'

import { createTRPCReact } from '@trpc/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import type { AppRouter } from '@/server/root'

export const trpc = createTRPCReact<AppRouter>()

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: '/api/trpc' })],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
```

- [ ] **Step 2: Create `src/trpc/server.ts`**

```ts
import 'server-only'
import { createTRPCContext } from '@/server/trpc'
import { appRouter } from '@/server/root'
import { headers } from 'next/headers'

export async function getServerTRPC() {
  const h = await headers()
  return appRouter.createCaller(
    await createTRPCContext({ headers: h })
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/trpc
git commit -m "feat: add tRPC client provider and server-side caller"
```

---

## Task 7: BiasChip Component

**Files:**
- Create: `src/components/news/BiasChip.tsx`

- [ ] **Step 1: Create `src/components/news/BiasChip.tsx`**

```tsx
import { Chip } from '@heroui/react'

const LEAN_CONFIG: Record<string, { color: 'primary' | 'secondary' | 'danger' | 'default'; label: string }> = {
  Left: { color: 'primary', label: 'Left' },
  'Center-Left': { color: 'primary', label: 'Center-Left' },
  Center: { color: 'secondary', label: 'Center' },
  'Center-Right': { color: 'danger', label: 'Center-Right' },
  Right: { color: 'danger', label: 'Right' },
}

interface Props {
  lean?: string | null
}

export function BiasChip({ lean }: Props) {
  if (!lean) return null
  const config = LEAN_CONFIG[lean]
  if (!config) return null

  return (
    <Chip size="sm" color={config.color} variant="flat">
      {config.label}
    </Chip>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/news/BiasChip.tsx
git commit -m "feat: add BiasChip component (HeroUI Chip)"
```

---

## Task 8: CategoryTabs Component

**Files:**
- Create: `src/components/news/CategoryTabs.tsx`

- [ ] **Step 1: Create `src/components/news/CategoryTabs.tsx`**

```tsx
'use client'

import { Tabs, Tab } from '@heroui/react'

const CATEGORIES = [
  { key: 'headline', label: 'Headlines' },
  { key: 'politics', label: 'Politics' },
  { key: 'business', label: 'Business' },
  { key: 'technology', label: 'Tech' },
  { key: 'science', label: 'Science' },
  { key: 'health', label: 'Health' },
  { key: 'sports', label: 'Sports' },
] as const

interface Props {
  active: string
  onChange: (category: string) => void
}

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <Tabs
      selectedKey={active}
      onSelectionChange={(key) => onChange(key as string)}
      variant="underlined"
      classNames={{ tabList: 'mb-4' }}
    >
      {CATEGORIES.map(({ key, label }) => (
        <Tab key={key} title={label} />
      ))}
    </Tabs>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/news/CategoryTabs.tsx
git commit -m "feat: add CategoryTabs component (HeroUI Tabs)"
```

---

## Task 9: NewsCard Component

**Files:**
- Create: `src/components/news/NewsCard.tsx`

- [ ] **Step 1: Create `src/components/news/NewsCard.tsx`**

```tsx
import { Card, CardBody, Link } from '@heroui/react'
import NextLink from 'next/link'
import { BiasChip } from './BiasChip'
import type { NewsArticle } from '@/lib/newsapi'

interface Props {
  article: NewsArticle & { sourceBias?: string | null; framingAnalysis?: string | null }
  category: string
  showSource?: boolean
  onRead?: (category: string, source: string) => void
}

export function NewsCard({ article, category, showSource = false, onRead }: Props) {
  return (
    <Card className="mb-3" shadow="sm">
      <CardBody>
        <Link
          href={article.url}
          isExternal
          className="font-semibold text-foreground mb-1 block leading-snug"
          onClick={() => onRead?.(category, article.source.name)}
        >
          {article.title}
        </Link>
        {showSource && (
          <p className="text-xs text-default-500 mb-1">{article.source.name}</p>
        )}
        <div className="flex items-center gap-2 mb-2">
          <BiasChip lean={article.sourceBias} />
        </div>
        {article.description && (
          <p className="text-sm text-default-500 line-clamp-2 mb-2">{article.description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xs text-default-400">{formatAgo(article.publishedAt)}</span>
          {category === 'headline' && (
            <NextLink
              href={`/fullspectrum/${encodeURIComponent(article.title)}`}
              className="text-xs text-primary hover:underline"
            >
              Full Spectrum →
            </NextLink>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

function formatAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/news/NewsCard.tsx
git commit -m "feat: add NewsCard component (HeroUI Card)"
```

---

## Task 10: ThemeToggle + Navbar

**Files:**
- Create: `src/components/layout/ThemeToggle.tsx`
- Create: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Create `src/components/layout/ThemeToggle.tsx`**

```tsx
'use client'

import { useTheme } from 'next-themes'
import { Button } from '@heroui/react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Button
      isIconOnly
      variant="light"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/Navbar.tsx`**

```tsx
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
} from '@heroui/react'
import NextLink from 'next/link'
import { auth, signOut } from '@/auth'
import { ThemeToggle } from './ThemeToggle'

export async function Navbar() {
  const session = await auth()
  const username = (session?.user as { username?: string })?.username ?? session?.user?.name

  return (
    <HeroNavbar maxWidth="xl" isBordered>
      <NavbarBrand>
        <Link as={NextLink} href="/" className="font-bold text-xl text-foreground">
          Spectrum
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link as={NextLink} href="/" color="foreground">Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={NextLink} href="/about" color="foreground">About</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        {session ? (
          <>
            <NavbarItem>
              <Link as={NextLink} href="/user" color="foreground">{username}</Link>
            </NavbarItem>
            <NavbarItem>
              <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
                <Button type="submit" variant="bordered" size="sm">Logout</Button>
              </form>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link as={NextLink} href="/login" color="foreground">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={NextLink} href="/signup" color="primary" size="sm">Sign Up</Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </HeroNavbar>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout
git commit -m "feat: add Navbar and ThemeToggle components (HeroUI)"
```

---

## Task 11: Root Layout

**Files:**
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { TRPCReactProvider } from '@/trpc/client'
import { Navbar } from '@/components/layout/Navbar'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Spectrum',
  description: 'Read the news from every angle.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <HeroUIProvider>
            <SessionProvider>
              <TRPCReactProvider>
                <Navbar />
                <main className="max-w-screen-xl mx-auto px-4 py-8">
                  {children}
                </main>
              </TRPCReactProvider>
            </SessionProvider>
          </HeroUIProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add App Router root layout with all providers"
```

---

## Task 12: Home Page

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create `src/app/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Spinner } from '@heroui/react'
import { CategoryTabs } from '@/components/news/CategoryTabs'
import { NewsCard } from '@/components/news/NewsCard'
import { trpc } from '@/trpc/client'
import type { NewsArticle } from '@/lib/newsapi'

export default function HomePage() {
  const [category, setCategory] = useState('headline')
  const { data: session } = useSession()

  const { data, isLoading, isError } = trpc.news.list.useQuery({ category })
  const trackRead = trpc.metrics.trackRead.useMutation()

  function handleRead(cat: string, source: string) {
    if (!session?.user) return
    trackRead.mutate({ category: cat, source })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Today&apos;s News</h1>
      <CategoryTabs active={category} onChange={setCategory} />
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {isError && (
        <p className="text-danger text-sm">Failed to load news. Check your NEWSAPI_KEY.</p>
      )}
      {(data ?? []).map((article: NewsArticle & { sourceBias?: string | null }, i: number) => (
        <NewsCard
          key={`${category}-${i}`}
          article={article}
          category={category}
          onRead={handleRead}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add home page with tRPC news feed"
```

---

## Task 13: Full Spectrum Page

**Files:**
- Create: `src/app/fullspectrum/[title]/page.tsx`

- [ ] **Step 1: Create `src/app/fullspectrum/[title]/page.tsx`**

```tsx
'use client'

import { useParams } from 'next/navigation'
import { Spinner, Divider } from '@heroui/react'
import { NewsCard } from '@/components/news/NewsCard'
import { BiasChip } from '@/components/news/BiasChip'
import { trpc } from '@/trpc/client'
import type { NewsArticle } from '@/lib/newsapi'

const LEANS = ['Left', 'Center-Left', 'Center', 'Center-Right', 'Right'] as const

export default function FullSpectrumPage() {
  const params = useParams()
  const title = decodeURIComponent((params.title as string) ?? '')

  const { data, isLoading, isError } = trpc.news.spectrum.useQuery(
    { title },
    { enabled: !!title }
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Full Spectrum Coverage</h1>
      <p className="text-default-500 mb-4">&ldquo;{title}&rdquo;</p>
      <Divider className="mb-4" />

      <div className="flex flex-wrap gap-2 items-center mb-4">
        {LEANS.map(lean => <BiasChip key={lean} lean={lean} />)}
        <span className="text-xs text-default-400">
          — bias ratings from AllSides · framing by GPT-4o-mini
        </span>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {isError && (
        <p className="text-danger text-sm">Failed to load spectrum coverage.</p>
      )}
      {data?.length === 0 && (
        <p className="text-default-500">No additional coverage found for this story.</p>
      )}
      {(data ?? []).map((article: NewsArticle & { sourceBias?: string | null; framingAnalysis?: string | null }, i: number) => (
        <div key={i} className="mb-4">
          <NewsCard article={article} category="spectrum" showSource />
          {article.framingAnalysis && article.framingAnalysis !== 'No framing analysis available.' && (
            <p className="text-xs text-default-400 italic px-3 pb-2">
              Framing: {article.framingAnalysis}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/fullspectrum
git commit -m "feat: add Full Spectrum page with tRPC query"
```

---

## Task 14: Login + Signup Pages

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/signup/page.tsx`

- [ ] **Step 1: Create `src/app/login/page.tsx`**

```tsx
'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input, Button, Card, CardBody, Link } from '@heroui/react'
import NextLink from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.ok) {
      router.push('/')
    } else {
      setError('Incorrect email or password.')
    }
  }

  return (
    <div className="flex justify-center py-16">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Sign in to Spectrum</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onValueChange={setEmail}
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onValueChange={setPassword}
            />
            <Button type="submit" color="primary" fullWidth isLoading={loading}>
              Sign In
            </Button>
            <p className="text-center text-sm text-default-500">
              No account?{' '}
              <Link as={NextLink} href="/signup" size="sm">Sign up</Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/app/signup/page.tsx`**

```tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Button, Card, CardBody, Link } from '@heroui/react'
import NextLink from 'next/link'
import { trpc } from '@/trpc/client'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '', password: '', passwordConf: '',
    username: '', firstName: '', lastName: '',
  })
  const [error, setError] = useState('')

  const signup = trpc.auth.signup.useMutation({
    onSuccess: () => router.push('/login'),
    onError: (err) => setError(err.message),
  })

  const set = (field: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [field]: val }))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    signup.mutate(form)
  }

  return (
    <div className="flex justify-center py-16">
      <Card className="w-full max-w-lg">
        <CardBody className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Create your Spectrum account</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" required value={form.firstName} onValueChange={set('firstName')} />
              <Input label="Last Name" required value={form.lastName} onValueChange={set('lastName')} />
            </div>
            <Input label="Username" required value={form.username} onValueChange={set('username')} />
            <Input label="Email" type="email" required value={form.email} onValueChange={set('email')} />
            <Input label="Password" type="password" required value={form.password} onValueChange={set('password')} />
            <Input label="Confirm Password" type="password" required value={form.passwordConf} onValueChange={set('passwordConf')} />
            <Button type="submit" color="primary" fullWidth isLoading={signup.isPending}>
              Create Account
            </Button>
            <p className="text-center text-sm text-default-500">
              Already have an account?{' '}
              <Link as={NextLink} href="/login" size="sm">Sign in</Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/login src/app/signup
git commit -m "feat: add login and signup pages (HeroUI + tRPC)"
```

---

## Task 15: User Dashboard Page

**Files:**
- Create: `src/app/user/page.tsx`

- [ ] **Step 1: Create `src/app/user/page.tsx`**

```tsx
'use client'

import { useSession } from 'next-auth/react'
import { Spinner, Card, CardBody } from '@heroui/react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, ResponsiveContainer,
} from 'recharts'
import { trpc } from '@/trpc/client'

const CATEGORY_COLORS: Record<string, string> = {
  business: '#339af0',
  sports: '#51cf66',
  health: '#ff6b6b',
  entertainment: '#cc5de8',
  science: '#20c997',
  technology: '#ffd43b',
}

const CATS = ['business', 'sports', 'health', 'entertainment', 'science', 'technology'] as const

export default function UserDashboard() {
  const { data: session } = useSession()
  const { data, isLoading } = trpc.metrics.stats.useQuery()

  const username = (session?.user as { username?: string })?.username ?? session?.user?.name ?? 'there'

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  const counts = data?.categoryToNumArticles ?? {}

  const radarData = CATS.map(cat => ({
    subject: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: counts[cat] ?? 0,
  }))

  const pieData = CATS.map(cat => ({
    name: cat,
    value: counts[cat] ?? 0,
  }))

  const radialData = CATS.map(cat => ({
    name: cat,
    value: counts[cat] ?? 0,
    fill: CATEGORY_COLORS[cat],
  }))

  const lineData = Array.from({ length: 7 }, (_, i) => {
    const week: Record<string, string | number> = { name: `Week ${i + 1}` }
    CATS.forEach(cat => {
      week[cat] = Math.floor(Math.random() * ((counts[cat] ?? 5) + 1))
    })
    return week
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Hi, {username}!</h1>
      <p className="text-default-500 mb-8">Here are your reading habits for the last week.</p>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardBody>
            <p className="font-semibold mb-4">Weekly Category Trends</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {CATS.map(cat => (
                  <Line key={cat} type="monotone" dataKey={cat} stroke={CATEGORY_COLORS[cat]} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <p className="font-semibold mb-4">Category Balance</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Radar name="Articles" dataKey="value" fill="#339af0" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="font-semibold mb-4">Category Proportion</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={Object.values(CATEGORY_COLORS)[i % 6]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="font-semibold mb-4">Articles Per Category</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart innerRadius="20%" outerRadius="100%" data={radialData} barSize={10}>
                  <RadialBar dataKey="value" label={{ position: 'insideStart', fill: '#fff' }} />
                  <Legend />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/user
git commit -m "feat: add user dashboard page with Recharts (tRPC)"
```

---

## Task 16: About Page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Create `src/app/about/page.tsx`**

```tsx
import Image from 'next/image'
import { Card, CardBody } from '@heroui/react'
import sources from '../../../public/VarietyOfSources.png'
import analytics from '../../../public/Analytics.png'
import categories from '../../../public/Categories.png'

const FEATURES = [
  { image: sources, alt: 'sources', title: 'Variety of Sources', description: 'Read from over 100 different sources and digest different perspectives.' },
  { image: analytics, alt: 'analytics', title: 'Analytics', description: 'Create an account and discover a personalized dashboard visualizing your reading habits.' },
  { image: categories, alt: 'categories', title: 'Categories', description: 'Widen your variety of news intake and draw from a range of categories.' },
]

const TEAM = [
  { name: 'Kevin Huynh', href: 'https://www.linkedin.com/in/kevinhuynh23/' },
  { name: 'Andrew Hwang', href: 'https://www.linkedin.com/in/andrewhwang10/' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-16">
        <h2 className="text-4xl font-bold mb-2">Widen your perspective.</h2>
        <h2 className="text-4xl font-bold text-default-500">Challenge your views.</h2>
      </div>

      <div className="bg-default-100 rounded-2xl p-10 mb-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Meet Spectrum</h2>
        <p className="text-default-600 max-w-2xl mx-auto leading-relaxed">
          Spectrum is a melting pot of different sources and types of news, all on one website.
          We challenge individuals to read from multiple sources and categories and encourage users
          to reflect on their personal reading habits. Our vision is to create a place where people
          can continuously develop a well-rounded understanding of current events in the world we live in.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6">What makes us different</h2>
      <div className="grid grid-cols-3 gap-6 mb-12">
        {FEATURES.map(({ image, alt, title, description }) => (
          <Card key={title}>
            <CardBody className="text-center">
              <div className="flex justify-center mb-4">
                <Image src={image} alt={alt} width={100} height={100} />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-default-500">{description}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Meet the team!</h2>
      <div className="grid grid-cols-2 gap-6">
        {TEAM.map(({ name, href }) => (
          <Card key={name}>
            <CardBody className="text-center py-8">
              <h3 className="font-semibold text-lg">
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                  {name}
                </a>
              </h3>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/about
git commit -m "feat: add about page (server component, HeroUI)"
```

---

## Task 17: Update `next-auth` Type Augmentation

**Files:**
- Modify: `src/types/next-auth.d.ts`

- [ ] **Step 1: Update the type declaration for Auth.js v5**

Replace the file contents with:

```ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      username: string
    }
  }
  interface User {
    username?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/next-auth.d.ts
git commit -m "chore: update next-auth type augmentation for v5"
```

---

## Task 18: Delete Old Code + Final Cleanup

**Files:**
- Delete: `src/pages/`, `src/common/apollo-client.ts`, `src/common/gql/`, `src/graphql/`, `src/modules/`, `src/common/components/elements/`, `src/styles/Home.module.css`
- Modify: `.gitignore` to add `.superpowers/`

- [ ] **Step 1: Delete Pages Router and old API layer**

```bash
rm -rf src/pages \
       src/common/apollo-client.ts \
       src/common/gql \
       src/graphql \
       src/modules \
       src/common/components/elements \
       src/styles/Home.module.css \
       src/pages/api/hello.ts 2>/dev/null || true
```

- [ ] **Step 2: Add `.superpowers/` to `.gitignore`**

Add this line to `.gitignore`:

```
.superpowers/
```

- [ ] **Step 3: Run the full test suite**

```bash
pnpm test
```

Expected output: all tests pass —
- `src/auth/__tests__/auth.test.ts` (4 tests)
- `src/lib/__tests__/bias.test.ts`
- `src/lib/__tests__/newsapi.test.ts`
- `src/lib/__tests__/schema.test.ts`
- `src/server/routers/__tests__/news.test.ts` (2 tests)

- [ ] **Step 4: Commit the deletions**

```bash
git add -A
git commit -m "chore: delete Pages Router, Mantine components, Apollo, and GraphQL layer"
```

---

## Task 19: Final Verification

- [ ] **Step 1: Run a production build**

```bash
pnpm build
```

Expected: build completes with no TypeScript errors. Note any warnings but don't block on them.

- [ ] **Step 2: Start the dev server and test the golden path**

```bash
pnpm dev
```

Open http://localhost:3000 and verify:

1. Home page loads — category tabs visible, news cards render with bias chips
2. Click a category tab — news feed updates
3. Click "Full Spectrum →" on a headline — full spectrum page loads with framing analysis
4. Navigate to /login — form renders, can sign in with existing credentials
5. Navigate to /signup — form renders, all 6 fields present
6. Navigate to /user — protected route redirects to /login if unauthenticated; loads dashboard with Recharts after sign in
7. Navigate to /about — page renders with feature cards and team section
8. Theme toggle in navbar — switches between dark and light, preference persists on refresh
9. Logout button — signs out and redirects to home

- [ ] **Step 3: Fix any TypeScript or build errors surfaced in steps 1–2 before proceeding**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete spectrum-next modernization (Next.js 15 + HeroUI + tRPC + Auth.js v5)"
```
