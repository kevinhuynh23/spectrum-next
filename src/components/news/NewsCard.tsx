'use client'

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
    <div className="mb-3 border border-default-200 rounded-lg shadow-sm bg-background">
      <div className="p-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground mb-1 block leading-snug hover:underline"
          onClick={() => onRead?.(category, article.source.name)}
        >
          {article.title}
        </a>
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
