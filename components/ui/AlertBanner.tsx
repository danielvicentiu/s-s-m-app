'use client';

import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export type AlertBannerType = 'info' | 'success' | 'warning' | 'error';

export interface AlertBannerProps {
  type: AlertBannerType;
  title: string;
  message: string;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const alertStyles = {
  info: {
    background: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    message: 'text-blue-700',
    button: 'text-blue-600 hover:text-blue-800',
    actionButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    Icon: Info,
  },
  success: {
    background: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    message: 'text-green-700',
    button: 'text-green-600 hover:text-green-800',
    actionButton: 'bg-green-600 hover:bg-green-700 text-white',
    Icon: CheckCircle,
  },
  warning: {
    background: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    message: 'text-yellow-700',
    button: 'text-yellow-600 hover:text-yellow-800',
    actionButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    Icon: AlertTriangle,
  },
  error: {
    background: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    message: 'text-red-700',
    button: 'text-red-600 hover:text-red-800',
    actionButton: 'bg-red-600 hover:bg-red-700 text-white',
    Icon: AlertCircle,
  },
};

export default function AlertBanner({
  type,
  title,
  message,
  dismissible = false,
  action,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const styles = alertStyles[type];
  const IconComponent = styles.Icon;

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border ${styles.background}`}
    >
      <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${styles.icon}`} />

      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-semibold ${styles.title}`}>{title}</h3>
        <p className={`text-sm mt-1 ${styles.message}`}>{message}</p>

        {action && (
          <button
            onClick={action.onClick}
            className={`mt-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${styles.actionButton}`}
          >
            {action.label}
          </button>
        )}
      </div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${styles.button}`}
          aria-label="Închide"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
