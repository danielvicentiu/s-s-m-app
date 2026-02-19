// app/[locale]/dashboard/iscir/daily/page.tsx
// M9_ISCIR: Daily checks page – operator view for macarale / stivuitoare

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ISCIRDailyClient from './ISCIRDailyClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verificări zilnice ISCIR | s-s-m.ro',
  description: 'Completare verificări zilnice operator pentru echipamente ISCIR (macarale, stivuitoare)',
}

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ org?: string; equipment?: string }>
}

export default async function ISCIRDailyPage({ params, searchParams }: PageProps) {
  const { locale: _locale } = await params
  const { org: selectedOrgId, equipment: preselectedEquipmentId } = await searchParams

  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Equipment that requires daily checks
  let equipmentQuery = supabase
    .from('iscir_equipment')
    .select('*, organizations(id, name, cui)')
    .eq('daily_check_required', true)
    .eq('status', 'activ')
    .order('identifier')

  if (selectedOrgId && selectedOrgId !== 'all') {
    equipmentQuery = equipmentQuery.eq('organization_id', selectedOrgId)
  }

  const { data: equipment } = await equipmentQuery

  // Today's checks – to know which equipment has already been checked
  const today = new Date().toISOString().split('T')[0]
  const { data: todayChecks } = await supabase
    .from('iscir_daily_checks')
    .select('*')
    .eq('check_date', today)

  // Organizations list for the filter selector
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  return (
    <ISCIRDailyClient
      user={{ id: user.id, email: user.email || '' }}
      equipment={equipment || []}
      todayChecks={todayChecks || []}
      organizations={organizations || []}
      selectedOrgId={selectedOrgId}
      preselectedEquipmentId={preselectedEquipmentId}
      today={today}
    />
  )
}
