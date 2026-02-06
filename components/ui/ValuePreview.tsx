// components/ui/ValuePreview.tsx
// Value Preview — Risc financiar estimat
// Afișează breakdown amenzi potențiale per neconformitate
// Consultant: vede ÎNTOTDEAUNA | Client: vede doar dacă e activat

'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp, Scale, Eye, EyeOff } from 'lucide-react'

interface BreakdownItem {
  code: string
  description: string
  legal_reference: string
  category: string
  authority: string
  count: number
  fine_per: string
  min_total: number
  max_total: number
  severity: string
}

interface ValuePreviewData {
  total_min: number
  total_max: number
  items_count: number
  breakdown: BreakdownItem[]
  calculated_at: string
  organization_id: string
}

interface ValuePreviewProps {
  data: ValuePreviewData | null
  isConsultant?: boolean
  showToClient?: boolean
}

function formatRON(amount: number): string {
  return amount.toLocaleString('ro-RO') + ' RON'
}

function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-700 border-red-200'
    case 'high': return 'bg-red-50 text-red-600 border-red-100'
    case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100'
    case 'low': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
    default: return 'bg-gray-50 text-gray-600 border-gray-100'
  }
}

function authorityBadge(authority: string): string {
  switch (authority) {
    case 'ITM': return 'bg-blue-100 text-blue-700'
    case 'ISU': return 'bg-red-100 text-red-700'
    case 'ISCIR': return 'bg-purple-100 text-purple-700'
    case 'DSP': return 'bg-green-100 text-green-700'
    case 'ANRE': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function finePerLabel(finePer: string): string {
  switch (finePer) {
    case 'employee': return '/ angajat'
    case 'item': return '/ bucată'
    case 'location': return '/ locație'
    case 'organization': return '/ firmă'
    default: return ''
  }
}

export function ValuePreview({ data, isConsultant = false, showToClient = false }: ValuePreviewProps) {
  const [expanded, setExpanded] = useState(false)

  // Nu afișa dacă nu e consultant și nu e activat pt client
  if (!isConsultant && !showToClient) return null

  // Nu afișa dacă nu sunt date sau nu sunt neconformități
  if (!data || data.items_count === 0) {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 px-6 py-5">
        <div className="flex items-center gap-3">
          <Scale className="h-6 w-6 text-green-600" />
          <div>
            <div className="text-sm font-bold text-green-700">Risc financiar: 0 RON</div>
            <div className="text-xs text-green-600">Nicio neconformitate detectată. Felicitări!</div>
          </div>
        </div>
      </div>
    )
  }

  // Calculează ce % din risc vine de la cea mai mare categorie
  const topItem = data.breakdown.reduce((a, b) => a.max_total > b.max_total ? a : b)
  const topPercent = Math.round((topItem.max_total / data.total_max) * 100)

  return (
    <div className="rounded-2xl border-2 border-red-200 bg-white overflow-hidden">
      {/* Header — mereu vizibil */}
      <div
        className="px-6 py-5 cursor-pointer hover:bg-red-50/50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                Risc Financiar Estimat
              </div>
              <div className="text-2xl font-black text-red-600">
                {formatRON(data.total_min)} — {formatRON(data.total_max)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{data.items_count} neconformități</div>
              <div className="text-xs text-gray-400">
                {topPercent}% din risc: {topItem.description.toLowerCase()}
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Mini progress bar — câte din fiecare autoritate */}
        <div className="flex gap-1 mt-3 h-2 rounded-full overflow-hidden">
          {data.breakdown.map((item, i) => (
            <div
              key={i}
              className={`${item.authority === 'ITM' ? 'bg-blue-500' : item.authority === 'ISU' ? 'bg-red-500' : 'bg-purple-500'}`}
              style={{ flex: item.max_total }}
              title={`${item.authority}: ${formatRON(item.max_total)}`}
            />
          ))}
        </div>
        <div className="flex gap-3 mt-2">
          {[...new Set(data.breakdown.map(b => b.authority))].map(auth => (
            <span key={auth} className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className={`w-2 h-2 rounded-full ${auth === 'ITM' ? 'bg-blue-500' : auth === 'ISU' ? 'bg-red-500' : 'bg-purple-500'}`} />
              {auth}
            </span>
          ))}
        </div>
      </div>

      {/* Breakdown — expandabil */}
      {expanded && (
        <div className="border-t border-red-100">
          {data.breakdown.map((item, i) => (
            <div key={i} className={`px-6 py-3 flex items-center justify-between ${i > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${authorityBadge(item.authority)}`}>
                  {item.authority}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {item.count}× {item.description}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">
                    {item.legal_reference}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-sm font-bold text-red-600">
                  {formatRON(item.min_total)} — {formatRON(item.max_total)}
                </div>
                <div className="text-[10px] text-gray-400">
                  {formatRON(item.min_total / item.count)} — {formatRON(item.max_total / item.count)} {finePerLabel(item.fine_per)}
                </div>
              </div>
            </div>
          ))}

          {/* Total bar */}
          <div className="px-6 py-4 bg-red-50 border-t border-red-200 flex items-center justify-between">
            <div className="text-sm font-bold text-red-700">TOTAL AMENDĂ POTENȚIALĂ</div>
            <div className="text-lg font-black text-red-700">
              {formatRON(data.total_min)} — {formatRON(data.total_max)}
            </div>
          </div>

          {/* Sfat */}
          <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
            <div className="text-xs text-blue-700">
              💡 <strong>Rezolvă {topItem.count}× {topItem.description.toLowerCase()}</strong> pentru a reduce riscul cu {topPercent}% (economie până la {formatRON(topItem.max_total)})
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
