'use client';

import { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectSearchableProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function SelectSearchable({
  options,
  value,
  onChange,
  placeholder = 'Selectează...',
  searchable = true,
  clearable = true,
  disabled = false,
  loading = false,
  className = '',
}: SelectSearchableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleToggle = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(0);
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && filteredOptions.length > 0) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;

      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setSearchTerm('');
        }
        break;
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, search: string) => {
    if (!search || !searchable) return text;

    const index = text.toLowerCase().indexOf(search.toLowerCase());
    if (index === -1) return text;

    const beforeMatch = text.slice(0, index);
    const match = text.slice(index, index + search.length);
    const afterMatch = text.slice(index + search.length);

    return (
      <>
        {beforeMatch}
        <span className="bg-blue-100 text-blue-900 font-semibold">{match}</span>
        {afterMatch}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button */}
      <div
        onClick={handleToggle}
        className={`
          flex items-center justify-between gap-2
          w-full px-4 py-2.5 rounded-lg
          border border-gray-300 bg-white
          cursor-pointer transition-all
          ${disabled || loading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-blue-500'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : ''}
        `}
      >
        <div className="flex-1 truncate">
          {loading ? (
            <span className="text-gray-500">Se încarcă...</span>
          ) : isOpen && searchable ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full outline-none bg-transparent"
              placeholder={placeholder}
            />
          ) : selectedOption ? (
            <span className="text-gray-900">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Clear button */}
          {clearable && value && !disabled && !loading && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              type="button"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Dropdown arrow */}
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && !loading && (
        <div
          ref={dropdownRef}
          className="
            absolute z-50 w-full mt-1
            bg-white border border-gray-200 rounded-lg
            shadow-lg max-h-60 overflow-auto
          "
        >
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Niciun rezultat găsit
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  px-4 py-2.5 cursor-pointer transition-colors
                  ${
                    index === highlightedIndex
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }
                  ${
                    option.value === value
                      ? 'bg-blue-100 font-medium text-blue-900'
                      : 'text-gray-900'
                  }
                `}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {highlightMatch(option.label, searchTerm)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
