'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'cookie-consent'

type ConsentLevel = 'all' | 'essential' | null

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = (level: ConsentLevel) => {
    if (level) {
      localStorage.setItem(COOKIE_CONSENT_KEY, level)
      setShowBanner(false)
    }
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Folosim cookies pentru a îmbunătăți experiența ta pe platformă și pentru a analiza traficul.
              Cookies-urile esențiale sunt necesare pentru funcționarea platformei, în timp ce cookies-urile
              de analiză ne ajută să înțelegem cum este utilizată aplicația.{' '}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Politica de confidențialitate
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleAccept('essential')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Doar esențiale
            </button>
            <button
              onClick={() => handleAccept('all')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Accept toate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
