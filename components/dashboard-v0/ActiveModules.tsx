// components/dashboard-v0/ActiveModules.tsx
// v0 active modules widget

import { Shield, Flame, Lock, Network, Cog, Check, Clock } from 'lucide-react'

const modules = [
  { icon: Shield, name: 'SSM', status: 'active' as const },
  { icon: Flame, name: 'PSI', status: 'active' as const },
  { icon: Lock, name: 'GDPR', status: 'active' as const },
  { icon: Network, name: 'NIS2', status: 'pending' as const },
  { icon: Cog, name: 'ISCIR', status: 'active' as const },
]

export function ActiveModulesWidget() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Module Active</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {modules.map((mod) => (
          <div key={mod.name} className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors ${
            mod.status === 'active' ? 'border-border bg-background' : 'border-dashed border-amber-300 bg-amber-50/50'
          }`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${mod.status === 'active' ? 'bg-primary/10' : 'bg-amber-100'}`}>
              <mod.icon className={`h-4 w-4 ${mod.status === 'active' ? 'text-primary' : 'text-amber-600'}`} />
            </div>
            <span className="text-xs font-semibold text-foreground">{mod.name}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${mod.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
              {mod.status === 'active' ? <><Check className="h-3 w-3" /> Activ</> : <><Clock className="h-3 w-3" /> În așteptare</>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
