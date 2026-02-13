// app/[locale]/dashboard/medical/MedicalPageClient.tsx
// Pagină Examene Medicale — Management complet medicina muncii
// Features: Stats, Filtre, Search, Tabel cu join employee, Status badges

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { FormModal } from '@/components/ui/FormModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  Stethoscope,
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react'
import { getExpiryStatus, getDaysUntilExpiry } from '@/lib/types'

// ========== TYPES ==========

interface MedicalExam {
  id: string
  organization_id: string
  employee_id: string | null
  employee_name: string
  cnp_hash: string | null
  job_title: string | null
  examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
  examination_date: string
  expiry_date: string
  result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
  restrictions: string | null
  doctor_name: string | null
  clinic_name: string | null
  notes: string | null
  employees?: {
    id: string
    full_name: string
    job_title: string | null
  } | null
  organizations?: {
    name: string
    cui: string | null
  } | null
}

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  organization_id: string
}

interface Organization {
  id: string
  name: string
  cui: string | null
}

interface Props {
  medicalExams: MedicalExam[]
  employees: Employee[]
  organizations: Organization[]
}

// ========== CONSTANTS ==========

const EXAM_TYPES = {
  periodic: 'Periodic',
  angajare: 'Angajare',
  reluare: 'Reluare',
  la_cerere: 'La cerere',
  supraveghere: 'Supraveghere'
}

const RESULT_TYPES = {
  apt: 'Apt',
  apt_conditionat: 'Apt condiționat',
  inapt_temporar: 'Inapt temporar',
  inapt: 'Inapt'
}

const EMPTY_FORM = {
  organization_id: '',
  employee_id: '',
  employee_name: '',
  job_title: '',
  examination_type: 'periodic' as const,
  examination_date: '',
  expiry_date: '',
  result: 'apt' as const,
  restrictions: '',
  doctor_name: '',
  clinic_name: '',
  notes: ''
}

// ========== MAIN COMPONENT ==========

