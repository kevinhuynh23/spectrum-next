'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

interface NavbarClientProps {
  isAuthed: boolean
  username: string | null | undefined
  logoutAction: () => Promise<void>
}

export function NavbarClient({ isAuthed, username, logoutAction }: NavbarClientProps) {
  const initials = username?.slice(0, 1).toUpperCase() ?? '?'

  return (
    <nav
      className="w-full sticky top-0 z-50"
      style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 h-[60px]">
        <Link
          href="/"
          className="text-[22px] font-extrabold tracking-[-0.5px] shrink-0"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--color-text-primary)' }}
        >
          Spectrum
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:opacity-100"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {isAuthed ? (
            <>
              <Link href="/user" className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                  {initials}
                </span>
                <span
                  className="text-sm font-medium hidden sm:block"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {username}
                </span>
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors"
                  style={{
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    background: 'transparent',
                  }}
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors"
                style={{
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  background: 'transparent',
                }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-sm font-semibold rounded-md"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
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
