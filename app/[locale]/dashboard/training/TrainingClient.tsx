// ============================================================
// S-S-M.RO — Training Dashboard Client Component
// File: app/dashboard/training/TrainingClient.tsx
// ============================================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getTrainingModules,
  getTrainingDashboard,
  getTrainingStats,
  getWorkerStatuses,
  getOrganizationWorkers,
  assignTraining,
  recordTrainingSession,
  checkOverdueAssignments,
} from '@/lib/training-queries';
import type {
  TrainingModule,
  TrainingDashboardRow,
  TrainingStats,
  WorkerTrainingStatus,
} from '@/lib/training-types';
import {
  STATUS_CONFIG,
  CATEGORY_CONFIG,
  VERIFICATION_CONFIG,
} from '@/lib/training-types';

type TabType = 'assignments' | 'workers' | 'modules';

interface Props {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui?: string }>
  initialSelectedOrg: string
}

export default function TrainingClient({ user, organizations, initialSelectedOrg }: Props) {
  // Organization selector
  const [selectedOrgId, setSelectedOrgId] = useState(initialSelectedOrg)

  // State
  const [activeTab, setActiveTab] = useState<TabType>('assignments');
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [dashboard, setDashboard] = useState<TrainingDashboardRow[]>([]);
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [workerStatuses, setWorkerStatuses] = useState<WorkerTrainingStatus[]>([]);
  const [workers, setWorkers] = useState<{ id: string; full_name: string; email: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Assign form
  const [assignModuleId, setAssignModuleId] = useState('');
  const [assignWorkerIds, setAssignWorkerIds] = useState<string[]>([]);
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignSelectAll, setAssignSelectAll] = useState(false);

  // Record session form
  const [recordModuleId, setRecordModuleId] = useState('');
  const [recordWorkerId, setRecordWorkerId] = useState('');
  const [recordInstructor, setRecordInstructor] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordDuration, setRecordDuration] = useState(60);
  const [recordLanguage, setRecordLanguage] = useState('ro');
  const [recordLocation, setRecordLocation] = useState('');
  const [recordTestTotal, setRecordTestTotal] = useState(10);
  const [recordTestCorrect, setRecordTestCorrect] = useState(0);

  // ============================================================
  // DATA LOADING
  // ============================================================
  const loadData = useCallback(async () => {
    if (!selectedOrgId) {
      setError('Selectează o organizație pentru a vizualiza instruirile.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check overdue assignments first
      await checkOverdueAssignments().catch(() => {});

      const [modulesData, dashboardData, statsData, workerStatusData, workersData] = await Promise.all([
        getTrainingModules(),
        getTrainingDashboard(selectedOrgId, {
          status: filterStatus || undefined,
          category: filterCategory || undefined,
        }),
        getTrainingStats(selectedOrgId),
        getWorkerStatuses(selectedOrgId),
        getOrganizationWorkers(selectedOrgId),
      ]);

      setModules(modulesData);
      setDashboard(dashboardData);
      setStats(statsData);
      setWorkerStatuses(workerStatusData);
      setWorkers(workersData);
    } catch (err) {
      setError(err instanceof Error ? err.message + ' | ' + err.stack : JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }, [selectedOrgId, filterStatus, filterCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ============================================================
  // ACTIONS
  // ============================================================
  const handleAssign = async () => {
    if (!assignModuleId || assignWorkerIds.length === 0) return;

    try {
      await assignTraining({
        organization_id: selectedOrgId,
        module_id: assignModuleId,
        worker_ids: assignWorkerIds,
        assigned_by: user.id,
        due_date: assignDueDate || undefined,
      });

      setShowAssignModal(false);
      setAssignModuleId('');
      setAssignWorkerIds([]);
      setAssignDueDate('');
      setAssignSelectAll(false);
      await loadData();
    } catch (err) {
      alert(`Eroare: ${err instanceof Error ? err.message : 'Necunoscută'}`);
    }
  };

  const handleRecordSession = async () => {
    if (!recordModuleId || !recordWorkerId || !recordInstructor) return;

    try {
      const score = recordTestTotal > 0
        ? Math.round((recordTestCorrect / recordTestTotal) * 100 * 10) / 10
        : 0;

      await recordTrainingSession({
        organization_id: selectedOrgId,
        module_id: recordModuleId,
        worker_id: recordWorkerId,
        instructor_name: recordInstructor,
        session_date: recordDate,
        duration_minutes: recordDuration,
        language: recordLanguage,
        location: recordLocation || undefined,
        test_score: score,
        test_questions_total: recordTestTotal,
        test_questions_correct: recordTestCorrect,
      });

      setShowRecordModal(false);
      resetRecordForm();
      await loadData();
    } catch (err) {
      alert(`Eroare: ${err instanceof Error ? err.message : 'Necunoscută'}`);
    }
  };

  const resetRecordForm = () => {
    setRecordModuleId('');
    setRecordWorkerId('');
    setRecordInstructor('');
    setRecordDate(new Date().toISOString().split('T')[0]);
    setRecordDuration(60);
    setRecordLanguage('ro');
    setRecordLocation('');
    setRecordTestTotal(10);
    setRecordTestCorrect(0);
  };

  // Download employee training record PDF
  const handleDownloadTrainingRecord = async (workerId: string, workerName: string) => {
    try {
      const response = await fetch('/api/generate-fisa-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: workerId,
          organizationId: selectedOrgId,
        }),
      });

      if (!response.ok) {
        throw new Error('Eroare la generare PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fisa_Instruire_${workerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(`Eroare la descărcare PDF: ${err instanceof Error ? err.message : 'Necunoscută'}`);
    }
  };

  const toggleWorkerSelection = (workerId: string) => {
    setAssignWorkerIds((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    );
  };

  const handleSelectAll = () => {
    if (assignSelectAll) {
      setAssignWorkerIds([]);
    } else {
      setAssignWorkerIds(workers.map((w) => w.id));
    }
    setAssignSelectAll(!assignSelectAll);
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const getDaysColor = (days: number | null) => {
    if (days === null) return 'text-slate-500';
    if (days < 0) return 'text-red-400';
    if (days < 7) return 'text-amber-400';
    return 'text-slate-400';
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-slate-500';
    if (score >= 70) return 'text-emerald-400';
    return 'text-red-400';
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-lg">Se încarcă modulul de instruire...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 max-w-lg">
          <h2 className="text-red-400 font-bold text-lg mb-2">Eroare</h2>
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            Reîncearcă
          </button>
        </div>
      </div>
    );
  }

  const testScore = recordTestTotal > 0
    ? Math.round((recordTestCorrect / recordTestTotal) * 100 * 10) / 10
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Instruire SSM/PSI</h1>
              <p className="text-slate-400 text-sm mt-1">Gestionare instruiri, sesiuni, conformitate</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium text-sm transition-colors"
              >
                + Atribuie Instruire
              </button>
              <button
                onClick={() => setShowRecordModal(true)}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                📝 Înregistrează Sesiune
              </button>
            </div>
          </div>

          {/* Organization Selector */}
          {organizations.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-sm">Organizație:</label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui ? `(${org.cui})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* STATS CARDS */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <StatCard label="Total Atribuite" value={stats.total_assigned} color="text-slate-300" />
            <StatCard label="Completate" value={`${stats.completed} (${stats.completion_rate}%)`} color="text-emerald-400" />
            <StatCard label="În Curs" value={stats.in_progress} color="text-amber-400" />
            <StatCard label="Depășite" value={stats.overdue} color={stats.overdue > 0 ? 'text-red-400' : 'text-slate-400'} />
            <StatCard label="Scor Mediu Test" value={`${stats.avg_test_score}%`} color="text-blue-400" />
            <StatCard label="Scadente 30 Zile" value={stats.upcoming_due} color="text-amber-400" />
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-slate-900 rounded-xl p-1 w-fit">
          {[
            { key: 'assignments' as TabType, label: 'Atribuiri' },
            { key: 'workers' as TabType, label: 'Angajați' },
            { key: 'modules' as TabType, label: 'Module' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.key
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div>
            {/* Filters */}
            <div className="flex gap-3 mb-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Toate statusurile</option>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Toate categoriile</option>
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Angajat</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Modul</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Termen</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Verificare</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                        Nicio atribuire găsită. Click "Atribuie Instruire" pentru a începe.
                      </td>
                    </tr>
                  ) : (
                    dashboard.map((row) => (
                      <tr key={row.assignment_id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-white font-medium">{row.worker_name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-medium"
                              style={{
                                color: CATEGORY_CONFIG[row.category]?.color || '#6B7280',
                                backgroundColor: `${CATEGORY_CONFIG[row.category]?.color || '#6B7280'}20`,
                              }}
                            >
                              {CATEGORY_CONFIG[row.category]?.label || row.category}
                            </span>
                            <span className="text-slate-300">{row.module_title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs px-2 py-1 rounded-full font-medium"
                              style={{
                                color: STATUS_CONFIG[row.status]?.color || '#6B7280',
                                backgroundColor: STATUS_CONFIG[row.status]?.bgColor || '#1F2937',
                              }}
                            >
                              {STATUS_CONFIG[row.status]?.label || row.status}
                            </span>
                            {row.alert_type && (
                              <span className={`text-xs px-1.5 py-0.5 rounded font-bold
                                ${row.alert_type === 'DEPĂȘIT' ? 'bg-red-900/50 text-red-400' :
                                  row.alert_type === 'URGENT' ? 'bg-amber-900/50 text-amber-400' :
                                  'bg-blue-900/50 text-blue-400'}`}
                              >
                                {row.alert_type}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`px-4 py-3 ${getDaysColor(row.days_until_due)}`}>
                          {row.due_date
                            ? new Date(row.due_date).toLocaleDateString('ro-RO')
                            : '—'}
                          {row.days_until_due !== null && (
                            <span className="text-xs ml-1">
                              ({row.days_until_due > 0 ? `${row.days_until_due}z` : `${Math.abs(row.days_until_due)}z dep.`})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {row.verification_result ? (
                            <span className={`text-xs font-bold ${
                              row.verification_result === 'admis' ? 'text-emerald-400' :
                              row.verification_result === 'respins' ? 'text-red-400' :
                              'text-amber-400'
                            }`}>
                              {VERIFICATION_CONFIG[row.verification_result]?.label}
                              {row.test_score !== null && (
                                <span className={`ml-1 font-normal ${getScoreColor(row.test_score)}`}>
                                  ({row.test_score}%)
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{row.instructor_name || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: WORKERS */}
        {activeTab === 'workers' && (
          <div className="space-y-3">
            {workerStatuses.length === 0 ? (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center text-slate-500">
                Niciun angajat cu instruiri atribuite.
              </div>
            ) : (
              workerStatuses.map((ws) => (
                <div key={ws.worker_id} className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-white font-medium">{ws.worker_name}</span>
                      <span className="text-slate-500 text-sm ml-3">
                        {ws.completed}/{ws.total_required} complete
                        {ws.overdue > 0 && (
                          <span className="text-red-400 ml-2">· {ws.overdue} depășite</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {ws.next_due && (
                        <span className="text-slate-400 text-xs">
                          Următoarea: {new Date(ws.next_due).toLocaleDateString('ro-RO')}
                        </span>
                      )}
                      <button
                        onClick={() => handleDownloadTrainingRecord(ws.worker_id, ws.worker_name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Descarcă Fișa de Instruire ITM"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Fișă ITM
                      </button>
                    </div>
                  </div>
                  {/* Compliance bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        ws.compliance_percentage >= 80 ? 'bg-emerald-500' :
                        ws.compliance_percentage >= 50 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${ws.compliance_percentage}%` }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className={`text-xs font-medium ${
                      ws.compliance_percentage >= 80 ? 'text-emerald-400' :
                      ws.compliance_percentage >= 50 ? 'text-amber-400' :
                      'text-red-400'
                    }`}>
                      {ws.compliance_percentage}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: MODULES */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => (
              <div key={mod.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-500 text-xs font-mono">{mod.code}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{
                        color: CATEGORY_CONFIG[mod.category]?.color || '#6B7280',
                        backgroundColor: `${CATEGORY_CONFIG[mod.category]?.color || '#6B7280'}20`,
                      }}
                    >
                      {CATEGORY_CONFIG[mod.category]?.label}
                    </span>
                    {mod.is_mandatory && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 font-medium">
                        Obligatoriu
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-white font-medium mb-2">{mod.title}</h3>
                {mod.description && (
                  <p className="text-slate-400 text-xs mb-3 line-clamp-2">{mod.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>⏱ {mod.duration_minutes_required} min</span>
                  <span>📝 {mod.min_test_questions} întrebări</span>
                  {mod.periodicity_months && (
                    <span>🔄 La {mod.periodicity_months} luni</span>
                  )}
                </div>
                {mod.legal_basis?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {mod.legal_basis.map((lb, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                        {lb}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: ASSIGN TRAINING */}
        {/* ============================================================ */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Atribuie Instruire</h2>

                {/* Module selector */}
                <div className="mb-4">
                  <label className="block text-slate-400 text-sm mb-1.5">Modul de instruire</label>
                  <select
                    value={assignModuleId}
                    onChange={(e) => setAssignModuleId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                  >
                    <option value="">— Selectează modulul —</option>
                    {modules.map((mod) => (
                      <option key={mod.id} value={mod.id}>
                        {mod.code} — {mod.title} ({mod.duration_minutes_required} min)
                        {mod.is_mandatory ? ' ★' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due date */}
                <div className="mb-4">
                  <label className="block text-slate-400 text-sm mb-1.5">Termen limită (opțional)</label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                  />
                </div>

                {/* Worker selection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-400 text-sm">Angajați</label>
                    <button
                      onClick={handleSelectAll}
                      className="text-teal-400 text-xs hover:text-teal-300"
                    >
                      {assignSelectAll ? 'Deselectează tot' : 'Selectează tot'}
                    </button>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg max-h-48 overflow-y-auto">
                    {workers.length === 0 ? (
                      <div className="px-3 py-4 text-slate-500 text-sm text-center">
                        Niciun angajat găsit în organizație
                      </div>
                    ) : (
                      workers.map((w) => (
                        <label
                          key={w.id}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={assignWorkerIds.includes(w.id)}
                            onChange={() => toggleWorkerSelection(w.id)}
                            className="rounded border-slate-600"
                          />
                          <span className="text-white text-sm">{w.full_name}</span>
                          <span className="text-slate-500 text-xs ml-auto">{w.role}</span>
                        </label>
                      ))
                    )}
                  </div>
                  {assignWorkerIds.length > 0 && (
                    <p className="text-teal-400 text-xs mt-1">
                      Atribuie la {assignWorkerIds.length} angajat{assignWorkerIds.length > 1 ? 'i' : ''}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleAssign}
                    disabled={!assignModuleId || assignWorkerIds.length === 0}
                    className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-medium"
                  >
                    Atribuie
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: RECORD SESSION */}
        {/* ============================================================ */}
        {showRecordModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Înregistrează Sesiune de Instruire</h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Module */}
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-sm mb-1.5">Modul</label>
                    <select
                      value={recordModuleId}
                      onChange={(e) => setRecordModuleId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    >
                      <option value="">— Selectează modulul —</option>
                      {modules.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          {mod.code} — {mod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Worker */}
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-sm mb-1.5">Angajat</label>
                    <select
                      value={recordWorkerId}
                      onChange={(e) => setRecordWorkerId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    >
                      <option value="">— Selectează angajat —</option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>{w.full_name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Instructor (MANDATORY) */}
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-sm mb-1.5">
                      Instructor <span className="text-red-400">*</span>
                      <span className="text-slate-600 ml-1">(obligatoriu ITM)</span>
                    </label>
                    <input
                      type="text"
                      value={recordInstructor}
                      onChange={(e) => setRecordInstructor(e.target.value)}
                      placeholder="Nume instructor"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Data</label>
                    <input
                      type="date"
                      value={recordDate}
                      onChange={(e) => setRecordDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Durata (min)</label>
                    <input
                      type="number"
                      value={recordDuration}
                      onChange={(e) => setRecordDuration(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Limba</label>
                    <select
                      value={recordLanguage}
                      onChange={(e) => setRecordLanguage(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    >
                      <option value="ro">Română</option>
                      <option value="en">English</option>
                      <option value="ne">Nepali</option>
                      <option value="hi">Hindi</option>
                      <option value="bn">Bengali</option>
                      <option value="ar">Arabic</option>
                      <option value="tr">Turkish</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Locația</label>
                    <input
                      type="text"
                      value={recordLocation}
                      onChange={(e) => setRecordLocation(e.target.value)}
                      placeholder="Sediu"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>

                  {/* Test results */}
                  <div className="col-span-2 mt-2">
                    <label className="block text-slate-400 text-sm mb-3 font-medium">Rezultat Test</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-500 text-xs mb-1">Nr. întrebări</label>
                        <input
                          type="number"
                          value={recordTestTotal}
                          onChange={(e) => setRecordTestTotal(Number(e.target.value))}
                          min={0}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-xs mb-1">Corecte</label>
                        <input
                          type="number"
                          value={recordTestCorrect}
                          onChange={(e) => setRecordTestCorrect(Math.min(Number(e.target.value), recordTestTotal))}
                          min={0}
                          max={recordTestTotal}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-xs mb-1">Scor</label>
                        <div className={`w-full rounded-lg px-3 py-2 text-sm font-bold text-center ${
                          testScore >= 70 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'
                        }`}>
                          {testScore}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { setShowRecordModal(false); resetRecordForm(); }}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleRecordSession}
                    disabled={!recordModuleId || !recordWorkerId || !recordInstructor}
                    className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-medium"
                  >
                    Înregistrează
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================
function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
      <div className="text-slate-500 text-xs mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
