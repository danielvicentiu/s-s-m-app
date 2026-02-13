// app/dashboard/equipment/EquipmentClient.tsx
// M5 Echipamente PSI — CRUD complet cu Component Kit
// Pattern identic cu MedicalClient.tsx
// RBAC: Verificare permisiuni pentru butoane CRUD

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser as createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ArrowLeft, Plus, Pencil, Trash2, Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
// RBAC: Import hook-uri client-side pentru verificare permisiuni
import { useHasPermission } from '@/hooks/usePermission'

interface Props {
  user: { email: string }
  organizations: any[]
  equipment: any[]
  equipmentTypes: any[]
}

// Hardcoded fallback pentru backward compatibility (dacă DB e gol)
const FALLBACK_EQUIPMENT_TYPES = [
  { value: 'stingator', label: 'Stingător' },
  { value: 'trusa_prim_ajutor', label: 'Trusă prim ajutor' },
  { value: 'hidrant', label: 'Hidrant' },
  { value: 'detector_fum', label: 'Detector fum' },
  { value: 'iluminat_urgenta', label: 'Iluminat urgență' },
]

// ── Stingătoare avizate IGSU România ──
// Conform APSIA / OMAI 88/2012 / SR EN 3-7 / EN 1866-1:2008
// G1 EXCLUS (neconform CE) | G60 EXCLUS (nu apare în APSIA)
// Clasa E ABROGATĂ prin OMAI 138/2015
const EQUIPMENT_MODELS: Record<string, { value: string; label: string; mass: number; classes: string; mobility: string; electricSafe: boolean }[]> = {
  'Pulbere (P)': [
    { value: 'P1',   label: 'P1 — Pulbere ABC 1 kg',    mass: 1,   classes: 'A,B,C', mobility: 'portabil',      electricSafe: true },
    { value: 'P2',   label: 'P2 — Pulbere ABC 2 kg',    mass: 2,   classes: 'A,B,C', mobility: 'portabil',      electricSafe: true },
    { value: 'P3',   label: 'P3 — Pulbere ABC 3 kg',    mass: 3,   classes: 'A,B,C', mobility: 'portabil',      electricSafe: true },
    { value: 'P4',   label: 'P4 — Pulbere ABC 4 kg',    mass: 4,   classes: 'A,B,C', mobility: 'portabil',      electricSafe: true },
    { value: 'P6',   label: 'P6 — Pulbere ABC 6 kg ⭐',  mass: 6,   classes: 'A,B,C', mobility: 'portabil',      electricSafe: true },
    { value: 'P9',   label: 'P9 — Pulbere ABC 9 kg',    mass: 9,   classes: 'A,B,C', mobility: 'portabil',      electricSafe: true },
    { value: 'P12',  label: 'P12 — Pulbere ABC 12 kg',   mass: 12,  classes: 'A,B,C', mobility: 'portabil',      electricSafe: true },
    { value: 'P25',  label: 'P25 — Pulbere ABC 25 kg',   mass: 25,  classes: 'A,B,C', mobility: 'transportabil', electricSafe: true },
    { value: 'P50',  label: 'P50 — Pulbere ABC 50 kg',   mass: 50,  classes: 'A,B,C', mobility: 'transportabil', electricSafe: true },
    { value: 'P100', label: 'P100 — Pulbere ABC 100 kg',  mass: 100, classes: 'A,B,C', mobility: 'transportabil', electricSafe: true },
    { value: 'P150', label: 'P150 — Pulbere ABC 150 kg',  mass: 150, classes: 'A,B,C', mobility: 'transportabil', electricSafe: true },
  ],
  'Spumă Mecanică (SM)': [
    { value: 'SM2',   label: 'SM2 — Spumă AFFF 2 L',     mass: 2,   classes: 'A,B', mobility: 'portabil',      electricSafe: false },
    { value: 'SM3',   label: 'SM3 — Spumă AFFF 3 L',     mass: 3,   classes: 'A,B', mobility: 'portabil',      electricSafe: false },
    { value: 'SM6',   label: 'SM6 — Spumă AFFF 6 L ⭐',   mass: 6,   classes: 'A,B', mobility: 'portabil',      electricSafe: false },
    { value: 'SM9',   label: 'SM9 — Spumă AFFF 9 L',     mass: 9,   classes: 'A,B', mobility: 'portabil',      electricSafe: false },
    { value: 'SM25',  label: 'SM25 — Spumă AFFF 25 L',    mass: 25,  classes: 'A,B', mobility: 'transportabil', electricSafe: false },
    { value: 'SM50',  label: 'SM50 — Spumă AFFF 50 L',    mass: 50,  classes: 'A,B', mobility: 'transportabil', electricSafe: false },
    { value: 'SM100', label: 'SM100 — Spumă AFFF 100 L',   mass: 100, classes: 'A,B', mobility: 'transportabil', electricSafe: false },
    { value: 'SM150', label: 'SM150 — Spumă AFFF 150 L',   mass: 150, classes: 'A,B', mobility: 'transportabil', electricSafe: false },
  ],
  'CO₂ / Gaz (G)': [
    { value: 'G2',  label: 'G2 — CO₂ 2 kg',   mass: 2,  classes: 'B', mobility: 'portabil',      electricSafe: true },
    { value: 'G5',  label: 'G5 — CO₂ 5 kg ⭐',  mass: 5,  classes: 'B', mobility: 'portabil',      electricSafe: true },
    { value: 'G10', label: 'G10 — CO₂ 10 kg',  mass: 10, classes: 'B', mobility: 'portabil',      electricSafe: true },
    { value: 'G20', label: 'G20 — CO₂ 20 kg',  mass: 20, classes: 'B', mobility: 'transportabil', electricSafe: true },
    { value: 'G30', label: 'G30 — CO₂ 30 kg',  mass: 30, classes: 'B', mobility: 'transportabil', electricSafe: true },
    { value: 'G50', label: 'G50 — CO₂ 50 kg',  mass: 50, classes: 'B', mobility: 'transportabil', electricSafe: true },
  ],
  'Apă Pulverizată (AP)': [
    { value: 'AP6',  label: 'AP6 — Apă pulverizată 6 L',  mass: 6,  classes: 'A', mobility: 'portabil', electricSafe: false },
    { value: 'AP9',  label: 'AP9 — Apă pulverizată 9 L',  mass: 9,  classes: 'A', mobility: 'portabil', electricSafe: false },
    { value: 'AP10', label: 'AP10 — Apă pulverizată 10 L', mass: 10, classes: 'A', mobility: 'portabil', electricSafe: false },
    { value: 'AP12', label: 'AP12 — Apă pulverizată 12 L', mass: 12, classes: 'A', mobility: 'portabil', electricSafe: false },
  ],
  'Clasa F — Gastro': [
    { value: 'F2', label: 'F2 — Spumă clasa F 2 L', mass: 2, classes: 'A,B,F', mobility: 'portabil', electricSafe: false },
    { value: 'F3', label: 'F3 — Spumă clasa F 3 L', mass: 3, classes: 'A,B,F', mobility: 'portabil', electricSafe: false },
    { value: 'F6', label: 'F6 — Spumă clasa F 6 L ⭐', mass: 6, classes: 'A,B,F', mobility: 'portabil', electricSafe: false },
    { value: 'F9', label: 'F9 — Spumă clasa F 9 L', mass: 9, classes: 'A,B,F', mobility: 'portabil', electricSafe: false },
  ],
  'Dispozitive Automate': [
    { value: 'FIREXBALL-1.3', label: 'FIREXBALL — Minge stingere 1,3 kg pulbere', mass: 1.3, classes: 'A,B,C', mobility: 'fix', electricSafe: true },
  ],
}

