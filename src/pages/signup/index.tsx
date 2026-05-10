import { useState, FormEvent } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import {
  Container, Paper, Title, TextInput, PasswordInput,
  Button, Alert, Anchor, Text, Stack, Group,
} from '@mantine/core'
import Link from 'next/link'
import { SIGNUP } from '@/common/gql/mutations'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '', password: '', passwordConf: '',
    username: '', firstName: '', lastName: '',
  })
  const [error, setError] = useState('')
  const [signup, { loading }] = useMutation(SIGNUP)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await signup({ variables: form })
      router.push('/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed.')
    }
  }

  return (
    <Container size={480} my={80}>
      <Title ta="center" mb="md">Create your Spectrum account</Title>
      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && <Alert color="red">{error}</Alert>}
            <Group grow>
              <TextInput
                label="First Name"
                required
                value={form.firstName}
                onChange={set('firstName')}
              />
              <TextInput
                label="Last Name"
                required
                value={form.lastName}
                onChange={set('lastName')}
              />
            </Group>
            <TextInput label="Username" required value={form.username} onChange={set('username')} />
            <TextInput label="Email" type="email" required value={form.email} onChange={set('email')} />
            <PasswordInput label="Password" required value={form.password} onChange={set('password')} />
            <PasswordInput
              label="Confirm Password"
              required
              value={form.passwordConf}
              onChange={set('passwordConf')}
            />
            <Button type="submit" fullWidth loading={loading}>Create Account</Button>
            <Text ta="center" size="sm">
              Already have an account?{' '}
              <Anchor component={Link} href="/login">Sign in</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
