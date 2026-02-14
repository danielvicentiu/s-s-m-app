// app/[locale]/dashboard/incidents/near-miss/page.tsx
// Near-miss reporting page: quick form, list view, and statistics
// Simplified reporting with location dropdown, category from seed, severity estimation

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import StatsCard from '@/components/ui/StatsCard'
import {
  AlertTriangle,
  ArrowLeft,
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  Calendar,
  MapPin,
  TrendingUp,
  X,
  Upload,
  CheckCircle2
} from 'lucide-react'

// ========== TYPES ==========

interface Location {
  id: string
  name: string
  address: string | null
  city: string | null
}

interface NearMiss {
  id: string
  organization_id: string
  incident_type: string
  incident_date: string
  incident_time: string
  location_id: string | null
  location_description: string | null
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'reported' | 'under_investigation' | 'awaiting_corrective_actions' | 'corrective_actions_in_progress' | 'closed' | 'archived'
  photo_urls: string[] | null
  created_at: string
  updated_at: string
  locations?: {
    name: string
    address: string | null
  }
}

type IncidentStatus = 'reported' | 'under_investigation' | 'awaiting_corrective_actions' | 'corrective_actions_in_progress' | 'closed' | 'archived'
type SortDirection = 'asc' | 'desc'

// ========== INCIDENT CATEGORIES (from seed) ==========
const NEAR_MISS_CATEGORIES = [
  { value: 'near_miss_fall', label: 'Risc de cădere' },
  { value: 'near_miss_equipment', label: 'Echipament defect' },
  { value: 'near_miss_chemical', label: 'Substanțe periculoase' },
  { value: 'near_miss_electrical', label: 'Electric' },
  { value: 'near_miss_fire', label: 'Risc de incendiu' },
  { value: 'near_miss_ergonomic', label: 'Ergonomic' },
  { value: 'near_miss_vehicle', label: 'Vehicul/Transport' },
  { value: 'near_miss_procedure', label: 'Procedură nesigură' },
  { value: 'near_miss_other', label: 'Altul' }
]

// ========== COMPONENT ==========

