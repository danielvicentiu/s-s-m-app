'use client'

import orgTypesData from '@/src/data/org-types.json'

interface OrgType {
  id: string
  name: string
  fullName: string
  maxEmployees: number | null
  maxCAEN?: number | null
  legalPersonality: boolean
  isDefault?: boolean
  description: string
  note?: string
  restriction?: string
}

interface Props {
  selected: string
  onChange: (orgType: OrgType) => void
}

export default function OrgTypeSelector({ selected, onChange }: Props) {
  const orgTypes = orgTypesData.organizationTypes as OrgType[]

  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
        Ai PFA, SRL sau altceva?
      </label>
      <p className="text-xs text-gray-500 mb-3">Complet opțional — default: SRL</p>

      <select
        value={selected}
        onChange={(e) => {
          const orgType = orgTypes.find((org) => org.id === e.target.value)
          if (orgType) {onChange(orgType)}
        }}
        className="w-full bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {orgTypes.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name} — {org.fullName}
            {org.isDefault && ' (Implicit)'}
          </option>
        ))}
      </select>

      {selected && (() => {
        const selectedOrg = orgTypes.find((org) => org.id === selected)
        return selectedOrg?.note ? (
          <div className="mt-2 text-xs text-gray-400 bg-[#1a2332] rounded-lg px-3 py-2 border border-gray-800">
            {selectedOrg.note}
          </div>
        ) : null
      })()}
    </div>
  )
}
