'use client'

import { useState } from 'react'

interface ExpandableTextProps {
  text: string
  maxLength?: number
  expandLabel?: string
  collapseLabel?: string
  className?: string
}

export default function ExpandableText({
  text,
  maxLength = 200,
  expandLabel = 'Citește mai mult',
  collapseLabel = 'Citește mai puțin',
  className = '',
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // If text is shorter than maxLength, show it all without button
  if (!text || text.length <= maxLength) {
    return <p className={className}>{text}</p>
  }

  const truncatedText = text.slice(0, maxLength).trim() + '...'

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap">
        {isExpanded ? text : truncatedText}
      </p>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
      >
        {isExpanded ? collapseLabel : expandLabel}
      </button>
    </div>
  )
}
