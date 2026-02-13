// app/[locale]/dashboard/equipment/[id]/EquipmentDetailClient.tsx
// Client component pentru pagina de detalii echipament

'use client'

import { useRouter } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'

interface Props {
  equipment: any
  inspections: any[]
  documents: any[]
  responsibleEmployee: any | null
  locale: string
}

export default function EquipmentDetailClient({
  equipment,
  inspections,
  documents,
  responsibleEmployee,
  locale
}: Props) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/equipment')}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la echipamente
          </button>
        </div>

        {/* Equipment Info */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            {equipment.description || equipment.equipment_type}
          </h1>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">Tip</p>
              <p className="font-medium">{equipment.equipment_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Locație</p>
              <p className="font-medium">{equipment.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Serie</p>
              <p className="font-medium">{equipment.serial_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">
                {equipment.is_compliant ? 'Conform' : 'Neconform'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ultima inspecție</p>
              <p className="font-medium">
                {equipment.last_inspection_date || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data expirării</p>
              <p className="font-medium">{equipment.expiry_date}</p>
            </div>
          </div>

          {equipment.notes && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Note</p>
              <p className="mt-1 text-sm text-gray-900">{equipment.notes}</p>
            </div>
          )}
        </div>

        {/* Inspections */}
        {inspections.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Istoric inspecții
            </h2>
            <div className="space-y-3">
              {inspections.map((inspection) => (
                <div
                  key={inspection.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {inspection.inspection_date}
                      </p>
                      <p className="text-sm text-gray-600">
                        {inspection.inspector_name || 'Inspector necunoscut'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {inspection.result || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inspection.inspection_type || 'periodica'}
                      </p>
                    </div>
                  </div>
                  {inspection.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      {inspection.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
