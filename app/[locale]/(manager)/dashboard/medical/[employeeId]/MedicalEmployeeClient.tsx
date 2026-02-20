// app/[locale]/dashboard/medical/[employeeId]/MedicalEmployeeClient.tsx
// Profil medical complet al unui angajat — componenta client
// Tabs: Status + Restricții | Istoric examene | Programări
// Actions: Adaugă fișă nouă (inline modal), Programează examen

'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  Stethoscope,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Building2,
  BadgeCheck,
} from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { MedicalRecordForm, type MedicalRecordFormData, EXAM_TYPES, RESULT_TYPES } from '@/components/medical/MedicalRecordForm'
import { RestrictionBadgeList } from '@/components/medical/RestrictionBadge'
import { useHasPermission } from '@/hooks/usePermission'
import type { MedicalExamination, MedicalAppointment } from '@/lib/types'
import type { EmployeeWithOrg } from './page'

// ============================================================
// TYPES
// ============================================================

interface Organization {
  id: string
  name: string
  cui: string
}

interface Props {
  employee: EmployeeWithOrg
  examinations: MedicalExamination[]
  appointments: MedicalAppointment[]
  organizations: Organization[]
  locale: string
}

type TabType = 'status' | 'history' | 'appointments'

type TFunc = (key: string, values?: Record<string, string | number>) => string

// ============================================================
// HELPERS
// ============================================================