// Helper: get model info by value
function getModelInfo(modelValue: string) {
  for (const models of Object.values(EQUIPMENT_MODELS)) {
    const found = models.find(m => m.value === modelValue)
    if (found) return found
  }
  return null
}

function fmtEquipType(t: string, equipmentTypes: any[]): string {
  // Încearcă să găsească în equipment_types din DB (prin ID sau name)
  const found = equipmentTypes.find(et => et.id === t || et.name.toLowerCase() === t.toLowerCase())
  if (found) return found.name

  // Fallback pe lista hardcodată
  return FALLBACK_EQUIPMENT_TYPES.find(et => et.value === t)?.label || t
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

export default function EquipmentClient({ user, organizations, equipment: initialEquipment, equipmentTypes }: Props) {
  // Convertește equipment_types din DB la format { value, label } pentru dropdown-uri
  const EQUIPMENT_TYPES = equipmentTypes.length > 0
    ? equipmentTypes.map(et => ({ value: et.id, label: et.name }))
    : FALLBACK_EQUIPMENT_TYPES
  // RBAC: Verificare permisiuni pentru butoane CRUD
  const canCreate = useHasPermission('equipment', 'create')
  const canUpdate = useHasPermission('equipment', 'update')
  const canDelete = useHasPermission('equipment', 'delete')

  const router = useRouter()
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
    model: '',
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
          (e.model || '').toLowerCase().includes(term) ||
          (e.location || '').toLowerCase().includes(term) ||
          (e.serial_number || '').toLowerCase().includes(term) ||
          fmtEquipType(e.equipment_type, equipmentTypes).toLowerCase().includes(term)
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
      equipment_type: EQUIPMENT_TYPES[0]?.value || 'stingator',
      model: '',
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
      equipment_type: e.equipment_type || EQUIPMENT_TYPES[0]?.value || 'stingator',
      model: e.model || '',
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
            <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900">🧯 Echipamente PSI</h1>
              <p className="text-sm text-gray-500">Gestionare stingătoare, truse, hidranți, detectoare</p>
            </div>
          </div>
          {/* RBAC: Buton "Adaugă" vizibil doar dacă user are permisiune 'create' pe 'equipment' */}
          {canCreate && (
            <button
              onClick={openAdd}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adaugă echipament
            </button>
          )}
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
            actionLabel="+ Adaugă echipament"
            onAction={openAdd}
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
                      Note <SortIcon field="description" />
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
                            {fmtEquipType(e.equipment_type, equipmentTypes)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          <div>
                            {e.model && (
                              <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 mr-1.5">
                                {e.model}
                              </span>
                            )}
                            {e.description || '—'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{e.location || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-400 font-mono">{e.serial_number || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{fmtDate(e.last_check_date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{fmtDate(e.expiry_date)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={status} label={status === 'expired' ? `Expirat ${days} zile` : status === 'expiring' ? `Expiră în ${days} zile` : `Valid ${days} zile`} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* RBAC: Buton "Editează" vizibil doar dacă user are permisiune 'update' pe 'equipment' */}
                            {canUpdate && (
                              <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600" title="Editează">
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            {/* RBAC: Buton "Șterge" vizibil doar dacă user are permisiune 'delete' pe 'equipment' */}
                            {canDelete && (
                              <button onClick={() => setDeleteId(e.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600" title="Șterge">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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
                  onChange={e => setForm({ ...form, equipment_type: e.target.value, model: '' })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {EQUIPMENT_TYPES.map(et => (
                    <option key={et.value} value={et.value}>{et.label}</option>
                  ))}
                </select>
              </div>

              {/* Model stingător — apare doar la tip = stingator */}
              {form.equipment_type === 'stingator' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model stingător *</label>
                  <select
                    value={form.model}
                    onChange={e => setForm({ ...form, model: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Selectează modelul —</option>
                    {Object.entries(EQUIPMENT_MODELS).map(([category, models]) => (
                      <optgroup key={category} label={category}>
                        {models.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {/* Info badges pentru modelul selectat */}
                  {form.model && (() => {
                    const info = getModelInfo(form.model)
                    if (!info) return null
                    return (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {info.classes.split(',').map((cls: string) => (
                          <span key={cls} className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                            Clasa {cls}
                          </span>
                        ))}
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          info.electricSafe ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {info.electricSafe ? '⚡ Electric safe ≤1000V' : '⚠️ INTERZIS pe electric!'}
                        </span>
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                          {info.mass} {info.classes.includes('F') || info.classes === 'A' && info.value.startsWith('AP') ? 'L' : 'kg'} · {info.mobility}
                        </span>
                      </div>
                    )
                  })()}
                </div>
              )}

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

              {/* Note / Observații — la final */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note / Observații</label>
                <input
                  type="text"
                  placeholder="ex: Verificat de Star Sting SRL, suport perete, etc."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
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
        isDestructive
      />
    </div>
  )
}
