# Spectrum UI Redesign — Design Spec

**Goal:** Redesign the entire Spectrum app UI to an Editorial Dark aesthetic inspired by Bloomberg and The Guardian, with a Hero + Sidebar home layout, Left vs Right comparison Full Spectrum page, and a consolidated user dashboard.

**Architecture:** Tailwind-first, no new UI libraries. Google Fonts (Playfair Display + Inter) added to globals.css. CSS custom properties define the layer tokens; all components use Tailwind utility classes referencing them. The dark theme is the default; the theme toggle in the navbar is kept so users can still switch to light mode, but the light mode styles are not redesigned in this pass (light mode will look unchanged). All existing tRPC data wiring and Auth.js sessions remain unchanged — this is a pure visual overhaul.

**Tech Stack:** Next.js 15 App Router · Tailwind CSS v4 · HeroUI (kept for Spinner only) · Recharts (dashboard charts) · Google Fonts (Playfair Display 600/700/800, Inter 400/500/600/700)

---

## 1. Design System

### Color Tokens (CSS custom properties in globals.css)

| Token | Value | Usage |
|---|---|---|
| `--color-base` | `#020617` (slate-950) | Page background |
| `--color-card` | `#0f172a` (slate-900) | Card background, navbar |
| `--color-elevated` | `#1e293b` (slate-800) | Elevated surfaces, input backgrounds |
| `--color-border` | `#334155` (slate-700) | Borders, dividers |
| `--color-text-primary` | `#f8fafc` (slate-50) | Headlines, primary text |
| `--color-text-secondary` | `#cbd5e1` (slate-300) | Secondary text |
| `--color-text-muted` | `#64748b` (slate-500) | Metadata, labels, timestamps |
| `--color-accent` | `#2563eb` (blue-600) | Primary buttons, active states, links |
| `--color-accent-hover` | `#1d4ed8` (blue-700) | Button hover |
| `--color-breaking` | `#f97316` (orange-500) | Breaking news badge (future use) |

### Bias Color System

| Lean | Background tint | Text | Border |
|---|---|---|---|
| Left | `#1e3a8a22` | `#60a5fa` | `#1e3a8a` |
| Center-Left | `#1e40af22` | `#93c5fd` | `#1e40af55` |
| Center | `#4c1d9522` | `#c4b5fd` | `#4c1d9555` |
| Center-Right | `#7f1d1d22` | `#fca5a5` | `#7f1d1d55` |
| Right | `#7f1d1d33` | `#f87171` | `#991b1b` |

Bias chips use `inline-flex`, `rounded-full`, `px-2 py-0.5`, `text-xs font-bold`.

Lean panel headers on the Full Spectrum page use a stronger tint (`18` alpha) with a colored top border.

### Typography

| Role | Font | Weight | Size | Usage |
|---|---|---|---|---|
| Hero headline | Playfair Display | 800 | 22–36px | Hero card title |
| Section heading | Playfair Display | 700 | 13px uppercase | "Today's Headlines", dashboard section labels |
| Card title | Playfair Display | 600–700 | 13–15px | All news card titles |
| Body | Inter | 400 | 14px | Article descriptions |
| Metadata | Inter | 500 | 11–12px | Source, timestamp |
| CTA / label | Inter | 700 | 11–13px | "FULL SPECTRUM →", button text, uppercase labels |

---

## 2. Shared Components

### Navbar (`src/components/layout/NavbarClient.tsx`)

Two-part structure: a sticky top bar + a separate category bar below it (on the home page only).

**Top bar:**
- Height: `h-15` (60px), `bg-[--color-card]`, `border-b border-[--color-border]`
- Left: "Spectrum" wordmark — Playfair Display 800, 22px
- Center: `Home` and `About` nav links — Inter 500, `text-[--color-text-muted]`, hover to `text-[--color-text-primary]`
- Right: theme toggle icon button (32×32, `bg-[--color-elevated]`, rounded-md) · Login ghost button · Sign Up primary button
- When authenticated: avatar circle (initials, gradient bg) + username + Logout ghost button

**Category bar (`src/components/news/CategoryTabs.tsx`):**
- `bg-[--color-card]`, `border-b border-[--color-border]`
- Tabs: `px-4 py-2.5`, `text-sm`, `border-b-2`
- Active: `border-[--color-accent] text-[--color-text-primary] font-semibold`
- Inactive: `border-transparent text-[--color-text-muted] hover:text-[--color-text-secondary]`

### BiasChip (`src/components/news/BiasChip.tsx`)

Replace current implementation with the 5-color token system from the design system table. Shape: `rounded-full px-2 py-0.5 text-xs font-bold`. Rendered overlaid on card images at `bottom-2 left-2.5` using absolute positioning.

