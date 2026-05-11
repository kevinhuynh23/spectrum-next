'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import { trpc } from '@/trpc/client'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '', password: '', passwordConf: '',
    username: '', firstName: '', lastName: '',
  })
  const [error, setError] = useState('')

  const signup = trpc.auth.signup.useMutation({
    onSuccess: () => router.push('/login'),
    onError: (err) => setError(err.message),
  })

  const set = (field: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [field]: val }))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    signup.mutate(form)
  }

  const inputCls =
    'px-3 py-2 border border-default-300 rounded-md bg-background focus:outline-none focus:border-primary'

  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-lg border border-default-200 rounded-lg shadow-sm bg-background">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Create your Spectrum account</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-default-600">First Name</span>
                <input required value={form.firstName} onChange={(e) => set('firstName')(e.target.value)} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-default-600">Last Name</span>
                <input required value={form.lastName} onChange={(e) => set('lastName')(e.target.value)} className={inputCls} />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-default-600">Username</span>
              <input required value={form.username} onChange={(e) => set('username')(e.target.value)} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-default-600">Email</span>
              <input type="email" required value={form.email} onChange={(e) => set('email')(e.target.value)} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-default-600">Password</span>
              <input type="password" required value={form.password} onChange={(e) => set('password')(e.target.value)} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-default-600">Confirm Password</span>
              <input type="password" required value={form.passwordConf} onChange={(e) => set('passwordConf')(e.target.value)} className={inputCls} />
            </label>
            <button
              type="submit"
              disabled={signup.isPending}
              className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {signup.isPending ? 'Creating...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-default-500">
              Already have an account?{' '}
              <NextLink href="/login" className="text-primary hover:underline">Sign in</NextLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
