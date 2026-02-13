'use client'

import { useState, useMemo } from 'react'
import { Search, Building2, Users, Calendar, MoreVertical, Eye, Ban, Trash2 } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Organization {
  id: string
  name: string
  cui: string | null
  created_at: string
  cooperation_status: 'active' | 'warning' | 'uncooperative'
  employee_count?: number
  contact_email: string | null
  contact_phone: string | null
  county: string | null
  address: string | null
}

interface OrganizationsClientProps {
  organizations: Organization[]
  userId: string
}

type StatusFilter = 'all' | 'active' | 'warning' | 'uncooperative'

export default function OrganizationsClient({ organizations, userId }: OrganizationsClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'suspend' | 'delete' | null
    orgId: string | null
    orgName: string
  }>({
    isOpen: false,
    type: null,
    orgId: null,
    orgName: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  // Filter and search organizations
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      // Status filter
      if (statusFilter !== 'all' && org.cooperation_status !== statusFilter) {
        return false
      }

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          org.name.toLowerCase().includes(search) ||
          org.cui?.toLowerCase().includes(search) ||
          org.county?.toLowerCase().includes(search)
        )
      }

      return true
    })
  }, [organizations, searchTerm, statusFilter])

  const handleSuspend = async (orgId: string) => {
    setIsLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase
        .from('organizations')
        .update({ cooperation_status: 'uncooperative' })
        .eq('id', orgId)

      if (error) throw error

      router.refresh()
      setConfirmDialog({ isOpen: false, type: null, orgId: null, orgName: '' })
    } catch (error) {
      console.error('Error suspending organization:', error)
      alert('Eroare la suspendarea organizației')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (orgId: string) => {
    setIsLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      // Soft delete - set cooperation_status to uncooperative and add deleted_at
      const { error } = await supabase
        .from('organizations')
        .update({
          cooperation_status: 'uncooperative',
          // Note: If deleted_at column exists, uncomment:
          // deleted_at: new Date().toISOString()
        })
        .eq('id', orgId)

      if (error) throw error

      router.refresh()
      setConfirmDialog({ isOpen: false, type: null, orgId: null, orgName: '' })
    } catch (error) {
      console.error('Error deleting organization:', error)
      alert('Eroare la ștergerea organizației')
    } finally {
      setIsLoading(false)
    }
  }

  const openConfirmDialog = (type: 'suspend' | 'delete', orgId: string, orgName: string) => {
    setConfirmDialog({ isOpen: true, type, orgId, orgName })
    setActionMenuOpen(null)
  }

  const getStatusBadge = (status: string) => {
    const config = {
      active: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Activ' },
      warning: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Atenționare' },
      uncooperative: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Suspendat' },
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', label: status }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organizații</h1>
              <p className="text-sm text-gray-500">Administrare organizații înregistrate</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Caută după nume, CUI, județ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">Toate ({organizations.length})</option>
              <option value="active">Active ({organizations.filter(o => o.cooperation_status === 'active').length})</option>
              <option value="warning">Atenționare ({organizations.filter(o => o.cooperation_status === 'warning').length})</option>
              <option value="uncooperative">Suspendate ({organizations.filter(o => o.cooperation_status === 'uncooperative').length})</option>
            </select>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-500">
            Afișare {filteredOrganizations.length} din {organizations.length} organizații
          </div>
        </div>

        {/* Table */}
        {filteredOrganizations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm">
            <EmptyState
              icon={Building2}
              title="Nicio organizație găsită"
              description="Nu există organizații care să corespundă criteriilor de căutare."
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Organizație
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      CUI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Angajați
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Înregistrare
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrganizations.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{org.name}</div>
                          {org.county && (
                            <div className="text-sm text-gray-500">{org.county}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 font-mono">
                          {org.cui || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="h-4 w-4 text-gray-400" />
                          {org.employee_count || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(org.cooperation_status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(org.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === org.id ? null : org.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </button>

                          {actionMenuOpen === org.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActionMenuOpen(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                <button
                                  onClick={() => router.push(`/admin/organizations/${org.id}`)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  Detalii
                                </button>
                                {org.cooperation_status !== 'uncooperative' && (
                                  <button
                                    onClick={() => openConfirmDialog('suspend', org.id, org.name)}
                                    className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                                  >
                                    <Ban className="h-4 w-4" />
                                    Suspendă
                                  </button>
                                )}
                                <button
                                  onClick={() => openConfirmDialog('delete', org.id, org.name)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Șterge
                                </button>
                              </div>
                            </>
                          )}
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'suspend' ? 'Suspendă organizația?' : 'Șterge organizația?'}
        message={
          confirmDialog.type === 'suspend'
            ? `Ești sigur că vrei să suspenzi organizația "${confirmDialog.orgName}"? Membrii nu vor mai putea accesa platforma.`
            : `Ești sigur că vrei să ștergi organizația "${confirmDialog.orgName}"? Această acțiune nu poate fi anulată.`
        }
        confirmLabel={confirmDialog.type === 'suspend' ? 'Suspendă' : 'Șterge'}
        onConfirm={() => {
          if (confirmDialog.type === 'suspend' && confirmDialog.orgId) {
            handleSuspend(confirmDialog.orgId)
          } else if (confirmDialog.type === 'delete' && confirmDialog.orgId) {
            handleDelete(confirmDialog.orgId)
          }
        }}
        onCancel={() => setConfirmDialog({ isOpen: false, type: null, orgId: null, orgName: '' })}
        isDestructive={true}
        loading={isLoading}
      />
    </div>
  )
}
