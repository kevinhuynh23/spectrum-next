'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Spinner } from '@heroui/react'
import { CategoryTabs } from '@/components/news/CategoryTabs'
import { NewsCard } from '@/components/news/NewsCard'
import { trpc } from '@/trpc/client'
import type { NewsArticle } from '@/lib/newsapi'

type Article = NewsArticle & { sourceBias?: string | null }

export default function HomePage() {
  const [category, setCategory] = useState('headline')
  const { data: session } = useSession()
  const { data, isLoading, isError } = trpc.news.list.useQuery({ category })
  const trackRead = trpc.metrics.trackRead.useMutation()

  function handleRead(cat: string, source: string) {
    if (!session?.user || cat === 'headline') return
    trackRead.mutate({
      category: cat as 'sports' | 'health' | 'business' | 'entertainment' | 'science' | 'technology',
      source,
    })
  }

  const articles: Article[] = data ?? []
  const hero = articles[0]
  const sidebar = articles.slice(1, 4)
  const bottom = articles.slice(4, 7)

  const sectionLabel =
    category === 'headline'
      ? "Today's Headlines"
      : category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <>
      <CategoryTabs active={category} onChange={setCategory} />
      <main className="max-w-screen-xl mx-auto px-6 py-7">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--color-text-muted)' }}
        >
          {sectionLabel}
        </p>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}
        {isError && (
          <p className="text-sm text-center py-8" style={{ color: '#f87171' }}>
            Failed to load news. Check your NEWSAPI_KEY.
          </p>
        )}

        {!isLoading && !isError && hero && (
          <>
            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1.75fr 1fr' }}>
              <NewsCard
                article={hero}
                category={category}
                variant="hero"
                onRead={handleRead}
              />
              <div className="flex flex-col gap-2.5">
                {sidebar.map((article, i) => (
                  <NewsCard
                    key={`sidebar-${i}`}
                    article={article}
                    category={category}
                    variant="sidebar"
                    onRead={handleRead}
                  />
                ))}
              </div>
            </div>

            {bottom.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {bottom.map((article, i) => (
                  <NewsCard
                    key={`small-${i}`}
                    article={article}
                    category={category}
                    variant="small"
                    onRead={handleRead}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
