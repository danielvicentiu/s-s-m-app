'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Check } from 'lucide-react'

const PLANS = [
  {
    key: 'direct',
    name: 'Direct',
    price: '99 RON',
    period: '/lună',
    badge: null,
    description: 'Patron vine singur. Trial 14 zile gratuit.',
    features: [
      'Toate modulele SSM + PSI',
      'SEPP obligatoriu inclus',
      'Alerte automate email',
      'Rapoarte PDF',
      'Suport email',
    ],
    highlighted: false,
  },
  {
    key: 'partner_billed',
    name: 'Partner-Billed',
    price: '99 RON',
    period: '/lună',
    badge: 'Recomandat consultanților',
    description: 'SEPP aduce clientul. Preț Founding 12 luni fix.',
    features: [
      'Wholesale pentru consultanți',
      'Multi-client cockpit SEPP',
      'Toate modulele SSM + PSI',
      'Raportare consolidată',
      'Suport prioritar',
    ],
    highlighted: true,
  },
  {
    key: 'self_service',
    name: 'Self-Service',
    price: '79 RON',
    period: '/lună',
    badge: null,
    description: 'Firmă ≤9 angajați cu patron desemnat SSM.',
    features: [
      'Module de bază SSM',
      'Import date angajați',
      'Alerte automate email',
      'Fără SEPP obligatoriu',
      'Suport email',
    ],
    highlighted: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planKey: string) => {
    setLoading(planKey)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: planKey, billingOwner: 'patron' }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      console.error('[pricing] checkout error:', err)
      alert('Eroare la procesare. Încearcă din nou sau contactează suportul.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-black text-gray-900 hover:text-blue-600 transition"
          >
            s-s-m.ro
          </button>
          <div className="flex items-center gap-6">
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            14 zile trial gratuit · Fără card la înregistrare · Anulezi oricând
          </p>
          <p className="text-sm text-gray-400">Prețuri în RON, facturare lunară</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`rounded-2xl p-6 flex flex-col transition-all ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white shadow-2xl scale-105 border-4 border-blue-700'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {plan.badge && (
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider self-start ${
                      plan.highlighted
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <h2
                  className={`text-2xl font-black mb-1 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h2>

                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`text-4xl font-black ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-base ${
                      plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <p
                  className={`text-sm mb-6 leading-relaxed ${
                    plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-blue-200' : 'text-blue-600'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={loading === plan.key}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading === plan.key ? 'Se procesează...' : 'Începe trial gratuit'}
                </button>

                {plan.highlighted && (
                  <p className="text-center text-xs text-blue-100 mt-3">
                    Fără setup fee. Anulezi oricând.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            Întrebări frecvente
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Ce include trial-ul de 14 zile?',
                a: 'Acces complet la toate modulele planului ales. Nu este necesar un card bancar la înregistrare.',
              },
              {
                q: 'Pot schimba planul după activare?',
                a: 'Da. Upgrade sau downgrade oricând din portalul de facturare. Diferența se calculează pro-rata.',
              },
              {
                q: 'Ce este planul Partner-Billed?',
                a: 'Conceput pentru consultanți SSM/SEPP care gestionează mai mulți clienți. Include multi-client cockpit și raportare consolidată.',
              },
              {
                q: 'Ce include Self-Service?',
                a: 'Destinat firmelor mici cu ≤9 angajați unde patronul este desemnat SSM. Module de bază fără SEPP obligatoriu.',
              },
              {
                q: 'Pot anula abonamentul?',
                a: 'Da, oricând din portalul de facturare. Datele rămân accesibile în mod citire timp de 90 de zile.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                  <span className="flex-shrink-0 text-gray-400 group-open:rotate-45 transition-transform text-xl">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Încă ai întrebări?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Vorbește cu un specialist s-s-m.ro pentru planul potrivit firmei tale.
          </p>
          <a
            href="mailto:contact@s-s-m.ro?subject=Întrebări despre prețuri"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition shadow-lg"
          >
            Contactează-ne
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 s-s-m.ro. Toate drepturile rezervate.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-blue-600 transition">Termeni și condiții</a>
            <a href="#" className="hover:text-blue-600 transition">Confidențialitate</a>
            <a href="#" className="hover:text-blue-600 transition">GDPR</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
