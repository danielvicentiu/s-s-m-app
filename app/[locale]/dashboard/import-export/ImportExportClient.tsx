// app/[locale]/dashboard/import-export/ImportExportClient.tsx
'use client'

import { useState, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface ImportExportClientProps {
  user: { email: string }
  organizations: any[]
  stats: {
    employees: number
    equipment: number
    trainings: number
  }
  locale: string
}

type ImportType = 'employees' | 'equipment' | 'trainings'
type ExportType = 'full_pdf' | 'employees_csv' | 'trainings_csv' | 'backup_json'

export default function ImportExportClient({ user, organizations, stats, locale }: ImportExportClientProps) {
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [selectedOrg, setSelectedOrg] = useState(organizations[0]?.id || '')

  const employeesFileRef = useRef<HTMLInputElement>(null)
  const equipmentFileRef = useRef<HTMLInputElement>(null)
  const trainingsFileRef = useRef<HTMLInputElement>(null)

  const supabase = createSupabaseBrowser()

  // Download CSV template
  const downloadTemplate = (type: ImportType) => {
    let csv = ''
    let filename = ''

    switch (type) {
      case 'employees':
        csv = 'Nume Complet,CNP,Functie,Email,Telefon,Data Angajare,Departament\n'
        csv += 'Ion Popescu,1234567890123,Manager,ion@example.com,0721234567,2024-01-15,IT\n'
        csv += 'Maria Ionescu,9876543210987,Developer,maria@example.com,0729876543,2024-02-01,IT'
        filename = 'template_angajati.csv'
        break
      case 'equipment':
        csv = 'Tip Echipament,Descriere,Locatie,Serie,Data Verificare,Data Expirare,Inspector,Conform\n'
        csv += 'stingator,Stingator 6kg,Hol parter,SN12345,2024-01-15,2025-01-15,Inspect SRL,da\n'
        csv += 'trusa_prim_ajutor,Trusa sanitara,Birou 101,SN67890,2024-02-01,2025-02-01,MedServ,da'
        filename = 'template_echipamente.csv'
        break
      case 'trainings':
        csv = 'Nume Angajat,Tip Instruire,Data Instruire,Data Expirare,Instructor,Durata (ore),Status\n'
        csv += 'Ion Popescu,ssm_general,2024-01-15,2025-01-15,Dan Instructor,4,finalizat\n'
        csv += 'Maria Ionescu,psi,2024-02-01,2025-02-01,Dan Instructor,2,finalizat'
        filename = 'template_instruiri.csv'
        break
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()

    setMessage({ type: 'success', text: `Template ${filename} descărcat cu succes!` })
    setTimeout(() => setMessage(null), 3000)
  }

  // Parse CSV file
  const parseCSV = (text: string): string[][] => {
    const lines = text.trim().split('\n')
    return lines.map(line => {
      const values: string[] = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      return values
    })
  }

  // Import CSV
  const handleImport = async (type: ImportType, file: File) => {
    if (!selectedOrg) {
      setMessage({ type: 'error', text: 'Selectează o organizație!' })
      return
    }

    setImporting(true)
    setProgress(0)
    setMessage(null)

    try {
      const text = await file.text()
      const rows = parseCSV(text)
      const headers = rows[0]
      const dataRows = rows.slice(1).filter(row => row.some(cell => cell.trim()))

      let successCount = 0
      const totalRows = dataRows.length

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i]
        setProgress(Math.round(((i + 1) / totalRows) * 100))

        try {
          switch (type) {
            case 'employees':
              await supabase.from('employees').insert({
                organization_id: selectedOrg,
                full_name: row[0] || '',
                cnp: row[1] || null,
                job_title: row[2] || null,
                email: row[3] || null,
                phone: row[4] || null,
                hire_date: row[5] || null,
                department: row[6] || null,
                is_active: true
              })
              break

            case 'equipment':
              await supabase.from('safety_equipment').insert({
                organization_id: selectedOrg,
                equipment_type: row[0] || 'altul',
                description: row[1] || null,
                location: row[2] || null,
                serial_number: row[3] || null,
                last_inspection_date: row[4] || null,
                expiry_date: row[5] || new Date().toISOString().split('T')[0],
                inspector_name: row[6] || null,
                is_compliant: row[7]?.toLowerCase() === 'da' || row[7]?.toLowerCase() === 'yes',
                content_version: 1,
                legal_basis_version: '2024-v1'
              })
              break

            case 'trainings':
              await supabase.from('safety_trainings').insert({
                organization_id: selectedOrg,
                employee_name: row[0] || '',
                training_type: row[1] || 'ssm_general',
                training_date: row[2] || new Date().toISOString().split('T')[0],
                expiry_date: row[3] || null,
                instructor_name: row[4] || null,
                duration_hours: parseFloat(row[5]) || null,
                status: row[6] || 'planificat',
                content_version: 1,
                legal_basis_version: '2024-v1'
              })
              break
          }
          successCount++
        } catch (err) {
          console.error(`Eroare linia ${i + 2}:`, err)
        }
      }

      setMessage({
        type: 'success',
        text: `Import finalizat! ${successCount} din ${totalRows} înregistrări adăugate.`
      })
    } catch (error) {
      console.error('Import error:', error)
      setMessage({ type: 'error', text: 'Eroare la importul fișierului CSV!' })
    } finally {
      setImporting(false)
      setProgress(0)
    }
  }

  // Export functionality
  const handleExport = async (type: ExportType) => {
    if (!selectedOrg) {
      setMessage({ type: 'error', text: 'Selectează o organizație!' })
      return
    }

    setExporting(true)
    setMessage(null)

    try {
      switch (type) {
        case 'employees_csv':
          const { data: employees } = await supabase
            .from('employees')
            .select('*')
            .eq('organization_id', selectedOrg)

          if (employees && employees.length > 0) {
            let csv = 'Nume Complet,CNP,Functie,Email,Telefon,Data Angajare,Departament,Activ\n'
            employees.forEach((emp: any) => {
              csv += `"${emp.full_name}","${emp.cnp || ''}","${emp.job_title || ''}","${emp.email || ''}","${emp.phone || ''}","${emp.hire_date || ''}","${emp.department || ''}","${emp.is_active ? 'Da' : 'Nu'}"\n`
            })

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `angajati_${new Date().toISOString().split('T')[0]}.csv`
            link.click()

            setMessage({ type: 'success', text: `Exportat ${employees.length} angajați!` })
          } else {
            setMessage({ type: 'error', text: 'Nu există angajați de exportat!' })
          }
          break

        case 'trainings_csv':
          const { data: trainings } = await supabase
            .from('safety_trainings')
            .select('*')
            .eq('organization_id', selectedOrg)

          if (trainings && trainings.length > 0) {
            let csv = 'Nume Angajat,Tip Instruire,Data,Data Expirare,Instructor,Durata (h),Status\n'
            trainings.forEach((t: any) => {
              csv += `"${t.employee_name}","${t.training_type}","${t.training_date}","${t.expiry_date || ''}","${t.instructor_name || ''}","${t.duration_hours || ''}","${t.status}"\n`
            })

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `instruiri_${new Date().toISOString().split('T')[0]}.csv`
            link.click()

            setMessage({ type: 'success', text: `Exportat ${trainings.length} instruiri!` })
          } else {
            setMessage({ type: 'error', text: 'Nu există instruiri de exportat!' })
          }
          break

        case 'backup_json':
          const [empRes, eqRes, trRes] = await Promise.all([
            supabase.from('employees').select('*').eq('organization_id', selectedOrg),
            supabase.from('safety_equipment').select('*').eq('organization_id', selectedOrg),
            supabase.from('safety_trainings').select('*').eq('organization_id', selectedOrg)
          ])

          const backup = {
            export_date: new Date().toISOString(),
            organization_id: selectedOrg,
            employees: empRes.data || [],
            equipment: eqRes.data || [],
            trainings: trRes.data || []
          }

          const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = `backup_complet_${new Date().toISOString().split('T')[0]}.json`
          link.click()

          setMessage({ type: 'success', text: 'Backup complet exportat cu succes!' })
          break

        case 'full_pdf':
          setMessage({ type: 'error', text: 'Export PDF în dezvoltare. Folosește CSV pentru acum.' })
          break
      }
    } catch (error) {
      console.error('Export error:', error)
      setMessage({ type: 'error', text: 'Eroare la export!' })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">📦 Import / Export Date</h1>
          <p className="text-sm text-gray-500">
            Importă date din CSV sau exportă rapoarte complete în diferite formate
          </p>
        </div>

        {/* Organization selector */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organizație selectată
          </label>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="w-full md:w-96 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.cui || 'fără CUI'})
              </option>
            ))}
          </select>
        </div>

        {/* Progress bar */}
        {importing && progress > 0 && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Import în progres...</span>
              <span className="text-sm font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-blue-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`mb-6 rounded-2xl border p-5 ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-gray-900">{stats.employees}</div>
            <div className="text-sm text-gray-500">Angajați</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-3xl mb-2">🔧</div>
            <div className="text-2xl font-bold text-gray-900">{stats.equipment}</div>
            <div className="text-sm text-gray-500">Echipamente</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gray-900">{stats.trainings}</div>
            <div className="text-sm text-gray-500">Instruiri</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* IMPORT Section */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                📥 Import Date
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Angajați CSV */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">👥 Angajați (CSV)</h3>
                    <p className="text-xs text-gray-500">Import listă angajați din fișier CSV</p>
                  </div>
                  <button
                    onClick={() => downloadTemplate('employees')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📄 Template
                  </button>
                </div>
                <input
                  ref={employeesFileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImport('employees', file)
                  }}
                />
                <button
                  onClick={() => employeesFileRef.current?.click()}
                  disabled={importing || !selectedOrg}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selectează fișier CSV
                </button>
              </div>

              {/* Echipamente CSV */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">🔧 Echipamente (CSV)</h3>
                    <p className="text-xs text-gray-500">Import echipamente PSI/SSM</p>
                  </div>
                  <button
                    onClick={() => downloadTemplate('equipment')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📄 Template
                  </button>
                </div>
                <input
                  ref={equipmentFileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImport('equipment', file)
                  }}
                />
                <button
                  onClick={() => equipmentFileRef.current?.click()}
                  disabled={importing || !selectedOrg}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selectează fișier CSV
                </button>
              </div>

              {/* Instruiri CSV */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">📚 Instruiri (CSV)</h3>
                    <p className="text-xs text-gray-500">Import instruiri SSM/PSI</p>
                  </div>
                  <button
                    onClick={() => downloadTemplate('trainings')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📄 Template
                  </button>
                </div>
                <input
                  ref={trainingsFileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImport('trainings', file)
                  }}
                />
                <button
                  onClick={() => trainingsFileRef.current?.click()}
                  disabled={importing || !selectedOrg}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selectează fișier CSV
                </button>
              </div>
            </div>
          </div>

          {/* EXPORT Section */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                📤 Export Date
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Raport complet PDF */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-1">📄 Raport Complet (PDF)</h3>
                <p className="text-xs text-gray-500 mb-3">Raport complet cu toate datele organizației</p>
                <button
                  onClick={() => handleExport('full_pdf')}
                  disabled={exporting || !selectedOrg}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generează PDF
                </button>
              </div>

              {/* Date angajați CSV */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-1">👥 Date Angajați (CSV)</h3>
                <p className="text-xs text-gray-500 mb-3">Export listă completă angajați</p>
                <button
                  onClick={() => handleExport('employees_csv')}
                  disabled={exporting || !selectedOrg}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Descarcă CSV
                </button>
              </div>

              {/* Date instruiri CSV */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-1">📚 Date Instruiri (CSV)</h3>
                <p className="text-xs text-gray-500 mb-3">Export listă instruiri</p>
                <button
                  onClick={() => handleExport('trainings_csv')}
                  disabled={exporting || !selectedOrg}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Descarcă CSV
                </button>
              </div>

              {/* Backup complet JSON */}
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                <h3 className="font-bold text-purple-900 mb-1">💾 Backup Complet (JSON)</h3>
                <p className="text-xs text-purple-700 mb-3">Backup complet toate datele (angajați, echipamente, instruiri)</p>
                <button
                  onClick={() => handleExport('backup_json')}
                  disabled={exporting || !selectedOrg}
                  className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Descarcă Backup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
