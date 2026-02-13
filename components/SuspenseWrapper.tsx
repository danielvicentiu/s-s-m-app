'use client';

import React, { ReactNode, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Default skeleton loader component
const DefaultFallback = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-32 bg-gray-200 rounded-lg"></div>
  </div>
);

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * SuspenseWrapper - Reusable component combining React.Suspense with ErrorBoundary
 *
 * @param children - Child components to wrap
 * @param fallback - Optional custom loading fallback (defaults to skeleton loader)
 * @param errorFallback - Optional custom error fallback
 * @param onError - Optional error handler callback
 *
 * @example
 * <SuspenseWrapper>
 *   <AsyncComponent />
 * </SuspenseWrapper>
 *
 * @example
 * <SuspenseWrapper fallback={<CustomLoader />}>
 *   <AsyncComponent />
 * </SuspenseWrapper>
 */
export function SuspenseWrapper({
  children,
  fallback,
  errorFallback,
  onError,
}: SuspenseWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
      <Suspense fallback={fallback || <DefaultFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

interface SuspenseListProps {
  children: ReactNode[];
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  revealOrder?: 'forwards' | 'backwards' | 'together';
}

/**
 * SuspenseList - Wrapper for parallel loading multiple components
 *
 * Wraps each child in its own SuspenseWrapper for independent loading and error handling
 *
 * @param children - Array of child components to wrap
 * @param fallback - Optional custom loading fallback for each item
 * @param errorFallback - Optional custom error fallback for each item
 * @param onError - Optional error handler callback
 * @param revealOrder - Order in which to reveal loaded components (forwards, backwards, together)
 *
 * @example
 * <SuspenseList>
 *   {[
 *     <AsyncComponent1 key="1" />,
 *     <AsyncComponent2 key="2" />,
 *     <AsyncComponent3 key="3" />
 *   ]}
 * </SuspenseList>
 *
 * @example
 * <SuspenseList revealOrder="forwards" fallback={<CustomLoader />}>
 *   {items.map(item => <AsyncItem key={item.id} item={item} />)}
 * </SuspenseList>
 */
export function SuspenseList({
  children,
  fallback,
  errorFallback,
  onError,
  revealOrder = 'together',
}: SuspenseListProps) {
  const childArray = React.Children.toArray(children);

  // Note: React.SuspenseList is experimental and not available in stable React
  // We use a simple wrapper approach instead
  return (
    <div className="space-y-4" data-reveal-order={revealOrder}>
      {childArray.map((child, index) => (
        <SuspenseWrapper
          key={index}
          fallback={fallback}
          errorFallback={errorFallback}
          onError={onError}
        >
          {child}
        </SuspenseWrapper>
      ))}
    </div>
  );
}

// Additional skeleton variants for different use cases
export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

export const SkeletonTable = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
    </div>
    <div className="divide-y divide-gray-200">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="px-6 py-4 flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonForm = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
    <div className="flex gap-3 pt-4">
      <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
    </div>
  </div>
);

export const SkeletonList = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);
