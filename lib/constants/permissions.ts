// S-S-M.RO — PERMISSION CONSTANTS
// Permission matrix pentru sistemul RBAC dinamic
// Data: 13 Februarie 2026

import { RoleKey, Resource, Action } from '@/lib/rbac';

// ── PERMISSION ACTIONS ──
export const PERMISSIONS = {
  CREATE: 'create' as Action,
  READ: 'read' as Action,
  UPDATE: 'update' as Action,
  DELETE: 'delete' as Action,
  EXPORT: 'export' as Action,
  DELEGATE: 'delegate' as Action,
} as const;

// ── RESOURCES ──
export const RESOURCES = {
  ORGANIZATIONS: 'organizations' as Resource,
  EMPLOYEES: 'employees' as Resource,
  LOCATIONS: 'locations' as Resource,
  EQUIPMENT: 'equipment' as Resource,
  MEDICAL: 'medical' as Resource,
  TRAININGS: 'trainings' as Resource,
  DOCUMENTS: 'documents' as Resource,
  ALERTS: 'alerts' as Resource,
  DASHBOARD: 'dashboard' as Resource,
  REPORTS: 'reports' as Resource,
  FRAUD: 'fraud' as Resource,
  JURISDICTIONS: 'jurisdictions' as Resource,
  ROLES_ADMIN: 'roles_admin' as Resource,
  REGES: 'reges' as Resource,
  MEMBERSHIPS: 'memberships' as Resource,
  PROFILES: 'profiles' as Resource,
  NOTIFICATIONS: 'notifications' as Resource,
  PENALTIES: 'penalties' as Resource,
  AUDIT_LOG: 'audit_log' as Resource,
} as const;

// ── ROLES ──
export const ROLES = {
  SUPER_ADMIN: 'super_admin' as RoleKey,
  CONSULTANT_SSM: 'consultant_ssm' as RoleKey,
  FIRMA_ADMIN: 'firma_admin' as RoleKey,
  ANGAJAT: 'angajat' as RoleKey,
  PARTENER_CONTABIL: 'partener_contabil' as RoleKey,
} as const;

// ── PERMISSION MATRIX ──
// 5 roluri principale × 19 resources × 6 actions

type PermissionMatrix = {
  [role in RoleKey]?: {
    [resource in Resource]?: {
      canCreate?: boolean;
      canRead?: boolean;
      canUpdate?: boolean;
      canDelete?: boolean;
      canExport?: boolean;
      canDelegate?: boolean;
    };
  };
};

export const PERMISSION_MATRIX: PermissionMatrix = {
  // ── SUPER_ADMIN: Acces total ──
  super_admin: {
    organizations: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: true },
    employees: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    locations: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    equipment: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    medical: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    trainings: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    documents: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    alerts: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    dashboard: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    reports: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    fraud: { canCreate: false, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    jurisdictions: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    roles_admin: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: true },
    reges: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    memberships: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    profiles: { canCreate: false, canRead: true, canUpdate: true, canDelete: false, canExport: true, canDelegate: false },
    notifications: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    penalties: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    audit_log: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
  },

  // ── CONSULTANT_SSM: Consultant SSM/PSI cu acces multi-organizație ──
  consultant_ssm: {
    organizations: { canCreate: true, canRead: true, canUpdate: true, canDelete: false, canExport: true, canDelegate: true },
    employees: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    locations: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    equipment: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    medical: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    trainings: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    documents: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    alerts: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    dashboard: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    reports: { canCreate: true, canRead: true, canUpdate: true, canDelete: false, canExport: true, canDelegate: false },
    fraud: { canCreate: false, canRead: true, canUpdate: true, canDelete: false, canExport: true, canDelegate: false },
    jurisdictions: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    roles_admin: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    reges: { canCreate: true, canRead: true, canUpdate: true, canDelete: false, canExport: true, canDelegate: false },
    memberships: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    profiles: { canCreate: false, canRead: true, canUpdate: true, canDelete: false, canExport: false, canDelegate: false },
    notifications: { canCreate: true, canRead: true, canUpdate: true, canDelete: false, canExport: true, canDelegate: false },
    penalties: { canCreate: true, canRead: true, canUpdate: true, canDelete: false, canExport: true, canDelegate: false },
    audit_log: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
  },

  // ── FIRMA_ADMIN: Administrator firmă (organizație single) ──
  firma_admin: {
    organizations: { canCreate: false, canRead: true, canUpdate: true, canDelete: false, canExport: false, canDelegate: false },
    employees: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    locations: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: false, canDelegate: false },
    equipment: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, canDelegate: false },
    medical: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    trainings: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    documents: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    alerts: { canCreate: false, canRead: true, canUpdate: true, canDelete: false, canExport: false, canDelegate: false },
    dashboard: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    reports: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    fraud: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    jurisdictions: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    roles_admin: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    reges: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    memberships: { canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: false, canDelegate: false },
    profiles: { canCreate: false, canRead: true, canUpdate: true, canDelete: false, canExport: false, canDelegate: false },
    notifications: { canCreate: false, canRead: true, canUpdate: true, canDelete: false, canExport: false, canDelegate: false },
    penalties: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    audit_log: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
  },

  // ── ANGAJAT: Angajat (acces read-only la propriile date) ──
  angajat: {
    organizations: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    employees: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    locations: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    equipment: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    medical: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    trainings: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    documents: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    alerts: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    dashboard: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    reports: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    fraud: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    jurisdictions: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    roles_admin: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    reges: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    memberships: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    profiles: { canCreate: false, canRead: true, canUpdate: true, canDelete: false, canExport: false, canDelegate: false },
    notifications: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    penalties: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    audit_log: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
  },

  // ── PARTENER_CONTABIL: Partener contabil (read-only pentru raportare) ──
  partener_contabil: {
    organizations: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    employees: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    locations: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    equipment: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    medical: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    trainings: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    documents: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    alerts: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    dashboard: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    reports: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    fraud: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    jurisdictions: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    roles_admin: { canCreate: false, canRead: false, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    reges: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    memberships: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    profiles: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    notifications: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: false, canDelegate: false },
    penalties: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
    audit_log: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExport: true, canDelegate: false },
  },
};

