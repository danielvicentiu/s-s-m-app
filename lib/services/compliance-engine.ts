// lib/services/compliance-engine.ts
// S-S-M.RO — COMPLIANCE ENGINE
// Comprehensive compliance scoring and gap analysis
// Created: 2026-02-14

import { createSupabaseServer } from '@/lib/supabase/server'
import { getDaysUntilExpiry } from '@/lib/types'

// ========== TYPES ==========

export type ComplianceSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface ComplianceGap {
  category: 'training' | 'medical' | 'equipment' | 'documents' | 'incidents' | 'risk_assessment'
  description: string
  severity: ComplianceSeverity
  action_needed: string
  affected_count?: number
  department?: string
}

export interface ComplianceNextAction {
  priority: number
  action: string
  category: string
  due_date?: string
  affected_count?: number
}

export interface CategoryScore {
  score: number
  max_score: number
  percentage: number
  total_items: number
  compliant_items: number
  expiring_items: number
  expired_items: number
}

export interface DepartmentScore {
  department: string
  overall_score: number
  employee_count: number
  issues: {
    expired_medical: number
    missing_trainings: number
    expired_equipment: number
  }
}

export interface ComplianceTrend {
  date: string
  overall_score: number
  training_score: number
  medical_score: number
  equipment_score: number
}

export interface ComplianceReport {
  organization_id: string
  organization_name: string
  generated_at: string
  overall_score: number // 0-100
  category_scores: {
    training: CategoryScore
    medical: CategoryScore
    equipment: CategoryScore
    documents: CategoryScore
    incidents: CategoryScore
    risk_assessments: CategoryScore
  }
  per_department_scores: DepartmentScore[]
  trend_30d: ComplianceTrend[]
  trend_90d: ComplianceTrend[]
  gaps: ComplianceGap[]
  next_actions: ComplianceNextAction[]
}

// ========== CACHE ==========

interface CacheEntry {
  data: ComplianceReport
  timestamp: number
}

const complianceCache = new Map<string, CacheEntry>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

function getCachedReport(orgId: string): ComplianceReport | null {
  const cached = complianceCache.get(orgId)
  if (!cached) return null

  const now = Date.now()
  if (now - cached.timestamp > CACHE_TTL) {
    complianceCache.delete(orgId)
    return null
  }

  return cached.data
}

function setCachedReport(orgId: string, report: ComplianceReport): void {
  complianceCache.set(orgId, {
    data: report,
    timestamp: Date.now()
  })
}

// ========== SCORING LOGIC ==========

function calculateCategoryScore(
  compliant: number,
  expiring: number,
  expired: number
): CategoryScore {
  const total = compliant + expiring + expired
  if (total === 0) {
    return {
      score: 100,
      max_score: 100,
      percentage: 100,
      total_items: 0,
      compliant_items: 0,
      expiring_items: 0,
      expired_items: 0
    }
  }

  // Scoring: compliant = 100%, expiring = 50%, expired = 0%
  const score = (compliant * 100 + expiring * 50) / total

  return {
    score: Math.round(score),
    max_score: 100,
    percentage: Math.round(score),
    total_items: total,
    compliant_items: compliant,
    expiring_items: expiring,
    expired_items: expired
  }
}

function determineSeverity(
  expired: number,
  expiring: number,
  total: number
): ComplianceSeverity {
  if (total === 0) return 'low'

  const expiredPercentage = (expired / total) * 100
  const expiringPercentage = (expiring / total) * 100

  if (expiredPercentage > 25) return 'critical'
  if (expiredPercentage > 10 || expiringPercentage > 40) return 'high'
  if (expiredPercentage > 0 || expiringPercentage > 20) return 'medium'
  return 'low'
}

// ========== MAIN FUNCTION ==========

