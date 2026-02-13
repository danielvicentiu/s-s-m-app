'use client';

import React, { useMemo, useState } from 'react';

interface HeatMapData {
  date: string; // ISO format: YYYY-MM-DD
  count: number;
}

interface HeatMapCalendarProps {
  data: HeatMapData[];
  year: number;
  colorScale?: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
  };
}

interface DayCell {
  date: Date;
  count: number;
  weekIndex: number;
  dayIndex: number;
}

const DEFAULT_COLOR_SCALE = {
  0: '#ebedf0', // No activity
  1: '#9be9a8', // Low activity
  2: '#40c463', // Medium activity
  3: '#30a14e', // High activity
  4: '#216e39', // Very high activity
};

const MONTHS = [
  'Ian',
  'Feb',
  'Mar',
  'Apr',
  'Mai',
  'Iun',
  'Iul',
  'Aug',
  'Sep',
  'Oct',
  'Noi',
  'Dec',
];

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function HeatMapCalendar({
  data,
  year,
  colorScale = DEFAULT_COLOR_SCALE,
}: HeatMapCalendarProps) {
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const { cells, monthPositions, maxCount } = useMemo(() => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Create a map for quick lookup
    const dataMap = new Map<string, number>();
    data.forEach(({ date, count }) => {
      dataMap.set(date, count);
    });

    // Find max count for scaling
    const max = Math.max(...data.map((d) => d.count), 1);

    // Generate all days in the year
    const allCells: DayCell[] = [];
    const monthPos: { month: string; x: number }[] = [];

    let currentDate = new Date(startDate);
    let weekIndex = 0;
    let lastMonth = -1;

    // Start from the first Sunday before or on Jan 1
    const firstDayOfWeek = startDate.getDay();
    if (firstDayOfWeek !== 0) {
      currentDate.setDate(currentDate.getDate() - firstDayOfWeek);
    }

    while (currentDate <= endDate || currentDate.getDay() !== 0) {
      const dayIndex = currentDate.getDay();

      // Track month positions
      if (currentDate.getDate() <= 7 && currentDate.getMonth() !== lastMonth) {
        monthPos.push({
          month: MONTHS[currentDate.getMonth()],
          x: weekIndex,
        });
        lastMonth = currentDate.getMonth();
      }

      // Only include dates within the year
      if (currentDate >= startDate && currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = dataMap.get(dateStr) || 0;

        allCells.push({
          date: new Date(currentDate),
          count,
          weekIndex,
          dayIndex,
        });
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() === 0 && currentDate > startDate) {
        weekIndex++;
      }
    }

    return {
      cells: allCells,
      monthPositions: monthPos,
      maxCount: max,
    };
  }, [data, year]);

  const getColor = (count: number): string => {
    if (count === 0) return colorScale[0];

    const intensity = count / maxCount;
    if (intensity <= 0.25) return colorScale[1];
    if (intensity <= 0.5) return colorScale[2];
    if (intensity <= 0.75) return colorScale[3];
    return colorScale[4];
  };

  const cellSize = 12;
  const cellGap = 2;
  const totalCellSize = cellSize + cellGap;
  const chartWidth = 53 * totalCellSize;
  const chartHeight = 7 * totalCellSize + 20; // Extra space for month labels

  return (
    <div className="relative">
      <svg
        width={chartWidth}
        height={chartHeight}
        className="font-sans"
      >
        {/* Month labels */}
        {monthPositions.map(({ month, x }) => (
          <text
            key={`month-${month}-${x}`}
            x={x * totalCellSize}
            y={10}
            className="text-xs fill-gray-600"
          >
            {month}
          </text>
        ))}

        {/* Day labels */}
        {DAYS.map((day, index) => (
          <text
            key={`day-${day}-${index}`}
            x={-8}
            y={20 + index * totalCellSize + cellSize / 2 + 4}
            className="text-xs fill-gray-600"
            textAnchor="end"
          >
            {index % 2 === 1 ? day : ''}
          </text>
        ))}

        {/* Heat map cells */}
        <g transform="translate(0, 20)">
          {cells.map((cell, index) => {
            const x = cell.weekIndex * totalCellSize;
            const y = cell.dayIndex * totalCellSize;
            const color = getColor(cell.count);

            return (
              <rect
                key={`cell-${index}`}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={color}
                className="transition-all duration-150 hover:stroke-gray-400 hover:stroke-2 cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    date: cell.date.toLocaleDateString('ro-RO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                    count: cell.count,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-medium">{tooltip.count} activități</div>
          <div className="text-xs text-gray-300">{tooltip.date}</div>
        </div>
      )}
    </div>
  );
}
