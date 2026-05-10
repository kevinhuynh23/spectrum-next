import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getToken } from 'next-auth/jwt'
import { typeDefs } from '@/graphql/typedefs'
import { resolvers } from '@/graphql/resolvers'
import type { NextApiRequest, NextApiResponse } from 'next'

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing required env var: NEXTAUTH_SECRET')
}

const schema = makeExecutableSchema({ typeDefs, resolvers })
const server = new ApolloServer({ schema })

const handler = startServerAndCreateNextHandler<NextApiRequest>(server, {
  context: async (req) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    return { userId: token?.sub ?? null }
  },
})

export default async function graphqlHandler(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res)
}

export const config = { api: { bodyParser: false } }
