// app/api/v1/legislation/route.ts
// V1 API: Legislation/Obligations List & Admin Operations
// GET list with country/domain filter, POST trigger pipeline (admin)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import {
  parsePaginationParams,
  parseSortParams,
  buildPaginatedResponse,
  ApiError,
} from '@/lib/api/middleware'
import type { CountryCode, ObligationStatus } from '@/lib/types'
import { runPipeline, type PipelineOptions } from '@/lib/services/legislation-pipeline'

/**
 * @openapi
 * /api/v1/legislation:
 *   get:
 *     summary: List legislation obligations
 *     description: Get paginated list of published obligations with filtering by country, domain, and status
 *     tags:
 *       - Legislation
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
 *           enum: [created_at, published_at, source_legal_act, confidence]
 *           default: published_at
 *         description: Field to sort by
 *       - name: sort_order
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - name: country_code
 *         in: query
 *         schema:
 *           type: string
 *           enum: [RO, BG, HU, DE, PL]
 *         description: Filter by country code
 *       - name: domain
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ssm, psi, gdpr, labor, environmental, construction, transport, food_safety, other]
 *         description: Filter by domain (filters industry_tags array)
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [draft, validated, approved, published, archived]
 *         description: Filter by obligation status (admin only for non-published)
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search in obligation_text and source_legal_act
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
 *                     $ref: '#/components/schemas/Obligation'
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
    const allowedSortFields = ['created_at', 'published_at', 'source_legal_act', 'confidence', 'extracted_at']
    const { sortBy, sortOrder } = parseSortParams(req, allowedSortFields)

    // Check if user is admin (can see non-published obligations)
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role_id, roles(role_key)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .in('roles.role_key', ['super_admin', 'admin'])
      .maybeSingle()

    const isAdmin = !!adminRole

    // Get user's accessible countries (from their organizations)
    const { data: memberships } = await supabase
      .from('memberships')
      .select('organization_id, organizations(country_code)')
      .eq('user_id', user.id)
      .eq('is_active', true)

    const userCountries = memberships
      ?.map((m: any) => m.organizations?.country_code)
      .filter(Boolean) || []

    // Build query
    let query = supabase
      .from('obligations')
      .select('*', { count: 'exact' })

    // Apply country filter
    const countryCode = searchParams.get('country_code')
    if (countryCode) {
      query = query.eq('country_code', countryCode as CountryCode)
    } else if (!isAdmin && userCountries.length > 0) {
      // Non-admins only see obligations for their countries
      query = query.in('country_code', userCountries)
    }

    // Apply status filter
    const status = searchParams.get('status') as ObligationStatus | null
    if (status) {
      if (!isAdmin && status !== 'published') {
        // Non-admins can only filter by published
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Nu ai permisiunea să vezi obligații nepublicate',
            code: 'INSUFFICIENT_PERMISSIONS'
          } as ApiError,
          { status: 403 }
        )
      }
      query = query.eq('status', status)
    } else if (!isAdmin) {
      // Non-admins only see published obligations
      query = query.eq('status', 'published').eq('published', true)
    }

    // Apply domain filter (searches in industry_tags array)
    const domain = searchParams.get('domain')
    if (domain) {
      query = query.contains('industry_tags', [domain])
    }

    // Apply search
    const search = searchParams.get('search')
    if (search) {
      query = query.or(
        `obligation_text.ilike.%${search}%,source_legal_act.ilike.%${search}%`
      )
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[GET /api/v1/legislation] Query error:', error)
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

    return NextResponse.json(
      buildPaginatedResponse(data || [], count || 0, page, limit)
    )
  } catch (error) {
    console.error('[GET /api/v1/legislation]', error)
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
 * /api/v1/legislation:
 *   post:
 *     summary: Trigger legislation pipeline (Admin only)
 *     description: Start the legislation scraping and processing pipeline for a country
 *     tags:
 *       - Legislation
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country_code
 *             properties:
 *               country_code:
 *                 type: string
 *                 enum: [RO, BG, HU, DE, PL]
 *                 description: Country code to process
 *               source:
 *                 type: string
 *                 description: RSS feed source URL
 *               options:
 *                 type: object
 *                 properties:
 *                   sinceDays:
 *                     type: integer
 *                     default: 7
 *                     description: How many days back to scrape
 *                   maxEntries:
 *                     type: integer
 *                     default: 100
 *                     description: Maximum entries to process
 *                   dryRun:
 *                     type: boolean
 *                     default: false
 *                     description: Dry run mode (no DB writes)
 *                   stopAtStage:
 *                     type: string
 *                     enum: [M1, M2, M3, M4]
 *                     description: Stop pipeline at specific stage
 *                   notifyOrganizations:
 *                     type: boolean
 *                     default: true
 *                     description: Notify organizations about new obligations
 *     responses:
 *       202:
 *         description: Pipeline started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pipeline_id:
 *                   type: string
 *                 country_code:
 *                   type: string
 *                 started_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
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
          message: 'Doar administratorii pot declanșa pipeline-ul de legislație',
          code: 'INSUFFICIENT_PERMISSIONS'
        } as ApiError,
        { status: 403 }
      )
    }

    // Parse request body
    const body = await req.json().catch(() => ({}))
    const { country_code, source, options } = body

    if (!country_code) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'country_code este obligatoriu',
          code: 'VALIDATION_ERROR'
        } as ApiError,
        { status: 400 }
      )
    }

    const validCountries: CountryCode[] = ['RO', 'BG', 'HU', 'DE', 'PL']
    if (!validCountries.includes(country_code)) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'country_code invalid. Trebuie să fie: RO, BG, HU, DE, PL',
          code: 'VALIDATION_ERROR'
        } as ApiError,
        { status: 400 }
      )
    }

    // Determine source URL
    const sourceUrl = source || getDefaultSourceForCountry(country_code)

    // Build pipeline options
    const pipelineOptions: PipelineOptions = {
      sinceDays: options?.sinceDays || 7,
      maxEntries: options?.maxEntries || 100,
      dryRun: options?.dryRun || false,
      stopAtStage: options?.stopAtStage,
      notifyOrganizations: options?.notifyOrganizations !== false,
      verbose: true
    }

    // Generate pipeline ID for tracking
    const pipelineId = `pipeline_${country_code}_${Date.now()}`
    const startedAt = new Date().toISOString()

    // Start pipeline asynchronously (non-blocking)
    // In production, this should use a job queue like BullMQ or Vercel Queue
    runPipeline(country_code, sourceUrl, pipelineOptions)
      .then(result => {
        console.log(`[Pipeline ${pipelineId}] Completed with status: ${result.status}`)
      })
      .catch(error => {
        console.error(`[Pipeline ${pipelineId}] Failed:`, error)
      })

    return NextResponse.json(
      {
        message: 'Pipeline-ul de legislație a fost declanșat cu succes',
        pipeline_id: pipelineId,
        country_code,
        source: sourceUrl,
        started_at: startedAt,
        options: pipelineOptions
      },
      { status: 202 }
    )
  } catch (error) {
    console.error('[POST /api/v1/legislation]', error)
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
 * Get default RSS source URL for a country
 */
function getDefaultSourceForCountry(countryCode: CountryCode): string {
  const sources: Record<CountryCode, string> = {
    'RO': 'https://legislatie.just.ro/Public/RssFS/RSS',
    'BG': 'https://dv.parliament.bg/rss',
    'HU': 'https://magyarkozlony.hu/rss',
    'DE': 'https://www.bgbl.de/rss.xml',
    'PL': 'https://monitorpolski.gov.pl/rss'
  }
  return sources[countryCode] || sources['RO']
}
