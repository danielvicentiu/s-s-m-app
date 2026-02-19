// lib/auth/checkCapability.ts
// Helper server-side pentru verificarea capabilities (permisiuni semantice)
// Citește din JWT app_metadata.permissions (fast path, fără query DB)
// Fallback: query DB pe role_capabilities JOIN user_roles
// Folosit în API Routes, Server Actions și middleware
// Data: 19 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import { cache } from 'react'

// ── Tip CapabilityCode — toate codurile definite ──
export type CapabilityCode =
  | 'can_sign_training'
  | 'can_view_medical'
  | 'can_edit_employees'
  | 'can_approve_incidents'
  | 'can_export_reports'
  | 'can_manage_users'
  | 'can_view_legislation'
  | 'can_manage_equipment'
  | string // extensibil

// ── 1. getMyCapabilities() — citește capabilities ale userului curent ──
// React cache: rezultatul se memoizează per request (ca getMyRoles din lib/rbac.ts)
export const getMyCapabilities = cache(async (): Promise<CapabilityCode[]> => {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // ── Fast path: JWT app_metadata.permissions ──
  const jwtPermissions = user.app_metadata?.permissions
  if (Array.isArray(jwtPermissions) && jwtPermissions.length > 0) {
    return jwtPermissions as CapabilityCode[]
  }

  // ── Super admin din JWT → acces la tot ──
  const jwtRole = user.app_metadata?.role
  if (jwtRole === 'super_admin') {
    const { data: allCaps } = await supabase
      .from('capabilities')
      .select('code')
    return (allCaps ?? []).map((c) => c.code as CapabilityCode)
  }

  // ── Fallback: query DB (JWT nesinc sau user nou) ──
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role_id, expires_at')
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (rolesError || !userRoles || userRoles.length === 0) return []

  // Filtrează rolurile expirate
  const activeRoleIds = userRoles
    .filter((ur) => !ur.expires_at || new Date(ur.expires_at) > new Date())
    .map((ur) => ur.role_id)

  if (activeRoleIds.length === 0) return []

  const { data: roleCaps, error: capsError } = await supabase
    .from('role_capabilities')
    .select('capability_code')
    .in('role_id', activeRoleIds)

  if (capsError || !roleCaps) return []

  return [...new Set(roleCaps.map((rc) => rc.capability_code as CapabilityCode))]
})

// ── 2. checkCapability(code) — verifică o capability specifică ──
export const checkCapability = cache(async (code: CapabilityCode): Promise<boolean> => {
  const caps = await getMyCapabilities()
  return caps.includes(code)
})

// ── 3. checkAllCapabilities(codes) — verifică că userul are TOATE capabilities ──
export const checkAllCapabilities = cache(async (codes: CapabilityCode[]): Promise<boolean> => {
  const caps = await getMyCapabilities()
  return codes.every((c) => caps.includes(c))
})

// ── 4. checkAnyCapability(codes) — verifică că userul are CEL PUȚIN UNA ──
export const checkAnyCapability = cache(async (codes: CapabilityCode[]): Promise<boolean> => {
  const caps = await getMyCapabilities()
  return codes.some((c) => caps.includes(c))
})

// ── 5. requireCapability(code) — aruncă eroare dacă lipsește capability ──
// Folosit în Server Actions pentru acces restricționat
export async function requireCapability(code: CapabilityCode): Promise<void> {
  const allowed = await checkCapability(code)
  if (!allowed) {
    throw new Error(`Acces interzis: lipsește permisiunea '${code}'`)
  }
}

// ── Shorthand-uri pentru capabilities frecvent verificate ──
export const canSignTraining    = () => checkCapability('can_sign_training')
export const canViewMedical     = () => checkCapability('can_view_medical')
export const canEditEmployees   = () => checkCapability('can_edit_employees')
export const canApproveIncidents = () => checkCapability('can_approve_incidents')
export const canExportReports   = () => checkCapability('can_export_reports')
export const canManageUsers     = () => checkCapability('can_manage_users')
export const canViewLegislation = () => checkCapability('can_view_legislation')
export const canManageEquipment = () => checkCapability('can_manage_equipment')
