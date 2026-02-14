// app/[locale]/dashboard/import/ImportClient.tsx
// Import Wizard Client Component
// 4 steps: Upload → Column Mapping → Preview → Confirm Import
// Pattern: identic cu EquipmentClient.tsx, MedicalClient.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Download, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'

interface Props {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui: string | null; country_code?: string }>
  locale: string
}

type ImportType = 'employees' | 'trainings' | 'medical' | 'equipment'

type ColumnMapping = {
  sourceColumn: string
  targetField: string
  required: boolean
}

type ValidationResult = {
  valid: boolean
  errors: string[]
  warnings: string[]
  data?: any
}

type ImportRow = {
  rowNumber: number
  data: any
  validation: ValidationResult
}

// Field definitions pentru fiecare tip import
const FIELD_DEFINITIONS: Record<ImportType, Array<{ field: string; label: string; required: boolean; type: string }>> = {
  employees: [
    { field: 'full_name', label: 'Nume complet', required: true, type: 'string' },
    { field: 'cnp', label: 'CNP', required: true, type: 'string' },
    { field: 'email', label: 'Email', required: false, type: 'email' },
    { field: 'phone', label: 'Telefon', required: false, type: 'string' },
    { field: 'job_title', label: 'Funcție', required: true, type: 'string' },
    { field: 'department', label: 'Departament', required: false, type: 'string' },
    { field: 'hire_date', label: 'Data angajare', required: false, type: 'date' },
    { field: 'cor_code', label: 'Cod COR', required: false, type: 'string' },
  ],
  trainings: [
    { field: 'employee_name', label: 'Nume angajat', required: true, type: 'string' },
    { field: 'training_type', label: 'Tip instruire', required: true, type: 'string' },
    { field: 'training_date', label: 'Data instruire', required: true, type: 'date' },
    { field: 'expiry_date', label: 'Data expirare', required: false, type: 'date' },
    { field: 'instructor_name', label: 'Instructor', required: false, type: 'string' },
    { field: 'notes', label: 'Observații', required: false, type: 'string' },
  ],
  medical: [
    { field: 'employee_name', label: 'Nume angajat', required: true, type: 'string' },
    { field: 'cnp_hash', label: 'CNP', required: false, type: 'string' },
    { field: 'job_title', label: 'Funcție', required: false, type: 'string' },
    { field: 'examination_type', label: 'Tip examen', required: true, type: 'select' },
    { field: 'examination_date', label: 'Data examen', required: true, type: 'date' },
    { field: 'expiry_date', label: 'Data expirare', required: true, type: 'date' },
    { field: 'result', label: 'Rezultat', required: true, type: 'select' },
    { field: 'doctor_name', label: 'Medic', required: false, type: 'string' },
    { field: 'clinic_name', label: 'Clinică', required: false, type: 'string' },
    { field: 'restrictions', label: 'Restricții', required: false, type: 'string' },
    { field: 'notes', label: 'Observații', required: false, type: 'string' },
  ],
  equipment: [
    { field: 'equipment_type', label: 'Tip echipament', required: true, type: 'string' },
    { field: 'description', label: 'Descriere', required: false, type: 'string' },
    { field: 'location', label: 'Locație', required: false, type: 'string' },
    { field: 'serial_number', label: 'Serie', required: false, type: 'string' },
    { field: 'last_inspection_date', label: 'Ultima verificare', required: false, type: 'date' },
    { field: 'expiry_date', label: 'Data expirare', required: true, type: 'date' },
    { field: 'next_inspection_date', label: 'Următoarea verificare', required: false, type: 'date' },
    { field: 'inspector_name', label: 'Inspector', required: false, type: 'string' },
    { field: 'notes', label: 'Observații', required: false, type: 'string' },
  ],
}

