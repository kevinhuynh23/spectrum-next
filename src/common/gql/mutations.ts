import { gql } from '@apollo/client'

export const SIGNUP = gql`
  mutation Signup(
    $email: String! $password: String! $passwordConf: String!
    $username: String! $firstName: String! $lastName: String!
  ) {
    signup(
      email: $email password: $password passwordConf: $passwordConf
      username: $username firstName: $firstName lastName: $lastName
    ) { id username email }
  }
`

export const TRACK_READ = gql`
  mutation TrackRead($category: String!, $source: String!) {
    trackRead(category: $category, source: $source)
  }
`
