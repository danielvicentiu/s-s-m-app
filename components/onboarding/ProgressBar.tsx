'use client'

import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  steps: string[]
}

export function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <nav aria-label="Progres înregistrare" className="w-full">
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          const isLast = i === steps.length - 1

          return (
            <li key={label} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              <div className="flex flex-col items-center gap-1.5">
                {/* Circle */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                        : 'border-2 border-gray-200 bg-white text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" strokeWidth={3} /> : stepNum}
                </div>
                {/* Label */}
                <span
                  className={`hidden text-center text-xs font-medium sm:block ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="mx-2 h-0.5 flex-1 rounded-full sm:mx-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
