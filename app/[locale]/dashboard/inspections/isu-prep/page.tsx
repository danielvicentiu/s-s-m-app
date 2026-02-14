// app/[locale]/dashboard/inspections/isu-prep/page.tsx
// Pregătire Control ISU/PSI — Checklist conformitate + Export PDF
// Auto-check stingătoare, plan evacuare, instruiri, exerciții, documentație PSI

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  ArrowLeft,
  Flame,
  Users,
  MapPin,
  Calendar,
  ClipboardCheck,
  Info,
  Loader2,
  ExternalLink
} from 'lucide-react'

// ========== TYPES ==========

interface ChecklistItem {
  id: string
  category: string
  requirement: string
  description: string
  status: 'compliant' | 'partial' | 'non_compliant' | 'checking'
  details?: string
  count?: number
  lastCheck?: string
  legalRef?: string
}

interface ReadinessStats {
  compliantCount: number
  partialCount: number
  nonCompliantCount: number
  overallScore: number
  readinessLevel: 'excellent' | 'good' | 'warning' | 'critical'
}

// ========== COMPONENT ==========

export default function ISUPrepPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // State
  const [loading, setLoading] = useState(true)
  const [exportingPDF, setExportingPDF] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [stats, setStats] = useState<ReadinessStats>({
    compliantCount: 0,
    partialCount: 0,
    nonCompliantCount: 0,
    overallScore: 0,
    readinessLevel: 'warning'
  })

  // ========== FETCH DATA ==========

  useEffect(() => {
    fetchChecklistData()
  }, [])

  async function fetchChecklistData() {
    try {
      setLoading(true)

      // Get user's organization
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: membership } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!membership) throw new Error('No active organization')

      const orgId = membership.organization_id

      // Fetch all required data in parallel
      const [
        fireExtinguishers,
        evacuationPlans,
        psiTrainings,
        evacuationDrills,
        psiDocuments
      ] = await Promise.all([
        // 1. Fire extinguishers (stingătoare)
        supabase
          .from('safety_equipment')
          .select('id, last_inspection_date, expiry_date, is_compliant')
          .eq('organization_id', orgId)
          .eq('equipment_type', 'stingator')
          .is('deleted_at', null),

        // 2. Evacuation plans (planuri evacuare) - check if documents exist
        supabase
          .from('generated_documents')
          .select('id, document_type, created_at')
          .eq('organization_id', orgId)
          .eq('document_type', 'plan_evacuare')
          .order('created_at', { ascending: false })
          .limit(1),

        // 3. PSI trainings (instruiri PSI)
        supabase
          .from('trainings')
          .select('id, training_date, expiry_date')
          .eq('organization_id', orgId)
          .eq('training_type', 'psi')
          .is('deleted_at', null),

        // 4. Evacuation drills (exerciții evacuare)
        supabase
          .from('trainings')
          .select('id, training_date')
          .eq('organization_id', orgId)
          .eq('training_type', 'exercitiu_evacuare')
          .is('deleted_at', null)
          .order('training_date', { ascending: false }),

        // 5. PSI documentation (documentație PSI)
        supabase
          .from('generated_documents')
          .select('id, document_type, created_at')
          .eq('organization_id', orgId)
          .in('document_type', ['instructiuni_psi', 'fisa_echipamente'])
          .order('created_at', { ascending: false })
      ])

      // Build checklist
      const items: ChecklistItem[] = []

      // 1. STINGĂTOARE
      const extinguishers = fireExtinguishers.data || []
      const validExtinguishers = extinguishers.filter(e => e.is_compliant)
      const expiredExtinguishers = extinguishers.filter(e => {
        if (!e.expiry_date) return false
        return new Date(e.expiry_date) < new Date()
      })

      items.push({
        id: 'fire-extinguishers',
        category: 'Echipamente PSI',
        requirement: 'Stingătoare verificate și conforme',
        description: 'Toate stingătoarele trebuie să fie verificate periodic și în termen de valabilitate',
        status: expiredExtinguishers.length > 0
          ? 'non_compliant'
          : validExtinguishers.length === extinguishers.length && extinguishers.length > 0
            ? 'compliant'
            : extinguishers.length > 0
              ? 'partial'
              : 'non_compliant',
        details: `${validExtinguishers.length}/${extinguishers.length} conforme${expiredExtinguishers.length > 0 ? `, ${expiredExtinguishers.length} expirate` : ''}`,
        count: extinguishers.length,
        legalRef: 'HG 1492/2004'
      })

      // 2. PLAN EVACUARE
      const evacuationPlan = evacuationPlans.data?.[0]
      items.push({
        id: 'evacuation-plan',
        category: 'Documentație PSI',
        requirement: 'Plan de evacuare afișat',
        description: 'Plan de evacuare actualizat și afișat vizibil la toate ieșirile',
        status: evacuationPlan ? 'compliant' : 'non_compliant',
        details: evacuationPlan
          ? `Ultima actualizare: ${new Date(evacuationPlan.created_at).toLocaleDateString('ro-RO')}`
          : 'Nu există plan de evacuare',
        lastCheck: evacuationPlan?.created_at,
        legalRef: 'HG 1492/2004, art. 18'
      })

      // 3. INSTRUIRI PSI
      const psiTrainingData = psiTrainings.data || []
      const today = new Date()
      const validPsiTrainings = psiTrainingData.filter(t => {
        if (!t.expiry_date) return false
        return new Date(t.expiry_date) > today
      })
      const expiredPsiTrainings = psiTrainingData.filter(t => {
        if (!t.expiry_date) return false
        return new Date(t.expiry_date) <= today
      })

      items.push({
        id: 'psi-trainings',
        category: 'Instruiri',
        requirement: 'Instruiri PSI la zi pentru toți angajații',
        description: 'Instruiri periodice PSI (anual sau la angajare)',
        status: psiTrainingData.length === 0
          ? 'non_compliant'
          : expiredPsiTrainings.length > 0
            ? 'partial'
            : 'compliant',
        details: `${validPsiTrainings.length} active${expiredPsiTrainings.length > 0 ? `, ${expiredPsiTrainings.length} expirate` : ''}`,
        count: psiTrainingData.length,
        legalRef: 'HG 1492/2004, art. 20'
      })

      // 4. EXERCIȚII EVACUARE
      const drills = evacuationDrills.data || []
      const lastDrill = drills[0]
      const lastDrillDate = lastDrill ? new Date(lastDrill.training_date) : null
      const monthsSinceLastDrill = lastDrillDate
        ? Math.floor((today.getTime() - lastDrillDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
        : null

      items.push({
        id: 'evacuation-drills',
        category: 'Instruiri',
        requirement: 'Exerciții de evacuare efectuate',
        description: 'Exerciții de evacuare periodice (recomandat: 2x/an)',
        status: !lastDrill
          ? 'non_compliant'
          : monthsSinceLastDrill && monthsSinceLastDrill > 12
            ? 'partial'
            : 'compliant',
        details: lastDrill
          ? `Ultimul exercițiu: ${new Date(lastDrill.training_date).toLocaleDateString('ro-RO')}${monthsSinceLastDrill ? ` (${monthsSinceLastDrill} luni în urmă)` : ''}`
          : 'Nu există înregistrări',
        count: drills.length,
        lastCheck: lastDrill?.training_date,
        legalRef: 'HG 1492/2004, art. 21'
      })

      // 5. INSTRUCȚIUNI PSI
      const psiDocs = psiDocuments.data || []
      const psiInstructions = psiDocs.find(d => d.document_type === 'instructiuni_psi')
      const equipmentSheets = psiDocs.find(d => d.document_type === 'fisa_echipamente')

      items.push({
        id: 'psi-instructions',
        category: 'Documentație PSI',
        requirement: 'Instrucțiuni proprii PSI',
        description: 'Instrucțiuni PSI elaborate și afișate la locurile de muncă',
        status: psiInstructions ? 'compliant' : 'non_compliant',
        details: psiInstructions
          ? `Actualizat: ${new Date(psiInstructions.created_at).toLocaleDateString('ro-RO')}`
          : 'Nu există instrucțiuni PSI',
        lastCheck: psiInstructions?.created_at,
        legalRef: 'HG 1492/2004, art. 19'
      })

      // 6. FIȘE ECHIPAMENTE
      items.push({
        id: 'equipment-sheets',
        category: 'Documentație PSI',
        requirement: 'Fișe echipamente PSI',
        description: 'Fișe tehnice pentru toate echipamentele de stingere',
        status: equipmentSheets ? 'compliant' : 'partial',
        details: equipmentSheets
          ? `Actualizat: ${new Date(equipmentSheets.created_at).toLocaleDateString('ro-RO')}`
          : 'Recomandat să existe',
        lastCheck: equipmentSheets?.created_at,
        legalRef: 'HG 1492/2004'
      })

      // 7. HIDRANȚI INTERIORI (if applicable)
      const hydrants = await supabase
        .from('safety_equipment')
        .select('id, is_compliant, expiry_date')
        .eq('organization_id', orgId)
        .eq('equipment_type', 'hidrant')
        .is('deleted_at', null)

      if (hydrants.data && hydrants.data.length > 0) {
        const validHydrants = hydrants.data.filter(h => h.is_compliant)
        items.push({
          id: 'hydrants',
          category: 'Echipamente PSI',
          requirement: 'Hidranți interiori verificați',
          description: 'Hidranți interiori verificați și funcționali',
          status: validHydrants.length === hydrants.data.length ? 'compliant' : 'partial',
          details: `${validHydrants.length}/${hydrants.data.length} funcționali`,
          count: hydrants.data.length,
          legalRef: 'HG 1492/2004'
        })
      }

      // 8. DETECTORI FUM
      const smokeDetectors = await supabase
        .from('safety_equipment')
        .select('id, is_compliant')
        .eq('organization_id', orgId)
        .eq('equipment_type', 'detector_fum')
        .is('deleted_at', null)

      if (smokeDetectors.data && smokeDetectors.data.length > 0) {
        const validDetectors = smokeDetectors.data.filter(d => d.is_compliant)
        items.push({
          id: 'smoke-detectors',
          category: 'Echipamente PSI',
          requirement: 'Detectori fum funcționali',
          description: 'Detectori de fum verificați și funcționali',
          status: validDetectors.length === smokeDetectors.data.length ? 'compliant' : 'partial',
          details: `${validDetectors.length}/${smokeDetectors.data.length} funcționali`,
          count: smokeDetectors.data.length,
          legalRef: 'HG 1492/2004'
        })
      }

      // 9. ILUMINAT URGENȚĂ
      const emergencyLights = await supabase
        .from('safety_equipment')
        .select('id, is_compliant')
        .eq('organization_id', orgId)
        .eq('equipment_type', 'iluminat_urgenta')
        .is('deleted_at', null)

      if (emergencyLights.data && emergencyLights.data.length > 0) {
        const validLights = emergencyLights.data.filter(l => l.is_compliant)
        items.push({
          id: 'emergency-lights',
          category: 'Echipamente PSI',
          requirement: 'Iluminat de urgență funcțional',
          description: 'Sistem iluminat de urgență verificat',
          status: validLights.length === emergencyLights.data.length ? 'compliant' : 'partial',
          details: `${validLights.length}/${emergencyLights.data.length} funcționale`,
          count: emergencyLights.data.length,
          legalRef: 'HG 1492/2004'
        })
      }

      setChecklist(items)

      // Calculate stats
      const compliant = items.filter(i => i.status === 'compliant').length
      const partial = items.filter(i => i.status === 'partial').length
      const nonCompliant = items.filter(i => i.status === 'non_compliant').length
      const score = Math.round((compliant / items.length) * 100)

      setStats({
        compliantCount: compliant,
        partialCount: partial,
        nonCompliantCount: nonCompliant,
        overallScore: score,
        readinessLevel: score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'warning' : 'critical'
      })

    } catch (err) {
      console.error('[ISU-PREP] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ========== EXPORT PDF ==========

  async function handleExportPDF() {
    try {
      setExportingPDF(true)

      const response = await fetch('/api/pdf/isu-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checklist,
          stats,
          generatedAt: new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error('PDF generation failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `checklist-isu-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (err) {
      console.error('[ISU-PREP] Export PDF error:', err)
      alert('Eroare la generarea PDF. Verificați consola.')
    } finally {
      setExportingPDF(false)
    }
  }

  // ========== HELPERS ==========

  function getReadinessColor(level: string) {
    const colors = {
      excellent: 'text-green-600 bg-green-50',
      good: 'text-blue-600 bg-blue-50',
      warning: 'text-orange-600 bg-orange-50',
      critical: 'text-red-600 bg-red-50'
    }
    return colors[level as keyof typeof colors] || colors.warning
  }

  function getReadinessLabel(level: string) {
    const labels = {
      excellent: 'Excelent',
      good: 'Bine',
      warning: 'Atenție',
      critical: 'Critic'
    }
    return labels[level as keyof typeof labels] || 'Verificare'
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'compliant': return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'partial': return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'non_compliant': return <XCircle className="h-5 w-5 text-red-600" />
      default: return <Info className="h-5 w-5 text-gray-400" />
    }
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case 'Echipamente PSI': return <Flame className="h-4 w-4" />
      case 'Documentație PSI': return <FileText className="h-4 w-4" />
      case 'Instruiri': return <Users className="h-4 w-4" />
      default: return <ClipboardCheck className="h-4 w-4" />
    }
  }

  // ========== RENDER ==========

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-7 w-7 text-blue-600" />
              Pregătire Control ISU/PSI
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Verificare conformitate și pregătire pentru inspecție
            </p>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={exportingPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportingPDF ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generare...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export PDF
            </>
          )}
        </button>
      </div>

      {/* Overall Readiness Card */}
      <div className={`rounded-2xl p-6 border-2 ${getReadinessColor(stats.readinessLevel)}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {stats.overallScore}% Pregătire
                </h2>
                <p className="text-sm font-medium">
                  Nivel: {getReadinessLabel(stats.readinessLevel)}
                </p>
              </div>
            </div>
            <p className="text-sm opacity-90 mt-2">
              {stats.compliantCount} conforme · {stats.partialCount} parțiale · {stats.nonCompliantCount} neconforme
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium mb-1">Status general</div>
            <div className="text-3xl font-bold">{stats.compliantCount}/{checklist.length}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Conforme</p>
              <p className="text-2xl font-bold text-green-700">{stats.compliantCount}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Parțiale</p>
              <p className="text-2xl font-bold text-orange-700">{stats.partialCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Neconforme</p>
              <p className="text-2xl font-bold text-red-700">{stats.nonCompliantCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            Checklist Conformitate PSI
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Verificare automată bazată pe datele din sistem
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {checklist.map((item) => (
            <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(item.status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.requirement}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>

                    {/* Category Badge */}
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                  </div>

                  {/* Details */}
                  {item.details && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span>{item.details}</span>
                      {item.count !== undefined && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {item.count} înregistrări
                        </span>
                      )}
                    </div>
                  )}

                  {/* Legal Reference */}
                  {item.legalRef && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FileText className="h-3 w-3" />
                      Bază legală: {item.legalRef}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {stats.nonCompliantCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">
                Acțiuni Recomandate
              </h3>
              <ul className="space-y-2 text-sm text-red-800">
                {checklist
                  .filter(item => item.status === 'non_compliant')
                  .map(item => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>
                        <strong>{item.requirement}:</strong> {item.details}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Informații Importante
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Verificările sunt automate, bazate pe datele introduse în sistem</li>
              <li>• Asigurați-vă că toate documentele sunt actualizate înainte de inspecție</li>
              <li>• Recomandăm export PDF pentru arhivă și prezentare inspectorului</li>
              <li>• Contactați consultantul SSM/PSI pentru pregătire detaliată</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