export async function getComplianceReport(
  organizationId: string
): Promise<ComplianceReport> {
  // Check cache first
  const cached = getCachedReport(organizationId)
  if (cached) {
    return cached
  }

  const supabase = await createSupabaseServer()

  // Get organization info
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', organizationId)
    .single()

  if (!org) {
    throw new Error('Organization not found')
  }

  // Parallel queries for all data
  const [
    employeesData,
    medicalData,
    trainingsData,
    equipmentData,
    documentsData,
    incidentsData,
    riskAssessmentsData
  ] = await Promise.all([
    fetchEmployeesData(supabase, organizationId),
    fetchMedicalData(supabase, organizationId),
    fetchTrainingsData(supabase, organizationId),
    fetchEquipmentData(supabase, organizationId),
    fetchDocumentsData(supabase, organizationId),
    fetchIncidentsData(supabase, organizationId),
    fetchRiskAssessmentsData(supabase, organizationId)
  ])

  // Calculate category scores
  const medicalScore = calculateMedicalScore(medicalData)
  const trainingScore = calculateTrainingScore(trainingsData, employeesData.total)
  const equipmentScore = calculateEquipmentScore(equipmentData)
  const documentsScore = calculateDocumentsScore(documentsData)
  const incidentsScore = calculateIncidentsScore(incidentsData)
  const riskAssessmentsScore = calculateRiskAssessmentsScore(riskAssessmentsData)

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    medicalScore.percentage * 0.25 +
    trainingScore.percentage * 0.25 +
    equipmentScore.percentage * 0.20 +
    documentsScore.percentage * 0.10 +
    incidentsScore.percentage * 0.10 +
    riskAssessmentsScore.percentage * 0.10
  )

  // Identify gaps
  const gaps = identifyGaps(
    medicalData,
    trainingsData,
    equipmentData,
    documentsData,
    incidentsData,
    riskAssessmentsData,
    employeesData
  )

  // Generate next actions
  const nextActions = generateNextActions(gaps, medicalData, trainingsData, equipmentData)

  // Calculate per-department scores
  const perDepartmentScores = calculateDepartmentScores(
    employeesData,
    medicalData,
    trainingsData
  )

  // Calculate trends (simplified - would need historical data)
  const trend30d = await calculateTrends(supabase, organizationId, 30)
  const trend90d = await calculateTrends(supabase, organizationId, 90)

  const report: ComplianceReport = {
    organization_id: organizationId,
    organization_name: org.name,
    generated_at: new Date().toISOString(),
    overall_score: overallScore,
    category_scores: {
      training: trainingScore,
      medical: medicalScore,
      equipment: equipmentScore,
      documents: documentsScore,
      incidents: incidentsScore,
      risk_assessments: riskAssessmentsScore
    },
    per_department_scores: perDepartmentScores,
    trend_30d: trend30d,
    trend_90d: trend90d,
    gaps: gaps,
    next_actions: nextActions
  }

  // Cache the report
  setCachedReport(organizationId, report)

  return report
}

// ========== DATA FETCHERS ==========

async function fetchEmployeesData(supabase: any, orgId: string) {
  const { data: employees } = await supabase
    .from('employees')
    .select('id, full_name, department, position')
    .eq('organization_id', orgId)
    .is('deleted_at', null)

  const byDepartment = new Map<string, any[]>()

  employees?.forEach((emp: any) => {
    const dept = emp.department || 'Nedefinit'
    if (!byDepartment.has(dept)) {
      byDepartment.set(dept, [])
    }
    byDepartment.get(dept)?.push(emp)
  })

  return {
    total: employees?.length || 0,
    byDepartment,
    employees: employees || []
  }
}

async function fetchMedicalData(supabase: any, orgId: string) {
  const { data: medicalRecords } = await supabase
    .from('medical_records')
    .select('*')
    .eq('organization_id', orgId)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let compliant = 0
  let expiring = 0
  let expired = 0

  medicalRecords?.forEach((record: any) => {
    const days = getDaysUntilExpiry(record.expiry_date)
    if (days < 0) {
      expired++
    } else if (days <= 30) {
      expiring++
    } else {
      compliant++
    }
  })

  return { compliant, expiring, expired, total: medicalRecords?.length || 0, records: medicalRecords || [] }
}

