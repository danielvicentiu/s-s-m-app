'use client'

// Component client pentru detalii echipament
import { useState } from 'react'
import Link from 'next/link'

interface EquipmentDetailClientProps {
  equipment: any
  inspections: any[]
  documents: any[]
  responsibleEmployee: any
  locale: string
}

export default function EquipmentDetailClient({
  equipment,
  inspections,
  documents,
  responsibleEmployee,
  locale
}: EquipmentDetailClientProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/${locale}/dashboard/equipment`}
          className="text-blue-600 hover:underline"
        >
          ← Înapoi la echipamente
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4">{equipment.name}</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Tip</p>
            <p className="font-medium">{equipment.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Serie</p>
            <p className="font-medium">{equipment.serial_number || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Organizație</p>
            <p className="font-medium">{(equipment.organizations as any)?.name}</p>
          </div>
          {responsibleEmployee && (
            <div>
              <p className="text-sm text-gray-600">Responsabil</p>
              <p className="font-medium">{responsibleEmployee.full_name}</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Istoric inspecții</h2>
          {inspections.length === 0 ? (
            <p className="text-gray-500">Nu există inspecții înregistrate</p>
          ) : (
            <div className="space-y-2">
              {inspections.map((inspection) => (
                <div key={inspection.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">
                    {new Date(inspection.inspection_date).toLocaleDateString('ro-RO')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {inspection.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
