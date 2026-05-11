import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users } from '@/lib/schema'
import { publicProcedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        passwordConf: z.string(),
        username: z.string().min(3),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.passwordConf) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Passwords do not match' })
      }
      const existing = ctx.db.select().from(users).where(eq(users.email, input.email)).all()
      if (existing.length > 0) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Registration failed. Please try again.' })
      }
      const passwordHash = await bcrypt.hash(input.password, 10)
      const result = ctx.db
        .insert(users)
        .values({
          email: input.email,
          passwordHash,
          username: input.username,
          firstName: input.firstName,
          lastName: input.lastName,
        })
        .run()
      const [newUser] = ctx.db
        .select()
        .from(users)
        .where(eq(users.id, Number(result.lastInsertRowid)))
        .all()
      return newUser
    }),
})
