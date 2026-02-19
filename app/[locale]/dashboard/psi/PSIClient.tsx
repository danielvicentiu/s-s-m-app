'use client'

// app/[locale]/dashboard/psi/PSIClient.tsx
// M2_PSI: Client component with tabs for equipment, inspections, alerts

import { useState, useEffect } from 'react'
import {
  Flame,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  ClipboardCheck
} from 'lucide-react'
import {
  PSIEquipment,
  PSIInspection,
  PSIAlertItem,
  PSI_EQUIPMENT_TYPE_LABELS,
  PSI_EQUIPMENT_STATUS_LABELS
} from '@/lib/types'
import { CreatePSIEquipmentInput, CreatePSIInspectionInput } from '@/lib/api/validation'
import EquipmentForm from '@/components/psi/EquipmentForm'
import InspectionForm from '@/components/psi/InspectionForm'
import AlertBadge from '@/components/psi/AlertBadge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'

type TabType = 'dashboard' | 'equipment' | 'inspections' | 'alerts'

interface PSIClientProps {
  user: {
    id: string
    email: string
  }
  equipment: PSIEquipment[]
  organizations: Array<{ id: string; name: string; cui?: string | null }>
  selectedOrgId?: string
  stats: {
    total: number
    operational: number
    needsInspection: number
    expired: number
  }
}

