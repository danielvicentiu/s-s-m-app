'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  LucideIcon,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Activity
} from 'lucide-react';

// Map string icon names to actual Lucide icons
const iconMap: Record<string, LucideIcon> = {
  users: Users,
  'file-text': FileText,
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  clock: Clock,
  calendar: Calendar,
  activity: Activity,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
};

type TrendType = 'up' | 'down' | 'neutral';
type ColorType = 'green' | 'red' | 'yellow' | 'blue';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  trend?: TrendType;
  trendValue?: string;
  color?: ColorType;
}

const colorClasses: Record<ColorType, { bg: string; text: string; iconBg: string }> = {
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    iconBg: 'bg-red-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
};

const trendIcons: Record<TrendType, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors: Record<TrendType, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
};

export default function StatsCard({
  title,
  value,
  icon,
  trend = 'neutral',
  trendValue,
  color = 'blue',
}: StatsCardProps) {
  const IconComponent = iconMap[icon] || Activity;
  const TrendIcon = trendIcons[trend];
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>

          {trendValue && (
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-4 h-4 ${trendColors[trend]}`} />
              <span className={`text-sm font-medium ${trendColors[trend]}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>

        <div className={`${colors.iconBg} ${colors.text} p-3 rounded-xl`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
