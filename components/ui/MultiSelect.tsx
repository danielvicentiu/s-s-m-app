'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X, ChevronDown, Search } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Selectează...',
  maxSelections,
  disabled = false,
  className = '',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected options for display
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  // Check if max selections reached
  const maxReached = maxSelections !== undefined && value.length >= maxSelections;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle option toggle
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (!maxReached) {
        onChange([...value, optionValue]);
      }
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (maxSelections !== undefined) {
      onChange(filteredOptions.slice(0, maxSelections).map((opt) => opt.value));
    } else {
      onChange(filteredOptions.map((opt) => opt.value));
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    onChange([]);
  };

  // Remove individual chip
  const removeChip = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Main trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full min-h-[42px] px-3 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm transition-colors ${
          disabled
            ? 'bg-gray-50 cursor-not-allowed opacity-60'
            : 'hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex flex-wrap gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-md"
                >
                  <span>{option.label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChip(option.value);
                    }}
                    className="hover:text-blue-900 focus:outline-none"
                    aria-label={`Șterge ${option.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 flex flex-col">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={maxReached && filteredOptions.some((opt) => !value.includes(opt.value))}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Selectează tot
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={value.length === 0}
              className="text-xs font-medium text-gray-600 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Șterge tot
            </button>
          </div>

          {/* Options list */}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                Nu s-au găsit rezultate
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const isDisabled = !isSelected && maxReached;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !isDisabled && toggleOption(option.value)}
                      disabled={isDisabled}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                        isDisabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-gray-50 cursor-pointer'
                      } ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <div
                        className={`flex-shrink-0 w-4 h-4 border rounded flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with selection count */}
          {(value.length > 0 || maxSelections !== undefined) && (
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600">
                {maxSelections !== undefined ? (
                  <span>
                    {value.length} / {maxSelections} selectate
                    {maxReached && (
                      <span className="ml-1 text-orange-600 font-medium">
                        (limită atinsă)
                      </span>
                    )}
                  </span>
                ) : (
                  <span>{value.length} selectate</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
