// components/forms/IncidentReportForm.tsx
// Formular raportare incident/accident de muncă
// Include: tip incident, dată, oră, locație, angajat afectat, descriere, martori, severitate, cauză imediată, măsuri imediate, fotografii

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Upload, AlertTriangle, Calendar, Clock, MapPin, Users, Camera, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

// ========== TYPES ==========

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  organization_id: string
}

interface Location {
  id: string
  name: string
  address: string | null
  organization_id: string
}

interface Organization {
  id: string
  name: string
}

interface Props {
  employees: Employee[]
  locations: Location[]
  organizations: Organization[]
  onSuccess?: () => void
  onCancel?: () => void
  editingId?: string | null
  initialData?: any
}

// ========== CONSTANTS ==========

const INCIDENT_TYPES = [
  { value: 'accident_fatal', label: 'Accident mortal', severity: 'critical', requiresITM: true },
  { value: 'accident_serious', label: 'Accident grav (spitalizare)', severity: 'high', requiresITM: true },
  { value: 'accident_minor', label: 'Accident ușor (prim ajutor)', severity: 'medium', requiresITM: false },
  { value: 'near_miss', label: 'Aproape-accident (near-miss)', severity: 'low', requiresITM: false },
  { value: 'property_damage', label: 'Deteriorare echipament/proprietate', severity: 'low', requiresITM: false },
  { value: 'environmental', label: 'Incident de mediu', severity: 'medium', requiresITM: false },
  { value: 'security', label: 'Incident de securitate', severity: 'medium', requiresITM: false },
]

const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critic', color: 'red', description: 'Pericol de viață, daune majore' },
  { value: 'high', label: 'Ridicat', color: 'orange', description: 'Vătămare gravă, spitalizare' },
  { value: 'medium', label: 'Mediu', color: 'yellow', description: 'Vătămare ușoară, prim ajutor' },
  { value: 'low', label: 'Scăzut', color: 'blue', description: 'Fără vătămare, near-miss' },
]

// ========== COMPONENT ==========

