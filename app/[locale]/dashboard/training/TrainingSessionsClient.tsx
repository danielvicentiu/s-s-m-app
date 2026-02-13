// ============================================================
// S-S-M.RO — Training Sessions List Client Component
// File: app/[locale]/dashboard/training/TrainingSessionsClient.tsx
// Lista sesiuni de instruire cu filtrare, paginare, acțiuni
// ============================================================
'use client'

import { useState, useMemo } from 'react'
import type { TrainingCategory, TrainingType } from '@/lib/training-types'
import { CATEGORY_CONFIG } from '@/lib/training-types'

type SessionStatus = 'programat' | 'in_curs' | 'finalizat' | 'anulat'

interface TrainingSession {
  id: string
  organization_id: string
  module_id: string
  worker_id: string
  instructor_name: string
  session_date: string
  duration_minutes: number
  language: string
  location: string | null
  test_score: number | null
  test_questions_total: number | null
  test_questions_correct: number | null
  verification_result: 'pending' | 'admis' | 'respins'
  created_at: string
  training_modules?: {
    code: string
    title: string
    category: TrainingCategory
    training_type: TrainingType
  }
  profiles?: {
    full_name: string
  }
  organizations?: {
    name: string
  }
}

interface TrainingModule {
  id: string
  code: string
  title: string
  category: TrainingCategory
  training_type: TrainingType
  duration_minutes_required: number
}

interface Worker {
  user_id: string
  profiles: {
    full_name: string
  }
}

interface Props {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui?: string }>
  initialSelectedOrg: string
  sessions: TrainingSession[]
  modules: TrainingModule[]
  workers: Worker[]
}

const STATUS_CONFIG: Record<SessionStatus, { label: string; color: string; bgColor: string }> = {
  programat: { label: 'Programat', color: '#3B82F6', bgColor: '#1E3A5F' },
  in_curs: { label: 'În Curs', color: '#F59E0B', bgColor: '#422006' },
  finalizat: { label: 'Finalizat', color: '#10B981', bgColor: '#064E3B' },
  anulat: { label: 'Anulat', color: '#6B7280', bgColor: '#1F2937' },
}

const ITEMS_PER_PAGE = 20

