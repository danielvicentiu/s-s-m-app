'use client'

import {
  Package,
  Plus,
  Edit,
  Trash2,
  Lock,
  CheckCircle,
  XCircle,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import CountryFilter from '@/components/admin/CountryFilter'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { type EquipmentType, type CountryCode, COUNTRY_FLAGS } from '@/lib/types'

interface Props {
  equipmentTypes: EquipmentType[]
  stats: {
    total: number
    active: number
    system: number
    countries: number
    categories: number
  }
  canDelete: boolean
}

export default function EquipmentTypesClient({ equipmentTypes, stats, canDelete }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | 'ALL'>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // Filtrare per țară și categorie
  let filteredEquipment = selectedCountry === 'ALL'
    ? equipmentTypes
    : equipmentTypes.filter(e => e.country_code === selectedCountry)

  if (selectedCategory !== 'ALL') {
    filteredEquipment = filteredEquipment.filter(e => e.category === selectedCategory)
  }

  // Categorii unice pentru filtru
  const categories = [...new Set(equipmentTypes.map(e => e.category))].sort()

  // Șterge tip echipament (doar non-system)
  async function handleDelete(id: string) {
    if (!canDelete) {
      alert('Nu ai permisiune să ștergi tipuri echipamente')
      return
    }

    setIsDeleting(true)
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase
        .from('equipment_types')
        .delete()
        .eq('id', id)

      if (error) {throw error}

      router.refresh()
      setDeleteConfirm(null)
    } catch (error: any) {
      console.error('Error deleting equipment type:', error)
      alert(`Eroare la ștergere: ${  error.message || 'Necunoscut'}`)
    } finally {
      setIsDeleting(false)
    }
  }

  // Helper category badge
  function getCategoryBadge(category: string) {
    const colors: Record<string, string> = {
      'fire_safety': 'bg-red-100 text-red-700',
      'first_aid': 'bg-green-100 text-green-700',
      'ppe': 'bg-blue-100 text-blue-700',
      'emergency_exit': 'bg-yellow-100 text-yellow-700',
      'detection': 'bg-purple-100 text-purple-700',
      'pressure_equipment': 'bg-orange-100 text-orange-700',
      'lifting_equipment': 'bg-pink-100 text-pink-700',
      'other': 'bg-gray-100 text-gray-700',
    }

    const labels: Record<string, string> = {
      'fire_safety': 'PSI',
      'first_aid': 'Prim Ajutor',
      'ppe': 'EIP',
      'emergency_exit': 'Ieșire Urgență',
      'detection': 'Detectare',
      'pressure_equipment': 'ISCIR',
      'lifting_equipment': 'Ridicare',
      'other': 'Altele',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium ${colors[category] || colors.other}`}>
        {labels[category] || category}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-7 w-7 text-blue-600" />
                Tipuri Echipamente SSM & PSI
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configurare tipuri echipamente cu frecvență inspecție și obligații legale
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/equipment-types/new"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tip Echipament Nou
              </Link>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{stats.total}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Total Tipuri
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <div className="text-3xl font-black text-green-600">{stats.active}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                Active
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
              <div className="text-3xl font-black text-purple-600">{stats.system}</div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">
                System
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
              <div className="text-3xl font-black text-orange-600">{stats.countries}</div>
              <div className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">
                Țări
              </div>
            </div>
            <div className="bg-pink-50 rounded-xl border border-pink-100 p-4">
              <div className="text-3xl font-black text-pink-600">{stats.categories}</div>
              <div className="text-xs font-semibold text-pink-600 uppercase tracking-widest mt-1">
                Categorii
              </div>
            </div>
          </div>

          {/* FILTRE */}
          <div className="mt-6 flex items-center gap-4">
            <CountryFilter value={selectedCountry} onChange={setSelectedCountry} />
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
              >
                <option value="ALL">Toate categoriile</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* TABEL ECHIPAMENTE */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tip Echipament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Țară
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Frecvență Inspecție
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Durată Viață
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Obligație
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEquipment.map((equipment) => (
                  <tr key={equipment.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {equipment.is_system && (
                          <span title="System equipment type">
                            <Lock className="h-4 w-4 text-purple-500" />
                          </span>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{equipment.name}</div>
                          {equipment.subcategory && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {equipment.subcategory}
                            </div>
                          )}
                          {equipment.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-md">
                              {equipment.description}
                            </div>
                          )}
                          {equipment.legal_standard && (
                            <div className="text-xs text-blue-600 mt-1 font-mono">
                              {equipment.legal_standard}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-2xl">{COUNTRY_FLAGS[equipment.country_code]}</span>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {equipment.country_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(equipment.category)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                        {equipment.inspection_frequency === 'annual' && 'Anual'}
                        {equipment.inspection_frequency === 'biannual' && 'Bianual'}
                        {equipment.inspection_frequency === 'monthly' && 'Lunar'}
                        {equipment.inspection_frequency === 'quarterly' && 'Trimestrial'}
                        {equipment.inspection_frequency === 'on_demand' && 'La cerere'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {equipment.max_lifespan_years ? (
                        <div className="text-sm text-gray-700">
                          {equipment.max_lifespan_years} ani
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {equipment.obligation_types ? (
                        <div className="text-sm text-gray-700">
                          {(equipment.obligation_types as any).name}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {equipment.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Activ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
                            <XCircle className="h-3.5 w-3.5" />
                            Inactiv
                          </span>
                        )}
                        {equipment.requires_certification && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            Certificare
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/equipment-types/${equipment.id}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Editează
                        </Link>
                        {!equipment.is_system && canDelete && (
                          <>
                            {deleteConfirm === equipment.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(equipment.id)}
                                  disabled={isDeleting}
                                  className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                                >
                                  {isDeleting ? 'Se șterge...' : 'Confirmare'}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  disabled={isDeleting}
                                  className="text-sm font-semibold text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                  Anulează
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(equipment.id)}
                                className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Șterge
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedCountry === 'ALL' && selectedCategory === 'ALL'
                  ? 'Niciun tip echipament găsit'
                  : 'Niciun tip echipament pentru filtrele selectate'}
              </p>
            </div>
          )}
        </div>

        {/* LINK ÎNAPOI */}
        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Înapoi la Dashboard
          </Link>
          <Link
            href="/admin/alert-categories"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Admin Alerte →
          </Link>
        </div>
      </main>
    </div>
  )
}
