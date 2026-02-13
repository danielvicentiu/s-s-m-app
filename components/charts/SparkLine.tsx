'use client';

import React from 'react';

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  className?: string;
}

export function SparkLine({
  data,
  width = 100,
  height = 24,
  color = '#3b82f6', // blue-600
  showArea = false,
  className = '',
}: SparkLineProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate min/max for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1; // Avoid division by zero

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return { x, y };
  });

  // Line path
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
    .join(' ');

  // Area path (if showArea is true)
  const areaPath = showArea
    ? `${linePath} L ${width},${height} L 0,${height} Z`
    : '';

  return (
    <svg
      width={width}
      height={height}
      className={`inline-block ${className}`}
      preserveAspectRatio="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      {showArea && (
        <path
          d={areaPath}
          fill={color}
          fillOpacity="0.2"
          strokeWidth="0"
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SparkLine;
