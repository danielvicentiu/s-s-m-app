'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Calendar, Users, FileText, Building } from 'lucide-react'

interface EvacuationDrillFormProps {
  user: { id: string; email: string }
  organizations: any[]
  onSuccess: (drill: any) => void
  onCancel: () => void
}

export default function EvacuationDrillForm({
  user,
  organizations,
  onSuccess,
  onCancel,
}: EvacuationDrillFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    organization_id: organizations[0]?.id || '',
    scheduled_date: '',
    scheduled_time: '',
    scenario: '',
    estimated_participants: '',
    meeting_point: '',
    responsible_person: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowser()

      // Combine date and time
      const scheduledDateTime = `${formData.scheduled_date}T${formData.scheduled_time}:00`

      const drillData = {
        organization_id: formData.organization_id,
        scheduled_date: scheduledDateTime,
        scenario: formData.scenario,
        estimated_participants: parseInt(formData.estimated_participants) || null,
        meeting_point: formData.meeting_point || null,
        responsible_person: formData.responsible_person || null,
        notes: formData.notes || null,
        status: 'programat',
        organized_by: user.id,
      }

      const { data, error: insertError } = await supabase
        .from('evacuation_drills')
        .insert([drillData])
        .select(`
          *,
          organizations(name, cui),
          organizer:profiles!evacuation_drills_organized_by_fkey(full_name)
        `)
        .single()

      if (insertError) throw insertError

      onSuccess(data)
    } catch (err: any) {
      console.error('Error creating evacuation drill:', err)
      setError(err.message || 'Eroare la programarea exercițiului')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Organization */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Building className="h-4 w-4 text-gray-400" />
          Organizație *
        </label>
        <select
          required
          value={formData.organization_id}
          onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selectează organizația</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name} ({org.cui})
            </option>
          ))}
        </select>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            Data *
          </label>
          <input
            type="date"
            required
            value={formData.scheduled_date}
            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Ora *
          </label>
          <input
            type="time"
            required
            value={formData.scheduled_time}
            onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Scenario */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FileText className="h-4 w-4 text-gray-400" />
          Scenariu *
        </label>
        <textarea
          required
          value={formData.scenario}
          onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
          placeholder="Ex: Incendiu la etajul 2, evacuare prin scările de urgență"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Estimated Participants */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Users className="h-4 w-4 text-gray-400" />
          Participanți estimați
        </label>
        <input
          type="number"
          min="1"
          value={formData.estimated_participants}
          onChange={(e) => setFormData({ ...formData, estimated_participants: e.target.value })}
          placeholder="Număr estimat de participanți"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Meeting Point */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Punct de adunare
        </label>
        <input
          type="text"
          value={formData.meeting_point}
          onChange={(e) => setFormData({ ...formData, meeting_point: e.target.value })}
          placeholder="Ex: Parcarea din fața clădirii"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Responsible Person */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Persoană responsabilă
        </label>
        <input
          type="text"
          value={formData.responsible_person}
          onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
          placeholder="Nume și funcție"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Observații
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Informații adiționale..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          Anulează
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Se salvează...' : 'Programează'}
        </button>
      </div>
    </form>
  )
}
