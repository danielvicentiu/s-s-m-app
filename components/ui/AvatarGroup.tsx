'use client';

import { useState } from 'react';
import { Modal } from './Modal';

export interface AvatarUser {
  name: string;
  avatarUrl?: string | null;
}

interface AvatarGroupProps {
  users: AvatarUser[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const borderSizeClasses = {
  sm: 'border-2',
  md: 'border-2',
  lg: 'border-3',
};

export function AvatarGroup({ users, max = 4, size = 'md' }: AvatarGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!users || users.length === 0) {
    return null;
  }

  const displayedUsers = users.slice(0, max);
  const remainingCount = users.length - max;
  const hasMore = remainingCount > 0;

  const getInitials = (name: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  return (
    <>
      <div className="flex items-center">
        {displayedUsers.map((user, index) => (
          <div
            key={index}
            className="group relative"
            style={{ marginLeft: index === 0 ? 0 : '-0.5rem' }}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className={`${sizeClasses[size]} ${borderSizeClasses[size]} rounded-full border-white object-cover shadow-sm transition-transform hover:z-10 hover:scale-110`}
              />
            ) : (
              <div
                className={`${sizeClasses[size]} ${borderSizeClasses[size]} ${getAvatarColor(
                  user.name
                )} flex items-center justify-center rounded-full border-white font-semibold text-white shadow-sm transition-transform hover:z-10 hover:scale-110`}
              >
                {getInitials(user.name)}
              </div>
            )}
            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {user.name}
              <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        ))}

        {hasMore && (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`${sizeClasses[size]} ${borderSizeClasses[size]} -ml-2 flex items-center justify-center rounded-full border-white bg-gray-200 font-semibold text-gray-700 shadow-sm transition-all hover:z-10 hover:scale-110 hover:bg-gray-300`}
          >
            +{remainingCount}
          </button>
        )}
      </div>

      {/* Modal pentru lista completă */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Toți utilizatorii (${users.length})`}
        size="md"
      >
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div
                  className={`${getAvatarColor(
                    user.name
                  )} flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white shadow-sm`}
                >
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
