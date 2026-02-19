'use client'

import { useState } from 'react'
import { Mail, Lock, ArrowRight, Info, Eye, EyeOff } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

export function TabRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createSupabaseBrowser()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Parolele nu coincid.')
      return
    }

    if (password.length < 8) {
      setError('Parola trebuie să aibă minim 8 caractere.')
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    })

    setLoading(false)

    if (signUpError) {
      console.error('Register error:', signUpError)
      setError(
        signUpError.message.includes('already registered')
          ? 'Acest email este deja înregistrat.'
          : signUpError.message
      )
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-xl bg-secondary/60 p-6 text-center"
        style={{ animation: 'slideInRight .3s ease-out' }}
      >
        <Mail className="h-10 w-10 text-primary" />
        <h3 className="font-semibold text-foreground">Verifică-ți email-ul</h3>
        <p className="text-sm text-muted-foreground">
          Am trimis un link de confirmare la <strong>{email}</strong>. Accesează-l pentru a
          activa contul.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="text-xs font-medium text-primary hover:underline"
        >
          ← Înapoi la înregistrare
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      style={{ animation: 'slideInRight .3s ease-out' }}
    >
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-sm font-medium text-foreground">
          Email <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adresa@companie.ro"
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-pw" className="text-sm font-medium text-foreground">
          Parolă <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-pw"
            type={showPw ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minim 8 caractere"
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPw ? 'Ascunde parola' : 'Arată parola'}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-pw-confirm" className="text-sm font-medium text-foreground">
          Confirmă parola <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-pw-confirm"
            type={showPw ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetă parola"
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Terms */}
      <label className="flex cursor-pointer select-none items-start gap-2.5">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          {'Accept '}
          <a href="/termeni" className="font-medium text-primary hover:underline">
            Termenii și Condițiile
          </a>
          {' și '}
          <a href="/confidentialitate" className="font-medium text-primary hover:underline">
            Politica de Confidențialitate
          </a>
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={!terms || loading}
        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Se creează contul...' : 'Creează contul'}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>

      {/* Info */}
      <div className="flex items-start gap-2 rounded-lg bg-secondary/60 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>Vei primi un email de confirmare. Configurarea contului durează 2 minute.</span>
      </div>
    </form>
  )
}
