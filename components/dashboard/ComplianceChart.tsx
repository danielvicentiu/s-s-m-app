'use client';

import { useEffect, useState } from 'react';

interface ComplianceSegment {
  label: string;
  value: number;
  color: string;
}

interface ComplianceChartProps {
  ssmScore: number;
  psiScore: number;
  medicalScore: number;
  equipmentScore: number;
}

export default function ComplianceChart({
  ssmScore,
  psiScore,
  medicalScore,
  equipmentScore,
}: ComplianceChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate overall compliance score
  const overallScore = Math.round(
    (ssmScore + psiScore + medicalScore + equipmentScore) / 4
  );

  // Determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 50) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const segments: ComplianceSegment[] = [
    { label: 'SSM', value: ssmScore, color: '#3b82f6' }, // blue-500
    { label: 'PSI', value: psiScore, color: '#8b5cf6' }, // violet-500
    { label: 'Medical', value: medicalScore, color: '#06b6d4' }, // cyan-500
    { label: 'Echipamente', value: equipmentScore, color: '#ec4899' }, // pink-500
  ];

  // SVG donut chart configuration
  const size = 280;
  const strokeWidth = 40;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate segment paths
  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Calculate angles for each segment
  const totalValue = segments.reduce((sum, seg) => sum + seg.value, 0);
  let currentAngle = 0;
  const segmentPaths = segments.map((segment) => {
    const segmentAngle = (segment.value / totalValue) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + segmentAngle;
    currentAngle = endAngle;

    return {
      ...segment,
      path: createArc(startAngle, endAngle),
      startAngle,
      endAngle,
    };
  });

  const overallColor = getScoreColor(overallScore);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* SVG Donut Chart */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />

          {/* Segment paths */}
          {segmentPaths.map((segment, index) => (
            <path
              key={segment.label}
              d={segment.path}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                strokeDasharray: mounted ? 'none' : circumference,
                strokeDashoffset: mounted ? 0 : circumference,
                opacity: mounted ? 1 : 0,
                transitionDelay: `${index * 150}ms`,
              }}
            />
          ))}
        </svg>

        {/* Center score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-6xl font-bold transition-all duration-1000 ease-out"
            style={{
              color: overallColor,
              transform: mounted ? 'scale(1)' : 'scale(0)',
              opacity: mounted ? 1 : 0,
            }}
          >
            {overallScore}
          </div>
          <div className="text-sm font-medium text-gray-500 mt-1">
            Scor conformitate
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {segments.map((segment, index) => (
          <div
            key={segment.label}
            className="flex items-center space-x-3 transition-all duration-500 ease-out"
            style={{
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transitionDelay: `${600 + index * 100}ms`,
            }}
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-700">
                {segment.label}
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: getScoreColor(segment.value) }}
              >
                {segment.value}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status message */}
      <div
        className="text-center transition-all duration-500 ease-out"
        style={{
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          opacity: mounted ? 1 : 0,
          transitionDelay: '1000ms',
        }}
      >
        <p className="text-sm font-medium" style={{ color: overallColor }}>
          {overallScore >= 80 && '✓ Conformitate excelentă'}
          {overallScore >= 50 && overallScore < 80 && '⚠ Necesită atenție'}
          {overallScore < 50 && '✕ Acțiune urgentă necesară'}
        </p>
      </div>
    </div>
  );
}
