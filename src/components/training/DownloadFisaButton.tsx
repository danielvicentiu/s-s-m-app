// ============================================================
// S-S-M.RO — Download Fișă de Instruire Button
// File: src/components/training/DownloadFisaButton.tsx
// Usage: <DownloadFisaButton sessionId="..." organizationId="..." workerName="Ion P." />
// ============================================================
'use client';

import { useState } from 'react';

interface DownloadFisaButtonProps {
  sessionId: string;
  organizationId: string;
  workerName?: string;
  /** 'button' = full button, 'icon' = small icon only, 'link' = text link */
  variant?: 'button' | 'icon' | 'link';
  className?: string;
}

export default function DownloadFisaButton({
  sessionId,
  organizationId,
  workerName,
  variant = 'button',
  className = '',
}: DownloadFisaButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-fisa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          organization_id: organizationId,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Extract filename from Content-Disposition or generate one
      const disposition = response.headers.get('Content-Disposition');
      let filename = `Fisa_Instruire_${workerName?.replace(/\s/g, '_') || sessionId.substring(0, 8)}.pdf`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Eroare la generare PDF');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // VARIANT: Icon only (for table rows)
  // ============================================================
  if (variant === 'icon') {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        title={error || 'Descarcă Fișa de Instruire (PDF)'}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors
          ${loading ? 'bg-slate-700 cursor-wait' : 'bg-slate-800 hover:bg-teal-900/50 hover:text-teal-400'}
          ${error ? 'text-red-400' : 'text-slate-400'}
          ${className}`}
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : error ? (
          '⚠️'
        ) : (
          '📄'
        )}
      </button>
    );
  }

  // ============================================================
  // VARIANT: Text link
  // ============================================================
  if (variant === 'link') {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`text-teal-400 hover:text-teal-300 text-sm underline-offset-2 hover:underline transition-colors
          ${loading ? 'opacity-50 cursor-wait' : ''}
          ${className}`}
      >
        {loading ? 'Se generează...' : error ? `Eroare: ${error}` : '📄 Descarcă Fișa PDF'}
      </button>
    );
  }

  // ============================================================
  // VARIANT: Full button (default)
  // ============================================================
  return (
    <div className={className}>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
          ${loading
            ? 'bg-slate-700 text-slate-400 cursor-wait'
            : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20 hover:shadow-teal-900/40'
          }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Se generează PDF...
          </>
        ) : (
          <>
            📄 Descarcă Fișa de Instruire
          </>
        )}
      </button>
      {error && (
        <div className="mt-2 text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
