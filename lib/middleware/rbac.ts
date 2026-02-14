// S-S-M.RO — RBAC MIDDLEWARE
// Permission check functions și HOC pentru API routes
// Data: 14 Februarie 2026

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getMyRoles, hasPermission as rbacHasPermission, isSuperAdmin, type RoleKey, type Resource, type Action } from '@/lib/rbac';

// ── IERARHIE ROLURI ──
// super_admin > platform_admin > country_admin > consultant_admin > org_admin > org_manager > worker

const ROLE_HIERARCHY: Record<string, number> = {
  'super_admin': 100,
  'platform_admin': 90,
  'country_admin': 80,
  'consultant_admin': 70,
  'consultant_ssm': 70, // alias pentru consultant
  'org_admin': 60,
  'firma_admin': 60, // legacy, mapare la org_admin
  'org_manager': 50,
  'worker': 10,
  'angajat': 10, // legacy, mapare la worker
};

// ── RESURSE ──
export type PermissionResource =
  | 'employees'
  | 'trainings'
  | 'documents'
  | 'equipment'
  | 'reports'
  | 'settings'
  | 'medical'
  | 'alerts'
  | 'organizations'
  | 'roles'
  | 'audit_log'
  | 'api_keys'
  | 'webhooks'
  | string; // extensibil

// ── ACȚIUNI ──
export type PermissionAction =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'manage' // toate acțiunile
  | 'export'
  | 'approve'
  | 'assign'
  | string; // extensibil

// ── FUNCȚII VERIFICARE PERMISIUNI ──

/**
 * Verifică dacă un rol are permisiune pentru o resursă și acțiune
 * @param userRole - Rol-ul utilizatorului (RoleKey)
 * @param resource - Resursa accesată
 * @param action - Acțiunea solicitată
 * @returns boolean - true dacă are permisiune
 */
export function checkPermission(
  userRole: RoleKey,
  resource: PermissionResource,
  action: PermissionAction
): boolean {
  // Super admin poate totul
  if (userRole === 'super_admin') {
    return true;
  }

  // Platform admin poate totul (aproape)
  if (userRole === 'platform_admin') {
    return true;
  }

  // Country admin poate gestiona organizații și utilizatori din țara sa
  if (userRole === 'country_admin') {
    if (resource === 'roles' && action === 'manage') return false; // nu poate gestiona roluri globale
    return ['employees', 'trainings', 'documents', 'equipment', 'reports', 'organizations', 'medical', 'alerts'].includes(resource);
  }

  // Consultant admin poate gestiona organizațiile clienților
  if (userRole === 'consultant_admin' || userRole === 'consultant_ssm') {
    if (resource === 'settings' && action === 'manage') return false;
    if (resource === 'roles' && action === 'manage') return false;
    if (resource === 'api_keys' && action !== 'read') return false;
    return ['employees', 'trainings', 'documents', 'equipment', 'reports', 'organizations', 'medical', 'alerts'].includes(resource);
  }

  // Org admin poate gestiona organizația sa
  if (userRole === 'org_admin' || userRole === 'firma_admin') {
    if (resource === 'organizations' && action === 'delete') return false;
    if (resource === 'roles' && action === 'manage') return false;
    if (resource === 'api_keys' && action !== 'read') return false;
    return ['employees', 'trainings', 'documents', 'equipment', 'reports', 'settings', 'medical', 'alerts'].includes(resource);
  }

  // Org manager poate vizualiza și actualiza
  if (userRole === 'org_manager') {
    if (['delete', 'manage'].includes(action)) return false;
    return ['employees', 'trainings', 'documents', 'equipment', 'reports', 'medical', 'alerts'].includes(resource);
  }

  // Worker poate doar citi
  if (userRole === 'worker' || userRole === 'angajat') {
    if (action !== 'read') return false;
    return ['trainings', 'documents', 'medical', 'alerts'].includes(resource);
  }

  // Default: nu are permisiune
  return false;
}

/**
 * Verifică dacă un rol are nivel de permisiune mai mare sau egal cu altul
 * @param userRole - Rol-ul utilizatorului
 * @param requiredRole - Rol-ul cerut
 * @returns boolean - true dacă are nivel suficient
 */
export function hasRoleLevel(userRole: RoleKey, requiredRole: RoleKey): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
}

/**
 * Verifică dacă utilizatorul curent are permisiune (server-side, async)
 * @param resource - Resursa accesată
 * @param action - Acțiunea solicitată
 * @returns Promise<boolean>
 */
export async function checkUserPermission(
  resource: PermissionResource,
  action: PermissionAction
): Promise<boolean> {
  // Verifică mai întâi RBAC dinamic (dacă este configurat)
  try {
    const hasRbacPermission = await rbacHasPermission(resource as Resource, action as Action);
    if (hasRbacPermission) return true;
  } catch (error) {
    console.error('Error checking RBAC permission:', error);
  }

  // Fallback: verifică pe baza rolurilor statice
  const roles = await getMyRoles();
  if (roles.length === 0) return false;

  // Dacă are super_admin, returnează true
  if (await isSuperAdmin()) return true;

  // Verifică fiecare rol
  for (const role of roles) {
    if (checkPermission(role.role_key, resource, action)) {
      return true;
    }
  }

  return false;
}

// ── HOC PENTRU API ROUTES ──

/**
 * Tip pentru handler-ul API route
 */
