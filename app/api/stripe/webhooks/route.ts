// app/api/stripe/webhooks/route.ts
// Handler webhook-uri Stripe — 5 events
// IMPORTANT: body raw (text) pentru verificare semnătură

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { upsertSubscription, syncOrganizationModules } from '@/lib/billing/sync-modules'
import type Stripe from 'stripe'

function mapStripeStatus(
  stripeStatus: string
): 'trial' | 'active' | 'past_due' | 'canceled' | 'expired' {
  switch (stripeStatus) {
    case 'trialing': return 'trial'
    case 'active':   return 'active'
    case 'past_due': return 'past_due'
    case 'canceled': return 'canceled'
    case 'unpaid':   return 'past_due'
    case 'incomplete_expired': return 'expired'
    default: return 'expired'
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Lipsă semnătură Stripe' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] Verificare semnătură eșuată:', err)
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 400 })
  }

  console.log(`[webhook] Event primit: ${event.type}`)

  try {
    switch (event.type) {

      // ✅ SUBSCRIPȚIE CREATĂ
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription
        const orgId = sub.metadata?.organization_id
        if (!orgId) { console.warn('[webhook] created: lipsă organization_id în metadata'); break }

        const status = mapStripeStatus(sub.status)
        await upsertSubscription(orgId, {
          stripe_customer_id: sub.customer as string,
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items.data[0]?.price.id,
          plan_type: sub.metadata?.plan_type || 'direct',
          billing_owner: (sub.metadata?.billing_owner as 'patron' | 'sepp') || 'patron',
          status,
          current_period_start: new Date((sub as any).current_period_start * 1000),
          current_period_end: new Date((sub as any).current_period_end * 1000),
          amount_ron: sub.items.data[0]?.price.unit_amount ?? 0,
        })
        await syncOrganizationModules(orgId, status)
        break
      }

      // 🔄 SUBSCRIPȚIE ACTUALIZATĂ (upgrade/downgrade/reactivare)
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const orgId = sub.metadata?.organization_id
        if (!orgId) { console.warn('[webhook] updated: lipsă organization_id în metadata'); break }

        const status = mapStripeStatus(sub.status)
        await upsertSubscription(orgId, {
          stripe_customer_id: sub.customer as string,
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items.data[0]?.price.id,
          plan_type: sub.metadata?.plan_type || 'direct',
          billing_owner: (sub.metadata?.billing_owner as 'patron' | 'sepp') || 'patron',
          status,
          current_period_start: new Date((sub as any).current_period_start * 1000),
          current_period_end: new Date((sub as any).current_period_end * 1000),
          canceled_at: (sub as any).canceled_at ? new Date((sub as any).canceled_at * 1000) : null,
          amount_ron: sub.items.data[0]?.price.unit_amount ?? 0,
        })
        await syncOrganizationModules(orgId, status)
        break
      }

      // ❌ SUBSCRIPȚIE ȘTEARSĂ / ANULATĂ
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const orgId = sub.metadata?.organization_id
        if (!orgId) { console.warn('[webhook] deleted: lipsă organization_id în metadata'); break }

        await upsertSubscription(orgId, {
          status: 'canceled',
          canceled_at: new Date(),
        })
        await syncOrganizationModules(orgId, 'canceled')
        break
      }

      // ✅ FACTURĂ PLĂTITĂ — activare / reactivare
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as any).subscription as string | null
        if (!subId) break

        const sub = await stripe.subscriptions.retrieve(subId)
        const orgId = sub.metadata?.organization_id
        if (!orgId) break

        await upsertSubscription(orgId, {
          status: 'active',
          current_period_start: new Date((sub as any).current_period_start * 1000),
          current_period_end: new Date((sub as any).current_period_end * 1000),
        })
        await syncOrganizationModules(orgId, 'active')

        // TODO Sprint 1.2: trigger FGO e-factură API
        break
      }

      // ⚠️ PLATĂ EȘUATĂ — dunning
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as any).subscription as string | null
        if (!subId) break

        const sub = await stripe.subscriptions.retrieve(subId)
        const orgId = sub.metadata?.organization_id
        if (!orgId) break

        await upsertSubscription(orgId, { status: 'past_due' })
        await syncOrganizationModules(orgId, 'past_due')

        // TODO Sprint 1.2: trimite email via Resend la billing owner
        console.log(`[webhook] Plată eșuată pentru org=${orgId}`)
        break
      }

      default:
        console.log(`[webhook] Event ignorat: ${event.type}`)
    }
  } catch (err) {
    console.error(`[webhook] Eroare procesare ${event.type}:`, err)
    // Returnează 200 ca să nu retriggere Stripe — loghează manual
    return NextResponse.json({ error: 'Eroare internă procesare' }, { status: 200 })
  }

  return NextResponse.json({ received: true })
}
