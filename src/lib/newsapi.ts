export const VALID_CATEGORIES = [
  'headline',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology',
] as const

export type NewsCategory = (typeof VALID_CATEGORIES)[number]

export interface NewsArticle {
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  source: { id: string | null; name: string }
}

const BASE = 'https://newsapi.org/v2'

async function newsApiFetch(path: string): Promise<NewsArticle[]> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Api-Key': process.env.NEWSAPI_KEY! },
    // @ts-ignore: Next.js fetch extension for ISR revalidation
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`)
  const data = await res.json()
  return (data.articles ?? []).filter((a: NewsArticle) => a.title !== '[Removed]')
}

export async function fetchNewsByCategory(category: string): Promise<NewsArticle[]> {
  if (!VALID_CATEGORIES.includes(category as NewsCategory)) {
    throw new Error(`Invalid category: ${category}`)
  }
  if (category === 'headline') {
    return newsApiFetch('/top-headlines?country=us&pageSize=20')
  }
  return newsApiFetch(`/top-headlines?country=us&category=${category}&pageSize=20`)
}

export async function fetchSpectrum(title: string): Promise<NewsArticle[]> {
  const cleanTitle = title.replace(/ - [^-]+$/, '').trim()
  const encoded = encodeURIComponent(cleanTitle).replace(/%20/g, '+')
  return newsApiFetch(`/everything?q=${encoded}&sortBy=relevancy&pageSize=10&language=en`)
}
