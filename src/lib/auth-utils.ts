import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db as defaultDb } from './db'
import { users as defaultUsers } from './schema'

export async function authorizeUser(
  email: string,
  password: string,
  db = defaultDb,
  users = defaultUsers,
): Promise<{ id: string; email: string; username: string; name: string } | null> {
  try {
    const [user] = db.select().from(users).where(eq(users.email, email)).all()
    if (!user) return null
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return null
    return { id: String(user.id), email: user.email, username: user.username, name: user.username }
  } catch (err) {
    console.error('[authorizeUser] DB error:', err)
    return null
  }
}
