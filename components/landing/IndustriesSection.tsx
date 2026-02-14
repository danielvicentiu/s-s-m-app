'use client'

import { Building2, UtensilsCrossed, Monitor, Stethoscope, ShoppingCart, Truck, Wheat, Hotel } from 'lucide-react'

interface Industry {
  id: string
  name: string
  icon: React.ElementType
  description: string
  requirements: string[]
}

const industries: Industry[] = [
  {
    id: 'constructii',
    name: 'Construcții',
    icon: Building2,
    description: 'Conformitate SSM pentru șantiere și lucrări de construcții',
    requirements: [
      'Autorizații de lucru în înălțime',
      'Echipament protecție individual (EPI)',
      'Instruiri periodice SSM',
      'Avize PSI șantier'
    ]
  },
  {
    id: 'alimentar',
    name: 'Alimentar',
    icon: UtensilsCrossed,
    description: 'Siguranță alimentară și protecția muncii în industria alimentară',
    requirements: [
      'Certificate medicale carnet de sănătate',
      'Controale ANPC periodice',
      'HACCP și igienizare',
      'Instruiri manipulare alimente'
    ]
  },
  {
    id: 'it',
    name: 'IT & Tech',
    icon: Monitor,
    description: 'Compliance SSM pentru birouri și spații tech',
    requirements: [
      'Evaluare riscuri ergonomice',
      'Iluminat și ventilație adecvată',
      'Control medical vederea',
      'PSI birouri'
    ]
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: Stethoscope,
    description: 'Conformitate pentru unități medicale și cabinete',
    requirements: [
      'Deșeuri medicale periculoase',
      'Sterilizare și igienizare',
      'Protecție riscuri biologice',
      'Autorizație sanitară de funcționare'
    ]
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: ShoppingCart,
    description: 'Siguranță pentru magazine și spații comerciale',
    requirements: [
      'Plan evacuare și PSI',
      'Instruiri personal',
      'Control medical angajați',
      'Registru evidență accidente'
    ]
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: Truck,
    description: 'Conformitate pentru firme de transport și logistică',
    requirements: [
      'Certificate medicale șoferi',
      'Tahografe și ore condus',
      'Inspecții tehnice auto',
      'Instruiri ADR (transport mărfuri periculoase)'
    ]
  },
  {
    id: 'agricultura',
    name: 'Agricultură',
    icon: Wheat,
    description: 'Siguranță în exploatări agricole și ferme',
    requirements: [
      'Protecție substanțe chimice',
      'Instruiri utilizare mașini agricole',
      'EPI specific agricol',
      'Control medical sezonier'
    ]
  },
  {
    id: 'hoteluri',
    name: 'Hoteluri & HoReCa',
    icon: Hotel,
    description: 'Compliance pentru spații de cazare și restaurant',
    requirements: [
      'Autorizație PSI',
      'Certificate medicale personal',
      'HACCP și igienă',
      'Plan evacuare clienți'
    ]
  }
]

export default function IndustriesSection() {
  const handleIndustryClick = (industryId: string) => {
    // Navigate to use-case detail page
    window.location.href = `/industries/${industryId}`
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Soluții pentru fiecare industrie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conformitate SSM și PSI adaptată nevoilor specifice domeniului tău de activitate
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry) => {
            const Icon = industry.icon
            return (
              <div
                key={industry.id}
                onClick={() => handleIndustryClick(industry.id)}
                className="group relative bg-gray-50 rounded-2xl p-6 hover:bg-blue-50 transition-all duration-300 cursor-pointer hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {industry.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {industry.description}
                </p>

                {/* Requirements */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cerințe cheie:
                  </p>
                  <ul className="space-y-1">
                    {industry.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="line-clamp-1">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Nu vezi domeniul tău? Soluțiile noastre se adaptează oricărei industrii.
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Contactează-ne pentru consultanță personalizată
          </button>
        </div>
      </div>
    </section>
  )
}
