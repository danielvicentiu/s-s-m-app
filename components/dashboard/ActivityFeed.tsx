'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date | string;
  type: 'create' | 'update' | 'delete';
}

interface ActivityFeedProps {
  activities: Activity[];
}

const getTypeIcon = (type: Activity['type']) => {
  switch (type) {
    case 'create':
      return <Plus className="w-4 h-4 text-green-600" />;
    case 'update':
      return <Edit className="w-4 h-4 text-blue-600" />;
    case 'delete':
      return <Trash2 className="w-4 h-4 text-red-600" />;
  }
};

const getTypeColor = (type: Activity['type']) => {
  switch (type) {
    case 'create':
      return 'bg-green-50 border-green-200';
    case 'update':
      return 'bg-blue-50 border-blue-200';
    case 'delete':
      return 'bg-red-50 border-red-200';
  }
};

const getRelativeTime = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'acum câteva secunde';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? 'acum 1 minut' : `acum ${diffInMinutes} minute`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? 'acum 1 oră' : `acum ${diffInHours} ore`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? 'acum 1 zi' : `acum ${diffInDays} zile`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? 'acum 1 lună' : `acum ${diffInMonths} luni`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? 'acum 1 an' : `acum ${diffInYears} ani`;
};

const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, 10);

  return (
    <div className="space-y-4">
      {displayedActivities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Nu există activități recente</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {getInitials(activity.user)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      <span className="text-gray-600">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    {/* Type Icon */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${getTypeColor(
                        activity.type
                      )}`}
                    >
                      {getTypeIcon(activity.type)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Vezi mai multe button */}
          {activities.length > 10 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
            >
              Vezi mai multe ({activities.length - 10} activități)
            </button>
          )}

          {showAll && activities.length > 10 && (
            <button
              onClick={() => setShowAll(false)}
              className="w-full py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Arată mai puțin
            </button>
          )}
        </>
      )}
    </div>
  );
}
