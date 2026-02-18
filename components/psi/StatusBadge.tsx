// components/psi/StatusBadge.tsx
// M2_PSI: Days-based color badge for PSI equipment expiry status
// verde (>30 zile), galben (7-30 zile), roșu (<7 zile / expirat)

interface StatusBadgeProps {
  nextInspectionDate: string | null
  showDate?: boolean
}

function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function StatusBadge({ nextInspectionDate, showDate = false }: StatusBadgeProps) {
  const days = getDaysUntil(nextInspectionDate)

  if (days === null) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Nedefinit
      </span>
    )
  }

  let bg: string
  let text: string
  let dot: string
  let label: string

  if (days < 0) {
    bg = 'bg-red-100'
    text = 'text-red-700'
    dot = 'bg-red-500'
    label = `Expirat ${Math.abs(days)} zile`
  } else if (days <= 7) {
    bg = 'bg-red-100'
    text = 'text-red-700'
    dot = 'bg-red-500'
    label = days === 0 ? 'Expiră azi' : `${days} zile`
  } else if (days <= 30) {
    bg = 'bg-amber-100'
    text = 'text-amber-700'
    dot = 'bg-amber-500'
    label = `${days} zile`
  } else {
    bg = 'bg-green-100'
    text = 'text-green-700'
    dot = 'bg-green-500'
    label = `${days} zile`
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
      {showDate && nextInspectionDate && (
        <span className="ml-1 opacity-70">({nextInspectionDate})</span>
      )}
    </span>
  )
}