export default function MedicalPageClient({ medicalExams, employees, organizations }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOrg, setFilterOrg] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<MedicalExam | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ========== HELPERS ==========

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusLabel = (expiryDate: string): string => {
    const days = getDaysUntilExpiry(expiryDate)
    if (days < 0) return `Expirat (${Math.abs(days)} zile)`
    if (days === 0) return 'Expiră azi'
    if (days <= 30) return `Expiră în ${days} zile`
    return `Valid (${days} zile)`
  }

  const getNextExamDate = (expiryDate: string): string => {
    const expiry = new Date(expiryDate)
    const next = new Date(expiry)
    next.setFullYear(expiry.getFullYear() + 1)
    return formatDate(next.toISOString())
  }

  // ========== FILTERING & STATS ==========

  const filteredExams = useMemo(() => {
    return medicalExams.filter((exam) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const employeeName = exam.employee_name?.toLowerCase() || ''
        const jobTitle = exam.job_title?.toLowerCase() || ''
        const doctorName = exam.doctor_name?.toLowerCase() || ''
        const clinicName = exam.clinic_name?.toLowerCase() || ''

        if (
          !employeeName.includes(query) &&
          !jobTitle.includes(query) &&
          !doctorName.includes(query) &&
          !clinicName.includes(query)
        ) {
          return false
        }
      }

      // Organization filter
      if (filterOrg !== 'all' && exam.organization_id !== filterOrg) {
        return false
      }

      // Status filter
      if (filterStatus !== 'all') {
        const status = getExpiryStatus(exam.expiry_date)
        if (status !== filterStatus) return false
      }

      // Type filter
      if (filterType !== 'all' && exam.examination_type !== filterType) {
        return false
      }

      return true
    })
  }, [medicalExams, searchQuery, filterOrg, filterStatus, filterType])

  const stats = useMemo(() => {
    const total = medicalExams.length
    const expired = medicalExams.filter(e => getExpiryStatus(e.expiry_date) === 'expired').length
    const expiring = medicalExams.filter(e => getExpiryStatus(e.expiry_date) === 'expiring').length
    const valid = medicalExams.filter(e => getExpiryStatus(e.expiry_date) === 'valid').length

    return { total, expired, expiring, valid }
  }, [medicalExams])

  // ========== FORM HANDLERS ==========

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (exam: MedicalExam) => {
    setEditingId(exam.id)
    setForm({
      organization_id: exam.organization_id,
      employee_id: exam.employee_id || '',
      employee_name: exam.employee_name,
      job_title: exam.job_title || '',
      examination_type: exam.examination_type,
      examination_date: exam.examination_date,
      expiry_date: exam.expiry_date,
      result: exam.result,
      restrictions: exam.restrictions || '',
      doctor_name: exam.doctor_name || '',
      clinic_name: exam.clinic_name || '',
      notes: exam.notes || ''
    })
    setShowForm(true)
  }

  const handleEmployeeSelect = (employeeId: string) => {
    if (!employeeId) {
      setForm(f => ({ ...f, employee_id: '', employee_name: '', job_title: '' }))
      return
    }

    const employee = employees.find(e => e.id === employeeId)
    if (employee) {
      setForm(f => ({
        ...f,
        employee_id: employeeId,
        employee_name: employee.full_name,
        job_title: employee.job_title || '',
        organization_id: employee.organization_id
      }))
    }
  }

  const handleSubmit = async () => {
    if (!form.organization_id || !form.employee_name || !form.examination_date || !form.expiry_date) {
      alert('Completează câmpurile obligatorii: Organizație, Angajat, Data examinare, Data expirare')
      return
    }

    try {
      setFormLoading(true)

      const payload = {
        organization_id: form.organization_id,
        employee_id: form.employee_id || null,
        employee_name: form.employee_name,
        job_title: form.job_title || null,
        examination_type: form.examination_type,
        examination_date: form.examination_date,
        expiry_date: form.expiry_date,
        result: form.result,
        restrictions: form.restrictions || null,
        doctor_name: form.doctor_name || null,
        clinic_name: form.clinic_name || null,
        notes: form.notes || null,
        content_version: 1,
        legal_basis_version: 'OMS 1.1.2024',
        updated_at: new Date().toISOString()
      }

      if (editingId) {
        const { error } = await supabase
          .from('medical_examinations')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('medical_examinations')
          .insert(payload)

        if (error) throw error
      }

      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      router.refresh()
    } catch (err) {
      console.error('[MEDICAL] Save error:', err)
      alert('Eroare la salvare. Verifică datele și încearcă din nou.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setDeleteLoading(true)
      const { error } = await supabase
        .from('medical_examinations')
        .delete()
        .eq('id', deleteTarget.id)

      if (error) throw error

      setDeleteTarget(null)
      router.refresh()
    } catch (err) {
      console.error('[MEDICAL] Delete error:', err)
      alert('Eroare la ștergere.')
    } finally {
      setDeleteLoading(false)
    }
  }

  // ========== TABLE COLUMNS ==========

  const columns: DataTableColumn<MedicalExam>[] = [
    {
      key: 'employee',
      label: 'Angajat',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.employees?.full_name || row.employee_name}
          </div>
          <div className="text-xs text-gray-500">
            {row.organizations?.name}
          </div>
        </div>
      )
    },
    {
      key: 'examination_type',
      label: 'Tip examen',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {EXAM_TYPES[row.examination_type]}
        </span>
      )
    },
    {
      key: 'examination_date',
      label: 'Data examinare',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          {formatDate(row.examination_date)}
        </div>
      )
    },
    {
      key: 'doctor_name',
      label: 'Medic',
      render: (row) => (
        <div className="text-sm">
          <div className="text-gray-900">{row.doctor_name || '—'}</div>
          {row.clinic_name && (
            <div className="text-xs text-gray-500">{row.clinic_name}</div>
          )}
        </div>
      )
    },
    {
      key: 'result',
      label: 'Rezultat',
      render: (row) => {
        const colors = {
          apt: 'bg-green-50 text-green-700 border-green-200',
          apt_conditionat: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          inapt_temporar: 'bg-orange-50 text-orange-700 border-orange-200',
          inapt: 'bg-red-50 text-red-700 border-red-200'
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[row.result]}`}>
            {RESULT_TYPES[row.result]}
          </span>
        )
      }
    },
    {
      key: 'next_exam',
      label: 'Următorul examen',
      sortable: true,
      render: (row) => (
        <div className="text-sm text-gray-600">
          {getNextExamDate(row.expiry_date)}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (row) => (
        <StatusBadge
          status={getExpiryStatus(row.expiry_date)}
          label={getStatusLabel(row.expiry_date)}
        />
      )
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition"
            title="Editează"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition"
            title="Șterge"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Examene Medicale</h1>
                <p className="text-sm text-gray-500">Management medicina muncii</p>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Programează examen
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-green-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Valide</p>
                <p className="text-3xl font-bold text-green-700 mt-1">{stats.valid}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Expiră &lt;30 zile</p>
                <p className="text-3xl font-bold text-orange-700 mt-1">{stats.expiring}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Expirate</p>
                <p className="text-3xl font-bold text-red-700 mt-1">{stats.expired}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Caută angajat, medic, clinică..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Organization filter */}
            <select
              value={filterOrg}
              onChange={(e) => setFilterOrg(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toate organizațiile</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toate statusurile</option>
              <option value="valid">Valide</option>
              <option value="expiring">Expiră curând</option>
              <option value="expired">Expirate</option>
            </select>

            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toate tipurile</option>
              {Object.entries(EXAM_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {filteredExams.length === 0 && medicalExams.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="Niciun examen medical"
              description="Programează primul examen medical pentru angajații tăi."
              actionLabel="+ Programează examen"
              onAction={openAdd}
            />
          ) : filteredExams.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Niciun rezultat"
              description="Niciun examen nu corespunde filtrelor selectate."
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredExams}
              emptyMessage="Niciun examen găsit"
            />
          )}
        </div>
      </main>

      {/* ========== FORM MODAL ========== */}
      <FormModal
        title={editingId ? 'Editează examen medical' : 'Programează examen medical'}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingId(null)
          setForm(EMPTY_FORM)
        }}
        onSubmit={handleSubmit}
        loading={formLoading}
        submitLabel={editingId ? 'Salvează modificările' : 'Programează examen'}
      >
        <div className="space-y-4">
          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Organizație <span className="text-red-500">*</span>
            </label>
            <select
              value={form.organization_id}
              onChange={(e) => setForm(f => ({ ...f, organization_id: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selectează organizația</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name} {org.cui ? `(${org.cui})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Employee select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Angajat din sistem
            </label>
            <select
              value={form.employee_id}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selectează angajat sau completează manual ↓</option>
              {employees
                .filter(e => !form.organization_id || e.organization_id === form.organization_id)
                .map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} {emp.job_title ? `— ${emp.job_title}` : ''}
                  </option>
                ))}
            </select>
          </div>

          {/* Employee name & job title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nume angajat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.employee_name}
                onChange={(e) => setForm(f => ({ ...f, employee_name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Popescu Ion"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Funcție
              </label>
              <input
                type="text"
                value={form.job_title}
                onChange={(e) => setForm(f => ({ ...f, job_title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Inginer"
              />
            </div>
          </div>

          {/* Type & Result */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tip examen <span className="text-red-500">*</span>
              </label>
              <select
                value={form.examination_type}
                onChange={(e) => setForm(f => ({ ...f, examination_type: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(EXAM_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Rezultat <span className="text-red-500">*</span>
              </label>
              <select
                value={form.result}
                onChange={(e) => setForm(f => ({ ...f, result: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(RESULT_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Data examinare <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.examination_date}
                onChange={(e) => setForm(f => ({ ...f, examination_date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Data expirare <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.expiry_date}
                onChange={(e) => setForm(f => ({ ...f, expiry_date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Doctor & Clinic */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Medic
              </label>
              <input
                type="text"
                value={form.doctor_name}
                onChange={(e) => setForm(f => ({ ...f, doctor_name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. Ionescu Maria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Clinică
              </label>
              <input
                type="text"
                value={form.clinic_name}
                onChange={(e) => setForm(f => ({ ...f, clinic_name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Policlinica Centrală"
              />
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Restricții
            </label>
            <input
              type="text"
              value={form.restrictions}
              onChange={(e) => setForm(f => ({ ...f, restrictions: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: fără efort fizic intens"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Observații
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Note suplimentare..."
            />
          </div>
        </div>
      </FormModal>

      {/* ========== DELETE CONFIRM ========== */}
      <ConfirmDialog
        title="Șterge examen medical"
        message={`Sigur vrei să ștergi examenul medical pentru "${deleteTarget?.employee_name || ''}"? Acțiunea este ireversibilă.`}
        confirmLabel="Șterge definitiv"
        isOpen={deleteTarget !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isDestructive={true}
        loading={deleteLoading}
      />
    </div>
  )
}
