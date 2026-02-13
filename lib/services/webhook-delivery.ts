// S-S-M.RO — WEBHOOK DELIVERY SERVICE
// Outgoing webhook system with retry, HMAC signatures, and dead letter queue
// Data: 13 Februarie 2026

import { createClient } from '@supabase/supabase-js'
import { WebhookEventType, Webhook, WebhookDeliveryLog } from '@/lib/types'
import * as crypto from 'crypto'

// Configuration
const WEBHOOK_TIMEOUT_MS = 10000 // 10 seconds
const MAX_RETRY_ATTEMPTS = 3
const INITIAL_RETRY_DELAY_MS = 1000 // 1 second
const MAX_RETRY_DELAY_MS = 8000 // 8 seconds

// Dead letter queue threshold
const DEAD_LETTER_THRESHOLD = MAX_RETRY_ATTEMPTS

interface WebhookPayload {
  event: WebhookEventType
  timestamp: string
  organization_id: string
  data: Record<string, any>
}

interface QueuedWebhook {
  webhook_id: string
  log_id: string
  url: string
  secret: string
  event: WebhookEventType
  payload: Record<string, any>
  attempt: number
}

/**
 * Queue a webhook for delivery
 * Creates a delivery log entry in 'pending' status
 */
export async function queueWebhook(
  organizationId: string,
  eventType: WebhookEventType,
  payload: Record<string, any>
): Promise<void> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find active webhooks for this organization that subscribe to this event
    const { data: webhooks, error: webhooksError } = await supabase
      .from('webhooks')
      .select('id, url, secret, events')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .is('deleted_at', null)

    if (webhooksError) {
      console.error('Error fetching webhooks:', webhooksError)
      throw webhooksError
    }

    if (!webhooks || webhooks.length === 0) {
      // No webhooks configured for this organization
      return
    }

    // Filter webhooks that subscribe to this event type
    const subscribedWebhooks = webhooks.filter((webhook) =>
      webhook.events.includes(eventType)
    )

    if (subscribedWebhooks.length === 0) {
      // No webhooks subscribe to this event
      return
    }

    // Create delivery log entries for each webhook
    const logEntries = subscribedWebhooks.map((webhook) => ({
      webhook_id: webhook.id,
      event_type: eventType,
      payload: payload,
      status: 'pending' as const,
      attempts: 0,
    }))

    const { error: insertError } = await supabase
      .from('webhook_delivery_log')
      .insert(logEntries)

    if (insertError) {
      console.error('Error creating webhook delivery logs:', insertError)
      throw insertError
    }

    console.log(
      `Queued ${subscribedWebhooks.length} webhooks for event ${eventType}`
    )
  } catch (error) {
    console.error('Error queueing webhook:', error)
    throw error
  }
}

/**
 * Process the webhook queue
 * Fetches pending deliveries and attempts delivery
 */
export async function processQueue(): Promise<{
  processed: number
  succeeded: number
  failed: number
}> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch pending webhook deliveries with retry logic
    const { data: pendingDeliveries, error: fetchError } = await supabase
      .from('webhook_delivery_log')
      .select(
        `
        id,
        webhook_id,
        event_type,
        payload,
        attempts,
        webhooks!inner(url, secret, is_active, deleted_at)
      `
      )
      .eq('status', 'pending')
      .lt('attempts', MAX_RETRY_ATTEMPTS)
      .order('created_at', { ascending: true })
      .limit(100)

    if (fetchError) {
      console.error('Error fetching pending deliveries:', fetchError)
      throw fetchError
    }

    if (!pendingDeliveries || pendingDeliveries.length === 0) {
      return { processed: 0, succeeded: 0, failed: 0 }
    }

    let succeeded = 0
    let failed = 0

    // Process each delivery
    for (const delivery of pendingDeliveries) {
      const webhook = delivery.webhooks as any

      // Skip if webhook is inactive or deleted
      if (!webhook.is_active || webhook.deleted_at) {
        await markDeliveryFailed(
          supabase,
          delivery.id,
          delivery.attempts + 1,
          null,
          'Webhook is inactive or deleted'
        )
        failed++
        continue
      }

      const queuedWebhook: QueuedWebhook = {
        webhook_id: delivery.webhook_id,
        log_id: delivery.id,
        url: webhook.url,
        secret: webhook.secret,
        event: delivery.event_type as WebhookEventType,
        payload: delivery.payload,
        attempt: delivery.attempts + 1,
      }

      // Apply exponential backoff if this is a retry
      if (queuedWebhook.attempt > 1) {
        const delayMs = Math.min(
          INITIAL_RETRY_DELAY_MS * Math.pow(2, queuedWebhook.attempt - 2),
          MAX_RETRY_DELAY_MS
        )
        await sleep(delayMs)
      }

      const success = await deliverWebhook(queuedWebhook)
      if (success) {
        succeeded++
      } else {
        failed++
      }
    }

    // Move failed deliveries to dead letter queue
    await moveToDeadLetterQueue(supabase)

    return {
      processed: pendingDeliveries.length,
      succeeded,
      failed,
    }
  } catch (error) {
    console.error('Error processing webhook queue:', error)
    throw error
  }
}