### NewsCard (`src/components/news/NewsCard.tsx`)

Two variants driven by a `variant` prop:

**`hero`** — used for the first article on the home page:
- Full-width card, image header 240px tall
- Image from `article.urlToImage`; fallback: gradient using the article's bias lean color
- Gradient overlay (`from-[--color-card]/95 to-transparent`) over bottom half of image
- BiasChip overlaid bottom-left of image
- Body: Playfair Display 800 title (22px), Inter description (14px), source + timestamp + "FULL SPECTRUM →" link

**`sidebar`** — used for the 3 right-column cards:
- Image header 80px tall, same image/fallback/overlay/chip pattern
- Body: Playfair Display 700 title (14px), source + timestamp, optional "SPECTRUM →" link

**`small`** — used for the 3-card bottom row:
- Image header 100px tall
- Body: Playfair Display 700 title (13px), source + timestamp, optional "SPECTRUM →" link

All variants share: `bg-[--color-card] border border-[--color-border] rounded-[10px] overflow-hidden`.

---

## 3. Home Page (`src/app/page.tsx`)

Layout:
```
[Navbar]
[Category bar]
[main: max-w-screen-xl px-6 py-7]
  [Section label: "Today's Headlines"]
  [Top grid: 1.75fr / 1fr gap-4]
    [HeroCard]     [Sidebar: 3 × SidebarCard stacked with gap-2.5]
  [Bottom grid: 3 cols gap-3]
    [SmallCard] [SmallCard] [SmallCard]
```

Data: `trpc.news.list.useQuery({ category })` returns up to 10 articles. Map:
- `articles[0]` → `hero` variant
- `articles[1..3]` → `sidebar` variant (3 cards)
- `articles[4..6]` → `small` variant (3 cards)
- `articles[7+]` → omitted from the structured layout (can add a "more stories" plain list below if desired — out of scope for this redesign)

Category switching re-runs the query; all layout slots rehydrate with the new data.

`handleRead` tracking is unchanged.

---

## 4. Full Spectrum Page (`src/app/fullspectrum/[title]/page.tsx`)

Layout:
```
[Navbar (back link variant)]
[main: max-w-screen-xl px-6 py-8]
  [Story header: label + Playfair title + meta line]
  [Spectrum gradient bar + lean labels]
  [Framing summary box]
  [Comparison grid: 1fr / 1fr gap-4]
    [Left panel]   [Right panel]
  [Center panel: full width]
```

**Framing summary box:** `bg-[--color-card] border border-[--color-border] rounded-[10px] p-4 flex gap-3`. Shows the GPT-4o-mini high-level framing summary for the whole story. If no framing data, omit the box entirely.

**Left panel** (`lean-panel`): Groups articles where `sourceBias` is `Left` or `Center-Left`.
- Colored top border (left lean blue)
- Header: colored dot + "Left & Center-Left" label + article count
- Narrative stance: bold serif quote derived from the most common framing theme
- Framing description: italic Inter 12px, `text-[--color-text-muted]`
- Article rows: 52×44px thumbnail (from `urlToImage`, bias-gradient fallback) + title + source

**Right panel**: Same structure for `Center-Right` and `Right` articles, red color tokens.

**Center panel**: Full-width below the two panels. `bg-[--color-card] border border-[#4c1d9555] rounded-[10px]`. Purple header. Two-column grid of `Center` articles inside.

**Grouping logic:** Articles from `trpc.news.spectrum.useQuery()` are already returned with `sourceBias`. Client-side: filter into `left` (Left + Center-Left), `right` (Center-Right + Right), `center` (Center) arrays before rendering.

**Narrative stance:** Use the first article's `framingAnalysis` value as the panel's stance quote. If unavailable, use a static fallback per lean ("Emphasizes urgency and scale" / "Highlights economic concerns" / "Neutral factual reporting").

---

## 5. User Dashboard (`src/app/user/page.tsx`)

Layout:
```
[Navbar (authenticated variant)]
[main: max-w-screen-xl px-6 py-8]
  [Header: "Hi, {username}." + subtitle with total count]
  [Stat grid: 6 cols, one card per category]
  [Charts grid: 1.4fr / 1fr gap-4]
    [Category bar chart]    [Diversity score + Bias distribution stacked]
```

**Stat cards (6):** One per `METRIC_CATEGORIES`. Each: `bg-[--color-card] border border-[--color-border] rounded-lg p-3.5`, 3px color accent bar at top (`rounded-t-lg`), category label (Inter 700 10px uppercase), article count (Playfair Display 800 26px), "articles read" sub-label (Inter 10px muted).

