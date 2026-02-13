// ============================================================
// S-S-M.RO — CSV Export Service
// File: lib/services/export-csv.ts
// Funcții pentru export CSV: angajați, instruiri, fișe medicale, echipamente
// ============================================================

import type { MedicalExamination, SafetyEquipment } from '@/lib/types'

// ============================================================
// TYPES
// ============================================================

interface Employee {
  id: string
  full_name: string
  cnp_hash?: string | null
  job_title?: string | null
  department?: string | null
  hire_date?: string | null
  employment_type?: string | null
  is_active?: boolean
  email?: string | null
  phone?: string | null
  created_at?: string
}

interface Training {
  id: string
  worker_name?: string
  employee_name?: string
  module_title?: string
  training_title?: string
  session_date?: string
  training_date?: string
  duration_minutes?: number
  instructor_name?: string
  test_score?: number | null
  verification_result?: string
  status?: string
  next_due_date?: string | null
}

// ============================================================
// HELPER: Generare și download CSV
// ============================================================

function downloadCSV(filename: string, csvContent: string): void {
  const BOM = '\uFEFF' // UTF-8 BOM pentru Excel
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return ''

  const stringValue = String(value)

  // Escape double quotes și wrap în quotes dacă conține virgulă, newline sau quote
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

function arrayToCSV(headers: string[], rows: string[][]): string {
  const headerRow = headers.map(escapeCSVValue).join(',')
  const dataRows = rows.map(row => row.map(escapeCSVValue).join(','))
  return [headerRow, ...dataRows].join('\n')
}

// ============================================================
// FORMAT HELPERS
// ============================================================

function formatDate(date: string | null | undefined): string {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('ro-RO')
  } catch {
    return date
  }
}

function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return ''
  return value ? 'Da' : 'Nu'
}

// ============================================================
// EXPORT: ANGAJAȚI (Employees)
// ============================================================

export function exportEmployeesCSV(
  employees: Employee[],
  organizationName?: string
): void {
  const headers = [
    'Nume complet',
    'CNP (hash)',
    'Funcție',
    'Departament',
    'Data angajării',
    'Tip contract',
    'Status',
    'Email',
    'Telefon',
    'Data înregistrării'
  ]

  const rows = employees.map(emp => [
    emp.full_name || '',
    emp.cnp_hash || '',
    emp.job_title || '',
    emp.department || '',
    formatDate(emp.hire_date),
    emp.employment_type || '',
    emp.is_active ? 'Activ' : 'Inactiv',
    emp.email || '',
    emp.phone || '',
    formatDate(emp.created_at)
  ])

  const csvContent = arrayToCSV(headers, rows)
  const timestamp = new Date().toISOString().slice(0, 10)
  const orgPrefix = organizationName ? `${organizationName}_` : ''
  const filename = `${orgPrefix}angajati_${timestamp}.csv`

  downloadCSV(filename, csvContent)
}

// ============================================================
// EXPORT: INSTRUIRI (Trainings)
// ============================================================

export function exportTrainingsCSV(
  trainings: Training[],
  organizationName?: string
): void {
  const headers = [
    'Angajat',
    'Modul instruire',
    'Data instruirii',
    'Durată (min)',
    'Instructor',
    'Scor test',
    'Rezultat verificare',
    'Status',
    'Următoarea verificare'
  ]

  const rows = trainings.map(training => [
    training.worker_name || training.employee_name || '',
    training.module_title || training.training_title || '',
    formatDate(training.session_date || training.training_date),
    String(training.duration_minutes || ''),
    training.instructor_name || '',
    training.test_score !== null && training.test_score !== undefined
      ? `${training.test_score}%`
      : '',
    training.verification_result || '',
    training.status || '',
    formatDate(training.next_due_date)
  ])

  const csvContent = arrayToCSV(headers, rows)
  const timestamp = new Date().toISOString().slice(0, 10)
  const orgPrefix = organizationName ? `${organizationName}_` : ''
  const filename = `${orgPrefix}instruiri_${timestamp}.csv`

  downloadCSV(filename, csvContent)
}

// ============================================================
// EXPORT: FIȘE MEDICALE (Medical Examinations)
// ============================================================

export function exportMedicalCSV(
  examinations: MedicalExamination[],
  organizationName?: string
): void {
  const headers = [
    'Angajat',
    'CNP (hash)',
    'Funcție',
    'Tip examinare',
    'Data examinării',
    'Data expirării',
    'Rezultat',
    'Restricții',
    'Medic',
    'Clinică',
    'Observații',
    'Versiune legislație'
  ]

  const rows = examinations.map(exam => [
    exam.employee_name || '',
    exam.cnp_hash || '',
    exam.job_title || '',
    exam.examination_type || '',
    formatDate(exam.examination_date),
    formatDate(exam.expiry_date),
    exam.result || '',
    exam.restrictions || '',
    exam.doctor_name || '',
    exam.clinic_name || '',
    exam.notes || '',
    exam.legal_basis_version || ''
  ])

  const csvContent = arrayToCSV(headers, rows)
  const timestamp = new Date().toISOString().slice(0, 10)
  const orgPrefix = organizationName ? `${organizationName}_` : ''
  const filename = `${orgPrefix}fise_medicale_${timestamp}.csv`

  downloadCSV(filename, csvContent)
}

// ============================================================
// EXPORT: ECHIPAMENTE PSI (Safety Equipment)
// ============================================================

export function exportEquipmentCSV(
  equipment: SafetyEquipment[],
  organizationName?: string
): void {
  const headers = [
    'Tip echipament',
    'Descriere',
    'Locație',
    'Nr. serie',
    'Data ultimei verificări',
    'Data expirării',
    'Data următoarei verificări',
    'Verificator',
    'Conform',
    'Observații',
    'Versiune legislație'
  ]

  const rows = equipment.map(item => [
    item.equipment_type || '',
    item.description || '',
    item.location || '',
    item.serial_number || '',
    formatDate(item.last_inspection_date),
    formatDate(item.expiry_date),
    formatDate(item.next_inspection_date),
    item.inspector_name || '',
    formatBoolean(item.is_compliant),
    item.notes || '',
    item.legal_basis_version || ''
  ])

  const csvContent = arrayToCSV(headers, rows)
  const timestamp = new Date().toISOString().slice(0, 10)
  const orgPrefix = organizationName ? `${organizationName}_` : ''
  const filename = `${orgPrefix}echipamente_${timestamp}.csv`

  downloadCSV(filename, csvContent)
}

// ============================================================
// EXPORT ALL-IN-ONE (opțional)
// ============================================================

export function exportAllData(data: {
  employees?: Employee[]
  trainings?: Training[]
  medical?: MedicalExamination[]
  equipment?: SafetyEquipment[]
}, organizationName?: string): void {
  const timestamp = new Date().toISOString().slice(0, 10)
  const orgPrefix = organizationName ? `${organizationName}_` : ''

  if (data.employees && data.employees.length > 0) {
    exportEmployeesCSV(data.employees, organizationName)
  }

  if (data.trainings && data.trainings.length > 0) {
    exportTrainingsCSV(data.trainings, organizationName)
  }

  if (data.medical && data.medical.length > 0) {
    exportMedicalCSV(data.medical, organizationName)
  }

  if (data.equipment && data.equipment.length > 0) {
    exportEquipmentCSV(data.equipment, organizationName)
  }
}
