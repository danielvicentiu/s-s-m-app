'use client'

import { ReactNode } from 'react'

type EmptyStateVariant = 'no-data' | 'no-results' | 'error' | 'first-time'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  variant?: EmptyStateVariant
}

// SVG Illustrations pentru fiecare variantă
const NoDataIllustration = () => (
  <svg
    className="w-32 h-32 mb-6"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="80" fill="#F3F4F6" />
    <path
      d="M100 60v80M60 100h80"
      stroke="#9CA3AF"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.3"
    />
    <rect
      x="70"
      y="85"
      width="60"
      height="30"
      rx="4"
      fill="white"
      stroke="#D1D5DB"
      strokeWidth="2"
    />
    <circle cx="85" cy="100" r="3" fill="#9CA3AF" />
    <circle cx="100" cy="100" r="3" fill="#9CA3AF" />
    <circle cx="115" cy="100" r="3" fill="#9CA3AF" />
  </svg>
)

const NoResultsIllustration = () => (
  <svg
    className="w-32 h-32 mb-6"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="85" cy="85" r="40" fill="white" stroke="#D1D5DB" strokeWidth="3" />
    <path
      d="M115 115l25 25"
      stroke="#D1D5DB"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M70 85h30M85 70v30"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
)

const ErrorIllustration = () => (
  <svg
    className="w-32 h-32 mb-6"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="80" fill="#FEF2F2" />
    <circle cx="100" cy="100" r="50" fill="white" stroke="#FCA5A5" strokeWidth="3" />
    <path
      d="M85 85l30 30M115 85l-30 30"
      stroke="#EF4444"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)

const FirstTimeIllustration = () => (
  <svg
    className="w-32 h-32 mb-6"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="80" fill="#EFF6FF" />
    <path
      d="M100 70v60M70 100h60"
      stroke="#3B82F6"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="100" cy="100" r="50" fill="white" stroke="#BFDBFE" strokeWidth="2" />
    <path
      d="M85 100l10 10 20-20"
      stroke="#3B82F6"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
    />
  </svg>
)

const getDefaultIllustration = (variant?: EmptyStateVariant) => {
  switch (variant) {
    case 'no-data':
      return <NoDataIllustration />
    case 'no-results':
      return <NoResultsIllustration />
    case 'error':
      return <ErrorIllustration />
    case 'first-time':
      return <FirstTimeIllustration />
    default:
      return <NoDataIllustration />
  }
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'no-data',
}: EmptyStateProps) {
  const illustration = icon || getDefaultIllustration(variant)

  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Icon or Illustration */}
        <div className="mb-4">{illustration}</div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>

        {/* Description */}
        {description && (
          <p className="mb-6 text-sm text-gray-500 leading-relaxed">
            {description}
          </p>
        )}

        {/* Action Button */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

// Named export pentru backwards compatibility
export { EmptyState }
