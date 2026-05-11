'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Button, Card, CardBody, Link } from '@heroui/react'
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

  return (
    <div className="flex justify-center py-16">
      <Card className="w-full max-w-lg">
        <CardBody className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Create your Spectrum account</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" required value={form.firstName} onValueChange={set('firstName')} />
              <Input label="Last Name" required value={form.lastName} onValueChange={set('lastName')} />
            </div>
            <Input label="Username" required value={form.username} onValueChange={set('username')} />
            <Input label="Email" type="email" required value={form.email} onValueChange={set('email')} />
            <Input label="Password" type="password" required value={form.password} onValueChange={set('password')} />
            <Input label="Confirm Password" type="password" required value={form.passwordConf} onValueChange={set('passwordConf')} />
            <Button type="submit" color="primary" fullWidth isLoading={signup.isPending}>
              Create Account
            </Button>
            <p className="text-center text-sm text-default-500">
              Already have an account?{' '}
              <Link as={NextLink} href="/login" size="sm">Sign in</Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