// ── HELPER FUNCTIONS ──

/**
 * Verifică dacă un rol are permisiune pentru o acțiune pe o resursă
 * @param role - Cheia rolului (ex: 'consultant_ssm')
 * @param resource - Resursa (ex: 'employees')
 * @param action - Acțiunea (ex: 'create')
 * @returns true dacă permisiunea există, false altfel
 */
export function checkPermission(
  role: RoleKey,
  resource: Resource,
  action: Action
): boolean {
  // Super admin are acces la tot
  if (role === 'super_admin') return true;

  const rolePerms = PERMISSION_MATRIX[role];
  if (!rolePerms) return false;

  const resourcePerms = rolePerms[resource];
  if (!resourcePerms) return false;

  switch (action) {
    case 'create':
      return resourcePerms.canCreate ?? false;
    case 'read':
      return resourcePerms.canRead ?? false;
    case 'update':
      return resourcePerms.canUpdate ?? false;
    case 'delete':
      return resourcePerms.canDelete ?? false;
    case 'export':
      return resourcePerms.canExport ?? false;
    case 'delegate':
      return resourcePerms.canDelegate ?? false;
    default:
      return false;
  }
}

/**
 * Returnează toate permisiunile pentru un rol pe o resursă
 * @param role - Cheia rolului
 * @param resource - Resursa
 * @returns Obiect cu canCreate, canRead, canUpdate, canDelete, canExport, canDelegate
 */
export function getResourcePermissions(role: RoleKey, resource: Resource) {
  if (role === 'super_admin') {
    return {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      canExport: true,
      canDelegate: true,
    };
  }

  const rolePerms = PERMISSION_MATRIX[role];
  if (!rolePerms) {
    return {
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
      canExport: false,
      canDelegate: false,
    };
  }

  const resourcePerms = rolePerms[resource];
  return {
    canCreate: resourcePerms?.canCreate ?? false,
    canRead: resourcePerms?.canRead ?? false,
    canUpdate: resourcePerms?.canUpdate ?? false,
    canDelete: resourcePerms?.canDelete ?? false,
    canExport: resourcePerms?.canExport ?? false,
    canDelegate: resourcePerms?.canDelegate ?? false,
  };
}

/**
 * Verifică dacă un rol poate efectua cel puțin una din acțiunile specificate
 * @param role - Cheia rolului
 * @param resource - Resursa
 * @param actions - Array de acțiuni
 * @returns true dacă cel puțin o acțiune este permisă
 */
export function hasAnyPermission(
  role: RoleKey,
  resource: Resource,
  actions: Action[]
): boolean {
  return actions.some((action) => checkPermission(role, resource, action));
}

/**
 * Verifică dacă un rol poate efectua toate acțiunile specificate
 * @param role - Cheia rolului
 * @param resource - Resursa
 * @param actions - Array de acțiuni
 * @returns true dacă toate acțiunile sunt permise
 */
export function hasAllPermissions(
  role: RoleKey,
  resource: Resource,
  actions: Action[]
): boolean {
  return actions.every((action) => checkPermission(role, resource, action));
}

/**
 * Returnează lista tuturor resurselor la care un rol are acces (cel puțin read)
 * @param role - Cheia rolului
 * @returns Array de resource keys
 */
export function getAccessibleResources(role: RoleKey): Resource[] {
  if (role === 'super_admin') {
    return Object.values(RESOURCES);
  }

  const rolePerms = PERMISSION_MATRIX[role];
  if (!rolePerms) return [];

  return Object.keys(rolePerms).filter((resource) => {
    const perms = rolePerms[resource as Resource];
    return perms?.canRead === true;
  }) as Resource[];
}
