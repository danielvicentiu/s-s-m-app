'use client'

import { useState, useEffect } from 'react'
import { Plus, ShieldAlert, Clock, CheckCircle2, XCircle, AlertTriangle, Filter, Eye, Ban } from 'lucide-react'
import type { WorkPermit, WorkPermitStatus, WorkPermitType } from '@/lib/types'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import WorkPermitForm from './WorkPermitForm'
import WorkPermitDetailModal from './WorkPermitDetailModal'

interface WorkPermitsClientProps {
  user: { id: string; email: string }
  workPermits: any[]
  organizations: any[]
  employees: any[]
}

export default function WorkPermitsClient({
  user,
  workPermits: initialWorkPermits,
  organizations,
  employees,
}: WorkPermitsClientProps) {
  const [workPermits, setWorkPermits] = useState(initialWorkPermits)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPermit, setSelectedPermit] = useState<any | null>(null)
  const [statusFilter, setStatusFilter] = useState<WorkPermitStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<WorkPermitType | 'all'>('all')

  // Auto-update expired permits on mount and periodically
  useEffect(() => {
    const updateExpiredPermits = () => {
      const now = new Date()
      setWorkPermits(prev => prev.map(permit => {
        if (permit.status === 'activ' && new Date(permit.end_datetime) < now) {
          return { ...permit, status: 'expirat' }
        }
        return permit
      }))
    }

    updateExpiredPermits()
    const interval = setInterval(updateExpiredPermits, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const handlePermitCreated = (newPermit: any) => {
    setWorkPermits([newPermit, ...workPermits])
    setIsFormOpen(false)
  }

  const handlePermitUpdated = (updatedPermit: any) => {
    setWorkPermits(workPermits.map(permit => permit.id === updatedPermit.id ? updatedPermit : permit))
    setSelectedPermit(updatedPermit)
  }

  // Filter permits
  const filteredPermits = workPermits.filter(permit => {
    if (statusFilter !== 'all' && permit.status !== statusFilter) return false
    if (typeFilter !== 'all' && permit.work_type !== typeFilter) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Permise de Lucru</h1>
                <p className="text-sm text-gray-500">
                  Gestionare permise pentru lucrări periculoase
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Permis nou
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total permise"
            value={workPermits.length}
            icon={ShieldAlert}
            color="gray"
          />
          <StatCard
            label="Active"
            value={workPermits.filter(p => p.status === 'activ').length}
            icon={Clock}
            color="green"
          />
          <StatCard
            label="Expirate"
            value={workPermits.filter(p => p.status === 'expirat').length}
            icon={AlertTriangle}
            color="orange"
          />
          <StatCard
            label="Anulate"
            value={workPermits.filter(p => p.status === 'anulat').length}
            icon={XCircle}
            color="red"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtre:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toate statusurile</option>
              <option value="activ">Activ</option>
              <option value="expirat">Expirat</option>
              <option value="anulat">Anulat</option>
              <option value="finalizat">Finalizat</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toate tipurile</option>
              <option value="lucru_inaltime">Lucru la înălțime</option>
              <option value="spatii_confinate">Spații confinate</option>
              <option value="foc_deschis">Foc deschis</option>
              <option value="electrice">Lucrări electrice</option>
              <option value="excavare">Excavare</option>
              <option value="lucru_calte">Lucru la calde</option>
              <option value="radiatii">Radiații</option>
              <option value="substante_periculoase">Substanțe periculoase</option>
              <option value="altul">Altul</option>
            </select>

            {(statusFilter !== 'all' || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setStatusFilter('all')
                  setTypeFilter('all')
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Resetează filtre
              </button>
            )}
          </div>
        </div>

        {/* Permits List */}
        {filteredPermits.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <EmptyState
              icon={ShieldAlert}
              title="Niciun permis de lucru"
              description="Nu există permise de lucru. Începeți prin a crea primul permis."
              actionLabel="Creează permis"
              onAction={() => setIsFormOpen(true)}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Număr permis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip lucrare
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Locație
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dată început
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dată sfârșit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPermits.map((permit) => (
                    <tr key={permit.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permit.permit_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <WorkTypeBadge workType={permit.work_type} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {permit.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(permit.start_datetime).toLocaleString('ro-RO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(permit.end_datetime).toLocaleString('ro-RO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={permit.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedPermit(permit)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Detalii
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Permis de lucru nou"
        size="xl"
      >
        <WorkPermitForm
          userId={user.id}
          organizations={organizations}
          employees={employees}
          onSuccess={handlePermitCreated}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Detail Modal */}
      {selectedPermit && (
        <WorkPermitDetailModal
          permit={selectedPermit}
          userId={user.id}
          onClose={() => setSelectedPermit(null)}
          onUpdate={handlePermitUpdated}
        />
      )}
    </div>
  )
}

// Stats Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: any
  color: 'gray' | 'green' | 'orange' | 'red'
}) {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

// Work Type Badge Component
function WorkTypeBadge({ workType }: { workType: WorkPermitType }) {
  const config: Record<WorkPermitType, { label: string; color: string }> = {
    lucru_inaltime: { label: 'Lucru la înălțime', color: 'bg-blue-100 text-blue-700' },
    spatii_confinate: { label: 'Spații confinate', color: 'bg-purple-100 text-purple-700' },
    foc_deschis: { label: 'Foc deschis', color: 'bg-red-100 text-red-700' },
    electrice: { label: 'Electrice', color: 'bg-yellow-100 text-yellow-700' },
    excavare: { label: 'Excavare', color: 'bg-orange-100 text-orange-700' },
    lucru_calte: { label: 'Lucru la calde', color: 'bg-red-100 text-red-700' },
    radiatii: { label: 'Radiații', color: 'bg-pink-100 text-pink-700' },
    substante_periculoase: { label: 'Substanțe periculoase', color: 'bg-indigo-100 text-indigo-700' },
    altul: { label: 'Altul', color: 'bg-gray-100 text-gray-700' },
  }

  const c = config[workType]

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.label}
    </span>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: WorkPermitStatus }) {
  const config = {
    activ: { bg: 'bg-green-100', text: 'text-green-700', label: 'Activ', icon: Clock },
    expirat: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expirat', icon: AlertTriangle },
    anulat: { bg: 'bg-red-100', text: 'text-red-700', label: 'Anulat', icon: XCircle },
    finalizat: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Finalizat', icon: CheckCircle2 },
  }

  const c = config[status]
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  )
}
