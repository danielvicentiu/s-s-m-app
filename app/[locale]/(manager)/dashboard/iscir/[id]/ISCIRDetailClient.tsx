'use client'

// app/[locale]/dashboard/iscir/[id]/ISCIRDetailClient.tsx
// M9_ISCIR: Equipment detail view – technical info, verification timeline, daily checks

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ClipboardCheck,
  Gauge,
  Factory,
  MapPin,
  User,
  Wrench,
  Clock,
  FileText,
  ShieldCheck,
  QrCode,
  Plus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Organization {
  id: string
  name: string
  cui?: string | null
}

interface ISCIREquipment {
  id: string
  organization_id: string
  equipment_type: string
  registration_number?: string | null
  identifier: string
  manufacturer?: string | null
  model?: string | null
  serial_number?: string | null
  manufacture_year?: number | null
  installation_date?: string | null
  location?: string | null
  capacity?: string | null
  rsvti_responsible?: string | null
  last_verification_date?: string | null
  next_verification_date: string
  verification_interval_months: number
  authorization_number?: string | null
  authorization_expiry?: string | null
  status: string
  daily_check_required?: boolean
  notes?: string | null
  created_at: string
  organizations?: Organization | null
}

interface ISCIRVerification {
  id: string
  equipment_id: string
  organization_id: string
  verification_date: string
  verification_type: string
  inspector_name: string
  inspector_legitimation?: string | null
  result: string
  next_verification_date?: string | null
  bulletin_number: string
  bulletin_storage_path?: string | null
  observations?: string | null
  prescriptions?: string | null
  deadline_prescriptions?: string | null
  created_at: string
}

interface ISCIRDailyCheck {
  id: string
  equipment_id: string
  organization_id: string
  operator_name: string
  check_date: string
  check_items: Record<string, boolean>
  issues_found?: string | null
  signed: boolean
  created_at: string
}

interface ISCIRDetailClientProps {
  user: { id: string; email: string }
  equipment: ISCIREquipment
  verifications: ISCIRVerification[]
  dailyChecks: ISCIRDailyCheck[]
  locale: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

type TFunc = (key: string, values?: Record<string, string | number>) => string

function AlertBadge({ daysUntil, t }: { daysUntil: number; t: TFunc }) {
  if (daysUntil < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800">
        <AlertTriangle className="w-4 h-4" />
        {t('alertBadge.expired', { days: Math.abs(daysUntil) })}
      </span>
    )
  }
  if (daysUntil <= 30) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
        <AlertTriangle className="w-4 h-4" />
        {t('alertBadge.urgent', { days: daysUntil })}
      </span>
    )
  }
  if (daysUntil <= 90) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
        <Clock className="w-4 h-4" />
        {t('alertBadge.warning', { days: daysUntil })}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800">
      <CheckCircle2 className="w-4 h-4" />
      {t('alertBadge.ok', { days: daysUntil })}
    </span>
  )
}

