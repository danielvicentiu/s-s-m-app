'use client';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: SortState;
  onSort: (key: string) => void;
  className?: string;
}

export default function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  className = '',
}: SortableHeaderProps) {
  const isActive = currentSort.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  const handleClick = () => {
    onSort(sortKey);
  };

  const renderIcon = () => {
    if (!isActive || direction === null) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (direction === 'asc') {
      return <ArrowUp className="w-4 h-4 text-blue-600" />;
    }
    return <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 font-medium text-sm
        transition-colors hover:text-blue-600
        ${isActive ? 'text-blue-600' : 'text-gray-700'}
        ${className}
      `}
      type="button"
    >
      {label}
      {renderIcon()}
    </button>
  );
}
