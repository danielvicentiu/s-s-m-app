'use client'

import { useRouter } from '@/i18n/navigation'
import { Check, X } from 'lucide-react'
import { useState } from 'react'

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect pentru firme mici care încep digitalizarea SSM',
      monthlyPrice: 0,
      annualPrice: 0,
      limits: {
        companies: 1,
        employees: 10,
      },
      features: [
        'O firmă',
        'Până la 10 angajați',
        'Medicina muncii - tracking',
        'Echipamente PSI - basic',
        'Alerte email automate',
        'Dashboard complet',
        'Rapoarte PDF',
        'Suport email (48h)',
      ],
      cta: 'Începe gratuit',
      highlighted: false,
      isFree: true,
    },
    {
      name: 'Professional',
      description: 'Soluția optimă pentru firme în creștere',
      monthlyPrice: 29,
      annualPrice: 279, // 29 * 12 * 0.8 = 278.4 ≈ 279
      limits: {
        companies: 3,
        employees: 100,
      },
      features: [
        'Până la 3 firme',
        'Până la 100 angajați',
        'Toate din Starter',
        'Instruiri SSM & PSI',
        'Risc financiar — calcul amenzi ITM',
        'Alerte SMS (opțional)',
        'Export date Excel',
        'Rapoarte personalizate',
        'Suport prioritar (24h)',
        'Onboarding dedicat',
      ],
      cta: 'Începe acum',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'Soluție la cheie pentru grupuri de firme și consultanți SSM',
      monthlyPrice: 99,
      annualPrice: 950, // 99 * 12 * 0.8 = 950.4 ≈ 950
      limits: {
        companies: 'Nelimitat',
        employees: 'Nelimitat',
      },
      features: [
        'Firme nelimitate',
        'Angajați nelimitați',
        'Toate din Professional',
        'White-label dashboard',
        'Multi-tenant architecture',
        'REGES API integration',
        'Integrare ERP/HR (SAP, Saga)',
        'Workflows personalizate',
        'Account manager dedicat',
        'SLA 99.9% uptime',
        'Training complet echipă',
        'Support 24/7',
      ],
      cta: 'Contactează-ne',
      highlighted: false,
    },
  ]

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.isFree) return 'Gratuit'
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice
    return `€${price}`
  }

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.isFree) return ''
    return billingCycle === 'monthly' ? '/lună' : '/an'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-2xl font-black text-gray-900 hover:text-blue-600 transition">
            s-s-m.ro
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/#features')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
              Funcționalități
            </button>
            <button onClick={() => router.push('/pricing')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
              Preț
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Intră în platformă
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Preț transparent,<br />
            <span className="text-blue-600">fără costuri ascunse</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Alege planul potrivit pentru nevoile afacerii tale. Migrare între planuri oricând.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Lunar
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-blue-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-7' : ''
                }`}
              />
            </button>
            <span className={`text-sm font-semibold ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Anual
            </span>
            {billingCycle === 'annual' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                Economisești 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition-all ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white shadow-2xl scale-105 border-4 border-blue-700'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {/* Badge */}
                {plan.highlighted && (
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-4 uppercase tracking-wider">
                    Cel mai popular
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <h3
                    className={`text-3xl font-black mb-2 ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-5xl font-black ${
                        plan.highlighted ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {getPrice(plan)}
                    </span>
                    {getPeriod(plan) && (
                      <span
                        className={`text-base ${
                          plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {getPeriod(plan)}
                      </span>
                    )}
                  </div>
                  {!plan.isFree && billingCycle === 'monthly' && (
                    <p className={`text-xs mt-2 ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
                      sau €{plan.annualPrice}/an (economisești 20%)
                    </p>
                  )}
                </div>

                {/* Limits */}
                <div className={`rounded-xl p-4 mb-6 ${plan.highlighted ? 'bg-blue-700/30' : 'bg-gray-50'}`}>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-600'}>Firme:</span>
                      <span className={`font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                        {plan.limits.companies}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-600'}>Angajați:</span>
                      <span className={`font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                        {plan.limits.employees}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-blue-200' : 'text-blue-600'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => {
                    if (plan.name === 'Enterprise') {
                      window.location.href = 'mailto:contact@s-s-m.ro?subject=Solicitare plan Enterprise'
                    } else {
                      router.push('/onboarding')
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Footer note */}
                {plan.highlighted && (
                  <p className="text-center text-xs text-blue-100 mt-4">
                    Fără setup fee. Anulezi oricând.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Comparison Table */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Comparație detaliată planuri</h2>
            <p className="text-gray-600 text-lg">Toate funcționalitățile pe scurt</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="text-left px-6 py-5 text-sm font-bold text-gray-900 w-1/3">Funcționalitate</th>
                    <th className="text-center px-6 py-5 text-sm font-bold text-gray-900">Starter</th>
                    <th className="text-center px-6 py-5 text-sm font-bold text-blue-600 bg-blue-50">Professional</th>
                    <th className="text-center px-6 py-5 text-sm font-bold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Limite */}
                  <tr className="bg-gray-50/50">
                    <td colSpan={4} className="px-6 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Limite
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Număr firme</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">1</td>
                    <td className="px-6 py-4 text-sm text-blue-600 text-center font-semibold bg-blue-50/30">3</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">Nelimitat</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Număr angajați</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">10</td>
                    <td className="px-6 py-4 text-sm text-blue-600 text-center font-semibold bg-blue-50/30">100</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">Nelimitat</td>
                  </tr>

                  {/* Core Features */}
                  <tr className="bg-gray-50/50">
                    <td colSpan={4} className="px-6 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Funcționalități de bază
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Medicina muncii - tracking</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Echipamente PSI</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">Basic</td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Dashboard complet</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Alerte email automate</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Rapoarte PDF</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>

                  {/* Advanced Features */}
                  <tr className="bg-gray-50/50">
                    <td colSpan={4} className="px-6 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Funcționalități avansate
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Instruiri SSM & PSI</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Risc financiar - calcul amenzi ITM</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Export date Excel</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Rapoarte personalizate</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Alerte SMS</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center bg-blue-50/30">Opțional</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>

                  {/* Enterprise Features */}
                  <tr className="bg-gray-50/50">
                    <td colSpan={4} className="px-6 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Funcționalități Enterprise
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">White-label dashboard</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Multi-tenant architecture</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">REGES API integration</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Integrare ERP/HR (SAP, Saga)</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Workflows personalizate</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>

                  {/* Support */}
                  <tr className="bg-gray-50/50">
                    <td colSpan={4} className="px-6 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Suport
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Timp răspuns suport</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">48h</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center bg-blue-50/30">24h prioritar</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">24/7</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Onboarding dedicat</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Account manager dedicat</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Training complet echipă</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-blue-50/30"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">SLA uptime</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">—</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center bg-blue-50/30">—</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">99.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Întrebări frecvente despre preț</h2>
            <p className="text-gray-600 text-lg">Răspunsuri la cele mai comune întrebări</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Care este diferența între facturare lunară și anuală?',
                a: 'La facturare anuală economisești 20% față de plata lunară. De exemplu, planul Professional costă €29/lună (€348/an) sau €279/an dacă plătești anual - economisind €69. Poți alege perioada de facturare din toggle-ul de mai sus.',
              },
              {
                q: 'Pot face upgrade sau downgrade între planuri?',
                a: 'Da, poți schimba planul oricând din dashboard. La upgrade, diferența de preț se calculează pro-rata pentru perioada rămasă. La downgrade, creditul rămas se transferă către perioada următoare de facturare.',
              },
              {
                q: 'Ce se întâmplă dacă depășesc limita de angajați sau firme?',
                a: 'Sistemul te va notifica automat când te apropii de limită și îți va sugera să faci upgrade la planul următor. Datele tale rămân salvate și migrarea se face instant, fără pierdere de date sau întrerupere a serviciului.',
              },
              {
                q: 'Planul Starter este cu adevărat gratuit? Sunt costuri ascunse?',
                a: 'Da, planul Starter este 100% gratuit pentru totdeauna pentru 1 firmă și până la 10 angajați. Nu există costuri ascunse, taxe de setup sau perioadă de trial. Poți folosi toate funcționalitățile de bază nelimitat, fără card.',
              },
              {
                q: 'Pot anula abonamentul oricând?',
                a: 'Da, poți anula abonamentul oricând din dashboard, fără penalități. Datele tale rămân accesibile în modul read-only timp de 90 de zile pentru export. După anulare, poți reveni oricând la același plan sau altul.',
              },
            ].map((item, i) => (
              <details key={i} className="group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                  <span className="flex-shrink-0 text-gray-400 group-open:rotate-45 transition-transform text-2xl font-light">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Încă ai întrebări?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Vorbește cu un specialist s-s-m.ro pentru a afla planul potrivit pentru firma ta.
          </p>
          <a
            href="mailto:contact@s-s-m.ro?subject=Întrebări despre preț"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition shadow-lg"
          >
            Contactează-ne
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-black text-gray-900 mb-2">s-s-m.ro</div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Platformă digitală pentru conformitate SSM & PSI.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Navigare</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => router.push('/')} className="text-gray-600 hover:text-blue-600 transition">
                    Acasă
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/#features')} className="text-gray-600 hover:text-blue-600 transition">
                    Funcționalități
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/pricing')} className="text-gray-600 hover:text-blue-600 transition">
                    Preț
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📧 contact@s-s-m.ro</li>
                <li>📞 +40 700 000 000</li>
                <li>📍 București, România</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">© 2026 s-s-m.ro. Toate drepturile rezervate.</p>
            <div className="flex gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-600 transition">
                Termeni și condiții
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                Confidențialitate
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                GDPR
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
