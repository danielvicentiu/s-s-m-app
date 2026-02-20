// app/[locale]/dashboard/profile/ProfileClient.tsx
// Client component — profil utilizator cu upload avatar, editare date, preferințe
// FEATURES: avatar upload, nume, email, telefon, limba, timezone, notificări, schimbă parola

'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowLeft, Upload, Save, Camera, Bell, Globe, Clock, Lock, Mail, Phone, User as UserIcon } from 'lucide-react'

interface Props {
  user: User
  profile: any
  preferences: Record<string, any>
}

export default function ProfileClient({ user, profile, preferences }: Props) {
  const t = useTranslations('profile')
  const supabase = createSupabaseBrowser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [locale, setLocale] = useState(preferences.preferred_locale || 'ro')
  const [timezone, setTimezone] = useState(preferences.timezone || 'Europe/Bucharest')
  const [emailNotifications, setEmailNotifications] = useState(preferences.email_notifications !== false)
  const [pushNotifications, setPushNotifications] = useState(preferences.push_notifications !== false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [changingPassword, setChangingPassword] = useState(false)

  // Avatar upload handler
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validare tip fișier
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: t('selectImageFile') })
      return
    }

    // Validare dimensiune max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: t('imageTooLarge') })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      // Upload în Supabase Storage bucket "avatars"
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile cu noul avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      setMessage({ type: 'success', text: t('avatarUpdated') })
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      setMessage({ type: 'error', text: t('avatarError') + ': ' + error.message })
    } finally {
      setUploading(false)
    }
  }

  // Save profile data
  async function handleSaveProfile() {
    setSaving(true)
    setMessage(null)

    try {
      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Update preferences in user_preferences table
      const prefsToSave = [
        { key: 'preferred_locale', value: locale },
        { key: 'timezone', value: timezone },
        { key: 'email_notifications', value: emailNotifications },
        { key: 'push_notifications', value: pushNotifications }
      ]

      for (const pref of prefsToSave) {
        await supabase.from('user_preferences').upsert(
          {
            user_id: user.id,
            key: pref.key,
            value: JSON.stringify(pref.value),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,key' }
        )
      }

      setMessage({ type: 'success', text: t('profileUpdated') })

      // Reload după 1.5s pentru a aplica preferințele noi
      setTimeout(() => window.location.reload(), 1500)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: t('saveError') + ': ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  // Change password
  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsMismatch') })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: t('passwordTooShort') })
      return
    }

    setChangingPassword(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage({ type: 'success', text: t('passwordChanged') })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      console.error('Error changing password:', error)
      setMessage({ type: 'error', text: t('changePasswordError') + ': ' + error.message })
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{t('title')}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8 space-y-6">
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

        {/* Avatar section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {t('profilePhoto')}
          </h2>
          <div className="flex items-center gap-6">
            {/* Avatar display */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-black border-4 border-gray-100">
                  {fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Upload button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4" />
                {uploading ? t('uploading') : t('uploadImage')}
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Imagini JPG, PNG sau GIF. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Personal info section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {t('personalInfo')}
          </h2>
          <div className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Ion Popescu"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('emailReadOnly')}
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +40 712 345 678"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Preferences section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('preferences')}
          </h2>
          <div className="space-y-4">
            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('preferredLanguage')}
              </label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="ro">🇷🇴 Română</option>
                <option value="en">🇬🇧 English</option>
                <option value="bg">🇧🇬 Български</option>
                <option value="hu">🇭🇺 Magyar</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('timezone')}
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="Europe/Bucharest">{t('tzBucharest')}</option>
                <option value="Europe/Sofia">{t('tzSofia')}</option>
                <option value="Europe/Budapest">{t('tzBudapest')}</option>
                <option value="Europe/Berlin">{t('tzBerlin')}</option>
                <option value="Europe/Warsaw">{t('tzWarsaw')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications')}
          </h2>
          <div className="space-y-4">
            {/* Email notifications */}
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <div>
                <div className="font-semibold text-gray-900">{t('emailNotifications')}</div>
                <div className="text-sm text-gray-500">
                  {t('emailNotificationsDesc')}
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    emailNotifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </label>

            {/* Push notifications */}
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <div>
                <div className="font-semibold text-gray-900">{t('pushNotifications')}</div>
                <div className="text-sm text-gray-500">
                  {t('pushNotificationsDesc')}
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    pushNotifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? t('saving') : t('saveChanges')}
          </button>
        </div>

        {/* Change password section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('changePassword')}
          </h2>
          <div className="space-y-4">
            {/* Current password - optional, some auth systems don't require it */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('currentPassword')}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* New password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('newPassword')}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minim 8 caractere"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('confirmNewPassword')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetă parola nouă"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={changingPassword || !newPassword || !confirmPassword}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword ? t('changingPassword') : t('changePassword')}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
