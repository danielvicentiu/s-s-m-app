'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, Link } from '@/i18n/navigation'

export default function LandingPage() {
  const router = useRouter()
  const t = useTranslations('landing')
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const tFooter = useTranslations('footer')
  const locale = useLocale()

  const pricingFeatures: string[] = [
    t('pricingFeatures.0'),
    t('pricingFeatures.1'),
    t('pricingFeatures.2'),
    t('pricingFeatures.3'),
    t('pricingFeatures.4'),
    t('pricingFeatures.5'),
    t('pricingFeatures.6'),
    t('pricingFeatures.7'),
    t('pricingFeatures.8'),
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black text-gray-900">{tCommon('appName')}</div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
              {tNav('features')}
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
              {tNav('pricing')}
            </a>

            {/* Locale switcher */}
            <div className="flex items-center gap-1 text-sm">
              <Link
                href="/"
                locale="ro"
                className={`px-2 py-1 rounded transition-colors ${locale === 'ro' ? 'font-bold text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                RO
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/"
                locale="bg"
                className={`px-2 py-1 rounded transition-colors ${locale === 'bg' ? 'font-bold text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                BG
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/"
                locale="hu"
                className={`px-2 py-1 rounded transition-colors ${locale === 'hu' ? 'font-bold text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                HU
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/"
                locale="de"
                className={`px-2 py-1 rounded transition-colors ${locale === 'de' ? 'font-bold text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                DE
              </Link>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              {tNav('login')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 bg-blue-50 text-blue-600 border border-blue-200">
            {t('badge')}
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            {t('title')}<br />
            <span className="text-blue-600">{t('titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            {t('cta')}
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t('featuresTitle')}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Medicina Muncii */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🏥
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.medicalTitle')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('features.medicalDesc')}
              </p>
            </div>

            {/* Feature 2: Echipamente PSI */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🧯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.equipmentTitle')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('features.equipmentDesc')}
              </p>
            </div>

            {/* Feature 3: Alerte Automate */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🔔
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.alertsTitle')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('features.alertsDesc')}
              </p>
            </div>

            {/* Feature 4: Risc Financiar */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                💰
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.riskTitle')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('features.riskDesc')}
              </p>
            </div>

            {/* Feature 5: Multi-Organizație */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🏢
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.multiOrgTitle')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('features.multiOrgDesc')}
              </p>
            </div>

            {/* Feature 6: Rapoarte PDF */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                📄
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.reportsTitle')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('features.reportsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t('pricingTitle')}</h2>
            <p className="text-gray-600 text-lg">{t('pricingSubtitle')}</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 mb-4">
                  {t('planProfessional')}
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-black text-gray-900">{t('price')}</span>
                  <span className="text-gray-500">{t('perYear')}</span>
                </div>
                <p className="text-sm text-gray-500">{t('perOrganization')}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {pricingFeatures.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                {t('cta')}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                {t('noSetupFee')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">{tNav('navigation')}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
                    {tNav('features')}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">
                    {tNav('pricing')}
                  </a>
                </li>
                <li>
                  <button onClick={() => router.push('/login')} className="text-gray-600 hover:text-blue-600 transition">
                    Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">{tNav('contact')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📧 {tFooter('email')}</li>
                <li>📞 {tFooter('phone')}</li>
                <li>📍 {tFooter('address')}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              {tCommon('copyright')}
            </p>
            <div className="flex gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-600 transition">{tCommon('termsAndConditions')}</a>
              <a href="#" className="hover:text-blue-600 transition">{tCommon('privacy')}</a>
              <a href="#" className="hover:text-blue-600 transition">{tCommon('gdpr')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
