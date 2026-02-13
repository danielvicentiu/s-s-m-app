'use client'

import { User } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

interface EmployeeCardProps {
  name: string
  position: string
  department: string
  avatar?: string | null
  trainingStatus: 'valid' | 'expiring' | 'expired' | 'incomplete'
  medicalStatus: 'valid' | 'expiring' | 'expired' | 'incomplete'
  equipmentStatus: 'valid' | 'expiring' | 'expired' | 'incomplete'
  onClick?: () => void
}

export function EmployeeCard({
  name,
  position,
  department,
  avatar,
  trainingStatus,
  medicalStatus,
  equipmentStatus,
  onClick,
}: EmployeeCardProps) {
  // Extract initials from name (first letter of first and last name)
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ')
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-2xl p-4 transition-all ${
        onClick ? 'hover:shadow-md hover:border-blue-300 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar or Initials */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
              <span className="text-blue-700 font-semibold text-sm">{initials}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Position */}
          <h3 className="text-sm font-semibold text-gray-900 truncate mb-0.5">
            {name}
          </h3>
          <p className="text-xs text-gray-600 truncate mb-0.5">
            {position}
          </p>
          <p className="text-xs text-gray-500 truncate mb-3">
            {department}
          </p>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={trainingStatus} label="Instruire" />
            <StatusBadge status={medicalStatus} label="Medical" />
            <StatusBadge status={equipmentStatus} label="EIP" />
          </div>
        </div>
      </div>
    </div>
  )
}
