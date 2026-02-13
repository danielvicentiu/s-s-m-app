'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = 'ssm_cookie_consent'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already set preferences
    const savedPreferences = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!savedPreferences) {
      setIsVisible(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setIsVisible(false)
    setShowCustomize(false)
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
  }

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    savePreferences(onlyNecessary)
  }

  const handleSaveCustom = () => {
    savePreferences(preferences)
  }

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // Necessary cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-7xl mx-auto p-6">
          {!showCustomize ? (
            // Main banner
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Respectăm confidențialitatea datelor tale
                </h3>
                <p className="text-sm text-gray-600">
                  Folosim cookie-uri pentru a îmbunătăți experiența ta pe platformă,
                  pentru analiză și marketing. Poți personaliza preferințele tale oricând.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Respinge tot
                </button>
                <button
                  onClick={() => setShowCustomize(true)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Personalizează
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Acceptă tot
                </button>
              </div>
            </div>
          ) : (
            // Customize view
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Setări cookie-uri
                </h3>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">Cookie-uri necesare</h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">
                        Obligatorii
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Esențiale pentru funcționarea platformei (autentificare, securitate, preferințe).
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-50">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookie-uri analitice</h4>
                    <p className="text-sm text-gray-600">
                      Ne ajută să înțelegem cum folosești platforma pentru a o îmbunătăți.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleTogglePreference('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics
                          ? 'bg-blue-600 justify-end'
                          : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>

                {/* Marketing cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookie-uri marketing</h4>
                    <p className="text-sm text-gray-600">
                      Folosite pentru personalizarea reclamelor și măsurarea eficienței campaniilor.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleTogglePreference('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing
                          ? 'bg-blue-600 justify-end'
                          : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvează preferințele
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
