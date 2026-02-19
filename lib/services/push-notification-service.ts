// lib/services/push-notification-service.ts
// Web Push Notification Service
// Handles service worker registration, permission requests, subscription management, and push delivery
// Uses VAPID keys for authentication and stores subscriptions in database
// Data: 14 Februarie 2026

import { createSupabaseBrowser } from '@/lib/supabase/client'
import { createSupabaseServer } from '@/lib/supabase/server'

// ── Types ──

export interface PushSubscriptionData {
  id?: string
  userId: string
  organizationId: string
  subscription: PushSubscription
  userAgent: string
  platform: string
  createdAt?: string
  lastUsedAt?: string
}

export interface PushNotificationAction {
  action: string
  title: string
  icon?: string
}

export interface PushNotificationPayload {
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

export interface VAPIDKeys {
  publicKey: string
  privateKey: string
}

// ── Configuration ──

/**
 * Get VAPID public key from environment
 * Generate keys: npx web-push generate-vapid-keys
 */
export function getVAPIDPublicKey(): string {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!publicKey) {
    console.warn('[Push] VAPID public key not configured')
    return ''
  }

  return publicKey
}

// ── Service Worker Registration (Client-Side) ──

/**
 * Register service worker for push notifications
 * Call this on app initialization (client-side only)
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[Push] Service Worker not supported')
    return null
  }

  try {
    // Check if service worker is already registered
    const existingRegistration = await navigator.serviceWorker.getRegistration()

    if (existingRegistration) {
      console.log('[Push] Service Worker already registered')
      return existingRegistration
    }

    // Register new service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    console.log('[Push] Service Worker registered successfully', {
      scope: registration.scope
    })

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready

    return registration
  } catch (error) {
    console.error('[Push] Service Worker registration failed:', error)
    return null
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()

    if (registration) {
      const success = await registration.unregister()
      console.log('[Push] Service Worker unregistered:', success)
      return success
    }

    return false
  } catch (error) {
    console.error('[Push] Service Worker unregistration failed:', error)
    return false
  }
}

// ── Permission Management (Client-Side) ──

/**
 * Check current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default'
  }

  return Notification.permission
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

/**
 * Request notification permission from user
 * Returns the permission status: 'granted', 'denied', or 'default'
 */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    console.warn('[Push] Push notifications not supported')
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()

    console.log('[Push] Permission request result:', permission)

    return permission
  } catch (error) {
    console.error('[Push] Permission request failed:', error)
    return 'denied'
  }
}

// ── Subscription Management (Client-Side) ──

/**
 * Subscribe user to push notifications
 * Requires service worker registration and notification permission
 */
export async function subscribeToPush(
  userId: string,
  organizationId: string
): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) {
    console.warn('[Push] Push notifications not supported')
    return null
  }

  try {
    // Check permission
    const permission = getNotificationPermission()

    if (permission !== 'granted') {
      console.warn('[Push] Notification permission not granted')
      return null
    }

    // Get or register service worker
    let registration = await navigator.serviceWorker.getRegistration()

    if (!registration) {
      registration = await registerServiceWorker()
    }

    if (!registration) {
      console.error('[Push] Service Worker registration failed')
      return null
    }

    // Check for existing subscription
    const existingSubscription = await registration.pushManager.getSubscription()

    if (existingSubscription) {
      console.log('[Push] Existing subscription found')

      // Save to database
      await savePushSubscription(userId, organizationId, existingSubscription)

      return existingSubscription
    }

    // Create new subscription
    const vapidPublicKey = getVAPIDPublicKey()

    if (!vapidPublicKey) {
      console.error('[Push] VAPID public key not configured')
      return null
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
    })

    console.log('[Push] New subscription created')

    // Save to database
    await savePushSubscription(userId, organizationId, subscription)

    return subscription
  } catch (error) {
    console.error('[Push] Push subscription failed:', error)
    return null
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(userId: string): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()

    if (!registration) {
      console.warn('[Push] No service worker registration found')
      return false
    }

    const subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      console.warn('[Push] No push subscription found')
      return false
    }

    // Unsubscribe from push manager
    const success = await subscription.unsubscribe()

    if (success) {
      console.log('[Push] Unsubscribed from push notifications')

      // Remove from database
      await removePushSubscription(userId, subscription)
    }

    return success
  } catch (error) {
    console.error('[Push] Unsubscribe failed:', error)
    return false
  }
}

