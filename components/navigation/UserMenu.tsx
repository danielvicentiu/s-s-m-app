'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, User, Settings, Building2 } from 'lucide-react'

interface UserMenuProps {
  user: {
    name: string
    email: string
    role: string
    avatar?: string
  }
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  // Generate initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Truncate email if too long
  const truncateEmail = (email: string, maxLength: number = 25): string => {
    if (email.length <= maxLength) return email
    const [username, domain] = email.split('@')
    if (username.length > maxLength - domain.length - 3) {
      return `${username.slice(0, maxLength - domain.length - 6)}...@${domain}`
    }
    return email
  }

  const menuItems = [
    {
      label: 'Profilul meu',
      icon: User,
      href: '/dashboard/profile',
      color: 'text-gray-700 hover:bg-gray-50'
    },
    {
      label: 'Setări',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'text-gray-700 hover:bg-gray-50'
    },
    {
      label: 'Organizația mea',
      icon: Building2,
      href: '/dashboard/organization',
      color: 'text-gray-700 hover:bg-gray-50'
    }
  ]

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-2xl p-2 hover:bg-gray-50 transition-colors"
        aria-label="Meniu utilizator"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(user.name)}
          </div>
        )}

        {/* User Info (optional - can be hidden on mobile) */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">{user.name}</span>
          <span className="text-xs text-gray-500">{user.role}</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info in Dropdown */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {getInitials(user.name)}
                </div>
              )}

              {/* Name, Role, Email */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full mt-1">
                  {user.role}
                </span>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {truncateEmail(user.email)}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${item.color}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              )
            })}
          </div>

          {/* Separator */}
          <div className="border-t border-gray-100 my-1" />

          {/* Logout */}
          <button
            onClick={() => {
              setIsOpen(false)
              // Add logout logic here
              window.location.href = '/auth/logout'
            }}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Deconectare
          </button>
        </div>
      )}
    </div>
  )
}
