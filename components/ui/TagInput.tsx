'use client';

import { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  max?: number;
  placeholder?: string;
  className?: string;
}

export default function TagInput({
  tags,
  onChange,
  suggestions = [],
  max,
  placeholder = 'Adaugă tag...',
  className = '',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion)
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    // Prevent empty tags
    if (!trimmedTag) return;

    // Prevent duplicates
    if (tags.includes(trimmedTag)) {
      setInputValue('');
      return;
    }

    // Check max limit
    if (max && tags.length >= max) {
      setInputValue('');
      return;
    }

    onChange([...tags, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0 && filteredSuggestions.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
        // Add selected suggestion
        addTag(filteredSuggestions[selectedIndex]);
      } else {
        // Add input value
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag if input is empty
      removeTag(tags.length - 1);
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  const isMaxReached = max ? tags.length >= max : false;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex flex-wrap gap-2 p-3 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all ${
          isMaxReached ? 'opacity-60' : ''
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              aria-label={`Șterge ${tag}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue && filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          disabled={isMaxReached}
          placeholder={isMaxReached ? `Maximum ${max} taguri` : placeholder}
          className="flex-1 min-w-[120px] outline-none bg-transparent disabled:cursor-not-allowed"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Max limit indicator */}
      {max && (
        <div className="mt-1 text-sm text-gray-500">
          {tags.length} / {max} taguri
        </div>
      )}
    </div>
  );
}
