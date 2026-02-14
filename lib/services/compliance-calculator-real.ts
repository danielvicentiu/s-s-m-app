// lib/services/compliance-calculator-real.ts
// S-S-M.RO — Real Compliance Score Calculator
// Calculates compliance score from real Supabase data
// Data: 14 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'

// ============================================================
// TYPES
// ============================================================

export interface ComplianceWeights {
  training: number      // Default: 0.30 (30%)
  medical: number       // Default: 0.30 (30%)
  equipment: number     // Default: 0.25 (25%)
  documents: number     // Default: 0.15 (15%)
}

export interface CategoryScore {
  score: number                    // 0-100
  compliant: number                // Count of compliant items
  total: number                    // Total items
  percentage: number               // compliant/total * 100
  weight: number                   // Weight factor
  weightedScore: number            // score * weight
}

export interface ComplianceAction {
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'training' | 'medical' | 'equipment' | 'documents'
  description: string
  affectedCount: number
  daysOverdue?: number
}

export interface ComplianceTrend {
  previousScore: number
  currentScore: number
  change: number              // Positive = improvement
  changePercentage: number    // % change
}

export interface ComplianceResult {
  overallScore: number                    // 0-100 weighted average
  breakdown: {
    training: CategoryScore
    medical: CategoryScore
    equipment: CategoryScore
    documents: CategoryScore
  }
  trend: ComplianceTrend | null           // null if no previous data
  topActions: ComplianceAction[]          // Top 5 actions needed
  calculatedAt: string                    // ISO timestamp
  organizationId: string
}

// ============================================================
// DEFAULT WEIGHTS (configurable)
// ============================================================

export const DEFAULT_WEIGHTS: ComplianceWeights = {
  training: 0.30,   // 30% — Training is critical
  medical: 0.30,    // 30% — Medical examinations are mandatory
  equipment: 0.25,  // 25% — Equipment safety is essential
  documents: 0.15,  // 15% — Documentation is important but less urgent
}

// ============================================================
// MAIN CALCULATOR FUNCTION
// ============================================================

/**
 * Calculate compliance score for an organization
 * @param organizationId - Organization UUID
 * @param weights - Optional custom weights (defaults to DEFAULT_WEIGHTS)
 * @returns ComplianceResult with score, breakdown, trend, and actions
 */
export async function calculateComplianceScore(
  organizationId: string,
  weights: ComplianceWeights = DEFAULT_WEIGHTS
): Promise<ComplianceResult> {
  // Validate weights sum to 1.0
  const weightSum = Object.values(weights).reduce((sum, w) => sum + w, 0)
  if (Math.abs(weightSum - 1.0) > 0.01) {
    throw new Error(`Weights must sum to 1.0, got ${weightSum}`)
  }

  const supabase = await createSupabaseServer()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  // Parallel data fetching for performance
  const [
    trainingScore,
    medicalScore,
    equipmentScore,
    documentScore,
    trend,
  ] = await Promise.all([
    calculateTrainingScore(supabase, organizationId, todayStr),
    calculateMedicalScore(supabase, organizationId, todayStr),
    calculateEquipmentScore(supabase, organizationId, todayStr),
    calculateDocumentScore(supabase, organizationId, todayStr),
    calculateTrend(supabase, organizationId),
  ])

  // Calculate weighted scores
  const trainingWeighted: CategoryScore = {
    ...trainingScore,
    weight: weights.training,
    weightedScore: trainingScore.score * weights.training,
  }

  const medicalWeighted: CategoryScore = {
    ...medicalScore,
    weight: weights.medical,
    weightedScore: medicalScore.score * weights.medical,
  }

  const equipmentWeighted: CategoryScore = {
    ...equipmentScore,
    weight: weights.equipment,
    weightedScore: equipmentScore.score * weights.equipment,
  }

  const documentWeighted: CategoryScore = {
    ...documentScore,
    weight: weights.documents,
    weightedScore: documentScore.score * weights.documents,
  }

  // Overall weighted score
  const overallScore = Math.round(
    trainingWeighted.weightedScore +
    medicalWeighted.weightedScore +
    equipmentWeighted.weightedScore +
    documentWeighted.weightedScore
  )

  // Generate top actions
  const topActions = await generateTopActions(
    supabase,
    organizationId,
    todayStr,
    {
      training: trainingScore,
      medical: medicalScore,
      equipment: equipmentScore,
      documents: documentScore,
    }
  )

  return {
    overallScore,
    breakdown: {
      training: trainingWeighted,
      medical: medicalWeighted,
      equipment: equipmentWeighted,
      documents: documentWeighted,
    },
    trend,
    topActions,
    calculatedAt: new Date().toISOString(),
    organizationId,
  }
}

