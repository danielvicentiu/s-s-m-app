// app/api/v1/legislation/organizations/[orgId]/route.ts
// V1 API: Get obligations for specific organization based on industry/CAEN matching
// Returns published obligations that match the organization's country, CAEN codes, and industry

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import {
  parsePaginationParams,
  parseSortParams,
  buildPaginatedResponse,
  ApiError,
  checkOrganizationAccess
} from '@/lib/api/middleware'
import type { OrgObligationStatus } from '@/lib/types'

/**
 * @openapi
 * /api/v1/legislation/organizations/{orgId}:
 *   get:
 *     summary: Get obligations for organization
 *     description: Get published obligations that apply to this organization based on country, CAEN codes, and industry tags
 *     tags:
 *       - Legislation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
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
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, acknowledged, compliant, non_compliant, all]
 *         description: Filter by organization obligation status (default - all assigned)
 *       - name: assigned_only
 *         in: query
 *         schema:
 *           type: boolean
 *           default: false
 *         description: If true, only show obligations already assigned to this org
 *       - name: domain
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ssm, psi, gdpr, labor, environmental, construction, transport, food_safety, other]
 *         description: Filter by domain
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
 *                     type: object
 *                     properties:
 *                       obligation:
 *                         $ref: '#/components/schemas/Obligation'
 *                       assignment:
 *                         type: object
 *                         nullable: true
 *                         description: Organization obligation assignment details if exists
 *                         properties:
 *                           id:
 *                             type: string
 *                           status:
 *                             type: string
 *                           assigned_at:
 *                             type: string
 *                           acknowledged_at:
 *                             type: string
 *                           match_score:
 *                             type: number
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 organization:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     country_code:
 *                       type: string
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
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
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

    // Check organization access
    const accessCheck = await checkOrganizationAccess(user.id, orgId)
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Nu ai acces la această organizație',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Fetch organization details
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, cui, country_code, caen_codes, industry_tags')
      .eq('id', orgId)
      .maybeSingle()

    if (orgError) {
      console.error('[GET /api/v1/legislation/organizations/:orgId] Org error:', orgError)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la preluarea organizației',
          details: orgError.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    if (!organization) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Organizația nu a fost găsită',
          code: 'NOT_FOUND'
        } as ApiError,
        { status: 404 }
      )
    }

    // Parse parameters
    const { page, limit, offset } = parsePaginationParams(req)
    const assignedOnly = searchParams.get('assigned_only') === 'true'
    const statusFilter = searchParams.get('status') as OrgObligationStatus | 'all' | null
    const domain = searchParams.get('domain')

    if (assignedOnly) {
      // Show only obligations already assigned to this organization
      let query = supabase
        .from('organization_obligations')
        .select(`
          id,
          status,
          assigned_at,
          acknowledged_at,
          acknowledged_by,
          compliant_at,
          compliant_by,
          notes,
          evidence_urls,
          match_score,
          match_reason,
          obligations(*)
        `, { count: 'exact' })
        .eq('organization_id', orgId)

      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      // Apply sorting by assignment date
      query = query.order('assigned_at', { ascending: false })

      // Apply pagination
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) {
        console.error('[GET /api/v1/legislation/organizations/:orgId] Query error:', error)
        return NextResponse.json(
          {
            error: 'Database Error',
            message: 'Eroare la preluarea obligațiilor',
            details: error.message,
            code: 'DB_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }

      // Transform data to match expected format
      const transformedData = (data || []).map((item: any) => ({
        obligation: item.obligations,
        assignment: {
          id: item.id,
          status: item.status,
          assigned_at: item.assigned_at,
          acknowledged_at: item.acknowledged_at,
          acknowledged_by: item.acknowledged_by,
          compliant_at: item.compliant_at,
          compliant_by: item.compliant_by,
          notes: item.notes,
          evidence_urls: item.evidence_urls,
          match_score: item.match_score,
          match_reason: item.match_reason
        }
      }))

      return NextResponse.json({
        ...buildPaginatedResponse(transformedData, count || 0, page, limit),
        organization: {
          id: organization.id,
          name: organization.name,
          country_code: organization.country_code
        }
      })
    } else {
      // Show all matching obligations (assigned or potential matches)
      // Query published obligations that match organization's country
      let obligationsQuery = supabase
        .from('obligations')
        .select('*', { count: 'exact' })
        .eq('country_code', organization.country_code)
        .eq('status', 'published')
        .eq('published', true)

      // Apply domain filter
      if (domain) {
        obligationsQuery = obligationsQuery.contains('industry_tags', [domain])
      }

      // Filter by CAEN codes or industry tags if organization has them
      // Note: This is a basic matching - in production you'd want more sophisticated matching
      const orgCaenCodes = organization.caen_codes || []
      const orgIndustryTags = organization.industry_tags || []

      // Apply pagination
      obligationsQuery = obligationsQuery
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      const { data: obligations, error: obligationsError, count } = await obligationsQuery

      if (obligationsError) {
        console.error('[GET /api/v1/legislation/organizations/:orgId] Obligations error:', obligationsError)
        return NextResponse.json(
          {
            error: 'Database Error',
            message: 'Eroare la preluarea obligațiilor',
            details: obligationsError.message,
            code: 'DB_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }

      // For each obligation, check if it's already assigned
      const obligationIds = (obligations || []).map((o: any) => o.id)
      const { data: assignments } = await supabase
        .from('organization_obligations')
        .select('*')
        .eq('organization_id', orgId)
        .in('obligation_id', obligationIds)

      const assignmentMap = new Map(
        (assignments || []).map((a: any) => [a.obligation_id, a])
      )

      // Calculate match scores for non-assigned obligations
      const results = (obligations || []).map((obligation: any) => {
        const assignment = assignmentMap.get(obligation.id)

        // Calculate match score if not assigned
        let matchScore = 1.0
        let matchReason = 'country_match'

        if (!assignment) {
          const obligationCaenCodes = obligation.caen_codes || []
          const obligationIndustryTags = obligation.industry_tags || []

          // Check CAEN code overlap
          const caenOverlap = obligationCaenCodes.filter((code: string) =>
            orgCaenCodes.includes(code)
          ).length

          // Check industry tag overlap
          const industryOverlap = obligationIndustryTags.filter((tag: string) =>
            orgIndustryTags.includes(tag)
          ).length

          if (caenOverlap > 0) {
            matchScore = 1.0
            matchReason = 'caen_match'
          } else if (industryOverlap > 0) {
            matchScore = 0.8
            matchReason = 'industry_match'
          } else {
            matchScore = 0.5
            matchReason = 'country_match_only'
          }
        }

        return {
          obligation,
          assignment: assignment || null,
          match_score: (assignment as any)?.match_score || matchScore,
          match_reason: (assignment as any)?.match_reason || matchReason
        }
      })

      // Filter by status if requested (only for assigned obligations)
      let filteredResults = results
      if (statusFilter && statusFilter !== 'all') {
        filteredResults = results.filter((r: any) =>
          r.assignment && r.assignment.status === statusFilter
        )
      }

      return NextResponse.json({
        ...buildPaginatedResponse(filteredResults, count || 0, page, limit),
        organization: {
          id: organization.id,
          name: organization.name,
          country_code: organization.country_code,
          caen_codes: organization.caen_codes,
          industry_tags: organization.industry_tags
        }
      })
    }
  } catch (error) {
    console.error('[GET /api/v1/legislation/organizations/:orgId]', error)
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
