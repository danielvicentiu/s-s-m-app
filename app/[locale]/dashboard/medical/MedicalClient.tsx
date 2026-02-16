// app/dashboard/medical/MedicalClient.tsx
// M2 Medicina Muncii — CRUD complet
// Folosește Component Kit: DataTable, FormModal, StatusBadge, EmptyState, ConfirmDialog
// RBAC: Verificare permisiuni pentru butoane CRUD

'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser as createClient } from '@/lib/supabase/client'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { FormModal } from '@/components/ui/FormModal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ArrowLeft, Stethoscope, Plus, Pencil, Trash2, Download } from 'lucide-react'
// RBAC: Import hook-uri client-side pentru verificare permisiuni
import { useHasPermission } from '@/hooks/usePermission'
import AutoBreadcrumb from '@/components/navigation/AutoBreadcrumb'  // 🆕 Breadcrumb

// ========== TYPES ==========

interface MedicalExam {
  id: string
  organization_id: string
  employee_id: string | null
  employee_name: string
  cnp_hash: string | null
  job_title: string | null
  examination_type: string
  examination_date: string
  expiry_date: string
  result: string
  restrictions: string | null
  doctor_name: string | null
  clinic_name: string | null
  notes: string | null
  content_version: number
  legal_basis_version: string
  location_id: string | null
  organizations?: { name: string; cui: string }
}

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  organization_id: string
  organizations?: { name: string } | { name: string }[]
}

interface Organization {
  id: string
  name: string
  cui: string
}

interface Props {
  user: { id: string; email: string }
  medicalExams: MedicalExam[]
  employees: Employee[]
  organizations: Organization[]
}

// ========== EMPTY FORM ==========

const emptyForm = {
  organization_id: '',
  employee_id: '',
  employee_name: '',
  job_title: '',
  examination_type: 'periodic',
  examination_date: '',
  expiry_date: '',
  result: 'apt',
  restrictions: '',
  doctor_name: '',
  clinic_name: '',
  notes: '',
}

// ========== COMPONENT ==========

