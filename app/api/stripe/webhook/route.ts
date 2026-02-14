// S-S-M.RO — STRIPE WEBHOOK HANDLER
// Procesează evenimente Stripe pentru gestionarea subscripțiilor
// Data: 14 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServer } from '@/lib/supabase/server'
import { Resend } from 'resend'

// ── CONFIGURARE STRIPE ──

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// ── TIPURI ──

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise'

interface WebhookEvent {
  id: string
  type: string
  data: {
    object: any
  }
}

interface ErrorResponse {
  error: string
  received: boolean
}

// ── FUNCȚII HELPER ──

/**
 * Logează evenimentul webhook în baza de date pentru audit
 */
async function logWebhookEvent(
  eventType: string,
  eventId: string,
  status: 'success' | 'failed',
  organizationId: string | null,
  details: Record<string, any>
): Promise<void> {
  try {
    const supabase = await createSupabaseServer()

    await supabase.from('webhook_events_log').insert({
      event_type: eventType,
      event_id: eventId,
      status,
      organization_id: organizationId,
      details,
      processed_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error logging webhook event:', error)
  }
}

/**
 * Obține plan_id din metadata sau subscription items
 */
function extractPlanFromSubscription(subscription: Stripe.Subscription): SubscriptionPlan {
  // Încearcă din metadata
  const planFromMetadata = subscription.metadata?.plan_id as SubscriptionPlan
  if (planFromMetadata && ['starter', 'professional', 'enterprise'].includes(planFromMetadata)) {
    return planFromMetadata
  }

  // Fallback: verifică prețul din line items
  const firstItem = subscription.items.data[0]
  if (firstItem?.price?.unit_amount) {
    const amount = firstItem.price.unit_amount
    // 299 RON = starter, 799 = professional, 1999 = enterprise
    if (amount >= 199000) return 'enterprise'
    if (amount >= 79000) return 'professional'
    return 'starter'
  }

  // Fallback final
  return 'starter'
}

/**
 * Trimite email de notificare pentru evenimente subscripție
 */
async function sendSubscriptionEmail(
  organizationId: string,
  eventType: string,
  details: Record<string, any>
): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured, skipping email notification')
    return
  }

  try {
    const supabase = await createSupabaseServer()

    // Obține email-ul organizației
    const { data: org } = await supabase
      .from('organizations')
      .select('name, contact_email')
      .eq('id', organizationId)
      .single()

    if (!org?.contact_email) {
      console.warn('No contact email for organization:', organizationId)
      return
    }

    let subject = ''
    let message = ''

    switch (eventType) {
      case 'subscription.activated':
        subject = '✅ Subscripția ta s-s-m.ro a fost activată'
        message = `Bună ziua,\n\nSubscripția ta pentru planul ${details.plan} a fost activată cu succes.\n\nVei avea acces la toate funcționalitățile platformei s-s-m.ro.\n\nMultumim pentru încredere!`
        break
      case 'subscription.updated':
        subject = '🔄 Subscripția ta s-s-m.ro a fost actualizată'
        message = `Bună ziua,\n\nSubscripția ta a fost actualizată la planul ${details.plan}.\n\nSchimbările vor fi aplicate imediat.`
        break
      case 'subscription.cancelled':
        subject = '❌ Subscripția ta s-s-m.ro a fost anulată'
        message = `Bună ziua,\n\nSubscripția ta a fost anulată.\n\nVei reveni la planul gratuit cu funcționalități limitate.\n\nDacă ai întrebări, contactează-ne.`
        break
      case 'payment.failed':
        subject = '⚠️ Plata pentru subscripția s-s-m.ro a eșuat'
        message = `Bună ziua,\n\nPlata pentru subscripția ta a eșuat.\n\nTe rugăm să verifici metoda de plată în contul tău Stripe.\n\nAi o perioadă de grație de 3 zile pentru a rezolva problema.`
        break
      default:
        return
    }

    await resend.emails.send({
      from: 'S-S-M.ro <noreply@s-s-m.ro>',
      to: org.contact_email,
      subject,
      text: message,
    })

    console.log(`Email sent to ${org.contact_email} for event ${eventType}`)
  } catch (error) {
    console.error('Error sending subscription email:', error)
  }
}

