# ═══════════════════════════════════════════════════════════════════
# s-s-m.ro — INSTRUCȚIUNI CLAUDE CODE (CORECTAT pe baza DOC1 v8.1)
# RBAC Dinamic — Ghid Pas cu Pas
# Data: 2026-02-08 | v1.1
# ═══════════════════════════════════════════════════════════════════
# CONTEXT: 
#   - Stack: Next.js 14 (App Router) + Supabase + Vercel
#   - DB: 25 tabele existente (DOC1 §4), RLS pe toate
#   - Repo: C:\Dev\s-s-m-app | GitHub: danielvicentiu/s-s-m-app
#   - Structura reală: organizations (nu companies), memberships (nu profiles.role)
#   - Auth: Supabase Auth (magic link + parolă)
# ═══════════════════════════════════════════════════════════════════


# ╔═══════════════════════════════════════════╗
# ║ PAS 0: PREGĂTIRE                         ║
# ╚═══════════════════════════════════════════╝

## 0.1 Verificare structură curentă (rulează în terminal):
```bash
cd C:\Dev\s-s-m-app
cat package.json | grep -E "next|supabase"
ls src/middleware.ts 2>/dev/null || ls middleware.ts 2>/dev/null || echo "NO MIDDLEWARE"
ls src/lib/supabase/ 2>/dev/null
```

## 0.2 Verificare structură memberships (rulează în Supabase SQL Editor):
```sql
-- CRITIC: Am nevoie de output-ul acestor query-uri pentru migrare
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'memberships' ORDER BY ordinal_position;

SELECT DISTINCT role FROM public.memberships;  -- sau role_type etc.

SELECT policyname, cmd, qual FROM pg_policies 
WHERE tablename = 'employees' ORDER BY policyname;
```

## 0.3 Backup:
```bash
# Supabase Dashboard → Settings → Database → Download backup
# SAU:
npx supabase db dump -f backup_2026-02-08.sql --db-url "postgresql://..."
```


# ╔═══════════════════════════════════════════╗
# ║ PAS 1: EXECUȚIE SQL (Luni 10 Feb)        ║
# ╚═══════════════════════════════════════════╝

## Deschide: Supabase Dashboard → SQL Editor
## Copiază conținutul din: 002_RBAC_DINAMIC_CORECTAT_v1.1.sql
## Rulează SECȚIUNILE 0-7 (FĂRĂ 8 și 9!)
## Verifică output-ul query-ului de la final

## Rezultat așteptat:
## ROLES: 27 (17 globale + 10 per țară)
## PERMISSIONS: ~200+
## USER_ROLES: 0 (încă neimigrate)


# ╔═══════════════════════════════════════════╗
# ║ PAS 2: FIȘIERE TYPESCRIPT (Luni 10 Feb)  ║
# ╚═══════════════════════════════════════════╝

## Claude Code — creează fișierele:

