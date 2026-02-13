'use client'

// S-S-M.RO — NOTIFICATIONS HOOK
// Hook React pentru gestionarea notificărilor cu real-time subscriptions
// Data: 13 Februarie 2026

import { useState, useEffect, useCallback, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { NotificationService } from '@/lib/services/notificationService'
import { Notification } from '@/lib/types'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: Error | null
  markRead: (notificationId: string) => Promise<boolean>
  markAllRead: () => Promise<boolean>
  deleteNotification: (notificationId: string) => Promise<boolean>
  refetch: () => Promise<void>
}

export function useNotifications(options?: {
  limit?: number
  unreadOnly?: boolean
  autoRefetch?: boolean
}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createSupabaseBrowser()
  const notificationService = useRef(new NotificationService(supabase))
  const channelRef = useRef<RealtimeChannel | null>(null)
  const userIdRef = useRef<string | null>(null)

  /**
   * Încarcă notificările
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await notificationService.current.getNotifications({
        limit: options?.limit,
        unreadOnly: options?.unreadOnly
      })

      if (fetchError) {
        setError(fetchError)
        return
      }

      setNotifications(data || [])

      // Obține și numărul de notificări necitite
      const { count, error: countError } = await notificationService.current.getUnreadCount()

      if (countError) {
        console.error('Error fetching unread count:', countError)
      } else {
        setUnreadCount(count)
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error')
      setError(errorObj)
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [options?.limit, options?.unreadOnly])

  /**
   * Marchează o notificare ca citită
   */
  const markRead = useCallback(async (notificationId: string): Promise<boolean> => {
    const { success, error: markError } = await notificationService.current.markAsRead(notificationId)

    if (success) {
      // Actualizează local
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } else {
      console.error('Error marking notification as read:', markError)
    }

    return success
  }, [])

  /**
   * Marchează toate notificările ca citite
   */
  const markAllRead = useCallback(async (): Promise<boolean> => {
    const { success, error: markError } = await notificationService.current.markAllAsRead()

    if (success) {
      // Actualizează local
      const now = new Date().toISOString()
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: now }))
      )
      setUnreadCount(0)
    } else {
      console.error('Error marking all notifications as read:', markError)
    }

    return success
  }, [])

  /**
   * Șterge o notificare
   */
  const deleteNotification = useCallback(async (notificationId: string): Promise<boolean> => {
    const { success, error: deleteError } = await notificationService.current.deleteNotification(notificationId)

    if (success) {
      // Actualizează local
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId)
        if (notification && !notification.is_read) {
          setUnreadCount(count => Math.max(0, count - 1))
        }
        return prev.filter(n => n.id !== notificationId)
      })
    } else {
      console.error('Error deleting notification:', deleteError)
    }

    return success
  }, [])

  /**
   * Refetch manual
   */
  const refetch = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  /**
   * Setup real-time subscription
   */
  useEffect(() => {
    // Încarcă notificările inițial
    fetchNotifications()

    // Obține user ID pentru subscription
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        console.warn('No user found for real-time subscription')
        return
      }

      userIdRef.current = user.id

      // Cleanup previous channel if exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }

      // Create new channel for notifications
      const channel = supabase
        .channel('notifications-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Notification change received:', payload)

            if (payload.eventType === 'INSERT') {
              // Notificare nouă
              const newNotification = payload.new as Notification
              setNotifications(prev => [newNotification, ...prev])
              if (!newNotification.is_read) {
                setUnreadCount(prev => prev + 1)
              }
            } else if (payload.eventType === 'UPDATE') {
              // Notificare actualizată
              const updatedNotification = payload.new as Notification
              setNotifications(prev =>
                prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
              )
              // Recalculează unread count
              fetchUnreadCount()
            } else if (payload.eventType === 'DELETE') {
              // Notificare ștearsă
              const deletedNotification = payload.old as Notification
              setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id))
              if (!deletedNotification.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1))
              }
            }
          }
        )
        .subscribe((status) => {
          console.log('Notification subscription status:', status)
        })

      channelRef.current = channel
    }

    setupRealtimeSubscription()

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [fetchNotifications, supabase])

  /**
   * Helper pentru a reîmprospăta unread count
   */
  const fetchUnreadCount = useCallback(async () => {
    const { count } = await notificationService.current.getUnreadCount()
    setUnreadCount(count)
  }, [])

  /**
   * Auto-refetch periodic (opțional)
   */
  useEffect(() => {
    if (options?.autoRefetch) {
      const interval = setInterval(() => {
        fetchNotifications()
      }, 60000) // La fiecare 60 secunde

      return () => clearInterval(interval)
    }
  }, [options?.autoRefetch, fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    deleteNotification,
    refetch
  }
}
