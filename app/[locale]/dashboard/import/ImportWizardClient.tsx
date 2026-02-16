// app/[locale]/dashboard/import/ImportWizardClient.tsx
// CSV/Excel Employee Import Wizard — 4 Steps
// Step 1: Upload | Step 2: Column Mapping | Step 3: Validation & Preview | Step 4: Import

'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Download,
  Loader2,
  X,
  Check,
  Users,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

interface Props {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui: string | null }>
  selectedOrgId: string
  locale: string
}

interface ColumnMapping {
  sourceColumn: string
  targetField: string
  required: boolean
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

interface ImportRow {
  rowNumber: number
  data: Record<string, any>
  validation: ValidationResult
}

// Employee field definitions
const EMPLOYEE_FIELDS = [
  { field: 'first_name', label: 'Prenume', required: true },
  { field: 'last_name', label: 'Nume', required: true },
  { field: 'cnp', label: 'CNP', required: true },
  { field: 'job_title', label: 'Funcție', required: true },
  { field: 'department', label: 'Departament', required: false },
  { field: 'hire_date', label: 'Data angajării', required: false },
  { field: 'email', label: 'Email', required: false },
  { field: 'phone', label: 'Telefon', required: false },
  { field: 'cor_code', label: 'Cod COR', required: false },
]

// Auto-detect patterns for Romanian columns
const COLUMN_PATTERNS: Record<string, string[]> = {
  first_name: ['prenume', 'firstname', 'first_name', 'first name', 'nume_mic'],
  last_name: ['nume', 'lastname', 'last_name', 'last name', 'nume familie'],
  cnp: ['cnp', 'pin', 'cod numeric', 'cod personal'],
  email: ['email', 'e-mail', 'mail', 'adresa email', 'adresă email'],
  phone: ['telefon', 'phone', 'tel', 'mobile', 'gsm', 'nr telefon'],
  job_title: ['functie', 'funcție', 'job', 'job_title', 'position', 'pozitie', 'funcţie'],
  department: ['departament', 'department', 'dept', 'sector', 'sectie'],
  hire_date: ['data angajare', 'data angajării', 'hire_date', 'angajat la', 'start date', 'data_angajare'],
  cor_code: ['cor', 'cod cor', 'cor_code', 'cod_cor'],
}

// CNP validation for Romania
function validateCNP(cnp: string): { valid: boolean; error?: string } {
  // Must be 13 digits
  if (!/^\d{13}$/.test(cnp)) {
    return { valid: false, error: 'CNP trebuie să conțină exact 13 cifre' }
  }

  // Control digit algorithm
  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnp[i]) * weights[i]
  }
  let control = sum % 11
  if (control === 10) control = 1

  const actualControl = parseInt(cnp[12])
  if (control !== actualControl) {
    return { valid: false, error: 'CNP invalid (cifră de control greșită)' }
  }

  return { valid: true }
}

// Parse date from multiple formats
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // Try standard formats
  const formats = [
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,  // DD.MM.YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,  // DD/MM/YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,    // YYYY-MM-DD
  ]

  for (const regex of formats) {
    const match = dateStr.toString().match(regex)
    if (match) {
      if (regex.source.startsWith('^(\\d{4})')) {
        // YYYY-MM-DD
        const date = new Date(match[1] + '-' + match[2] + '-' + match[3])
        if (!isNaN(date.getTime())) return date
      } else {
        // DD.MM.YYYY or DD/MM/YYYY
        const date = new Date(match[3] + '-' + match[2] + '-' + match[1])
        if (!isNaN(date.getTime())) return date
      }
    }
  }

  // Try native Date parsing
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) return date

  return null
}