async function fetchTrainingsData(supabase: any, orgId: string) {
  // Get all training assignments for this org
  const { data: assignments } = await supabase
    .from('training_assignments')
    .select(`
      id,
      employee_id,
      training_module_id,
      status,
      assigned_at,
      training_sessions (
        id,
        status,
        completed_at,
        certificate_issued_at
      )
    `)
    .eq('organization_id', orgId)

  let completed = 0
  let inProgress = 0
  let notStarted = 0

  assignments?.forEach((assignment: any) => {
    const sessions = assignment.training_sessions || []
    const latestSession = sessions[sessions.length - 1]

    if (latestSession?.status === 'completed') {
      completed++
    } else if (latestSession?.status === 'in_progress') {
      inProgress++
    } else {
      notStarted++
    }
  })

  return {
    completed,
    inProgress,
    notStarted,
    total: assignments?.length || 0,
    assignments: assignments || []
  }
}

async function fetchEquipmentData(supabase: any, orgId: string) {
  const { data: equipment } = await supabase
    .from('safety_equipment')
    .select('*')
    .eq('organization_id', orgId)

  let compliant = 0
  let expiring = 0
  let expired = 0

  equipment?.forEach((item: any) => {
    const days = getDaysUntilExpiry(item.expiry_date)
    if (days < 0) {
      expired++
    } else if (days <= 30) {
      expiring++
    } else if (item.is_compliant) {
      compliant++
    } else {
      expiring++
    }
  })

  return { compliant, expiring, expired, total: equipment?.length || 0, items: equipment || [] }
}

async function fetchDocumentsData(supabase: any, orgId: string) {
  const { data: documents } = await supabase
    .from('generated_documents')
    .select('*')
    .eq('organization_id', orgId)

  // Documents are considered compliant if they exist and are locked
  const locked = documents?.filter((d: any) => d.is_locked).length || 0
  const unlocked = documents?.filter((d: any) => !d.is_locked).length || 0

  return {
    compliant: locked,
    expiring: 0,
    expired: 0,
    total: documents?.length || 0,
    unlocked
  }
}

async function fetchIncidentsData(supabase: any, orgId: string) {
  const { data: incidents } = await supabase
    .from('incidents')
    .select('*')
    .eq('organization_id', orgId)
    .is('deleted_at', null)

  const closed = incidents?.filter((i: any) => i.status === 'closed').length || 0
  const open = incidents?.filter((i: any) => i.status !== 'closed' && i.status !== 'archived').length || 0
  const critical = incidents?.filter((i: any) =>
    i.severity === 'critical' && i.status !== 'closed'
  ).length || 0

  return {
    total: incidents?.length || 0,
    closed,
    open,
    critical,
    incidents: incidents || []
  }
}

async function fetchRiskAssessmentsData(supabase: any, orgId: string) {
  const { data: assessments } = await supabase
    .from('risk_assessments')
    .select(`
      *,
      risk_assessment_hazards (
        id,
        risk_level,
        residual_risk_level
      )
    `)
    .eq('organization_id', orgId)
    .is('deleted_at', null)

  const approved = assessments?.filter((a: any) => a.status === 'approved').length || 0
  const draft = assessments?.filter((a: any) => a.status === 'draft').length || 0

  // Calculate high-risk hazards
  let highRiskHazards = 0
  assessments?.forEach((assessment: any) => {
    assessment.risk_assessment_hazards?.forEach((hazard: any) => {
      if ((hazard.residual_risk_level || hazard.risk_level) >= 15) {
        highRiskHazards++
      }
    })
  })

  return {
    total: assessments?.length || 0,
    approved,
    draft,
    highRiskHazards,
    assessments: assessments || []
  }
}

// ========== SCORE CALCULATORS ==========

function calculateMedicalScore(data: any): CategoryScore {
  return calculateCategoryScore(data.compliant, data.expiring, data.expired)
}

function calculateTrainingScore(data: any, totalEmployees: number): CategoryScore {
  // Training score considers completion rate
  const total = data.total || totalEmployees
  const compliant = data.completed
  const expiring = data.inProgress
  const expired = data.notStarted

  return calculateCategoryScore(compliant, expiring, expired)
}

function calculateEquipmentScore(data: any): CategoryScore {
  return calculateCategoryScore(data.compliant, data.expiring, data.expired)
}

function calculateDocumentsScore(data: any): CategoryScore {
  // For documents, locked = compliant, unlocked = expiring
  return calculateCategoryScore(data.compliant, data.unlocked, 0)
}

