// app/[locale]/dashboard/iscir/page.tsx
// M9_ISCIR: Server component wrapper with data fetching

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ISCIRClient from './ISCIRClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echipamente ISCIR | s-s-m.ro',
  description: 'Gestionare cazane, recipiente sub presiune, lifturi și alte echipamente ISCIR',
}

interface ISCIRPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string }>
}

export default async function ISCIRPage({ params, searchParams }: ISCIRPageProps) {
  const { locale: _locale } = await params
  const { org: selectedOrgId } = await searchParams
  const supabase = await createSupabaseServer()
  const { user } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Build query with optional org filter
  let equipmentQuery = supabase
    .from('iscir_equipment')
    .select('*, organizations(id, name, cui)')
    .order('next_verification_date', { ascending: true })

  if (selectedOrgId && selectedOrgId !== 'all') {
    equipmentQuery = equipmentQuery.eq('organization_id', selectedOrgId)
  }

  const { data: equipment } = await equipmentQuery

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
    activ: equipmentList.filter(e => e.status === 'activ').length,
    expirat: equipmentList.filter(e =>
      e.next_verification_date && new Date(e.next_verification_date) < today
    ).length,
    oprit: equipmentList.filter(e => e.status === 'oprit').length
  }

  return (
    <ISCIRClient
      user={{ id: user.id, email: user.email || '' }}
      equipment={equipmentList}
      organizations={organizations || []}
      selectedOrgId={selectedOrgId}
      stats={stats}
    />
  )
}
