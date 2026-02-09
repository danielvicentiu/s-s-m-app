'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import Link from 'next/link'
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Lock,
  CheckCircle,
  XCircle,
  Mail,
  MessageCircle,
  Smartphone,
} from 'lucide-react'
import CountryFilter from '@/components/admin/CountryFilter'
import { AlertCategory, CountryCode, COUNTRY_FLAGS } from '@/lib/types'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface Props {
  alertCategories: AlertCategory[]
  stats: {
    total: number
    active: number
    system: number
    countries: number
  }
  canDelete: boolean
}

export default function AlertCategoriesClient({ alertCategories, stats, canDelete }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | 'ALL'>('ALL')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // Filtrare per țară
  const filteredCategories = selectedCountry === 'ALL'
    ? alertCategories
    : alertCategories.filter(c => c.country_code === selectedCountry)

  // Șterge categorie (doar non-system)
  async function handleDelete(id: string) {
    if (!canDelete) {
      alert('Nu ai permisiune să ștergi categorii')
      return
    }

    setIsDeleting(true)
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase
        .from('alert_categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      router.refresh()
      setDeleteConfirm(null)
    } catch (error: any) {
      console.error('Error deleting alert category:', error)
      alert('Eroare la ștergere: ' + (error.message || 'Necunoscut'))
    } finally {
      setIsDeleting(false)
    }
  }

  // Helper severity badge
  function getSeverityBadge(severity: string) {
    switch (severity) {
      case 'info':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">Info</span>
      case 'warning':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-sm font-medium">Avertisment</span>
      case 'critical':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium">Critic</span>
      case 'expired':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-sm font-medium">Expirat</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">{severity}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="h-7 w-7 text-blue-600" />
                Categorii Alerte Automate
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configurare categorii alerte cu severitate și canale notificare
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/alert-categories/new"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Categorie Nouă
              </Link>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{stats.total}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Total Categorii
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
          </div>

          {/* FILTRU ȚARĂ */}
          <div className="mt-6">
            <CountryFilter value={selectedCountry} onChange={setSelectedCountry} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* TABEL CATEGORII */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Țară
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Severitate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Perioada Avertizare
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Obligație
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Canale
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
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {category.is_system && (
                          <span title="System category">
                            <Lock className="h-4 w-4 text-purple-500" />
                          </span>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{category.name}</div>
                          {category.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-md">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-2xl">{COUNTRY_FLAGS[category.country_code]}</span>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {category.country_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getSeverityBadge(category.severity)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>⚠️ {category.warning_days_before} zile</div>
                        <div className="text-red-600">🔴 {category.critical_days_before} zile</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {category.obligation_types ? (
                        <div className="text-sm text-gray-700">
                          {(category.obligation_types as any).name}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {category.notify_channels.includes('email') && (
                          <span title="Email">
                            <Mail className="h-4 w-4 text-blue-600" />
                          </span>
                        )}
                        {category.notify_channels.includes('whatsapp') && (
                          <span title="WhatsApp">
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </span>
                        )}
                        {category.notify_channels.includes('sms') && (
                          <span title="SMS">
                            <Smartphone className="h-4 w-4 text-purple-600" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {category.is_active ? (
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/alert-categories/${category.id}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Editează
                        </Link>
                        {!category.is_system && canDelete && (
                          <>
                            {deleteConfirm === category.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(category.id)}
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
                                onClick={() => setDeleteConfirm(category.id)}
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

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedCountry === 'ALL'
                  ? 'Nicio categorie găsită'
                  : `Nicio categorie pentru ${COUNTRY_FLAGS[selectedCountry]} ${selectedCountry}`}
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
            href="/admin/obligations"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Admin Obligații →
          </Link>
        </div>
      </main>
    </div>
  )
}
