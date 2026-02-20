'use client'

// app/[locale]/(manager)/dashboard/settings/security/SecurityClient.tsx
// Security settings UI:
// - TOTP authenticator app setup with QR code
// - Trusted devices list with revoke buttons
// - OTP preferences summary
// All text in Romanian

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  Shield,
  Smartphone,
  QrCode,
  CheckCircle,
  AlertCircle,
  Trash2,
  Loader2,
  Info,
  Key,
  MonitorSmartphone,
} from 'lucide-react'

interface TrustedDevice {
  id: string
  device_name: string | null
  trusted_until: string
  created_at: string
  last_seen_at: string | null
}

interface Props {
  userEmail: string
  totpEnabled: boolean
  trustedDevices: TrustedDevice[]
}

type TOTPStep = 'idle' | 'setup' | 'confirm' | 'done'

export default function SecurityClient({ userEmail, totpEnabled, trustedDevices: initialDevices }: Props) {
  const t = useTranslations('security')
  const [totpStep, setTotpStep] = useState<TOTPStep>(totpEnabled ? 'done' : 'idle')
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [otpauthUri, setOtpauthUri] = useState<string>('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verifyCode, setVerifyCode] = useState('')
  const [devices, setDevices] = useState<TrustedDevice[]>(initialDevices)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  // Generate QR code from otpauth URI using qrcode library (browser-compatible)
  useEffect(() => {
    if (!otpauthUri) return

    import('qrcode').then(QRCode => {
      QRCode.toDataURL(otpauthUri, { width: 256, margin: 2 }).then(url => {
        setQrDataUrl(url)
      }).catch(err => {
        console.error('QR code generation error:', err)
      })
    }).catch(err => {
      console.error('qrcode import error:', err)
    })
  }, [otpauthUri])

  const handleStartTOTPSetup = useCallback(async () => {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/otp/totp/setup', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || t('errorTOTPSetup') })
        return
      }

      setOtpauthUri(data.uri)
      setBackupCodes(data.backupCodes || [])
      setTotpStep('setup')
    } catch {
      setMessage({ type: 'error', text: t('errorConnection') })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleVerifyTOTP = useCallback(async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setMessage({ type: 'error', text: t('errorEnterCode') })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/otp/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || t('errorInvalidCode') })
        return
      }

      setTotpStep('done')
      setMessage({ type: 'success', text: t('successTOTPActivated') })
      setVerifyCode('')
    } catch {
      setMessage({ type: 'error', text: t('errorConnection') })
    } finally {
      setLoading(false)
    }
  }, [verifyCode])

  const handleRevokeDevice = useCallback(async (deviceId: string) => {
    setRevokingId(deviceId)
    setMessage(null)

    try {
      const res = await fetch('/api/otp/devices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setMessage({ type: 'error', text: data.error || t('errorRevoke') })
        return
      }

      setDevices(prev => prev.filter(d => d.id !== deviceId))
      setMessage({ type: 'success', text: t('successDeviceRevoked') })
    } catch {
      setMessage({ type: 'error', text: t('errorConnection') })
    } finally {
      setRevokingId(null)
    }
  }, [])

  const handleRevokeAll = useCallback(async () => {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/otp/devices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setMessage({ type: 'error', text: t('errorRevoke') })
        return
      }

      setDevices([])
      setMessage({ type: 'success', text: t('successAllRevoked') })
    } catch {
      setMessage({ type: 'error', text: t('errorConnection') })
    } finally {
      setLoading(false)
    }
  }, [])

  function formatDate(iso: string | null): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  function isExpired(trustedUntil: string): boolean {
    return new Date(trustedUntil) < new Date()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/dashboard/profile" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{t('pageTitle')}</h1>
            <p className="text-sm text-gray-500">{t('pageSubtitle')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-8 space-y-6">
        {/* Message banner */}
        {message && (
          <div
            className={`flex items-center gap-3 rounded-2xl px-6 py-4 border-2 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* ── TOTP Setup Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {t('totpSectionTitle')}
          </h2>

          {totpStep === 'idle' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t('totpIdleDesc')}
              </p>
              <button
                type="button"
                onClick={handleStartTOTPSetup}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                {t('configureAuthenticator')}
              </button>
            </div>
          )}

          {totpStep === 'setup' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">{t('step1Title')}</p>
                <p className="text-sm text-gray-500">
                  {t('step1Desc')}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-4">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code TOTP"
                    width={200}
                    height={200}
                    className="rounded-xl border border-gray-200 p-2"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-100 rounded-xl flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  </div>
                )}

                {/* Manual entry link */}
                {otpauthUri && (
                  <details className="text-xs text-gray-500 text-center">
                    <summary className="cursor-pointer hover:text-gray-700">
                      {t('cantScan')}
                    </summary>
                    <code className="block mt-2 p-2 bg-gray-100 rounded-lg break-all text-gray-700 text-xs">
                      {otpauthUri}
                    </code>
                  </details>
                )}
              </div>

              {/* Backup codes */}
              {backupCodes.length > 0 && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">{t('backupCodesTitle')}</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        {t('backupCodesDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {backupCodes.map((code, i) => (
                      <code
                        key={i}
                        className="text-sm font-mono bg-white rounded-lg px-3 py-1.5 text-gray-800 border border-amber-200 text-center"
                      >
                        {code}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Verify step */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-700">
                  {t('step2Title')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('step2Desc')}
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-36 px-4 py-2.5 text-center text-lg font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyTOTP}
                    disabled={loading || verifyCode.length !== 6}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t('verify')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {totpStep === 'done' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">{t('totpActive')}</p>
                  <p className="text-sm text-green-700">
                    {t('totpActiveDesc')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTotpStep('idle')
                  setOtpauthUri('')
                  setQrDataUrl('')
                  setBackupCodes([])
                  setVerifyCode('')
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
              >
                {t('reconfigureAuthenticator')}
              </button>
            </div>
          )}
        </div>

        {/* ── Trusted Devices Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MonitorSmartphone className="h-5 w-5" />
              {t('trustedDevicesTitle')}
            </h2>
            {devices.length > 0 && (
              <button
                type="button"
                onClick={handleRevokeAll}
                disabled={loading}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition disabled:opacity-50"
              >
                {t('revokeAll')}
              </button>
            )}
          </div>

          {devices.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Smartphone className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">{t('noDevices')}</p>
              <p className="text-gray-400 text-xs mt-1">
                {t('noDevicesHint')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {devices.map(device => {
                const expired = isExpired(device.trusted_until)
                return (
                  <div key={device.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${expired ? 'bg-gray-100' : 'bg-blue-50'}`}
                      >
                        <Smartphone className={`h-4 w-4 ${expired ? 'text-gray-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {device.device_name || t('unknownDevice')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {expired ? (
                            <span className="text-red-500">{t('expired')}</span>
                          ) : (
                            <>{t('validUntil')}: {formatDate(device.trusted_until)}</>
                          )}
                          {device.last_seen_at && (
                            <> · {t('lastSeen')}: {formatDate(device.last_seen_at)}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRevokeDevice(device.id)}
                      disabled={revokingId === device.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40 flex-shrink-0"
                      title={t('revokeDevice')}
                    >
                      {revokingId === device.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Info Card ── */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t('infoTitle')}
          </h3>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li>• {t('infoItem1')}</li>
            <li>• {t('infoItem2')}</li>
            <li>• {t('infoItem3')}</li>
            <li>• {t('infoItem4')}</li>
            <li>• {t('infoAccount')}: <span className="font-semibold">{userEmail}</span></li>
          </ul>
        </div>
      </main>
    </div>
  )
}
