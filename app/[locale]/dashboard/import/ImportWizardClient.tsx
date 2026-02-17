// app/[locale]/dashboard/import/ImportWizardClient.tsx
// Advanced Import Wizard with REGES/REVISAL profiles and dynamic mapping
// Steps: Upload → Profile Selection → Column Mapping → Validation → Import

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
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { parseString as parseXML } from 'xml2js'

interface Props {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui: string | null }>
  selectedOrgId: string
  locale: string
}

type ImportProfile = 'reges-salariati' | 'reges-contracte' | 'manual'

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
  { field: 'cnp', label: 'CNP', required: false },
  { field: 'job_title', label: 'Funcție', required: false },
  { field: 'department', label: 'Departament', required: false },
  { field: 'hire_date', label: 'Data angajării', required: false },
  { field: 'contract_end_date', label: 'Data sfârșit contract', required: false },
  { field: 'email', label: 'Email', required: false },
  { field: 'phone', label: 'Telefon', required: false },
  { field: 'cor_code', label: 'Cod COR', required: false },
  { field: 'cor_title', label: 'Denumire COR', required: false },
  { field: 'contract_number', label: 'Nr. contract', required: false },
  { field: 'contract_type', label: 'Tip contract', required: false },
  { field: 'status', label: 'Status', required: false },
]

// REGES Salariați profile (24 columns - employee personal data)
const REGES_SALARIATI_PROFILE = {
  name: 'REGES Salariați',
  columnCount: 24,
  description: 'Export date personale angajați din REGES Online. 24 coloane - date personale, adresă, handicap, autorizații.',
  mappings: {
    'CNP': 'cnp',
    'Nume': 'last_name',
    'Prenume': 'first_name',
    'Data nașterii': 'birth_date',
    'Naționalitate': 'nationality',
    'Cod SIRUTA localitate': 'siruta_code',
    'Tip carte identitate': 'id_card_type',
    'Adresa': 'address',
    'Radiat': 'is_deregistered',
    'Motiv radiere': 'deregistration_reason',
    'CNP vechi': 'old_cnp',
    'Grad invaliditate': 'disability_grade',
    'Tip handicap': 'handicap_type',
    'Grad handicap': 'handicap_grade',
    'Dată certificat handicap': 'handicap_certificate_date',
    'Dată valabilitate certificat handicap': 'handicap_certificate_validity',
    'Tip apatrid': 'stateless_type',
    'Țară domiciliu': 'residence_country',
    'Număr autorizație': 'authorization_number',
    'Tip autorizație': 'authorization_type',
    'Tip autorizație excepție': 'authorization_exception_type',
    'Dată început autorizație': 'authorization_start_date',
    'Dată sfârșit autorizație': 'authorization_end_date',
    'SalariatId': 'reges_salariat_id',
  },
}

// L153 field names (columns 35-47 in REGES Contracte export — Legea 153/2017)
const L153_FIELDS = [
  'Anexa L153', 'Capitol L153', 'Litera L153', 'Clasificare suplimentară L153',
  'Funcție L153', 'Specialitate funcție L153', 'Structură aprobată L153',
  'Specialitate structură aprobată L153', 'Grad profesional L153', 'Gradație L153',
  'Denumire altă funcție L153', 'Explicație funcție L153', 'Alt grad profesional L153',
]

// REGES Contracte profile (47 columns - employment contracts)
const REGES_CONTRACTE_PROFILE = {
  name: 'REGES Contracte',
  columnCount: 47,
  description: 'Export contracte de muncă din REGES Online. 47 coloane - contracte active sau încetate, salarizare, program, COR, L153.',
  mappings: {
    'ID Contract': 'contract_id',
    'Număr Contract': 'contract_number',
    'Dată Consemnare': 'registration_date',
    'Data Contract': 'contract_date',
    'Data Început Contract': 'hire_date',
    'Data Sfârșit Contract': 'contract_end_date',
    'Tip Contract': 'contract_type',
    'Tip Durată': 'contract_duration',
    'Tip Normă': 'work_norm',
    'Salariu': 'base_salary',
    'Monedă': 'salary_currency',
    'Nivel Studii': 'education_level',
    'Tip Loc Muncă': 'workplace_type',
    'Județ Loc Muncă': 'workplace_county',
    'Localitate Loc Muncă': 'workplace_city',
    'ID Salariat': 'reges_salariat_id',
    'CNP Salariat': 'cnp',
    'Nume Salariat': 'last_name',
    'Prenume Salariat': 'first_name',
    'Stare Curentă': 'status',
    'Radiat': 'is_deregistered',
    'Motiv Radiere': 'deregistration_reason',
    'Detalii': 'details',
    'Normă Timp Muncă': 'work_time_norm',
    'Repartizare Timp Muncă': 'work_time_distribution',
    'Durată Timp Muncă': 'work_duration',
    'Interval Timp': 'time_interval',
    'Repartizare Muncă': 'work_schedule',
    'Notă Repartizare Muncă': 'work_schedule_note',
    'Început Interval': 'shift_start',
    'Sfârșit Interval': 'shift_end',
    'Tip Tură': 'shift_type',
    'Cod COR': 'cor_code',
    'Versiune COR': 'cor_version',
  },
}

