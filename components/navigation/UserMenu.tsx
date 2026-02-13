// components/navigation/UserMenu.tsx
// User menu with avatar, profile dropdown, language switcher, and logout
// Data: 13 Februarie 2026

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'

// ── Props ──
interface UserMenuProps {
  userEmail: string
  userName?: string | null
  locale: string
  className?: string
}

// Mapping pentru steaguri și nume limbi
const LOCALE_FLAGS: Record<string, string> = {
  ro: '🇷🇴',
  bg: '🇧🇬',
  en: '🇬🇧',
  hu: '🇭🇺',
  de: '🇩🇪',
}

const LOCALE_NAMES: Record<string, string> = {
  ro: 'Română',
  bg: 'Български',
  en: 'English',
  hu: 'Magyar',
  de: 'Deutsch',
}

// ── Componenta principală ──
export default function UserMenu({
  userEmail,
  userName,
  locale,
  className = '',
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // Generare inițiale din nume sau email
  const getInitials = (): string => {
    if (userName && userName.trim()) {
      const parts = userName.trim().split(' ')
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return userName.slice(0, 2).toUpperCase()
    }
    // Fallback la email
    return userEmail.slice(0, 2).toUpperCase()
  }

  // Închide dropdown la click în afara componentei
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Închide dropdown la Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Handler logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Redirect la login
      router.push(`/${locale}/login`)
      router.refresh()
    } catch (error) {
      console.error('Eroare la logout:', error)
      alert('A apărut o eroare la deconectare. Vă rugăm încercați din nou.')
    } finally {
      setIsLoggingOut(false)
      setIsOpen(false)
    }
  }

  // Handler schimbare limbă
  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname
    // Înlocuiește locale-ul curent din path
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {getInitials()}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-200 bg-white shadow-lg">
          {/* User info section */}
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-gray-900">
              {userName || 'User'}
            </p>
            <p className="truncate text-xs text-gray-500">{userEmail}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {/* Profil */}
            <button
              onClick={() => {
                router.push(`/${locale}/profile`)
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>
                {locale === 'ro' ? 'Profil' :
                 locale === 'bg' ? 'Профил' :
                 locale === 'hu' ? 'Profil' :
                 locale === 'de' ? 'Profil' :
                 'Profile'}
              </span>
            </button>

            {/* Setări */}
            <button
              onClick={() => {
                router.push(`/${locale}/settings`)
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                {locale === 'ro' ? 'Setări' :
                 locale === 'bg' ? 'Настройки' :
                 locale === 'hu' ? 'Beállítások' :
                 locale === 'de' ? 'Einstellungen' :
                 'Settings'}
              </span>
            </button>
          </div>

          {/* Language section */}
          <div className="border-t border-gray-100 py-1">
            <div className="px-4 py-2">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {locale === 'ro' ? 'Limbă' :
                 locale === 'bg' ? 'Език' :
                 locale === 'hu' ? 'Nyelv' :
                 locale === 'de' ? 'Sprache' :
                 'Language'}
              </p>
            </div>
            {Object.entries(LOCALE_NAMES).map(([localeCode, localeName]) => (
              <button
                key={localeCode}
                onClick={() => handleLanguageChange(localeCode)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                  locale === localeCode
                    ? 'bg-blue-50 font-medium text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                <span className="text-base">{LOCALE_FLAGS[localeCode]}</span>
                <span>{localeName}</span>
              </button>
            ))}
          </div>

          {/* Logout section */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>
                {isLoggingOut
                  ? locale === 'ro'
                    ? 'Se deconectează...'
                    : 'Logging out...'
                  : locale === 'ro'
                  ? 'Deconectare'
                  : locale === 'bg'
                  ? 'Изход'
                  : locale === 'hu'
                  ? 'Kijelentkezés'
                  : locale === 'de'
                  ? 'Abmelden'
                  : 'Logout'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
