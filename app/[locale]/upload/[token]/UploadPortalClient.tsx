'use client'

import { useState, useRef } from 'react'

interface Props {
  token: string
  label: string
  organizationName: string
}

type UploadStatus = 'idle' | 'preview' | 'uploading' | 'success' | 'error' | 'batch-preview' | 'batch-uploading' | 'batch-success'
type BatchItemStatus = 'pending' | 'uploading' | 'success' | 'error'

const MAX_BATCH = 20

export default function UploadPortalClient({ token, label, organizationName }: Props) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [capturedFile, setCapturedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [adjustedPreviewUrl, setAdjustedPreviewUrl] = useState<string | null>(null)
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  // Batch mode state
  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [batchPreviewUrls, setBatchPreviewUrls] = useState<string[]>([])
  const [batchItemStatuses, setBatchItemStatuses] = useState<BatchItemStatus[]>([])
  const [batchCurrentIndex, setBatchCurrentIndex] = useState(-1)
  const [batchSuccessCount, setBatchSuccessCount] = useState(0)

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const compressImage = (file: File): Promise<{ file: File; originalSize: number; compressedSize: number }> => {
    const MAX_SIDE = 1920
    const QUALITY = 0.8
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        let width = img.width
        let height = img.height
        if (width > MAX_SIDE || height > MAX_SIDE) {
          if (width > height) {
            height = Math.round((height * MAX_SIDE) / width)
            width = MAX_SIDE
          } else {
            width = Math.round((width * MAX_SIDE) / height)
            height = MAX_SIDE
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error('Compression failed')); return }
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' })
          resolve({ file: compressedFile, originalSize: file.size, compressedSize: blob.size })
        }, 'image/jpeg', QUALITY)
      }
      img.onerror = reject
      img.src = url
    })
  }

  const applyAdjustments = async () => {
    const sourceUrl = previewUrl
    if (!sourceUrl) return
    setIsAdjusting(true)
    try {
      const adjusted = await new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')!
          ctx.filter = 'brightness(110%) contrast(115%)'
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }
        img.onerror = reject
        img.src = sourceUrl
      })
      setAdjustedPreviewUrl(adjusted)
    } catch (err) {
      console.error('Adjustment error:', err)
    } finally {
      setIsAdjusting(false)
    }
  }

  const applyAdjustmentToUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.filter = 'brightness(110%) contrast(115%)'
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      img.onerror = reject
      img.src = url
    })
  }

  const handleFileSelected = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrorMessage('Fișierul trebuie să fie o imagine (JPEG, PNG, etc).')
      setStatus('error')
      return
    }
    const url = URL.createObjectURL(file)
    setCapturedFile(file)
    setPreviewUrl(url)
    setAdjustedPreviewUrl(null)
    setStatus('preview')
  }

  const handleGallerySelected = (files: FileList) => {
    if (files.length > MAX_BATCH) {
      alert(`Maxim ${MAX_BATCH} documente per trimitere.`)
      return
    }
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (fileArray.length === 0) {
      setErrorMessage('Selectați cel puțin o imagine validă.')
      setStatus('error')
      return
    }
    if (fileArray.length === 1) {
      handleFileSelected(fileArray[0])
      return
    }
    const urls = fileArray.map(f => URL.createObjectURL(f))
    setBatchFiles(fileArray)
    setBatchPreviewUrls(urls)
    setBatchItemStatuses(fileArray.map(() => 'pending' as BatchItemStatus))
    setBatchCurrentIndex(-1)
    setBatchSuccessCount(0)
    setStatus('batch-preview')
  }

  const removeBatchItem = (index: number) => {
    URL.revokeObjectURL(batchPreviewUrls[index])
    const newFiles = batchFiles.filter((_, i) => i !== index)
    const newUrls = batchPreviewUrls.filter((_, i) => i !== index)
    const newStatuses = batchItemStatuses.filter((_, i) => i !== index)
    setBatchFiles(newFiles)
    setBatchPreviewUrls(newUrls)
    setBatchItemStatuses(newStatuses)
    if (newFiles.length === 0) setStatus('idle')
  }

  const clearAllBatch = () => {
    batchPreviewUrls.forEach(url => URL.revokeObjectURL(url))
    setBatchFiles([])
    setBatchPreviewUrls([])
    setBatchItemStatuses([])
    setStatus('idle')
  }

  const handleBatchUpload = async () => {
    if (batchFiles.length === 0) return
    setStatus('batch-uploading')
    const total = batchFiles.length
    let successCount = 0
    const statuses: BatchItemStatus[] = batchFiles.map(() => 'pending')

    for (let i = 0; i < total; i++) {
      setBatchCurrentIndex(i)
      statuses[i] = 'uploading'
      setBatchItemStatuses([...statuses])

      try {
        const adjustedDataUrl = await applyAdjustmentToUrl(batchPreviewUrls[i])
        const res = await fetch(adjustedDataUrl)
        const blob = await res.blob()
        const adjustedFile = new File(
          [blob],
          batchFiles[i].name.replace(/\.[^/.]+$/, '.jpg'),
          { type: 'image/jpeg' }
        )
        let fileToUpload: File
        if (adjustedFile.size > 1024 * 1024) {
          const result = await compressImage(adjustedFile)
          fileToUpload = result.file
        } else {
          fileToUpload = adjustedFile
        }
        const formData = new FormData()
        formData.append('image', fileToUpload)
        const response = await fetch(`/api/upload/${token}`, {
          method: 'POST',
          body: formData,
        })
        const result = await response.json()
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Eroare la trimitere')
        }
        successCount++
        statuses[i] = 'success'
      } catch (err) {
        console.error(`Upload error for item ${i + 1}:`, err)
        statuses[i] = 'error'
      }

      setBatchItemStatuses([...statuses])
      setProgress(Math.round(((i + 1) / total) * 100))
    }

    setBatchSuccessCount(successCount)
    setProgress(100)
    setBatchCurrentIndex(-1)
    setStatus('batch-success')
  }

  const handleUpload = async () => {
    if (!capturedFile) return
    setStatus('uploading')
    setProgress(10)
    try {
      let fileToUpload = capturedFile

      if (capturedFile.size > 1024 * 1024) {
        setProgress(20)
        if (adjustedPreviewUrl) {
          const res = await fetch(adjustedPreviewUrl)
          const blob = await res.blob()
          const adjustedFile = new File([blob], capturedFile.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' })
          const result = await compressImage(adjustedFile)
          fileToUpload = result.file
          setOriginalSize(result.originalSize)
          setCompressedSize(result.compressedSize)
        } else {
          const result = await compressImage(capturedFile)
          fileToUpload = result.file
          setOriginalSize(result.originalSize)
          setCompressedSize(result.compressedSize)
        }
      } else if (adjustedPreviewUrl) {
        const res = await fetch(adjustedPreviewUrl)
        const blob = await res.blob()
        fileToUpload = new File([blob], capturedFile.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' })
      }

      setProgress(35)

      const formData = new FormData()
      formData.append('image', fileToUpload)

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
    setCapturedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setAdjustedPreviewUrl(null)
    setIsAdjusting(false)
    setOriginalSize(0)
    setCompressedSize(0)
    batchPreviewUrls.forEach(url => URL.revokeObjectURL(url))
    setBatchFiles([])
    setBatchPreviewUrls([])
    setBatchItemStatuses([])
    setBatchCurrentIndex(-1)
    setBatchSuccessCount(0)
  }

  const renderBatchGrid = (interactive: boolean) => {
    const total = batchFiles.length
    return (
      <div className="grid grid-cols-3 gap-2">
        {batchPreviewUrls.map((url, i) => {
          const itemStatus = batchItemStatuses[i]
          return (
            <div key={i} className="relative">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <img
                  src={url}
                  alt={`Document ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {itemStatus === 'success' && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-40 flex items-center justify-center">
                    <div className="bg-green-500 rounded-full p-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                {itemStatus === 'error' && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-40 flex items-center justify-center">
                    <div className="bg-red-500 rounded-full p-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                )}
                {itemStatus === 'uploading' && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-full leading-tight">
                  {i + 1}/{total}
                </div>
                {interactive && (
                  <button
                    onClick={() => removeBatchItem(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label={`Elimină documentul ${i + 1}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
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
                <p className="text-center text-gray-500 text-sm mb-4">
                  Fotografiați documentul sau selectați imagini din galerie.
                </p>

                {/* Camera framing guide overlay */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-800 mb-2">
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <div
                      className="flex flex-col items-center justify-start pt-2"
                      style={{
                        width: '75%',
                        height: '75%',
                        border: '2px dashed white',
                        borderRadius: '6px',
                      }}
                    >
                      <p className="text-white text-xs text-center px-3 mt-1 opacity-90 leading-tight">
                        Încadrați documentul în chenar
                      </p>
                    </div>
                  </div>
                  {/* Dim camera icon in background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-12 h-12 text-white opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

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
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files
                    if (files && files.length > 0) handleGallerySelected(files)
                    e.target.value = ''
                  }}
                />
              </div>
            )}

            {/* Preview State — single mode */}
            {status === 'preview' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 text-center">Verifică imaginea</h2>

                {/* Image preview */}
                <div className="relative w-full rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={adjustedPreviewUrl || previewUrl || ''}
                    alt="Document capturat"
                    className="w-full h-auto max-h-72 object-contain bg-gray-100"
                  />
                  {adjustedPreviewUrl && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Ajustat
                    </div>
                  )}
                </div>

                {/* Adjust button */}
                <button
                  onClick={applyAdjustments}
                  disabled={isAdjusting}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white rounded-xl py-3 px-4 text-sm font-semibold hover:bg-amber-600 disabled:opacity-60 active:scale-[0.98] transition-all"
                >
                  {isAdjusting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Se aplică ajustările...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Ajustare automată (luminozitate + contrast)
                    </>
                  )}
                </button>

                {/* Retake button */}
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 rounded-xl py-3 px-4 text-sm font-medium border-2 border-gray-200 hover:border-gray-400 active:bg-gray-50 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retrimite poza
                </button>

                {/* Upload button */}
                <button
                  onClick={handleUpload}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl py-4 px-4 text-base font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Trimite documentul
                </button>
              </div>
            )}

            {/* Batch Preview State */}
            {status === 'batch-preview' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 text-center">Verifică documentele</h2>

                {renderBatchGrid(true)}

                <p className="text-center text-sm text-gray-500">
                  {batchFiles.length} documente selectate
                </p>

                <button
                  onClick={handleBatchUpload}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl py-4 px-4 text-base font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Trimite toate documentele
                </button>

                <button
                  onClick={clearAllBatch}
                  className="w-full flex items-center justify-center gap-2 bg-white text-red-600 rounded-xl py-2.5 px-4 text-sm font-medium border-2 border-red-200 hover:border-red-400 active:bg-red-50 transition-all"
                >
                  Șterge toate
                </button>
              </div>
            )}

            {/* Batch Uploading State */}
            {status === 'batch-uploading' && (
              <div className="space-y-4">
                {renderBatchGrid(false)}

                <p className="text-center text-sm font-medium text-gray-700">
                  Procesare document {batchCurrentIndex + 1} din {batchFiles.length}...
                </p>

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
                <p className="text-center text-sm text-gray-400">{progress}%</p>
              </div>
            )}

            {/* Batch Success State */}
            {status === 'batch-success' && (
              <div className="space-y-4">
                {renderBatchGrid(false)}

                <div className="text-center py-2">
                  {batchSuccessCount === batchFiles.length ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-green-700 font-semibold">
                        {batchSuccessCount} din {batchFiles.length} documente trimise cu succes.
                      </p>
                    </div>
                  ) : (
                    <p className="text-amber-700 font-semibold">
                      {batchSuccessCount} din {batchFiles.length} documente trimise cu succes.
                    </p>
                  )}
                </div>

                <button
                  onClick={handleReset}
                  className="w-full bg-blue-600 text-white rounded-2xl py-4 px-6 text-base font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  Trimite alte documente
                </button>
              </div>
            )}

            {/* Uploading State — single mode */}
            {status === 'uploading' && (
              <div className="py-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">Se trimite documentul...</p>
                  {originalSize > 0 && compressedSize > 0 ? (
                    <p className="text-gray-500 text-sm mt-1">
                      Comprimat: {formatSize(originalSize)} → {formatSize(compressedSize)}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm mt-1">Vă rugăm așteptați</p>
                  )}
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

            {/* Success State — single mode */}
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
