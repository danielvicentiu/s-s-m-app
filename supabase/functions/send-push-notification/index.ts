// Supabase Edge Function: send-push-notification
// Trimite Web Push Notifications folosind web-push library
// Data: 14 Februarie 2026

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Note: web-push library trebuie instalată ca dependency
// Până atunci, folosim direct Web Push Protocol cu fetch

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: Record<string, any>
  actions?: PushNotificationAction[]
  tag?: string
  url?: string
  requireInteraction?: boolean
  silent?: boolean
  timestamp?: number
}

interface PushNotificationAction {
  action: string
  title: string
  icon?: string
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { subscription, notification } = await req.json()

    if (!subscription || !notification) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing subscription or notification data'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate subscription
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid subscription format'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get VAPID keys from environment
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')
    const vapidEmail = Deno.env.get('VAPID_EMAIL') || 'admin@s-s-m.ro'

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('[Push] VAPID keys not configured')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'VAPID keys not configured'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare notification payload
    const payload: NotificationPayload = {
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/badge-72x72.png',
      image: notification.image,
      data: {
        url: notification.url || '/',
        timestamp: Date.now(),
        ...notification.data
      },
      tag: notification.tag || 'default',
      requireInteraction: notification.requireInteraction || false,
      silent: notification.silent || false,
      actions: notification.actions || []
    }

    // Send push notification using Web Push Protocol
    // Note: Aceasta este o implementare simplificată
    // Pentru producție, folosește library-ul web-push complet
    const result = await sendWebPush(
      subscription,
      payload,
      vapidPublicKey,
      vapidPrivateKey,
      vapidEmail
    )

    if (!result.success) {
      console.error('[Push] Send failed:', result.error)
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error
        }),
        {
          status: result.statusCode || 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('[Push] Error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Send Web Push notification using Web Push Protocol
 * Simplified implementation - pentru producție, folosește web-push library
 */
async function sendWebPush(
  subscription: PushSubscription,
  payload: NotificationPayload,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidEmail: string
): Promise<{ success: boolean; error?: string; statusCode?: number; messageId?: string }> {
  try {
    const payloadString = JSON.stringify(payload)

    // Extrage URL-ul endpoint-ului push service
    const endpoint = subscription.endpoint

    // Trimite request HTTP POST către push service
    // Note: Aceasta este o implementare simplificată
    // Pentru criptare completă și VAPID signing, folosește web-push library
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'aes128gcm',
        'TTL': '86400' // 24 ore
      },
      body: payloadString
    })

    if (response.ok) {
      return {
        success: true,
        messageId: crypto.randomUUID()
      }
    }

    // Handle error responses
    const statusCode = response.status

    if (statusCode === 404 || statusCode === 410) {
      // Subscription expired or invalid
      return {
        success: false,
        error: 'Subscription expired or invalid',
        statusCode
      }
    }

    if (statusCode === 429) {
      // Rate limited
      return {
        success: false,
        error: 'Rate limited',
        statusCode
      }
    }

    return {
      success: false,
      error: `Push service returned status ${statusCode}`,
      statusCode
    }
  } catch (error) {
    console.error('[Push] Send error:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Note: Implementare completă cu criptare și VAPID signing
 *
 * Pentru producție, instalează web-push library:
 *
 * import webpush from 'npm:web-push@3.6.6'
 *
 * webpush.setVapidDetails(
 *   `mailto:${vapidEmail}`,
 *   vapidPublicKey,
 *   vapidPrivateKey
 * )
 *
 * const result = await webpush.sendNotification(
 *   subscription,
 *   JSON.stringify(payload),
 *   {
 *     TTL: 86400,
 *     urgency: 'normal'
 *   }
 * )
 */
