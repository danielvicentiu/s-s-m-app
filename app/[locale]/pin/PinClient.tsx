'use client'

// app/[locale]/pin/PinClient.tsx
// PIN entry numpad — 4-6 digit verification with lockout support

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  email: string
}

export default function PinClient({ email }: Props) {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState('')
  const submitting = useRef(false)

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) return

    const tick = () => {
      const remaining = lockedUntil - Date.now()
      if (remaining <= 0) {
        setLockedUntil(null)
        setTimeLeft('')
        setError('')
        return
      }
      const m = Math.floor(remaining / 60000)
      const s = Math.floor((remaining % 60000) / 1000)
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`)
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lockedUntil])

  const verifyPin = async (digits: string) => {
    if (submitting.current || digits.length < 4 || !!lockedUntil) return
    submitting.current = true
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin: digits }),
      })

      if (res.ok) {
        // Set pin_verified cookie — 24 hours
        document.cookie = `pin_verified=true; max-age=${24 * 60 * 60}; path=/; SameSite=Lax`
        router.replace('/dashboard')
        return
      }

      const data = await res.json()

      if (res.status === 404) {
        // No PIN set for this account
        router.replace('/login')
        return
      }

      if (res.status === 429 || res.status === 423) {
        // Locked — parse remaining minutes from error message
        const match = data.error?.match(/(\d+)\s*minut/)
        const minutes = match ? parseInt(match[1]) : 15
        setLockedUntil(Date.now() + minutes * 60 * 1000)
        setError(data.error || 'Contul PIN blocat temporar.')
        setPin('')
        return
      }

      // 401 — wrong PIN
      setError(data.error || 'PIN incorect.')
      setPin('')
    } catch (err) {
      console.error('PIN verify error:', err)
      setError('Eroare de conexiune. Încearcă din nou.')
      setPin('')
    } finally {
      setLoading(false)
      submitting.current = false
    }
  }

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (pin.length === 6 && !lockedUntil && !submitting.current) {
      verifyPin(pin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])

  const addDigit = (d: string) => {
    if (pin.length >= 6 || !!lockedUntil || loading) return
    setPin(p => p + d)
  }

  const removeDigit = () => {
    if (!loading) setPin(p => p.slice(0, -1))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xs bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">SSM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">s-s-m.ro</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-xl font-bold text-gray-900 mb-1">
          Introduceți PIN-ul
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6 truncate px-2">{email}</p>

        {/* PIN dots — 6 slots */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                i < pin.length
                  ? 'bg-blue-600 border-blue-600 scale-110'
                  : 'bg-white border-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Error / lockout display */}
        {lockedUntil ? (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-red-700">Cont blocat temporar</p>
            <p className="text-2xl font-mono font-bold text-red-600 mt-1">{timeLeft}</p>
            <p className="text-xs text-red-500 mt-1">Încearcă din nou după expirarea timerului</p>
          </div>
        ) : error ? (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <div className="mb-6 h-[68px]" />
        )}

        {/* Numpad: 1-9 then [✓, 0, ⌫] */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => addDigit(d)}
              disabled={!!lockedUntil || loading}
              className="h-14 rounded-xl text-xl font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 transition-colors select-none"
            >
              {d}
            </button>
          ))}

          {/* Confirm */}
          <button
            type="button"
            onClick={() => verifyPin(pin)}
            disabled={pin.length < 4 || loading || !!lockedUntil}
            className="h-14 rounded-xl text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 transition-colors flex items-center justify-center select-none"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          {/* 0 */}
          <button
            type="button"
            onClick={() => addDigit('0')}
            disabled={!!lockedUntil || loading}
            className="h-14 rounded-xl text-xl font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 transition-colors select-none"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={removeDigit}
            disabled={pin.length === 0 || loading}
            className="h-14 rounded-xl text-gray-600 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 transition-colors flex items-center justify-center select-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
          </button>
        </div>

        {/* Forgot PIN link */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Uitați PIN-ul? Conectați-vă cu email
          </Link>
        </div>
      </div>
    </div>
  )
}
