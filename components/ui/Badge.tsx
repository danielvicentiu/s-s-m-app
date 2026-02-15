import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type StatusType = 'valid' | 'expiring' | 'expired' | 'active' | 'inactive' | 'pending';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-gray-50 text-gray-700 border-gray-200',
};

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-500',
};

const sizeStyles: Record<BadgeSize, { container: string; dot: string; text: string }> = {
  sm: {
    container: 'px-2 py-0.5 text-xs',
    dot: 'h-1.5 w-1.5',
    text: 'text-xs',
  },
  md: {
    container: 'px-2.5 py-1 text-sm',
    dot: 'h-2 w-2',
    text: 'text-sm',
  },
};

export function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full',
        variantStyles[variant],
        sizeStyles[size].container,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'rounded-full',
            dotStyles[variant],
            sizeStyles[size].dot
          )}
        />
      )}
      <span className={sizeStyles[size].text}>{label}</span>
    </span>
  );
}

// Predefined status mappings
export type StatusType = 'active' | 'expired' | 'pending' | 'draft';

const statusMapping: Record<StatusType, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Activ' },
  expired: { variant: 'danger', label: 'Expirat' },
  pending: { variant: 'warning', label: '├Än a╚Öteptare' },
  draft: { variant: 'neutral', label: 'Draft' },
};

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = 'md',
  dot = false,
  className,
}: StatusBadgeProps) {
  const { variant, label } = statusMapping[status];

  return (
    <Badge
      label={label}
      variant={variant}
      size={size}
      dot={dot}
      className={className}
    />
  );
}