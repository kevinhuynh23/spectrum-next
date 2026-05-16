'use client'

import { useSession } from 'next-auth/react'
import { Spinner } from '@heroui/react'
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { trpc } from '@/trpc/client'

const CATS = ['business', 'sports', 'health', 'entertainment', 'technology', 'science'] as const
type Cat = typeof CATS[number]

const CAT_CONFIG: Record<Cat, { label: string; color: string }> = {
  business:      { label: 'Business',      color: '#339af0' },
  sports:        { label: 'Sports',        color: '#51cf66' },
  health:        { label: 'Health',        color: '#ff6b6b' },
  entertainment: { label: 'Entertainment', color: '#cc5de8' },
  technology:    { label: 'Technology',    color: '#ffd43b' },
  science:       { label: 'Science',       color: '#20c997' },
}

function getDiversityScore(counts: Record<string, number>): number {
  const active = CATS.filter(cat => (counts[cat] ?? 0) > 0).length
  return Math.round((active / 6) * 100 / 10) * 10
}

function getDiversityFeedback(score: number, counts: Record<string, number>): string {
  if (score === 100) return 'Reading all 6 categories — great balance!'
  const missing = CATS.filter(cat => !(counts[cat] ?? 0))
  return `Try branching into ${missing.map(c => CAT_CONFIG[c].label).join(' and ')} to broaden your reading.`
}

export default function UserDashboard() {
  const { data: session } = useSession()
  const { data, isLoading } = trpc.metrics.stats.useQuery()

  const username =
    (session?.user as { username?: string })?.username ?? session?.user?.name ?? 'there'

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  const counts = data?.categoryToNumArticles ?? {}
  const total = CATS.reduce((sum, cat) => sum + (counts[cat] ?? 0), 0)
  const diversityScore = getDiversityScore(counts)
  const diversityFeedback = getDiversityFeedback(diversityScore, counts)
  const ringDeg = (diversityScore / 100) * 360

  const barData = CATS.map(cat => ({
    name: CAT_CONFIG[cat].label,
    value: counts[cat] ?? 0,
    fill: CAT_CONFIG[cat].color,
  }))

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-extrabold mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', color: 'var(--color-text-primary)' }}
        >
          Hi, {username}.
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Your reading habits this week — {total} article{total !== 1 ? 's' : ''} across {CATS.filter(c => counts[c]).length} categories
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-6 gap-2.5 mb-7">
        {CATS.map(cat => (
          <div
            key={cat}
            className="rounded-lg p-3.5 relative overflow-hidden"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-lg"
              style={{ background: CAT_CONFIG[cat].color }}
            />
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {CAT_CONFIG[cat].label}
            </p>
            <p
              className="font-extrabold leading-none mb-1"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: 'var(--color-text-primary)' }}
            >
              {counts[cat] ?? 0}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>articles read</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>

        {/* Bar chart */}
        <div
          className="rounded-[10px] p-5"
          style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Reading by Category
          </p>
          <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>Articles read this week</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={92}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 6,
                }}
                labelStyle={{ color: '#f8fafc', fontSize: 12 }}
                itemStyle={{ color: '#94a3b8', fontSize: 11 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Diversity score */}
          <div
            className="rounded-[10px] p-5"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Reading Diversity Score
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Based on category spread</p>
            <div className="flex items-center gap-4">
              <div
                className="shrink-0"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `conic-gradient(#2563eb 0deg ${ringDeg}deg, #1e293b ${ringDeg}deg 360deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: '50%',
                    background: 'var(--color-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#f8fafc',
                  }}
                >
                  {diversityScore}
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {diversityFeedback}
              </p>
            </div>
          </div>

          {/* Bias distribution */}
          <div
            className="rounded-[10px] p-5"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Bias Distribution
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Sources read from {/* TODO: wire to real bias data from metrics API */}
            </p>
            <div className="flex h-2 rounded-full overflow-hidden mb-3">
              <div className="flex-[2]" style={{ background: '#2563eb' }} />
              <div className="flex-[3]" style={{ background: '#60a5fa' }} />
              <div className="flex-[3]" style={{ background: '#a855f7' }} />
              <div className="flex-[2]" style={{ background: '#f87171' }} />
              <div className="flex-1" style={{ background: '#dc2626' }} />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {[
                { color: '#2563eb', label: 'Left', pct: '18%' },
                { color: '#60a5fa', label: 'Ctr-Left', pct: '27%' },
                { color: '#a855f7', label: 'Center', pct: '27%' },
                { color: '#f87171', label: 'Ctr-Right', pct: '18%' },
                { color: '#dc2626', label: 'Right', pct: '9%' },
              ].map(({ color, label, pct }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    {label} ({pct})
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
