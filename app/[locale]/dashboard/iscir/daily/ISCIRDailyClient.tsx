'use client'

// app/[locale]/dashboard/iscir/daily/ISCIRDailyClient.tsx
// M9_ISCIR: Operator daily-check page for macarale / stivuitoare

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  QrCode,
  Clock,
  User,
  Building2,
  ChevronRight,
  Loader2,
  Info,
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
  identifier: string
  registration_number?: string | null
  location?: string | null
  daily_check_required?: boolean
  status: string
  organizations?: Organization | null
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

interface ISCIRDailyClientProps {
  user: { id: string; email: string }
  equipment: ISCIREquipment[]
  todayChecks: ISCIRDailyCheck[]
  organizations: Organization[]
  selectedOrgId?: string
  preselectedEquipmentId?: string
  today: string
}

// ─── Default check items per equipment type ───────────────────────────────

const DEFAULT_CHECK_ITEMS: Record<string, Record<string, string>> = {
  macara: {
    cablu_tractiune: 'Cablu tracțiune funcțional',
    frane_functionale: 'Frâne funcționale',
    dispozitive_siguranta: 'Dispozitive de siguranță OK',
    sistem_ungere: 'Sistem de ungere funcțional',
    carlig_prindere: 'Cârlig și dispozitive de prindere OK',
    limitatoare_cursa: 'Limitatoare de cursă OK',
    avertizare_sonora: 'Avertizare sonoră/vizuală funcțională',
    structura_vizual: 'Structură fără fisuri/deformări vizibile',
  },
  stivuitor: {
    frana_serviciu: 'Frână de serviciu funcțională',
    frana_mana: 'Frână de mână funcțională',
    hidraulic_fara_scurgeri: 'Sistemul hidraulic fără scurgeri',
    furci_ok: 'Furci și sistem de ridicare OK',
    pneuri_roti: 'Pneuri/roți în stare bună',
    iluminat: 'Iluminat funcțional',
    avertizare_sonora: 'Avertizare sonoră funcțională',
    centura_siguranta: 'Centură de siguranță OK',
    dispozitive_siguranta: 'Dispozitive de siguranță OK',
    nivel_combustibil: 'Nivel combustibil/baterie suficient',
  },
  lift: {
    usi_siguranta: 'Uși și dispozitive de siguranță OK',
    limitatoare_viteza: 'Limitatoare de viteză funcționale',
    iluminat: 'Iluminat interior funcțional',
    avertizare_sonora: 'Avertizare sonoră funcțională',
    cablu_tractiune: 'Cabluri tracțiune fără deteriorări',
    frane: 'Frâne funcționale',
  },
  default: {
    echipament_functional: 'Echipament funcțional',
    fara_scurgeri: 'Fără scurgeri sau defecte vizibile',
    dispozitive_siguranta: 'Dispozitive de siguranță OK',
    zona_libera: 'Zona de lucru curată și liberă',
  },
}

function getCheckItemsForType(equipmentType: string): Record<string, string> {
  return DEFAULT_CHECK_ITEMS[equipmentType] || DEFAULT_CHECK_ITEMS.default
}

// ─── Label maps ───────────────────────────────────────────────────────────────

