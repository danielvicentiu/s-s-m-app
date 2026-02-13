// components/navigation/NotificationBell.tsx
// Notification Bell — Badge with unread count + dropdown with last 5 notifications
// Data: 13 Februarie 2026

'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  organization_id: string
  type: string
  channel: string
  status: string
  details: Record<string, any>
  created_at: string
  read_at: string | null
  recipient: string | null
}

interface NotificationBellProps {
  locale?: string
  orgId: string | null
}

export default function NotificationBell({ locale = 'ro', orgId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!orgId) return

    try {
      const supabase = createSupabaseBrowser()

      // Fetch last 5 notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      setNotifications(data || [])

      // Count unread
      const unread = data?.filter(n => !n.read_at).length || 0
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error in fetchNotifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const supabase = createSupabaseBrowser()

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)

      if (error) {
        console.error('Error marking notification as read:', error)
        return
      }

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error in markAsRead:', error)
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id)
    }
    // Optional: Navigate based on notification type
    // router.push(`/${locale}/dashboard/alerts`)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications()

    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)

    return () => clearInterval(interval)
  }, [orgId])

  // Format notification message
  const getNotificationMessage = (notification: Notification): string => {
    const { type, details } = notification

    if (type === 'daily_alert') {
      const total = (details?.medical || 0) + (details?.equipment || 0) + (details?.training || 0)
      return locale === 'ro'
        ? `Alerte SSM/PSI: ${total} elemente necesită atenție`
        : `SSM/PSI Alerts: ${total} items need attention`
    }

    if (type === 'fraud_alert') {
      return locale === 'ro' ? 'Alertă fraude detectată' : 'Fraud alert detected'
    }

    return locale === 'ro' ? 'Notificare nouă' : 'New notification'
  }

  // Format relative time
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return locale === 'ro' ? 'acum' : 'now'
    if (diffMins < 60) return locale === 'ro' ? `${diffMins}min` : `${diffMins}m`
    if (diffHours < 24) return locale === 'ro' ? `${diffHours}h` : `${diffHours}h`
    if (diffDays < 7) return locale === 'ro' ? `${diffDays}z` : `${diffDays}d`

    return date.toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const labels = {
    ro: {
      viewAll: 'Toate notificările',
      noNotifications: 'Nicio notificare',
      empty: 'Nu aveți notificări',
    },
    en: {
      viewAll: 'All notifications',
      noNotifications: 'No notifications',
      empty: 'You have no notifications',
    },
  }

  const t = labels[locale as keyof typeof labels] || labels.ro

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {t.viewAll}
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">
                {unreadCount} {locale === 'ro' ? 'necitite' : 'unread'}
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">{t.empty}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      !notification.read_at ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread Indicator */}
                      {!notification.read_at && (
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read_at ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {getNotificationMessage(notification)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {getRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer - View All Link */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push(`/${locale}/dashboard/notifications`)
                }}
                className="w-full rounded-md py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {t.viewAll}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