// ============================================================
// CATEGORY CALCULATORS
// ============================================================

/**
 * Calculate training compliance score
 * Score = employees with valid training / total employees
 */
async function calculateTrainingScore(
  supabase: any,
  organizationId: string,
  todayStr: string
): Promise<Omit<CategoryScore, 'weight' | 'weightedScore'>> {
  // Get total employees (from memberships with role 'angajat')
  const { count: totalEmployees } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('role', 'angajat')
    .eq('is_active', true)

  if (!totalEmployees || totalEmployees === 0) {
    return {
      score: 100, // No employees = 100% compliance (nothing to track)
      compliant: 0,
      total: 0,
      percentage: 100,
    }
  }

  // Get employees with completed, non-expired training
  // Check training_assignments with status 'completed' and next_due_date >= today
  const { data: validTrainings } = await supabase
    .from('training_assignments')
    .select('worker_id')
    .eq('organization_id', organizationId)
    .eq('status', 'completed')
    .or(`next_due_date.is.null,next_due_date.gte.${todayStr}`)

  // Get unique employees with valid training
  const employeesWithValidTraining = new Set(
    validTrainings?.map((t: any) => t.worker_id) || []
  ).size

  const percentage = Math.round((employeesWithValidTraining / totalEmployees) * 100)

  return {
    score: percentage,
    compliant: employeesWithValidTraining,
    total: totalEmployees,
    percentage,
  }
}

/**
 * Calculate medical examination compliance score
 * Score = employees with valid medical exam / total employees
 */
async function calculateMedicalScore(
  supabase: any,
  organizationId: string,
  todayStr: string
): Promise<Omit<CategoryScore, 'weight' | 'weightedScore'>> {
  // Get total employees
  const { count: totalEmployees } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('role', 'angajat')
    .eq('is_active', true)

  if (!totalEmployees || totalEmployees === 0) {
    return {
      score: 100,
      compliant: 0,
      total: 0,
      percentage: 100,
    }
  }

  // Get valid medical examinations (expiry_date >= today and result = 'apt')
  const { data: validExams } = await supabase
    .from('medical_records')
    .select('employee_name')
    .eq('organization_id', organizationId)
    .eq('result', 'apt')
    .gte('expiry_date', todayStr)

  // Count unique employees with valid exams
  const employeesWithValidExams = new Set(
    validExams?.map((e: any) => e.employee_name) || []
  ).size

  const percentage = Math.round((employeesWithValidExams / totalEmployees) * 100)

  return {
    score: percentage,
    compliant: employeesWithValidExams,
    total: totalEmployees,
    percentage,
  }
}

/**
 * Calculate equipment compliance score
 * Score = equipment items with valid inspection / total equipment
 */
async function calculateEquipmentScore(
  supabase: any,
  organizationId: string,
  todayStr: string
): Promise<Omit<CategoryScore, 'weight' | 'weightedScore'>> {
  // Get total equipment count
  const { count: totalEquipment } = await supabase
    .from('safety_equipment')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  if (!totalEquipment || totalEquipment === 0) {
    return {
      score: 100, // No equipment = 100% compliance
      compliant: 0,
      total: 0,
      percentage: 100,
    }
  }

  // Get compliant equipment (expiry_date >= today and is_compliant = true)
  const { count: compliantEquipment } = await supabase
    .from('safety_equipment')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('is_compliant', true)
    .gte('expiry_date', todayStr)

  const percentage = Math.round(((compliantEquipment || 0) / totalEquipment) * 100)

  return {
    score: percentage,
    compliant: compliantEquipment || 0,
    total: totalEquipment,
    percentage,
  }
}

/**
 * Calculate document compliance score
 * Score = valid documents / total mandatory documents
 */
