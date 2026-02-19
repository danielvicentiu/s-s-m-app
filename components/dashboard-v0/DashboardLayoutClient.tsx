'use client'

// components/dashboard-v0/DashboardLayoutClient.tsx
// Client wrapper for dashboard layout - manages sidebar expanded state + mobile state

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { OrgProvider } from '@/lib/contexts/OrgContext'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface DashboardLayoutClientProps {
  user: User
  organizations: Array<{ id: string; name: string; cui: string | null }>
  children: React.ReactNode
}

export default function DashboardLayoutClient({
  user,
  organizations,
  children,
}: DashboardLayoutClientProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <OrgProvider initialOrgs={organizations} userId={user.id}>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar
          user={user}
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Main content - shifts right based on sidebar width */}
        <div
          className={`flex flex-col transition-all duration-300 ${
            sidebarExpanded ? 'lg:pl-60' : 'lg:pl-[68px]'
          }`}
        >
          <Topbar
            userEmail={user.email || ''}
            userId={user.id}
            onMobileMenuOpen={() => setMobileOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </OrgProvider>
  )
}
