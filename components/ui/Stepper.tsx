'use client'

import { Check } from 'lucide-react'

interface Step {
  label: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      {/* Horizontal layout for desktop */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isFuture = stepNumber > currentStep

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold
                    ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`
                      text-sm font-medium
                      ${
                        isCompleted || isCurrent
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div
                      className={`
                        text-xs mt-1
                        ${
                          isCompleted || isCurrent
                            ? 'text-gray-600'
                            : 'text-gray-400'
                        }
                      `}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4
                    ${
                      stepNumber < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }
                  `}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Vertical layout for mobile */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isFuture = stepNumber > currentStep

          return (
            <div key={index} className="flex">
              {/* Step circle and line */}
              <div className="flex flex-col items-center mr-4">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold flex-shrink-0
                    ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                {/* Vertical connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-0.5 flex-1 min-h-[2rem] mt-2
                      ${
                        stepNumber < currentStep
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }
                    `}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <div
                  className={`
                    text-sm font-medium
                    ${
                      isCompleted || isCurrent
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div
                    className={`
                      text-xs mt-1
                      ${
                        isCompleted || isCurrent
                          ? 'text-gray-600'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
