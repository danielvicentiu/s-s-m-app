'use client'

import { useEffect, useState } from 'react'
import { Building2, Users, Briefcase, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import type { CaenActivity } from '@/data/caen-activities'
import type { CompanyFormData } from './StepCompany'

interface Props {
  activities: CaenActivity[]
  employeeRange: string
  company: CompanyFormData
  onBack: () => void
  onConfirm: () => Promise<void>
}

function SummaryCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900">{value || '—'}</span>
    </div>
  )
}

/* Animated checkmark */
function AnimatedCheck() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full bg-green-100 transition-all duration-500 ${
          show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <svg
          className={`h-10 w-10 text-green-600 transition-all duration-700 delay-200 ${
            show ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: show ? 0 : 30,
              transition: 'stroke-dashoffset 0.6s ease 0.3s',
            }}
          />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Contul tău este gata!</h2>
        <p className="mt-2 text-sm text-gray-500">
          Ai 14 zile trial gratuit. Te redirectionăm la dashboard...
        </p>
      </div>
    </div>
  )
}

export function StepConfirm({ activities, employeeRange, company, onBack, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      await onConfirm()
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la finalizare. Încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <AnimatedCheck />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Confirmare</h2>
        <p className="mt-1 text-sm text-gray-500">Verificați datele și porniți trial-ul gratuit.</p>
      </div>

      {/* Trial badge */}
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
        <div>
          <p className="text-sm font-semibold text-green-900">Trial gratuit 14 zile</p>
          <p className="text-xs text-green-700">Nu este necesară un card. Anulați oricând.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryCard icon={Briefcase} title="Activitate">
          {activities.length > 0 ? (
            activities.map((a) => (
              <div key={a.code} className="flex items-start gap-2 py-0.5">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-gray-400">{a.code}</span>
                <span className="text-sm text-gray-700 leading-snug">{a.label_ro}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">—</p>
          )}
        </SummaryCard>

        <SummaryCard icon={Users} title="Angajați">
          <Row label="Număr angajați" value={employeeRange} />
        </SummaryCard>

        {(company.name || company.cui || company.county) && (
          <SummaryCard icon={Building2} title="Firmă">
            {company.name && <Row label="Denumire" value={company.name} />}
            {company.cui && <Row label="CUI" value={company.cui} />}
            {company.county && <Row label="Județ" value={company.county} />}
            {company.email && <Row label="Email" value={company.email} />}
          </SummaryCard>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Înapoi
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Se procesează...
            </>
          ) : (
            <>
              Începe acum
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Poți modifica oricând din Setări
      </p>
    </div>
  )
}