function fmtDate(d: string | null | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getDaysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function getMedicalStatus(
  exam: MedicalExamination | null,
  t: TFunc
): {
  label: string
  color: string
  icon: React.ElementType
  description: string
} {
  if (!exam) {
    return {
      label: t('status.noRecord'),
      color: 'bg-gray-100 text-gray-600',
      icon: User,
      description: t('status.noRecordDesc'),
    }
  }
  const expiryDate = exam.next_examination_date || exam.expiry_date
  const days = getDaysUntil(expiryDate)

  if (days === null) {
    return {
      label: t('status.undefined'),
      color: 'bg-gray-100 text-gray-600',
      icon: User,
      description: t('status.undefinedDesc'),
    }
  }
  if (days < 0) {
    return {
      label: t('status.expired', { days: Math.abs(days) }),
      color: 'bg-red-100 text-red-700',
      icon: XCircle,
      description: t('status.expiredDesc', { date: fmtDate(expiryDate) }),
    }
  }
  if (days <= 30) {
    return {
      label: t('status.expiringSoon', { days }),
      color: 'bg-orange-100 text-orange-700',
      icon: AlertTriangle,
      description: t('status.expiringSoonDesc', { date: fmtDate(expiryDate) }),
    }
  }
  return {
    label: t('status.valid', { days }),
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    description: t('status.validDesc', { date: fmtDate(expiryDate) }),
  }
}

const RESULT_COLORS: Record<string, string> = {
  apt: 'bg-green-50 text-green-700',
  apt_conditionat: 'bg-yellow-50 text-yellow-700',
  inapt_temporar: 'bg-orange-50 text-orange-700',
  inapt: 'bg-red-50 text-red-700',
  in_asteptare: 'bg-gray-50 text-gray-600',
}

// ============================================================
// COMPONENT
// ============================================================

export default function MedicalEmployeeClient({
  employee,
  examinations,
  appointments,
  organizations,
  locale: _locale,
}: Props) {
  const router = useRouter()
  const t = useTranslations('medical')
  const canCreate = useHasPermission('medical', 'create')

  const [activeTab, setActiveTab] = useState<TabType>('status')
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [addRecordLoading, setAddRecordLoading] = useState(false)

  // APPOINTMENT_STATUS_CONFIG must be inside component to use t()
  const APPOINTMENT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    programat: { label: t('appointmentStatus.programat'), cls: 'bg-blue-50 text-blue-700' },
    confirmat: { label: t('appointmentStatus.confirmat'), cls: 'bg-green-50 text-green-700' },
    efectuat: { label: t('appointmentStatus.efectuat'), cls: 'bg-gray-50 text-gray-600' },
    anulat: { label: t('appointmentStatus.anulat'), cls: 'bg-red-50 text-red-700' },
    reprogramat: { label: t('appointmentStatus.reprogramat'), cls: 'bg-yellow-50 text-yellow-700' },
  }

  // Latest exam
  const latestExam = examinations.length > 0 ? examinations[0] : null
  const medStatus = getMedicalStatus(latestExam, t)
  const StatusIcon = medStatus.icon

  // Active restrictions (from latest exam)
  const activeRestrictions = latestExam?.restrictions ?? null

  // Upcoming appointments (status ≠ efectuat / anulat, date ≥ today)
  const today = new Date().toISOString().split('T')[0]
  const upcomingAppointments = appointments.filter(
    (a) => a.status !== 'efectuat' && a.status !== 'anulat' && a.appointment_date >= today
  )

  // ========== ADD RECORD HANDLER ==========

  async function handleAddRecord(data: MedicalRecordFormData) {
    try {
      setAddRecordLoading(true)

      const payload = {
        organization_id: employee.organization_id,
        employee_id: employee.id,
        employee_name: employee.full_name,
        job_title: employee.job_title || data.job_title || null,
        examination_type: data.examination_type,
        examination_date: data.examination_date,
        expiry_date: data.expiry_date,
        result: data.result,
        restrictions: data.restrictions || null,
        doctor_name: data.doctor_name || null,
        clinic_name: data.clinic_name || null,
        notes: data.notes || null,
        validity_months: data.validity_months || 12,
        risk_factors: data.risk_factors
          ? data.risk_factors.split(',').map((s) => s.trim()).filter(Boolean)
          : null,
        document_number: data.document_number || null,
        next_examination_date: data.expiry_date,
        content_version: 1,
        legal_basis_version: 'HG355/2007',
      }

      const res = await fetch('/api/medical/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Eroare la salvarea fișei.')
      }

      setShowAddRecord(false)
      router.refresh()
    } catch (err) {
      console.error('[MedicalEmployee] Add record error:', err)
      alert(err instanceof Error ? err.message : t('errors.saveRecord'))
    } finally {
      setAddRecordLoading(false)
    }
  }

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/medical')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition"
              aria-label="Înapoi"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                {employee.full_name}
              </h1>
              <p className="text-sm text-gray-400">
                {employee.job_title ?? t('employee.noJobTitle')}
                {employee.organizations?.name && (
                  <>
                    {' '}
                    · <span className="text-gray-500">{employee.organizations.name}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {canCreate && (
            <button
              onClick={() => setShowAddRecord(true)}
              className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition"
            >
              <Plus className="h-4 w-4" />
              {t('employee.addRecord')}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        {/* TABS */}
        <div className="flex items-center gap-1 border-b border-gray-200">
          {(
            [
              { key: 'status', label: t('employee.tabStatus'), Icon: BadgeCheck },
              { key: 'history', label: t('employee.tabHistory', { count: examinations.length }), Icon: Stethoscope },
              { key: 'appointments', label: t('employee.tabAppointments', { count: upcomingAppointments.length }), Icon: Calendar },
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                activeTab === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ====== TAB: STATUS & RESTRICȚII ====== */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            {/* Status card */}
            <div className={`rounded-2xl p-5 ${medStatus.color.replace('text-', 'border-').replace('bg-', 'border-')} border`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${medStatus.color}`}>
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-lg font-bold ${medStatus.color.replace('bg-', '').replace(/bg-\w+-\d+/, '')}`}>
                      {medStatus.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{medStatus.description}</p>
                </div>
              </div>
            </div>

            {/* Quick info grid */}
            {latestExam && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <InfoCard label={t('employee.lastExam')} value={fmtDate(latestExam.examination_date)} />
                <InfoCard
                  label={t('employee.examType')}
                  value={EXAM_TYPES[latestExam.examination_type] ?? latestExam.examination_type}
                />
                <InfoCard
                  label={t('employee.result')}
                  value={RESULT_TYPES[latestExam.result] ?? latestExam.result}
                  valueColor={RESULT_COLORS[latestExam.result]}
                />
                <InfoCard label={t('employee.doctorClinic')} value={latestExam.doctor_name ?? latestExam.clinic_name ?? '—'} />
              </div>
            )}

            {/* Restricții active */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                {t('employee.activeRestrictions')}
              </h2>
              <RestrictionBadgeList
                restrictions={activeRestrictions}
                size="md"
                emptyText={t('employee.noRestrictions')}
              />
              {latestExam?.notes && (
                <p className="mt-3 text-sm text-gray-500 italic">{latestExam.notes}</p>
              )}
            </div>

            {/* Factori de risc */}
            {latestExam?.risk_factors && latestExam.risk_factors.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  {t('employee.riskFactors')}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {latestExam.risk_factors.map((rf, i) => (
                    <span
                      key={i}
                      className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {rf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Angajat info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-gray-400" />
                {t('employee.employeeInfo')}
              </h2>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div>
                  <span className="text-gray-400">{t('employee.organization')}</span>
                  <p className="font-medium text-gray-800 mt-0.5">
                    {employee.organizations?.name ?? '—'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">{t('employee.department')}</span>
                  <p className="font-medium text-gray-800 mt-0.5">{employee.department ?? '—'}</p>
                </div>
                <div>
                  <span className="text-gray-400">{t('employee.jobTitle')}</span>
                  <p className="font-medium text-gray-800 mt-0.5">{employee.job_title ?? '—'}</p>
                </div>
                <div>
                  <span className="text-gray-400">{t('employee.hireDate')}</span>
                  <p className="font-medium text-gray-800 mt-0.5">{fmtDate(employee.hire_date)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== TAB: ISTORIC EXAMENE ====== */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {examinations.length === 0 ? (
              <EmptyState
                icon={Stethoscope}
                title={t('employee.noExams')}
                description={t('employee.noExamsDesc')}
                actionLabel={canCreate ? t('employee.addRecordAction') : undefined}
                onAction={canCreate ? () => setShowAddRecord(true) : undefined}
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {examinations.map((exam, idx) => {
                  const isLatest = idx === 0
                  const expiryDate = exam.next_examination_date || exam.expiry_date
                  const days = getDaysUntil(expiryDate)
                  const expired = days !== null && days < 0

                  return (
                    <div key={exam.id} className={`px-5 py-4 ${isLatest ? 'bg-blue-50/30' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {/* Timeline dot */}
                          <div className="mt-1 flex-shrink-0">
                            <div
                              className={`h-2.5 w-2.5 rounded-full mt-1 ${
                                isLatest ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-gray-900">
                                {EXAM_TYPES[exam.examination_type] ?? exam.examination_type}
                              </span>
                              {isLatest && (
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                  {t('employee.latestBadge')}
                                </span>
                              )}
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  RESULT_COLORS[exam.result] ?? 'bg-gray-50 text-gray-600'
                                }`}
                              >
                                {RESULT_TYPES[exam.result] ?? exam.result}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                              <span>{t('employee.historyDate')} {fmtDate(exam.examination_date)}</span>
                              <span
                                className={expired ? 'text-red-500 font-medium' : ''}
                              >
                                {t('employee.historyExpiry')} {fmtDate(expiryDate)}
                              </span>
                              {exam.doctor_name && <span>{t('employee.historyDr')} {exam.doctor_name}</span>}
                              {exam.clinic_name && <span>{exam.clinic_name}</span>}
                              {exam.document_number && <span>Nr. {exam.document_number}</span>}
                            </div>

                            {exam.restrictions && (
                              <div className="mt-2">
                                <RestrictionBadgeList restrictions={exam.restrictions} size="sm" />
                              </div>
                            )}

                            {exam.notes && (
                              <p className="text-xs text-gray-400 italic mt-1">{exam.notes}</p>
                            )}
                          </div>
                        </div>

                        {/* Days chip */}
                        {days !== null && (
                          <div className="flex-shrink-0 text-right">
                            <span
                              className={`text-sm font-bold tabular-nums ${
                                days < 0
                                  ? 'text-red-600'
                                  : days <= 30
                                  ? 'text-orange-500'
                                  : 'text-gray-400'
                              }`}
                            >
                              {days < 0 ? `-${Math.abs(days)}z` : `${days}z`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ====== TAB: PROGRAMĂRI ====== */}
        {activeTab === 'appointments' && (
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <EmptyState
                  icon={Calendar}
                  title={t('employee.noAppointments')}
                  description={t('employee.noAppointmentsDesc')}
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {appointments.map((appt) => {
                    const cfg = APPOINTMENT_STATUS_CONFIG[appt.status] ?? {
                      label: appt.status,
                      cls: 'bg-gray-50 text-gray-600',
                    }
                    const isPast = appt.appointment_date < today

                    return (
                      <div
                        key={appt.id}
                        className={`px-5 py-4 ${isPast ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg mt-0.5 ${isPast ? 'bg-gray-100' : 'bg-blue-50'}`}
                            >
                              <Calendar
                                className={`h-4 w-4 ${isPast ? 'text-gray-400' : 'text-blue-600'}`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-900">
                                  {fmtDate(appt.appointment_date)}
                                  {appt.appointment_time && (
                                    <span className="text-gray-500 font-normal ml-1 text-sm">
                                      {appt.appointment_time.slice(0, 5)}
                                    </span>
                                  )}
                                </span>
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}
                                >
                                  {cfg.label}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-x-3 text-sm text-gray-500 mt-1">
                                <span>
                                  {EXAM_TYPES[appt.examination_type] ?? appt.examination_type}
                                </span>
                                {appt.clinic_name && <span>{appt.clinic_name}</span>}
                              </div>
                              {appt.notes && (
                                <p className="text-xs text-gray-400 italic mt-1">{appt.notes}</p>
                              )}
                            </div>
                          </div>

                          {/* Status indicator */}
                          {!isPast && appt.status === 'programat' && (
                            <div className="flex-shrink-0">
                              <Clock className="h-4 w-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ====== MODAL: ADAUGĂ FIȘĂ ====== */}
      {showAddRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !addRecordLoading && setShowAddRecord(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                {t('employee.modalTitle')}
              </h2>
              <button
                onClick={() => setShowAddRecord(false)}
                disabled={addRecordLoading}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Body — MedicalRecordForm contains its own buttons */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <MedicalRecordForm
                initialData={{
                  organization_id: employee.organization_id,
                  employee_id: employee.id,
                  employee_name: employee.full_name,
                  job_title: employee.job_title ?? '',
                }}
                employees={[]}
                organizations={organizations}
                onSubmit={handleAddRecord}
                onCancel={() => setShowAddRecord(false)}
                loading={addRecordLoading}
                submitLabel={t('employee.modalSubmit')}
                lockedEmployeeId={employee.id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function InfoCard({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      {valueColor ? (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-semibold ${valueColor}`}>
          {value}
        </span>
      ) : (
        <div className="text-sm font-semibold text-gray-900">{value}</div>
      )}
    </div>
  )
}
