// components/layouts/DashboardLayout.tsx
// Layout pentru dashboard cu sidebar integrat
// Data: 13 Februarie 2026

'use client'

import DashboardSidebar from '@/components/navigation/DashboardSidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  alertsCount?: number
  locale?: string
  organizationName?: string
}

export default function DashboardLayout({
  children,
  alertsCount = 0,
  locale = 'ro',
  organizationName = 'Dashboard'
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        alertsCount={alertsCount}
        locale={locale}
        organizationName={organizationName}
      />

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {children}
      </div>
    </div>
  )
}
