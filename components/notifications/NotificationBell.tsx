'use client'

// components/notifications/NotificationBell.tsx
// Buton pentru activare/dezactivare notificări push FCM

import { Bell, BellOff, Loader2 } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

interface NotificationBellProps {
  userId: string
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const { permission, loading, error, isSupported, enableNotifications } = useNotifications()

  if (!isSupported) return null

  if (loading) {
    return (
      <div className="flex items-center justify-center w-8 h-8" title="Se procesează...">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    )
  }

  if (permission === 'granted') {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg text-green-600"
        title="Notificări active"
      >
        <Bell className="w-4 h-4" />
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg text-red-500"
        title="Activează din setările browserului"
      >
        <BellOff className="w-4 h-4" />
      </div>
    )
  }

  // permission === 'default' — buton de activare
  return (
    <button
      onClick={() => enableNotifications(userId)}
      className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      title="Activează notificările push"
    >
      <Bell className="w-3.5 h-3.5 flex-shrink-0" />
      <span>Activează notificări</span>
    </button>
  )
}
