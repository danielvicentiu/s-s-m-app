// S-S-M.RO — CERTSIGN WEBHOOK HANDLER (MOCK)
// Procesează webhooks de la certSIGN (semnături digitale, timestamp)
// NOTA: Implementare mock pentru testing

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CERTSIGN_WEBHOOK_SECRET = Deno.env.get('CERTSIGN_WEBHOOK_SECRET') || 'certsign-dev-secret-key'

interface WebhookResult {
  success: boolean
  eventType: string
  webhookId?: string
  signatureValid: boolean
  organizationId?: string
  message?: string
  error?: string
}

interface CertSignWebhookPayload {
  event_type: 'document.signed' | 'signature.verified' | 'timestamp.applied' | 'error.occurred'
  webhook_id: string
  timestamp: string
  data: {
    document_id?: string
    signature_id?: string
    signer_email?: string
    signer_name?: string
    signature_type?: 'qualified' | 'advanced' | 'simple'
    timestamp_token?: string
    status?: 'success' | 'failed' | 'pending'
    error_code?: string
    error_message?: string
    organization_id?: string
  }
}

function verifyCertSignSignature(
  payload: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) return false

  try {
    // certSIGN folosește HMAC-SHA256 cu prefix
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return signature === `sha256=${expectedSignature}`
  } catch (err) {
    console.error('certSIGN signature verification error:', err)
    return false
  }
}

export async function handleCertSignWebhook(
  headers: Record<string, string>,
  payload: any
): Promise<WebhookResult> {

  const signature = headers['x-certsign-signature']
  const rawPayload = JSON.stringify(payload)

  // Validare signature
  const signatureValid = verifyCertSignSignature(
    rawPayload,
    signature,
    CERTSIGN_WEBHOOK_SECRET
  )

  if (!signatureValid) {
    console.warn('Invalid certSIGN signature')
    return {
      success: false,
      eventType: 'error.signature_invalid',
      signatureValid: false,
      error: 'Invalid certSIGN signature'
    }
  }

  const webhookData = payload as CertSignWebhookPayload

  if (!webhookData.event_type || !webhookData.webhook_id) {
    return {
      success: false,
      eventType: 'error.invalid_payload',
      signatureValid,
      error: 'Missing required fields: event_type, webhook_id'
    }
  }

  console.log(`certSIGN webhook: ${webhookData.event_type} [${webhookData.webhook_id}]`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    const organizationId = webhookData.data.organization_id

    // Procesare per tip eveniment
    switch (webhookData.event_type) {
      case 'document.signed': {
        console.log('Document signed:', webhookData.data.document_id, 'by', webhookData.data.signer_email)

        // Aici: actualizare status document în generated_documents
        if (webhookData.data.document_id) {
          const { error } = await supabase
            .from('generated_documents')
            .update({
              is_locked: true,
              generation_context: {
                signed_at: webhookData.timestamp,
                signer_email: webhookData.data.signer_email,
                signature_type: webhookData.data.signature_type,
                signature_id: webhookData.data.signature_id
              }
            })
            .eq('id', webhookData.data.document_id)

          if (error) {
            console.error('Failed to update document:', error)
          }
        }

        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Document ${webhookData.data.document_id} signed by ${webhookData.data.signer_email}`
        }
      }

      case 'signature.verified': {
        console.log('Signature verified:', webhookData.data.signature_id)

        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Signature ${webhookData.data.signature_id} verified`
        }
      }

      case 'timestamp.applied': {
        console.log('Timestamp applied:', webhookData.data.document_id)

        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Timestamp applied to document ${webhookData.data.document_id}`
        }
      }

      case 'error.occurred': {
        console.error('certSIGN error:', webhookData.data.error_code, webhookData.data.error_message)

        return {
          success: true,
          eventType: webhookData.event_type,
          webhookId: webhookData.webhook_id,
          signatureValid,
          organizationId,
          message: `Error occurred: ${webhookData.data.error_code}`,
          error: webhookData.data.error_message
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
    console.error('certSIGN webhook processing error:', err)

    return {
      success: false,
      eventType: webhookData.event_type,
      webhookId: webhookData.webhook_id,
      signatureValid,
      error: err.message || 'Processing failed'
    }
  }
}
