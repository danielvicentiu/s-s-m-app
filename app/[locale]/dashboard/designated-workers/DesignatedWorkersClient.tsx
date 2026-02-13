// app/dashboard/designated-workers/DesignatedWorkersClient.tsx
// Lucrători Desemnați SSM — CRUD complet
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
import { ArrowLeft, UserCheck, Plus, Pencil, Trash2, FileText } from 'lucide-react'
// RBAC: Import hook-uri client-side pentru verificare permisiuni
import { useHasPermission } from '@/hooks/usePermission'

// ========== TYPES ==========

interface DesignatedWorker {
  id: string
  organization_id: string
  employee_name: string
  job_title: string | null
  designation_date: string
  certificate_number: string | null
  certificate_expiry_date: string | null
  certificate_authority: string | null
  responsibilities: string | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
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
  designatedWorkers: DesignatedWorker[]
  employees: Employee[]
  organizations: Organization[]
}

// ========== EMPTY FORM ==========

const emptyForm = {
  organization_id: '',
  employee_id: '',
  employee_name: '',
  job_title: '',
  designation_date: '',
  certificate_number: '',
  certificate_expiry_date: '',
  certificate_authority: '',
  responsibilities: '',
  is_active: true,
  notes: '',
}

// ========== COMPONENT ==========

