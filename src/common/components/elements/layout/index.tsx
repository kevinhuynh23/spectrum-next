import { Container } from '@mantine/core';
import { useState, useEffect, ReactNode } from 'react';
import HeaderAction, { HeaderLink } from '../header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [links, setLinks] = useState<HeaderLink[]>([]);

  useEffect(() => {
    setLinks([
      { link: '/', label: 'Home' },
      { link: '', label: 'Features' },
      { link: '', label: 'Pricing' },
      { link: '/about', label: 'About' },
    ]);
  }, []);

  return (
    <Container>
      <HeaderAction links={links} />
      {children}
    </Container>
  );
};

export default Layout;
