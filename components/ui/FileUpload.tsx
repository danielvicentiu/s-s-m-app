'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface FileUploadProps {
  bucket: string
  path?: string
  accept?: string
  maxSize?: number // bytes
  multiple?: boolean
  onUploadComplete?: (urls: string[]) => void
  onUploadError?: (error: string) => void
  disabled?: boolean
}

interface UploadFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

export function FileUpload({
  bucket,
  path = '',
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  onUploadComplete,
  onUploadError,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createSupabaseBrowser()

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `Fișierul depășește ${formatFileSize(maxSize)}`
    }

    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim())
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`
      const mimeType = file.type

      const isValid = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExt === type
        }
        if (type.endsWith('/*')) {
          return mimeType.startsWith(type.replace('/*', ''))
        }
        return mimeType === type
      })

      if (!isValid) {
        return `Tip fișier neacceptat. Acceptate: ${accept}`
      }
    }

    return null
  }

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = () => resolve(undefined)
        reader.readAsDataURL(file)
      } else {
        resolve(undefined)
      }
    })
  }

  const handleFiles = async (fileList: FileList) => {
    const newFiles: UploadFile[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const validationError = validateFile(file)

      const preview = await createPreview(file)

      newFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        progress: 0,
        status: validationError ? 'error' : 'pending',
        error: validationError || undefined,
      })

      if (!multiple) break
    }

    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles)

    // Auto-upload valid files
    newFiles.forEach(uploadFile => {
      if (uploadFile.status === 'pending') {
        handleUpload(uploadFile)
      }
    })
  }

  const handleUpload = async (uploadFile: UploadFile) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === uploadFile.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      )
    )

    try {
      const fileExt = uploadFile.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = path ? `${path}/${fileName}` : fileName

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, uploadFile.file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      setFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, status: 'success' as const, progress: 100, url: urlData.publicUrl }
            : f
        )
      )

      // Notify parent
      const successFiles = files.filter(f => f.status === 'success' || f.id === uploadFile.id)
      const urls = successFiles.map(f => f.url || urlData.publicUrl).filter(Boolean) as string[]
      onUploadComplete?.(urls)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Eroare la încărcare'

      setFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, status: 'error' as const, error: errorMessage }
            : f
        )
      )

      onUploadError?.(errorMessage)
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const { files: droppedFiles } = e.dataTransfer
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }, [disabled])

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      e.target.value = '' // Reset input
    }
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center mb-4
            ${isDragging ? 'bg-blue-100' : 'bg-gray-200'}
          `}>
            <Upload className={`h-6 w-6 ${isDragging ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>

          <p className="text-sm font-medium text-gray-900 mb-1">
            {isDragging ? 'Eliberează pentru încărcare' : 'Click pentru selectare sau trage fișierele aici'}
          </p>

          <p className="text-xs text-gray-500">
            {accept && `Tipuri acceptate: ${accept}`}
            {accept && maxSize && ' • '}
            {maxSize && `Max: ${formatFileSize(maxSize)}`}
            {multiple && ' • Multiple fișiere permise'}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              {/* Preview or Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                {file.preview ? (
                  <img src={file.preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FileIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.file.size)}
                </p>

                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Error Message */}
                {file.error && (
                  <p className="text-xs text-red-600 mt-1">{file.error}</p>
                )}
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {file.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                {file.status === 'uploading' && (
                  <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(file.id)
                }}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                disabled={file.status === 'uploading'}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
