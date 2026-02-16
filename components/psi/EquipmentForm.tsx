'use client'

// components/psi/EquipmentForm.tsx
// M2_PSI: Modal form for creating/editing PSI equipment

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import {
  PSIEquipment,
  PSIEquipmentType,
  PSIEquipmentStatus,
  PSI_EQUIPMENT_TYPE_LABELS,
  PSI_EQUIPMENT_STATUS_LABELS
} from '@/lib/types'
import { CreatePSIEquipmentInput } from '@/lib/api/validation'

interface EquipmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreatePSIEquipmentInput) => Promise<void>
  equipment?: PSIEquipment | null
  organizations: Array<{ id: string; name: string; cui?: string | null }>
}

export default function EquipmentForm({
  isOpen,
  onClose,
  onSave,
  equipment,
  organizations
}: EquipmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<CreatePSIEquipmentInput>({
    organization_id: '',
    equipment_type: 'stingator',
    identifier: '',
    location: '',
    manufacturer: '',
    model: '',
    manufacture_date: '',
    installation_date: '',
    last_inspection_date: '',
    next_inspection_date: '',
    capacity: '',
    agent_type: '',
    status: 'operational',
    notes: ''
  })

  // Reset form when opening/closing or equipment changes
  useEffect(() => {
    if (isOpen) {
      if (equipment) {
        // Edit mode - prefill with equipment data
        setFormData({
          organization_id: equipment.organization_id,
          equipment_type: equipment.equipment_type,
          identifier: equipment.identifier,
          location: equipment.location || '',
          manufacturer: equipment.manufacturer || '',
          model: equipment.model || '',
          manufacture_date: equipment.manufacture_date || '',
          installation_date: equipment.installation_date || '',
          last_inspection_date: equipment.last_inspection_date || '',
          next_inspection_date: equipment.next_inspection_date || '',
          capacity: equipment.capacity || '',
          agent_type: equipment.agent_type || '',
          status: equipment.status,
          notes: equipment.notes || ''
        })
      } else {
        // Create mode - reset to defaults
        setFormData({
          organization_id: organizations[0]?.id || '',
          equipment_type: 'stingator',
          identifier: '',
          location: '',
          manufacturer: '',
          model: '',
          manufacture_date: '',
          installation_date: '',
          last_inspection_date: '',
          next_inspection_date: '',
          capacity: '',
          agent_type: '',
          status: 'operational',
          notes: ''
        })
      }
      setError(null)
    }
  }, [isOpen, equipment, organizations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Client-side validation
      if (!formData.identifier.trim()) {
        throw new Error('Identificatorul este obligatoriu')
      }

      if (!formData.organization_id) {
        throw new Error('Selectează o organizație')
      }

      // Convert empty strings to null for optional fields
      const dataToSubmit: CreatePSIEquipmentInput = {
        ...formData,
        location: formData.location || null,
        manufacturer: formData.manufacturer || null,
        model: formData.model || null,
        manufacture_date: formData.manufacture_date || null,
        installation_date: formData.installation_date || null,
        last_inspection_date: formData.last_inspection_date || null,
        next_inspection_date: formData.next_inspection_date || null,
        capacity: formData.capacity || null,
        agent_type: formData.agent_type || null,
        notes: formData.notes || null
      }

      await onSave(dataToSubmit)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {equipment ? 'Editează echipament PSI' : 'Adaugă echipament PSI'}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organizație *
            </label>
            <select
              value={formData.organization_id}
              onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
              disabled={loading || !!equipment}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} {org.cui ? `(${org.cui})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tip echipament *
            </label>
            <select
              value={formData.equipment_type}
              onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value as PSIEquipmentType })}
              disabled={loading}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              {Object.entries(PSI_EQUIPMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Identifier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identificator / Serie *
            </label>
            <input
              type="text"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              disabled={loading}
              required
              maxLength={100}
              placeholder="Ex: STG-001, Serie XYZ123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Locație
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={loading}
              placeholder="Ex: Etaj 2, Hala B, Birou 301"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Manufacturer & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producător
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                disabled={loading}
                placeholder="Ex: Gloria, Minimax"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                disabled={loading}
                placeholder="Ex: PD6, ABC-123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Capacity & Agent Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacitate
              </label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                disabled={loading}
                placeholder="Ex: 6kg, 9L, 200L"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tip agent
              </label>
              <input
                type="text"
                value={formData.agent_type}
                onChange={(e) => setFormData({ ...formData, agent_type: e.target.value })}
                disabled={loading}
                placeholder="Ex: CO2, Pulbere, Spumă"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data fabricației
              </label>
              <input
                type="date"
                value={formData.manufacture_date}
                onChange={(e) => setFormData({ ...formData, manufacture_date: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data instalării
              </label>
              <input
                type="date"
                value={formData.installation_date}
                onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ultimă inspecție
              </label>
              <input
                type="date"
                value={formData.last_inspection_date}
                onChange={(e) => setFormData({ ...formData, last_inspection_date: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Următoare inspecție
              </label>
              <input
                type="date"
                value={formData.next_inspection_date}
                onChange={(e) => setFormData({ ...formData, next_inspection_date: e.target.value })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PSIEquipmentStatus })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              {Object.entries(PSI_EQUIPMENT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observații
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={loading}
              rows={3}
              placeholder="Observații suplimentare..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {equipment ? 'Salvează modificările' : 'Adaugă echipament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
