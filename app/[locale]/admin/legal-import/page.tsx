'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ─── Types ───────────────────────────────────────────────────────────────────
interface MonitorStatus {
  act_key: string;
  act_full_name: string;
  act_type: string;
  act_number: string;
  act_year: number;
  domain: string;
  source_url: string | null;
  portal_id: string | null;
  content_hash: string | null;
  last_checked_at: string | null;
  last_changed_at: string | null;
  check_status: 'never_checked' | 'ok' | 'changed' | 'error';
  has_full_text: boolean;
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

type TabType = 'status' | 'logs';
type FilterStatus = 'all' | 'never_checked' | 'ok' | 'changed' | 'error';

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    ok: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: '✓' },
    changed: { bg: 'bg-amber-500/15', text: 'text-amber-400', icon: '△' },
    error: { bg: 'bg-red-500/15', text: 'text-red-400', icon: '✕' },
    never_checked: { bg: 'bg-zinc-500/15', text: 'text-zinc-500', icon: '—' },
    success: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: '✓' },
    no_change: { bg: 'bg-zinc-500/15', text: 'text-zinc-500', icon: '=' },
  };
  const c = config[status] || config.never_checked;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium ${c.bg} ${c.text}`}>
      <span className="text-[10px]">{c.icon}</span>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}

// ─── Time Ago ────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'acum';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}z`;
}

