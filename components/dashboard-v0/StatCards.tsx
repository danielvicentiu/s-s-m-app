// components/dashboard-v0/StatCards.tsx
// v0 stat cards - static demo widget

import { Users, CalendarClock, FileWarning } from 'lucide-react'

function ConformityRing({ value }: { value: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-foreground">{value}%</span>
      </div>
    </div>
  )
}

const cards = [
  { label: 'Angaja\u021bi Activi', value: '245', sub: '+12 luna aceasta', subColor: 'text-green-600', bgAccent: 'bg-green-50', icon: Users, iconColor: 'text-green-600' },
  { label: 'Instruiri Planificate', value: '18', sub: '5 restante', subColor: 'text-amber-600', bgAccent: 'bg-amber-50', icon: CalendarClock, iconColor: 'text-amber-600' },
  { label: 'Documente Expirate', value: '3', sub: 'Necesit\u0103 aten\u021bie', subColor: 'text-red-600', bgAccent: 'bg-red-50', icon: FileWarning, iconColor: 'text-red-600' },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.bgAccent}`}>
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
            <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
        <ConformityRing value={87} />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Scor Conformitate</p>
          <p className="mt-0.5 text-sm font-medium text-foreground">Foarte bun</p>
          <p className="text-xs text-muted-foreground">+3% fa\u021b\u0103 de luna trecut\u0103</p>
        </div>
      </div>
    </div>
  )
}
