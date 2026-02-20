// components/forms/EquipmentFormComplete.tsx
// Formular complet pentru atribuire echipamente individuale de protecție (EIP)
// Include: selectare angajat, selectare echipamente multi-select, cantitate per item, data atribuire, semnatura digitala, observatii
// Supabase insert in tabela employee_equipment (junction table)
// Auto-generare fisa EIP PDF

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Package, Calendar, FileText, AlertCircle, CheckCircle2, Plus, Trash2, UserCheck } from 'lucide-react'

// ========== TYPES ==========

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  organization_id: string
}

interface EquipmentType {
  id: string
  name: string
  description: string | null
  category: string
  country_code: string
  is_active: boolean
}

interface EquipmentItem {
  equipmentTypeId: string
  equipmentTypeName: string
  quantity: number
}

interface Props {
  employees: Employee[]
  equipmentTypes: EquipmentType[]
  onSuccess?: () => void
  onCancel?: () => void
  organizationId?: string
}

// ========== COMPONENT ==========

export default function EquipmentFormComplete({
  employees,
  equipmentTypes,
  onSuccess,
  onCancel,
  organizationId,
}: Props) {
  const t = useTranslations('forms')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form fields
  const [employeeId, setEmployeeId] = useState('')
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<EquipmentItem[]>([])
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [digitalSignature, setDigitalSignature] = useState(false)

  // Filter PPE equipment types (category = 'ppe')
  const ppeEquipmentTypes = equipmentTypes.filter(
    (et) => et.category === 'ppe' && et.is_active
  )

  // ========== HANDLERS ==========

  // Add equipment item to list
  const handleAddItem = () => {
    if (!selectedEquipmentId) {
      setError(t('equipment.errorSelectEquipment'))
      return
    }

    const equipmentType = ppeEquipmentTypes.find((et) => et.id === selectedEquipmentId)
    if (!equipmentType) return

    // Check if already added
    const exists = items.find((item) => item.equipmentTypeId === selectedEquipmentId)
    if (exists) {
      setError(t('equipment.errorAlreadyAdded'))
      return
    }

    setItems([
      ...items,
      {
        equipmentTypeId: selectedEquipmentId,
        equipmentTypeName: equipmentType.name,
        quantity: quantity,
      },
    ])

    // Reset selection
    setSelectedEquipmentId('')
    setQuantity(1)
    setError(null)
  }

  // Remove item from list
  const handleRemoveItem = (equipmentTypeId: string) => {
    setItems(items.filter((item) => item.equipmentTypeId !== equipmentTypeId))
  }

  // Update quantity for an item
  const handleUpdateQuantity = (equipmentTypeId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setItems(
      items.map((item) =>
        item.equipmentTypeId === equipmentTypeId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!employeeId) {
      setError(t('equipment.errorSelectEmployee'))
      return
    }

    if (items.length === 0) {
      setError(t('equipment.errorAddAtLeastOne'))
      return
    }

    if (!assignmentDate) {
      setError(t('equipment.errorEnterDate'))
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createSupabaseBrowser()

      // Get employee details
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('id, full_name, job_title, organization_id')
        .eq('id', employeeId)
        .single()

      if (employeeError) throw employeeError
      if (!employee) throw new Error(t('equipment.errorEmployeeNotFound'))

      // Prepare records for employee_equipment junction table
      // Note: This assumes the table exists. If it doesn't, we'll create the migration separately
      const records = items.map((item) => ({
        employee_id: employeeId,
        equipment_type_id: item.equipmentTypeId,
        organization_id: employee.organization_id,
        quantity: item.quantity,
        assignment_date: assignmentDate,
        notes: notes || null,
        digital_signature: digitalSignature,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      // Insert into employee_equipment table
      const { data: insertedData, error: insertError } = await supabase
        .from('employee_equipment')
        .insert(records)
        .select()

      if (insertError) {
        // If table doesn't exist, provide helpful error
        if (insertError.code === '42P01') {
          throw new Error(t('equipment.errorTableMissing'))
        }
        throw insertError
      }

      // TODO: Generate EIP PDF document
      // This would call an API route to generate the PDF
      // await generateEIPDocument(employee, items, assignmentDate)

      setSuccess(true)
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1500)
    } catch (err: any) {
      console.error('Error submitting equipment assignment:', err)
      setError(err.message || t('equipment.errorSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // ========== RENDER ==========

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('equipment.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('equipment.subtitle')}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900">{t('equipment.successTitle')}</p>
            <p className="text-sm text-green-700">{t('equipment.successDesc')}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserCheck className="w-4 h-4 inline mr-1" />
            {t('equipment.labelEmployee')} *
          </label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">{t('equipment.selectEmployee')}</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} {emp.job_title ? `— ${emp.job_title}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            {t('equipment.labelDate')} *
          </label>
          <input
            type="date"
            value={assignmentDate}
            onChange={(e) => setAssignmentDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Equipment Selection - Multi-select with Add Button */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Package className="w-4 h-4 inline mr-1" />
            {t('equipment.labelEquipment')} *
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="md:col-span-2">
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">{t('equipment.selectEquipment')}</option>
                {ppeEquipmentTypes.map((et) => (
                  <option key={et.id} value={et.id}>
                    {et.name} {et.description ? `(${et.description})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                placeholder={t('equipment.quantityPlaceholder')}
                className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('equipment.add')}
              </button>
            </div>
          </div>

          {/* Equipment Items List */}
          {items.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {t('equipment.addedCount', { count: items.length })}
              </p>
              {items.map((item) => (
                <div
                  key={item.equipmentTypeId}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.equipmentTypeName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item.equipmentTypeId, item.quantity - 1)
                        }
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="text-sm font-medium text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item.equipmentTypeId, item.quantity + 1)
                        }
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.equipmentTypeId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('equipment.remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{t('equipment.noEquipmentYet')}</p>
            </div>
          )}
        </div>

        {/* Digital Signature Placeholder */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{t('equipment.digitalSignature')}</p>
              <p className="text-xs text-gray-500">
                {t('equipment.digitalSignatureDesc')}
              </p>
            </div>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            {t('equipment.labelNotes')}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder={t('equipment.notesPlaceholder')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {t('equipment.cancel')}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('equipment.saving')}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {t('equipment.saveAndGenerate')}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>{t('equipment.noteLabel')}:</strong> {t('equipment.noteText')}
        </p>
      </div>
    </div>
  )
}