### 2.1: src/types/rbac.ts
```typescript
export type RBACAction = 
  | 'create' | 'read' | 'update' | 'delete' 
  | 'export' | 'delegate' | 'approve' | 'sign';

export type RBACResource = 
  | 'organizations' | 'profiles' | 'memberships' | 'employees' | 'locations'
  | 'jurisdictions' | 'medical_examinations' | 'safety_equipment'
  | 'training_modules' | 'training_assignments' | 'training_sessions'
  | 'test_questions' | 'notification_log' | 'alert_preferences'
  | 'generated_documents' | 'fraud_alerts' | 'organized_training_sessions'
  | 'authorities' | 'penalty_rules' | 'penalty_visibility'
  | 'reges_connections' | 'reges_transmissions' | 'reges_nomenclatures'
  | 'reges_employee_snapshots' | 'reges_audit_log'
  | 'roles' | 'permissions' | 'user_roles'
  | 'psi_documents' | 'iscir_records' | 'gdpr_records' | 'nis2_compliance';

export interface Role {
  id: string;
  role_key: string;
  role_name: string;
  description: string | null;
  country_code: string | null;
  is_system: boolean;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  metadata: {
    icon?: string;
    color?: string;
    sort?: number;
    [key: string]: any;
  };
}

export interface Permission {
  id: string;
  role_id: string;
  resource: RBACResource;
  action: RBACAction;
  field_restrictions: Record<string, string> | null;
  conditions: Record<string, any> | null;
  country_code: string | null;
  is_active: boolean;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  organization_id: string | null;
  location_id: string | null;
  granted_by: string | null;
  granted_at: string;
  expires_at: string | null;
  is_active: boolean;
  metadata: Record<string, any>;
  role?: Role;
}

export interface UserPermission {
  role_key: string;
  role_name: string;
  resource: RBACResource;
  action: RBACAction;
  field_restrictions: Record<string, string> | null;
  conditions: Record<string, any> | null;
  organization_id: string | null;
  location_id: string | null;
}

// Route → Permission mapping
export const ROUTE_PERMISSIONS: Record<string, {
  resource: RBACResource;
  action: RBACAction;
  requiredRoles?: string[];
}> = {
  '/dashboard':           { resource: 'organizations', action: 'read' },
  '/employees':           { resource: 'employees', action: 'read' },
  '/employees/new':       { resource: 'employees', action: 'create' },
  '/trainings':           { resource: 'training_modules', action: 'read' },
  '/medical':             { resource: 'medical_examinations', action: 'read' },
  '/equipment':           { resource: 'safety_equipment', action: 'read' },
  '/documents':           { resource: 'generated_documents', action: 'read' },
  '/alerts':              { resource: 'notification_log', action: 'read' },
  '/penalties':           { resource: 'penalty_visibility', action: 'read' },
  '/reges':               { resource: 'reges_connections', action: 'read' },
  '/settings':            { resource: 'profiles', action: 'read' },
  '/admin/roles':         { resource: 'roles', action: 'read', requiredRoles: ['super_admin'] },
  '/admin/permissions':   { resource: 'permissions', action: 'read', requiredRoles: ['super_admin'] },
  '/admin/users':         { resource: 'user_roles', action: 'read', requiredRoles: ['super_admin'] },
};
```

### 2.2: src/lib/rbac.ts
```typescript
import { createClient } from '@/lib/supabase/server';
import type { RBACResource, RBACAction, UserPermission, Role, Permission, UserRole } from '@/types/rbac';

// ─── Verificare permisiuni (server-side) ───

export async function hasPermission(
  resource: RBACResource, action: RBACAction, orgId?: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('has_permission', {
    p_resource: resource, p_action: action, p_organization_id: orgId ?? null,
  });
  if (error) { console.error('[RBAC] has_permission:', error); return false; }
  return data === true;
}

export async function hasRole(roleKey: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('has_role', { p_role_key: roleKey });
  if (error) { console.error('[RBAC] has_role:', error); return false; }
  return data === true;
}

export async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('is_super_admin');
  if (error) { console.error('[RBAC] is_super_admin:', error); return false; }
  return data === true;
}

export async function getUserPermissions(): Promise<UserPermission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_user_permissions');
  if (error) { console.error('[RBAC] get_user_permissions:', error); return []; }
  return (data as UserPermission[]) ?? [];
}

// ─── CRUD Admin (server-side) ───

export async function getAllRoles(): Promise<Role[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('roles').select('*')
    .order('metadata->sort', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createRole(role: Partial<Role>): Promise<Role> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('roles').insert(role).select().single();
  if (error) throw error;
  return data;
}

export async function updateRole(id: string, updates: Partial<Role>): Promise<Role> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('roles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRole(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('roles')
    .update({ is_active: false }).eq('id', id).eq('is_system', false);
  if (error) throw error;
}

export async function getRolePermissions(roleId: string): Promise<Permission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('permissions').select('*')
    .eq('role_id', roleId).eq('is_active', true).order('resource').order('action');
  if (error) throw error;
  return data ?? [];
}

export async function upsertPermission(perm: Partial<Permission>): Promise<Permission> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('permissions')
    .upsert(perm, { onConflict: 'role_id,resource,action,country_code' }).select().single();
  if (error) throw error;
  return data;
}

export async function removePermission(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('permissions').update({ is_active: false }).eq('id', id);
  if (error) throw error;
}

export async function assignRole(userId: string, roleId: string, orgId?: string, expiresAt?: string): Promise<UserRole> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('user_roles')
    .insert({
      user_id: userId, role_id: roleId,
      organization_id: orgId ?? null, granted_by: user?.id,
      expires_at: expiresAt ?? null,
    }).select('*, role:roles(*)').single();
  if (error) throw error;
  return data;
}

export async function revokeUserRole(userRoleId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('user_roles').update({ is_active: false }).eq('id', userRoleId);
  if (error) throw error;
}
```

