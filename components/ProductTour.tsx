'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
}

interface ProductTourProps {
  steps: TourStep[];
  tourId: string; // Unique identifier for localStorage
  onComplete?: () => void;
  onSkip?: () => void;
}

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function ProductTour({
  steps,
  tourId,
  onComplete,
  onSkip,
}: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetPosition, setTargetPosition] = useState<Position | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check if tour should be shown
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`tour-${tourId}-completed`);
    if (!hasSeenTour && steps.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsVisible(true), 500);
    }
  }, [tourId, steps.length]);

  // Calculate positions when step changes
  const calculatePositions = useCallback(() => {
    if (!isVisible || currentStep >= steps.length) return;

    const step = steps[currentStep];
    const targetElement = document.querySelector(step.target);

    if (!targetElement) {
      console.warn(`ProductTour: Target element "${step.target}" not found`);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const offset = step.offset || 8;

    // Set target position for highlight
    setTargetPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    });

    // Scroll element into view
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

    // Calculate tooltip position after a short delay (to account for scrolling)
    setTimeout(() => {
      if (!tooltipRef.current) return;

      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const placement = step.placement || 'bottom';
      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = rect.top + window.scrollY - tooltipRect.height - offset;
          left = rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = rect.top + window.scrollY + rect.height + offset;
          left = rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left + window.scrollX - tooltipRect.width - offset;
          break;
        case 'right':
          top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left + window.scrollX + rect.width + offset;
          break;
      }

      // Ensure tooltip stays within viewport
      const padding = 16;
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding + window.scrollY) top = padding + window.scrollY;

      setTooltipPosition({ top, left });
    }, 300);
  }, [isVisible, currentStep, steps]);

  useEffect(() => {
    calculatePositions();

    // Recalculate on window resize
    const handleResize = () => calculatePositions();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [calculatePositions]);

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem(`tour-${tourId}-completed`, 'true');
    onSkip?.();
  };

  const handleFinish = () => {
    setIsVisible(false);
    localStorage.setItem(`tour-${tourId}-completed`, 'true');
    onComplete?.();
  };

  const handleDontShowAgain = () => {
    setIsVisible(false);
    localStorage.setItem(`tour-${tourId}-completed`, 'true');
    localStorage.setItem(`tour-${tourId}-dismissed`, 'true');
  };

  if (!isVisible || !targetPosition || !tooltipPosition) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const placement = currentStepData.placement || 'bottom';

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* Highlight cutout */}
      <div
        className="fixed z-[9999] pointer-events-none transition-all duration-300 ease-in-out"
        style={{
          top: `${targetPosition.top}px`,
          left: `${targetPosition.left}px`,
          width: `${targetPosition.width}px`,
          height: `${targetPosition.height}px`,
        }}
      >
        <div
          className="absolute inset-0 rounded-lg shadow-[0_0_0_4px_rgba(59,130,246,0.5),0_0_0_9999px_rgba(0,0,0,0.5)] bg-transparent animate-pulse-subtle"
          style={{
            margin: '-4px',
            width: `calc(100% + 8px)`,
            height: `calc(100% + 8px)`,
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] pointer-events-auto transition-all duration-300 ease-in-out"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
        role="dialog"
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-gray-200">
          {/* Arrow */}
          <div
            className={`absolute w-4 h-4 bg-white border-gray-200 rotate-45 ${
              placement === 'top'
                ? 'bottom-[-8px] left-1/2 -translate-x-1/2 border-r border-b'
                : placement === 'bottom'
                ? 'top-[-8px] left-1/2 -translate-x-1/2 border-l border-t'
                : placement === 'left'
                ? 'right-[-8px] top-1/2 -translate-y-1/2 border-t border-r'
                : 'left-[-8px] top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />

          {/* Content */}
          <div className="relative p-6">
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Închide tour"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step counter */}
            <div className="text-sm text-blue-600 font-medium mb-2">
              Pasul {currentStep + 1} din {steps.length}
            </div>

            {/* Title */}
            <h3
              id="tour-title"
              className="text-lg font-semibold text-gray-900 mb-2 pr-8"
            >
              {currentStepData.title}
            </h3>

            {/* Description */}
            <p id="tour-description" className="text-gray-600 mb-6">
              {currentStepData.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleDontShowAgain}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Nu mai arăta
              </button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Înapoi
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  {isLastStep ? 'Finalizează' : 'Următorul'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.8), 0 0 0 9999px rgba(0, 0, 0, 0.5);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
