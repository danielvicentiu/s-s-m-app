// S-S-M.RO — STRIPE WEBHOOK HANDLER
// Procesează webhooks de la Stripe (payment events)

import Stripe from 'https://esm.sh/stripe@14.14.0'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')

interface WebhookResult {
  success: boolean
  eventType: string
  webhookId?: string
  signatureValid: boolean
  organizationId?: string
  message?: string
  error?: string
}

export async function handleStripeWebhook(
  req: Request,
  rawBody: string,
  headers: Record<string, string>,
  payload: any
): Promise<WebhookResult> {

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    console.error('Missing Stripe credentials')
    return {
      success: false,
      eventType: 'error.config',
      signatureValid: false,
      error: 'Stripe not configured'
    }
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
  })

  const signature = headers['stripe-signature']

  if (!signature) {
    return {
      success: false,
      eventType: 'error.no_signature',
      signatureValid: false,
      error: 'Missing Stripe signature'
    }
  }

  try {
    // Validare signature Stripe
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET
    )

    console.log(`Stripe event received: ${event.type} [${event.id}]`)

    // Procesare evenimente suportate
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout completed:', session.id, session.customer)

        return {
          success: true,
          eventType: event.type,
          webhookId: event.id,
          signatureValid: true,
          organizationId: session.metadata?.organization_id,
          message: `Checkout session ${session.id} completed`
        }
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id, paymentIntent.amount)

        return {
          success: true,
          eventType: event.type,
          webhookId: event.id,
          signatureValid: true,
          organizationId: paymentIntent.metadata?.organization_id,
          message: `Payment ${paymentIntent.id} succeeded`
        }
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)

        return {
          success: true,
          eventType: event.type,
          webhookId: event.id,
          signatureValid: true,
          organizationId: paymentIntent.metadata?.organization_id,
          message: `Payment ${paymentIntent.id} failed`
        }
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription event:', event.type, subscription.id)

        return {
          success: true,
          eventType: event.type,
          webhookId: event.id,
          signatureValid: true,
          organizationId: subscription.metadata?.organization_id,
          message: `Subscription ${subscription.id} ${event.type.split('.')[2]}`
        }
      }

      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Invoice event:', event.type, invoice.id)

        return {
          success: true,
          eventType: event.type,
          webhookId: event.id,
          signatureValid: true,
          organizationId: invoice.metadata?.organization_id,
          message: `Invoice ${invoice.id} ${event.type.split('.')[1]}`
        }
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
        return {
          success: true,
          eventType: event.type,
          webhookId: event.id,
          signatureValid: true,
          message: `Event ${event.type} received but not processed`
        }
    }

  } catch (err: any) {
    console.error('Stripe webhook error:', err.message)

    return {
      success: false,
      eventType: 'error.signature_invalid',
      signatureValid: false,
      error: err.message || 'Invalid signature'
    }
  }
}