// Fuzzy match patterns for auto-detection (Romanian/English)
const COLUMN_PATTERNS: Record<string, string[]> = {
  first_name: ['prenume', 'firstname', 'first_name', 'first name', 'nume_mic', 'prenumesalariat'],
  last_name: ['nume', 'lastname', 'last_name', 'last name', 'nume familie', 'numesalariat'],
  cnp: ['cnp', 'pin', 'cod numeric', 'cod personal'],
  email: ['email', 'e-mail', 'mail', 'adresa email', 'adresă email'],
  phone: ['telefon', 'phone', 'tel', 'mobile', 'gsm', 'nr telefon'],
  job_title: ['functie', 'funcție', 'job', 'job_title', 'position', 'pozitie', 'funcţie', 'post', 'ocupatie'],
  department: ['departament', 'department', 'dept', 'sector', 'sectie', 'compartiment'],
  hire_date: ['data angajare', 'data angajării', 'hire_date', 'angajat la', 'start date', 'data_angajare', 'data inceput', 'data început'],
  contract_end_date: ['data sfarsit', 'data sfârșit', 'end_date', 'data_sfarsit', 'contract_end'],
  cor_code: ['cor', 'cod cor', 'cor_code', 'cod_cor', 'codcor'],
  cor_title: ['denumire cor', 'cor_title', 'denumirecor', 'titlu cor'],
  contract_number: ['nr contract', 'contract_number', 'numar contract', 'nr. contract', 'nrcontract'],
  contract_type: ['tip contract', 'contract_type', 'tipcontract', 'tip_contract'],
  status: ['stare', 'status', 'activ', 'stare contract', 'starecontract'],
}