async function calculateDocumentScore(
  supabase: any,
  organizationId: string,
  todayStr: string
): Promise<Omit<CategoryScore, 'weight' | 'weightedScore'>> {
  // Get total generated documents
  const { count: totalDocuments } = await supabase
    .from('generated_documents')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('is_locked', true) // Only count finalized documents

  if (!totalDocuments || totalDocuments === 0) {
    return {
      score: 0, // No documents = 0% compliance (documents are mandatory)
      compliant: 0,
      total: 1, // Assume at least 1 document is required
      percentage: 0,
    }
  }

  // Count valid documents (created within last 365 days)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const oneYearAgoStr = oneYearAgo.toISOString()

  const { count: validDocuments } = await supabase
    .from('generated_documents')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('is_locked', true)
    .gte('created_at', oneYearAgoStr)

  const percentage = Math.round(((validDocuments || 0) / totalDocuments) * 100)

  return {
    score: percentage,
    compliant: validDocuments || 0,
    total: totalDocuments,
    percentage,
  }
}

// ============================================================
// TREND CALCULATION
// ============================================================

/**
 * Calculate compliance trend vs last month
 */
async function calculateTrend(
  supabase: any,
  organizationId: string
): Promise<ComplianceTrend | null> {
  // Check if compliance_history table exists (future feature)
  // For now, return null (no historical data available)

  // TODO: Implement compliance_history table to track scores over time
  // Table structure: { org_id, calculated_at, overall_score, breakdown_json }

  return null
}

// ============================================================
// ACTION GENERATION
// ============================================================

/**
 * Generate top 5 priority actions based on compliance gaps
 */
