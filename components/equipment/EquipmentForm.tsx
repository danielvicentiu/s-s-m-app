// components/equipment/EquipmentForm.tsx
// Formular înregistrare echipament — pattern consistent cu dashboard
// Utilizare: Modal sau standalone page pentru adăugare echipament nou

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser as createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'

// Tipuri echipamente fallback (conform SafetyEquipment interface)
const FALLBACK_EQUIPMENT_TYPES = [
  { value: 'stingator', label: 'Stingător' },
  { value: 'trusa_prim_ajutor', label: 'Trusă prim ajutor' },
  { value: 'hidrant', label: 'Hidrant' },
  { value: 'detector_fum', label: 'Detector fum' },
  { value: 'detector_gaz', label: 'Detector gaz' },
  { value: 'iluminat_urgenta', label: 'Iluminat urgență' },
  { value: 'panou_semnalizare', label: 'Panou semnalizare' },
  { value: 'trusa_scule', label: 'Trusă scule' },
  { value: 'eip', label: 'EIP (echipament individual protecție)' },
  { value: 'altul', label: 'Altul' },
]

interface Employee {
  id: string
  full_name: string
  job_title: string | null
}

interface Props {
  organizationId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function EquipmentForm({ organizationId, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [uploadingFile, setUploadingFile] = useState(false)
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [certificateUrl, setCertificateUrl] = useState<string>('')

  const [form, setForm] = useState({
    equipment_type: FALLBACK_EQUIPMENT_TYPES[0].value,
    description: '',
    serial_number: '',
    manufacturer: '',
    purchase_date: '',
    location: '',
    responsible_employee_id: '',
    last_inspection_date: '',
    inspection_frequency_months: 12,
    conformity_certificate_url: '',
    notes: '',
  })

  // Încarcă lista angajaților activi din organizație
  useEffect(() => {
    async function loadEmployees() {
      const supabase = createClient()
      const { data } = await supabase
        .from('employees')
        .select('id, full_name, job_title')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('full_name')

      if (data) setEmployees(data)
    }
    loadEmployees()
  }, [organizationId])

  // Handle file upload pentru certificat de conformitate
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validare tip fișier
    if (file.type !== 'application/pdf') {
      alert('Doar fișiere PDF sunt permise pentru certificatul de conformitate.')
      return
    }

    // Validare dimensiune (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Fișierul este prea mare. Dimensiunea maximă este 5MB.')
      return
    }

    setCertificateFile(file)
    setUploadingFile(true)

    try {
      const supabase = createClient()
      const fileExt = 'pdf'
      const fileName = `${organizationId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload la Supabase Storage
      const { data, error } = await supabase.storage
        .from('fisa-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Obține URL public (signed URL pentru bucket privat)
      const { data: urlData } = await supabase.storage
        .from('fisa-documents')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365) // 1 an

      if (urlData) {
        setCertificateUrl(urlData.signedUrl)
        setForm({ ...form, conformity_certificate_url: fileName })
      }
    } catch (error: any) {
      console.error('Eroare upload:', error)
      alert('Eroare la încărcarea certificatului: ' + error.message)
      setCertificateFile(null)
    } finally {
      setUploadingFile(false)
    }
  }

  // Șterge certificatul uplodat
  function removeFile() {
    setCertificateFile(null)
    setCertificateUrl('')
    setForm({ ...form, conformity_certificate_url: '' })
  }

  // Salvează echipamentul în DB
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Calculează data următoarei inspecții (dacă există ultima inspecție și frecvență)
      let nextInspectionDate = null
      if (form.last_inspection_date && form.inspection_frequency_months) {
        const lastDate = new Date(form.last_inspection_date)
        lastDate.setMonth(lastDate.getMonth() + form.inspection_frequency_months)
        nextInspectionDate = lastDate.toISOString().split('T')[0]
      }

      // Calculează data de expirare (1 an de la ultima inspecție, sau 1 an de la achiziție)
      const referenceDate = form.last_inspection_date || form.purchase_date
      const expiryDate = new Date(referenceDate || Date.now())
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)

      const payload = {
        organization_id: organizationId,
        equipment_type: form.equipment_type,
        description: form.description || null,
        location: form.location || null,
        serial_number: form.serial_number || null,
        last_inspection_date: form.last_inspection_date || null,
        expiry_date: expiryDate.toISOString().split('T')[0],
        next_inspection_date: nextInspectionDate,
        inspector_name: null, // Poate fi extins în viitor
        is_compliant: true, // Default compliant la înregistrare
        notes: form.notes || null,
        content_version: 1,
        legal_basis_version: 'v1.0',
      }

      const { error } = await supabase
        .from('safety_equipment')
        .insert(payload)

      if (error) throw error

      alert('Echipament înregistrat cu succes!')
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Eroare salvare echipament:', error)
      alert('Eroare la salvarea echipamentului: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tip echipament */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tip echipament <span className="text-red-500">*</span>
        </label>
        <select
          required
          value={form.equipment_type}
          onChange={e => setForm({ ...form, equipment_type: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {FALLBACK_EQUIPMENT_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Denumire / Descriere */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Denumire / Descriere <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="ex: Stingător pulbere P6, Detector fum Honeywell 5800, etc."
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Număr serie / inventar */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Număr serie / inventar
          </label>
          <input
            type="text"
            placeholder="ex: SN-2024-00123"
            value={form.serial_number}
            onChange={e => setForm({ ...form, serial_number: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Producător
          </label>
          <input
            type="text"
            placeholder="ex: Honeywell, Kidde, etc."
            value={form.manufacturer}
            onChange={e => setForm({ ...form, manufacturer: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Data achiziție */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data achiziție
        </label>
        <input
          type="date"
          value={form.purchase_date}
          onChange={e => setForm({ ...form, purchase_date: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Locație */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Locație fizică <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="ex: Etaj 2, lângă lift / Depozit A / Birou director"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Responsabil (select angajat) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Responsabil (angajat)
        </label>
        {employees.length === 0 ? (
          <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50">
            Nu există angajați activi în organizație
          </div>
        ) : (
          <select
            value={form.responsible_employee_id}
            onChange={e => setForm({ ...form, responsible_employee_id: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">— Nealocate —</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} {emp.job_title ? `(${emp.job_title})` : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Data ultima verificare + frecvență */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data ultima verificare <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="date"
            value={form.last_inspection_date}
            onChange={e => setForm({ ...form, last_inspection_date: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frecvență verificare (luni)
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={form.inspection_frequency_months}
            onChange={e => setForm({ ...form, inspection_frequency_months: parseInt(e.target.value) || 12 })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Următoarea verificare: {form.last_inspection_date ? (() => {
              const nextDate = new Date(form.last_inspection_date)
              nextDate.setMonth(nextDate.getMonth() + form.inspection_frequency_months)
              return nextDate.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
            })() : '—'}
          </p>
        </div>
      </div>

      {/* Upload certificat de conformitate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Certificat de conformitate (PDF)
        </label>

        {!certificateFile ? (
          <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">
                {uploadingFile ? 'Se încarcă...' : 'Încarcă certificat (max 5MB, PDF)'}
              </span>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={uploadingFile}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between w-full border border-green-200 bg-green-50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                <Upload className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">{certificateFile.name}</p>
                <p className="text-xs text-green-600">
                  {(certificateFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 rounded hover:bg-green-100 text-green-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Observații */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observații
        </label>
        <textarea
          rows={3}
          placeholder="Orice informații suplimentare relevante..."
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Butoane acțiuni */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Anulează
          </button>
        )}
        <button
          type="submit"
          disabled={loading || uploadingFile}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Se salvează...' : 'Înregistrează echipament'}
        </button>
      </div>
    </form>
  )
}
