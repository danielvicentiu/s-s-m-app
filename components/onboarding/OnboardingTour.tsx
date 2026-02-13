'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
  localStorageKey?: string;
}

export default function OnboardingTour({
  steps,
  onComplete,
  onSkip,
  localStorageKey = 'onboarding_completed',
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const updatePositions = useCallback(() => {
    if (!currentStepData) return;

    const targetElement = document.querySelector(currentStepData.target);
    if (!targetElement) {
      console.warn(`Onboarding: Target element not found: ${currentStepData.target}`);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Set highlight position
    setHighlightPosition({
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height,
    });

    // Calculate tooltip position based on preferred position
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const padding = 16;

    let top = 0;
    let left = 0;

    const position = currentStepData.position || 'bottom';

    switch (position) {
      case 'top':
        top = rect.top + scrollTop - tooltipHeight - padding;
        left = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.top + scrollTop + rect.height + padding;
        left = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2;
        left = rect.left + scrollLeft - tooltipWidth - padding;
        break;
      case 'right':
        top = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2;
        left = rect.left + scrollLeft + rect.width + padding;
        break;
    }

    // Ensure tooltip stays within viewport bounds
    const maxLeft = window.innerWidth + scrollLeft - tooltipWidth - padding;
    const maxTop = window.innerHeight + scrollTop - tooltipHeight - padding;

    left = Math.max(padding, Math.min(left, maxLeft));
    top = Math.max(padding, Math.min(top, maxTop));

    setTooltipPosition({ top, left });
  }, [currentStepData]);

  useEffect(() => {
    // Check if tour has been completed before
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(localStorageKey);
      if (!completed) {
        setIsVisible(true);
      }
    }
  }, [localStorageKey]);

  useEffect(() => {
    if (isVisible) {
      updatePositions();
      window.addEventListener('resize', updatePositions);
      window.addEventListener('scroll', updatePositions);

      // Scroll target element into view
      const targetElement = document.querySelector(currentStepData?.target || '');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return () => {
        window.removeEventListener('resize', updatePositions);
        window.removeEventListener('scroll', updatePositions);
      };
    }
  }, [isVisible, currentStep, currentStepData, updatePositions]);

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(localStorageKey, 'skipped');
    }
    onSkip();
  };

  const handleFinish = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(localStorageKey, 'completed');
    }
    onComplete();
  };

  if (!isVisible || !currentStepData) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Highlight spotlight */}
      <div
        className="fixed z-[9999] pointer-events-none transition-all duration-300"
        style={{
          top: `${highlightPosition.top}px`,
          left: `${highlightPosition.left}px`,
          width: `${highlightPosition.width}px`,
          height: `${highlightPosition.height}px`,
          boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[10000] bg-white rounded-2xl shadow-2xl w-80 transition-all duration-300"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {currentStepData.title}
              </h3>
              <p className="text-sm text-gray-600">
                {currentStepData.description}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Skip tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : index < currentStep
                    ? 'w-2 bg-blue-400'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Sari peste
            </button>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Înapoi
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isLastStep ? 'Finalizează' : 'Următorul'}
              </button>
            </div>
          </div>

          {/* Step counter */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Pasul {currentStep + 1} din {steps.length}
          </div>
        </div>
      </div>
    </>
  );
}
