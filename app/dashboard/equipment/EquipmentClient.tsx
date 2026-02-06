// app/dashboard/equipment/EquipmentClient.tsx
// M5 Echipamente PSI — CRUD complet cu Component Kit
// Pattern identic cu MedicalClient.tsx

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser as createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ArrowLeft, Plus, Pencil, Trash2, Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Props {
  user: { email: string }
  organizations: any[]
  equipment: any[]
}

const EQUIPMENT_TYPES = [
  { value: 'stingator', label: 'Stingător' },
  { value: 'trusa_prim_ajutor', label: 'Trusă prim ajutor' },
  { value: 'hidrant', label: 'Hidrant' },
  { value: 'detector_fum', label: 'Detector fum' },
  { value: 'iluminat_urgenta', label: 'Iluminat urgență' },
]

function fmtEquipType(t: string): string {
  return EQUIPMENT_TYPES.find(et => et.value === t)?.label || t
}

function fmtDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getStatus(expiryDate: string): { status: 'expired' | 'expiring' | 'valid'; days: number } {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return { status: 'expired', days: Math.abs(diffDays) }
  if (diffDays <= 30) return { status: 'expiring', days: diffDays }
  return { status: 'valid', days: diffDays }
}

export default function EquipmentClient({ user, organizations, equipment: initialEquipment }: Props) {
  const [equipment, setEquipment] = useState(initialEquipment)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOrg, setFilterOrg] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  // Sort
  const [sortField, setSortField] = useState<string>('expiry_date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Pagination
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Form
  const [form, setForm] = useState({
    organization_id: '',
    equipment_type: 'stingator',
    description: '',
    location: '',
    serial_number: '',
    last_check_date: '',
    expiry_date: '',
  })

  // Stats
  const stats = equipment.reduce((acc: any, e: any) => {
    const { status } = getStatus(e.expiry_date)
    acc[status] = (acc[status] || 0) + 1
    acc.total++
    return acc
  }, { expired: 0, expiring: 0, valid: 0, total: 0 })

  // Filter + Sort + Search
  const filtered = equipment
    .filter((e: any) => {
      if (filterOrg !== 'all' && e.organization_id !== filterOrg) return false
      if (filterType !== 'all' && e.equipment_type !== filterType) return false
      if (filterStatus !== 'all') {
        const { status } = getStatus(e.expiry_date)
        if (filterStatus !== status) return false
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          (e.description || '').toLowerCase().includes(term) ||
          (e.location || '').toLowerCase().includes(term) ||
          (e.serial_number || '').toLowerCase().includes(term) ||
          fmtEquipType(e.equipment_type).toLowerCase().includes(term)
        )
      }
      return true
    })
    .sort((a: any, b: any) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  function SortIcon({ field }: { field: string }) {
    if (sortField !== field) return null
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />
  }

  function openAdd() {
    setEditingId(null)
    setForm({
      organization_id: organizations[0]?.id || '',
      equipment_type: 'stingator',
      description: '',
      location: '',
      serial_number: '',
      last_check_date: '',
      expiry_date: '',
    })
    setShowModal(true)
  }

  function openEdit(e: any) {
    setEditingId(e.id)
    setForm({
      organization_id: e.organization_id,
      equipment_type: e.equipment_type || 'stingator',
      description: e.description || '',
      location: e.location || '',
      serial_number: e.serial_number || '',
      last_check_date: e.last_check_date || '',
      expiry_date: e.expiry_date || '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    const payload = { ...form }

    if (editingId) {
      const { error } = await supabase
        .from('safety_equipment')
        .update(payload)
        .eq('id', editingId)
      if (error) { alert('Eroare: ' + error.message); setLoading(false); return }
    } else {
      const { error } = await supabase
        .from('safety_equipment')
        .insert(payload)
      if (error) { alert('Eroare: ' + error.message); setLoading(false); return }
    }

    // Refresh
    const { data } = await supabase
      .from('safety_equipment')
      .select('*, organizations(name, cui)')
      .order('expiry_date', { ascending: true })
    setEquipment(data || [])
    setShowModal(false)
    setLoading(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('safety_equipment').delete().eq('id', deleteId)

    const { data } = await supabase
      .from('safety_equipment')
      .select('*, organizations(name, cui)')
      .order('expiry_date', { ascending: true })
    setEquipment(data || [])
    setDeleteId(null)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-8 py-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = '/dashboard'} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900">🧯 Echipamente PSI</h1>
              <p className="text-sm text-gray-500">Gestionare stingătoare, truse, hidranți, detectoare</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Adaugă echipament
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 py-4 text-center">
            <div className="text-3xl font-black text-gray-900">{stats.total}</div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total</div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 py-4 text-center">
            <div className="text-3xl font-black text-red-600">{stats.expired}</div>
            <div className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Expirate</div>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-100 py-4 text-center">
            <div className="text-3xl font-black text-orange-500">{stats.expiring}</div>
            <div className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">Expiră &lt;30 zile</div>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-100 py-4 text-center">
            <div className="text-3xl font-black text-green-600">{stats.valid}</div>
            <div className="text-[11px] font-bold text-green-600 uppercase tracking-widest">Valide</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Caută descriere, locație, serie..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterOrg}
              onChange={e => { setFilterOrg(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Toate organizațiile</option>
              {organizations.map((o: any) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Toate tipurile</option>
              {EQUIPMENT_TYPES.map(et => (
                <option key={et.value} value={et.value}>{et.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Toate statusurile</option>
              <option value="expired">Expirate</option>
              <option value="expiring">Expiră curând</option>
              <option value="valid">Valide</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            title="Niciun echipament"
            description="Adaugă primul echipament PSI pentru a începe monitorizarea."
            action={{ label: '+ Adaugă echipament', onClick: openAdd }}
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-4 py-3 cursor-pointer hover:text-gray-600" onClick={() => handleSort('equipment_type')}>
                      Tip <SortIcon field="equipment_type" />
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:text-gray-600" onClick={() => handleSort('description')}>
                      Descriere <SortIcon field="description" />
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:text-gray-600" onClick={() => handleSort('location')}>
                      Locație <SortIcon field="location" />
                    </th>
                    <th className="px-4 py-3">Serie</th>
                    <th className="px-4 py-3 cursor-pointer hover:text-gray-600" onClick={() => handleSort('last_check_date')}>
                      Verificat <SortIcon field="last_check_date" />
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:text-gray-600" onClick={() => handleSort('expiry_date')}>
                      Expiră <SortIcon field="expiry_date" />
                    </th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((e: any) => {
                    const { status, days } = getStatus(e.expiry_date)
                    return (
                      <tr key={e.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                            {fmtEquipType(e.equipment_type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{e.description || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{e.location || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-400 font-mono">{e.serial_number || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{fmtDate(e.last_check_date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{fmtDate(e.expiry_date)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={status} days={days} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600" title="Editează">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteId(e.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600" title="Șterge">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{filtered.length} rezultate</span>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }} className="border border-gray-200 rounded px-2 py-1 text-sm">
                  <option value={10}>10 / pag</option>
                  <option value={25}>25 / pag</option>
                  <option value={50}>50 / pag</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 px-2">{page} / {totalPages || 1}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Editează echipament' : 'Adaugă echipament'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Organizație */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizație *</label>
                <select
                  value={form.organization_id}
                  onChange={e => setForm({ ...form, organization_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {organizations.map((o: any) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              {/* Tip echipament */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tip echipament *</label>
                <select
                  value={form.equipment_type}
                  onChange={e => setForm({ ...form, equipment_type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {EQUIPMENT_TYPES.map(et => (
                    <option key={et.value} value={et.value}>{et.label}</option>
                  ))}
                </select>
              </div>

              {/* Descriere */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descriere / Identificare</label>
                <input
                  type="text"
                  placeholder="ex: Stingător P6, etaj 2, hol principal"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Locație */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locație fizică</label>
                <input
                  type="text"
                  placeholder="ex: Etaj 2, lângă lift"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Număr serie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Număr de serie</label>
                <input
                  type="text"
                  placeholder="ex: SN-2024-00123"
                  value={form.serial_number}
                  onChange={e => setForm({ ...form, serial_number: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ultima verificare *</label>
                  <input
                    type="date"
                    value={form.last_check_date}
                    onChange={e => setForm({ ...form, last_check_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiră la *</label>
                  <input
                    type="date"
                    value={form.expiry_date}
                    onChange={e => setForm({ ...form, expiry_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Anulează
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !form.organization_id || !form.expiry_date}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? 'Salvez...' : editingId ? 'Salvează modificările' : 'Adaugă echipamentul'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Șterge echipamentul?"
        message="Echipamentul va fi șters permanent. Această acțiune nu poate fi anulată."
        confirmLabel="Șterge"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        destructive
      />
    </div>
  )
}
