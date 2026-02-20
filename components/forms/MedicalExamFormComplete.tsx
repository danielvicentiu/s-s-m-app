// components/forms/MedicalExamFormComplete.tsx
// Formular complet pentru examen medical medicina muncii
// Include: selectare angajat, tip examen, data, medic, clinica, rezultat, restrictii, upload fisa aptitudine
// Auto-calculare data următor examen based on periodicitate

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Upload, Calendar, Stethoscope, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

// ========== TYPES ==========

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
  employees: Employee[]
  organizations: Organization[]
  onSuccess?: () => void
  onCancel?: () => void
  editingId?: string | null
  initialData?: any
}

// ========== CONSTANTS ==========

const EXAM_TYPES = [
  { value: 'angajare', label: 'Angajare (initial)', frequency: 12 },
  { value: 'periodic', label: 'Periodic', frequency: 12 },
  { value: 'reluare', label: 'Reluare activitate', frequency: 12 },
  { value: 'special', label: 'Special (expunere risc)', frequency: 6 },
  { value: 'la_cerere', label: 'La cerere', frequency: 12 },
  { value: 'supraveghere', label: 'Supraveghere specială', frequency: 6 },
]

const EXAM_RESULTS = [
  { value: 'apt', label: 'Apt', color: 'green' },
  { value: 'apt_conditionat', label: 'Apt condiționat', color: 'yellow' },
  { value: 'inapt_temporar', label: 'Inapt temporar', color: 'orange' },
  { value: 'inapt', label: 'Inapt', color: 'red' },
  { value: 'amanat', label: 'Amânat', color: 'gray' },
]

// ========== COMPONENT ==========

