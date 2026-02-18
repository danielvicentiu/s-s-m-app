// app/[locale]/dashboard/psi/[id]/page.tsx
// M2_PSI: Server component — detalii echipament PSI cu istoric inspecții

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Metadata } from 'next'
import PSIEquipmentDetailClient from './PSIEquipmentDetailClient'

interface PSIEquipmentDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: PSIEquipmentDetailPageProps): Promise<Metadata> {
  return {
    title: 'Detalii echipament PSI | s-s-m.ro'
  }
}

export default async function PSIEquipmentDetailPage({ params }: PSIEquipmentDetailPageProps) {
  const { locale, id } = await params
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify user has access to this equipment via memberships (RLS enforces this too)
  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const orgIds = memberships?.map(m => m.organization_id) || []

  if (orgIds.length === 0) notFound()

  // Fetch equipment with organization join
  const { data: equipment, error: equipmentError } = await supabase
    .from('psi_equipment')
    .select('*, organizations(id, name, cui)')
    .eq('id', id)
    .in('organization_id', orgIds)
    .single()

  if (equipmentError || !equipment) notFound()

  // Fetch inspection history (latest first)
  const { data: inspections } = await supabase
    .from('psi_inspections')
    .select('*')
    .eq('equipment_id', id)
    .order('inspection_date', { ascending: false })

  // Fetch organizations for the edit form selector
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .in('id', orgIds)
    .order('name')

  return (
    <PSIEquipmentDetailClient
      equipment={equipment}
      inspections={inspections || []}
      organizations={organizations || []}
      locale={locale}
    />
  )
}
