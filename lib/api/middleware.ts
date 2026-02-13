// lib/api/middleware.ts
// API Middleware utilities for V1 API
// Provides auth, validation, error handling, and RBAC checks

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { z, ZodSchema } from 'zod'

export interface ApiContext {
  userId: string
  userEmail: string
  organizationId?: string
  role?: string
}

export interface ApiError {
  error: string
  message: string
  details?: any
  code?: string
}

/**
 * Middleware: Authentication
 * Verifies user is authenticated via Supabase Auth
 */
export function withAuth(
  handler: (req: NextRequest, context: ApiContext) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const supabase = await createSupabaseServer()
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

      const context: ApiContext = {
        userId: user.id,
        userEmail: user.email || ''
      }

      return await handler(req, context)
    } catch (error) {
      console.error('[withAuth] Error:', error)
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Eroare la verificarea autentificării',
          code: 'AUTH_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware: Request Validation
 * Validates request body against Zod schema
 */
export function withValidation<T>(schema: ZodSchema<T>) {
  return (
    handler: (req: NextRequest, context: ApiContext, data: T) => Promise<NextResponse>
  ) => {
    return async (req: NextRequest, context: ApiContext): Promise<NextResponse> => {
      try {
        const body = await req.json().catch(() => ({}))
        const result = schema.safeParse(body)

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

        return await handler(req, context, result.data)
      } catch (error) {
        console.error('[withValidation] Error:', error)
        return NextResponse.json(
          {
            error: 'Bad Request',
            message: 'Format JSON invalid',
            code: 'INVALID_JSON'
          } as ApiError,
          { status: 400 }
        )
      }
    }
  }
}

/**
 * Middleware: Error Handler
 * Wraps handler with try-catch and formats errors consistently
 */
export function withErrorHandler(
  handler: (req: NextRequest, context?: ApiContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: ApiContext): Promise<NextResponse> => {
    try {
      return await handler(req, context)
    } catch (error) {
      console.error('[API Error]:', error)

      // Handle known error types
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'Date de intrare invalide',
            details: error.format(),
            code: 'VALIDATION_ERROR'
          } as ApiError,
          { status: 400 }
        )
      }

      // Generic error
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
}

/**
 * Middleware: Organization Access Check
 * Verifies user has access to specified organization via memberships
 */
export async function checkOrganizationAccess(
  userId: string,
  organizationId: string,
  requiredRole?: string[]
): Promise<{ hasAccess: boolean; role?: string; error?: string }> {
  try {
    const supabase = await createSupabaseServer()

    const { data: membership, error } = await supabase
      .from('memberships')
      .select('role, is_active')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (error || !membership) {
      return {
        hasAccess: false,
        error: 'Nu ai acces la această organizație'
      }
    }

    // Check role if specified
    if (requiredRole && requiredRole.length > 0) {
      if (!requiredRole.includes(membership.role)) {
        return {
          hasAccess: false,
          role: membership.role,
          error: `Rol insuficient. Necesar: ${requiredRole.join(' sau ')}`
        }
      }
    }

    return {
      hasAccess: true,
      role: membership.role
    }
  } catch (error) {
    console.error('[checkOrganizationAccess] Error:', error)
    return {
      hasAccess: false,
      error: 'Eroare la verificarea accesului'
    }
  }
}

/**
 * Helper: Parse pagination parameters from URL
 */
export function parsePaginationParams(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Helper: Parse sorting parameters from URL
 */
export function parseSortParams(req: NextRequest, allowedFields: string[]) {
  const { searchParams } = new URL(req.url)
  const sortBy = searchParams.get('sort_by') || 'created_at'
  const sortOrder = (searchParams.get('sort_order') || 'desc').toLowerCase()

  // Validate sort field
  const validSortBy = allowedFields.includes(sortBy) ? sortBy : 'created_at'
  const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc'

  return {
    sortBy: validSortBy,
    sortOrder: validSortOrder as 'asc' | 'desc'
  }
}

/**
 * Helper: Build paginated response
 */
export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage
    }
  }
}

/**
 * Middleware: Organization Access Check
 * Verifies user is member of organization specified in URL
 */
export function withOrgAccess(
  handler: (req: NextRequest, context: ApiContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: ApiContext): Promise<NextResponse> => {
    try {
      // Extract organization ID from URL params
      const url = new URL(req.url)
      const pathParts = url.pathname.split('/')
      const orgIndex = pathParts.findIndex(part => part === 'organizations')
      const organizationId = orgIndex !== -1 ? pathParts[orgIndex + 1] : null

      if (!organizationId) {
        return NextResponse.json(
          {
            error: 'Bad Request',
            message: 'Organization ID lipsește din URL',
            code: 'ORG_ID_REQUIRED'
          } as ApiError,
          { status: 400 }
        )
      }

      const access = await checkOrganizationAccess(context.userId, organizationId)

      if (!access.hasAccess) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: access.error || 'Nu ai acces la această organizație',
            code: 'ORG_ACCESS_DENIED'
          } as ApiError,
          { status: 403 }
        )
      }

      // Add org context
      context.organizationId = organizationId
      context.role = access.role

      return await handler(req, context)
    } catch (error) {
      console.error('[withOrgAccess] Error:', error)
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Eroare la verificarea accesului la organizație',
          code: 'ORG_ACCESS_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware: Admin Role Check
 * Verifies user has admin/consultant role
 */
export function withAdmin(
  handler: (req: NextRequest, context: ApiContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: ApiContext): Promise<NextResponse> => {
    try {
      if (!context.role) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Informații despre rol lipsesc',
            code: 'ROLE_INFO_MISSING'
          } as ApiError,
          { status: 403 }
        )
      }

      const adminRoles = ['consultant', 'firma_admin']
      if (!adminRoles.includes(context.role)) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Această acțiune necesită rol de administrator',
            code: 'ADMIN_REQUIRED'
          } as ApiError,
          { status: 403 }
        )
      }

      return await handler(req, context)
    } catch (error) {
      console.error('[withAdmin] Error:', error)
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Eroare la verificarea rolului de admin',
          code: 'ADMIN_CHECK_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware: API Key Authentication
 * Authenticates using X-API-Key header
 */
export function withApiKey(
  handler: (req: NextRequest, context: ApiContext) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const apiKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key')

      if (!apiKey) {
        return NextResponse.json(
          {
            error: 'Unauthorized',
            message: 'API key lipsește. Folosește header X-API-Key',
            code: 'API_KEY_REQUIRED'
          } as ApiError,
          { status: 401 }
        )
      }

      // Import verifyApiKey dynamically to avoid circular dependencies
      const { verifyApiKey } = await import('@/lib/services/api-key-service')
      const keyData = await verifyApiKey(apiKey)

      if (!keyData) {
        return NextResponse.json(
          {
            error: 'Unauthorized',
            message: 'API key invalid sau expirat',
            code: 'API_KEY_INVALID'
          } as ApiError,
          { status: 401 }
        )
      }

      const context: ApiContext = {
        userId: keyData.created_by,
        userEmail: '',
        organizationId: keyData.organization_id,
        role: 'api_key'
      }

      return await handler(req, context)
    } catch (error) {
      console.error('[withApiKey] Error:', error)
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Eroare la verificarea API key',
          code: 'API_KEY_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }
  }
}
