'use client'

// ITMPrepClient.tsx
// Client component pentru checklist pregătire control ITM
// Auto-verificare documente, status ready/missing/partial, export PDF

import React, { useState, useMemo } from 'react'
import { itmInspectionChecklist, itmChecklistStats, ITMChecklistItem } from '@/lib/data/itm-inspection-prep'

type CheckStatus = 'ready' | 'missing' | 'partial' | 'not_applicable'

interface ITMPrepClientProps {
  user: {
    id: string
    email: string
    fullName: string
  }
  organizations: any[]
  documents: any[]
  trainings: any[]
  medicalExams: any[]
  equipment: any[]
  employees: any[]
}

interface ChecklistItemStatus extends ITMChecklistItem {
  status: CheckStatus
  reason: string
  autoChecked: boolean
}

export default function ITMPrepClient({
  user,
  organizations,
  documents,
  trainings,
  medicalExams,
  equipment,
  employees
}: ITMPrepClientProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0]?.id || '')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Auto-check logic pentru fiecare item
  const checkItemStatus = (item: ITMChecklistItem, orgId: string): { status: CheckStatus; reason: string; autoChecked: boolean } => {
    if (!orgId) return { status: 'missing', reason: 'Selectați o organizație', autoChecked: false }

    const orgDocs = documents.filter(d => d.organization_id === orgId)
    const orgTrainings = trainings.filter(t => t.organization_id === orgId)
    const orgMedical = medicalExams.filter(m => m.organization_id === orgId)
    const orgEquipment = equipment.filter(e => e.organization_id === orgId)
    const orgEmployees = employees.filter(e => e.organization_id === orgId)
    const employeeCount = orgEmployees.length

    // Auto-check logic per item ID
    switch (item.id) {
      // Plan de Prevenire și Protecție
      case 'doc-001': {
        const hasPPP = orgDocs.some(d =>
          d.document_type === 'plan_prevenire' ||
          d.file_name?.toLowerCase().includes('plan') ||
          d.file_name?.toLowerCase().includes('prevenire')
        )
        if (hasPPP) {
          const pppDoc = orgDocs.find(d =>
            d.document_type === 'plan_prevenire' ||
            d.file_name?.toLowerCase().includes('plan')
          )
          const isRecent = pppDoc && new Date(pppDoc.created_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          return {
            status: isRecent ? 'ready' : 'partial',
            reason: isRecent ? 'PPP găsit în sistem' : 'PPP există dar poate fi învechit (>1 an)',
            autoChecked: true
          }
        }
        return { status: 'missing', reason: 'Plan de Prevenire și Protecție lipsește', autoChecked: true }
      }

      // Evaluarea Riscurilor
      case 'doc-002': {
        const hasRiskAssessment = orgDocs.some(d =>
          d.document_type === 'evaluare_riscuri' ||
          d.file_name?.toLowerCase().includes('risc') ||
          d.file_name?.toLowerCase().includes('evaluare')
        )
        if (hasRiskAssessment) {
          return { status: 'ready', reason: 'Evaluare riscuri găsită în sistem', autoChecked: true }
        }
        return { status: 'missing', reason: 'Evaluare riscuri lipsește', autoChecked: true }
      }

      // Contracte de muncă
      case 'doc-003': {
        if (employeeCount > 0) {
          return {
            status: 'partial',
            reason: `${employeeCount} angajați înregistrați — verificați contractele individual`,
            autoChecked: true
          }
        }
        return { status: 'missing', reason: 'Niciun angajat înregistrat în sistem', autoChecked: true }
      }

      // RIOF
      case 'doc-004': {
        const org = organizations.find(o => o.id === orgId)
        const needsRIOF = org?.employee_count && org.employee_count >= 21
        if (!needsRIOF) {
          return { status: 'not_applicable', reason: 'Sub 21 angajați (recomandat dar nu obligatoriu)', autoChecked: true }
        }
        const hasRIOF = orgDocs.some(d => d.file_name?.toLowerCase().includes('riof') || d.file_name?.toLowerCase().includes('regulament'))
        return {
          status: hasRIOF ? 'ready' : 'missing',
          reason: hasRIOF ? 'RIOF găsit' : 'RIOF obligatoriu (21+ angajați)',
          autoChecked: true
        }
      }

      // Fișe post
      case 'doc-005': {
        if (employeeCount > 0) {
          return {
            status: 'partial',
            reason: `${employeeCount} angajați — verificați fișele de post individual`,
            autoChecked: true
          }
        }
        return { status: 'missing', reason: 'Fără angajați înregistrați', autoChecked: true }
      }

      // Registrul de Instructaj SSM
      case 'reg-002': {
        const recentTrainings = orgTrainings.filter(t => {
          const trainingDate = new Date(t.training_date)
          const monthsAgo = (Date.now() - trainingDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
          return monthsAgo <= 12 // În ultimul an
        })

        if (recentTrainings.length === 0) {
          return { status: 'missing', reason: 'Nicio instruire înregistrată în ultimul an', autoChecked: true }
        }

        const hasInstructionsForAll = recentTrainings.length >= employeeCount
        return {
          status: hasInstructionsForAll ? 'ready' : 'partial',
          reason: hasInstructionsForAll
            ? `${recentTrainings.length} instruiri la zi`
            : `${recentTrainings.length}/${employeeCount} instruiri înregistrate`,
          autoChecked: true
        }
      }

      // Registrul de Evidență Medicală
      case 'reg-003': {
        const validMedical = orgMedical.filter(m => {
          const expiry = new Date(m.expiry_date)
          return expiry > new Date() && m.result === 'apt'
        })

        if (validMedical.length === 0) {
          return { status: 'missing', reason: 'Niciun aviz medical valabil în sistem', autoChecked: true }
        }

        const hasForAll = validMedical.length >= employeeCount
        return {
          status: hasForAll ? 'ready' : 'partial',
          reason: hasForAll
            ? `${validMedical.length} avize medicale valabile`
            : `${validMedical.length}/${employeeCount} avize valabile`,
          autoChecked: true
        }
      }

      // Registrul EIP
      case 'reg-005': {
        const hasEIP = orgEquipment.some(e => e.equipment_type === 'eip')
        if (hasEIP) {
          const compliantEIP = orgEquipment.filter(e => e.equipment_type === 'eip' && e.is_compliant)
          return {
            status: compliantEIP.length > 0 ? 'ready' : 'partial',
            reason: `${compliantEIP.length} EIP-uri conforme înregistrate`,
            autoChecked: true
          }
        }
        return { status: 'missing', reason: 'Niciun EIP înregistrat', autoChecked: true }
      }

      // Avize medicale
      case 'evi-001': {
        const validMedical = orgMedical.filter(m => new Date(m.expiry_date) > new Date())
        if (validMedical.length === 0) {
          return { status: 'missing', reason: 'Niciun aviz medical valabil', autoChecked: true }
        }
        return {
          status: validMedical.length >= employeeCount ? 'ready' : 'partial',
          reason: `${validMedical.length}/${employeeCount} avize valabile`,
          autoChecked: true
        }
      }

      // Echipamente PSI
      case 'aut-005': {
        const psiEquipment = orgEquipment.filter(e =>
          e.equipment_type === 'stingator' ||
          e.equipment_type === 'hidrant'
        )

        if (psiEquipment.length === 0) {
          return { status: 'missing', reason: 'Niciun echipament PSI înregistrat', autoChecked: true }
        }

        const compliantPSI = psiEquipment.filter(e => {
          const expiry = new Date(e.expiry_date)
          return expiry > new Date() && e.is_compliant
        })

        return {
          status: compliantPSI.length > 0 ? 'ready' : 'partial',
          reason: `${compliantPSI.length}/${psiEquipment.length} echipamente PSI conforme`,
          autoChecked: true
        }
      }

      // Default: Nu se poate auto-verifica
      default:
        return {
          status: 'missing',
          reason: 'Verificare manuală necesară',
          autoChecked: false
        }
    }
  }

  // Calculează status pentru toate items
  const checklistWithStatus: ChecklistItemStatus[] = useMemo(() => {
    return itmInspectionChecklist.map(item => {
      const { status, reason, autoChecked } = checkItemStatus(item, selectedOrgId)
      return {
        ...item,
        status,
        reason,
        autoChecked
      }
    })
  }, [selectedOrgId, documents, trainings, medicalExams, equipment, employees])

  // Filtrare
  const filteredChecklist = useMemo(() => {
    let filtered = checklistWithStatus

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus)
    }

    return filtered
  }, [checklistWithStatus, filterCategory, filterStatus])

  // Calculează overall readiness score
  const readinessScore = useMemo(() => {
    const mandatory = checklistWithStatus.filter(item => item.isMandatory)
    const ready = mandatory.filter(item => item.status === 'ready').length
    const partial = mandatory.filter(item => item.status === 'partial').length

    // Ready = 100%, Partial = 50%, Missing = 0%
    const score = ((ready * 100) + (partial * 50)) / mandatory.length

    return {
      score: Math.round(score),
      ready,
      partial,
      missing: mandatory.filter(item => item.status === 'missing').length,
      total: mandatory.length
    }
  }, [checklistWithStatus])

  // Export PDF
  const handleExportPDF = async () => {
    const selectedOrg = organizations.find(o => o.id === selectedOrgId)
    if (!selectedOrg) {
      alert('Selectați o organizație')
      return
    }

    try {
      const response = await fetch('/api/pdf/itm-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: selectedOrgId,
          organizationName: selectedOrg.name,
          organizationCui: selectedOrg.cui,
          checklistData: checklistWithStatus,
          readinessScore,
          generatedBy: user.fullName,
          generatedAt: new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ITM-Checklist-${selectedOrg.name.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Eroare la exportul PDF. Încercați din nou.')
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: CheckStatus }) => {
    const styles = {
      ready: 'bg-green-100 text-green-800 border-green-300',
      partial: 'bg-amber-100 text-amber-800 border-amber-300',
      missing: 'bg-red-100 text-red-800 border-red-300',
      not_applicable: 'bg-gray-100 text-gray-600 border-gray-300'
    }

    const labels = {
      ready: '✓ Ready',
      partial: '⚠ Parțial',
      missing: '✗ Lipsă',
      not_applicable: 'N/A'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  // Readiness gauge
  const ReadinessGauge = () => {
    const { score, ready, partial, missing, total } = readinessScore

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600'
      if (score >= 50) return 'text-amber-600'
      return 'text-red-600'
    }

    const getScoreLabel = (score: number) => {
      if (score >= 80) return 'Pregătit pentru control'
      if (score >= 50) return 'Pregătire parțială'
      return 'Pregătire insuficientă'
    }

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nivel Pregătire ITM</h3>

        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                className={getScoreColor(score)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </div>
                <div className="text-xs text-gray-500">pregătire</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className={`text-sm font-medium ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">✓ Conform</span>
            <span className="font-semibold text-green-600">{ready}/{total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">⚠ Parțial</span>
            <span className="font-semibold text-amber-600">{partial}/{total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">✗ Lipsă</span>
            <span className="font-semibold text-red-600">{missing}/{total}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pregătire Control ITM
          </h1>
          <p className="text-gray-600">
            Checklist complet cu verificare automată a documentelor și status conform
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Organization selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizație
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui ? `(${org.cui})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorie
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate ({itmInspectionChecklist.length})</option>
                <option value="documente">Documente ({itmChecklistStats.byCategory.documente})</option>
                <option value="afisaje">Afișaje ({itmChecklistStats.byCategory.afisaje})</option>
                <option value="registre">Registre ({itmChecklistStats.byCategory.registre})</option>
                <option value="evidente">Evidențe ({itmChecklistStats.byCategory.evidente})</option>
                <option value="autorizatii">Autorizații ({itmChecklistStats.byCategory.autorizatii})</option>
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate</option>
                <option value="ready">✓ Ready</option>
                <option value="partial">⚠ Parțial</option>
                <option value="missing">✗ Lipsă</option>
                <option value="not_applicable">N/A</option>
              </select>
            </div>

            {/* Export button */}
            <div className="flex items-end">
              <button
                onClick={handleExportPDF}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                📄 Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness Score Sidebar */}
          <div className="lg:col-span-1">
            <ReadinessGauge />

            {/* Quick stats */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistici</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total items</span>
                  <span className="font-semibold">{itmChecklistStats.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Obligatorii</span>
                  <span className="font-semibold">{itmChecklistStats.mandatoryItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto-verificate</span>
                  <span className="font-semibold">
                    {checklistWithStatus.filter(i => i.autoChecked).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredChecklist.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">Niciun item nu corespunde filtrelor selectate</p>
                </div>
              )}

              {filteredChecklist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.documentName}
                        </h3>
                        <StatusBadge status={item.status} />
                        {item.isMandatory && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Obligatoriu
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Bază legală:</span> {item.legalBasis}
                      </p>

                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Unde:</span> {item.whereToFind}
                      </p>

                      {item.autoChecked && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-900">
                            <span className="font-medium">🤖 Verificare automată:</span> {item.reason}
                          </p>
                        </div>
                      )}

                      {!item.autoChecked && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">👁️ Verificare manuală:</span> {item.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deficiențe frecvente */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Deficiențe frecvente ({item.commonDeficiencies.length})
                    </summary>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600 pl-5">
                      {item.commonDeficiencies.map((deficiency, idx) => (
                        <li key={idx} className="list-disc">
                          {deficiency}
                        </li>
                      ))}
                    </ul>
                  </details>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Aplicabil pentru:</span> {item.applicableFor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
