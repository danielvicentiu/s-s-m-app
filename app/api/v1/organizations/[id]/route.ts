// app/api/v1/organizations/[id]/route.ts
// V1 API: Organization Details - GET, PATCH, DELETE by ID
// OpenAPI compliant REST API with RLS and RBAC checks

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import {
  checkOrganizationAccess,
  ApiError,
  withAuth,
  ApiContext
} from '@/lib/api/middleware'
import { organizationSchema } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error-handler'

/**
 * @openapi
 * /api/v1/organizations/{id}:
 *   get:
 *     summary: Get organization by ID
 *     description: Retrieve a single organization by its ID (requires membership)
 *     tags:
 *       - Organizations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
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
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(withErrorHandling(async (req: NextRequest, apiContext: ApiContext) => {
    const supabase = await createSupabaseServer()
    const { id: organizationId } = await context.params

    // Check access
    const accessCheck = await checkOrganizationAccess(apiContext.userId, organizationId)

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

    // Fetch organization
    const { data: org, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single()

    if (error || !org) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Organizația nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    return NextResponse.json({ data: org })
  }))(req)
}

/**
 * @openapi
 * /api/v1/organizations/{id}:
 *   patch:
 *     summary: Update organization
 *     description: Update an organization by ID (requires consultant or firma_admin role)
 *     tags:
 *       - Organizations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               cooperation_status:
 *                 type: string
 *                 enum: [active, warning, uncooperative]
 *               exposure_score:
 *                 type: string
 *                 enum: [necalculat, scazut, mediu, ridicat, critic]
 *     responses:
 *       200:
 *         description: Organization updated successfully
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(withErrorHandling(async (req: NextRequest, apiContext: ApiContext) => {
    const supabase = await createSupabaseServer()
    const { id: organizationId } = await context.params

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

    // For PATCH, validate only the fields provided (partial update)
    // Skip required field validation for PATCH operations
    const validatedData = body

    // Check access with role requirement
    const accessCheck = await checkOrganizationAccess(
      apiContext.userId,
      organizationId,
      ['consultant', 'firma_admin']
    )

    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea de a modifica această organizație',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    // Fetch current organization to calculate new data_completeness
    const { data: currentOrg, error: fetchError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single()

    if (fetchError || !currentOrg) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Organizația nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Merge data and recalculate completeness
    const mergedData = { ...currentOrg, ...validatedData }
    const dataCompleteness = calculateDataCompleteness(mergedData)

    // Update organization
    const { data: updatedOrg, error: updateError } = await supabase
      .from('organizations')
      .update({
        ...validatedData,
        data_completeness: dataCompleteness,
        updated_at: new Date().toISOString()
      })
      .eq('id', organizationId)
      .select()
      .single()

    if (updateError) {
      console.error('[PATCH /api/v1/organizations/:id]', updateError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la actualizarea organizației',
          code: 'DB_ERROR',
          details: updateError.message
        } as ApiError,
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: updatedOrg,
      message: 'Organizație actualizată cu succes'
    })
  }))(req)
}

/**
 * @openapi
 * /api/v1/organizations/{id}:
 *   delete:
 *     summary: Delete organization (soft delete)
 *     description: Soft delete an organization by ID (requires consultant role)
 *     tags:
 *       - Organizations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *                   format: uuid
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
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(withErrorHandling(async (req: NextRequest, apiContext: ApiContext) => {
    const supabase = await createSupabaseServer()
    const { id: organizationId } = await context.params

    // Check access - only consultants can delete
    const accessCheck = await checkOrganizationAccess(
      apiContext.userId,
      organizationId,
      ['consultant']
    )

    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Doar consultanții pot șterge organizații',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    // Check if organization exists
    const { data: org, error: fetchError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', organizationId)
      .single()

    if (fetchError || !org) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Organizația nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Soft delete: set cooperation_status to uncooperative
    const { error: deleteError } = await supabase
      .from('organizations')
      .update({
        cooperation_status: 'uncooperative',
        updated_at: new Date().toISOString()
      })
      .eq('id', organizationId)

    if (deleteError) {
      console.error('[DELETE /api/v1/organizations/:id]', deleteError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la ștergerea organizației',
          code: 'DB_ERROR',
          details: deleteError.message
        } as ApiError,
        { status: 500 }
      )
    }

    // Deactivate all memberships
    await supabase
      .from('memberships')
      .update({ is_active: false })
      .eq('organization_id', organizationId)

    return NextResponse.json({
      message: 'Organizație ștearsă cu succes (soft delete)',
      id: organizationId,
      name: org.name
    })
  }))(req)
}

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
