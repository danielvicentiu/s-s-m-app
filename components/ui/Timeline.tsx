'use client';

import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  LucideIcon
} from 'lucide-react';

export interface TimelineEvent {
  id?: string;
  timestamp: string | Date;
  title: string;
  description?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple' | 'orange';
}

interface TimelineProps {
  events: TimelineEvent[];
  layout?: 'alternating' | 'single';
  className?: string;
}

const colorClasses = {
  blue: {
    dot: 'bg-blue-600 ring-blue-100',
    icon: 'text-blue-600',
    line: 'bg-blue-200'
  },
  green: {
    dot: 'bg-green-600 ring-green-100',
    icon: 'text-green-600',
    line: 'bg-green-200'
  },
  red: {
    dot: 'bg-red-600 ring-red-100',
    icon: 'text-red-600',
    line: 'bg-red-200'
  },
  yellow: {
    dot: 'bg-yellow-600 ring-yellow-100',
    icon: 'text-yellow-600',
    line: 'bg-yellow-200'
  },
  gray: {
    dot: 'bg-gray-600 ring-gray-100',
    icon: 'text-gray-600',
    line: 'bg-gray-200'
  },
  purple: {
    dot: 'bg-purple-600 ring-purple-100',
    icon: 'text-purple-600',
    line: 'bg-purple-200'
  },
  orange: {
    dot: 'bg-orange-600 ring-orange-100',
    icon: 'text-orange-600',
    line: 'bg-orange-200'
  }
};

const defaultIconMap = {
  blue: Info,
  green: CheckCircle2,
  red: XCircle,
  yellow: AlertCircle,
  gray: Clock,
  purple: Info,
  orange: AlertCircle
};

function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes === 0) {
        return 'Acum';
      }
      return `Acum ${minutes} min`;
    }
    return `Acum ${hours}h`;
  }

  if (days === 1) {
    return 'Ieri';
  }

  if (days < 7) {
    return `Acum ${days} zile`;
  }

  return date.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export function Timeline({
  events,
  layout = 'single',
  className = ''
}: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-sm">Nu există evenimente</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {layout === 'alternating' ? (
        <div className="space-y-8">
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            const color = event.color || 'blue';
            const colors = colorClasses[color];
            const IconComponent = event.icon || defaultIconMap[color];

            return (
              <div key={event.id || index} className="relative">
                {/* Center line */}
                {index < events.length - 1 && (
                  <div className="absolute left-1/2 top-8 w-0.5 h-full -translate-x-1/2 bg-gray-200" />
                )}

                {/* Content container */}
                <div className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Left/Right content */}
                  <div className="flex-1 px-4">
                    {isLeft && (
                      <TimelineCard
                        event={event}
                        color={color}
                        align="right"
                      />
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className={`w-10 h-10 rounded-full ring-4 ${colors.dot} flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 text-white`} />
                    </div>
                  </div>

                  {/* Right/Left content */}
                  <div className="flex-1 px-4">
                    {!isLeft && (
                      <TimelineCard
                        event={event}
                        color={color}
                        align="left"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6 ml-4 md:ml-8">
          {events.map((event, index) => {
            const color = event.color || 'blue';
            const colors = colorClasses[color];
            const IconComponent = event.icon || defaultIconMap[color];

            return (
              <div key={event.id || index} className="relative">
                {/* Vertical line */}
                {index < events.length - 1 && (
                  <div className={`absolute left-0 top-10 w-0.5 h-full ${colors.line}`} />
                )}

                {/* Event item */}
                <div className="flex gap-4">
                  {/* Dot and icon */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className={`w-10 h-10 rounded-full ring-4 ${colors.dot} flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 text-white`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <TimelineCard
                      event={event}
                      color={color}
                      align="left"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface TimelineCardProps {
  event: TimelineEvent;
  color: string;
  align: 'left' | 'right';
}

function TimelineCard({ event, color, align }: TimelineCardProps) {
  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow ${
      align === 'right' ? 'text-right' : 'text-left'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <span className="text-xs text-gray-500 font-medium">
            {formatTimestamp(event.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}
