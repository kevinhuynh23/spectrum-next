import { useSession, signOut } from 'next-auth/react'
import { Header, Container, Group, Button, Anchor } from '@mantine/core'
import Link from 'next/link'

export default function HeaderAction() {
  const { data: session } = useSession()
  const username = (session?.user as { username?: string })?.username ?? session?.user?.name

  return (
    <Header height={60} mb="md">
      <Container size="lg" h="100%">
        <Group position="apart" h="100%">
          <Anchor component={Link} href="/" fw={700} size="lg" color="dark">
            Spectrum
          </Anchor>
          <Group spacing="sm">
            <Button variant="subtle" component={Link} href="/">Home</Button>
            <Button variant="subtle" component={Link} href="/about">About</Button>
            {session ? (
              <>
                <Button variant="subtle" component={Link} href="/user">
                  {username}
                </Button>
                <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="subtle" component={Link} href="/login">Login</Button>
                <Button component={Link} href="/signup">Sign Up</Button>
              </>
            )}
          </Group>
        </Group>
      </Container>
    </Header>
  )
}
