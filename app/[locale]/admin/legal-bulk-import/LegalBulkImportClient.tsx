'use client';

import { useState, useCallback, useEffect } from 'react';
import type { LegislativeActResult } from '@/lib/legislative-import/ro-soap-client';

// ─── Types ───────────────────────────────────────────────────

type ImportStatus = 'waiting' | 'processing' | 'imported' | 'duplicate' | 'error';

interface SearchResponse {
  results: LegislativeActResult[];
  page: number;
  hasMore: boolean;
  existingIds: string[];
}

interface ImportResponse {
  status: 'imported' | 'duplicate' | 'error';
  message: string;
}

interface ImportReport {
  imported: number;
  duplicate: number;
  error: number;
}

const TIP_ACT_OPTIONS = ['', 'Lege', 'OUG', 'OG', 'HG', 'Ordin', 'Cod'];

const IMPORT_STATUS_EMOJI: Record<ImportStatus, string> = {
  waiting: '⏳',
  processing: '🔄',
  imported: '✅',
  duplicate: '⚠️',
  error: '❌',
};

const getActKey = (act: LegislativeActResult): string =>
  act.id || `${act.tipAct}_${act.numar}_${act.an}`;

// ─── Spinner ─────────────────────────────────────────────────

function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function LegalBulkImportClient() {
  // Search form state
  const [tipAct, setTipAct] = useState('');
  const [an, setAn] = useState<number>(new Date().getFullYear());
  const [numar, setNumar] = useState('');
  const [titlu, setTitlu] = useState('');
  const [page, setPage] = useState(0);

  // Results state
  const [results, setResults] = useState<LegislativeActResult[]>([]);
  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Selection state
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Import state
  const [importStatuses, setImportStatuses] = useState<Record<string, ImportStatus>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ done: number; total: number } | null>(null);
  const [importReport, setImportReport] = useState<ImportReport | null>(null);

  // UI state
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset selection and statuses when results change
  useEffect(() => {
    setSelectedKeys(new Set());
    setImportStatuses({});
    setImportReport(null);
    setImportProgress(null);
  }, [results]);

  // ─── Search ────────────────────────────────────────────────

  const runSearch = useCallback(async (targetPage: number) => {
    setIsSearching(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (tipAct) params.set('tipAct', tipAct);
      if (an) params.set('an', String(an));
      if (numar) params.set('numar', numar);
      if (titlu) params.set('titlu', titlu);
      params.set('pagina', String(targetPage));

      const res = await fetch(`/api/admin/legal-bulk-search?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Eroare ${res.status}`);
      }
      const data: SearchResponse = await res.json();
      setResults(data.results);
      setExistingIds(data.existingIds);
      setHasMore(data.hasMore);
      setPage(data.page);
      setHasSearched(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSearching(false);
    }
  }, [tipAct, an, numar, titlu]);

  const handleSearch = useCallback(() => {
    runSearch(0);
  }, [runSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ─── Selection ─────────────────────────────────────────────

  const toggleRow = (key: string) => {
    if (isImporting) return;
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (isImporting) return;
    if (selectedKeys.size === results.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(results.map(getActKey)));
    }
  };

  // ─── Import ────────────────────────────────────────────────

  const handleImport = async () => {
    const selectedActs = results.filter(act => selectedKeys.has(getActKey(act)));
    if (selectedActs.length === 0) return;

    setIsImporting(true);
    setImportReport(null);
    setImportProgress({ done: 0, total: selectedActs.length });

    const report: ImportReport = { imported: 0, duplicate: 0, error: 0 };

    // Initialize all selected as waiting
    const initialStatuses: Record<string, ImportStatus> = {};
    for (const act of selectedActs) {
      initialStatuses[getActKey(act)] = 'waiting';
    }
    setImportStatuses(prev => ({ ...prev, ...initialStatuses }));

    for (let i = 0; i < selectedActs.length; i++) {
      const act = selectedActs[i];
      const key = getActKey(act);

      // Mark as processing
      setImportStatuses(prev => ({ ...prev, [key]: 'processing' }));

      try {
        const res = await fetch('/api/admin/legal-bulk-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ act }),
        });
        const data: ImportResponse = await res.json();
        const status: ImportStatus = res.ok ? data.status : 'error';
        setImportStatuses(prev => ({ ...prev, [key]: status }));
        if (status === 'imported') report.imported++;
        else if (status === 'duplicate') report.duplicate++;
        else report.error++;
      } catch {
        setImportStatuses(prev => ({ ...prev, [key]: 'error' }));
        report.error++;
      }

      setImportProgress({ done: i + 1, total: selectedActs.length });

      // Delay between acts (not after last)
      if (i < selectedActs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    setImportReport(report);
    setIsImporting(false);
  };

  // ─── Derived ───────────────────────────────────────────────

  const selectedCount = selectedKeys.size;
  const allSelected = results.length > 0 && selectedKeys.size === results.length;
  const progressPercent = importProgress
    ? Math.round((importProgress.done / importProgress.total) * 100)
    : 0;

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Import Bulk Legislație</h1>
          <p className="text-sm text-gray-500 mt-1">
            Căutați acte legislative pe legislatie.just.ro și importați-le în bloc.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Criterii căutare</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tip act */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tip act
              </label>
              <select
                value={tipAct}
                onChange={e => setTipAct(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSearching || isImporting}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:bg-gray-50 disabled:text-gray-400"
              >
                {TIP_ACT_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt === '' ? 'Toate tipurile' : opt}
                  </option>
                ))}
              </select>
            </div>

            {/* An */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                An
              </label>
              <input
                type="number"
                value={an}
                min={1990}
                max={2030}
                onChange={e => setAn(Number(e.target.value))}
                onKeyDown={handleKeyDown}
                disabled={isSearching || isImporting}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Număr */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Număr
              </label>
              <input
                type="text"
                value={numar}
                onChange={e => setNumar(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSearching || isImporting}
                placeholder="ex: 319"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Titlu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titlu / cuvinte cheie
              </label>
              <input
                type="text"
                value={titlu}
                onChange={e => setTitlu(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSearching || isImporting}
                placeholder="ex: securitate muncă"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          </div>

          {/* Search button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              disabled={isSearching || isImporting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                text-white text-sm font-semibold transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSearching ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  Se caută...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Caută
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700">
            <strong>Eroare:</strong> {error}
          </div>
        )}

        {/* Progress bar */}
        {isImporting && importProgress && (
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {importProgress.done} / {importProgress.total} completate
              </span>
              <span className="text-sm font-semibold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Import Report */}
        {importReport && !isImporting && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-green-700">{importReport.imported}</p>
              <p className="text-sm font-medium text-green-600 mt-1">importate</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-700">{importReport.duplicate}</p>
              <p className="text-sm font-medium text-amber-600 mt-1">duplicate</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-red-700">{importReport.error}</p>
              <p className="text-sm font-medium text-red-600 mt-1">erori</p>
            </div>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Results header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-gray-800">
                  Rezultate ({results.length} acte)
                </h2>
                {selectedCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {selectedCount} selectate
                  </span>
                )}
              </div>

              {selectedCount > 0 && !isImporting && (
                <button
                  onClick={handleImport}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700
                    text-white text-sm font-semibold transition-colors
                    focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Importă {selectedCount} {selectedCount === 1 ? 'act' : 'acte'}
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                Niciun rezultat găsit pentru criteriile selectate.
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="w-10 px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            disabled={isImporting}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer
                              disabled:cursor-not-allowed"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Titlu</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tip</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nr.</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">An</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Emitent</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stare</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status import</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.map(act => {
                        const key = getActKey(act);
                        const isExisting = existingIds.includes(act.id) || existingIds.includes(key);
                        const isSelected = selectedKeys.has(key);
                        const importStatus = importStatuses[key];

                        return (
                          <tr
                            key={key}
                            onClick={() => toggleRow(key)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50 hover:bg-blue-100'
                                : isExisting
                                  ? 'bg-amber-50 hover:bg-amber-100'
                                  : 'hover:bg-gray-50'
                            } ${isImporting ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleRow(key)}
                                disabled={isImporting}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer
                                  disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                                  {act.titlu || '—'}
                                </span>
                                {isExisting && (
                                  <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                                    Importat
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{act.tipAct || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{act.numar || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{act.an || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 max-w-[140px] truncate">{act.emitent || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{act.stare || '—'}</td>
                            <td className="px-4 py-3 text-center text-lg" title={importStatus}>
                              {importStatus ? IMPORT_STATUS_EMOJI[importStatus] : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card layout */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {results.map(act => {
                    const key = getActKey(act);
                    const isExisting = existingIds.includes(act.id) || existingIds.includes(key);
                    const isSelected = selectedKeys.has(key);
                    const importStatus = importStatuses[key];

                    return (
                      <div
                        key={key}
                        onClick={() => toggleRow(key)}
                        className={`p-4 transition-colors ${
                          isSelected
                            ? 'bg-blue-50'
                            : isExisting
                              ? 'bg-amber-50'
                              : ''
                        } ${isImporting ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-0.5" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRow(key)}
                              disabled={isImporting}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500
                                disabled:cursor-not-allowed"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-gray-900 line-clamp-3">
                                {act.titlu || '—'}
                              </p>
                              {importStatus && (
                                <span className="text-xl flex-shrink-0">{IMPORT_STATUS_EMOJI[importStatus]}</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                              {act.tipAct && <span>{act.tipAct}</span>}
                              {act.numar && <span>Nr. {act.numar}</span>}
                              {act.an > 0 && <span>{act.an}</span>}
                              {act.stare && <span>{act.stare}</span>}
                            </div>
                            {act.emitent && (
                              <p className="text-xs text-gray-400 mt-1 truncate">{act.emitent}</p>
                            )}
                            {isExisting && (
                              <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                                Importat anterior
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
                  <button
                    onClick={() => runSearch(page - 1)}
                    disabled={page === 0 || isSearching || isImporting}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                      border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors
                      disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterioare
                  </button>

                  <span className="text-sm text-gray-500">
                    Pagina {page + 1}
                  </span>

                  <button
                    onClick={() => runSearch(page + 1)}
                    disabled={!hasMore || isSearching || isImporting}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                      border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors
                      disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Următoare
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
