'use client'

import { ReactNode } from 'react'
import PublicNavbar from './PublicNavbar'
import Footer from './Footer'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
