// app/documents/generate/DocumentGeneratorClient.tsx
// UI Generator Documente SSM — Client Component

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Download,
  ArrowLeft,
  BookOpen,
  ClipboardList,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

interface Organization {
  id: string
  name: string
  cui: string | null
  address: string | null
  county: string | null
}

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  cor_code: string | null
  organization_id: string
  organizations?: { name: string } | { name: string }[]
}

interface Props {
  user: { id: string; email?: string }
  organizations: Organization[]
  employees: Employee[]
}

type DocumentType = 'fisa_instruire' | 'tematica_instruire' | 'fisa_post'

const DOCUMENT_TYPES = [
  {
    key: 'fisa_instruire' as DocumentType,
    label: 'Fișă de Instruire Individuală',
    description: 'Document de instruire SSM/PSI pentru angajat individual',
    icon: FileText,
    color: 'blue',
    disabled: false,
  },
  {
    key: 'tematica_instruire' as DocumentType,
    label: 'Tematică de Instruire',
    description: 'Program de instruire SSM cu teme și durată',
    icon: BookOpen,
    color: 'purple',
    disabled: false,
  },
  {
    key: 'fisa_post' as DocumentType,
    label: 'Fișă de Post SSM',
    description: 'Fișă de post cu riscuri și măsuri de protecție',
    icon: ClipboardList,
    color: 'green',
    disabled: false,
  },
]

export default function DocumentGeneratorClient({ organizations, employees }: Props) {
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null)
  const [selectedOrg, setSelectedOrg] = useState<string>('')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Filtrare angajați după organizație
  const filteredEmployees = selectedOrg
    ? employees.filter((emp) => emp.organization_id === selectedOrg)
    : employees

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!selectedType) {
        throw new Error('Selectează tipul de document')
      }

      if (selectedType === 'fisa_instruire') {
        // Pentru Fișă de Instruire, redirecționează la pagina de training
        window.location.href = '/dashboard/training'
        return
      }

      if (!selectedEmployee) {
        throw new Error('Selectează un angajat')
      }

      const employee = employees.find((e) => e.id === selectedEmployee)
      if (!employee) {
        throw new Error('Angajat negăsit')
      }

      const org = organizations.find((o) => o.id === employee.organization_id)

      let endpoint = ''
      let filename = ''

      if (selectedType === 'tematica_instruire') {
        endpoint = '/api/generate-tematica'
        filename = `Tematica_Instruire_${employee.full_name.replace(/\s+/g, '_')}.pdf`
      } else if (selectedType === 'fisa_post') {
        endpoint = '/api/generate-fisa-post'
        filename = `Fisa_Post_${employee.full_name.replace(/\s+/g, '_')}.pdf`
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employee.id,
          employee_name: employee.full_name,
          job_title: employee.job_title || 'Nedefinit',
          cor_code: employee.cor_code || '',
          organization_id: employee.organization_id,
          organization_name: org?.name || 'Organizație',
          organization_cui: org?.cui || '',
          organization_address: org?.address || '',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la generare document')
      }

      // Download PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccess(`Document generat: ${filename}`)
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message || 'Eroare la generare document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-7 w-7 text-blue-600" />
                Generator Documente SSM
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Generează documente SSM obligatorii pentru angajați
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{organizations.length}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Organizații
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <div className="text-3xl font-black text-green-600">{employees.length}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                Angajați
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6 space-y-6">
        {/* SUCCESS/ERROR */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* SELECTARE TIP DOCUMENT */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">1. Selectează Tipul de Document</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DOCUMENT_TYPES.map((docType) => {
              const Icon = docType.icon
              const isSelected = selectedType === docType.key
              const colorClass = {
                blue: 'border-blue-500 bg-blue-50',
                purple: 'border-purple-500 bg-purple-50',
                green: 'border-green-500 bg-green-50',
              }[docType.color]

              return (
                <button
                  key={docType.key}
                  onClick={() => !docType.disabled && setSelectedType(docType.key)}
                  disabled={docType.disabled}
                  className={`
                    p-4 rounded-xl border-2 text-left transition
                    ${isSelected ? colorClass : 'border-gray-200 bg-white hover:border-gray-300'}
                    ${docType.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-6 w-6 ${isSelected ? `text-${docType.color}-600` : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{docType.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{docType.description}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* SELECTARE ORGANIZAȚIE */}
        {selectedType && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">2. Selectează Organizația</h2>
            <select
              value={selectedOrg}
              onChange={(e) => {
                setSelectedOrg(e.target.value)
                setSelectedEmployee('')
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toate organizațiile ({employees.length} angajați)</option>
              {organizations.map((org) => {
                const empCount = employees.filter((e) => e.organization_id === org.id).length
                return (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui && `(CUI: ${org.cui})`} — {empCount} angajați
                  </option>
                )
              })}
            </select>
          </div>
        )}

        {/* SELECTARE ANGAJAT */}
        {selectedType && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">3. Selectează Angajatul</h2>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selectează angajat ({filteredEmployees.length} disponibili)</option>
              {filteredEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} {emp.job_title && `— ${emp.job_title}`} {emp.cor_code && `(COR: ${emp.cor_code})`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* BUTON GENERARE */}
        {selectedType && (
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading || (!selectedEmployee && selectedType !== 'fisa_instruire')}
              className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                'Se generează...'
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Generează Document
                </>
              )}
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!selectedType && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              Selectează un tip de document pentru a începe generarea
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
