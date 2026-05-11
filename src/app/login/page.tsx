'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input, Button, Card, CardBody, Link } from '@heroui/react'
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
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Sign in to Spectrum</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onValueChange={setEmail}
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onValueChange={setPassword}
            />
            <Button type="submit" color="primary" fullWidth isLoading={loading}>
              Sign In
            </Button>
            <p className="text-center text-sm text-default-500">
              No account?{' '}
              <Link as={NextLink} href="/signup" size="sm">Sign up</Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
