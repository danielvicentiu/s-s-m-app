'use client'

import { useState } from 'react'
import {
  Building2,
  Package,
  Stethoscope,
  CheckCircle2,
  Send,
  Briefcase,
  TrendingUp,
  Users,
  Calendar,
  ShoppingCart,
  Activity
} from 'lucide-react'

type PartnerType = 'consultant' | 'supplier' | 'clinic' | ''

export default function PartnersPage() {
  const [partnerType, setPartnerType] = useState<PartnerType>('')
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        description: ''
      })
      setPartnerType('')
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Programul de Parteneriat S-S-M.ro
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
              Dezvoltăm împreună ecosistemul SSM digital din România și Europa
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Partner Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

          {/* Consultanți SSM */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
              <Building2 className="h-12 w-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Pentru Consultanți SSM</h2>
              <p className="text-blue-100">Soluție white-label pentru consultanții independenți</p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Platformă White-Label</h3>
                    <p className="text-gray-600 text-sm">Branduiește platforma cu propriul tău logo și culori</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comision 20%</h3>
                    <p className="text-gray-600 text-sm">Primești 20% din veniturile generate de clienții tăi</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Suport Tehnic Inclus</h3>
                    <p className="text-gray-600 text-sm">Echipa noastră te ajută cu onboarding și suport continuu</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Fără Costuri Inițiale</h3>
                    <p className="text-gray-600 text-sm">Configurare gratuită, plătești doar din comisioane</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">Gestionare multi-client</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">Dashboard venituri în timp real</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">Acces complet pentru clienți</span>
                </div>
              </div>
            </div>
          </div>

          {/* Furnizori EIP */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white">
              <Package className="h-12 w-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Pentru Furnizori EIP</h2>
              <p className="text-green-100">Marketplace pentru echipamente de protecție</p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Listing Produse</h3>
                    <p className="text-gray-600 text-sm">Adaugă catalogul tău complet de EIP-uri</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Acces la Clienți B2B</h3>
                    <p className="text-gray-600 text-sm">Conectare directă cu firmele înregistrate pe platformă</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comenzi Automate</h3>
                    <p className="text-gray-600 text-sm">Sistem de comenzi integrat cu notificări instant</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Rapoarte Vânzări</h3>
                    <p className="text-gray-600 text-sm">Dashboard cu statistici detaliate</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Catalog digital complet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Promovare către 100+ firme</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Comision competitiv</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinici Medicină Muncii */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white">
              <Stethoscope className="h-12 w-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Pentru Clinici Medicină Muncii</h2>
              <p className="text-purple-100">Integrare sistem programări și evidență</p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Programări Online</h3>
                    <p className="text-gray-600 text-sm">Integrare cu calendarul clinicii tale</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Fișe Angajați</h3>
                    <p className="text-gray-600 text-sm">Acces direct la datele angajaților din platformă</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Upload Rezultate</h3>
                    <p className="text-gray-600 text-sm">Încarcă avize medicale direct în dosarul electronic</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Notificări Automate</h3>
                    <p className="text-gray-600 text-sm">Alertează firmele la expirări avize</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">Sistem programări integrat</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">Acces la bază de clienți B2B</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">Statistici și raportare</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Aplică pentru Parteneriat
            </h2>
            <p className="text-lg text-gray-600">
              Completează formularul și te vom contacta în maximum 48 de ore
            </p>
          </div>

          {submitSuccess ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Cerere trimisă cu succes!
              </h3>
              <p className="text-green-700">
                Vă vom contacta în curând pentru a discuta detaliile parteneriatului.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Partner Type */}
              <div>
                <label htmlFor="partnerType" className="block text-sm font-semibold text-gray-900 mb-2">
                  Tip Parteneriat *
                </label>
                <select
                  id="partnerType"
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value as PartnerType)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selectează tipul de parteneriat</option>
                  <option value="consultant">Consultant SSM</option>
                  <option value="supplier">Furnizor EIP</option>
                  <option value="clinic">Clinică Medicină Muncii</option>
                </select>
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Nume Companie *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: SSM Expert SRL"
                  required
                />
              </div>

              {/* Contact Person */}
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-semibold text-gray-900 mb-2">
                  Persoană de Contact *
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nume și prenume"
                  required
                />
              </div>

              {/* Email & Phone */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@firma.ro"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="07XX XXX XXX"
                    required
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
                  Website (opțional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.firma.ro"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                  Descriere Scurtă *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Prezintă-ne pe scurt activitatea companiei tale și de ce ai dori să devii partener..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Trimite Cererea
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Prin trimiterea acestui formular, ești de acord cu{' '}
                <a href="#" className="text-blue-600 hover:underline">Termenii și Condițiile</a>
                {' '}de parteneriat.
              </p>
            </form>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Întrebări despre Programul de Parteneriat?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contactează-ne pentru mai multe informații sau pentru a programa o întâlnire online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:parteneri@s-s-m.ro"
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors"
            >
              parteneri@s-s-m.ro
            </a>
            <a
              href="tel:+40XXX"
              className="bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-400 transition-colors"
            >
              +40 XXX XXX XXX
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
