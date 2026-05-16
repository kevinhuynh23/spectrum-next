'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Spinner } from '@heroui/react'
import { trpc } from '@/trpc/client'
import type { NewsArticle } from '@/lib/newsapi'

type Article = NewsArticle & { sourceBias?: string | null; framingAnalysis?: string | null }

const LEAN_GRADIENTS: Record<string, string> = {
  Left: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
  'Center-Left': 'linear-gradient(135deg, #172554, #3b82f6)',
  Center: 'linear-gradient(135deg, #3b0764, #7c3aed)',
  'Center-Right': 'linear-gradient(135deg, #450a0a, #f87171)',
  Right: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
}

function thumbBg(article: Article): React.CSSProperties {
  if (article.urlToImage) {
    return {
      backgroundImage: `url(${article.urlToImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  const lean = article.sourceBias
  return { background: lean ? (LEAN_GRADIENTS[lean] ?? '#1e293b') : '#1e293b' }
}

interface LeanPanelProps {
  articles: Article[]
  label: string
  stance: string
  dotColor: string
  headerBg: string
  panelBorder: string
  textColor: string
}

function LeanPanel({ articles, label, stance, dotColor, headerBg, panelBorder, textColor }: LeanPanelProps) {
  return (
    <div
      className="rounded-[10px] overflow-hidden"
      style={{ background: 'var(--color-card)', border: `1px solid ${panelBorder}` }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ background: headerBg, borderBottom: `1px solid ${panelBorder}44` }}
      >
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dotColor }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: textColor }}>
          {label}
        </span>
        <span className="ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {articles.length} source{articles.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="p-5">
        <p
          className="text-sm font-bold leading-snug mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: textColor }}
        >
          &ldquo;{stance}&rdquo;
        </p>
        <div>
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 py-2.5 hover:opacity-80 transition-opacity"
              style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : 'none' }}
            >
              <div
                className="w-[52px] h-[44px] rounded-md shrink-0"
                style={thumbBg(article)}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold leading-snug mb-1 line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-text-primary)' }}
                >
                  {article.title}
                </p>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {article.source.name}
                </span>
              </div>
            </a>
          ))}
          {articles.length === 0 && (
            <p className="text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
              No {label.toLowerCase()} coverage found.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FullSpectrumPage() {
  const params = useParams()
  const title = decodeURIComponent((params.title as string) ?? '')

  const { data, isLoading, isError } = trpc.news.spectrum.useQuery(
    { title },
    { enabled: !!title }
  )

  const articles: Article[] = data ?? []
  const left = articles.filter(a => a.sourceBias === 'Left' || a.sourceBias === 'Center-Left')
  const right = articles.filter(a => a.sourceBias === 'Center-Right' || a.sourceBias === 'Right')
  const center = articles.filter(a => a.sourceBias === 'Center')

  const leftStance = left[0]?.framingAnalysis ?? 'Emphasizes urgency and scale of the issue.'
  const rightStance = right[0]?.framingAnalysis ?? 'Highlights economic concerns and policy implications.'
  const hasFraming = !!(left[0]?.framingAnalysis || right[0]?.framingAnalysis)

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-8">
      <Link href="/" className="text-sm mb-6 inline-block" style={{ color: 'var(--color-accent)' }}>
        ← Back to Headlines
      </Link>

      {/* Story header */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Full Spectrum Coverage
        </p>
        <h1
          className="font-extrabold leading-tight mb-2"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '26px',
            color: 'var(--color-text-primary)',
            maxWidth: '720px',
          }}
        >
          {title}
        </h1>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {articles.length} sources · Bias ratings by AllSides · Framing by GPT-4o-mini
        </p>
      </div>

      {/* Spectrum gradient bar */}
      <div className="mb-7">
        <div className="flex h-1.5 rounded-full overflow-hidden mb-1.5">
          <div className="flex-1" style={{ background: '#2563eb' }} />
          <div className="flex-1" style={{ background: '#60a5fa' }} />
          <div className="flex-1" style={{ background: '#a855f7' }} />
          <div className="flex-1" style={{ background: '#f87171' }} />
          <div className="flex-1" style={{ background: '#dc2626' }} />
        </div>
        <div className="flex justify-between">
          <span className="text-xs font-semibold" style={{ color: '#60a5fa' }}>Left</span>
          <span className="text-xs font-semibold" style={{ color: '#c4b5fd' }}>Center</span>
          <span className="text-xs font-semibold" style={{ color: '#f87171' }}>Right</span>
        </div>
      </div>

      {/* Framing summary */}
      {hasFraming && (
        <div
          className="flex gap-3 p-4 rounded-[10px] mb-7"
          style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
        >
          <span className="text-lg shrink-0">🔍</span>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              How this story is being framed:{' '}
            </span>
            {left[0]?.framingAnalysis && (
              <span>Left-leaning sources: {left[0].framingAnalysis}. </span>
            )}
            {right[0]?.framingAnalysis && (
              <span>Right-leaning sources: {right[0].framingAnalysis}.</span>
            )}
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}
      {isError && (
        <p className="text-sm text-center py-8" style={{ color: '#f87171' }}>
          Failed to load spectrum coverage.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {/* Left vs Right */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <LeanPanel
              articles={left}
              label="Left & Center-Left"
              stance={leftStance}
              dotColor="#2563eb"
              headerBg="#1e3a8a18"
              panelBorder="#1e3a8a"
              textColor="#60a5fa"
            />
            <LeanPanel
              articles={right}
              label="Right & Center-Right"
              stance={rightStance}
              dotColor="#dc2626"
              headerBg="#7f1d1d18"
              panelBorder="#991b1b"
              textColor="#f87171"
            />
          </div>

          {/* Center panel */}
          {center.length > 0 && (
            <div
              className="rounded-[10px] overflow-hidden"
              style={{ background: 'var(--color-card)', border: '1px solid #4c1d9555' }}
            >
              <div
                className="flex items-center gap-2.5 px-5 py-3.5"
                style={{ background: '#1e0a4418', borderBottom: '1px solid #4c1d9533' }}
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#a855f7' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c4b5fd' }}>
                  Center
                </span>
                <span className="ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {center.length} source{center.length !== 1 ? 's' : ''} · Neutral reporting
                </span>
              </div>
              <div className="grid grid-cols-2">
                {center.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 block hover:opacity-80 transition-opacity"
                    style={{
                      borderRight: i % 2 === 0 ? '1px solid var(--color-border)' : 'none',
                      borderBottom: i < center.length - 2 ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    <div className="w-full h-14 rounded-md mb-2.5" style={thumbBg(article)} />
                    <p
                      className="text-sm font-bold leading-snug mb-1.5 line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-text-primary)' }}
                    >
                      {article.title}
                    </p>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {article.source.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {articles.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              No additional coverage found for this story.
            </p>
          )}
        </>
      )}
    </main>
  )
}