export default function DesignatedWorkersClient({ user, designatedWorkers, employees, organizations }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // RBAC: Verificare permisiuni pentru butoane CRUD
  const canCreate = useHasPermission('designated_workers', 'create')
  const canUpdate = useHasPermission('designated_workers', 'update')
  const canDelete = useHasPermission('designated_workers', 'delete')

  // State
  const [filterOrg, setFilterOrg] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<DesignatedWorker | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ========== HELPERS ==========

  const now = new Date()

  function getCertificateStatus(expiryDate: string | null): 'valid' | 'expiring' | 'expired' | 'none' {
    if (!expiryDate) return 'none'
    const expiry = new Date(expiryDate)
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return 'expired'
    if (diffDays <= 30) return 'expiring'
    return 'valid'
  }

  function getDaysText(expiryDate: string | null): string {
    if (!expiryDate) return '—'
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

  // ========== FILTERING ==========

  const filtered = designatedWorkers.filter((w) => {
    if (filterOrg !== 'all' && w.organization_id !== filterOrg) return false
    if (filterStatus === 'active' && !w.is_active) return false
    if (filterStatus === 'inactive' && w.is_active) return false
    return true
  })

  // Stats
  const stats = {
    total: designatedWorkers.length,
    active: designatedWorkers.filter((w) => w.is_active).length,
    expiring: designatedWorkers.filter((w) => getCertificateStatus(w.certificate_expiry_date) === 'expiring').length,
    expired: designatedWorkers.filter((w) => getCertificateStatus(w.certificate_expiry_date) === 'expired').length,
  }

  // ========== CRUD HANDLERS ==========

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(worker: DesignatedWorker) {
    setEditingId(worker.id)
    setForm({
      organization_id: worker.organization_id,
      employee_id: '',
      employee_name: worker.employee_name,
      job_title: worker.job_title || '',
      designation_date: worker.designation_date,
      certificate_number: worker.certificate_number || '',
      certificate_expiry_date: worker.certificate_expiry_date || '',
      certificate_authority: worker.certificate_authority || '',
      responsibilities: worker.responsibilities || '',
      is_active: worker.is_active,
      notes: worker.notes || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.organization_id || !form.employee_name || !form.designation_date) {
      alert('Completează câmpurile obligatorii: organizație, nume angajat, data desemnării')
      return
    }

    setFormLoading(true)

    try {
      const payload = {
        organization_id: form.organization_id,
        employee_name: form.employee_name,
        job_title: form.job_title || null,
        designation_date: form.designation_date,
        certificate_number: form.certificate_number || null,
        certificate_expiry_date: form.certificate_expiry_date || null,
        certificate_authority: form.certificate_authority || null,
        responsibilities: form.responsibilities || null,
        is_active: form.is_active,
        notes: form.notes || null,
      }

      if (editingId) {
        const { error } = await supabase
          .from('designated_workers')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('designated_workers')
          .insert([payload])

        if (error) throw error
      }

      setShowForm(false)
      router.refresh()
    } catch (error: any) {
      console.error('Error saving designated worker:', error)
      alert('Eroare la salvare: ' + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleteLoading(true)

    try {
      const { error } = await supabase
        .from('designated_workers')
        .delete()
        .eq('id', deleteTarget.id)

      if (error) throw error

      setDeleteTarget(null)
      router.refresh()
    } catch (error: any) {
      console.error('Error deleting designated worker:', error)
      alert('Eroare la ștergere: ' + error.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  async function generateDecision(workerId: string) {
    alert('Funcționalitate în dezvoltare: Generare decizie de desemnare')
    // TODO: Implementare generare PDF decizie desemnare
  }

  // ========== TABLE COLUMNS ==========

  const columns: Column<DesignatedWorker>[] = [
    {
      key: 'employee_name',
      label: 'Nume Angajat',
      render: (w) => (
        <div>
          <div className="font-medium text-gray-900">{w.employee_name}</div>
          {w.job_title && <div className="text-sm text-gray-500">{w.job_title}</div>}
        </div>
      ),
    },
    {
      key: 'organization_id',
      label: 'Organizație',
      render: (w) => (
        <div className="text-sm">
          <div className="font-medium text-gray-700">{w.organizations?.name || '—'}</div>
          {w.organizations?.cui && <div className="text-gray-500">CUI: {w.organizations.cui}</div>}
        </div>
      ),
    },
    {
      key: 'designation_date',
      label: 'Data Desemnare',
      render: (w) => <span className="text-sm text-gray-900">{fmtDate(w.designation_date)}</span>,
    },
    {
      key: 'certificate_expiry_date',
      label: 'Atestat Valabil Până La',
      render: (w) => {
        const certStatus = getCertificateStatus(w.certificate_expiry_date)
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{fmtDate(w.certificate_expiry_date)}</div>
            {certStatus !== 'none' && (
              <StatusBadge
                status={certStatus === 'valid' ? 'valid' : certStatus === 'expiring' ? 'expiring' : 'expired'}
                label={getDaysText(w.certificate_expiry_date)}
              />
            )}
          </div>
        )
      },
    },
    {
      key: 'responsibilities',
      label: 'Atribuții',
      render: (w) => (
        <div className="text-sm text-gray-600 max-w-xs truncate" title={w.responsibilities || '—'}>
          {w.responsibilities || '—'}
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (w) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            w.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${w.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
          {w.is_active ? 'Activ' : 'Inactiv'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (w) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateDecision(w.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Generare decizie"
          >
            <FileText className="h-4 w-4" />
          </button>
          {canUpdate && (
            <button
              onClick={() => openEdit(w)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editează"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteTarget(w)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Înapoi la Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lucrători Desemnați SSM</h1>
                <p className="text-sm text-gray-500">
                  {stats.total} {stats.total === 1 ? 'lucrător desemnat' : 'lucrători desemnați'} • {stats.active} {stats.active === 1 ? 'activ' : 'activi'}
                </p>
              </div>
            </div>

            {canCreate && (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Adaugă Lucrător Desemnat
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Activi</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Atestare Expiră Curând</div>
            <div className="text-2xl font-bold text-orange-600">{stats.expiring}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Atestare Expirată</div>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizație</label>
              <select
                value={filterOrg}
                onChange={(e) => setFilterOrg(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toate organizațiile</option>
                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toate</option>
                <option value="active">Activi</option>
                <option value="inactive">Inactivi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState
              icon={UserCheck}
              title="Niciun lucrător desemnat"
              description={
                filterOrg !== 'all' || filterStatus !== 'all'
                  ? 'Nu există lucrători desemnați care să corespundă filtrelor selectate'
                  : 'Adaugă primul lucrător desemnat SSM'
              }
              actionLabel={canCreate && filterOrg === 'all' && filterStatus === 'all' ? 'Adaugă Lucrător' : undefined}
              onAction={canCreate ? openCreate : undefined}
            />
          ) : (
            <DataTable columns={columns} data={filtered} />
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title={editingId ? 'Editează Lucrător Desemnat' : 'Adaugă Lucrător Desemnat'}
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSave}
          loading={formLoading}
        >
          {/* Organizație */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organizație *</label>
            <select
              value={form.organization_id}
              onChange={(e) => setForm((f) => ({ ...f, organization_id: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="">Selectează organizația</option>
              {organizations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.cui})
                </option>
              ))}
            </select>
          </div>

          {/* Nume + Funcție */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nume Angajat *</label>
              <input
                type="text"
                value={form.employee_name}
                onChange={(e) => setForm((f) => ({ ...f, employee_name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Ex: Popescu Ion"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funcție</label>
              <input
                type="text"
                value={form.job_title}
                onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Ex: Inginer SSM"
              />
            </div>
          </div>

          {/* Data desemnare */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Desemnare *</label>
            <input
              type="date"
              value={form.designation_date}
              onChange={(e) => setForm((f) => ({ ...f, designation_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          {/* Atestat număr + dată expirare */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Număr Atestat</label>
              <input
                type="text"
                value={form.certificate_number}
                onChange={(e) => setForm((f) => ({ ...f, certificate_number: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Ex: SSM-12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valabil Până La</label>
              <input
                type="date"
                value={form.certificate_expiry_date}
                onChange={(e) => setForm((f) => ({ ...f, certificate_expiry_date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
          </div>

          {/* Autoritate emitentă */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autoritate Emitentă Atestat</label>
            <input
              type="text"
              value={form.certificate_authority}
              onChange={(e) => setForm((f) => ({ ...f, certificate_authority: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Ex: Inspectoratul Teritorial de Muncă București"
            />
          </div>

          {/* Atribuții */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Atribuții</label>
            <textarea
              value={form.responsibilities}
              onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
              placeholder="Ex: Monitorizare echipamente protecție, instruire personal, raportare incidente"
            />
          </div>

          {/* Activ */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Activ
            </label>
          </div>

          {/* Observații */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
              placeholder="Notițe adiționale"
            />
          </div>
        </FormModal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Șterge Lucrător Desemnat"
          message={`Ești sigur că vrei să ștergi lucrătorul desemnat "${deleteTarget.employee_name}"? Această acțiune este permanentă.`}
          confirmLabel="Șterge"
          cancelLabel="Anulează"
          isDestructive={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
