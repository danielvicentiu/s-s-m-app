// app/[locale]/dashboard/reports/equipment/page.tsx
// Raport Echipamente — total per tip, verificări, stare, costuri, grafice
// Pattern similar cu compliance report

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EquipmentReportClient from './EquipmentReportClient'

export default async function EquipmentReportPage() {
  const supabase = await createSupabaseServer()

  // Verificare autentificare
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch organizații accesibile
  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id, organizations(id, name, cui)')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const organizations = (memberships || [])
    .map((m: any) => m.organizations)
    .filter(Boolean)

  // Fetch date echipamente pentru toate organizațiile
  const orgIds = organizations.map((o: any) => o.id)

  // 1. Echipamente securitate
  const { data: equipment } = await supabase
    .from('safety_equipment')
    .select('*')
    .in('organization_id', orgIds)
    .order('expiry_date', { ascending: true })

  // 2. Equipment types pentru categorii
  const { data: equipmentTypes } = await supabase
    .from('equipment_types')
    .select('*')
    .eq('is_active', true)

  return (
    <EquipmentReportClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations}
      equipment={equipment || []}
      equipmentTypes={equipmentTypes || []}
    />
  )
}