const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  cazan: 'Cazan',
  recipient_presiune: 'Recipient sub presiune',
  lift: 'Lift',
  macara: 'Macara',
  stivuitor: 'Stivuitor',
  instalatie_gpl: 'Instalație GPL',
  compresor: 'Compresor',
  autoclave: 'Autoclave',
  altul: 'Altul',
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ISCIRDailyClient({
  equipment,
  todayChecks,
  organizations,
  selectedOrgId,
  preselectedEquipmentId,
  today,
}: ISCIRDailyClientProps) {
  // Checklist modal state
  const [activeEquipment, setActiveEquipment] = useState<ISCIREquipment | null>(null)
  const [checkItems, setCheckItems] = useState<Record<string, boolean>>({})
  const [operatorName, setOperatorName] = useState('')
  const [issuesFound, setIssuesFound] = useState('')
  const [signed, setSigned] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // QR modal state
  const [qrEquipment, setQrEquipment] = useState<ISCIREquipment | null>(null)
  const [qrData, setQrData] = useState<{ qr_image_url: string; target_url: string } | null>(null)
  const [qrLoading, setQrLoading] = useState(false)

  // Local state for today's checks (updates after submit)
  const [localTodayChecks, setLocalTodayChecks] = useState<ISCIRDailyCheck[]>(todayChecks)
  const localCheckMap = new Map<string, ISCIRDailyCheck>(
    localTodayChecks.map((c) => [c.equipment_id, c])
  )
  const localCheckedCount = equipment.filter((eq) => localCheckMap.has(eq.id)).length

  // Auto-open checklist if equipment param is in URL (QR scan redirect)
  useEffect(() => {
    if (preselectedEquipmentId) {
      const eq = equipment.find((e) => e.id === preselectedEquipmentId)
      if (eq) {
        openChecklist(eq)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedEquipmentId])

  const openChecklist = (eq: ISCIREquipment) => {
    const items = getCheckItemsForType(eq.equipment_type)
    const initial: Record<string, boolean> = {}
    Object.keys(items).forEach((k) => {
      initial[k] = false
    })
    setCheckItems(initial)
    setOperatorName('')
    setIssuesFound('')
    setSigned(false)
    setActiveEquipment(eq)
  }

  const openQR = async (eq: ISCIREquipment) => {
    setQrEquipment(eq)
    setQrData(null)
    setQrLoading(true)
    try {
      const res = await fetch(`/api/iscir/qr/${eq.id}`)
      const data = await res.json()
      if (res.ok) setQrData(data)
    } catch (e) {
      console.error('QR load error:', e)
    } finally {
      setQrLoading(false)
    }
  }

  const handleSubmitCheck = async () => {
    if (!activeEquipment || !operatorName.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/iscir/daily-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment_id: activeEquipment.id,
          organization_id: activeEquipment.organization_id,
          operator_name: operatorName.trim(),
          check_date: today,
          check_items: checkItems,
          issues_found: issuesFound.trim() || null,
          signed,
        }),
      })

      const data = await res.json()

      if (res.ok && data.check) {
        // Update local state so UI refreshes without page reload
        setLocalTodayChecks((prev) => {
          const filtered = prev.filter((c) => c.equipment_id !== activeEquipment.id)
          return [...filtered, data.check]
        })
        setActiveEquipment(null)
      } else {
        alert(data.error || 'Eroare la salvarea verificării')
      }
    } catch (e) {
      console.error('Submit check error:', e)
      alert('Eroare la salvarea verificării zilnice')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCheckItem = (key: string) => {
    setCheckItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const todayFormatted = new Date(today).toLocaleDateString('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/iscir"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la ISCIR
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <ClipboardCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verificări zilnice ISCIR</h1>
            <p className="text-sm text-gray-500 capitalize">{todayFormatted}</p>
          </div>
        </div>

        {/* Org filter */}
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          value={selectedOrgId || 'all'}
          onChange={(e) => {
            const newOrg = e.target.value === 'all' ? undefined : e.target.value
            window.location.href = `/dashboard/iscir/daily${newOrg ? `?org=${newOrg}` : ''}`
          }}
        >
          <option value="all">Toate organizațiile</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Wrench className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total echipamente</p>
            <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Verificate azi</p>
            <p className="text-2xl font-bold text-green-600">{localCheckedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              equipment.length - localCheckedCount > 0 ? 'bg-orange-100' : 'bg-gray-100'
            }`}
          >
            <Clock
              className={`w-5 h-5 ${
                equipment.length - localCheckedCount > 0 ? 'text-orange-500' : 'text-gray-400'
              }`}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">Neverificate</p>
            <p
              className={`text-2xl font-bold ${
                equipment.length - localCheckedCount > 0 ? 'text-orange-600' : 'text-gray-400'
              }`}
            >
              {equipment.length - localCheckedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {equipment.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progres verificări azi</span>
            <span className="text-sm font-semibold text-gray-900">
              {localCheckedCount}/{equipment.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{
                width:
                  equipment.length > 0 ? `${(localCheckedCount / equipment.length) * 100}%` : '0%',
              }}
            />
          </div>
          {localCheckedCount === equipment.length && equipment.length > 0 && (
            <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Toate verificările zilnice au fost completate!
            </p>
          )}
        </div>
      )}

      {/* Equipment list */}
      {equipment.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900">Nu există echipamente</h3>
          <p className="text-sm text-gray-500 mt-1">
            Niciun echipament cu verificare zilnică necesară nu a fost găsit.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Activați &ldquo;Verificare zilnică necesară&rdquo; pe echipamentele de tip macara sau stivuitor.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {equipment.map((eq) => {
            const existing = localCheckMap.get(eq.id)
            const isChecked = !!existing

            return (
              <div
                key={eq.id}
                className={`bg-white rounded-2xl border p-5 transition-colors ${
                  isChecked
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div
                      className={`mt-0.5 flex-shrink-0 p-2 rounded-lg ${
                        isChecked ? 'bg-green-200' : 'bg-gray-100'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-green-700" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{eq.identifier}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {EQUIPMENT_TYPE_LABELS[eq.equipment_type] || eq.equipment_type}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                        {eq.location && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {eq.location}
                          </span>
                        )}
                        {eq.organizations && (
                          <span className="text-xs text-gray-500">{eq.organizations.name}</span>
                        )}
                      </div>

                      {isChecked && existing && (
                        <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Verificat de {existing.operator_name}
                          {existing.issues_found && (
                            <span className="ml-2 text-orange-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Probleme semnalate
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <button
                      onClick={() => openQR(eq)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Cod QR"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/dashboard/iscir/${eq.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Detalii echipament"
                    >
                      <Info className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => openChecklist(eq)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isChecked
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      {isChecked ? 'Actualizează' : 'Verifică'}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Checklist Modal ──────────────────────────────────────────────── */}
      {activeEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Verificare zilnică</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {activeEquipment.identifier} —{' '}
                {EQUIPMENT_TYPE_LABELS[activeEquipment.equipment_type] ||
                  activeEquipment.equipment_type}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{todayFormatted}</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Operator name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nume operator *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Prenume Nume"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Checklist items */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Puncte de verificare *</p>
                <div className="space-y-2.5">
                  {Object.entries(getCheckItemsForType(activeEquipment.equipment_type)).map(
                    ([key, label]) => (
                      <label
                        key={key}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          checkItems[key]
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={checkItems[key] || false}
                            onChange={() => toggleCheckItem(key)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                              checkItems[key]
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {checkItems[key] && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M3.5 7.5l2 2 3-4" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-sm ${
                            checkItems[key] ? 'text-green-800 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {label}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Quick select all */}
              <button
                onClick={() => {
                  const items = getCheckItemsForType(activeEquipment.equipment_type)
                  const allTrue: Record<string, boolean> = {}
                  Object.keys(items).forEach((k) => {
                    allTrue[k] = true
                  })
                  setCheckItems(allTrue)
                }}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Bifează toate punctele OK
              </button>

              {/* Issues */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Probleme constatate (opțional)
                </label>
                <textarea
                  value={issuesFound}
                  onChange={(e) => setIssuesFound(e.target.value)}
                  placeholder="Descrieți orice problemă sau defecțiune observată..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Signature checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={signed}
                    onChange={(e) => setSigned(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      signed ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {signed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M3.5 7.5l2 2 3-4" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Semnătură electronică</p>
                  <p className="text-xs text-gray-500">
                    Confirm că am efectuat verificarea și datele completate sunt corecte.
                  </p>
                </div>
              </label>
            </div>

            {/* Modal footer */}
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setActiveEquipment(null)}
                className="px-4 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleSubmitCheck}
                disabled={submitting || !operatorName.trim()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Se salvează...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmă verificarea
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QR Code Modal ─────────────────────────────────────────────────── */}
      {qrEquipment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setQrEquipment(null)
            setQrData(null)
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Cod QR operator</h3>
            <p className="text-sm text-gray-500 mb-1">
              <strong>{qrEquipment.identifier}</strong>
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Scanează cu telefonul pentru a accesa direct verificarea zilnică
            </p>

            {qrLoading ? (
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : qrData ? (
              <>
                <img
                  src={qrData.qr_image_url}
                  alt={`QR ${qrEquipment.identifier}`}
                  className="w-48 h-48 mx-auto rounded-xl border border-gray-200 shadow"
                />
                <p className="text-xs text-gray-400 mt-3 break-all px-2">{qrData.target_url}</p>
              </>
            ) : (
              <div className="w-48 h-48 mx-auto bg-red-50 rounded-xl flex items-center justify-center">
                <p className="text-sm text-red-500 px-4">Eroare la generarea QR</p>
              </div>
            )}

            <button
              onClick={() => {
                setQrEquipment(null)
                setQrData(null)
              }}
              className="mt-6 w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Închide
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
