'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight" style={{ color: '#1e40af' }}>s-s-m.ro</div>
          <div className="flex items-center gap-6">
            <a href="#beneficii" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Beneficii</a>
            <a href="#cum-functioneaza" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Cum funcționează</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">FAQ</a>
            <button
              onClick={() => router.push('/login')}
              className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#1e40af' }}
            >
              Intră în platformă
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 border" style={{ color: '#1e40af', borderColor: '#1e40af20', backgroundColor: '#1e40af08' }}>
            Platformă digitală SSM &amp; PSI
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-gray-900">
            Siguranța muncii,<br />
            <span style={{ color: '#1e40af' }}>simplificată pentru afacerea ta.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transformă birocrația SSM și PSI într-un proces digital invizibil.
            Tu te ocupi de creșterea firmei, noi ne ocupăm de protecția ei — legal, tehnic și automat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@s-s-m.ro?subject=Solicitare%20audit%20conformitate"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-white font-medium text-base transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#1e40af', boxShadow: '0 4px 24px #1e40af30' }}
            >
              Solicită un audit al conformității
            </a>
            <a
              href="#cum-functioneaza"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-medium text-base border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cum funcționează →
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-gray-100 py-8 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">100+</p>
            <p className="text-sm text-gray-500">Firme active</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200"></div>
          <div>
            <p className="text-3xl font-bold text-gray-900">20 ani</p>
            <p className="text-sm text-gray-500">Experiență SSM</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200"></div>
          <div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Amenzi ITM la clienți</p>
          </div>
        </div>
      </section>

      {/* Beneficii */}
      <section id="beneficii" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">De ce s-s-m.ro?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Trei avantaje concrete care te scapă de grija conformității</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Beneficiu 1 */}
            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl" style={{ backgroundColor: '#1e40af10' }}>
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3">Zero efort administrativ</h3>
              <p className="text-gray-500 leading-relaxed">
                Platforma centralizează automat fișele medicale, verificările stingătoarelor și instruirile.
                Totul e mereu la zi, fără intervenția ta zilnică.
              </p>
            </div>

            {/* Beneficiu 2 */}
            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl" style={{ backgroundColor: '#1e40af10' }}>
                🔔
              </div>
              <h3 className="text-xl font-bold mb-3">Monitorizare proactivă</h3>
              <p className="text-gray-500 leading-relaxed">
                Primești alerte inteligente înainte ca orice document să expire. Anticipăm nevoile de control
                și te notificăm prin email sau SMS.
              </p>
            </div>

            {/* Beneficiu 3 */}
            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl" style={{ backgroundColor: '#1e40af10' }}>
                ✅
              </div>
              <h3 className="text-xl font-bold mb-3">Validare legală digitală</h3>
              <p className="text-gray-500 leading-relaxed">
                Instruirile se parcurg pe telefon. Validarea prin cod OTP generează documente cu QR Hash
                imutabile, gata de prezentat autorităților.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cum funcționează */}
      <section id="cum-functioneaza" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">3 pași simpli</h2>
            <p className="text-gray-500">De la haosul dosarelor la liniștea conformității</p>
          </div>

          <div className="space-y-8">
            {/* Pas 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#1e40af' }}>
                1
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Configurarea profilului</h3>
                <p className="text-gray-500 leading-relaxed">
                  Încărcăm datele firmei și ale angajaților în baza noastră de date securizată.
                  Consultantul tău dedicat configurează fluxurile specifice riscurilor afacerii tale.
                </p>
              </div>
            </div>

            <div className="ml-5 border-l-2 border-dashed h-6" style={{ borderColor: '#1e40af30' }}></div>

            {/* Pas 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#1e40af' }}>
                2
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Automatizarea alertelor</h3>
                <p className="text-gray-500 leading-relaxed">
                  Sistemul preia monitorizarea termenelor pentru medicina muncii și echipamentele PSI.
                  Angajații primesc link-uri de instruire direct pe dispozitivele lor.
                </p>
              </div>
            </div>

            <div className="ml-5 border-l-2 border-dashed h-6" style={{ borderColor: '#1e40af30' }}></div>

            {/* Pas 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#1e40af' }}>
                3
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Generarea dovezilor de conformitate</h3>
                <p className="text-gray-500 leading-relaxed">
                  După parcurgerea modulelor, platforma generează automat fișele și documentele necesare,
                  arhivate electronic și protejate împotriva modificărilor ulterioare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Întrebări frecvente</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Ce este s-s-m.ro?', a: 'O platformă digitală concepută pentru a asista companiile în gestionarea legală și tehnică a protecției muncii și prevenirii incendiilor.' },
              { q: 'Este recunoscută această metodă de către ITM?', a: 'Da, platforma respectă prevederile Legii 319/2006 și normele de aplicare, oferind trasabilitate și validitate legală documentelor generate.' },
              { q: 'Cât durează implementarea inițială?', a: 'Pentru un IMM tipic, configurarea și lansarea primelor fluxuri de instruire durează mai puțin de 48 de ore.' },
              { q: 'Cum sunt notificați angajații?', a: 'Prin canalele preferate: email sau SMS, fără a fi necesară instalarea unei aplicații.' },
              { q: 'Ce se întâmplă dacă un angajat nu are smartphone?', a: 'Sistemul permite instruirea asistată pe un dispozitiv comun la sediul firmei, menținând aceleași standarde de validare.' },
              { q: 'Sunt datele mele în siguranță?', a: 'Folosim infrastructură de grad enterprise cu criptare și backup-uri automate pentru a garanta confidențialitatea datelor.' },
              { q: 'Platforma înlocuiește consultantul SSM?', a: 'Nu, platforma este un instrument care potențează expertiza consultantului, eliminând erorile umane și birocrația manuală.' },
              { q: 'Putem gestiona mai multe puncte de lucru?', a: 'Da, arhitectura multi-tenant permite gestionarea centralizată a mai multor filiale sau firme din cadrul unui grup.' },
              { q: 'Ce documente pot fi generate?', a: 'De la fișe de instruire individuală și colectivă, până la evidența examenelor medicale și a verificărilor PSI.' },
              { q: 'Cum pot începe colaborarea?', a: 'Simplu, prin solicitarea unei demonstrații. Un consultant vă va contacta pentru a evalua nevoile specifice ale firmei dvs.' },
            ].map((item, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                  <span className="flex-shrink-0 text-gray-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <div className="px-5 pb-5 text-gray-500 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6" style={{ backgroundColor: '#1e40af' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ești gata să digitalizezi siguranța firmei tale?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Alătură-te companiilor care au ales să elimine stresul controalelor prin tehnologie.
          </p>
          <a
            href="mailto:contact@s-s-m.ro?subject=Solicitare%20demonstratie"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white font-medium text-base transition-all hover:bg-gray-100"
            style={{ color: '#1e40af' }}
          >
            Contactează un specialist s-s-m.ro
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold" style={{ color: '#1e40af' }}>s-s-m.ro</p>
            <p className="text-sm text-gray-400">Platformă digitală SSM &amp; PSI</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Termeni și condiții</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Confidențialitate</a>
            <a href="mailto:contact@s-s-m.ro" className="hover:text-gray-600 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-300">© 2026 s-s-m.ro. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
}
