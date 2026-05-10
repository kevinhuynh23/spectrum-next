import { describe, it, expect } from 'vitest'
import bcrypt from 'bcryptjs'
import { authorizeUser } from '@/lib/auth-utils'

// ---------------------------------------------------------------------------
// Minimal stub types for the injected db / users parameters
// ---------------------------------------------------------------------------
type FakeUser = {
  id: number
  email: string
  username: string
  passwordHash: string
}

function makeDb(rows: FakeUser[]) {
  return {
    select: () => ({
      from: () => ({
        where: () => ({
          all: () => rows,
        }),
      }),
    }),
  } as any
}

// A minimal users table stub — only the shape matters for the eq() call inside
// authorizeUser; since we're injecting a fake db that ignores the where clause
// value, we just need a non-null object.
const fakeUsers = { email: 'email' } as any

// ---------------------------------------------------------------------------
// bcrypt utilities
// ---------------------------------------------------------------------------
describe('bcrypt utilities', () => {
  it('round-trips a password', async () => {
    const hash = await bcrypt.hash('secret123', 10)
    expect(await bcrypt.compare('secret123', hash)).toBe(true)
    expect(await bcrypt.compare('wrong', hash)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// authorizeUser — 4 branches
// ---------------------------------------------------------------------------
describe('authorizeUser', () => {
  it('returns null when user not found', async () => {
    const db = makeDb([])
    const result = await authorizeUser('notfound@example.com', 'pass', db, fakeUsers)
    expect(result).toBeNull()
  })

  it('returns null on wrong password', async () => {
    const hash = await bcrypt.hash('correct', 10)
    const db = makeDb([{ id: 1, email: 'u@e.com', username: 'u', passwordHash: hash }])
    const result = await authorizeUser('u@e.com', 'wrong', db, fakeUsers)
    expect(result).toBeNull()
  })

  it('returns user object on correct credentials', async () => {
    const hash = await bcrypt.hash('correct', 10)
    const db = makeDb([{ id: 1, email: 'u@e.com', username: 'testuser', passwordHash: hash }])
    const result = await authorizeUser('u@e.com', 'correct', db, fakeUsers)
    expect(result).not.toBeNull()
    expect(result?.username).toBe('testuser')
    expect(result?.id).toBe('1')
    expect(result?.email).toBe('u@e.com')
  })

  it('returns null when DB throws', async () => {
    const throwingDb = {
      select: () => ({
        from: () => ({
          where: () => ({
            all: () => {
              throw new Error('DB failure')
            },
          }),
        }),
      }),
    } as any
    const result = await authorizeUser('u@e.com', 'pass', throwingDb, fakeUsers)
    expect(result).toBeNull()
  })
})
