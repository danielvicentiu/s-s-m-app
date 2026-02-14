'use client'

import { useState } from 'react'

interface DataPoint {
  month: string
  overall: number
  training: number
  medical: number
  equipment: number
}

interface TooltipData {
  month: string
  overall: number
  training: number
  medical: number
  equipment: number
  x: number
  y: number
}

export default function ComplianceTrendChart() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  // Generate mock data for last 12 months
  const generateMockData = (): DataPoint[] => {
    const months = [
      'Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun',
      'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'
    ]
    const currentMonth = new Date().getMonth()
    const data: DataPoint[] = []

    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      data.push({
        month: months[monthIndex],
        overall: 65 + Math.random() * 25,
        training: 60 + Math.random() * 30,
        medical: 70 + Math.random() * 25,
        equipment: 55 + Math.random() * 35
      })
    }

    return data
  }

  const data = generateMockData()

  // Chart dimensions
  const width = 800
  const height = 400
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Scale functions
  const xScale = (index: number) => {
    return padding.left + (index * chartWidth) / (data.length - 1)
  }

  const yScale = (value: number) => {
    const minValue = 0
    const maxValue = 100
    return (
      padding.top +
      chartHeight -
      ((value - minValue) / (maxValue - minValue)) * chartHeight
    )
  }

  // Generate path for a line
  const generatePath = (key: keyof Omit<DataPoint, 'month'>) => {
    return data
      .map((point, index) => {
        const x = xScale(index)
        const y = yScale(point[key])
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }

  // Target line at 80%
  const targetY = yScale(80)

  // Chart lines configuration
  const lines = [
    { key: 'overall' as const, color: '#3b82f6', label: 'Overall' },
    { key: 'training' as const, color: '#8b5cf6', label: 'Formare' },
    { key: 'medical' as const, color: '#10b981', label: 'Medical' },
    { key: 'equipment' as const, color: '#f59e0b', label: 'Echipamente' }
  ]

  // Handle hover
  const handleMouseMove = (
    e: React.MouseEvent<SVGElement>,
    index: number,
    point: DataPoint
  ) => {
    const svg = e.currentTarget.ownerSVGElement
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setTooltip({
      month: point.month,
      overall: point.overall,
      training: point.training,
      medical: point.medical,
      equipment: point.equipment,
      x,
      y
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Evoluție Score Compliance
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Ultimele 12 luni - scor per categorie
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {lines.map((line) => (
          <div key={line.key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span className="text-sm text-gray-700">{line.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-500" />
          <span className="text-sm text-gray-700">Target (80%)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          width={width}
          height={height}
          className="w-full h-auto"
          viewBox={`0 0 ${width} ${height}`}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          {[0, 20, 40, 60, 80, 100].map((value) => (
            <g key={value}>
              <line
                x1={padding.left}
                y1={yScale(value)}
                x2={width - padding.right}
                y2={yScale(value)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={yScale(value)}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-gray-600"
              >
                {value}%
              </text>
            </g>
          ))}

          {/* Target line at 80% */}
          <line
            x1={padding.left}
            y1={targetY}
            x2={width - padding.right}
            y2={targetY}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* X-axis labels */}
          {data.map((point, index) => (
            <text
              key={index}
              x={xScale(index)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {point.month}
            </text>
          ))}

          {/* Draw lines */}
          {lines.map((line) => (
            <path
              key={line.key}
              d={generatePath(line.key)}
              fill="none"
              stroke={line.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Interactive points */}
          {data.map((point, index) => (
            <g key={index}>
              {lines.map((line) => (
                <circle
                  key={line.key}
                  cx={xScale(index)}
                  cy={yScale(point[line.key])}
                  r="4"
                  fill={line.color}
                  className="cursor-pointer transition-all hover:r-6"
                  onMouseMove={(e) => handleMouseMove(e, index, point)}
                />
              ))}
              {/* Invisible hover area */}
              <rect
                x={xScale(index) - 20}
                y={padding.top}
                width="40"
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseMove={(e) => handleMouseMove(e, index, point)}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 bg-gray-900 text-white rounded-lg shadow-lg p-3 pointer-events-none"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y - 10}px`,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="text-sm font-semibold mb-2">{tooltip.month}</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Overall:</span>
                <span className="font-semibold">
                  {tooltip.overall.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Formare:</span>
                <span className="font-semibold">
                  {tooltip.training.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Medical:</span>
                <span className="font-semibold">
                  {tooltip.medical.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Echipamente:</span>
                <span className="font-semibold">
                  {tooltip.equipment.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Scorul de compliance este calculat pe baza: formare la zi, controale
          medicale valide și echipamente verificate.
        </p>
      </div>
    </div>
  )
}
