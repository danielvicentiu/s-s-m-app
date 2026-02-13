// app/[locale]/dashboard/alerts/page.tsx
// Pagină Gestionare Alerte — Server Component
// Fetch alerte active din view v_active_alerts + tabel alerts (dacă există)

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AlertsClient from './AlertsClient'

export const metadata = {
  title: 'Alerte | S-S-M.ro',
  description: 'Gestionare alerte SSM și PSI',
}

export default async function AlertsPage() {
  const supabase = await createSupabaseServer()

  // Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch alerts from view v_active_alerts
  const { data: viewAlerts, error: viewError } = await supabase
    .from('v_active_alerts')
    .select('*')
    .order('days_remaining', { ascending: true })

  if (viewError) {
    console.error('Error fetching view alerts:', viewError)
  }

  // Fetch organizations for filtering
  const { data: organizations, error: orgsError } = await supabase
    .from('memberships')
    .select(`
      organization_id,
      organizations (
        id,
        name
      )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)

  const orgs = organizations?.map((m: any) => m.organizations).filter(Boolean) || []

  return (
    <AlertsClient
      user={{ id: user.id, email: user.email || '' }}
      initialAlerts={viewAlerts || []}
      organizations={orgs}
    />
  )
}
