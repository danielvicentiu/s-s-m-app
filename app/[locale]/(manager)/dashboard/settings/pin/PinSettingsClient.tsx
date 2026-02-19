'use client'

// app/[locale]/(manager)/dashboard/settings/pin/PinSettingsClient.tsx
// PIN settings UI — set or change quick-access PIN

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, CheckCircle, Info } from 'lucide-react'

interface Props {
  hasPin: boolean
}

export default function PinSettingsClient({ hasPin }: Props) {
  const [pinSaved, setPinSaved] = useState(hasPin)
  const [showForm, setShowForm] = useState(!hasPin)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    if (!newPin || newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin)) {
      setMessage({ type: 'error', text: 'PIN-ul trebuie să aibă 4-6 cifre numerice.' })
      return
    }
    if (newPin !== confirmPin) {
      setMessage({ type: 'error', text: 'PIN-urile nu coincid. Încearcă din nou.' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/pin/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: newPin }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Eroare la salvare PIN.' })
        return
      }

      // Persist has_pin cookie — 1 year
      document.cookie = `has_pin=true; max-age=${365 * 24 * 60 * 60}; path=/; SameSite=Lax`

      setMessage({ type: 'success', text: 'PIN salvat cu succes' })
      setPinSaved(true)
      setShowForm(false)
      setNewPin('')
      setConfirmPin('')
    } catch (err) {
      console.error('PIN set error:', err)
      setMessage({ type: 'error', text: 'Eroare de conexiune. Încearcă din nou.' })
    } finally {
      setSaving(false)
    }
  }

  const openChangeForm = () => {
    setShowForm(true)
    setMessage(null)
    setNewPin('')
    setConfirmPin('')
  }

  const cancelChange = () => {
    setShowForm(false)
    setMessage(null)
    setNewPin('')
    setConfirmPin('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/dashboard/profile" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Securitate PIN</h1>
            <p className="text-sm text-gray-500">Autentificare rapidă cu PIN</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-8 space-y-6">
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

        {/* PIN card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Setări PIN rapid
          </h2>

          {/* Status: PIN active, no form */}
          {pinSaved && !showForm ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">PIN activ ✅</p>
                  <p className="text-sm text-green-700">
                    Poți folosi PIN-ul pentru autentificare rapidă la dashboard.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openChangeForm}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                <Lock className="h-4 w-4" />
                Schimbă PIN
              </button>
            </div>
          ) : (
            /* PIN form */
            <div className="space-y-4">
              {!pinSaved && (
                <p className="text-sm text-gray-600 pb-1">
                  Nu aveți PIN configurat. Setați un PIN de 4-6 cifre pentru autentificare rapidă.
                </p>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PIN nou (4-6 cifre)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={newPin}
                  onChange={e =>
                    setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmă PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={confirmPin}
                  onChange={e =>
                    setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !newPin || !confirmPin}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Se salvează...' : 'Salvează PIN'}
                </button>

                {pinSaved && (
                  <button
                    type="button"
                    onClick={cancelChange}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Anulează
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Cum funcționează PIN-ul rapid?
          </h3>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li>• Setează un PIN de 4-6 cifre pentru acces rapid la dashboard</li>
            <li>• La fiecare sesiune nouă, vei fi rugat să introduci PIN-ul</li>
            <li>• După 5 încercări greșite, accesul PIN se blochează 15 minute</li>
            <li>• Verificarea PIN rămâne activă 24 de ore</li>
            <li>• Poți oricând să te conectezi cu email dacă uiți PIN-ul</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
