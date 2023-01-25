import { AppProps } from 'next/app';
import { AppShell, MantineProvider, Navbar } from '@mantine/core';
import HeaderAction, { HeaderLink } from '../common/components/elements/header';
import { useState, useEffect } from 'react';
import { routes } from '../common/types/routes';
import { NavbarMinimal } from '../common/components/elements/navbar';

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const [links, setLinks] = useState<HeaderLink[]>([]);

  useEffect(() => {
    setLinks(routes);
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
      }}
    >
      <AppShell padding="md" header={<HeaderAction links={links} />} navbar={<NavbarMinimal />}>
        <Component {...pageProps} />
      </AppShell>
    </MantineProvider>
  );
};

export default App;
