// components/medical/MedicalRecordForm.tsx
// Formular reutilizabil pentru adăugare/editare fișă medicală
// Poate fi folosit standalone sau înăuntrul unui FormModal
// Referință legislativă: HG 355/2007, Ordinul MS 1169/2023

'use client'

import { useState } from 'react'

// ============================================================
// CONSTANTS
// ============================================================

export const EXAM_TYPES: Record<string, string> = {
  periodic: 'Periodic',
  angajare: 'Angajare',
  reluare: 'Reluare activitate după boală',
  la_cerere: 'La cerere',
  control_periodic: 'Control periodic',
  control_angajare: 'Control angajare',
  fisa_aptitudine: 'Fișă aptitudine',
  fisa_psihologica: 'Fișă psihologică',
  supraveghere: 'Supraveghere specială',
  vaccinare: 'Vaccinare',
  altul: 'Alt tip',
}

export const RESULT_TYPES: Record<string, string> = {
  apt: 'Apt',
  apt_conditionat: 'Apt condiționat',
  inapt_temporar: 'Inapt temporar',
  inapt: 'Inapt',
  in_asteptare: 'În așteptare',
}

// ============================================================
// TYPES
// ============================================================

export interface MedicalRecordFormData {
  organization_id: string
  employee_id: string
  employee_name: string
  job_title: string
  examination_type: string
  examination_date: string
  expiry_date: string
  result: string
  restrictions: string
  doctor_name: string
  clinic_name: string
  notes: string
  risk_factors: string
  document_number: string
  validity_months: number
}

export const EMPTY_RECORD_FORM: MedicalRecordFormData = {
  organization_id: '',
  employee_id: '',
  employee_name: '',
  job_title: '',
  examination_type: 'periodic',
  examination_date: '',
  expiry_date: '',
  result: 'apt',
  restrictions: '',
  doctor_name: '',
  clinic_name: '',
  notes: '',
  risk_factors: '',
  document_number: '',
  validity_months: 12,
}

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  organization_id: string
}

interface Organization {
  id: string
  name: string
  cui: string
}

interface Props {
  initialData?: Partial<MedicalRecordFormData>
  employees: Employee[]
  organizations: Organization[]
  onSubmit: (data: MedicalRecordFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitLabel?: string
  /** Pre-selected employee ID (read-only when set) */
  lockedEmployeeId?: string
}

// ============================================================
// COMPONENT
// ============================================================

export function MedicalRecordForm({
  initialData,
  employees,
  organizations,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Salvează',
  lockedEmployeeId,
}: Props) {
  const [form, setForm] = useState<MedicalRecordFormData>({
    ...EMPTY_RECORD_FORM,
    ...initialData,
    ...(lockedEmployeeId ? { employee_id: lockedEmployeeId } : {}),
  })

  function set(field: keyof MedicalRecordFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleEmployeeChange(employeeId: string) {
    const emp = employees.find((e) => e.id === employeeId)
    setForm((prev) => ({
      ...prev,
      employee_id: employeeId,
      employee_name: emp ? emp.full_name : prev.employee_name,
      job_title: emp?.job_title ?? prev.job_title,
      organization_id: emp?.organization_id ?? prev.organization_id,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:bg-gray-50 disabled:text-gray-500'

  const filteredEmployees = form.organization_id
    ? employees.filter((e) => e.organization_id === form.organization_id)
    : employees

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Organizație */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Organizație *</label>
        <select
          value={form.organization_id}
          onChange={(e) => set('organization_id', e.target.value)}
          className={inputCls}
          required
          disabled={!!lockedEmployeeId}
        >
          <option value="">Selectează organizația</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.cui})
            </option>
          ))}
        </select>
      </div>

      {/* Angajat */}
      {!lockedEmployeeId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Angajat</label>
          <select
            value={form.employee_id}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            className={inputCls}
          >
            <option value="">Selectează sau completează manual ↓</option>
            {filteredEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name}{e.job_title ? ` — ${e.job_title}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Nume + Funcție */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nume angajat *</label>
          <input
            type="text"
            value={form.employee_name}
            onChange={(e) => set('employee_name', e.target.value)}
            className={inputCls}
            placeholder="Popescu Ion"
            required
            readOnly={!!lockedEmployeeId}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Funcție</label>
          <input
            type="text"
            value={form.job_title}
            onChange={(e) => set('job_title', e.target.value)}
            className={inputCls}
            placeholder="Operator CNC"
          />
        </div>
      </div>

      {/* Tip + Rezultat */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tip examinare *</label>
          <select
            value={form.examination_type}
            onChange={(e) => set('examination_type', e.target.value)}
            className={inputCls}
            required
          >
            {Object.entries(EXAM_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rezultat *</label>
          <select
            value={form.result}
            onChange={(e) => set('result', e.target.value)}
            className={inputCls}
            required
          >
            {Object.entries(RESULT_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date examinare + expirare */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data examinare *</label>
          <input
            type="date"
            value={form.examination_date}
            onChange={(e) => set('examination_date', e.target.value)}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data expirare *</label>
          <input
            type="date"
            value={form.expiry_date}
            onChange={(e) => set('expiry_date', e.target.value)}
            className={inputCls}
            required
          />
        </div>
      </div>

      {/* Doctor + Clinică */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
          <input
            type="text"
            value={form.doctor_name}
            onChange={(e) => set('doctor_name', e.target.value)}
            className={inputCls}
            placeholder="Dr. Ionescu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Clinică</label>
          <input
            type="text"
            value={form.clinic_name}
            onChange={(e) => set('clinic_name', e.target.value)}
            className={inputCls}
            placeholder="Policlinica Sănătatea"
          />
        </div>
      </div>

      {/* Restricții */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Restricții medicale
          <span className="text-xs text-gray-400 ml-1">(separate prin virgulă)</span>
        </label>
        <input
          type="text"
          value={form.restrictions}
          onChange={(e) => set('restrictions', e.target.value)}
          className={inputCls}
          placeholder="Ex: fără efort fizic intens, fără lucru la înălțime"
        />
      </div>

      {/* Detalii suplimentare */}
      <div className="border-t border-gray-200 pt-3 space-y-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Detalii suplimentare (HG 355/2007)
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Factori de risc
            <span className="text-xs text-gray-400 ml-1">(separate prin virgulă)</span>
          </label>
          <input
            type="text"
            value={form.risk_factors}
            onChange={(e) => set('risk_factors', e.target.value)}
            className={inputCls}
            placeholder="Ex: zgomot, chimice, efort fizic"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nr. document</label>
            <input
              type="text"
              value={form.document_number}
              onChange={(e) => set('document_number', e.target.value)}
              className={inputCls}
              placeholder="FA-2024-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Validitate (luni)</label>
            <input
              type="number"
              value={form.validity_months}
              onChange={(e) => set('validity_months', parseInt(e.target.value) || 12)}
              className={inputCls}
              min={1}
              max={60}
              placeholder="12"
            />
          </div>
        </div>
      </div>

      {/* Observații */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
          placeholder="Note suplimentare..."
        />
      </div>

      {/* Butoane */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Anulează
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 disabled:opacity-50 transition"
        >
          {loading ? 'Se salvează...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
