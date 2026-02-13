'use client';

import React from 'react';

interface Threshold {
  value: number;
  color: string;
}

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  thresholds?: Threshold[];
  size?: number;
}

/**
 * GaugeChart - Semicircle gauge visualization with color zones
 * Used for displaying compliance scores and other percentage-based metrics
 */
export default function GaugeChart({
  value,
  min = 0,
  max = 100,
  label = 'Score',
  thresholds = [
    { value: 33, color: '#dc2626' }, // red-600
    { value: 66, color: '#f59e0b' }, // amber-500
    { value: 100, color: '#16a34a' }, // green-600
  ],
  size = 200,
}: GaugeChartProps) {
  // Clamp value between min and max
  const clampedValue = Math.min(Math.max(value, min), max);

  // Calculate percentage (0-100)
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  // Calculate angle for needle (-90° to 90°, total 180° for semicircle)
  const angle = -90 + (percentage / 100) * 180;

  // SVG configuration
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.12;
  const needleLength = radius - strokeWidth / 2;

  // Generate color arcs based on thresholds
  const generateArc = (startAngle: number, endAngle: number, color: string) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return {
      d: [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      ].join(' '),
      color,
    };
  };

  // Convert polar to cartesian coordinates
  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  // Calculate needle endpoint
  const needleEnd = polarToCartesian(centerX, centerY, needleLength, angle);

  // Generate threshold arcs
  const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);
  const arcs: Array<{ d: string; color: string }> = [];

  let prevAngle = -90;
  sortedThresholds.forEach((threshold) => {
    const thresholdAngle = -90 + (threshold.value / 100) * 180;
    if (thresholdAngle > prevAngle) {
      arcs.push(generateArc(prevAngle, thresholdAngle, threshold.color));
      prevAngle = thresholdAngle;
    }
  });

  // Determine current color based on value
  let currentColor = thresholds[0]?.color || '#16a34a';
  for (const threshold of sortedThresholds) {
    if (percentage <= threshold.value) {
      currentColor = threshold.color;
      break;
    }
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size * 0.65}
        viewBox={`0 0 ${size} ${size * 0.65}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={generateArc(-90, 90, '#e5e7eb').d}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Color threshold arcs */}
        {arcs.map((arc, index) => (
          <path
            key={index}
            d={arc.d}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}

        {/* Needle */}
        <g>
          {/* Needle shadow */}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleEnd.x + 1}
            y2={needleEnd.y + 1}
            stroke="#000000"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.1}
          />

          {/* Needle line */}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleEnd.x}
            y2={needleEnd.y}
            stroke={currentColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r={size * 0.04}
            fill={currentColor}
            stroke="white"
            strokeWidth={2}
          />
        </g>
      </svg>

      {/* Value display */}
      <div className="mt-2 text-center">
        <div
          className="text-3xl font-bold tabular-nums"
          style={{ color: currentColor }}
        >
          {Math.round(clampedValue)}
          <span className="text-lg text-gray-400">%</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}
