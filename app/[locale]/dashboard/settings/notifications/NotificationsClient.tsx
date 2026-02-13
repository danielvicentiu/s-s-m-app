// app/[locale]/dashboard/settings/notifications/NotificationsClient.tsx
// Client component — preferințe notificări detaliate per tip

'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowLeft, Bell, Mail, Smartphone, MessageSquare, Save, Clock } from 'lucide-react'

interface NotificationPreference {
  id: string
  user_id: string
  notification_type: 'instruire' | 'medical' | 'echipament' | 'document' | 'system'
  email_enabled: boolean
  in_app_enabled: boolean
  push_enabled: boolean
  frequency: 'imediat' | 'zilnic_digest' | 'saptamanal'
  created_at: string
  updated_at: string
}

interface Props {
  user: User
  preferences: NotificationPreference[]
}

// Configurație tipuri notificări cu labels și icons
const NOTIFICATION_TYPES = [
  {
    type: 'instruire' as const,
    label: 'Instruiri SSM',
    description: 'Notificări pentru scadențe instruiri și sesiuni noi',
    icon: '📚',
    color: 'blue'
  },
  {
    type: 'medical' as const,
    label: 'Control medical',
    description: 'Alerte pentru examene medicale expirate sau aproape de expirare',
    icon: '🏥',
    color: 'red'
  },
  {
    type: 'echipament' as const,
    label: 'Echipamente PSI',
    description: 'Verificări echipamente și revizii tehnice',
    icon: '🧯',
    color: 'orange'
  },
  {
    type: 'document' as const,
    label: 'Documente',
    description: 'Documente generate, aprobări necesare, rapoarte noi',
    icon: '📄',
    color: 'green'
  },
  {
    type: 'system' as const,
    label: 'Sistem',
    description: 'Actualizări platformă, anunțuri importante, alertă securitate',
    icon: '⚙️',
    color: 'gray'
  }
]

const FREQUENCY_OPTIONS = [
  { value: 'imediat' as const, label: 'Imediat', description: 'Primește notificări instant' },
  { value: 'zilnic_digest' as const, label: 'Rezumat zilnic', description: 'O notificare pe zi cu toate alertele' },
  { value: 'saptamanal' as const, label: 'Rezumat săptămânal', description: 'Un raport săptămânal cu toate alertele' }
]

export default function NotificationsClient({ user, preferences }: Props) {
  const supabase = createSupabaseBrowser()

  // State pentru preferințe — map per tip notificare
  const [prefs, setPrefs] = useState<Map<string, NotificationPreference>>(() => {
    const map = new Map<string, NotificationPreference>()
    preferences.forEach(pref => map.set(pref.notification_type, pref))
    return map
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Toggle handler pentru canal specific (email, in-app, push)
  function toggleChannel(notifType: string, channel: 'email' | 'in_app' | 'push') {
    setPrefs(prev => {
      const newMap = new Map(prev)
      const current = newMap.get(notifType)
      if (current) {
        newMap.set(notifType, {
          ...current,
          [`${channel}_enabled`]: !current[`${channel}_enabled` as keyof NotificationPreference]
        } as NotificationPreference)
      }
      return newMap
    })
  }

  // Handler pentru schimbare frecvență
  function changeFrequency(notifType: string, frequency: 'imediat' | 'zilnic_digest' | 'saptamanal') {
    setPrefs(prev => {
      const newMap = new Map(prev)
      const current = newMap.get(notifType)
      if (current) {
        newMap.set(notifType, { ...current, frequency })
      }
      return newMap
    })
  }

  // Save all preferences to Supabase
  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      // Upsert toate preferințele
      const prefsArray = Array.from(prefs.values())
      const { error } = await supabase
        .from('notification_preferences')
        .upsert(
          prefsArray.map(pref => ({
            user_id: user.id,
            notification_type: pref.notification_type,
            email_enabled: pref.email_enabled,
            in_app_enabled: pref.in_app_enabled,
            push_enabled: pref.push_enabled,
            frequency: pref.frequency,
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'user_id,notification_type' }
        )

      if (error) throw error

      setMessage({ type: 'success', text: 'Preferințele au fost salvate cu succes!' })

      // Auto-dismiss după 3s
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      console.error('Error saving notification preferences:', error)
      setMessage({ type: 'error', text: 'Eroare la salvare: ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  // Componenta toggle switch reusabilă
  function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-label={enabled ? 'Activat' : 'Dezactivat'}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            enabled ? 'left-6' : 'left-0.5'
          }`}
        />
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Preferințe notificări</h1>
            <p className="text-sm text-gray-500">
              Configurează ce notificări primești și cum vrei să fii anunțat
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-8 space-y-6">
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

        {/* Info card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <Bell className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Personalizează notificările tale</h3>
              <p className="text-sm text-blue-700">
                Pentru fiecare tip de notificare poți alege canalele de comunicare (email, in-app, push)
                și frecvența cu care vrei să primești alertele (imediat, rezumat zilnic sau săptămânal).
              </p>
            </div>
          </div>
        </div>

        {/* Notificări per tip */}
        {NOTIFICATION_TYPES.map(({ type, label, description, icon, color }) => {
          const pref = prefs.get(type) || {
            notification_type: type,
            email_enabled: true,
            in_app_enabled: true,
            push_enabled: true,
            frequency: 'imediat' as const,
            user_id: user.id,
            id: '',
            created_at: '',
            updated_at: ''
          }

          return (
            <div key={type} className="bg-white rounded-2xl border border-gray-200 p-8">
              {/* Header tip notificare */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="text-4xl">{icon}</div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{label}</h2>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>

              {/* Canale notificare */}
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Canale de comunicare
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Email */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Email</div>
                        <div className="text-xs text-gray-500">Primește pe email</div>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={pref.email_enabled}
                      onToggle={() => toggleChannel(type, 'email')}
                    />
                  </div>

                  {/* In-App */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">In-App</div>
                        <div className="text-xs text-gray-500">În platformă</div>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={pref.in_app_enabled}
                      onToggle={() => toggleChannel(type, 'in_app')}
                    />
                  </div>

                  {/* Push */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Push</div>
                        <div className="text-xs text-gray-500">Browser/mobil</div>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={pref.push_enabled}
                      onToggle={() => toggleChannel(type, 'push')}
                    />
                  </div>
                </div>
              </div>

              {/* Frecvență */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Frecvență notificări
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {FREQUENCY_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => changeFrequency(type, option.value)}
                      className={`p-4 rounded-xl border-2 text-left transition ${
                        pref.frequency === option.value
                          ? 'bg-blue-50 border-blue-600'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`font-semibold text-sm mb-1 ${
                          pref.frequency === option.value ? 'text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {option.label}
                      </div>
                      <div
                        className={`text-xs ${
                          pref.frequency === option.value ? 'text-blue-700' : 'text-gray-500'
                        }`}
                      >
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        {/* Save button */}
        <div className="flex justify-end sticky bottom-8 z-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Se salvează...' : 'Salvează preferințele'}
          </button>
        </div>
      </main>
    </div>
  )
}
