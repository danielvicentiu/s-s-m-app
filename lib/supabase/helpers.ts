// lib/supabase/helpers.ts
// Funcții reutilizabile pentru Supabase queries
// Toate funcțiile respectă RLS și returnează tipuri strict definite
// Data: 13 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import type {
  MedicalExamination,
  SafetyEquipment,
  Organization
} from '@/lib/types'

// ============================================================
// TYPES
// ============================================================

export interface Employee {
  id: string
  user_id: string
  organization_id: string
  role: 'consultant' | 'firma_admin' | 'angajat'
  is_active: boolean
  joined_at: string
  profiles?: {
    id: string
    full_name: string
    phone: string | null
    avatar_url: string | null
  }
}

export interface ExpiringTraining {
  id: string
  worker_id: string
  worker_name: string
  module_id: string
  module_name: string
  due_date: string
  days_until_expiry: number
  status: string
}

export interface ExpiringMedical {
  id: string
  employee_name: string
  job_title: string | null
  examination_type: string
  expiry_date: string
  days_until_expiry: number
  result: string
  clinic_name: string | null
}

export interface EquipmentDueInspection {
  id: string
  equipment_type: string
  description: string | null
  location: string | null
  next_inspection_date: string
  days_until_inspection: number
  last_inspection_date: string | null
  is_compliant: boolean
}

export interface ComplianceScore {
  organization_id: string
  overall_score: number
  medical_compliance: number
  equipment_compliance: number
  training_compliance: number
  total_items: number
  compliant_items: number
  expiring_items: number
  expired_items: number
  details: {
    medical: {
      total: number
      valid: number
      expiring: number
      expired: number
    }
    equipment: {
      total: number
      compliant: number
      due_soon: number
      overdue: number
    }
    training: {
      total: number
      completed: number
      in_progress: number
      overdue: number
    }
  }
}

export interface AuditLogEntry {
  id?: string
  organization_id: string | null
  user_id: string | null
  action: string
  entity_type: 'reges_connection' | 'reges_outbox' | 'reges_receipt' | 'reges_result' | 'employee' | 'contract' | 'organization' | 'user' | 'medical' | 'equipment' | 'training'
  entity_id: string | null
  metadata?: Record<string, any>
  created_at?: string
}

// ============================================================
// EMPLOYEE HELPERS
// ============================================================

/**
 * Obține toți angajații (membrii) unei organizații
 * Include profile info (nume, telefon, avatar)
 * @param organizationId - ID organizație
 * @returns Lista de angajați cu profile
 */
