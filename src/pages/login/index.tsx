import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  Container, Paper, Title, TextInput, PasswordInput,
  Button, Alert, Anchor, Text, Stack,
} from '@mantine/core'
import Link from 'next/link'

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
    const result = await signIn('credentials', {
      email, password, redirect: false,
    })
    setLoading(false)
    if (result?.ok) {
      router.push('/')
    } else {
      setError('Incorrect email or password.')
    }
  }

  return (
    <Container size={420} my={80}>
      <Title ta="center" mb="md">Sign in to Spectrum</Title>
      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && <Alert color="red">{error}</Alert>}
            <TextInput
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth loading={loading}>Sign In</Button>
            <Text ta="center" size="sm">
              No account?{' '}
              <Anchor component={Link} href="/signup">Sign up</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
