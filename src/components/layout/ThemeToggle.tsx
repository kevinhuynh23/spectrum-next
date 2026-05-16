'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const current = theme ?? resolvedTheme

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-default-100"
      suppressHydrationWarning
    >
      <span suppressHydrationWarning>{current === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  )
}
