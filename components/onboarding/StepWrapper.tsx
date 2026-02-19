'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface StepWrapperProps {
  title: string
  subtitle: string
  children: ReactNode
  onNext?: () => void
  onBack?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  loading?: boolean
  hideNext?: boolean
}

export function StepWrapper({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Continuă',
  nextDisabled = false,
  loading = false,
  hideNext = false,
}: StepWrapperProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>

      <div>{children}</div>

      {!hideNext && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-5">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi
            </button>
          ) : (
            <div />
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Se procesează...
                </>
              ) : (
                <>
                  {nextLabel}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
