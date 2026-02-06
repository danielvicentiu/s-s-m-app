// app/dashboard/page.tsx
// Dashboard — design IDENTIC cu versiunea aprobată de 9 clienți
// Conectat la date REALE din Supabase views
// + Value Preview (risc financiar)
// + User preferences (toggle-uri panouri)

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch date reale
  const { data: overview } = await supabase.from('v_dashboard_overview').select('*')
  const { data: alerts } = await supabase
    .from('v_active_alerts')
    .select('*')
    .order('days_remaining', { ascending: true })

  // Fetch date detaliate pentru tabel
  const { data: medicalExams } = await supabase
    .from('medical_examinations')
    .select('*, organizations(name, cui)')

  const { data: equipment } = await supabase
    .from('safety_equipment')
    .select('*, organizations(name, cui)')

  // Extrage lista organizații din memberships
  const organizations = (orgs || [])
    .map((m: any) => m.organization)
    .filter(Boolean)

  // Fetch Value Preview pentru toate org-urile
  const orgIds = [...new Set(
    [...(overview || []), ...(medicalExams || []), ...(equipment || [])]
      .map((r: any) => r.organization_id)
      .filter(Boolean)
  )]
  const valuePreviewMap: Record<string, any> = {}
  await Promise.all(orgIds.map(async (orgId: string) => {
    const { data } = await supabase.rpc('calculate_value_preview', {
      p_organization_id: orgId
    })
    if (data) valuePreviewMap[orgId] = data
  }))

  // Verifică dacă user e consultant
  const { data: userMembership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .single()

  const isConsultant = userMembership?.role === 'consultant'

  // Fetch user preferences (toggle-uri dashboard)
  const { data: prefsRows } = await supabase
    .from('user_preferences')
    .select('key, value')
    .eq('user_id', user.id)

  const initialPrefs: Record<string, any> = {}
  if (prefsRows) {
    for (const row of prefsRows) {
      try {
        initialPrefs[row.key] = JSON.parse(row.value)
      } catch {
        initialPrefs[row.key] = true
      }
    }
  }

  // Citește preferința org selectată (validează că încă există)
  let savedSelectedOrg = 'all'
  if (initialPrefs.selected_org) {
    const parsed = initialPrefs.selected_org
    if (parsed === 'all' || organizations.some((o: any) => o.id === parsed)) {
      savedSelectedOrg = parsed
    }
  }

  return (
    <DashboardClient
      user={{ email: user.email || '', id: user.id }}
      overview={overview || []}
      alerts={alerts || []}
      medicalExams={medicalExams || []}
      equipment={equipment || []}
      valuePreviewMap={valuePreviewMap}
      isConsultant={isConsultant}
      initialPrefs={initialPrefs}
      organizations={organizations}
      savedSelectedOrg={savedSelectedOrg}
    />
  )
}
