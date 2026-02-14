// app/api/v1/trainings/route.ts
// V1 API: Training Assignments List & Create
// OpenAPI compliant REST API with pagination, sorting, filtering, search

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import {
  parsePaginationParams,
  parseSortParams,
  buildPaginatedResponse,
  ApiError,
  checkOrganizationAccess
} from '@/lib/api/middleware'
import {
  createTrainingAssignmentSchema,
  CreateTrainingAssignmentInput
} from '@/lib/api/validation'

/**
 * @openapi
 * /api/v1/trainings:
 *   get:
 *     summary: List training assignments
 *     description: Get paginated list of training assignments with employee and module joins
 *     tags:
 *       - Trainings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *       - name: sort_by
 *         in: query
 *         schema:
 *           type: string
 *           enum: [assigned_at, due_date, completed_at, created_at, status]
 *           default: assigned_at
 *       - name: sort_order
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - name: organization_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: worker_id
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: module_id
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [assigned, in_progress, completed, overdue, expired, exempted]
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ssm, psi, su, nis2, custom]
 *       - name: training_type
 *         in: query
 *         schema:
 *           type: string
 *       - name: date_from
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: date_to
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Trebuie să fii autentificat pentru a accesa această resursă',
          code: 'AUTH_REQUIRED'
        } as ApiError,
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organization_id')

    if (!organizationId) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'organization_id este obligatoriu',
          code: 'MISSING_ORG_ID'
        } as ApiError,
        { status: 400 }
      )
    }

    // Check organization access
    const accessCheck = await checkOrganizationAccess(user.id, organizationId)
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai acces la această organizație',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    // Parse pagination and sorting
    const { page, limit, offset } = parsePaginationParams(req)
    const { sortBy, sortOrder } = parseSortParams(req, [
      'assigned_at', 'due_date', 'completed_at', 'created_at', 'status'
    ])

    // Parse filters
    const workerId = searchParams.get('worker_id')
    const moduleId = searchParams.get('module_id')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const trainingType = searchParams.get('training_type')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const search = searchParams.get('search')

    // Build query with joins
    let query = supabase
      .from('training_assignments')
      .select(`
        *,
        workers:employees!training_assignments_worker_id_fkey (
          id,
          full_name,
          email,
          job_title,
          is_active
        ),
        modules:training_modules!training_assignments_module_id_fkey (
          id,
          code,
          title,
          category,
          training_type,
          duration_minutes_required,
          is_mandatory
        ),
        sessions:training_sessions!training_assignments_session_id_fkey (
          id,
          session_date,
          instructor_name,
          test_score,
          verification_result
        )
      `, { count: 'exact' })
      .eq('organization_id', organizationId)

    // Apply filters
    if (workerId) {
      query = query.eq('worker_id', workerId)
    }
    if (moduleId) {
      query = query.eq('module_id', moduleId)
    }
    if (status) {
      query = query.eq('status', status)
    }

    // Filter by date range (assigned_at)
    if (dateFrom) {
      query = query.gte('assigned_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('assigned_at', dateTo)
    }

    // Search in worker name (via join)
    if (search) {
      query = query.or(`workers.full_name.ilike.%${search}%`)
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    const { data: assignments, error, count } = await query

    if (error) {
      console.error('[GET /api/v1/trainings] Database error:', error)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la citirea datelor',
          details: error.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    // Post-filter by category/training_type (from joined module data)
    let filteredAssignments = assignments || []
    if (category) {
      filteredAssignments = filteredAssignments.filter(
        (a: any) => a.modules?.category === category
      )
    }
    if (trainingType) {
      filteredAssignments = filteredAssignments.filter(
        (a: any) => a.modules?.training_type === trainingType
      )
    }

    return NextResponse.json(
      buildPaginatedResponse(filteredAssignments, count || 0, page, limit)
    )
  } catch (error) {
    console.error('[GET /api/v1/trainings] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'A apărut o eroare neprevăzută',
        details: error instanceof Error ? error.message : String(error),
        code: 'INTERNAL_ERROR'
      } as ApiError,
      { status: 500 }
    )
  }
}

/**
 * @openapi
 * /api/v1/trainings:
 *   post:
 *     summary: Create training assignments
 *     description: Create training assignments for multiple employees
 *     tags:
 *       - Trainings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organization_id
 *               - module_id
 *               - worker_ids
 *               - assigned_by
 *             properties:
 *               organization_id:
 *                 type: string
 *                 format: uuid
 *               module_id:
 *                 type: string
 *                 format: uuid
 *               worker_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 minItems: 1
 *               assigned_by:
 *                 type: string
 *                 format: uuid
 *               due_date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Trebuie să fii autentificat pentru a accesa această resursă',
          code: 'AUTH_REQUIRED'
        } as ApiError,
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await req.json().catch(() => ({}))
    const result = createTrainingAssignmentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Date de intrare invalide',
          details: result.error.format(),
          code: 'VALIDATION_ERROR'
        } as ApiError,
        { status: 400 }
      )
    }

    const data: CreateTrainingAssignmentInput = result.data

    // Check organization access
    const accessCheck = await checkOrganizationAccess(
      user.id,
      data.organization_id,
      ['consultant', 'firma_admin']
    )
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea de a crea atribuiri',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    // Verify module exists and is active
    const { data: module, error: moduleError } = await supabase
      .from('training_modules')
      .select('id, title, is_active')
      .eq('id', data.module_id)
      .single()

    if (moduleError || !module) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Modulul de instruire nu a fost găsit',
          code: 'MODULE_NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    if (!module.is_active) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Modulul de instruire nu este activ',
          code: 'MODULE_INACTIVE'
        } as ApiError,
        { status: 400 }
      )
    }

    // Verify all workers exist and belong to organization
    const { data: workers, error: workersError } = await supabase
      .from('employees')
      .select('id, full_name, is_active')
      .eq('organization_id', data.organization_id)
      .in('id', data.worker_ids)

    if (workersError || !workers || workers.length !== data.worker_ids.length) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Unul sau mai mulți angajați nu există sau nu aparțin organizației',
          code: 'INVALID_WORKERS'
        } as ApiError,
        { status: 400 }
      )
    }

    // Check for existing assignments to avoid duplicates
    const { data: existingAssignments } = await supabase
      .from('training_assignments')
      .select('id, worker_id, status')
      .eq('organization_id', data.organization_id)
      .eq('module_id', data.module_id)
      .in('worker_id', data.worker_ids)
      .neq('status', 'completed')

    const existingWorkerIds = new Set(
      existingAssignments?.map((a: any) => a.worker_id) || []
    )

    // Filter out workers who already have active assignments
    const workersToAssign = data.worker_ids.filter(
      (workerId) => !existingWorkerIds.has(workerId)
    )

    if (workersToAssign.length === 0) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Toți angajații au deja atribuiri active pentru acest modul',
          code: 'ALREADY_ASSIGNED'
        } as ApiError,
        { status: 400 }
      )
    }

    // Create assignments for multiple workers
    const assignmentsToCreate = workersToAssign.map((workerId) => ({
      organization_id: data.organization_id,
      worker_id: workerId,
      module_id: data.module_id,
      assigned_by: data.assigned_by,
      assigned_at: new Date().toISOString(),
      due_date: data.due_date || null,
      status: 'assigned' as const,
      notes: data.notes || null
    }))

    const { data: createdAssignments, error: createError } = await supabase
      .from('training_assignments')
      .insert(assignmentsToCreate)
      .select(`
        *,
        workers:employees!training_assignments_worker_id_fkey (
          id,
          full_name,
          email,
          job_title
        ),
        modules:training_modules!training_assignments_module_id_fkey (
          id,
          code,
          title,
          category,
          training_type
        )
      `)

    if (createError) {
      console.error('[POST /api/v1/trainings] Create error:', createError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la crearea atribuirilor',
          details: createError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Atribuiri create cu succes',
        data: createdAssignments,
        count: createdAssignments?.length || 0,
        skipped: data.worker_ids.length - workersToAssign.length
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/v1/trainings] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'A apărut o eroare neprevăzută',
        details: error instanceof Error ? error.message : String(error),
        code: 'INTERNAL_ERROR'
      } as ApiError,
      { status: 500 }
    )
  }
}