// Pattern-uri auto-detecție
const COLUMN_PATTERNS: Record<string, string[]> = {
  full_name: ['nume complet', 'full_name', 'nume', 'name', 'angajat', 'employee'],
  first_name: ['prenume', 'firstname', 'first_name', 'first name'],
  last_name: ['nume', 'lastname', 'last_name', 'last name'],
  email: ['email', 'e-mail', 'mail', 'adresa email'],
  phone: ['telefon', 'phone', 'tel', 'mobile', 'gsm'],
  cnp: ['cnp', 'pin', 'cod numeric'],
  cnp_hash: ['cnp', 'pin', 'cod numeric'],
  job_title: ['functie', 'funcție', 'job', 'job_title', 'position', 'pozitie'],
  department: ['departament', 'department', 'dept', 'sector'],
  hire_date: ['data angajare', 'hire_date', 'angajat la', 'start date'],
  cor_code: ['cor', 'cod cor', 'cor_code'],
  employee_name: ['nume angajat', 'employee_name', 'angajat', 'name'],
  training_type: ['tip instruire', 'training_type', 'tip', 'type'],
  training_date: ['data instruire', 'training_date', 'data', 'date'],
  expiry_date: ['data expirare', 'expiry_date', 'valabil pana', 'expiry', 'expirare'],
  instructor_name: ['instructor', 'formator', 'trainer'],
  examination_type: ['tip examen', 'examination_type', 'exam_type', 'tip'],
  examination_date: ['data examen', 'examination_date', 'exam_date', 'data'],
  result: ['rezultat', 'result', 'status', 'apt', 'apt/inapt'],
  doctor_name: ['medic', 'doctor', 'doctor_name'],
  clinic_name: ['clinica', 'clinic', 'clinic_name', 'spital'],
  restrictions: ['restrictii', 'restrictions', 'limitari'],
  equipment_type: ['tip echipament', 'equipment_type', 'tip', 'type'],
  description: ['descriere', 'description', 'detalii'],
  location: ['locatie', 'locație', 'location', 'amplasament'],
  serial_number: ['serie', 'serial_number', 'serial', 'numar serie'],
  last_inspection_date: ['ultima verificare', 'last_inspection', 'ultima revizie'],
  next_inspection_date: ['urmatoarea verificare', 'next_inspection', 'revizie'],
  inspector_name: ['inspector', 'verificator'],
  notes: ['observatii', 'observații', 'notes', 'mentiuni'],
}

// Mapping tabele Supabase
const TABLE_MAPPING: Record<ImportType, string> = {
  employees: 'employees',
  trainings: 'safety_trainings',
  medical: 'medical_examinations',
  equipment: 'safety_equipment',
}