### 2.3: src/hooks/usePermissions.ts
```typescript
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RBACResource, RBACAction, UserPermission } from '@/types/rbac';

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_user_permissions');
      if (error) throw error;
      setPermissions((data as UserPermission[]) ?? []);
    } catch (err) {
      console.error('[RBAC]', err);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPermissions(); }, [fetchPermissions]);

  const can = useCallback(
    (resource: RBACResource, action: RBACAction) =>
      permissions.some(p => p.resource === resource && p.action === action),
    [permissions]
  );

  const hasRole = useCallback(
    (roleKey: string) => permissions.some(p => p.role_key === roleKey),
    [permissions]
  );

  const isSuperAdmin = useMemo(
    () => permissions.some(p => p.role_key === 'super_admin'),
    [permissions]
  );

  return { permissions, loading, can, hasRole, isSuperAdmin, refresh: fetchPermissions };
}

// Componenta helper <Can>
export function Can({ resource, action, children, fallback = null }: {
  resource: RBACResource; action: RBACAction;
  children: React.ReactNode; fallback?: React.ReactNode;
}) {
  const { can, loading } = usePermissions();
  if (loading) return null;
  return can(resource, action) ? <>{children}</> : <>{fallback}</>;
}
```


# ╔═══════════════════════════════════════════╗
# ║ PAS 3: MIDDLEWARE (Marți 11 Feb)          ║
# ╚═══════════════════════════════════════════╝

## Claude Code — actualizează middleware.ts (rădăcina proiectului)
## ⚠️ Verifică mai întâi dacă ai deja un middleware.ts și ce conține

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTE_PERMISSIONS } from '@/types/rbac';

const PUBLIC_ROUTES = [
  '/', '/login', '/register', '/forgot-password',
  '/bg', '/hu', '/de', '/pl',  // landing pages
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip: public routes, static files, API
  if (PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(`${r}/`))) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Supabase client
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Auth check
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Permission check
  const routePerm = findRoutePermission(pathname);
  if (!routePerm) return response;

  const { data: hasAccess } = await supabase.rpc('has_permission', {
    p_resource: routePerm.resource,
    p_action: routePerm.action,
    p_organization_id: null,
  });

  if (!hasAccess) {
    // Fallback: check required roles
    if (routePerm.requiredRoles?.length) {
      for (const rk of routePerm.requiredRoles) {
        const { data } = await supabase.rpc('has_role', { p_role_key: rk });
        if (data) return response;
      }
    }
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return response;
}

