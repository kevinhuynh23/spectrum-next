import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { readingMetrics } from '@/lib/schema'
import type { GraphQLContext } from '../context'

const METRIC_CATEGORIES = ['sports', 'health', 'business', 'entertainment', 'science', 'technology'] as const

export const metricsResolvers = {
  Query: {
    async metrics(_: unknown, __: unknown, ctx: GraphQLContext) {
      if (!ctx.userId) throw new Error('Not authenticated')
      const userId = Number(ctx.userId)
      const counts: Record<string, number> = {}
      for (const cat of METRIC_CATEGORIES) {
        counts[cat] = db.select().from(readingMetrics)
          .where(and(eq(readingMetrics.userId, userId), eq(readingMetrics.category, cat)))
          .all().length
      }
      return { categoryToNumArticles: counts }
    },
  },
  Mutation: {
    async trackRead(
      _: unknown,
      { category, source }: { category: string; source: string },
      ctx: GraphQLContext
    ) {
      if (!ctx.userId) return false
      db.insert(readingMetrics).values({ userId: Number(ctx.userId), category, source }).run()
      return true
    },
  },
}
