// lib/stripe.ts
// Stripe client singleton (platformă) + helpers Connect

import Stripe from 'stripe'
import type { BillingEntity, PlanKey } from './billing/entities'

// Client principal platformă (folosit pentru webhook verification + admin ops)
// Notă: dacă STRIPE_SECRET_KEY lipsește, API calls vor eșua cu auth error la runtime
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder_not_set', {
  apiVersion: '2026-01-28.clover' as any,
  typescript: true,
})

/**
 * Returnează un client Stripe configurat pentru un connected account specific.
 * Toate operațiile (checkout, portal, etc.) se fac pe contul entității.
 */
export function getStripeForEntity(entity: BillingEntity): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover' as any,
    typescript: true,
    stripeAccount: entity.stripeAccountId,
  })
}

/**
 * Crează o sesiune Stripe Checkout pe connected account-ul entității selectate.
 */
export async function createConnectCheckoutSession(params: {
  entity: BillingEntity
  planKey: PlanKey
  customerId?: string | null
  organizationId: string
  billingOwner: 'patron' | 'sepp'
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const stripeClient = getStripeForEntity(params.entity)
  const priceId = params.entity.prices[params.planKey]

  return stripeClient.checkout.sessions.create({
    mode: 'subscription',
    customer: params.customerId ?? undefined,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    currency: 'ron',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        organization_id: params.organizationId,
        billing_entity_id: params.entity.id,
        billing_owner: params.billingOwner,
      },
    },
    metadata: {
      organization_id: params.organizationId,
      billing_entity_id: params.entity.id,
      billing_entity_cui: params.entity.cui,
      billing_owner: params.billingOwner,
    },
  })
}

// Mapare planType (UI) → PlanKey (entitate)
export const PLAN_KEY_MAP: Record<string, PlanKey> = {
  direct: 'direct',
  partner_billed: 'partner',
  self_service: 'selfservice',
}
