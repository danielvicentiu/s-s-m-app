// app/api/v1/trainings/[id]/route.ts
// V1 API: Single Training Assignment Operations
// GET by ID, PATCH update, DELETE

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { ApiError, checkOrganizationAccess } from '@/lib/api/middleware'
import {
  updateTrainingAssignmentSchema,
  UpdateTrainingAssignmentInput
} from '@/lib/api/validation'

/**
 * @openapi
 * /api/v1/trainings/{id}:
 *   get:
 *     summary: Get training assignment by ID
 *     description: Retrieve a single training assignment with full details
 *     tags:
 *       - Trainings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Fetch assignment with all related data
    const { data: assignment, error } = await supabase
      .from('training_assignments')
      .select(`
        *,
        workers:employees!training_assignments_worker_id_fkey (
          id,
          full_name,
          email,
          phone,
          job_title,
          cor_code,
          is_active
        ),
        modules:training_modules!training_assignments_module_id_fkey (
          id,
          code,
          title,
          description,
          category,
          training_type,
          duration_minutes_required,
          periodicity_months,
          is_mandatory,
          legal_basis,
          min_test_questions,
          min_pass_score
        ),
        sessions:training_sessions!training_assignments_session_id_fkey (
          id,
          session_date,
          instructor_name,
          duration_minutes,
          language,
          location,
          test_score,
          test_questions_total,
          test_questions_correct,
          verification_result,
          fisa_document_id,
          quickvalid_timestamp,
          quickvalid_confidence
        )
      `)
      .eq('id', id)
      .single()

    if (error || !assignment) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Atribuirea nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check organization access
    const accessCheck = await checkOrganizationAccess(
      user.id,
      assignment.organization_id
    )
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai acces la această resursă',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    return NextResponse.json({ data: assignment })
  } catch (error) {
    console.error('[GET /api/v1/trainings/[id]] Error:', error)
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
 * /api/v1/trainings/{id}:
 *   patch:
 *     summary: Update training assignment
 *     description: Update training assignment fields (status, dates, notes)
 *     tags:
 *       - Trainings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [assigned, in_progress, completed, overdue, expired, exempted]
 *               due_date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *               completed_at:
 *                 type: string
 *                 format: date-time
 *               next_due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Fetch existing assignment
    const { data: existingAssignment, error: fetchError } = await supabase
      .from('training_assignments')
      .select('id, organization_id, status')
      .eq('id', id)
      .single()

    if (fetchError || !existingAssignment) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Atribuirea nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check organization access
    const accessCheck = await checkOrganizationAccess(
      user.id,
      existingAssignment.organization_id,
      ['consultant', 'firma_admin']
    )
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea de a modifica această atribuire',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await req.json().catch(() => ({}))
    const result = updateTrainingAssignmentSchema.safeParse(body)

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

    const updateData: UpdateTrainingAssignmentInput = result.data

    // Auto-set completed_at if status changed to completed
    if (updateData.status === 'completed' && !updateData.completed_at) {
      updateData.completed_at = new Date().toISOString()
    }

    // Update assignment
    const { data: updatedAssignment, error: updateError } = await supabase
      .from('training_assignments')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
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
        ),
        sessions:training_sessions!training_assignments_session_id_fkey (
          id,
          session_date,
          instructor_name,
          test_score,
          verification_result
        )
      `)
      .single()

    if (updateError) {
      console.error('[PATCH /api/v1/trainings/[id]] Update error:', updateError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la actualizarea atribuirii',
          details: updateError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Atribuire actualizată cu succes',
      data: updatedAssignment
    })
  } catch (error) {
    console.error('[PATCH /api/v1/trainings/[id]] Error:', error)
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
 * /api/v1/trainings/{id}:
 *   delete:
 *     summary: Delete training assignment
 *     description: Permanently delete a training assignment
 *     tags:
 *       - Trainings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Fetch existing assignment
    const { data: existingAssignment, error: fetchError } = await supabase
      .from('training_assignments')
      .select('id, organization_id, status, session_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingAssignment) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Atribuirea nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check organization access
    const accessCheck = await checkOrganizationAccess(
      user.id,
      existingAssignment.organization_id,
      ['consultant', 'firma_admin']
    )
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea de a șterge această atribuire',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    // Prevent deletion if already completed with session
    if (existingAssignment.status === 'completed' && existingAssignment.session_id) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Nu poți șterge o atribuire completată cu sesiune înregistrată',
          code: 'COMPLETED_WITH_SESSION'
        } as ApiError,
        { status: 400 }
      )
    }

    // Delete assignment
    const { error: deleteError } = await supabase
      .from('training_assignments')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('[DELETE /api/v1/trainings/[id]] Delete error:', deleteError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la ștergerea atribuirii',
          details: deleteError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Atribuire ștearsă cu succes',
      id
    })
  } catch (error) {
    console.error('[DELETE /api/v1/trainings/[id]] Error:', error)
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
