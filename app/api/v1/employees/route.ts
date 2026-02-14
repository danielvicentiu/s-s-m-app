// app/api/v1/employees/route.ts
// V1 API: Employees List & Create
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
  createEmployeeSchema,
  CreateEmployeeInput,
  validateCNP,
  validateEmailFormat
} from '@/lib/api/validation'

/**
 * @openapi
 * /api/v1/employees:
 *   get:
 *     summary: List employees
 *     description: Get paginated list of employees with optional filtering, sorting, and search
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *       - name: sort_by
 *         in: query
 *         schema:
 *           type: string
 *           enum: [full_name, hire_date, created_at, job_title, nationality]
 *           default: hire_date
 *         description: Field to sort by
 *       - name: sort_order
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - name: organization_id
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by organization ID
 *       - name: is_active
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - name: nationality
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by nationality (e.g., RO, BG, HU)
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search in full_name, email, phone, job_title, CNP
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function GET(req: NextRequest) {
  try {
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

    // Parse pagination
    const { page, limit, offset } = parsePaginationParams(req)

    // Parse sorting
    const allowedSortFields = ['full_name', 'hire_date', 'created_at', 'job_title', 'nationality', 'cor_code']
    const { sortBy, sortOrder } = parseSortParams(req, allowedSortFields)

    // Get user's organizations via memberships
    const { data: memberships, error: memError } = await supabase
      .from('memberships')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (memError) {
      console.error('[GET /api/v1/employees] Membership error:', memError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea organizațiilor',
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    const orgIds = memberships?.map(m => m.organization_id) || []

    if (orgIds.length === 0) {
      // No organizations found for this user
      return NextResponse.json(
        buildPaginatedResponse([], 0, page, limit)
      )
    }

    // Build query with filters
    let query = supabase
      .from('employees')
      .select('*, organizations(id, name, cui)', { count: 'exact' })
      .in('organization_id', orgIds)

    // Apply filters
    const organizationId = searchParams.get('organization_id')
    if (organizationId) {
      // Verify user has access to this organization
      const hasAccess = orgIds.includes(organizationId)
      if (!hasAccess) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Nu ai acces la această organizație',
            code: 'INSUFFICIENT_PERMISSIONS'
          } as ApiError,
          { status: 403 }
        )
      }
      query = query.eq('organization_id', organizationId)
    }

    const isActive = searchParams.get('is_active')
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const nationality = searchParams.get('nationality')
    if (nationality) {
      query = query.eq('nationality', nationality)
    }

    const search = searchParams.get('search')
    if (search) {
      // Search in multiple fields
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,job_title.ilike.%${search}%,cnp.ilike.%${search}%`
      )
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[GET /api/v1/employees] Query error:', error)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea angajaților',
          details: error.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json(
      buildPaginatedResponse(data || [], count || 0, page, limit)
    )
  } catch (error) {
    console.error('[GET /api/v1/employees]', error)
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
 * /api/v1/employees:
 *   post:
 *     summary: Create employee
 *     description: Create a new employee with CNP and email validation
 *     tags:
 *       - Employees
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
 *               - full_name
 *             properties:
 *               organization_id:
 *                 type: string
 *                 format: uuid
 *               full_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 255
 *               cnp:
 *                 type: string
 *                 nullable: true
 *                 description: Cod Numeric Personal (13 digits)
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
 *                 description: Clasificarea Ocupațiilor din România
 *               nationality:
 *                 type: string
 *                 default: RO
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
 *                 default: true
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Link to user account if employee has app access
 *     responses:
 *       201:
 *         description: Employee created successfully
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
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function POST(req: NextRequest) {
  try {
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

    // Validate request body
    const body = await req.json().catch(() => ({}))
    const result = createEmployeeSchema.safeParse(body)

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

    const data: CreateEmployeeInput = result.data

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
          message: accessCheck.error || 'Nu ai permisiunea să adaugi angajați în această organizație',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Validate CNP if provided
    if (data.cnp && !validateCNP(data.cnp)) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'CNP invalid. Trebuie să aibă 13 cifre',
          code: 'INVALID_CNP'
        } as ApiError,
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (data.email && !validateEmailFormat(data.email)) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Format email invalid',
          code: 'INVALID_EMAIL'
        } as ApiError,
        { status: 400 }
      )
    }

    // Check for duplicate CNP in same organization (if CNP provided)
    if (data.cnp) {
      const { data: existingCNP } = await supabase
        .from('employees')
        .select('id')
        .eq('organization_id', data.organization_id)
        .eq('cnp', data.cnp)
        .maybeSingle()

      if (existingCNP) {
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

    // Check for duplicate email in same organization (if email provided)
    if (data.email) {
      const { data: existingEmail } = await supabase
        .from('employees')
        .select('id')
        .eq('organization_id', data.organization_id)
        .eq('email', data.email)
        .maybeSingle()

      if (existingEmail) {
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

    // Create employee
    const { data: newEmployee, error: createError } = await supabase
      .from('employees')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*, organizations(id, name, cui)')
      .single()

    if (createError) {
      console.error('[POST /api/v1/employees] Create error:', createError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la crearea angajatului',
          details: createError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json(newEmployee, { status: 201 })
  } catch (error) {
    console.error('[POST /api/v1/employees]', error)
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
