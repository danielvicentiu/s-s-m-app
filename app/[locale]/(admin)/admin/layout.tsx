// app/[locale]/admin/layout.tsx
// Admin section layout with fixed sidebar navigation
// Responsive: fixed sidebar on desktop, collapsible drawer on mobile

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      {/* Main content area with padding for sidebar */}
      <div className="lg:pl-64">
        {/* Mobile top bar spacer */}
        <div className="lg:hidden h-14" />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