export default function NearMissPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // State
  const [nearMisses, setNearMisses] = useState<NearMiss[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [sortColumn, setSortColumn] = useState<string>('incident_date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    location_id: '',
    location_description: '',
    incident_date: new Date().toISOString().split('T')[0],
    incident_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    category: 'near_miss_other',
    severity: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    photo_urls: [] as string[]
  })

  // ========== FETCH DATA ==========

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch near-miss incidents
        const { data: incidents, error: incidentsError } = await supabase
          .from('incidents')
          .select(`
            *,
            locations(name, address)
          `)
          .eq('incident_type', 'near_miss')
          .order('incident_date', { ascending: false })

        if (incidentsError) throw incidentsError

        setNearMisses(incidents || [])

        // Fetch locations
        const { data: locs, error: locsError } = await supabase
          .from('locations')
          .select('id, name, address, city')
          .eq('is_active', true)
          .order('name')

        if (locsError) throw locsError

        setLocations(locs || [])
      } catch (err) {
        console.error('[NEAR-MISS] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ========== FORM HANDLERS ==========

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.description.trim()) {
      alert('Descrierea este obligatorie')
      return
    }

    try {
      setSubmitting(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get organization_id from memberships
      const { data: membership } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!membership) throw new Error('No active organization')

      const { error } = await supabase
        .from('incidents')
        .insert({
          organization_id: membership.organization_id,
          incident_type: 'near_miss',
          incident_date: formData.incident_date,
          incident_time: formData.incident_time,
          location_id: formData.location_id || null,
          location_description: formData.location_description || null,
          description: formData.description,
          severity: formData.severity,
          status: 'reported',
          photo_urls: formData.photo_urls.length > 0 ? formData.photo_urls : null,
          reported_by: user.id
        })

      if (error) throw error

      // Refresh data
      const { data: incidents } = await supabase
        .from('incidents')
        .select(`
          *,
          locations(name, address)
        `)
        .eq('incident_type', 'near_miss')
        .order('incident_date', { ascending: false })

      setNearMisses(incidents || [])

      // Reset form
      setFormData({
        description: '',
        location_id: '',
        location_description: '',
        incident_date: new Date().toISOString().split('T')[0],
        incident_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        category: 'near_miss_other',
        severity: 'medium',
        photo_urls: []
      })

      setShowForm(false)
      alert('Near-miss raportat cu succes!')
    } catch (err) {
      console.error('[NEAR-MISS] Submit error:', err)
      alert('Eroare la raportare. Încercați din nou.')
    } finally {
      setSubmitting(false)
    }
  }

  // ========== STATS ==========

  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthCount = nearMisses.filter(nm => {
      const date = new Date(nm.incident_date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length

    const lastMonthCount = nearMisses.filter(nm => {
      const date = new Date(nm.incident_date)
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    }).length

    const trend = lastMonthCount === 0 ? 0 : ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100

    // Top categories
    const categoryCounts: Record<string, number> = {}
    nearMisses.forEach(nm => {
      const cat = nm.incident_type || 'near_miss_other'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, count]) => ({
        category: NEAR_MISS_CATEGORIES.find(c => c.value === cat)?.label || cat,
        count
      }))

    return {
      currentMonth: currentMonthCount,
      lastMonth: lastMonthCount,
      trend,
      topCategories
    }
  }, [nearMisses])

  // ========== FILTERED & SORTED DATA ==========

  const filteredNearMisses = useMemo(() => {
    return nearMisses.filter(nm => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = !searchQuery ||
        nm.description.toLowerCase().includes(searchLower) ||
        nm.location_description?.toLowerCase().includes(searchLower) ||
        nm.locations?.name.toLowerCase().includes(searchLower)

      const matchesStatus = filterStatus === 'all' || nm.status === filterStatus
      const matchesSeverity = filterSeverity === 'all' || nm.severity === filterSeverity

      return matchesSearch && matchesStatus && matchesSeverity
    })
  }, [nearMisses, searchQuery, filterStatus, filterSeverity])

  const sortedNearMisses = useMemo(() => {
    return [...filteredNearMisses].sort((a, b) => {
      let valA: any, valB: any

      switch (sortColumn) {
        case 'incident_date':
          valA = new Date(a.incident_date).getTime()
          valB = new Date(b.incident_date).getTime()
          break
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          valA = severityOrder[a.severity]
          valB = severityOrder[b.severity]
          break
        case 'status':
          valA = a.status
          valB = b.status
          break
        default:
          return 0
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredNearMisses, sortColumn, sortDirection])

  // ========== HELPERS ==========

  function getStatusLabel(status: IncidentStatus): string {
    const labels: Record<IncidentStatus, string> = {
      reported: 'Raportat',
      under_investigation: 'În investigare',
      awaiting_corrective_actions: 'Așteaptă acțiuni',
      corrective_actions_in_progress: 'Acțiuni în curs',
      closed: 'Rezolvat',
      archived: 'Arhivat'
    }
    return labels[status] || status
  }

  function getStatusVariant(status: IncidentStatus): 'valid' | 'expiring' | 'expired' | 'incomplete' {
    switch (status) {
      case 'reported': return 'expiring'
      case 'under_investigation': return 'expiring'
      case 'closed': return 'valid'
      case 'archived': return 'incomplete'
      default: return 'expiring'
    }
  }

  function getSeverityLabel(severity: string): string {
    const labels: Record<string, string> = {
      critical: 'Critic',
      high: 'Ridicat',
      medium: 'Mediu',
      low: 'Scăzut'
    }
    return labels[severity] || severity
  }

  function getSeverityVariant(severity: string): 'valid' | 'expiring' | 'expired' | 'incomplete' {
    switch (severity) {
      case 'critical': return 'expired'
      case 'high': return 'expired'
      case 'medium': return 'expiring'
      case 'low': return 'valid'
      default: return 'incomplete'
    }
  }

  function fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  function fmtTime(t: string): string {
    return t.substring(0, 5)
  }

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // ========== RENDER ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă near-miss-urile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Raportare Near-Miss</h1>
              <p className="text-sm text-gray-600 mt-1">
                {sortedNearMisses.length} raportări găsite
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            {showForm ? (
              <>
                <X className="w-5 h-5" />
                Anulează
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Raportează near-miss
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Report Form */}
      {showForm && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Raportare rapidă near-miss</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data incidentului *
                  </label>
                  <input
                    type="date"
                    value={formData.incident_date}
                    onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ora incidentului *
                  </label>
                  <input
                    type="time"
                    value={formData.incident_time}
                    onChange={(e) => setFormData({ ...formData, incident_time: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locație
                  </label>
                  <select
                    value={formData.location_id}
                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selectează locație</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.city ? `- ${loc.city}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {NEAR_MISS_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severitate estimată *
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Scăzut</option>
                    <option value="medium">Mediu</option>
                    <option value="high">Ridicat</option>
                    <option value="critical">Critic</option>
                  </select>
                </div>

                {/* Location Description (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detalii locație (opțional)
                  </label>
                  <input
                    type="text"
                    value={formData.location_description}
                    onChange={(e) => setFormData({ ...formData, location_description: e.target.value })}
                    placeholder="Ex: Depozit, nivel 2, zona A"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ce s-a întâmplat? *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Descrieți situația near-miss în detaliu..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Photo upload placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fotografie (opțional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Încărcarea fotografiilor va fi implementată în versiunea viitoare
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Se raportează...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Raportează
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total luna curentă"
          value={stats.currentMonth}
          changePercent={Math.abs(Math.round(stats.trend))}
          changeType={stats.trend >= 0 ? 'increase' : 'decrease'}
          icon={<Calendar className="w-6 h-6" />}
          color="blue"
        />

        <StatsCard
          title="Trend"
          value={`${stats.trend >= 0 ? '+' : ''}${Math.round(stats.trend)}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color={stats.trend > 0 ? 'red' : 'green'}
        />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Top categorii</h3>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="space-y-2">
            {stats.topCategories.length === 0 ? (
              <p className="text-sm text-gray-500">Nicio categorie raportată</p>
            ) : (
              stats.topCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{cat.category}</span>
                  <span className="font-semibold text-gray-900">{cat.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Caută descriere, locație..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toate statusurile</option>
            <option value="reported">Raportat</option>
            <option value="under_investigation">În investigare</option>
            <option value="closed">Rezolvat</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toate severitățile</option>
            <option value="critical">Critic</option>
            <option value="high">Ridicat</option>
            <option value="medium">Mediu</option>
            <option value="low">Scăzut</option>
          </select>
        </div>
      </div>

      {/* Near-Miss List */}
      <div className="max-w-7xl mx-auto">
        {sortedNearMisses.length === 0 ? (
          <EmptyState
            icon={<AlertTriangle className="w-48 h-48 text-gray-300" />}
            title="Niciun near-miss raportat"
            description={searchQuery || filterStatus !== 'all' || filterSeverity !== 'all'
              ? "Încercați să modificați filtrele de căutare"
              : "Raportați primul near-miss pentru a începe"}
            actionLabel="Raportează near-miss"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th
                      onClick={() => handleSort('incident_date')}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Data & Ora
                        {sortColumn === 'incident_date' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Descriere
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Locație
                    </th>
                    <th
                      onClick={() => handleSort('severity')}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Severitate
                        {sortColumn === 'severity' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('status')}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortColumn === 'status' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedNearMisses.map((nm) => (
                    <tr key={nm.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{fmtDate(nm.incident_date)}</div>
                        <div className="text-sm text-gray-600">{fmtTime(nm.incident_time)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md">
                          {nm.description.length > 100
                            ? `${nm.description.substring(0, 100)}...`
                            : nm.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {nm.locations?.name || 'Fără locație'}
                            </div>
                            {nm.location_description && (
                              <div className="text-sm text-gray-600">{nm.location_description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={getSeverityVariant(nm.severity)}
                          label={getSeverityLabel(nm.severity)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={getStatusVariant(nm.status)}
                          label={getStatusLabel(nm.status)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
