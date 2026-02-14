// components/settings/PushNotificationSettings.tsx
// Componenta pentru setările push notifications în pagina de settings
// Data: 14 Februarie 2026

'use client'

import { useState, useEffect } from 'react'
import {
  registerServiceWorker,
  requestPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getCurrentSubscription,
  getNotificationPermission,
  isPushNotificationSupported,
  showTestNotification
} from '@/lib/services/push-notification-service'

interface PushNotificationSettingsProps {
  userId: string
  organizationId: string
}

export default function PushNotificationSettings({
  userId,
  organizationId
}: PushNotificationSettingsProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check support and subscription status on mount
  useEffect(() => {
    checkSupportAndStatus()
  }, [])

  async function checkSupportAndStatus() {
    setIsLoading(true)
    setError(null)

    try {
      // Check browser support
      const supported = isPushNotificationSupported()
      setIsSupported(supported)

      if (!supported) {
        setIsLoading(false)
        return
      }

      // Check permission
      const currentPermission = getNotificationPermission()
      setPermission(currentPermission)

      // Check subscription
      const subscription = await getCurrentSubscription()
      setIsSubscribed(!!subscription)
    } catch (err) {
      console.error('Error checking push notification status:', err)
      setError('Eroare la verificarea statusului notificărilor')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEnablePush() {
    setIsLoading(true)
    setError(null)

    try {
      // Register service worker
      const registration = await registerServiceWorker()

      if (!registration) {
        throw new Error('Service Worker registration failed')
      }

      // Request permission
      const newPermission = await requestPermission()
      setPermission(newPermission)

      if (newPermission !== 'granted') {
        setError('Permisiunea pentru notificări a fost refuzată')
        setIsLoading(false)
        return
      }

      // Subscribe to push
      const subscription = await subscribeToPush(userId, organizationId)

      if (!subscription) {
        throw new Error('Push subscription failed')
      }

      setIsSubscribed(true)

      // Show success notification
      await showTestNotification()
    } catch (err) {
      console.error('Error enabling push notifications:', err)
      setError('Eroare la activarea notificărilor push')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDisablePush() {
    setIsLoading(true)
    setError(null)

    try {
      const success = await unsubscribeFromPush(userId)

      if (!success) {
        throw new Error('Unsubscribe failed')
      }

      setIsSubscribed(false)
    } catch (err) {
      console.error('Error disabling push notifications:', err)
      setError('Eroare la dezactivarea notificărilor push')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleTestNotification() {
    setIsLoading(true)
    setError(null)

    try {
      const success = await showTestNotification()

      if (!success) {
        throw new Error('Test notification failed')
      }
    } catch (err) {
      console.error('Error showing test notification:', err)
      setError('Eroare la afișarea notificării de test')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-yellow-100 p-2">
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">
              Notificările push nu sunt suportate
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Browser-ul tău nu suportă notificări push sau accesezi site-ul printr-o conexiune
              nesecurizată. Pentru notificări push, accesează platforma prin HTTPS.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Safari pe iOS nu suportă Web Push. Folosește Chrome, Firefox sau Edge.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">
              Notificări Push
            </h3>

            {isSubscribed && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Activ
              </span>
            )}

            {permission === 'denied' && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Blocat
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Primește notificări instant în browser pentru alerte importante, termene apropiate și
            actualizări de legislație.
          </p>
        </div>

        <div className="ml-4">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Permission denied message */}
      {permission === 'denied' && (
        <div className="mt-4 rounded-lg bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Permisiunea pentru notificări a fost blocată
              </h4>
              <p className="mt-1 text-sm text-yellow-700">
                Pentru a activa notificările push, deschide setările browser-ului și
                permite notificările pentru acest site.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex items-center gap-3">
        {!isSubscribed ? (
          <button
            onClick={handleEnablePush}
            disabled={isLoading || permission === 'denied'}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Se activează...
              </>
            ) : (
              'Activează Notificări Push'
            )}
          </button>
        ) : (
          <>
            <button
              onClick={handleTestNotification}
              disabled={isLoading}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Se trimite...' : 'Trimite Test'}
            </button>

            <button
              onClick={handleDisablePush}
              disabled={isLoading}
              className="inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Se dezactivează...' : 'Dezactivează'}
            </button>
          </>
        )}
      </div>

      {/* Info section */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h4 className="text-sm font-medium text-blue-900">
          Ce notificări vei primi?
        </h4>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Alerte urgente pentru termene care expiră
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Actualizări importante de legislație
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Rapoarte de compliance critice
          </li>
        </ul>
        <p className="mt-3 text-xs text-blue-700">
          Notificările respectă orele de liniște configurate în setări.
        </p>
      </div>
    </div>
  )
}
