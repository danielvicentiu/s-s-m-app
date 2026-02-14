'use client';

import { useState } from 'react';
import { X, Check, Clock } from 'lucide-react';

interface CountryData {
  code: string;
  name: string;
  nameLocal: string;
  language: string;
  flag: string;
  position: { x: number; y: number };
  available: boolean;
  legislation: string[];
  pricing: {
    currency: string;
    startingPrice: string;
  };
  features: string[];
}

const countries: CountryData[] = [
  {
    code: 'RO',
    name: 'Romania',
    nameLocal: 'România',
    language: 'Română',
    flag: '🇷🇴',
    position: { x: 520, y: 380 },
    available: true,
    legislation: [
      'Legea 319/2006 - Securitate și sănătate în muncă',
      'HG 1425/2006 - Organizarea SSM',
      'Legea 307/2006 - Apărare împotriva incendiilor',
      'Ord. 1050/2023 - Fișa aptitudini',
    ],
    pricing: {
      currency: 'RON',
      startingPrice: '299',
    },
    features: [
      'Evaluare riscuri SSM/PSI',
      'Planuri de prevenire și protecție',
      'Dosare medicina muncii',
      'Instruire SSM/PSI',
      'Registre și evidențe obligatorii',
    ],
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    nameLocal: 'България',
    language: 'Български',
    flag: '🇧🇬',
    position: { x: 510, y: 420 },
    available: true,
    legislation: [
      'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
      'Наредба № РД-07-2 - Условия и ред за провеждане на периодично обучение и инструктаж',
      'Закон за защита при бедствия',
      'Наредба № 3 - Медицински прегледи',
    ],
    pricing: {
      currency: 'BGN',
      startingPrice: '289',
    },
    features: [
      'Оценка на рисковете',
      'Планове за БЗР',
      'Медицински досиета',
      'Обучения и инструктажи',
      'Регистри и документация',
    ],
  },
  {
    code: 'HU',
    name: 'Hungary',
    nameLocal: 'Magyarország',
    language: 'Magyar',
    flag: '🇭🇺',
    position: { x: 470, y: 340 },
    available: true,
    legislation: [
      '1993. évi XCIII. törvény - Munkavédelem',
      '5/1993. (XII. 26.) MüM rendelet - Munkavédelmi képzés',
      '1996. évi XXXI. törvény - Tűzvédelem',
      '33/1998. (VI. 24.) NM rendelet - Munkaegészségügy',
    ],
    pricing: {
      currency: 'HUF',
      startingPrice: '89900',
    },
    features: [
      'Kockázatértékelés',
      'Munkavédelmi tervek',
      'Egészségügyi nyilvántartás',
      'Oktatások és vizsgák',
      'Kötelező dokumentáció',
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    nameLocal: 'Deutschland',
    language: 'Deutsch',
    flag: '🇩🇪',
    position: { x: 400, y: 300 },
    available: true,
    legislation: [
      'Arbeitsschutzgesetz (ArbSchG)',
      'DGUV Vorschrift 1 - Grundsätze der Prävention',
      'Arbeitsstättenverordnung (ArbStättV)',
      'Betriebssicherheitsverordnung (BetrSichV)',
    ],
    pricing: {
      currency: 'EUR',
      startingPrice: '199',
    },
    features: [
      'Gefährdungsbeurteilung',
      'Betriebsanweisungen',
      'Arbeitsmedizinische Vorsorge',
      'Unterweisungen',
      'Dokumentationspflichten',
    ],
  },
  {
    code: 'PL',
    name: 'Poland',
    nameLocal: 'Polska',
    language: 'Polski',
    flag: '🇵🇱',
    position: { x: 470, y: 280 },
    available: false,
    legislation: [
      'Ustawa z 26 czerwca 1974 r. - Kodeks pracy',
      'Rozporządzenie w sprawie BHP',
      'Ustawa o ochronie przeciwpożarowej',
    ],
    pricing: {
      currency: 'PLN',
      startingPrice: 'TBA',
    },
    features: [
      'Ocena ryzyka zawodowego',
      'Dokumentacja BHP',
      'Badania lekarskie',
    ],
  },
];

// Simplified Europe map paths
const europeMapPaths = [
  // Romania
  'M 520 380 l 15 -5 l 10 10 l 5 15 l -10 10 l -15 -5 l -5 -15 z',
  // Bulgaria
  'M 510 420 l 12 -4 l 8 8 l 3 12 l -8 8 l -12 -4 l -3 -12 z',
  // Hungary
  'M 470 340 l 14 -6 l 9 9 l 4 14 l -9 9 l -14 -6 l -4 -14 z',
  // Germany
  'M 400 300 l 20 -10 l 15 5 l 10 20 l -5 20 l -20 10 l -20 -10 l -5 -20 z',
  // Poland
  'M 470 280 l 18 -8 l 12 12 l 5 18 l -12 12 l -18 -8 l -5 -18 z',
];

export default function MultiCountrySection() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Expansion europeană în curs
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Compliance <span className="text-blue-600">Multi-Țară</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestionați conformitatea SSM/PSI în mai multe țări europene dintr-o singură platformă.
            Legislație locală, limbă nativă și suport dedicat.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <svg
              viewBox="0 0 900 600"
              className="w-full h-auto"
              style={{ minHeight: '400px' }}
            >
              {/* Base map outline */}
              <path
                d="M 300 250 Q 350 200 400 220 L 450 200 L 500 210 L 550 240 L 580 280 L 570 350 L 540 400 L 510 440 L 470 460 L 420 450 L 380 430 L 350 400 L 320 360 L 300 320 Z"
                fill="#f3f4f6"
                stroke="#d1d5db"
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Animated connection lines */}
              <g className="opacity-30">
                {countries.slice(0, 4).map((country, idx) => (
                  <line
                    key={`connection-${idx}`}
                    x1={countries[0].position.x}
                    y1={countries[0].position.y}
                    x2={country.position.x}
                    y2={country.position.y}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                ))}
              </g>

              {/* Country markers */}
              {countries.map((country, index) => (
                <g
                  key={country.code}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredCountry(country.code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => setSelectedCountry(country)}
                >
                  {/* Country shape */}
                  <path
                    d={europeMapPaths[index]}
                    fill={
                      selectedCountry?.code === country.code
                        ? '#3b82f6'
                        : country.available
                        ? hoveredCountry === country.code
                          ? '#60a5fa'
                          : '#93c5fd'
                        : '#e5e7eb'
                    }
                    stroke={
                      selectedCountry?.code === country.code
                        ? '#1e40af'
                        : country.available
                        ? '#3b82f6'
                        : '#9ca3af'
                    }
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />

                  {/* Marker circle */}
                  <circle
                    cx={country.position.x}
                    cy={country.position.y}
                    r={hoveredCountry === country.code || selectedCountry?.code === country.code ? 12 : 10}
                    fill={country.available ? '#3b82f6' : '#9ca3af'}
                    stroke="white"
                    strokeWidth="3"
                    className="transition-all duration-300"
                  >
                    {country.available && (
                      <animate
                        attributeName="r"
                        values="10;14;10"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>

                  {/* Country label */}
                  <text
                    x={country.position.x}
                    y={country.position.y - 20}
                    textAnchor="middle"
                    className="text-sm font-bold fill-gray-900 pointer-events-none"
                  >
                    {country.flag} {country.code}
                  </text>

                  {/* Coming soon badge */}
                  {!country.available && (
                    <g>
                      <rect
                        x={country.position.x - 40}
                        y={country.position.y + 20}
                        width="80"
                        height="24"
                        rx="12"
                        fill="#fbbf24"
                      />
                      <text
                        x={country.position.x}
                        y={country.position.y + 35}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-gray-900 pointer-events-none"
                      >
                        Coming Soon
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>

            <p className="text-center text-sm text-gray-500 mt-6">
              Click pe o țară pentru a vedea detalii despre legislație și pricing local
            </p>
          </div>
        </div>

        {/* Country Details Slide Panel */}
        {selectedCountry && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setSelectedCountry(null)}
            />

            {/* Slide panel */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedCountry.nameLocal}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedCountry.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Status badge */}
                <div className="flex items-center gap-2">
                  {selectedCountry.available ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <Check className="w-4 h-4" />
                      Disponibil acum
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      <Clock className="w-4 h-4" />
                      În curând
                    </div>
                  )}
                  <span className="text-sm text-gray-600">
                    Limbă: {selectedCountry.language}
                  </span>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Pricing Local
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {selectedCountry.pricing.startingPrice}
                    </span>
                    <span className="text-xl text-gray-600">
                      {selectedCountry.pricing.currency}
                    </span>
                    <span className="text-sm text-gray-500">/lună</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Preț de start pentru organizații mici (până la 50 angajați)
                  </p>
                </div>

                {/* Legislation */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    📋 Legislație Acoperită
                  </h4>
                  <div className="space-y-3">
                    {selectedCountry.legislation.map((law, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <p className="text-sm text-gray-700 leading-relaxed">{law}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    ✨ Funcționalități Specifice
                  </h4>
                  <div className="space-y-3">
                    {selectedCountry.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                {selectedCountry.available && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">
                      Începeți în {selectedCountry.nameLocal}
                    </h4>
                    <p className="text-blue-100 mb-4">
                      Configurați platforma pentru piața {selectedCountry.name.toLowerCase()} în
                      mai puțin de 10 minute.
                    </p>
                    <button className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                      Începeți perioada de probă gratuită
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
