'use client'

import { useEffect, useCallback, useRef } from 'react'
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmă',
  cancelLabel = 'Anulează',
  isOpen,
  onConfirm,
  onCancel,
  variant = 'info',
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    },
    [onCancel]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Focus trap: focus confirm button when dialog opens
      confirmButtonRef.current?.focus()
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: AlertCircle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
  }

  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Închide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${config.iconBg} mb-4`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Title */}
        <h3
          id="dialog-title"
          className="text-lg font-semibold text-gray-900 text-center mb-2"
        >
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${config.confirmBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
