'use client'

import { useState, useRef, useCallback } from 'react'
import { GraduationCap, ArrowRight, HelpCircle, Mail } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'

const PIN_LENGTH = 6

export function TabQuickAccess() {
  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const supabase = createSupabaseBrowser()
  const router = useRouter()

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return
      const next = [...digits]
      next[index] = value.slice(-1)
      setDigits(next)
      if (value && index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    [digits]
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    },
    [digits]
  )

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH)
    if (!text) return
    const next = Array(PIN_LENGTH).fill('')
    text.split('').forEach((ch, i) => {
      next[i] = ch
    })
    setDigits(next)
    const focusIdx = Math.min(text.length, PIN_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
  }, [])

  async function handleSubmit() {
    if (!email) {
      setError('Introdu adresa de email.')
      return
    }

    const pin = digits.join('')
    if (pin.length !== PIN_LENGTH) {
      setError(`Introdu toate cele ${PIN_LENGTH} cifre ale PIN-ului.`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), pin }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Eroare autentificare PIN.')
        setLoading(false)
        return
      }

      // Folosim token_hash pentru a crea sesiunea
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: data.token_hash,
        type: 'email',
      })

      if (verifyError) {
        console.error('PIN verifyOtp error:', verifyError)
        setError('Eroare activare sesiune. Încearcă din nou.')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      console.error('PIN submit error:', err)
      setError('Eroare de rețea. Verifică conexiunea.')
      setLoading(false)
    }
  }

  const isFilled = digits.every((d) => d !== '') && email.length > 0

  return (
    <div
      className="flex flex-col items-center gap-6 text-center"
      style={{ animation: 'slideInRight .3s ease-out' }}
    >
      {/* Title */}
      <div>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Acces rapid</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Re-autentificare rapidă cu PIN pentru angajați
        </p>
      </div>

      {error && (
        <div className="w-full rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="flex w-full flex-col gap-1.5 text-left">
        <label htmlFor="pin-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="pin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adresa@companie.ro"
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* PIN inputs */}
      <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`Cifra ${i + 1} din ${PIN_LENGTH}`}
            className="h-14 w-12 rounded-lg border-2 border-border bg-background text-center text-xl font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        ))}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFilled || loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Se verifică...' : 'Intră în platformă'}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>

      {/* Help text */}
      <p className="text-xs text-muted-foreground/70">
        PIN-ul a fost primit de la angajatorul tău sau de la responsabilul SSM
      </p>

      {/* Contact admin link */}
      <a
        href="#"
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        Nu ai PIN? Contactează administratorul companiei.
      </a>
    </div>
  )
}
