'use client'

import React from 'react'
import { Check } from 'lucide-react'

export interface Step {
  label: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  const handleStepClick = (index: number) => {
    if (onStepClick && index <= currentStep) {
      onStepClick(index)
    }
  }

  const getStepState = (index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'current'
    return 'upcoming'
  }

  const getStepStyles = (state: 'completed' | 'current' | 'upcoming') => {
    switch (state) {
      case 'completed':
        return {
          circle: 'bg-green-600 text-white border-green-600',
          line: 'bg-green-600',
          label: 'text-gray-900 font-medium',
          description: 'text-gray-600'
        }
      case 'current':
        return {
          circle: 'bg-blue-600 text-white border-blue-600',
          line: 'bg-gray-200',
          label: 'text-blue-600 font-semibold',
          description: 'text-gray-700'
        }
      case 'upcoming':
        return {
          circle: 'bg-white text-gray-400 border-gray-300',
          line: 'bg-gray-200',
          label: 'text-gray-500',
          description: 'text-gray-400'
        }
    }
  }

  return (
    <>
      {/* Horizontal stepper - hidden on mobile */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const state = getStepState(index)
            const styles = getStepStyles(state)
            const Icon = step.icon
            const isClickable = onStepClick && index <= currentStep

            return (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={`
                      relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                      ${styles.circle}
                      ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                    `}
                  >
                    {state === 'completed' ? (
                      <Check className="w-6 h-6" />
                    ) : Icon ? (
                      <Icon className="w-6 h-6" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </button>
                  <div className="mt-3 text-center">
                    <div className={`text-sm ${styles.label}`}>
                      {step.label}
                    </div>
                    {step.description && (
                      <div className={`text-xs mt-1 ${styles.description}`}>
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 mb-8">
                    <div className={`h-0.5 ${styles.line}`} />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Vertical stepper - visible on mobile */}
      <div className="md:hidden">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const state = getStepState(index)
            const styles = getStepStyles(state)
            const Icon = step.icon
            const isClickable = onStepClick && index <= currentStep

            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0
                      ${styles.circle}
                      ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                    `}
                  >
                    {state === 'completed' ? (
                      <Check className="w-5 h-5" />
                    ) : Icon ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[2rem] ${styles.line}`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className={`text-sm ${styles.label}`}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className={`text-xs mt-1 ${styles.description}`}>
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