export default function ImportClient({ user, organizations, locale }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [importType, setImportType] = useState<ImportType>('employees')
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0]?.id || '')
  const [file, setFile] = useState<File | null>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [importRows, setImportRows] = useState<ImportRow[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importComplete, setImportComplete] = useState(false)
  const [importStats, setImportStats] = useState({ success: 0, failed: 0 })

  // Auto-detect column mapping
  const autoDetectMapping = (sourceColumns: string[]): ColumnMapping[] => {
    const fields = FIELD_DEFINITIONS[importType]
    const mappings: ColumnMapping[] = []

    fields.forEach((field) => {
      const patterns = COLUMN_PATTERNS[field.field] || []
      let matched = false

      for (const col of sourceColumns) {
        const normalized = col.toLowerCase().trim()
        if (patterns.some((pattern) => normalized.includes(pattern.toLowerCase()))) {
          mappings.push({
            sourceColumn: col,
            targetField: field.field,
            required: field.required,
          })
          matched = true
          break
        }
      }

      if (!matched && field.required) {
        mappings.push({
          sourceColumn: '',
          targetField: field.field,
          required: field.required,
        })
      }
    })

    return mappings
  }

  // Validate row
  const validateRow = (rowData: any, rowNumber: number): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []
    const fields = FIELD_DEFINITIONS[importType]

    fields.forEach((field) => {
      const value = rowData[field.field]

      // Required fields
      if (field.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field.label} este obligatoriu`)
        return
      }

      if (!value || value.toString().trim() === '') return

      // Type validation
      switch (field.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${field.label} invalid: ${value}`)
          }
          break
        case 'date':
          const date = new Date(value)
          if (isNaN(date.getTime())) {
            errors.push(`${field.label} dată invalidă: ${value}`)
          }
          break
        case 'string':
          if (field.field === 'cnp' && value.toString().length !== 13) {
            warnings.push(`CNP ar trebui să aibă 13 cifre: ${value}`)
          }
          break
        case 'select':
          // Validare pentru examination_type
          if (field.field === 'examination_type') {
            const validTypes = ['periodic', 'angajare', 'reluare', 'la_cerere', 'supraveghere']
            if (!validTypes.includes(value.toLowerCase())) {
              warnings.push(`Tip examen necunoscut: ${value}. Va fi setat ca 'periodic'`)
            }
          }
          // Validare pentru result
          if (field.field === 'result') {
            const validResults = ['apt', 'apt_conditionat', 'inapt_temporar', 'inapt']
            if (!validResults.includes(value.toLowerCase())) {
              warnings.push(`Rezultat necunoscut: ${value}. Va fi setat ca 'apt'`)
            }
          }
          break
      }
    })

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      data: rowData,
    }
  }

  // Step 1: File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)

    try {
      const data = await uploadedFile.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      if (jsonData.length === 0) {
        alert('Fișierul este gol')
        return
      }

      setRawData(jsonData)
      const detectedColumns = Object.keys(jsonData[0] as any)
      setColumns(detectedColumns)

      // Auto-detect mapping
      const detected = autoDetectMapping(detectedColumns)
      setMappings(detected)

      setStep(2)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Eroare la citirea fișierului')
    }
  }

  // Step 2: Mapping complete → validate
  const handleMappingComplete = () => {
    const mapped = rawData.map((row, index) => {
      const mappedData: any = {}
      mappings.forEach((mapping) => {
        if (mapping.sourceColumn) {
          mappedData[mapping.targetField] = row[mapping.sourceColumn]
        }
      })
      return mappedData
    })

    const validated: ImportRow[] = mapped.map((data, index) => ({
      rowNumber: index + 2, // +2: Excel row 1 = header, data starts at row 2
      data,
      validation: validateRow(data, index + 2),
    }))

    setImportRows(validated)
    setStep(3)
  }

  // Step 3: Preview complete
  const handlePreviewComplete = () => {
    setStep(4)
  }

  // Step 4: Execute import
  const handleImport = async () => {
    if (!selectedOrgId) {
      alert('Selectează o organizație')
      return
    }

    setImporting(true)
    setImportProgress(0)
    setImportStats({ success: 0, failed: 0 })

    const supabase = createSupabaseBrowser()
    const validRows = importRows.filter((row) => row.validation.valid)
    const total = validRows.length
    let success = 0
    let failed = 0

    const tableName = TABLE_MAPPING[importType]

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]

      try {
        // Prepare data pentru Supabase
        const insertData: any = {
          organization_id: selectedOrgId,
          ...row.data,
        }

        // Add defaults pentru medical_examinations
        if (importType === 'medical') {
          insertData.content_version = 1
          insertData.legal_basis_version = 'v1.0'
          insertData.is_compliant = true
          // Normalizare examination_type
          if (insertData.examination_type) {
            const normalized = insertData.examination_type.toLowerCase()
            const validTypes = ['periodic', 'angajare', 'reluare', 'la_cerere', 'supraveghere']
            insertData.examination_type = validTypes.includes(normalized) ? normalized : 'periodic'
          }
          // Normalizare result
          if (insertData.result) {
            const normalized = insertData.result.toLowerCase()
            const validResults = ['apt', 'apt_conditionat', 'inapt_temporar', 'inapt']
            insertData.result = validResults.includes(normalized) ? normalized : 'apt'
          }
        }

        // Add defaults pentru safety_equipment
        if (importType === 'equipment') {
          insertData.content_version = 1
          insertData.legal_basis_version = 'v1.0'
          insertData.is_compliant = true
        }

        // Add defaults pentru safety_trainings
        if (importType === 'trainings') {
          insertData.content_version = 1
          insertData.legal_basis_version = 'v1.0'
        }

        // Add defaults pentru employees
        if (importType === 'employees') {
          insertData.is_active = true
        }

        const { error } = await supabase.from(tableName).insert(insertData)

        if (error) {
          console.error(`Row ${row.rowNumber} failed:`, error)
          failed++
        } else {
          success++
        }
      } catch (error) {
        console.error(`Row ${row.rowNumber} exception:`, error)
        failed++
      }

      setImportProgress(Math.round(((i + 1) / total) * 100))
    }

    setImportStats({ success, failed })
    setImporting(false)
    setImportComplete(true)
  }

  // Download template
  const handleDownloadTemplate = () => {
    const fields = FIELD_DEFINITIONS[importType]
    const headers = fields.map(f => f.label)
    const ws = XLSX.utils.aoa_to_sheet([headers])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, `template_${importType}.xlsx`)
  }

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Organization selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizație
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui ? `(CUI: ${org.cui})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Import Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip import
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'employees', label: 'Angajați', icon: '👥' },
                  { value: 'trainings', label: 'Instruiri', icon: '📚' },
                  { value: 'medical', label: 'Fișe medicale', icon: '🏥' },
                  { value: 'equipment', label: 'Echipamente', icon: '🔧' },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setImportType(type.value as ImportType)}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      importType === type.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Încarcă fișier CSV sau Excel
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Selectează fișier
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  sau drag & drop aici
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Formate acceptate: CSV, XLSX, XLS
                </p>
              </div>
            </div>

            {/* Download Template */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <FileSpreadsheet className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900">
                    Descarcă template
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Folosește template-ul nostru pentru a asigura compatibilitatea datelor
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descarcă template_{importType}.xlsx
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                <strong>{columns.length}</strong> coloane detectate •{' '}
                <strong>{rawData.length}</strong> rânduri
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Mapare coloane</h3>
                <button
                  onClick={() => {
                    const detected = autoDetectMapping(columns)
                    setMappings(detected)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  🪄 Auto-detectare
                </button>
              </div>
              <div className="space-y-3">
                {FIELD_DEFINITIONS[importType].map((field) => {
                  const mapping = mappings.find((m) => m.targetField === field.field)
                  return (
                    <div
                      key={field.field}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{field.field}</div>
                      </div>
                      <div className="flex-1">
                        <select
                          value={mapping?.sourceColumn || ''}
                          onChange={(e) => {
                            const newMappings = mappings.filter(
                              (m) => m.targetField !== field.field
                            )
                            if (e.target.value) {
                              newMappings.push({
                                sourceColumn: e.target.value,
                                targetField: field.field,
                                required: field.required,
                              })
                            }
                            setMappings(newMappings)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">-- Nesetat --</option>
                          {columns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 3:
        const validCount = importRows.filter((r) => r.validation.valid).length
        const errorCount = importRows.filter((r) => r.validation.errors.length > 0).length
        const warningCount = importRows.filter(
          (r) => r.validation.warnings.length > 0 && r.validation.valid
        ).length

        return (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-900">
                      {validCount}
                    </div>
                    <div className="text-sm text-green-700">Valid</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {warningCount}
                    </div>
                    <div className="text-sm text-yellow-700">Avertismente</div>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-900">
                      {errorCount}
                    </div>
                    <div className="text-sm text-red-700">Erori</div>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Preview rows */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Rând
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Probleme
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importRows.slice(0, 50).map((row) => (
                      <tr
                        key={row.rowNumber}
                        className={
                          row.validation.errors.length > 0 ? 'bg-red-50' : ''
                        }
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {row.rowNumber}
                        </td>
                        <td className="px-4 py-3">
                          {row.validation.valid ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {Object.entries(row.data)
                            .slice(0, 3)
                            .map(([key, value]) => `${value}`)
                            .join(' • ')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {row.validation.errors.map((err, i) => (
                            <div key={i} className="text-red-600 text-xs">
                              {err}
                            </div>
                          ))}
                          {row.validation.warnings.map((warn, i) => (
                            <div key={i} className="text-yellow-600 text-xs">
                              {warn}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {importRows.length > 50 && (
              <p className="text-sm text-gray-500 text-center">
                Afișate primele 50 din {importRows.length} rânduri
              </p>
            )}
          </div>
        )

      case 4:
        const validRows = importRows.filter((r) => r.validation.valid)

        return (
          <div className="space-y-6">
            {!importComplete ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Pregătit pentru import
                  </h3>
                  <p className="text-blue-700">
                    <strong>{validRows.length}</strong> înregistrări valide vor fi
                    importate în <strong>{TABLE_MAPPING[importType]}</strong>
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    Organizație: <strong>{organizations.find(o => o.id === selectedOrgId)?.name}</strong>
                  </p>
                </div>

                {importing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importare în curs...
                      </span>
                      <span className="font-medium">{importProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleImport}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Confirmă import
                  </button>
                )}
              </>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Import finalizat!
                </h3>
                <p className="text-green-700 mb-2">
                  <strong>{importStats.success}</strong> înregistrări importate cu succes
                </p>
                {importStats.failed > 0 && (
                  <p className="text-red-600 mb-4">
                    <strong>{importStats.failed}</strong> înregistrări eșuate
                  </p>
                )}
                <button
                  onClick={() => router.push(`/${locale}/dashboard`)}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Înapoi la dashboard
                </button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Import date</h1>
          <p className="text-gray-600 mt-2">
            Importă date din CSV sau Excel în 4 pași simpli
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Încărcare fișier' },
              { num: 2, label: 'Mapare coloane' },
              { num: 3, label: 'Previzualizare' },
              { num: 4, label: 'Import' },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      step >= s.num
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s.num}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {s.label}
                    </div>
                  </div>
                </div>
                {index < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {renderStepContent()}

          {/* Navigation */}
          {step > 1 && step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi
              </button>
              <button
                onClick={() => {
                  if (step === 2) handleMappingComplete()
                  else if (step === 3) handlePreviewComplete()
                }}
                disabled={
                  step === 2 &&
                  mappings.filter(
                    (m) => m.required && !m.sourceColumn
                  ).length > 0
                }
                className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continuă
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
