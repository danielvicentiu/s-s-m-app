// components/navigation/UserMenu.tsx
// Meniu utilizator: avatar cu inițiale, dropdown (profil, setări, limbă, logout)
// Click outside to close. Client component cu Tailwind.
// Data: 13 Februarie 2026

'use client'

import { useState, useEffect, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/types'

interface UserMenuProps {
  locale: string
  currentLocale?: string
}

// Mapare locale→nume limba (pentru selector limba)
const LOCALE_NAMES: Record<string, string> = {
  ro: 'Română',
  en: 'English',
  bg: 'Български',
  hu: 'Magyar',
  de: 'Deutsch',
  pl: 'Polski',
}

// Texte UI per limbă
const TRANSLATIONS = {
  ro: {
    profile: 'Profil',
    settings: 'Setări',
    changeLanguage: 'Schimbă limba',
    logout: 'Ieși din cont',
  },
  en: {
    profile: 'Profile',
    settings: 'Settings',
    changeLanguage: 'Change language',
    logout: 'Sign out',
  },
  bg: {
    profile: 'Профил',
    settings: 'Настройки',
    changeLanguage: 'Смяна на език',
    logout: 'Изход',
  },
  hu: {
    profile: 'Profil',
    settings: 'Beállítások',
    changeLanguage: 'Nyelv váltás',
    logout: 'Kijelentkezés',
  },
  de: {
    profile: 'Profil',
    settings: 'Einstellungen',
    changeLanguage: 'Sprache wechseln',
    logout: 'Abmelden',
  },
  pl: {
    profile: 'Profil',
    settings: 'Ustawienia',
    changeLanguage: 'Zmień język',
    logout: 'Wyloguj',
  },
}

export default function UserMenu({ locale, currentLocale }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const t = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.en

  // Fetch user profile and email
  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        setEmail(user.email || '')

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error loading profile:', error)
        } else if (profileData) {
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [supabase])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  // Get initials from full name or email
  function getInitials(name?: string | null, emailAddr?: string): string {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    if (emailAddr) {
      return emailAddr.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Handle logout
  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      router.push(`/${locale}/login`)
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Handle language change
  function handleLanguageChange(newLocale: string) {
    const currentPath = window.location.pathname
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '')
    router.push(`/${newLocale}${pathWithoutLocale}`)
    setIsOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      </div>
    )
  }

  const initials = getInitials(profile?.full_name, email)
  const displayName = profile?.full_name || email || 'User'

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar Circle */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md">
          {initials}
        </div>

        {/* User info (hidden on mobile) */}
        <div className="hidden text-left sm:block">
          <div className="text-sm font-medium text-gray-900">
            {displayName.length > 20 ? displayName.substring(0, 20) + '...' : displayName}
          </div>
          <div className="text-xs text-gray-500">
            {email.length > 24 ? email.substring(0, 24) + '...' : email}
          </div>
        </div>

        {/* Dropdown arrow */}
        <svg
          className={`hidden h-4 w-4 text-gray-400 transition-transform sm:block ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl">
          {/* User info header (visible în dropdown) */}
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="font-medium text-gray-900">{displayName}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {/* Profil */}
            <button
              onClick={() => {
                router.push(`/${locale}/dashboard/profile`)
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t.profile}
            </button>

            {/* Setări */}
            <button
              onClick={() => {
                router.push(`/${locale}/dashboard/settings`)
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t.settings}
            </button>

            {/* Separator */}
            <div className="my-1 border-t border-gray-100" />

            {/* Language Submenu */}
            <div className="px-4 py-2">
              <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                {t.changeLanguage}
              </div>
              <div className="space-y-0.5">
                {Object.entries(LOCALE_NAMES).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ${
                      (currentLocale || locale) === code
                        ? 'bg-blue-50 font-medium text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{name}</span>
                    {(currentLocale || locale) === code && (
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="my-1 border-t border-gray-100" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
