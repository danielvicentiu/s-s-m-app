'use client'

// app/[locale]/otp/OTPClient.tsx
// Full OTP verification UI
// Step 1: Phone (masked) + channel selector (WhatsApp recommended, SMS, Voice)
// Step 2: 6-digit code input + countdown timer + remember device checkbox
// Step 3: Success redirect to dashboard

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield,
  MessageCircle,
  Phone,
  Smartphone,
  Mail,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import type { OTPChannel } from '@/lib/otp/types'

interface Props {
  maskedPhone: string
  rawPhone: string
  userEmail: string
}

type Step = 'select' | 'verify' | 'success'

const OTP_EXPIRY_SECONDS = 600 // 10 minutes

const CHANNELS: {
  id: OTPChannel
  label: string
  description: string
  icon: React.ReactNode
  recommended?: boolean
}[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: 'Cod prin mesaj WhatsApp',
    icon: <MessageCircle className="h-5 w-5" />,
    recommended: true,
  },
  {
    id: 'sms',
    label: 'SMS',
    description: 'Cod prin mesaj text',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    id: 'voice',
    label: 'Apel vocal',
    description: 'Cod citit prin apel telefonic',
    icon: <Phone className="h-5 w-5" />,
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Cod prin email',
    icon: <Mail className="h-5 w-5" />,
  },
]

export default function OTPClient({ maskedPhone, rawPhone, userEmail }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('select')
  const [channel, setChannel] = useState<OTPChannel>('whatsapp')
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [trustDevice, setTrustDevice] = useState(false)
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resendRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown timer when on verify step
  useEffect(() => {
    if (step !== 'verify') return
    setCountdown(OTP_EXPIRY_SECONDS)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [step])

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleSend = useCallback(async () => {
    const phone = rawPhone || userEmail
    if (!phone) {
      setError('Niciun număr de telefon configurat în profil.')
      return
    }

    setSending(true)
    setError(null)

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, channel }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Eroare la trimiterea codului.')
        return
      }

      setStep('verify')
      setDigits(['', '', '', '', '', ''])
      setResendCooldown(60)
      resendRef.current = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(resendRef.current!)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch {
      setError('Eroare de conexiune. Încearcă din nou.')
    } finally {
      setSending(false)
    }
  }, [rawPhone, userEmail, channel])

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newDigits = [...digits]
    pasted.split('').forEach((d, i) => {
      if (i < 6) newDigits[i] = d
    })
    setDigits(newDigits)
    const nextEmpty = newDigits.findIndex(d => !d)
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus()
  }

  const handleVerify = useCallback(async () => {
    const code = digits.join('')
    if (code.length !== 6) {
      setError('Introduceți toate cele 6 cifre.')
      return
    }

    const phone = rawPhone || userEmail
    setVerifying(true)
    setError(null)

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, trustDevice }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Cod invalid.')
        return
      }

      setStep('success')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch {
      setError('Eroare de conexiune. Încearcă din nou.')
    } finally {
      setVerifying(false)
    }
  }, [digits, rawPhone, userEmail, trustDevice, router])

  // Auto-verify when all 6 digits filled
  useEffect(() => {
    if (digits.every(d => d !== '') && step === 'verify') {
      handleVerify()
    }
  }, [digits, step, handleVerify])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Verificare identitate</h1>
          <p className="text-sm text-gray-500 mt-1">s-s-m.ro — Securitate SSM & PSI</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* ── Step 1: Select channel ── */}
        {step === 'select' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Trimite cod de verificare</h2>
              {maskedPhone && maskedPhone !== '—' ? (
                <p className="text-sm text-gray-500 mt-1">
                  La numărul <span className="font-semibold text-gray-700">{maskedPhone}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  Email: <span className="font-semibold text-gray-700">{userEmail}</span>
                </p>
              )}
            </div>

            {/* Channel selector */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Alege metoda de primire:</p>
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChannel(ch.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 text-left transition ${
                    channel === ch.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`${channel === ch.id ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {ch.icon}
                  </span>
                  <div className="flex-1">
                    <span className={`font-semibold text-sm ${channel === ch.id ? 'text-blue-900' : 'text-gray-800'}`}>
                      {ch.label}
                      {ch.recommended && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                          Recomandat
                        </span>
                      )}
                    </span>
                    <p className={`text-xs ${channel === ch.id ? 'text-blue-700' : 'text-gray-500'}`}>
                      {ch.description}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      channel === ch.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Se trimite...
                </>
              ) : (
                'Trimite cod'
              )}
            </button>
          </div>
        )}

        {/* ── Step 2: Enter code ── */}
        {step === 'verify' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Introdu codul</h2>
              <p className="text-sm text-gray-500 mt-1">
                Am trimis un cod de 6 cifre prin{' '}
                <span className="font-semibold capitalize">{channel}</span>
                {maskedPhone && maskedPhone !== '—' && (
                  <> la <span className="font-semibold">{maskedPhone}</span></>
                )}
              </p>
            </div>

            {/* 6-digit input */}
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                  disabled={verifying}
                />
              ))}
            </div>

            {/* Countdown */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Codul expiră în{' '}
                  <span className={`font-semibold ${countdown < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                    {formatTime(countdown)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-semibold">Codul a expirat.</p>
              )}
            </div>

            {/* Remember device */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={trustDevice}
                onChange={e => setTrustDevice(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Nu mai cere verificare pe acest dispozitiv timp de 30 de zile
              </span>
            </label>

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying || digits.join('').length !== 6}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Se verifică...
                </>
              ) : (
                'Verifică codul'
              )}
            </button>

            {/* Resend / back */}
            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep('select')
                  setDigits(['', '', '', '', '', ''])
                  setError(null)
                }}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                Schimbă metoda
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={resendCooldown > 0 || sending}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {resendCooldown > 0 ? `Retrimite în ${resendCooldown}s` : 'Retrimite cod'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Success ── */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Identitate verificată</h2>
            <p className="text-sm text-gray-500">
              Vă redirecționăm către dashboard...
            </p>
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  )
}
