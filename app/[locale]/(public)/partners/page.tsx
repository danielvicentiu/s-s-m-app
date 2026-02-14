'use client'

import React, { useState } from 'react'
import {
  Handshake,
  TrendingUp,
  Plug,
  Award,
  Users,
  DollarSign,
  Zap,
  CheckCircle2,
  ArrowRight,
  Building2,
  Mail,
  Phone
} from 'lucide-react'

const partnerTypes = [
  {
    id: 'referral',
    icon: Users,
    title: 'Referral Partner',
    subtitle: 'Recomandă și câștigă',
    description: 'Câștigă comisioane prin recomandarea platformei s-s-m.ro către clienții tăi. Ideal pentru consultanți SSM independenți, consultanți HR, și profesioniști în domenii conexe.',
    benefits: [
      'Comision 15% recurring pentru primii 12 luni',
      'Dashboard dedicat pentru tracking',
      'Materiale marketing gata de utilizat',
      'Suport dedicat pentru parteneri',
      'Training gratuit pentru platforma',
      'Link personalizat de referral'
    ],
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'reseller',
    icon: TrendingUp,
    title: 'Reseller Partner',
    subtitle: 'Vinde și dezvoltă',
    description: 'Revinde platforma s-s-m.ro ca parte a portofoliului tău de servicii. Perfect pentru firme de consultanță SSM, furnizori de software pentru business, și integratori de sisteme.',
    benefits: [
      'Comision 25% recurring pentru primii 24 luni',
      'White-label partial disponibil',
      'Suport tehnic prioritar',
      'Demo personalizate pentru clienții tăi',
      'Programe de training pentru echipa ta',
      'Co-marketing opportunities'
    ],
    color: 'green',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'integration',
    icon: Plug,
    title: 'Integration Partner',
    subtitle: 'Conectează și integrează',
    description: 'Construiește integrări tehnice cu platforma s-s-m.ro. Ideal pentru dezvoltatori de software HR, platforme de payroll, și soluții ERP.',
    benefits: [
      'Acces complet la API și documentație',
      'Revenue share pentru integrări',
      'Support tehnic dedicat pentru integrări',
      'Featured în marketplace-ul nostru',
      'Co-development opportunities',
      'Sandbox environment pentru testare'
    ],
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600'
  }
]

const commissionStructure = [
  {
    tier: 'Tier 1',
    clients: '1-5 clienți',
    referral: '15%',
    reseller: '25%',
    description: 'Start'
  },
  {
    tier: 'Tier 2',
    clients: '6-15 clienți',
    referral: '18%',
    reseller: '28%',
    description: 'Growth'
  },
  {
    tier: 'Tier 3',
    clients: '16+ clienți',
    referral: '20%',
    reseller: '30%',
    description: 'Scale'
  }
]

const partnerLogos = [
  { name: 'SafeWork Pro', logo: 'SW' },
  { name: 'HR Solutions', logo: 'HR' },
  { name: 'Compliance Masters', logo: 'CM' },
  { name: 'WorkSafe Bulgaria', logo: 'WS' },
  { name: 'SSM Experts', logo: 'SE' },
  { name: 'Corporate Safety', logo: 'CS' }
]

export default function PartnersPage() {
  const [selectedType, setSelectedType] = useState<string>('referral')
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    partnerType: 'referral',
    message: ''
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

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        partnerType: 'referral',
        message: ''
      })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
              <Handshake className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Become a Partner
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Alătură-te rețelei noastre de parteneri și crește-ți afacerea
              oferind clienților soluții moderne de compliance SSM/PSI
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Award className="w-5 h-5" />
                <span className="font-medium">100+ Parteneri Activi</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Până la 30% Comision</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Zap className="w-5 h-5" />
                <span className="font-medium">Start în 48h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tipuri de Parteneriate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Alege modelul de parteneriat care se potrivește cel mai bine obiectivelor tale de business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {partnerTypes.map((type) => {
              const Icon = type.icon
              return (
                <div
                  key={type.id}
                  className={`group relative bg-white border-2 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                    selectedType === type.id
                      ? `border-${type.color}-500 shadow-lg`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  {/* Top gradient bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${type.gradient} rounded-t-2xl`} />

                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${type.gradient} rounded-2xl mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {type.title}
                  </h3>

                  <p className="text-sm font-medium text-gray-500 mb-4">
                    {type.subtitle}
                  </p>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {type.description}
                  </p>

                  <div className="space-y-3">
                    {type.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 text-${type.color}-500 flex-shrink-0 mt-0.5`} />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {selectedType === type.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <a
                        href="#apply"
                        className={`inline-flex items-center gap-2 text-${type.color}-600 font-semibold hover:gap-3 transition-all`}
                      >
                        Aplică acum
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Structura Comisioanelor
              </h2>
              <p className="text-xl text-gray-600">
                Comisioane competitive cu creștere progresivă pe măsură ce aduci mai mulți clienți
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-6 py-4 text-left font-semibold">Tier</th>
                      <th className="px-6 py-4 text-left font-semibold">Număr Clienți</th>
                      <th className="px-6 py-4 text-left font-semibold">Referral</th>
                      <th className="px-6 py-4 text-left font-semibold">Reseller</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {commissionStructure.map((tier, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{tier.tier}</td>
                        <td className="px-6 py-4 text-gray-700">{tier.clients}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                            {tier.referral}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            {tier.reseller}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{tier.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border-t border-blue-100 px-6 py-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    <strong>Notă:</strong> Comisioanele sunt calculate lunar, recurent, și se plătesc în primele 5 zile
                    lucrătoare ale fiecărei luni. Integration Partners primesc revenue share custom în funcție de integrare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Partners */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Partenerii Noștri
            </h2>
            <p className="text-lg text-gray-600">
              Peste 100 de companii de succes au ales să colaboreze cu s-s-m.ro
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {partnerLogos.map((partner, idx) => (
              <div
                key={idx}
                className="group bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-center hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">{partner.logo}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600">{partner.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Aplică pentru Parteneriat
              </h2>
              <p className="text-xl text-gray-300">
                Completează formularul și echipa noastră te va contacta în maxim 48 de ore
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Aplicație Trimisă!</h3>
                  <p className="text-gray-300">
                    Mulțumim pentru interesul tău. Echipa noastră va analiza aplicația și te va contacta curând.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Building2 className="inline w-4 h-4 mr-2" />
                        Nume Companie *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        placeholder="Numele companiei tale"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Users className="inline w-4 h-4 mr-2" />
                        Persoană de Contact *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        placeholder="Numele tău"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        placeholder="email@compania.ro"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Phone className="inline w-4 h-4 mr-2" />
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        placeholder="+40 7XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Handshake className="inline w-4 h-4 mr-2" />
                      Tip Parteneriat *
                    </label>
                    <select
                      name="partnerType"
                      value={formData.partnerType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="referral" className="bg-gray-800">Referral Partner</option>
                      <option value="reseller" className="bg-gray-800">Reseller Partner</option>
                      <option value="integration" className="bg-gray-800">Integration Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mesaj
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none"
                      placeholder="Spune-ne mai multe despre compania ta și de ce vrei să devii partener s-s-m.ro..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Se trimite...
                      </>
                    ) : (
                      <>
                        Trimite Aplicația
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ai întrebări despre programul de parteneri?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Echipa noastră este disponibilă să răspundă la toate întrebările tale
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:partners@s-s-m.ro"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                partners@s-s-m.ro
              </a>
              <a
                href="tel:+40123456789"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Phone className="w-5 h-5" />
                +40 123 456 789
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
