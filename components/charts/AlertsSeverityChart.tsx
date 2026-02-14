// components/charts/AlertsSeverityChart.tsx
// Pie chart SVG pure pentru distribuția alertelor per severity
// Segmente clickable pentru filtrare, animații, total central, legend

'use client'

import { useEffect, useState, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { AlertSeverity } from '@/lib/types'

// ========== TYPES ==========

interface SeverityData {
  severity: AlertSeverity
  count: number
  label: string
  color: string
}

interface ChartData {
  segments: SeverityData[]
  total: number
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  data: SeverityData | null
}

// ========== CONSTANTS ==========

const SEVERITY_CONFIG: Record<AlertSeverity, { label: string; color: string; hoverColor: string }> = {
  critical: { label: 'Critice', color: '#dc2626', hoverColor: '#b91c1c' }, // red-600/700
  warning: { label: 'Avertismente', color: '#f59e0b', hoverColor: '#d97706' }, // amber-500/600
  info: { label: 'Info', color: '#3b82f6', hoverColor: '#2563eb' }, // blue-500/600
  expired: { label: 'Expirate', color: '#6b7280', hoverColor: '#4b5563' } // gray-500/600
}

// ========== COMPONENT ==========

export default function AlertsSeverityChart({
  onSegmentClick
}: {
  onSegmentClick?: (severity: AlertSeverity | null) => void
}) {
  const supabase = createSupabaseBrowser()
  const svgRef = useRef<SVGSVGElement>(null)
  const [chartData, setChartData] = useState<ChartData>({ segments: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | null>(null)
  const [hoveredSeverity, setHoveredSeverity] = useState<AlertSeverity | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null
  })
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })
  const [animationProgress, setAnimationProgress] = useState(0)

  // ========== FETCH DATA ==========

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true)

        // Fetch alerts with severity counts
        const { data: alerts, error } = await supabase
          .from('alerts')
          .select('severity')

        if (error) throw error

        // Aggregate counts per severity
        const counts: Record<string, number> = {
          critical: 0,
          warning: 0,
          info: 0,
          expired: 0
        }

        alerts?.forEach(alert => {
          if (alert.severity && alert.severity in counts) {
            counts[alert.severity]++
          }
        })

        // Build segments array
        const segments: SeverityData[] = (Object.keys(SEVERITY_CONFIG) as AlertSeverity[])
          .map(severity => ({
            severity,
            count: counts[severity] || 0,
            label: SEVERITY_CONFIG[severity].label,
            color: SEVERITY_CONFIG[severity].color
          }))
          .filter(seg => seg.count > 0) // Only show segments with data

        const total = segments.reduce((sum, seg) => sum + seg.count, 0)

        setChartData({ segments, total })
      } catch (err) {
        console.error('[ALERTS_SEVERITY_CHART] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  // ========== ANIMATION ==========

  useEffect(() => {
    if (loading || chartData.segments.length === 0) return

    let frame = 0
    const totalFrames = 60
    const animate = () => {
      frame++
      setAnimationProgress(Math.min(frame / totalFrames, 1))
      if (frame < totalFrames) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [loading, chartData.segments.length])

  // ========== RESPONSIVE RESIZE ==========

  useEffect(() => {
    function handleResize() {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          const size = Math.min(container.clientWidth, container.clientHeight, 400)
          setDimensions({ width: size, height: size })
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ========== PIE CHART CALCULATIONS ==========

  const centerX = dimensions.width / 2
  const centerY = dimensions.height / 2
  const radius = Math.min(dimensions.width, dimensions.height) / 2 - 40
  const innerRadius = radius * 0.5 // Donut style for center label

  // Calculate pie segments
  const segments = chartData.segments.map((data, index) => {
    const percentage = data.count / chartData.total
    const startAngle = chartData.segments
      .slice(0, index)
      .reduce((sum, seg) => sum + (seg.count / chartData.total) * 2 * Math.PI, -Math.PI / 2)
    const endAngle = startAngle + percentage * 2 * Math.PI * animationProgress

    return {
      ...data,
      startAngle,
      endAngle,
      percentage
    }
  })

  // Generate SVG path for donut segment
  const getSegmentPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const x1 = centerX + outerRadius * Math.cos(startAngle)
    const y1 = centerY + outerRadius * Math.sin(startAngle)
    const x2 = centerX + outerRadius * Math.cos(endAngle)
    const y2 = centerY + outerRadius * Math.sin(endAngle)
    const x3 = centerX + innerRadius * Math.cos(endAngle)
    const y3 = centerY + innerRadius * Math.sin(endAngle)
    const x4 = centerX + innerRadius * Math.cos(startAngle)
    const y4 = centerY + innerRadius * Math.sin(startAngle)

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `
  }

  // ========== INTERACTION HANDLERS ==========

  const handleSegmentClick = (severity: AlertSeverity) => {
    const newSelection = selectedSeverity === severity ? null : severity
    setSelectedSeverity(newSelection)
    onSegmentClick?.(newSelection)
  }

  const handleSegmentHover = (severity: AlertSeverity | null, e?: React.MouseEvent) => {
    setHoveredSeverity(severity)

    if (severity && e) {
      const data = chartData.segments.find(s => s.severity === severity)
      if (data) {
        setTooltip({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          data
        })
      }
    } else {
      setTooltip({ visible: false, x: 0, y: 0, data: null })
    }
  }

  const handleMouseMove = (e: React.MouseEvent, severity: AlertSeverity) => {
    setTooltip(prev => ({
      ...prev,
      x: e.clientX,
      y: e.clientY
    }))
  }

  // ========== RENDER ==========

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (chartData.segments.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Nu există alerte disponibile
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* SVG Pie Chart */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      >
        {/* Pie segments */}
        {segments.map(segment => {
          const isHovered = hoveredSeverity === segment.severity
          const isSelected = selectedSeverity === segment.severity
          const currentRadius = isHovered ? radius + 8 : radius
          const config = SEVERITY_CONFIG[segment.severity]
          const fillColor = isHovered ? config.hoverColor : config.color

          return (
            <g key={segment.severity}>
              {/* Segment path */}
              <path
                d={getSegmentPath(segment.startAngle, segment.endAngle, currentRadius, innerRadius)}
                fill={fillColor}
                stroke="white"
                strokeWidth={isSelected ? 4 : 2}
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isSelected ? 'brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.2))' : 'none',
                  opacity: selectedSeverity && !isSelected ? 0.5 : 1
                }}
                onClick={() => handleSegmentClick(segment.severity)}
                onMouseEnter={(e) => handleSegmentHover(segment.severity, e)}
                onMouseLeave={() => handleSegmentHover(null)}
                onMouseMove={(e) => handleMouseMove(e, segment.severity)}
              />

              {/* Count label on segment */}
              {segment.percentage > 0.1 && animationProgress === 1 && (
                <text
                  x={centerX + (radius * 0.7) * Math.cos((segment.startAngle + segment.endAngle) / 2)}
                  y={centerY + (radius * 0.7) * Math.sin((segment.startAngle + segment.endAngle) / 2)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-white font-bold text-sm pointer-events-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {segment.count}
                </text>
              )}
            </g>
          )
        })}

        {/* Center circle for total */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="white"
          className="pointer-events-none"
        />

        {/* Total count in center */}
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-3xl font-bold fill-gray-900"
        >
          {chartData.total}
        </text>
        <text
          x={centerX}
          y={centerY + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm fill-gray-600"
        >
          Total Alerte
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center px-4">
        {chartData.segments.map(segment => {
          const isSelected = selectedSeverity === segment.severity
          const percentage = ((segment.count / chartData.total) * 100).toFixed(1)

          return (
            <button
              key={segment.severity}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'bg-gray-100 ring-2 ring-gray-400'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSegmentClick(segment.severity)}
              onMouseEnter={(e) => handleSegmentHover(segment.severity, e)}
              onMouseLeave={() => handleSegmentHover(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {segment.label}
              </span>
              <span className="text-xs text-gray-500">
                ({segment.count} · {percentage}%)
              </span>
            </button>
          )
        })}
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl px-3 py-2 pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 60,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tooltip.data.color }}
            />
            <span className="text-sm font-semibold text-gray-900">
              {tooltip.data.label}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Count: <span className="font-semibold text-gray-900">{tooltip.data.count}</span>
          </div>
          <div className="text-xs text-gray-600">
            Procent: <span className="font-semibold text-gray-900">
              {((tooltip.data.count / chartData.total) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
