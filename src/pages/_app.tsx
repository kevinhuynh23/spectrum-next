import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ApolloProvider } from '@apollo/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { apolloClient } from '@/common/apollo-client'
import HeaderAction from '@/common/components/elements/header'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
          <Notifications />
          <HeaderAction />
          <Component {...pageProps} />
        </MantineProvider>
      </ApolloProvider>
    </SessionProvider>
  )
}
