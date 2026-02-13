'use client'

import { Bell, Wifi, Camera, FileSignature, MapPin, FileText } from 'lucide-react'

interface Feature {
  icon: React.ElementType
  title: string
  description: string
}

const leftFeatures: Feature[] = [
  {
    icon: Bell,
    title: 'Notificări push',
    description: 'Alertele instant pentru expirări și deadline-uri'
  },
  {
    icon: Wifi,
    title: 'Offline mode',
    description: 'Lucrează fără internet, sincronizare automată'
  },
  {
    icon: Camera,
    title: 'Camera scan QR',
    description: 'Scanează coduri echipamente și documente'
  }
]

const rightFeatures: Feature[] = [
  {
    icon: FileSignature,
    title: 'Semnătură digitală',
    description: 'Semnează procesele verbal direct pe telefon'
  },
  {
    icon: MapPin,
    title: 'GPS locație',
    description: 'Localizare automată pentru rapoarte teren'
  },
  {
    icon: FileText,
    title: 'Rapoarte instant',
    description: 'Generează și trimite rapoarte din orice locație'
  }
]

export function MobilePreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Accesează de oriunde cu telefonul
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aplicație mobilă optimizată pentru consultanți SSM/PSI care lucrează în teren
          </p>
        </div>

        {/* Mobile Preview Grid */}
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Left Features */}
          <div className="space-y-8">
            {leftFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                align="right"
                delay={index * 100}
              />
            ))}
          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[280px] h-[570px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>

                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between text-xs">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-2.5 bg-white rounded"></div>
                        <div className="w-0.5 h-3 bg-white rounded"></div>
                        <div className="w-0.5 h-3.5 bg-white rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Screenshot Placeholder */}
                  <div className="p-4 bg-gray-50 h-full">
                    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        <div className="h-6 w-16 bg-green-100 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-4 w-32 bg-gray-300 rounded"></div>
                        <div className="h-6 w-16 bg-orange-100 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-4 w-28 bg-gray-300 rounded"></div>
                        <div className="h-6 w-16 bg-blue-100 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                iOS & Android
              </div>
            </div>
          </div>

          {/* Right Features */}
          <div className="space-y-8">
            {rightFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                align="left"
                delay={index * 100 + 300}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  align,
  delay
}: {
  feature: Feature
  align: 'left' | 'right'
  delay: number
}) {
  const Icon = feature.icon

  return (
    <div
      className={`flex items-start gap-4 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`
      }}
    >
      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">
          {feature.title}
        </h3>
        <p className="text-sm text-gray-600">
          {feature.description}
        </p>
      </div>
    </div>
  )
}
