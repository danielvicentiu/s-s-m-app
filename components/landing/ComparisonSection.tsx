'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

interface ComparisonRow {
  category: string
  before: string
  after: string
}

const comparisonData: ComparisonRow[] = [
  {
    category: 'Documente',
    before: 'Fișiere Excel dispersate, versiuni multiple, pierderi de date',
    after: 'Bază de date centralizată, versiuni automate, backup continuu'
  },
  {
    category: 'Instruiri',
    before: 'Foi de prezență manuale, evidență hârtie, verificări grele',
    after: 'Tracking digital, generare automată rapoarte, istoric complet'
  },
  {
    category: 'Alerte',
    before: 'Notificări lipsa, termene ratate, amenzi neanticipate',
    after: 'Notificări automate cu 30-60 zile, zero termene ratate'
  },
  {
    category: 'Rapoarte',
    before: 'Ore pentru rapoarte manuale, erori frecvente, format inconsistent',
    after: 'Generare instant, date precise, export PDF/Excel automat'
  },
  {
    category: 'Conformitate',
    before: 'Documente incomplete, verificări anuale stresante, riscuri amenzi',
    after: 'Conformitate 24/7, toate documentele la zi, pregătit inspecții'
  },
  {
    category: 'Timp',
    before: '5-8 ore/săptămână pentru administrare și rapoarte',
    after: '30 minute/săptămână, automatizare 90% din operațiuni'
  }
]

export default function ComparisonSection() {
  const [activeView, setActiveView] = useState<'before' | 'after'>('before')

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transformarea ta digitală
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            De la haos și stres la control total și eficiență maximă
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-lg">
            <button
              onClick={() => setActiveView('before')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeView === 'before'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Înainte (Manual)
              </span>
            </button>
            <ArrowRight className="w-6 h-6 text-blue-600" />
            <button
              onClick={() => setActiveView('after')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeView === 'after'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Acum (Digital)
              </span>
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-4 max-w-5xl mx-auto">
          {comparisonData.map((row, index) => (
            <div
              key={row.category}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="grid md:grid-cols-[200px,1fr] divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* Category Label */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex items-center justify-center">
                  <h3 className="text-lg font-bold text-blue-900 text-center">
                    {row.category}
                  </h3>
                </div>

                {/* Content Area with Animated Transition */}
                <div className="relative min-h-[120px]">
                  {/* Before View */}
                  <div
                    className={`absolute inset-0 p-6 transition-all duration-500 ${
                      activeView === 'before'
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-8 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm font-semibold text-red-600 mb-1">
                          ÎNAINTE
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {row.before}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* After View */}
                  <div
                    className={`absolute inset-0 p-6 transition-all duration-500 ${
                      activeView === 'after'
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-8 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm font-semibold text-green-600 mb-1">
                          ACUM
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {row.after}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-2xl text-white">
            <h3 className="text-2xl font-bold">
              Gata să faci tranziția?
            </h3>
            <p className="text-blue-100 max-w-2xl">
              Peste 100 de consultanți SSM au făcut deja saltul de la Excel la platforma noastră.
              Economisești în medie 7 ore pe săptămână și elimini 100% din riscul de amenzi.
            </p>
            <button className="mt-4 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Începe testul gratuit de 14 zile
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
