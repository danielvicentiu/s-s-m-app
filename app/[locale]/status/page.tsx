// app/[locale]/status/page.tsx
// Status Page — Monitorizare servicii platformă SSM
// Design clean, fără autentificare necesară

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Status Platformă | S-S-M.ro',
  description: 'Monitorizare în timp real a serviciilor platformei SSM/PSI',
}

type ServiceStatus = 'operational' | 'degraded' | 'outage'

interface Service {
  name: string
  status: ServiceStatus
  description: string
}

interface Incident {
  id: string
  date: string
  title: string
  status: 'resolved' | 'monitoring' | 'investigating'
  impact: 'none' | 'minor' | 'major'
}

const services: Service[] = [
  {
    name: 'Web App',
    status: 'operational',
    description: 'Interfață web și dashboard',
  },
  {
    name: 'API',
    status: 'operational',
    description: 'API REST și endpoints',
  },
  {
    name: 'Database',
    status: 'operational',
    description: 'Supabase PostgreSQL',
  },
  {
    name: 'Email',
    status: 'operational',
    description: 'Notificări și alerte email',
  },
  {
    name: 'Storage',
    status: 'operational',
    description: 'Stocare documente și fișiere',
  },
]

const incidents: Incident[] = [
  {
    id: '5',
    date: '2026-02-10',
    title: 'Mentenanță programată - upgrade bază de date',
    status: 'resolved',
    impact: 'minor',
  },
  {
    id: '4',
    date: '2026-02-05',
    title: 'Întârzieri minore la procesare email',
    status: 'resolved',
    impact: 'minor',
  },
  {
    id: '3',
    date: '2026-01-28',
    title: 'Update securitate certificat SSL',
    status: 'resolved',
    impact: 'none',
  },
  {
    id: '2',
    date: '2026-01-15',
    title: 'Optimizare performanță queries',
    status: 'resolved',
    impact: 'none',
  },
  {
    id: '1',
    date: '2026-01-08',
    title: 'Migrare stocare fișiere la Supabase Storage',
    status: 'resolved',
    impact: 'minor',
  },
]

function getStatusColor(status: ServiceStatus): string {
  switch (status) {
    case 'operational':
      return 'bg-green-500'
    case 'degraded':
      return 'bg-yellow-500'
    case 'outage':
      return 'bg-red-500'
  }
}

function getStatusText(status: ServiceStatus): string {
  switch (status) {
    case 'operational':
      return 'Operațional'
    case 'degraded':
      return 'Performanță redusă'
    case 'outage':
      return 'Indisponibil'
  }
}

function getIncidentStatusColor(status: Incident['status']): string {
  switch (status) {
    case 'resolved':
      return 'text-green-700 bg-green-50'
    case 'monitoring':
      return 'text-blue-700 bg-blue-50'
    case 'investigating':
      return 'text-yellow-700 bg-yellow-50'
  }
}

function getIncidentStatusText(status: Incident['status']): string {
  switch (status) {
    case 'resolved':
      return 'Rezolvat'
    case 'monitoring':
      return 'Monitorizare'
    case 'investigating':
      return 'În investigare'
  }
}

function getImpactColor(impact: Incident['impact']): string {
  switch (impact) {
    case 'none':
      return 'text-gray-600'
    case 'minor':
      return 'text-yellow-600'
    case 'major':
      return 'text-red-600'
  }
}

function getImpactText(impact: Incident['impact']): string {
  switch (impact) {
    case 'none':
      return 'Fără impact'
    case 'minor':
      return 'Impact minor'
    case 'major':
      return 'Impact major'
  }
}

export default function StatusPage() {
  const allOperational = services.every(s => s.status === 'operational')
  const uptime = 99.9

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Status Platformă
          </h1>
          <p className="text-lg text-gray-600">
            Monitorizare în timp real a serviciilor SSM/PSI
          </p>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${allOperational ? 'bg-green-500' : 'bg-yellow-500'} shadow-lg`} />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {allOperational ? 'Toate sistemele operaționale' : 'Probleme detectate'}
                </h2>
                <p className="text-gray-600 mt-1">
                  Uptime: <span className="font-semibold text-green-600">{uptime}%</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Ultima verificare</div>
              <div className="text-gray-900 font-medium">
                {new Date().toLocaleTimeString('ro-RO', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Servicii
          </h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} shadow`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {getStatusText(service.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Istoric Incidente
          </h2>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="border-l-4 border-gray-200 pl-4 py-3 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{incident.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIncidentStatusColor(incident.status)}`}>
                    {getIncidentStatusText(incident.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {new Date(incident.date).toLocaleDateString('ro-RO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className={`font-medium ${getImpactColor(incident.impact)}`}>
                    {getImpactText(incident.impact)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Pentru suport tehnic, contactați{' '}
            <a href="mailto:support@s-s-m.ro" className="text-blue-600 hover:underline">
              support@s-s-m.ro
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