export default function ImportWizardClient({ user, organizations, selectedOrgId, locale }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [importRows, setImportRows] = useState<ImportRow[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStats, setImportStats] = useState({ success: 0, failed: 0, total: 0 })
  const [dragActive, setDragActive] = useState(false)

  // Auto-detect column mapping
  const autoDetectMapping = useCallback((sourceColumns: string[]): ColumnMapping[] => {
    const mappings: ColumnMapping[] = []

    EMPLOYEE_FIELDS.forEach((field) => {
      const patterns = COLUMN_PATTERNS[field.field] || []
      let matched = false

      for (const col of sourceColumns) {
        const normalized = col.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
        if (patterns.some((pattern) => normalized.includes(pattern.toLowerCase().replace(/[^a-z0-9]/g, '')))) {
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
  }, [])

  // Validate row
  const validateRow = useCallback(async (rowData: Record<string, any>, rowNumber: number, existingCNPs: Set<string>): Promise<ValidationResult> => {
    const errors: string[] = []
    const warnings: string[] = []

    // Required: first_name
    if (!rowData.first_name || rowData.first_name.toString().trim().length < 2) {
      errors.push('Prenume obligatoriu (min 2 caractere)')
    }

    // Required: last_name
    if (!rowData.last_name || rowData.last_name.toString().trim().length < 2) {
      errors.push('Nume obligatoriu (min 2 caractere)')
    }

    // Required: CNP
    if (!rowData.cnp) {
      errors.push('CNP obligatoriu')
    } else {
      const cnpValidation = validateCNP(rowData.cnp.toString().trim())
      if (!cnpValidation.valid) {
        errors.push(cnpValidation.error || 'CNP invalid')
      }

      // Check for duplicates in this import
      if (existingCNPs.has(rowData.cnp.toString().trim())) {
        warnings.push('CNP duplicat în fișier')
      }

      // Check for existing in database
      const supabase = createSupabaseBrowser()
      const { data: existing } = await supabase
        .from('employees')
        .select('id')
        .eq('organization_id', selectedOrgId)
        .eq('cnp', rowData.cnp.toString().trim())
        .maybeSingle()

      if (existing) {
        warnings.push('CNP există deja în organizație')
      }
    }

    // Required: job_title
    if (!rowData.job_title || rowData.job_title.toString().trim().length < 2) {
      errors.push('Funcție obligatorie')
    }

    // Optional: email validation
    if (rowData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rowData.email)) {
      warnings.push('Format email invalid')
    }

    // Optional: hire_date parsing
    if (rowData.hire_date) {
      const parsedDate = parseDate(rowData.hire_date)
      if (!parsedDate) {
        warnings.push('Format dată angajare invalid')
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }, [selectedOrgId])

  // Handle file upload via input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      await processFile(uploadedFile)
    }
  }

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      await processFile(droppedFile)
    }
  }

  // Process uploaded file
  const processFile = async (uploadedFile: File) => {
    setFile(uploadedFile)

    try {
      const fileExt = uploadedFile.name.split('.').pop()?.toLowerCase()

      let jsonData: any[] = []
      let detectedColumns: string[] = []

      if (fileExt === 'csv') {
        // Parse CSV (Papa Parse auto-detects encoding)
        const text = await uploadedFile.text()
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        })

        jsonData = parsed.data as any[]
        detectedColumns = parsed.meta.fields || []
      } else {
        // Parse Excel
        const data = await uploadedFile.arrayBuffer()
        const workbook = XLSX.read(data)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        jsonData = XLSX.utils.sheet_to_json(worksheet)
        detectedColumns = Object.keys(jsonData[0] || {})
      }

      if (jsonData.length === 0) {
        alert('Fișierul este gol sau nu conține date valide')
        return
      }

      setRawData(jsonData)
      setColumns(detectedColumns)

      // Auto-detect mapping
      const detected = autoDetectMapping(detectedColumns)
      setMappings(detected)

      setStep(2)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Eroare la citirea fișierului. Verificați formatul.')
    }
  }

  // Step 2: Complete mapping
  const handleMappingComplete = () => {
    const mapped = rawData.map((row) => {
      const mappedData: Record<string, any> = {}
      mappings.forEach((mapping) => {
        if (mapping.sourceColumn && mapping.sourceColumn !== '—') {
          mappedData[mapping.targetField] = row[mapping.sourceColumn]
        }
      })
      return mappedData
    })

    // Validate all rows
    const cnpSet = new Set<string>()
    Promise.all(
      mapped.map(async (data, index) => {
        const validation = await validateRow(data, index + 2, cnpSet)
        if (data.cnp) cnpSet.add(data.cnp.toString().trim())
        return {
          rowNumber: index + 2,
          data,
          validation,
        }
      })
    ).then((validated) => {
      setImportRows(validated)
      setStep(3)
    })
  }

  // Step 3: Start import
  const handleStartImport = async () => {
    setStep(4)
    setImporting(true)

    const supabase = createSupabaseBrowser()
    const validRows = importRows.filter((row) => row.validation.valid)
    const total = validRows.length
    let success = 0
    let failed = 0

    setImportStats({ success: 0, failed: 0, total })

    // Batch insert in chunks of 50
    const chunkSize = 50
    for (let i = 0; i < validRows.length; i += chunkSize) {
      const chunk = validRows.slice(i, i + chunkSize)
      const inserts = chunk.map((row) => ({
        organization_id: selectedOrgId,
        first_name: row.data.first_name?.toString().trim() || '',
        last_name: row.data.last_name?.toString().trim() || '',
        cnp: row.data.cnp?.toString().trim() || '',
        job_title: row.data.job_title?.toString().trim() || '',
        department: row.data.department?.toString().trim() || null,
        hire_date: row.data.hire_date ? parseDate(row.data.hire_date)?.toISOString().split('T')[0] : null,
        email: row.data.email?.toString().trim() || null,
        phone: row.data.phone?.toString().trim() || null,
        cor_code: row.data.cor_code?.toString().trim() || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase.from('employees').insert(inserts)

      if (error) {
        console.error('Import chunk error:', error)
        failed += chunk.length
      } else {
        success += chunk.length
      }

      setImportProgress(Math.round(((i + chunk.length) / total) * 100))
      setImportStats({ success, failed, total })
    }

    setImporting(false)
  }

  // Update mapping
  const updateMapping = (targetField: string, sourceColumn: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.targetField === targetField
          ? { ...m, sourceColumn }
          : m
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Import Angajați</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {organizations.find((o) => o.id === selectedOrgId)?.name || 'Organizație'}
            </p>
          </div>
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= stepNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {step > stepNum ? <Check className="h-5 w-5" /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`w-24 h-1 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          {/* STEP 1: Upload */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Pas 1: Încarcă fișierul
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Acceptăm fișiere CSV, XLSX sau XLS. Datele vor fi procesate automat.
              </p>

              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                  dragActive
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Trage fișierul aici sau selectează
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  CSV, XLSX, XLS (max 10 MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Selectează fișier
                </button>
              </div>

              {file && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center gap-3">
                  <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB · {rawData.length} rânduri detectate
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              )}

              {rawData.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Preview primele 5 rânduri:
                  </p>
                  <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          {columns.map((col) => (
                            <th key={col} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {rawData.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            {columns.map((col) => (
                              <td key={col} className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                {row[col] || '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Column Mapping */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Pas 2: Mapare coloane
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Am detectat automat câteva coloane. Verifică și ajustează dacă e necesar.
              </p>

              <div className="space-y-4">
                {EMPLOYEE_FIELDS.map((field) => {
                  const mapping = mappings.find((m) => m.targetField === field.field)
                  return (
                    <div key={field.field} className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                      <div className="flex-1">
                        <select
                          value={mapping?.sourceColumn || ''}
                          onChange={(e) => updateMapping(field.field, e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            field.required && !mapping?.sourceColumn
                              ? 'border-red-300 dark:border-red-700'
                              : 'border-gray-300 dark:border-gray-600'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600`}
                        >
                          <option value="">— Ignoră —</option>
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

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-gray-900 dark:text-white">
                  <strong>Preview mapping:</strong> Primele 3 rânduri din fișier
                </p>
                <div className="mt-4 space-y-2">
                  {rawData.slice(0, 3).map((row, idx) => (
                    <div key={idx} className="text-xs text-gray-700 dark:text-gray-300 p-2 bg-white dark:bg-gray-800 rounded">
                      {mappings
                        .filter((m) => m.sourceColumn)
                        .map((m) => `${m.targetField}: ${row[m.sourceColumn] || '—'}`)
                        .join(' | ')}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Înapoi
                </button>
                <button
                  onClick={handleMappingComplete}
                  disabled={mappings.filter((m) => m.required && !m.sourceColumn).length > 0}
                  className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  Validează date
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Validation & Preview */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Pas 3: Validare & Preview
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {importRows.filter((r) => r.validation.valid).length} rânduri valide ·{' '}
                {importRows.filter((r) => !r.validation.valid).length} cu erori ·{' '}
                {importRows.filter((r) => r.validation.warnings.length > 0).length} cu avertizări
              </p>

              <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">#</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Prenume</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Nume</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">CNP</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Funcție</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {importRows.map((row) => (
                      <tr
                        key={row.rowNumber}
                        className={
                          !row.validation.valid
                            ? 'bg-red-50 dark:bg-red-900/20'
                            : row.validation.warnings.length > 0
                            ? 'bg-yellow-50 dark:bg-yellow-900/20'
                            : 'bg-green-50 dark:bg-green-900/20'
                        }
                      >
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.rowNumber}</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.data.first_name || '—'}</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.data.last_name || '—'}</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.data.cnp || '—'}</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.data.job_title || '—'}</td>
                        <td className="px-4 py-2">
                          {row.validation.valid ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              {row.validation.warnings.length > 0 && (
                                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                              )}
                            </div>
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                          {(row.validation.errors.length > 0 || row.validation.warnings.length > 0) && (
                            <div className="text-xs mt-1 space-y-1">
                              {row.validation.errors.map((err, idx) => (
                                <div key={idx} className="text-red-600 dark:text-red-400">
                                  {err}
                                </div>
                              ))}
                              {row.validation.warnings.map((warn, idx) => (
                                <div key={idx} className="text-yellow-600 dark:text-yellow-400">
                                  {warn}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Înapoi
                </button>
                <button
                  onClick={handleStartImport}
                  disabled={importRows.filter((r) => r.validation.valid).length === 0}
                  className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  Importă {importRows.filter((r) => r.validation.valid).length} angajați
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Import Progress */}
          {step === 4 && (
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {importing ? 'Import în curs...' : 'Import finalizat'}
              </h2>

              {importing ? (
                <>
                  <Loader2 className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {importStats.success} / {importStats.total} importați
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {importStats.success} importați cu succes
                    </p>
                    {importStats.failed > 0 && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {importStats.failed} ignorați (erori)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => router.push(`/${locale}/dashboard?org=${selectedOrgId}`)}
                    className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                  >
                    <Users className="h-4 w-4" />
                    Vezi lista angajați
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
