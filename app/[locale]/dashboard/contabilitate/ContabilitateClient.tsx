'use client';

/**
 * ContabilitateClient - Main accounting module with tabs
 * Created: 2026-02-16
 */

import { useState, useEffect } from 'react';
import {
  AccountingContract,
  AccountingDeadline,
  AccountingDashboardStats,
} from '@/lib/services/accounting-types';
import ContractForm from '@/components/accounting/ContractForm';
import DeadlineCard from '@/components/accounting/DeadlineCard';

type TabType = 'dashboard' | 'contracts' | 'deadlines' | 'activity';

export default function ContabilitateClient() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AccountingDashboardStats | null>(null);
  const [contracts, setContracts] = useState<AccountingContract[]>([]);
  const [deadlines, setDeadlines] = useState<AccountingDeadline[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [showContractForm, setShowContractForm] = useState(false);
  const [editingContract, setEditingContract] = useState<AccountingContract | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        await loadDashboardStats();
      } else if (activeTab === 'contracts') {
        await loadContracts();
      } else if (activeTab === 'deadlines') {
        await loadDeadlines();
      } else if (activeTab === 'activity') {
        await loadActivityLog();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    const response = await fetch('/api/accounting/dashboard');
    const data = await response.json();
    setStats(data.stats);
  };

  const loadContracts = async () => {
    const response = await fetch('/api/accounting/contracts?status=active');
    const data = await response.json();
    setContracts(data.contracts || []);
  };

  const loadDeadlines = async () => {
    const response = await fetch('/api/accounting/deadlines?view=all');
    const data = await response.json();
    setDeadlines(data.deadlines || []);
  };

  const loadActivityLog = async () => {
    // Would implement activity log API
    setActivityLog([]);
  };

  const handleSaveContract = async (contractData: any) => {
    try {
      const response = await fetch('/api/accounting/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) throw new Error('Failed to save contract');

      await loadContracts();
      setShowContractForm(false);
      setEditingContract(null);
    } catch (error) {
      console.error('Error saving contract:', error);
      throw error;
    }
  };

  const handleUpdateDeadlineStatus = async (deadlineId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/accounting/deadlines', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deadlineId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update deadline');

      await loadDeadlines();
      if (activeTab === 'dashboard') {
        await loadDashboardStats();
      }
    } catch (error) {
      console.error('Error updating deadline:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Contabilitate & Fiscal</h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestionare contracte, termene fiscale și monitorizare KPI
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 overflow-x-auto pb-px -mb-px">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'contracts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Contracte
            </button>
            <button
              onClick={() => setActiveTab('deadlines')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'deadlines'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Termene
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Jurnal
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && activeTab === 'dashboard' && <DashboardTab stats={stats} />}
        {!loading && activeTab === 'contracts' && (
          <ContractsTab
            contracts={contracts}
            onAddContract={() => setShowContractForm(true)}
            onEditContract={(contract) => {
              setEditingContract(contract);
              setShowContractForm(true);
            }}
          />
        )}
        {!loading && activeTab === 'deadlines' && (
          <DeadlinesTab deadlines={deadlines} onStatusChange={handleUpdateDeadlineStatus} />
        )}
        {!loading && activeTab === 'activity' && <ActivityTab activityLog={activityLog} />}
      </div>

      {/* Contract Form Modal */}
      <ContractForm
        isOpen={showContractForm}
        onClose={() => {
          setShowContractForm(false);
          setEditingContract(null);
        }}
        onSave={handleSaveContract}
        contract={editingContract}
      />
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ stats }: { stats: AccountingDashboardStats | null }) {
  if (!stats) {
    return <div className="text-gray-500">Nu există date disponibile</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Contracte active</h3>
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeContracts}</p>
          <p className="text-sm text-gray-500 mt-1">din {stats.totalContracts} total</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Venit lunar</h3>
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalMonthlyRevenue.toLocaleString('ro-RO', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-500 mt-1">RON</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Termene (7 zile)</h3>
            <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.upcomingDeadlines7days}</p>
          <p className="text-sm text-gray-500 mt-1">viitoare</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Restante</h3>
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.overdueCount}</p>
          <p className="text-sm text-red-600 mt-1">necesită atenție</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Rată completare</h3>
            <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
          <p className="text-sm text-gray-500 mt-1">ultimele 30 zile</p>
        </div>
      </div>
    </div>
  );
}

// Contracts Tab Component
function ContractsTab({
  contracts,
  onAddContract,
  onEditContract,
}: {
  contracts: AccountingContract[];
  onAddContract: () => void;
  onEditContract: (contract: AccountingContract) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Contracte ({contracts.length})
        </h2>
        <button
          onClick={onAddContract}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adaugă contract
        </button>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Niciun contract încă</h3>
          <p className="text-gray-600 mb-6">Începe prin a adăuga primul contract de contabilitate</p>
          <button
            onClick={onAddContract}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Adaugă primul contract
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    CUI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Servicii
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tarif lunar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contract.client_name}</div>
                      {contract.contract_number && (
                        <div className="text-xs text-gray-500">#{contract.contract_number}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contract.client_cui || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contract.services.slice(0, 3).map((service) => (
                          <span
                            key={service.type}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
                          >
                            {service.label}
                          </span>
                        ))}
                        {contract.services.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{contract.services.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.monthly_fee
                        ? `${contract.monthly_fee.toLocaleString('ro-RO')} ${contract.currency}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contract.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : contract.status === 'suspended'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {contract.status === 'active' ? 'Activ' : contract.status === 'suspended' ? 'Suspendat' : 'Terminat'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => onEditContract(contract)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Editează
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Deadlines Tab Component
function DeadlinesTab({
  deadlines,
  onStatusChange,
}: {
  deadlines: AccountingDeadline[];
  onStatusChange: (deadlineId: string, newStatus: string) => Promise<void>;
}) {
  const upcomingDeadlines = deadlines.filter((d) => {
    const daysRemaining = Math.ceil((new Date(d.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining >= 0 && d.status !== 'completed';
  });

  const overdueDeadlines = deadlines.filter((d) => {
    const daysRemaining = Math.ceil((new Date(d.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining < 0 && d.status !== 'completed';
  });

  return (
    <div className="space-y-8">
      {/* Overdue */}
      {overdueDeadlines.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Restante ({overdueDeadlines.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueDeadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Termene viitoare ({upcomingDeadlines.length})
        </h2>
        {upcomingDeadlines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Niciun termen viitor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingDeadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Activity Tab Component
function ActivityTab({ activityLog }: { activityLog: any[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Jurnal activitate</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Jurnalul de activitate va fi disponibil curând</p>
      </div>
    </div>
  );
}
