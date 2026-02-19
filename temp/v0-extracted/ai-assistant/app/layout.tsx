import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: 's-s-m.ro — Securitatea Muncii. Digitalizată. Simplificată.',
  description: 'Platformă completă pentru SSM, PSI, GDPR și NIS2 — conformitate automată pentru angajatorii din România și CEE.',
}

export const viewport = {
  themeColor: '#1e293b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" className="scroll-smooth">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
