'use client'

import { useState } from 'react'
import { Cookie, Shield, Settings, BarChart3, Megaphone, Info, ExternalLink } from 'lucide-react'

type CookieCategory = 'essential' | 'functional' | 'analytics' | 'marketing'

interface CookieDetail {
  name: string
  purpose: string
  duration: string
  provider: string
  category: CookieCategory
}

const COOKIE_DATA: CookieDetail[] = [
  // Essential Cookies
  {
    name: 'sb-access-token',
    purpose: 'Token de autentificare pentru sesiunea utilizatorului',
    duration: '1 oră',
    provider: 'Supabase (first-party)',
    category: 'essential',
  },
  {
    name: 'sb-refresh-token',
    purpose: 'Token pentru reîmprospătarea sesiunii de autentificare',
    duration: '30 zile',
    provider: 'Supabase (first-party)',
    category: 'essential',
  },
  {
    name: 'cookie-consent',
    purpose: 'Salvează preferințele utilizatorului pentru cookie-uri',
    duration: '1 an',
    provider: 's-s-m.ro (first-party)',
    category: 'essential',
  },
  // Functional Cookies
  {
    name: 'locale',
    purpose: 'Reține limba preferată de utilizator (RO/EN/BG/HU/DE)',
    duration: '1 an',
    provider: 's-s-m.ro (first-party)',
    category: 'functional',
  },
  {
    name: 'theme-preference',
    purpose: 'Salvează preferința pentru tema light/dark',
    duration: '1 an',
    provider: 's-s-m.ro (first-party)',
    category: 'functional',
  },
  // Analytics Cookies
  {
    name: '_ga',
    purpose: 'Identifică vizitatorii unici și colectează statistici despre utilizarea site-ului',
    duration: '2 ani',
    provider: 'Google Analytics (third-party)',
    category: 'analytics',
  },
  {
    name: '_ga_*',
    purpose: 'Cookie de sesiune pentru Google Analytics 4',
    duration: '2 ani',
    provider: 'Google Analytics (third-party)',
    category: 'analytics',
  },
  {
    name: '_gid',
    purpose: 'Identifică vizitatorii unici pe termen scurt',
    duration: '24 ore',
    provider: 'Google Analytics (third-party)',
    category: 'analytics',
  },
  // Marketing Cookies
  {
    name: '_fbp',
    purpose: 'Cookie Facebook Pixel pentru urmărirea conversiilor și remarketing',
    duration: '90 zile',
    provider: 'Facebook (third-party)',
    category: 'marketing',
  },
  {
    name: 'IDE',
    purpose: 'Cookie Google DoubleClick pentru publicitate targetată',
    duration: '1 an',
    provider: 'Google (third-party)',
    category: 'marketing',
  },
]

const CATEGORIES = [
  {
    id: 'essential',
    label: 'Cookie-uri esențiale',
    icon: Shield,
    color: 'blue',
    description: 'Necesare pentru funcționarea de bază a platformei. Nu pot fi dezactivate.',
  },
  {
    id: 'functional',
    label: 'Cookie-uri funcționale',
    icon: Settings,
    color: 'green',
    description: 'Îmbunătățesc experiența utilizatorului prin salvarea preferințelor.',
  },
  {
    id: 'analytics',
    label: 'Cookie-uri analitice',
    icon: BarChart3,
    color: 'purple',
    description: 'Ne ajută să înțelegem cum utilizați platforma pentru a o îmbunătăți.',
  },
  {
    id: 'marketing',
    label: 'Cookie-uri marketing',
    icon: Megaphone,
    color: 'orange',
    description: 'Utilizate pentru publicitate personalizată și urmărirea conversiilor.',
  },
] as const

