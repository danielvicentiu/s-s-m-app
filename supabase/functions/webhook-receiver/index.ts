// S-S-M.RO — EDGE FUNCTION: WEBHOOK RECEIVER
// Primește și procesează webhooks de la provideri externi
// Provideri suportați: Stripe, REGES (mock), certSIGN (mock)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { handleStripeWebhook } from './handlers/stripe.ts'
import { handleRegesWebhook } from './handlers/reges.ts'
import { handleCertSignWebhook } from './handlers/certsign.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface WebhookLogEntry {
  provider: 'stripe' | 'reges' | 'certsign'
  event_type: string
  webhook_id?: string
  signature_valid: boolean
  status: 'received' | 'processing' | 'processed' | 'failed' | 'ignored'
  http_method: string
  headers: Record<string, string>
  payload: any
  response_status?: number
  response_body?: string
  error_message?: string
  processing_time_ms?: number
  organization_id?: string
}

async function logWebhook(
  supabase: any,
  logEntry: WebhookLogEntry
): Promise<void> {
  try {
    const { error } = await supabase
      .from('webhook_logs')
      .insert(logEntry)

    if (error) {
      console.error('Failed to log webhook:', error)
    }
  } catch (err) {
    console.error('Exception logging webhook:', err)
  }
}

serve(async (req: Request) => {
  const startTime = Date.now()
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Doar POST acceptat
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const url = new URL(req.url)
    const provider = url.searchParams.get('provider')?.toLowerCase()

    if (!provider || !['stripe', 'reges', 'certsign'].includes(provider)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid provider. Use ?provider=stripe|reges|certsign'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Extrage headers relevante
    const headers: Record<string, string> = {}
    req.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value
    })

    // Citește payload
    const rawBody = await req.text()
    let payload: any

    try {
      payload = JSON.parse(rawBody)
    } catch {
      payload = { raw: rawBody }
    }

    // Inițializează log entry
    const logEntry: WebhookLogEntry = {
      provider: provider as 'stripe' | 'reges' | 'certsign',
      event_type: 'unknown',
      signature_valid: false,
      status: 'received',
      http_method: req.method,
      headers,
      payload
    }

    let result: {
      success: boolean
      eventType: string
      webhookId?: string
      signatureValid: boolean
      organizationId?: string
      message?: string
      error?: string
    }

    // Route către handler specific
    try {
      logEntry.status = 'processing'

      switch (provider) {
        case 'stripe':
          result = await handleStripeWebhook(req, rawBody, headers, payload)
          break
        case 'reges':
          result = await handleRegesWebhook(headers, payload)
          break
        case 'certsign':
          result = await handleCertSignWebhook(headers, payload)
          break
        default:
          throw new Error(`Unknown provider: ${provider}`)
      }

      // Actualizează log entry cu rezultatul
      logEntry.event_type = result.eventType
      logEntry.webhook_id = result.webhookId
      logEntry.signature_valid = result.signatureValid
      logEntry.organization_id = result.organizationId
      logEntry.status = result.success ? 'processed' : 'failed'
      logEntry.response_status = result.success ? 200 : 400
      logEntry.response_body = result.message || result.error
      logEntry.error_message = result.error
      logEntry.processing_time_ms = Date.now() - startTime

      // Log în database
      await logWebhook(supabase, logEntry)

      // Return 200 OK la provider
      return new Response(
        JSON.stringify({
          received: true,
          provider,
          event_type: result.eventType,
          webhook_id: result.webhookId,
          processed: result.success
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )

    } catch (handlerError: any) {
      // Handler failed
      logEntry.status = 'failed'
      logEntry.error_message = handlerError.message || String(handlerError)
      logEntry.response_status = 500
      logEntry.processing_time_ms = Date.now() - startTime

      await logWebhook(supabase, logEntry)

      // Tot returnăm 200 la provider (să nu mai retrimită)
      return new Response(
        JSON.stringify({
          received: true,
          error: 'Internal processing error',
          provider
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error: any) {
    console.error('Webhook receiver error:', error)

    // Return 500 doar pentru erori critice (provider să retrimită)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
