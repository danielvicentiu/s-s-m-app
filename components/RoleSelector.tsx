'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import jobRolesData from '@/src/data/job-roles-by-activity.json'

interface Role {
  name: string
  cor?: string
  risk?: string
  synonyms?: string[]
}

interface Props {
  category: string
  selectedRoles: string[]
  onChange: (roles: string[]) => void
}

export default function RoleSelector({ category, selectedRoles, onChange }: Props) {
  const [customRole, setCustomRole] = useState('')

  const roles = (jobRolesData.rolesByCategory as Record<string, Role[]>)[category] || []

  const toggleRole = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      onChange(selectedRoles.filter((r) => r !== roleName))
    } else {
      onChange([...selectedRoles, roleName])
    }
  }

  const addCustomRole = () => {
    if (customRole.trim() && !selectedRoles.includes(customRole.trim())) {
      onChange([...selectedRoles, customRole.trim()])
      setCustomRole('')
    }
  }

  if (roles.length === 0) return null

  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        Ce posturi/funcții ai?
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Opțional — pentru estimare mai precisă. ZERO date personale, ZERO nume angajați.
      </p>

      {/* Predefined roles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map((role) => (
          <button
            key={role.name}
            onClick={() => toggleRole(role.name)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedRoles.includes(role.name)
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-[#1a2332] text-gray-400 border border-gray-700 hover:border-blue-500 hover:text-white'
            }`}
          >
            {role.name}
            {role.cor && <span className="ml-1 text-xs opacity-60">COR {role.cor}</span>}
          </button>
        ))}
      </div>

      {/* Custom role input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customRole}
          onChange={(e) => setCustomRole(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomRole()}
          placeholder="Altă funcție..."
          className="flex-1 bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addCustomRole}
          disabled={!customRole.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adaugă
        </button>
      </div>

      {/* Selected roles */}
      {selectedRoles.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-gray-400 mb-2">
            Funcții selectate ({selectedRoles.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map((role) => (
              <div
                key={role}
                className="bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 text-sm text-blue-200 flex items-center gap-2"
              >
                {role}
                <button
                  onClick={() => toggleRole(role)}
                  className="text-blue-300 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
