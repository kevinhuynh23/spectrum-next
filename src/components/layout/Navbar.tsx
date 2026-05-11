import { auth, signOut } from '@/auth'
import { NavbarClient } from './NavbarClient'

export async function Navbar() {
  const session = await auth()
  const username = (session?.user as { username?: string })?.username ?? session?.user?.name ?? null
  const isAuthed = !!session

  async function logoutAction() {
    'use server'
    await signOut({ redirectTo: '/' })
  }

  return <NavbarClient isAuthed={isAuthed} username={username} logoutAction={logoutAction} />
}
