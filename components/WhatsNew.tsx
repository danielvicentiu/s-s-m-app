'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

type UpdateType = 'feature' | 'improvement' | 'fix';

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  type: UpdateType;
}

const UPDATES: Update[] = [
  {
    id: '2026-02-13-rbac',
    date: '2026-02-13',
    title: 'RBAC Dinamic',
    description: 'Sistem nou de roluri și permisiuni configurabile pentru control granular al accesului.',
    type: 'feature',
  },
  {
    id: '2026-02-13-error-boundary',
    date: '2026-02-13',
    title: 'Error Boundary Îmbunătățit',
    description: 'Gestionare avansată a erorilor cu logging API și recuperare automată.',
    type: 'improvement',
  },
  {
    id: '2026-02-13-webhooks',
    date: '2026-02-13',
    title: 'Serviciu Webhook Delivery',
    description: 'Sistem complet de webhooks cu retry automat și monitorizare.',
    type: 'feature',
  },
  {
    id: '2026-02-13-gdpr',
    date: '2026-02-13',
    title: 'Modul GDPR Compliance',
    description: 'Instrumente complete pentru conformitate GDPR și gestionare consimțăminte.',
    type: 'feature',
  },
  {
    id: '2026-02-13-nis2',
    date: '2026-02-13',
    title: 'Modul NIS2 Cybersecurity',
    description: 'Conformitate NIS2 cu evaluare riscuri și raportare incidente.',
    type: 'feature',
  },
  {
    id: '2026-02-13-api-keys',
    date: '2026-02-13',
    title: 'Management Chei API',
    description: 'Gestionare securizată a cheilor API cu rate limiting și expirare.',
    type: 'feature',
  },
];

const TYPE_CONFIG: Record<UpdateType, { label: string; className: string }> = {
  feature: {
    label: 'Feature',
    className: 'bg-blue-100 text-blue-700',
  },
  improvement: {
    label: 'Improvement',
    className: 'bg-green-100 text-green-700',
  },
  fix: {
    label: 'Fix',
    className: 'bg-orange-100 text-orange-700',
  },
};

const STORAGE_KEY = 'whats-new-last-seen';

export default function WhatsNew() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);

  useEffect(() => {
    checkForNewUpdates();
  }, []);

  const checkForNewUpdates = () => {
    const lastSeenId = localStorage.getItem(STORAGE_KEY);
    if (!lastSeenId || UPDATES[0].id !== lastSeenId) {
      setHasNewUpdates(true);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    markAsSeen();
  };

  const markAsSeen = () => {
    if (UPDATES.length > 0) {
      localStorage.setItem(STORAGE_KEY, UPDATES[0].id);
      setHasNewUpdates(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const displayedUpdates = UPDATES.slice(0, 10);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="relative inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Ce este nou"
      >
        <Sparkles className="w-5 h-5" />
        {hasNewUpdates && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ce este nou</h2>
                  <p className="text-sm text-gray-600">
                    Actualizări și îmbunătățiri recente
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {displayedUpdates.map((update, index) => (
                  <div
                    key={update.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {update.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                          TYPE_CONFIG[update.type].className
                        }`}
                      >
                        {TYPE_CONFIG[update.type].label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {update.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(update.date)}
                    </p>
                    {index === 0 && hasNewUpdates && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                          Nou
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Am înțeles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
