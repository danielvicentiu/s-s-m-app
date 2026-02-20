'use client'

import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, Mail, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'

export function TabLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const t = useTranslations('auth.login')
  const supabase = createSupabaseBrowser()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      console.error('Login error:', signInError)
      setError(
        signInError.message === 'Invalid login credentials'
          ? t('invalidCredentials')
          : signInError.message
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  async function handleMagicLink() {
    if (!email) {
      setError(t('magicLinkEnterEmail'))
      return
    }
    setLoading(true)
    setError(null)

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })

    setLoading(false)

    if (otpError) {
      console.error('Magic link error:', otpError)
      setError(t('magicLinkError') + otpError.message)
      return
    }

    setMagicLinkSent(true)
  }

  if (magicLinkSent) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-xl bg-secondary/60 p-6 text-center"
        style={{ animation: 'slideInRight .3s ease-out' }}
      >
        <Mail className="h-10 w-10 text-primary" />
        <h3 className="font-semibold text-foreground">{t('magicLinkSentTitle')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('magicLinkSentText')} <strong>{email}</strong>. {t('magicLinkSentAccess')}
        </p>
        <button
          type="button"
          onClick={() => setMagicLinkSent(false)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {t('magicLinkBack')}
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
        <label htmlFor="login-email" className="text-sm font-medium text-foreground">
          {t('email')}
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-pw" className="text-sm font-medium text-foreground">
            {t('password')}
          </label>
          <span className="text-xs text-muted-foreground">
            {t('orUseMagicLink')}{' '}
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading}
              className="font-medium text-primary hover:underline disabled:opacity-50"
            >
              {t('magicLink')}
            </button>
          </span>
        </div>
        <div className="relative">
          <input
            id="login-pw"
            type={showPw ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder')}
            className="h-11 w-full rounded-lg border border-border bg-background px-4 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPw ? t('hidePassword') : t('showPassword')}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? t('submitting') : t('submit')}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>

      {/* MFA notice */}
      <div className="flex items-start gap-2 rounded-lg bg-secondary/60 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>{t('sessionProtected')}</span>
      </div>
    </form>
  )
}
