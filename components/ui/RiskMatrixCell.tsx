'use client'

import { useState } from 'react'

interface RiskMatrixCellProps {
  probability: 1 | 2 | 3 | 4 | 5
  severity: 1 | 2 | 3 | 4 | 5
  riskCount: number
  onClick?: () => void
}

/**
 * Celulă din matricea de risc SSM
 * Afișează numărul de riscuri pentru o combinație probabilitate × severitate
 * Culoarea celulei depinde de scorul de risc (P × S):
 * - 1-4: verde (risc scăzut)
 * - 5-9: galben (risc mediu)
 * - 10-15: portocaliu (risc ridicat)
 * - 16-25: roșu (risc critic)
 */
export default function RiskMatrixCell({
  probability,
  severity,
  riskCount,
  onClick
}: RiskMatrixCellProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const riskScore = probability * severity

  // Determină culoarea bazată pe scorul de risc
  const getCellColor = () => {
    if (riskScore >= 1 && riskScore <= 4) {
      return 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800'
    }
    if (riskScore >= 5 && riskScore <= 9) {
      return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800'
    }
    if (riskScore >= 10 && riskScore <= 15) {
      return 'bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-800'
    }
    // 16-25
    return 'bg-red-100 hover:bg-red-200 border-red-300 text-red-800'
  }

  // Determină eticheta de risc
  const getRiskLevel = () => {
    if (riskScore >= 1 && riskScore <= 4) return 'Scăzut'
    if (riskScore >= 5 && riskScore <= 9) return 'Mediu'
    if (riskScore >= 10 && riskScore <= 15) return 'Ridicat'
    return 'Critic'
  }

  const cellColor = getCellColor()
  const riskLevel = getRiskLevel()

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          relative w-16 h-16 rounded-lg border-2
          transition-all duration-200
          flex items-center justify-center
          font-semibold text-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${cellColor}
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
        `}
        disabled={!onClick}
        aria-label={`Risc ${riskLevel}: Probabilitate ${probability}, Severitate ${severity}, ${riskCount} ${riskCount === 1 ? 'risc' : 'riscuri'}`}
      >
        {riskCount > 0 ? riskCount : '—'}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="space-y-1">
            <div className="font-semibold">Risc {riskLevel}</div>
            <div className="text-gray-300">
              Scor: {riskScore} (P{probability} × S{severity})
            </div>
            <div className="text-gray-300">
              {riskCount} {riskCount === 1 ? 'risc identificat' : 'riscuri identificate'}
            </div>
          </div>
          {/* Arrow */}
          <div
            className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
            style={{
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)'
            }}
          />
        </div>
      )}
    </div>
  )
}