Category accent colors:
- business: `#339af0` · sports: `#51cf66` · health: `#ff6b6b`
- entertainment: `#cc5de8` · technology: `#ffd43b` · science: `#20c997`

**Category bar chart (Recharts):** Replace `LineChart` with a horizontal `BarChart`. One bar per category, color-matched to the accent above. `ResponsiveContainer width="100%" height={280}`. Remove the fake random `lineData` — use actual `counts` from `trpc.metrics.stats`.

**Reading Diversity Score:** Replace `RadarChart` with a circular progress ring built in plain SVG/CSS (`conic-gradient`). Score = `(number of categories with ≥1 article / 6) * 100`, rounded to nearest 10. Show numeric score in the ring center, plain-English feedback below ("Reading all 6 categories — great balance!" / "Try reading more Science and Sports").

**Bias Distribution:** Replace `RadialBarChart` with a single proportional horizontal bar (`flex` div with colored segments). Legend below with dots + percentages. Data: count articles per lean from `trpc.metrics.stats` response (currently the API only returns category counts — bias distribution can be a static placeholder or deferred; mark as `// TODO: wire to real bias data` in code).

**Remove:** `PieChart`, `RadarChart`, `RadialBarChart`, random `lineData` generation. Keep only `BarChart` from Recharts.

---

## 6. About Page (`src/app/about/page.tsx`)

Convert from `'use client'` to a server component (no client hooks needed).

Layout:
```
[Hero section: dark gradient bg, centered, tagline in Playfair Display 800 40px]
[Features section: 3-col grid of elevated cards with icon + serif title + description]
[Team section: 2-col grid, avatar circle + name + LinkedIn link]
```

**Hero:** `bg-gradient-to-br from-[--color-base] via-[--color-card] to-[--color-elevated]` with a subtle `radial-gradient` blue glow overlay. Eyebrow label "About Spectrum" in `text-[--color-accent]` uppercase. Two-line tagline: "Widen your perspective." in `text-[--color-text-primary]`, "Challenge your views." in `text-[--color-border]` (muted slate).

**Feature cards:** `bg-[--color-elevated] rounded-[10px] p-6`. Icon in a 40×40 colored rounded square (matching the feature's accent). Playfair 700 title. Inter 400 description.

**Team cards:** `bg-[--color-elevated] rounded-[10px] p-5 flex items-center gap-3.5`. Avatar: 44×44 circle with initials, gradient background unique per person. Name in Playfair 700, LinkedIn in `text-[--color-accent] text-xs`.

Remove: `next/image` imports of the three PNG screenshots (VarietyOfSources, Analytics, Categories) — replaced by icon-based feature cards.

---

## 7. Auth Pages

### Login (`src/app/login/page.tsx`)

Centered layout: `min-h-screen flex items-center justify-center bg-[--color-base]`. Inner card: `bg-[--color-card] border border-[--color-border] rounded-xl p-10 w-full max-w-sm`.

- Heading: Playfair Display 800, "Welcome back."
- Subheading: Inter 400 muted, "Sign in to your Spectrum account"
- Fields: username + password. Label: Inter 700 11px uppercase muted. Input: `bg-[--color-elevated] border border-[--color-border] rounded-md px-3.5 py-2.5 text-sm text-[--color-text-primary] w-full`.
- Submit: full-width `bg-[--color-accent] text-white font-semibold rounded-md py-2.5`
- Footer: "Don't have an account? Sign up" link

### Signup (`src/app/signup/page.tsx`)

Same layout as login. Heading: "Join Spectrum." Fields: username + email + password. Submit: "Create Account".

---

## 8. Files to Change

| File | Change |
|---|---|
| `src/styles/globals.css` | Add Google Fonts import, define CSS custom properties for all color tokens |
| `src/components/layout/NavbarClient.tsx` | Full rewrite to new design |
| `src/components/news/CategoryTabs.tsx` | Update tab styles (already correct structure) |
| `src/components/news/NewsCard.tsx` | Add `variant` prop (`hero`/`sidebar`/`small`), image support, overlay, refactored layout |
| `src/components/news/BiasChip.tsx` | Update to new 5-color token system |
| `src/app/page.tsx` | Update layout to Hero + Sidebar + bottom row grid, pass `variant` to NewsCard |
| `src/app/fullspectrum/[title]/page.tsx` | Full rewrite to Left vs Right comparison layout |
| `src/app/user/page.tsx` | Replace 4 charts with stat cards + bar chart + diversity score + bias bar |
| `src/app/about/page.tsx` | Rewrite hero + feature cards + team cards, remove PNG imports |
| `src/app/login/page.tsx` | Rewrite to centered card layout |
| `src/app/signup/page.tsx` | Rewrite to centered card layout |
