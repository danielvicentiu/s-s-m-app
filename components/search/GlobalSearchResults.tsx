'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  User,
  GraduationCap,
  FileText,
  Wrench,
  Clock,
  X,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { globalSearch, highlightMatch } from '@/lib/services/global-search';
import type {
  GlobalSearchResult,
  EmployeeSearchResult,
  TrainingSearchResult,
  DocumentSearchResult,
  EquipmentSearchResult,
} from '@/lib/services/global-search';

// ============================================================
// TYPES
// ============================================================

interface GlobalSearchResultsProps {
  organizationId: string;
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'employees' | 'trainings' | 'documents' | 'equipment';

interface CategoryConfig {
  icon: React.ElementType;
  label: string;
  labelSingular: string;
  color: string;
  getUrl: (id: string) => string;
}

// ============================================================
// CATEGORY CONFIGURATION
// ============================================================

const CATEGORY_CONFIGS: Record<SearchCategory, CategoryConfig> = {
  employees: {
    icon: User,
    label: 'Angajați',
    labelSingular: 'Angajat',
    color: 'text-blue-600',
    getUrl: (id) => `/dashboard/employees/${id}`,
  },
  trainings: {
    icon: GraduationCap,
    label: 'Instruiri',
    labelSingular: 'Instruire',
    color: 'text-purple-600',
    getUrl: (id) => `/dashboard/trainings/${id}`,
  },
  documents: {
    icon: FileText,
    label: 'Documente',
    labelSingular: 'Document',
    color: 'text-green-600',
    getUrl: (id) => `/dashboard/documents/${id}`,
  },
  equipment: {
    icon: Wrench,
    label: 'Echipamente',
    labelSingular: 'Echipament',
    color: 'text-orange-600',
    getUrl: (id) => `/dashboard/equipment/${id}`,
  },
};

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

const RECENT_SEARCHES_KEY = 'ssm-recent-searches';
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter((q) => q.toLowerCase() !== query.toLowerCase());
    const updated = [query.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recent search:', error);
  }
}

