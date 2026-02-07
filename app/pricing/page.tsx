'use client'

import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()

  const plans = [
    {
      name: 'Basic',
      price: '€200',
      period: '/an',
      employeeRange: '1-5 angajați',
      description: 'Perfect pentru firme mici care încep digitalizarea SSM',
      features: [
        'Monitoring medicina muncii',
        'Echipamente PSI — tracking basic',
        'Maxim 5 angajați',
        'Alerte email automate',
        'Dashboard complet',
        'Rapoarte PDF',
        'Suport email',
      ],
      cta: 'Începe acum',
      highlighted: false,
      color: 'gray',
    },
    {
      name: 'Pro',
      price: '€350',
      period: '/an',
      employeeRange: '6-20 angajați',
      description: 'Soluția optimă pentru firme în creștere',
      features: [
        'Toate din Basic',
        'Până la 20 angajați',
        'Risc financiar — calcul amenzi ITM',
        'Multi-organizație',
        'Instruiri SSM & PSI',
        'Alerte SMS (opțional)',
        'Suport prioritar',
        'Export date Excel',
      ],
      cta: 'Începe acum',
      highlighted: true,
      color: 'blue',
    },
    {
      name: 'Corporate',
      price: '€1000',
      period: '/an',
      employeeRange: '21-100 angajați',
      description: 'Pentru organizații cu echipe mari',
      features: [
        'Toate din Pro',
        'Până la 100 angajați',
        'REGES API integration',
        'Rapoarte personalizate',
        'Onboarding dedicat',
        'Account manager',
        'SLA 99.5% uptime',
        'Training complet echipă',
      ],
      cta: 'Începe acum',
      highlighted: false,
      color: 'purple',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      employeeRange: '100+ angajați',
      description: 'Soluție la cheie pentru grupuri de firme și consultanți SSM',
      features: [
        'Toate din Corporate',
        'Angajați nelimitați',
        'White-label dashboard',
        'Multi-tenant architecture',
        'Integrare ERP/HR (SAP, Saga)',
        'Workflows personalizate',
        'SLA 99.9% uptime',
        'Dedicated support 24/7',
      ],
      cta: 'Contactează-ne',
      highlighted: false,
      color: 'indigo',
    },
  ]

  const addOns = [
    {
      name: 'Conformitate NIS2',
      price: '€200',
      period: '/an',
      description: 'Raportare automată și monitorizare conformitate Directiva NIS2',
    },
    {
      name: 'Conformitate GDPR',
      price: '€150',
      period: '/an',
      description: 'Gestiune consimțăminte, rapoarte privacy, tracking DPO',
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 transition-all ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white shadow-2xl scale-105 border-4 border-blue-700'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {/* Badge */}
                {plan.highlighted && (
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-4 uppercase tracking-wider">
                    Popular
                  </div>
                )}

                {/* Header */}
                <div className="mb-4">
                  <h3
                    className={`text-2xl font-black mb-1 ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs font-semibold mb-2 ${
                      plan.highlighted ? 'text-blue-100' : 'text-blue-600'
                    }`}
                  >
                    {plan.employeeRange}
                  </p>
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
                      className={`text-4xl font-black ${
                        plan.highlighted ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className={`text-base ${
                          plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-blue-200' : 'text-blue-600'
                        }`}
                      />
                      <span
                        className={`text-xs ${
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
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Footer note */}
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

      {/* Add-ons */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Module suplimentare (Add-ons)</h2>
            <p className="text-gray-600 text-lg">Extinde funcționalitatea platformei cu module de conformitate</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {addOns.map((addon, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <h3 className="text-2xl font-black text-gray-900 mb-2">{addon.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-blue-600">{addon.price}</span>
                  <span className="text-gray-500">{addon.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{addon.description}</p>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Adaugă la plan
                </button>
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
                    <th className="text-center px-4 py-4 text-sm font-bold text-gray-900">Basic</th>
                    <th className="text-center px-4 py-4 text-sm font-bold text-blue-600 bg-blue-50">Pro</th>
                    <th className="text-center px-4 py-4 text-sm font-bold text-gray-900">Corporate</th>
                    <th className="text-center px-4 py-4 text-sm font-bold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Medicina Muncii', '✓', '✓', '✓', '✓'],
                    ['Echipamente PSI', '✓ Basic', '✓', '✓', '✓'],
                    ['Nr. angajați', '1-5', '6-20', '21-100', 'Nelimitat'],
                    ['Nr. organizații', '1', 'Multi', 'Multi', 'Nelimitat'],
                    ['Alerte email', '✓', '✓', '✓', '✓'],
                    ['Risc financiar ITM', '—', '✓', '✓', '✓'],
                    ['Instruiri SSM', '—', '✓', '✓', '✓'],
                    ['REGES API', '—', '—', '✓', '✓'],
                    ['Rapoarte custom', '—', '—', '✓', '✓'],
                    ['White-label', '—', '—', '—', '✓'],
                    ['Account manager', '—', '—', '✓', '✓'],
                    ['SLA uptime', '—', '—', '99.5%', '99.9%'],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row[0]}</td>
                      <td className="px-4 py-4 text-sm text-gray-600 text-center">{row[1]}</td>
                      <td className="px-4 py-4 text-sm text-blue-600 text-center font-semibold bg-blue-50/30">{row[2]}</td>
                      <td className="px-4 py-4 text-sm text-gray-600 text-center">{row[3]}</td>
                      <td className="px-4 py-4 text-sm text-gray-600 text-center">{row[4]}</td>
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
                q: 'Pot trece de la Basic la Pro sau Corporate oricând?',
                a: 'Da, poți face upgrade instant. Diferența de preț se calculează pro-rata pentru perioada rămasă.',
              },
              {
                q: 'Ce se întâmplă dacă depășesc limita de angajați?',
                a: 'Sistemul te va notifica automat să faci upgrade la planul următor. Datele tale rămân salvate și migrarea se face instant, fără pierdere de date.',
              },
              {
                q: 'Ce include planul Enterprise?',
                a: 'Integrare REGES API pentru raportare ANRE, white-label dashboard (logo și domeniu propriu), dedicated account manager, SLA 99.9%, onboarding personalizat și training complet echipă.',
              },
              {
                q: 'Ce sunt add-on-urile NIS2 și GDPR?',
                a: 'Sunt module suplimentare pentru conformitate specifică: NIS2 pentru securitate cibernetică (obligatoriu pentru anumite sectoare) și GDPR pentru protecția datelor personale. Se pot adăuga la orice plan.',
              },
              {
                q: 'Există discount pentru plata anuală?',
                a: 'Prețurile afișate sunt deja tarifeinclude anuale. Pentru planuri multi-an (3+ ani) sau multiple organizații, contactează-ne pentru ofertă personalizată.',
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