function findRoutePermission(pathname: string) {
  if (ROUTE_PERMISSIONS[pathname]) return ROUTE_PERMISSIONS[pathname];
  const segs = pathname.split('/').filter(Boolean);
  for (let i = segs.length; i > 0; i--) {
    const prefix = '/' + segs.slice(0, i).join('/');
    if (ROUTE_PERMISSIONS[prefix]) return ROUTE_PERMISSIONS[prefix];
  }
  return null;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```


# ╔═══════════════════════════════════════════╗
# ║ PAS 4: ADMIN UI (Joi 13 Feb)             ║
# ╚═══════════════════════════════════════════╝

## Claude Code — creează pagina /admin/roles

## Structura fișiere:
## src/app/admin/roles/page.tsx          — lista roluri
## src/app/admin/roles/[id]/page.tsx     — editare rol + permisiuni
## src/app/admin/layout.tsx              — layout admin (verifică super_admin)
## src/components/admin/RoleForm.tsx      — formular CRUD rol
## src/components/admin/PermMatrix.tsx    — matrice permisiuni (checkbox grid)

## Specificații Admin UI:
## 1. Layout: sidebar cu "Roluri | Utilizatori | Audit Log"
## 2. Lista roluri: tabel cu columns: Rol, Țară, Sistem, Activ, Nr. Permisiuni, Acțiuni
## 3. Filtre: dropdown Țară (Toate/RO/BG/HU/DE/PL) + toggle Active/Inactive
## 4. "Rol Nou" → modal cu: role_key, role_name, description, country_code, metadata.color
## 5. Click pe rol → pagina cu 2 secțiuni:
##    a) Detalii rol (editabile)
##    b) Matrice permisiuni: 
##       - Rows = resurse (toate 30+)
##       - Columns = acțiuni (create/read/update/delete/export/approve)
##       - Cells = checkbox (checked = permisiune activă)
##       - Salvare la fiecare click checkbox (optimistic update)
## 6. Sub matrice: editor JSON pentru conditions + field_restrictions
## 7. Badge-uri colorate (metadata.color pe fiecare rol)
## 8. "SYSTEM" indicator pe rolurile is_system (disable delete button)

## Server Actions (src/app/admin/roles/actions.ts):
## - getRoles, createRole, updateRole, deleteRole
## - getPermissions, togglePermission, updatePermissionConditions
## - listUsers, assignRole, revokeRole

## ⚠️ Pagina /admin/roles e protejată de middleware (requiredRoles: super_admin)
## ⚠️ Server actions au double-check: verifică is_super_admin() înainte de execuție


# ╔═══════════════════════════════════════════╗
# ║ PAS 5: MIGRARE DATE (Vineri 14 Feb)      ║
# ╚═══════════════════════════════════════════╝

## 5.1: Daniel rulează query-urile din PAS 0.2 și trimite output-ul
## 5.2: Bazat pe output, decomentează și adaptează SECȚIUNEA 8 din SQL
## 5.3: Rulează migrarea
## 5.4: Verifică:
```sql
SELECT ur.user_id, r.role_key, ur.organization_id, ur.is_active
FROM public.user_roles ur
JOIN public.roles r ON r.id = ur.role_id
ORDER BY r.role_key;
```
## 5.5: Asignează-ți rolul super_admin (înlocuiește UUID-ul tău):
```sql
INSERT INTO public.user_roles (user_id, role_id, granted_by, metadata)
VALUES (
  'DANIEL_AUTH_UUID_HERE',
  (SELECT id FROM public.roles WHERE role_key = 'super_admin'),
  'DANIEL_AUTH_UUID_HERE',
  '{"note": "founder super_admin"}'::jsonb
);
```


# ╔═══════════════════════════════════════════╗
# ║ PAS 6: ACTUALIZARE RLS (Vineri 14 Feb)   ║
# ╚═══════════════════════════════════════════╝

## 6.1: Listează TOATE policy-urile existente:
```sql
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

## 6.2: Pentru FIECARE tabel, aplică pattern-ul:
##   DROP POLICY veche → CREATE POLICY nouă cu has_permission()

## 6.3: Testează cu 3 useri diferiți:
##   - Daniel (super_admin) → vede tot
##   - Un consultant → vede doar organizațiile alocate
##   - Un angajat → vede doar propriile date

## 6.4: Screenshot "All tables RLS ON" din Supabase Dashboard


# ╔═══════════════════════════════════════════╗
# ║ PAS 7: PAGINA /unauthorized              ║
# ╚═══════════════════════════════════════════╝

## Claude Code — creează src/app/unauthorized/page.tsx:
## Pagină simplă cu:
## - "Acces interzis" / "Nu ai permisiunea necesară"
## - Buton "Înapoi la Dashboard"
## - Link "Contactează administratorul"


# ╔═══════════════════════════════════════════╗
# ║ CHECKLIST FINALĂ                          ║
# ╚═══════════════════════════════════════════╝

## □ SQL executat: roles, permissions, user_roles create
## □ 27 roluri populate (17 globale + 10 per țară)
## □ 200+ permisiuni populate
## □ Funcții helper: has_permission, has_role, is_super_admin, get_user_permissions
## □ RLS pe tabelele RBAC noi
## □ TypeScript types (src/types/rbac.ts)
## □ Server helper (src/lib/rbac.ts)
## □ Client hook (src/hooks/usePermissions.ts)
## □ Middleware actualizat (middleware.ts)
## □ Admin UI live (/admin/roles)
## □ Migrare memberships → user_roles
## □ Daniel = super_admin
## □ RLS actualizat pe 25 tabele existente
## □ Test cu 3 roluri diferite
## □ Pagina /unauthorized
