'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ——— Types ———————————————————————————————————————————————————————————
interface MonitorStatus {
  id: string;
  act_key: string;
  act_full_name: string | null;
  act_type: string | null;
  country_code: string;
  priority: string | null;
  is_active: boolean;
  portal_id: number | null;
  portal_url: string | null;
  last_checked_at: string | null;
  last_content_hash: string | null;
  last_error: string | null;
  consecutive_errors: number;
  tags: string[] | null;
  status: 'never' | 'ok' | 'changed' | 'error';
  has_full_text: boolean;
  content_hash: string | null;
  imported_at: string | null;
}

interface MonitorLog {
  id: string;
  act_key: string;
  check_type: string;
  status: string;
  message: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

interface PreviewData {
  act_key: string;
  title: string;
  full_text: string;
  char_count: number;
}

type TabType = 'status' | 'logs';
type FilterStatus = 'all' | 'never' | 'ok' | 'changed' | 'error';

// ——— Status Badge ————————————————————————————————————————————————————
function StatusBadge({ status, size = 'md' }: { status: string | null | undefined; size?: 'sm' | 'md' }) {
  const s = status || 'never';
  const config: Record<string, { bg: string; text: string; icon: string; label: string }> = {
    ok:        { bg: 'bg-emerald-500/20', text: 'text-emerald-300', icon: '✓', label: 'OK' },
    changed:   { bg: 'bg-amber-500/20',   text: 'text-amber-300',   icon: '△', label: 'CHANGED' },
    error:     { bg: 'bg-red-500/20',     text: 'text-red-300',     icon: '✕', label: 'ERROR' },
    never:     { bg: 'bg-zinc-600/20',    text: 'text-zinc-400',    icon: '—', label: 'NEVER' },
    success:   { bg: 'bg-emerald-500/20', text: 'text-emerald-300', icon: '✓', label: 'SUCCESS' },
    no_change: { bg: 'bg-zinc-600/20',    text: 'text-zinc-400',    icon: '=', label: 'NO CHANGE' },
    unchanged: { bg: 'bg-zinc-600/20',    text: 'text-zinc-400',    icon: '=', label: 'UNCHANGED' },
    new:       { bg: 'bg-blue-500/20',    text: 'text-blue-300',    icon: '+', label: 'NEW' },
  };
  const c = config[s] || config.never;
  const cls = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-mono font-semibold ${cls} ${c.bg} ${c.text}`}>
      {c.icon} {c.label}
    </span>
  );
}

// ——— Priority Badge ——————————————————————————————————————————————————
function PriorityBadge({ priority }: { priority: string | null }) {
  const p = priority || 'normal';
  const cls: Record<string, string> = {
    critical: 'bg-red-500/15 text-red-300 border-red-500/30',
    high:     'bg-amber-500/15 text-amber-300 border-amber-500/30',
    normal:   'bg-zinc-600/15 text-zinc-300 border-zinc-500/30',
    low:      'bg-zinc-700/15 text-zinc-400 border-zinc-600/30',
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold uppercase border ${cls[p] || cls.normal}`}>
      {p}
    </span>
  );
}

// ——— Domain Tags —————————————————————————————————————————————————————
const TAG_COLORS: Record<string, string> = {
  SSM:                    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  PSI:                    'bg-orange-500/20 text-orange-300 border-orange-500/30',
  GDPR:                   'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Fiscal:                 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  TVA:                    'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Dreptul Muncii':       'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Micro:                  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Cod Fiscal':           'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Cod Procedură Fiscală':'bg-lime-500/15 text-lime-300 border-lime-500/25',
  'Legea Societăților':   'bg-sky-500/15 text-sky-300 border-sky-500/25',
  'Taxa logistică':       'bg-rose-500/15 text-rose-300 border-rose-500/25',
  Legislație:             'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
};

