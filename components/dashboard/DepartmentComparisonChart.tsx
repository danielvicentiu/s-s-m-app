'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface DepartmentData {
  id: string
  name: string
  complianceScore: number
  employeeCount: number
}

interface DepartmentComparisonChartProps {
  departments: DepartmentData[]
  className?: string
}

export function DepartmentComparisonChart({
  departments,
  className = '',
}: DepartmentComparisonChartProps) {
  const router = useRouter()
  const [hoveredDept, setHoveredDept] = useState<string | null>(null)

  // Sort departments by compliance score descending
  const sortedDepartments = [...departments].sort(
    (a, b) => b.complianceScore - a.complianceScore
  )

  const getBarColor = (score: number): string => {
    if (score >= 80) return '#10b981' // green-500
    if (score >= 50) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  const getBarColorHover = (score: number): string => {
    if (score >= 80) return '#059669' // green-600
    if (score >= 50) return '#d97706' // amber-600
    return '#dc2626' // red-600
  }

  const handleDepartmentClick = (departmentId: string) => {
    router.push(`/dashboard/departments/${departmentId}`)
  }

  if (sortedDepartments.length === 0) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Comparație departamente
        </h2>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <p>Nu există date disponibile</p>
        </div>
      </div>
    )
  }

  const barHeight = 36
  const barSpacing = 20
  const chartHeight = sortedDepartments.length * (barHeight + barSpacing) + 20
  const maxWidth = 500
  const labelWidth = 180
  const chartWidth = maxWidth + labelWidth + 140

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Comparație departamente - Scor conformitate
      </h2>

      <svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="overflow-visible"
      >
        {sortedDepartments.map((dept, index) => {
          const y = index * (barHeight + barSpacing)
          const barWidth = (dept.complianceScore / 100) * maxWidth
          const isHovered = hoveredDept === dept.id

          return (
            <g
              key={dept.id}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredDept(dept.id)}
              onMouseLeave={() => setHoveredDept(null)}
              onClick={() => handleDepartmentClick(dept.id)}
            >
              {/* Department name */}
              <text
                x="0"
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="fill-gray-700 text-sm font-medium"
                style={{ fontSize: '14px' }}
              >
                {dept.name.length > 22
                  ? dept.name.substring(0, 22) + '...'
                  : dept.name}
              </text>

              {/* Bar background */}
              <rect
                x={labelWidth}
                y={y}
                width={maxWidth}
                height={barHeight}
                fill="#f3f4f6"
                rx="6"
              />

              {/* Colored bar */}
              <rect
                x={labelWidth}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={
                  isHovered
                    ? getBarColorHover(dept.complianceScore)
                    : getBarColor(dept.complianceScore)
                }
                rx="6"
                className="transition-all duration-200"
              />

              {/* Score percentage */}
              <text
                x={labelWidth + barWidth + 12}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="fill-gray-900 text-sm font-semibold"
                style={{ fontSize: '14px' }}
              >
                {dept.complianceScore.toFixed(0)}%
              </text>

              {/* Employee count label */}
              <text
                x={labelWidth + maxWidth + 70}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="fill-gray-500 text-xs"
                style={{ fontSize: '12px' }}
              >
                {dept.employeeCount} {dept.employeeCount === 1 ? 'angajat' : 'angajați'}
              </text>

              {/* Hover overlay effect */}
              {isHovered && (
                <rect
                  x={labelWidth - 5}
                  y={y - 2}
                  width={maxWidth + 10}
                  height={barHeight + 4}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  rx="8"
                  className="pointer-events-none"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }} />
            <span className="text-gray-600">≥80% Excelent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
            <span className="text-gray-600">50-79% Mediu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span className="text-gray-600">&lt;50% Critic</span>
          </div>
        </div>
      </div>
    </div>
  )
}
