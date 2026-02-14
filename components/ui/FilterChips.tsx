'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface Filter {
  key: string;
  label: string;
  value: string;
  color?: string;
}

interface FilterChipsProps {
  filters: Filter[];
  onRemove: (key: string) => void;
  onClear: () => void;
}

export default function FilterChips({ filters, onRemove, onClear }: FilterChipsProps) {
  const [removingKeys, setRemovingKeys] = useState<Set<string>>(new Set());

  if (filters.length === 0) {
    return null;
  }

  const handleRemove = (key: string) => {
    setRemovingKeys(prev => new Set(prev).add(key));
    setTimeout(() => {
      onRemove(key);
      setRemovingKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 200);
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200';
      case 'purple':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200';
      case 'orange':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200';
      case 'gray':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <div
          key={filter.key}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
            text-sm font-medium border transition-all duration-200
            ${getColorClasses(filter.color)}
            ${removingKeys.has(filter.key) ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
          `}
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={() => handleRemove(filter.key)}
            className="ml-1 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 rounded-full"
            aria-label={`Sterge filtru ${filter.label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      {filters.length > 1 && (
        <button
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium underline transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded px-1"
        >
          Sterge toate
        </button>
      )}
    </div>
  );
}
