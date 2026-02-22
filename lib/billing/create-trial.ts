// lib/billing/create-trial.ts
// Creare trial automat (14 zile) la finalul onboarding wizard

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Crează un abonament trial de 14 zile pentru o organizație nouă.
 * Apelează-l la finalul onboarding wizard, după crearea organizației.
 */
export async function createTrialSubscription(
  organizationId: string,
  billingOwner: 'patron' | 'sepp' = 'patron'
): Promise<void> {
  const trialEnd = new Date()
  trialEnd.setDate(trialEnd.getDate() + 14)

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      organization_id: organizationId,
      plan_type: 'direct',
      billing_owner: billingOwner,
      status: 'trial',
      trial_ends_at: trialEnd.toISOString(),
    })

  if (error) {
    // Ignoră duplicate — organizația are deja trial
    if (error.code === '23505') {
      console.log(`[createTrial] org=${organizationId} already has subscription, skip`)
      return
    }
    console.error('[createTrial] Eroare:', error)
    throw error
  }

  console.log(`[createTrial] org=${organizationId} trial creat până la ${trialEnd.toISOString()}`)
}