export default function CookiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<CookieCategory | 'all'>('all')

  const filteredCookies = selectedCategory === 'all'
    ? COOKIE_DATA
    : COOKIE_DATA.filter((cookie) => cookie.category === selectedCategory)

  const categoryInfo = CATEGORIES.find((cat) => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Cookie className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Politica Cookie-uri</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Această politică explică ce sunt cookie-urile, cum le folosim pe platforma s-s-m.ro
            și cum puteți controla preferințele dvs. privind cookie-urile.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Ultima actualizare: 13 februarie 2026
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ce sunt cookie-urile */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce sunt cookie-urile?</h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                <p>
                  Cookie-urile sunt fișiere text de mici dimensiuni care sunt stocate pe dispozitivul
                  dvs. (computer, smartphone, tabletă) atunci când vizitați un site web. Acestea permit
                  site-ului să vă recunoască și să își amintească anumite informații despre preferințele
                  dvs. sau acțiunile anterioare.
                </p>
                <p>
                  Cookie-urile nu pot rula programe pe computerul dvs., nu pot conține viruși și nu
                  pot accesa informații personale de pe hard disk-ul dvs. Ele sunt utilizate pentru
                  a îmbunătăți funcționalitatea site-ului și experiența dvs. de utilizare.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categorii de cookie-uri */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tipuri de cookie-uri pe care le folosim</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map((category) => {
              const Icon = category.icon
              const count = COOKIE_DATA.filter((c) => c.category === category.id).length

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-${category.color}-100 flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${category.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.label}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({count} cookie-uri)
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      {category.id === 'essential' && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          <Shield className="w-3 h-3" />
                          Întotdeauna active
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Tabel cookie-uri */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cookie-uri utilizate pe platformă
            </h2>

            {/* Filtre categorii */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toate ({COOKIE_DATA.length})
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as CookieCategory)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? `bg-${category.color}-600 text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label} ({COOKIE_DATA.filter((c) => c.category === category.id).length})
                </button>
              ))}
            </div>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nume Cookie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Scop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Durată
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Furnizor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCookies.map((cookie, index) => {
                  const category = CATEGORIES.find((cat) => cat.id === cookie.category)
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {cookie.name}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                        {cookie.purpose}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                        {cookie.duration}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-900">{cookie.provider}</span>
                          {category && (
                            <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium bg-${category.color}-100 text-${category.color}-700`}>
                              {category.label}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredCookies.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              Nu există cookie-uri în această categorie.
            </div>
          )}
        </section>

        {/* Cum să controlezi cookie-urile */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Cum poți controla și șterge cookie-urile
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                1. Setările platformei s-s-m.ro
              </h3>
              <p className="text-gray-600 mb-3">
                Poți gestiona preferințele tale pentru cookie-uri prin panoul de consimțământ care
                apare la prima vizită sau accesând setările de confidențialitate din contul tău.
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Settings className="w-4 h-4" />
                Gestionează preferințele cookie
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                2. Setările browser-ului
              </h3>
              <p className="text-gray-600 mb-3">
                Majoritatea browserelor web moderne îți permit să controlezi cookie-urile prin
                setările de confidențialitate. Poți:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Vizualiza ce cookie-uri sunt stocate și să le ștergi individual</li>
                <li>Bloca cookie-uri terțe (third-party cookies)</li>
                <li>Bloca toate cookie-urile de la anumite site-uri web</li>
                <li>Șterge toate cookie-urile când închizi browser-ul</li>
                <li>Naviga în modul incognito/privat pentru a preveni stocarea cookie-urilor</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                Linkuri utile pentru gestionarea cookie-urilor:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Google Chrome
                </a>
                <a
                  href="https://support.mozilla.org/ro/kb/cookies-informatii-stocate-site-urile-web-pe-calculatorul-dvs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Mozilla Firefox
                </a>
                <a
                  href="https://support.microsoft.com/ro-ro/microsoft-edge/ștergeți-cookie-urile-în-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Microsoft Edge
                </a>
                <a
                  href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Safari
                </a>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Atenție</h4>
                  <p className="text-sm text-amber-800">
                    Blocarea sau ștergerea cookie-urilor poate afecta funcționalitatea platformei
                    s-s-m.ro. De exemplu, nu veți putea rămâne autentificat sau preferințele dvs.
                    nu vor fi salvate. Cookie-urile esențiale sunt necesare pentru funcționarea de
                    bază a platformei și nu pot fi dezactivate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consent management */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Gestionarea consimțământului pentru cookie-uri
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              La prima vizită pe platforma s-s-m.ro, veți vedea un banner de consimțământ pentru
              cookie-uri. Puteți accepta toate cookie-urile sau să personalizați preferințele
              selectând individual fiecare categorie.
            </p>
            <p>
              <strong>Cookie-urile esențiale</strong> sunt activate în mod implicit și nu pot fi
              dezactivate deoarece sunt necesare pentru funcționarea de bază a platformei
              (autentificare, securitate, preferințe de bază).
            </p>
            <p>
              Puteți modifica în orice moment preferințele dvs. accesând secțiunea de setări din
              contul dvs. sau făcând clic pe linkul "Gestionează preferințele cookie" din subsol.
            </p>
          </div>
        </section>

        {/* Cookie-uri terțe */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cookie-uri terțe (Third-party cookies)
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              Pe lângă cookie-urile proprii (first-party), utilizăm și cookie-uri de la terți pentru
              analiză și marketing:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Google Analytics:</strong> Pentru a înțelege cum este utilizată platforma
                și pentru a îmbunătăți experiența utilizatorilor. Datele sunt anonimizate și
                agregate. Mai multe informații:
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 ml-1">
                  Politica de confidențialitate Google
                </a>
              </li>
              <li>
                <strong>Facebook Pixel:</strong> Pentru măsurarea eficienței campaniilor publicitare
                și remarketing. Mai multe informații:
                <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 ml-1">
                  Politica de confidențialitate Facebook
                </a>
              </li>
            </ul>
            <p>
              Aceste servicii terțe pot utiliza propriile cookie-uri pentru a urmări activitatea
              dvs. pe mai multe site-uri web. Puteți refuza utilizarea cookie-urilor terțe prin
              setările de consimțământ sau prin setările browser-ului.
            </p>
          </div>
        </section>

        {/* Actualizări */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Actualizări ale politicii de cookie-uri
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              Ne rezervăm dreptul de a actualiza această Politică de Cookie-uri periodic pentru a
              reflecta schimbările în tehnologie, legislație sau în practicile noastre de afaceri.
            </p>
            <p>
              Vă recomandăm să revedeți această pagină periodic pentru a fi la curent cu orice
              modificări. Data ultimei actualizări este afișată în partea de sus a acestei pagini.
            </p>
            <p>
              Pentru întrebări privind utilizarea cookie-urilor sau această politică, vă rugăm să
              ne contactați la:{' '}
              <a href="mailto:contact@s-s-m.ro" className="text-blue-600 hover:text-blue-700 font-medium">
                contact@s-s-m.ro
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
