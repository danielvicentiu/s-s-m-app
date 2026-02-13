'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Loader2, Users, MapPin, Calendar, Shield, FileText } from 'lucide-react'

interface WorkPermitFormProps {
  userId: string
  organizations: any[]
  employees: any[]
  onSuccess: (permit: any) => void
  onCancel: () => void
}

export default function WorkPermitForm({
  userId,
  organizations,
  employees,
  onSuccess,
  onCancel,
}: WorkPermitFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [organizationId, setOrganizationId] = useState('')
  const [workType, setWorkType] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [startDatetime, setStartDatetime] = useState('')
  const [endDatetime, setEndDatetime] = useState('')
  const [teamMembers, setTeamMembers] = useState<string[]>([])
  const [teamLeader, setTeamLeader] = useState('')
  const [additionalMeasures, setAdditionalMeasures] = useState('')
  const [authorizedBy, setAuthorizedBy] = useState('')

  // Filter employees by selected organization
  const filteredEmployees = organizationId
    ? employees.filter(emp => emp.organization_id === organizationId)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validation
      if (!organizationId || !workType || !location || !description || !startDatetime || !endDatetime) {
        throw new Error('Vă rugăm completați toate câmpurile obligatorii')
      }

      if (new Date(endDatetime) <= new Date(startDatetime)) {
        throw new Error('Data sfârșit trebuie să fie după data început')
      }

      if (teamMembers.length === 0) {
        throw new Error('Vă rugăm adăugați cel puțin un membru în echipă')
      }

      // Generate permit number: WP-YYYY-XXX
      const year = new Date().getFullYear()
      const supabase = createSupabaseBrowser()

      // Get latest permit number for this year
      const { data: latestPermit } = await supabase
        .from('work_permits')
        .select('permit_number')
        .eq('organization_id', organizationId)
        .like('permit_number', `WP-${year}-%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      let permitNumber = `WP-${year}-001`
      if (latestPermit) {
        const lastNumber = parseInt(latestPermit.permit_number.split('-')[2])
        permitNumber = `WP-${year}-${String(lastNumber + 1).padStart(3, '0')}`
      }

      const permitData = {
        organization_id: organizationId,
        permit_number: permitNumber,
        work_type: workType,
        location: location.trim(),
        description: description.trim(),
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        team_members: teamMembers,
        team_leader: teamLeader || null,
        additional_measures: additionalMeasures.trim() || null,
        authorized_by: authorizedBy.trim() || null,
        status: 'activ',
        created_by: userId,
      }

      const { data, error: insertError } = await supabase
        .from('work_permits')
        .insert(permitData)
        .select(`
          *,
          organizations(name, cui),
          creator:profiles!work_permits_created_by_fkey(full_name)
        `)
        .single()

      if (insertError) throw insertError

      onSuccess(data)
    } catch (err: any) {
      console.error('Error creating work permit:', err)
      setError(err.message || 'Eroare la crearea permisului de lucru')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTeamMember = (employeeId: string) => {
    const employee = filteredEmployees.find(emp => emp.id === employeeId)
    if (employee && !teamMembers.includes(employee.full_name)) {
      setTeamMembers([...teamMembers, employee.full_name])
    }
  }

  const handleRemoveTeamMember = (name: string) => {
    setTeamMembers(teamMembers.filter(member => member !== name))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Organization */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organizație *
        </label>
        <select
          required
          value={organizationId}
          onChange={(e) => {
            setOrganizationId(e.target.value)
            setTeamMembers([])
            setTeamLeader('')
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selectează organizația</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name} {org.cui ? `(${org.cui})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Work Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Shield className="inline h-4 w-4 mr-1" />
          Tip lucrare periculoasă *
        </label>
        <select
          required
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selectează tipul lucrării</option>
          <option value="lucru_inaltime">Lucru la înălțime</option>
          <option value="spatii_confinate">Spații confinate</option>
          <option value="foc_deschis">Foc deschis</option>
          <option value="electrice">Lucrări electrice</option>
          <option value="excavare">Excavare</option>
          <option value="lucru_calte">Lucru la calde</option>
          <option value="radiatii">Radiații</option>
          <option value="substante_periculoase">Substanțe periculoase</option>
          <option value="altul">Altul</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Locație *
        </label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ex: Hala 2, Etaj 3, Zona de producție"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="inline h-4 w-4 mr-1" />
          Descriere lucrare *
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Descrieți în detaliu lucrarea ce urmează să fie executată..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Dată și oră început *
          </label>
          <input
            type="datetime-local"
            required
            value={startDatetime}
            onChange={(e) => setStartDatetime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Dată și oră sfârșit *
          </label>
          <input
            type="datetime-local"
            required
            value={endDatetime}
            onChange={(e) => setEndDatetime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Team Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="inline h-4 w-4 mr-1" />
          Echipă de lucru *
        </label>
        {organizationId ? (
          <div className="space-y-3">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddTeamMember(e.target.value)
                  e.target.value = ''
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Adaugă membru din listă...</option>
              {filteredEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} {emp.job_title ? `- ${emp.job_title}` : ''}
                </option>
              ))}
            </select>

            {teamMembers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(member)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Niciun membru adăugat încă</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Selectați mai întâi o organizație</p>
        )}
      </div>

      {/* Team Leader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Responsabil echipă
        </label>
        <input
          type="text"
          value={teamLeader}
          onChange={(e) => setTeamLeader(e.target.value)}
          placeholder="Nume responsabil echipă"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Additional Measures */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Măsuri suplimentare de siguranță
        </label>
        <textarea
          value={additionalMeasures}
          onChange={(e) => setAdditionalMeasures(e.target.value)}
          rows={3}
          placeholder="Ex: Echipament de protecție suplimentar, ventilație forțată, supraveghere permanentă..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Authorized By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Autorizat de
        </label>
        <input
          type="text"
          value={authorizedBy}
          onChange={(e) => setAuthorizedBy(e.target.value)}
          placeholder="Nume persoană care autorizează permisul"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
        >
          Anulează
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Se creează...' : 'Creează permis'}
        </button>
      </div>
    </form>
  )
}
