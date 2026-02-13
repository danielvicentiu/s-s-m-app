'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
  const t = useTranslations('contact')
  const tCommon = useTranslations('common')
  const tNav = useTranslations('nav')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would send the form data to your API
      console.log('Form submitted:', formData)

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-black text-gray-900 hover:text-blue-600 transition"
          >
            {tCommon('appName')}
          </button>
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/#features')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block"
            >
              {tNav('features')}
            </button>
            <button
              onClick={() => router.push('/pricing')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block"
            >
              {tNav('pricing')}
            </button>
            <button
              onClick={() => router.push('/about')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block"
            >
              {tNav('about')}
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="text-sm text-gray-900 font-semibold transition-colors hidden md:block"
            >
              {tNav('contact')}
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              {tNav('login')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-6">
            <MessageSquare className="w-4 h-4" />
            {t('badge')}
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            {t('title')}
            <br />
            <span className="text-blue-600">{t('titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h2 className="text-3xl font-black text-gray-900 mb-6">{t('form.title')}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('form.namePlaceholder')}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('form.emailPlaceholder')}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('form.phonePlaceholder')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('form.company')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('form.companyPlaceholder')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('form.messagePlaceholder')}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    t('form.submitting')
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('form.submit')}
                    </>
                  )}
                </button>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-800 text-sm font-semibold">
                    {t('form.success')}
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-sm font-semibold">
                    {t('form.error')}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8">
                <h2 className="text-3xl font-black text-gray-900 mb-6">{t('info.title')}</h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{t('info.email')}</h3>
                      <a
                        href={`mailto:${t('info.emailValue')}`}
                        className="text-blue-600 hover:underline"
                      >
                        {t('info.emailValue')}
                      </a>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{t('info.support')}</h3>
                      <a
                        href={`mailto:${t('info.supportValue')}`}
                        className="text-blue-600 hover:underline"
                      >
                        {t('info.supportValue')}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{t('info.phone')}</h3>
                      <a
                        href={`tel:${t('info.phoneValue')}`}
                        className="text-blue-600 hover:underline"
                      >
                        {t('info.phoneValue')}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{t('info.address')}</h3>
                      <p className="text-gray-600">{t('info.addressValue')}</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{t('info.hours')}</h3>
                      <p className="text-gray-600">{t('info.hoursValue')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">{t('cta.title')}</h2>
          <p className="text-blue-100 text-lg mb-8">{t('cta.subtitle')}</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition shadow-lg"
          >
            {t('cta.button')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-black text-gray-900 mb-2">
                {tCommon('appName')}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {tCommon('platform')}
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
                  <button
                    onClick={() => router.push('/#features')}
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    {tNav('features')}
                  </button>
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
                    onClick={() => router.push('/about')}
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    {tNav('about')}
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
                <li>contact@s-s-m.ro</li>
                <li>+40 700 000 000</li>
                <li>București, România</li>
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
    </div>
  )
}
