'use client'

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
  variant?: 'dropdown' | 'inline'
  className?: string
}

export default function LanguageSelector({ variant = 'dropdown', className = '' }: Props) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const currentLanguage = LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0]

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1 text-sm ${className}`}>
        {LANGUAGES.map((lang, index) => (
          <div key={lang.code} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-400 mx-1">|</span>}
            <button
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-2 py-1 rounded transition-colors ${
                locale === lang.code
                  ? 'font-bold text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title={lang.country}
            >
              <span className="mr-1">{lang.flag}</span>
              <span className="hidden sm:inline">{lang.code.toUpperCase()}</span>
            </button>
          </div>
        ))}
      </div>
    )
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
        title="Selectează limba / Select language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}
