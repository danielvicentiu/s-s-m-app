'use client'

import { useState } from 'react'
import { Plus, Zap, CheckCircle2, XCircle, Clock, Trash2, Send } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface Webhook {
  id: string
  organization_id: string
  url: string
  events: string[]
  is_active: boolean
  secret: string | null
  last_response_status: number | null
  last_response_at: string | null
  created_at: string
  updated_at: string
}

interface WebhookDelivery {
  id: string
  webhook_id: string
  event_type: string
  payload: any
  response_status: number | null
  response_body: string | null
  delivered_at: string | null
  created_at: string
  webhooks?: {
    url: string
  }
}

interface WebhooksClientProps {
  webhooks: Webhook[]
  deliveries: WebhookDelivery[]
  organizationId: string
  userRole: string
}

const EVENT_TYPES = [
  { value: 'medical.created', label: 'Examen medical adăugat' },
  { value: 'medical.expiring', label: 'Examen medical expiră în curând' },
  { value: 'medical.expired', label: 'Examen medical expirat' },
  { value: 'equipment.created', label: 'Echipament adăugat' },
  { value: 'equipment.expiring', label: 'Echipament expiră în curând' },
  { value: 'equipment.expired', label: 'Echipament expirat' },
  { value: 'training.created', label: 'Training adăugat' },
  { value: 'training.expiring', label: 'Training expiră în curând' },
  { value: 'alert.created', label: 'Alertă creată' },
  { value: 'employee.created', label: 'Angajat adăugat' },
]

