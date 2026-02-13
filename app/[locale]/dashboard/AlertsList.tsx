// app/dashboard/AlertsList.tsx
// Client Component — permite interactivitate (filtre, expand/collapse)
// Coloane exacte din v_active_alerts:
// organization_id, alert_type, severity, source_id, employee_name, 
// examination_type, expiry_date, days_remaining, location_name, organization_name

'use client'

import { useState } from 'react'

interface ActiveAlert {
  organization_id: string
  alert_type: string
  severity: string
  source_id: string
  employee_name: string | null
  examination_type: string
  expiry_date: string
  days_remaining: number
  location_name: string | null
  organization_name: string
}

export default function AlertsList({ alerts }: { alerts: ActiveAlert[] }) {
  const [filter, setFilter] = useState<'all' | 'expired' | 'expiring'>('all')

  const filtered = alerts.filter((a) => {
    if (filter === 'expired') {return a.days_remaining <= 0}
    if (filter === 'expiring') {return a.days_remaining > 0 && a.days_remaining <= 30}
    return true
  })

  const expiredCount = alerts.filter(a => a.days_remaining <= 0).length
  const expiringCount = alerts.filter(a => a.days_remaining > 0 && a.days_remaining <= 30).length

  return (
    <div>
      {/* Filtre */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Toate ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('expired')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === 'expired'
              ? 'bg-red-100 text-red-700'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Expirate ({expiredCount})
        </button>
        <button
          onClick={() => setFilter('expiring')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === 'expiring'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Expiră curând ({expiringCount})
        </button>
      </div>

      {/* Lista alerte */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-green-700 font-medium">Nicio alertă în această categorie</p>
          </div>
        ) : (
          filtered.map((alert, idx) => (
            <div
              key={`${alert.source_id}-${idx}`}
              className={`rounded-xl border p-4 flex items-center justify-between ${
                alert.days_remaining <= 0
                  ? 'bg-red-50 border-red-200'
                  : alert.days_remaining <= 15
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  alert.days_remaining <= 0
                    ? 'bg-red-100'
                    : alert.days_remaining <= 15
                      ? 'bg-orange-100'
                      : 'bg-yellow-100'
                }`}>
                  {alert.alert_type === 'medical' ? '🏥' : '🔧'}
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {alert.employee_name || alert.examination_type}
                  </div>
                  <div className="text-sm text-slate-600">
                    {alert.organization_name} — {alert.alert_type === 'medical' ? 'Medicină Muncii' : 'Echipament'} — {alert.examination_type}
                    {alert.location_name && ` · ${alert.location_name}`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  alert.days_remaining <= 0
                    ? 'text-red-700'
                    : 'text-orange-700'
                }`}>
                  {alert.days_remaining <= 0
                    ? `Expirat de ${Math.abs(alert.days_remaining)} zile`
                    : `Expiră în ${alert.days_remaining} zile`
                  }
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(alert.expiry_date).toLocaleDateString('ro-RO')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
