'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  onSelect: (option: ComboboxOption) => void;
  onSearch?: (query: string) => void | Promise<void>;
  allowCreate?: boolean;
  placeholder?: string;
  value?: string;
  className?: string;
  disabled?: boolean;
}

export default function Combobox({
  options,
  onSelect,
  onSearch,
  allowCreate = false,
  placeholder = 'Caută...',
  value = '',
  className = '',
  disabled = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState<ComboboxOption[]>(options);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  useEffect(() => {
    const query = inputValue.toLowerCase().trim();

    if (!query) {
      setFilteredOptions(options);
      setHighlightedIndex(0);
      return;
    }

    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );

    setFilteredOptions(filtered);
    setHighlightedIndex(0);
  }, [inputValue, options]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);

    if (onSearch) {
      await onSearch(newValue);
    }
  };

  const handleSelect = (option: ComboboxOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    onSelect(option);
    inputRef.current?.blur();
  };

  const handleCreateNew = () => {
    const newOption: ComboboxOption = {
      value: inputValue,
      label: inputValue,
    };
    handleSelect(newOption);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const maxIndex = allowCreate && filteredOptions.length === 0
            ? 0
            : filteredOptions.length - 1;
          return prev < maxIndex ? prev + 1 : prev;
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen) {
          if (filteredOptions.length > 0) {
            handleSelect(filteredOptions[highlightedIndex]);
          } else if (allowCreate && inputValue.trim()) {
            handleCreateNew();
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const showCreateOption = allowCreate && inputValue.trim() && filteredOptions.length === 0;
  const hasOptions = filteredOptions.length > 0 || showCreateOption;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        autoComplete="off"
      />

      {isOpen && hasOptions && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {highlightMatch(option.label, inputValue)}
            </li>
          ))}

          {showCreateOption && (
            <li
              onClick={handleCreateNew}
              className={`px-4 py-2 cursor-pointer transition-colors border-t border-gray-200 ${
                highlightedIndex === 0 && filteredOptions.length === 0
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">Creează:</span>{' '}
              <span className="text-blue-600">{inputValue}</span>
            </li>
          )}
        </ul>
      )}

      {isOpen && !hasOptions && !showCreateOption && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-3 text-gray-500 text-sm">
          Nu s-au găsit rezultate
        </div>
      )}
    </div>
  );
}
