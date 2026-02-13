// S-S-M.RO — REGES WEBHOOK HANDLER (MOCK)
// Procesează webhooks de la REGES (certificate emisie, statusuri)
// NOTA: REGES real nu are webhooks — aceasta e implementare mock pentru testing

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const REGES_WEBHOOK_SECRET = Deno.env.get('REGES_WEBHOOK_SECRET') || 'reges-dev-secret-key'

interface WebhookResult {
  success: boolean
  eventType: string
  webhookId?: string
  signatureValid: boolean
  organizationId?: string
  message?: string
  error?: string
}

interface RegesWebhookPayload {
  event_type: 'certificate.issued' | 'certificate.updated' | 'certificate.revoked' | 'status.changed'
  webhook_id: string
  timestamp: string
  data: {
    certificate_id?: string
    employee_cnp?: string
    cor_code?: string
    status?: string
    issue_date?: string
    expiry_date?: string
    organization_cui?: string
  }
}

function verifyRegesSignature(
  payload: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) return false

  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return signature === `sha256=${expectedSignature}`
  } catch (err) {
    console.error('REGES signature verification error:', err)
    return false
  }
}

export async function handleRegesWebhook(
  headers: Record<string, string>,
  payload: any
): Promise<WebhookResult> {

  const signature = headers['x-reges-signature']
  const rawPayload = JSON.stringify(payload)

  // Validare signature
  const signatureValid = verifyRegesSignature(
    rawPayload,
    signature,
    REGES_WEBHOOK_SECRET
  )

  if (!signatureValid) {
    console.warn('Invalid REGES signature')
    return {
      success: false,
      eventType: 'error.signature_invalid',
      signatureValid: false,
      error: 'Invalid REGES signature'
    }
  }

  const webhookData = payload as RegesWebhookPayload

  if (!webhookData.event_type || !webhookData.webhook_id) {
    return {
      success: false,
      eventType: 'error.invalid_payload',
      signatureValid,
      error: 'Missing required fields: event_type, webhook_id'
    }
  }

  console.log(`REGES webhook: ${webhookData.event_type} [${webhookData.webhook_id}]`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    // Găsește organizația după CUI (dacă există)
    let organizationId: string | undefined

    if (webhookData.data.organization_cui) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('cui', webhookData.data.organization_cui)
        .single()

      organizationId = org?.id
    }

    // Procesare per tip eveniment
    switch (webhookData.event_type) {
      case 'certificate.issued': {
        console.log('Certificate issued:', webhookData.data.certificate_id)

        // Aici: actualizare tabela certificates sau employees
        // TODO: implementează când avem tabela certificates

        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Certificate ${webhookData.data.certificate_id} issued`
        }
      }

      case 'certificate.updated': {
        console.log('Certificate updated:', webhookData.data.certificate_id)

        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Certificate ${webhookData.data.certificate_id} updated`
        }
      }

      case 'certificate.revoked': {
        console.log('Certificate revoked:', webhookData.data.certificate_id)

        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Certificate ${webhookData.data.certificate_id} revoked`
        }
      }

      case 'status.changed': {
        console.log('Status changed:', webhookData.data.status)

        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Status changed to ${webhookData.data.status}`
        }
      }

      default:
        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Event ${webhookData.event_type} received but not processed`
        }
    }

  } catch (err: any) {
    console.error('REGES webhook processing error:', err)

    return {
      success: false,
      eventType: webhookData.event_type,
      webhookId: webhookData.webhook_id,
      signatureValid,
      error: err.message || 'Processing failed'
    }
  }
}
