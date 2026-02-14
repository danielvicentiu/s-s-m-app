'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'
type StatusType = 'online' | 'offline' | 'busy' | 'away'

interface AvatarWithStatusProps {
  name: string
  imageUrl?: string
  size?: AvatarSize
  status?: StatusType
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
}

const statusDotSizes = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
}

// Generate gradient based on first letter
const getGradientFromName = (name: string): string => {
  const firstChar = name.charAt(0).toUpperCase()
  const charCode = firstChar.charCodeAt(0)

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-green-500',
    'from-yellow-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-red-500 to-pink-500',
  ]

  const index = charCode % gradients.length
  return gradients[index]
}

// Get initials from name (max 2 characters)
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default function AvatarWithStatus({
  name,
  imageUrl,
  size = 'md',
  status,
  className,
}: AvatarWithStatusProps) {
  const initials = getInitials(name)
  const gradient = getGradientFromName(name)

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden transition-all duration-200',
          'ring-2 ring-transparent hover:ring-blue-600 hover:ring-offset-2',
          sizeClasses[size]
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center',
              'bg-gradient-to-br text-white font-semibold',
              gradient
            )}
          >
            {initials}
          </div>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full',
            'ring-2 ring-white',
            statusDotSizes[size],
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}
