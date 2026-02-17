'use client'

// app/[locale]/dashboard/iscir/ISCIRClient.tsx
// M9_ISCIR: Client component with tabs for equipment, verifications, alerts

import { useState, useEffect } from 'react'
import {
  Gauge,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  ClipboardCheck,
  Factory,
  Calendar,
  FileText,
  ShieldAlert
} from 'lucide-react'

type TabType = 'dashboard' | 'equipment' | 'verifications' | 'alerts'

interface ISCIREquipment {
  id: string
  organization_id: string
  equipment_type: string
  registration_number?: string
  identifier: string
  manufacturer?: string
  model?: string
  serial_number?: string
  manufacture_year?: number
  installation_date?: string
  location?: string
  capacity?: string
  rsvti_responsible?: string
  last_verification_date?: string
  next_verification_date: string
  verification_interval_months: number
  authorization_number?: string
  authorization_expiry?: string
  status: string
  notes?: string
  created_at: string
  organizations?: {
    id: string
    name: string
    cui?: string
  }
}

interface ISCIRVerification {
  id: string
  equipment_id: string
  organization_id: string
  verification_date: string
  verification_type: string
  inspector_name: string
  inspector_legitimation?: string
  result: string
  next_verification_date?: string
  bulletin_number: string
  bulletin_storage_path?: string
  observations?: string
  prescriptions?: string
  deadline_prescriptions?: string
  created_at: string
}

interface ISCIRClientProps {
  user: {
    id: string
    email: string
  }
  equipment: ISCIREquipment[]
  organizations: Array<{ id: string; name: string; cui?: string | null }>
  selectedOrgId?: string
  stats: {
    total: number
    activ: number
    expirat: number
    oprit: number
  }
}

const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  cazan: 'Cazan',
  recipient_presiune: 'Recipient sub presiune',
  lift: 'Lift',
  macara: 'Macara',
  stivuitor: 'Stivuitor',
  instalatie_gpl: 'Instalație GPL',
  compresor: 'Compresor',
  autoclave: 'Autoclave',
  altul: 'Altul'
}

const STATUS_LABELS: Record<string, string> = {
  activ: 'Activ',
  expirat: 'Expirat',
  in_verificare: 'În verificare',
  oprit: 'Oprit',
  casat: 'Casat'
}

const VERIFICATION_TYPE_LABELS: Record<string, string> = {
  periodica: 'Periodică',
  accidentala: 'Accidentală',
  punere_in_functiune: 'Punere în funcțiune',
  reparatie: 'Reparație',
  modernizare: 'Modernizare'
}

const RESULT_LABELS: Record<string, string> = {
  admis: 'Admis',
  respins: 'Respins',
  admis_conditionat: 'Admis condiționat'
}

