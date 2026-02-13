'use client';

import { useEffect, useState } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface CountdownTimerProps {
  targetDate: Date | string;
  label?: string;
  onExpire?: () => void;
  variant?: 'compact' | 'full';
  className?: string;
}

export default function CountdownTimer({
  targetDate,
  label,
  onExpire,
  variant = 'full',
  className = '',
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = (): TimeRemaining => {
      const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
      const now = new Date();
      const total = target.getTime() - now.getTime();

      if (total <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
      }

      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));

      return { days, hours, minutes, seconds, total };
    };

    // Initial calculation
    const initial = calculateTimeRemaining();
    setTimeRemaining(initial);

    if (initial.total <= 0) {
      setHasExpired(true);
      onExpire?.();
      return;
    }

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.total <= 0 && !hasExpired) {
        setHasExpired(true);
        onExpire?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpire, hasExpired]);

  if (!timeRemaining) {
    return null;
  }

  const isUrgent = timeRemaining.days < 7 && timeRemaining.total > 0;

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {label && (
          <span className="text-sm font-medium text-gray-700">{label}</span>
        )}
        <div
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold ${
            hasExpired
              ? 'bg-gray-100 text-gray-500'
              : isUrgent
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          {hasExpired ? (
            <span>Expirat</span>
          ) : (
            <>
              {timeRemaining.days > 0 && (
                <>
                  <span className="font-bold">{timeRemaining.days}</span>
                  <span className="text-xs opacity-75">z</span>
                  <span className="opacity-50">:</span>
                </>
              )}
              <span className="font-bold">{String(timeRemaining.hours).padStart(2, '0')}</span>
              <span className="text-xs opacity-75">h</span>
              <span className="opacity-50">:</span>
              <span className="font-bold">{String(timeRemaining.minutes).padStart(2, '0')}</span>
              <span className="text-xs opacity-75">m</span>
              <span className="opacity-50">:</span>
              <span className="font-bold">{String(timeRemaining.seconds).padStart(2, '0')}</span>
              <span className="text-xs opacity-75">s</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Full variant with separate cards
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <h3
          className={`text-sm font-semibold ${
            hasExpired
              ? 'text-gray-500'
              : isUrgent
              ? 'text-red-700'
              : 'text-gray-700'
          }`}
        >
          {label}
        </h3>
      )}

      {hasExpired ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-center">
          <span className="text-lg font-semibold text-gray-500">Termenul a expirat</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {/* Days */}
          <div
            className={`rounded-2xl p-4 text-center ${
              isUrgent
                ? 'bg-red-50 border-2 border-red-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div
              className={`text-3xl font-bold font-mono ${
                isUrgent ? 'text-red-700' : 'text-blue-600'
              }`}
            >
              {timeRemaining.days}
            </div>
            <div
              className={`text-xs font-medium mt-1 ${
                isUrgent ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              Zile
            </div>
          </div>

          {/* Hours */}
          <div
            className={`rounded-2xl p-4 text-center ${
              isUrgent
                ? 'bg-red-50 border-2 border-red-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div
              className={`text-3xl font-bold font-mono ${
                isUrgent ? 'text-red-700' : 'text-blue-600'
              }`}
            >
              {String(timeRemaining.hours).padStart(2, '0')}
            </div>
            <div
              className={`text-xs font-medium mt-1 ${
                isUrgent ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              Ore
            </div>
          </div>

          {/* Minutes */}
          <div
            className={`rounded-2xl p-4 text-center ${
              isUrgent
                ? 'bg-red-50 border-2 border-red-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div
              className={`text-3xl font-bold font-mono ${
                isUrgent ? 'text-red-700' : 'text-blue-600'
              }`}
            >
              {String(timeRemaining.minutes).padStart(2, '0')}
            </div>
            <div
              className={`text-xs font-medium mt-1 ${
                isUrgent ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              Minute
            </div>
          </div>

          {/* Seconds */}
          <div
            className={`rounded-2xl p-4 text-center ${
              isUrgent
                ? 'bg-red-50 border-2 border-red-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div
              className={`text-3xl font-bold font-mono ${
                isUrgent ? 'text-red-700' : 'text-blue-600'
              }`}
            >
              {String(timeRemaining.seconds).padStart(2, '0')}
            </div>
            <div
              className={`text-xs font-medium mt-1 ${
                isUrgent ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              Secunde
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
