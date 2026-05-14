'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/trpc/client'

const inputCls = 'w-full rounded-md px-3.5 py-2.5 text-sm focus:outline-none'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '', password: '', passwordConf: '',
    username: '', firstName: '', lastName: '',
  })
  const [error, setError] = useState('')

  const signup = trpc.auth.signup.useMutation({
    onSuccess: () => router.push('/login'),
    onError: err => setError(err.message),
  })

  const set = (field: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [field]: val }))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    signup.mutate(form)
  }

  const inputStyle = {
    background: 'var(--color-elevated)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
  }

  const labelCls = 'text-[11px] font-bold uppercase tracking-widest'
  const labelStyle = { color: 'var(--color-text-muted)' }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
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
          Join Spectrum.
        </h1>
        <p className="text-sm text-center mb-7" style={{ color: 'var(--color-text-muted)' }}>
          Create your free account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-xs text-center py-2 px-3 rounded-md" style={{ background: '#7f1d1d22', color: '#f87171' }}>
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls} style={labelStyle}>First Name</label>
              <input required value={form.firstName} onChange={e => set('firstName')(e.target.value)} className={inputCls} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls} style={labelStyle}>Last Name</label>
              <input required value={form.lastName} onChange={e => set('lastName')(e.target.value)} className={inputCls} style={inputStyle} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls} style={labelStyle}>Username</label>
            <input required value={form.username} onChange={e => set('username')(e.target.value)} className={inputCls} style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls} style={labelStyle}>Email</label>
            <input type="email" required value={form.email} onChange={e => set('email')(e.target.value)} className={inputCls} style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls} style={labelStyle}>Password</label>
            <input type="password" required value={form.password} onChange={e => set('password')(e.target.value)} className={inputCls} style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls} style={labelStyle}>Confirm Password</label>
            <input type="password" required value={form.passwordConf} onChange={e => set('passwordConf')(e.target.value)} className={inputCls} style={inputStyle} />
          </div>

          <button
            type="submit"
            disabled={signup.isPending}
            className="w-full py-2.5 text-sm font-semibold rounded-md mt-1 disabled:opacity-60"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            {signup.isPending ? 'Creating...' : 'Create Account'}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-accent)' }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
