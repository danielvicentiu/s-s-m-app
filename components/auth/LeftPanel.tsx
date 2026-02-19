'use client'

import { Shield, Globe, Building2, Lock } from 'lucide-react'

const stats = [
  { value: '38+', label: 'Module', icon: Shield },
  { value: '100+', label: 'Companii', icon: Building2 },
  { value: '6', label: 'Limbi', icon: Globe },
]

export function LeftPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-header-bg p-10 lg:flex lg:w-[60%] xl:p-14">
      {/* Grid pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top: logo + tagline */}
      <div className="relative z-10">
        <a href="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">s-s-m.ro</span>
        </a>
        <h1 className="mt-8 max-w-md text-balance text-3xl font-bold leading-tight text-white xl:text-4xl">
          Platformă completă pentru conformitate SSM, PSI, GDPR și NIS2
        </h1>
        <p className="mt-4 max-w-sm text-pretty leading-relaxed text-white/60">
          Conformitate automată pentru angajatorii din România și CEE. Digitalizează procesele
          de securitate a muncii.
        </p>
      </div>

      {/* Middle: stat cards */}
      <div className="relative z-10 flex flex-wrap gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
          >
            <s.icon className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/50">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: GDPR notice */}
      <div className="relative z-10 flex items-center gap-2 text-sm text-white/40">
        <Lock className="h-4 w-4 shrink-0" />
        <span>Protecție date conform GDPR și NIS2</span>
      </div>
    </div>
  )
}
