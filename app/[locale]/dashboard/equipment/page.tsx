// app/dashboard/equipment/page.tsx
// M5 Echipamente PSI — Pagina dedicată CRUD
// Pattern identic cu /dashboard/medical
// REFACTORED: Citește equipment_types din DB (dinamic per țară)

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EquipmentClient from './EquipmentClient'

export default async function EquipmentPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizații cu country_code
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui, country_code')

  // Fetch echipamente cu org
  const { data: equipment } = await supabase
    .from('safety_equipment')
    .select('*, organizations(name, cui)')
    .order('expiry_date', { ascending: true })

  // Fetch equipment_types pentru toate țările relevante
  const countryCodes = [...new Set(
    (organizations || [])
      .map((o: any) => o.country_code || 'RO')
  )]

  const { data: equipmentTypes } = await supabase
    .from('equipment_types')
    .select('*')
    .in('country_code', countryCodes)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  return (
    <EquipmentClient
      user={{ email: user.email || '' }}
      organizations={organizations || []}
      equipment={equipment || []}
      equipmentTypes={equipmentTypes || []}
    />
  )
}