// ─── Main Component ──────────────────────────────────────────────────────────
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

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ─── Data Fetching ───────────────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    const { data, error } = await supabase
      .from('v_monitor_status')
      .select('*')
      .order('act_key');

    if (error) {
      console.error('Error fetching status:', error);
      setToast({ message: `Eroare la încărcarea statusului: ${error.message}`, type: 'error' });
    } else {
      setStatusData(data || []);
    }
  }, [supabase]);

  const fetchLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('ro_monitor_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(logLimit);

    if (error) {
      console.error('Error fetching logs:', error);
    } else {
      setLogs(data || []);
    }
  }, [supabase, logLimit]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStatus(), fetchLogs()]);
      setLoading(false);
    };
    load();
  }, [fetchStatus, fetchLogs]);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handleReCheckAll = async () => {
    setActionLoading('re-check-all');
    try {
      const res = await fetch('/api/legislative-import/ro-check', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `Re-check complet: ${data.checked || 0} acte verificate`, type: 'success' });
        await fetchStatus();
        await fetchLogs();
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
        setToast({ message: `Re-import ${actKey}: ${data.status || 'OK'}`, type: 'success' });
        await fetchStatus();
        await fetchLogs();
      } else {
        setToast({ message: `Eroare import ${actKey}: ${data.error || res.statusText}`, type: 'error' });
      }
    } catch (err) {
      setToast({ message: `Eroare rețea: ${(err as Error).message}`, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Filtered Data ───────────────────────────────────────────────────────
  const filteredStatus = filterStatus === 'all'
    ? statusData
    : statusData.filter((s) => s.check_status === filterStatus);

  // ─── Stats ───────────────────────────────────────────────────────────────
  const stats = {
    total: statusData.length,
    ok: statusData.filter((s) => s.check_status === 'ok').length,
    changed: statusData.filter((s) => s.check_status === 'changed').length,
    error: statusData.filter((s) => s.check_status === 'error').length,
    never: statusData.filter((s) => s.check_status === 'never_checked').length,
    withText: statusData.filter((s) => s.has_full_text).length,
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-xl border
          ${toast.type === 'success'
            ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
            : 'bg-red-950 border-red-800 text-red-300'
          } animate-in slide-in-from-top-2`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
                M7 Legislative Monitor
              </h1>
            </div>
            <p className="text-sm text-zinc-500 ml-5">
              România · {stats.total} acte monitorizate · {stats.withText} cu text integral
            </p>
          </div>

          <button
            onClick={handleReCheckAll}
            disabled={actionLoading === 're-check-all'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600
              text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {actionLoading === 're-check-all' ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Se verifică…
              </>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'OK', value: stats.ok, color: 'emerald' },
            { label: 'Modificate', value: stats.changed, color: 'amber' },
            { label: 'Erori', value: stats.error, color: 'red' },
            { label: 'Neverificate', value: stats.never, color: 'zinc' },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3
                hover:border-zinc-700 transition-colors cursor-default`}
            >
              <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold tracking-tight text-${s.color}-400`}>
                {loading ? '—' : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-zinc-800">
          {(['status', 'logs'] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative
                ${tab === t
                  ? 'text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {t === 'status' ? 'Status Acte' : 'Log Verificări'}
              {tab === t && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ─── STATUS TAB ─────────────────────────────────────────────────── */}
        {tab === 'status' && (
          <>
            {/* Filter */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-zinc-500">Filtrare:</span>
              {(['all', 'ok', 'changed', 'error', 'never_checked'] as FilterStatus[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors
                    ${filterStatus === f
                      ? 'bg-zinc-700 text-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                    }`}
                >
                  {f === 'all' ? 'Toate' : f === 'never_checked' ? 'Neverificate' : f.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800">
                      <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Act</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Domeniu</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Text</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Ultima verificare</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-zinc-500">
                          <svg className="animate-spin h-5 w-5 mx-auto mb-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Se încarcă…
                        </td>
                      </tr>
                    ) : filteredStatus.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-zinc-500">
                          Niciun act găsit cu filtrul selectat
                        </td>
                      </tr>
                    ) : (
                      filteredStatus.map((act) => (
                        <tr key={act.act_key} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-zinc-200 text-xs">
                              {act.act_type.toUpperCase()} {act.act_number}/{act.act_year}
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5 max-w-xs truncate" title={act.act_full_name}>
                              {act.act_full_name}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-zinc-400">{act.domain}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <StatusBadge status={act.check_status} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {act.has_full_text ? (
                              <span className="text-emerald-400 text-xs">✓ Da</span>
                            ) : (
                              <span className="text-zinc-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-xs text-zinc-500" title={act.last_checked_at || 'Niciodată'}>
                              {timeAgo(act.last_checked_at)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {act.source_url && (
                                <a
                                  href={act.source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                                  title="Deschide sursa"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                  </svg>
                                </a>
                              )}
                              <button
                                onClick={() => handleReImport(act.act_key)}
                                disabled={actionLoading === act.act_key}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium
                                  bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600
                                  text-zinc-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title={`Re-import ${act.act_key}`}
                              >
                                {actionLoading === act.act_key ? (
                                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                  </svg>
                                )}
                                Import
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ─── LOGS TAB ───────────────────────────────────────────────────── */}
        {tab === 'logs' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-zinc-500">
                Ultimele {logs.length} intrări
              </span>
              {logs.length >= logLimit && (
                <button
                  onClick={() => { setLogLimit((l) => l + 50); }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Încarcă mai multe →
                </button>
              )}
            </div>

            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800">
                      <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Timp</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Act</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tip</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Mesaj</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-zinc-500">
                          Se încarcă…
                        </td>
                      </tr>
                    ) : logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-zinc-500">
                          Niciun log înregistrat încă
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="px-4 py-2.5">
                            <span className="text-xs text-zinc-500 font-mono whitespace-nowrap">
                              {new Date(log.created_at).toLocaleString('ro-RO', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs font-mono text-zinc-300">{log.act_key}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs text-zinc-400">{log.check_type}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs text-zinc-400 max-w-md truncate block" title={log.message || ''}>
                              {log.message || '—'}
                            </span>
                            {log.details && (
                              <details className="mt-1">
                                <summary className="text-[10px] text-zinc-600 cursor-pointer hover:text-zinc-400">
                                  detalii JSON
                                </summary>
                                <pre className="mt-1 text-[10px] text-zinc-600 font-mono overflow-x-auto max-w-md p-2 bg-zinc-900 rounded">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center">
          <p className="text-xs text-zinc-600">
            M7 Legislative Monitor · s-s-m.ro · CRON daily check · Manual override via dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
