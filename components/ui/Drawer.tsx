'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right'
  width?: string
  title?: string
  children: React.ReactNode
}

export default function Drawer({
  isOpen,
  onClose,
  position = 'right',
  width = '400px',
  title,
  children,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      // Save currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Get all focusable elements
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Focus first element
      firstElement.focus()

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }

      document.addEventListener('keydown', handleTab)

      return () => {
        document.removeEventListener('keydown', handleTab)
        // Restore focus to previous element
        previousActiveElement.current?.focus()
      }
    }
  }, [isOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} h-full bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {title && (
            <h2 id="drawer-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className={`${title ? '' : 'ml-auto'} p-2 rounded-lg hover:bg-gray-100 transition-colors`}
            aria-label="Închide"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </>
  )
}
