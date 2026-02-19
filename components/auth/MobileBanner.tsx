import { Shield } from 'lucide-react'

export function MobileBanner() {
  return (
    <div className="flex items-center gap-4 bg-header-bg px-6 py-5 lg:hidden">
      <a href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">s-s-m.ro</span>
      </a>
      <p className="flex-1 text-xs leading-snug text-white/50">
        Platformă completă pentru conformitate SSM, PSI, GDPR și NIS2
      </p>
    </div>
  )
}