// Value transformers for REGES data
function transformValue(columnName: string, rawValue: any, profile: ImportProfile): { value: any; transformed: boolean; warning?: string } {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return { value: null, transformed: false }
  }

  const str = rawValue.toString().trim()

  // Tip carte identitate transformations
  if (columnName === 'Tip carte identitate') {
    const mapping: Record<string, string> = {
      'CarteIdentitate': 'Carte de identitate',
      'Pasaport': 'Pașaport',
      'PermisŞedere': 'Permis ședere',
      'PermisȘedere': 'Permis ședere',
      'CarteSejur': 'Carte de ședere',
    }
    const transformed = mapping[str] || str
    return { value: transformed, transformed: transformed !== str }
  }

  // Grad invaliditate / Tip handicap / Grad handicap - "Fara" → null
  if (columnName === 'Grad invaliditate' || columnName === 'Tip handicap' || columnName === 'Grad handicap') {
    if (str === 'Fara' || str === 'Fără' || str === '0') {
      return { value: null, transformed: true }
    }
    return { value: str, transformed: false }
  }

  // Boolean fields (Radiat)
  if (columnName === 'Radiat') {
    const lowerStr = str.toLowerCase()
    if (lowerStr === 'true' || lowerStr === '1' || lowerStr === 'da') {
      return { value: true, transformed: true }
    }
    if (lowerStr === 'false' || lowerStr === '0' || lowerStr === 'nu' || str === '') {
      return { value: false, transformed: true }
    }
    return { value: Boolean(str), transformed: false }
  }

  // Contract type transformations (Tip Contract)
  if (columnName === 'Tip Contract') {
    const mapping: Record<string, string> = {
      'ContractIndividualMunca': 'CIM',
      'ContractUcenicie': 'Ucenicie',
      'ContractMuncaDomiciliu': 'CIM domiciliu',
      'ContractMuncaTemporara': 'CIM temporar',
      'ContractTelemunca': 'CIM telemuncă',
      'Conventie': 'Convenție',
    }
    const transformed = mapping[str] || str
    return { value: transformed, transformed: transformed !== str }
  }

  // Contract duration transformations (Tip Durată)
  if (columnName === 'Tip Durată') {
    const mapping: Record<string, string> = {
      'Nedeterminata': 'Nedeterminată',
      'Determinata': 'Determinată',
    }
    const transformed = mapping[str] || str
    return { value: transformed, transformed: transformed !== str }
  }

  // Work norm transformations (Tip Normă)
  if (columnName === 'Tip Normă') {
    const mapping: Record<string, string> = {
      'NormaIntreaga': 'Normă întreagă',
      'FractiuneNorma': 'Fracțiune normă',
      'TimpPartial': 'Timp parțial',
    }
    const transformed = mapping[str] || str
    return { value: transformed, transformed: transformed !== str }
  }

  // Work time norm transformations (Normă Timp Muncă)
  if (columnName === 'Normă Timp Muncă') {
    const mapping: Record<string, string> = {
      'NormaIntreaga840': 'Normă întreagă (840h)',
      'TimpPartial': 'Timp parțial',
    }
    const transformed = mapping[str] || str
    return { value: transformed, transformed: transformed !== str }
  }

  // Status - parse composite "Activ", "Încetat: DD-MM-YYYY", "Suspendat: DD-MM-YYYY" (Stare Curentă)
  if (columnName === 'Stare Curentă') {
    if (str === 'Activ') {
      return { value: 'activ', transformed: true }
    }
    if (str.startsWith('Încetat:') || str.startsWith('Incetat:')) {
      const datePart = str.replace(/^(Încetat|Incetat):/, '').trim()
      return { value: 'incetat', transformed: true, warning: `Data încetare: ${datePart}` }
    }
    if (str.startsWith('Suspendat:')) {
      const datePart = str.replace('Suspendat:', '').trim()
      return { value: 'suspendat', transformed: true, warning: `Data suspendare: ${datePart}` }
    }
    return { value: str.toLowerCase(), transformed: false }
  }

  // Salary - parse number (Salariu)
  if (columnName === 'Salariu') {
    const num = parseFloat(str.replace(/\./g, '').replace(',', '.'))
    if (!isNaN(num)) {
      return { value: num, transformed: str !== num.toString() }
    }
    return { value: str, transformed: false }
  }

  // Date fields - parse DD-MM-YYYY / DD.MM.YYYY → ISO YYYY-MM-DD
  if (
    columnName === 'Data nașterii' ||
    columnName === 'Dată certificat handicap' ||
    columnName === 'Dată valabilitate certificat handicap' ||
    columnName === 'Dată început autorizație' ||
    columnName === 'Dată sfârșit autorizație' ||
    columnName === 'Dată Consemnare' ||
    columnName === 'Data Contract' ||
    columnName === 'Data Început Contract' ||
    columnName === 'Data Sfârșit Contract'
  ) {
    const parsed = parseDate(str)
    if (parsed) {
      const iso = parsed.toISOString().split('T')[0]
      return { value: iso, transformed: iso !== str }
    }
    return { value: str, transformed: false, warning: `Format dată nerecunoscut: ${str}` }
  }

  // Default: no transformation
  return { value: str, transformed: false }
}

// CNP validation for Romania
function validateCNP(cnp: string): { valid: boolean; error?: string } {
  if (!/^\d{13}$/.test(cnp)) {
    return { valid: false, error: 'CNP trebuie să conțină exact 13 cifre' }
  }

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

  const str = dateStr.toString().trim()
  const formats = [
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, // DD.MM.YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
  ]

  for (const regex of formats) {
    const match = str.match(regex)
    if (match) {
      if (regex.source.startsWith('^(\\d{4})')) {
        // YYYY-MM-DD
        const date = new Date(match[1] + '-' + match[2].padStart(2, '0') + '-' + match[3].padStart(2, '0'))
        if (!isNaN(date.getTime())) return date
      } else {
        // DD.MM.YYYY or DD/MM/YYYY or DD-MM-YYYY
        const date = new Date(match[3] + '-' + match[2].padStart(2, '0') + '-' + match[1].padStart(2, '0'))
        if (!isNaN(date.getTime())) return date
      }
    }
  }

  // Try native Date parsing
  const date = new Date(str)
  if (!isNaN(date.getTime())) return date

  return null
}

