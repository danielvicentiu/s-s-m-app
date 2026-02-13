'use client';

import { useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

interface ComparisonRow {
  category: string;
  before: string;
  after: string;
}

const comparisonData: ComparisonRow[] = [
  {
    category: 'Documente',
    before: 'Fișiere dispersate în Excel, Word, email',
    after: 'Centralizare digitală cu acces instant'
  },
  {
    category: 'Instruiri',
    before: 'Foi de prezență manuale, semnaturi pierdute',
    after: 'Evidență automată cu notificări programate'
  },
  {
    category: 'Alerte',
    before: 'Uitări frecvente, termene depășite',
    after: 'Notificări automate pentru fiecare scadență'
  },
  {
    category: 'Rapoarte',
    before: 'Ore întregi pentru compilare manuală',
    after: 'Generare instant cu un click'
  },
  {
    category: 'Conformitate',
    before: 'Risc de amenzi și neconformitate',
    after: 'Conformitate 100% cu legislația SSM/PSI'
  },
  {
    category: 'Timp',
    before: '10-15 ore/lună pe administrare',
    after: '2-3 ore/lună automatizat'
  }
];

export default function ComparisonSection() {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transformare Completă
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Vezi diferența dintre procesele manuale și platforma digitală
          </p>

          {/* Toggle Button */}
          <div className="inline-flex items-center gap-3 p-2 bg-gray-100 rounded-full">
            <button
              onClick={() => setShowAfter(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !showAfter
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Înainte (Manual)
            </button>
            <ArrowRight className="text-gray-400" size={20} />
            <button
              onClick={() => setShowAfter(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                showAfter
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              După (Digital)
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            {comparisonData.map((row, index) => (
              <div
                key={row.category}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] transition-all duration-300 hover:bg-gray-50"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Category */}
                <div className="px-6 py-6 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="font-semibold text-gray-900 text-lg">
                    {row.category}
                  </div>
                </div>

                {/* Before/After Content */}
                <div className="px-6 py-6 relative overflow-hidden">
                  {/* Before View */}
                  <div
                    className={`transition-all duration-500 ${
                      showAfter
                        ? 'opacity-0 -translate-x-4 absolute inset-0 px-6 py-6 pointer-events-none'
                        : 'opacity-100 translate-x-0'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                        <X size={16} className="text-red-600" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {row.before}
                      </p>
                    </div>
                  </div>

                  {/* After View */}
                  <div
                    className={`transition-all duration-500 ${
                      showAfter
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-4 absolute inset-0 px-6 py-6 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check size={16} className="text-green-600" />
                      </div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {row.after}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
            <div className="text-gray-600">Reducere timp administrare</div>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Conformitate legislativă</div>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-gray-600">Documente pierdute</div>
          </div>
        </div>
      </div>
    </section>
  );
}
