'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Tabs } from '@/components/ui/Tabs'
import { DataTable, DataTableColumn } from '@/components/ui/DataTable'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  User,
  GraduationCap,
  Heart,
  ShieldCheck,
  FileText,
  ArrowLeft,
  Edit2,
  Save,
  X,
  Loader2
} from 'lucide-react'
import type { Employee, MedicalRecord, TrainingSession, Document } from '@/lib/types'

interface EmployeeDetailData {
  employee: Employee
  trainings: TrainingSession[]
  medicalRecords: MedicalRecord[]
  equipment: any[]
  documents: Document[]
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.id as string

  const [data, setData] = useState<EmployeeDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState<Partial<Employee>>({})
  const [saving, setSaving] = useState(false)

  // Fetch employee data
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch employee details
        const employeeRes = await fetch(`/api/employees/${employeeId}`)
        if (!employeeRes.ok) {
          throw new Error('Angajat negăsit')
        }
        const employeeData = await employeeRes.json()

        // TODO: Fetch related data when endpoints are ready
        // For now, using empty arrays
        setData({
          employee: employeeData.data,
          trainings: [],
          medicalRecords: [],
          equipment: [],
          documents: []
        })

        setEditedEmployee(employeeData.data)
      } catch (err: any) {
        console.error('Error fetching employee:', err)
        setError(err.message || 'Eroare la încărcarea datelor')
      } finally {
        setLoading(false)
      }
    }

    if (employeeId) {
      fetchEmployeeData()
    }
  }, [employeeId])

  // Save employee changes
  const handleSave = async () => {
    if (!editedEmployee || !data) return

    try {
      setSaving(true)
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedEmployee)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Eroare la salvare')
      }

      const result = await res.json()
      setData({ ...data, employee: result.data })
      setIsEditing(false)
    } catch (err: any) {
      alert(err.message || 'Eroare la salvare')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (data) {
      setEditedEmployee(data.employee)
    }
    setIsEditing(false)
  }

  // Personal Info Section
  const renderPersonalInfo = () => {
    if (!data) return null

    const employee = isEditing ? editedEmployee : data.employee

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Informații Personale</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Editează
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Anulează
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvează
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nume Complet
            </label>
            {isEditing ? (
              <input
                type="text"
                value={employee.full_name || ''}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{employee.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funcție
            </label>
            {isEditing ? (
              <input
                type="text"
                value={employee.job_title || ''}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, job_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{employee.job_title || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cod COR
            </label>
            {isEditing ? (
              <input
                type="text"
                value={employee.cor_code || ''}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, cor_code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{employee.cor_code || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departament
            </label>
            {isEditing ? (
              <input
                type="text"
                value={employee.department || ''}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{employee.department || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={employee.email || ''}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{employee.email || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={employee.phone || ''}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{employee.phone || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Angajării
            </label>
            {isEditing ? (
              <input
                type="date"
                value={employee.hire_date || ''}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, hire_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">
                {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('ro-RO') : '—'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip Angajare
            </label>
            {isEditing ? (
              <select
                value={employee.employment_type || ''}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, employment_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectează</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contractor">Contractor</option>
                <option value="intern">Intern</option>
                <option value="other">Altul</option>
              </select>
            ) : (
              <p className="text-gray-900">
                {employee.employment_type ?
                  employee.employment_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) :
                  '—'
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div>
              <StatusBadge status={employee.is_active ? 'active' : 'inactive'} />
            </div>
          </div>

          {employee.notes && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              {isEditing ? (
                <textarea
                  value={employee.notes || ''}
                  onChange={(e) => setEditedEmployee({ ...editedEmployee, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{employee.notes}</p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Trainings History Table
  const renderTrainingsTable = () => {
    if (!data) return null

    const columns: DataTableColumn<TrainingSession>[] = [
      {
        key: 'started_at',
        label: 'Data',
        render: (row) => new Date(row.started_at).toLocaleDateString('ro-RO'),
        width: '120px'
      },
      {
        key: 'module_id',
        label: 'Modul',
        width: '200px'
      },
      {
        key: 'progress_percent',
        label: 'Progres',
        render: (row) => `${row.progress_percent}%`,
        width: '100px'
      },
      {
        key: 'quiz_score',
        label: 'Scor',
        render: (row) => row.quiz_score ? `${row.quiz_score}%` : '—',
        width: '100px'
      },
      {
        key: 'passed',
        label: 'Status',
        render: (row) => (
          <StatusBadge
            status={row.passed ? 'active' : row.completed_at ? 'expired' : 'pending'}
            label={row.passed ? 'Promovat' : row.completed_at ? 'Respins' : 'În curs'}
          />
        ),
        width: '140px'
      }
    ]

    return (
      <DataTable
        columns={columns}
        data={data.trainings}
        loading={loading}
        emptyMessage="Nu există instruiri înregistrate"
        emptyDescription="Instruirile vor apărea aici după finalizare"
        rowKey={(row) => row.id}
      />
    )
  }

  // Medical History Table
  const renderMedicalTable = () => {
    if (!data) return null

    const columns: DataTableColumn<MedicalRecord>[] = [
      {
        key: 'examination_date',
        label: 'Data Examinării',
        render: (row) => new Date(row.examination_date).toLocaleDateString('ro-RO'),
        width: '140px'
      },
      {
        key: 'examination_type',
        label: 'Tip',
        render: (row) => {
          const types: Record<string, string> = {
            periodic: 'Periodic',
            angajare: 'Angajare',
            reluare: 'Reluare',
            la_cerere: 'La cerere',
            supraveghere: 'Supraveghere'
          }
          return types[row.examination_type] || row.examination_type
        },
        width: '120px'
      },
      {
        key: 'result',
        label: 'Rezultat',
        render: (row) => {
          const variantMap: Record<string, 'success' | 'warning' | 'danger'> = {
            apt: 'success',
            apt_conditionat: 'warning',
            inapt_temporar: 'warning',
            inapt: 'danger'
          }
          const labelMap: Record<string, string> = {
            apt: 'Apt',
            apt_conditionat: 'Apt Condiționat',
            inapt_temporar: 'Inapt Temporar',
            inapt: 'Inapt'
          }
          return (
            <Badge
              variant={variantMap[row.result]}
              label={labelMap[row.result] || row.result}
            />
          )
        },
        width: '140px'
      },
      {
        key: 'expiry_date',
        label: 'Valabil până',
        render: (row) => new Date(row.expiry_date).toLocaleDateString('ro-RO'),
        width: '140px'
      },
      {
        key: 'clinic_name',
        label: 'Clinică',
        render: (row) => row.clinic_name || '—',
        width: '180px'
      }
    ]

    return (
      <DataTable
        columns={columns}
        data={data.medicalRecords}
        loading={loading}
        emptyMessage="Nu există examene medicale înregistrate"
        emptyDescription="Examenele medicale vor apărea aici după adăugare"
        rowKey={(row) => row.id}
      />
    )
  }

  // Equipment Distribution Table
  const renderEquipmentTable = () => {
    if (!data) return null

    return (
      <EmptyState
        icon={ShieldCheck}
        title="Nu există EIP distribuit"
        description="Echipamentele individuale de protecție distribuite vor apărea aici"
      />
    )
  }

  // Documents Table
  const renderDocumentsTable = () => {
    if (!data) return null

    const columns: DataTableColumn<Document>[] = [
      {
        key: 'created_at',
        label: 'Data',
        render: (row) => new Date(row.created_at).toLocaleDateString('ro-RO'),
        width: '120px'
      },
      {
        key: 'title',
        label: 'Titlu',
        width: '300px'
      },
      {
        key: 'document_type',
        label: 'Tip',
        render: (row) => {
          const types: Record<string, string> = {
            fisa_medicina_muncii: 'Fișă Medicină Muncii',
            fisa_echipamente: 'Fișă Echipamente',
            fisa_instruire: 'Fișă Instruire',
            certificat_training: 'Certificat Training',
            altul: 'Altul'
          }
          return types[row.document_type] || row.document_type
        },
        width: '180px'
      },
      {
        key: 'file_size_bytes',
        label: 'Dimensiune',
        render: (row) => {
          if (!row.file_size_bytes) return '—'
          const kb = row.file_size_bytes / 1024
          if (kb < 1024) return `${kb.toFixed(1)} KB`
          return `${(kb / 1024).toFixed(1)} MB`
        },
        width: '100px'
      }
    ]

    return (
      <DataTable
        columns={columns}
        data={data.documents}
        loading={loading}
        emptyMessage="Nu există documente asociate"
        emptyDescription="Documentele generate pentru acest angajat vor apărea aici"
        rowKey={(row) => row.id}
      />
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Se încarcă datele angajatului...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <EmptyState
            icon={<User className="w-12 h-12 text-gray-400" />}
            title={error || 'Angajat negăsit'}
            description="Nu am putut încărca datele angajatului"
          >
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Înapoi
            </button>
          </EmptyState>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      id: 'personal',
      label: 'Informații Personale',
      icon: <User className="w-4 h-4" />,
      content: renderPersonalInfo()
    },
    {
      id: 'trainings',
      label: 'Istoric Instruiri',
      icon: <GraduationCap className="w-4 h-4" />,
      count: data.trainings.length,
      content: renderTrainingsTable()
    },
    {
      id: 'medical',
      label: 'Istoric Medical',
      icon: <Heart className="w-4 h-4" />,
      count: data.medicalRecords.length,
      content: renderMedicalTable()
    },
    {
      id: 'equipment',
      label: 'EIP Distribuit',
      icon: <ShieldCheck className="w-4 h-4" />,
      count: data.equipment.length,
      content: renderEquipmentTable()
    },
    {
      id: 'documents',
      label: 'Documente',
      icon: <FileText className="w-4 h-4" />,
      count: data.documents.length,
      content: renderDocumentsTable()
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la angajați
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {data.employee.full_name}
              </h1>
              <p className="text-gray-600 mt-1">
                {data.employee.job_title || 'Fără funcție specificată'}
              </p>
            </div>
            <StatusBadge status={data.employee.is_active ? 'active' : 'inactive'} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="personal" />
      </div>
    </div>
  )
}
