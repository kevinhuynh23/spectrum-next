import { router } from './trpc'
import { newsRouter } from './routers/news'
import { authRouter } from './routers/auth'
import { metricsRouter } from './routers/metrics'

export const appRouter = router({
  news: newsRouter,
  auth: authRouter,
  metrics: metricsRouter,
})

export type AppRouter = typeof appRouter
