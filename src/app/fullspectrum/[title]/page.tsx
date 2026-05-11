'use client'

import { useParams } from 'next/navigation'
import { Spinner } from '@heroui/react'
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
      <hr className="mb-4 border-default-200" />

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
