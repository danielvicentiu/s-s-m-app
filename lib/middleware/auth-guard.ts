// lib/middleware/auth-guard.ts
// Reusable API Auth Middleware Guards
// Wraps route handlers with authentication, organization access, and role checks
// Compatible with Next.js App Router API routes

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin, getMyRoles, hasRole, type RoleKey } from '@/lib/rbac'

// ── Types ──

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    email: string
  }
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>
}

export interface OrgAccessRequest extends AuthenticatedRequest {
  organizationId: string
  membershipRole: string
}

export interface ApiError {
  error: string
  message: string
  details?: any
  code: string
}

export type RouteHandler = (req: NextRequest) => Promise<NextResponse>
export type AuthenticatedHandler = (req: AuthenticatedRequest) => Promise<NextResponse>
export type OrgAccessHandler = (req: OrgAccessRequest) => Promise<NextResponse>

// ── Core Middleware Guards ──

/**
 * withAuth - Basic authentication guard
 *
 * Verifies user is authenticated via Supabase session.
 * Attaches user and supabase client to request object.
 * Returns 401 if no valid session.
 *
 * @example
 * export const GET = withAuth(async (req) => {
 *   const userId = req.user.id
 *   // ... your logic
 * })
 */
export function withAuth(handler: AuthenticatedHandler): RouteHandler {
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

      // Attach user and supabase to request
      const authenticatedReq = Object.assign(req, {
        user: {
          id: user.id,
          email: user.email || ''
        },
        supabase
      }) as AuthenticatedRequest

      return await handler(authenticatedReq)
    } catch (error) {
      console.error('[withAuth] Error:', error)
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Eroare la verificarea autentificării',
          details: error instanceof Error ? error.message : String(error),
          code: 'AUTH_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }
  }
}

/**
 * withOrgAccess - Organization membership guard with role check
 *
 * Verifies user has access to organization via memberships table.
 * Optionally checks for specific role(s).
 * Attaches organizationId and membershipRole to request.
 *
 * @param getOrgId - Function to extract organization ID from request (URL params, body, etc.)
 * @param requiredRoles - Optional array of allowed membership roles ('consultant', 'firma_admin', 'angajat')
 *
 * @example
 * export const GET = withOrgAccess(
 *   (req) => req.nextUrl.searchParams.get('org_id') || '',
 *   ['consultant', 'firma_admin']
 * )(async (req) => {
 *   const orgId = req.organizationId
 *   const role = req.membershipRole
 *   // ... your logic
 * })
 */
export function withOrgAccess(
  getOrgId: (req: NextRequest) => string | Promise<string>,
  requiredRoles?: ('consultant' | 'firma_admin' | 'angajat')[]
) {
  return (handler: OrgAccessHandler): RouteHandler => {
    return withAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
      try {
        // Extract organization ID
        const organizationId = await getOrgId(req)

        if (!organizationId) {
          return NextResponse.json(
            {
              error: 'Bad Request',
              message: 'ID-ul organizației lipsește',
              code: 'MISSING_ORG_ID'
            } as ApiError,
            { status: 400 }
          )
        }

        // Check membership
        const { data: membership, error: memError } = await req.supabase
          .from('memberships')
          .select('role, is_active')
          .eq('user_id', req.user.id)
          .eq('organization_id', organizationId)
          .eq('is_active', true)
          .single()

        if (memError || !membership) {
          return NextResponse.json(
            {
              error: 'Forbidden',
              message: 'Nu ai acces la această organizație',
              code: 'NO_ORG_ACCESS'
            } as ApiError,
            { status: 403 }
          )
        }

        // Check role if specified
        if (requiredRoles && requiredRoles.length > 0) {
          if (!requiredRoles.includes(membership.role as any)) {
            return NextResponse.json(
              {
                error: 'Forbidden',
                message: `Rol insuficient. Necesar: ${requiredRoles.join(' sau ')}. Rol curent: ${membership.role}`,
                code: 'INSUFFICIENT_ROLE'
              } as ApiError,
              { status: 403 }
            )
          }
        }

        // Attach org data to request
        const orgAccessReq = Object.assign(req, {
          organizationId,
          membershipRole: membership.role
        }) as OrgAccessRequest

        return await handler(orgAccessReq)
      } catch (error) {
        console.error('[withOrgAccess] Error:', error)
        return NextResponse.json(
          {
            error: 'Internal Server Error',
            message: 'Eroare la verificarea accesului la organizație',
            details: error instanceof Error ? error.message : String(error),
            code: 'ORG_ACCESS_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }
    })
  }
}

/**
 * withAdmin - Super admin guard (RBAC)
 *
 * Verifies user has super_admin role via RBAC system.
 * Returns 403 if user is not super admin.
 *
 * @example
 * export const GET = withAdmin(async (req) => {
 *   // User is guaranteed to be super admin here
 *   // ... your admin logic
 * })
 */
export function withAdmin(handler: AuthenticatedHandler): RouteHandler {
  return withAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      const isSuperAdminUser = await isSuperAdmin()

      if (!isSuperAdminUser) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Acces permis doar pentru super administratori',
            code: 'ADMIN_ONLY'
          } as ApiError,
          { status: 403 }
        )
      }

      return await handler(req)
    } catch (error) {
      console.error('[withAdmin] Error:', error)
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Eroare la verificarea permisiunilor de administrator',
          details: error instanceof Error ? error.message : String(error),
          code: 'ADMIN_CHECK_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }
  })
}

