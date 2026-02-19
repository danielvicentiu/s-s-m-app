// lib/firebase/firebase-client.ts
// Firebase client initialization + FCM utilities
// SSR-safe: all browser APIs guarded by typeof window !== 'undefined'

import type { FirebaseApp } from 'firebase/app'
import type { Messaging } from 'firebase/messaging'

// Lazy singletons — inițializate o singură dată la primul apel
let app: FirebaseApp | null = null
let messaging: Messaging | null = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null

  if (!app) {
    const { initializeApp, getApps } = require('firebase/app')
    const existing = getApps()
    app = existing.length > 0 ? existing[0] : initializeApp(firebaseConfig)
  }
  return app
}

function getMessagingInstance(): Messaging | null {
  if (typeof window === 'undefined') return null

  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null

  if (!messaging) {
    const { getMessaging: _getMessaging, isSupported } = require('firebase/messaging')
    // isSupported() is async but we check synchronously via try/catch
    try {
      messaging = _getMessaging(firebaseApp)
    } catch {
      return null
    }
  }
  return messaging
}

// ---------------------------------------------------------------------------
// requestNotificationPermission
// Cere permisiune browser, obține FCM token, îl înregistrează în DB
// ---------------------------------------------------------------------------

export interface NotificationPermissionResult {
  success: boolean
  token?: string
  error?: string
}

export async function requestNotificationPermission(
  userId: string
): Promise<NotificationPermissionResult> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'SSR environment' }
  }

  if (!('Notification' in window)) {
    return { success: false, error: 'Notificările nu sunt suportate de acest browser' }
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return { success: false, error: 'Permisiunea pentru notificări a fost refuzată' }
    }

    const messagingInstance = getMessagingInstance()
    if (!messagingInstance) {
      return { success: false, error: 'Firebase Messaging nu este disponibil' }
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapidKey) {
      return { success: false, error: 'VAPID key lipsă din configurare' }
    }

    const { getToken } = require('firebase/messaging')

    // Înregistrează service worker-ul Firebase înainte de a cere token
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

    const token = await getToken(messagingInstance, {
      vapidKey,
      serviceWorkerRegistration: swRegistration,
    })

    if (!token) {
      return { success: false, error: 'Nu s-a putut obține FCM token' }
    }

    // Înregistrează token-ul în DB
    const response = await fetch('/api/notifications/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return { success: false, error: err.error || 'Eroare la salvarea token-ului' }
    }

    return { success: true, token }
  } catch (error) {
    console.error('[FCM] requestNotificationPermission error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută',
    }
  }
}

// ---------------------------------------------------------------------------
// onForegroundMessage
// Mesaje primite când aplicația este deschisă (foreground)
// ---------------------------------------------------------------------------

export function onForegroundMessage(
  callback: (payload: Record<string, unknown>) => void
): (() => void) | null {
  if (typeof window === 'undefined') return null

  const messagingInstance = getMessagingInstance()
  if (!messagingInstance) return null

  const { onMessage } = require('firebase/messaging')
  const unsubscribe = onMessage(messagingInstance, callback)
  return unsubscribe
}
