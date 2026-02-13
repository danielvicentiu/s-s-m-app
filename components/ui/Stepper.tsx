'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  number: number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  const handleStepClick = (step: Step) => {
    // Allow navigation only to completed steps
    if (step.number < currentStep && onStepClick) {
      onStepClick(step.number);
    }
  };

  const getStepStatus = (stepNumber: number): 'completed' | 'active' | 'future' => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'future';
  };

  return (
    <div className="w-full">
      {/* Desktop: Horizontal */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.number);
            const isClickable = status === 'completed';
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <button
                    onClick={() => handleStepClick(step)}
                    disabled={!isClickable}
                    className={`
                      relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all
                      ${status === 'completed'
                        ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700'
                        : status === 'active'
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }
                      ${isClickable ? 'hover:scale-110' : ''}
                    `}
                  >
                    {status === 'completed' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </button>

                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <p className={`
                      text-sm font-medium
                      ${status === 'active' ? 'text-blue-600' : status === 'completed' ? 'text-gray-900' : 'text-gray-500'}
                    `}>
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="mt-1 text-xs text-gray-500 max-w-[120px]">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 h-0.5 -mx-2 mb-12">
                    <div
                      className={`h-full transition-all ${
                        step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const isClickable = status === 'completed';
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="relative">
              <div className="flex items-start gap-4">
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  className={`
                    relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-semibold flex-shrink-0 transition-all
                    ${status === 'completed'
                      ? 'bg-green-600 text-white cursor-pointer active:bg-green-700'
                      : status === 'active'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </button>

                {/* Step Content */}
                <div className="flex-1 pt-1">
                  <p className={`
                    text-sm font-medium
                    ${status === 'active' ? 'text-blue-600' : status === 'completed' ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="mt-1 text-xs text-gray-500">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line (vertical) */}
              {!isLast && (
                <div className="absolute left-5 top-10 w-0.5 h-8 -translate-x-1/2">
                  <div
                    className={`h-full transition-all ${
                      step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
