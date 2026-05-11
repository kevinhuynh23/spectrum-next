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
