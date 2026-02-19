'use client'

// hooks/useNotifications.ts
// Hook pentru gestionarea permisiunilor și token-urilor FCM

import { useState, useEffect, useCallback } from 'react'
import {
  requestNotificationPermission,
  type NotificationPermissionResult,
} from '@/lib/firebase/firebase-client'

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

interface UseNotificationsReturn {
  permission: PermissionState
  loading: boolean
  error: string | null
  isSupported: boolean
  enableNotifications: (userId: string) => Promise<NotificationPermissionResult>
  disableNotifications: () => Promise<void>
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<PermissionState>('default')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const supported =
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window

    setIsSupported(supported)

    if (supported) {
      setPermission(Notification.permission as PermissionState)
    } else {
      setPermission('unsupported')
    }
  }, [])

  const enableNotifications = useCallback(
    async (userId: string): Promise<NotificationPermissionResult> => {
      setLoading(true)
      setError(null)

      try {
        const result = await requestNotificationPermission(userId)

        if (result.success) {
          setPermission('granted')
        } else {
          setError(result.error || 'Eroare la activarea notificărilor')
          // Actualizează permisiunea dacă a fost explicit refuzată
          if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission as PermissionState)
          }
        }

        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Eroare necunoscută'
        setError(message)
        return { success: false, error: message }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const disableNotifications = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Dezactivează token-urile în DB prin API
      const response = await fetch('/api/notifications/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        setError(err.error || 'Eroare la dezactivarea notificărilor')
        return
      }

      // Notificările browser nu pot fi revocate programatic — utilizatorul
      // trebuie să le dezactiveze din setările browserului
      setPermission('denied')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    permission,
    loading,
    error,
    isSupported,
    enableNotifications,
    disableNotifications,
  }
}
