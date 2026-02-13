'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import {
  Calendar,
  MapPin,
  Users,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Ban,
  Clock,
  User,
} from 'lucide-react'
import type { WorkPermitStatus } from '@/lib/types'

interface WorkPermitDetailModalProps {
  permit: any
  userId: string
  onClose: () => void
  onUpdate: (updatedPermit: any) => void
}

export default function WorkPermitDetailModal({
  permit,
  userId,
  onClose,
  onUpdate,
}: WorkPermitDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [error, setError] = useState('')

  const isActive = permit.status === 'activ'
  const canModify = isActive || permit.status === 'expirat'

  const handleStatusChange = async (newStatus: WorkPermitStatus) => {
    if (!canModify) return

    setLoading(true)
    setError('')

    try {
      const supabase = createSupabaseBrowser()
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      if (newStatus === 'finalizat') {
        updateData.completed_at = new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('work_permits')
        .update(updateData)
        .eq('id', permit.id)
        .select(`
          *,
          organizations(name, cui),
          creator:profiles!work_permits_created_by_fkey(full_name),
          canceler:profiles!work_permits_canceled_by_fkey(full_name)
        `)
        .single()

      if (updateError) throw updateError

      onUpdate(data)
    } catch (err: any) {
      console.error('Error updating permit status:', err)
      setError(err.message || 'Eroare la actualizarea statusului')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      setError('Vă rugăm introduceți motivul anulării')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createSupabaseBrowser()
      const { data, error: updateError } = await supabase
        .from('work_permits')
        .update({
          status: 'anulat',
          canceled_reason: cancelReason.trim(),
          canceled_by: userId,
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', permit.id)
        .select(`
          *,
          organizations(name, cui),
          creator:profiles!work_permits_created_by_fkey(full_name),
          canceler:profiles!work_permits_canceled_by_fkey(full_name)
        `)
        .single()

      if (updateError) throw updateError

      onUpdate(data)
      setShowCancelForm(false)
      setCancelReason('')
    } catch (err: any) {
      console.error('Error canceling permit:', err)
      setError(err.message || 'Eroare la anularea permisului')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getWorkTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lucru_inaltime: 'Lucru la înălțime',
      spatii_confinate: 'Spații confinate',
      foc_deschis: 'Foc deschis',
      electrice: 'Lucrări electrice',
      excavare: 'Excavare',
      lucru_calte: 'Lucru la calde',
      radiatii: 'Radiații',
      substante_periculoase: 'Substanțe periculoase',
      altul: 'Altul',
    }
    return labels[type] || type
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Detalii permis de lucru" size="xl">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Header with Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{permit.permit_number}</h3>
            <p className="text-sm text-gray-500">{permit.organizations?.name}</p>
          </div>
          <StatusBadge status={permit.status} />
        </div>

        {/* Work Details */}
        <div className="space-y-4">
          <DetailRow
            icon={Shield}
            label="Tip lucrare"
            value={getWorkTypeLabel(permit.work_type)}
          />
          <DetailRow icon={MapPin} label="Locație" value={permit.location} />
          <DetailRow
            icon={FileText}
            label="Descriere"
            value={permit.description}
            isLong
          />
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Început</span>
            </div>
            <p className="text-sm text-blue-700">{formatDateTime(permit.start_datetime)}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Sfârșit</span>
            </div>
            <p className="text-sm text-orange-700">{formatDateTime(permit.end_datetime)}</p>
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-gray-600" />
            <h4 className="text-sm font-medium text-gray-900">Echipă de lucru</h4>
          </div>
          {permit.team_members && permit.team_members.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {permit.team_members.map((member: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {member}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Niciun membru specificat</p>
          )}
        </div>

        {/* Team Leader */}
        {permit.team_leader && (
          <DetailRow icon={User} label="Responsabil echipă" value={permit.team_leader} />
        )}

        {/* Additional Measures */}
        {permit.additional_measures && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <h4 className="text-sm font-medium text-gray-900">
                Măsuri suplimentare de siguranță
              </h4>
            </div>
            <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg">
              {permit.additional_measures}
            </p>
          </div>
        )}

        {/* Authorized By */}
        {permit.authorized_by && (
          <DetailRow icon={Shield} label="Autorizat de" value={permit.authorized_by} />
        )}

        {/* Cancel Info */}
        {permit.status === 'anulat' && permit.canceled_reason && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <h4 className="text-sm font-medium text-red-900">Motiv anulare</h4>
            </div>
            <p className="text-sm text-red-700 mb-2">{permit.canceled_reason}</p>
            {permit.canceler?.full_name && (
              <p className="text-xs text-red-600">
                Anulat de: {permit.canceler.full_name}
                {permit.canceled_at &&
                  ` la ${new Date(permit.canceled_at).toLocaleString('ro-RO')}`}
              </p>
            )}
          </div>
        )}

        {/* Completed Info */}
        {permit.status === 'finalizat' && permit.completed_at && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">
                Finalizat la {new Date(permit.completed_at).toLocaleString('ro-RO')}
              </p>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
          <p>Creat de: {permit.creator?.full_name || 'Necunoscut'}</p>
          <p>Creat la: {new Date(permit.created_at).toLocaleString('ro-RO')}</p>
          {permit.updated_at !== permit.created_at && (
            <p>Actualizat: {new Date(permit.updated_at).toLocaleString('ro-RO')}</p>
          )}
        </div>

        {/* Actions */}
        {!showCancelForm && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {canModify && permit.status === 'activ' && (
              <>
                <button
                  onClick={() => handleStatusChange('finalizat')}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Marchează finalizat
                </button>
                <button
                  onClick={() => setShowCancelForm(true)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                >
                  <Ban className="h-4 w-4" />
                  Anulează permis
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Închide
            </button>
          </div>
        )}

        {/* Cancel Form */}
        {showCancelForm && (
          <div className="p-4 bg-red-50 rounded-xl space-y-3">
            <h4 className="text-sm font-medium text-red-900">Anulare permis de lucru</h4>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Motivul anulării..."
              rows={3}
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={loading || !cancelReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Se anulează...' : 'Confirmă anulare'}
              </button>
              <button
                onClick={() => {
                  setShowCancelForm(false)
                  setCancelReason('')
                  setError('')
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Renunță
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

// Helper Components
function DetailRow({
  icon: Icon,
  label,
  value,
  isLong = false,
}: {
  icon: any
  label: string
  value: string
  isLong?: boolean
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>
      <p className={`text-sm text-gray-900 ${isLong ? 'whitespace-pre-wrap' : ''}`}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, any> = {
    activ: { bg: 'bg-green-100', text: 'text-green-700', label: 'Activ', icon: Clock },
    expirat: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expirat', icon: AlertTriangle },
    anulat: { bg: 'bg-red-100', text: 'text-red-700', label: 'Anulat', icon: XCircle },
    finalizat: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Finalizat', icon: CheckCircle2 },
  }

  const c = config[status] || config.activ
  const Icon = c.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${c.bg} ${c.text}`}
    >
      <Icon className="w-4 h-4" />
      {c.label}
    </span>
  )
}
