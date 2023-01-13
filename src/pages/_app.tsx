import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import Layout from '../common/components/elements/layout';

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <Layout>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </Layout>
  );
};

export default App;
