// app/[locale]/dashboard/psi/page.tsx
// M2_PSI: Server component wrapper with data fetching and ModuleGate

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PSIClient from './PSIClient'
import ModuleGate from '@/components/ModuleGate'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echipamente PSI | s-s-m.ro',
  description: 'Gestionare stingătoare, hidranți, detectori și alte echipamente PSI',
}

interface PSIPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function PSIPage({ params, searchParams }: PSIPageProps) {
  const { locale } = await params
  const { org: selectedOrgId } = await searchParams
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Build query with optional org filter
  let equipmentQuery = supabase
    .from('psi_equipment')
    .select('*, organizations(id, name, cui)')
    .order('next_inspection_date', { ascending: true })

  if (selectedOrgId && selectedOrgId !== 'all') {
    equipmentQuery = equipmentQuery.eq('organization_id', selectedOrgId)
  }

  const { data: equipment, error: equipmentError } = await equipmentQuery

  // Fetch organizations for selector
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  // Calculate stats
  const today = new Date()
  const equipmentList = equipment || []

  const stats = {
    total: equipmentList.length,
    operational: equipmentList.filter(e => e.status === 'operational').length,
    needsInspection: equipmentList.filter(e => e.status === 'needs_inspection').length,
    expired: equipmentList.filter(e =>
      e.next_inspection_date && new Date(e.next_inspection_date) < today
    ).length
  }

  // Get orgId for ModuleGate (use first org or selected org)
  const orgId = selectedOrgId || organizations?.[0]?.id || null

  return (
    <ModuleGate orgId={orgId} moduleKey="psi" locale={locale}>
      <PSIClient
        user={{ id: user.id, email: user.email || '' }}
        equipment={equipmentList}
        organizations={organizations || []}
        selectedOrgId={selectedOrgId}
        stats={stats}
      />
    </ModuleGate>
  )
}
