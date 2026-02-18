// components/medical/RestrictionBadge.tsx
// Afișează o restricție medicală individuală ca badge colorat portocaliu
// Folosit în profilul medical al angajatului și în tabelele de status

import { AlertTriangle } from 'lucide-react'

interface RestrictionBadgeProps {
  /** Textul restricției (ex: "Nu lucru la înălțime") */
  restriction: string
  /** Dimensiunea badge-ului */
  size?: 'sm' | 'md'
}

/**
 * Badge pentru o restricție medicală individuală.
 * Accepts a single restriction string (not a comma-separated list).
 * To display multiple restrictions from a comma-separated string, see parseRestrictions().
 */
export function RestrictionBadge({ restriction, size = 'md' }: RestrictionBadgeProps) {
  const trimmed = restriction.trim()
  if (!trimmed) return null

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        bg-orange-50 text-orange-700 border border-orange-200
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'}
      `}
    >
      <AlertTriangle className={size === 'sm' ? 'h-3 w-3 flex-shrink-0' : 'h-3.5 w-3.5 flex-shrink-0'} />
      {trimmed}
    </span>
  )
}

/**
 * Parsează un string de restricții (separator: virgulă sau newline)
 * și returnează array de string-uri non-goale.
 */
export function parseRestrictions(restrictions: string | null | undefined): string[] {
  if (!restrictions) return []
  return restrictions
    .split(/[,\n]/)
    .map((r) => r.trim())
    .filter(Boolean)
}

/**
 * Afișează toate restricțiile dintr-un string ca badges.
 */
interface RestrictionBadgeListProps {
  restrictions: string | null | undefined
  size?: 'sm' | 'md'
  emptyText?: string
}

export function RestrictionBadgeList({
  restrictions,
  size = 'md',
  emptyText,
}: RestrictionBadgeListProps) {
  const list = parseRestrictions(restrictions)

  if (list.length === 0) {
    if (emptyText) {
      return <span className="text-sm text-gray-400 italic">{emptyText}</span>
    }
    return null
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((r, i) => (
        <RestrictionBadge key={i} restriction={r} size={size} />
      ))}
    </div>
  )
}
