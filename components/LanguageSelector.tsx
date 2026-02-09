'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

interface LanguageOption {
  code: string
  label: string
  flag: string
  country: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'ro', label: 'Română', flag: '🇷🇴', country: 'România' },
  { code: 'bg', label: 'Български', flag: '🇧🇬', country: 'България' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺', country: 'Magyarország' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', country: 'Deutschland' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱', country: 'Polska' },
]

interface Props {
  className?: string
}

export default function LanguageSelector({ className = '' }: Props) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLanguage = LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0]

  const handleLanguageChange = (newLocale: string) => {
    setOpen(false)
    router.replace(pathname, { locale: newLocale })
  }

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Selectează limba / Select language"
      >
        <span className="text-base leading-none">{currentLanguage.flag}</span>
        <span className="font-semibold">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown popover */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[180px]"
          role="listbox"
          aria-label="Select language"
        >
          {LANGUAGES.map((lang) => {
            const isActive = locale === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                role="option"
                aria-selected={isActive}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className={isActive ? 'font-semibold' : 'font-medium'}>{lang.label}</span>
                  <span className="text-[11px] text-gray-400">{lang.country}</span>
                </div>
                {isActive && (
                  <svg className="ml-auto h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
