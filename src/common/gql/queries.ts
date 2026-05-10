import { gql } from '@apollo/client'

export const GET_NEWS = gql`
  query GetNews($category: String) {
    news(category: $category) {
      title
      description
      url
      urlToImage
      publishedAt
      source { id name }
    }
  }
`

export const GET_SPECTRUM = gql`
  query GetSpectrum($title: String!) {
    spectrum(title: $title) {
      title
      description
      url
      urlToImage
      publishedAt
      source { id name }
      sourceBias
      framingAnalysis
    }
  }
`

export const GET_METRICS = gql`
  query GetMetrics {
    metrics {
      categoryToNumArticles {
        sports health business entertainment science technology
      }
    }
  }
`

export const ME = gql`
  query Me {
    me { id username email firstName lastName }
  }
`
