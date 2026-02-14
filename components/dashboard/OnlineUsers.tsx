'use client'

import { useEffect, useState } from 'react'
import { subscribeToPresence, type PresenceUser } from '@/lib/services/realtime-presence'
import { Users } from 'lucide-react'

interface OnlineUsersProps {
  orgId: string
}

const MAX_VISIBLE_AVATARS = 5

// Generate initials from full name
function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Generate consistent color for user based on their ID
function getUserColor(userId: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ]

  // Simple hash function to get consistent color
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export function OnlineUsers({ orgId }: OnlineUsersProps) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([])

  useEffect(() => {
    const cleanup = subscribeToPresence(orgId, (users) => {
      setOnlineUsers(users)
    })

    return cleanup
  }, [orgId])

  if (onlineUsers.length === 0) {
    return null
  }

  const visibleUsers = onlineUsers.slice(0, MAX_VISIBLE_AVATARS)
  const remainingCount = onlineUsers.length - MAX_VISIBLE_AVATARS

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">
            Online acum
          </h3>
        </div>
        <span className="text-xs font-medium text-gray-500">
          {onlineUsers.length}
        </span>
      </div>

      <div className="flex items-center">
        {/* Avatar stack */}
        <div className="flex -space-x-2">
          {visibleUsers.map((user, index) => (
            <div
              key={user.userId}
              className="relative group"
              style={{ zIndex: visibleUsers.length - index }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-green-500 object-cover"
                  title={user.fullName}
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-full border-2 border-white ring-2 ring-green-500 flex items-center justify-center text-white text-xs font-semibold ${getUserColor(user.userId)}`}
                  title={user.fullName}
                >
                  {getInitials(user.fullName)}
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {user.fullName}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          ))}

          {/* Remaining count badge */}
          {remainingCount > 0 && (
            <div
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600"
              title={`+${remainingCount} utilizatori`}
            >
              +{remainingCount}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