/**
 * Get current push subscription for user
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()

    if (!registration) {
      return null
    }

    const subscription = await registration.pushManager.getSubscription()

    return subscription
  } catch (error) {
    console.error('[Push] Error getting subscription:', error)
    return null
  }
}

// ── Database Operations (Client-Side) ──

/**
 * Save push subscription to database
 */
async function savePushSubscription(
  userId: string,
  organizationId: string,
  subscription: PushSubscription
): Promise<void> {
  try {
    const supabase = createSupabaseBrowser()

    const subscriptionData = {
      user_id: userId,
      organization_id: organizationId,
      endpoint: subscription.endpoint,
      keys: JSON.stringify({
        p256dh: subscription.toJSON().keys?.p256dh,
        auth: subscription.toJSON().keys?.auth
      }),
      user_agent: navigator.userAgent,
      platform: getPlatform(),
      last_used_at: new Date().toISOString()
    }

    // Upsert subscription (update if exists, insert if not)
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'user_id,endpoint'
      })

    if (error) {
      console.error('[Push] Error saving subscription to database:', error)
    } else {
      console.log('[Push] Subscription saved to database')
    }
  } catch (error) {
    console.error('[Push] Error in savePushSubscription:', error)
  }
}

/**
 * Remove push subscription from database
 */
async function removePushSubscription(
  userId: string,
  subscription: PushSubscription
): Promise<void> {
  try {
    const supabase = createSupabaseBrowser()

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('endpoint', subscription.endpoint)

    if (error) {
      console.error('[Push] Error removing subscription from database:', error)
    } else {
      console.log('[Push] Subscription removed from database')
    }
  } catch (error) {
    console.error('[Push] Error in removePushSubscription:', error)
  }
}

// ── Sending Push Notifications (Server-Side) ──

/**
 * Send push notification to a specific subscription
 * Server-side only - uses web-push library
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  title: string,
  body: string,
  icon?: string,
  url?: string,
  data?: Record<string, any>
): Promise<boolean> {
  try {
    // This function is designed to be called from server-side code or Edge Functions
    // For actual push delivery, call the send-push-notification Edge Function
    const supabase = await createSupabaseServer()

    const payload: PushNotificationPayload = {
      title,
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        url: url || '/',
        timestamp: Date.now(),
        ...data
      },
      tag: data?.tag || 'default',
      requireInteraction: data?.requireInteraction || false
    }

    // Call Edge Function to send push notification
    const { data: result, error } = await supabase.functions.invoke('send-push-notification', {
      body: {
        subscription: subscription.toJSON(),
        notification: payload
      }
    })

    if (error) {
      console.error('[Push] Error sending push notification:', error)
      return false
    }

    console.log('[Push] Push notification sent successfully')
    return result?.success || false
  } catch (error) {
    console.error('[Push] Error in sendPushNotification:', error)
    return false
  }
}

/**
 * Send push notification to all subscriptions for a user
 * Server-side only
 */
export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  icon?: string,
  url?: string,
  data?: Record<string, any>
): Promise<number> {
  try {
    const supabase = await createSupabaseServer()

    // Get all active subscriptions for user
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('[Push] Error fetching user subscriptions:', error)
      return 0
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[Push] No subscriptions found for user:', userId)
      return 0
    }

    // Send to all subscriptions
    let successCount = 0

    for (const sub of subscriptions) {
      try {
        const pushSubscription = reconstructPushSubscription(sub)

        if (pushSubscription) {
          const success = await sendPushNotification(
            pushSubscription,
            title,
            body,
            icon,
            url,
            data
          )

          if (success) {
            successCount++

            // Update last_used_at
            await supabase
              .from('push_subscriptions')
              .update({ last_used_at: new Date().toISOString() })
              .eq('id', sub.id)
          }
        }
      } catch (error) {
        console.error('[Push] Error sending to subscription:', error)
      }
    }

    console.log('[Push] Push notifications sent:', {
      userId,
      total: subscriptions.length,
      successful: successCount
    })

    return successCount
  } catch (error) {
    console.error('[Push] Error in sendPushToUser:', error)
    return 0
  }
}

