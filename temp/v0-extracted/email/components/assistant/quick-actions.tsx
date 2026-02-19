import { Search, ClipboardList, BarChart3 } from "lucide-react"

const actions = [
  { icon: Search, label: "Verifică Conformitatea" },
  { icon: ClipboardList, label: "Simulare Control ITM" },
  { icon: BarChart3, label: "Rezumat Situație" },
]

interface QuickActionsProps {
  onAction: (label: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2 lg:px-6">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => onAction(a.label)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <a.icon className="h-3.5 w-3.5" />
          {a.label}
        </button>
      ))}
    </div>
  )
}
