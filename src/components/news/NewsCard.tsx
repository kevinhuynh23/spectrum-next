'use client'

import NextLink from 'next/link'
import { BiasChip } from './BiasChip'
import type { NewsArticle } from '@/lib/newsapi'

type Variant = 'hero' | 'sidebar' | 'small'

interface Props {
  article: NewsArticle & { sourceBias?: string | null; framingAnalysis?: string | null }
  category: string
  variant?: Variant
  onRead?: (category: string, source: string) => void
}

const IMAGE_HEIGHTS: Record<Variant, string> = {
  hero: '240px',
  sidebar: '80px',
  small: '100px',
}

const LEAN_GRADIENTS: Record<string, string> = {
  Left: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
  'Center-Left': 'linear-gradient(135deg, #172554, #3b82f6)',
  Center: 'linear-gradient(135deg, #3b0764, #7c3aed)',
  'Center-Right': 'linear-gradient(135deg, #450a0a, #f87171)',
  Right: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
}

function imageBg(urlToImage: string | null, lean?: string | null): React.CSSProperties {
  if (urlToImage) {
    return { backgroundImage: `url(${urlToImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return {
    background: lean
      ? (LEAN_GRADIENTS[lean] ?? 'linear-gradient(135deg, #1e293b, #334155)')
      : 'linear-gradient(135deg, #1e293b, #334155)',
  }
}

export function NewsCard({ article, category, variant = 'small', onRead }: Props) {
  const isHeadline = category === 'headline'
  const lean = article.sourceBias

  return (
    <div
      className="overflow-hidden rounded-[10px]"
      style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
    >
      {/* Image header */}
      <div
        className="relative"
        style={{ height: IMAGE_HEIGHTS[variant], ...imageBg(article.urlToImage, lean) }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)' }}
        />
        {lean && (
          <div className="absolute bottom-2 left-2.5">
            <BiasChip lean={lean} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className={variant === 'hero' ? 'p-5' : 'p-3'}>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onRead?.(category, article.source.name)}
          className="block mb-2 leading-snug hover:underline"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: variant === 'hero' ? '800' : '700',
            fontSize: variant === 'hero' ? '22px' : variant === 'sidebar' ? '14px' : '13px',
            color: 'var(--color-text-primary)',
          }}
        >
          {article.title}
        </a>

        {variant === 'hero' && article.description && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
            {article.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
            {article.source.name} · {formatAgo(article.publishedAt)}
          </span>
          {isHeadline && (
            <NextLink
              href={`/fullspectrum/${encodeURIComponent(article.title)}`}
              className="text-xs font-bold tracking-wide shrink-0"
              style={{ color: 'var(--color-accent)' }}
            >
              FULL SPECTRUM →
            </NextLink>
          )}
        </div>
      </div>
    </div>
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
