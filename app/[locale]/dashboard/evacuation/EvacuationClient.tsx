'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Clock, AlertCircle, CheckCircle2, Calendar, Timer, Eye } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import EvacuationDrillForm from './EvacuationDrillForm'
import DrillDetailModal from './DrillDetailModal'

interface EvacuationClientProps {
  user: { id: string; email: string }
  drills: any[]
  organizations: any[]
}

export default function EvacuationClient({
  user,
  drills: initialDrills,
  organizations,
}: EvacuationClientProps) {
  const [drills, setDrills] = useState(initialDrills)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDrill, setSelectedDrill] = useState<any | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'programat' | 'efectuat' | 'anulat'>('all')

  const handleDrillCreated = (newDrill: any) => {
    setDrills([newDrill, ...drills])
    setIsFormOpen(false)
  }

  const handleDrillUpdated = (updatedDrill: any) => {
    setDrills(drills.map(drill => drill.id === updatedDrill.id ? updatedDrill : drill))
    setSelectedDrill(updatedDrill)
  }

  // Filter drills
  const filteredDrills = drills.filter(drill => {
    if (statusFilter !== 'all' && drill.status !== statusFilter) return false
    return true
  })

  // Get next scheduled drill
  const nextDrill = drills
    .filter(d => d.status === 'programat' && new Date(d.scheduled_date) > new Date())
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())[0]

  // Completed drills (efectuate)
  const completedDrills = drills.filter(d => d.status === 'efectuat')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Exerciții de Evacuare</h1>
                <p className="text-sm text-gray-500">
                  Programare, monitorizare și raportare exerciții PSI
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Programează exercițiu
            </button>
          </div>
        </div>

        {/* Next Drill Countdown */}
        {nextDrill && (
          <NextDrillCountdown drill={nextDrill} />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total exerciții"
            value={drills.length}
            icon={Calendar}
            color="gray"
          />
          <StatCard
            label="Programate"
            value={drills.filter(d => d.status === 'programat').length}
            icon={Clock}
            color="blue"
          />
          <StatCard
            label="Efectuate"
            value={completedDrills.length}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            label="Anulate"
            value={drills.filter(d => d.status === 'anulat').length}
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filtrează:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toate</option>
              <option value="programat">Programate</option>
              <option value="efectuat">Efectuate</option>
              <option value="anulat">Anulate</option>
            </select>

            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Resetează
              </button>
            )}
          </div>
        </div>

        {/* Drills List */}
        {filteredDrills.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <EmptyState
              title="Niciun exercițiu"
              description="Programează primul exercițiu de evacuare"
              actionLabel="Programează exercițiu"
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
                      Data programată
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organizație
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scenariu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participanți
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timp evacuare
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrills.map((drill) => (
                    <tr key={drill.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(drill.scheduled_date).toLocaleDateString('ro-RO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(drill.scheduled_date).toLocaleTimeString('ro-RO', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {drill.organizations?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          CUI: {drill.organizations?.cui}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {drill.scenario || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-600">
                            Estimați: {drill.estimated_participants || '—'}
                          </span>
                          {drill.actual_participants && (
                            <span className="text-sm font-medium text-gray-900">
                              Prezenți: {drill.actual_participants}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={drill.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {drill.evacuation_time_seconds ? (
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatTime(drill.evacuation_time_seconds)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedDrill(drill)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
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

        {/* Modals */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Programează exercițiu de evacuare"
        >
          <EvacuationDrillForm
            user={user}
            organizations={organizations}
            onSuccess={handleDrillCreated}
            onCancel={() => setIsFormOpen(false)}
          />
        </Modal>

        {selectedDrill && (
          <DrillDetailModal
            drill={selectedDrill}
            onClose={() => setSelectedDrill(null)}
            onUpdate={handleDrillUpdated}
            user={user}
          />
        )}
      </div>
    </div>
  )
}

// Countdown Component
function NextDrillCountdown({ drill }: { drill: any }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const drillDate = new Date(drill.scheduled_date)
      const diff = drillDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('În curs')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days}z ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${minutes}m`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [drill.scheduled_date])

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Timer className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Următorul exercițiu</h3>
            <p className="text-sm text-white/80">{drill.organizations?.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{timeLeft}</div>
          <div className="text-sm text-white/80">
            {new Date(drill.scheduled_date).toLocaleDateString('ro-RO', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
      {drill.scenario && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-white/90">
            <span className="font-medium">Scenariu:</span> {drill.scenario}
          </p>
        </div>
      )}
    </div>
  )
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, color }: {
  label: string
  value: number
  icon: any
  color: 'gray' | 'blue' | 'green' | 'red' | 'orange'
}) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    programat: { label: 'Programat', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    efectuat: { label: 'Efectuat', class: 'bg-green-100 text-green-700 border-green-200' },
    anulat: { label: 'Anulat', class: 'bg-red-100 text-red-700 border-red-200' },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.programat

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.class}`}>
      {config.label}
    </span>
  )
}

// Format time helper
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