export async function getOrganizationEmployees(
  organizationId: string
): Promise<{ data: Employee[] | null; error: string | null }> {
  try {
    const supabase = await createSupabaseServer()

    const { data, error } = await supabase
      .from('memberships')
      .select(`
        id,
        user_id,
        organization_id,
        role,
        is_active,
        joined_at,
        profiles!inner(
          id,
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('joined_at', { ascending: false })

    if (error) {
      console.error('[getOrganizationEmployees] Error:', error.message)
      return { data: null, error: error.message }
    }

    // Transform data to match Employee type (profiles comes as single object, not array)
    const employees: Employee[] = (data || []).map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      organization_id: item.organization_id,
      role: item.role,
      is_active: item.is_active,
      joined_at: item.joined_at,
      profiles: item.profiles
    }))

    return { data: employees, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută'
    console.error('[getOrganizationEmployees] Exception:', message)
    return { data: null, error: message }
  }
}

// ============================================================
// TRAINING HELPERS
// ============================================================

/**
 * Obține instruirile care expiră în următoarele X zile
 * @param organizationId - ID organizație
 * @param days - Număr zile până la expirare (default: 30)
 * @returns Lista de instruiri care expiră
 */
export async function getExpiringTrainings(
  organizationId: string,
  days: number = 30
): Promise<{ data: ExpiringTraining[] | null; error: string | null }> {
  try {
    const supabase = await createSupabaseServer()

    // Calculăm data limită
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const futureDate = new Date(today)
    futureDate.setDate(futureDate.getDate() + days)

    const { data: assignments, error } = await supabase
      .from('training_assignments')
      .select(`
        id,
        worker_id,
        module_id,
        due_date,
        status,
        profiles!training_assignments_worker_id_fkey(full_name),
        training_modules!training_assignments_module_id_fkey(name, code)
      `)
      .eq('organization_id', organizationId)
      .in('status', ['assigned', 'in_progress'])
      .lte('due_date', futureDate.toISOString())
      .gte('due_date', today.toISOString())
      .order('due_date', { ascending: true })

    if (error) {
      console.error('[getExpiringTrainings] Error:', error.message)
      return { data: null, error: error.message }
    }

    // Transform data
    const result: ExpiringTraining[] = (assignments || []).map((a: any) => {
      const daysUntil = Math.ceil(
        (new Date(a.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      return {
        id: a.id,
        worker_id: a.worker_id,
        worker_name: a.profiles?.full_name || 'Necunoscut',
        module_id: a.module_id,
        module_name: a.training_modules?.name || a.training_modules?.code || 'Modul necunoscut',
        due_date: a.due_date,
        days_until_expiry: daysUntil,
        status: a.status
      }
    })

    return { data: result, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută'
    console.error('[getExpiringTrainings] Exception:', message)
    return { data: null, error: message }
  }
}

// ============================================================
// MEDICAL HELPERS
// ============================================================

/**
 * Obține controalele medicale care expiră în următoarele X zile
 * @param organizationId - ID organizație
 * @param days - Număr zile până la expirare (default: 30)
 * @returns Lista de controale medicale care expiră
 */
export async function getExpiringMedical(
  organizationId: string,
  days: number = 30
): Promise<{ data: ExpiringMedical[] | null; error: string | null }> {
  try {
    const supabase = await createSupabaseServer()

    // Calculăm data limită
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const futureDate = new Date(today)
    futureDate.setDate(futureDate.getDate() + days)

    const { data: examinations, error } = await supabase
      .from('medical_examinations')
      .select('*')
      .eq('organization_id', organizationId)
      .lte('expiry_date', futureDate.toISOString())
      .gte('expiry_date', today.toISOString())
      .order('expiry_date', { ascending: true })

    if (error) {
      console.error('[getExpiringMedical] Error:', error.message)
      return { data: null, error: error.message }
    }

    // Transform data
    const result: ExpiringMedical[] = (examinations || []).map((exam: MedicalExamination) => {
      const daysUntil = Math.ceil(
        (new Date(exam.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      return {
        id: exam.id,
        employee_name: exam.employee_name,
        job_title: exam.job_title,
        examination_type: exam.examination_type,
        expiry_date: exam.expiry_date,
        days_until_expiry: daysUntil,
        result: exam.result,
        clinic_name: exam.clinic_name
      }
    })

    return { data: result, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută'
    console.error('[getExpiringMedical] Exception:', message)
    return { data: null, error: message }
  }
}

// ============================================================
// EQUIPMENT HELPERS
// ============================================================

/**
 * Obține echipamentele care au nevoie de inspecție în următoarele X zile
 * @param organizationId - ID organizație
 * @param days - Număr zile până la inspecție (default: 30)
 * @returns Lista de echipamente care necesită inspecție
 */
export async function getEquipmentDueInspection(
  organizationId: string,
  days: number = 30
): Promise<{ data: EquipmentDueInspection[] | null; error: string | null }> {
  try {
    const supabase = await createSupabaseServer()

    // Calculăm data limită
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const futureDate = new Date(today)
    futureDate.setDate(futureDate.getDate() + days)

    // Căutăm echipamente cu next_inspection_date sau expiry_date în intervalul specificat
    const { data: equipment, error } = await supabase
      .from('safety_equipment')
      .select('*')
      .eq('organization_id', organizationId)
      .or(`next_inspection_date.lte.${futureDate.toISOString()},expiry_date.lte.${futureDate.toISOString()}`)
      .or(`next_inspection_date.gte.${today.toISOString()},expiry_date.gte.${today.toISOString()}`)
      .order('next_inspection_date', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('[getEquipmentDueInspection] Error:', error.message)
      return { data: null, error: error.message }
    }

    // Transform data
    const result: EquipmentDueInspection[] = (equipment || []).map((eq: SafetyEquipment) => {
      // Folosim next_inspection_date dacă există, altfel expiry_date
      const inspectionDate = eq.next_inspection_date || eq.expiry_date
      const daysUntil = Math.ceil(
        (new Date(inspectionDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      return {
        id: eq.id,
        equipment_type: eq.equipment_type,
        description: eq.description,
        location: eq.location,
        next_inspection_date: inspectionDate,
        days_until_inspection: daysUntil,
        last_inspection_date: eq.last_inspection_date,
        is_compliant: eq.is_compliant
      }
    })

    // Filtrăm doar cele în intervalul corect (OR query poate aduce false positives)
    const filtered = result.filter(r => r.days_until_inspection >= 0 && r.days_until_inspection <= days)

    return { data: filtered, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută'
    console.error('[getEquipmentDueInspection] Exception:', message)
    return { data: null, error: message }
  }
}

// ============================================================
// COMPLIANCE SCORE HELPERS
// ============================================================

/**
 * Calculează scorul de conformitate pentru o organizație
 * Include: medical, equipment, training
 * @param organizationId - ID organizație
 * @returns Scor de conformitate detaliat
 */
export async function getComplianceScore(
  organizationId: string
): Promise<{ data: ComplianceScore | null; error: string | null }> {
  try {
    const supabase = await createSupabaseServer()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 1. Medical compliance
    const { data: medical, error: medError } = await supabase
      .from('medical_examinations')
      .select('id, expiry_date')
      .eq('organization_id', organizationId)

    if (medError) {
      console.error('[getComplianceScore] Medical error:', medError.message)
      return { data: null, error: medError.message }
    }

    const medicalStats = {
      total: medical?.length || 0,
      valid: 0,
      expiring: 0,
      expired: 0
    }

    medical?.forEach(m => {
      const daysUntil = Math.ceil(
        (new Date(m.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysUntil < 0) medicalStats.expired++
      else if (daysUntil <= 30) medicalStats.expiring++
      else medicalStats.valid++
    })

    // 2. Equipment compliance
    const { data: equipment, error: eqError } = await supabase
      .from('safety_equipment')
      .select('id, expiry_date, next_inspection_date, is_compliant')
      .eq('organization_id', organizationId)

    if (eqError) {
      console.error('[getComplianceScore] Equipment error:', eqError.message)
      return { data: null, error: eqError.message }
    }

    const equipmentStats = {
      total: equipment?.length || 0,
      compliant: 0,
      due_soon: 0,
      overdue: 0
    }

    equipment?.forEach(eq => {
      const inspectionDate = eq.next_inspection_date || eq.expiry_date
      const daysUntil = Math.ceil(
        (new Date(inspectionDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysUntil < 0) equipmentStats.overdue++
      else if (daysUntil <= 30) equipmentStats.due_soon++
      else if (eq.is_compliant) equipmentStats.compliant++
    })

    // 3. Training compliance
    const { data: trainings, error: trainError } = await supabase
      .from('training_assignments')
      .select('id, status')
      .eq('organization_id', organizationId)

    if (trainError) {
      console.error('[getComplianceScore] Training error:', trainError.message)
      return { data: null, error: trainError.message }
    }

    const trainingStats = {
      total: trainings?.length || 0,
      completed: 0,
      in_progress: 0,
      overdue: 0
    }

    trainings?.forEach(t => {
      if (t.status === 'completed') trainingStats.completed++
      else if (t.status === 'in_progress') trainingStats.in_progress++
      else if (t.status === 'overdue') trainingStats.overdue++
    })

    // Calculate overall scores
    const totalItems = medicalStats.total + equipmentStats.total + trainingStats.total
    const compliantItems = medicalStats.valid + equipmentStats.compliant + trainingStats.completed
    const expiringItems = medicalStats.expiring + equipmentStats.due_soon + trainingStats.in_progress
    const expiredItems = medicalStats.expired + equipmentStats.overdue + trainingStats.overdue

    const overallScore = totalItems > 0
      ? Math.round((compliantItems / totalItems) * 100)
      : 100

    const medicalCompliance = medicalStats.total > 0
      ? Math.round((medicalStats.valid / medicalStats.total) * 100)
      : 100

    const equipmentCompliance = equipmentStats.total > 0
      ? Math.round((equipmentStats.compliant / equipmentStats.total) * 100)
      : 100

    const trainingCompliance = trainingStats.total > 0
      ? Math.round((trainingStats.completed / trainingStats.total) * 100)
      : 100

    const result: ComplianceScore = {
      organization_id: organizationId,
      overall_score: overallScore,
      medical_compliance: medicalCompliance,
      equipment_compliance: equipmentCompliance,
      training_compliance: trainingCompliance,
      total_items: totalItems,
      compliant_items: compliantItems,
      expiring_items: expiringItems,
      expired_items: expiredItems,
      details: {
        medical: medicalStats,
        equipment: equipmentStats,
        training: trainingStats
      }
    }

    return { data: result, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută'
    console.error('[getComplianceScore] Exception:', message)
    return { data: null, error: message }
  }
}

// ============================================================
// AUDIT LOG HELPERS
// ============================================================

/**
 * Înregistrează un eveniment în audit log
 * @param entry - Date eveniment audit
 * @returns ID-ul înregistrării create sau null în caz de eroare
 */
export async function logAuditEvent(
  entry: AuditLogEntry
): Promise<{ data: string | null; error: string | null }> {
  try {
    const supabase = await createSupabaseServer()

    const { data, error } = await supabase
      .from('audit_log')
      .insert({
        organization_id: entry.organization_id,
        user_id: entry.user_id,
        action: entry.action,
        entity_type: entry.entity_type,
        entity_id: entry.entity_id,
        metadata: entry.metadata || {}
      })
      .select('id')
      .single()

    if (error) {
      console.error('[logAuditEvent] Error:', error.message)
      return { data: null, error: error.message }
    }

    return { data: data.id, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută'
    console.error('[logAuditEvent] Exception:', message)
    return { data: null, error: message }
  }
}

/**
 * Obține audit log pentru o organizație
 * @param organizationId - ID organizație
 * @param limit - Număr maxim de înregistrări (default: 100)
 * @returns Lista de evenimente din audit log
 */
export async function getAuditLog(
  organizationId: string,
  limit: number = 100
): Promise<{ data: AuditLogEntry[] | null; error: string | null }> {
  try {
    const supabase = await createSupabaseServer()

    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[getAuditLog] Error:', error.message)
      return { data: null, error: error.message }
    }

    return { data: data as AuditLogEntry[], error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută'
    console.error('[getAuditLog] Exception:', message)
    return { data: null, error: message }
  }
}