export default function MedicalClient({ user, medicalExams, employees, organizations }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // RBAC: Verificare permisiuni pentru butoane CRUD
  const canCreate = useHasPermission('medical', 'create')
  const canUpdate = useHasPermission('medical', 'update')
  const canDelete = useHasPermission('medical', 'delete')

  // State
  const [filterOrg, setFilterOrg] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<MedicalExam | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ========== HELPERS ==========

  const now = new Date()

  function getStatus(expiryDate: string): 'valid' | 'expiring' | 'expired' {
    const expiry = new Date(expiryDate)
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return 'expired'
    if (diffDays <= 30) return 'expiring'
    return 'valid'
  }

  function getDaysText(expiryDate: string): string {
    const expiry = new Date(expiryDate)
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return `Expirat ${Math.abs(diffDays)} zile`
    if (diffDays <= 30) return `Expiră în ${diffDays} zile`
    return `Valid ${diffDays} zile`
  }

  function fmtDate(d: string | null): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const examTypes: Record<string, string> = {
    periodic: 'Periodic',
    angajare: 'Angajare',
    adaptare: 'Adaptare',
    reluare: 'Reluare',
    la_cerere: 'La cerere',
  }

  const resultTypes: Record<string, string> = {
    apt: 'Apt',
    apt_conditionat: 'Apt condiționat',
    inapt_temporar: 'Inapt temporar',
    inapt: 'Inapt',
  }

  // ========== FILTERING ==========

  const filtered = medicalExams.filter((m) => {
    if (filterOrg !== 'all' && m.organization_id !== filterOrg) return false
    if (filterStatus !== 'all' && getStatus(m.expiry_date) !== filterStatus) return false
    return true
  })

  // Stats
  const stats = {
    total: medicalExams.length,
    expired: medicalExams.filter((m) => getStatus(m.expiry_date) === 'expired').length,
    expiring: medicalExams.filter((m) => getStatus(m.expiry_date) === 'expiring').length,
    valid: medicalExams.filter((m) => getStatus(m.expiry_date) === 'valid').length,
  }

  // ========== FORM HANDLERS ==========

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(exam: MedicalExam) {
    setEditingId(exam.id)
    setForm({
      organization_id: exam.organization_id,
      employee_id: exam.employee_id || '',
      employee_name: exam.employee_name || '',
      job_title: exam.job_title || '',
      examination_type: exam.examination_type,
      examination_date: exam.examination_date || '',
      expiry_date: exam.expiry_date || '',
      result: exam.result || 'apt',
      restrictions: exam.restrictions || '',
      doctor_name: exam.doctor_name || '',
      clinic_name: exam.clinic_name || '',
      notes: exam.notes || '',
    })
    setShowForm(true)
  }

  // Auto-fill employee name + job when selecting employee
  function handleEmployeeSelect(employeeId: string) {
    const emp = employees.find((e) => e.id === employeeId)
    if (emp) {
      setForm((f) => ({
        ...f,
        employee_id: employeeId,
        employee_name: emp.full_name,
        job_title: emp.job_title || f.job_title,
        organization_id: emp.organization_id || f.organization_id,
      }))
    } else {
      setForm((f) => ({ ...f, employee_id: employeeId }))
    }
  }

  async function handleSubmit() {
    try {
      setFormLoading(true)

      const payload = {
        organization_id: form.organization_id || null,
        employee_id: form.employee_id || null,
        employee_name: form.employee_name,
        job_title: form.job_title || null,
        examination_type: form.examination_type,
        examination_date: form.examination_date || null,
        expiry_date: form.expiry_date || null,
        result: form.result,
        restrictions: form.restrictions || null,
        doctor_name: form.doctor_name || null,
        clinic_name: form.clinic_name || null,
        notes: form.notes || null,
        updated_at: new Date().toISOString(),
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
      setForm(emptyForm)
      router.refresh()
    } catch (err) {
      console.error('[MEDICAL] Save error:', err)
      alert('Eroare la salvare. Verifică datele și încearcă din nou.')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete() {
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

  const columns: Column<MedicalExam>[] = [
    {
      key: 'employee_name',
      label: 'Angajat',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.employee_name || '—'}</div>
          <div className="text-xs text-gray-400">{row.organizations?.name || ''}</div>
        </div>
      ),
    },
    {
      key: 'job_title',
      label: 'Funcție',
      render: (row) => <span className="text-sm text-gray-600">{row.job_title || '—'}</span>,
    },
    {
      key: 'examination_type',
      label: 'Tip',
      render: (row) => (
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
          {examTypes[row.examination_type] || row.examination_type}
        </span>
      ),
    },
    {
      key: 'examination_date',
      label: 'Data examinare',
      render: (row) => <span className="text-sm text-gray-600">{fmtDate(row.examination_date)}</span>,
    },
    {
      key: 'expiry_date',
      label: 'Expiră',
      render: (row) => <span className="text-sm text-gray-600">{fmtDate(row.expiry_date)}</span>,
    },
    {
      key: 'result',
      label: 'Rezultat',
      render: (row) => {
        const colors: Record<string, string> = {
          apt: 'bg-green-50 text-green-700',
          apt_conditionat: 'bg-yellow-50 text-yellow-700',
          inapt_temporar: 'bg-orange-50 text-orange-700',
          inapt: 'bg-red-50 text-red-700',
        }
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[row.result] || 'bg-gray-50 text-gray-700'}`}>
            {resultTypes[row.result] || row.result}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (row) => (
        <StatusBadge
          status={getStatus(row.expiry_date)}
          label={getDaysText(row.expiry_date)}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          {/* RBAC: Buton "Editează" vizibil doar dacă user are permisiune 'update' pe 'medical' */}
          {canUpdate && (
            <button
              onClick={() => openEdit(row)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"
              title="Editează"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {/* RBAC: Buton "Șterge" vizibil doar dacă user are permisiune 'delete' pe 'medical' */}
          {canDelete && (
            <button
              onClick={() => setDeleteTarget(row)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"
              title="Șterge"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                Medicina Muncii
              </h1>
              <p className="text-sm text-gray-400">Fișe de aptitudine — management complet</p>
            </div>
          </div>
          {/* RBAC: Buton "Adaugă" vizibil doar dacă user are permisiune 'create' pe 'medical' */}
          {canCreate && (
            <button
              onClick={openAdd}
              className="bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adaugă fișă
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6 space-y-5">

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-black text-gray-900">{stats.total}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Total fișe</div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
            <div className="text-3xl font-black text-red-600">{stats.expired}</div>
            <div className="text-xs font-semibold text-red-500 uppercase tracking-widest mt-1">Expirate</div>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 text-center">
            <div className="text-3xl font-black text-orange-500">{stats.expiring}</div>
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mt-1">Expiră &lt;30 zile</div>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
            <div className="text-3xl font-black text-green-600">{stats.valid}</div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">Valide</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterOrg}
            onChange={(e) => setFilterOrg(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="all">Toate organizațiile</option>
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>{o.name} ({o.cui})</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="all">Toate statusurile</option>
            <option value="expired">Expirate</option>
            <option value="expiring">Expiră curând</option>
            <option value="valid">Valide</option>
          </select>
        </div>

        {/* TABLE or EMPTY STATE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.length === 0 && medicalExams.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="Nicio fișă medicală"
              description="Adaugă prima fișă de aptitudine pentru angajați."
              actionLabel="+ Adaugă fișă"
              onAction={openAdd}
            />
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage="Nicio fișă corespunde filtrelor selectate."
              pageSize={15}
            />
          )}
        </div>
      </main>

      {/* ========== FORM MODAL ========== */}
      <FormModal
        title={editingId ? 'Editează fișa medicală' : 'Adaugă fișă medicală'}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
        onSubmit={handleSubmit}
        loading={formLoading}
        submitLabel={editingId ? 'Salvează modificările' : 'Adaugă fișa'}
      >
        {/* Organizație */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organizație *</label>
          <select
            value={form.organization_id}
            onChange={(e) => setForm((f) => ({ ...f, organization_id: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Selectează organizația</option>
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>{o.name} ({o.cui})</option>
            ))}
          </select>
        </div>

        {/* Angajat — dropdown sau manual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Angajat</label>
          <select
            value={form.employee_id}
            onChange={(e) => handleEmployeeSelect(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="">Selectează sau completează manual ↓</option>
            {employees
              .filter((e) => !form.organization_id || e.organization_id === form.organization_id)
              .map((e) => (
                <option key={e.id} value={e.id}>{e.full_name} — {e.job_title || 'fără funcție'}</option>
              ))}
          </select>
        </div>

        {/* Nume angajat (manual) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume angajat *</label>
            <input
              type="text"
              value={form.employee_name}
              onChange={(e) => setForm((f) => ({ ...f, employee_name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Popescu Ion"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Funcție</label>
            <input
              type="text"
              value={form.job_title}
              onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Operator CNC"
            />
          </div>
        </div>

        {/* Tip + Rezultat */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tip examinare *</label>
            <select
              value={form.examination_type}
              onChange={(e) => setForm((f) => ({ ...f, examination_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              {Object.entries(examTypes).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rezultat *</label>
            <select
              value={form.result}
              onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              {Object.entries(resultTypes).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data examinare *</label>
            <input
              type="date"
              value={form.examination_date}
              onChange={(e) => setForm((f) => ({ ...f, examination_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data expirare *</label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
        </div>

        {/* Doctor + Clinică */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <input
              type="text"
              value={form.doctor_name}
              onChange={(e) => setForm((f) => ({ ...f, doctor_name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Dr. Ionescu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinică</label>
            <input
              type="text"
              value={form.clinic_name}
              onChange={(e) => setForm((f) => ({ ...f, clinic_name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Policlinica Sănătatea"
            />
          </div>
        </div>

        {/* Restricții */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Restricții</label>
          <input
            type="text"
            value={form.restrictions}
            onChange={(e) => setForm((f) => ({ ...f, restrictions: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Ex: fără efort fizic intens, fără lucru la înălțime"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
            placeholder="Note suplimentare..."
          />
        </div>
      </FormModal>

      {/* ========== DELETE CONFIRM ========== */}
      <ConfirmDialog
        title="Șterge fișa medicală"
        message={`Sigur vrei să ștergi fișa pentru "${deleteTarget?.employee_name || ''}"? Acțiunea este ireversibilă.`}
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
