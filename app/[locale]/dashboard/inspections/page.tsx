// app/[locale]/dashboard/inspections/page.tsx
// Inspecții Interne SSM — checklist 30 puncte verificare
// RBAC: verificare roluri dinamice

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasRole } from '@/lib/rbac'
import InspectionsClient from './InspectionsClient'

export default async function InspectionsPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // RBAC: Verifică dacă user are acces la inspecții
  const isConsultant = await hasRole('consultant_ssm') || await hasRole('super_admin')

  // Fetch organizații accesibile
  const organizations = (orgs || [])
    .map((m: any) => m.organization)
    .filter(Boolean)

  // Fetch inspecții existente
  const { data: inspections, error: inspectionsError } = await supabase
    .from('ssm_inspections')
    .select(`
      *,
      organizations(name, cui)
    `)
    .order('inspection_date', { ascending: false })

  console.log('📋 [Inspections] Fetched data:', {
    count: inspections?.length || 0,
    error: inspectionsError
  })

  return (
    <InspectionsClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations}
      inspections={inspections || []}
      isConsultant={isConsultant}
    />
  )
}
