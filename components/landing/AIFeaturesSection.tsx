'use client';

import { Sparkles, FileSearch, ShieldCheck, MessageSquare, FileText } from 'lucide-react';

const aiFeatures = [
  {
    icon: FileSearch,
    title: 'Extragere legislație cu AI',
    description: 'Sistemul nostru AI scanează și extrage automat cerințele relevante din legislația SSM/PSI actualizată, economisind ore de cercetare manuală.',
    badge: 'AI-powered'
  },
  {
    icon: ShieldCheck,
    title: 'Evaluare riscuri inteligentă',
    description: 'Inteligența artificială analizează activitățile companiei tale și identifică automat riscurile potențiale, oferind recomandări personalizate de prevenire.',
    badge: 'AI-powered'
  },
  {
    icon: MessageSquare,
    title: 'Asistent compliance AI',
    description: 'Pune întrebări despre legislația SSM/PSI și primește răspunsuri clare și contextualizate din baza noastră de cunoștințe antrenată pe legislația românească.',
    badge: 'AI-powered'
  },
  {
    icon: FileText,
    title: 'Generare documente automată',
    description: 'Creează rapid documente de compliance, rapoarte de evaluare riscuri și planuri de prevenire personalizate folosind șabloane inteligente.',
    badge: 'AI-powered'
  }
];

export default function AIFeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium mb-4 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Tehnologie AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Inteligență artificială pentru compliance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automatizează procesele de compliance SSM/PSI cu ajutorul inteligenței artificiale
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Animated Icon Container */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold mb-4">
                  <Sparkles className="w-3 h-3" />
                  <span>{feature.badge}</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-colors duration-300" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-lg">
              Tehnologie AI antrenată pe legislația SSM/PSI din România, Bulgaria, Ungaria și Germania
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
