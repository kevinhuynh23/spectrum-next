import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { Container, Title, Text, Loader, Center, Alert, Divider, Box } from '@mantine/core'
import { NewsCard } from '@/modules/news/components/NewsCard'
import { GET_SPECTRUM } from '@/common/gql/queries'
import type { NewsArticle } from '@/lib/newsapi'

export default function FullSpectrumPage() {
  const { query } = useRouter()
  const title = decodeURIComponent((query.title as string) ?? '')

  const { data, loading, error } = useQuery(GET_SPECTRUM, {
    variables: { title },
    skip: !title,
  })

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb={4}>Full Spectrum Coverage</Title>
      <Text color="dimmed" mb="lg">&ldquo;{title}&rdquo;</Text>
      <Divider mb="lg" />

      {loading && <Center><Loader /></Center>}
      {error && <Alert color="red">Failed to load spectrum coverage.</Alert>}
      {data?.spectrum?.length === 0 && (
        <Text color="dimmed">No additional coverage found for this story.</Text>
      )}
      {(data?.spectrum ?? []).map((article: NewsArticle & { sourceBias?: string | null; framingAnalysis?: string | null }, i: number) => (
        <Box key={i} mb="md">
          <NewsCard article={article} category="spectrum" showSource />
        </Box>
      ))}
    </Container>
  )
}
