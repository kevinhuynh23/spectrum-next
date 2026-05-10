import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import type { GraphQLContext } from '../context'

export const authResolvers = {
  Query: {
    async me(_: unknown, __: unknown, ctx: GraphQLContext) {
      if (!ctx.userId) return null
      const [user] = db.select().from(users).where(eq(users.id, Number(ctx.userId))).all()
      return user ?? null
    },
  },
  Mutation: {
    async signup(
      _: unknown,
      {
        email, password, passwordConf, username, firstName, lastName,
      }: {
        email: string; password: string; passwordConf: string
        username: string; firstName: string; lastName: string
      }
    ) {
      if (password !== passwordConf) throw new Error('Passwords do not match')
      const existing = db.select().from(users).where(eq(users.email, email)).all()
      if (existing.length > 0) throw new Error('Email already in use')
      const passwordHash = await bcrypt.hash(password, 10)
      const result = db.insert(users).values({ email, passwordHash, username, firstName, lastName }).run()
      const [newUser] = db.select().from(users).where(eq(users.id, Number(result.lastInsertRowid as number | bigint))).all()
      return newUser
    },
  },
}
