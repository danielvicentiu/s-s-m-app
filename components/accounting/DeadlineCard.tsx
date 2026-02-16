'use client';

/**
 * DeadlineCard - Display individual deadline with status and actions
 * Created: 2026-02-16
 */

import { useState } from 'react';
import { AccountingDeadline, DEADLINE_LABELS } from '@/lib/services/accounting-types';

interface DeadlineCardProps {
  deadline: AccountingDeadline;
  onStatusChange?: (deadlineId: string, newStatus: string) => Promise<void>;
}

export default function DeadlineCard({ deadline, onStatusChange }: DeadlineCardProps) {
  const [loading, setLoading] = useState(false);

  const getDaysRemaining = (): number => {
    const today = new Date();
    const dueDate = new Date(deadline.due_date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (): string => {
    if (deadline.status === 'completed') return 'bg-green-50 border-green-200';
    if (deadline.status === 'overdue') return 'bg-red-50 border-red-200';

    const daysRemaining = getDaysRemaining();
    if (daysRemaining < 0) return 'bg-red-50 border-red-200';
    if (daysRemaining <= 3) return 'bg-orange-50 border-orange-200';
    if (daysRemaining <= 7) return 'bg-yellow-50 border-yellow-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getStatusBadge = () => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending: { label: 'În așteptare', color: 'bg-gray-100 text-gray-700' },
      in_progress: { label: 'În lucru', color: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Completat', color: 'bg-green-100 text-green-700' },
      overdue: { label: 'Restant', color: 'bg-red-100 text-red-700' },
      not_applicable: { label: 'N/A', color: 'bg-gray-100 text-gray-500' },
    };

    const config = statusConfig[deadline.status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getDeadlineTypeBadge = () => {
    const label = DEADLINE_LABELS[deadline.deadline_type]?.label || deadline.deadline_type;
    const typeColors: Record<string, string> = {
      D112: 'bg-purple-100 text-purple-700',
      D300: 'bg-blue-100 text-blue-700',
      D100: 'bg-indigo-100 text-indigo-700',
      pontaj: 'bg-pink-100 text-pink-700',
      bilant: 'bg-orange-100 text-orange-700',
    };

    const color = typeColors[deadline.deadline_type] || 'bg-gray-100 text-gray-700';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
        {label.split(' - ')[0]}
      </span>
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleMarkComplete = async () => {
    if (!onStatusChange) return;

    setLoading(true);
    try {
      await onStatusChange(deadline.id, 'completed');
    } catch (error) {
      console.error('Error marking deadline as complete:', error);
      alert('Eroare la marcarea ca și completat');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInProgress = async () => {
    if (!onStatusChange) return;

    setLoading(true);
    try {
      await onStatusChange(deadline.id, 'in_progress');
    } catch (error) {
      console.error('Error marking deadline as in progress:', error);
      alert('Eroare la actualizarea statusului');
    } finally {
      setLoading(false);
    }
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${getUrgencyColor()}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {getDeadlineTypeBadge()}
            {getStatusBadge()}
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">{deadline.title}</h3>
          {deadline.description && (
            <p className="text-sm text-gray-600 mb-2">{deadline.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {deadline.client_name && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-gray-700 font-medium">{deadline.client_name}</span>
            {deadline.client_cui && (
              <span className="text-gray-500">CUI: {deadline.client_cui}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-700 font-medium">{formatDate(deadline.due_date)}</span>
        </div>

        {deadline.status !== 'completed' && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span
              className={`font-semibold ${
                daysRemaining < 0
                  ? 'text-red-700'
                  : daysRemaining <= 3
                  ? 'text-orange-700'
                  : daysRemaining <= 7
                  ? 'text-yellow-700'
                  : 'text-blue-700'
              }`}
            >
              {daysRemaining < 0
                ? `Restant ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'zi' : 'zile'}`
                : daysRemaining === 0
                ? 'Azi'
                : daysRemaining === 1
                ? 'Mâine'
                : `Peste ${daysRemaining} zile`}
            </span>
          </div>
        )}

        {deadline.completed_at && (
          <div className="flex items-center gap-2 text-sm text-green-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Completat: {formatDate(deadline.completed_at)}</span>
          </div>
        )}
      </div>

      {onStatusChange && deadline.status !== 'completed' && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          {deadline.status === 'pending' && (
            <button
              onClick={handleMarkInProgress}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Se actualizează...' : 'Începe lucrul'}
            </button>
          )}
          <button
            onClick={handleMarkComplete}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {loading ? 'Se marchează...' : 'Marchează completat'}
          </button>
        </div>
      )}
    </div>
  );
}