export default function ISCIRClient({
  user,
  equipment: initialEquipment,
  organizations,
  selectedOrgId,
  stats: initialStats
}: ISCIRClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [loading, setLoading] = useState(false)
  const [equipment, setEquipment] = useState<ISCIREquipment[]>(initialEquipment)
  const [verifications, setVerifications] = useState<ISCIRVerification[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [stats, setStats] = useState(initialStats)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Modal states
  const [showEquipmentForm, setShowEquipmentForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<ISCIREquipment | null>(null)
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [selectedEquipmentForVerification, setSelectedEquipmentForVerification] = useState<ISCIREquipment | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [equipmentToDelete, setEquipmentToDelete] = useState<ISCIREquipment | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Equipment form state
  const [formData, setFormData] = useState<any>({
    equipment_type: 'cazan',
    identifier: '',
    status: 'activ',
    verification_interval_months: 12,
  })

  // Verification form state
  const [verificationFormData, setVerificationFormData] = useState<any>({
    verification_type: 'periodica',
    result: 'admis',
  })

  useEffect(() => {
    if (activeTab === 'verifications') {
      loadVerifications()
    } else if (activeTab === 'alerts') {
      loadAlerts()
    }
  }, [activeTab, selectedOrgId])

  const loadEquipment = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedOrgId && selectedOrgId !== 'all') {
        params.append('org_id', selectedOrgId)
      }
      if (filterType !== 'all') {
        params.append('equipment_type', filterType)
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }

      const response = await fetch(`/api/iscir/equipment?${params.toString()}`)
      const data = await response.json()

      if (data.equipment) {
        setEquipment(data.equipment)
        // Recalculate stats
        const today = new Date()
        setStats({
          total: data.equipment.length,
          activ: data.equipment.filter((e: ISCIREquipment) => e.status === 'activ').length,
          expirat: data.equipment.filter((e: ISCIREquipment) =>
            e.next_verification_date && new Date(e.next_verification_date) < today
          ).length,
          oprit: data.equipment.filter((e: ISCIREquipment) => e.status === 'oprit').length
        })
      }
    } catch (error) {
      console.error('Error loading equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadVerifications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedOrgId && selectedOrgId !== 'all') {
        params.append('org_id', selectedOrgId)
      }

      const response = await fetch(`/api/iscir/verifications?${params.toString()}`)
      const data = await response.json()

      if (data.verifications) {
        setVerifications(data.verifications)
      }
    } catch (error) {
      console.error('Error loading verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedOrgId && selectedOrgId !== 'all') {
        params.append('org_id', selectedOrgId)
      }

      const response = await fetch(`/api/iscir/alerts?${params.toString()}`)
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

  const handleAddEquipment = () => {
    setEditingEquipment(null)
    setFormData({
      equipment_type: 'cazan',
      identifier: '',
      status: 'activ',
      verification_interval_months: 12,
      organization_id: selectedOrgId || organizations[0]?.id
    })
    setShowEquipmentForm(true)
  }

  const handleEditEquipment = (eq: ISCIREquipment) => {
    setEditingEquipment(eq)
    setFormData({ ...eq })
    setShowEquipmentForm(true)
  }

  const handleSaveEquipment = async () => {
    setLoading(true)
    try {
      const url = editingEquipment
        ? `/api/iscir/equipment/${editingEquipment.id}`
        : '/api/iscir/equipment'
      const method = editingEquipment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setShowEquipmentForm(false)
        await loadEquipment()
      } else {
        alert(data.error || 'Eroare la salvarea echipamentului')
      }
    } catch (error) {
      console.error('Error saving equipment:', error)
      alert('Eroare la salvarea echipamentului')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEquipment = async () => {
    if (!equipmentToDelete) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/iscir/equipment/${equipmentToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setEquipmentToDelete(null)
        await loadEquipment()
      } else {
        const data = await response.json()
        alert(data.error || 'Eroare la ștergerea echipamentului')
      }
    } catch (error) {
      console.error('Error deleting equipment:', error)
      alert('Eroare la ștergerea echipamentului')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleAddVerification = (eq: ISCIREquipment) => {
    setSelectedEquipmentForVerification(eq)
    setVerificationFormData({
      equipment_id: eq.id,
      verification_date: new Date().toISOString().split('T')[0],
      verification_type: 'periodica',
      result: 'admis',
      inspector_name: '',
      bulletin_number: '',
    })
    setShowVerificationForm(true)
  }

  const handleSaveVerification = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/iscir/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationFormData)
      })

      const data = await response.json()

      if (response.ok) {
        setShowVerificationForm(false)
        await loadEquipment()
        if (activeTab === 'verifications') {
          await loadVerifications()
        }
      } else {
        alert(data.error || 'Eroare la salvarea verificării')
      }
    } catch (error) {
      console.error('Error saving verification:', error)
      alert('Eroare la salvarea verificării')
    } finally {
      setLoading(false)
    }
  }

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = searchQuery === '' ||
      eq.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.registration_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === 'all' || eq.equipment_type === filterType
    const matchesStatus = filterStatus === 'all' || eq.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getAlertBadge = (equipment: ISCIREquipment) => {
    const nextDate = new Date(equipment.next_verification_date)
    const today = new Date()
    const daysUntil = Math.floor((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Expirat</span>
    } else if (daysUntil <= 30) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Urgent</span>
    } else if (daysUntil <= 90) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Atenție</span>
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">OK</span>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Gauge className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Echipamente ISCIR</h1>
            <p className="text-sm text-gray-500">Gestionare cazane, recipiente sub presiune, lifturi</p>
          </div>
        </div>

        {/* Organization Selector */}
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={selectedOrgId || 'all'}
          onChange={(e) => {
            const newOrgId = e.target.value === 'all' ? undefined : e.target.value
            window.location.href = `/dashboard/iscir${newOrgId ? `?org=${newOrgId}` : ''}`
          }}
        >
          <option value="all">Toate organizațiile</option>
          {organizations.map(org => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Gauge },
            { id: 'equipment', label: 'Echipamente', icon: Factory },
            { id: 'verifications', label: 'Verificări', icon: ClipboardCheck },
            { id: 'alerts', label: 'Alerte', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total echipamente</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Factory className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.activ}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expirate</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{stats.expirat}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Oprite</p>
                  <p className="text-3xl font-bold text-gray-600 mt-1">{stats.oprit}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl">
                  <XCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Equipment */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Echipamente recente</h2>
              <button
                onClick={handleAddEquipment}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adaugă echipament
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Identificator</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nr. ISCIR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RSVTI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verificare</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.slice(0, 5).map(eq => (
                    <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{EQUIPMENT_TYPE_LABELS[eq.equipment_type]}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{eq.identifier}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{eq.registration_number || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{eq.rsvti_responsible || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(eq.next_verification_date).toLocaleDateString('ro-RO')}</td>
                      <td className="px-4 py-3">{getAlertBadge(eq)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddVerification(eq)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Adaugă verificare"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditEquipment(eq)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title="Editează"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Caută echipament..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate tipurile</option>
                {Object.entries(EQUIPMENT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate statusurile</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <button
                onClick={handleAddEquipment}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adaugă echipament
              </button>
            </div>
          </div>

          {/* Equipment Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Identificator</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nr. ISCIR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locație</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RSVTI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verificare</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map(eq => (
                    <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{EQUIPMENT_TYPE_LABELS[eq.equipment_type]}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{eq.identifier}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{eq.registration_number || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{eq.location || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{eq.rsvti_responsible || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(eq.next_verification_date).toLocaleDateString('ro-RO')}</td>
                      <td className="px-4 py-3">{getAlertBadge(eq)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddVerification(eq)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Adaugă verificare"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditEquipment(eq)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title="Editează"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEquipmentToDelete(eq)
                              setShowDeleteDialog(true)
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Șterge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredEquipment.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Factory className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Nu există echipamente ISCIR</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verifications Tab */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Verificări ISCIR</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dată</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Echipament</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip verificare</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspector</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rezultat</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buletin</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map(ver => (
                  <tr key={ver.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{new Date(ver.verification_date).toLocaleDateString('ro-RO')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ver.equipment_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{VERIFICATION_TYPE_LABELS[ver.verification_type]}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ver.inspector_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ver.result === 'admis' ? 'bg-green-100 text-green-800' :
                        ver.result === 'respins' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {RESULT_LABELS[ver.result]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ver.bulletin_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {verifications.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nu există verificări înregistrate</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Alerte verificări ISCIR</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Echipament</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locație</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data verificare</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zile rămase</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel alertă</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{alert.identifier}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{EQUIPMENT_TYPE_LABELS[alert.equipment_type]}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{alert.location || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(alert.next_verification_date).toLocaleDateString('ro-RO')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{alert.days_until_expiry}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        alert.alert_level === 'expirat' ? 'bg-red-100 text-red-800' :
                        alert.alert_level === 'urgent' ? 'bg-orange-100 text-orange-800' :
                        alert.alert_level === 'atentie' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.alert_level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleAddVerification(alert)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        Verifică
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {alerts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nu există alerte</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Equipment Form Modal */}
      {showEquipmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingEquipment ? 'Editează echipament ISCIR' : 'Adaugă echipament ISCIR'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tip echipament *</label>
                  <select
                    value={formData.equipment_type}
                    onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(EQUIPMENT_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identificator intern *</label>
                  <input
                    type="text"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: CAZAN-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nr. înregistrare ISCIR</label>
                  <input
                    type="text"
                    value={formData.registration_number || ''}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producător</label>
                  <input
                    type="text"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serie fabricație</label>
                  <input
                    type="text"
                    value={formData.serial_number || ''}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">An fabricație</label>
                  <input
                    type="number"
                    value={formData.manufacture_year || ''}
                    onChange={(e) => setFormData({ ...formData, manufacture_year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Locație</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacitate</label>
                  <input
                    type="text"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Ex: 500L, 2 tone, 10 bar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RSVTI responsabil</label>
                  <input
                    type="text"
                    value={formData.rsvti_responsible || ''}
                    onChange={(e) => setFormData({ ...formData, rsvti_responsible: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dată următoare verificare *</label>
                  <input
                    type="date"
                    value={formData.next_verification_date || ''}
                    onChange={(e) => setFormData({ ...formData, next_verification_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interval verificare (luni)</label>
                  <input
                    type="number"
                    value={formData.verification_interval_months || 12}
                    onChange={(e) => setFormData({ ...formData, verification_interval_months: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nr. autorizație funcționare</label>
                  <input
                    type="text"
                    value={formData.authorization_number || ''}
                    onChange={(e) => setFormData({ ...formData, authorization_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data expirare autorizație</label>
                  <input
                    type="date"
                    value={formData.authorization_expiry || ''}
                    onChange={(e) => setFormData({ ...formData, authorization_expiry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEquipmentForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleSaveEquipment}
                disabled={loading || !formData.identifier || !formData.next_verification_date}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Se salvează...' : 'Salvează'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Form Modal */}
      {showVerificationForm && selectedEquipmentForVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Înregistrare verificare ISCIR
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Echipament: {selectedEquipmentForVerification.identifier}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data verificare *</label>
                  <input
                    type="date"
                    value={verificationFormData.verification_date || ''}
                    onChange={(e) => setVerificationFormData({ ...verificationFormData, verification_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tip verificare *</label>
                  <select
                    value={verificationFormData.verification_type}
                    onChange={(e) => setVerificationFormData({ ...verificationFormData, verification_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(VERIFICATION_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nume inspector *</label>
                  <input
                    type="text"
                    value={verificationFormData.inspector_name || ''}
                    onChange={(e) => setVerificationFormData({ ...verificationFormData, inspector_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nr. legitimație inspector</label>
                  <input
                    type="text"
                    value={verificationFormData.inspector_legitimation || ''}
                    onChange={(e) => setVerificationFormData({ ...verificationFormData, inspector_legitimation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rezultat *</label>
                  <select
                    value={verificationFormData.result}
                    onChange={(e) => setVerificationFormData({ ...verificationFormData, result: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(RESULT_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nr. buletin verificare *</label>
                  <input
                    type="text"
                    value={verificationFormData.bulletin_number || ''}
                    onChange={(e) => setVerificationFormData({ ...verificationFormData, bulletin_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data următoare verificare</label>
                  <input
                    type="date"
                    value={verificationFormData.next_verification_date || ''}
                    onChange={(e) => setVerificationFormData({ ...verificationFormData, next_verification_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Termen remediere prescripții</label>
                  <input
                    type="date"
                    value={verificationFormData.deadline_prescriptions || ''}
                    onChange={(e) => setVerificationFormData({ ...verificationFormData, deadline_prescriptions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
                <textarea
                  value={verificationFormData.observations || ''}
                  onChange={(e) => setVerificationFormData({ ...verificationFormData, observations: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prescripții / Măsuri impuse</label>
                <textarea
                  value={verificationFormData.prescriptions || ''}
                  onChange={(e) => setVerificationFormData({ ...verificationFormData, prescriptions: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowVerificationForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleSaveVerification}
                disabled={loading || !verificationFormData.verification_date || !verificationFormData.inspector_name || !verificationFormData.bulletin_number}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Se salvează...' : 'Salvează verificare'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && equipmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Confirmă ștergerea</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Sigur doriți să ștergeți echipamentul <strong>{equipmentToDelete.identifier}</strong>?
              Această acțiune va șterge și toate verificările asociate și nu poate fi anulată.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false)
                  setEquipmentToDelete(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleDeleteEquipment}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Se șterge...' : 'Șterge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
