'use client'

import { useRouter } from '@/i18n/navigation'
import { Shield, Lock, Database, Server, FileCheck, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react'

export default function SecurityPage() {
  const router = useRouter()

  const securityFeatures = [
    {
      icon: Lock,
      title: 'Criptare end-to-end',
      description: 'Toate datele sunt criptate în tranzit (TLS 1.3) și în repaus (AES-256).',
      details: [
        'TLS 1.3 pentru toate conexiunile',
        'Certificat SSL wildcard cu auto-renewal',
        'AES-256 encryption pentru date sensibile în baza de date',
        'Hashing bcrypt pentru parole (cost factor 12)',
      ],
    },
    {
      icon: Database,
      title: 'Localizare date în UE',
      description: 'Infrastructură 100% în Uniunea Europeană, conform GDPR.',
      details: [
        'Primary database: Frankfurt, Germania (eu-central-1)',
        'Backup database: Amsterdam, Olanda (eu-west-1)',
        'CDN Vercel Edge: servere europene',
        'Zero transfer de date către SUA sau țări non-UE',
      ],
    },
    {
      icon: Server,
      title: 'Backup automat zilnic',
      description: 'Backup complet zilnic cu retenție 30 zile + snapshot-uri orare.',
      details: [
        'Backup automat zilnic la ora 02:00 UTC',
        'Snapshot-uri incrementale la fiecare 6 ore',
        'Retenție 30 zile pentru backup-uri complete',
        'Point-in-time recovery până la 7 zile în urmă',
        'Test lunar de recovery pentru validare',
      ],
    },
    {
      icon: Shield,
      title: 'Conformitate GDPR',
      description: 'Design by default pentru protecția datelor personale.',
      details: [
        'Privacy by design — minimizare date colectate',
        'Consimțământ explicit pentru procesare date',
        'Drept la uitare (GDPR Art. 17) — ștergere completă',
        'Export date în format JSON/CSV (portabilitate)',
        'DPO desemnat: dpo@s-s-m.ro',
        'Register of processing activities (RoPA) actualizat',
      ],
    },
    {
      icon: Eye,
      title: 'Audit log complet',
      description: 'Toate acțiunile utilizatorilor sunt înregistrate pentru trasabilitate.',
      details: [
        'Logging pentru toate operațiunile CRUD',
        'Tracking modificări pe date sensibile (medicamente, echipamente)',
        'IP logging pentru acțiuni critice (login, ștergere)',
        'Retenție audit log: 12 luni (conform Legea 190/2018)',
        'Access log disponibil administratorilor organizației',
      ],
    },
    {
      icon: FileCheck,
      title: 'Autentificare securizată',
      description: 'Multi-factor authentication și politici stricte pentru parole.',
      details: [
        'Supabase Auth cu email verification obligatorie',
        'Password policy: min. 8 caractere, complexitate medie',
        'Rate limiting: max 5 încercări login / 15 minute',
        'Session timeout: 24h inactivitate',
        'MFA (TOTP) — disponibil în planurile Pro+',
        'SSO (SAML/OAuth) — disponibil în Enterprise',
      ],
    },
  ]

  const complianceStandards = [
    {
      name: 'GDPR',
      status: 'Compliant',
      icon: '🇪🇺',
      description: 'Regulament (UE) 2016/679 — protecția datelor personale',
    },
    {
      name: 'ISO 27001',
      status: 'În pregătire',
      icon: '📋',
      description: 'Standard internațional pentru management securitate informației',
    },
    {
      name: 'SOC 2 Type II',
      status: 'Roadmap Q3 2026',
      icon: '🔐',
      description: 'Audit independent pentru securitate, disponibilitate, confidențialitate',
    },
    {
      name: 'NIS2',
      status: 'În pregătire',
      icon: '🛡️',
      description: 'Directiva UE 2022/2555 — securitate cibernetică (obligatorie pentru unele sectoare)',
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
            <button onClick={() => router.push('/security')} className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors hidden md:block">
              Securitate
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Securitatea datelor tale<br />
            <span className="text-blue-600">este prioritatea #1</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Infrastructură enterprise-grade, conformitate GDPR, criptare AES-256 și backup zilnic automat.
            Datele tale sunt în siguranță.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              GDPR Compliant
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Date în UE
            </div>
            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Criptare AES-256
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Cum protejăm datele tale</h2>
            <p className="text-gray-600 text-lg">Măsuri tehnice și organizatorice pentru securitate maximă</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Standarde de conformitate</h2>
            <p className="text-gray-600 text-lg">Certificări și audituri pentru încredere maximă</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceStandards.map((standard, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all text-center"
              >
                <div className="text-4xl mb-3">{standard.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{standard.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                  standard.status === 'Compliant'
                    ? 'bg-green-100 text-green-700'
                    : standard.status.includes('pregătire')
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {standard.status}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Infrastructură cloud</h2>
            <p className="text-gray-600 text-lg">Provideri enterprise-grade, infrastructură 100% în UE</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-4">🗄️ Database</h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Supabase (PostgreSQL)</strong><br />
                Region: Frankfurt, DE (eu-central-1)<br />
                Backup: Amsterdam, NL (eu-west-1)
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Managed PostgreSQL 15</li>
                <li>✓ Row-Level Security (RLS)</li>
                <li>✓ Automated backups</li>
                <li>✓ Point-in-time recovery</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-4">⚡ Hosting</h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Vercel (Edge Network)</strong><br />
                Regions: Frankfurt, Amsterdam<br />
                Latency: &lt;50ms în Europa
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Next.js 14 serverless</li>
                <li>✓ Auto-scaling</li>
                <li>✓ DDoS protection</li>
                <li>✓ 99.99% uptime SLA</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-4">📦 File Storage</h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Supabase Storage</strong><br />
                Region: Frankfurt, DE<br />
                Encryption: AES-256
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ S3-compatible storage</li>
                <li>✓ Virus scanning (ClamAV)</li>
                <li>✓ File size validation</li>
                <li>✓ Access control per-user</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 md:p-12 border-2 border-orange-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Responsible Disclosure</h2>
                <p className="text-gray-600 text-lg">
                  Ai descoperit o vulnerabilitate de securitate? Ne poți raporta responsabil.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">📧 Contact securitate</h3>
              <p className="text-gray-700 mb-2">
                Email: <a href="mailto:security@s-s-m.ro" className="text-blue-600 font-semibold hover:underline">security@s-s-m.ro</a>
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Te rugăm să NU publici vulnerabilitatea până nu primești confirmare de la noi.
                Vom răspunde în maxim 48 de ore și vom lucra la rezolvarea problemei în cel mai scurt timp.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">✅ În scope</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• SQL injection, XSS, CSRF</li>
                  <li>• Authentication bypass</li>
                  <li>• Data exposure / RLS bypass</li>
                  <li>• Server-side vulnerabilities</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">❌ Out of scope</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• DDoS attacks</li>
                  <li>• Social engineering</li>
                  <li>• Physical security</li>
                  <li>• Third-party services (Supabase, Vercel)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Bug Bounty Program:</strong> Planificăm lansarea unui program oficial de bug bounty în Q4 2026.
                Detalii vor fi publicate pe această pagină.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Roadmap */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Security Roadmap 2026</h2>
            <p className="text-gray-600 text-lg">Investim continuu în securitate și conformitate</p>
          </div>

          <div className="space-y-6">
            {[
              {
                quarter: 'Q1 2026',
                status: 'În progres',
                color: 'blue',
                items: [
                  'Implementare MFA (TOTP) pentru toate planurile',
                  'Audit GDPR intern complet',
                  'Penetration testing extern (tier 1)',
                ],
              },
              {
                quarter: 'Q2 2026',
                status: 'Planificat',
                color: 'purple',
                items: [
                  'Certificare ISO 27001 (kickoff)',
                  'Implementare SSO (SAML) pentru Enterprise',
                  'Security awareness training pentru toată echipa',
                ],
              },
              {
                quarter: 'Q3 2026',
                status: 'Planificat',
                color: 'indigo',
                items: [
                  'Audit SOC 2 Type II (kickoff)',
                  'Conformitate NIS2 pentru clienți sectoare critice',
                  'Bug bounty program public launch',
                ],
              },
              {
                quarter: 'Q4 2026',
                status: 'Roadmap',
                color: 'gray',
                items: [
                  'Certificare ISO 27001 finalizare',
                  'SOC 2 Type II report publicare',
                  'Implementare security.txt și Well-Known URIs',
                ],
              },
            ].map((quarter, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-gray-900">{quarter.quarter}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${quarter.color}-100 text-${quarter.color}-700`}>
                    {quarter.status}
                  </span>
                </div>
                <ul className="space-y-2">
                  {quarter.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 text-${quarter.color}-600`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Security */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Întrebări despre securitate</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Unde sunt stocate datele mele?',
                a: 'Toate datele sunt stocate exclusiv în Uniunea Europeană, în datacenter-uri din Frankfurt (Germania) și Amsterdam (Olanda). Zero transfer de date către SUA sau țări non-UE. Suntem full GDPR compliant.',
              },
              {
                q: 'Ce tip de criptare folosiți?',
                a: 'Folosim TLS 1.3 pentru criptare în tranzit și AES-256 pentru criptare în repaus. Toate parolele sunt hash-uite cu bcrypt (cost factor 12). Datele sensibile (ex: CNP-uri, date medicale) sunt criptate suplimentar la nivel de coloană în baza de date.',
              },
              {
                q: 'Cum funcționează backup-ul datelor?',
                a: 'Avem backup automat zilnic complet la ora 02:00 UTC, plus snapshot-uri incrementale la fiecare 6 ore. Retenție 30 zile pentru backup-uri complete. Point-in-time recovery disponibil pentru ultimele 7 zile. Testăm lunar procedura de recovery.',
              },
              {
                q: 'Pot șterge definitiv datele mele?',
                a: 'Da, conform GDPR Art. 17 (dreptul la uitare), poți solicita ștergerea completă a datelor tale. Trimite email la dpo@s-s-m.ro. Vom șterge toate datele în max 30 zile, inclusiv din backup-uri. Păstrăm doar facturi pentru obligații fiscale (5 ani).',
              },
              {
                q: 'Aveți audit log pentru modificări?',
                a: 'Da, toate acțiunile utilizatorilor sunt înregistrate în audit log: login, modificări date, ștergeri, export. Retenție 12 luni conform Legea 190/2018. Administratorii organizației pot accesa audit log-ul din dashboard.',
              },
              {
                q: 'Ce se întâmplă dacă există un breach de securitate?',
                a: 'Avem incident response plan conform GDPR. În caz de breach, vom notifica autoritățile (ANSPDCP) în max 72h și utilizatorii afectați imediat. Avem asigurare cyber-liability pentru daune. Vom publica raport public de transparență.',
              },
              {
                q: 'Suportați MFA (Multi-Factor Authentication)?',
                a: 'Da, MFA prin TOTP (Google Authenticator, Authy) este disponibil în planurile Pro, Corporate și Enterprise. Vom adăuga suport pentru WebAuthn (hardware keys) în Q2 2026.',
              },
              {
                q: 'Pot exporta datele mele?',
                a: 'Da, poți exporta toate datele tale în format JSON sau CSV din dashboard (secțiunea Settings > Export Data). Conform GDPR, datele sunt în format structurat, utilizabil pe alte platforme.',
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Încă ai întrebări despre securitate?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Echipa noastră de securitate este disponibilă pentru orice clarificări.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:security@s-s-m.ro"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition shadow-lg"
            >
              Contactează Security Team
            </a>
            <button
              onClick={() => router.push('/pricing')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-700 text-white font-bold text-lg hover:bg-blue-800 transition border-2 border-white/20"
            >
              Vezi planuri de preț
            </button>
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
                <li>
                  <button onClick={() => router.push('/security')} className="text-gray-600 hover:text-blue-600 transition">
                    Securitate
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📧 contact@s-s-m.ro</li>
                <li>🔒 security@s-s-m.ro</li>
                <li>🛡️ dpo@s-s-m.ro</li>
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
