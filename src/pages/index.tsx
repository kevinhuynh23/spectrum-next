import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Container, Title, Loader, Center, Alert } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { CategoryCarousel } from '@/modules/news/components/CategoryCarousel'
import { NewsCard } from '@/modules/news/components/NewsCard'
import { GET_NEWS } from '@/common/gql/queries'
import { TRACK_READ } from '@/common/gql/mutations'
import type { NewsArticle } from '@/lib/newsapi'

export default function HomePage() {
  const [category, setCategory] = useState('headline')
  const { data: session } = useSession()

  const { data, loading, error } = useQuery(GET_NEWS, {
    variables: { category },
    fetchPolicy: 'cache-first',
  })

  const [trackRead] = useMutation(TRACK_READ)

  function handleRead(cat: string, source: string) {
    if (!session?.user) return
    trackRead({ variables: { category: cat, source } })
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="md">Today&apos;s News</Title>
      <CategoryCarousel active={category} onChange={setCategory} />
      {loading && <Center><Loader /></Center>}
      {error && <Alert color="red">Failed to load news. Check your NEWSAPI_KEY.</Alert>}
      {(data?.news ?? []).map((article: NewsArticle, i: number) => (
        <NewsCard
          key={`${category}-${i}`}
          article={article}
          category={category}
          onRead={handleRead}
        />
      ))}
    </Container>
  )
}
