'use client'

// app/[locale]/dashboard/alerts/AlertsClient.tsx
// Dashboard Alerte & Notificări — 3 tab-uri: Istoric, Configurare, Consum

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AlertLog {
  id: string
  organization_id: string
  alert_type: string
  channel: 'whatsapp' | 'sms' | 'email'
  recipient_name: string | null
  recipient_phone: string | null
  recipient_email: string | null
  message_content: string
  expiry_date: string | null
  days_until_expiry: number | null
  delivery_status: string
  delivery_updated_at: string | null
  is_escalation: boolean
  acknowledged: boolean
  acknowledged_at: string | null
  created_at: string
}

interface AlertConfig {
  id?: string
  organization_id?: string
  whatsapp_enabled: boolean
  sms_enabled: boolean
  email_enabled: boolean
  alert_days: number[]
  escalation_enabled: boolean
  escalation_after_hours: number
  escalation_contact_name: string | null
  escalation_contact_phone: string | null
  escalation_contact_email: string | null
  monthly_report_enabled: boolean
  monthly_report_day: number
}

interface AlertUsage {
  id: string
  organization_id: string
  month: string
  whatsapp_count: number
  sms_count: number
  email_count: number
  total_cost_eur: number
}

interface Organization {
  id: string
  name: string
  contact_email: string
}

interface Props {
  user: { id: string; email: string }
  organizations: Organization[]
  selectedOrgId: string | null
  alertLogs: AlertLog[]
  alertConfig: AlertConfig | null
  alertUsage: AlertUsage[]
  isTwilioConfigured: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ALERT_TYPE_LABELS: Record<string, string> = {
  training_expiry: 'Instruire SSM',
  medical_expiry: 'Fișă medicală',
  psi_expiry: 'Echipament PSI',
  iscir_expiry: 'Echipament ISCIR',
  monthly_report: 'Raport lunar',
  escalation: 'Escaladare',
  compliance_warning: 'Conformitate',
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  queued: { label: 'În așteptare', className: 'bg-gray-100 text-gray-700' },
  sent: { label: 'Trimis', className: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Livrat', className: 'bg-green-100 text-green-700' },
  read: { label: 'Citit', className: 'bg-purple-100 text-purple-700' },
  failed: { label: 'Eșuat', className: 'bg-red-100 text-red-700' },
  undelivered: { label: 'Nelivrat', className: 'bg-orange-100 text-orange-700' },
}

function ChannelIcon({ channel }: { channel: string }) {
  if (channel === 'whatsapp') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        WhatsApp
      </span>
    )
  }
  if (channel === 'sms') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        SMS
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Email
    </span>
  )
}

