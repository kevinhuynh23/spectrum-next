import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { users, readingMetrics } from '../schema'
import { eq } from 'drizzle-orm'

describe('Database schema', () => {
  let db: ReturnType<typeof drizzle>
  let sqlite: Database.Database

  beforeAll(() => {
    sqlite = new Database(':memory:')
    db = drizzle(sqlite)
    sqlite.exec(`
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

  afterAll(() => sqlite.close())

  it('inserts and retrieves a user', () => {
    db.insert(users).values({
      email: 'test@example.com',
      passwordHash: 'hashed',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    }).run()

    const result = db.select().from(users).where(eq(users.email, 'test@example.com')).all()
    expect(result).toHaveLength(1)
    expect(result[0].username).toBe('testuser')
  })

  it('inserts and aggregates reading metrics', () => {
    const user = db.select().from(users).all()[0]
    db.insert(readingMetrics).values([
      { userId: user.id, category: 'technology', source: 'TechCrunch' },
      { userId: user.id, category: 'technology', source: 'Wired' },
      { userId: user.id, category: 'sports', source: 'ESPN' },
    ]).run()

    const techCount = db.select().from(readingMetrics)
      .where(eq(readingMetrics.userId, user.id))
      .all()
      .filter(m => m.category === 'technology').length

    expect(techCount).toBe(2)
  })
})
