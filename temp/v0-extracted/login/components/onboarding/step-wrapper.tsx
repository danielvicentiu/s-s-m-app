"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

interface StepWrapperProps {
  title: string
  subtitle: string
  children: ReactNode
  onNext: () => void
  onBack?: () => void
  nextLabel?: string
  nextDisabled?: boolean
}

export function StepWrapper({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = "Următorul",
  nextDisabled = false,
}: StepWrapperProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div>{children}</div>

      <div className="flex items-center justify-between border-t border-border pt-5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLabel}
          {nextLabel === "Următorul" && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