// Hash CNP with SHA-256 for secure storage
async function hashCNP(cnp: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(cnp)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function ImportWizardClient({ user, organizations, selectedOrgId, locale }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<ImportProfile>('manual')
  const [file, setFile] = useState<File | null>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [headerRow, setHeaderRow] = useState<number>(1)
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [importRows, setImportRows] = useState<ImportRow[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStats, setImportStats] = useState({ success: 0, failed: 0, total: 0 })
  const [dragActive, setDragActive] = useState(false)

  // Auto-detect column mapping (fuzzy match)
  const autoDetectMapping = useCallback((sourceColumns: string[], selectedProfile: ImportProfile): ColumnMapping[] => {
    const mappings: ColumnMapping[] = []

    // If REGES profile, use pre-configured mappings
    if (selectedProfile === 'reges-salariati') {
      Object.entries(REGES_SALARIATI_PROFILE.mappings).forEach(([sourceCol, targetField]) => {
        const found = sourceColumns.find((col) => col.trim() === sourceCol)
        if (found) {
          const fieldDef = EMPLOYEE_FIELDS.find((f) => f.field === targetField)
          mappings.push({
            sourceColumn: found,
            targetField: targetField,
            required: fieldDef?.required || false,
          })
        }
      })
    } else if (selectedProfile === 'reges-contracte') {
      Object.entries(REGES_CONTRACTE_PROFILE.mappings).forEach(([sourceCol, targetField]) => {
        const found = sourceColumns.find((col) => col.trim() === sourceCol)
        if (found) {
          const fieldDef = EMPLOYEE_FIELDS.find((f) => f.field === targetField)
          mappings.push({
            sourceColumn: found,
            targetField: targetField,
            required: fieldDef?.required || false,
          })
        }
      })
    } else {
      // Manual profile: fuzzy match
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
    }

    return mappings
  }, [])

  // Validate row
  const validateRow = useCallback(
    async (rowData: Record<string, any>, rowNumber: number, existingCNPs: Set<string>, currentProfile?: ImportProfile): Promise<ValidationResult> => {
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

      // Optional: CNP validation (warning only, cnp_hash can be null)
      if (rowData.cnp) {
        const cnpValidation = validateCNP(rowData.cnp.toString().trim())
        if (!cnpValidation.valid) {
          warnings.push(cnpValidation.error || 'CNP invalid')
        }

        // Check for duplicates in this import batch
        if (existingCNPs.has(rowData.cnp.toString().trim())) {
          warnings.push('CNP duplicat în fișier')
        }

        // Check for existing in database by cnp_hash
        try {
          const supabase = createSupabaseBrowser()
          const cnpHash = await hashCNP(rowData.cnp.toString().trim())
          const { data: existing } = await supabase
            .from('employees')
            .select('id')
            .eq('organization_id', selectedOrgId)
            .eq('cnp_hash', cnpHash)
            .maybeSingle()

          if (existing) {
            warnings.push('CNP există deja în organizație (va fi actualizat)')
          }
        } catch (e) {
          console.error('Error checking cnp_hash in DB:', e)
        }
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

      // Optional: COR code format
      if (rowData.cor_code && !/^\d{6}$/.test(rowData.cor_code.toString().trim())) {
        warnings.push('Cod COR ar trebui să aibă 6 cifre')
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      }
    },
    [selectedOrgId]
  )

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
      let detectedHeaderRow = 1

      if (fileExt === 'csv') {
        // Parse CSV with Papa Parse - first parse without header to check rows
        const text = await uploadedFile.text()
        const parsedNoHeader = Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
          dynamicTyping: false,
          delimitersToGuess: [',', ';', '\t', '|'],
        })

        const rows = parsedNoHeader.data as any[][]

        if (rows.length >= 2) {
          // Smart header detection: check if row 1 has many nulls and row 2 has mostly values
          const row1 = rows[0] || []
          const row2 = rows[1] || []

          // Use max columns across both rows for accurate null percentage
          const maxCols = Math.max(row1.length, row2.length, 1)
          const row1NonNull = row1.filter((cell: any) => cell && cell.toString().trim() !== '').length
          const row2NonNull = row2.filter((cell: any) => cell && cell.toString().trim() !== '').length
          const row1NullPercent = (maxCols - row1NonNull) / maxCols
          const row2NullPercent = (maxCols - row2NonNull) / maxCols

          // If row 1 has >50% nulls AND row 2 has <20% nulls, use row 2 as headers
          if (row1NullPercent > 0.5 && row2NullPercent < 0.2) {
            detectedHeaderRow = 2
            // Re-parse with row 2 as header
            const parsed = Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              dynamicTyping: false,
              delimitersToGuess: [',', ';', '\t', '|'],
              transformHeader: (header: string, index: number) => {
                // Use row 2 values as headers
                return row2[index]?.toString().trim() || header
              },
            })
            // Skip first data row (which is the merged header row)
            jsonData = (parsed.data as any[]).slice(1)
            detectedColumns = row2.map((cell: any) => cell?.toString().trim() || '').filter((col: string) => col !== '')
          } else {
            // Normal case: row 1 is headers
            const parsed = Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              dynamicTyping: false,
              delimitersToGuess: [',', ';', '\t', '|'],
            })
            jsonData = parsed.data as any[]
            detectedColumns = parsed.meta.fields || []
          }
        } else {
          // Single row file
          const parsed = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            delimitersToGuess: [',', ';', '\t', '|'],
          })
          jsonData = parsed.data as any[]
          detectedColumns = parsed.meta.fields || []
        }
      } else if (fileExt === 'json') {
        // Parse JSON
        const text = await uploadedFile.text()
        const data = JSON.parse(text)
        jsonData = Array.isArray(data) ? data : [data]
        detectedColumns = Object.keys(jsonData[0] || {})
      } else {
        // Parse Excel/ODS (SheetJS) - with smart header detection
        const data = await uploadedFile.arrayBuffer()
        const workbook = XLSX.read(data, { type: 'array', header: 1 })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }) as any[][]

        if (rawRows.length >= 2) {
          const row1 = rawRows[0] || []
          const row2 = rawRows[1] || []

          // Use max columns across both rows for accurate null percentage
          const maxCols = Math.max(row1.length, row2.length, 1)
          const row1NonNull = row1.filter((cell: any) => cell && cell.toString().trim() !== '').length
          const row2NonNull = row2.filter((cell: any) => cell && cell.toString().trim() !== '').length
          const row1NullPercent = (maxCols - row1NonNull) / maxCols
          const row2NullPercent = (maxCols - row2NonNull) / maxCols

          // If row 1 has >50% nulls AND row 2 has <20% nulls, use row 2 as headers
          if (row1NullPercent > 0.5 && row2NullPercent < 0.2) {
            detectedHeaderRow = 2
            // Use row 2 as headers, data starts from row 3
            const headers = row2.map((cell: any) => cell?.toString().trim() || '').filter((col: string) => col !== '')
            const dataRows = rawRows.slice(2)
            jsonData = dataRows.map((row: any[]) => {
              const obj: any = {}
              headers.forEach((header: string, index: number) => {
                obj[header] = row[index] || ''
              })
              return obj
            })
            detectedColumns = headers
          } else {
            // Normal case: row 1 is headers
            jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false })
            detectedColumns = Object.keys(jsonData[0] || {})
          }
        } else {
          // Single row file
          jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false })
          detectedColumns = Object.keys(jsonData[0] || {})
        }
      }

      if (jsonData.length === 0) {
        alert('Fișierul este gol sau nu conține date valide')
        return
      }

      setRawData(jsonData)
      setColumns(detectedColumns)
      setHeaderRow(detectedHeaderRow)

      // Move to profile selection
      setStep(2)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Eroare la citirea fișierului. Verificați formatul.')
    }
  }

  // Step 2: Profile selected → auto-map
  const handleProfileSelect = (selectedProfile: ImportProfile) => {
    setProfile(selectedProfile)

    // Auto-detect mapping based on profile
    const detected = autoDetectMapping(columns, selectedProfile)
    setMappings(detected)

    // If REGES profile, skip to validation (auto-mapped)
    if (selectedProfile === 'reges-salariati' || selectedProfile === 'reges-contracte') {
      handleMappingComplete(detected, selectedProfile)
    } else {
      // Manual: show mapping step
      setStep(3)
    }
  }

  // Step 3: Complete mapping
  const handleMappingComplete = (mappingsToUse?: ColumnMapping[], profileUsed?: ImportProfile) => {
    const finalMappings = mappingsToUse || mappings
    const finalProfile = profileUsed || profile

    const mapped = rawData.map((row) => {
      const mappedData: Record<string, any> = {}
      const transformations: Record<string, { transformed: boolean; original: any; warning?: string }> = {}

      finalMappings.forEach((mapping) => {
        if (mapping.sourceColumn && mapping.sourceColumn !== '—') {
          const rawValue = row[mapping.sourceColumn]

          // Apply transformations for REGES profiles
          if (finalProfile === 'reges-salariati' || finalProfile === 'reges-contracte') {
            const transformed = transformValue(mapping.sourceColumn, rawValue, finalProfile)
            mappedData[mapping.targetField] = transformed.value
            if (transformed.transformed || transformed.warning) {
              transformations[mapping.targetField] = {
                transformed: transformed.transformed,
                original: rawValue,
                warning: transformed.warning,
              }
            }
          } else {
            // Manual profile: no transformations
            mappedData[mapping.targetField] = rawValue
          }
        }
      })

      // For REGES Contracte: collect L153 fields (cols 35-47) into l153_data JSON
      if (finalProfile === 'reges-contracte') {
        const l153Data: Record<string, any> = {}
        L153_FIELDS.forEach((fieldName) => {
          const val = row[fieldName]
          if (val !== undefined && val !== null && val.toString().trim() !== '') {
            l153Data[fieldName] = val.toString().trim()
          }
        })
        if (Object.keys(l153Data).length > 0) {
          mappedData.l153_data = l153Data
        }
      }

      // Collect non-standard fields into _metadata for DB storage
      const standardFields = new Set([
        'first_name', 'last_name', 'cnp', 'job_title', 'department',
        'hire_date', 'contract_end_date', 'email', 'phone', 'cor_code',
        'cor_title', 'contract_number', 'contract_type', 'status',
      ])
      const extraMeta: Record<string, any> = {}
      Object.entries(mappedData).forEach(([key, value]) => {
        if (
          !standardFields.has(key) &&
          key !== '_transformations' &&
          key !== '_metadata' &&
          key !== 'l153_data' &&
          value !== null &&
          value !== undefined &&
          value.toString().trim() !== ''
        ) {
          extraMeta[key] = value
        }
      })
      if (Object.keys(extraMeta).length > 0) {
        mappedData._metadata = extraMeta
      }

      // Store transformations metadata
      if (Object.keys(transformations).length > 0) {
        mappedData._transformations = transformations
      }

      return mappedData
    })

    // Validate all rows
    const cnpSet = new Set<string>()
    Promise.all(
      mapped.map(async (data, index) => {
        const validation = await validateRow(data, index + headerRow + 1, cnpSet, finalProfile)
        if (data.cnp) cnpSet.add(data.cnp.toString().trim())
        return {
          rowNumber: index + headerRow + 1,
          data,
          validation,
        }
      })
    ).then((validated) => {
      setImportRows(validated)
      setStep(4)
    })
  }

  // Step 4: Start import
  const handleStartImport = async () => {
    setStep(5)
    setImporting(true)

    const supabase = createSupabaseBrowser()
    const validRows = importRows.filter((row) => row.validation.valid)
    const total = validRows.length
    let success = 0
    let failed = 0
    const errorDetails: any[] = []

    setImportStats({ success: 0, failed: 0, total })

    // Batch upsert in chunks of 50
    const chunkSize = 50
    for (let i = 0; i < validRows.length; i += chunkSize) {
      const chunk = validRows.slice(i, i + chunkSize)

      const inserts = await Promise.all(
        chunk.map(async (row) => {
          // Build full_name from last_name + first_name
          const lastName = row.data.last_name?.toString().trim() || ''
          const firstName = row.data.first_name?.toString().trim() || ''
          const fullName = [lastName, firstName].filter(Boolean).join(' ')

          // Hash CNP → cnp_hash (null if no CNP)
          const cnpRaw = row.data.cnp?.toString().trim() || null
          const cnpHash = cnpRaw ? await hashCNP(cnpRaw) : null

          // Compute is_active and termination_date from status
          const statusValue = row.data.status?.toString().toLowerCase() || 'activ'
          const isActive = statusValue === 'activ'
          let terminationDate: string | null = null
          if (!isActive) {
            const statusOriginal = row.data._transformations?.status?.original?.toString() || ''
            if (statusOriginal.startsWith('Încetat:') || statusOriginal.startsWith('Incetat:')) {
              const datePart = statusOriginal.replace(/^(Încetat|Incetat):\s*/, '').trim()
              const parsed = parseDate(datePart)
              if (parsed) terminationDate = parsed.toISOString().split('T')[0]
            }
          }

          return {
            organization_id: selectedOrgId,
            full_name: fullName,
            cnp_hash: cnpHash,
            nationality: row.data.nationality?.toString().trim() || null,
            job_title: row.data.job_title?.toString().trim() || null,
            department: row.data.department?.toString().trim() || null,
            hire_date: row.data.hire_date
              ? parseDate(row.data.hire_date.toString())?.toISOString().split('T')[0] ?? null
              : null,
            email: row.data.email?.toString().trim() || null,
            phone: row.data.phone?.toString().trim() || null,
            cor_code: row.data.cor_code?.toString().trim() || null,
            is_active: isActive,
            termination_date: terminationDate,
          }
        })
      )

      const { error } = await supabase
        .from('employees')
        .upsert(inserts, { onConflict: 'organization_id,cnp_hash' })

      if (error) {
        console.error('Import chunk error:', error)
        failed += chunk.length
        chunk.forEach((row) => {
          errorDetails.push({
            row: row.rowNumber,
            error: error.message,
          })
        })
      } else {
        success += chunk.length
      }

      setImportProgress(Math.round(((i + chunk.length) / total) * 100))
      setImportStats({ success, failed, total })
    }

    // Log import to import_logs table (non-critical — ignore errors)
    try {
      await supabase.from('import_logs').insert({
        organization_id: selectedOrgId,
        imported_by: user.id,
        profile_used: profile,
        file_name: file?.name || 'unknown',
        file_size_kb: file ? Math.round(file.size / 1024) : 0,
        total_rows: importRows.length,
        imported_rows: success,
        error_rows: failed,
        warning_rows: importRows.filter((r) => r.validation.warnings.length > 0).length,
        error_details: errorDetails,
      })
    } catch (logErr) {
      console.warn('import_logs insert failed (non-critical):', logErr)
    }

    setImporting(false)
  }

  // Update mapping
  const updateMapping = (targetField: string, sourceColumn: string) => {
    setMappings((prev) => prev.map((m) => (m.targetField === targetField ? { ...m, sourceColumn } : m)))
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
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {step > stepNum ? <Check className="h-5 w-5" /> : stepNum}
              </div>
              {stepNum < 5 && (
                <div className={`w-16 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          {/* STEP 1: Upload */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pas 1: Încarcă fișierul</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Acceptăm CSV, Excel (XLSX/XLS), ODS, JSON și XML (REVISAL). Auto-detectăm encoding și format.
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
                  CSV, XLSX, XLS, ODS, JSON, XML (max 10 MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.ods,.json,.xml"
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
                      {(file.size / 1024).toFixed(1)} KB · {rawData.length} rânduri detectate · Header pe rândul {headerRow}
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
                          {columns.slice(0, 6).map((col) => (
                            <th
                              key={col}
                              className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {rawData.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            {columns.slice(0, 6).map((col) => (
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

          {/* STEP 2: Profile Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Pas 2: Selectează profilul de import
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Alege sursa datelor pentru mapare automată, sau creează o mapare personalizată.
              </p>
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-gray-900 dark:text-white">
                  <strong>REGES Online</strong> este singurul registru oficial din 2025. Exportați din <strong>Utile → Export entitate</strong>.
                </p>
              </div>

              <div className="space-y-4">
                {/* REGES Salariați Profile */}
                <button
                  onClick={() => handleProfileSelect('reges-salariati')}
                  className={`w-full p-6 border-2 rounded-xl text-left transition ${
                    profile === 'reges-salariati'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        REGES Salariați
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Export date personale angajați din REGES Online. 24 coloane - date personale, adresă, handicap, autorizații.
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {REGES_SALARIATI_PROFILE.description}
                      </p>
                    </div>
                    {profile === 'reges-salariati' && <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />}
                  </div>
                </button>

                {/* REGES Contracte Profile */}
                <button
                  onClick={() => handleProfileSelect('reges-contracte')}
                  className={`w-full p-6 border-2 rounded-xl text-left transition ${
                    profile === 'reges-contracte'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                      <FileSpreadsheet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">REGES Contracte</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Export contracte de muncă din REGES Online. 47 coloane - contracte active sau încetate, salarizare, program, COR, L153.
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {REGES_CONTRACTE_PROFILE.description}
                      </p>
                    </div>
                    {profile === 'reges-contracte' && <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                  </div>
                </button>

                {/* Manual Profile */}
                <button
                  onClick={() => handleProfileSelect('manual')}
                  className={`w-full p-6 border-2 rounded-xl text-left transition ${
                    profile === 'manual'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Mapare manuală</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Creează o mapare personalizată. Auto-detectăm câmpurile comune, dar poți ajusta manual fiecare
                        coloană.
                      </p>
                    </div>
                    {profile === 'manual' && <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />}
                  </div>
                </button>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Înapoi
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Column Mapping (Manual only) */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pas 3: Mapare coloane</h2>
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
                    <div
                      key={idx}
                      className="text-xs text-gray-700 dark:text-gray-300 p-2 bg-white dark:bg-gray-800 rounded"
                    >
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
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Înapoi
                </button>
                <button
                  onClick={() => handleMappingComplete()}
                  disabled={mappings.filter((m) => m.required && !m.sourceColumn).length > 0}
                  className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  Validează date
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Validation & Preview */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pas 4: Validare & Preview</h2>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rânduri detectate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{importRows.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Header pe rândul {headerRow}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valide</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {importRows.filter((r) => r.validation.valid).length}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avertizări</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {importRows.filter((r) => r.validation.warnings.length > 0).length}
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Erori</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {importRows.filter((r) => !r.validation.valid).length}
                  </p>
                </div>
              </div>

              {/* Mapping Stats for REGES Profiles */}
              {(profile === 'reges-salariati' || profile === 'reges-contracte') && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Mapare automată
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(mappings.filter((m) => m.sourceColumn && m.sourceColumn !== '').length / mappings.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {mappings.filter((m) => m.sourceColumn && m.sourceColumn !== '').length} / {mappings.length} coloane
                    </p>
                  </div>
                </div>
              )}

              {/* Preview First 5 Rows */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Preview primele 5 rânduri
                </h3>
                <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          #
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Prenume
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Nume
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          CNP
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Funcție
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {importRows.slice(0, 5).map((row) => {
                        const transformations = row.data._transformations || {}
                        return (
                          <tr
                            key={row.rowNumber}
                            className={
                              !row.validation.valid
                                ? 'bg-red-50 dark:bg-red-900/20'
                                : row.validation.warnings.length > 0
                                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                                : ''
                            }
                          >
                            <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.rowNumber}</td>
                            <td className="px-4 py-2">
                              <span
                                className={transformations.first_name?.transformed ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}
                                title={transformations.first_name?.original ? `Original: ${transformations.first_name.original}` : ''}
                              >
                                {row.data.first_name || '—'}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={transformations.last_name?.transformed ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}
                                title={transformations.last_name?.original ? `Original: ${transformations.last_name.original}` : ''}
                              >
                                {row.data.last_name || '—'}
                              </span>
                            </td>
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
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Full Validation List */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Lista completă validare ({importRows.length} rânduri)
                </h3>
                <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          #
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Nume Complet
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          CNP
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Status
                        </th>
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
                              : ''
                          }
                        >
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.rowNumber}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            {row.data.last_name} {row.data.first_name}
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.data.cnp || '—'}</td>
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
              </div>

              <div className="mt-8 flex justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(profile === 'manual' ? 3 : 2)}
                    className="px-6 py-3 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Înapoi
                  </button>
                  <button
                    onClick={() => {
                      setStep(1)
                      setFile(null)
                      setRawData([])
                      setColumns([])
                      setMappings([])
                      setImportRows([])
                      setProfile('manual')
                      setHeaderRow(1)
                    }}
                    className="px-6 py-3 rounded-lg text-sm font-semibold border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Import nou
                  </button>
                </div>
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

          {/* STEP 5: Import Progress */}
          {step === 5 && (
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
                      ✅ {importStats.success} importați cu succes
                    </p>
                    {importStats.failed > 0 && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        ❌ {importStats.failed} ignorați (erori)
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Profil: {profile === 'reges-salariati' ? 'REGES Salariați' : profile === 'reges-contracte' ? 'REGES Contracte' : 'Manual'}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setStep(1)
                        setFile(null)
                        setRawData([])
                        setColumns([])
                        setMappings([])
                        setImportRows([])
                        setProfile('manual')
                        setHeaderRow(1)
                        setImporting(false)
                        setImportProgress(0)
                        setImportStats({ success: 0, failed: 0, total: 0 })
                      }}
                      className="px-6 py-3 rounded-lg text-sm font-semibold border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Import nou
                    </button>
                    <button
                      onClick={() => router.push(`/${locale}/dashboard?org=${selectedOrgId}`)}
                      className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Vezi lista angajați
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
