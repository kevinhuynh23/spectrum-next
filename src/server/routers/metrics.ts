import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { readingMetrics } from '@/lib/schema'
import { protectedProcedure, router } from '../trpc'

const METRIC_CATEGORIES = ['sports', 'health', 'business', 'entertainment', 'science', 'technology'] as const

export const metricsRouter = router({
  trackRead: protectedProcedure
    .input(z.object({ category: z.enum(METRIC_CATEGORIES), source: z.string().max(100) }))
    .mutation(async ({ input, ctx }) => {
      const userId = Number(ctx.session.user.id)
      await ctx.db.insert(readingMetrics).values({ userId, category: input.category, source: input.source })
      return true
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const userId = Number(ctx.session.user.id)
    const counts: Record<string, number> = {}
    for (const cat of METRIC_CATEGORIES) {
      const result = await ctx.db
        .select()
        .from(readingMetrics)
        .where(and(eq(readingMetrics.userId, userId), eq(readingMetrics.category, cat)))
        .all()
      counts[cat] = result.length
    }
    return { categoryToNumArticles: counts }
  }),
})
