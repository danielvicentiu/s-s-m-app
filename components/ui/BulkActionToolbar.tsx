'use client'

import { useState } from 'react'
import { Trash2, Download, GraduationCap, FileText, X } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'

export type BulkAction =
  | 'delete'
  | 'export'
  | 'schedule-training'
  | 'generate-document'
  | 'custom'

export interface BulkActionConfig {
  action: BulkAction
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive'
  confirmTitle?: string
  confirmMessage?: string
  onClick: () => void | Promise<void>
}

interface BulkActionToolbarProps {
  selectedCount: number
  onClear: () => void
  actions?: BulkActionConfig[]
  // Preset actions - if provided, these will be automatically configured
  onDelete?: () => void | Promise<void>
  onExport?: () => void | Promise<void>
  onScheduleTraining?: () => void | Promise<void>
  onGenerateDocument?: () => void | Promise<void>
}

const defaultActionConfigs: Record<BulkAction, Partial<BulkActionConfig>> = {
  delete: {
    label: 'Șterge',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    confirmTitle: 'Confirmare ștergere',
  },
  export: {
    label: 'Exportă',
    icon: <Download className="h-4 w-4" />,
    variant: 'default',
  },
  'schedule-training': {
    label: 'Programează instruire',
    icon: <GraduationCap className="h-4 w-4" />,
    variant: 'default',
  },
  'generate-document': {
    label: 'Generează document',
    icon: <FileText className="h-4 w-4" />,
    variant: 'default',
  },
  custom: {
    variant: 'default',
  },
}

export function BulkActionToolbar({
  selectedCount,
  onClear,
  actions = [],
  onDelete,
  onExport,
  onScheduleTraining,
  onGenerateDocument,
}: BulkActionToolbarProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void | Promise<void>
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })
  const [isLoading, setIsLoading] = useState(false)

  // Build combined actions list from both preset callbacks and custom actions
  const allActions: BulkActionConfig[] = [
    ...actions,
  ]

  // Add preset actions if their callbacks are provided
  if (onDelete) {
    allActions.push({
      action: 'delete',
      label: defaultActionConfigs.delete.label!,
      icon: defaultActionConfigs.delete.icon,
      variant: 'destructive',
      confirmTitle: defaultActionConfigs.delete.confirmTitle,
      confirmMessage: `Sigur doriți să ștergeți ${selectedCount} ${selectedCount === 1 ? 'element' : 'elemente'}? Această acțiune nu poate fi anulată.`,
      onClick: onDelete,
    })
  }

  if (onExport) {
    allActions.push({
      action: 'export',
      label: defaultActionConfigs.export.label!,
      icon: defaultActionConfigs.export.icon,
      variant: 'default',
      onClick: onExport,
    })
  }

  if (onScheduleTraining) {
    allActions.push({
      action: 'schedule-training',
      label: defaultActionConfigs['schedule-training'].label!,
      icon: defaultActionConfigs['schedule-training'].icon,
      variant: 'default',
      onClick: onScheduleTraining,
    })
  }

  if (onGenerateDocument) {
    allActions.push({
      action: 'generate-document',
      label: defaultActionConfigs['generate-document'].label!,
      icon: defaultActionConfigs['generate-document'].icon,
      variant: 'default',
      onClick: onGenerateDocument,
    })
  }

  const handleActionClick = (actionConfig: BulkActionConfig) => {
    // If action requires confirmation, show dialog
    if (actionConfig.confirmTitle && actionConfig.confirmMessage) {
      setConfirmDialog({
        isOpen: true,
        title: actionConfig.confirmTitle,
        message: actionConfig.confirmMessage,
        onConfirm: actionConfig.onClick,
      })
    } else {
      // Execute immediately
      executeAction(actionConfig.onClick)
    }
  }

  const executeAction = async (actionFn: () => void | Promise<void>) => {
    setIsLoading(true)
    try {
      await actionFn()
    } catch (error) {
      console.error('Bulk action error:', error)
    } finally {
      setIsLoading(false)
      setConfirmDialog({ ...confirmDialog, isOpen: false })
    }
  }

  const handleConfirm = () => {
    executeAction(confirmDialog.onConfirm)
  }

  const handleCancel = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false })
  }

  if (selectedCount === 0) return null

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-4">
          <div className="flex items-center gap-6">
            {/* Selection count */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900">
                {selectedCount} {selectedCount === 1 ? 'element selectat' : 'elemente selectate'}
              </span>
              <button
                onClick={onClear}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Deselectează tot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Divider */}
            {allActions.length > 0 && (
              <div className="h-6 w-px bg-gray-200" />
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {allActions.map((actionConfig, index) => (
                <button
                  key={`${actionConfig.action}-${index}`}
                  onClick={() => handleActionClick(actionConfig)}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                    actionConfig.variant === 'destructive'
                      ? 'text-red-700 bg-red-50 hover:bg-red-100'
                      : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {actionConfig.icon}
                  {actionConfig.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm dialog for destructive actions */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isDestructive={true}
        loading={isLoading}
      />
    </>
  )
}
