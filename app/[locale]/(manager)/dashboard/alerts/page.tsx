// app/[locale]/dashboard/alerts/page.tsx
// Alerte & Notificări — istoric, configurare, consum

import { createSupabaseServer } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import AlertsClient from './AlertsClient'

interface AlertsPageProps {
  params: Promise<{ locale: string }>
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function AlertsPage({ params }: AlertsPageProps) {
  await params // consume params (locale not used here directly)
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const admin = getSupabaseAdmin()

  // Fetch organizații ale utilizatorului
  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id, organizations(id, name, contact_email)')

  const orgIds = (memberships || [])
    .map((m: any) => m.organization_id)
    .filter(Boolean)

  const organizations = (memberships || [])
    .map((m: any) => ({
      id: m.organization_id,
      name: m.organizations?.name || '',
      contact_email: m.organizations?.contact_email || '',
    }))
    .filter((o: any) => o.id)

  const selectedOrgId = orgIds[0] || null

  // Fetch alert logs (ultimele 100)
  const { data: alertLogs } = selectedOrgId
    ? await admin
        .from('alert_logs')
        .select('*')
        .in('organization_id', orgIds)
        .order('created_at', { ascending: false })
        .limit(100)
    : { data: [] }

  // Fetch alert configuration
  const { data: alertConfig } = selectedOrgId
    ? await admin
        .from('alert_configurations')
        .select('*')
        .eq('organization_id', selectedOrgId)
        .single()
    : { data: null }

  // Fetch usage ultimele 6 luni
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const { data: alertUsage } = selectedOrgId
    ? await admin
        .from('alert_usage')
        .select('*')
        .in('organization_id', orgIds)
        .gte('month', sixMonthsAgo.toISOString().split('T')[0])
        .order('month', { ascending: false })
    : { data: [] }

  // Fetch alerte pending din tabelul `alerts` (motor M4)
  const { data: pendingAlerts } = selectedOrgId
    ? await admin
        .from('alerts')
        .select('*')
        .in('organization_id', orgIds)
        .not('status', 'in', '("resolved","dismissed")')
        .order('created_at', { ascending: false })
        .limit(50)
    : { data: [] }

  const isTwilioConfigured = !!(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  )

  return (
    <AlertsClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations}
      selectedOrgId={selectedOrgId}
      alertLogs={alertLogs || []}
      alertConfig={alertConfig}
      alertUsage={alertUsage || []}
      pendingAlerts={pendingAlerts || []}
      isTwilioConfigured={isTwilioConfigured}
    />
  )
}
