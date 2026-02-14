'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectChipsProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplayChips?: number;
}

export function MultiSelectChips({
  options,
  selected,
  onChange,
  placeholder = 'Selectează opțiuni...',
  className = '',
  disabled = false,
  maxDisplayChips = 5,
}: MultiSelectChipsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Get selected option labels
  const selectedLabels = useMemo(() => {
    return selected
      .map((val) => {
        const option = options.find((opt) => opt.value === val);
        return option ? { value: val, label: option.label } : null;
      })
      .filter(Boolean) as { value: string; label: string }[];
  }, [selected, options]);

  // Handle option selection
  const handleToggle = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      // Deselect
      onChange(selected.filter((v) => v !== optionValue));
    } else {
      // Select
      onChange([...selected, optionValue]);
    }
  };

  // Handle chip removal
  const handleRemove = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== valueToRemove));
  };

  // Select all options
  const handleSelectAll = () => {
    onChange(options.map((opt) => opt.value));
  };

  // Clear all selections
  const handleClearAll = () => {
    onChange([]);
    setSearchQuery('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate chips to display
  const visibleChips = selectedLabels.slice(0, maxDisplayChips);
  const remainingCount = selectedLabels.length - maxDisplayChips;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Selected chips display area */}
      {selectedLabels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {visibleChips.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 transition-colors hover:bg-blue-100"
            >
              {item.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, item.value)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Elimină ${item.label}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium border border-gray-200">
              +{remainingCount} mai {remainingCount === 1 ? 'mult' : 'multe'}
            </span>
          )}
        </div>
      )}

      {/* Input Area */}
      <div
        className={`
          min-h-[42px] w-full rounded-lg border bg-white px-3 py-2
          flex items-center gap-2 cursor-text
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300'}
          hover:border-gray-400 transition-colors
        `}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            flex-1 min-w-[120px] outline-none bg-transparent text-sm
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        />

        {/* Right icons */}
        <div className="flex items-center gap-1 ml-auto">
          {selected.length > 0 && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Șterge toate"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
          {/* Action buttons */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-600 font-medium">
              {selected.length} din {options.length} selectate
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={selected.length === options.length}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Selectează tot
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={selected.length === 0}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Șterge tot
              </button>
            </div>
          </div>

          {/* Options list */}
          <div className="overflow-y-auto max-h-52">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-sm text-gray-500 text-center">
                {searchQuery ? (
                  <>
                    Niciun rezultat pentru <strong>"{searchQuery}"</strong>
                  </>
                ) : (
                  'Nicio opțiune disponibilă'
                )}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);

                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggle(option.value)}
                    className={`
                      px-3 py-2.5 cursor-pointer flex items-center gap-3
                      transition-colors hover:bg-blue-50
                      ${isSelected ? 'bg-blue-50' : ''}
                    `}
                  >
                    {/* Checkbox */}
                    <div
                      className={`
                        w-4 h-4 rounded border flex items-center justify-center
                        transition-all flex-shrink-0
                        ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white border-gray-300'
                        }
                      `}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-sm flex-1 ${
                        isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
