import type { Metadata } from 'next'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { TRPCReactProvider } from '@/trpc/client'
import { Navbar } from '@/components/layout/Navbar'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Spectrum',
  description: 'Read the news from every angle.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <HeroUIProvider>
            <SessionProvider>
              <TRPCReactProvider>
                <Navbar />
                <main className="max-w-screen-xl mx-auto px-4 py-8">
                  {children}
                </main>
              </TRPCReactProvider>
            </SessionProvider>
          </HeroUIProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
