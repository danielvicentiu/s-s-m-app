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

  // Fetch Value Preview pentru prima organizație
  // TODO: când sunt mai multe org-uri, iterăm sau agregăm
  let valuePreview = null
  if (overview && overview.length > 0) {
    const orgId = overview[0]?.organization_id || medicalExams?.[0]?.organization_id
    if (orgId) {
      const { data: vpData } = await supabase.rpc('calculate_value_preview', {
        p_organization_id: orgId
      })
      valuePreview = vpData
    }
  }

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

  const initialPrefs: Record<string, boolean> = {}
  if (prefsRows) {
    for (const row of prefsRows) {
      try {
        initialPrefs[row.key] = JSON.parse(row.value)
      } catch {
        initialPrefs[row.key] = true
      }
    }
  }

  return (
    <DashboardClient
      user={{ email: user.email || '', id: user.id }}
      overview={overview || []}
      alerts={alerts || []}
      medicalExams={medicalExams || []}
      equipment={equipment || []}
      valuePreview={valuePreview}
      isConsultant={isConsultant}
      initialPrefs={initialPrefs}
    />
  )
}
