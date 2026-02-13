'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react'

type RequestType = 'general' | 'consultanta' | 'oferta' | 'suport' | 'parteneriat'

const REQUEST_TYPES: { value: RequestType; label: string }[] = [
  { value: 'general', label: 'Informații generale' },
  { value: 'consultanta', label: 'Servicii consultanță SSM/PSI' },
  { value: 'oferta', label: 'Solicitare ofertă' },
  { value: 'suport', label: 'Suport tehnic platformă' },
  { value: 'parteneriat', label: 'Oportunități parteneriat' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    requestType: 'general' as RequestType,
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Eroare la trimiterea formularului')
      }

      setSubmitStatus('success')
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        requestType: 'general',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Contact</h1>
          <p className="mt-2 text-lg text-gray-600">
            Suntem aici să te ajutăm. Contactează-ne pentru orice întrebare sau solicitare.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trimite-ne un mesaj</h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Mesajul tău a fost trimis cu succes! Îți vom răspunde în cel mai scurt timp.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">
                    ✗ A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nume */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nume complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="Introduceți numele complet"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="email@exemplu.ro"
                  />
                </div>

                {/* Firmă */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Companie / Organizație
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="Numele companiei (opțional)"
                  />
                </div>

                {/* Tip cerere */}
                <div>
                  <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-2">
                    Tip cerere <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="requestType"
                    name="requestType"
                    required
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                  >
                    {REQUEST_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mesaj */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                    placeholder="Descrie-ne cum te putem ajuta..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Minim 10 caractere
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Trimite mesaj
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informații de contact</h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a
                      href="mailto:contact@s-s-m.ro"
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      contact@s-s-m.ro
                    </a>
                  </div>
                </div>

                {/* Telefon */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Telefon</p>
                    <a
                      href="tel:+40722123456"
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      +40 722 123 456
                    </a>
                  </div>
                </div>

                {/* Adresa */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Adresă</p>
                    <p className="text-gray-600 text-sm">
                      Str. Exemplu nr. 123<br />
                      București, Sector 1<br />
                      România
                    </p>
                  </div>
                </div>

                {/* Program lucru */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Program de lucru</p>
                    <p className="text-gray-600 text-sm">
                      Luni - Vineri: 09:00 - 17:00<br />
                      Sâmbătă - Duminică: Închis
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700">Hartă interactivă</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Va fi integrată în curând
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h4 className="font-semibold text-blue-900 mb-2">Răspuns rapid</h4>
              <p className="text-sm text-blue-800">
                De obicei răspundem în maxim 24 de ore în zilele lucrătoare.
                Pentru urgențe, te rugăm să ne contactezi telefonic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
