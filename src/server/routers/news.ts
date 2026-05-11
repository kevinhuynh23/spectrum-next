import { z } from 'zod'
import { fetchNewsByCategory, fetchSpectrum } from '@/lib/newsapi'
import { getBiasForSource, getFramingAnalysis } from '@/lib/bias'
import { publicProcedure, router } from '../trpc'

export const newsRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().default('headline') }))
    .query(async ({ input }) => {
      const articles = await fetchNewsByCategory(input.category)
      return articles.map(a => ({
        ...a,
        sourceBias: getBiasForSource(a.source.name) ?? null,
        framingAnalysis: null as string | null,
      }))
    }),

  spectrum: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ input }) => {
      const articles = await fetchSpectrum(input.title)
      return Promise.all(
        articles.map(async a => ({
          ...a,
          sourceBias: getBiasForSource(a.source.name) ?? null,
          framingAnalysis: (
            await getFramingAnalysis(a.url, a.title, a.description, a.source.name)
          ).framing,
        }))
      )
    }),
})
