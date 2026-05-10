import { fetchNewsByCategory, fetchSpectrum } from '@/lib/newsapi'
import { getBiasForSource, getFramingAnalysis } from '@/lib/bias'

export const newsResolvers = {
  Query: {
    async news(_: unknown, { category = 'headline' }: { category?: string }) {
      const articles = await fetchNewsByCategory(category)
      return articles.map(a => ({
        ...a,
        sourceBias: getBiasForSource(a.source.name) ?? null,
        framingAnalysis: null,
      }))
    },
    async spectrum(_: unknown, { title }: { title: string }) {
      const articles = await fetchSpectrum(title)
      const analyzed = await Promise.all(
        articles.map(async a => ({
          ...a,
          sourceBias: getBiasForSource(a.source.name) ?? null,
          framingAnalysis: (
            await getFramingAnalysis(a.url, a.title, a.description, a.source.name)
          ).framing,
        }))
      )
      return analyzed
    },
  },
}
