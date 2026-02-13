'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Announcement, AnnouncementType, AnnouncementTargetType } from '@/lib/types'
import { Plus, Edit, Trash2, Eye, Bell, AlertTriangle, Info, XCircle } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface AnnouncementsClientProps {
  announcements: Announcement[]
  organizations: Array<{ id: string; name: string; cui: string | null }>
}

interface AnnouncementFormData {
  id?: string
  title: string
  message: string
  type: AnnouncementType
  target_type: AnnouncementTargetType
  target_id: string | null
  start_date: string
  end_date: string
  is_active: boolean
}

const ANNOUNCEMENT_TYPE_CONFIG = {
  info: {
    label: 'Info',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: Info,
    bannerBg: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600'
  },
  warning: {
    label: 'Avertizare',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: AlertTriangle,
    bannerBg: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600'
  },
  critical: {
    label: 'Critic',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: XCircle,
    bannerBg: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600'
  }
}

export default function AnnouncementsClient({
  announcements: initialAnnouncements,
  organizations
}: AnnouncementsClientProps) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementFormData | null>(null)
  const [previewAnnouncement, setPreviewAnnouncement] = useState<AnnouncementFormData | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createSupabaseBrowser()

  const emptyForm: AnnouncementFormData = {
    title: '',
    message: '',
    type: 'info',
    target_type: 'all',
    target_id: null,
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    is_active: true
  }

  const handleCreate = () => {
    setCurrentAnnouncement(emptyForm)
    setIsModalOpen(true)
  }

  const handleEdit = (announcement: Announcement) => {
    setCurrentAnnouncement({
      id: announcement.id,
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      target_type: announcement.target_type,
      target_id: announcement.target_id,
      start_date: new Date(announcement.start_date).toISOString().slice(0, 16),
      end_date: new Date(announcement.end_date).toISOString().slice(0, 16),
      is_active: announcement.is_active
    })
    setIsModalOpen(true)
  }

  const handlePreview = (announcement: Announcement | AnnouncementFormData) => {
    setPreviewAnnouncement(announcement as AnnouncementFormData)
    setIsPreviewOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest anunț?')) return

    setLoading(true)
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Eroare la ștergere: ' + error.message)
    } else {
      setAnnouncements(announcements.filter(a => a.id !== id))
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentAnnouncement) return

    setLoading(true)

    const data = {
      title: currentAnnouncement.title,
      message: currentAnnouncement.message,
      type: currentAnnouncement.type,
      target_type: currentAnnouncement.target_type,
      target_id: currentAnnouncement.target_id,
      start_date: new Date(currentAnnouncement.start_date).toISOString(),
      end_date: new Date(currentAnnouncement.end_date).toISOString(),
      is_active: currentAnnouncement.is_active
    }

    let result
    if (currentAnnouncement.id) {
      // Update
      result = await supabase
        .from('announcements')
        .update(data)
        .eq('id', currentAnnouncement.id)
        .select()
        .single()
    } else {
      // Insert
      result = await supabase
        .from('announcements')
        .insert(data)
        .select()
        .single()
    }

    if (result.error) {
      alert('Eroare la salvare: ' + result.error.message)
    } else {
      // Refresh list
      const { data: updated } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (updated) setAnnouncements(updated)
      setIsModalOpen(false)
      setCurrentAnnouncement(null)
    }
    setLoading(false)
  }

  const getTargetLabel = (announcement: Announcement | AnnouncementFormData) => {
    if (announcement.target_type === 'all') return 'Toți utilizatorii'
    if (announcement.target_type === 'organization' && announcement.target_id) {
      const org = organizations.find(o => o.id === announcement.target_id)
      return org ? `Organizație: ${org.name}` : 'Organizație necunoscută'
    }
    if (announcement.target_type === 'plan') return 'Plan specific'
    return 'Necunoscut'
  }

  const isActive = (announcement: Announcement) => {
    if (!announcement.is_active) return false
    const now = new Date()
    const start = new Date(announcement.start_date)
    const end = new Date(announcement.end_date)
    return now >= start && now <= end
  }

  const activeAnnouncements = announcements.filter(isActive)
  const inactiveAnnouncements = announcements.filter(a => !isActive(a))

  return (
    <>
      {/* Header Actions */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Anunț Nou
        </button>
      </div>

      {/* Active Announcements */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Anunțuri Active ({activeAnnouncements.length})
        </h2>
        {activeAnnouncements.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Nu există anunțuri active</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAnnouncements.map(announcement => {
              const config = ANNOUNCEMENT_TYPE_CONFIG[announcement.type]
              const Icon = config.icon
              return (
                <div key={announcement.id} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-500">{getTargetLabel(announcement)}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-gray-900">{announcement.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{announcement.message}</p>
                      <div className="mt-3 flex gap-4 text-xs text-gray-500">
                        <span>Început: {new Date(announcement.start_date).toLocaleString('ro-RO')}</span>
                        <span>Sfârșit: {new Date(announcement.end_date).toLocaleString('ro-RO')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(announcement)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                        title="Editează"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                        title="Șterge"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Inactive Announcements */}
      {inactiveAnnouncements.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Anunțuri Inactive ({inactiveAnnouncements.length})
          </h2>
          <div className="space-y-4">
            {inactiveAnnouncements.map(announcement => {
              const config = ANNOUNCEMENT_TYPE_CONFIG[announcement.type]
              const Icon = config.icon
              return (
                <div key={announcement.id} className="rounded-2xl bg-white p-6 opacity-60 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-500">{getTargetLabel(announcement)}</span>
                        {!announcement.is_active && (
                          <span className="text-xs text-red-600">(Dezactivat)</span>
                        )}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-gray-900">{announcement.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{announcement.message}</p>
                      <div className="mt-3 flex gap-4 text-xs text-gray-500">
                        <span>Început: {new Date(announcement.start_date).toLocaleString('ro-RO')}</span>
                        <span>Sfârșit: {new Date(announcement.end_date).toLocaleString('ro-RO')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(announcement)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                        title="Editează"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                        title="Șterge"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setCurrentAnnouncement(null)
        }}
        title={currentAnnouncement?.id ? 'Editează Anunț' : 'Anunț Nou'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Titlu</label>
            <input
              type="text"
              value={currentAnnouncement?.title || ''}
              onChange={(e) => setCurrentAnnouncement(prev => prev ? { ...prev, title: e.target.value } : null)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              maxLength={100}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mesaj</label>
            <textarea
              value={currentAnnouncement?.message || ''}
              onChange={(e) => setCurrentAnnouncement(prev => prev ? { ...prev, message: e.target.value } : null)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              required
              maxLength={500}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tip</label>
            <select
              value={currentAnnouncement?.type || 'info'}
              onChange={(e) => setCurrentAnnouncement(prev => prev ? { ...prev, type: e.target.value as AnnouncementType } : null)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="info">Info (albastru)</option>
              <option value="warning">Avertizare (portocaliu)</option>
              <option value="critical">Critic (roșu)</option>
            </select>
          </div>

          {/* Target Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Țintă</label>
            <select
              value={currentAnnouncement?.target_type || 'all'}
              onChange={(e) => setCurrentAnnouncement(prev => prev ? {
                ...prev,
                target_type: e.target.value as AnnouncementTargetType,
                target_id: e.target.value === 'all' ? null : prev.target_id
              } : null)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Toți utilizatorii</option>
              <option value="organization">Organizație specifică</option>
              <option value="plan">Plan specific (viitor)</option>
            </select>
          </div>

          {/* Organization Selector */}
          {currentAnnouncement?.target_type === 'organization' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Organizație</label>
              <select
                value={currentAnnouncement.target_id || ''}
                onChange={(e) => setCurrentAnnouncement(prev => prev ? { ...prev, target_id: e.target.value } : null)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Selectează organizație...</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui ? `(CUI: ${org.cui})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Data început</label>
              <input
                type="datetime-local"
                value={currentAnnouncement?.start_date || ''}
                onChange={(e) => setCurrentAnnouncement(prev => prev ? { ...prev, start_date: e.target.value } : null)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data sfârșit</label>
              <input
                type="datetime-local"
                value={currentAnnouncement?.end_date || ''}
                onChange={(e) => setCurrentAnnouncement(prev => prev ? { ...prev, end_date: e.target.value } : null)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={currentAnnouncement?.is_active || false}
              onChange={(e) => setCurrentAnnouncement(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Anunț activ
            </label>
          </div>

          {/* Preview Button */}
          <div>
            <button
              type="button"
              onClick={() => currentAnnouncement && handlePreview(currentAnnouncement)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              Preview Banner
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setCurrentAnnouncement(null)
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Anulează
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Se salvează...' : (currentAnnouncement?.id ? 'Actualizează' : 'Creează')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setPreviewAnnouncement(null)
        }}
        title="Preview Banner"
        size="lg"
      >
        {previewAnnouncement && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Așa va arăta banner-ul în partea de sus a dashboard-ului:
            </p>
            <AnnouncementBanner announcement={previewAnnouncement} />
          </div>
        )}
      </Modal>
    </>
  )
}

// Preview Component
function AnnouncementBanner({ announcement }: { announcement: AnnouncementFormData }) {
  const config = ANNOUNCEMENT_TYPE_CONFIG[announcement.type]
  const Icon = config.icon

  return (
    <div className={`flex items-start gap-4 rounded-lg border-l-4 p-4 ${config.bannerBg}`}>
      <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
        <p className="mt-1 text-sm text-gray-700">{announcement.message}</p>
      </div>
    </div>
  )
}
