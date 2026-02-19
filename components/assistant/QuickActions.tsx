// components/assistant/QuickActions.tsx
// v0 quick action chips for VA-AI

import { Search, ClipboardList, BarChart3 } from 'lucide-react'

const actions = [
  { icon: Search, label: '🔍 Verifică Conformitatea', message: 'Verifică conformitatea organizației mele' },
  { icon: ClipboardList, label: '📋 Simulare Control ITM', message: 'Simulează un control ITM pentru firma mea' },
  { icon: BarChart3, label: '📊 Rezumat Situație', message: 'Care este situația generală a firmei mele?' },
]

interface QuickActionsProps {
  onAction: (message: string) => void
  disabled?: boolean
}

export function QuickActions({ onAction, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2 pt-1 lg:px-6">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => onAction(a.message)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
