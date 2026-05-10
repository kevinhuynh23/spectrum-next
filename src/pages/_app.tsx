import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ApolloProvider } from '@apollo/client'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { apolloClient } from '@/common/apollo-client'
import HeaderAction, { HeaderLink } from '../common/components/elements/header'
import { useState } from 'react'
import { routes } from '../common/types/routes'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [links] = useState<HeaderLink[]>(routes)

  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
          <NotificationsProvider>
            <HeaderAction links={links} />
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </ApolloProvider>
    </SessionProvider>
  )
}
