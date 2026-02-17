'use client'

import { useState, useRef } from 'react'

interface Props {
  token: string
  label: string
  organizationName: string
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function UploadPortalClient({ token, label, organizationName }: Props) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelected = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrorMessage('Fișierul trebuie să fie o imagine (JPEG, PNG, etc).')
      setStatus('error')
      return
    }

    setStatus('uploading')
    setProgress(15)

    try {
      const formData = new FormData()
      formData.append('image', file)

      setProgress(35)

      const response = await fetch(`/api/upload/${token}`, {
        method: 'POST',
        body: formData,
      })

      setProgress(85)

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Eroare la trimitere')
      }

      setProgress(100)
      setStatus('success')
    } catch (err: any) {
      console.error('Upload error:', err)
      setErrorMessage(err.message || 'Eroare la trimiterea documentului. Vă rugăm încercați din nou.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setProgress(0)
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm tracking-wide">
            s-s-m.ro
          </div>
          <span className="text-gray-500 text-sm">Platformă SSM &amp; PSI</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Trimite documente
            </h1>
            {organizationName && (
              <p className="text-gray-600">
                către{' '}
                <span className="font-semibold text-blue-600">{organizationName}</span>
              </p>
            )}
            {label && label !== 'Link upload documente' && (
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            )}
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            {/* Idle State — Upload buttons */}
            {status === 'idle' && (
              <div className="space-y-4">
                <p className="text-center text-gray-500 text-sm mb-6">
                  Fotografiați documentul sau selectați o imagine din galerie.
                </p>

                {/* Primary: Camera button */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white rounded-2xl py-5 px-6 text-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Fotografiază document
                </button>

                {/* Secondary: Gallery button */}
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 rounded-2xl py-4 px-6 text-base font-medium border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 active:bg-gray-50 transition-all"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Alege din galerie
                </button>

                {/* Hidden file inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelected(file)
                    e.target.value = ''
                  }}
                />
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelected(file)
                    e.target.value = ''
                  }}
                />
              </div>
            )}

            {/* Uploading State */}
            {status === 'uploading' && (
              <div className="py-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">Se trimite documentul...</p>
                  <p className="text-gray-500 text-sm mt-1">Vă rugăm așteptați</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">{progress}%</p>
              </div>
            )}

            {/* Success State */}
            {status === 'success' && (
              <div className="py-4 text-center">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Documentul a fost trimis cu succes!
                </h2>
                <p className="text-gray-600 mb-6">
                  Documentul a fost recepționat și va fi procesat în cel mai scurt timp.
                </p>
                <button
                  onClick={handleReset}
                  className="w-full bg-blue-600 text-white rounded-2xl py-4 px-6 text-base font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  Trimite alt document
                </button>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="py-4 text-center">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Eroare la trimitere
                </h2>
                <p className="text-red-600 text-sm mb-6">{errorMessage}</p>
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-900 text-white rounded-2xl py-4 px-6 text-base font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all"
                >
                  Încearcă din nou
                </button>
              </div>
            )}
          </div>

          {/* Security notice */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Documentele sunt procesate securizat de platforma s-s-m.ro
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-gray-400">
          &copy; 2026 s-s-m.ro &mdash; Platformă SSM &amp; PSI
        </p>
      </footer>
    </div>
  )
}
