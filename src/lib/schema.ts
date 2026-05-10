import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  username: text('username').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const readingMetrics = sqliteTable('reading_metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  category: text('category').notNull(),
  source: text('source').notNull(),
  readAt: text('read_at').default(sql`CURRENT_TIMESTAMP`),
})

export const biasCache = sqliteTable('bias_cache', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  articleUrl: text('article_url').notNull().unique(),
  lean: text('lean'),
  framing: text('framing').notNull(),
  analyzedAt: text('analyzed_at').default(sql`CURRENT_TIMESTAMP`),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type ReadingMetric = typeof readingMetrics.$inferSelect
export type BiasCache = typeof biasCache.$inferSelect
export type NewBiasCache = typeof biasCache.$inferInsert
