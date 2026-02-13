'use client';

import React from 'react';

export type TimelineStatus = 'completed' | 'pending' | 'overdue' | 'cancelled';

export interface TimelineItem {
  date: string | Date;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: TimelineStatus;
}

export interface TimelineProps {
  items: TimelineItem[];
  alignment?: 'left' | 'alternating';
  className?: string;
}

const statusConfig: Record<TimelineStatus, { dot: string; line: string; text: string }> = {
  completed: {
    dot: 'bg-green-500 ring-green-100',
    line: 'bg-green-200',
    text: 'text-green-700'
  },
  pending: {
    dot: 'bg-yellow-500 ring-yellow-100',
    line: 'bg-yellow-200',
    text: 'text-yellow-700'
  },
  overdue: {
    dot: 'bg-red-500 ring-red-100',
    line: 'bg-red-200',
    text: 'text-red-700'
  },
  cancelled: {
    dot: 'bg-gray-400 ring-gray-100',
    line: 'bg-gray-200',
    text: 'text-gray-600'
  }
};

export function Timeline({ items, alignment = 'left', className = '' }: TimelineProps) {
  if (items.length === 0) {
    return null;
  }

  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => {
        const status = item.status || 'pending';
        const config = statusConfig[status];
        const isLast = index === items.length - 1;
        const isAlternating = alignment === 'alternating';
        const isRight = isAlternating && index % 2 === 1;

        return (
          <div
            key={index}
            className={`relative flex gap-4 ${isAlternating ? 'justify-center' : ''} ${!isLast ? 'pb-8' : ''}`}
          >
            {/* Alternating: Left content */}
            {isAlternating && (
              <div className={`flex-1 ${isRight ? 'text-left' : 'text-right'}`}>
                {!isRight && (
                  <div className="pr-8">
                    <TimelineContent
                      item={item}
                      config={config}
                      formatDate={formatDate}
                      align="right"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Center: Dot and line */}
            <div className="relative flex flex-col items-center">
              {/* Dot with icon */}
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white ${config.dot}`}
              >
                {item.icon ? (
                  <span className="text-white text-sm">{item.icon}</span>
                ) : (
                  <span className="h-3 w-3 rounded-full bg-white" />
                )}
              </div>

              {/* Vertical line */}
              {!isLast && (
                <div
                  className={`absolute top-10 h-full w-0.5 ${config.line}`}
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
            </div>

            {/* Left-aligned or Alternating: Right content */}
            <div className={`flex-1 ${isAlternating ? 'text-left' : 'text-left'}`}>
              {(!isAlternating || isRight) && (
                <div className={isAlternating ? 'pl-8' : ''}>
                  <TimelineContent
                    item={item}
                    config={config}
                    formatDate={formatDate}
                    align="left"
                  />
                </div>
              )}
              {isAlternating && !isRight && <div />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface TimelineContentProps {
  item: TimelineItem;
  config: { dot: string; line: string; text: string };
  formatDate: (date: string | Date) => string;
  align: 'left' | 'right';
}

function TimelineContent({ item, config, formatDate, align }: TimelineContentProps) {
  return (
    <div className={`space-y-1 ${align === 'right' ? 'flex flex-col items-end' : ''}`}>
      <time className={`text-sm font-medium ${config.text}`}>
        {formatDate(item.date)}
      </time>
      <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
      {item.description && (
        <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
      )}
    </div>
  );
}
