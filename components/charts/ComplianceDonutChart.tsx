'use client'

import { useState, useEffect } from 'react'

interface ComplianceSegment {
  id: string
  label: string
  value: number
  color: string
}

interface ComplianceDonutChartProps {
  trainingsScore: number
  medicalScore: number
  equipmentScore: number
  documentsScore: number
  className?: string
}

export default function ComplianceDonutChart({
  trainingsScore,
  medicalScore,
  equipmentScore,
  documentsScore,
  className = ''
}: ComplianceDonutChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate overall score
  const overallScore = Math.round(
    (trainingsScore + medicalScore + equipmentScore + documentsScore) / 4
  )

  // Determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981' // green-500
    if (score >= 60) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  // Segments data
  const segments: ComplianceSegment[] = [
    {
      id: 'trainings',
      label: 'Instruire',
      value: trainingsScore,
      color: getScoreColor(trainingsScore)
    },
    {
      id: 'medical',
      label: 'Medical',
      value: medicalScore,
      color: getScoreColor(medicalScore)
    },
    {
      id: 'equipment',
      label: 'Echipamente',
      value: equipmentScore,
      color: getScoreColor(equipmentScore)
    },
    {
      id: 'documents',
      label: 'Documente',
      value: documentsScore,
      color: getScoreColor(documentsScore)
    }
  ]

  // SVG configuration
  const size = 300
  const centerX = size / 2
  const centerY = size / 2
  const radius = 100
  const strokeWidth = 40
  const innerRadius = radius - strokeWidth / 2

  // Calculate segment paths
  const calculatePath = (startAngle: number, endAngle: number): string => {
    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (endAngle - 90) * (Math.PI / 180)

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
    `
  }

  // Generate segment paths with angles
  let currentAngle = 0
  const segmentPaths = segments.map(segment => {
    const segmentAngle = (segment.value / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + segmentAngle
    currentAngle = endAngle

    return {
      ...segment,
      path: calculatePath(startAngle, endAngle),
      startAngle,
      endAngle,
      midAngle: startAngle + segmentAngle / 2
    }
  })

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
    const svg = e.currentTarget.ownerSVGElement
    if (svg) {
      const rect = svg.getBoundingClientRect()
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />

        {/* Segments */}
        {segmentPaths.map((segment, index) => (
          <path
            key={segment.id}
            d={segment.path}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              opacity:
                hoveredSegment === null || hoveredSegment === segment.id
                  ? mounted
                    ? 1
                    : 0
                  : 0.3,
              transform:
                hoveredSegment === segment.id
                  ? `scale(1.05)`
                  : 'scale(1)',
              transformOrigin: `${centerX}px ${centerY}px`,
              transition: 'all 0.3s ease',
              strokeDasharray: mounted ? 'none' : `0 ${2 * Math.PI * radius}`,
              animation: mounted
                ? `drawSegment${index} 1s ease-out forwards`
                : 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredSegment(segment.id)}
            onMouseLeave={() => setHoveredSegment(null)}
            onMouseMove={handleMouseMove}
          />
        ))}

        {/* Center circle background */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - strokeWidth / 2}
          fill="white"
          className="drop-shadow-lg"
        />

        {/* Center text - Overall score */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className="text-5xl font-bold"
          fill={getScoreColor(overallScore)}
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.5s ease 0.5s'
          }}
        >
          {overallScore}%
        </text>
        <text
          x={centerX}
          y={centerY + 20}
          textAnchor="middle"
          className="text-sm font-medium"
          fill="#6b7280"
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.5s ease 0.5s'
          }}
        >
          Conformitate
        </text>

        {/* Tooltip */}
        {hoveredSegment && (
          <g
            style={{
              pointerEvents: 'none'
            }}
          >
            <rect
              x={tooltipPosition.x + 10}
              y={tooltipPosition.y - 35}
              width="120"
              height="50"
              rx="8"
              fill="rgba(0, 0, 0, 0.9)"
              className="drop-shadow-xl"
            />
            <text
              x={tooltipPosition.x + 70}
              y={tooltipPosition.y - 15}
              textAnchor="middle"
              className="text-sm font-semibold"
              fill="white"
            >
              {segments.find(s => s.id === hoveredSegment)?.label}
            </text>
            <text
              x={tooltipPosition.x + 70}
              y={tooltipPosition.y + 5}
              textAnchor="middle"
              className="text-lg font-bold"
              fill={
                segments.find(s => s.id === hoveredSegment)?.color ||
                '#10b981'
              }
            >
              {segments.find(s => s.id === hoveredSegment)?.value}%
            </text>
          </g>
        )}
      </svg>

      {/* Animation keyframes */}
      <style jsx>{`
        ${segmentPaths
          .map(
            (segment, index) => `
          @keyframes drawSegment${index} {
            from {
              stroke-dasharray: 0 ${2 * Math.PI * radius};
            }
            to {
              stroke-dasharray: ${2 * Math.PI * radius} 0;
            }
          }
        `
          )
          .join('\n')}
      `}</style>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {segments.map(segment => (
          <div
            key={segment.id}
            className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70"
            onMouseEnter={() => setHoveredSegment(segment.id)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor: segment.color,
                boxShadow:
                  hoveredSegment === segment.id
                    ? `0 0 8px ${segment.color}`
                    : 'none',
                transition: 'box-shadow 0.2s ease'
              }}
            />
            <span className="text-sm font-medium text-gray-700">
              {segment.label}
            </span>
            <span
              className="text-sm font-bold ml-auto"
              style={{ color: segment.color }}
            >
              {segment.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