const DEFAULT_CONFIG: AlertConfig = {
  whatsapp_enabled: false,
  sms_enabled: false,
  email_enabled: true,
  alert_days: [30, 14, 7, 1],
  escalation_enabled: false,
  escalation_after_hours: 48,
  escalation_contact_name: null,
  escalation_contact_phone: null,
  escalation_contact_email: null,
  monthly_report_enabled: true,
  monthly_report_day: 1,
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AlertsClient({
  organizations,
  selectedOrgId,
  alertLogs,
  alertConfig: initialConfig,
  alertUsage,
  isTwilioConfigured,
}: Props) {
  const supabase = createSupabaseBrowser()
  const [activeTab, setActiveTab] = useState<'history' | 'config' | 'usage'>('history')
  const [filterType, setFilterType] = useState('')
  const [filterChannel, setFilterChannel] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [config, setConfig] = useState<AlertConfig>(initialConfig || DEFAULT_CONFIG)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const org = organizations.find((o) => o.id === selectedOrgId) || organizations[0]

  // ─── Filtrare loguri ────────────────────────────────────────────────────────

  const filteredLogs = alertLogs.filter((log) => {
    if (filterType && log.alert_type !== filterType) return false
    if (filterChannel && log.channel !== filterChannel) return false
    if (filterStatus && log.delivery_status !== filterStatus) return false
    return true
  })

  // ─── Salvare configurare ────────────────────────────────────────────────────

  const handleSaveConfig = async () => {
    if (!selectedOrgId) return
    setSaving(true)
    setSaveMessage(null)

    try {
      const { error } = await supabase
        .from('alert_configurations')
        .upsert(
          {
            organization_id: selectedOrgId,
            whatsapp_enabled: config.whatsapp_enabled,
            sms_enabled: config.sms_enabled,
            email_enabled: config.email_enabled,
            alert_days: config.alert_days,
            escalation_enabled: config.escalation_enabled,
            escalation_after_hours: config.escalation_after_hours,
            escalation_contact_name: config.escalation_contact_name,
            escalation_contact_phone: config.escalation_contact_phone,
            escalation_contact_email: config.escalation_contact_email,
            monthly_report_enabled: config.monthly_report_enabled,
            monthly_report_day: config.monthly_report_day,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'organization_id' }
        )

      if (error) throw error
      setSaveMessage({ type: 'success', text: 'Configurare salvată cu succes!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err: any) {
      console.error('Save config error:', err)
      setSaveMessage({ type: 'error', text: 'Eroare la salvare: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  const toggleAlertDay = (day: number) => {
    setConfig((prev) => ({
      ...prev,
      alert_days: prev.alert_days.includes(day)
        ? prev.alert_days.filter((d) => d !== day)
        : [...prev.alert_days, day].sort((a, b) => b - a),
    }))
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alerte & Notificări</h1>
              <p className="text-sm text-gray-500">
                {org ? org.name : 'Nicio organizație selectată'} — WhatsApp, SMS, Email cascade
              </p>
            </div>
          </div>

          {/* Twilio status */}
          {!isTwilioConfigured && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                <strong>Twilio neconfigurat</strong> — WhatsApp și SMS nu sunt disponibile. Email-urile funcționează normal.
                Adăugați <code className="bg-amber-100 px-1 rounded">TWILIO_ACCOUNT_SID</code> și{' '}
                <code className="bg-amber-100 px-1 rounded">TWILIO_AUTH_TOKEN</code> în variabilele de mediu.
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 border-b border-gray-200">
            {[
              { key: 'history', label: 'Istoric Alerte' },
              { key: 'config', label: 'Configurare' },
              { key: 'usage', label: 'Consum & Costuri' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* ─── Tab: Istoric ─────────────────────────────────────────────────── */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* Filtre */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex flex-wrap gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toate tipurile</option>
                  {Object.entries(ALERT_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>

                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toate canalele</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toate statusurile</option>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>

                <span className="ml-auto text-sm text-gray-500 self-center">
                  {filteredLogs.length} alerte
                </span>
              </div>
            </div>

            {/* Tabel loguri */}
            {filteredLogs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-gray-500 font-medium">Niciun log de alertă</p>
                <p className="text-sm text-gray-400 mt-1">Alertele vor apărea aici după prima rulare a CRON-ului</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tip
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Canal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Destinatar
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Mesaj
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Confirmat
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLogs.map((log) => {
                        const statusInfo = STATUS_LABELS[log.delivery_status] || {
                          label: log.delivery_status,
                          className: 'bg-gray-100 text-gray-700',
                        }
                        return (
                          <tr key={log.id} className={`hover:bg-gray-50 ${log.is_escalation ? 'bg-red-50' : ''}`}>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              {new Date(log.created_at).toLocaleDateString('ro-RO', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="font-medium text-gray-900">
                                {ALERT_TYPE_LABELS[log.alert_type] || log.alert_type}
                              </span>
                              {log.is_escalation && (
                                <span className="ml-1 text-xs text-red-600">(escaladare)</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <ChannelIcon channel={log.channel} />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <div>{log.recipient_name || '—'}</div>
                              {log.recipient_phone && (
                                <div className="text-xs text-gray-400">{log.recipient_phone}</div>
                              )}
                              {log.recipient_email && (
                                <div className="text-xs text-gray-400">{log.recipient_email}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                              <p className="truncate" title={log.message_content}>
                                {log.message_content.slice(0, 80)}
                                {log.message_content.length > 80 ? '…' : ''}
                              </p>
                              {log.days_until_expiry !== null && (
                                <span className={`text-xs font-medium ${
                                  (log.days_until_expiry ?? 0) <= 0
                                    ? 'text-red-600'
                                    : (log.days_until_expiry ?? 0) <= 7
                                    ? 'text-orange-600'
                                    : 'text-gray-400'
                                }`}>
                                  {(log.days_until_expiry ?? 0) <= 0
                                    ? 'Expirat'
                                    : `${log.days_until_expiry} zile`}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {log.acknowledged ? (
                                <span title={`Confirmat la ${log.acknowledged_at ? new Date(log.acknowledged_at).toLocaleDateString('ro-RO') : ''}`}>
                                  <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-gray-200 inline-block" />
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
          </div>
        )}

        {/* ─── Tab: Configurare ─────────────────────────────────────────────── */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            {saveMessage && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {saveMessage.type === 'success'
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />}
                </svg>
                <p className="font-medium">{saveMessage.text}</p>
              </div>
            )}

            {/* Canale de notificare */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Canale de notificare</h2>

              <div className="space-y-4">
                {/* WhatsApp */}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${config.whatsapp_enabled ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp</p>
                      {!isTwilioConfigured && (
                        <p className="text-xs text-amber-600">Twilio neconfigurat</p>
                      )}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.whatsapp_enabled}
                      onChange={(e) => setConfig((p) => ({ ...p, whatsapp_enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {/* SMS */}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${config.sms_enabled ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">SMS</p>
                      {!isTwilioConfigured && (
                        <p className="text-xs text-amber-600">Twilio neconfigurat</p>
                      )}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.sms_enabled}
                      onChange={(e) => setConfig((p) => ({ ...p, sms_enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Email */}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${config.email_enabled ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-xs text-gray-500">via Resend (alerte@s-s-m.ro)</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.email_enabled}
                      onChange={(e) => setConfig((p) => ({ ...p, email_enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-700"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Zile alertă */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Zile înainte de expirare</h2>
              <p className="text-sm text-gray-500 mb-4">Alegeți cu câte zile înainte să primiți alerta</p>
              <div className="flex gap-3 flex-wrap">
                {[30, 14, 7, 1].map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleAlertDay(day)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      config.alert_days.includes(day)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day === 1 ? '1 zi' : `${day} zile`}
                  </button>
                ))}
              </div>
            </div>

            {/* Escaladare */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Escaladare automată</h2>
                  <p className="text-sm text-gray-500">Notifică un contact suplimentar dacă alertele nu sunt confirmate</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.escalation_enabled}
                    onChange={(e) => setConfig((p) => ({ ...p, escalation_enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {config.escalation_enabled && (
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Escaladare după (ore)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={168}
                      value={config.escalation_after_hours}
                      onChange={(e) =>
                        setConfig((p) => ({ ...p, escalation_after_hours: parseInt(e.target.value) || 48 }))
                      }
                      className="w-32 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nume contact</label>
                      <input
                        type="text"
                        value={config.escalation_contact_name || ''}
                        onChange={(e) =>
                          setConfig((p) => ({ ...p, escalation_contact_name: e.target.value || null }))
                        }
                        placeholder="Ion Popescu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon contact</label>
                      <input
                        type="tel"
                        value={config.escalation_contact_phone || ''}
                        onChange={(e) =>
                          setConfig((p) => ({ ...p, escalation_contact_phone: e.target.value || null }))
                        }
                        placeholder="+40712345678"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email contact</label>
                      <input
                        type="email"
                        value={config.escalation_contact_email || ''}
                        onChange={(e) =>
                          setConfig((p) => ({ ...p, escalation_contact_email: e.target.value || null }))
                        }
                        placeholder="contact@firma.ro"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Raport lunar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Raport lunar</h2>
                  <p className="text-sm text-gray-500">Sumar lunar cu toate expirările planificate</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.monthly_report_enabled}
                    onChange={(e) => setConfig((p) => ({ ...p, monthly_report_enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {config.monthly_report_enabled && (
                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ziua lunii pentru trimitere
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={28}
                    value={config.monthly_report_day}
                    onChange={(e) =>
                      setConfig((p) => ({ ...p, monthly_report_day: parseInt(e.target.value) || 1 }))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveConfig}
                disabled={saving || !selectedOrgId}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Se salvează...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Salvează configurarea
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── Tab: Consum & Costuri ─────────────────────────────────────────── */}
        {activeTab === 'usage' && (
          <div className="space-y-4">
            {alertUsage.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 font-medium">Niciun consum înregistrat</p>
                <p className="text-sm text-gray-400 mt-1">Statisticile apar după prima alertă trimisă</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Consum lunar alerte</h2>
                  <p className="text-sm text-gray-500">Costuri estimate: WhatsApp €0.05/msg, SMS €0.05/msg, Email €0.001/msg</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lună</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">SMS</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost estimat (EUR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {alertUsage.map((row) => {
                        const isCurrentMonth =
                          row.month.slice(0, 7) === new Date().toISOString().slice(0, 7)
                        return (
                          <tr key={row.id} className={isCurrentMonth ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {new Date(row.month).toLocaleDateString('ro-RO', {
                                month: 'long',
                                year: 'numeric',
                              })}
                              {isCurrentMonth && (
                                <span className="ml-2 text-xs text-blue-600 font-medium">(curentă)</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-700">{row.whatsapp_count}</td>
                            <td className="px-6 py-4 text-sm text-right text-gray-700">{row.sms_count}</td>
                            <td className="px-6 py-4 text-sm text-right text-gray-700">{row.email_count}</td>
                            <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                              €{(row.total_cost_eur || 0).toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                      <tr>
                        <td className="px-6 py-3 text-sm font-bold text-gray-900">TOTAL</td>
                        <td className="px-6 py-3 text-sm text-right font-bold text-gray-900">
                          {alertUsage.reduce((s, r) => s + (r.whatsapp_count || 0), 0)}
                        </td>
                        <td className="px-6 py-3 text-sm text-right font-bold text-gray-900">
                          {alertUsage.reduce((s, r) => s + (r.sms_count || 0), 0)}
                        </td>
                        <td className="px-6 py-3 text-sm text-right font-bold text-gray-900">
                          {alertUsage.reduce((s, r) => s + (r.email_count || 0), 0)}
                        </td>
                        <td className="px-6 py-3 text-sm text-right font-bold text-gray-900">
                          €{alertUsage.reduce((s, r) => s + (r.total_cost_eur || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