// ── EVENT HANDLERS ──

/**
 * Handler: checkout.session.completed
 * Activează subscripția în baza de date când checkout-ul este finalizat
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const organizationId = session.metadata?.organization_id
  const planId = session.metadata?.plan_id as SubscriptionPlan

  if (!organizationId || !planId) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  const supabase = await createSupabaseServer()

  try {
    // Actualizează organizația cu subscription details
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        stripe_subscription_id: session.subscription as string,
        plan_type: planId,
        subscription_status: 'active',
        subscription_activated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', organizationId)

    if (updateError) {
      console.error('Error updating organization subscription:', updateError)
      throw updateError
    }

    // Log în audit pentru tracking
    await supabase.from('audit_log').insert({
      organization_id: organizationId,
      action: 'subscription_activated',
      table_name: 'organizations',
      details: {
        plan: planId,
        subscription_id: session.subscription,
        session_id: session.id,
      },
    })

    // Trimite email de confirmare
    await sendSubscriptionEmail(organizationId, 'subscription.activated', { plan: planId })

    await logWebhookEvent(
      'checkout.session.completed',
      session.id,
      'success',
      organizationId,
      { plan: planId, subscription_id: session.subscription }
    )

    console.log(`✅ Subscription activated for org ${organizationId}, plan: ${planId}`)
  } catch (error) {
    await logWebhookEvent(
      'checkout.session.completed',
      session.id,
      'failed',
      organizationId,
      { error: error instanceof Error ? error.message : 'Unknown error' }
    )
    throw error
  }
}

/**
 * Handler: customer.subscription.updated
 * Sincronizează modificările la subscripție (upgrade/downgrade)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const organizationId = subscription.metadata?.organization_id

  if (!organizationId) {
    console.error('Missing organization_id in subscription metadata:', subscription.id)
    return
  }

  const supabase = await createSupabaseServer()
  const plan = extractPlanFromSubscription(subscription)
  const status = subscription.status

  try {
    // Determină statusul subscripției
    let subscriptionStatus: 'active' | 'trial' | 'cancelled' | 'past_due' = 'active'
    if (status === 'trialing') subscriptionStatus = 'trial'
    else if (status === 'canceled') subscriptionStatus = 'cancelled'
    else if (status === 'past_due') subscriptionStatus = 'past_due'

    // Actualizează organizația
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        plan_type: plan,
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', organizationId)

    if (updateError) {
      console.error('Error updating organization subscription:', updateError)
      throw updateError
    }

    // Log în audit
    await supabase.from('audit_log').insert({
      organization_id: organizationId,
      action: 'subscription_updated',
      table_name: 'organizations',
      details: {
        plan,
        status: subscriptionStatus,
        subscription_id: subscription.id,
      },
    })

    // Trimite email notificare
    await sendSubscriptionEmail(organizationId, 'subscription.updated', { plan, status: subscriptionStatus })

    await logWebhookEvent(
      'customer.subscription.updated',
      subscription.id,
      'success',
      organizationId,
      { plan, status: subscriptionStatus }
    )

    console.log(`✅ Subscription updated for org ${organizationId}, plan: ${plan}, status: ${subscriptionStatus}`)
  } catch (error) {
    await logWebhookEvent(
      'customer.subscription.updated',
      subscription.id,
      'failed',
      organizationId,
      { error: error instanceof Error ? error.message : 'Unknown error' }
    )
    throw error
  }
}

/**
 * Handler: customer.subscription.deleted
 * Downgrade la plan gratuit când subscripția este anulată
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const organizationId = subscription.metadata?.organization_id

  if (!organizationId) {
    console.error('Missing organization_id in subscription metadata:', subscription.id)
    return
  }

  const supabase = await createSupabaseServer()

  try {
    // Downgrade la plan gratuit
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        plan_type: null, // Null = free plan
        subscription_status: 'cancelled',
        stripe_subscription_id: null,
        subscription_cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', organizationId)

    if (updateError) {
      console.error('Error downgrading organization:', updateError)
      throw updateError
    }

    // Log în audit
    await supabase.from('audit_log').insert({
      organization_id: organizationId,
      action: 'subscription_cancelled',
      table_name: 'organizations',
      details: {
        subscription_id: subscription.id,
        cancelled_at: new Date().toISOString(),
      },
    })

    // Trimite email notificare
    await sendSubscriptionEmail(organizationId, 'subscription.cancelled', {})

    await logWebhookEvent(
      'customer.subscription.deleted',
      subscription.id,
      'success',
      organizationId,
      { downgraded_to: 'free' }
    )

    console.log(`✅ Subscription cancelled for org ${organizationId}, downgraded to free`)
  } catch (error) {
    await logWebhookEvent(
      'customer.subscription.deleted',
      subscription.id,
      'failed',
      organizationId,
      { error: error instanceof Error ? error.message : 'Unknown error' }
    )
    throw error
  }
}

/**
 * Handler: invoice.payment_failed
 * Setează grace period și trimite email de avertizare
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string
  const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id

  if (!subscriptionId) {
    console.error('No subscription found in failed invoice:', invoice.id)
    return
  }

  // Obține subscription pentru a găsi organization_id
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const organizationId = subscription.metadata?.organization_id

  if (!organizationId) {
    console.error('Missing organization_id in subscription metadata:', subscriptionId)
    return
  }

  const supabase = await createSupabaseServer()

  try {
    // Setează grace period de 3 zile
    const gracePeriodEnd = new Date()
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3)

    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        subscription_status: 'past_due',
        grace_period_end: gracePeriodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', organizationId)

    if (updateError) {
      console.error('Error setting grace period:', updateError)
      throw updateError
    }

    // Log în audit
    await supabase.from('audit_log').insert({
      organization_id: organizationId,
      action: 'payment_failed',
      table_name: 'organizations',
      details: {
        invoice_id: invoice.id,
        subscription_id: subscriptionId,
        grace_period_end: gracePeriodEnd.toISOString(),
        amount_due: invoice.amount_due,
      },
    })

    // Trimite email de avertizare
    await sendSubscriptionEmail(organizationId, 'payment.failed', {
      amount: invoice.amount_due / 100, // Convertește din bani în RON
      grace_period_days: 3,
    })

    await logWebhookEvent(
      'invoice.payment_failed',
      invoice.id,
      'success',
      organizationId,
      { grace_period_end: gracePeriodEnd.toISOString() }
    )

    console.log(`✅ Payment failed handled for org ${organizationId}, grace period set`)
  } catch (error) {
    await logWebhookEvent(
      'invoice.payment_failed',
      invoice.id,
      'failed',
      organizationId,
      { error: error instanceof Error ? error.message : 'Unknown error' }
    )
    throw error
  }
}

// ── API ROUTE ──

/**
 * POST /api/stripe/webhook
 * Procesează evenimente Stripe și actualizează baza de date
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('Missing Stripe signature')
    return NextResponse.json<ErrorResponse>(
      { error: 'Missing signature', received: false },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verifică semnătura webhook-ului
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json<ErrorResponse>(
      {
        error: error instanceof Error ? error.message : 'Signature verification failed',
        received: false,
      },
      { status: 400 }
    )
  }

  console.log(`📨 Received Stripe webhook: ${event.type}`)

  try {
    // Procesează evenimentul bazat pe tip
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_succeeded':
        // Opțional: log successful payments
        console.log(`💰 Payment succeeded for invoice: ${event.data.object.id}`)
        await logWebhookEvent(
          'invoice.payment_succeeded',
          event.data.object.id,
          'success',
          null,
          { amount: (event.data.object as Stripe.Invoice).amount_paid }
        )
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Returnează 200 pentru a confirma primirea
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error)

    // Returnează 200 chiar și în caz de eroare pentru a preveni retry-uri infinite
    // Eroarea este logată în baza de date pentru debugging
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : 'Processing error',
      },
      { status: 200 }
    )
  }
}