function calculateIncidentsScore(data: any): CategoryScore {
  // Incidents: closed = compliant, open non-critical = expiring, critical open = expired
  return calculateCategoryScore(data.closed, data.open - data.critical, data.critical)
}

function calculateRiskAssessmentsScore(data: any): CategoryScore {
  // Risk assessments: approved with low risk = compliant, draft = expiring, high risk = expired
  const compliant = data.approved
  const expiring = data.draft
  const expired = data.highRiskHazards > 0 ? 1 : 0

  return calculateCategoryScore(compliant, expiring, expired)
}

// ========== GAP IDENTIFICATION ==========

function identifyGaps(
  medical: any,
  trainings: any,
  equipment: any,
  documents: any,
  incidents: any,
  riskAssessments: any,
  employees: any
): ComplianceGap[] {
  const gaps: ComplianceGap[] = []

  // Medical gaps
  if (medical.expired > 0) {
    gaps.push({
      category: 'medical',
      description: `${medical.expired} fișe medicale expirate`,
      severity: medical.expired > 5 ? 'critical' : 'high',
      action_needed: 'Programați controale medicale de urgență',
      affected_count: medical.expired
    })
  }

  if (medical.expiring > 0) {
    gaps.push({
      category: 'medical',
      description: `${medical.expiring} fișe medicale expiră în 30 de zile`,
      severity: 'medium',
      action_needed: 'Programați controale medicale preventiv',
      affected_count: medical.expiring
    })
  }

  // Training gaps
  if (trainings.notStarted > employees.total * 0.2) {
    gaps.push({
      category: 'training',
      description: `${trainings.notStarted} instruiri nealocate (${Math.round(trainings.notStarted / employees.total * 100)}% din angajați)`,
      severity: 'high',
      action_needed: 'Alocați și programați instruiri obligatorii',
      affected_count: trainings.notStarted
    })
  }

  if (trainings.inProgress > 0) {
    gaps.push({
      category: 'training',
      description: `${trainings.inProgress} instruiri în curs`,
      severity: 'low',
      action_needed: 'Monitorizați finalizarea instruirilor',
      affected_count: trainings.inProgress
    })
  }

  // Equipment gaps
  if (equipment.expired > 0) {
    gaps.push({
      category: 'equipment',
      description: `${equipment.expired} echipamente expirate sau neconforme`,
      severity: 'critical',
      action_needed: 'Înlocuiți sau reverificați echipamentele de urgență',
      affected_count: equipment.expired
    })
  }

  if (equipment.expiring > 0) {
    gaps.push({
      category: 'equipment',
      description: `${equipment.expiring} echipamente expiră în 30 de zile`,
      severity: 'medium',
      action_needed: 'Programați inspecții preventive',
      affected_count: equipment.expiring
    })
  }

  // Document gaps
  if (documents.unlocked > 0) {
    gaps.push({
      category: 'documents',
      description: `${documents.unlocked} documente generate dar neblocate`,
      severity: 'low',
      action_needed: 'Revizuiți și blocați documentele finale',
      affected_count: documents.unlocked
    })
  }

  // Incident gaps
  if (incidents.critical > 0) {
    gaps.push({
      category: 'incidents',
      description: `${incidents.critical} incidente critice deschise`,
      severity: 'critical',
      action_needed: 'Investigați și rezolvați incidentele critice imediat',
      affected_count: incidents.critical
    })
  }

  if (incidents.open > 0) {
    gaps.push({
      category: 'incidents',
      description: `${incidents.open} incidente deschise`,
      severity: 'medium',
      action_needed: 'Finalizați investigațiile și acțiunile corective',
      affected_count: incidents.open
    })
  }

  // Risk assessment gaps
  if (riskAssessments.highRiskHazards > 0) {
    gaps.push({
      category: 'risk_assessment',
      description: `${riskAssessments.highRiskHazards} pericole cu risc ridicat identificate`,
      severity: 'high',
      action_needed: 'Implementați măsuri de control suplimentare',
      affected_count: riskAssessments.highRiskHazards
    })
  }

  if (riskAssessments.draft > 0) {
    gaps.push({
      category: 'risk_assessment',
      description: `${riskAssessments.draft} evaluări de risc în draft`,
      severity: 'low',
      action_needed: 'Finalizați și aprobați evaluările de risc',
      affected_count: riskAssessments.draft
    })
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  return gaps
}

// ========== NEXT ACTIONS ==========

function generateNextActions(
  gaps: ComplianceGap[],
  medical: any,
  trainings: any,
  equipment: any
): ComplianceNextAction[] {
  const actions: ComplianceNextAction[] = []
  let priority = 1

  // Add actions from critical gaps
  gaps
    .filter(g => g.severity === 'critical')
    .forEach(gap => {
      actions.push({
        priority: priority++,
        action: gap.action_needed,
        category: gap.category,
        affected_count: gap.affected_count
      })
    })

  // Add specific actions with due dates
  if (medical.expiring > 0) {
    actions.push({
      priority: priority++,
      action: 'Programați controale medicale pentru fișele care expiră',
      category: 'medical',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      affected_count: medical.expiring
    })
  }

  if (equipment.expiring > 0) {
    actions.push({
      priority: priority++,
      action: 'Programați inspecții echipamente PSI',
      category: 'equipment',
      due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      affected_count: equipment.expiring
    })
  }

  if (trainings.notStarted > 0) {
    actions.push({
      priority: priority++,
      action: 'Alocați instruiri pentru angajații noi',
      category: 'training',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      affected_count: trainings.notStarted
    })
  }

  // Add medium priority gaps
  gaps
    .filter(g => g.severity === 'medium' || g.severity === 'high')
    .forEach(gap => {
      if (!actions.find(a => a.action === gap.action_needed)) {
        actions.push({
          priority: priority++,
          action: gap.action_needed,
          category: gap.category,
          affected_count: gap.affected_count
        })
      }
    })

  return actions.slice(0, 10) // Top 10 actions
}

// ========== DEPARTMENT SCORES ==========

function calculateDepartmentScores(
  employees: any,
  medical: any,
  trainings: any
): DepartmentScore[] {
  const departmentScores: DepartmentScore[] = []

  employees.byDepartment.forEach((deptEmployees: any[], department: string) => {
    const employeeIds = deptEmployees.map(e => e.id)

    // Count issues for this department
    const expiredMedical = medical.records.filter(
      (r: any) => employeeIds.includes(r.employee_id) && getDaysUntilExpiry(r.expiry_date) < 0
    ).length

    const missingTrainings = trainings.assignments.filter(
      (a: any) => employeeIds.includes(a.employee_id) &&
        (!a.training_sessions || a.training_sessions.length === 0)
    ).length

    // Calculate department score
    const totalIssues = expiredMedical + missingTrainings
    const maxPossibleIssues = deptEmployees.length * 2
    const score = maxPossibleIssues > 0
      ? Math.round((1 - totalIssues / maxPossibleIssues) * 100)
      : 100

    departmentScores.push({
      department,
      overall_score: score,
      employee_count: deptEmployees.length,
      issues: {
        expired_medical: expiredMedical,
        missing_trainings: missingTrainings,
        expired_equipment: 0 // Equipment not tracked per department in current schema
      }
    })
  })

  // Sort by score (lowest first)
  departmentScores.sort((a, b) => a.overall_score - b.overall_score)

  return departmentScores
}

// ========== TRENDS ==========

async function calculateTrends(
  supabase: any,
  orgId: string,
  days: number
): Promise<ComplianceTrend[]> {
  // Note: This is a simplified implementation
  // In production, you would store historical compliance scores in a separate table
  // For now, we'll return current score for all dates

  const trends: ComplianceTrend[] = []
  const today = new Date()

  // Generate daily entries (simplified - all same score for now)
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    trends.push({
      date: date.toISOString().split('T')[0],
      overall_score: 0, // Would need historical data
      training_score: 0,
      medical_score: 0,
      equipment_score: 0
    })
  }

  return trends
}

// ========== CACHE MANAGEMENT ==========

export function clearComplianceCache(organizationId?: string): void {
  if (organizationId) {
    complianceCache.delete(organizationId)
  } else {
    complianceCache.clear()
  }
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: complianceCache.size,
    keys: Array.from(complianceCache.keys())
  }
}
