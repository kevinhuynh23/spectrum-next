'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

interface NavbarClientProps {
  isAuthed: boolean
  username: string | null | undefined
  logoutAction: () => Promise<void>
}

export function NavbarClient({ isAuthed, username, logoutAction }: NavbarClientProps) {
  return (
    <nav className="w-full border-b border-default-200 bg-background">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 h-16">
        <Link href="/" className="font-bold text-xl text-foreground">
          Spectrum
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:underline">Home</Link>
          <Link href="/about" className="text-foreground hover:underline">About</Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthed ? (
            <>
              <Link href="/user" className="text-foreground hover:underline">{username}</Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm border border-default-300 rounded-md hover:bg-default-100"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-foreground hover:underline">Login</Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
