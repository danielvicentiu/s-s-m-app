import React from 'react';
import { X } from 'lucide-react';

type TagColor = 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'purple';
type TagVariant = 'solid' | 'outline';
type TagSize = 'sm' | 'md';

interface TagProps {
  label: string;
  color?: TagColor;
  variant?: TagVariant;
  size?: TagSize;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const colorStyles: Record<TagColor, { solid: string; outline: string }> = {
  blue: {
    solid: 'bg-blue-100 text-blue-700 border-blue-200',
    outline: 'bg-white text-blue-700 border-blue-300',
  },
  green: {
    solid: 'bg-green-100 text-green-700 border-green-200',
    outline: 'bg-white text-green-700 border-green-300',
  },
  amber: {
    solid: 'bg-amber-100 text-amber-700 border-amber-200',
    outline: 'bg-white text-amber-700 border-amber-300',
  },
  red: {
    solid: 'bg-red-100 text-red-700 border-red-200',
    outline: 'bg-white text-red-700 border-red-300',
  },
  gray: {
    solid: 'bg-gray-100 text-gray-700 border-gray-200',
    outline: 'bg-white text-gray-700 border-gray-300',
  },
  purple: {
    solid: 'bg-purple-100 text-purple-700 border-purple-200',
    outline: 'bg-white text-purple-700 border-purple-300',
  },
};

const sizeStyles: Record<TagSize, { container: string; text: string; icon: string; remove: string }> = {
  sm: {
    container: 'px-2 py-0.5 gap-1',
    text: 'text-xs',
    icon: 'w-3 h-3',
    remove: 'w-3 h-3 ml-0.5',
  },
  md: {
    container: 'px-3 py-1 gap-1.5',
    text: 'text-sm',
    icon: 'w-4 h-4',
    remove: 'w-4 h-4 ml-1',
  },
};

export default function Tag({
  label,
  color = 'gray',
  variant = 'solid',
  size = 'md',
  onRemove,
  icon,
  className = '',
}: TagProps) {
  const colorClass = colorStyles[color][variant];
  const sizeClass = sizeStyles[size];

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full border font-medium
        ${colorClass}
        ${sizeClass.container}
        ${sizeClass.text}
        ${className}
      `.trim()}
    >
      {icon && (
        <span className={`flex-shrink-0 ${sizeClass.icon}`}>
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`
            flex-shrink-0 hover:opacity-70 transition-opacity
            ${sizeClass.remove}
          `.trim()}
          aria-label="Elimină tag"
        >
          <X className="w-full h-full" />
        </button>
      )}
    </span>
  );
}
