'use client'

import { useRouter } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'

interface Change {
  type: 'new' | 'improved' | 'fixed' | 'removed'
  description: string
}

interface Version {
  version: string
  date: string
  changes: Change[]
}

const BADGE_CONFIG = {
  new: { bg: 'bg-green-100', text: 'text-green-700', label: 'NOU' },
  improved: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'ÎMBUNĂTĂȚIT' },
  fixed: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'REZOLVAT' },
  removed: { bg: 'bg-red-100', text: 'text-red-700', label: 'ELIMINAT' },
}

function ChangeBadge({ type }: { type: Change['type'] }) {
  const config = BADGE_CONFIG[type]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${config.bg} ${config.text} uppercase tracking-wide`}>
      {config.label}
    </span>
  )
}

export default function ChangelogPage() {
  const router = useRouter()

  const versions: Version[] = [
    {
      version: '2.1.0',
      date: '13 februarie 2026',
      changes: [
        { type: 'new', description: 'Pagina de profil utilizator cu upload avatar și setări personale' },
        { type: 'new', description: 'Baza de date acte legislative SSM pentru Polonia (140+ documente)' },
        { type: 'improved', description: 'Componentă Modal reutilizabilă cu animații îmbunătățite' },
        { type: 'improved', description: 'Dashboard responsive optimizat pentru tablete și mobile' },
        { type: 'fixed', description: 'Eroare la filtrarea documentelor după tip în pagina Documents' },
      ],
    },
    {
      version: '2.0.0',
      date: '1 februarie 2026',
      changes: [
        { type: 'new', description: 'Sistem RBAC dinamic cu roluri și permisiuni personalizabile' },
        { type: 'new', description: 'Modul Risc Financiar — calcul automat amenzi ITM pentru non-conformități' },
        { type: 'new', description: 'Export date Excel pentru rapoarte medicina muncii și echipamente PSI' },
        { type: 'improved', description: 'Performanță dashboard — încărcare cu 40% mai rapidă' },
        { type: 'removed', description: 'Sistem vechi de roluri hardcodate (migrat la RBAC)' },
      ],
    },
    {
      version: '1.5.2',
      date: '15 ianuarie 2026',
      changes: [
        { type: 'fixed', description: 'Alertele email nu se trimiteau pentru examene medicale expirate' },
        { type: 'fixed', description: 'Eroare la salvarea datelor instruiri SSM pentru angajați noi' },
        { type: 'improved', description: 'Validare formulare îmbunătățită cu mesaje de eroare clare' },
        { type: 'improved', description: 'Filtru organizații în dashboard admin — căutare mai rapidă' },
      ],
    },
    {
      version: '1.5.0',
      date: '5 ianuarie 2026',
      changes: [
        { type: 'new', description: 'Suport multilingv — română, engleză, bulgară, maghiară, germană' },
        { type: 'new', description: 'Pagina de onboarding interactivă pentru clienți noi' },
        { type: 'new', description: 'Componentă ConfirmDialog reutilizabilă pentru acțiuni critice' },
        { type: 'improved', description: 'Design îmbunătățit pentru badge-uri de status (valid/expirat/expiră)' },
        { type: 'fixed', description: 'Bug la navigare între organizații în dashboard multi-tenant' },
      ],
    },
    {
      version: '1.0.0',
      date: '1 decembrie 2025',
      changes: [
        { type: 'new', description: 'Lansare platformă s-s-m.ro — prima versiune publică' },
        { type: 'new', description: 'Modul Medicina Muncii — tracking examene medicale și certificate' },
        { type: 'new', description: 'Modul Echipamente PSI — gestiune stingătoare și hidranți' },
        { type: 'new', description: 'Modul Instruiri SSM & PSI — planificare și raportare' },
        { type: 'new', description: 'Dashboard principal cu statistici și alerte în timp real' },
        { type: 'new', description: 'Sistem de alertare automată email pentru scadențe apropiate' },
        { type: 'new', description: 'Audit log pentru toate acțiunile utilizatorilor' },
      ],
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
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi
          </button>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Changelog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Toate actualizările și îmbunătățirile platformei s-s-m.ro, în ordine cronologică.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Versions */}
            <div className="space-y-12">
              {versions.map((v, idx) => (
                <div key={idx} className="relative pl-8 md:pl-20">
                  {/* Dot */}
                  <div className="absolute left-0 md:left-8 top-2 w-0 h-0 -translate-x-1/2">
                    <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-lg" />
                  </div>

                  {/* Content card */}
                  <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                    {/* Header */}
                    <div className="flex flex-wrap items-baseline gap-3 mb-4">
                      <h2 className="text-2xl font-black text-gray-900">v{v.version}</h2>
                      <span className="text-sm text-gray-500 font-medium">{v.date}</span>
                    </div>

                    {/* Changes list */}
                    <ul className="space-y-3">
                      {v.changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="flex-shrink-0 pt-0.5">
                            <ChangeBadge type={change.type} />
                          </div>
                          <p className="text-gray-700 leading-relaxed flex-1">{change.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Vrei să testezi platforma?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Încearcă gratuit s-s-m.ro și descoperă toate funcționalitățile platformei.
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition shadow-lg"
          >
            Începe acum
          </button>
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
                  <button onClick={() => router.push('/changelog')} className="text-gray-600 hover:text-blue-600 transition">
                    Changelog
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
