'use client';

import { useEffect, useState } from 'react';

interface DeadlineCountdownProps {
  deadline: Date;
  label: string;
  onExpired?: () => void;
}

export default function DeadlineCountdown({
  deadline,
  label,
  onExpired,
}: DeadlineCountdownProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  const calculateDaysRemaining = () => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    // Calculate initial value
    const days = calculateDaysRemaining();
    setDaysRemaining(days);

    if (days <= 0 && onExpired) {
      onExpired();
    }

    // Refresh every hour (3600000 ms)
    const interval = setInterval(() => {
      const updatedDays = calculateDaysRemaining();
      setDaysRemaining(updatedDays);

      if (updatedDays <= 0 && onExpired) {
        onExpired();
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [deadline, onExpired]);

  if (daysRemaining === null) {
    return null;
  }

  // Determine color and styling based on days remaining
  const getColorClasses = () => {
    if (daysRemaining <= 0) {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    if (daysRemaining < 7) {
      return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
    }
    if (daysRemaining <= 30) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const displayText =
    daysRemaining <= 0
      ? 'Expirat'
      : `${daysRemaining} ${daysRemaining === 1 ? 'zi rămasă' : 'zile rămase'}`;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${getColorClasses()}`}
    >
      <span className="text-xs font-normal opacity-80">{label}</span>
      <span className="font-semibold">{displayText}</span>
    </div>
  );
}
