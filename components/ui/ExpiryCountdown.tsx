import React from 'react';

interface ExpiryCountdownProps {
  expiryDate: Date;
  label: string;
}

export const ExpiryCountdown: React.FC<ExpiryCountdownProps> = ({
  expiryDate,
  label,
}) => {
  const now = new Date();
  const expiry = new Date(expiryDate);

  // Calculate days difference
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine color classes based on days remaining
  let colorClasses = '';
  let textContent = '';

  if (diffDays > 30) {
    colorClasses = 'text-green-600 bg-green-50 border-green-200';
    textContent = `${diffDays} zile`;
  } else if (diffDays >= 7 && diffDays <= 30) {
    colorClasses = 'text-yellow-600 bg-yellow-50 border-yellow-200';
    textContent = `${diffDays} zile`;
  } else if (diffDays > 0 && diffDays < 7) {
    colorClasses = 'text-red-600 bg-red-50 border-red-200';
    textContent = `${diffDays} zile`;
  } else {
    const expiredDays = Math.abs(diffDays);
    colorClasses = 'text-red-700 bg-red-100 border-red-300 font-bold';
    textContent = `Expirat acum ${expiredDays} zile`;
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm border ${colorClasses} w-fit`}
      >
        {textContent}
      </span>
    </div>
  );
};
