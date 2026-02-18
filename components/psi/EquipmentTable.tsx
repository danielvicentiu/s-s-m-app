'use client'

// components/psi/EquipmentTable.tsx
// M2_PSI: Reusable sortable/filterable equipment table with expiry badge

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ClipboardCheck, Edit, Trash2, ExternalLink } from 'lucide-react'
import {
  PSIEquipment,
  PSI_EQUIPMENT_TYPE_LABELS,
  PSI_EQUIPMENT_STATUS_LABELS
} from '@/lib/types'
import StatusBadge from './StatusBadge'

type SortField = 'identifier' | 'equipment_type' | 'location' | 'status' | 'last_inspection_date' | 'next_inspection_date'
type SortOrder = 'asc' | 'desc'

interface EquipmentTableProps {
  equipment: PSIEquipment[]
  onEdit?: (equip: PSIEquipment) => void
  onDelete?: (equip: PSIEquipment) => void
  onInspect?: (equip: PSIEquipment) => void
  onViewDetail?: (equip: PSIEquipment) => void
  showActions?: boolean
}

function SortIcon({ field, sortBy, sortOrder }: { field: SortField; sortBy: SortField; sortOrder: SortOrder }) {
  if (sortBy !== field) return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400 ml-1 inline" />
  return sortOrder === 'asc'
    ? <ChevronUp className="h-3.5 w-3.5 text-blue-600 ml-1 inline" />
    : <ChevronDown className="h-3.5 w-3.5 text-blue-600 ml-1 inline" />
}

export default function EquipmentTable({
  equipment,
  onEdit,
  onDelete,
  onInspect,
  onViewDetail,
  showActions = true
}: EquipmentTableProps) {
  const [sortBy, setSortBy] = useState<SortField>('next_inspection_date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sorted = useMemo(() => {
    return [...equipment].sort((a, b) => {
      let aVal = a[sortBy] as string | null
      let bVal = b[sortBy] as string | null

      // Nulls last
      if (!aVal && !bVal) return 0
      if (!aVal) return 1
      if (!bVal) return -1

      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortOrder === 'asc' ? cmp : -cmp
    })
  }, [equipment, sortBy, sortOrder])

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
        Niciun echipament de afișat
      </div>
    )
  }

  const thClass = 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none'
  const thNoSort = 'px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className={thClass} onClick={() => handleSort('equipment_type')}>
                Tip <SortIcon field="equipment_type" sortBy={sortBy} sortOrder={sortOrder} />
              </th>
              <th className={thClass} onClick={() => handleSort('identifier')}>
                Identificator <SortIcon field="identifier" sortBy={sortBy} sortOrder={sortOrder} />
              </th>
              <th className={thClass} onClick={() => handleSort('location')}>
                Locație <SortIcon field="location" sortBy={sortBy} sortOrder={sortOrder} />
              </th>
              <th className={thClass} onClick={() => handleSort('status')}>
                Status <SortIcon field="status" sortBy={sortBy} sortOrder={sortOrder} />
              </th>
              <th className={thClass} onClick={() => handleSort('last_inspection_date')}>
                Ultimă insp. <SortIcon field="last_inspection_date" sortBy={sortBy} sortOrder={sortOrder} />
              </th>
              <th className={thClass} onClick={() => handleSort('next_inspection_date')}>
                Expiră <SortIcon field="next_inspection_date" sortBy={sortBy} sortOrder={sortOrder} />
              </th>
              {showActions && <th className={thNoSort}>Acțiuni</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sorted.map((equip) => (
              <tr key={equip.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {PSI_EQUIPMENT_TYPE_LABELS[equip.equipment_type]}
                  {equip.agent_type && (
                    <span className="ml-1 text-xs text-gray-500">({equip.agent_type})</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{equip.identifier}</div>
                  {equip.manufacturer && (
                    <div className="text-xs text-gray-500">{equip.manufacturer}{equip.model ? ` — ${equip.model}` : ''}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {equip.location || <span className="text-gray-400 italic">Fără locație</span>}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    equip.status === 'operational' ? 'bg-green-100 text-green-700' :
                    equip.status === 'needs_inspection' ? 'bg-amber-100 text-amber-700' :
                    equip.status === 'needs_repair' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {PSI_EQUIPMENT_STATUS_LABELS[equip.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {equip.last_inspection_date || <span className="text-gray-400 italic">Niciodată</span>}
                </td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge nextInspectionDate={equip.next_inspection_date} showDate />
                </td>
                {showActions && (
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-end gap-1">
                      {onViewDetail && (
                        <button
                          onClick={() => onViewDetail(equip)}
                          title="Detalii echipament"
                          className="p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                      {onInspect && (
                        <button
                          onClick={() => onInspect(equip)}
                          title="Înregistrează inspecție"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <ClipboardCheck className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(equip)}
                          title="Editează"
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(equip)}
                          title="Șterge"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        {sorted.length} echipament{sorted.length !== 1 ? 'e' : ''}
      </div>
    </div>
  )
}
