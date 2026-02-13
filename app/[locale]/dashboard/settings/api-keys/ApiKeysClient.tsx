// app/[locale]/dashboard/settings/api-keys/ApiKeysClient.tsx
// Client component — gestionare chei API: listare, generare, revocare
// FEATURES: generare cheie nouă, afișare listă, revocare, warning securitate

'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  ArrowLeft,
  Key,
  Plus,
  Copy,
  Trash2,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Shield,
  Clock,
  Calendar
} from 'lucide-react'
import { ConfirmDialog } from '@/components/ui'

interface ApiKey {
  id: string
  user_id: string
  organization_id: string | null
  name: string
  key_hash: string
  key_prefix: string
  is_active: boolean
  last_used_at: string | null
  revoked_at: string | null
  revoked_by: string | null
  created_at: string
  updated_at: string
}

interface Props {
  user: User
  apiKeys: ApiKey[]
}

export default function ApiKeysClient({ user, apiKeys: initialKeys }: Props) {
  const supabase = createSupabaseBrowser()

  // State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null)

  // Generate new API key
  async function handleGenerateKey() {
    if (!newKeyName.trim()) {
      setMessage({ type: 'error', text: 'Introduceți un nume pentru cheie.' })
      return
    }

    if (newKeyName.length < 3) {
      setMessage({ type: 'error', text: 'Numele trebuie să aibă minim 3 caractere.' })
      return
    }

    setGenerating(true)
    setMessage(null)

    try {
      // Generăm o cheie aleatoare (format: sk_live_32caractere)
      const randomString = Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      const fullKey = `sk_live_${randomString}`

      // Prefix pentru afișare (primele 16 caractere)
      const keyPrefix = fullKey.substring(0, 16)

      // Hash cheie pentru stocare (SHA-256)
      const encoder = new TextEncoder()
      const data = encoder.encode(fullKey)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const keyHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

      // Salvăm în DB
      const { data: newKey, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: newKeyName.trim(),
          key_hash: keyHash,
          key_prefix: keyPrefix,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      // Adăugăm cheia nouă în listă
      setApiKeys([newKey, ...apiKeys])

      // Afișăm cheia generată (DOAR ACUM!)
      setGeneratedKey(fullKey)
      setNewKeyName('')
      setMessage({ type: 'success', text: 'Cheie API generată cu succes!' })
    } catch (error: any) {
      console.error('Error generating API key:', error)
      setMessage({ type: 'error', text: 'Eroare la generare cheie: ' + error.message })
    } finally {
      setGenerating(false)
    }
  }

  // Copy key to clipboard
  async function handleCopyKey(key: string) {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } catch (error) {
      console.error('Error copying key:', error)
    }
  }

  // Revoke API key
  async function handleRevokeKey(apiKey: ApiKey) {
    setRevoking(apiKey.id)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: user.id
        })
        .eq('id', apiKey.id)

      if (error) throw error

      // Actualizăm lista local
      setApiKeys(
        apiKeys.map((k) =>
          k.id === apiKey.id
            ? {
                ...k,
                is_active: false,
                revoked_at: new Date().toISOString(),
                revoked_by: user.id
              }
            : k
        )
      )

      setMessage({ type: 'success', text: 'Cheie revocată cu succes.' })
      setKeyToRevoke(null)
    } catch (error: any) {
      console.error('Error revoking key:', error)
      setMessage({ type: 'error', text: 'Eroare la revocare: ' + error.message })
    } finally {
      setRevoking(null)
    }
  }

  // Format date
  function formatDate(dateString: string | null) {
    if (!dateString) return 'Niciodată'
    const date = new Date(dateString)
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Close new key modal
  function handleCloseNewKeyModal() {
    setShowNewKeyModal(false)
    setGeneratedKey(null)
    setNewKeyName('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Chei API</h1>
              <p className="text-sm text-gray-500">Gestionează accesul programatic la platformă</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewKeyModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Generează cheie nouă
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* Security Warning */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Avertizare securitate</h3>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>
                  Cheile API oferă acces complet la contul dvs. Tratați-le ca pe o parolă.
                </li>
                <li>
                  Nu partajați cheile în cod sursă public, email sau aplicații de mesagerie.
                </li>
                <li>
                  Cheia completă este afișată DOAR la generare. Salvați-o într-un loc sigur.
                </li>
                <li>
                  Dacă o cheie este compromisă, revocați-o imediat și generați una nouă.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Message banner */}
        {message && (
          <div
            className={`rounded-2xl px-6 py-4 border-2 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* API Keys List */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Key className="h-5 w-5" />
              Chei active ({apiKeys.filter((k) => k.is_active).length})
            </h2>
          </div>

          {apiKeys.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nu aveți chei API create
              </h3>
              <p className="text-gray-500 mb-6">
                Creați o cheie API pentru a accesa platforma programatic
              </p>
              <button
                onClick={() => setShowNewKeyModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Generează prima cheie
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className={`p-6 ${!apiKey.is_active ? 'bg-gray-50 opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Name and status */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{apiKey.name}</h3>
                        {apiKey.is_active ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            ACTIVĂ
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                            REVOCATĂ
                          </span>
                        )}
                      </div>

                      {/* Key prefix */}
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg font-mono text-sm text-gray-700">
                          <Key className="h-4 w-4 text-gray-400" />
                          {apiKey.key_prefix}••••••••••••••••
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            <span className="font-semibold">Creată:</span>{' '}
                            {formatDate(apiKey.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            <span className="font-semibold">Ultima folosire:</span>{' '}
                            {formatDate(apiKey.last_used_at)}
                          </span>
                        </div>
                        {!apiKey.is_active && apiKey.revoked_at && (
                          <div className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            <span>
                              <span className="font-semibold">Revocată:</span>{' '}
                              {formatDate(apiKey.revoked_at)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      {apiKey.is_active && (
                        <button
                          onClick={() => setKeyToRevoke(apiKey)}
                          disabled={revoking === apiKey.id}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                          {revoking === apiKey.id ? 'Se revocă...' : 'Revocă'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            {generatedKey ? (
              // Show generated key (ONLY SHOWN ONCE!)
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">
                      Cheie generată cu succes!
                    </h2>
                    <p className="text-sm text-gray-500">Salvați cheia într-un loc sigur</p>
                  </div>
                </div>

                {/* Generated key display */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-bold mb-1">ATENȚIE: Această cheie va fi afișată doar acum!</p>
                      <p>
                        Copiați și salvați cheia într-un manager de parole sau loc sigur. Nu o veți
                        mai putea vedea după închiderea acestui dialog.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 font-mono text-sm break-all">
                      {generatedKey}
                    </div>
                    <button
                      onClick={() => handleCopyKey(generatedKey)}
                      className="absolute top-2 right-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-semibold"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copiază
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCloseNewKeyModal}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                  >
                    Am salvat cheia, închide
                  </button>
                </div>
              </div>
            ) : (
              // New key form
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-2">Generează cheie API nouă</h2>
                  <p className="text-sm text-gray-500">
                    Creați o cheie API pentru acces programatic la platformă
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nume cheie *
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Ex: Cheie producție, Cheie development"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Un nume descriptiv pentru a identifica cheia (minim 3 caractere)
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCloseNewKeyModal}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleGenerateKey}
                    disabled={generating || !newKeyName.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Key className="h-4 w-4" />
                    {generating ? 'Se generează...' : 'Generează cheie'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revoke Confirmation Dialog */}
      <ConfirmDialog
        isOpen={keyToRevoke !== null}
        title="Revocă cheie API?"
        message={keyToRevoke ? `Sunteți sigur că doriți să revocați cheia "${keyToRevoke.name}"? Această acțiune nu poate fi anulată. Aplicațiile care folosesc această cheie vor pierde accesul.` : ''}
        confirmLabel="Da, revocă cheia"
        cancelLabel="Anulează"
        onConfirm={() => keyToRevoke && handleRevokeKey(keyToRevoke)}
        onCancel={() => setKeyToRevoke(null)}
        isDestructive={true}
        loading={revoking !== null}
      />
    </div>
  )
}