export default function IncidentReportForm({
  employees,
  locations,
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
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  const [formData, setFormData] = useState({
    organization_id: '',
    incident_type: 'accident_minor',
    incident_date: '',
    incident_time: '',
    location_id: '',
    location_description: '',
    affected_employee_id: '',
    affected_employee_name: '',
    description: '',
    immediate_cause: '',
    immediate_actions_taken: '',
    severity: 'medium',
    witness_employee_ids: [] as string[],
    witness_names: [] as string[],
    requires_itm_notification: false,
    itm_notification_method: '',
    photo_files: [] as File[],
    photo_urls: [] as string[],
  })

  const [selectedWitnesses, setSelectedWitnesses] = useState<string[]>([])

  // ========== EFFECTS ==========

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        organization_id: initialData.organization_id || '',
        incident_type: initialData.incident_type || 'accident_minor',
        incident_date: initialData.incident_date || '',
        incident_time: initialData.incident_time || '',
        location_id: initialData.location_id || '',
        location_description: initialData.location_description || '',
        affected_employee_id: initialData.affected_employee_id || '',
        affected_employee_name: initialData.affected_employee_name || '',
        description: initialData.description || '',
        immediate_cause: initialData.immediate_cause || '',
        immediate_actions_taken: initialData.immediate_actions_taken || '',
        severity: initialData.severity || 'medium',
        witness_employee_ids: initialData.witness_employee_ids || [],
        witness_names: initialData.witness_names || [],
        requires_itm_notification: initialData.requires_itm_notification || false,
        itm_notification_method: initialData.itm_notification_method || '',
        photo_files: [],
        photo_urls: initialData.photo_urls || [],
      })
      setSelectedWitnesses(initialData.witness_employee_ids || [])
    }
  }, [initialData])

  // Auto-update severity and ITM requirement based on incident type
  useEffect(() => {
    const selectedType = INCIDENT_TYPES.find(t => t.value === formData.incident_type)
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        severity: selectedType.severity,
        requires_itm_notification: selectedType.requiresITM,
      }))
    }
  }, [formData.incident_type])

  // Auto-fill employee name when employee is selected
  useEffect(() => {
    if (formData.affected_employee_id) {
      const employee = employees.find(e => e.id === formData.affected_employee_id)
      if (employee) {
        setFormData(prev => ({
          ...prev,
          affected_employee_name: employee.full_name,
        }))
      }
    }
  }, [formData.affected_employee_id, employees])

  // Auto-fill location description when location is selected
  useEffect(() => {
    if (formData.location_id) {
      const location = locations.find(l => l.id === formData.location_id)
      if (location) {
        setFormData(prev => ({
          ...prev,
          location_description: `${location.name}${location.address ? ', ' + location.address : ''}`,
        }))
      }
    }
  }, [formData.location_id, locations])

  // ========== HANDLERS ==========

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)
    const maxSize = 5 * 1024 * 1024 // 5MB per file
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(t('incident.errorFileSize', { name: file.name }))
        return false
      }
      if (!file.type.startsWith('image/')) {
        setError(t('incident.errorFileType', { name: file.name }))
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setFormData(prev => ({
      ...prev,
      photo_files: [...prev.photo_files, ...validFiles],
    }))
  }

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photo_files: prev.photo_files.filter((_, i) => i !== index),
    }))
  }

  const handleWitnessToggle = (employeeId: string) => {
    setSelectedWitnesses(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId)
      } else {
        return [...prev, employeeId]
      }
    })
  }

  const uploadPhotos = async (incidentId: string): Promise<string[]> => {
    if (formData.photo_files.length === 0) return []

    setUploadingPhotos(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of formData.photo_files) {
        const fileName = `${incidentId}/${Date.now()}_${file.name}`
        const { data, error } = await supabase.storage
          .from('incident-photos')
          .upload(fileName, file)

        if (error) {
          console.error('Error uploading photo:', error)
          continue
        }

        const { data: urlData } = supabase.storage
          .from('incident-photos')
          .getPublicUrl(fileName)

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl)
        }
      }
    } catch (err) {
      console.error('Photo upload error:', err)
    } finally {
      setUploadingPhotos(false)
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!formData.organization_id) {
      setError(t('incident.errorSelectOrg'))
      return
    }
    if (!formData.incident_date) {
      setError(t('incident.errorEnterDate'))
      return
    }
    if (!formData.incident_time) {
      setError(t('incident.errorEnterTime'))
      return
    }
    if (!formData.description || formData.description.trim().length < 20) {
      setError(t('incident.errorDescriptionMin'))
      return
    }

    setLoading(true)

    try {
      // Prepare witness data
      const witnessNames = selectedWitnesses.map(id => {
        const emp = employees.find(e => e.id === id)
        return emp?.full_name || ''
      }).filter(name => name !== '')

      // Prepare data for insert/update
      const incidentData = {
        organization_id: formData.organization_id,
        incident_type: formData.incident_type,
        incident_date: formData.incident_date,
        incident_time: formData.incident_time,
        location_id: formData.location_id || null,
        location_description: formData.location_description || null,
        affected_employee_id: formData.affected_employee_id || null,
        affected_employee_name: formData.affected_employee_name || null,
        description: formData.description,
        immediate_cause: formData.immediate_cause || null,
        immediate_actions_taken: formData.immediate_actions_taken || null,
        severity: formData.severity,
        witness_employee_ids: selectedWitnesses.length > 0 ? selectedWitnesses : null,
        witness_names: witnessNames.length > 0 ? witnessNames : null,
        requires_itm_notification: formData.requires_itm_notification,
        itm_notification_method: formData.itm_notification_method || null,
        status: 'reported',
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        // Update existing incident
        const { error: updateError } = await supabase
          .from('incidents')
          .update(incidentData)
          .eq('id', editingId)

        if (updateError) throw updateError

        // Upload new photos if any
        if (formData.photo_files.length > 0) {
          const newPhotoUrls = await uploadPhotos(editingId)
          const allPhotoUrls = [...formData.photo_urls, ...newPhotoUrls]

          await supabase
            .from('incidents')
            .update({ photo_urls: allPhotoUrls })
            .eq('id', editingId)
        }
      } else {
        // Insert new incident
        const { data: incident, error: insertError } = await supabase
          .from('incidents')
          .insert([incidentData])
          .select()
          .single()

        if (insertError) throw insertError

        // Upload photos
        if (formData.photo_files.length > 0 && incident) {
          const photoUrls = await uploadPhotos(incident.id)
          if (photoUrls.length > 0) {
            await supabase
              .from('incidents')
              .update({ photo_urls: photoUrls })
              .eq('id', incident.id)
          }
        }
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    } catch (err: any) {
      console.error('Error saving incident:', err)
      setError(err.message || t('incident.errorSave'))
    } finally {
      setLoading(false)
    }
  }

  // ========== RENDER ==========

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-50 border-red-200 text-red-700',
      high: 'bg-orange-50 border-orange-200 text-orange-700',
      medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      low: 'bg-blue-50 border-blue-200 text-blue-700',
    }
    return colors[severity] || colors.medium
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-red-50 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? t('incident.editTitle') : t('incident.reportTitle')}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('incident.subtitle')}
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{t('incident.successReported')}</span>
        </div>
      )}

      {/* Organization Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('incident.labelOrg')} *
        </label>
        <select
          required
          value={formData.organization_id}
          onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">{t('incident.selectOrg')}</option>
          {organizations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>

      {/* Incident Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('incident.labelType')} *
        </label>
        <select
          required
          value={formData.incident_type}
          onChange={(e) => setFormData({ ...formData, incident_type: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          {INCIDENT_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
              {type.requiresITM && ' (necesită notificare ITM)'}
            </option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            {t('incident.labelDate')} *
          </label>
          <input
            type="date"
            required
            value={formData.incident_date}
            onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            {t('incident.labelTime')} *
          </label>
          <input
            type="time"
            required
            value={formData.incident_time}
            onChange={(e) => setFormData({ ...formData, incident_time: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          {t('incident.labelLocation')}
        </label>
        <select
          value={formData.location_id}
          onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
          disabled={loading}
        >
          <option value="">{t('incident.selectLocation')}</option>
          {locations
            .filter(l => l.organization_id === formData.organization_id)
            .map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} {loc.address && `- ${loc.address}`}
              </option>
            ))}
        </select>
        <input
          type="text"
          placeholder={t('incident.locationDescPlaceholder')}
          value={formData.location_description}
          onChange={(e) => setFormData({ ...formData, location_description: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      {/* Affected Employee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('incident.labelAffectedEmployee')}
        </label>
        <select
          value={formData.affected_employee_id}
          onChange={(e) => setFormData({ ...formData, affected_employee_id: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">{t('incident.selectAffectedEmployee')}</option>
          {employees
            .filter(e => e.organization_id === formData.organization_id)
            .map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} {emp.job_title && `- ${emp.job_title}`}
              </option>
            ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          {t('incident.labelDescription')} *
        </label>
        <textarea
          required
          rows={5}
          placeholder={t('incident.descriptionPlaceholder')}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          disabled={loading}
          minLength={20}
        />
        <p className="text-xs text-gray-500 mt-1">
          {t('incident.descriptionMinChars', { count: formData.description.length })}
        </p>
      </div>

      {/* Immediate Cause */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('incident.labelImmediateCause')}
        </label>
        <textarea
          rows={3}
          placeholder={t('incident.immediateCausePlaceholder')}
          value={formData.immediate_cause}
          onChange={(e) => setFormData({ ...formData, immediate_cause: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          disabled={loading}
        />
      </div>

      {/* Immediate Actions Taken */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('incident.labelImmediateActions')}
        </label>
        <textarea
          rows={3}
          placeholder={t('incident.immediateActionsPlaceholder')}
          value={formData.immediate_actions_taken}
          onChange={(e) => setFormData({ ...formData, immediate_actions_taken: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          disabled={loading}
        />
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('incident.labelSeverity')} *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SEVERITY_LEVELS.map(level => (
            <label
              key={level.value}
              className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.severity === level.value
                  ? getSeverityColor(level.value) + ' border-current'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="severity"
                value={level.value}
                checked={formData.severity === level.value}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="sr-only"
                disabled={loading}
              />
              <div className="flex-1">
                <div className="font-medium">{level.label}</div>
                <div className="text-xs mt-1 opacity-80">{level.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Witnesses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="w-4 h-4 inline mr-1" />
          {t('incident.labelWitnesses')}
        </label>
        <div className="border border-gray-300 rounded-xl p-4 max-h-48 overflow-y-auto">
          {employees
            .filter(e => e.organization_id === formData.organization_id)
            .filter(e => e.id !== formData.affected_employee_id)
            .map(emp => (
              <label
                key={emp.id}
                className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedWitnesses.includes(emp.id)}
                  onChange={() => handleWitnessToggle(emp.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm">
                  {emp.full_name} {emp.job_title && `- ${emp.job_title}`}
                </span>
              </label>
            ))}
          {employees.filter(e => e.organization_id === formData.organization_id).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              {t('incident.noEmployeesAvailable')}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t('incident.witnessesSelected', { count: selectedWitnesses.length })}
        </p>
      </div>

      {/* Photos Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="w-4 h-4 inline mr-1" />
          {t('incident.labelPhotos')}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
            disabled={loading || uploadingPhotos}
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{t('incident.addPhotos')}</span>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            {t('incident.photoInfo')}
          </p>
        </div>

        {/* Photo Preview */}
        {formData.photo_files.length > 0 && (
          <div className="mt-3 grid grid-cols-3 md:grid-cols-4 gap-3">
            {formData.photo_files.map((file, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={loading}
                >
                  ×
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ITM Notification */}
      {formData.requires_itm_notification && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-900 mb-2">
                {t('incident.itmRequired')}
              </h3>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={formData.requires_itm_notification}
                  onChange={(e) => setFormData({ ...formData, requires_itm_notification: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  disabled={loading}
                />
                <span className="text-sm text-orange-800">
                  {t('incident.itmConfirm')}
                </span>
              </label>
              <input
                type="text"
                placeholder={t('incident.itmMethodPlaceholder')}
                value={formData.itm_notification_method}
                onChange={(e) => setFormData({ ...formData, itm_notification_method: e.target.value })}
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            {t('incident.cancel')}
          </button>
        )}
        <button
          type="submit"
          disabled={loading || uploadingPhotos}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {uploadingPhotos ? t('incident.uploadingPhotos') : loading ? t('incident.saving') : editingId ? t('incident.updateIncident') : t('incident.reportIncident')}
        </button>
      </div>
    </form>
  )
}
