// components/dashboard/OnlineUsers.tsx
// Sidebar widget — shows online users in current organization
// Uses Supabase Realtime Presence API
// Max 5 avatars visible + count badge for remaining users

'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { RealtimePresenceService, OnlineUser } from '@/lib/services/realtime-presence'
import { Users } from 'lucide-react'

interface OnlineUsersProps {
  organizationId: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar: string | null
}

export default function OnlineUsers({
  organizationId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: OnlineUsersProps) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [presenceService, setPresenceService] = useState<RealtimePresenceService | null>(null)
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    if (!organizationId || !currentUserId) return

    // Initialize presence service
    const service = new RealtimePresenceService(supabase, organizationId, currentUserId)

    // Subscribe to presence updates
    service.subscribe(currentUserId, currentUserName, currentUserAvatar, (users) => {
      setOnlineUsers(users)
    })

    setPresenceService(service)

    // Cleanup on unmount
    return () => {
      service.unsubscribe()
    }
  }, [organizationId, currentUserId, currentUserName, currentUserAvatar])

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Max avatars to show before showing count
  const MAX_VISIBLE_AVATARS = 5
  const visibleUsers = onlineUsers.slice(0, MAX_VISIBLE_AVATARS)
  const remainingCount = onlineUsers.length - MAX_VISIBLE_AVATARS

  if (onlineUsers.length === 0) {
    return null // Don't show widget if no users online
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
          <Users className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Online acum</h3>
          <p className="text-xs text-gray-500">
            {onlineUsers.length} {onlineUsers.length === 1 ? 'utilizator' : 'utilizatori'}
          </p>
        </div>
      </div>

      {/* Avatar stack */}
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {visibleUsers.map((user, index) => (
            <div
              key={user.userId}
              className="relative group"
              style={{ zIndex: visibleUsers.length - index }}
            >
              {/* Avatar */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover transition-transform hover:scale-110 hover:z-50"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110 hover:z-50">
                  {getInitials(user.fullName)}
                </div>
              )}

              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {user.fullName}
                {user.userId === currentUserId && ' (tu)'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          ))}

          {/* Remaining count badge */}
          {remainingCount > 0 && (
            <div
              className="relative group"
              style={{ zIndex: 0 }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold">
                +{remainingCount}
              </div>

              {/* Tooltip with all remaining names */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 max-w-xs">
                <div className="space-y-1">
                  {onlineUsers.slice(MAX_VISIBLE_AVATARS).map((user) => (
                    <div key={user.userId}>
                      {user.fullName}
                      {user.userId === currentUserId && ' (tu)'}
                    </div>
                  ))}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-400 mt-3">
        Utilizatori activi în organizație
      </p>
    </div>
  )
}
