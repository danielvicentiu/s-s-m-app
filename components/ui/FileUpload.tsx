'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileIcon, ImageIcon, FileText, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

export interface FileUploadProps {
  bucket: string
  path?: string
  accept?: string[]
  maxSize?: number // in MB
  multiple?: boolean
  onUploadComplete?: (urls: string[]) => void
  onUploadError?: (error: string) => void
  disabled?: boolean
}

interface UploadedFile {
  file: File
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

const FILE_ICONS: Record<string, typeof FileIcon> = {
  pdf: FileText,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  doc: FileText,
  docx: FileText,
}

const DEFAULT_ACCEPT = ['pdf', 'jpg', 'jpeg', 'png', 'csv', 'xlsx']
const DEFAULT_MAX_SIZE = 10 // MB

export function FileUpload({
  bucket,
  path = '',
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  multiple = false,
  onUploadComplete,
  onUploadError,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createSupabaseBrowser()

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  const isImageFile = (file: File) => {
    return file.type.startsWith('image/')
  }

  const validateFile = (file: File): string | null => {
    const ext = getFileExtension(file.name)

    if (accept.length > 0 && !accept.includes(ext)) {
      return `Tipul de fișier .${ext} nu este permis`
    }

    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      return `Fișierul este prea mare (max ${maxSize}MB)`
    }

    return null
  }

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!isImageFile(file)) {
        resolve(undefined)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        resolve(undefined)
      }
      reader.readAsDataURL(file)
    })
  }

  const uploadFile = async (uploadedFile: UploadedFile, index: number) => {
    try {
      setFiles(prev => prev.map((f, i) =>
        i === index ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ))

      const fileExt = getFileExtension(uploadedFile.file.name)
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = path ? `${path}/${fileName}` : fileName

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, uploadedFile.file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setFiles(prev => prev.map((f, i) =>
        i === index
          ? { ...f, status: 'success' as const, progress: 100, url: publicUrl }
          : f
      ))

      return publicUrl
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Eroare la încărcare'

      setFiles(prev => prev.map((f, i) =>
        i === index
          ? { ...f, status: 'error' as const, error: errorMessage }
          : f
      ))

      throw error
    }
  }

  const handleFiles = async (fileList: FileList) => {
    const newFiles = Array.from(fileList)

    if (!multiple && newFiles.length > 1) {
      onUploadError?.('Selectează doar un fișier')
      return
    }

    if (!multiple && files.length > 0) {
      onUploadError?.('Șterge fișierul existent înainte să încarci altul')
      return
    }

    const validatedFiles: UploadedFile[] = []

    for (const file of newFiles) {
      const error = validateFile(file)

      if (error) {
        onUploadError?.(error)
        continue
      }

      const preview = await createFilePreview(file)

      validatedFiles.push({
        file,
        preview,
        progress: 0,
        status: 'pending',
      })
    }

    if (validatedFiles.length === 0) return

    setFiles(prev => multiple ? [...prev, ...validatedFiles] : validatedFiles)

    // Start uploading
    const uploadPromises = validatedFiles.map(async (uploadedFile, idx) => {
      const actualIndex = multiple ? files.length + idx : idx
      try {
        return await uploadFile(uploadedFile, actualIndex)
      } catch (error) {
        console.error('Upload error:', error)
        return null
      }
    })

    try {
      const urls = await Promise.all(uploadPromises)
      const successfulUrls = urls.filter((url): url is string => url !== null)

      if (successfulUrls.length > 0) {
        onUploadComplete?.(successfulUrls)
      }
    } catch (error) {
      console.error('Upload batch error:', error)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const { files: droppedFiles } = e.dataTransfer
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }, [disabled, files, multiple])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files: selectedFiles } = e.target
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles)
    }
    // Reset input
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    const ext = getFileExtension(file.name)
    const IconComponent = FILE_ICONS[ext] || FileIcon
    return IconComponent
  }

  const acceptString = accept.map(ext => `.${ext}`).join(',')

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptString}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-blue-100' : 'bg-gray-200'}
          `}>
            <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {isDragging ? 'Eliberează pentru a încărca' : 'Trage fișiere aici sau click pentru a selecta'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.length > 0 && `Formate acceptate: ${accept.map(e => e.toUpperCase()).join(', ')}`}
              {maxSize && ` · Max ${maxSize}MB`}
              {multiple && ' · Fișiere multiple permise'}
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((uploadedFile, index) => {
            const Icon = getFileIcon(uploadedFile.file)
            const showPreview = isImageFile(uploadedFile.file) && uploadedFile.preview

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl"
              >
                {/* Preview or Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {showPreview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.file.size / 1024).toFixed(1)} KB
                  </p>

                  {/* Progress bar */}
                  {uploadedFile.status === 'uploading' && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Error message */}
                  {uploadedFile.status === 'error' && uploadedFile.error && (
                    <p className="text-xs text-red-600 mt-1">{uploadedFile.error}</p>
                  )}
                </div>

                {/* Status icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.status === 'success' && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {uploadedFile.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
                  )}
                </div>

                {/* Remove button */}
                {uploadedFile.status !== 'uploading' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
