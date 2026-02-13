'use client'

import { useRouter, usePathname } from '@/i18n/navigation'

interface CountryData {
  code: string
  name: string
  companies: string
  locale: string
}

const COUNTRIES: CountryData[] = [
  { code: 'ro', name: 'România', companies: '850K firme', locale: 'ro' },
  { code: 'bg', name: 'България', companies: '300K firme', locale: 'bg' },
  { code: 'hu', name: 'Magyarország', companies: '500K firme', locale: 'hu' },
  { code: 'de', name: 'Deutschland', companies: '3.5M firme', locale: 'de' },
  { code: 'pl', name: 'Polska', companies: '2M firme', locale: 'pl' },
]

// SVG Flag components
function FlagRO({ className = 'w-16 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="213.3" height="480" fill="#002B7F" />
      <rect width="213.3" height="480" x="213.3" fill="#FCD116" />
      <rect width="213.3" height="480" x="426.6" fill="#CE1126" />
    </svg>
  )
}

function FlagBG({ className = 'w-16 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="160" fill="#fff" />
      <rect width="640" height="160" y="160" fill="#00966E" />
      <rect width="640" height="160" y="320" fill="#D62612" />
    </svg>
  )
}

function FlagHU({ className = 'w-16 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="160" fill="#CE2939" />
      <rect width="640" height="160" y="160" fill="#fff" />
      <rect width="640" height="160" y="320" fill="#477050" />
    </svg>
  )
}

function FlagDE({ className = 'w-16 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="160" fill="#000" />
      <rect width="640" height="160" y="160" fill="#D00" />
      <rect width="640" height="160" y="320" fill="#FFCE00" />
    </svg>
  )
}

function FlagPL({ className = 'w-16 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="240" fill="#fff" />
      <rect width="640" height="240" y="240" fill="#DC143C" />
    </svg>
  )
}

const FLAG_COMPONENTS: Record<string, React.FC<{ className?: string }>> = {
  ro: FlagRO,
  bg: FlagBG,
  hu: FlagHU,
  de: FlagDE,
  pl: FlagPL,
}

function Flag({ code, className = 'w-16 h-12' }: { code: string; className?: string }) {
  const FlagComponent = FLAG_COMPONENTS[code]
  if (!FlagComponent) return null
  return (
    <div className="inline-flex items-center rounded-lg overflow-hidden shadow-md border border-gray-200">
      <FlagComponent className={className} />
    </div>
  )
}

export default function CountrySelector() {
  const router = useRouter()
  const pathname = usePathname()

  const handleCountryClick = (locale: string) => {
    router.replace(pathname, { locale })
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-4 bg-blue-50 text-blue-600 border border-blue-200">
            🌍 Disponibil în 5 țări
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Alege-ți țara
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Platformă SSM/PSI adaptată legislației locale din 5 țări europene
          </p>
        </div>

        {/* Country Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => handleCountryClick(country.locale)}
              className="group bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Flag */}
              <div className="flex justify-center mb-4">
                <Flag code={country.code} className="w-20 h-14" />
              </div>

              {/* Country Name */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {country.name}
              </h3>

              {/* Companies Count */}
              <p className="text-sm text-gray-500 font-semibold">
                {country.companies}
              </p>
            </button>
          ))}
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Click pe o țară pentru a vedea conținutul în limba locală
        </p>
      </div>
    </section>
  )
}
