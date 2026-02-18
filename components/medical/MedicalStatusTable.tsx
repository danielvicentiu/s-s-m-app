// components/medical/MedicalStatusTable.tsx
// Tabel reutilizabil pentru statusul medical al angajaților (din medical_status_overview view)
// Folosit în pagina de medical overview și în widget-uri de dashboard

'use client'

import { CheckCircle, AlertTriangle, XCircle, HelpCircle, ChevronRight } from 'lucide-react'
import { RestrictionBadgeList } from '@/components/medical/RestrictionBadge'

// ============================================================
// TYPES
// ============================================================

export interface MedicalStatusRow {
  employee_id: string
  full_name: string
  org_id: string
  job_title?: string | null
  department?: string | null
  last_result?: string | null
  last_examination_date?: string | null
  next_examination_date?: string | null
  restrictions?: string | null
  status: 'valid' | 'expira_curand' | 'expirat' | 'fara_fisa' | string
  days_until_expiry?: number | null
}

interface Props {
  rows: MedicalStatusRow[]
  /** Callback when user clicks a row (navigates to employee medical profile) */
  onEmployeeClick?: (employeeId: string) => void
  emptyMessage?: string
}

// ============================================================
// HELPERS
// ============================================================

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  valid: {
    label: 'Valid',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  expira_curand: {
    label: 'Expiră curând',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: AlertTriangle,
  },
  expirat: {
    label: 'Expirat',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle,
  },
  fara_fisa: {
    label: 'Fără fișă',
    color: 'bg-gray-50 text-gray-500 border-gray-200',
    icon: HelpCircle,
  },
}

const RESULT_LABELS: Record<string, string> = {
  apt: 'Apt',
  apt_conditionat: 'Apt condiționat',
  inapt_temporar: 'Inapt temporar',
  inapt: 'Inapt',
  in_asteptare: 'În așteptare',
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function DaysChip({ days }: { days: number | null | undefined }) {
  if (days === null || days === undefined) return <span className="text-gray-400">—</span>
  if (days < 0) {
    return (
      <span className="font-semibold text-red-600 tabular-nums">
        -{Math.abs(days)}z
      </span>
    )
  }
  return (
    <span
      className={`font-semibold tabular-nums ${
        days <= 7
          ? 'text-red-600'
          : days <= 30
          ? 'text-orange-500'
          : 'text-gray-700'
      }`}
    >
      {days}z
    </span>
  )
}

// ============================================================
// COMPONENT
// ============================================================

export function MedicalStatusTable({ rows, onEmployeeClick, emptyMessage }: Props) {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        {emptyMessage ?? 'Niciun angajat de afișat.'}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-3 text-left">Angajat</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left hidden md:table-cell">Rezultat</th>
            <th className="px-4 py-3 text-left hidden lg:table-cell">Expiră</th>
            <th className="px-4 py-3 text-right hidden lg:table-cell">Zile rămase</th>
            <th className="px-4 py-3 text-left hidden xl:table-cell">Restricții</th>
            {onEmployeeClick && <th className="px-4 py-3 w-8" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => {
            const cfg = STATUS_CONFIG[row.status] ?? STATUS_CONFIG['fara_fisa']
            const Icon = cfg.icon

            return (
              <tr
                key={row.employee_id}
                onClick={() => onEmployeeClick?.(row.employee_id)}
                className={`transition-colors ${
                  onEmployeeClick ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
              >
                {/* Angajat */}
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{row.full_name}</div>
                  {row.job_title && (
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">
                      {row.job_title}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </span>
                </td>

                {/* Rezultat */}
                <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                  {row.last_result ? RESULT_LABELS[row.last_result] ?? row.last_result : '—'}
                </td>

                {/* Expiră */}
                <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                  {fmtDate(row.next_examination_date)}
                </td>

                {/* Zile rămase */}
                <td className="px-4 py-3 hidden lg:table-cell text-right">
                  <DaysChip days={row.days_until_expiry} />
                </td>

                {/* Restricții */}
                <td className="px-4 py-3 hidden xl:table-cell max-w-[280px]">
                  <RestrictionBadgeList restrictions={row.restrictions} size="sm" emptyText="—" />
                </td>

                {/* Arrow */}
                {onEmployeeClick && (
                  <td className="px-4 py-3 text-gray-300">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
