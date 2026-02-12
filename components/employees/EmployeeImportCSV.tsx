'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface EmployeeImportCSVProps {
  organizationId: string
  onImportComplete?: (imported: number, errors: number) => void
}

interface ParsedEmployee {
  firstName: string
  lastName: string
  cnp: string
  jobTitle: string
  department: string
  hireDate: string
}

interface ValidationError {
  row: number
  field: string
  message: string
}

interface ColumnMapping {
  firstName: number | null
  lastName: number | null
  cnp: number | null
  jobTitle: number | null
  department: number | null
  hireDate: number | null
}

interface ImportResult {
  success: number
  failed: number
  errors: ValidationError[]
}

export function EmployeeImportCSV({ organizationId, onImportComplete }: EmployeeImportCSVProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<string[][]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    firstName: null,
    lastName: null,
    cnp: null,
    jobTitle: null,
    department: null,
    hireDate: null,
  })
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validare CNP românesc
  const validateCNP = (cnp: string): boolean => {
    if (!cnp || cnp.length !== 13) return false
    if (!/^\d{13}$/.test(cnp)) return false

    // Verificare checksum CNP
    const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnp[i]) * weights[i]
    }
    const checksum = sum % 11 === 10 ? 1 : sum % 11
    return checksum === parseInt(cnp[12])
  }

  // Validare dată format ISO (YYYY-MM-DD)
  const validateDate = (date: string): boolean => {
    if (!date) return false
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) return false
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime())
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const processFile = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert('Te rog selectează un fișier CSV sau Excel (.csv, .xlsx, .xls)')
      return
    }

    setFile(file)
    setImportResult(null)
    setValidationErrors([])

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // Afișare primele 6 rânduri (header + 5 rânduri)
        setPreviewData(jsonData.slice(0, 6))

        // Auto-detect coloane
        autoMapColumns(jsonData[0] || [])
      } catch (error) {
        console.error('Error parsing file:', error)
        alert('Eroare la procesarea fișierului. Verifică formatul.')
      }
    }
    reader.readAsBinaryString(file)
  }

  const autoMapColumns = (headers: string[]) => {
    const mapping: ColumnMapping = {
      firstName: null,
      lastName: null,
      cnp: null,
      jobTitle: null,
      department: null,
      hireDate: null,
    }

    headers.forEach((header, index) => {
      const h = header.toLowerCase().trim()

      if (h.includes('prenume') || h.includes('first') || h === 'prenume') {
        mapping.firstName = index
      } else if (h.includes('nume') || h.includes('last') || h === 'nume') {
        mapping.lastName = index
      } else if (h.includes('cnp') || h === 'cnp') {
        mapping.cnp = index
      } else if (h.includes('funcție') || h.includes('functie') || h.includes('job') || h.includes('post')) {
        mapping.jobTitle = index
      } else if (h.includes('departament') || h.includes('department') || h.includes('sectie') || h.includes('secție')) {
        mapping.department = index
      } else if (h.includes('angajare') || h.includes('hire') || h.includes('data')) {
        mapping.hireDate = index
      }
    })

    setColumnMapping(mapping)
  }

  const handleColumnMappingChange = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: value === '' ? null : parseInt(value)
    }))
  }

  const validateAndPrepareData = (): ParsedEmployee[] => {
    const errors: ValidationError[] = []
    const employees: ParsedEmployee[] = []

    // Verifică dacă toate câmpurile obligatorii sunt mapate
    if (columnMapping.firstName === null || columnMapping.lastName === null) {
      alert('Trebuie să mapezi cel puțin coloanele Prenume și Nume!')
      return []
    }

    // Procesare date (skip header row)
    for (let i = 1; i < previewData.length; i++) {
      const row = previewData[i]
      if (!row || row.length === 0) continue

      const employee: ParsedEmployee = {
        firstName: columnMapping.firstName !== null ? String(row[columnMapping.firstName] || '').trim() : '',
        lastName: columnMapping.lastName !== null ? String(row[columnMapping.lastName] || '').trim() : '',
        cnp: columnMapping.cnp !== null ? String(row[columnMapping.cnp] || '').trim() : '',
        jobTitle: columnMapping.jobTitle !== null ? String(row[columnMapping.jobTitle] || '').trim() : '',
        department: columnMapping.department !== null ? String(row[columnMapping.department] || '').trim() : '',
        hireDate: columnMapping.hireDate !== null ? String(row[columnMapping.hireDate] || '').trim() : '',
      }

      // Validări
      if (!employee.firstName) {
        errors.push({ row: i + 1, field: 'Prenume', message: 'Prenumele este obligatoriu' })
      }
      if (!employee.lastName) {
        errors.push({ row: i + 1, field: 'Nume', message: 'Numele este obligatoriu' })
      }
      if (employee.cnp && !validateCNP(employee.cnp)) {
        errors.push({ row: i + 1, field: 'CNP', message: 'CNP invalid (format sau checksum incorect)' })
      }
      if (employee.hireDate && !validateDate(employee.hireDate)) {
        errors.push({ row: i + 1, field: 'Data angajare', message: 'Format dată invalid (folosește YYYY-MM-DD)' })
      }

      // Adaugă doar dacă nu sunt erori critice pentru acest rând
      const rowHasCriticalErrors = errors.some(e => e.row === i + 1 && (e.field === 'Prenume' || e.field === 'Nume'))
      if (!rowHasCriticalErrors) {
        employees.push(employee)
      }
    }

    setValidationErrors(errors)
    return employees
  }

  const handleImport = async () => {
    const employees = validateAndPrepareData()

    if (employees.length === 0) {
      alert('Nu există date valide pentru import!')
      return
    }

    if (validationErrors.length > 0) {
      const confirmed = confirm(
        `Au fost găsite ${validationErrors.length} erori de validare. Dorești să continui importul pentru înregistrările valide?`
      )
      if (!confirmed) return
    }

    setIsImporting(true)
    setImportProgress(0)

    const supabase = createSupabaseBrowser()
    let successCount = 0
    let failedCount = 0
    const importErrors: ValidationError[] = []

    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i]

      try {
        const { error } = await supabase.from('employees').insert({
          organization_id: organizationId,
          full_name: `${emp.firstName} ${emp.lastName}`,
          cnp: emp.cnp || null,
          job_title: emp.jobTitle || null,
          department: emp.department || null,
          hire_date: emp.hireDate || new Date().toISOString().split('T')[0],
          nationality: 'RO',
          is_active: true,
        })

        if (error) {
          failedCount++
          importErrors.push({
            row: i + 2, // +2 pentru header și index 0
            field: 'Database',
            message: error.message
          })
        } else {
          successCount++
        }
      } catch (error) {
        failedCount++
        importErrors.push({
          row: i + 2,
          field: 'System',
          message: error instanceof Error ? error.message : 'Eroare necunoscută'
        })
      }

      setImportProgress(Math.round(((i + 1) / employees.length) * 100))
    }

    setIsImporting(false)
    setImportResult({
      success: successCount,
      failed: failedCount,
      errors: [...validationErrors, ...importErrors]
    })

    if (onImportComplete) {
      onImportComplete(successCount, failedCount)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreviewData([])
    setColumnMapping({
      firstName: null,
      lastName: null,
      cnp: null,
      jobTitle: null,
      department: null,
      hireDate: null,
    })
    setValidationErrors([])
    setImportResult(null)
    setImportProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadTemplate = () => {
    const template = [
      ['Prenume', 'Nume', 'CNP', 'Funcție', 'Departament', 'Data angajare (YYYY-MM-DD)'],
      ['Ion', 'Popescu', '1800101123456', 'Operator producție', 'Producție', '2024-01-15'],
      ['Maria', 'Ionescu', '2850505234567', 'Contabil șef', 'Financiar', '2023-06-01'],
      ['Vasile', 'Marinescu', '1750202345678', 'Mecanic', 'Întreținere', '2022-03-10'],
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(template)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Angajați')
    XLSX.writeFile(workbook, 'template_import_angajati.xlsx')
  }

  return (
    <div className="space-y-6">
      {/* Header cu instrucțiuni */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Import angajați din CSV/Excel</h3>
            <p className="text-sm text-blue-700 mb-2">
              Încarcă un fișier CSV sau Excel cu datele angajaților. Asigură-te că fișierul conține coloanele: Prenume, Nume, CNP (opțional), Funcție, Departament, Data angajare.
            </p>
            <button
              onClick={downloadTemplate}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Descarcă șablon Excel
            </button>
          </div>
        </div>
      </div>

      {/* Zona upload */}
      {!file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
            isDragging
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Trage fișierul aici sau
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                selectează din computer
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Formate acceptate: CSV, XLSX, XLS
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Preview și mapare coloane */}
      {file && previewData.length > 0 && !importResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {previewData.length - 1} rânduri (afișare primele 5)
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Mapare coloane */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Mapare coloane</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'firstName' as const, label: 'Prenume *', required: true },
                { key: 'lastName' as const, label: 'Nume *', required: true },
                { key: 'cnp' as const, label: 'CNP', required: false },
                { key: 'jobTitle' as const, label: 'Funcție', required: false },
                { key: 'department' as const, label: 'Departament', required: false },
                { key: 'hireDate' as const, label: 'Data angajare', required: false },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <select
                    value={columnMapping[key] ?? ''}
                    onChange={(e) => handleColumnMappingChange(key, e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      required && columnMapping[key] === null
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Nu selecta --</option>
                    {previewData[0]?.map((header, index) => (
                      <option key={index} value={index}>
                        Coloana {index + 1}: {header}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Preview tabel */}
          <div className="border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {previewData[0]?.map((header, index) => (
                      <th key={index} className="px-4 py-3 text-left font-semibold text-gray-900">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(1, 6).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b last:border-b-0">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-gray-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Erori de validare */}
          {validationErrors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-2">
                    {validationErrors.length} erori de validare
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {validationErrors.slice(0, 10).map((error, index) => (
                      <p key={index} className="text-sm text-amber-700">
                        Rând {error.row}, {error.field}: {error.message}
                      </p>
                    ))}
                    {validationErrors.length > 10 && (
                      <p className="text-sm text-amber-600 font-medium">
                        ... și încă {validationErrors.length - 10} erori
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Butoane acțiune */}
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={isImporting || columnMapping.firstName === null || columnMapping.lastName === null}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Importare în curs... {importProgress}%
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Importă angajați
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={isImporting}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Anulează
            </button>
          </div>
        </div>
      )}

      {/* Rezultat import */}
      {importResult && (
        <div className="space-y-4">
          <div className={`border rounded-2xl p-6 ${
            importResult.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              {importResult.failed === 0 ? (
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${
                  importResult.failed === 0 ? 'text-green-900' : 'text-amber-900'
                }`}>
                  Import finalizat
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-green-700 font-medium">
                    ✓ {importResult.success} angajați importați cu succes
                  </p>
                  {importResult.failed > 0 && (
                    <p className="text-red-700 font-medium">
                      ✗ {importResult.failed} erori la import
                    </p>
                  )}
                </div>

                {importResult.errors.length > 0 && (
                  <div className="mt-4 space-y-1 max-h-60 overflow-y-auto">
                    <p className="font-semibold text-gray-900 mb-2">Detalii erori:</p>
                    {importResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        Rând {error.row}, {error.field}: {error.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Import nou
          </button>
        </div>
      )}
    </div>
  )
}
