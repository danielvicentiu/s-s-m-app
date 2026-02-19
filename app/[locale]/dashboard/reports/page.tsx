// app/[locale]/dashboard/reports/page.tsx
// Pagină rapoarte PDF automate SSM/PSI
// Data: 17 Februarie 2026

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReportsClient from './ReportsClient'

interface ReportsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { org: selectedOrgId } = await searchParams
  const supabase = await createSupabaseServer()
  const { user } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch reports with optional org filter
  let reportsQuery = supabase
    .from('reports')
    .select('*, organizations(name, cui)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (selectedOrgId && selectedOrgId !== 'all') {
    reportsQuery = reportsQuery.eq('organization_id', selectedOrgId)
  }

  const { data: reports } = await reportsQuery

  // Fetch organizations for filter
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  return (
    <ReportsClient
      user={{ id: user.id, email: user.email || '' }}
      reports={reports || []}
      organizations={organizations || []}
      selectedOrgId={selectedOrgId}
    />
  )
}