function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.error('Failed to clear recent searches:', error);
  }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function GlobalSearchResults({ organizationId, isOpen, onClose }: GlobalSearchResultsProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Flatten results for keyboard navigation
  const flatResults = results
    ? [
        ...results.employees.map((item) => ({ category: 'employees' as const, item })),
        ...results.trainings.map((item) => ({ category: 'trainings' as const, item })),
        ...results.documents.map((item) => ({ category: 'documents' as const, item })),
        ...results.equipment.map((item) => ({ category: 'equipment' as const, item })),
      ]
    : [];

  // Search handler with debounce
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await globalSearch(organizationId, query, 5);
        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, organizationId]);

  // Navigate to selected result
  const navigateToResult = useCallback(
    (category: SearchCategory, id: string, saveToRecent = true) => {
      const config = CATEGORY_CONFIGS[category];
      if (saveToRecent && query.trim()) {
        addRecentSearch(query.trim());
      }
      onClose();
      router.push(config.getUrl(id));
    },
    [query, onClose, router]
  );

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev === 0 ? flatResults.length - 1 : prev - 1));
      } else if (e.key === 'Enter' && flatResults.length > 0) {
        e.preventDefault();
        const selected = flatResults[selectedIndex];
        if (selected) {
          navigateToResult(selected.category, selected.item.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatResults, navigateToResult, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const selectedElement = resultsContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Handle recent search click
  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    inputRef.current?.focus();
  };

  // Clear recent searches
  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Command Palette */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
        <div
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută angajați, instruiri, documente, echipamente..."
              className="flex-1 text-base bg-transparent border-none outline-none placeholder-gray-400"
            />
            {isLoading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Închide"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Results */}
          <div ref={resultsContainerRef} className="max-h-[60vh] overflow-y-auto">
            {/* Loading State */}
            {isLoading && query.length >= 2 && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            )}

            {/* No Query - Show Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    <span>Căutări recente</span>
                  </div>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Șterge
                  </button>
                </div>
                {recentSearches.map((recentQuery, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentSearchClick(recentQuery)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 text-sm text-gray-700">{recentQuery}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {/* No Results State */}
            {!isLoading && query.length >= 2 && results?.totalResults === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Search className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Niciun rezultat găsit</h3>
                <p className="text-sm text-gray-600 text-center">
                  Nu am găsit niciun rezultat pentru &quot;{query}&quot;.
                  <br />
                  Încearcă un termen diferit de căutare.
                </p>
              </div>
            )}

            {/* Results by Category */}
            {!isLoading && results && results.totalResults > 0 && (
              <div className="py-2">
                {(Object.keys(CATEGORY_CONFIGS) as SearchCategory[]).map((category) => {
                  const items = results[category];
                  if (items.length === 0) return null;

                  const config = CATEGORY_CONFIGS[category];
                  const Icon = config.icon;
                  const startIndex = flatResults.findIndex((r) => r.category === category);

                  return (
                    <div key={category} className="mb-2">
                      {/* Category Header */}
                      <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Icon className={`w-3 h-3 ${config.color}`} />
                        <span>
                          {config.label} ({items.length})
                        </span>
                      </div>

                      {/* Category Items */}
                      {items.map((item, idx) => {
                        const globalIndex = startIndex + idx;
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <ResultItem
                            key={item.id}
                            category={category}
                            item={item}
                            query={query}
                            isSelected={isSelected}
                            dataIndex={globalIndex}
                            onClick={() => navigateToResult(category, item.id)}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Query too short */}
            {!isLoading && query.length > 0 && query.length < 2 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Search className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-600">
                  Introduceți cel puțin 2 caractere pentru căutare
                </p>
              </div>
            )}
          </div>

          {/* Footer Hints */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  ↑↓
                </kbd>
                Navighează
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  Enter
                </kbd>
                Selectează
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                ESC
              </kbd>
              Închide
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// RESULT ITEM COMPONENTS
// ============================================================

interface ResultItemProps {
  category: SearchCategory;
  item: EmployeeSearchResult | TrainingSearchResult | DocumentSearchResult | EquipmentSearchResult;
  query: string;
  isSelected: boolean;
  dataIndex: number;
  onClick: () => void;
}

function ResultItem({ category, item, query, isSelected, dataIndex, onClick }: ResultItemProps) {
  const config = CATEGORY_CONFIGS[category];
  const Icon = config.icon;

  return (
    <button
      data-index={dataIndex}
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
        isSelected ? 'bg-blue-50 border-l-2 border-l-blue-600' : 'hover:bg-gray-50'
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg ${
          isSelected ? 'bg-blue-100' : 'bg-gray-100'
        } flex items-center justify-center`}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        {category === 'employees' && (
          <EmployeeResult item={item as EmployeeSearchResult} query={query} />
        )}
        {category === 'trainings' && (
          <TrainingResult item={item as TrainingSearchResult} query={query} />
        )}
        {category === 'documents' && (
          <DocumentResult item={item as DocumentSearchResult} query={query} />
        )}
        {category === 'equipment' && (
          <EquipmentResult item={item as EquipmentSearchResult} query={query} />
        )}
      </div>

      {isSelected && <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />}
    </button>
  );
}

// ============================================================
// CATEGORY-SPECIFIC RESULT COMPONENTS
// ============================================================

function EmployeeResult({ item, query }: { item: EmployeeSearchResult; query: string }) {
  return (
    <>
      <div
        className="font-medium text-gray-900 mb-0.5"
        dangerouslySetInnerHTML={{ __html: highlightMatch(item.full_name, query) }}
      />
      <div className="text-xs text-gray-600 space-y-0.5">
        {item.job_title && (
          <div dangerouslySetInnerHTML={{ __html: highlightMatch(item.job_title, query) }} />
        )}
        {item.department && (
          <div dangerouslySetInnerHTML={{ __html: highlightMatch(item.department, query) }} />
        )}
      </div>
      {item.matchedFields.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {item.matchedFields.map((field, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {field}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function TrainingResult({ item, query }: { item: TrainingSearchResult; query: string }) {
  return (
    <>
      <div
        className="font-medium text-gray-900 mb-0.5"
        dangerouslySetInnerHTML={{ __html: highlightMatch(item.title, query) }}
      />
      <div className="text-xs text-gray-600 space-y-0.5">
        <div dangerouslySetInnerHTML={{ __html: highlightMatch(item.code, query) }} />
        <div className="flex items-center gap-2">
          <span dangerouslySetInnerHTML={{ __html: highlightMatch(item.category, query) }} />
          <span className="text-gray-400">•</span>
          <span dangerouslySetInnerHTML={{ __html: highlightMatch(item.training_type, query) }} />
        </div>
      </div>
      {item.matchedFields.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {item.matchedFields.map((field, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {field}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function DocumentResult({ item, query }: { item: DocumentSearchResult; query: string }) {
  return (
    <>
      <div
        className="font-medium text-gray-900 mb-0.5"
        dangerouslySetInnerHTML={{ __html: highlightMatch(item.title, query) }}
      />
      <div className="text-xs text-gray-600 space-y-0.5">
        {item.description && (
          <div
            className="line-clamp-1"
            dangerouslySetInnerHTML={{ __html: highlightMatch(item.description, query) }}
          />
        )}
        <div className="flex items-center gap-2">
          <span dangerouslySetInnerHTML={{ __html: highlightMatch(item.file_name, query) }} />
          <span className="text-gray-400">•</span>
          <span className="capitalize">{item.category}</span>
        </div>
      </div>
      {item.matchedFields.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {item.matchedFields.map((field, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {field}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function EquipmentResult({ item, query }: { item: EquipmentSearchResult; query: string }) {
  return (
    <>
      <div
        className="font-medium text-gray-900 mb-0.5"
        dangerouslySetInnerHTML={{ __html: highlightMatch(item.equipment_type, query) }}
      />
      <div className="text-xs text-gray-600 space-y-0.5">
        {item.description && (
          <div
            className="line-clamp-1"
            dangerouslySetInnerHTML={{ __html: highlightMatch(item.description, query) }}
          />
        )}
        <div className="flex items-center gap-2">
          {item.location && (
            <>
              <span dangerouslySetInnerHTML={{ __html: highlightMatch(item.location, query) }} />
              <span className="text-gray-400">•</span>
            </>
          )}
          {item.serial_number && (
            <span dangerouslySetInnerHTML={{ __html: highlightMatch(item.serial_number, query) }} />
          )}
        </div>
      </div>
      {item.matchedFields.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {item.matchedFields.map((field, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {field}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
