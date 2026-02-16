// app/api/psi/equipment/[id]/route.ts
// M2_PSI API: Equipment Detail Operations
// GET - Get single equipment by ID
// PUT - Update equipment
// DELETE - Delete equipment

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { ApiError, checkOrganizationAccess } from '@/lib/api/middleware'
import { updatePSIEquipmentSchema, UpdatePSIEquipmentInput } from '@/lib/api/validation'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/psi/equipment/[id]
 * Get single PSI equipment by ID
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
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

    // Get user's organizations
    const { data: memberships } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)

    const orgIds = memberships?.map(m => m.organization_id) || []

    // Fetch equipment
    const { data: equipment, error } = await supabase
      .from('psi_equipment')
      .select('*, organizations(id, name, cui)')
      .eq('id', id)
      .in('organization_id', orgIds)
      .single()

    if (error || !equipment) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Echipamentul PSI nu a fost găsit',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Fetch latest inspection (optional)
    const { data: latestInspection } = await supabase
      .from('psi_inspections')
      .select('*')
      .eq('equipment_id', id)
      .order('inspection_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    return NextResponse.json({
      ...equipment,
      latest_inspection: latestInspection
    })
  } catch (error) {
    console.error('[GET /api/psi/equipment/[id]]', error)
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
 * PUT /api/psi/equipment/[id]
 * Update PSI equipment
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
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

    // Validate request body
    const body = await req.json().catch(() => ({}))
    const result = updatePSIEquipmentSchema.safeParse(body)

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

    const data: UpdatePSIEquipmentInput = result.data

    // Get equipment to verify organization
    const { data: equipment, error: fetchError } = await supabase
      .from('psi_equipment')
      .select('organization_id')
      .eq('id', id)
      .single()

    if (fetchError || !equipment) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Echipamentul PSI nu a fost găsit',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check organization access
    const accessCheck = await checkOrganizationAccess(
      user.id,
      equipment.organization_id,
      ['consultant', 'firma_admin']
    )

    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea să modifici acest echipament PSI',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Update equipment
    const { data: updatedEquipment, error: updateError } = await supabase
      .from('psi_equipment')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, organizations(id, name, cui)')
      .single()

    if (updateError) {
      console.error('[PUT /api/psi/equipment/[id]] Update error:', updateError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la actualizarea echipamentului PSI',
          details: updateError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json(updatedEquipment)
  } catch (error) {
    console.error('[PUT /api/psi/equipment/[id]]', error)
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
 * DELETE /api/psi/equipment/[id]
 * Delete PSI equipment
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    // Get equipment to verify organization
    const { data: equipment, error: fetchError } = await supabase
      .from('psi_equipment')
      .select('organization_id')
      .eq('id', id)
      .single()

    if (fetchError || !equipment) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Echipamentul PSI nu a fost găsit',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check organization access
    const accessCheck = await checkOrganizationAccess(
      user.id,
      equipment.organization_id,
      ['consultant', 'firma_admin']
    )

    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea să ștergi acest echipament PSI',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Delete equipment (will cascade to inspections via ON DELETE CASCADE)
    const { error: deleteError } = await supabase
      .from('psi_equipment')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('[DELETE /api/psi/equipment/[id]] Delete error:', deleteError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la ștergerea echipamentului PSI',
          details: deleteError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/psi/equipment/[id]]', error)
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
