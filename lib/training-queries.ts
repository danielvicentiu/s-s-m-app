// ============================================================
// S-S-M.RO — Training Queries (Supabase CRUD)
// File: lib/training-queries.ts
// ============================================================

import { supabase } from '@/lib/supabase';
import type {
  TrainingModule,
  TrainingDashboardRow,
  TrainingStats,
  WorkerTrainingStatus,
  AssignTrainingPayload,
  RecordSessionPayload,
} from '@/lib/training-types';

// ============================================================
// MODULE OPERATIONS
// ============================================================

/** Get all active training modules */
export async function getTrainingModules(): Promise<TrainingModule[]> {
  const { data, error } = await supabase
    .from('training_modules')
    .select('*')
    .eq('is_active', true)
    .order('code');

  if (error) throw error;
  return data || [];
}

/** Get a single module by ID */
export async function getModuleById(moduleId: string): Promise<TrainingModule | null> {
  const { data, error } = await supabase
    .from('training_modules')
    .select('*')
    .eq('id', moduleId)
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// DASHBOARD OPERATIONS
// ============================================================

/** Get training dashboard data (uses the training_dashboard view) */
export async function getTrainingDashboard(
  organizationId: string,
  filters?: {
    status?: string;
    category?: string;
    workerId?: string;
  }
): Promise<TrainingDashboardRow[]> {
  let query = supabase
    .from('training_dashboard')
    .select('*')
    .eq('organization_id', organizationId);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.workerId) {
    query = query.eq('worker_id', filters.workerId);
  }

  const { data, error } = await query.order('due_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

/** Get aggregated training statistics */
export async function getTrainingStats(organizationId: string): Promise<TrainingStats> {
  const { data, error } = await supabase
    .from('training_assignments')
    .select('status, training_sessions(test_score)')
    .eq('organization_id', organizationId);

  if (error) throw error;

  const assignments = data || [];
  const total = assignments.length;
  const completed = assignments.filter((a: any) => a.status === 'completed').length;
  const inProgress = assignments.filter((a: any) => a.status === 'in_progress').length;
  const overdue = assignments.filter((a: any) => a.status === 'overdue').length;

  // Average test score from sessions
  const scores = assignments
    .filter((a: any) => a.training_sessions?.test_score != null)
    .map((a: any) => a.training_sessions.test_score);
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length)
    : 0;

  // Upcoming due (next 30 days)
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const { data: upcoming } = await supabase
    .from('training_assignments')
    .select('id')
    .eq('organization_id', organizationId)
    .in('status', ['assigned', 'in_progress'])
    .lte('due_date', in30Days.toISOString())
    .gte('due_date', now.toISOString());

  return {
    total_assigned: total,
    completed,
    in_progress: inProgress,
    overdue,
    completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    avg_test_score: avgScore,
    upcoming_due: upcoming?.length || 0,
  };
}

/** Get per-worker training status */
export async function getWorkerStatuses(organizationId: string): Promise<WorkerTrainingStatus[]> {
  const { data, error } = await supabase
    .from('training_assignments')
    .select(`
      worker_id,
      status,
      due_date,
      completed_at,
      profiles!training_assignments_worker_id_fkey(full_name)
    `)
    .eq('organization_id', organizationId);

  if (error) throw error;

  // Group by worker
  const workerMap = new Map<string, any>();
  for (const row of (data || [])) {
    const wid = row.worker_id;
    if (!workerMap.has(wid)) {
      workerMap.set(wid, {
        worker_id: wid,
        worker_name: (row as any).profiles?.full_name || 'Necunoscut',
        total_required: 0,
        completed: 0,
        overdue: 0,
        next_due: null,
        last_training_date: null,
      });
    }
    const w = workerMap.get(wid)!;
    w.total_required++;
    if (row.status === 'completed') {
      w.completed++;
      if (!w.last_training_date || row.completed_at > w.last_training_date) {
        w.last_training_date = row.completed_at;
      }
    }
    if (row.status === 'overdue') w.overdue++;
    if (row.due_date && row.status !== 'completed') {
      if (!w.next_due || row.due_date < w.next_due) {
        w.next_due = row.due_date;
      }
    }
  }

  return Array.from(workerMap.values()).map((w) => ({
    ...w,
    compliance_percentage: w.total_required > 0
      ? Math.round((w.completed / w.total_required) * 100)
      : 0,
  })).sort((a, b) => a.compliance_percentage - b.compliance_percentage);
}

// ============================================================
// ASSIGNMENT OPERATIONS
// ============================================================

/** Assign training to one or more workers */
export async function assignTraining(payload: AssignTrainingPayload) {
  const rows = payload.worker_ids.map((workerId) => ({
    organization_id: payload.organization_id,
    module_id: payload.module_id,
    worker_id: workerId,
    assigned_by: payload.assigned_by,
    due_date: payload.due_date || null,
    status: 'assigned' as const,
  }));

  const { data, error } = await supabase
    .from('training_assignments')
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

/** Update assignment status */
export async function updateAssignmentStatus(
  assignmentId: string,
  status: string,
  notes?: string
) {
  const { data, error } = await supabase
    .from('training_assignments')
    .update({ status, notes })
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Assign a module to ALL workers in an organization */
export async function assignToAllWorkers(
  organizationId: string,
  moduleId: string,
  assignedBy: string,
  dueDate?: string
) {
  const { data: members, error: membersError } = await supabase
    .from('memberships')
    .select('user_id')
    .eq('organization_id', organizationId)
    .eq('role', 'worker');

  if (membersError) throw membersError;

  if (!members || members.length === 0) return [];

  return assignTraining({
    organization_id: organizationId,
    module_id: moduleId,
    worker_ids: members.map((m) => m.user_id),
    assigned_by: assignedBy,
    due_date: dueDate,
  });
}

// ============================================================
// SESSION OPERATIONS
// ============================================================

/** Record a completed training session */
/** Record a completed training session AND link it to assignment */
export async function recordTrainingSession(payload: RecordSessionPayload) {
  // 1. Create the session
  const { data: session, error } = await supabase
    .from('training_sessions')
    .insert({
      organization_id: payload.organization_id,
      module_id: payload.module_id,
      worker_id: payload.worker_id,
      instructor_name: payload.instructor_name,
      session_date: payload.session_date,
      duration_minutes: payload.duration_minutes,
      language: payload.language || 'ro',
      location: payload.location,
      test_score: payload.test_score,
      test_questions_total: payload.test_questions_total,
      test_questions_correct: payload.test_questions_correct,
    })
    .select()
    .single();

  if (error) throw error;

  // 2. Find and update the matching assignment
  const { data: assignment } = await supabase
    .from('training_assignments')
    .select('id')
    .eq('organization_id', payload.organization_id)
    .eq('module_id', payload.module_id)
    .eq('worker_id', payload.worker_id)
    .in('status', ['assigned', 'in_progress', 'overdue'])
    .limit(1)
    .single();

  if (assignment) {
    await supabase
      .from('training_assignments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        session_id: session.id,
      })
      .eq('id', assignment.id);
  }

  return session;
}

// ============================================================
// WORKER OPERATIONS
// ============================================================

/** Get all workers in an organization (for dropdowns) */
export async function getOrganizationWorkers(organizationId: string) {
  const { data, error } = await supabase
    .from('memberships')
    .select(`
      user_id,
      role,
      profiles!inner(full_name, email)
    `)
    .eq('organization_id', organizationId);

  if (error) throw error;
  return (data || []).map((m: any) => ({
    id: m.user_id,
    full_name: m.profiles?.full_name || 'Necunoscut',
    email: m.profiles?.email || '',
    role: m.role,
  }));
}

// ============================================================
// BULK OPERATIONS
// ============================================================

/** Check and update overdue assignments */
export async function checkOverdueAssignments() {
  const { data, error } = await supabase.rpc('check_overdue_assignments');
  if (error) throw error;
  return data;
}
