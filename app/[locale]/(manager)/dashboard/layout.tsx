// app/[locale]/dashboard/layout.tsx
// Dashboard layout with OrgProvider for sidebar context
// Responsive: fixed sidebar on desktop, collapsible drawer on mobile
import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from './DashboardSidebar'
import { OrgProvider } from '@/lib/contexts/OrgContext'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch orgs for OrgProvider (needed by DashboardSidebar's useOrg hook)
  const { orgs } = await getCurrentUserOrgs()
  const organizations = (orgs || [])
    .map((m: any) => ({
      id: m.organization?.id,
      name: m.organization?.name || '',
      cui: m.organization?.cui || null,
    }))
    .filter((o: any) => o.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <OrgProvider initialOrgs={organizations} userId={user.id}>
        <DashboardSidebar user={user} />
      </OrgProvider>
      {/* Main content area with padding for sidebar */}
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
