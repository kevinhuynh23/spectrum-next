import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient, type Client } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { users, readingMetrics } from '../schema'
import * as schema from '../schema'
import { eq } from 'drizzle-orm'

describe('Database schema', () => {
  let client: Client
  let db: ReturnType<typeof drizzle>

  beforeAll(async () => {
    client = createClient({ url: ':memory:' })
    db = drizzle(client, { schema })
    await client.executeMultiple(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE reading_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        category TEXT NOT NULL,
        source TEXT NOT NULL,
        read_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)
  })

  afterAll(() => client.close())

  it('inserts and retrieves a user', async () => {
    await db.insert(users).values({
      email: 'test@example.com',
      passwordHash: 'hashed',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    })

    const result = await db.select().from(users).where(eq(users.email, 'test@example.com'))
    expect(result).toHaveLength(1)
    expect(result[0].username).toBe('testuser')
  })

  it('inserts and aggregates reading metrics', async () => {
    const allUsers = await db.select().from(users)
    const user = allUsers[0]

    await db.insert(readingMetrics).values([
      { userId: user.id, category: 'technology', source: 'TechCrunch' },
      { userId: user.id, category: 'technology', source: 'Wired' },
      { userId: user.id, category: 'sports', source: 'ESPN' },
    ])

    const allMetrics = await db.select().from(readingMetrics)
      .where(eq(readingMetrics.userId, user.id!))
    const techCount = allMetrics.filter(m => m.category === 'technology').length

    expect(techCount).toBe(2)
  })
})
