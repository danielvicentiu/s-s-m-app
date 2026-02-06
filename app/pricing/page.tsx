'use client'

import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()

  const plans = [
    {
      name: 'Starter',
      price: 'Gratuit',
      period: '',
      description: 'Perfect pentru firme mici care încep digitalizarea SSM',
      features: [
        'Monitoring basic medicina muncii',
        '1 organizație',
        'Maxim 5 angajați',
        'Alerte email (săptămânale)',
        'Dashboard readonly',
        'Suport email standard',
      ],
      cta: 'Începe gratuit',
      highlighted: false,
      color: 'gray',
    },
    {
      name: 'Professional',
      price: '€200',
      period: '/an',
      description: 'Soluția completă pentru conformitate SSM & PSI',
      features: [
        'Medicina Muncii — tracking nelimitat',
        'Echipamente PSI — inventar complet',
        'Angajați nelimitați',
        'Alerte automate email zilnic',
        'Risc financiar — calcul amenzi ITM',
        'Multi-organizație — firme nelimitate',
        'Rapoarte PDF — generare automată',
        'Dashboard complet cu filtre',
        'Instruiri SSM & PSI (coming soon)',
        'Suport tehnic prioritar',
        'Backup automat zilnic',
        'Actualizări gratuite',
      ],
      cta: 'Începe acum',
      highlighted: true,
      color: 'blue',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Pentru grupuri de firme și consultanți SSM cu portofoliu extins',
      features: [
        'Toate features din Professional',
        'REGES API integration (ANRE)',
        'Multi-tenant architecture',
        'White-label dashboard',
        'Dedicated account manager',
        'SLA 99.9% uptime',
        'Onboarding dedicat',
        'Training echipă complet',
        'Custom workflows & automatizări',
        'Integrare ERP/HR (SAP, Saga, FluxHR)',
        'Audit trail complet',
        'Conformitate GDPR avansată',
      ],
      cta: 'Contactează-ne',
      highlighted: false,
      color: 'purple',
    },
  ]

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
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
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
                    className={`text-2xl font-black mb-2 ${
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
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-5xl font-black ${
                        plan.highlighted ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className={`text-lg ${
                          plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                  {plan.name === 'Professional' && (
                    <p
                      className={`text-xs mt-2 ${
                        plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      per organizație
                    </p>
                  )}
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
                      router.push('/login')
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
                {plan.name === 'Starter' && (
                  <p className="text-center text-xs text-gray-400 mt-4">
                    Fără card necesar
                  </p>
                )}
                {plan.name === 'Professional' && (
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
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Funcționalitate</th>
                    <th className="text-center px-6 py-4 text-sm font-bold text-gray-900">Starter</th>
                    <th className="text-center px-6 py-4 text-sm font-bold text-blue-600 bg-blue-50">Professional</th>
                    <th className="text-center px-6 py-4 text-sm font-bold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Medicina Muncii', 'Basic', '✓ Complet', '✓ Complet'],
                    ['Echipamente PSI', '—', '✓ Complet', '✓ Complet'],
                    ['Nr. organizații', '1', 'Nelimitat', 'Nelimitat'],
                    ['Nr. angajați', '5', 'Nelimitat', 'Nelimitat'],
                    ['Alerte email', 'Săptămânale', 'Zilnice', 'Zilnice + SMS'],
                    ['Risc financiar', '—', '✓', '✓'],
                    ['Rapoarte PDF', '—', '✓', '✓'],
                    ['REGES API', '—', '—', '✓'],
                    ['White-label', '—', '—', '✓'],
                    ['Dedicated support', '—', 'Email', '24/7 Phone'],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row[0]}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row[1]}</td>
                      <td className="px-6 py-4 text-sm text-blue-600 text-center font-semibold bg-blue-50/30">{row[2]}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row[3]}</td>
                    </tr>
                  ))}
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
            <h2 className="text-4xl font-black text-gray-900 mb-4">Întrebări despre preț</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Pot trece de la Starter la Professional oricând?',
                a: 'Da, poți face upgrade instant. Diferența de preț se calculează pro-rata pentru perioada rămasă.',
              },
              {
                q: 'Ce înseamnă "angajați nelimitați"?',
                a: 'Poți adăuga oricâți angajați în sistem, fără taxe suplimentare per utilizator. Prețul este fix per organizație.',
              },
              {
                q: 'Ce include planul Enterprise?',
                a: 'Integrare REGES API pentru raportare ANRE, white-label dashboard (logo și domeniu propriu), dedicated account manager, SLA 99.9%, onboarding personalizat și training complet echipă.',
              },
              {
                q: 'Există discount pentru plata anuală?',
                a: 'Prețul €200/an este deja rata anuală optimă. Pentru planuri multi-an (3+ ani) contactează-ne pentru ofertă personalizată.',
              },
              {
                q: 'Ce se întâmplă dacă depășesc 5 angajați pe Starter?',
                a: 'Sistemul te va notifica automat să faci upgrade la Professional. Datele tale rămân salvate și migrarea se face instant.',
              },
              {
                q: 'Pot anula abonamentul?',
                a: 'Da, poți anula oricând din dashboard. Datele tale rămân accesibile în modul readonly timp de 90 de zile pentru export.',
              },
            ].map((item, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                  <span className="flex-shrink-0 text-gray-400 group-open:rotate-45 transition-transform text-xl">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm">{item.a}</div>
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
