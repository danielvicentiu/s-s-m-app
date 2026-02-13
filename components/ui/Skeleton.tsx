import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  count?: number;
  animated?: boolean;
  className?: string;
}

/**
 * Skeleton component for loading states
 * Supports text, circle, and rectangle variants with customizable dimensions
 */
export function Skeleton({
  variant = 'rect',
  width,
  height,
  count = 1,
  animated = true,
  className,
}: SkeletonProps) {
  const baseClasses = [
    'bg-gray-200',
    animated && 'animate-pulse',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circle':
        return 'rounded-full';
      case 'rect':
      default:
        return 'rounded-lg';
    }
  };

  const getStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (width) {
      styles.width = typeof width === 'number' ? `${width}px` : width;
    }

    if (height) {
      styles.height = typeof height === 'number' ? `${height}px` : height;
    }

    // Default dimensions for circle variant
    if (variant === 'circle' && !width && !height) {
      styles.width = '40px';
      styles.height = '40px';
    }

    return styles;
  };

  const skeletonElement = (
    <div
      className={`${baseClasses} ${getVariantClasses()}`}
      style={getStyles()}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={index < count - 1 ? 'mb-2' : ''}>
          {skeletonElement}
        </div>
      ))}
    </>
  );
}

/**
 * Preset: Skeleton for card components
 * Displays a typical card layout with header and content
 */
export function SkeletonCard({ animated = true }: { animated?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {/* Card header */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton variant="text" width="40%" height={24} animated={animated} />
        <Skeleton variant="circle" width={32} height={32} animated={animated} />
      </div>

      {/* Card content */}
      <div className="space-y-3">
        <Skeleton variant="text" width="100%" animated={animated} />
        <Skeleton variant="text" width="90%" animated={animated} />
        <Skeleton variant="text" width="75%" animated={animated} />
      </div>

      {/* Card footer */}
      <div className="mt-6 flex gap-3">
        <Skeleton variant="rect" width={100} height={36} animated={animated} />
        <Skeleton variant="rect" width={100} height={36} animated={animated} />
      </div>
    </div>
  );
}

/**
 * Preset: Skeleton for table rows
 * Displays a table row with multiple columns
 */
export function SkeletonTableRow({
  columns = 4,
  animated = true,
}: {
  columns?: number;
  animated?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      {Array.from({ length: columns }).map((_, index) => (
        <div
          key={index}
          className={index === 0 ? 'flex-shrink-0 w-12' : 'flex-1'}
        >
          {index === 0 ? (
            <Skeleton variant="circle" width={40} height={40} animated={animated} />
          ) : (
            <Skeleton
              variant="text"
              width={index === columns - 1 ? '60%' : '100%'}
              animated={animated}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Preset: Skeleton for table with multiple rows
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  animated = true,
}: {
  rows?: number;
  columns?: number;
  animated?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      {/* Table header */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className={index === 0 ? 'flex-shrink-0 w-12' : 'flex-1'}>
            <Skeleton
              variant="text"
              width={index === 0 ? 40 : '50%'}
              height={16}
              animated={animated}
            />
          </div>
        ))}
      </div>

      {/* Table rows */}
      <div className="divide-y divide-gray-100 px-6">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonTableRow key={index} columns={columns} animated={animated} />
        ))}
      </div>
    </div>
  );
}

/**
 * Preset: Skeleton for profile/user information
 * Displays avatar, name, and details
 */
export function SkeletonProfile({ animated = true }: { animated?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <Skeleton variant="circle" width={64} height={64} animated={animated} />

      {/* Profile info */}
      <div className="flex-1 space-y-3">
        {/* Name */}
        <Skeleton variant="text" width="40%" height={24} animated={animated} />

        {/* Role/subtitle */}
        <Skeleton variant="text" width="30%" height={16} animated={animated} />

        {/* Description lines */}
        <div className="space-y-2 pt-2">
          <Skeleton variant="text" width="100%" animated={animated} />
          <Skeleton variant="text" width="85%" animated={animated} />
          <Skeleton variant="text" width="70%" animated={animated} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Skeleton variant="rect" width={120} height={36} animated={animated} />
          <Skeleton variant="rect" width={100} height={36} animated={animated} />
        </div>
      </div>
    </div>
  );
}