function StatusBadge({ status, t }: { status: string; t: TFunc }) {
  const colors: Record<string, string> = {
    activ: 'bg-green-100 text-green-800',
    expirat: 'bg-red-100 text-red-800',
    in_verificare: 'bg-blue-100 text-blue-800',
    oprit: 'bg-orange-100 text-orange-800',
    casat: 'bg-gray-100 text-gray-600',
  }
  const STATUS_LABELS: Record<string, string> = {
    activ: t('status.activ'),
    expirat: t('status.expirat'),
    in_verificare: t('status.inVerificare'),
    oprit: t('status.oprit'),
    casat: t('status.casat'),
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || colors.casat}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

function ResultBadge({ result, t }: { result: string; t: TFunc }) {
  const colors: Record<string, string> = {
    admis: 'bg-green-100 text-green-800',
    respins: 'bg-red-100 text-red-800',
    admis_conditionat: 'bg-yellow-100 text-yellow-800',
  }
  const RESULT_LABELS: Record<string, string> = {
    admis: t('result.admis'),
    respins: t('result.respins'),
    admis_conditionat: t('result.admisConditionat'),
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[result] || 'bg-gray-100 text-gray-600'}`}
    >
      {RESULT_LABELS[result] || result}
    </span>
  )
}

// ─── Verification form defaults ────────────────────────────────────────────

type VerificationForm = {
  equipment_id: string
  organization_id: string
  verification_date: string
  verification_type: string
  inspector_name: string
  inspector_legitimation: string
  result: string
  bulletin_number: string
  next_verification_date: string
  observations: string
  prescriptions: string
  deadline_prescriptions: string
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ISCIRDetailClient({
  user,
  equipment,
  verifications,
  dailyChecks,
  locale,
}: ISCIRDetailClientProps) {
  const t = useTranslations('iscir')

  const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
    cazan: t('equipmentType.cazan'),
    recipient_presiune: t('equipmentType.recipientPresiune'),
    lift: t('equipmentType.lift'),
    macara: t('equipmentType.macara'),
    stivuitor: t('equipmentType.stivuitor'),
    instalatie_gpl: t('equipmentType.instalatieGpl'),
    compresor: t('equipmentType.compresor'),
    autoclave: t('equipmentType.autoclave'),
    altul: t('equipmentType.altul'),
  }

  const VERIFICATION_TYPE_LABELS: Record<string, string> = {
    periodica: t('verificationType.periodica'),
    accidentala: t('verificationType.accidentala'),
    punere_in_functiune: t('verificationType.punereInFunctiune'),
    reparatie: t('verificationType.reparatie'),
    modernizare: t('verificationType.modernizare'),
  }

  const RESULT_LABELS: Record<string, string> = {
    admis: t('result.admis'),
    respins: t('result.respins'),
    admis_conditionat: t('result.admisConditionat'),
  }

  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrData, setQrData] = useState<{ qr_image_url: string; target_url: string } | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [verificationsList, setVerificationsList] = useState<ISCIRVerification[]>(verifications)
  const [showAllVerifications, setShowAllVerifications] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const [verForm, setVerForm] = useState<VerificationForm>({
    equipment_id: equipment.id,
    organization_id: equipment.organization_id,
    verification_date: new Date().toISOString().split('T')[0],
    verification_type: 'periodica',
    inspector_name: '',
    inspector_legitimation: '',
    result: 'admis',
    bulletin_number: '',
    next_verification_date: '',
    observations: '',
    prescriptions: '',
    deadline_prescriptions: '',
  })

  const daysUntil = getDaysUntil(equipment.next_verification_date)
  const visibleVerifications = showAllVerifications
    ? verificationsList
    : verificationsList.slice(0, 5)

  const loadQR = async () => {
    setQrLoading(true)
    try {
      const res = await fetch(`/api/iscir/qr/${equipment.id}`)
      const data = await res.json()
      if (res.ok) setQrData(data)
    } catch (e) {
      console.error('QR load error:', e)
    } finally {
      setQrLoading(false)
    }
  }

  const handleOpenQR = () => {
    setShowQR(true)
    if (!qrData) loadQR()
  }

  const handleSaveVerification = async () => {
    if (!verForm.verification_date || !verForm.inspector_name || !verForm.bulletin_number) return

    setFormLoading(true)
    try {
      const res = await fetch('/api/iscir/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verForm),
      })
      const data = await res.json()
      if (res.ok) {
        setShowVerificationForm(false)
        // Prepend to list
        if (data.verification) {
          setVerificationsList((prev) => [data.verification, ...prev])
        }
        // Reset form
        setVerForm((f) => ({
          ...f,
          inspector_name: '',
          inspector_legitimation: '',
          bulletin_number: '',
          next_verification_date: '',
          observations: '',
          prescriptions: '',
          deadline_prescriptions: '',
        }))
      } else {
        alert(data.error || t('errors.saveVerification'))
      }
    } catch (e) {
      console.error('Save verification error:', e)
      alert(t('errors.saveVerification'))
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/dashboard/iscir`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('detail.backToIscir')}
        </Link>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Gauge className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{equipment.identifier}</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {EQUIPMENT_TYPE_LABELS[equipment.equipment_type] || equipment.equipment_type}
                {equipment.organizations && (
                  <span className="ml-2 text-gray-400">· {equipment.organizations.name}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={equipment.status} t={t as TFunc} />
            <AlertBadge daysUntil={daysUntil} t={t as TFunc} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => setShowVerificationForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            {t('detail.addVerification')}
          </button>

          {equipment.daily_check_required && (
            <>
              <Link
                href={`/${locale}/dashboard/iscir/daily?equipment=${equipment.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <ClipboardCheck className="w-4 h-4" />
                {t('detail.dailyCheck')}
              </Link>

              <button
                onClick={handleOpenQR}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <QrCode className="w-4 h-4" />
                {t('detail.qrCode')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Technical details ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Factory className="w-5 h-5 text-gray-400" />
          {t('detail.technicalData')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <DetailRow label={t('form.equipmentType')} value={EQUIPMENT_TYPE_LABELS[equipment.equipment_type]} />
          <DetailRow label={t('form.registrationNumber')} value={equipment.registration_number} />
          <DetailRow label={t('form.manufacturer')} value={equipment.manufacturer} />
          <DetailRow label={t('form.model')} value={equipment.model} />
          <DetailRow label={t('form.serialNumber')} value={equipment.serial_number} />
          <DetailRow label={t('form.manufactureYear')} value={equipment.manufacture_year?.toString()} />
          <DetailRow label={t('detail.installDate')} value={formatDate(equipment.installation_date)} />
          <DetailRow label={t('detail.capacityParams')} value={equipment.capacity} />
          <DetailRow
            label={t('detail.dailyCheckRequired')}
            value={equipment.daily_check_required ? t('detail.yes') : t('detail.no')}
          />
        </div>
      </div>

      {/* ── Location & RSVTI ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            {t('detail.locationTitle')}
          </h2>
          <div className="space-y-3">
            <DetailRow label={t('form.location')} value={equipment.location} />
            <DetailRow label={t('detail.organization')} value={equipment.organizations?.name} />
            <DetailRow label="CUI" value={equipment.organizations?.cui} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            {t('detail.rsvtiTitle')}
          </h2>
          <div className="space-y-3">
            <DetailRow label={t('form.rsvtiResponsible')} value={equipment.rsvti_responsible} />
            <DetailRow label={t('form.authorizationNumber')} value={equipment.authorization_number} />
            <DetailRow label={t('detail.authorizationExpiry')} value={formatDate(equipment.authorization_expiry)} />
          </div>
        </div>
      </div>

      {/* ── Verification schedule ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          {t('detail.verifCalendar')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">{t('detail.lastVerif')}</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(equipment.last_verification_date)}
            </p>
          </div>
          <div
            className={`text-center p-4 rounded-xl ${
              daysUntil < 0
                ? 'bg-red-50'
                : daysUntil <= 30
                ? 'bg-orange-50'
                : daysUntil <= 90
                ? 'bg-yellow-50'
                : 'bg-green-50'
            }`}
          >
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">{t('detail.nextVerif')}</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(equipment.next_verification_date)}
            </p>
            <p className="text-xs mt-1 text-gray-600">
              {daysUntil < 0
                ? t('detail.daysOverdue', { days: Math.abs(daysUntil) })
                : t('detail.daysLeft', { days: daysUntil })}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">{t('detail.verifInterval')}</p>
            <p className="text-lg font-semibold text-gray-900">
              {t('detail.months', { count: equipment.verification_interval_months })}
            </p>
          </div>
        </div>

        {equipment.notes && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">{t('form.observations')}</p>
            <p className="text-sm text-gray-700">{equipment.notes}</p>
          </div>
        )}
      </div>

      {/* ── Verification history timeline ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-gray-400" />
            {t('detail.verifHistory')}
            <span className="ml-1 text-sm font-normal text-gray-400">
              ({verificationsList.length})
            </span>
          </h2>
          <button
            onClick={() => setShowVerificationForm(true)}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t('detail.add')}
          </button>
        </div>

        {verificationsList.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">{t('empty.noVerifications')}</p>
            <p className="text-sm mt-1">{t('detail.addFirstVerif')}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-4">
              {visibleVerifications.map((ver, idx) => (
                <VerificationTimelineItem key={ver.id} ver={ver} isFirst={idx === 0} t={t as TFunc} VERIFICATION_TYPE_LABELS={VERIFICATION_TYPE_LABELS} RESULT_LABELS={RESULT_LABELS} />
              ))}
            </div>

            {verificationsList.length > 5 && (
              <button
                onClick={() => setShowAllVerifications((v) => !v)}
                className="mt-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 ml-10"
              >
                {showAllVerifications ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> {t('detail.showLess')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> {t('detail.showAll', { count: verificationsList.length })}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Daily checks calendar (last 30 days) ──────────────────────────── */}
      {equipment.daily_check_required && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-gray-400" />
              {t('detail.dailyChecksTitle')}
            </h2>
            <Link
              href={`/${locale}/dashboard/iscir/daily?equipment=${equipment.id}`}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              {t('detail.operatorPage')}
            </Link>
          </div>

          {dailyChecks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Wrench className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">{t('detail.noDailyChecks')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(dailyChecks as ISCIRDailyCheck[]).map((check) => (
                <DailyCheckRow key={check.id} check={check} t={t as TFunc} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Add Verification Modal ────────────────────────────────────────── */}
      {showVerificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{t('verifForm.title')}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {t('verifForm.equipment')}: <span className="font-medium">{equipment.identifier}</span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t('verifForm.verifDate')}>
                  <input
                    type="date"
                    value={verForm.verification_date}
                    onChange={(e) => setVerForm({ ...verForm, verification_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </FormField>

                <FormField label={t('verifForm.verifType')}>
                  <select
                    value={verForm.verification_type}
                    onChange={(e) => setVerForm({ ...verForm, verification_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {Object.entries(VERIFICATION_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label={t('verifForm.inspectorName')}>
                  <input
                    type="text"
                    value={verForm.inspector_name}
                    onChange={(e) => setVerForm({ ...verForm, inspector_name: e.target.value })}
                    placeholder="Prenume Nume"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </FormField>

                <FormField label={t('verifForm.inspectorId')}>
                  <input
                    type="text"
                    value={verForm.inspector_legitimation}
                    onChange={(e) =>
                      setVerForm({ ...verForm, inspector_legitimation: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </FormField>

                <FormField label={t('verifForm.result')}>
                  <select
                    value={verForm.result}
                    onChange={(e) => setVerForm({ ...verForm, result: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {Object.entries(RESULT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label={t('verifForm.bulletinNumber')}>
                  <input
                    type="text"
                    value={verForm.bulletin_number}
                    onChange={(e) => setVerForm({ ...verForm, bulletin_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </FormField>

                <FormField label={t('verifForm.nextVerifDate')}>
                  <input
                    type="date"
                    value={verForm.next_verification_date}
                    onChange={(e) =>
                      setVerForm({ ...verForm, next_verification_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </FormField>

                <FormField label={t('verifForm.prescriptionsDeadline')}>
                  <input
                    type="date"
                    value={verForm.deadline_prescriptions}
                    onChange={(e) =>
                      setVerForm({ ...verForm, deadline_prescriptions: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </FormField>
              </div>

              <FormField label={t('form.observations')}>
                <textarea
                  value={verForm.observations}
                  onChange={(e) => setVerForm({ ...verForm, observations: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </FormField>

              <FormField label={t('verifForm.prescriptions')}>
                <textarea
                  value={verForm.prescriptions}
                  onChange={(e) => setVerForm({ ...verForm, prescriptions: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </FormField>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowVerificationForm(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('form.cancel')}
              </button>
              <button
                onClick={handleSaveVerification}
                disabled={
                  formLoading ||
                  !verForm.verification_date ||
                  !verForm.inspector_name ||
                  !verForm.bulletin_number
                }
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? t('form.saving') : t('verifForm.saveVerification')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QR Code Modal ─────────────────────────────────────────────────── */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('detail.qrCode')}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {equipment.identifier} – {t('detail.qrScanInstruction')}
            </p>

            {qrLoading ? (
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : qrData ? (
              <>
                <img
                  src={qrData.qr_image_url}
                  alt={`QR cod ${equipment.identifier}`}
                  className="w-48 h-48 mx-auto rounded-xl border border-gray-200"
                />
                <p className="text-xs text-gray-400 mt-3 break-all">{qrData.target_url}</p>
              </>
            ) : (
              <p className="text-sm text-red-500">{t('detail.qrError')}</p>
            )}

            <button
              onClick={() => setShowQR(false)}
              className="mt-6 w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('detail.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5 font-medium">{value || '—'}</p>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

function VerificationTimelineItem({
  ver,
  isFirst,
  t,
  VERIFICATION_TYPE_LABELS,
  RESULT_LABELS,
}: {
  ver: ISCIRVerification
  isFirst: boolean
  t: TFunc
  VERIFICATION_TYPE_LABELS: Record<string, string>
  RESULT_LABELS: Record<string, string>
}) {
  const [expanded, setExpanded] = useState(isFirst)

  return (
    <div className="relative pl-10">
      {/* Timeline dot */}
      <div
        className={`absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 ${
          ver.result === 'admis'
            ? 'bg-green-500 border-green-500'
            : ver.result === 'respins'
            ? 'bg-red-500 border-red-500'
            : 'bg-yellow-500 border-yellow-500'
        }`}
      />

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm text-gray-900">
              {new Date(ver.verification_date).toLocaleDateString('ro-RO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="text-xs text-gray-500">
              {VERIFICATION_TYPE_LABELS[ver.verification_type] || ver.verification_type}
            </span>
            <ResultBadge result={ver.result} t={t} />
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">{t('timeline.inspector')}:</span>{' '}
              <span className="text-gray-900">{ver.inspector_name}</span>
              {ver.inspector_legitimation && (
                <span className="text-gray-400"> ({ver.inspector_legitimation})</span>
              )}
            </div>
            <div>
              <span className="text-gray-500">{t('timeline.bulletin')}:</span>{' '}
              <span className="text-gray-900">{ver.bulletin_number}</span>
            </div>
            {ver.next_verification_date && (
              <div>
                <span className="text-gray-500">{t('timeline.nextVerif')}:</span>{' '}
                <span className="text-gray-900">
                  {new Date(ver.next_verification_date).toLocaleDateString('ro-RO')}
                </span>
              </div>
            )}
            {ver.deadline_prescriptions && (
              <div>
                <span className="text-gray-500">{t('timeline.prescriptionsDeadline')}:</span>{' '}
                <span className="text-gray-900">
                  {new Date(ver.deadline_prescriptions).toLocaleDateString('ro-RO')}
                </span>
              </div>
            )}
            {ver.observations && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">{t('form.observations')}:</span>{' '}
                <span className="text-gray-700">{ver.observations}</span>
              </div>
            )}
            {ver.prescriptions && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">{t('timeline.prescriptions')}:</span>{' '}
                <span className="text-gray-700">{ver.prescriptions}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function DailyCheckRow({ check, t }: { check: ISCIRDailyCheck; t: TFunc }) {
  const [expanded, setExpanded] = useState(false)
  const items = check.check_items || {}
  const totalItems = Object.keys(items).length
  const passedItems = Object.values(items).filter(Boolean).length
  const allPassed = passedItems === totalItems && totalItems > 0
  const hasIssues = !!check.issues_found

  return (
    <div
      className={`border rounded-xl p-4 ${
        hasIssues
          ? 'border-orange-200 bg-orange-50'
          : allPassed
          ? 'border-green-200 bg-green-50'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          {hasIssues ? (
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          ) : allPassed ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <div>
            <span className="font-medium text-sm text-gray-900">
              {new Date(check.check_date).toLocaleDateString('ro-RO', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
            <span className="ml-3 text-xs text-gray-500">
              {t('dailyRow.operator')}: {check.operator_name} · {passedItems}/{totalItems} {t('dailyRow.pointsOk')}
            </span>
            {check.signed && (
              <span className="ml-2 text-xs text-blue-600">✓ {t('dailyRow.signed')}</span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          {Object.entries(items).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {value ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
              <span className={value ? 'text-gray-700' : 'text-red-700 font-medium'}>
                {key.replace(/_/g, ' ')}
              </span>
            </div>
          ))}

          {check.issues_found && (
            <div className="mt-2 p-3 bg-orange-100 rounded-lg text-sm text-orange-800">
              <span className="font-medium">{t('dailyRow.issuesFound')}:</span> {check.issues_found}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
