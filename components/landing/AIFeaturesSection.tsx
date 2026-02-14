'use client';

import { Sparkles, Brain, Shield, FileText } from 'lucide-react';

const aiFeatures = [
  {
    icon: FileText,
    title: 'AI Legislation Extraction',
    description: 'Extrage automat cerințele de conformitate din legislația complexă SSM/PSI. Procesează documente legale și identifică obligațiile aplicabile afacerii tale.',
    badge: 'AI-Powered',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'AI Risk Assessment',
    description: 'Analizează riscurile ocupaționale folosind machine learning. Identifică zone critice și sugerează măsuri preventive personalizate pentru industria ta.',
    badge: 'AI-Powered',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'AI Compliance Advisor',
    description: 'Consultant virtual disponibil 24/7. Răspunde la întrebări despre conformitate, oferă recomandări și te ghidează pas cu pas în procesul de certificare.',
    badge: 'AI-Powered',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Sparkles,
    title: 'AI Document Generation',
    description: 'Generează automat documentație SSM/PSI conformă cu legislația. Planuri de prevenire, instrucțiuni SSM, rapoarte de evaluare - totul personalizat.',
    badge: 'AI-Powered',
    gradient: 'from-orange-500 to-red-500',
  },
];

export default function AIFeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">
              Powered by Artificial Intelligence
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Inteligență Artificială
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              pentru Conformitate SSM/PSI
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automatizează procesele complexe de conformitate cu ajutorul AI.
            Economia de timp și acuratețe sporită pentru consultanți și companii.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {aiFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              {/* Icon with gradient background */}
              <div className="relative mb-6">
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white animate-pulse" />
                </div>

                {/* AI Badge */}
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full shadow-md">
                    <Sparkles className="w-3 h-3" />
                    {feature.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Încerci AI gratuit timp de 14 zile
              </h4>
              <p className="text-gray-600">
                Fără card necesar. Activare instantanee. Anulare oricând.
              </p>
            </div>
            <button className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Începe Gratuit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
