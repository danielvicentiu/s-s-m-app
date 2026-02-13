'use client'

import { useState, useMemo } from 'react'
import { FirstAidKit, FirstAidItem, getExpiryStatus, getDaysUntilExpiry } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import {
  Briefcase,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  ClipboardCheck,
  Package,
} from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface FirstAidClientProps {
  user: { email: string }
  kits: (FirstAidKit & { organizations?: { name: string; cui: string | null } })[]
  organizations: { id: string; name: string; cui: string | null }[]
}

export default function FirstAidClient({ user, kits, organizations }: FirstAidClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrg, setSelectedOrg] = useState<string>('all')
  const [selectedKit, setSelectedKit] = useState<FirstAidKit | null>(null)
  const [kitItems, setKitItems] = useState<FirstAidItem[]>([])
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false)
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({})

  // Filter kits
  const filteredKits = useMemo(() => {
    return kits.filter((kit) => {
      const matchesSearch =
        searchQuery === '' ||
        kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (kit.kit_code && kit.kit_code.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesOrg = selectedOrg === 'all' || kit.organization_id === selectedOrg

      return matchesSearch && matchesOrg
    })
  }, [kits, searchQuery, selectedOrg])

  // Stats
  const stats = useMemo(() => {
    const total = filteredKits.length
    const needsRestocking = filteredKits.filter((k) => k.needs_restocking).length
    const notAccessible = filteredKits.filter((k) => !k.is_accessible).length
    const incomplete = filteredKits.filter((k) => !k.is_complete).length
    const dueForCheck = filteredKits.filter((k) => {
      if (!k.next_check_date) return false
      return getDaysUntilExpiry(k.next_check_date) <= 7
    }).length

    return { total, needsRestocking, notAccessible, incomplete, dueForCheck }
  }, [filteredKits])

  // Get kit status
  const getKitStatus = (kit: FirstAidKit): 'valid' | 'expiring' | 'expired' | 'incomplete' => {
    if (!kit.is_complete || kit.needs_restocking) return 'expired'
    if (!kit.is_accessible) return 'incomplete'
    if (kit.next_check_date) {
      const days = getDaysUntilExpiry(kit.next_check_date)
      if (days < 0) return 'expired'
      if (days <= 7) return 'expiring'
    }
    return 'valid'
  }

  // Load kit items
  const loadKitItems = async (kit: FirstAidKit) => {
    setSelectedKit(kit)
    setIsLoadingItems(true)
    setIsCheckModalOpen(true)

    try {
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('first_aid_items')
        .select('*')
        .eq('kit_id', kit.id)
        .order('item_category', { ascending: true })
        .order('item_name', { ascending: true })

      if (error) throw error

      setKitItems(data || [])

      // Initialize checklist state
      const initialState: Record<string, boolean> = {}
      data?.forEach((item) => {
        initialState[item.id] = item.is_present && !item.is_expired
      })
      setChecklistState(initialState)
    } catch (error) {
      console.error('Error loading kit items:', error)
      setKitItems([])
    } finally {
      setIsLoadingItems(false)
    }
  }

  // Save checklist
  const saveChecklist = async () => {
    if (!selectedKit) return

    try {
      const supabase = createSupabaseBrowser()

      // Update items based on checklist
      const updates = Object.entries(checklistState).map(([itemId, isChecked]) => ({
        id: itemId,
        is_present: isChecked,
        last_checked_at: new Date().toISOString(),
        checked_by: user.email,
      }))

      for (const update of updates) {
        await supabase.from('first_aid_items').update(update).eq('id', update.id)
      }

      // Update kit
      const hasIssues = Object.values(checklistState).some((checked) => !checked)
      await supabase
        .from('first_aid_kits')
        .update({
          last_check_date: new Date().toISOString().split('T')[0],
          checked_by: user.email,
          is_complete: !hasIssues,
          needs_restocking: hasIssues,
        })
        .eq('id', selectedKit.id)

      setIsCheckModalOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error saving checklist:', error)
      alert('Eroare la salvarea verificării')
    }
  }

  // Get item status
  const getItemStatus = (item: FirstAidItem): 'valid' | 'expiring' | 'expired' | 'incomplete' => {
    if (!item.is_present) return 'expired'
    if (item.is_expired) return 'expired'
    if (item.quantity_current < item.quantity_required) return 'expiring'
    if (item.expiry_date) {
      return getExpiryStatus(item.expiry_date)
    }
    return 'valid'
  }

  // Group items by category
  const groupedItems = useMemo(() => {
    const grouped: Record<string, FirstAidItem[]> = {}
    kitItems.forEach((item) => {
      const category = item.item_category || 'Altele'
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(item)
    })
    return grouped
  }, [kitItems])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-red-600" />
                Truse Prim Ajutor
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Gestiune truse prim ajutor, conținut și verificări periodice
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Trusă nouă
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <div className="text-xs text-blue-700 mt-1">Total truse</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-900">{stats.needsRestocking}</div>
              <div className="text-xs text-red-700 mt-1">Necesită recompletare</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-900">{stats.notAccessible}</div>
              <div className="text-xs text-orange-700 mt-1">Inaccesibile</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-900">{stats.incomplete}</div>
              <div className="text-xs text-yellow-700 mt-1">Incomplete</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-900">{stats.dueForCheck}</div>
              <div className="text-xs text-purple-700 mt-1">Verificare scadentă</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Caută după nume, locație sau cod..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toate organizațiile</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kits List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredKits.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Nicio trusă găsită"
            description="Nu există truse de prim ajutor înregistrate pentru criteriile selectate."
            actionLabel="Adaugă prima trusă"
            onAction={() => {}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKits.map((kit) => {
              const status = getKitStatus(kit)
              const daysUntilCheck = kit.next_check_date
                ? getDaysUntilExpiry(kit.next_check_date)
                : null

              return (
                <div
                  key={kit.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{kit.name}</h3>
                      {kit.organizations && (
                        <p className="text-sm text-gray-500">{kit.organizations.name}</p>
                      )}
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{kit.location}</span>
                    </div>

                    {kit.kit_code && (
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Cod: {kit.kit_code}</span>
                      </div>
                    )}

                    {kit.last_check_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Ultimă verificare:{' '}
                          {new Date(kit.last_check_date).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                    )}

                    {daysUntilCheck !== null && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            daysUntilCheck < 0
                              ? 'text-red-500'
                              : daysUntilCheck <= 7
                              ? 'text-orange-500'
                              : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={`${
                            daysUntilCheck < 0
                              ? 'text-red-600 font-medium'
                              : daysUntilCheck <= 7
                              ? 'text-orange-600 font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          {daysUntilCheck < 0
                            ? `Verificare depășită cu ${Math.abs(daysUntilCheck)} zile`
                            : `Verificare în ${daysUntilCheck} zile`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        kit.is_complete ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {kit.is_complete ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>{kit.is_complete ? 'Completă' : 'Incompletă'}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        kit.is_accessible ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {kit.is_accessible ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>{kit.is_accessible ? 'Accesibilă' : 'Inaccesibilă'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => loadKitItems(kit)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      Verifică trusa
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Checklist Modal */}
      <Modal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        title={`Verificare: ${selectedKit?.name || ''}`}
        size="lg"
      >
        {isLoadingItems ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Kit info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <MapPin className="h-4 w-4" />
                {selectedKit?.location}
              </div>
              {selectedKit?.last_check_date && (
                <div className="text-xs text-gray-500">
                  Ultima verificare: {new Date(selectedKit.last_check_date).toLocaleDateString('ro-RO')}
                </div>
              )}
            </div>

            {/* Items by category */}
            {Object.keys(groupedItems).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nu există articole înregistrate în această trusă.
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    {category}
                  </h3>
                  {items.map((item) => {
                    const itemStatus = getItemStatus(item)
                    const daysToExpiry = item.expiry_date
                      ? getDaysUntilExpiry(item.expiry_date)
                      : null

                    return (
                      <label
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checklistState[item.id] || false}
                          onChange={(e) =>
                            setChecklistState((prev) => ({
                              ...prev,
                              [item.id]: e.target.checked,
                            }))
                          }
                          className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{item.item_name}</div>
                              <div className="text-sm text-gray-500">
                                Necesar: {item.quantity_required} {item.unit} | Disponibil:{' '}
                                {item.quantity_current} {item.unit}
                              </div>
                              {item.expiry_date && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Expiră: {new Date(item.expiry_date).toLocaleDateString('ro-RO')}
                                  {daysToExpiry !== null && daysToExpiry < 30 && (
                                    <span
                                      className={`ml-2 ${
                                        daysToExpiry < 0 ? 'text-red-600' : 'text-orange-600'
                                      } font-medium`}
                                    >
                                      ({daysToExpiry < 0 ? 'expirat' : `${daysToExpiry} zile`})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <StatusBadge status={itemStatus} />
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              ))
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsCheckModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                onClick={saveChecklist}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvează verificarea
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
