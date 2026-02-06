'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black text-gray-900">s-s-m.ro</div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
              Funcționalități
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
              Preț
            </a>
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
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 bg-blue-50 text-blue-600 border border-blue-200">
            Platformă digitală SSM & PSI
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Conformitate SSM & PSI<br />
            <span className="text-blue-600">100% automată</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Gestionează medicina muncii, echipamentele PSI, alertele și rapoartele dintr-o singură platformă.
            Zero birocrație, zero amenzi ITM.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Începe acum →
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Tot ce ai nevoie într-un singur loc</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              6 module integrate pentru conformitate completă SSM & PSI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Medicina Muncii */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🏥
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Medicina Muncii</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tracking fișe medicale, alerte expirare automată, evidență completă per angajat cu status real-time.
              </p>
            </div>

            {/* Feature 2: Echipamente PSI */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🧯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Echipamente PSI</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Inventar stingătoare, hidranți, detectoare fum. Programare verificări, log-uri mentenanță, QR code tracking.
              </p>
            </div>

            {/* Feature 3: Alerte Automate */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🔔
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Alerte Automate</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Email zilnic cu expirări iminente (30/15/7 zile). Integrare Resend, notificări WhatsApp (coming soon).
              </p>
            </div>

            {/* Feature 4: Risc Financiar */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                💰
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Risc Financiar</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Calcul automat amenzi potențiale ITM/ISU/ISCIR. Breakdown per autoritate, estimare min-max în RON.
              </p>
            </div>

            {/* Feature 5: Multi-Organizație */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🏢
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Organizație</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Gestionează 100+ firme dintr-un singur dashboard. Filtrare instant, preferințe salvate, arhitectură tenant.
              </p>
            </div>

            {/* Feature 6: Rapoarte PDF */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                📄
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rapoarte PDF</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Generare automată rapoarte ITM, hash SHA256 pentru imutabilitate, arhivare cloud, export 1-click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Preț transparent</h2>
            <p className="text-gray-600 text-lg">Un singur plan, toate funcționalitățile</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 mb-4">
                  PLAN PROFESIONAL
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-black text-gray-900">€200</span>
                  <span className="text-gray-500">/an</span>
                </div>
                <p className="text-sm text-gray-500">per organizație</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Medicina Muncii — tracking nelimitat',
                  'Echipamente PSI — inventar complet',
                  'Alerte automate email zilnic',
                  'Risc financiar — calcul amenzi ITM',
                  'Multi-organizație — firme nelimitate',
                  'Rapoarte PDF — generare automată',
                  'Suport tehnic prioritar',
                  'Backup automat zilnic',
                  'Actualizări gratuite',
                ].map((item, i) => (
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
                Începe acum
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Fără setup fee. Anulezi oricând.
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
              <div className="text-2xl font-black text-gray-900 mb-2">s-s-m.ro</div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Platformă digitală pentru conformitate SSM & PSI.
                Medicina muncii, echipamente PSI, alerte automate.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Navigare</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
                    Funcționalități
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">
                    Preț
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
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📧 contact@s-s-m.ro</li>
                <li>📞 +40 700 000 000</li>
                <li>📍 București, România</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              © 2026 s-s-m.ro. Toate drepturile rezervate.
            </p>
            <div className="flex gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-600 transition">Termeni și condiții</a>
              <a href="#" className="hover:text-blue-600 transition">Confidențialitate</a>
              <a href="#" className="hover:text-blue-600 transition">GDPR</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
