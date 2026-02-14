'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import caenData from '@/src/data/caen-activities.json';

interface CAENActivity {
  id: string;
  caen: string;
  name: string;
  synonyms: string[];
  riskLevel: 'scazut' | 'mediu' | 'ridicat';
  category: string;
}

interface CAENSearchInputProps {
  value: string;
  onChange: (value: string, activity?: CAENActivity) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const RISK_LEVEL_CONFIG = {
  scazut: { bg: 'bg-green-100', text: 'text-green-700', label: 'Risc Scăzut' },
  mediu: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Risc Mediu' },
  ridicat: { bg: 'bg-red-100', text: 'text-red-700', label: 'Risc Ridicat' },
};

const STORAGE_KEY = 'caen_recent_selections';
const MAX_RECENT = 5;

export default function CAENSearchInput({
  value,
  onChange,
  label = 'Cod CAEN',
  error,
  required = false,
  disabled = false,
  placeholder = 'Caută cod CAEN sau denumire activitate...',
}: CAENSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CAENActivity[]>([]);
  const [recentSelections, setRecentSelections] = useState<CAENActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<CAENActivity | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent selections from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const recent = JSON.parse(stored);
        setRecentSelections(recent.slice(0, MAX_RECENT));
      }
    } catch (err) {
      console.error('Failed to load recent CAEN selections:', err);
    }
  }, []);

  // Initialize selected activity from value
  useEffect(() => {
    if (value && !selectedActivity) {
      const activity = caenData.activities.find(
        (act) => act.caen === value
      ) as CAENActivity | undefined;
      if (activity) {
        setSelectedActivity(activity);
        setSearchTerm(activity.name);
      }
    }
  }, [value, selectedActivity]);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (search: string) => {
    const searchLower = search.toLowerCase();
    const filtered = caenData.activities.filter((activity) => {
      const caenMatch = activity.caen.includes(searchLower);
      const nameMatch = activity.name.toLowerCase().includes(searchLower);
      const synonymMatch = activity.synonyms.some((syn) =>
        syn.toLowerCase().includes(searchLower)
      );
      return caenMatch || nameMatch || synonymMatch;
    });

    setResults(filtered.slice(0, 10) as CAENActivity[]);
    setHighlightedIndex(0);
  };

  const saveToRecent = (activity: CAENActivity) => {
    try {
      const updated = [
        activity,
        ...recentSelections.filter((item) => item.id !== activity.id),
      ].slice(0, MAX_RECENT);

      setRecentSelections(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save recent CAEN selection:', err);
    }
  };

  const handleSelect = (activity: CAENActivity) => {
    setSelectedActivity(activity);
    setSearchTerm(activity.name);
    onChange(activity.caen, activity);
    setIsOpen(false);
    saveToRecent(activity);
  };

  const handleClear = () => {
    setSelectedActivity(null);
    setSearchTerm('');
    onChange('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setSelectedActivity(null);
    setIsOpen(true);

    if (newValue.length === 0) {
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    const itemsToShow = results.length > 0 ? results : recentSelections;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < itemsToShow.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (itemsToShow[highlightedIndex]) {
          handleSelect(itemsToShow[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const displayResults = searchTerm.length >= 2 ? results : recentSelections;
  const showDropdown = isOpen && displayResults.length > 0;

  return (
    <div className="space-y-2" ref={wrapperRef}>
      {label && (
        <label
          htmlFor="caen-search-input"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            id="caen-search-input"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
          />
          {searchTerm && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {!searchTerm && !disabled && (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {searchTerm.length < 2 && recentSelections.length > 0 && (
              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                Selecții recente
              </div>
            )}
            {displayResults.map((activity, index) => (
              <button
                key={activity.id}
                type="button"
                onClick={() => handleSelect(activity)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  index === highlightedIndex ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-sm text-blue-600">
                        CAEN {activity.caen}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          RISK_LEVEL_CONFIG[activity.riskLevel].bg
                        } ${RISK_LEVEL_CONFIG[activity.riskLevel].text}`}
                      >
                        {RISK_LEVEL_CONFIG[activity.riskLevel].label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium mb-1">
                      {activity.name}
                    </div>
                    {activity.synonyms.length > 0 && (
                      <div className="text-xs text-gray-500 truncate">
                        {activity.synonyms.slice(0, 3).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Selected activity display */}
      {selectedActivity && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-sm text-blue-700">
                  CAEN {selectedActivity.caen}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    RISK_LEVEL_CONFIG[selectedActivity.riskLevel].bg
                  } ${RISK_LEVEL_CONFIG[selectedActivity.riskLevel].text}`}
                >
                  {RISK_LEVEL_CONFIG[selectedActivity.riskLevel].label}
                </span>
              </div>
              <div className="text-sm text-blue-900 font-medium">
                {selectedActivity.name}
              </div>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Schimbă
              </button>
            )}
          </div>
        </div>
      )}

      {/* Helper text */}
      {!selectedActivity && !error && (
        <p className="text-xs text-gray-500">
          Caută după cod CAEN sau denumire activitate. Introduceți minim 2
          caractere pentru căutare.
        </p>
      )}
    </div>
  );
}
