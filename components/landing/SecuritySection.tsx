'use client';

import { Shield, Lock, Key, Database, FileText, HardDrive } from 'lucide-react';

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'Encryption AES-256',
    description: 'Date criptate end-to-end cu standardul militar AES-256 pentru protecție maximă.'
  },
  {
    icon: Shield,
    title: 'GDPR Compliant',
    description: 'Conformitate totală cu GDPR/RGPD pentru protecția datelor personale în UE.'
  },
  {
    icon: Key,
    title: 'Autentificare 2FA',
    description: 'Autentificare cu doi factori pentru acces securizat la platforma ta.'
  },
  {
    icon: Database,
    title: 'RLS Multi-tenant',
    description: 'Izolare completă a datelor la nivel de bază de date cu Row Level Security.'
  },
  {
    icon: FileText,
    title: 'Audit Trail',
    description: 'Jurnal complet de audit pentru toate acțiunile și modificările în platformă.'
  },
  {
    icon: HardDrive,
    title: 'Backup Zilnic',
    description: 'Backup automat zilnic cu păstrare pe 30 de zile și restaurare rapidă.'
  }
];

const CERTIFICATIONS = [
  { name: 'ISO 27001', status: 'În curs' },
  { name: 'SOC 2 Type II', status: 'Planificat' },
  { name: 'GDPR', status: 'Certificat' },
  { name: 'NIS2', status: 'În conformitate' }
];

export default function SecuritySection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

      {/* Animated glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slower" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Securitate de Nivel Enterprise</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Datele Tale Sunt în{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Siguranță Totală
            </span>
          </h2>

          <p className="text-xl text-gray-400 leading-relaxed">
            Infrastructură securizată la nivel enterprise cu cele mai înalte standarde de protecție a datelor.
            Conformitate totală cu reglementările europene și internaționale.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SECURITY_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300" />

                <div className="relative">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl mb-6 group-hover:scale-110 group-hover:border-blue-400/50 transition-all duration-300">
                    <Icon className="w-7 h-7 text-blue-400 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Certificări și Conformitate
            </h3>
            <p className="text-gray-400">
              Respectăm cele mai înalte standarde internaționale de securitate
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.name}
                className="flex flex-col items-center gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/60"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-white mb-1">
                    {cert.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {cert.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-gray-400 text-sm">
            Ai întrebări despre securitatea platformei?{' '}
            <a href="/security" className="text-blue-400 hover:text-blue-300 underline transition-colors">
              Citește documentația de securitate
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
