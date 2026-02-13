'use client'

import { useState } from 'react'
import { X, CheckCircle2, Clock } from 'lucide-react'

type Country = {
  code: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
  name: string
  nameLocal: string
  language: string
  legislation: string[]
  features: string[]
  pricing: {
    currency: string
    startingPrice: string
    note: string
  }
  isActive: boolean
  position: { x: number; y: number }
}

const countries: Country[] = [
  {
    code: 'RO',
    name: 'România',
    nameLocal: 'România',
    language: 'Română',
    legislation: [
      'Legea 319/2006 - Securitate și sănătate în muncă',
      'Legea 307/2006 - Apărare împotriva incendiilor',
      'HG 1425/2006 - Norme metodologice SSM',
      'Ordinul 355/2007 - Autorizare tehnici SSM'
    ],
    features: [
      'Dosar SSM complet digitalizat',
      'Fișe medicale și avize PSI',
      'Registre de instruire digitale',
      'Alerte automate legislație',
      'Rapoarte conform ANI'
    ],
    pricing: {
      currency: 'RON',
      startingPrice: '199',
      note: 'pe lună pentru firme mici (până la 50 angajați)'
    },
    isActive: true,
    position: { x: 520, y: 280 }
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    nameLocal: 'България',
    language: 'Bulgară',
    legislation: [
      'Закон за здравословни и безопасни условия на труд',
      'Закон за защита при бедствия',
      'Наредба № 7 - Минимални изисквания за безопасност',
      'Наредба № РД-07-2 - Медицински прегледи'
    ],
    features: [
      'Пълна дигитализация на ЗБУТ досиета',
      'Медицински картони и разрешителни',
      'Регистри за обучение',
      'Автоматични напомняния',
      'Съответствие с ИА ГИТН'
    ],
    pricing: {
      currency: 'BGN',
      startingPrice: '99',
      note: 'месечно за малки фирми (до 50 служители)'
    },
    isActive: true,
    position: { x: 540, y: 340 }
  },
  {
    code: 'HU',
    name: 'Ungaria',
    nameLocal: 'Magyarország',
    language: 'Maghiară',
    legislation: [
      '93/1993 törvény - Munkavédelem',
      '54/2014 OGY határozat - Tűzvédelem',
      'OSHA előírások harmonizálása',
      'Munkaügyi ellenőrzési szabályok'
    ],
    features: [
      'Teljes munkavédelmi dokumentáció',
      'Orvosi kartonok és engedélyek',
      'Digitális oktatási napló',
      'Jogszabály-figyelés',
      'Jelentések magyar hatóságoknak'
    ],
    pricing: {
      currency: 'HUF',
      startingPrice: '39.900',
      note: 'havonta kis cégeknek (max. 50 fő)'
    },
    isActive: true,
    position: { x: 480, y: 250 }
  },
  {
    code: 'DE',
    name: 'Germania',
    nameLocal: 'Deutschland',
    language: 'Germană',
    legislation: [
      'Arbeitsschutzgesetz (ArbSchG)',
      'DGUV Vorschriften - Berufsgenossenschaften',
      'Betriebssicherheitsverordnung (BetrSichV)',
      'Gefahrstoffverordnung (GefStoffV)'
    ],
    features: [
      'DGUV-konforme Dokumentation',
      'Gefährdungsbeurteilungen digital',
      'Unterweisungsmanagement',
      'Compliance-Tracking',
      'Berufsgenossenschaft Reporting'
    ],
    pricing: {
      currency: 'EUR',
      startingPrice: '49',
      note: 'monatlich für KMU (bis 50 Mitarbeiter)'
    },
    isActive: true,
    position: { x: 380, y: 200 }
  },
  {
    code: 'PL',
    name: 'Polonia',
    nameLocal: 'Polska',
    language: 'Poloneză',
    legislation: [
      'Ustawa o BHP - Bezpieczeństwo i higiena pracy',
      'Kodeks pracy - Przepisy BHP',
      'Rozporządzenie w sprawie szkoleń BHP',
      'PIP - Państwowa Inspekcja Pracy'
    ],
    features: [
      'Pełna dokumentacja BHP',
      'Karty zdrowia i badania lekarskie',
      'Rejestr szkoleń pracowników',
      'Monitoring przepisów',
      'Raporty dla PIP'
    ],
    pricing: {
      currency: 'PLN',
      startingPrice: '199',
      note: 'miesięcznie dla małych firm (do 50 osób)'
    },
    isActive: true,
    position: { x: 480, y: 180 }
  }
]

