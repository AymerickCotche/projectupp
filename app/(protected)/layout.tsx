import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Header from '@/app/components/Header'
import SessionProviders from '@/app/components/SessionsProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UPP - Mail them all',
  description: 'Made by Aymerick Cotché for Dimexoi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
      </head>
      <body className={inter.className}>
        <SessionProviders>
          <Header/>
          {children}
        </SessionProviders>
      </body>
    </html>
  )
}
