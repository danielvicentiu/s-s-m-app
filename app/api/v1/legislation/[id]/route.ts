// app/api/v1/legislation/[id]/route.ts
// V1 API: Legislation/Obligation Detail Operations
// GET obligation by ID with related data, PATCH update status (admin)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { ApiError } from '@/lib/api/middleware'
import type { ObligationStatus } from '@/lib/types'

/**
 * @openapi
 * /api/v1/legislation/{id}:
 *   get:
 *     summary: Get obligation by ID
 *     description: Get detailed obligation information including assigned organizations
 *     tags:
 *       - Legislation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Obligation ID
 *       - name: include
 *         in: query
 *         schema:
 *           type: string
 *           enum: [organizations, all]
 *         description: Include related data (organizations assigned to this obligation)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Obligation'
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

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role_id, roles(role_key)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .in('roles.role_key', ['super_admin', 'admin'])
      .maybeSingle()

    const isAdmin = !!adminRole

    // Fetch obligation
    const { data: obligation, error: obligationError } = await supabase
      .from('obligations')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (obligationError) {
      console.error('[GET /api/v1/legislation/:id] Query error:', obligationError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea obligației',
          details: obligationError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    if (!obligation) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Obligația nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Check access (non-admins can only see published obligations)
    if (!isAdmin && (obligation.status !== 'published' || !obligation.published)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Nu ai acces la această obligație',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Check if user's country matches (for non-admins)
    if (!isAdmin) {
      const { data: memberships } = await supabase
        .from('memberships')
        .select('organizations(country_code)')
        .eq('user_id', user.id)
        .eq('is_active', true)

      const userCountries = memberships
        ?.map((m: any) => m.organizations?.country_code)
        .filter(Boolean) || []

      if (!userCountries.includes(obligation.country_code)) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Nu ai acces la obligații din această țară',
            code: 'INSUFFICIENT_PERMISSIONS'
          } as ApiError,
          { status: 403 }
        )
      }
    }

    // Build result
    const result: any = { ...obligation }

    // Include organizations if requested
    const include = searchParams.get('include')
    if (include === 'organizations' || include === 'all') {
      const { data: orgObligations } = await supabase
        .from('organization_obligations')
        .select(`
          id,
          status,
          assigned_at,
          acknowledged_at,
          compliant_at,
          match_score,
          match_reason,
          organizations(id, name, cui, country_code)
        `)
        .eq('obligation_id', id)
        .order('assigned_at', { ascending: false })

      result.assigned_organizations = orgObligations || []
      result.assigned_count = orgObligations?.length || 0
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[GET /api/v1/legislation/:id]', error)
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
 * /api/v1/legislation/{id}:
 *   patch:
 *     summary: Update obligation status (Admin only)
 *     description: Update obligation status and approval information
 *     tags:
 *       - Legislation
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Obligation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, validated, approved, published, archived]
 *                 description: New obligation status
 *               validation_score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 description: Validation score (0-1)
 *               published:
 *                 type: boolean
 *                 description: Whether obligation is published
 *               caen_codes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: CAEN codes for targeting
 *               industry_tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Industry tags for targeting
 *     responses:
 *       200:
 *         description: Obligation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Obligation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
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

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role_id, roles(role_key)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .in('roles.role_key', ['super_admin', 'admin'])
      .maybeSingle()

    if (!adminRole) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Doar administratorii pot modifica obligații',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Fetch existing obligation
    const { data: existingObligation, error: fetchError } = await supabase
      .from('obligations')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      console.error('[PATCH /api/v1/legislation/:id] Fetch error:', fetchError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea obligației',
          details: fetchError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    if (!existingObligation) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Obligația nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Parse request body
    const body = await req.json().catch(() => ({}))
    const { status, validation_score, published, caen_codes, industry_tags } = body

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Validate and set status
    if (status !== undefined) {
      const validStatuses: ObligationStatus[] = ['draft', 'validated', 'approved', 'published', 'archived']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'Status invalid. Trebuie să fie: draft, validated, approved, published, archived',
            code: 'VALIDATION_ERROR'
          } as ApiError,
          { status: 400 }
        )
      }
      updateData.status = status

      // Set status-specific timestamps
      if (status === 'validated' && !existingObligation.validated_at) {
        updateData.validated_at = new Date().toISOString()
      }
      if (status === 'approved' && !existingObligation.approved_at) {
        updateData.approved_at = new Date().toISOString()
        updateData.approved_by = user.id
      }
      if (status === 'published' && !existingObligation.published_at) {
        updateData.published_at = new Date().toISOString()
        updateData.published = true
      }
    }

    // Set validation score
    if (validation_score !== undefined) {
      if (typeof validation_score !== 'number' || validation_score < 0 || validation_score > 1) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'validation_score trebuie să fie între 0 și 1',
            code: 'VALIDATION_ERROR'
          } as ApiError,
          { status: 400 }
        )
      }
      updateData.validation_score = validation_score
    }

    // Set published flag
    if (published !== undefined) {
      updateData.published = published
      if (published && !existingObligation.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    // Set CAEN codes
    if (caen_codes !== undefined) {
      if (!Array.isArray(caen_codes)) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'caen_codes trebuie să fie un array',
            code: 'VALIDATION_ERROR'
          } as ApiError,
          { status: 400 }
        )
      }
      updateData.caen_codes = caen_codes
    }

    // Set industry tags
    if (industry_tags !== undefined) {
      if (!Array.isArray(industry_tags)) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'industry_tags trebuie să fie un array',
            code: 'VALIDATION_ERROR'
          } as ApiError,
          { status: 400 }
        )
      }
      updateData.industry_tags = industry_tags
    }

    // Update obligation
    const { data: updatedObligation, error: updateError } = await supabase
      .from('obligations')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (updateError) {
      console.error('[PATCH /api/v1/legislation/:id] Update error:', updateError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la actualizarea obligației',
          details: updateError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json(updatedObligation)
  } catch (error) {
    console.error('[PATCH /api/v1/legislation/:id]', error)
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
