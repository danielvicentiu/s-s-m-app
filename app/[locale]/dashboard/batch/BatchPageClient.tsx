// app/[locale]/dashboard/batch/BatchPageClient.tsx
// M6 BATCH PROCESSING — Dashboard batch jobs (client component)
// Tabel cu status, progress bar, auto-refresh, retry, create job
// Data: 18 Februarie 2026

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Layers,
  Plus,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import BatchJobCard, { type BatchJob } from '@/components/dashboard/BatchJobCard'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  user: { id: string; email: string }
  initialJobs: BatchJob[]
}

const VALID_TYPES = [
  { value: 'psi_check', label: 'Verificare PSI' },
  { value: 'medical_check', label: 'Verificare medicală' },
  { value: 'iscir_check', label: 'Verificare ISCIR' },
  { value: 'legislative_update', label: 'Actualizare legislativă' },
] as const

type BatchJobType = (typeof VALID_TYPES)[number]['value']

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtDuration(startedAt: string | null, completedAt: string | null): string {
  if (!startedAt) return '—'
  const end = completedAt ? new Date(completedAt).getTime() : Date.now()
  const ms = end - new Date(startedAt).getTime()
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

const STATUS_BADGE: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
  pending: {
    label: 'În așteptare',
    cls: 'bg-gray-100 text-gray-600',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  processing: {
    label: 'Procesare',
    cls: 'bg-blue-50 text-blue-700',
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  done: {
    label: 'Finalizat',
    cls: 'bg-green-50 text-green-700',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  failed: {
    label: 'Eșuat',
    cls: 'bg-red-50 text-red-700',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
}

const TYPE_LABELS: Record<string, string> = {
  legislative_update: 'Actualizare legislativă',
  psi_check: 'Verificare PSI',
  medical_check: 'Verificare medicală',
  iscir_check: 'Verificare ISCIR',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BatchPageClient({ initialJobs }: Props) {
  const router = useRouter()

  // State
  const [jobs, setJobs] = useState<BatchJob[]>(initialJobs)
  const [loading, setLoading] = useState(false)
  const [runLoading, setRunLoading] = useState(false)
  const [retryLoadingId, setRetryLoadingId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createType, setCreateType] = useState<BatchJobType>('psi_check')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [runMessage, setRunMessage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // ── Fetch jobs ──────────────────────────────────────────────────────────────

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/batch/status')
      if (!res.ok) throw new Error('Failed to fetch jobs')
      const data = await res.json() as { jobs?: BatchJob[] }
      setJobs(data.jobs ?? [])
    } catch (err) {
      console.error('[BATCH] fetchJobs error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Auto-refresh la 10s când există jobs în procesare / pending ────────────

  useEffect(() => {
    const hasActive = jobs.some(
      (j) => j.status === 'processing' || j.status === 'pending',
    )
    if (!hasActive) return

    const interval = setInterval(fetchJobs, 10000)
    return () => clearInterval(interval)
  }, [jobs, fetchJobs])

  // ── Run now — procesează primul job pending ────────────────────────────────

  async function handleRunNow() {
    try {
      setRunLoading(true)
      setRunMessage(null)
      const res = await fetch('/api/batch/process', { method: 'POST' })
      const data = await res.json() as {
        processed?: boolean
        message?: string
        status?: string
        jobId?: string
      }

      if (!res.ok) throw new Error(data.message ?? 'Eroare la procesare')

      if (data.processed) {
        setRunMessage(`Job ${data.jobId?.slice(0, 8)} → ${data.status}`)
      } else {
        setRunMessage('Nu există job-uri în așteptare.')
      }
      await fetchJobs()
    } catch (err) {
      console.error('[BATCH] runNow error:', err)
      setRunMessage(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setRunLoading(false)
      setTimeout(() => setRunMessage(null), 5000)
    }
  }

  // ── Create job ──────────────────────────────────────────────────────────────

  async function handleCreateJob() {
    try {
      setCreateLoading(true)
      setCreateError(null)
      const res = await fetch('/api/batch/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: createType }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Eroare la creare')

      setShowCreateModal(false)
      await fetchJobs()
    } catch (err) {
      console.error('[BATCH] createJob error:', err)
      setCreateError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setCreateLoading(false)
    }
  }

  // ── Retry — crează un job nou cu același tip ───────────────────────────────

  async function handleRetry(job: BatchJob) {
    try {
      setRetryLoadingId(job.id)
      const res = await fetch('/api/batch/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: job.type,
          org_id: job.org_id,
          payload: job.payload,
        }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Eroare la retry')

      await fetchJobs()
    } catch (err) {
      console.error('[BATCH] retry error:', err)
    } finally {
      setRetryLoadingId(null)
    }
  }

  // ── Stats ───────────────────────────────────────────────────────────────────

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    processing: jobs.filter((j) => j.status === 'processing').length,
    done: jobs.filter((j) => j.status === 'done').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              Batch Jobs
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Procesare asincronă: PSI, medicală, ISCIR, legislativ
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle view */}
            <button
              onClick={() => setViewMode((v) => (v === 'table' ? 'cards' : 'table'))}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              {viewMode === 'table' ? 'Carduri' : 'Tabel'}
            </button>

            {/* Refresh */}
            <button
              onClick={fetchJobs}
              disabled={loading}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 transition disabled:opacity-50"
              title="Actualizează"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Run Now */}
            <button
              onClick={handleRunNow}
              disabled={runLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60"
            >
              {runLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Rulează acum
            </button>

            {/* Create Job */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 transition"
            >
              <Plus className="h-4 w-4" />
              Job nou
            </button>
          </div>
        </div>

        {/* Run feedback message */}
        {runMessage && (
          <div className="max-w-7xl mx-auto mt-2">
            <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-4 py-2">
              {runMessage}
            </p>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, cls: 'text-gray-900' },
            { label: 'În așteptare', value: stats.pending, cls: 'text-gray-600' },
            { label: 'Procesare', value: stats.processing, cls: 'text-blue-600' },
            { label: 'Finalizate', value: stats.done, cls: 'text-green-600' },
            { label: 'Eșuate', value: stats.failed, cls: 'text-red-600' },
          ].map(({ label, value, cls }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center"
            >
              <div className={`text-3xl font-black ${cls}`}>{value}</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Auto-refresh indicator */}
        {(stats.processing > 0 || stats.pending > 0) && (
          <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-lg px-4 py-2.5">
            <Loader2 className="h-4 w-4 animate-spin" />
            Auto-refresh activ — actualizare la 10 secunde
          </div>
        )}

        {/* JOBS LIST */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Layers className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-500">Niciun job batch</h3>
            <p className="text-sm text-gray-400 mt-1">
              Creează primul job folosind butonul „Job nou".
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          /* CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <BatchJobCard
                key={job.id}
                job={job}
                onRetry={handleRetry}
                retryLoading={retryLoadingId === job.id}
              />
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Tip', 'Status', 'Progress', 'Durată', 'Creat la', 'Acțiuni'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.map((job) => {
                    const sb = STATUS_BADGE[job.status] ?? STATUS_BADGE.pending
                    const progressPct =
                      job.items_total > 0
                        ? Math.round((job.items_processed / job.items_total) * 100)
                        : job.status === 'done'
                        ? 100
                        : 0

                    return (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        {/* Tip */}
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-800">
                            {TYPE_LABELS[job.type] ?? job.type}
                          </span>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">
                            {job.id.slice(0, 8)}…
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sb.cls}`}
                          >
                            {sb.icon}
                            {sb.label}
                          </span>
                        </td>

                        {/* Progress */}
                        <td className="px-4 py-3 min-w-[140px]">
                          {job.items_total > 0 || job.status === 'done' ? (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>
                                  {job.items_processed}/{job.items_total || '—'}
                                </span>
                                <span className="font-semibold">{progressPct}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-gray-100">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    job.status === 'failed'
                                      ? 'bg-red-400'
                                      : job.status === 'done'
                                      ? 'bg-green-500'
                                      : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Durată */}
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {fmtDuration(job.started_at, job.completed_at)}
                        </td>

                        {/* Creat la */}
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {fmtDate(job.created_at)}
                        </td>

                        {/* Acțiuni */}
                        <td className="px-4 py-3">
                          {job.status === 'failed' && (
                            <button
                              onClick={() => handleRetry(job)}
                              disabled={retryLoadingId === job.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition disabled:opacity-50"
                            >
                              <RefreshCw
                                className={`h-3.5 w-3.5 ${
                                  retryLoadingId === job.id ? 'animate-spin' : ''
                                }`}
                              />
                              Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── CREATE JOB MODAL ─────────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Job nou</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateError(null)
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Tip procesare *
              </label>
              <div className="relative">
                <select
                  value={createType}
                  onChange={(e) => setCreateType(e.target.value as BatchJobType)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-800 pr-8"
                >
                  {VALID_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-400">
                Job-ul va fi adăugat în coadă cu status „pending".
              </p>
            </div>

            {createError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {createError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateError(null)
                }}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Anulează
              </button>
              <button
                onClick={handleCreateJob}
                disabled={createLoading}
                className="flex-1 py-2.5 rounded-lg bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {createLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Crează job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
