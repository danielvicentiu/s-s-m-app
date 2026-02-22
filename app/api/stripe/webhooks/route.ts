// app/api/stripe/webhooks/route.ts
// Handler webhook-uri Stripe Connect — rutare per connected account (3 entități)
// Body raw (text) obligatoriu pentru verificare semnătură

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { upsertSubscription, syncOrganizationModules } from '@/lib/billing/sync-modules'
import { detectEntityFromWebhook } from '@/lib/billing/entities'
import { emitFgoInvoice } from '@/lib/billing/fgo'
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

  // Determină care connected account a trimis webhook-ul
  const entity = detectEntityFromWebhook(stripe, body, signature)
  if (!entity) {
    console.error('[webhook] Nicio entitate nu se potrivește cu semnătura')
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 400 })
  }

  // Construim event-ul verificat cu secretul entității identificate
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, entity.webhookSecret)
  } catch (err) {
    console.error('[webhook] constructEvent eșuat:', err)
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 400 })
  }

  console.log(`[webhook] Event=${event.type} entity=${entity.id}`)

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
          plan_type: sub.metadata?.plan_type ?? 'direct',
          billing_owner: (sub.metadata?.billing_owner as 'patron' | 'sepp') ?? 'patron',
          billing_entity_id: entity.id,
          billing_entity_cui: entity.cui,
          status,
          current_period_start: new Date((sub as any).current_period_start * 1000),
          current_period_end: new Date((sub as any).current_period_end * 1000),
          amount_ron: sub.items.data[0]?.price.unit_amount ?? 0,
        })
        await syncOrganizationModules(orgId, status)
        break
      }

      // 🔄 SUBSCRIPȚIE ACTUALIZATĂ
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const orgId = sub.metadata?.organization_id
        if (!orgId) { console.warn('[webhook] updated: lipsă organization_id în metadata'); break }

        const status = mapStripeStatus(sub.status)
        await upsertSubscription(orgId, {
          stripe_customer_id: sub.customer as string,
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items.data[0]?.price.id,
          plan_type: sub.metadata?.plan_type ?? 'direct',
          billing_owner: (sub.metadata?.billing_owner as 'patron' | 'sepp') ?? 'patron',
          billing_entity_id: entity.id,
          billing_entity_cui: entity.cui,
          status,
          current_period_start: new Date((sub as any).current_period_start * 1000),
          current_period_end: new Date((sub as any).current_period_end * 1000),
          canceled_at: (sub as any).canceled_at ? new Date((sub as any).canceled_at * 1000) : null,
          amount_ron: sub.items.data[0]?.price.unit_amount ?? 0,
        })
        await syncOrganizationModules(orgId, status)
        break
      }

      // ❌ SUBSCRIPȚIE ANULATĂ
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

      // ✅ FACTURĂ PLĂTITĂ — activare + FGO
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as any).subscription as string | null
        if (!subId) break

        // Obținem subscription de pe connected account (nu de pe platformă)
        const stripeForEntity = (await import('@/lib/stripe')).getStripeForEntity(entity)
        const sub = await stripeForEntity.subscriptions.retrieve(subId)
        const orgId = sub.metadata?.organization_id
        if (!orgId) break

        await upsertSubscription(orgId, {
          status: 'active',
          amount_ron: (invoice.amount_paid ?? 0),
          current_period_start: new Date((sub as any).current_period_start * 1000),
          current_period_end: new Date((sub as any).current_period_end * 1000),
        })
        await syncOrganizationModules(orgId, 'active')

        // Emitere e-factură FGO (Task 1.2)
        try {
          await emitFgoInvoice({ entity, invoice })
        } catch (fgoErr) {
          // FGO eșuează → log + continuă (nu bloca webhook-ul)
          console.error('[webhook] FGO emitere eșuată:', fgoErr)
          // TODO Sprint 1.2+: notificare Daniel via Resend
        }
        break
      }

      // ⚠️ PLATĂ EȘUATĂ
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as any).subscription as string | null
        if (!subId) break

        const stripeForEntity = (await import('@/lib/stripe')).getStripeForEntity(entity)
        const sub = await stripeForEntity.subscriptions.retrieve(subId)
        const orgId = sub.metadata?.organization_id
        if (!orgId) break

        await upsertSubscription(orgId, { status: 'past_due' })
        await syncOrganizationModules(orgId, 'past_due')

        // TODO Sprint 1.2+: email via Resend la billing owner
        console.log(`[webhook] Plată eșuată org=${orgId} entity=${entity.id}`)
        break
      }

      default:
        console.log(`[webhook] Event ignorat: ${event.type}`)
    }
  } catch (err) {
    console.error(`[webhook] Eroare procesare ${event.type}:`, err)
    // 200 ca să nu retriggere Stripe
    return NextResponse.json({ error: 'Eroare internă procesare' }, { status: 200 })
  }

  return NextResponse.json({ received: true })
}
