// app/[locale]/dashboard/settings/SettingsClient.tsx
// Client component — setări organizație editabile
// FEATURES: nume, CUI, adresă, telefon, email, logo upload, module active, limba, timezone

'use client'

import { useState, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Organization } from '@/lib/types'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  Upload,
  Globe,
  Clock,
  Settings,
  FileText,
  Users,
  HardHat,
  ClipboardCheck,
  AlertTriangle,
  FileWarning
} from 'lucide-react'

interface Props {
  organization: Organization
  organizationSettings: any
  userEmail: string
}

// Module disponibile în platformă
const AVAILABLE_MODULES = [
  { key: 'medical', label: 'Medicina Muncii', icon: FileText, description: 'Gestionare examene medicale și expirări' },
  { key: 'equipment', label: 'Echipamente PSI', icon: AlertTriangle, description: 'Evidență stingătoare, hidranți, echipamente' },
  { key: 'training', label: 'Instruiri SSM', icon: ClipboardCheck, description: 'Planificare și urmărire instruiri' },
  { key: 'employees', label: 'Angajați', icon: Users, description: 'Baza de date angajați' },
  { key: 'documents', label: 'Documente', icon: FileWarning, description: 'Generare și stocare documente' },
  { key: 'alerts', label: 'Alerte', icon: AlertTriangle, description: 'Notificări și alerte automate' }
]

export default function SettingsClient({ organization, organizationSettings, userEmail }: Props) {
  const supabase = createSupabaseBrowser()
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Form state - date organizație
  const [name, setName] = useState(organization.name || '')
  const [cui, setCui] = useState(organization.cui || '')
  const [address, setAddress] = useState(organization.address || '')
  const [county, setCounty] = useState(organization.county || '')
  const [contactEmail, setContactEmail] = useState(organization.contact_email || '')
  const [contactPhone, setContactPhone] = useState(organization.contact_phone || '')
  const [logoUrl, setLogoUrl] = useState(organizationSettings.logo_url || '')

  // Settings state
  const [defaultLocale, setDefaultLocale] = useState(organizationSettings.default_locale || 'ro')
  const [timezone, setTimezone] = useState(organizationSettings.timezone || 'Europe/Bucharest')
  const [activeModules, setActiveModules] = useState<string[]>(
    organizationSettings.active_modules || ['medical', 'equipment', 'training', 'employees', 'alerts']
  )

  // UI state
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Logo upload handler
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validare tip fișier
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Vă rugăm să selectați un fișier imagine.' })
      return
    }

    // Validare dimensiune max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Imaginea nu poate depăși 5MB.' })
      return
    }

    setUploadingLogo(true)
    setMessage(null)

    try {
      // Upload în Supabase Storage bucket "organization-logos"
      const fileExt = file.name.split('.').pop()
      const fileName = `${organization.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('organization-logos')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('organization-logos')
        .getPublicUrl(filePath)

      setLogoUrl(publicUrl)
      setMessage({ type: 'success', text: 'Logo încărcat cu succes! Salvați modificările pentru a confirma.' })
    } catch (error: any) {
      console.error('Error uploading logo:', error)
      setMessage({ type: 'error', text: 'Eroare la încărcare logo: ' + error.message })
    } finally {
      setUploadingLogo(false)
    }
  }

  // Toggle module active
  function toggleModule(moduleKey: string) {
    setActiveModules((prev) =>
      prev.includes(moduleKey)
        ? prev.filter((m) => m !== moduleKey)
        : [...prev, moduleKey]
    )
  }

  // Save all settings
  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      // Update organizations table
      const { error: orgError } = await supabase
        .from('organizations')
        .update({
          name,
          cui,
          address,
          county,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          updated_at: new Date().toISOString()
        })
        .eq('id', organization.id)

      if (orgError) throw orgError

      // Update organization_settings table (upsert)
      const { error: settingsError } = await supabase
        .from('organization_settings')
        .upsert(
          {
            organization_id: organization.id,
            logo_url: logoUrl,
            default_locale: defaultLocale,
            timezone,
            active_modules: activeModules,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'organization_id' }
        )

      if (settingsError) throw settingsError

      setMessage({ type: 'success', text: 'Setările au fost salvate cu succes!' })

      // Reload după 2s pentru a reflecta modificările
      setTimeout(() => window.location.reload(), 2000)
    } catch (error: any) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Eroare la salvare: ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Setări Organizație</h1>
            <p className="text-sm text-gray-500">{organization.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
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

        {/* Logo section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Logo organizație
          </h2>
          <div className="flex items-center gap-6">
            {/* Logo display */}
            <div className="relative">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo organizație"
                  className="w-32 h-32 rounded-xl object-contain border-2 border-gray-200 bg-white p-2"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-black border-2 border-gray-200">
                  {name?.charAt(0)?.toUpperCase() || 'O'}
                </div>
              )}
              {uploadingLogo && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Upload button */}
            <div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4" />
                {uploadingLogo ? 'Se încarcă...' : 'Încarcă logo'}
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Imagini JPG, PNG sau GIF. Max 5MB. Recomandare: 512x512px
              </p>
            </div>
          </div>
        </div>

        {/* Company info section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Date firmă
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nume firmă */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nume firmă <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: S.C. EXAMPLE S.R.L."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            {/* CUI */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CUI / CIF
              </label>
              <input
                type="text"
                value={cui}
                onChange={(e) => setCui(e.target.value)}
                placeholder="Ex: RO12345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Județ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Județ
              </label>
              <input
                type="text"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="Ex: București"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Adresă */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresă completă
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Str. Exemplu nr. 123, Sector 1, București"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Email contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email contact
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Ex: office@example.ro"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Telefon contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon contact
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Ex: +40 21 123 4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Preferences section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferințe regionale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Limba default */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Limba implicită
              </label>
              <select
                value={defaultLocale}
                onChange={(e) => setDefaultLocale(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="ro">🇷🇴 Română</option>
                <option value="en">🇬🇧 English</option>
                <option value="bg">🇧🇬 Български</option>
                <option value="hu">🇭🇺 Magyar</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                Limba folosită pentru rapoarte și documente generate
              </p>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Fus orar
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="Europe/Bucharest">București (GMT+2)</option>
                <option value="Europe/Sofia">Sofia (GMT+2)</option>
                <option value="Europe/Budapest">Budapesta (GMT+1)</option>
                <option value="Europe/Berlin">Berlin (GMT+1)</option>
                <option value="Europe/Warsaw">Varșovia (GMT+1)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                Folosit pentru afișarea datelor și alerte
              </p>
            </div>
          </div>
        </div>

        {/* Active modules section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HardHat className="h-5 w-5" />
            Module active
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Selectați modulele pe care doriți să le utilizați în platformă. Modulele dezactivate nu vor fi vizibile în meniu.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_MODULES.map((module) => {
              const Icon = module.icon
              const isActive = activeModules.includes(module.key)

              return (
                <label
                  key={module.key}
                  className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                    isActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleModule(module.key)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      <Icon className="h-5 w-5 text-blue-600" />
                      {module.label}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            Anulează
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !name}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Se salvează...' : 'Salvează modificările'}
          </button>
        </div>

        {/* Info footer */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-sm text-blue-800">
            <strong>Notă:</strong> Modificările vor fi aplicate imediat pentru toți utilizatorii din organizație.
            Asigurați-vă că datele introduse sunt corecte înainte de salvare.
          </p>
        </div>
      </main>
    </div>
  )
}
