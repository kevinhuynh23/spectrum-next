import { newsResolvers } from './news'
import { authResolvers } from './auth'
import { metricsResolvers } from './metrics'

export type { GraphQLContext } from '../context'

export const resolvers = {
  Query: {
    ...newsResolvers.Query,
    ...authResolvers.Query,
    ...metricsResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...metricsResolvers.Mutation,
  },
}