export default function MultiCountrySection() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country)
  }

  const closePanelInfo = () => {
    setSelectedCountry(null)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Conformitate SSM/PSI în Toată Europa
          </h2>
          <p className="text-xl text-gray-600">
            Soluție multi-țară adaptată legislației locale. Selectează o țară pentru detalii despre conformitate și preț.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="relative max-w-5xl mx-auto">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect width="800" height="600" fill="#f9fafb" />

            {/* Simplified Europe Map Outline */}
            <path
              d="M 100 150 Q 150 100 250 120 L 350 100 Q 400 90 450 110 L 550 130 Q 600 140 620 180 L 650 250 Q 660 300 640 350 L 600 420 Q 550 450 500 440 L 400 450 Q 350 460 300 450 L 200 430 Q 150 400 130 350 L 110 280 Q 100 220 100 150 Z"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="2"
              opacity="0.3"
            />

            {/* Animated Connections */}
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Connection Lines between Active Countries */}
            {countries.map((country, idx) => {
              if (!country.isActive) return null
              const nextCountry = countries[(idx + 1) % countries.filter(c => c.isActive).length]
              if (!nextCountry.isActive) return null

              return (
                <line
                  key={`connection-${country.code}-${nextCountry.code}`}
                  x1={country.position.x}
                  y1={country.position.y}
                  x2={nextCountry.position.x}
                  y2={nextCountry.position.y}
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  opacity="0.4"
                  className="animate-pulse"
                />
              )
            })}

            {/* Country Markers */}
            {countries.map((country) => {
              const isHovered = hoveredCountry === country.code
              const isSelected = selectedCountry?.code === country.code

              return (
                <g
                  key={country.code}
                  transform={`translate(${country.position.x}, ${country.position.y})`}
                  onClick={() => country.isActive && handleCountryClick(country)}
                  onMouseEnter={() => setHoveredCountry(country.code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  className={country.isActive ? 'cursor-pointer' : 'cursor-not-allowed'}
                >
                  {/* Outer Glow */}
                  {(isHovered || isSelected) && country.isActive && (
                    <circle
                      cx="0"
                      cy="0"
                      r="30"
                      fill="#3b82f6"
                      opacity="0.2"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill={country.isActive ? (isSelected ? '#2563eb' : '#3b82f6') : '#9ca3af'}
                    stroke="white"
                    strokeWidth="3"
                    className={country.isActive ? 'transition-all duration-200' : ''}
                    style={{
                      transform: isHovered || isSelected ? 'scale(1.2)' : 'scale(1)',
                      transformOrigin: 'center'
                    }}
                  />

                  {/* Country Code */}
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {country.code}
                  </text>

                  {/* Country Name Label */}
                  <text
                    x="0"
                    y="40"
                    textAnchor="middle"
                    fill="#1f2937"
                    fontSize="14"
                    fontWeight="600"
                  >
                    {country.name}
                  </text>

                  {/* Coming Soon Badge */}
                  {!country.isActive && (
                    <g transform="translate(15, -15)">
                      <rect
                        x="-30"
                        y="-10"
                        width="60"
                        height="20"
                        rx="10"
                        fill="#f59e0b"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        Coming Soon
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-600">Disponibil acum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-600">În curând</span>
            </div>
          </div>
        </div>

        {/* Slide Panel */}
        {selectedCountry && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
              onClick={closePanelInfo}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {selectedCountry.code}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedCountry.nameLocal}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Limba: {selectedCountry.language}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closePanelInfo}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Pricing */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">De la</span>
                    <span className="text-4xl font-bold text-blue-600">
                      {selectedCountry.pricing.startingPrice}
                    </span>
                    <span className="text-xl font-semibold text-gray-700">
                      {selectedCountry.pricing.currency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedCountry.pricing.note}
                  </p>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                    Începe perioada de probă gratuită
                  </button>
                </div>

                {/* Legislation */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Legislație acoperită
                  </h4>
                  <ul className="space-y-3">
                    {selectedCountry.legislation.map((law, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{law}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Funcționalități specifice
                  </h4>
                  <div className="grid gap-3">
                    {selectedCountry.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="text-sm font-medium text-gray-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Vrei să afli mai multe despre conformitatea SSM/PSI în {selectedCountry.name}?
                  </p>
                  <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-xl border-2 border-blue-600 transition-colors">
                    Programează o demo
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
