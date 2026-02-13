'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, Monitor } from 'lucide-react'

export default function DemoPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    cui: '',
    employeeCount: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // TODO: Implement API call to save demo request
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSubmitStatus('success')
      setFormData({
        companyName: '',
        cui: '',
        employeeCount: '',
        contactName: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting demo request:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Solicită o demonstrație gratuită
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descoperă cum platforma s-s-m.ro poate simplifica gestionarea conformității SSM și PSI în organizația ta
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Completează formularul
            </h2>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                <p className="font-medium">Cererea ta a fost trimisă cu succes!</p>
                <p className="text-sm mt-1">Te vom contacta în cel mai scurt timp.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                <p className="font-medium">A apărut o eroare. Te rugăm să încerci din nou.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nume firmă *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: SC Example SRL"
                />
              </div>

              <div>
                <label htmlFor="cui" className="block text-sm font-medium text-gray-700 mb-2">
                  CUI *
                </label>
                <input
                  type="text"
                  id="cui"
                  name="cui"
                  value={formData.cui}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: RO12345678"
                />
              </div>

              <div>
                <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Număr angajați *
                </label>
                <select
                  id="employeeCount"
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Selectează</option>
                  <option value="1-10">1-10 angajați</option>
                  <option value="11-50">11-50 angajați</option>
                  <option value="51-100">51-100 angajați</option>
                  <option value="101-250">101-250 angajați</option>
                  <option value="251-500">251-500 angajați</option>
                  <option value="500+">500+ angajați</option>
                </select>
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nume persoană de contact *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: Ion Popescu"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="email@firma.ro"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: 0712 345 678"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj (opțional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Spune-ne mai multe despre nevoile tale..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Se trimite...' : 'Trimite cererea'}
              </button>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            {/* Benefits Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Ce vei afla în demo?
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Gestionare completă SSM și PSI
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Descoperă cum poți digitaliza întreaga conformitate: control medical, instruiri, echipamente de protecție, alerte automate și raportare.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Suport multilingv și multi-țară
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Platformă adaptată pentru România, Bulgaria, Ungaria și Germania, cu interfață în 5 limbi și conformitate locală.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Personalizare pentru consultanți și firme
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Soluție perfectă atât pentru consultanți SSM cu multiple organizații, cât și pentru firme care gestionează propriul compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Info */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Durata demonstrației</h3>
              </div>
              <p className="text-blue-100 mb-6">
                30 de minute — prezentare personalizată a platformei, adaptată nevoilor tale specifice
              </p>

              <div className="flex items-center gap-3">
                <Monitor className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Format</h3>
              </div>
              <p className="text-blue-100 mt-2">
                Online prin Google Meet sau Zoom, la o dată convenabilă pentru tine
              </p>
            </div>

            {/* Platform Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview platformă
              </h3>
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Screenshot platformă</p>
                  <p className="text-sm text-gray-400 mt-1">Se încarcă...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