/**
 * withRole - RBAC role guard
 *
 * Verifies user has at least one of the specified RBAC roles.
 * Returns 403 if user doesn't have any of the required roles.
 *
 * @param allowedRoles - Array of allowed RBAC role keys
 *
 * @example
 * export const GET = withRole(['consultant_ssm', 'super_admin'])(async (req) => {
 *   // User has one of the allowed roles
 *   // ... your logic
 * })
 */
export function withRole(allowedRoles: RoleKey[]) {
  return (handler: AuthenticatedHandler): RouteHandler => {
    return withAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
      try {
        const userRoles = await getMyRoles()
        const userRoleKeys = userRoles.map(r => r.role_key)

        const hasAllowedRole = allowedRoles.some(role => userRoleKeys.includes(role))

        if (!hasAllowedRole) {
          return NextResponse.json(
            {
              error: 'Forbidden',
              message: `Rol insuficient. Roluri necesare: ${allowedRoles.join(' sau ')}`,
              code: 'INSUFFICIENT_ROLE'
            } as ApiError,
            { status: 403 }
          )
        }

        return await handler(req)
      } catch (error) {
        console.error('[withRole] Error:', error)
        return NextResponse.json(
          {
            error: 'Internal Server Error',
            message: 'Eroare la verificarea rolurilor',
            details: error instanceof Error ? error.message : String(error),
            code: 'ROLE_CHECK_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }
    })
  }
}

// ── Helper Functions ──

/**
 * Helper: Extract organization ID from route params
 * Use with Next.js dynamic routes like [id]
 *
 * @example
 * export const GET = withOrgAccess(
 *   async (req) => {
 *     const { id } = await getRouteParams(req)
 *     return id
 *   }
 * )(async (req) => { ... })
 */
export async function getRouteParams(req: NextRequest): Promise<Record<string, string>> {
  // Extract params from URL - Next.js App Router doesn't expose params directly
  // This is a workaround for accessing route params in middleware
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)

  // Common pattern: last segment is often the ID
  const id = pathSegments[pathSegments.length - 1]

  return { id }
}

/**
 * Helper: Extract organization ID from request body
 *
 * @example
 * export const POST = withOrgAccess(
 *   (req) => getOrgIdFromBody(req, 'organization_id')
 * )(async (req) => { ... })
 */
export async function getOrgIdFromBody(
  req: NextRequest,
  fieldName: string = 'organization_id'
): Promise<string> {
  try {
    const body = await req.clone().json()
    return body[fieldName] || ''
  } catch {
    return ''
  }
}

/**
 * Helper: Extract organization ID from query params
 *
 * @example
 * export const GET = withOrgAccess(
 *   (req) => getOrgIdFromQuery(req, 'org_id')
 * )(async (req) => { ... })
 */
export function getOrgIdFromQuery(
  req: NextRequest,
  paramName: string = 'organization_id'
): string {
  return req.nextUrl.searchParams.get(paramName) || ''
}
