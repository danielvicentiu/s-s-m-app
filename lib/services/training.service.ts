// ============================================================
// S-S-M.RO — Training Service
// File: lib/services/training.service.ts
// Centralized service for training operations with Supabase
// ============================================================

import { createSupabaseServer } from '@/lib/supabase/server'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import type {
  TrainingAssignment,
  TrainingSession,
  TrainingModule,
  TrainingDashboardRow,
  TrainingStats,
  AssignTrainingPayload,
  RecordSessionPayload,
  AssignmentStatus,
} from '@/lib/training-types'

// ============================================================
// SERVICE CLASS
// ============================================================

export class TrainingService {
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
  }

  // ──────────────────────────────────────────────────────────
  // STATIC FACTORY METHODS
  // ──────────────────────────────────────────────────────────

  /** Create service instance for server-side use (SSR, API routes) */
  static async forServer() {
    const supabase = await createSupabaseServer()
    return new TrainingService(supabase)
  }

  /** Create service instance for client-side use (browser) */
  static forClient() {
    const supabase = createSupabaseBrowser()
    return new TrainingService(supabase)
  }

  // ──────────────────────────────────────────────────────────
  // MODULE OPERATIONS
  // ──────────────────────────────────────────────────────────

  /**
   * Get all active training modules
   * @returns Array of active training modules
   */
  async getAll(): Promise<TrainingModule[]> {
    const { data, error } = await this.supabase
      .from('training_modules')
      .select('*')
      .eq('is_active', true)
      .order('code')

    if (error) {
      console.error('Error fetching training modules:', error)
      throw new Error(`Nu s-au putut încărca modulele de instruire: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get a single training module by ID
   * @param moduleId - The module ID
   * @returns Training module or null if not found
   */
  async getById(moduleId: string): Promise<TrainingModule | null> {
    const { data, error } = await this.supabase
      .from('training_modules')
      .select('*')
      .eq('id', moduleId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      console.error('Error fetching module by ID:', error)
      throw new Error(`Nu s-a putut încărca modulul: ${error.message}`)
    }

    return data
  }

  // ──────────────────────────────────────────────────────────
  // ASSIGNMENT OPERATIONS
  // ──────────────────────────────────────────────────────────

  /**
   * Schedule training for one or more workers
   * @param payload - Assignment details (organization, module, workers, due date)
   * @returns Array of created assignments
   */
  async schedule(payload: AssignTrainingPayload): Promise<TrainingAssignment[]> {
    const rows = payload.worker_ids.map((workerId) => ({
      organization_id: payload.organization_id,
      module_id: payload.module_id,
      worker_id: workerId,
      assigned_by: payload.assigned_by,
      due_date: payload.due_date || null,
      status: 'assigned' as AssignmentStatus,
    }))

    const { data, error } = await this.supabase
      .from('training_assignments')
      .insert(rows)
      .select()

    if (error) {
      console.error('Error scheduling training:', error)
      throw new Error(`Nu s-a putut programa instruirea: ${error.message}`)
    }

    return data || []
  }

  /**
   * Add participants to an existing training session
   * Same as schedule() - assigns training to workers
   * @param payload - Assignment details
   * @returns Array of created assignments
   */
  async addParticipants(payload: AssignTrainingPayload): Promise<TrainingAssignment[]> {
    return this.schedule(payload)
  }

  // ──────────────────────────────────────────────────────────
  // SESSION OPERATIONS
  // ──────────────────────────────────────────────────────────

  /**
   * Mark attendance and record a completed training session
   * @param payload - Session details (worker, module, score, etc.)
   * @returns Created training session
   */
  async markAttendance(payload: RecordSessionPayload): Promise<TrainingSession> {
    // 1. Create the session
    const { data: session, error: sessionError } = await this.supabase
      .from('training_sessions')
      .insert({
        organization_id: payload.organization_id,
        module_id: payload.module_id,
        worker_id: payload.worker_id,
        instructor_name: payload.instructor_name,
        session_date: payload.session_date,
        duration_minutes: payload.duration_minutes,
        language: payload.language || 'ro',
        location: payload.location || null,
        test_score: payload.test_score || null,
        test_questions_total: payload.test_questions_total || null,
        test_questions_correct: payload.test_questions_correct || null,
        verification_result: 'pending',
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Error creating training session:', sessionError)
      throw new Error(`Nu s-a putut înregistra sesiunea: ${sessionError.message}`)
    }

    // 2. Find and update the matching assignment
    const { data: assignment } = await this.supabase
      .from('training_assignments')
      .select('id')
      .eq('organization_id', payload.organization_id)
      .eq('module_id', payload.module_id)
      .eq('worker_id', payload.worker_id)
      .in('status', ['assigned', 'in_progress', 'overdue'])
      .order('assigned_at', { ascending: false })
      .limit(1)
      .single()

    if (assignment) {
      await this.supabase
        .from('training_assignments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          session_id: session.id,
        })
        .eq('id', assignment.id)
    }

    return session
  }

  // ──────────────────────────────────────────────────────────
  // DASHBOARD & STATISTICS
  // ──────────────────────────────────────────────────────────

  /**
   * Get training assignments expiring within N days
   * @param organizationId - Organization ID
   * @param days - Number of days to look ahead (default: 30)
   * @returns Array of expiring assignments
   */
  async getExpiring(organizationId: string, days: number = 30): Promise<TrainingDashboardRow[]> {
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    const { data, error } = await this.supabase
      .from('training_dashboard')
      .select('*')
      .eq('organization_id', organizationId)
      .in('status', ['assigned', 'in_progress'])
      .gte('due_date', now.toISOString())
      .lte('due_date', futureDate.toISOString())
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching expiring trainings:', error)
      throw new Error(`Nu s-au putut încărca instruirile care expiră: ${error.message}`)
    }

    return data || []
  }

  /**
   * Cancel a training assignment
   * @param assignmentId - Assignment ID to cancel
   * @param notes - Optional cancellation notes
   * @returns Updated assignment
   */
  async cancel(assignmentId: string, notes?: string): Promise<TrainingAssignment> {
    const updatePayload: any = {
      status: 'exempted',
      updated_at: new Date().toISOString(),
    }

    if (notes) {
      updatePayload.notes = notes
    }

    const { data, error } = await this.supabase
      .from('training_assignments')
      .update(updatePayload)
      .eq('id', assignmentId)
      .select()
      .single()

    if (error) {
      console.error('Error cancelling training assignment:', error)
      throw new Error(`Nu s-a putut anula instruirea: ${error.message}`)
    }

    return data
  }

  /**
   * Get aggregated training statistics for an organization
   * @param organizationId - Organization ID
   * @returns Training statistics (completion rate, scores, etc.)
   */
  async getStatistics(organizationId: string): Promise<TrainingStats> {
    // Get all assignments for the organization
    const { data: assignments, error: assignmentsError } = await this.supabase
      .from('training_assignments')
      .select(`
        id,
        status,
        due_date,
        training_sessions (
          test_score
        )
      `)
      .eq('organization_id', organizationId)

    if (assignmentsError) {
      console.error('Error fetching training statistics:', assignmentsError)
      throw new Error(`Nu s-au putut încărca statisticile: ${assignmentsError.message}`)
    }

    const allAssignments = assignments || []
    const total = allAssignments.length
    const completed = allAssignments.filter((a: any) => a.status === 'completed').length
    const inProgress = allAssignments.filter((a: any) => a.status === 'in_progress').length
    const overdue = allAssignments.filter((a: any) => a.status === 'overdue').length

    // Calculate average test score from completed sessions
    const scores: number[] = []
    for (const assignment of allAssignments) {
      const sessions = (assignment as any).training_sessions
      if (sessions && Array.isArray(sessions)) {
        for (const session of sessions) {
          if (session.test_score != null) {
            scores.push(session.test_score)
          }
        }
      } else if (sessions && sessions.test_score != null) {
        scores.push(sessions.test_score)
      }
    }

    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0

    // Count upcoming due (next 30 days)
    const now = new Date()
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const upcomingDue = allAssignments.filter((a: any) => {
      if (!a.due_date || !['assigned', 'in_progress'].includes(a.status)) return false
      const dueDate = new Date(a.due_date)
      return dueDate >= now && dueDate <= in30Days
    }).length

    return {
      total_assigned: total,
      completed,
      in_progress: inProgress,
      overdue,
      completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      avg_test_score: avgScore,
      upcoming_due: upcomingDue,
    }
  }

  // ──────────────────────────────────────────────────────────
  // HELPER METHODS
  // ──────────────────────────────────────────────────────────

  /**
   * Get training dashboard data with optional filters
   * @param organizationId - Organization ID
   * @param filters - Optional filters (status, category, worker)
   * @returns Array of training dashboard rows
   */
  async getDashboard(
    organizationId: string,
    filters?: {
      status?: string
      category?: string
      workerId?: string
    }
  ): Promise<TrainingDashboardRow[]> {
    let query = this.supabase
      .from('training_dashboard')
      .select('*')
      .eq('organization_id', organizationId)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.workerId) {
      query = query.eq('worker_id', filters.workerId)
    }

    const { data, error } = await query.order('due_date', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('Error fetching training dashboard:', error)
      throw new Error(`Nu s-au putut încărca datele dashboard-ului: ${error.message}`)
    }

    return data || []
  }

  /**
   * Update assignment status
   * @param assignmentId - Assignment ID
   * @param status - New status
   * @param notes - Optional notes
   * @returns Updated assignment
   */
  async updateStatus(
    assignmentId: string,
    status: AssignmentStatus,
    notes?: string
  ): Promise<TrainingAssignment> {
    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (notes) {
      updatePayload.notes = notes
    }

    if (status === 'completed') {
      updatePayload.completed_at = new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('training_assignments')
      .update(updatePayload)
      .eq('id', assignmentId)
      .select()
      .single()

    if (error) {
      console.error('Error updating assignment status:', error)
      throw new Error(`Nu s-a putut actualiza statusul: ${error.message}`)
    }

    return data
  }

  /**
   * Get all workers in an organization (for dropdowns)
   * @param organizationId - Organization ID
   * @returns Array of workers with basic info
   */
  async getOrganizationWorkers(organizationId: string) {
    const { data, error } = await this.supabase
      .from('memberships')
      .select(`
        user_id,
        role,
        profiles!inner(full_name, email)
      `)
      .eq('organization_id', organizationId)

    if (error) {
      console.error('Error fetching organization workers:', error)
      throw new Error(`Nu s-au putut încărca lucrătorii: ${error.message}`)
    }

    return (data || []).map((m: any) => ({
      id: m.user_id,
      full_name: m.profiles?.full_name || 'Necunoscut',
      email: m.profiles?.email || '',
      role: m.role,
    }))
  }

  /**
   * Assign training to all workers in an organization
   * @param organizationId - Organization ID
   * @param moduleId - Module ID
   * @param assignedBy - User ID of assigner
   * @param dueDate - Optional due date
   * @returns Array of created assignments
   */
  async assignToAllWorkers(
    organizationId: string,
    moduleId: string,
    assignedBy: string,
    dueDate?: string
  ): Promise<TrainingAssignment[]> {
    const { data: members, error: membersError } = await this.supabase
      .from('memberships')
      .select('user_id')
      .eq('organization_id', organizationId)
      .eq('is_active', true)

    if (membersError) {
      console.error('Error fetching members:', membersError)
      throw new Error(`Nu s-au putut încărca membrii: ${membersError.message}`)
    }

    if (!members || members.length === 0) {
      return []
    }

    return this.schedule({
      organization_id: organizationId,
      module_id: moduleId,
      worker_ids: members.map((m) => m.user_id),
      assigned_by: assignedBy,
      due_date: dueDate,
    })
  }
}

// ──────────────────────────────────────────────────────────
// EXPORT DEFAULT INSTANCE CREATORS
// ──────────────────────────────────────────────────────────

export const trainingService = {
  forServer: TrainingService.forServer,
  forClient: TrainingService.forClient,
}
