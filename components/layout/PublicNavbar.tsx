'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import LanguageSelector from '@/components/LanguageSelector'

export default function PublicNavbar() {
  const router = useRouter()
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="text-2xl font-black text-gray-900 hover:text-blue-600 transition"
        >
          {tCommon('appName')}
        </button>
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block"
          >
            {tNav('features')}
          </a>
          <button
            onClick={() => router.push('/pricing')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block"
          >
            {tNav('pricing')}
          </button>

          <LanguageSelector />

          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            {tNav('login')}
          </button>
        </div>
      </div>
    </nav>
  )
}
