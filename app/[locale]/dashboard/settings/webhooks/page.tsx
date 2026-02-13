// app/[locale]/dashboard/settings/webhooks/page.tsx
// Pagină configurare webhooks — lista endpoints, adăugare, testare, delivery log
// Server component — fetch webhooks

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WebhooksClient from './WebhooksClient'

export default async function WebhooksPage() {
  const supabase = await createSupabaseServer()

  // Verifică user autentificat
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

  // Fetch organization curentă din memberships
  const { data: membership } = await supabase
    .from('memberships')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!membership) {
    redirect('/dashboard')
  }

  // Fetch webhooks pentru organizația curentă
  const { data: webhooks, error: webhooksError } = await supabase
    .from('webhooks')
    .select('*')
    .eq('organization_id', membership.organization_id)
    .order('created_at', { ascending: false })

  // Fetch delivery logs (ultimele 50)
  const { data: deliveries, error: deliveriesError } = await supabase
    .from('webhook_deliveries')
    .select(`
      *,
      webhooks!inner(url, organization_id)
    `)
    .eq('webhooks.organization_id', membership.organization_id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <WebhooksClient
      webhooks={webhooks || []}
      deliveries={deliveries || []}
      organizationId={membership.organization_id}
      userRole={membership.role}
    />
  )
}
