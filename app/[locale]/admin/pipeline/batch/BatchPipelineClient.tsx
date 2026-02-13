'use client'

import { useState, useEffect } from 'react'
import {
  Play,
  Plus,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
  Activity,
  Database,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type PipelineJobStatus = 'queued' | 'scraping' | 'parsing' | 'extracting' | 'validating' | 'completed' | 'error'

interface PipelineJob {
  id: string
  act_url: string
  act_title: string
  status: PipelineJobStatus
  step_current: string | null
  progress: number
  result: Record<string, any> | null
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

interface QueueStats {
  total: number
  queued: number
  processing: number
  completed: number
  errors: number
}

// ══════════════════════════════════════════════════════════════
// STATUS CONFIGURATION
// ══════════════════════════════════════════════════════════════

const STATUS_CONFIG: Record<PipelineJobStatus, {
  label: string
  icon: any
  color: string
  bgColor: string
  textColor: string
}> = {
  queued: {
    label: 'În coadă',
    icon: Clock,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700'
  },
  scraping: {
    label: 'Extrage text',
    icon: Database,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  parsing: {
    label: 'Parsează',
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  },
  extracting: {
    label: 'Extrage obligații',
    icon: Loader2,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700'
  },
  validating: {
    label: 'Validează',
    icon: CheckCircle2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  },
  completed: {
    label: 'Finalizat',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  error: {
    label: 'Eroare',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700'
  }
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function BatchPipelineClient() {
  const [jobs, setJobs] = useState<PipelineJob[]>([])
  const [stats, setStats] = useState<QueueStats>({
    total: 0,
    queued: 0,
    processing: 0,
    completed: 0,
    errors: 0
  })
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActUrl, setNewActUrl] = useState('')
  const [newActTitle, setNewActTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  // Fetch jobs and stats
  const fetchData = async () => {
    try {
      const response = await fetch('/api/v1/pipeline')
      if (!response.ok) throw new Error('Failed to fetch pipeline data')

      const data = await response.json()
      setJobs(data.jobs || [])
      setStats(data.stats || {
        total: 0,
        queued: 0,
        processing: 0,
        completed: 0,
        errors: 0
      })
      setError(null)
    } catch (err) {
      console.error('Error fetching pipeline data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Add new act to queue
  const handleAddAct = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newActUrl || !newActTitle) {
      setError('URL și titlu sunt obligatorii')
      return
    }

    try {
      const response = await fetch('/api/v1/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newActUrl,
          title: newActTitle
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to queue act')
      }

      setNewActUrl('')
      setNewActTitle('')
      setShowAddForm(false)
      await fetchData()
    } catch (err) {
      console.error('Error adding act:', err)
      setError(err instanceof Error ? err.message : 'Failed to add act')
    }
  }

  // Process queue
  const handleProcessQueue = async () => {
    setProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/pipeline/process', {
        method: 'POST'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process queue')
      }

      await fetchData()
    } catch (err) {
      console.error('Error processing queue:', err)
      setError(err instanceof Error ? err.message : 'Failed to process queue')
    } finally {
      setProcessing(false)
    }
  }

  // Retry failed job
  const handleRetry = async (jobId: string) => {
    try {
      const response = await fetch(`/api/v1/pipeline/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to retry job')
      }

      await fetchData()
    } catch (err) {
      console.error('Error retrying job:', err)
      setError(err instanceof Error ? err.message : 'Failed to retry job')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pipeline Legislativ Batch
        </h1>
        <p className="text-gray-600">
          Procesare automată acte legislative prin M1→M2→M3
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Eroare</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatsCard
          label="Total"
          value={stats.total}
          icon={Database}
          color="text-slate-600"
          bgColor="bg-slate-100"
        />
        <StatsCard
          label="În coadă"
          value={stats.queued}
          icon={Clock}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatsCard
          label="În procesare"
          value={stats.processing}
          icon={Activity}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatsCard
          label="Finalizate"
          value={stats.completed}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatsCard
          label="Erori"
          value={stats.errors}
          icon={AlertTriangle}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adaugă act manual
        </button>

        <button
          onClick={handleProcessQueue}
          disabled={processing || stats.queued === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Procesează coada
          {stats.queued > 0 && ` (${stats.queued})`}
        </button>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reîmprospătează
        </button>
      </div>

      {/* Add Act Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Adaugă act legislativ</h3>
          <form onSubmit={handleAddAct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL act legislativ
              </label>
              <input
                type="url"
                value={newActUrl}
                onChange={(e) => setNewActUrl(e.target.value)}
                placeholder="https://legislatie.just.ro/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titlu act
              </label>
              <input
                type="text"
                value={newActTitle}
                onChange={(e) => setNewActTitle(e.target.value)}
                placeholder="LEGE nr. 319 din 2006 privind..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adaugă în coadă
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Act Legislativ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rezultat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nu există joburi în coadă. Adaugă un act legislativ pentru a începe.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    onRetry={() => handleRetry(job.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// STATS CARD COMPONENT
// ══════════════════════════════════════════════════════════════

function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor
}: {
  label: string
  value: number
  icon: any
  color: string
  bgColor: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// JOB ROW COMPONENT
// ══════════════════════════════════════════════════════════════

function JobRow({
  job,
  onRetry
}: {
  job: PipelineJob
  onRetry: () => void
}) {
  const config = STATUS_CONFIG[job.status]
  const Icon = config.icon
  const isProcessing = ['scraping', 'parsing', 'extracting'].includes(job.status)

  return (
    <tr className="hover:bg-gray-50">
      {/* Act Title */}
      <td className="px-6 py-4">
        <div className="max-w-md">
          <p className="text-sm font-medium text-gray-900 truncate">
            {job.act_title}
          </p>
          <a
            href={job.act_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate block mt-1"
          >
            {job.act_url}
          </a>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
            <Icon className={`w-4 h-4 ${config.color} ${isProcessing ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{config.label}</p>
            {job.step_current && (
              <p className="text-xs text-gray-500">{job.step_current}</p>
            )}
          </div>
        </div>
      </td>

      {/* Progress */}
      <td className="px-6 py-4">
        <div className="w-32">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">
              {job.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                job.status === 'error' ? 'bg-red-500' :
                job.status === 'completed' ? 'bg-green-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      </td>

      {/* Result */}
      <td className="px-6 py-4">
        {job.status === 'completed' && job.result && (
          <div className="text-sm">
            <span className="text-gray-600">Obligații:</span>
            <span className="ml-2 font-medium text-gray-900">
              {job.result.obligations_count || 0}
            </span>
          </div>
        )}
        {job.status === 'error' && job.error_message && (
          <div className="max-w-xs">
            <p className="text-xs text-red-600 truncate" title={job.error_message}>
              {job.error_message}
            </p>
          </div>
        )}
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <p className="text-xs text-gray-500">
          {new Date(job.created_at).toLocaleDateString('ro-RO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        {job.status === 'error' && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reîncearcă
          </button>
        )}
      </td>
    </tr>
  )
}
