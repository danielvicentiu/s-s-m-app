'use client'

import { useState } from 'react'
import { X, Calendar, Users, Timer, AlertCircle, CheckCircle2, FileText, Edit2, Save } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface DrillDetailModalProps {
  drill: any
  onClose: () => void
  onUpdate: (updatedDrill: any) => void
  user: { id: string; email: string }
}

export default function DrillDetailModal({ drill, onClose, onUpdate, user }: DrillDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportData, setReportData] = useState({
    actual_participants: drill.actual_participants || '',
    evacuation_time_seconds: drill.evacuation_time_seconds || '',
    issues_identified: drill.issues_identified || '',
    recommendations: drill.recommendations || '',
    status: drill.status,
  })

  const handleSaveReport = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowser()

      const updateData: any = {
        actual_participants: parseInt(reportData.actual_participants) || null,
        evacuation_time_seconds: parseInt(reportData.evacuation_time_seconds) || null,
        issues_identified: reportData.issues_identified || null,
        recommendations: reportData.recommendations || null,
        status: reportData.status,
      }

      // If marking as completed, set completion date
      if (reportData.status === 'efectuat' && drill.status !== 'efectuat') {
        updateData.completed_at = new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('evacuation_drills')
        .update(updateData)
        .eq('id', drill.id)
        .select(`
          *,
          organizations(name, cui),
          organizer:profiles!evacuation_drills_organized_by_fkey(full_name)
        `)
        .single()

      if (updateError) throw updateError

      onUpdate(data)
      setIsEditing(false)
    } catch (err: any) {
      console.error('Error updating drill:', err)
      setError(err.message || 'Eroare la salvarea raportului')
    } finally {
      setIsSaving(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      programat: { label: 'Programat', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Calendar },
      efectuat: { label: 'Efectuat', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
      anulat: { label: 'Anulat', class: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.programat
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.class}`}>
        <Icon className="h-4 w-4" />
        {config.label}
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalii exercițiu evacuare</h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(drill.scheduled_date).toLocaleDateString('ro-RO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {isEditing ? (
              <select
                value={reportData.status}
                onChange={(e) => setReportData({ ...reportData, status: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="programat">Programat</option>
                <option value="efectuat">Efectuat</option>
                <option value="anulat">Anulat</option>
              </select>
            ) : (
              getStatusBadge(drill.status)
            )}
          </div>

          {/* Organization */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Organizație</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-900">{drill.organizations?.name}</p>
              <p className="text-sm text-gray-500">CUI: {drill.organizations?.cui}</p>
            </div>
          </div>

          {/* Scenario */}
          {drill.scenario && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Scenariu</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900">{drill.scenario}</p>
              </div>
            </div>
          )}

          {/* Meeting Point */}
          {drill.meeting_point && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Punct de adunare</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900">{drill.meeting_point}</p>
              </div>
            </div>
          )}

          {/* Responsible Person */}
          {drill.responsible_person && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Persoană responsabilă</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900">{drill.responsible_person}</p>
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Participanți estimați</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-900">
                  {drill.estimated_participants || '—'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Participanți prezenți</h3>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  value={reportData.actual_participants}
                  onChange={(e) => setReportData({ ...reportData, actual_participants: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Număr real"
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {drill.actual_participants || '—'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Evacuation Time */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Timp de evacuare
            </h3>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={reportData.evacuation_time_seconds}
                  onChange={(e) => setReportData({ ...reportData, evacuation_time_seconds: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Secunde"
                />
                <span className="text-sm text-gray-500">secunde</span>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-900">
                  {drill.evacuation_time_seconds ? formatTime(drill.evacuation_time_seconds) : '—'}
                </p>
              </div>
            )}
          </div>

          {/* Issues Identified */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Probleme identificate</h3>
            {isEditing ? (
              <textarea
                value={reportData.issues_identified}
                onChange={(e) => setReportData({ ...reportData, issues_identified: e.target.value })}
                rows={4}
                placeholder="Ex: Ușa de urgență blocată, lipsă semnalizare..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {drill.issues_identified || 'Nicio problemă raportată'}
                </p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recomandări</h3>
            {isEditing ? (
              <textarea
                value={reportData.recommendations}
                onChange={(e) => setReportData({ ...reportData, recommendations: e.target.value })}
                rows={4}
                placeholder="Ex: Instruire suplimentară, verificare echipamente..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {drill.recommendations || 'Nicio recomandare'}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {drill.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Observații</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900 whitespace-pre-wrap">{drill.notes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
            <p>Organizat de: {drill.organizer?.full_name || 'N/A'}</p>
            <p>Creat la: {new Date(drill.created_at).toLocaleString('ro-RO')}</p>
            {drill.completed_at && (
              <p>Finalizat la: {new Date(drill.completed_at).toLocaleString('ro-RO')}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setReportData({
                    actual_participants: drill.actual_participants || '',
                    evacuation_time_seconds: drill.evacuation_time_seconds || '',
                    issues_identified: drill.issues_identified || '',
                    recommendations: drill.recommendations || '',
                    status: drill.status,
                  })
                }}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium disabled:opacity-50"
              >
                Anulează
              </button>
              <button
                onClick={handleSaveReport}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Se salvează...' : 'Salvează raport'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Închide
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <Edit2 className="h-4 w-4" />
                Editează raport
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
