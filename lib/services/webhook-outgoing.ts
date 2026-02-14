// S-S-M.RO — WEBHOOK OUTGOING SERVICE
// Service for managing outgoing webhooks: register, send, and retry
// Data: 13 Februarie 2026

import { createClient } from '@supabase/supabase-js'
import { WebhookEventType, Webhook, WebhookDeliveryLog } from '@/lib/types'
import crypto from 'crypto'
import { queueWebhook } from './webhook-delivery'

/**
 * Register a new webhook for an organization
 * Creates a webhook subscription with a secure secret
 */
export async function registerWebhook(
  organizationId: string,
  url: string,
  events: WebhookEventType[],
  createdBy: string
): Promise<{ webhook: Webhook | null; error: string | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { webhook: null, error: 'Configurare Supabase lipsă' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate URL
    if (!url.match(/^https?:\/\/.+/)) {
      return { webhook: null, error: 'URL-ul trebuie să înceapă cu http:// sau https://' }
    }

    // Validate events
    if (!events || events.length === 0) {
      return { webhook: null, error: 'Selectați cel puțin un eveniment' }
    }

    // Generate secure secret for HMAC signatures (32 bytes = 64 hex chars)
    const secret = crypto.randomBytes(32).toString('hex')

    // Create webhook
    const { data, error } = await supabase
      .from('webhooks')
      .insert({
        organization_id: organizationId,
        url,
        events,
        secret,
        is_active: true,
        created_by: createdBy,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating webhook:', error)
      return { webhook: null, error: 'Eroare la crearea webhook-ului' }
    }

    return { webhook: data as Webhook, error: null }
  } catch (error) {
    console.error('Error in registerWebhook:', error)
    return { webhook: null, error: 'Eroare la crearea webhook-ului' }
  }
}

/**
 * Update webhook settings
 */
export async function updateWebhook(
  webhookId: string,
  organizationId: string,
  updates: {
    url?: string
    events?: WebhookEventType[]
    is_active?: boolean
  }
): Promise<{ webhook: Webhook | null; error: string | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { webhook: null, error: 'Configurare Supabase lipsă' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate URL if provided
    if (updates.url && !updates.url.match(/^https?:\/\/.+/)) {
      return { webhook: null, error: 'URL-ul trebuie să înceapă cu http:// sau https://' }
    }

    // Validate events if provided
    if (updates.events && updates.events.length === 0) {
      return { webhook: null, error: 'Selectați cel puțin un eveniment' }
    }

    // Update webhook
    const { data, error } = await supabase
      .from('webhooks')
      .update(updates)
      .eq('id', webhookId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) {
      console.error('Error updating webhook:', error)
      return { webhook: null, error: 'Eroare la actualizarea webhook-ului' }
    }

    if (!data) {
      return { webhook: null, error: 'Webhook nu a fost găsit' }
    }

    return { webhook: data as Webhook, error: null }
  } catch (error) {
    console.error('Error in updateWebhook:', error)
    return { webhook: null, error: 'Eroare la actualizarea webhook-ului' }
  }
}

/**
 * Delete webhook (soft delete)
 */
export async function deleteWebhook(
  webhookId: string,
  organizationId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { success: false, error: 'Configurare Supabase lipsă' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('webhooks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', webhookId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)

    if (error) {
      console.error('Error deleting webhook:', error)
      return { success: false, error: 'Eroare la ștergerea webhook-ului' }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error in deleteWebhook:', error)
    return { success: false, error: 'Eroare la ștergerea webhook-ului' }
  }
}

/**
 * Send webhook event immediately
 * This queues the webhook for delivery and returns immediately
 */
export async function sendWebhook(
  organizationId: string,
  event: WebhookEventType,
  payload: Record<string, any>
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Add organization_id to payload if not present
    const enrichedPayload = {
      ...payload,
      organization_id: organizationId,
    }

    // Queue webhook for delivery
    await queueWebhook(organizationId, event, enrichedPayload)

    return { success: true, error: null }
  } catch (error) {
    console.error('Error in sendWebhook:', error)
    return { success: false, error: 'Eroare la trimiterea webhook-ului' }
  }
}

/**
 * Retry failed webhook deliveries for a specific webhook
 */
export async function retryFailedWebhooks(
  webhookId: string,
  organizationId: string
): Promise<{ retried: number; error: string | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { retried: 0, error: 'Configurare Supabase lipsă' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify webhook belongs to organization
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('id')
      .eq('id', webhookId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single()

    if (webhookError || !webhook) {
      return { retried: 0, error: 'Webhook nu a fost găsit' }
    }

    // Reset failed deliveries to pending status with attempts = 0
    const { data, error } = await supabase
      .from('webhook_delivery_log')
      .update({
        status: 'pending',
        attempts: 0,
        error_message: null,
      })
      .eq('webhook_id', webhookId)
      .eq('status', 'failed')
      .select('id')

    if (error) {
      console.error('Error retrying failed webhooks:', error)
      return { retried: 0, error: 'Eroare la retrimiterea webhook-urilor' }
    }

    return { retried: data?.length || 0, error: null }
  } catch (error) {
    console.error('Error in retryFailedWebhooks:', error)
    return { retried: 0, error: 'Eroare la retrimiterea webhook-urilor' }
  }
}

/**
 * Get webhooks for an organization
 */
export async function getWebhooks(
  organizationId: string
): Promise<{ webhooks: Webhook[]; error: string | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { webhooks: [], error: 'Configurare Supabase lipsă' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching webhooks:', error)
      return { webhooks: [], error: 'Eroare la încărcarea webhook-urilor' }
    }

    return { webhooks: (data || []) as Webhook[], error: null }
  } catch (error) {
    console.error('Error in getWebhooks:', error)
    return { webhooks: [], error: 'Eroare la încărcarea webhook-urilor' }
  }
}

/**
 * Get delivery logs for a webhook
 */
export async function getWebhookDeliveryLogs(
  webhookId: string,
  organizationId: string,
  limit: number = 50
): Promise<{ logs: WebhookDeliveryLog[]; error: string | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { logs: [], error: 'Configurare Supabase lipsă' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify webhook belongs to organization
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('id')
      .eq('id', webhookId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single()

    if (webhookError || !webhook) {
      return { logs: [], error: 'Webhook nu a fost găsit' }
    }

    const { data, error } = await supabase
      .from('webhook_delivery_log')
      .select('*')
      .eq('webhook_id', webhookId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching delivery logs:', error)
      return { logs: [], error: 'Eroare la încărcarea logs-urilor' }
    }

    return { logs: (data || []) as WebhookDeliveryLog[], error: null }
  } catch (error) {
    console.error('Error in getWebhookDeliveryLogs:', error)
    return { logs: [], error: 'Eroare la încărcarea logs-urilor' }
  }
}

/**
 * Test webhook by sending a test event
 */
export async function testWebhook(
  webhookId: string,
  organizationId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { success: false, error: 'Configurare Supabase lipsă' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get webhook details
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', webhookId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single()

    if (webhookError || !webhook) {
      return { success: false, error: 'Webhook nu a fost găsit' }
    }

    // Send a test event
    const testPayload = {
      test: true,
      message: 'Acesta este un test webhook de la S-S-M.RO',
      timestamp: new Date().toISOString(),
      webhook_id: webhookId,
      organization_id: organizationId,
    }

    // Use the first event type from the webhook's events array, or a default
    const testEvent: WebhookEventType = (webhook.events && webhook.events.length > 0)
      ? webhook.events[0] as WebhookEventType
      : 'employee.created'

    await sendWebhook(organizationId, testEvent, testPayload)

    return { success: true, error: null }
  } catch (error) {
    console.error('Error in testWebhook:', error)
    return { success: false, error: 'Eroare la testarea webhook-ului' }
  }
}

/**
 * Get webhook by ID
 */
export async function getWebhook(
  webhookId: string,
  organizationId: string
): Promise<{ webhook: Webhook | null; error: string | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { webhook: null, error: 'Configurare Supabase lipsă' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', webhookId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single()

    if (error) {
      console.error('Error fetching webhook:', error)
      return { webhook: null, error: 'Webhook nu a fost găsit' }
    }

    return { webhook: data as Webhook, error: null }
  } catch (error) {
    console.error('Error in getWebhook:', error)
    return { webhook: null, error: 'Eroare la încărcarea webhook-ului' }
  }
}