export default function PSIClient({
  equipment: initialEquipment,
  organizations,
  selectedOrgId,
  stats: initialStats
}: PSIClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [loading, setLoading] = useState(false)
  const [equipment, setEquipment] = useState<PSIEquipment[]>(initialEquipment)
  const [inspections, setInspections] = useState<PSIInspection[]>([])
  const [alerts, setAlerts] = useState<PSIAlertItem[]>([])
  const [stats, setStats] = useState(initialStats)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Modal states
  const [showEquipmentForm, setShowEquipmentForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<PSIEquipment | null>(null)
  const [showInspectionForm, setShowInspectionForm] = useState(false)
  const [selectedEquipmentForInspection, setSelectedEquipmentForInspection] = useState<PSIEquipment | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [equipmentToDelete, setEquipmentToDelete] = useState<PSIEquipment | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'inspections') {
      loadInspections()
    } else if (activeTab === 'alerts') {
      loadAlerts()
    }
  }, [activeTab, selectedOrgId])

  const loadEquipment = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedOrgId && selectedOrgId !== 'all') {
        params.append('organization_id', selectedOrgId)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      if (filterType !== 'all') {
        params.append('equipment_type', filterType)
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }

      const response = await fetch(`/api/psi/equipment?${params.toString()}`)
      const data = await response.json()

      if (data.data) {
        setEquipment(data.data)
        // Recalculate stats
        const today = new Date()
        setStats({
          total: data.data.length,
          operational: data.data.filter((e: PSIEquipment) => e.status === 'operational').length,
          needsInspection: data.data.filter((e: PSIEquipment) => e.status === 'needs_inspection').length,
          expired: data.data.filter((e: PSIEquipment) =>
            e.next_inspection_date && new Date(e.next_inspection_date) < today
          ).length
        })
      }
    } catch (error) {
      console.error('Error loading equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadInspections = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50', sort_by: 'inspection_date', sort_order: 'desc' })
      if (selectedOrgId && selectedOrgId !== 'all') {
        params.append('organization_id', selectedOrgId)
      }

      const response = await fetch(`/api/psi/inspections?${params.toString()}`)
      const data = await response.json()

      if (data.data) {
        setInspections(data.data)
      }
    } catch (error) {
      console.error('Error loading inspections:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ days: '90' })
      if (selectedOrgId && selectedOrgId !== 'all') {
        params.append('organization_id', selectedOrgId)
      }

      const response = await fetch(`/api/psi/alerts?${params.toString()}`)
      const data = await response.json()

      if (data.alerts) {
        setAlerts(data.alerts)
      }
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEquipment = async (data: CreatePSIEquipmentInput) => {
    const url = editingEquipment
      ? `/api/psi/equipment/${editingEquipment.id}`
      : '/api/psi/equipment'
    const method = editingEquipment ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Eroare la salvarea echipamentului')
    }

    await loadEquipment()
    setEditingEquipment(null)
  }

  const handleSaveInspection = async (data: CreatePSIInspectionInput) => {
    const response = await fetch('/api/psi/inspections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Eroare la salvarea inspecției')
    }

    await loadEquipment() // Refresh equipment (status updated)
    if (activeTab === 'inspections') {
      await loadInspections()
    }
    setSelectedEquipmentForInspection(null)
  }

  const handleDeleteEquipment = async () => {
    if (!equipmentToDelete) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/psi/equipment/${equipmentToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Eroare la ștergerea echipamentului')
      }

      await loadEquipment()
      setShowDeleteDialog(false)
      setEquipmentToDelete(null)
    } catch (error) {
      console.error('Error deleting equipment:', error)
      alert(error instanceof Error ? error.message : 'Eroare la ștergere')
    } finally {
      setDeleteLoading(false)
    }
  }

  const openEditForm = (equip: PSIEquipment) => {
    setEditingEquipment(equip)
    setShowEquipmentForm(true)
  }

  const openInspectionForm = (equip: PSIEquipment) => {
    setSelectedEquipmentForInspection(equip)
    setShowInspectionForm(true)
  }

  const openDeleteDialog = (equip: PSIEquipment) => {
    setEquipmentToDelete(equip)
    setShowDeleteDialog(true)
  }

  // Filter equipment for display
  const filteredEquipment = equipment.filter((e) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !e.identifier.toLowerCase().includes(query) &&
        !e.location?.toLowerCase().includes(query) &&
        !e.manufacturer?.toLowerCase().includes(query)
      ) {
        return false
      }
    }
    if (filterType !== 'all' && e.equipment_type !== filterType) {
      return false
    }
    if (filterStatus !== 'all' && e.status !== filterStatus) {
      return false
    }
    return true
  })

  // Group alerts by level
  const alertsByLevel = {
    expired: alerts.filter(a => a.alert_level === 'expired'),
    critical: alerts.filter(a => a.alert_level === 'critical'),
    warning: alerts.filter(a => a.alert_level === 'warning'),
    info: alerts.filter(a => a.alert_level === 'info')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Echipamente PSI</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Gestionare stingătoare, hidranți, detectori și alte echipamente PSI
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 overflow-x-auto pb-px -mb-px">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'equipment'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Echipamente
            </button>
            <button
              onClick={() => setActiveTab('inspections')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'inspections'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Inspecții
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap relative ${
                activeTab === 'alerts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Alerte
              {stats.expired > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.expired}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total echipamente</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                  </div>
                  <Flame className="h-12 w-12 text-gray-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Operaționale</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.operational}</p>
                  </div>
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">Necesită inspecție</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.needsInspection}</p>
                  </div>
                  <Clock className="h-12 w-12 text-amber-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Expirate</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.expired}</p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-400" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Acțiuni rapide</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowEquipmentForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Adaugă echipament
                </button>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Vezi alerte ({stats.expired})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Caută după identificator, locație, producător..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={loadEquipment}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Aplică filtre
                </button>
                <button
                  onClick={() => setShowEquipmentForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adaugă echipament
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Toate tipurile</option>
                  {Object.entries(PSI_EQUIPMENT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Toate statusurile</option>
                  {Object.entries(PSI_EQUIPMENT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Equipment Table */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Se încarcă echipamentele...</p>
              </div>
            ) : filteredEquipment.length === 0 ? (
              <EmptyState
                icon={Flame}
                title="Niciun echipament găsit"
                description="Adaugă primul echipament PSI pentru a începe trackingul"
                actionLabel="Adaugă echipament"
                onAction={() => setShowEquipmentForm(true)}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Identificator</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locație</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ultimă inspecție</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Următoare inspecție</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEquipment.map((equip) => (
                        <tr key={equip.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {PSI_EQUIPMENT_TYPE_LABELS[equip.equipment_type]}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{equip.identifier}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{equip.location || '-'}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              equip.status === 'operational' ? 'bg-green-100 text-green-700' :
                              equip.status === 'needs_inspection' ? 'bg-amber-100 text-amber-700' :
                              equip.status === 'needs_repair' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {PSI_EQUIPMENT_STATUS_LABELS[equip.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {equip.last_inspection_date || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {equip.next_inspection_date || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openInspectionForm(equip)}
                                title="Înregistrează inspecție"
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <ClipboardCheck className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditForm(equip)}
                                title="Editează"
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openDeleteDialog(equip)}
                                title="Șterge"
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Se încarcă inspecțiile...</p>
              </div>
            ) : inspections.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title="Nicio inspecție înregistrată"
                description="Înregistrează prima inspecție pentru un echipament PSI"
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Echipament</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspector</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rezultat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Următoarea inspecție</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inspections.map((insp) => (
                        <tr key={insp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{insp.inspection_date}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {insp.psi_equipment?.identifier || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{insp.inspector_name}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              insp.result === 'conform' ? 'bg-green-100 text-green-700' :
                              insp.result === 'conform_cu_observatii' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {insp.result === 'conform' ? 'Conform' :
                               insp.result === 'conform_cu_observatii' ? 'Conform cu obs.' : 'Neconform'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{insp.next_inspection_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Se încarcă alertele...</p>
              </div>
            ) : (
              <>
                {/* Expired */}
                {alertsByLevel.expired.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                    <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-red-900">
                          Expirate ({alertsByLevel.expired.length})
                        </h3>
                      </div>
                      <AlertBadge alertLevel="expired" />
                    </div>
                    <div className="divide-y divide-gray-200">
                      {alertsByLevel.expired.map((alert) => (
                        <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{alert.identifier}</p>
                              <p className="text-sm text-gray-600">{PSI_EQUIPMENT_TYPE_LABELS[alert.equipment_type]}</p>
                              <p className="text-xs text-gray-500 mt-1">{alert.location || 'Fără locație'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-red-600">
                                {Math.abs(alert.days_until_due)} zile depășit
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Expirat la: {alert.next_inspection_date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Critical (30 days) */}
                {alertsByLevel.critical.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
                    <div className="bg-amber-50 px-6 py-4 border-b border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <h3 className="text-lg font-semibold text-amber-900">
                          Critice - 30 zile ({alertsByLevel.critical.length})
                        </h3>
                      </div>
                      <AlertBadge alertLevel="critical" />
                    </div>
                    <div className="divide-y divide-gray-200">
                      {alertsByLevel.critical.map((alert) => (
                        <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{alert.identifier}</p>
                              <p className="text-sm text-gray-600">{PSI_EQUIPMENT_TYPE_LABELS[alert.equipment_type]}</p>
                              <p className="text-xs text-gray-500 mt-1">{alert.location || 'Fără locație'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-amber-600">
                                {alert.days_until_due} zile
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Expiră la: {alert.next_inspection_date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warning (60 days) */}
                {alertsByLevel.warning.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden">
                    <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-yellow-900">
                          Atenție - 60 zile ({alertsByLevel.warning.length})
                        </h3>
                      </div>
                      <AlertBadge alertLevel="warning" />
                    </div>
                    <div className="divide-y divide-gray-200">
                      {alertsByLevel.warning.map((alert) => (
                        <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{alert.identifier}</p>
                              <p className="text-sm text-gray-600">{PSI_EQUIPMENT_TYPE_LABELS[alert.equipment_type]}</p>
                              <p className="text-xs text-gray-500 mt-1">{alert.location || 'Fără locație'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-yellow-600">
                                {alert.days_until_due} zile
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Expiră la: {alert.next_inspection_date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info (90 days) */}
                {alertsByLevel.info.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                    <div className="bg-blue-50 px-6 py-4 border-b border-blue-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-blue-900">
                          Info - 90 zile ({alertsByLevel.info.length})
                        </h3>
                      </div>
                      <AlertBadge alertLevel="info" />
                    </div>
                    <div className="divide-y divide-gray-200">
                      {alertsByLevel.info.map((alert) => (
                        <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{alert.identifier}</p>
                              <p className="text-sm text-gray-600">{PSI_EQUIPMENT_TYPE_LABELS[alert.equipment_type]}</p>
                              <p className="text-xs text-gray-500 mt-1">{alert.location || 'Fără locație'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-blue-600">
                                {alert.days_until_due} zile
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Expiră la: {alert.next_inspection_date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {alerts.length === 0 && (
                  <EmptyState
                    icon={CheckCircle2}
                    title="Nicio alertă"
                    description="Toate echipamentele PSI sunt la zi cu inspecțiile"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <EquipmentForm
        isOpen={showEquipmentForm}
        onClose={() => {
          setShowEquipmentForm(false)
          setEditingEquipment(null)
        }}
        onSave={handleSaveEquipment}
        equipment={editingEquipment}
        organizations={organizations}
      />

      {selectedEquipmentForInspection && (
        <InspectionForm
          isOpen={showInspectionForm}
          onClose={() => {
            setShowInspectionForm(false)
            setSelectedEquipmentForInspection(null)
          }}
          onSave={handleSaveInspection}
          equipment={selectedEquipmentForInspection}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteEquipment}
        title="Șterge echipament PSI"
        message={`Sigur vrei să ștergi echipamentul "${equipmentToDelete?.identifier}"? Toate inspecțiile asociate vor fi șterse. Această acțiune nu poate fi anulată.`}
        confirmLabel="Șterge"
        cancelLabel="Anulează"
        isDestructive
        loading={deleteLoading}
      />
    </div>
  )
}
