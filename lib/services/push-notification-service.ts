// S-S-M.RO — PUSH NOTIFICATION SERVICE
// Web Push implementation with VAPID authentication
// Data: 13 Februarie 2026

import { createSupabaseBrowser } from '@/lib/supabase/client'

// VAPID Configuration (în production, salvează-le în .env.local)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''

export interface PushSubscription {
  id?: string
  user_id: string
  endpoint: string
  p256dh_key: string
  auth_key: string
  user_agent?: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  url?: string
  badge?: string
  data?: Record<string, any>
}

/**
 * Verifică dacă browser-ul suportă Web Push
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

/**
 * Înregistrează Service Worker pentru Web Push
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported in this browser')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('Service Worker registered successfully:', registration)
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

/**
 * Solicită permisiune pentru notificări push
 */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications not supported')
  }

  const permission = await Notification.requestPermission()
  console.log('Notification permission:', permission)
  return permission
}

/**
 * Convertește VAPID public key din base64 în Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray as BufferSource
}

/**
 * Abonează utilizatorul la notificări push și salvează subscription în DB
 */
export async function subscribeToPush(userId: string): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    throw new Error('Push notifications not supported')
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new Error('VAPID public key not configured')
  }

  try {
    // Verifică permisiunea
    let permission = Notification.permission
    if (permission === 'default') {
      permission = await requestPermission()
    }

    if (permission !== 'granted') {
      throw new Error('Notification permission denied')
    }

    // Înregistrează Service Worker
    const registration = await registerServiceWorker()
    if (!registration) {
      throw new Error('Service Worker registration failed')
    }

    // Creează subscription
    const subscriptionOptions: PushSubscriptionOptionsInit = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    }

    const subscription = await registration.pushManager.subscribe(subscriptionOptions)
    const subscriptionJSON = subscription.toJSON()

    if (!subscriptionJSON.endpoint || !subscriptionJSON.keys) {
      throw new Error('Invalid subscription object')
    }

    // Pregătește obiectul pentru DB
    const pushSubscription: PushSubscription = {
      user_id: userId,
      endpoint: subscriptionJSON.endpoint,
      p256dh_key: subscriptionJSON.keys.p256dh || '',
      auth_key: subscriptionJSON.keys.auth || '',
      user_agent: navigator.userAgent,
      is_active: true
    }

    // Salvează în DB
    const supabase = createSupabaseBrowser()
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(pushSubscription, {
        onConflict: 'endpoint',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to save push subscription:', error)
      throw error
    }

    console.log('Push subscription saved successfully:', data)
    return data
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error)
    throw error
  }
}

/**
 * Dezabonează utilizatorul de la notificări push
 */
export async function unsubscribeFromPush(userId: string): Promise<void> {
  if (!isPushSupported()) return

  try {
    // Dezabonează din browser
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
    }

    // Marchează ca inactiv în DB
    const supabase = createSupabaseBrowser()
    await supabase
      .from('push_subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId)

    console.log('Unsubscribed from push notifications')
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error)
    throw error
  }
}

/**
 * Obține subscription-ul curent al utilizatorului
 */
export async function getCurrentSubscription(userId: string): Promise<PushSubscription | null> {
  try {
    const supabase = createSupabaseBrowser()
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Failed to get current subscription:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to get current subscription:', error)
    return null
  }
}

/**
 * Trimite notificare push către un utilizator (server-side)
 * Această funcție trebuie apelată din API route sau Server Action
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushNotificationPayload
): Promise<boolean> {
  try {
    // Construiește payload-ul notificării
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/badge-72x72.png',
      data: {
        url: payload.url || '/',
        ...payload.data
      }
    })

    // Pregătește subscription object pentru web-push
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh_key,
        auth: subscription.auth_key
      }
    }

    // În production, folosește biblioteca web-push pentru a trimite notificarea
    // npm install web-push
    // const webpush = require('web-push')
    // webpush.setVapidDetails(
    //   'mailto:your-email@example.com',
    //   VAPID_PUBLIC_KEY,
    //   VAPID_PRIVATE_KEY
    // )
    // await webpush.sendNotification(pushSubscription, notificationPayload)

    // Pentru development, log payload-ul
    console.log('Push notification payload:', {
      subscription: pushSubscription,
      payload: notificationPayload
    })

    // Înregistrează în notification_log
    const supabase = createSupabaseBrowser()
    await supabase.from('notification_log').insert({
      user_id: subscription.user_id,
      notification_type: 'system_alert',
      channel: 'push',
      recipient: subscription.endpoint,
      status: 'sent',
      sent_at: new Date().toISOString(),
      metadata: {
        title: payload.title,
        body: payload.body,
        url: payload.url
      }
    })

    return true
  } catch (error) {
    console.error('Failed to send push notification:', error)

    // Marchează subscription-ul ca inactiv dacă endpoint-ul nu mai e valid
    if (error instanceof Error && error.message.includes('410')) {
      const supabase = createSupabaseBrowser()
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('id', subscription.id)
    }

    return false
  }
}

/**
 * Trimite notificare push către toți utilizatorii unei organizații
 */
export async function sendPushToOrganization(
  organizationId: string,
  payload: PushNotificationPayload
): Promise<{ sent: number; failed: number }> {
  try {
    const supabase = createSupabaseBrowser()

    // Obține toate subscription-urile active pentru organizație
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*, memberships!inner(organization_id)')
      .eq('is_active', true)
      .eq('memberships.organization_id', organizationId)

    if (error) {
      console.error('Failed to get organization subscriptions:', error)
      return { sent: 0, failed: 0 }
    }

    if (!subscriptions || subscriptions.length === 0) {
      return { sent: 0, failed: 0 }
    }

    // Trimite notificare către fiecare subscription
    const results = await Promise.allSettled(
      subscriptions.map(sub => sendPushNotification(sub, payload))
    )

    const sent = results.filter(r => r.status === 'fulfilled' && r.value === true).length
    const failed = results.length - sent

    console.log(`Push notifications sent: ${sent}/${results.length}`)
    return { sent, failed }
  } catch (error) {
    console.error('Failed to send push to organization:', error)
    return { sent: 0, failed: 0 }
  }
}

/**
 * Generează VAPID keys (folosește în terminal pentru setup inițial)
 * npx web-push generate-vapid-keys
 */
export function getVapidKeysInstructions(): string {
  return `
    Pentru a genera VAPID keys:

    1. Instalează web-push: npm install -g web-push
    2. Generează keys: npx web-push generate-vapid-keys
    3. Adaugă în .env.local:
       NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
       VAPID_PRIVATE_KEY=your_private_key
    4. Nu commit-a VAPID_PRIVATE_KEY în git!
  `
}

// Export toate funcțiile
export default {
  isPushSupported,
  registerServiceWorker,
  requestPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getCurrentSubscription,
  sendPushNotification,
  sendPushToOrganization,
  getVapidKeysInstructions
}
