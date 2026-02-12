'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, CheckCheck, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

export type NotificationType = 'alert' | 'info' | 'success' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
}

interface NotificationCenterProps {
  notifications?: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onClearNotification?: (id: string) => void
}

const TYPE_CONFIG = {
  alert: {
    icon: AlertCircle,
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Alertă'
  },
  info: {
    icon: Info,
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'Info'
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
    label: 'Succes'
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    label: 'Avertisment'
  },
}

export function NotificationCenter({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<NotificationType | 'all'>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(
    n => selectedFilter === 'all' || n.type === selectedFilter
  )

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id)
  }

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.()
  }

  const handleClearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onClearNotification?.(id)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Acum'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}z`

    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notificări"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notificări</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <CheckCheck className="h-4 w-4" />
                  Marchează toate
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedFilter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Toate
              </button>
              {(Object.keys(TYPE_CONFIG) as NotificationType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedFilter === type
                      ? `${TYPE_CONFIG[type].bg} ${TYPE_CONFIG[type].text}`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {TYPE_CONFIG[type].label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[32rem] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="Nicio notificare"
                description={
                  selectedFilter === 'all'
                    ? 'Nu aveți notificări momentan'
                    : `Nu aveți notificări de tip ${TYPE_CONFIG[selectedFilter as NotificationType]?.label.toLowerCase()}`
                }
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => {
                  const config = TYPE_CONFIG[notification.type]
                  const Icon = config.icon

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${config.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.createdAt)}
                              </span>
                              {onClearNotification && (
                                <button
                                  onClick={(e) => handleClearNotification(notification.id, e)}
                                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                                  aria-label="Șterge notificare"
                                >
                                  <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>

                          {/* Type badge and read indicator */}
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {config.label}
                            </span>

                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification.id)
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Marchează citit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer (optional - for future "View All" link) */}
          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-center text-gray-500">
                {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notificare' : 'notificări'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
