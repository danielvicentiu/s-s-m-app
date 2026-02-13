'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { SSM_INSPECTION_CHECKPOINTS, type CheckpointStatus, type SsmInspection } from '@/lib/types'
import { Calendar, User, CheckCircle2, XCircle, MinusCircle, Download, Plus, ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  user: { id: string; email: string }
  organizations: any[]
  inspections: any[]
  isConsultant: boolean
}

interface CheckpointState {
  status: CheckpointStatus
  observations: string
}

export default function InspectionsClient({ user, organizations, inspections, isConsultant }: Props) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null)

  // Form state pentru inspecție nouă
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || '')
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0])
  const [inspectorName, setInspectorName] = useState('')
  const [generalObservations, setGeneralObservations] = useState('')

  // State pentru checkpoint-uri
  const [checkpoints, setCheckpoints] = useState<CheckpointState[]>(
    SSM_INSPECTION_CHECKPOINTS.map(() => ({
      status: 'conform' as CheckpointStatus,
      observations: ''
    }))
  )

  // Calculare scor
  const calculateScore = () => {
    const totalApplicable = checkpoints.filter(cp => cp.status !== 'neaplicabil').length
    const conformCount = checkpoints.filter(cp => cp.status === 'conform').length
    const percentage = totalApplicable > 0 ? Math.round((conformCount / totalApplicable) * 100) : 0
    return { conformCount, totalApplicable, percentage }
  }

  const score = calculateScore()

  const handleCheckpointChange = (index: number, field: 'status' | 'observations', value: string) => {
    const updated = [...checkpoints]
    if (field === 'status') {
      updated[index].status = value as CheckpointStatus
    } else {
      updated[index].observations = value
    }
    setCheckpoints(updated)
  }

  const handleSaveInspection = async () => {
    if (!organizationId || !inspectorName) {
      alert('Completați organizația și numele inspectorului!')
      return
    }

    const supabase = createSupabaseBrowser()
    const { conformCount, totalApplicable, percentage } = calculateScore()

    try {
      // Inserează inspecția
      const { data: inspection, error: inspectionError } = await supabase
        .from('ssm_inspections')
        .insert({
          organization_id: organizationId,
          inspection_date: inspectionDate,
          inspector_name: inspectorName,
          inspector_id: user.id,
          status: 'completed',
          score: conformCount,
          total_points: totalApplicable,
          conformity_percentage: percentage,
          general_observations: generalObservations || null
        })
        .select()
        .single()

      if (inspectionError) throw inspectionError

      // Inserează checkpoint-urile
      const checkpointsData = SSM_INSPECTION_CHECKPOINTS.map((cp, index) => ({
        inspection_id: inspection.id,
        checkpoint_number: index + 1,
        category: cp.category,
        description: cp.description,
        status: checkpoints[index].status,
        observations: checkpoints[index].observations || null
      }))

      const { error: checkpointsError } = await supabase
        .from('inspection_checkpoints')
        .insert(checkpointsData)

      if (checkpointsError) throw checkpointsError

      alert('✅ Inspecție salvată cu succes!')
      router.refresh()
      setIsCreating(false)
      resetForm()
    } catch (error) {
      console.error('Error saving inspection:', error)
      alert('❌ Eroare la salvarea inspecției')
    }
  }

  const resetForm = () => {
    setOrganizationId(organizations[0]?.id || '')
    setInspectionDate(new Date().toISOString().split('T')[0])
    setInspectorName('')
    setGeneralObservations('')
    setCheckpoints(SSM_INSPECTION_CHECKPOINTS.map(() => ({
      status: 'conform' as CheckpointStatus,
      observations: ''
    })))
  }

  const getStatusColor = (status: CheckpointStatus) => {
    switch (status) {
      case 'conform': return 'text-green-600'
      case 'neconform': return 'text-red-600'
      case 'neaplicabil': return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: CheckpointStatus) => {
    switch (status) {
      case 'conform': return <CheckCircle2 className="w-5 h-5" />
      case 'neconform': return <XCircle className="w-5 h-5" />
      case 'neaplicabil': return <MinusCircle className="w-5 h-5" />
    }
  }

  // Group checkpoints by category
  const groupedCheckpoints = SSM_INSPECTION_CHECKPOINTS.reduce((acc, cp, index) => {
    if (!acc[cp.category]) acc[cp.category] = []
    acc[cp.category].push({ ...cp, index })
    return acc
  }, {} as Record<string, Array<typeof SSM_INSPECTION_CHECKPOINTS[0] & { index: number }>>)

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inspecție Internă SSM</h1>
                <p className="text-sm text-gray-600">Checklist 30 puncte verificare</p>
              </div>
            </div>
            <button
              onClick={handleSaveInspection}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Salvează inspecția
            </button>
          </div>

          {/* Scor */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Scor conformitate</p>
                <p className="text-4xl font-bold text-blue-600">{score.percentage}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Puncte conforme</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {score.conformCount} / {score.totalApplicable}
                </p>
              </div>
            </div>
          </div>

          {/* Informații generale */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Informații generale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizație *
                </label>
                <select
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name} {org.cui ? `(${org.cui})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data inspecției *
                </label>
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nume inspector *
                </label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  placeholder="ex: Ion Popescu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observații generale
                </label>
                <input
                  type="text"
                  value={generalObservations}
                  onChange={(e) => setGeneralObservations(e.target.value)}
                  placeholder="Observații generale..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Checklist grupat pe categorii */}
          {Object.entries(groupedCheckpoints).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">{category}</h3>
              <div className="space-y-4">
                {items.map(({ description, index }) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4 mb-2">
                      <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium mb-3">{description}</p>

                        {/* Status buttons */}
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => handleCheckpointChange(index, 'status', 'conform')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              checkpoints[index].status === 'conform'
                                ? 'bg-green-50 border-green-300 text-green-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Conform
                          </button>
                          <button
                            onClick={() => handleCheckpointChange(index, 'status', 'neconform')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              checkpoints[index].status === 'neconform'
                                ? 'bg-red-50 border-red-300 text-red-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <XCircle className="w-4 h-4" />
                            Neconform
                          </button>
                          <button
                            onClick={() => handleCheckpointChange(index, 'status', 'neaplicabil')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              checkpoints[index].status === 'neaplicabil'
                                ? 'bg-gray-50 border-gray-300 text-gray-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <MinusCircle className="w-4 h-4" />
                            N/A
                          </button>
                        </div>

                        {/* Observations */}
                        <input
                          type="text"
                          value={checkpoints[index].observations}
                          onChange={(e) => handleCheckpointChange(index, 'observations', e.target.value)}
                          placeholder="Observații..."
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Lista inspecții existente
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Inspecții Interne SSM</h1>
            </div>
            <p className="text-sm text-gray-600 ml-14">
              Checklist-uri de verificare conformitate SSM
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Inspecție nouă
          </button>
        </div>

        {/* Lista inspecții */}
        {inspections.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nicio inspecție înregistrată
            </h3>
            <p className="text-gray-600 mb-6">
              Începeți prin a crea prima inspecție internă SSM
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Creează prima inspecție
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {inspections.map((inspection: any) => (
              <div
                key={inspection.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {inspection.organizations?.name || 'Organizație necunoscută'}
                      </h3>
                      {inspection.organizations?.cui && (
                        <span className="text-sm text-gray-500">
                          CUI: {inspection.organizations.cui}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(inspection.inspection_date).toLocaleDateString('ro-RO')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {inspection.inspector_name}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Scor: </span>
                        <span className="font-semibold text-blue-600">
                          {inspection.conformity_percentage}%
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Puncte: </span>
                        <span className="font-semibold">
                          {inspection.score}/{inspection.total_points}
                        </span>
                      </div>
                    </div>

                    {inspection.general_observations && (
                      <p className="text-sm text-gray-600 italic">
                        {inspection.general_observations}
                      </p>
                    )}
                  </div>

                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Raport PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
