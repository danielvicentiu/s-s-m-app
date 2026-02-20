'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { ArrowLeft, Plus, RefreshCw, Link as LinkIcon, Send, FileText, Database, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface Props {
  user: { id: string; email: string }
  connections: any[]
  outbox: any[]
  organizations: any[]
}

export default function RegesClient({ user, connections, outbox, organizations }: Props) {
  const t = useTranslations('reges')
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'connections' | 'transmissions' | 'nomenclatures'>('connections')
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state pentru conexiune REGES
  const [connectionForm, setConnectionForm] = useState({
    organizationId: '',
    cui: '',
    regesUserId: '',
    regesEmployerId: '',
    username: '',
    password: '',
  })

  // Sync state
  const [syncResult, setSyncResult] = useState<any>(null)
  const [syncing, setSyncing] = useState(false)

  async function handleCreateConnection() {
    if (!connectionForm.organizationId || !connectionForm.cui || !connectionForm.regesUserId || !connectionForm.regesEmployerId || !connectionForm.username || !connectionForm.password) {
      alert(t('alertFillAllFields'))
      return
    }

    setLoading(true)

    try {
      // Call API route to encrypt + save credentials
      const response = await fetch('/api/reges/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: connectionForm.organizationId,
          cui: connectionForm.cui,
          reges_user_id: connectionForm.regesUserId,
          reges_employer_id: connectionForm.regesEmployerId,
          username: connectionForm.username,
          password: connectionForm.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create connection')
      }

      setShowConnectionModal(false)
      setConnectionForm({ organizationId: '', cui: '', regesUserId: '', regesEmployerId: '', username: '', password: '' })
      router.refresh()
      alert(t('alertConnectionCreated'))
    } catch (error: any) {
      console.error('Error creating connection:', error)
      alert(`Eroare: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleSync() {
    if (connections.length === 0) {
      alert(t('alertNoConnections'))
      return
    }

    setSyncing(true)
    setSyncResult(null)

    try {
      const response = await fetch('/api/reges/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connection_id: connections[0].id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Sync failed')
      }

      const result = await response.json()
      setSyncResult(result)
      router.refresh()
    } catch (error: any) {
      console.error('Sync error:', error)
      alert(`Eroare la sincronizare: ${error.message}`)
    } finally {
      setSyncing(false)
    }
  }

  function getStatusBadge(status: string) {
    const config: Record<string, { bg: string; text: string; icon: any }> = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle },
      error: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      queued: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
      sending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Send },
      sent: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Send },
      accepted: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    }
    const c = config[status] || config.inactive
    const Icon = c.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-600" />
                {t('title')}
              </h1>
              <p className="text-sm text-gray-400">{t('subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => router.refresh()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            {t('refresh')}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 py-3.5 text-center text-sm font-semibold transition-all ${
                activeTab === 'connections'
                  ? 'bg-white text-gray-900 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              <LinkIcon className="inline-block w-4 h-4 mr-2" />
              {t('tabConnections')}
            </button>
            <button
              onClick={() => setActiveTab('transmissions')}
              className={`flex-1 py-3.5 text-center text-sm font-semibold transition-all ${
                activeTab === 'transmissions'
                  ? 'bg-white text-gray-900 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              <Send className="inline-block w-4 h-4 mr-2" />
              {t('tabTransmissions')}
            </button>
            <button
              onClick={() => setActiveTab('nomenclatures')}
              className={`flex-1 py-3.5 text-center text-sm font-semibold transition-all ${
                activeTab === 'nomenclatures'
                  ? 'bg-white text-gray-900 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              <Database className="inline-block w-4 h-4 mr-2" />
              {t('tabNomenclatures')}
            </button>
          </div>

          {/* Tab: Conexiuni REGES */}
          {activeTab === 'connections' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{t('connectionsTitle')}</h2>
                  <p className="text-sm text-gray-500">
                    {t('connectionsCount', { count: connections.length })}
                  </p>
                </div>
                <button
                  onClick={() => setShowConnectionModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  {t('connectButton')}
                </button>
              </div>

              {connections.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                  <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">{t('noConnectionsTitle')}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {t('noConnectionsDesc')}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                        <th className="px-4 py-3">{t('colOrganization')}</th>
                        <th className="px-4 py-3">CUI</th>
                        <th className="px-4 py-3">REGES User ID</th>
                        <th className="px-4 py-3">REGES Employer ID</th>
                        <th className="px-4 py-3">{t('colStatus')}</th>
                        <th className="px-4 py-3">{t('colLastSync')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {connections.map((conn: any) => (
                        <tr key={conn.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {conn.organizations?.name || '—'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{conn.cui}</td>
                          <td className="px-4 py-4 text-sm text-gray-600 font-mono">{conn.reges_user_id}</td>
                          <td className="px-4 py-4 text-sm text-gray-600 font-mono">{conn.reges_employer_id}</td>
                          <td className="px-4 py-4">{getStatusBadge(conn.status)}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {conn.last_sync_at
                              ? new Date(conn.last_sync_at).toLocaleString('ro-RO')
                              : t('never')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: Transmiteri */}
          {activeTab === 'transmissions' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('transmissionsTitle')}</h2>
                <p className="text-sm text-gray-500">{t('transmissionsCount', { count: outbox.length })}</p>
              </div>

              {outbox.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                  <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">{t('noTransmissionsTitle')}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {t('noTransmissionsDesc')}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">{t('colMsgType')}</th>
                        <th className="px-4 py-3">{t('colOrganization')}</th>
                        <th className="px-4 py-3">{t('colStatus')}</th>
                        <th className="px-4 py-3">{t('colAttempts')}</th>
                        <th className="px-4 py-3">{t('colCreatedAt')}</th>
                        <th className="px-4 py-3">{t('colSentAt')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {outbox.map((msg: any) => (
                        <tr key={msg.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4 text-xs text-gray-400 font-mono">{msg.id.slice(0, 8)}...</td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {msg.message_type.replace(/_/g, ' ')}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {msg.organizations?.name || '—'}
                          </td>
                          <td className="px-4 py-4">{getStatusBadge(msg.status)}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {msg.attempts}/{msg.max_attempts}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {new Date(msg.created_at).toLocaleString('ro-RO')}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {msg.sent_at ? new Date(msg.sent_at).toLocaleString('ro-RO') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: Nomenclatoare */}
          {activeTab === 'nomenclatures' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('nomenclaturesTitle')}</h2>
                <p className="text-sm text-gray-500">{t('nomenclaturesDesc')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Placeholder COR */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">COR (Clasificarea Ocupațiilor)</h3>
                      <p className="text-xs text-gray-500">Coming soon</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('corDesc')}
                  </p>
                </div>

                {/* Placeholder CAEN */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">CAEN (Clasificarea Activităților)</h3>
                      <p className="text-xs text-gray-500">Coming soon</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('caenDesc')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal: Conectare REGES */}
      {showConnectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-gray-900 mb-2">{t('modalTitle')}</h2>
            <p className="text-sm text-gray-600 mb-6">
              {t('modalDesc')}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {t('fieldOrganization')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={connectionForm.organizationId}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, organizationId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">— {t('selectOrganization')} —</option>
                  {organizations.map((org: any) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.cui || t('noCui')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  CUI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={connectionForm.cui}
                  onChange={(e) => setConnectionForm({ ...connectionForm, cui: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="RO12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  REGES User ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={connectionForm.regesUserId}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, regesUserId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  placeholder="USER_XXXX"
                />
                <p className="text-xs text-gray-500 mt-1">{t('receivedFromANRE')}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  REGES Employer ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={connectionForm.regesEmployerId}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, regesEmployerId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  placeholder="EMPLOYER_YYYY"
                />
                <p className="text-xs text-gray-500 mt-1">{t('receivedFromANRE')}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {t('fieldUsernameREGES')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={connectionForm.username}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, username: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder={t('usernamePlaceholder')}
                />
                <p className="text-xs text-gray-500 mt-1">{t('usernameHint')}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {t('fieldPasswordREGES')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={connectionForm.password}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, password: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">{t('passwordHint')}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowConnectionModal(false)
                  setConnectionForm({ organizationId: '', cui: '', regesUserId: '', regesEmployerId: '', username: '', password: '' })
                }}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateConnection}
                disabled={loading}
                className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? t('saving') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
