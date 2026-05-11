import type { Metadata } from 'next'
import { Providers } from './providers'
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
        <Providers>
          <Navbar />
          <main className="max-w-screen-xl mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
