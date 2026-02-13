'use client'

import { Shield, Lock, Database, Clock, Smartphone, FileText } from 'lucide-react'

const securityFeatures = [
  {
    icon: Lock,
    title: 'Criptare AES-256',
    description: 'Datele tale sunt protejate cu criptare de nivel bancar, asigurând confidențialitatea maximă.',
  },
  {
    icon: Shield,
    title: 'GDPR Compliant',
    description: 'Conformitate totală cu GDPR și legislația europeană privind protecția datelor personale.',
  },
  {
    icon: Database,
    title: 'RLS Supabase',
    description: 'Row Level Security activat pe toate tabelele pentru izolare completă a datelor între organizații.',
  },
  {
    icon: Clock,
    title: 'Backup Zilnic',
    description: 'Backup automat zilnic al bazei de date cu retenție de 30 de zile pentru recuperare rapidă.',
  },
  {
    icon: Smartphone,
    title: '2FA Disponibil',
    description: 'Autentificare cu doi factori pentru protecție suplimentară a conturilor utilizatorilor.',
  },
  {
    icon: FileText,
    title: 'Audit Log',
    description: 'Jurnal complet al tuturor acțiunilor utilizatorilor pentru trasabilitate și conformitate.',
  },
]

export function SecuritySection() {
  return (
    <section className="bg-gray-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Securitate și Conformitate
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Platforma ta este protejată cu cele mai avansate tehnologii de securitate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-300">
              Certificat ISO 27001 în curs de obținere
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
