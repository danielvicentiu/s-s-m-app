'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Scale,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Filter,
  X,
  ExternalLink
} from 'lucide-react';
import type { OrganizationObligation, OrgObligationSummary } from '@/lib/services/obligation-publisher';

interface ObligationsClientProps {
  obligations: OrganizationObligation[];
  stats: OrgObligationSummary;
  organizationName: string;
  organizationId: string;
  userId: string;
  userRole: string;
}

type StatusFilter = 'all' | 'pending' | 'acknowledged' | 'compliant' | 'non_compliant';

export function ObligationsClient({
  obligations,
  stats,
  organizationName,
  organizationId,
  userId,
  userRole
}: ObligationsClientProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedObligation, setSelectedObligation] = useState<OrganizationObligation | null>(null);

  // Filter obligations based on status
  const filteredObligations = obligations.filter(obl => {
    if (statusFilter === 'all') return true;
    return obl.status === statusFilter;
  });

  // Handle acknowledge action
  const handleAcknowledge = async (obligationId: string) => {
    try {
      const response = await fetch(`/api/obligations/${obligationId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge obligation');
      }

      // Refresh page
      window.location.reload();
    } catch (error) {
      console.error('Error acknowledging obligation:', error);
      alert('Eroare la confirmarea obligației. Vă rugăm încercați din nou.');
    }
  };

  // Handle mark compliant action
  const handleMarkCompliant = async (obligationId: string, notes?: string) => {
    try {
      const response = await fetch(`/api/obligations/${obligationId}/compliant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notes })
      });

      if (!response.ok) {
        throw new Error('Failed to mark obligation as compliant');
      }

      // Refresh page
      window.location.reload();
    } catch (error) {
      console.error('Error marking obligation compliant:', error);
      alert('Eroare la marcarea obligației. Vă rugăm încercați din nou.');
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/dashboard" className="hover:text-gray-700">
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">Obligații Legale</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Scale className="h-7 w-7 text-blue-600" />
                Obligații Legale
              </h1>
              <p className="text-sm text-gray-500 mt-1">{organizationName}</p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Pendinte</p>
                  <p className="text-2xl font-bold text-amber-900 mt-1">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Confirmate</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{stats.acknowledged}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Conforme</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{stats.compliant}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* FILTERS */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrare după status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'acknowledged', 'compliant', 'non_compliant'] as StatusFilter[]).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' && 'Toate'}
                {status === 'pending' && 'Pendinte'}
                {status === 'acknowledged' && 'Confirmate'}
                {status === 'compliant' && 'Conforme'}
                {status === 'non_compliant' && 'Non-conforme'}
              </button>
            ))}
          </div>
        </div>

        {/* OBLIGATIONS LIST */}
        {filteredObligations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Scale className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nicio obligație găsită
            </h3>
            <p className="text-sm text-gray-500">
              {statusFilter === 'all'
                ? 'Nu există obligații legale asignate acestei organizații.'
                : `Nu există obligații cu statusul "${statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredObligations.map((obl) => {
              const obligation = obl.obligation as any;
              if (!obligation) return null;

              return (
                <div
                  key={obl.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Status Badge */}
                      <div className="mb-3">
                        {obl.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-medium">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {obl.status === 'acknowledged' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmat
                          </span>
                        )}
                        {obl.status === 'compliant' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Conform
                          </span>
                        )}
                        {obl.status === 'non_compliant' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-medium">
                            <AlertTriangle className="h-3 w-3" />
                            Non-conform
                          </span>
                        )}
                      </div>

                      {/* Obligation Text */}
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        {obligation.obligation_text}
                      </h3>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Sursă:</span>{' '}
                          {obligation.source_legal_act}
                        </div>
                        {obligation.frequency && (
                          <div>
                            <span className="font-medium">Frecvență:</span>{' '}
                            {obligation.frequency}
                          </div>
                        )}
                        {obligation.deadline && (
                          <div>
                            <span className="font-medium">Termen:</span>{' '}
                            {obligation.deadline}
                          </div>
                        )}
                      </div>

                      {/* Who */}
                      {obligation.who && obligation.who.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Responsabil: </span>
                          <span className="text-sm text-gray-600">
                            {obligation.who.join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Penalty */}
                      {obligation.penalty && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-red-900">Sancțiune:</p>
                          <p className="text-sm text-red-700 mt-1">{obligation.penalty}</p>
                          {obligation.penalty_min && obligation.penalty_max && (
                            <p className="text-xs text-red-600 mt-1">
                              {obligation.penalty_min.toLocaleString()} -{' '}
                              {obligation.penalty_max.toLocaleString()}{' '}
                              {obligation.penalty_currency}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Evidence Required */}
                      {obligation.evidence_required && obligation.evidence_required.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Dovezi necesare:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {obligation.evidence_required.map((evidence: string, idx: number) => (
                              <li key={idx}>{evidence}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Notes */}
                      {obl.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <p className="text-sm font-medium text-gray-700">Note:</p>
                          <p className="text-sm text-gray-600 mt-1">{obl.notes}</p>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="text-xs text-gray-500 mt-3">
                        Asignat la: {new Date(obl.assigned_at).toLocaleDateString('ro-RO')}
                        {obl.acknowledged_at && (
                          <> • Confirmat: {new Date(obl.acknowledged_at).toLocaleDateString('ro-RO')}</>
                        )}
                        {obl.compliant_at && (
                          <> • Conform: {new Date(obl.compliant_at).toLocaleDateString('ro-RO')}</>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {(userRole === 'consultant' || userRole === 'firma_admin') && (
                      <div className="flex flex-col gap-2">
                        {obl.status === 'pending' && (
                          <button
                            onClick={() => handleAcknowledge(obl.id)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                          >
                            Confirmă
                          </button>
                        )}
                        {(obl.status === 'acknowledged' || obl.status === 'pending') && (
                          <button
                            onClick={() => {
                              const notes = prompt('Adaugă note (opțional):');
                              handleMarkCompliant(obl.id, notes || undefined);
                            }}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                          >
                            Marchează Conform
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
