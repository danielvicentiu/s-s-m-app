'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

export default function Footer() {
  const router = useRouter()
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const tFooter = useTranslations('footer')

  return (
    <footer className="border-t border-gray-200 py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-black text-gray-900 mb-2">{tCommon('appName')}</div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {tFooter('description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              {tNav('navigation')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  {tNav('home')}
                </button>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
                  {tNav('features')}
                </a>
              </li>
              <li>
                <button
                  onClick={() => router.push('/pricing')}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  {tNav('pricing')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  {tNav('login')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              {tNav('contact')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>📧 {tFooter('email')}</li>
              <li>📞 {tFooter('phone')}</li>
              <li>📍 {tFooter('address')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">{tCommon('copyright')}</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-blue-600 transition">
              {tCommon('termsAndConditions')}
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              {tCommon('privacy')}
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              {tCommon('gdpr')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