/**
 * Deliver a single webhook with HMAC signature
 * Returns true on success, false on failure
 */
export async function deliverWebhook(webhook: QueuedWebhook): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Prepare payload with metadata
    const webhookPayload: WebhookPayload = {
      event: webhook.event,
      timestamp: new Date().toISOString(),
      organization_id: webhook.payload.organization_id || '',
      data: webhook.payload,
    }

    const payloadString = JSON.stringify(webhookPayload)

    // Generate HMAC-SHA256 signature
    const signature = generateHmacSignature(payloadString, webhook.secret)

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 's-s-m.ro-webhook/1.0',
      'X-SSM-Event': webhook.event,
      'X-SSM-Signature': signature,
      'X-SSM-Delivery-ID': webhook.log_id,
      'X-SSM-Attempt': webhook.attempt.toString(),
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

    try {
      // Attempt delivery
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: payloadString,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseBody = await response.text().catch(() => '')

      // Check if delivery was successful (2xx status codes)
      if (response.ok) {
        await markDeliverySuccess(
          supabase,
          webhook.log_id,
          webhook.attempt,
          response.status,
          responseBody
        )
        console.log(
          `Webhook delivered successfully: ${webhook.event} to ${webhook.url}`
        )
        return true
      } else {
        await markDeliveryFailed(
          supabase,
          webhook.log_id,
          webhook.attempt,
          response.status,
          `HTTP ${response.status}: ${responseBody.substring(0, 500)}`
        )
        console.error(
          `Webhook delivery failed: ${webhook.event} to ${webhook.url} - Status ${response.status}`
        )
        return false
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      // Handle timeout and network errors
      const errorMessage =
        fetchError.name === 'AbortError'
          ? 'Request timeout'
          : fetchError.message || 'Network error'

      await markDeliveryFailed(
        supabase,
        webhook.log_id,
        webhook.attempt,
        null,
        errorMessage
      )

      console.error(
        `Webhook delivery error: ${webhook.event} to ${webhook.url} - ${errorMessage}`
      )
      return false
    }
  } catch (error) {
    console.error('Error in deliverWebhook:', error)
    return false
  }
}

/**
 * Generate HMAC-SHA256 signature for webhook payload
 */
function generateHmacSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

/**
 * Mark delivery as successful
 */
async function markDeliverySuccess(
  supabase: any,
  logId: string,
  attempts: number,
  httpStatus: number,
  responseBody: string
): Promise<void> {
  const { error } = await supabase
    .from('webhook_delivery_log')
    .update({
      status: 'success',
      http_status_code: httpStatus,
      response_body: responseBody.substring(0, 1000), // Limit response body size
      attempts,
      delivered_at: new Date().toISOString(),
    })
    .eq('id', logId)

  if (error) {
    console.error('Error updating delivery log (success):', error)
  }
}

/**
 * Mark delivery as failed
 */
async function markDeliveryFailed(
  supabase: any,
  logId: string,
  attempts: number,
  httpStatus: number | null,
  errorMessage: string
): Promise<void> {
  const status = attempts >= MAX_RETRY_ATTEMPTS ? 'failed' : 'pending'

  const { error } = await supabase
    .from('webhook_delivery_log')
    .update({
      status,
      http_status_code: httpStatus,
      error_message: errorMessage.substring(0, 1000), // Limit error message size
      attempts,
    })
    .eq('id', logId)

  if (error) {
    console.error('Error updating delivery log (failed):', error)
  }
}

/**
 * Move failed deliveries to dead letter queue
 * Updates status to 'failed' after max retry attempts
 */
async function moveToDeadLetterQueue(supabase: any): Promise<void> {
  const { error } = await supabase
    .from('webhook_delivery_log')
    .update({ status: 'failed' })
    .eq('status', 'pending')
    .gte('attempts', DEAD_LETTER_THRESHOLD)

  if (error) {
    console.error('Error moving to dead letter queue:', error)
  } else {
    console.log('Moved failed deliveries to dead letter queue')
  }
}

/**
 * Helper function to sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Verify webhook signature (for incoming webhook verification if needed)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateHmacSignature(payload, secret)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Get delivery statistics for a webhook
 */
export async function getWebhookStats(
  webhookId: string
): Promise<{
  total: number
  pending: number
  success: number
  failed: number
}> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('webhook_delivery_log')
      .select('status')
      .eq('webhook_id', webhookId)

    if (error) {
      console.error('Error fetching webhook stats:', error)
      throw error
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter((d) => d.status === 'pending').length || 0,
      success: data?.filter((d) => d.status === 'success').length || 0,
      failed: data?.filter((d) => d.status === 'failed').length || 0,
    }

    return stats
  } catch (error) {
    console.error('Error getting webhook stats:', error)
    throw error
  }
}

// Export configuration constants for testing
export const WEBHOOK_CONFIG = {
  TIMEOUT_MS: WEBHOOK_TIMEOUT_MS,
  MAX_RETRY_ATTEMPTS,
  INITIAL_RETRY_DELAY_MS,
  MAX_RETRY_DELAY_MS,
  DEAD_LETTER_THRESHOLD,
}
