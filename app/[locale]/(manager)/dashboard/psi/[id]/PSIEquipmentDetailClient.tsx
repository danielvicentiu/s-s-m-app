'use client'

// app/[locale]/dashboard/psi/[id]/PSIEquipmentDetailClient.tsx
// M2_PSI: Client component — detalii echipament + istoric inspecții + marchează verificat

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ClipboardCheck,
  Edit,
  Flame,
  MapPin,
  Calendar,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'
import {
  PSIEquipment,
  PSIInspection,
  PSI_EQUIPMENT_TYPE_LABELS,
  PSI_EQUIPMENT_STATUS_LABELS,
  PSI_INSPECTION_RESULT_LABELS
} from '@/lib/types'
import { CreatePSIEquipmentInput, CreatePSIInspectionInput } from '@/lib/api/validation'
import StatusBadge from '@/components/psi/StatusBadge'
import EquipmentForm from '@/components/psi/EquipmentForm'
import InspectionForm from '@/components/psi/InspectionForm'

interface PSIEquipmentDetailClientProps {
  equipment: PSIEquipment
  inspections: PSIInspection[]
  organizations: Array<{ id: string; name: string; cui?: string | null }>
  locale: string
}

export default function PSIEquipmentDetailClient({
  equipment: initialEquipment,
  inspections: initialInspections,
  organizations,
  locale
}: PSIEquipmentDetailClientProps) {
  const router = useRouter()
  const [equipment, setEquipment] = useState<PSIEquipment>(initialEquipment)
  const [inspections, setInspections] = useState<PSIInspection[]>(initialInspections)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showInspectionForm, setShowInspectionForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSaveEquipment = async (data: CreatePSIEquipmentInput) => {
    const response = await fetch(`/api/psi/equipment/${equipment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Eroare la salvarea echipamentului')
    }

    const updated = await response.json()
    setEquipment(updated)
  }

  const handleSaveInspection = async (data: CreatePSIInspectionInput) => {
    const response = await fetch('/api/psi/inspections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Eroare la salvarea inspecției')
    }

    const newInspection = await response.json()

    // Update local equipment state (status + dates from inspection)
    const result = data.result
    const updatedEquipment: PSIEquipment = {
      ...equipment,
      last_inspection_date: data.inspection_date,
      next_inspection_date: data.next_inspection_date,
      status: result === 'neconform' ? 'needs_repair' : 'operational',
      updated_at: new Date().toISOString()
    }
    setEquipment(updatedEquipment)

    // Prepend new inspection to history
    setInspections(prev => [newInspection, ...prev])
  }

  const handleQuickVerify = () => {
    setShowInspectionForm(true)
  }

  const resultIcon = (result: string) => {
    if (result === 'conform') return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (result === 'conform_cu_observatii') return <AlertTriangle className="h-4 w-4 text-amber-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const resultColor = (result: string) => {
    if (result === 'conform') return 'bg-green-100 text-green-700'
    if (result === 'conform_cu_observatii') return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi
            </button>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-100 rounded-xl">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {PSI_EQUIPMENT_TYPE_LABELS[equipment.equipment_type]} — {equipment.identifier}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {equipment.organizations?.name || ''}
                  {equipment.location && (
                    <span className="ml-2 inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {equipment.location}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowEditForm(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Edit className="h-4 w-4" />
                Editează
              </button>
              <button
                onClick={handleQuickVerify}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <ClipboardCheck className="h-4 w-4" />
                Marchează verificat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Equipment Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase mb-3">Status</p>
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
              equipment.status === 'operational' ? 'bg-green-100 text-green-700' :
              equipment.status === 'needs_inspection' ? 'bg-amber-100 text-amber-700' :
              equipment.status === 'needs_repair' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {PSI_EQUIPMENT_STATUS_LABELS[equipment.status]}
            </span>
          </div>

          {/* Next inspection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase mb-3">Inspecție</p>
            <StatusBadge nextInspectionDate={equipment.next_inspection_date} showDate />
          </div>

          {/* Last inspection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase mb-3">Ultima inspecție</p>
            <p className="text-sm font-semibold text-gray-900">
              {equipment.last_inspection_date || <span className="text-gray-400 italic">Niciodată</span>}
            </p>
          </div>
        </div>

        {/* Full details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-400" />
            Detalii echipament
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
            <Detail label="Tip" value={PSI_EQUIPMENT_TYPE_LABELS[equipment.equipment_type]} />
            <Detail label="Identificator / Serie" value={equipment.identifier} />
            <Detail label="Locație" value={equipment.location} />
            <Detail label="Producător" value={equipment.manufacturer} />
            <Detail label="Model" value={equipment.model} />
            <Detail label="Capacitate" value={equipment.capacity} />
            <Detail label="Tip agent" value={equipment.agent_type} />
            <Detail label="Data fabricației" value={equipment.manufacture_date} />
            <Detail label="Data instalării" value={equipment.installation_date} />
          </div>
          {equipment.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Observații</p>
              <p className="text-sm text-gray-700">{equipment.notes}</p>
            </div>
          )}
        </div>

        {/* Inspection history */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              Istoric inspecții
              <span className="ml-1 text-sm font-normal text-gray-500">({inspections.length})</span>
            </h2>
            <button
              onClick={() => setShowInspectionForm(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ClipboardCheck className="h-4 w-4" />
              Adaugă inspecție
            </button>
          </div>

          {inspections.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Nicio inspecție înregistrată pentru acest echipament</p>
              <button
                onClick={() => setShowInspectionForm(true)}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Înregistrează prima inspecție
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inspections.map((insp) => (
                <div key={insp.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{resultIcon(insp.result)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{insp.inspection_date}</span>
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${resultColor(insp.result)}`}>
                            {PSI_INSPECTION_RESULT_LABELS[insp.result]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                          Inspector: <span className="font-medium">{insp.inspector_name}</span>
                          {insp.inspector_license && ` (aut. ${insp.inspector_license})`}
                        </p>
                        {insp.findings && (
                          <p className="text-sm text-gray-500 mt-1 italic">{insp.findings}</p>
                        )}
                        {insp.bulletin_number && (
                          <p className="text-xs text-gray-400 mt-1">Buletin nr. {insp.bulletin_number}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-xs text-gray-500">Următoarea</p>
                      <p className="text-sm font-medium text-gray-900">{insp.next_inspection_date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit equipment modal */}
      <EquipmentForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSave={handleSaveEquipment}
        equipment={equipment}
        organizations={organizations}
      />

      {/* Record inspection modal */}
      <InspectionForm
        isOpen={showInspectionForm}
        onClose={() => setShowInspectionForm(false)}
        onSave={handleSaveInspection}
        equipment={equipment}
      />
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5">
        {value || <span className="text-gray-400 italic">—</span>}
      </p>
    </div>
  )
}
