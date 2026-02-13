'use client';

import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
};

/**
 * Generate a consistent color based on a string
 */
function generateColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Extract initials from a name
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function UserAvatar({ name, imageUrl, size = 'md' }: UserAvatarProps) {
  const sizeClass = sizeClasses[size];

  if (imageUrl) {
    return (
      <div className={`${sizeClass} relative rounded-full overflow-hidden flex-shrink-0`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes={size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'}
        />
      </div>
    );
  }

  const initials = getInitials(name);
  const bgColor = generateColorFromName(name);

  return (
    <div
      className={`${sizeClass} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      title={name}
    >
      {initials}
    </div>
  );
}
