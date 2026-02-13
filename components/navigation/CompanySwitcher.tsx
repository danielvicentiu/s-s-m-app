// components/navigation/CompanySwitcher.tsx
// Dropdown pentru schimbare rapidă între companii
// Salvează selecția în context și actualizează datele dashboard-ului
// Data: 13 Februarie 2026

'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Building2, Plus, Check } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface Organization {
  id: string
  name: string
  cui: string | null
  employee_count?: number
  avatar_url?: string | null
}

interface CompanySwitcherProps {
  organizations: Organization[]
  selectedOrgId: string
  onOrgChange: (orgId: string) => void
  userId: string
  className?: string
}

export default function CompanySwitcher({
  organizations,
  selectedOrgId,
  onOrgChange,
  userId,
  className = ''
}: CompanySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Găsește organizația selectată
  const selectedOrg = selectedOrgId === 'all'
    ? { id: 'all', name: 'Toate organizațiile', cui: null, employee_count: organizations.length }
    : organizations.find(org => org.id === selectedOrgId)

  // Închide dropdown la click în afara lui
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Schimbă organizația și salvează în DB
  async function handleSelectOrg(orgId: string) {
    onOrgChange(orgId)
    setIsOpen(false)

    // Salvează preferința în user_preferences
    const supabase = createSupabaseBrowser()
    await supabase.from('user_preferences').upsert(
      {
        user_id: userId,
        key: 'selected_org',
        value: JSON.stringify(orgId),
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,key' }
    )
  }

  // Generează initiale pentru avatar dacă nu există logo
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Afișare una singură organizație
  if (organizations.length <= 1) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-semibold text-sm">
          {selectedOrg ? getInitials(selectedOrg.name) : 'ORG'}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {selectedOrg?.name || 'Organizație'}
          </span>
          {selectedOrg?.cui && (
            <span className="text-xs text-gray-500">CUI: {selectedOrg.cui}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent min-w-[240px]"
      >
        {/* Company Avatar */}
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-semibold text-sm">
          {selectedOrg ? getInitials(selectedOrg.name) : 'ALL'}
        </div>

        {/* Company Info */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <span className="truncate text-sm font-semibold text-gray-900">
            {selectedOrg?.name || 'Selectează organizație'}
          </span>
          {selectedOrg?.cui && selectedOrgId !== 'all' ? (
            <span className="text-xs text-gray-500">CUI: {selectedOrg.cui}</span>
          ) : (
            <span className="text-xs text-gray-500">
              {selectedOrg?.employee_count} {selectedOrgId === 'all' ? 'organizații' : 'angajați'}
            </span>
          )}
        </div>

        {/* Chevron Icon */}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[280px] rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="max-h-[400px] overflow-y-auto py-2">
            {/* Opțiune "Toate organizațiile" */}
            <button
              onClick={() => handleSelectOrg('all')}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                selectedOrgId === 'all' ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm">
                ALL
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Toate organizațiile</span>
                  {selectedOrgId === 'all' && <Check className="h-4 w-4 text-blue-600" />}
                </div>
                <span className="text-xs text-gray-500">{organizations.length} organizații</span>
              </div>
            </button>

            {/* Separator */}
            <div className="my-2 border-t border-gray-100" />

            {/* Lista organizații */}
            {organizations.map((org) => {
              const isSelected = selectedOrgId === org.id

              return (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrg(org.id)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Company Avatar/Logo */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-semibold">
                    {org.avatar_url ? (
                      <img
                        src={org.avatar_url}
                        alt={org.name}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-sm">{getInitials(org.name)}</span>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className={`truncate font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                        {org.name}
                      </span>
                      {isSelected && <Check className="h-4 w-4 flex-shrink-0 text-blue-600" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {org.cui && <span>CUI: {org.cui}</span>}
                      {org.cui && org.employee_count !== undefined && <span>•</span>}
                      {org.employee_count !== undefined && (
                        <span>{org.employee_count} angajați</span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Separator */}
            <div className="my-2 border-t border-gray-100" />

            {/* Buton "Adaugă organizație nouă" */}
            <button
              onClick={() => {
                setIsOpen(false)
                // TODO: Navigate to add organization page or open modal
                window.location.href = '/ro/dashboard/organizatii/noua'
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
                <Plus className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-gray-700">Adaugă organizație nouă</span>
                <span className="block text-xs text-gray-500">Creează o companie nouă</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
