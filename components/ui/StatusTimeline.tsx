'use client';

import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Clock } from 'lucide-react';

export type TimelineStatus = 'done' | 'current' | 'upcoming';

export interface TimelineStep {
  label: string;
  date?: string;
  status: TimelineStatus;
  description?: string;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export default function StatusTimeline({
  steps,
  className = '',
}: StatusTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  const getStatusStyles = (status: TimelineStatus) => {
    switch (status) {
      case 'done':
        return {
          dot: 'bg-green-500 border-green-500',
          line: 'bg-green-500',
          icon: <Check className="w-3 h-3 text-white" />,
          text: 'text-green-700',
          badge: 'bg-green-50 text-green-700',
        };
      case 'current':
        return {
          dot: 'bg-blue-500 border-blue-500 animate-pulse',
          line: 'bg-gray-300',
          icon: <Clock className="w-3 h-3 text-white" />,
          text: 'text-blue-700',
          badge: 'bg-blue-50 text-blue-700',
        };
      case 'upcoming':
        return {
          dot: 'bg-gray-300 border-gray-300',
          line: 'bg-gray-300',
          icon: null,
          text: 'text-gray-500',
          badge: 'bg-gray-50 text-gray-500',
        };
    }
  };

  return (
    <div className={`space-y-0 ${className}`}>
      {steps.map((step, index) => {
        const styles = getStatusStyles(step.status);
        const isExpanded = expandedSteps.has(index);
        const hasDescription = !!step.description;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="relative">
            {/* Vertical Line */}
            {!isLast && (
              <div
                className={`absolute left-3 top-6 w-0.5 h-full ${styles.line}`}
                style={{ height: 'calc(100% + 0.5rem)' }}
              />
            )}

            {/* Step Content */}
            <div className="flex gap-4 pb-6">
              {/* Dot with Icon */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${styles.dot}`}
                >
                  {styles.icon}
                </div>
              </div>

              {/* Step Details */}
              <div className="flex-1 pt-0.5">
                <div
                  className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 ${
                    hasDescription ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => hasDescription && toggleStep(index)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-medium text-sm sm:text-base ${styles.text}`}
                      >
                        {step.label}
                      </h3>
                      {step.status === 'current' && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${styles.badge} font-medium`}
                        >
                          În progres
                        </span>
                      )}
                    </div>
                    {step.date && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {step.date}
                      </p>
                    )}
                  </div>

                  {/* Expand/Collapse Button */}
                  {hasDescription && (
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 self-start sm:self-center"
                      aria-label={
                        isExpanded ? 'Ascunde detalii' : 'Arată detalii'
                      }
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Expandable Description */}
                {hasDescription && isExpanded && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
