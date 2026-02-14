'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import corData from '@/src/data/cor-codes.json';

interface CORCode {
  id: string;
  cor: string;
  name: string;
  group: string;
  riskLevel: 'scazut' | 'mediu' | 'ridicat';
  synonyms: string[];
}

interface CORSearchInputProps {
  value: string;
  onChange: (value: string, code?: CORCode) => void;
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

export default function CORSearchInput({
  value,
  onChange,
  label = 'Cod COR',
  error,
  required = false,
  disabled = false,
  placeholder = 'Caută cod COR sau denumire ocupație...',
}: CORSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CORCode[]>([]);
  const [selectedCode, setSelectedCode] = useState<CORCode | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize selected code from value
  useEffect(() => {
    if (value && !selectedCode) {
      const code = corData.codes.find(
        (c) => c.cor === value
      ) as CORCode | undefined;
      if (code) {
        setSelectedCode(code);
        setSearchTerm(code.name);
      }
    }
  }, [value, selectedCode]);

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
    const filtered = corData.codes.filter((code) => {
      const corMatch = code.cor.includes(searchLower);
      const nameMatch = code.name.toLowerCase().includes(searchLower);
      const groupMatch = code.group.toLowerCase().includes(searchLower);
      const synonymMatch = code.synonyms.some((syn) =>
        syn.toLowerCase().includes(searchLower)
      );
      return corMatch || nameMatch || groupMatch || synonymMatch;
    });

    setResults(filtered.slice(0, 10) as CORCode[]);
    setHighlightedIndex(0);
  };

  const handleSelect = (code: CORCode) => {
    setSelectedCode(code);
    setSearchTerm(code.name);
    onChange(code.cor, code);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedCode(null);
    setSearchTerm('');
    onChange('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setSelectedCode(null);
    setIsOpen(true);

    if (newValue.length === 0) {
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const showDropdown = isOpen && results.length > 0;

  return (
    <div className="space-y-2" ref={wrapperRef}>
      {label && (
        <label
          htmlFor="cor-search-input"
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
            id="cor-search-input"
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
            {results.map((code, index) => (
              <button
                key={code.id}
                type="button"
                onClick={() => handleSelect(code)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  index === highlightedIndex ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-sm text-blue-600">
                        COR {code.cor}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          RISK_LEVEL_CONFIG[code.riskLevel].bg
                        } ${RISK_LEVEL_CONFIG[code.riskLevel].text}`}
                      >
                        {RISK_LEVEL_CONFIG[code.riskLevel].label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium mb-1">
                      {code.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {code.group}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Selected code display */}
      {selectedCode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-sm text-blue-700">
                  COR {selectedCode.cor}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    RISK_LEVEL_CONFIG[selectedCode.riskLevel].bg
                  } ${RISK_LEVEL_CONFIG[selectedCode.riskLevel].text}`}
                >
                  {RISK_LEVEL_CONFIG[selectedCode.riskLevel].label}
                </span>
              </div>
              <div className="text-sm text-blue-900 font-medium mb-1">
                {selectedCode.name}
              </div>
              <div className="text-xs text-blue-700">
                {selectedCode.group}
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
      {!selectedCode && !error && (
        <p className="text-xs text-gray-500">
          Caută după cod COR, denumire ocupație sau grup profesional. Introduceți minim 2
          caractere pentru căutare.
        </p>
      )}
    </div>
  );
}
