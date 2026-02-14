// app/api/v1/employees/[id]/route.ts
// V1 API: Employee Detail Operations (GET, PATCH, DELETE)
// Includes relations loading and soft delete

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import {
  ApiError,
  checkOrganizationAccess
} from '@/lib/api/middleware'
import {
  updateEmployeeSchema,
  UpdateEmployeeInput,
  validateCNP,
  validateEmailFormat
} from '@/lib/api/validation'

/**
 * @openapi
 * /api/v1/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     description: Get detailed employee information including relations (organization, medical records, trainings)
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Employee ID
 *       - name: include
 *         in: query
 *         schema:
 *           type: string
 *           enum: [medical, trainings, all]
 *         description: Include related data (medical_records, trainings, or all)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()
    const { searchParams } = new URL(req.url)

    // Check authentication
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

    // Fetch employee with organization
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*, organizations(id, name, cui)')
      .eq('id', id)
      .maybeSingle()

    if (employeeError) {
      console.error('[GET /api/v1/employees/:id] Query error:', employeeError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea datelor angajatului',
          details: employeeError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    if (!employee) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Angajatul nu a fost găsit',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check access to organization
    const accessCheck = await checkOrganizationAccess(
      user.id,
      employee.organization_id
    )

    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Nu ai acces la acest angajat',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Check if relations should be included
    const include = searchParams.get('include')
    const result: any = { ...employee }

    if (include === 'medical' || include === 'all') {
      // Load medical records
      const { data: medicalRecords } = await supabase
        .from('medical_examinations')
        .select('*')
        .eq('cnp_hash', employee.cnp)
        .eq('organization_id', employee.organization_id)
        .order('examination_date', { ascending: false })

      result.medical_records = medicalRecords || []
    }

    if (include === 'trainings' || include === 'all') {
      // Load trainings (if table exists)
      const { data: trainings } = await supabase
        .from('employee_trainings')
        .select('*')
        .eq('employee_id', id)
        .order('training_date', { ascending: false })
        .limit(50)

      result.trainings = trainings || []
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[GET /api/v1/employees/:id]', error)
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
 * /api/v1/employees/{id}:
 *   patch:
 *     summary: Update employee
 *     description: Partially update employee information
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 255
 *               cnp:
 *                 type: string
 *                 nullable: true
 *               email:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *               phone:
 *                 type: string
 *                 nullable: true
 *               job_title:
 *                 type: string
 *                 nullable: true
 *               cor_code:
 *                 type: string
 *                 nullable: true
 *               nationality:
 *                 type: string
 *               hire_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               termination_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()

    // Check authentication
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

    // Fetch existing employee
    const { data: existingEmployee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      console.error('[PATCH /api/v1/employees/:id] Fetch error:', fetchError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea angajatului',
          details: fetchError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    if (!existingEmployee) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Angajatul nu a fost găsit',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check access
    const accessCheck = await checkOrganizationAccess(
      user.id,
      existingEmployee.organization_id,
      ['consultant', 'firma_admin']
    )

    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea să modifici acest angajat',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Validate request body
    const body = await req.json().catch(() => ({}))
    const result = updateEmployeeSchema.safeParse(body)

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

    const data: UpdateEmployeeInput = result.data

    // Validate CNP if being updated
    if (data.cnp !== undefined && data.cnp && !validateCNP(data.cnp)) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'CNP invalid. Trebuie să aibă 13 cifre',
          code: 'INVALID_CNP'
        } as ApiError,
        { status: 400 }
      )
    }

    // Validate email format if being updated
    if (data.email !== undefined && data.email && !validateEmailFormat(data.email)) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Format email invalid',
          code: 'INVALID_EMAIL'
        } as ApiError,
        { status: 400 }
      )
    }

    // Check for duplicate CNP (if changed)
    if (data.cnp !== undefined && data.cnp && data.cnp !== existingEmployee.cnp) {
      const { data: duplicateCNP } = await supabase
        .from('employees')
        .select('id')
        .eq('organization_id', existingEmployee.organization_id)
        .eq('cnp', data.cnp)
        .neq('id', id)
        .maybeSingle()

      if (duplicateCNP) {
        return NextResponse.json(
          {
            error: 'Conflict',
            message: 'Există deja un angajat cu acest CNP în organizație',
            code: 'DUPLICATE_CNP'
          } as ApiError,
          { status: 409 }
        )
      }
    }

    // Check for duplicate email (if changed)
    if (data.email !== undefined && data.email && data.email !== existingEmployee.email) {
      const { data: duplicateEmail } = await supabase
        .from('employees')
        .select('id')
        .eq('organization_id', existingEmployee.organization_id)
        .eq('email', data.email)
        .neq('id', id)
        .maybeSingle()

      if (duplicateEmail) {
        return NextResponse.json(
          {
            error: 'Conflict',
            message: 'Există deja un angajat cu acest email în organizație',
            code: 'DUPLICATE_EMAIL'
          } as ApiError,
          { status: 409 }
        )
      }
    }

    // Update employee
    const { data: updatedEmployee, error: updateError } = await supabase
      .from('employees')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, organizations(id, name, cui)')
      .single()

    if (updateError) {
      console.error('[PATCH /api/v1/employees/:id] Update error:', updateError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la actualizarea angajatului',
          details: updateError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json(updatedEmployee)
  } catch (error) {
    console.error('[PATCH /api/v1/employees/:id]', error)
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
 * /api/v1/employees/{id}:
 *   delete:
 *     summary: Delete employee (soft delete)
 *     description: Soft delete employee by setting deleted_at timestamp
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Employee ID
 *       - name: hard_delete
 *         in: query
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Perform hard delete (permanent, requires consultant role)
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()
    const { searchParams } = new URL(req.url)

    // Check authentication
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

    // Fetch existing employee
    const { data: existingEmployee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      console.error('[DELETE /api/v1/employees/:id] Fetch error:', fetchError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea angajatului',
          details: fetchError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    if (!existingEmployee) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Angajatul nu a fost găsit',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check for hard delete request
    const hardDelete = searchParams.get('hard_delete') === 'true'

    if (hardDelete) {
      // Hard delete requires consultant role
      const accessCheck = await checkOrganizationAccess(
        user.id,
        existingEmployee.organization_id,
        ['consultant']
      )

      if (!accessCheck.hasAccess) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Doar consultanții pot șterge permanent angajați',
            code: 'INSUFFICIENT_PERMISSIONS'
          } as ApiError,
          { status: 403 }
        )
      }

      // Perform hard delete
      const { error: deleteError } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)

      if (deleteError) {
        console.error('[DELETE /api/v1/employees/:id] Hard delete error:', deleteError)
        return NextResponse.json(
          {
            error: 'Database Error',
            message: 'Eroare la ștergerea angajatului',
            details: deleteError.message,
            code: 'DB_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Angajat șters permanent',
        deleted_permanently: true
      })
    }

    // Soft delete (default)
    const accessCheck = await checkOrganizationAccess(
      user.id,
      existingEmployee.organization_id,
      ['consultant', 'firma_admin']
    )

    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea să ștergi acest angajat',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    const deletedAt = new Date().toISOString()

    // Perform soft delete
    const { error: updateError } = await supabase
      .from('employees')
      .update({
        deleted_at: deletedAt,
        is_active: false,
        updated_at: deletedAt
      })
      .eq('id', id)

    if (updateError) {
      console.error('[DELETE /api/v1/employees/:id] Soft delete error:', updateError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la ștergerea angajatului',
          details: updateError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Angajat șters (soft delete)',
      deleted_at: deletedAt
    })
  } catch (error) {
    console.error('[DELETE /api/v1/employees/:id]', error)
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
