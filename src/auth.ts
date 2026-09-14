import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authorizeUser } from '@/lib/auth-utils'
import { checkRateLimit, clientIpFromRequest } from '@/lib/rate-limit'

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        // Blunt credential-stuffing: 10 login attempts per IP per 10 minutes.
        // Rate-limited attempts fail exactly like bad credentials (null).
        const ip = await clientIpFromRequest()
        const rl = checkRateLimit({ key: `auth:login:${ip}`, limit: 10, windowMs: 10 * 60 * 1000 })
        if (!rl.ok) return null
        return authorizeUser(
          credentials.email as string,
          credentials.password as string,
        )
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as { username?: string }).username ?? user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as { username?: string }).username = token.username as string
      }
      return session
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
})
