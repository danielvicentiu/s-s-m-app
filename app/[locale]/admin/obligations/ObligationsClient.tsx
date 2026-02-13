'use client'

import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import CountryFilter from '@/components/admin/CountryFilter'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { type ObligationType, type CountryCode, COUNTRY_FLAGS } from '@/lib/types'

interface Props {
  obligations: ObligationType[]
  stats: {
    total: number
    active: number
    system: number
    countries: number
  }
  canDelete: boolean
}

export default function ObligationsClient({ obligations, stats, canDelete }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | 'ALL'>('ALL')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // Filtrare per țară
  const filteredObligations = selectedCountry === 'ALL'
    ? obligations
    : obligations.filter(o => o.country_code === selectedCountry)

  // Șterge obligație (doar non-system)
  async function handleDelete(id: string) {
    if (!canDelete) {
      alert('Nu ai permisiune să ștergi obligații')
      return
    }

    setIsDeleting(true)
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase
        .from('obligation_types')
        .delete()
        .eq('id', id)

      if (error) {throw error}

      router.refresh()
      setDeleteConfirm(null)
    } catch (error: any) {
      console.error('Error deleting obligation:', error)
      alert(`Eroare la ștergere: ${  error.message || 'Necunoscut'}`)
    } finally {
      setIsDeleting(false)
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
                <FileText className="h-7 w-7 text-blue-600" />
                Obligații Legale SSM & PSI
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestionare obligații legale per țară — fiecare obligație poate genera alerte automate
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/obligations/new"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Obligație Nouă
              </Link>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{stats.total}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Total Obligații
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
        {/* TABEL OBLIGAȚII */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Obligație
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Țară
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Frecvență
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Autoritate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Penalitate
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
                {filteredObligations.map((obligation) => (
                  <tr key={obligation.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {obligation.is_system && (
                          <span title="System obligation">
                            <Lock className="h-4 w-4 text-purple-500" />
                          </span>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{obligation.name}</div>
                          {obligation.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-md">
                              {obligation.description}
                            </div>
                          )}
                          {obligation.legal_reference && (
                            <div className="text-xs text-blue-600 mt-1 font-mono">
                              {obligation.legal_reference}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-2xl">{COUNTRY_FLAGS[obligation.country_code]}</span>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {obligation.country_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                        {obligation.frequency === 'annual' && 'Anual'}
                        {obligation.frequency === 'biannual' && 'Bianual'}
                        {obligation.frequency === 'monthly' && 'Lunar'}
                        {obligation.frequency === 'quarterly' && 'Trimestrial'}
                        {obligation.frequency === 'on_demand' && 'La cerere'}
                        {obligation.frequency === 'once' && 'O dată'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{obligation.authority_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {obligation.penalty_min && obligation.penalty_max ? (
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-semibold text-gray-900">
                            {obligation.penalty_min.toLocaleString()} - {obligation.penalty_max.toLocaleString()} {obligation.currency}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {obligation.is_active ? (
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
                          href={`/admin/obligations/${obligation.id}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Editează
                        </Link>
                        {!obligation.is_system && canDelete && (
                          <>
                            {deleteConfirm === obligation.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(obligation.id)}
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
                                onClick={() => setDeleteConfirm(obligation.id)}
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

          {filteredObligations.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedCountry === 'ALL'
                  ? 'Nicio obligație găsită'
                  : `Nicio obligație pentru ${COUNTRY_FLAGS[selectedCountry]} ${selectedCountry}`}
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
            href="/admin/roles"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Admin Roluri →
          </Link>
        </div>
      </main>
    </div>
  )
}
