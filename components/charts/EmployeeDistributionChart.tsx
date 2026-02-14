'use client';

import { useState } from 'react';

interface DepartmentData {
  department: string;
  count: number;
}

interface EmployeeDistributionChartProps {
  data: DepartmentData[];
  className?: string;
}

export default function EmployeeDistributionChart({
  data,
  className = '',
}: EmployeeDistributionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort data descending by count
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Calculate total for percentages
  const total = sortedData.reduce((sum, item) => sum + item.count, 0);

  // Find max value for scaling
  const maxValue = Math.max(...sortedData.map((item) => item.count), 1);

  // Chart dimensions
  const barHeight = 40;
  const barGap = 16;
  const chartHeight = sortedData.length * (barHeight + barGap);
  const labelWidth = 200;
  const chartWidth = 600;
  const barMaxWidth = chartWidth - labelWidth - 80; // Reserve space for count label

  // Color gradient function
  const getBarColor = (index: number): string => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-indigo-500 to-indigo-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-rose-500 to-rose-600',
      'from-orange-500 to-orange-600',
      'from-amber-500 to-amber-600',
      'from-yellow-500 to-yellow-600',
      'from-lime-500 to-lime-600',
      'from-green-500 to-green-600',
      'from-emerald-500 to-emerald-600',
      'from-teal-500 to-teal-600',
      'from-cyan-500 to-cyan-600',
      'from-sky-500 to-sky-600',
    ];
    return colors[index % colors.length];
  };

  // Get solid color for SVG (fallback)
  const getSolidColor = (index: number): string => {
    const colors = [
      '#3B82F6', '#6366F1', '#A855F7', '#EC4899',
      '#F43F5E', '#F97316', '#F59E0B', '#EAB308',
      '#84CC16', '#22C55E', '#10B981', '#14B8A6',
      '#06B6D4', '#0EA5E9',
    ];
    return colors[index % colors.length];
  };

  if (sortedData.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 text-gray-400 ${className}`}>
        Nu există date disponibile
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-x-auto ${className}`}>
      <svg
        width="100%"
        height={chartHeight + 20}
        viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
        className="max-w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {sortedData.map((_, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`bar-gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={getSolidColor(index)} stopOpacity="0.9" />
              <stop offset="100%" stopColor={getSolidColor(index)} stopOpacity="1" />
            </linearGradient>
          ))}
        </defs>

        {sortedData.map((item, index) => {
          const y = index * (barHeight + barGap) + 10;
          const barWidth = (item.count / maxValue) * barMaxWidth;
          const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0';
          const isHovered = hoveredIndex === index;

          return (
            <g key={`bar-${index}`}>
              {/* Department label (left) */}
              <text
                x="10"
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-sm font-medium fill-gray-700"
                style={{ fontSize: '14px' }}
              >
                {item.department.length > 25
                  ? `${item.department.substring(0, 25)}...`
                  : item.department}
              </text>

              {/* Bar */}
              <rect
                x={labelWidth}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={`url(#bar-gradient-${index})`}
                rx="8"
                ry="8"
                className="transition-all duration-300 cursor-pointer"
                opacity={isHovered ? 0.8 : 1}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {/* Count label (right of bar) */}
              <text
                x={labelWidth + barWidth + 10}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-sm font-semibold fill-gray-900"
                style={{ fontSize: '14px' }}
              >
                {item.count}
              </text>

              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={labelWidth + barWidth / 2 - 60}
                    y={y - 35}
                    width="120"
                    height="30"
                    fill="rgba(0, 0, 0, 0.85)"
                    rx="6"
                    ry="6"
                  />
                  <text
                    x={labelWidth + barWidth / 2}
                    y={y - 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-white"
                    style={{ fontSize: '12px' }}
                  >
                    {item.count} angajați ({percentage}%)
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
