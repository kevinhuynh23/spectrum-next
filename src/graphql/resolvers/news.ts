import { fetchNewsByCategory, fetchSpectrum } from '@/lib/newsapi'

export const newsResolvers = {
  Query: {
    async news(_: unknown, { category = 'headline' }: { category?: string }) {
      const articles = await fetchNewsByCategory(category)
      return articles.map(a => ({ ...a, sourceBias: null, framingAnalysis: null }))
    },
    async spectrum(_: unknown, { title }: { title: string }) {
      const articles = await fetchSpectrum(title)
      return articles.map(a => ({ ...a, sourceBias: null, framingAnalysis: null }))
    },
  },
}
