// app/api/psi/inspections/route.ts
// M2_PSI API: Inspections List & Create
// GET - List inspections with filters and pagination
// POST - Create inspection and auto-update equipment

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
  createPSIInspectionSchema,
  CreatePSIInspectionInput
} from '@/lib/api/validation'

/**
 * GET /api/psi/inspections
 * List PSI inspections with optional filtering, sorting, and pagination
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
    const allowedSortFields = ['inspection_date', 'result', 'next_inspection_date', 'created_at']
    const { sortBy, sortOrder } = parseSortParams(req, allowedSortFields)

    // Get user's organizations via memberships
    const { data: memberships, error: memError } = await supabase
      .from('memberships')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (memError) {
      console.error('[GET /api/psi/inspections] Membership error:', memError)
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
      return NextResponse.json(
        buildPaginatedResponse([], 0, page, limit)
      )
    }

    // Build query with filters
    let query = supabase
      .from('psi_inspections')
      .select(`
        *,
        psi_equipment(id, equipment_type, identifier, location, status),
        organizations(id, name, cui)
      `, { count: 'exact' })
      .in('organization_id', orgIds)

    // Apply filters
    const organizationId = searchParams.get('organization_id')
    if (organizationId) {
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

    const equipmentId = searchParams.get('equipment_id')
    if (equipmentId) {
      query = query.eq('equipment_id', equipmentId)
    }

    const result = searchParams.get('result')
    if (result) {
      query = query.eq('result', result)
    }

    const dateFrom = searchParams.get('date_from')
    if (dateFrom) {
      query = query.gte('inspection_date', dateFrom)
    }

    const dateTo = searchParams.get('date_to')
    if (dateTo) {
      query = query.lte('inspection_date', dateTo)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[GET /api/psi/inspections] Query error:', error)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea inspecțiilor PSI',
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
    console.error('[GET /api/psi/inspections]', error)
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
 * POST /api/psi/inspections
 * Create new inspection and auto-update equipment
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
    const result = createPSIInspectionSchema.safeParse(body)

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

    const data: CreatePSIInspectionInput = result.data

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
          message: accessCheck.error || 'Nu ai permisiunea să adaugi inspecții PSI în această organizație',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Verify equipment belongs to same organization
    const { data: equipment, error: equipmentError } = await supabase
      .from('psi_equipment')
      .select('id, organization_id')
      .eq('id', data.equipment_id)
      .single()

    if (equipmentError || !equipment) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Echipamentul PSI nu a fost găsit',
          code: 'EQUIPMENT_NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    if (equipment.organization_id !== data.organization_id) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Echipamentul nu aparține acestei organizații',
          code: 'ORGANIZATION_MISMATCH'
        } as ApiError,
        { status: 403 }
      )
    }

    // Insert inspection
    const { data: newInspection, error: createError } = await supabase
      .from('psi_inspections')
      .insert({
        ...data,
        created_by: user.id,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        psi_equipment(id, equipment_type, identifier, location, status),
        organizations(id, name, cui)
      `)
      .single()

    if (createError) {
      console.error('[POST /api/psi/inspections] Create error:', createError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la crearea inspecției PSI',
          details: createError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    // Auto-update equipment with inspection dates and status
    const updateData: any = {
      last_inspection_date: data.inspection_date,
      next_inspection_date: data.next_inspection_date,
      updated_at: new Date().toISOString()
    }

    // Update status based on inspection result
    if (data.result === 'conform' || data.result === 'conform_cu_observatii') {
      updateData.status = 'operational'
    } else if (data.result === 'neconform') {
      updateData.status = 'needs_repair'
    }

    const { error: updateError } = await supabase
      .from('psi_equipment')
      .update(updateData)
      .eq('id', data.equipment_id)

    if (updateError) {
      console.error('[POST /api/psi/inspections] Equipment update error:', updateError)
      // Non-fatal error - inspection was created, but equipment update failed
      // Log it but return the inspection
    }

    return NextResponse.json(newInspection, { status: 201 })
  } catch (error) {
    console.error('[POST /api/psi/inspections]', error)
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
