import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
} from '@heroui/react'
import NextLink from 'next/link'
import { auth, signOut } from '@/auth'
import { ThemeToggle } from './ThemeToggle'

export async function Navbar() {
  const session = await auth()
  const username = (session?.user as { username?: string })?.username ?? session?.user?.name

  return (
    <HeroNavbar maxWidth="xl" isBordered>
      <NavbarBrand>
        <Link as={NextLink} href="/" className="font-bold text-xl text-foreground">
          Spectrum
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link as={NextLink} href="/" color="foreground">Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={NextLink} href="/about" color="foreground">About</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        {session ? (
          <>
            <NavbarItem>
              <Link as={NextLink} href="/user" color="foreground">{username}</Link>
            </NavbarItem>
            <NavbarItem>
              <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
                <Button type="submit" variant="bordered" size="sm">Logout</Button>
              </form>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link as={NextLink} href="/login" color="foreground">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={NextLink} href="/signup" color="primary" size="sm">Sign Up</Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </HeroNavbar>
  )
}