export default function WebhooksClient({
  webhooks: initialWebhooks,
  deliveries: initialDeliveries,
  organizationId,
  userRole,
}: WebhooksClientProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks)
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>(initialDeliveries)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state pentru adăugare webhook
  const [formData, setFormData] = useState({
    url: '',
    events: [] as string[],
    is_active: true,
  })

  const supabase = createSupabaseBrowser()

  const handleAddWebhook = async () => {
    if (!formData.url || formData.events.length === 0) {
      setError('URL și cel puțin un eveniment sunt obligatorii')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          organization_id: organizationId,
          url: formData.url,
          events: formData.events,
          is_active: formData.is_active,
        })
        .select()
        .single()

      if (error) throw error

      setWebhooks([data, ...webhooks])
      setIsAddModalOpen(false)
      setFormData({ url: '', events: [], is_active: true })
    } catch (err: any) {
      setError(err.message || 'Eroare la adăugare webhook')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (webhook: Webhook) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('webhooks')
        .update({ is_active: !webhook.is_active })
        .eq('id', webhook.id)

      if (error) throw error

      setWebhooks(
        webhooks.map((w) =>
          w.id === webhook.id ? { ...w, is_active: !w.is_active } : w
        )
      )
    } catch (err: any) {
      setError(err.message || 'Eroare la actualizare webhook')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('Sigur ștergi acest webhook? Această acțiune este permanentă.')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', webhookId)

      if (error) throw error

      setWebhooks(webhooks.filter((w) => w.id !== webhookId))
    } catch (err: any) {
      setError(err.message || 'Eroare la ștergere webhook')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestWebhook = async (webhook: Webhook) => {
    setIsLoading(true)
    setError(null)

    try {
      // Trimite un test ping la webhook
      const testPayload = {
        event: 'webhook.test',
        organization_id: organizationId,
        timestamp: new Date().toISOString(),
        data: {
          message: 'Test webhook ping de la S-S-M.RO',
        },
      }

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SSM-Event': 'webhook.test',
          'X-SSM-Webhook-Id': webhook.id,
        },
        body: JSON.stringify(testPayload),
      })

      // Salvează delivery log
      const { data: delivery, error: deliveryError } = await supabase
        .from('webhook_deliveries')
        .insert({
          webhook_id: webhook.id,
          event_type: 'webhook.test',
          payload: testPayload,
          response_status: response.status,
          response_body: await response.text(),
          delivered_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (deliveryError) throw deliveryError

      // Actualizează webhook cu ultimul răspuns
      await supabase
        .from('webhooks')
        .update({
          last_response_status: response.status,
          last_response_at: new Date().toISOString(),
        })
        .eq('id', webhook.id)

      // Refresh webhooks și deliveries
      const { data: updatedWebhooks } = await supabase
        .from('webhooks')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (updatedWebhooks) setWebhooks(updatedWebhooks)

      // Adaugă delivery la listă
      setDeliveries([
        {
          ...delivery,
          webhooks: { url: webhook.url },
        },
        ...deliveries,
      ])

      alert(`Webhook testat! Status: ${response.status}`)
    } catch (err: any) {
      setError(err.message || 'Eroare la testare webhook')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleEvent = (event: string) => {
    if (formData.events.includes(event)) {
      setFormData({
        ...formData,
        events: formData.events.filter((e) => e !== event),
      })
    } else {
      setFormData({
        ...formData,
        events: [...formData.events, event],
      })
    }
  }

  const getStatusBadge = (status: number | null) => {
    if (status === null) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <Clock className="h-3 w-3" />
          Niciodată
        </span>
      )
    }

    if (status >= 200 && status < 300) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          {status}
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <XCircle className="h-3 w-3" />
        {status}
      </span>
    )
  }

  const canManage = userRole === 'consultant' || userRole === 'firma_admin'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="h-7 w-7 text-blue-600" />
                Webhooks
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configurează notificări automate către sistemele tale externe
              </p>
            </div>
            {canManage && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Adaugă webhook
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista webhooks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Endpoints configurate ({webhooks.length})
            </h2>
          </div>

          {webhooks.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="Niciun webhook configurat"
              description="Adaugă un webhook pentru a primi notificări automate"
              actionLabel={canManage ? "Adaugă primul webhook" : undefined}
              onAction={canManage ? () => setIsAddModalOpen(true) : undefined}
            />
          ) : (
            <div className="divide-y divide-gray-200">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {webhook.url}
                        </code>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            webhook.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {webhook.is_active ? 'Activ' : 'Inactiv'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                          >
                            {event}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Ultimul răspuns: {getStatusBadge(webhook.last_response_status)}</span>
                        {webhook.last_response_at && (
                          <span>
                            la {new Date(webhook.last_response_at).toLocaleString('ro-RO')}
                          </span>
                        )}
                      </div>
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTestWebhook(webhook)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Send className="h-4 w-4" />
                          Test
                        </button>
                        <button
                          onClick={() => handleToggleActive(webhook)}
                          disabled={isLoading}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            webhook.is_active
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {webhook.is_active ? 'Dezactivează' : 'Activează'}
                        </button>
                        <button
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Log */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Ultimele deliveries ({deliveries.length})
            </h2>
          </div>

          {deliveries.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nicio delivery încă
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivered at
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(delivery.created_at).toLocaleString('ro-RO')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {delivery.webhooks?.url || 'N/A'}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {delivery.event_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(delivery.response_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {delivery.delivered_at
                          ? new Date(delivery.delivered_at).toLocaleString('ro-RO')
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Adaugă Webhook */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setFormData({ url: '', events: [], is_active: true })
          setError(null)
        }}
        title="Adaugă webhook"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL endpoint *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com/webhook"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evenimente subscrise * (selectează cel puțin unul)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {EVENT_TYPES.map((eventType) => (
                <label
                  key={eventType.value}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.events.includes(eventType.value)}
                    onChange={() => toggleEvent(eventType.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{eventType.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Activează webhook imediat
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddWebhook}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Se adaugă...' : 'Adaugă webhook'}
            </button>
            <button
              onClick={() => {
                setIsAddModalOpen(false)
                setFormData({ url: '', events: [], is_active: true })
                setError(null)
              }}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Anulează
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
