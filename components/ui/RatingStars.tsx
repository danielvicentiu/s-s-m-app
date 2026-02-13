'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

export interface RatingStarsProps {
  /** Valoarea rating-ului (0-5) */
  value: number
  /** Callback pentru schimbarea valorii */
  onChange?: (value: number) => void
  /** Mod readonly (fără interacțiune) */
  readonly?: boolean
  /** Permite jumătăți de stele (0.5, 1.5, etc.) */
  allowHalf?: boolean
  /** Numărul total de stele */
  maxStars?: number
  /** Dimensiune: sm (16px), md (20px), lg (24px) */
  size?: 'sm' | 'md' | 'lg'
  /** Culoare stele active (Tailwind color class) */
  color?: string
  /** Afișează valoarea numerică */
  showValue?: boolean
  /** Clasă CSS personalizată */
  className?: string
}

export function RatingStars({
  value = 0,
  onChange,
  readonly = false,
  allowHalf = false,
  maxStars = 5,
  size = 'md',
  color = 'text-yellow-400',
  showValue = false,
  className = '',
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const isInteractive = !readonly && onChange

  // Dimensiuni pentru fiecare size
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  const handleMouseMove = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isInteractive) return

    if (allowHalf) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const isLeftHalf = x < rect.width / 2
      setHoverValue(index + (isLeftHalf ? 0.5 : 1))
    } else {
      setHoverValue(index + 1)
    }
  }

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverValue(null)
    }
  }

  const handleClick = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isInteractive) return

    let newValue: number
    if (allowHalf) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const isLeftHalf = x < rect.width / 2
      newValue = index + (isLeftHalf ? 0.5 : 1)
    } else {
      newValue = index + 1
    }

    onChange(newValue)
  }

  const renderStar = (index: number) => {
    const starValue = index + 1
    const fillPercentage = Math.max(0, Math.min(1, displayValue - index))

    const isFilled = fillPercentage === 1
    const isHalfFilled = fillPercentage > 0 && fillPercentage < 1
    const isEmpty = fillPercentage === 0

    return (
      <button
        key={index}
        type="button"
        onClick={(e) => handleClick(index, e)}
        onMouseMove={(e) => handleMouseMove(index, e)}
        onMouseLeave={handleMouseLeave}
        disabled={!isInteractive}
        className={`
          relative inline-flex items-center justify-center
          ${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
          transition-transform duration-150
          ${readonly ? '' : 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded'}
        `}
        aria-label={`Rating ${starValue} din ${maxStars}`}
      >
        {/* Stea de fundal (gri) */}
        <Star
          className={`${sizeClasses[size]} text-gray-300`}
          fill="currentColor"
          strokeWidth={0}
        />

        {/* Stea colorată (overlay) */}
        {(isFilled || isHalfFilled) && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              width: `${fillPercentage * 100}%`,
            }}
          >
            <Star
              className={`${sizeClasses[size]} ${color}`}
              fill="currentColor"
              strokeWidth={0}
            />
          </div>
        )}
      </button>
    )
  }

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
      </div>

      {showValue && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {displayValue.toFixed(allowHalf ? 1 : 0)} / {maxStars}
        </span>
      )}
    </div>
  )
}
