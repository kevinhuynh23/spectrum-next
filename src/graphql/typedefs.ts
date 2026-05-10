export const typeDefs = `#graphql
  type Article {
    title: String!
    description: String
    url: String!
    urlToImage: String
    publishedAt: String!
    source: ArticleSource!
    sourceBias: String
    framingAnalysis: String
  }

  type ArticleSource {
    id: String
    name: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
  }

  type CategoryMetrics {
    sports: Int!
    health: Int!
    business: Int!
    entertainment: Int!
    science: Int!
    technology: Int!
  }

  type UserMetrics {
    categoryToNumArticles: CategoryMetrics!
  }

  type Query {
    news(category: String): [Article!]!
    spectrum(title: String!): [Article!]!
    metrics: UserMetrics!
    me: User
  }

  type Mutation {
    signup(
      email: String!
      password: String!
      passwordConf: String!
      username: String!
      firstName: String!
      lastName: String!
    ): User!
    trackRead(category: String!, source: String!): Boolean!
  }
`
