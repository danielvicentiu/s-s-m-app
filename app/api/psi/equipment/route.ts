// app/api/psi/equipment/route.ts
// M2_PSI API: Equipment List & Create
// GET - List PSI equipment with filters, pagination, sorting
// POST - Create new PSI equipment

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
  createPSIEquipmentSchema,
  CreatePSIEquipmentInput
} from '@/lib/api/validation'

/**
 * GET /api/psi/equipment
 * List PSI equipment with optional filtering, sorting, and pagination
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
    const allowedSortFields = ['identifier', 'equipment_type', 'next_inspection_date', 'status', 'created_at', 'location']
    const { sortBy, sortOrder } = parseSortParams(req, allowedSortFields)

    // Get user's organizations via memberships
    const { data: memberships, error: memError } = await supabase
      .from('memberships')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (memError) {
      console.error('[GET /api/psi/equipment] Membership error:', memError)
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
      .from('psi_equipment')
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

    const equipmentType = searchParams.get('equipment_type')
    if (equipmentType) {
      query = query.eq('equipment_type', equipmentType)
    }

    const status = searchParams.get('status')
    if (status) {
      query = query.eq('status', status)
    }

    const search = searchParams.get('search')
    if (search) {
      // Search in multiple fields
      query = query.or(
        `identifier.ilike.%${search}%,location.ilike.%${search}%,manufacturer.ilike.%${search}%,model.ilike.%${search}%`
      )
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[GET /api/psi/equipment] Query error:', error)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea echipamentelor PSI',
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
    console.error('[GET /api/psi/equipment]', error)
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
 * POST /api/psi/equipment
 * Create new PSI equipment
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
    const result = createPSIEquipmentSchema.safeParse(body)

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

    const data: CreatePSIEquipmentInput = result.data

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
          message: accessCheck.error || 'Nu ai permisiunea să adaugi echipamente PSI în această organizație',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Create equipment
    const { data: newEquipment, error: createError } = await supabase
      .from('psi_equipment')
      .insert({
        ...data,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*, organizations(id, name, cui)')
      .single()

    if (createError) {
      console.error('[POST /api/psi/equipment] Create error:', createError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la crearea echipamentului PSI',
          details: createError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json(newEquipment, { status: 201 })
  } catch (error) {
    console.error('[POST /api/psi/equipment]', error)
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
