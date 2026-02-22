// lib/billing/sync-modules.ts
// Sincronizare organization_modules și subscriptions cu Stripe
// IMPORTANT: Folosește service role (bypass RLS) — DOAR server-side (webhooks)

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'expired'

// Mapare status abonament → status module
function moduleStatusFromSubscription(
  subStatus: SubscriptionStatus
): 'active' | 'suspended' | 'inactive' | 'expired' {
  switch (subStatus) {
    case 'active': return 'active'
    case 'trial':  return 'active'
    case 'past_due': return 'suspended'
    case 'canceled': return 'inactive'
    case 'expired':  return 'expired'
  }
}

/**
 * Sincronizează toate modulele unei organizații cu statusul abonamentului.
 * Apelat din webhook-uri Stripe.
 */
export async function syncOrganizationModules(
  organizationId: string,
  status: SubscriptionStatus
): Promise<void> {
  const newModuleStatus = moduleStatusFromSubscription(status)

  const { error } = await supabaseAdmin
    .from('organization_modules')
    .update({
      status: newModuleStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('organization_id', organizationId)

  if (error) {
    console.error('[syncModules] Eroare update organization_modules:', error)
    throw error
  }

  console.log(
    `[syncModules] org=${organizationId} sub_status=${status} → module_status=${newModuleStatus}`
  )
}

/**
 * Upsert subscription în baza de date.
 * Conflict pe organization_id (o org = un abonament activ).
 */
export async function upsertSubscription(
  organizationId: string,
  data: {
    stripe_customer_id?: string
    stripe_subscription_id?: string
    stripe_price_id?: string
    plan_type?: string
    billing_owner?: 'patron' | 'sepp'
    status: SubscriptionStatus
    current_period_start?: Date
    current_period_end?: Date
    canceled_at?: Date | null
    trial_ends_at?: Date | null
    amount_ron?: number
  }
): Promise<void> {
  const payload: Record<string, unknown> = {
    organization_id: organizationId,
    status: data.status,
    updated_at: new Date().toISOString(),
  }

  if (data.stripe_customer_id !== undefined) payload.stripe_customer_id = data.stripe_customer_id
  if (data.stripe_subscription_id !== undefined) payload.stripe_subscription_id = data.stripe_subscription_id
  if (data.stripe_price_id !== undefined) payload.stripe_price_id = data.stripe_price_id
  if (data.plan_type !== undefined) payload.plan_type = data.plan_type
  if (data.billing_owner !== undefined) payload.billing_owner = data.billing_owner
  if (data.amount_ron !== undefined) payload.amount_ron = data.amount_ron
  if (data.current_period_start !== undefined) payload.current_period_start = data.current_period_start.toISOString()
  if (data.current_period_end !== undefined) payload.current_period_end = data.current_period_end.toISOString()
  if (data.canceled_at !== undefined) payload.canceled_at = data.canceled_at?.toISOString() ?? null
  if (data.trial_ends_at !== undefined) payload.trial_ends_at = data.trial_ends_at?.toISOString() ?? null

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(payload, {
      onConflict: 'organization_id',
      ignoreDuplicates: false,
    })

  if (error) {
    console.error('[upsertSubscription] Eroare:', error)
    throw error
  }
}
