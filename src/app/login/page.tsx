'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'

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
    <div className="flex justify-center py-16">
      <div className="w-full max-w-md border border-default-200 rounded-lg shadow-sm bg-background">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Sign in to Spectrum</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-default-600">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 border border-default-300 rounded-md bg-background focus:outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-default-600">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 border border-default-300 rounded-md bg-background focus:outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-default-500">
              No account?{' '}
              <NextLink href="/signup" className="text-primary hover:underline">Sign up</NextLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