async function generateTopActions(
  supabase: any,
  organizationId: string,
  todayStr: string,
  scores: {
    training: Omit<CategoryScore, 'weight' | 'weightedScore'>
    medical: Omit<CategoryScore, 'weight' | 'weightedScore'>
    equipment: Omit<CategoryScore, 'weight' | 'weightedScore'>
    documents: Omit<CategoryScore, 'weight' | 'weightedScore'>
  }
): Promise<ComplianceAction[]> {
  const actions: ComplianceAction[] = []

  // 1. Check for expired medical examinations
  const { data: expiredMedical } = await supabase
    .from('medical_records')
    .select('id, employee_name, expiry_date')
    .eq('organization_id', organizationId)
    .lt('expiry_date', todayStr)

  if (expiredMedical && expiredMedical.length > 0) {
    const avgDaysOverdue = expiredMedical.reduce((sum: number, exam: any) => {
      const expiry = new Date(exam.expiry_date)
      const days = Math.ceil((new Date().getTime() - expiry.getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0) / expiredMedical.length

    actions.push({
      priority: 'critical',
      category: 'medical',
      description: `${expiredMedical.length} angajați cu examene medicale expirate`,
      affectedCount: expiredMedical.length,
      daysOverdue: Math.round(avgDaysOverdue),
    })
  }

  // 2. Check for overdue trainings
  const { data: overdueTrainings } = await supabase
    .from('training_assignments')
    .select('id, worker_id, next_due_date')
    .eq('organization_id', organizationId)
    .eq('status', 'overdue')

  if (overdueTrainings && overdueTrainings.length > 0) {
    actions.push({
      priority: 'critical',
      category: 'training',
      description: `${overdueTrainings.length} instruiri depășite termen`,
      affectedCount: overdueTrainings.length,
    })
  }

  // 3. Check for non-compliant equipment
  const { data: nonCompliantEquipment } = await supabase
    .from('safety_equipment')
    .select('id, equipment_type, expiry_date')
    .eq('organization_id', organizationId)
    .or(`is_compliant.eq.false,expiry_date.lt.${todayStr}`)

  if (nonCompliantEquipment && nonCompliantEquipment.length > 0) {
    const expiredCount = nonCompliantEquipment.filter(
      (eq: any) => new Date(eq.expiry_date) < new Date()
    ).length

    actions.push({
      priority: expiredCount > 0 ? 'high' : 'medium',
      category: 'equipment',
      description: `${nonCompliantEquipment.length} echipamente neconforme sau expirate`,
      affectedCount: nonCompliantEquipment.length,
    })
  }

  // 4. Check for expiring medical exams (next 30 days)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  const thirtyDaysStr = thirtyDaysFromNow.toISOString().split('T')[0]

  const { data: expiringMedical } = await supabase
    .from('medical_records')
    .select('id, employee_name, expiry_date')
    .eq('organization_id', organizationId)
    .gte('expiry_date', todayStr)
    .lte('expiry_date', thirtyDaysStr)

  if (expiringMedical && expiringMedical.length > 0) {
    actions.push({
      priority: 'high',
      category: 'medical',
      description: `${expiringMedical.length} examene medicale expiră în 30 zile`,
      affectedCount: expiringMedical.length,
    })
  }

  // 5. Check for expiring equipment (next 30 days)
  const { data: expiringEquipment } = await supabase
    .from('safety_equipment')
    .select('id, equipment_type, expiry_date')
    .eq('organization_id', organizationId)
    .gte('expiry_date', todayStr)
    .lte('expiry_date', thirtyDaysStr)

  if (expiringEquipment && expiringEquipment.length > 0) {
    actions.push({
      priority: 'medium',
      category: 'equipment',
      description: `${expiringEquipment.length} echipamente expiră în 30 zile`,
      affectedCount: expiringEquipment.length,
    })
  }

  // 6. Check for missing trainings (employees without any completed training)
  const { count: totalEmployees } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('role', 'angajat')
    .eq('is_active', true)

  const employeesWithoutTraining = (totalEmployees || 0) - scores.training.compliant

  if (employeesWithoutTraining > 0) {
    actions.push({
      priority: 'high',
      category: 'training',
      description: `${employeesWithoutTraining} angajați fără instruire valabilă`,
      affectedCount: employeesWithoutTraining,
    })
  }

  // 7. Check for missing medical exams
  const employeesWithoutMedical = (totalEmployees || 0) - scores.medical.compliant

  if (employeesWithoutMedical > 0) {
    actions.push({
      priority: 'high',
      category: 'medical',
      description: `${employeesWithoutMedical} angajați fără examen medical valabil`,
      affectedCount: employeesWithoutMedical,
    })
  }

  // 8. Check for old documents (older than 1 year)
  if (scores.documents.score < 80) {
    const outdatedCount = scores.documents.total - scores.documents.compliant
    if (outdatedCount > 0) {
      actions.push({
        priority: 'medium',
        category: 'documents',
        description: `${outdatedCount} documente necesită actualizare (>1 an)`,
        affectedCount: outdatedCount,
      })
    }
  }

  // Sort by priority and affected count, return top 5
  const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 }

  return actions
    .sort((a, b) => {
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.affectedCount - a.affectedCount
    })
    .slice(0, 5)
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get compliance status label based on score
 */
export function getComplianceStatus(score: number): {
  label: string
  color: string
  bgColor: string
} {
  if (score >= 90) {
    return {
      label: 'Excelent',
      color: '#10B981',
      bgColor: '#064E3B',
    }
  } else if (score >= 75) {
    return {
      label: 'Bun',
      color: '#3B82F6',
      bgColor: '#1E3A5F',
    }
  } else if (score >= 60) {
    return {
      label: 'Acceptabil',
      color: '#F59E0B',
      bgColor: '#422006',
    }
  } else if (score >= 40) {
    return {
      label: 'Nesatisfăcător',
      color: '#EF4444',
      bgColor: '#450A0A',
    }
  } else {
    return {
      label: 'Critic',
      color: '#DC2626',
      bgColor: '#7F1D1D',
    }
  }
}

/**
 * Format trend change as readable string
 */
export function formatTrendChange(trend: ComplianceTrend | null): string {
  if (!trend) return 'N/A'

  const sign = trend.change >= 0 ? '+' : ''
  return `${sign}${trend.change.toFixed(1)} (${sign}${trend.changePercentage.toFixed(1)}%)`
}

/**
 * Get priority icon/color for action
 */
export function getActionPriorityConfig(priority: ComplianceAction['priority']): {
  icon: string
  color: string
  bgColor: string
} {
  switch (priority) {
    case 'critical':
      return {
        icon: '🔴',
        color: '#DC2626',
        bgColor: '#7F1D1D',
      }
    case 'high':
      return {
        icon: '🟠',
        color: '#F59E0B',
        bgColor: '#422006',
      }
    case 'medium':
      return {
        icon: '🟡',
        color: '#EAB308',
        bgColor: '#422006',
      }
    case 'low':
      return {
        icon: '🟢',
        color: '#10B981',
        bgColor: '#064E3B',
      }
  }
}
