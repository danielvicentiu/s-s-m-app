'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ApiKey, ApiKeyPermission } from '@/lib/types'
import { Key, Plus, Copy, RotateCw, Trash2, CheckCircle2, Clock, Shield } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface ApiKeysClientProps {
  organizationId: string
  apiKeys: ApiKey[]
  userId: string
}

interface NewKeyModalData {
  name: string
  description: string
  permissions: ApiKeyPermission[]
}

export default function ApiKeysClient({ organizationId, apiKeys: initialKeys, userId }: ApiKeysClientProps) {
  const t = useTranslations('apiKeys')

  const AVAILABLE_PERMISSIONS: { value: ApiKeyPermission; label: string; description: string }[] = [
    { value: 'read:employees', label: t('permReadEmployees'), description: t('permReadEmployeesDesc') },
    { value: 'write:employees', label: t('permWriteEmployees'), description: t('permWriteEmployeesDesc') },
    { value: 'read:trainings', label: t('permReadTrainings'), description: t('permReadTrainingsDesc') },
    { value: 'write:trainings', label: t('permWriteTrainings'), description: t('permWriteTrainingsDesc') },
    { value: 'read:medical', label: t('permReadMedical'), description: t('permReadMedicalDesc') },
    { value: 'write:medical', label: t('permWriteMedical'), description: t('permWriteMedicalDesc') },
    { value: 'read:equipment', label: t('permReadEquipment'), description: t('permReadEquipmentDesc') },
    { value: 'write:equipment', label: t('permWriteEquipment'), description: t('permWriteEquipmentDesc') },
    { value: 'read:alerts', label: t('permReadAlerts'), description: t('permReadAlertsDesc') },
    { value: 'read:documents', label: t('permReadDocuments'), description: t('permReadDocumentsDesc') },
    { value: 'write:documents', label: t('permWriteDocuments'), description: t('permWriteDocumentsDesc') },
    { value: 'read:reports', label: t('permReadReports'), description: t('permReadReportsDesc') },
    { value: 'webhook:manage', label: t('permWebhookManage'), description: t('permWebhookManageDesc') },
    { value: 'admin:all', label: t('permAdminAll'), description: t('permAdminAllDesc') },
  ]

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyData, setNewKeyData] = useState<NewKeyModalData>({
    name: '',
    description: '',
    permissions: [],
  })
  const [createdKey, setCreatedKey] = useState<{ key: string; name: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    isDestructive?: boolean
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleCreateKey = async () => {
    if (!newKeyData.name.trim()) {
      showToast(t('errorNameRequired'), 'error')
      return
    }

    if (newKeyData.permissions.length === 0) {
      showToast(t('errorPermissionRequired'), 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          name: newKeyData.name,
          description: newKeyData.description || null,
          permissions: newKeyData.permissions,
          createdBy: userId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Eroare la crearea cheii API')
      }

      const result = await response.json()

      // Add new key to list
      setApiKeys([result.apiKey, ...apiKeys])

      // Show the full key once
      setCreatedKey({ key: result.plainTextKey, name: result.apiKey.name })

      // Reset form
      setNewKeyData({ name: '', description: '', permissions: [] })
      setShowCreateModal(false)

      showToast(t('toastKeyCreated'))
    } catch (error: any) {
      showToast(error.message || 'Eroare la crearea cheii API', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeKey = async (keyId: string, keyName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t('revokeTitle'),
      message: t('revokeMessage', { name: keyName }),
      isDestructive: true,
      onConfirm: async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/v1/api-keys/${keyId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ revokedBy: userId }),
          })

          if (!response.ok) {
            throw new Error('Eroare la revocare')
          }

          // Update local state
          setApiKeys(apiKeys.map(key =>
            key.id === keyId
              ? { ...key, is_active: false, revoked_at: new Date().toISOString() }
              : key
          ))

          showToast(t('toastKeyRevoked'))
        } catch (error: any) {
          showToast(error.message || 'Eroare la revocare', 'error')
        } finally {
          setLoading(false)
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
      },
    })
  }

  const handleRotateKey = async (keyId: string, keyName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t('rotateTitle'),
      message: t('rotateMessage', { name: keyName }),
      onConfirm: async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/v1/api-keys/${keyId}/rotate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rotatedBy: userId }),
          })

          if (!response.ok) {
            throw new Error('Eroare la rotație')
          }

          const result = await response.json()

          // Update list: mark old as revoked, add new one
          setApiKeys([
            result.apiKey,
            ...apiKeys.map(key =>
              key.id === keyId
                ? { ...key, is_active: false, revoked_at: new Date().toISOString() }
                : key
            ),
          ])

          // Show the new key
          setCreatedKey({ key: result.plainTextKey, name: result.apiKey.name })

          showToast(t('toastKeyRotated'))
        } catch (error: any) {
          showToast(error.message || 'Eroare la rotație', 'error')
        } finally {
          setLoading(false)
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
      },
    })
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      showToast(t('errorCopy'), 'error')
    }
  }

  const togglePermission = (permission: ApiKeyPermission) => {
    setNewKeyData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }))
  }

  const formatDate = (date: string | null) => {
    if (!date) return t('never')
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (key: ApiKey) => {
    if (key.revoked_at) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {t('statusRevoked')}
        </span>
      )
    }

    if (!key.is_active) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          {t('statusInactive')}
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        {t('statusActive')}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
              <p className="text-gray-600">
                {t('subtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              {t('newKey')}
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 right-4 z-50">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                toast.type === 'success' ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Trash2 className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}

        {/* Created Key Modal */}
        {createdKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCreatedKey(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Key className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{t('keyCreatedSuccess')}</h3>
                    <p className="text-sm text-gray-600">{createdKey.name}</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-yellow-900 font-medium">
                    ⚠️ {t('keyOnceWarning')}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('apiKeyLabel')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={createdKey.key}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(createdKey.key, 'created-key')}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    {copiedId === 'created-key' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        {t('copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {t('copy')}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCreatedKey(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            <div className="absolute inset-0 bg-black/50" onClick={() => !loading && setShowCreateModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 my-8 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t('createModalTitle')}</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('keyName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newKeyData.name}
                    onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                    placeholder="ex: Integrare CRM, API Production"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('keyDescription')}</label>
                  <textarea
                    value={newKeyData.description}
                    onChange={(e) => setNewKeyData({ ...newKeyData, description: e.target.value })}
                    placeholder="Descriere scurtă pentru ce este folosită această cheie"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('permissions')} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {AVAILABLE_PERMISSIONS.map((perm) => (
                      <label
                        key={perm.value}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          newKeyData.permissions.includes(perm.value)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newKeyData.permissions.includes(perm.value)}
                          onChange={() => togglePermission(perm.value)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{perm.label}</div>
                          <div className="text-xs text-gray-600">{perm.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {t('selectedPermissions', { count: newKeyData.permissions.length })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {t('createKey')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {apiKeys.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noKeys')}</h3>
              <p className="text-gray-600 mb-4">{t('noKeysDesc')}</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                {t('createFirstKey')}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('colName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('colKey')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('colStatus')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('colUsage')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('colCreated')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('colLastUsed')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('colActions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{key.name}</div>
                          {key.description && (
                            <div className="text-sm text-gray-500">{key.description}</div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Shield className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {key.permissions.length} permisiuni
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {key.key_prefix}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(key.key_prefix, key.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title={t('copyPrefix')}
                          >
                            {copiedId === key.id ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(key)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {key.total_requests.toLocaleString()} requests
                          </div>
                          <div className="text-xs text-gray-500">
                            Limită: {key.rate_limit_per_minute}/min
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(key.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(key.last_used_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!key.revoked_at && key.is_active && (
                            <>
                              <button
                                onClick={() => handleRotateKey(key.id, key.name)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title={t('rotateKey')}
                              >
                                <RotateCw className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRevokeKey(key.id, key.name)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={t('revokeKey')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          isOpen={confirmDialog.isOpen}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          isDestructive={confirmDialog.isDestructive}
          loading={loading}
        />
      </div>
    </div>
  )
}
