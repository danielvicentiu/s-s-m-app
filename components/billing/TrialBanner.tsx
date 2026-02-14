// components/billing/TrialBanner.tsx
// Banner care afișează statusul perioadei de probă și alertează utilizatorii
// Data: 14 Februarie 2026

'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, Clock, Zap } from 'lucide-react'
import Link from 'next/link'

// ========== TYPES ==========

interface TrialBannerProps {
  trialEndDate: string | null
  organizationId: string
  className?: string
}

type BannerState = 'hidden' | 'warning' | 'critical' | 'expired'

// ========== CONSTANTS ==========

const COOKIE_NAME = 'trial_banner_dismissed'
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

// ========== COMPONENT ==========

export default function TrialBanner({
  trialEndDate,
  organizationId,
  className = ''
}: TrialBannerProps) {
  const [bannerState, setBannerState] = useState<BannerState>('hidden')
  const [daysRemaining, setDaysRemaining] = useState<number>(0)
  const [isDismissed, setIsDismissed] = useState<boolean>(false)

  // ========== EFFECTS ==========

  useEffect(() => {
    if (!trialEndDate) {
      setBannerState('hidden')
      return
    }

    // Verifică dacă banner-ul a fost dismissed în ultimele 24h
    const dismissed = getCookie(COOKIE_NAME)
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      const now = Date.now()

      if (now - dismissedAt < DISMISS_DURATION_MS) {
        setIsDismissed(true)
        return
      } else {
        // Cookie-ul a expirat, șterge-l
        deleteCookie(COOKIE_NAME)
      }
    }

    // Calculează zile rămase
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const endDate = new Date(trialEndDate)
    endDate.setHours(0, 0, 0, 0)

    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    setDaysRemaining(diffDays)

    // Determină starea banner-ului
    if (diffDays < 0) {
      setBannerState('expired')
    } else if (diffDays <= 3) {
      setBannerState('critical')
    } else if (diffDays <= 14) {
      setBannerState('warning')
    } else {
      setBannerState('hidden')
    }
  }, [trialEndDate])

  // ========== HANDLERS ==========

  function handleDismiss() {
    if (bannerState === 'expired') {
      // Nu permite dismiss pentru expired
      return
    }

    // Salvează timestamp în cookie
    setCookie(COOKIE_NAME, Date.now().toString(), 1) // 1 zi
    setIsDismissed(true)
  }

  // ========== COOKIE HELPERS ==========

  function setCookie(name: string, value: string, days: number) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  function getCookie(name: string): string | null {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  }

  // ========== RENDER HELPERS ==========

  function getBannerStyles(): string {
    switch (bannerState) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900'
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'expired':
        return 'bg-red-100 border-red-300 text-red-900'
      default:
        return ''
    }
  }

  function getIconStyles(): string {
    switch (bannerState) {
      case 'warning':
        return 'text-amber-500'
      case 'critical':
        return 'text-red-500 animate-pulse'
      case 'expired':
        return 'text-red-600'
      default:
        return ''
    }
  }

  function getBannerMessage(): JSX.Element {
    switch (bannerState) {
      case 'warning':
        return (
          <>
            <Clock className={`w-5 h-5 ${getIconStyles()} flex-shrink-0`} />
            <div className="flex-1">
              <p className="font-semibold">
                Perioada de probă: <span className="font-bold">{daysRemaining} {daysRemaining === 1 ? 'zi rămasă' : 'zile rămase'}</span>
              </p>
              <p className="text-sm mt-0.5">
                Alege un plan pentru a continua să folosești toate funcționalitățile platformei.
              </p>
            </div>
          </>
        )

      case 'critical':
        return (
          <>
            <AlertTriangle className={`w-5 h-5 ${getIconStyles()} flex-shrink-0`} />
            <div className="flex-1">
              <p className="font-bold text-lg">
                ⚠️ Ultimele {daysRemaining} {daysRemaining === 1 ? 'zi' : 'zile'} de probă!
              </p>
              <p className="text-sm mt-1">
                Perioada ta de probă se încheie {daysRemaining === 0 ? 'astăzi' : `în ${daysRemaining} ${daysRemaining === 1 ? 'zi' : 'zile'}`}.
                Upgrade-ează acum pentru a evita întreruperea serviciilor.
              </p>
            </div>
          </>
        )

      case 'expired':
        return (
          <>
            <Zap className={`w-6 h-6 ${getIconStyles()} flex-shrink-0`} />
            <div className="flex-1">
              <p className="font-bold text-xl">
                Perioada de probă a expirat
              </p>
              <p className="text-sm mt-1">
                Accesul tău la funcționalitățile premium a fost suspendat.
                Upgrade-ează la un plan plătit pentru a reactiva contul.
              </p>
            </div>
          </>
        )

      default:
        return <></>
    }
  }

  function getButtonStyles(): string {
    switch (bannerState) {
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white'
      case 'critical':
      case 'expired':
        return 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
      default:
        return ''
    }
  }

  // ========== RENDER ==========

  // Nu afișa banner-ul dacă e hidden sau dismissed
  if (bannerState === 'hidden' || (isDismissed && bannerState !== 'expired')) {
    return null
  }

  return (
    <div className={`${getBannerStyles()} border-b-2 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {getBannerMessage()}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/dashboard/billing"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${getButtonStyles()}`}
            >
              {bannerState === 'expired' ? 'Upgrade acum' : 'Alege un plan'}
            </Link>

            {/* Buton dismiss - doar pentru warning și critical */}
            {bannerState !== 'expired' && (
              <button
                onClick={handleDismiss}
                className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Ascunde banner pentru 24h"
                title="Ascunde pentru 24 de ore"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Countdown pentru critical state */}
        {bannerState === 'critical' && daysRemaining > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <div className="flex-1 bg-red-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300"
                style={{ width: `${(daysRemaining / 3) * 100}%` }}
              />
            </div>
            <span className="font-semibold whitespace-nowrap">
              {daysRemaining} {daysRemaining === 1 ? 'zi' : 'zile'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
