'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

type CookieCategory = 'essential' | 'functional' | 'analytics' | 'marketing'

interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'cookie-consent-preferences'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const savedPreferences = localStorage.getItem(STORAGE_KEY)
    if (!savedPreferences) {
      setShowBanner(true)
    } else {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowModal(false)
  }

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    })
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
  }

  const handleToggleCategory = (category: CookieCategory) => {
    if (category === 'essential') return // Essential cannot be toggled
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  if (!showBanner && !showModal) {
    return null
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showModal && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Folosim cookie-uri pentru a îmbunătăți experiența ta pe
                  platformă, a analiza traficul și a personaliza conținutul.
                  Prin acceptare, ești de acord cu utilizarea tuturor
                  cookie-urilor.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Preferințe
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Acceptă toate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Preferințe Cookie
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                <p className="text-sm text-gray-600">
                  Personalizează preferințele tale pentru cookie-uri.
                  Cookie-urile esențiale sunt necesare pentru funcționarea
                  platformei și nu pot fi dezactivate.
                </p>

                {/* Essential Cookies */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Cookie-uri esențiale
                      </h3>
                      <p className="text-sm text-gray-600">
                        Necesare pentru funcționarea de bază a platformei,
                        inclusiv autentificare și securitate.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.essential}
                          disabled
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-not-allowed opacity-50"
                        />
                        <span className="ml-2 text-xs text-gray-500">
                          Întotdeauna activ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Cookie-uri funcționale
                      </h3>
                      <p className="text-sm text-gray-600">
                        Permit funcții îmbunătățite și personalizare, cum ar fi
                        preferințele de limbă și setările interfaței.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => handleToggleCategory('functional')}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Cookie-uri de analiză
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ne ajută să înțelegem cum utilizezi platforma pentru a
                        îmbunătăți experiența utilizatorilor.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handleToggleCategory('analytics')}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Cookie-uri de marketing
                      </h3>
                      <p className="text-sm text-gray-600">
                        Utilizate pentru a afișa conținut și anunțuri
                        relevante, personalizate în funcție de interesele tale.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handleToggleCategory('marketing')}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Salvează preferințe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