export default function MedicalExamFormComplete({
  employees,
  organizations,
  onSuccess,
  onCancel,
  editingId,
  initialData,
}: Props) {
  const t = useTranslations('forms')
  const supabase = createSupabaseBrowser()

  // ========== STATE ==========

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)

  const [formData, setFormData] = useState({
    employee_id: '',
    organization_id: '',
    examination_type: 'periodic',
    examination_date: '',
    doctor_name: '',
    clinic_name: '',
    result: 'apt',
    restrictions: '',
    expiry_date: '',
    file: null as File | null,
    file_url: '',
  })

  // ========== EFFECTS ==========

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id || '',
        organization_id: initialData.organization_id || '',
        examination_type: initialData.examination_type || 'periodic',
        examination_date: initialData.examination_date || '',
        doctor_name: initialData.doctor_name || '',
        clinic_name: initialData.clinic_name || '',
        result: initialData.result || 'apt',
        restrictions: initialData.restrictions || '',
        expiry_date: initialData.expiry_date || '',
        file: null,
        file_url: initialData.file_url || '',
      })
    }
  }, [initialData])

  // Auto-calculate expiry date when examination date or type changes
  useEffect(() => {
    if (formData.examination_date && formData.examination_type) {
      const examType = EXAM_TYPES.find((t) => t.value === formData.examination_type)
      if (examType) {
        const examDate = new Date(formData.examination_date)
        const expiryDate = new Date(examDate)
        expiryDate.setMonth(expiryDate.getMonth() + examType.frequency)

        // Format as YYYY-MM-DD for input[type="date"]
        const expiryISO = expiryDate.toISOString().split('T')[0]
        setFormData((prev) => ({ ...prev, expiry_date: expiryISO }))
      }
    }
  }, [formData.examination_date, formData.examination_type])

  // Auto-select organization when employee is selected
  useEffect(() => {
    if (formData.employee_id) {
      const employee = employees.find((e) => e.id === formData.employee_id)
      if (employee) {
        setFormData((prev) => ({ ...prev, organization_id: employee.organization_id }))
      }
    }
  }, [formData.employee_id, employees])

  // ========== HANDLERS ==========

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        setError(t('medicalExam.errorPdfOnly'))
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(t('medicalExam.errorFileSize'))
        return
      }
      setFormData((prev) => ({ ...prev, file }))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validation
      if (!formData.employee_id) {
        throw new Error(t('medicalExam.errorSelectEmployee'))
      }
      if (!formData.examination_date) {
        throw new Error(t('medicalExam.errorEnterDate'))
      }
      if (!formData.doctor_name) {
        throw new Error(t('medicalExam.errorEnterDoctor'))
      }
      if (!formData.clinic_name) {
        throw new Error(t('medicalExam.errorEnterClinic'))
      }

      // Upload file if present
      let fileUrl = formData.file_url
      if (formData.file) {
        setUploadingFile(true)
        const fileName = `${formData.organization_id}/${formData.employee_id}/fisa-aptitudine-${Date.now()}.pdf`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('medical-documents')
          .upload(fileName, formData.file, {
            contentType: 'application/pdf',
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`${t('medicalExam.errorUpload')}: ${uploadError.message}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('medical-documents')
          .getPublicUrl(fileName)

        fileUrl = urlData.publicUrl
        setUploadingFile(false)
      }

      // Get employee details
      const employee = employees.find((e) => e.id === formData.employee_id)
      if (!employee) {
        throw new Error(t('medicalExam.errorInvalidEmployee'))
      }

      // Prepare payload
      const payload = {
        organization_id: formData.organization_id,
        employee_id: formData.employee_id,
        employee_name: employee.full_name,
        job_title: employee.job_title,
        examination_type: formData.examination_type,
        examination_date: formData.examination_date,
        expiry_date: formData.expiry_date,
        result: formData.result,
        restrictions: formData.restrictions || null,
        doctor_name: formData.doctor_name,
        clinic_name: formData.clinic_name,
        file_url: fileUrl || null,
        content_version: 1,
        legal_basis_version: 'HG1425/2006',
        updated_at: new Date().toISOString(),
      }

      // Insert or update
      if (editingId) {
        const { error: updateError } = await supabase
          .from('medical_examinations')
          .update(payload)
          .eq('id', editingId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('medical_examinations')
          .insert([payload])

        if (insertError) throw insertError
      }

      setSuccess(true)

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          employee_id: '',
          organization_id: '',
          examination_type: 'periodic',
          examination_date: '',
          doctor_name: '',
          clinic_name: '',
          result: 'apt',
          restrictions: '',
          expiry_date: '',
          file: null,
          file_url: '',
        })
        setSuccess(false)
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (err: any) {
      console.error('[MEDICAL FORM] Error:', err)
      setError(err.message || t('medicalExam.errorSave'))
    } finally {
      setLoading(false)
      setUploadingFile(false)
    }
  }

  // ========== FILTERED EMPLOYEES ==========

  const filteredEmployees = formData.organization_id
    ? employees.filter((e) => e.organization_id === formData.organization_id)
    : employees

  // ========== RENDER ==========

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-900">{t('medicalExam.successTitle')}</h4>
            <p className="text-sm text-green-700 mt-1">
              {editingId ? t('medicalExam.successUpdated') : t('medicalExam.successAdded')}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-900">{t('medicalExam.errorTitle')}</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Organizație */}
      <div>
        <label htmlFor="organization_id" className="block text-sm font-medium text-gray-700 mb-2">
          {t('medicalExam.labelOrg')} *
        </label>
        <select
          id="organization_id"
          name="organization_id"
          value={formData.organization_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('medicalExam.selectOrg')}</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name} {org.cui ? `(${org.cui})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Angajat */}
      <div>
        <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-2">
          {t('medicalExam.labelEmployee')} *
        </label>
        <select
          id="employee_id"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          required
          disabled={!formData.organization_id}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {formData.organization_id
              ? t('medicalExam.selectEmployee')
              : t('medicalExam.selectOrgFirst')}
          </option>
          {filteredEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} {emp.job_title ? `— ${emp.job_title}` : ''}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {t('medicalExam.employeesAvailable', { count: filteredEmployees.length })}
        </p>
      </div>

      {/* Tip examen + Data examinare */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="examination_type" className="block text-sm font-medium text-gray-700 mb-2">
            {t('medicalExam.labelExamType')} *
          </label>
          <select
            id="examination_type"
            name="examination_type"
            value={formData.examination_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {EXAM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="examination_date" className="block text-sm font-medium text-gray-700 mb-2">
            {t('medicalExam.labelExamDate')} *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              id="examination_date"
              name="examination_date"
              value={formData.examination_date}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Medic + Clinica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="doctor_name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('medicalExam.labelDoctor')} *
          </label>
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              id="doctor_name"
              name="doctor_name"
              value={formData.doctor_name}
              onChange={handleChange}
              required
              placeholder="Dr. Popescu Ion"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="clinic_name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('medicalExam.labelClinic')} *
          </label>
          <input
            type="text"
            id="clinic_name"
            name="clinic_name"
            value={formData.clinic_name}
            onChange={handleChange}
            required
            placeholder="Cabinet Medical XYZ"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rezultat */}
      <div>
        <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-2">
          {t('medicalExam.labelResult')} *
        </label>
        <select
          id="result"
          name="result"
          value={formData.result}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {EXAM_RESULTS.map((res) => (
            <option key={res.value} value={res.value}>
              {res.label}
            </option>
          ))}
        </select>
      </div>

      {/* Restricții (conditional on result) */}
      {(formData.result === 'apt_conditionat' || formData.result === 'inapt_temporar' || formData.result === 'amanat') && (
        <div>
          <label htmlFor="restrictions" className="block text-sm font-medium text-gray-700 mb-2">
            {t('medicalExam.labelRestrictions')}
            {formData.result === 'amanat' && ` / ${t('medicalExam.postponeReason')}`}
          </label>
          <textarea
            id="restrictions"
            name="restrictions"
            value={formData.restrictions}
            onChange={handleChange}
            rows={3}
            placeholder={
              formData.result === 'amanat'
                ? t('medicalExam.postponePlaceholder')
                : t('medicalExam.restrictionsPlaceholder')
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      )}

      {/* Data urmatorul examen (auto-calculated) */}
      <div>
        <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-2">
          {t('medicalExam.labelNextExam')}
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="date"
            id="expiry_date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t('medicalExam.nextExamNote')}
        </p>
      </div>

      {/* Upload fișă aptitudine */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
          {t('medicalExam.labelFile')}
        </label>
        <div className="relative">
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="sr-only"
          />
          <label
            htmlFor="file"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors"
          >
            <Upload className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formData.file
                ? formData.file.name
                : formData.file_url
                ? t('medicalExam.changeFile')
                : t('medicalExam.chooseFile')}
            </span>
          </label>
          {formData.file && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {t('medicalExam.fileSelected')}: {formData.file.name} ({(formData.file.size / 1024).toFixed(0)} KB)
            </p>
          )}
          {formData.file_url && !formData.file && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('medicalExam.viewExistingFile')}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || uploadingFile}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('medicalExam.cancel')}
          </button>
        )}
        <button
          type="submit"
          disabled={loading || uploadingFile}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading || uploadingFile ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {uploadingFile ? t('medicalExam.uploading') : t('medicalExam.saving')}
            </>
          ) : (
            <>
              <Stethoscope className="h-4 w-4" />
              {editingId ? t('medicalExam.update') : t('medicalExam.save')}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
