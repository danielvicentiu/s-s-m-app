'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X, ChevronDown, Download, BookOpen, Stethoscope, Building2, UserX, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export type BulkAction =
  | 'export'
  | 'assign-training'
  | 'schedule-medical'
  | 'change-department'
  | 'deactivate'
  | 'delete'

interface BulkActionsBarProps {
  selectedCount: number
  onClear: () => void
  onAction: (action: BulkAction) => void | Promise<void>
}

export function BulkActionsBar({ selectedCount, onClear, onAction }: BulkActionsBarProps) {
  const t = useTranslations('widgets.bulkActions')

  const ACTIONS = [
    {
      id: 'export' as BulkAction,
      label: t('export'),
      icon: Download,
      isDestructive: false,
    },
    {
      id: 'assign-training' as BulkAction,
      label: t('assignTraining'),
      icon: BookOpen,
      isDestructive: false,
    },
    {
      id: 'schedule-medical' as BulkAction,
      label: t('medicalExam'),
      icon: Stethoscope,
      isDestructive: false,
    },
    {
      id: 'change-department' as BulkAction,
      label: t('assignOrg'),
      icon: Building2,
      isDestructive: false,
    },
    {
      id: 'deactivate' as BulkAction,
      label: t('deactivate'),
      icon: UserX,
      isDestructive: true,
    },
    {
      id: 'delete' as BulkAction,
      label: t('delete'),
      icon: Trash2,
      isDestructive: true,
    },
  ]
  const [isOpen, setIsOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    action: BulkAction | null
    title: string
    message: string
    confirmLabel: string
    isDestructive: boolean
  }>({
    isOpen: false,
    action: null,
    title: '',
    message: '',
    confirmLabel: '',
    isDestructive: false,
  })
  const [loading, setLoading] = useState(false)

  if (selectedCount === 0) return null

  const handleActionClick = (action: BulkAction) => {
    const actionConfig = ACTIONS.find(a => a.id === action)

    if (actionConfig?.isDestructive) {
      // Show confirmation dialog for destructive actions
      let title = ''
      let message = ''
      let confirmLabel = ''

      switch (action) {
        case 'deactivate':
          title = t('deactivate')
          message = `Sigur doriți să dezactivați ${selectedCount} ${selectedCount === 1 ? 'înregistrare' : 'înregistrări'}? Acestea vor fi marcate ca inactive.`
          confirmLabel = t('deactivate')
          break
        case 'delete':
          title = t('confirmDelete')
          message = `Sigur doriți să ștergeți ${selectedCount} ${selectedCount === 1 ? 'înregistrare' : 'înregistrări'}? Această acțiune nu poate fi anulată.`
          confirmLabel = t('delete')
          break
      }

      setConfirmDialog({
        isOpen: true,
        action,
        title,
        message,
        confirmLabel,
        isDestructive: true,
      })
    } else {
      // Execute non-destructive actions immediately
      handleConfirm(action)
    }

    setIsOpen(false)
  }

  const handleConfirm = async (actionToExecute?: BulkAction) => {
    const action = actionToExecute || confirmDialog.action
    if (!action) return

    setLoading(true)
    try {
      await onAction(action)
    } finally {
      setLoading(false)
      setConfirmDialog({ ...confirmDialog, isOpen: false, action: null })
    }
  }

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-4 flex items-center gap-6">
          {/* Selected Count */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{selectedCount}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {`${selectedCount} ${t('selected')}`}
            </span>
          </div>

          {/* Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Acțiuni
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />

                {/* Dropdown Menu */}
                <div className="absolute bottom-full mb-2 left-0 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-20">
                  {ACTIONS.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                          action.isDestructive
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {action.label}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Clear Selection */}
          <button
            onClick={onClear}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t('cancel')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        onConfirm={() => handleConfirm()}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false, action: null })}
        isDestructive={confirmDialog.isDestructive}
        loading={loading}
      />
    </>
  )
}
