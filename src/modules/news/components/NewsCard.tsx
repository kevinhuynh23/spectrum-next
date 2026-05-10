import { Card, Text, Badge, Group, Anchor, Stack } from '@mantine/core'
import Link from 'next/link'
import type { NewsArticle } from '@/lib/newsapi'

interface Props {
  article: NewsArticle & { sourceBias?: string | null; framingAnalysis?: string | null }
  category: string
  showSource?: boolean
  onRead?: (category: string, source: string) => void
}

export function NewsCard({ article, category, showSource = false, onRead }: Props) {
  const handleClick = () => onRead?.(category, article.source.name)

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="sm">
      <Group align="flex-start" noWrap>
        <Stack spacing={4} style={{ flex: 1 }}>
          <Anchor
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            weight={600}
            onClick={handleClick}
          >
            {article.title}
          </Anchor>
          {showSource && <Badge size="xs">{article.source.name}</Badge>}
          {article.description && (
            <Text size="sm" color="dimmed" lineClamp={2}>
              {article.description}
            </Text>
          )}
          <Group position="apart">
            <Text size="xs" color="dimmed">{formatAgo(article.publishedAt)}</Text>
            {category === 'headline' && (
              <Link href={`/fullspectrum/${encodeURIComponent(article.title)}`}>
                <Text size="xs" color="blue" component="span">Full Spectrum →</Text>
              </Link>
            )}
          </Group>
        </Stack>
      </Group>
    </Card>
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
