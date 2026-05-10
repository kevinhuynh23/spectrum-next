import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/newsapi', () => ({
  fetchNewsByCategory: vi.fn().mockResolvedValue([
    {
      title: 'Test Article - Reuters',
      description: 'Test desc',
      url: 'https://example.com',
      urlToImage: null,
      publishedAt: '2024-01-01T00:00:00Z',
      source: { id: 'reuters', name: 'Reuters' },
    },
  ]),
  fetchSpectrum: vi.fn().mockResolvedValue([]),
  VALID_CATEGORIES: ['headline', 'technology'],
}))

vi.mock('@/lib/db', () => ({ db: {} }))
vi.mock('@/lib/schema', () => ({ users: {}, readingMetrics: {}, biasCache: {} }))

describe('News resolvers', () => {
  it('news query returns articles for a category', async () => {
    const { newsResolvers } = await import('../resolvers/news')
    const articles = await newsResolvers.Query.news(null, { category: 'headline' })
    expect(articles).toHaveLength(1)
    expect(articles[0].title).toBe('Test Article - Reuters')
  })

  it('news query defaults to headline when no category given', async () => {
    const { newsResolvers } = await import('../resolvers/news')
    const articles = await newsResolvers.Query.news(null, {})
    expect(articles).toHaveLength(1)
  })
})