export default function TrainingSessionsClient({
  user,
  organizations,
  initialSelectedOrg,
  sessions: initialSessions,
  modules,
  workers,
}: Props) {
  const [selectedOrgId, setSelectedOrgId] = useState(initialSelectedOrg)
  const [sessions, setSessions] = useState(initialSessions)

  // Filters
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<SessionStatus | ''>('')
  const [searchTerm, setSearchTerm] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleModuleId, setScheduleModuleId] = useState('')
  const [scheduleWorkerIds, setScheduleWorkerIds] = useState<string[]>([])
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0])
  const [scheduleInstructor, setScheduleInstructor] = useState('')
  const [scheduleLocation, setScheduleLocation] = useState('')

  // Compute session status based on date and verification
  const getSessionStatus = (session: TrainingSession): SessionStatus => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sessionDate = new Date(session.session_date)
    sessionDate.setHours(0, 0, 0, 0)

    // Check if session has been completed (has test results)
    if (session.verification_result === 'admis' || session.verification_result === 'respins') {
      return 'finalizat'
    }

    if (sessionDate < today) {
      return 'finalizat' // Past sessions are considered finished
    } else if (sessionDate.getTime() === today.getTime()) {
      return 'in_curs'
    } else {
      return 'programat'
    }
  }

  // Count participants for group sessions
  const getParticipantCount = (sessionId: string): number => {
    // In a real app, this would query a junction table
    // For now, return 1 (individual session)
    return 1
  }

  // Filter and paginate sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions.filter((s) => s.organization_id === selectedOrgId)

    if (filterType) {
      filtered = filtered.filter((s) => s.training_modules?.training_type === filterType)
    }

    if (filterStatus) {
      filtered = filtered.filter((s) => getSessionStatus(s) === filterStatus)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.training_modules?.title.toLowerCase().includes(term) ||
          s.profiles?.full_name.toLowerCase().includes(term) ||
          s.instructor_name.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [sessions, selectedOrgId, filterType, filterStatus, searchTerm])

  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE)
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const handleSchedule = async () => {
    if (!scheduleModuleId || scheduleWorkerIds.length === 0 || !scheduleInstructor) {
      alert('Completează toate câmpurile obligatorii')
      return
    }

    const selectedModule = modules.find((m) => m.id === scheduleModuleId)
    if (!selectedModule) return

    try {
      // Create a session for each selected worker
      const newSessions = scheduleWorkerIds.map((workerId) => ({
        id: crypto.randomUUID(),
        organization_id: selectedOrgId,
        module_id: scheduleModuleId,
        worker_id: workerId,
        instructor_name: scheduleInstructor,
        session_date: scheduleDate,
        duration_minutes: selectedModule.duration_minutes_required,
        language: 'ro',
        location: scheduleLocation || null,
        test_score: null,
        test_questions_total: null,
        test_questions_correct: null,
        verification_result: 'pending' as const,
        created_at: new Date().toISOString(),
        training_modules: {
          code: selectedModule.code,
          title: selectedModule.title,
          category: selectedModule.category,
          training_type: selectedModule.training_type,
        },
        profiles: {
          full_name: workers.find((w) => w.user_id === workerId)?.profiles.full_name || 'Necunoscut',
        },
        organizations: {
          name: organizations.find((o) => o.id === selectedOrgId)?.name || '',
        },
      }))

      // In a real app, this would call an API endpoint
      // For now, just update local state
      setSessions([...newSessions, ...sessions])

      // Reset form
      setShowScheduleModal(false)
      setScheduleModuleId('')
      setScheduleWorkerIds([])
      setScheduleDate(new Date().toISOString().split('T')[0])
      setScheduleInstructor('')
      setScheduleLocation('')

      alert(`${newSessions.length} sesiuni programate cu succes!`)
    } catch (error) {
      alert('Eroare la programarea sesiunii')
      console.error(error)
    }
  }

  const toggleWorkerSelection = (workerId: string) => {
    setScheduleWorkerIds((prev) =>
      prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]
    )
  }

  // Get unique training types from modules
  const trainingTypes = Array.from(new Set(modules.map((m) => m.training_type)))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Instruiri SSM/PSI</h1>
              <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">
                Sesiuni de instruire: {filteredSessions.length} total
              </p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
            >
              + Programează Instruire
            </button>
          </div>

          {/* Organization Selector */}
          {organizations.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-gray-600 dark:text-slate-400 text-sm">Organizație:</label>
              <select
                value={selectedOrgId}
                onChange={(e) => {
                  setSelectedOrgId(e.target.value)
                  handleFilterChange()
                }}
                className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui ? `(${org.cui})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-1.5">
                Tip Instruire
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value)
                  handleFilterChange()
                }}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="">Toate tipurile</option>
                {trainingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-1.5">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as SessionStatus | '')
                  handleFilterChange()
                }}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="">Toate statusurile</option>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-1.5">
                Căutare
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handleFilterChange()
                }}
                placeholder="Caută după instruire, participant, instructor..."
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                  <th className="text-left px-6 py-4 text-gray-700 dark:text-slate-300 font-semibold text-sm">
                    Tip Instruire
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 dark:text-slate-300 font-semibold text-sm">
                    Data
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 dark:text-slate-300 font-semibold text-sm">
                    Instructor
                  </th>
                  <th className="text-center px-6 py-4 text-gray-700 dark:text-slate-300 font-semibold text-sm">
                    Nr. Participanți
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 dark:text-slate-300 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-gray-700 dark:text-slate-300 font-semibold text-sm">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg
                          className="w-12 h-12 text-gray-400 dark:text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-gray-500 dark:text-slate-500 font-medium">
                          Nicio sesiune de instruire găsită
                        </p>
                        <p className="text-gray-400 dark:text-slate-600 text-sm">
                          Click &quot;Programează Instruire&quot; pentru a adăuga prima sesiune
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedSessions.map((session) => {
                    const status = getSessionStatus(session)
                    const participantCount = getParticipantCount(session.id)

                    return (
                      <tr
                        key={session.id}
                        className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="text-xs px-2 py-1 rounded-md font-medium"
                              style={{
                                color:
                                  CATEGORY_CONFIG[session.training_modules?.category || 'ssm']
                                    ?.color || '#6B7280',
                                backgroundColor: `${
                                  CATEGORY_CONFIG[session.training_modules?.category || 'ssm']
                                    ?.color || '#6B7280'
                                }20`,
                              }}
                            >
                              {CATEGORY_CONFIG[session.training_modules?.category || 'ssm']?.label}
                            </span>
                            <div>
                              <p className="text-gray-900 dark:text-white font-medium text-sm">
                                {session.training_modules?.title || 'Necunoscut'}
                              </p>
                              <p className="text-gray-500 dark:text-slate-500 text-xs">
                                {session.training_modules?.code}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 dark:text-white text-sm font-medium">
                            {new Date(session.session_date).toLocaleDateString('ro-RO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-gray-500 dark:text-slate-500 text-xs">
                            {session.duration_minutes} min
                            {session.location && ` • ${session.location}`}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {session.instructor_name}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-sm">
                            {participantCount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{
                              color: STATUS_CONFIG[status].color,
                              backgroundColor: STATUS_CONFIG[status].bgColor,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: STATUS_CONFIG[status].color }}
                            />
                            {STATUS_CONFIG[status].label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Detalii"
                            >
                              Detalii
                            </button>
                            {status === 'programat' && (
                              <button
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title="Editează"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Generează PDF"
                            >
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 dark:border-slate-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Afișare {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredSessions.length)} din{' '}
                  {filteredSessions.length} sesiuni
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600 dark:text-slate-400">
                    Pagina {currentPage} din {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Următor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Training Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Programează Instruire Nouă
                </h2>

                <div className="space-y-4">
                  {/* Module selector */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-1.5">
                      Modul de instruire
                    </label>
                    <select
                      value={scheduleModuleId}
                      onChange={(e) => setScheduleModuleId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">— Selectează modulul —</option>
                      {modules.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          {mod.code} — {mod.title} ({mod.duration_minutes_required} min)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-1.5">
                      Data sesiunii
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* Instructor */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-1.5">
                      Instructor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={scheduleInstructor}
                      onChange={(e) => setScheduleInstructor(e.target.value)}
                      placeholder="Nume complet instructor"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-1.5">
                      Locație (opțional)
                    </label>
                    <input
                      type="text"
                      value={scheduleLocation}
                      onChange={(e) => setScheduleLocation(e.target.value)}
                      placeholder="Ex: Sediu central, Sala de conferințe"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* Worker selection */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-1.5">
                      Participanți
                    </label>
                    <div className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg max-h-48 overflow-y-auto">
                      {workers.length === 0 ? (
                        <div className="px-3 py-4 text-gray-500 dark:text-slate-500 text-sm text-center">
                          Niciun angajat disponibil
                        </div>
                      ) : (
                        workers.map((w) => (
                          <label
                            key={w.user_id}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={scheduleWorkerIds.includes(w.user_id)}
                              onChange={() => toggleWorkerSelection(w.user_id)}
                              className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-900 dark:text-white text-sm">
                              {w.profiles.full_name}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    {scheduleWorkerIds.length > 0 && (
                      <p className="text-blue-600 dark:text-blue-400 text-xs mt-1.5">
                        {scheduleWorkerIds.length} participant
                        {scheduleWorkerIds.length > 1 ? 'i' : ''} selecta
                        {scheduleWorkerIds.length > 1 ? 'ți' : 't'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowScheduleModal(false)
                      setScheduleModuleId('')
                      setScheduleWorkerIds([])
                      setScheduleInstructor('')
                      setScheduleLocation('')
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={!scheduleModuleId || scheduleWorkerIds.length === 0 || !scheduleInstructor}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:text-gray-500 dark:disabled:text-slate-500 text-white rounded-xl text-sm font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    Programează
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
