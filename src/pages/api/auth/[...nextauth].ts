import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authorizeUser } from '@/lib/auth-utils'

export default NextAuth({
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.username = token.username
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        return authorizeUser(credentials.email as string, credentials.password as string)
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
})
