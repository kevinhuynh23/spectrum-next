import 'server-only'
import { createTRPCContext } from '@/server/trpc'
import { appRouter } from '@/server/root'
import { headers } from 'next/headers'

export async function getServerTRPC() {
  const h = await headers()
  return appRouter.createCaller(
    await createTRPCContext({ headers: h })
  )
}