function DomainTags({ tags }: { tags: string[] | null }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${TAG_COLORS[tag] || TAG_COLORS.Legislație}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ——— Text Size Indicator —————————————————————————————————————————————
function TextSize({ charCount }: { charCount: number | null }) {
  if (!charCount) return <span className="text-zinc-600 text-sm">—</span>;
  const kb = (charCount / 1000).toFixed(1);
  return (
    <span className="text-emerald-300 text-sm font-semibold" title={`${charCount.toLocaleString('ro-RO')} caractere`}>
      ✓ {kb}K
    </span>
  );
}

// ——— Time Ago ————————————————————————————————————————————————————————
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'niciodată';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'acum';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}z`;
}

// ——— Spinner —————————————————————————————————————————————————————————
function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ——— Preview Modal ———————————————————————————————————————————————————
function PreviewModal({ data, onClose }: { data: PreviewData; onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Highlight search matches
  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase()
        ? `<mark class="bg-amber-400/40 text-amber-100 rounded px-0.5">${part}</mark>`
        : part
    ).join('');
  };

  const matchCount = searchTerm.trim()
    ? (data.full_text.match(new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-zinc-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{data.act_key}</h2>
            <p className="text-sm text-zinc-400 mt-0.5">{data.title}</p>
            <p className="text-xs text-zinc-500 mt-1">
              {data.char_count.toLocaleString('ro-RO')} caractere · {(data.char_count / 1000).toFixed(1)}K
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 sm:px-5 py-3 border-b border-zinc-800 flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Caută în text..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200
                placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>
          {searchTerm && (
            <span className="text-sm text-zinc-400 whitespace-nowrap">
              {matchCount} {matchCount === 1 ? 'rezultat' : 'rezultate'}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div
            className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono"
            dangerouslySetInnerHTML={{
              __html: searchTerm ? highlightText(data.full_text, searchTerm) : data.full_text,
            }}
          />
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-zinc-700 flex items-center justify-between">
          <p className="text-xs text-zinc-500">Ctrl+F funcționează și nativ în browser</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(data.full_text);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copiază text
          </button>
        </div>
      </div>
    </div>
  );
}

// ——— Main Component —————————————————————————————————————————————————
export default function LegalImportAdmin() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [tab, setTab] = useState<TabType>('status');
  const [statusData, setStatusData] = useState<MonitorStatus[]>([]);
  const [logs, setLogs] = useState<MonitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [logLimit, setLogLimit] = useState(50);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState<string | null>(null);
  const [textLengths, setTextLengths] = useState<Record<string, number>>({});

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ——— Data Fetching —————————————————————————————————————————————————
  const fetchStatus = useCallback(async () => {
    const { data, error } = await supabase
      .from('v_monitor_status')
      .select('*')
      .order('act_key');
    if (error) {
      setToast({ message: `Eroare: ${error.message}`, type: 'error' });
    } else {
      setStatusData(data || []);
    }
  }, [supabase]);

  const fetchLogs = useCallback(async () => {
    const { data } = await supabase
      .from('ro_monitor_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(logLimit);
    setLogs(data || []);
  }, [supabase, logLimit]);

  const fetchTextLengths = useCallback(async () => {
    const { data } = await supabase
      .from('legal_acts')
      .select('source_reference, full_text')
      .eq('country_code', 'RO');
    if (data) {
      const lengths: Record<string, number> = {};
      data.forEach((row: { source_reference: string; full_text: string | null }) => {
        if (row.full_text) {
          lengths[row.source_reference] = row.full_text.length;
        }
      });
      setTextLengths(lengths);
    }
  }, [supabase]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStatus(), fetchLogs(), fetchTextLengths()]);
      setLoading(false);
    };
    load();
  }, [fetchStatus, fetchLogs, fetchTextLengths]);

  // ——— Preview ———————————————————————————————————————————————————————
  const handlePreview = async (act: MonitorStatus) => {
    setPreviewLoading(act.act_key);
    try {
      const { data, error } = await supabase
        .from('legal_acts')
        .select('full_text, title')
        .eq('source_reference', act.act_key)
        .eq('country_code', 'RO')
        .single();

      if (error || !data?.full_text) {
        setToast({ message: `Nu există text importat pentru ${act.act_key}`, type: 'error' });
      } else {
        setPreview({
          act_key: act.act_key,
          title: data.title || act.act_full_name || act.act_key,
          full_text: data.full_text,
          char_count: data.full_text.length,
        });
      }
    } catch (err) {
      setToast({ message: `Eroare: ${(err as Error).message}`, type: 'error' });
    } finally {
      setPreviewLoading(null);
    }
  };

  // ——— Actions ———————————————————————————————————————————————————————
  const handleReCheckAll = async () => {
    setActionLoading('re-check-all');
    try {
      const res = await fetch('/api/legislative-import/ro-check', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `Re-check complet: ${data.total || 0} acte verificate`, type: 'success' });
        await fetchStatus();
        await fetchLogs();
        await fetchTextLengths();
      } else {
        setToast({ message: `Eroare: ${data.error || res.statusText}`, type: 'error' });
      }
    } catch (err) {
      setToast({ message: `Eroare rețea: ${(err as Error).message}`, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReImport = async (actKey: string) => {
    setActionLoading(actKey);
    try {
      const res = await fetch(`/api/legislative-import/ro-import?act=${actKey}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `Import ${actKey}: ${data.status || 'OK'}`, type: 'success' });
        await fetchStatus();
        await fetchLogs();
        await fetchTextLengths();
      } else {
        setToast({ message: `Eroare ${actKey}: ${data.error || res.statusText}`, type: 'error' });
      }
    } catch (err) {
      setToast({ message: `Eroare rețea: ${(err as Error).message}`, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // ——— Computed ——————————————————————————————————————————————————————
  const filteredStatus = filterStatus === 'all'
    ? statusData
    : statusData.filter((s) => s.status === filterStatus);

  const stats = {
    total: statusData.length,
    ok: statusData.filter((s) => s.status === 'ok').length,
    changed: statusData.filter((s) => s.status === 'changed').length,
    error: statusData.filter((s) => s.status === 'error').length,
    never: statusData.filter((s) => s.status === 'never').length,
    withText: statusData.filter((s) => s.has_full_text).length,
  };

  // ——— Render ————————————————————————————————————————————————————————
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Preview Modal */}
      {preview && <PreviewModal data={preview} onClose={() => setPreview(null)} />}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-2xl border
          ${toast.type === 'success'
            ? 'bg-emerald-950/95 border-emerald-700 text-emerald-200'
            : 'bg-red-950/95 border-red-700 text-red-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* ——— HEADER ——————————————————————————————————————————————————— */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                M7 Legislative Monitor
              </h1>
            </div>
            <p className="text-sm text-zinc-400 mt-1 ml-5">
              România · {stats.total} acte · {stats.withText} cu text
            </p>
          </div>

          <button
            onClick={handleReCheckAll}
            disabled={actionLoading === 're-check-all'}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
              bg-emerald-600 hover:bg-emerald-500 text-white
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-lg shadow-emerald-900/30"
          >
            {actionLoading === 're-check-all' ? (
              <><Spinner /> Se verifică…</>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Re-check All
              </>
            )}
          </button>
        </div>

        {/* ——— STAT CARDS —————————————————————————————————————————————— */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 px-4 py-3">
            <p className="text-xs sm:text-sm text-emerald-400/80 font-medium">OK</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-300 mt-0.5">{loading ? '—' : stats.ok}</p>
          </div>
          <div className="rounded-xl border border-amber-800/50 bg-amber-950/30 px-4 py-3">
            <p className="text-xs sm:text-sm text-amber-400/80 font-medium">Modificate</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-300 mt-0.5">{loading ? '—' : stats.changed}</p>
          </div>
          <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3">
            <p className="text-xs sm:text-sm text-red-400/80 font-medium">Erori</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-300 mt-0.5">{loading ? '—' : stats.error}</p>
          </div>
          <div className="rounded-xl border border-zinc-600/50 bg-zinc-800/50 px-4 py-3">
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">Neverificate</p>
            <p className="text-2xl sm:text-3xl font-bold text-zinc-200 mt-0.5">{loading ? '—' : stats.never}</p>
          </div>
        </div>

        {/* ——— TABS ———————————————————————————————————————————————————— */}
        <div className="flex items-center gap-1 mb-5 border-b border-zinc-700">
          {(['status', 'logs'] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors relative
                ${tab === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {t === 'status' ? 'Status Acte' : 'Log Verificări'}
              {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />}
            </button>
          ))}
        </div>

        {/* ——— STATUS TAB ——————————————————————————————————————————————— */}
        {tab === 'status' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
              <span className="text-sm text-zinc-400 mr-1">Filtrare:</span>
              {([
                { key: 'all', label: 'Toate' },
                { key: 'ok', label: 'OK' },
                { key: 'changed', label: 'Changed' },
                { key: 'error', label: 'Erori' },
                { key: 'never', label: 'Neverif.' },
              ] as { key: FilterStatus; label: string }[]).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${filterStatus === f.key
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner className="h-6 w-6 text-zinc-500" />
              </div>
            ) : filteredStatus.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                Niciun act găsit cu filtrul selectat
              </div>
            ) : (
              <>
                {/* ——— MOBILE: Card Layout ——————————————————————————————— */}
                <div className="sm:hidden space-y-2">
                  {filteredStatus.map((act) => (
                    <div key={act.act_key} className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-4">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <p className="text-base font-bold text-white truncate">{act.act_key}</p>
                          <p className="text-sm text-zinc-400 truncate">{act.act_full_name || '—'}</p>
                        </div>
                        <StatusBadge status={act.status} size="sm" />
                      </div>

                      {/* Domain tags */}
                      <DomainTags tags={act.tags} />

                      {/* Info row */}
                      <div className="flex items-center gap-3 mt-3 text-sm">
                        <PriorityBadge priority={act.priority} />
                        <TextSize charCount={textLengths[act.act_key] || null} />
                        <span className="text-zinc-500 ml-auto">{timeAgo(act.last_checked_at)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-700/50">
                        <button
                          onClick={() => handlePreview(act)}
                          disabled={!act.has_full_text || previewLoading === act.act_key}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                            bg-zinc-700 hover:bg-zinc-600 text-zinc-200 border border-zinc-600 transition-colors
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {previewLoading === act.act_key ? <Spinner className="h-3.5 w-3.5" /> : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          Vizualizare
                        </button>
                        {act.portal_url && (
                          <a
                            href={act.portal_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                              bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border border-zinc-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            Sursă
                          </a>
                        )}
                        <button
                          onClick={() => handleReImport(act.act_key)}
                          disabled={actionLoading === act.act_key}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                            bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border border-zinc-600
                            transition-colors disabled:opacity-50"
                        >
                          {actionLoading === act.act_key ? <Spinner className="h-3.5 w-3.5" /> : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                          )}
                          Import
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ——— DESKTOP: Table Layout ————————————————————————————— */}
                <div className="hidden sm:block rounded-xl border border-zinc-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-zinc-800/80 border-b border-zinc-700">
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Act</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Prioritate</th>
                          <th className="text-center px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Status</th>
                          <th className="text-center px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Text</th>
                          <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Verificat</th>
                          <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Acțiuni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-700/40">
                        {filteredStatus.map((act) => (
                          <tr key={act.act_key} className="hover:bg-zinc-800/60 transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-semibold text-white text-sm">{act.act_key}</p>
                              <p className="text-sm text-zinc-400 mt-0.5 max-w-sm truncate">{act.act_full_name || '—'}</p>
                              <DomainTags tags={act.tags} />
                            </td>
                            <td className="px-5 py-4">
                              <PriorityBadge priority={act.priority} />
                            </td>
                            <td className="px-5 py-4 text-center">
                              <StatusBadge status={act.status} />
                            </td>
                            <td className="px-5 py-4 text-center">
                              <TextSize charCount={textLengths[act.act_key] || null} />
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="text-sm text-zinc-300" title={act.last_checked_at || 'Niciodată'}>
                                {timeAgo(act.last_checked_at)}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Preview button */}
                                <button
                                  onClick={() => handlePreview(act)}
                                  disabled={!act.has_full_text || previewLoading === act.act_key}
                                  className="p-2 rounded-lg text-zinc-400 hover:text-emerald-300 hover:bg-zinc-800 transition-colors
                                    disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="Vizualizare text"
                                >
                                  {previewLoading === act.act_key ? <Spinner className="h-4 w-4" /> : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  )}
                                </button>
                                {/* External link */}
                                {act.portal_url && (
                                  <a
                                    href={act.portal_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                    title="Deschide pe legislatie.just.ro"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                  </a>
                                )}
                                {/* Import button */}
                                <button
                                  onClick={() => handleReImport(act.act_key)}
                                  disabled={actionLoading === act.act_key}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold
                                    bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 hover:border-zinc-500
                                    text-zinc-200 transition-all disabled:opacity-50"
                                  title={`Re-import ${act.act_key}`}
                                >
                                  {actionLoading === act.act_key ? (
                                    <Spinner className="h-3.5 w-3.5" />
                                  ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                  )}
                                  Import
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ——— LOGS TAB ———————————————————————————————————————————————— */}
        {tab === 'logs' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Ultimele {logs.length} intrări</span>
              {logs.length >= logLimit && (
                <button
                  onClick={() => setLogLimit((l) => l + 50)}
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Încarcă mai multe →
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16"><Spinner className="h-6 w-6 text-zinc-500" /></div>
            ) : logs.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">Niciun log înregistrat încă</div>
            ) : (
              <>
                {/* MOBILE Log Cards */}
                <div className="sm:hidden space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-3.5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-bold text-white font-mono">{log.act_key}</span>
                        <StatusBadge status={log.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <span className="font-mono">
                          {new Date(log.created_at).toLocaleString('ro-RO', {
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                        <span>{log.check_type}</span>
                      </div>
                      {log.message && <p className="text-sm text-zinc-300 mt-2 break-words">{log.message}</p>}
                      {log.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-300">detalii JSON</summary>
                          <pre className="mt-1 text-xs text-zinc-500 font-mono overflow-x-auto p-2 bg-zinc-950 rounded-lg">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>

                {/* DESKTOP Log Table */}
                <div className="hidden sm:block rounded-xl border border-zinc-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-zinc-800/80 border-b border-zinc-700">
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Timp</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Act</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Tip</th>
                          <th className="text-center px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">Mesaj</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-700/40">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-zinc-800/60 transition-colors">
                            <td className="px-5 py-3">
                              <span className="text-sm text-zinc-300 font-mono whitespace-nowrap">
                                {new Date(log.created_at).toLocaleString('ro-RO', {
                                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
                                })}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-sm font-mono font-semibold text-white">{log.act_key}</span>
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-sm text-zinc-300">{log.check_type}</span>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <StatusBadge status={log.status} />
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-sm text-zinc-300 max-w-md truncate block">{log.message || '—'}</span>
                              {log.details && (
                                <details className="mt-1">
                                  <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-300">detalii JSON</summary>
                                  <pre className="mt-1 text-xs text-zinc-500 font-mono overflow-x-auto max-w-md p-2 bg-zinc-950 rounded-lg">
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-zinc-700/50 text-center">
          <p className="text-xs text-zinc-600">M7 Legislative Monitor · s-s-m.ro · CRON daily · Manual override</p>
        </div>
      </div>
    </div>
  );
}
