'use client'

// components/psi/InspectionForm.tsx
// M2_PSI: Modal form for recording PSI inspections

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import {
  PSIEquipment,
  PSIInspectionResult,
  PSI_EQUIPMENT_TYPE_LABELS,
  PSI_INSPECTION_RESULT_LABELS
} from '@/lib/types'
import { CreatePSIInspectionInput } from '@/lib/api/validation'

interface InspectionFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreatePSIInspectionInput) => Promise<void>
  equipment: PSIEquipment
}

export default function InspectionForm({
  isOpen,
  onClose,
  onSave,
  equipment
}: InspectionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate default next inspection date (1 year from today for most equipment)
  const getDefaultNextInspectionDate = (): string => {
    const nextDate = new Date()
    // Most PSI equipment requires annual inspection
    nextDate.setFullYear(nextDate.getFullYear() + 1)
    return nextDate.toISOString().split('T')[0]
  }

  // Form state
  const [formData, setFormData] = useState<CreatePSIInspectionInput>({
    equipment_id: equipment.id,
    organization_id: equipment.organization_id,
    inspection_date: new Date().toISOString().split('T')[0],
    inspector_name: '',
    inspector_license: '',
    result: 'conform',
    findings: '',
    next_inspection_date: getDefaultNextInspectionDate(),
    bulletin_number: '',
    bulletin_storage_path: ''
  })

  // Reset form when opening/closing or equipment changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        equipment_id: equipment.id,
        organization_id: equipment.organization_id,
        inspection_date: new Date().toISOString().split('T')[0],
        inspector_name: '',
        inspector_license: '',
        result: 'conform',
        findings: '',
        next_inspection_date: getDefaultNextInspectionDate(),
        bulletin_number: '',
        bulletin_storage_path: ''
      })
      setError(null)
    }
  }, [isOpen, equipment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Client-side validation
      if (!formData.inspector_name.trim()) {
        throw new Error('Numele inspectorului este obligatoriu')
      }

      if (!formData.inspection_date) {
        throw new Error('Data inspecției este obligatorie')
      }

      if (!formData.next_inspection_date) {
        throw new Error('Data următoarei inspecții este obligatorie')
      }

      // Validate dates
      if (new Date(formData.next_inspection_date) <= new Date(formData.inspection_date)) {
        throw new Error('Data următoarei inspecții trebuie să fie după data inspecției curente')
      }

      // Convert empty strings to null for optional fields
      const dataToSubmit: CreatePSIInspectionInput = {
        ...formData,
        inspector_license: formData.inspector_license || null,
        findings: formData.findings || null,
        bulletin_number: formData.bulletin_number || null,
        bulletin_storage_path: formData.bulletin_storage_path || null
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
            Înregistrează inspecție PSI
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

          {/* Equipment Info (Read-only) */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <h3 className="text-sm font-semibold text-blue-900">Echipament:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Tip:</span>{' '}
                <span className="text-blue-900">{PSI_EQUIPMENT_TYPE_LABELS[equipment.equipment_type]}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Identificator:</span>{' '}
                <span className="text-blue-900">{equipment.identifier}</span>
              </div>
              {equipment.location && (
                <div className="col-span-2">
                  <span className="text-blue-700 font-medium">Locație:</span>{' '}
                  <span className="text-blue-900">{equipment.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Inspection Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data inspecției *
            </label>
            <input
              type="date"
              value={formData.inspection_date}
              onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })}
              disabled={loading}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">Data când a fost efectuată inspecția</p>
          </div>

          {/* Inspector Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nume inspector *
              </label>
              <input
                type="text"
                value={formData.inspector_name}
                onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
                disabled={loading}
                required
                placeholder="Nume complet inspector"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autorizație inspector
              </label>
              <input
                type="text"
                value={formData.inspector_license}
                onChange={(e) => setFormData({ ...formData, inspector_license: e.target.value })}
                disabled={loading}
                placeholder="Nr. autorizație (opțional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Inspection Result */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rezultat inspecție *
            </label>
            <select
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value as PSIInspectionResult })}
              disabled={loading}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              {Object.entries(PSI_INSPECTION_RESULT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Findings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observații / Constatări
            </label>
            <textarea
              value={formData.findings}
              onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
              disabled={loading}
              rows={4}
              placeholder="Detalii despre starea echipamentului, probleme identificate, recomandări..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            {formData.result === 'neconform' && (
              <p className="mt-1 text-xs text-amber-600">
                Pentru rezultat neconform, precizează obligatoriu motivele în observații
              </p>
            )}
          </div>

          {/* Next Inspection Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data următoarei inspecții *
            </label>
            <input
              type="date"
              value={formData.next_inspection_date}
              onChange={(e) => setFormData({ ...formData, next_inspection_date: e.target.value })}
              disabled={loading}
              required
              min={formData.inspection_date}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              Inspecțiile PSI se efectuează de obicei anual
            </p>
          </div>

          {/* Bulletin Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Număr buletin
              </label>
              <input
                type="text"
                value={formData.bulletin_number}
                onChange={(e) => setFormData({ ...formData, bulletin_number: e.target.value })}
                disabled={loading}
                placeholder="Nr. buletin verificare"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buletin (fișier)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.bulletin_storage_path}
                  onChange={(e) => setFormData({ ...formData, bulletin_storage_path: e.target.value })}
                  disabled={loading}
                  placeholder="(viitor: upload PDF)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Upload buletin PDF - disponibil în viitor
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Atenție:</strong> După salvare, echipamentul va fi actualizat automat cu datele
              inspecției (ultimă inspecție, următoare inspecție, status).
            </p>
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
              Salvează inspecția
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
