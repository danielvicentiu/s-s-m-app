// app/[locale]/dashboard/medical/[id]/MedicalDetailClient.tsx
// Client component pentru detaliu examen medical individual
// Afișează toate detaliile examenului + istoric examene anterioare

'use client'

import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, Stethoscope, Calendar, FileText, User, Building2, AlertCircle, Clock } from 'lucide-react'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { DataTable, type DataTableColumn } from '@/components/ui'

interface MedicalExam {
  id: string
  organization_id: string
  employee_id: string | null
  employee_name: string
  cnp_hash: string | null
  job_title: string | null
  examination_type: string
  examination_date: string
  expiry_date: string
  result: string
  restrictions: string | null
  doctor_name: string | null
  clinic_name: string | null
  notes: string | null
  content_version: number
  legal_basis_version: string
  location_id: string | null
  created_at: string
  updated_at: string
  organizations?: { name: string; cui: string }
}

interface ExamHistoryItem {
  id: string
  examination_type: string
  examination_date: string
  expiry_date: string
  result: string
  restrictions: string | null
  doctor_name: string | null
  clinic_name: string | null
}

interface Props {
  exam: MedicalExam
  examHistory: ExamHistoryItem[]
  locale: string
}

// ========== HELPERS ==========

const examTypes: Record<string, string> = {
  periodic: 'Periodic',
  angajare: 'Angajare',
  adaptare: 'Adaptare',
  reluare: 'Reluare',
  la_cerere: 'La cerere',
  supraveghere: 'Supraveghere',
}

const resultTypes: Record<string, string> = {
  apt: 'Apt',
  apt_conditionat: 'Apt condiționat',
  inapt_temporar: 'Inapt temporar',
  inapt: 'Inapt',
}

const resultColors: Record<string, string> = {
  apt: 'success',
  apt_conditionat: 'warning',
  inapt_temporar: 'warning',
  inapt: 'danger',
}

function fmtDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function fmtDateShort(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function getStatus(expiryDate: string): 'valid' | 'expiring' | 'expired' {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'expired'
  if (diffDays <= 30) return 'expiring'
  return 'valid'
}

function getDaysText(expiryDate: string): string {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return `Expirat cu ${Math.abs(diffDays)} zile`
  if (diffDays <= 30) return `Expiră în ${diffDays} zile`
  return `Valid încă ${diffDays} zile`
}

// ========== COMPONENT ==========

export default function MedicalDetailClient({ exam, examHistory, locale }: Props) {
  const router = useRouter()

  const status = getStatus(exam.expiry_date)
  const daysText = getDaysText(exam.expiry_date)

  // Calculate next exam date (usually 1 year from expiry)
  const nextExamDate = new Date(exam.expiry_date)
  nextExamDate.setDate(nextExamDate.getDate() - 30) // Recomandare: cu 30 zile înainte de expirare

  // Table columns pentru istoric
  const historyColumns: DataTableColumn<ExamHistoryItem>[] = [
    {
      key: 'examination_date',
      label: 'Data examinare',
      render: (row) => <span className="text-sm text-gray-900">{fmtDateShort(row.examination_date)}</span>,
    },
    {
      key: 'examination_type',
      label: 'Tip',
      render: (row) => (
        <Badge
          label={examTypes[row.examination_type] || row.examination_type}
          variant="info"
          size="sm"
        />
      ),
    },
    {
      key: 'result',
      label: 'Rezultat',
      render: (row) => (
        <Badge
          label={resultTypes[row.result] || row.result}
          variant={resultColors[row.result] as any || 'neutral'}
          size="sm"
        />
      ),
    },
    {
      key: 'expiry_date',
      label: 'Dată expirare',
      render: (row) => <span className="text-sm text-gray-600">{fmtDateShort(row.expiry_date)}</span>,
    },
    {
      key: 'doctor_name',
      label: 'Medic',
      render: (row) => <span className="text-sm text-gray-600">{row.doctor_name || '—'}</span>,
    },
    {
      key: 'restrictions',
      label: 'Restricții',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.restrictions ? (
            <span className="line-clamp-1" title={row.restrictions}>
              {row.restrictions}
            </span>
          ) : (
            '—'
          )}
        </span>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/medical')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                Detaliu Fișă Medicală
              </h1>
              <p className="text-sm text-gray-400">{exam.employee_name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-6 space-y-6">
        {/* STATUS ALERT */}
        {status !== 'valid' && (
          <div
            className={`rounded-xl border p-4 flex items-start gap-3 ${
              status === 'expired'
                ? 'bg-red-50 border-red-200'
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            <AlertCircle
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                status === 'expired' ? 'text-red-600' : 'text-orange-600'
              }`}
            />
            <div>
              <div
                className={`font-semibold ${
                  status === 'expired' ? 'text-red-900' : 'text-orange-900'
                }`}
              >
                {status === 'expired' ? 'Fișă Expirată' : 'Fișă Expiră Curând'}
              </div>
              <div
                className={`text-sm ${
                  status === 'expired' ? 'text-red-700' : 'text-orange-700'
                }`}
              >
                {daysText}. Este necesară reprogramarea examenului medical.
              </div>
            </div>
          </div>
        )}

        {/* INFORMAȚII ANGAJAT */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Informații Angajat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Nume complet
              </div>
              <div className="text-base font-semibold text-gray-900">{exam.employee_name}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Funcție
              </div>
              <div className="text-base text-gray-700">{exam.job_title || '—'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Organizație
              </div>
              <div className="text-base text-gray-700">
                {exam.organizations?.name || '—'}
                {exam.organizations?.cui && (
                  <span className="text-sm text-gray-400 ml-2">CUI: {exam.organizations.cui}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DETALII EXAMEN */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Detalii Examen Medical</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Tip examinare
              </div>
              <div>
                <Badge
                  label={examTypes[exam.examination_type] || exam.examination_type}
                  variant="info"
                />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Rezultat
              </div>
              <div>
                <Badge
                  label={resultTypes[exam.result] || exam.result}
                  variant={resultColors[exam.result] as any || 'neutral'}
                />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Data examinare
              </div>
              <div className="text-base text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {fmtDate(exam.examination_date)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Data expirare
              </div>
              <div className="text-base text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {fmtDate(exam.expiry_date)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Status
              </div>
              <div>
                <StatusBadge status={status} label={daysText} />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Următorul examen (recomandat)
              </div>
              <div className="text-base text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                {fmtDate(nextExamDate.toISOString())}
              </div>
            </div>
          </div>
        </div>

        {/* MEDIC ȘI CLINICĂ */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Medic și Clinică</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Medic
              </div>
              <div className="text-base text-gray-700">{exam.doctor_name || '—'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Clinică
              </div>
              <div className="text-base text-gray-700">{exam.clinic_name || '—'}</div>
            </div>
          </div>
        </div>

        {/* RESTRICȚII ȘI OBSERVAȚII */}
        {(exam.restrictions || exam.notes) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Restricții și Observații</h2>
            </div>
            {exam.restrictions && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Restricții
                </div>
                <div className="text-base text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  {exam.restrictions}
                </div>
              </div>
            )}
            {exam.notes && (
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Observații
                </div>
                <div className="text-base text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  {exam.notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ISTORIC EXAMENE */}
        {examHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-bold text-gray-900">
                  Istoric Examene Anterioare
                </h2>
                <span className="ml-auto text-sm text-gray-400">
                  {examHistory.length} {examHistory.length === 1 ? 'examen' : 'examene'}
                </span>
              </div>
            </div>
            <DataTable
              columns={historyColumns}
              data={examHistory}
              emptyMessage="Niciun examen anterior"
            />
          </div>
        )}

        {/* METADATA */}
        <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500 space-y-1">
          <div>
            <span className="font-semibold">ID Fișă:</span> {exam.id}
          </div>
          <div>
            <span className="font-semibold">Versiune conținut:</span> {exam.content_version}
          </div>
          <div>
            <span className="font-semibold">Bază legală:</span> {exam.legal_basis_version}
          </div>
          <div>
            <span className="font-semibold">Creat la:</span> {fmtDate(exam.created_at)}
          </div>
          <div>
            <span className="font-semibold">Actualizat la:</span> {fmtDate(exam.updated_at)}
          </div>
        </div>
      </main>
    </div>
  )
}
