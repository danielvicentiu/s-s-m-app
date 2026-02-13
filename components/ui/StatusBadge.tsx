export interface StatusBadgeProps {
  status: 'valid' | 'expiring' | 'expired' | 'incomplete'
  label?: string
}

const CONFIG = {
  valid: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', default: 'Valid' },
  expiring: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', default: 'Expiră curând' },
  expired: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', default: 'Expirat' },
  incomplete: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400', default: 'Incomplet' },
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const c = CONFIG[status] || CONFIG.incomplete

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label || c.default}
    </span>
  )
}
