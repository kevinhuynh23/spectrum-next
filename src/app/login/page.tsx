'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inputCls = 'w-full rounded-md px-3.5 py-2.5 text-sm focus:outline-none'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.ok) {
      router.push('/')
    } else {
      setError('Incorrect email or password.')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-base)' }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-10"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h1
          className="font-extrabold mb-1.5 text-center"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '26px', color: 'var(--color-text-primary)' }}
        >
          Welcome back.
        </h1>
        <p className="text-sm text-center mb-7" style={{ color: 'var(--color-text-muted)' }}>
          Sign in to your Spectrum account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-xs text-center py-2 px-3 rounded-md" style={{ background: '#7f1d1d22', color: '#f87171' }}>
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputCls}
              style={{
                background: 'var(--color-elevated)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputCls}
              style={{
                background: 'var(--color-elevated)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold rounded-md mt-1 disabled:opacity-60"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--color-accent)' }}>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