/**
 * Send push notification to all users in an organization
 * Server-side only
 */
export async function sendPushToOrganization(
  organizationId: string,
  title: string,
  body: string,
  icon?: string,
  url?: string,
  data?: Record<string, any>
): Promise<number> {
  try {
    const supabase = await createSupabaseServer()

    // Get all active subscriptions for organization
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('organization_id', organizationId)

    if (error) {
      console.error('[Push] Error fetching organization subscriptions:', error)
      return 0
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[Push] No subscriptions found for organization:', organizationId)
      return 0
    }

    // Send to all subscriptions
    let successCount = 0

    for (const sub of subscriptions) {
      try {
        const pushSubscription = reconstructPushSubscription(sub)

        if (pushSubscription) {
          const success = await sendPushNotification(
            pushSubscription,
            title,
            body,
            icon,
            url,
            data
          )

          if (success) {
            successCount++

            // Update last_used_at
            await supabase
              .from('push_subscriptions')
              .update({ last_used_at: new Date().toISOString() })
              .eq('id', sub.id)
          }
        }
      } catch (error) {
        console.error('[Push] Error sending to subscription:', error)
      }
    }

    console.log('[Push] Push notifications sent to organization:', {
      organizationId,
      total: subscriptions.length,
      successful: successCount
    })

    return successCount
  } catch (error) {
    console.error('[Push] Error in sendPushToOrganization:', error)
    return 0
  }
}

// ── Utility Functions ──

/**
 * Convert base64 VAPID public key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

/**
 * Get platform information
 */
function getPlatform(): string {
  if (typeof window === 'undefined') {
    return 'unknown'
  }

  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes('android')) return 'android'
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios'
  if (userAgent.includes('windows')) return 'windows'
  if (userAgent.includes('mac')) return 'macos'
  if (userAgent.includes('linux')) return 'linux'

  return 'unknown'
}

/**
 * Reconstruct PushSubscription object from database record
 */
function reconstructPushSubscription(dbRecord: any): PushSubscription | null {
  try {
    const keys = JSON.parse(dbRecord.keys)

    // Create a mock PushSubscription object
    // Note: This is a simplified version - in production, you'd use web-push library
    const subscription = {
      endpoint: dbRecord.endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth
      },
      toJSON: function() {
        return {
          endpoint: this.endpoint,
          keys: this.keys
        }
      }
    } as any

    return subscription
  } catch (error) {
    console.error('[Push] Error reconstructing subscription:', error)
    return null
  }
}

// ── Test Notification (Client-Side) ──

/**
 * Show a test notification to verify setup
 * Client-side only
 */
export async function showTestNotification(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    console.warn('[Push] Push notifications not supported')
    return false
  }

  try {
    const permission = getNotificationPermission()

    if (permission !== 'granted') {
      console.warn('[Push] Notification permission not granted')
      return false
    }

    const registration = await navigator.serviceWorker.getRegistration()

    if (!registration) {
      console.error('[Push] No service worker registration found')
      return false
    }

    await registration.showNotification('S-S-M.ro - Test Notification', {
      body: 'Notificările push funcționează corect!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'test',
      data: {
        url: '/',
        timestamp: Date.now()
      }
    })

    console.log('[Push] Test notification displayed')
    return true
  } catch (error) {
    console.error('[Push] Error showing test notification:', error)
    return false
  }
}

// ── Exports ──

export default {
  // Client-side
  registerServiceWorker,
  unregisterServiceWorker,
  requestPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getCurrentSubscription,
  getNotificationPermission,
  isPushNotificationSupported,
  showTestNotification,
  getVAPIDPublicKey,

  // Server-side
  sendPushNotification,
  sendPushToUser,
  sendPushToOrganization
}