export type ApiRouteHandler = (
  req: NextRequest,
  context?: { params?: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

/**
 * HOC pentru protejarea API routes cu verificare de permisiuni
 * @param handler - Handler-ul API route
 * @param requiredPermission - Permisiunea cerută { resource, action }
 * @returns Handler protejat
 *
 * @example
 * ```typescript
 * export const GET = withPermission(
 *   async (req) => { return NextResponse.json({ data: [] }) },
 *   { resource: 'employees', action: 'read' }
 * );
 * ```
 */
export function withPermission(
  handler: ApiRouteHandler,
  requiredPermission: { resource: PermissionResource; action: PermissionAction }
): ApiRouteHandler {
  return async (req: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      // Verifică autentificarea
      const supabase = await createSupabaseServer();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Neautentificat. Vă rugăm să vă autentificați.' },
          { status: 401 }
        );
      }

      // Verifică permisiunea
      const hasPermission = await checkUserPermission(
        requiredPermission.resource,
        requiredPermission.action
      );

      if (!hasPermission) {
        return NextResponse.json(
          {
            error: 'Acces interzis. Nu aveți permisiunea necesară.',
            required: requiredPermission
          },
          { status: 403 }
        );
      }

      // Apelează handler-ul
      return handler(req, context);
    } catch (error) {
      console.error('Error in withPermission middleware:', error);
      return NextResponse.json(
        { error: 'Eroare internă la verificarea permisiunilor.' },
        { status: 500 }
      );
    }
  };
}

/**
 * HOC pentru protejarea API routes cu verificare de rol minim
 * @param handler - Handler-ul API route
 * @param minRole - Rol-ul minim necesar
 * @returns Handler protejat
 *
 * @example
 * ```typescript
 * export const POST = withMinRole(
 *   async (req) => { return NextResponse.json({ success: true }) },
 *   'org_admin'
 * );
 * ```
 */
export function withMinRole(
  handler: ApiRouteHandler,
  minRole: RoleKey
): ApiRouteHandler {
  return async (req: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      // Verifică autentificarea
      const supabase = await createSupabaseServer();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Neautentificat. Vă rugăm să vă autentificați.' },
          { status: 401 }
        );
      }

      // Verifică nivelul de rol
      const roles = await getMyRoles();
      const hasRequiredLevel = roles.some(role => hasRoleLevel(role.role_key, minRole));

      if (!hasRequiredLevel) {
        return NextResponse.json(
          {
            error: 'Acces interzis. Nivel de rol insuficient.',
            required: minRole,
            userRoles: roles.map(r => r.role_key)
          },
          { status: 403 }
        );
      }

      // Apelează handler-ul
      return handler(req, context);
    } catch (error) {
      console.error('Error in withMinRole middleware:', error);
      return NextResponse.json(
        { error: 'Eroare internă la verificarea rolului.' },
        { status: 500 }
      );
    }
  };
}

/**
 * HOC combinat: verifică atât permisiuni cât și organizația
 * @param handler - Handler-ul API route
 * @param requiredPermission - Permisiunea cerută
 * @param checkOrgAccess - Funcție opțională pentru verificare acces organizație
 * @returns Handler protejat
 *
 * @example
 * ```typescript
 * export const PATCH = withPermissionAndOrg(
 *   async (req, context) => { return NextResponse.json({ updated: true }) },
 *   { resource: 'employees', action: 'update' },
 *   async (orgId) => {
 *     const myOrgIds = await getMyOrgIds();
 *     return myOrgIds.includes(orgId);
 *   }
 * );
 * ```
 */
export function withPermissionAndOrg(
  handler: ApiRouteHandler,
  requiredPermission: { resource: PermissionResource; action: PermissionAction },
  checkOrgAccess?: (orgId: string) => Promise<boolean>
): ApiRouteHandler {
  return async (req: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      // Verifică autentificarea
      const supabase = await createSupabaseServer();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Neautentificat. Vă rugăm să vă autentificați.' },
          { status: 401 }
        );
      }

      // Verifică permisiunea
      const hasPermission = await checkUserPermission(
        requiredPermission.resource,
        requiredPermission.action
      );

      if (!hasPermission) {
        return NextResponse.json(
          {
            error: 'Acces interzis. Nu aveți permisiunea necesară.',
            required: requiredPermission
          },
          { status: 403 }
        );
      }

      // Verifică accesul la organizație (dacă checkOrgAccess este furnizat)
      if (checkOrgAccess) {
        // Extrage organization_id din query params sau body
        const url = new URL(req.url);
        const orgIdFromQuery = url.searchParams.get('organization_id');

        let orgIdFromBody: string | null = null;
        if (req.method !== 'GET') {
          try {
            const body = await req.json();
            orgIdFromBody = body.organization_id || body.organizationId || null;
          } catch {
            // Body nu este JSON valid
          }
        }

        const orgId = orgIdFromQuery || orgIdFromBody;

        if (orgId) {
          const hasOrgAccess = await checkOrgAccess(orgId);
          if (!hasOrgAccess) {
            return NextResponse.json(
              { error: 'Acces interzis. Nu aveți acces la această organizație.' },
              { status: 403 }
            );
          }
        }
      }

      // Apelează handler-ul
      return handler(req, context);
    } catch (error) {
      console.error('Error in withPermissionAndOrg middleware:', error);
      return NextResponse.json(
        { error: 'Eroare internă la verificarea permisiunilor.' },
        { status: 500 }
      );
    }
  };
}

// ── EXPORTS ──
// Funcțiile și tipurile sunt deja exportate inline mai sus
export { ROLE_HIERARCHY };
