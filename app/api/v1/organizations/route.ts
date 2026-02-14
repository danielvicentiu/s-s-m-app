// app/api/v1/organizations/route.ts
// V1 API: Organizations List & Create
// OpenAPI compliant REST API with pagination, sorting, filtering, search

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import {
  parsePaginationParams,
  parseSortParams,
  buildPaginatedResponse,
  ApiError,
  withAuth,
  ApiContext
} from '@/lib/api/middleware'
import { organizationSchema } from '@/lib/middleware/validation'
import { withErrorHandler } from '@/lib/middleware/error-handler'

/**
 * @openapi
 * /api/v1/organizations:
 *   get:
 *     summary: List organizations
 *     description: Get paginated list of organizations with optional filtering and sorting
 *     tags:
 *       - Organizations
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
 *           enum: [name, created_at, updated_at, cooperation_status, exposure_score]
 *           default: created_at
 *         description: Field to sort by
 *       - name: sort_order
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - name: cooperation_status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [active, warning, uncooperative]
 *         description: Filter by cooperation status
 *       - name: exposure_score
 *         in: query
 *         schema:
 *           type: string
 *           enum: [necalculat, scazut, mediu, ridicat, critic]
 *         description: Filter by exposure score
 *       - name: county
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by county
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search in name, CUI, address, contact_email
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
 *                     $ref: '#/components/schemas/Organization'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const GET = withAuth(withErrorHandler(async (req: NextRequest, context: ApiContext) => {
  const supabase = await createSupabaseServer()
  const { searchParams } = new URL(req.url)

  // Parse pagination and sorting
  const { page, limit, offset } = parsePaginationParams(req)
  const { sortBy, sortOrder } = parseSortParams(req, [
    'name',
    'created_at',
    'updated_at',
    'cooperation_status',
    'exposure_score',
    'data_completeness'
  ])

  // Get user's organizations via memberships
  const { data: memberships, error: memError } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', context.userId)
    .eq('is_active', true)

  if (memError) {
    console.error('[GET /api/v1/organizations] Membership error:', memError)
    return NextResponse.json(
      {
        error: 'Database Error',
        message: 'Eroare la preluarea organizațiilor',
        code: 'DB_ERROR',
        details: memError.message
      } as ApiError,
      { status: 500 }
    )
  }

  const orgIds = memberships?.map(m => m.organization_id) || []

  if (orgIds.length === 0) {
    return NextResponse.json(buildPaginatedResponse([], 0, page, limit))
  }

  // Build query with filters
  let query = supabase
    .from('organizations')
    .select('*', { count: 'exact' })
    .in('id', orgIds)

  // Apply filters
  const cooperationStatus = searchParams.get('cooperation_status')
  if (cooperationStatus) {
    query = query.eq('cooperation_status', cooperationStatus)
  }

  const exposureScore = searchParams.get('exposure_score')
  if (exposureScore) {
    query = query.eq('exposure_score', exposureScore)
  }

  const county = searchParams.get('county')
  if (county) {
    query = query.eq('county', county)
  }

  const search = searchParams.get('search')
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,cui.ilike.%${search}%,address.ilike.%${search}%,contact_email.ilike.%${search}%`
    )
  }

  // Apply sorting and pagination
  query = query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('[GET /api/v1/organizations] Query error:', error)
    return NextResponse.json(
      {
        error: 'Database Error',
        message: 'Eroare la preluarea organizațiilor',
        code: 'DB_ERROR',
        details: error.message
      } as ApiError,
      { status: 500 }
    )
  }

  return NextResponse.json(buildPaginatedResponse(data || [], count || 0, page, limit))
}))

/**
 * @openapi
 * /api/v1/organizations:
 *   post:
 *     summary: Create organization
 *     description: Create a new organization (consultant role only)
 *     tags:
 *       - Organizations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 255
 *               cui:
 *                 type: string
 *                 nullable: true
 *               address:
 *                 type: string
 *                 nullable: true
 *               county:
 *                 type: string
 *                 nullable: true
 *               contact_email:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *               contact_phone:
 *                 type: string
 *                 nullable: true
 *               preferred_channels:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [email, whatsapp, sms, push, calendar]
 *                 default: ['email']
 *               cooperation_status:
 *                 type: string
 *                 enum: [active, warning, uncooperative]
 *                 default: active
 *               exposure_score:
 *                 type: string
 *                 enum: [necalculat, scazut, mediu, ridicat, critic]
 *                 default: necalculat
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const POST = withAuth(withErrorHandler(async (req: NextRequest, context: ApiContext) => {
  const supabase = await createSupabaseServer()

  // Parse and validate request body
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      {
        error: 'Bad Request',
        message: 'Request body-ul nu este un JSON valid',
        code: 'INVALID_JSON'
      } as ApiError,
      { status: 400 }
    )
  }

  // Validate with Zod schema
  const validation = organizationSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Validation Error',
        message: 'Date de intrare invalide',
        code: 'VALIDATION_ERROR',
        details: validation.error.format()
      } as ApiError,
      { status: 400 }
    )
  }

  const validatedData = validation.data

  // Check for duplicate CUI if provided
  if (validatedData.cui) {
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('cui', validatedData.cui)
      .single()

    if (existingOrg) {
      return NextResponse.json(
        {
          error: 'Conflict',
          message: `O organizație cu CUI ${validatedData.cui} există deja: ${existingOrg.name}`,
          code: 'DUPLICATE_CUI',
          details: { existing_organization_id: existingOrg.id }
        } as ApiError,
        { status: 409 }
      )
    }
  }

  // Calculate initial data_completeness
  const dataCompleteness = calculateDataCompleteness(validatedData)

  // Create organization with default values
  const { data: newOrg, error: createError } = await supabase
    .from('organizations')
    .insert({
      name: validatedData.name,
      cui: validatedData.cui || null,
      address: validatedData.address || null,
      county: validatedData.county || null,
      contact_email: validatedData.contact_email || null,
      contact_phone: validatedData.contact_phone || null,
      preferred_channels: validatedData.preferred_channels || ['email'],
      cooperation_status: validatedData.cooperation_status || 'active',
      exposure_score: validatedData.exposure_score || 'necalculat',
      data_completeness: dataCompleteness
    })
    .select()
    .single()

  if (createError) {
    console.error('[POST /api/v1/organizations] Create error:', createError)
    return NextResponse.json(
      {
        error: 'Database Error',
        message: 'Eroare la crearea organizației',
        code: 'DB_ERROR',
        details: createError.message
      } as ApiError,
      { status: 500 }
    )
  }

  // Automatically add creator as consultant member
  const { error: membershipError } = await supabase
    .from('memberships')
    .insert({
      user_id: context.userId,
      organization_id: newOrg.id,
      role: 'consultant',
      is_active: true
    })

  if (membershipError) {
    console.error('[POST /api/v1/organizations] Membership creation error:', membershipError)
    // Organization was created but membership failed - log but don't fail the request
  }

  return NextResponse.json(
    {
      data: newOrg,
      message: 'Organizație creată cu succes'
    },
    { status: 201 }
  )
}))

/**
 * Helper: Calculate data completeness percentage
 */
function calculateDataCompleteness(data: any): number {
  const fields = ['name', 'cui', 'address', 'county', 'contact_email', 'contact_phone']
  const filledFields = fields.filter(field => {
    const value = data[field]
    return value !== null && value !== undefined && value !== ''
  }).length

  return Math.round((filledFields / fields.length) * 100)
}
