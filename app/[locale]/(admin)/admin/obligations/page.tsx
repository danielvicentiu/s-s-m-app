// app/admin/obligations/page.tsx
// Admin UI: Lista obligații legale per țară
// Acces: super_admin și consultant_ssm

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin, hasRole } from '@/lib/rbac'
import ObligationsClient from './ObligationsClient'

export default async function AdminObligationsPage() {
  // GUARD: Verificare super_admin sau consultant_ssm
  const admin = await isSuperAdmin()
  const consultant = await hasRole('consultant_ssm')

  if (!admin && !consultant) redirect('/unauthorized')

  const supabase = await createSupabaseServer()

  // Fetch toate obligațiile cu sortare
  const { data: obligations, error } = await supabase
    .from('obligation_types')
    .select('*')
    .order('display_order', { ascending: true })
    .order('country_code', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching obligations:', error)
  }

  // Statistici
  const obligationsData = obligations || []
  const stats = {
    total: obligationsData.length,
    active: obligationsData.filter(o => o.is_active).length,
    system: obligationsData.filter(o => o.is_system).length,
    countries: [...new Set(obligationsData.map(o => o.country_code))].length,
  }

  return (
    <ObligationsClient
      obligations={obligationsData}
      stats={stats}
      canDelete={admin} // Doar super_admin poate șterge
    />
  )
}
