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
}))

vi.mock('@/lib/bias', () => ({
  getBiasForSource: vi.fn().mockReturnValue('Center'),
  getFramingAnalysis: vi.fn().mockResolvedValue({ framing: 'Neutral tone' }),
}))

vi.mock('@/lib/db', () => ({ db: {} }))
vi.mock('@/lib/schema', () => ({ users: {}, readingMetrics: {}, biasCache: {} }))
vi.mock('@/auth', () => ({ auth: vi.fn().mockResolvedValue(null) }))

describe('news router', () => {
  it('news.list returns articles with bias attached', async () => {
    const { newsRouter } = await import('../news')
    const caller = newsRouter.createCaller({ db: {} as any, session: null })
    const articles = await caller.list({ category: 'headline' })
    expect(articles).toHaveLength(1)
    expect(articles[0].title).toBe('Test Article - Reuters')
    expect(articles[0].sourceBias).toBe('Center')
  })

  it('news.list defaults to headline when no category given', async () => {
    const { newsRouter } = await import('../news')
    const caller = newsRouter.createCaller({ db: {} as any, session: null })
    const articles = await caller.list({})
    expect(articles).toHaveLength(1)
  })
})
