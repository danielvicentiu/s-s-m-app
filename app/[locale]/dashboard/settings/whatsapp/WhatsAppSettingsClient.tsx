'use client'

// app/[locale]/dashboard/settings/whatsapp/WhatsAppSettingsClient.tsx
// Client component pentru configurare notificări WhatsApp

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'

interface WhatsAppSettingsClientProps {
  userId: string
  userEmail: string
  profile: Profile | null
  preferences: Record<string, any>
}

interface NotificationPreferences {
  alert_expiry: boolean
  monthly_report: boolean
  urgent: boolean
}

export default function WhatsAppSettingsClient({
  userId,
  userEmail,
  profile,
  preferences
}: WhatsAppSettingsClientProps) {
  const supabase = createSupabaseBrowser()

  // State pentru număr telefon și verificare
  const [phone, setPhone] = useState(preferences.whatsapp_phone || profile?.phone || '')
  const [isVerified, setIsVerified] = useState(preferences.whatsapp_verified || false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // State pentru preferințe notificări
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(
    preferences.whatsapp_notifications || {
      alert_expiry: true,
      monthly_report: true,
      urgent: true
    }
  )

  // State pentru limba mesajelor
  const [messageLanguage, setMessageLanguage] = useState(
    preferences.whatsapp_language || 'ro'
  )

  // State pentru opt-in GDPR
  const [gdprConsent, setGdprConsent] = useState(
    preferences.whatsapp_opt_in || false
  )

  // State UI
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Trimitere OTP
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Introduceți un număr de telefon valid' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      // TODO: Integrare cu serviciu WhatsApp pentru trimitere OTP
      // Pentru demo, simulăm trimiterea
      await new Promise(resolve => setTimeout(resolve, 1000))

      setOtpSent(true)
      setMessage({ type: 'success', text: 'Cod de verificare trimis pe WhatsApp' })
    } catch (error) {
      console.error('Error sending OTP:', error)
      setMessage({ type: 'error', text: 'Eroare la trimiterea codului de verificare' })
    } finally {
      setIsSaving(false)
    }
  }

  // Verificare OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMessage({ type: 'error', text: 'Introduceți un cod valid de 6 cifre' })
      return
    }

    setIsVerifying(true)
    setMessage(null)

    try {
      // TODO: Verificare OTP cu serviciu WhatsApp
      // Pentru demo, orice cod corect = "123456"
      if (otp === '123456') {
        // Salvare număr verificat în baza de date
        await savePreference('whatsapp_phone', phone)
        await savePreference('whatsapp_verified', true)

        setIsVerified(true)
        setOtpSent(false)
        setOtp('')
        setMessage({ type: 'success', text: 'Număr verificat cu succes!' })
      } else {
        setMessage({ type: 'error', text: 'Cod de verificare incorect' })
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setMessage({ type: 'error', text: 'Eroare la verificarea codului' })
    } finally {
      setIsVerifying(false)
    }
  }

  // Salvare preferință în baza de date
  const savePreference = async (key: string, value: any) => {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,key'
      })

    if (error) throw error
  }

  // Salvare toate setările
  const handleSaveSettings = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      // Verificare consent GDPR pentru notificări active
      if (!gdprConsent && Object.values(notificationPrefs).some(v => v)) {
        setMessage({
          type: 'error',
          text: 'Trebuie să acceptați consimțământul GDPR pentru a activa notificările'
        })
        setIsSaving(false)
        return
      }

      // Salvare preferințe
      await savePreference('whatsapp_notifications', notificationPrefs)
      await savePreference('whatsapp_language', messageLanguage)
      await savePreference('whatsapp_opt_in', gdprConsent)

      setMessage({ type: 'success', text: 'Setări salvate cu succes' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Eroare la salvarea setărilor' })
    } finally {
      setIsSaving(false)
    }
  }

  // Opt-out complet (dezactivare toate notificările)
  const handleOptOut = async () => {
    if (!confirm('Sigur doriți să dezactivați toate notificările WhatsApp?')) {
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      await savePreference('whatsapp_notifications', {
        alert_expiry: false,
        monthly_report: false,
        urgent: false
      })
      await savePreference('whatsapp_opt_in', false)

      setNotificationPrefs({
        alert_expiry: false,
        monthly_report: false,
        urgent: false
      })
      setGdprConsent(false)

      setMessage({ type: 'success', text: 'Toate notificările WhatsApp au fost dezactivate' })
    } catch (error) {
      console.error('Error opting out:', error)
      setMessage({ type: 'error', text: 'Eroare la dezactivarea notificărilor' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Notificări WhatsApp
        </h1>
        <p className="text-gray-600">
          Configurați alertele și rapoartele primite prin WhatsApp
        </p>
      </div>

      {/* Mesaj feedback */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Card verificare număr telefon */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Număr de telefon
          </h2>
          {isVerified && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✓ Verificat
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Număr de telefon WhatsApp
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isVerified}
              placeholder="+40 7XX XXX XXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="mt-2 text-sm text-gray-500">
              Format internațional recomandat (ex: +40 722 123 456)
            </p>
          </div>

          {!isVerified && !otpSent && (
            <button
              onClick={handleSendOtp}
              disabled={isSaving || !phone}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Se trimite...' : 'Trimite cod de verificare'}
            </button>
          )}

          {otpSent && !isVerified && (
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Cod de verificare (6 cifre)
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Introduceți codul primit pe WhatsApp (demo: folosiți 123456)
                </p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying || otp.length !== 6}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isVerifying ? 'Se verifică...' : 'Verifică cod'}
              </button>

              <button
                onClick={handleSendOtp}
                disabled={isSaving}
                className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Retrimite cod
              </button>
            </div>
          )}

          {isVerified && (
            <button
              onClick={() => {
                setIsVerified(false)
                setPhone('')
                savePreference('whatsapp_verified', false)
                savePreference('whatsapp_phone', '')
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Schimbă numărul de telefon
            </button>
          )}
        </div>
      </div>

      {/* Card preferințe notificări */}
      {isVerified && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tipuri de notificări
            </h2>

            <div className="space-y-4">
              {/* Alerte expirare */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Alerte expirare</h3>
                  <p className="text-sm text-gray-500">
                    Notificări pentru examene medicale și echipamente aproape de expirare
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.alert_expiry}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, alert_expiry: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Raport lunar */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Raport lunar</h3>
                  <p className="text-sm text-gray-500">
                    Rezumat lunar al stării de conformitate și acțiuni necesare
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.monthly_report}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, monthly_report: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Notificări urgente */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Notificări urgente</h3>
                  <p className="text-sm text-gray-500">
                    Alerte critice și inspecții iminente (recomandat activat)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.urgent}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, urgent: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Card limba mesajelor */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Limba mesajelor
            </h2>

            <div className="space-y-2">
              {[
                { code: 'ro', name: 'Română', flag: '🇷🇴' },
                { code: 'en', name: 'English', flag: '🇬🇧' },
                { code: 'bg', name: 'Български', flag: '🇧🇬' },
                { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
                { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
              ].map((lang) => (
                <label
                  key={lang.code}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang.code}
                    checked={messageLanguage === lang.code}
                    onChange={(e) => setMessageLanguage(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-2xl">{lang.flag}</span>
                  <span className="ml-2 text-gray-900">{lang.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Card GDPR consent */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Consimțământ GDPR
            </h2>

            <div className="space-y-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="text-gray-900">
                    Sunt de acord să primesc notificări prin WhatsApp de la S-S-M.ro
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Prin bifarea acestei opțiuni, vă exprimați acordul explicit pentru prelucrarea
                    numărului de telefon și trimiterea de notificări automate conform Regulamentului
                    (UE) 2016/679 (GDPR). Puteți revoca oricând acest consimțământ.
                  </p>
                </div>
              </label>

              <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Informații despre prelucrarea datelor:
                </h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Numărul dvs. de telefon este stocat criptat în baza noastră de date</li>
                  <li>Mesajele sunt trimise prin API WhatsApp Business oficial</li>
                  <li>Nu partajăm datele dvs. cu terțe părți fără consimțământ</li>
                  <li>Puteți șterge numărul și dezactiva notificările oricând</li>
                  <li>Datele sunt păstrate doar cât timp sunteți utilizator activ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Butoane acțiune */}
          <div className="flex gap-4">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? 'Se salvează...' : 'Salvează setările'}
            </button>

            <button
              onClick={handleOptOut}
              disabled={isSaving}
              className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Dezactivează tot
            </button>
          </div>

          {/* Link politică confidențialitate */}
          <div className="mt-6 text-center">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Citiți Politica de confidențialitate completă
            </a>
          </div>
        </>
      )}

      {/* Mesaj dacă numărul nu este verificat */}
      {!isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            Verificați mai întâi numărul de telefon pentru a configura notificările WhatsApp
          </p>
        </div>
      )}
    </div>
  )
}
