// components/dashboard/BatchJobCard.tsx
// M6 BATCH PROCESSING — Card UI pentru un job batch
// Afișează tip, status badge, progress bar, durată, creat la, acțiuni
// Data: 18 Februarie 2026

'use client'

import { RefreshCw, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'

export interface BatchJob {
  id: string
  org_id: string | null
  status: 'pending' | 'processing' | 'done' | 'failed'
  type: string
  payload: Record<string, unknown>
  items_total: number
  items_processed: number
  items_failed: number
  created_by: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
  error_log: Array<{ item?: string; error: string; timestamp: string }>
}

interface BatchJobCardProps {
  job: BatchJob
  onRetry?: (job: BatchJob) => void
  retryLoading?: boolean
}

// ── Label maps ───────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  legislative_update: 'Actualizare legislativă',
  psi_check: 'Verificare PSI',
  medical_check: 'Verificare medicală',
  iscir_check: 'Verificare ISCIR',
}

const TYPE_COLORS: Record<string, string> = {
  legislative_update: 'bg-purple-50 text-purple-700',
  psi_check: 'bg-orange-50 text-orange-700',
  medical_check: 'bg-blue-50 text-blue-700',
  iscir_check: 'bg-yellow-50 text-yellow-700',
}

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'În așteptare',
    className: 'bg-gray-100 text-gray-600',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  processing: {
    label: 'Procesare...',
    className: 'bg-blue-50 text-blue-700',
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  done: {
    label: 'Finalizat',
    className: 'bg-green-50 text-green-700',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  failed: {
    label: 'Eșuat',
    className: 'bg-red-50 text-red-700',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(startedAt: string | null, completedAt: string | null): string {
  if (!startedAt) return '—'
  const end = completedAt ? new Date(completedAt).getTime() : Date.now()
  const ms = end - new Date(startedAt).getTime()
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BatchJobCard({ job, onRetry, retryLoading }: BatchJobCardProps) {
  const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.pending
  const typeLabel = TYPE_LABELS[job.type] ?? job.type
  const typeColor = TYPE_COLORS[job.type] ?? 'bg-gray-100 text-gray-700'

  const progressPct =
    job.items_total > 0
      ? Math.round((job.items_processed / job.items_total) * 100)
      : job.status === 'done'
      ? 100
      : 0

  const showProgress = job.items_total > 0 || job.status === 'done'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColor}`}>
            {typeLabel}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCfg.className}`}
          >
            {statusCfg.icon}
            {statusCfg.label}
          </span>
        </div>

        {/* Retry button — vizibil doar pentru job-uri eșuate */}
        {job.status === 'failed' && onRetry && (
          <button
            onClick={() => onRetry(job)}
            disabled={retryLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${retryLoading ? 'animate-spin' : ''}`} />
            Retry
          </button>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {job.items_processed} / {job.items_total > 0 ? job.items_total : '—'} items
            </span>
            <span className="font-semibold text-gray-700">{progressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                job.status === 'failed'
                  ? 'bg-red-400'
                  : job.status === 'done'
                  ? 'bg-green-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {job.items_failed > 0 && (
            <p className="text-xs text-red-600 font-medium">
              {job.items_failed} item{job.items_failed !== 1 ? 'e' : ''} eșuat{job.items_failed !== 1 ? 'e' : ''}
            </p>
          )}
        </div>
      )}

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
        <span>
          <span className="font-medium text-gray-600">Creat:</span>{' '}
          {formatDate(job.created_at)}
        </span>
        <span>
          <span className="font-medium text-gray-600">Durată:</span>{' '}
          {formatDuration(job.started_at, job.completed_at)}
        </span>
        <span className="font-mono text-gray-300">{job.id.slice(0, 8)}…</span>
      </div>

      {/* Error log (ultimele 3 erori) */}
      {job.status === 'failed' && job.error_log && job.error_log.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 space-y-1">
          <p className="text-xs font-semibold text-red-700 mb-1.5">Erori înregistrate:</p>
          {job.error_log.slice(-3).map((entry, idx) => (
            <p key={idx} className="text-xs text-red-600 font-mono truncate">
              {entry.error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
