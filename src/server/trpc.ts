import { initTRPC, TRPCError } from '@trpc/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth()
  return { db, session }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, session: ctx.session } })
})
