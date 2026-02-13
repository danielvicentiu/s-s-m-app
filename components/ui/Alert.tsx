'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  X
} from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: string | React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, {
  container: string;
  icon: string;
  title: string;
  description: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}> = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    description: 'text-blue-700',
    IconComponent: Info,
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    description: 'text-green-700',
    IconComponent: CheckCircle,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    description: 'text-yellow-700',
    IconComponent: AlertTriangle,
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    description: 'text-red-700',
    IconComponent: XCircle,
  },
};

export function Alert({
  variant = 'info',
  title,
  description,
  dismissible = false,
  onDismiss,
  actions,
  className = '',
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  const styles = variantStyles[variant];
  const IconComponent = styles.IconComponent;

  return (
    <div
      className={`rounded-2xl border p-4 ${styles.container} ${className}`}
      role="alert"
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${styles.icon}`} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`text-sm font-semibold ${styles.title} mb-1`}>
              {title}
            </h3>
          )}
          {description && (
            <div className={`text-sm ${styles.description} ${title ? '' : 'mt-0'}`}>
              {description}
            </div>
          )}
          {actions && (
            <div className="mt-3 flex gap-3">
              {actions}
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              className={`inline-flex rounded-lg p-1.5 ${styles.icon} hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                variant === 'info' ? 'focus:ring-blue-600' :
                variant === 'success' ? 'focus:ring-green-600' :
                variant === 'warning' ? 'focus:ring-yellow-600' :
                'focus:ring-red-600'
              }`}
              aria-label="Închide alertă"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
