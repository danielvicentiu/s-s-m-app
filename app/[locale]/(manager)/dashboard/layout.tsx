// app/[locale]/dashboard/layout.tsx
// Dashboard layout v2 — v0 sidebar + topbar design
// Responsive: collapsible sidebar (desktop) + mobile drawer
import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayoutClient from '@/components/dashboard-v0/DashboardLayoutClient'

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

  // Fetch orgs for OrgProvider (needed by Sidebar's useOrg hook)
  const { orgs } = await getCurrentUserOrgs()
  const organizations = (orgs || [])
    .map((m: any) => ({
      id: m.organization?.id,
      name: m.organization?.name || '',
      cui: m.organization?.cui || null,
    }))
    .filter((o: any) => o.id)

  return (
    <DashboardLayoutClient user={user} organizations={organizations}>
      {children}
    </DashboardLayoutClient>
  )
}
