// app/dashboard/equipment/page.tsx
// M5 Echipamente PSI — Pagina dedicată CRUD
// Pattern identic cu /dashboard/medical

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EquipmentClient from './EquipmentClient'

export default async function EquipmentPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizații
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')

  // Fetch echipamente cu org
  const { data: equipment } = await supabase
    .from('safety_equipment')
    .select('*, organizations(name, cui)')
    .order('expiry_date', { ascending: true })

  return (
    <EquipmentClient
      user={{ email: user.email || '' }}
      organizations={organizations || []}
      equipment={equipment || []}
    />
  )
}
