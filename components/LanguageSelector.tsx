'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

interface LanguageOption {
  code: string
  label: string
  country: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'ro', label: 'Română', country: 'România' },
  { code: 'en', label: 'English', country: 'International' },
  { code: 'de', label: 'Deutsch', country: 'Deutschland' },
  { code: 'hu', label: 'Magyar', country: 'Magyarország' },
  { code: 'bg', label: 'Български', country: 'България' },
  { code: 'pl', label: 'Polski', country: 'Polska' },
]
// SVG Flag components — crisp at any size, no emoji rendering issues
function FlagRO({ className = 'w-5 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="213.3" height="480" fill="#002B7F" />
      <rect width="213.3" height="480" x="213.3" fill="#FCD116" />
      <rect width="213.3" height="480" x="426.6" fill="#CE1126" />
    </svg>
  )
}

function FlagBG({ className = 'w-5 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="160" fill="#fff" />
      <rect width="640" height="160" y="160" fill="#00966E" />
      <rect width="640" height="160" y="320" fill="#D62612" />
    </svg>
  )
}

function FlagHU({ className = 'w-5 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="160" fill="#CE2939" />
      <rect width="640" height="160" y="160" fill="#fff" />
      <rect width="640" height="160" y="320" fill="#477050" />
    </svg>
  )
}

function FlagDE({ className = 'w-5 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="160" fill="#000" />
      <rect width="640" height="160" y="160" fill="#D00" />
      <rect width="640" height="160" y="320" fill="#FFCE00" />
    </svg>
  )
}

function FlagPL({ className = 'w-5 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="240" fill="#fff" />
      <rect width="640" height="240" y="240" fill="#DC143C" />
    </svg>
  )
}

function FlagEN({ className = 'w-5 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="480" fill="#012169" />
      <path d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" fill="#fff" />
      <path d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" fill="#C8102E" />
      <path d="M241 0v480h160V0H241zM0 160v160h640V160H0z" fill="#fff" />
      <path d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" fill="#C8102E" />
    </svg>
  )
}

const FLAG_COMPONENTS: Record<string, React.FC<{ className?: string }>> = {
  ro: FlagRO,
  bg: FlagBG,
  hu: FlagHU,
  de: FlagDE,
  pl: FlagPL,
  en: FlagEN,
}

function Flag({ code, className = 'w-5 h-4' }: { code: string; className?: string }) {
  const FlagComponent = FLAG_COMPONENTS[code]
  if (!FlagComponent) return null
  return (
    <span className="inline-flex items-center rounded-sm overflow-hidden shadow-sm border border-gray-200/50">
      <FlagComponent className={className} />
    </span>
  )
}

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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
        aria-expanded={open}
        aria-haspopup="listbox"

      >
        <Flag code={currentLanguage.code} />
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
          className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[200px]"
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
                <Flag code={lang.code} className="w-6 h-4" />
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
