/**
 * RBAC Role Permissions Matrix
 *
 * Defines permissions for all 27 roles in the system.
 * Each role has granular CRUD permissions across different modules.
 */

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'approve' | 'generate' | 'export';

export interface ModulePermissions {
  [module: string]: PermissionAction[];
}

export interface RolePermission {
  roleKey: string;
  displayName: string;
  description: string;
  permissions: ModulePermissions;
}

/**
 * RBAC Permission Matrix
 * Organized by role hierarchy: Platform → Country → Consultant → Organization → Worker levels
 */
export const ROLE_PERMISSIONS: RolePermission[] = [
  // ==================== PLATFORM LEVEL ====================
  {
    roleKey: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Full system access - all operations across all levels',
    permissions: {
      employees: ['create', 'read', 'update', 'delete', 'manage', 'export'],
      trainings: ['create', 'read', 'update', 'delete', 'manage', 'approve', 'generate'],
      medical: ['create', 'read', 'update', 'delete', 'manage', 'export'],
      equipment: ['create', 'read', 'update', 'delete', 'manage', 'export'],
      documents: ['create', 'read', 'update', 'delete', 'approve', 'generate', 'export'],
      alerts: ['create', 'read', 'update', 'delete', 'manage'],
      reports: ['create', 'read', 'generate', 'export'],
      organizations: ['create', 'read', 'update', 'delete', 'manage'],
      users: ['create', 'read', 'update', 'delete', 'manage'],
      roles: ['create', 'read', 'update', 'delete', 'manage'],
      audit: ['read', 'export'],
      penalties: ['create', 'read', 'update', 'delete', 'manage'],
      settings: ['read', 'update', 'manage'],
      billing: ['read', 'update', 'manage'],
      integrations: ['create', 'read', 'update', 'delete', 'manage'],
    },
  },
  {
    roleKey: 'platform_admin',
    displayName: 'Platform Administrator',
    description: 'Platform-wide operations - manages country admins and global settings',
    permissions: {
      employees: ['read', 'export'],
      trainings: ['read', 'manage', 'generate'],
      medical: ['read', 'export'],
      equipment: ['read', 'export'],
      documents: ['read', 'approve', 'export'],
      alerts: ['read', 'manage'],
      reports: ['create', 'read', 'generate', 'export'],
      organizations: ['create', 'read', 'update', 'manage'],
      users: ['create', 'read', 'update', 'manage'],
      roles: ['read', 'manage'],
      audit: ['read', 'export'],
      penalties: ['read', 'manage'],
      settings: ['read', 'update'],
      billing: ['read', 'update', 'manage'],
      integrations: ['read', 'update', 'manage'],
    },
  },

  // ==================== COUNTRY LEVEL ====================
  {
    roleKey: 'country_admin',
    displayName: 'Country Administrator',
    description: 'Country-level operations - manages consultants within country',
    permissions: {
      employees: ['read', 'export'],
      trainings: ['read', 'generate', 'export'],
      medical: ['read', 'export'],
      equipment: ['read', 'export'],
      documents: ['read', 'approve', 'export'],
      alerts: ['read', 'manage'],
      reports: ['create', 'read', 'generate', 'export'],
      organizations: ['create', 'read', 'update'],
      users: ['create', 'read', 'update'],
      roles: ['read'],
      audit: ['read', 'export'],
      penalties: ['read', 'update'],
      settings: ['read'],
      billing: ['read'],
    },
  },
  {
    roleKey: 'country_manager',
    displayName: 'Country Manager',
    description: 'Country operations manager - oversees compliance and reporting',
    permissions: {
      employees: ['read', 'export'],
      trainings: ['read', 'export'],
      medical: ['read', 'export'],
      equipment: ['read', 'export'],
      documents: ['read', 'export'],
      alerts: ['read'],
      reports: ['create', 'read', 'generate', 'export'],
      organizations: ['read'],
      users: ['read'],
      audit: ['read', 'export'],
      penalties: ['read'],
    },
  },

  // ==================== CONSULTANT LEVEL ====================
  {
    roleKey: 'consultant_admin',
    displayName: 'Consultant Administrator',
    description: 'Full consultant firm operations - manages multiple organizations',
    permissions: {
      employees: ['create', 'read', 'update', 'delete', 'export'],
      trainings: ['create', 'read', 'update', 'delete', 'manage', 'generate'],
      medical: ['create', 'read', 'update', 'delete', 'export'],
      equipment: ['create', 'read', 'update', 'delete', 'export'],
      documents: ['create', 'read', 'update', 'delete', 'approve', 'generate'],
      alerts: ['create', 'read', 'update', 'manage'],
      reports: ['create', 'read', 'generate', 'export'],
      organizations: ['create', 'read', 'update'],
      users: ['create', 'read', 'update'],
      audit: ['read', 'export'],
      penalties: ['create', 'read', 'update'],
      settings: ['read', 'update'],
      billing: ['read'],
    },
  },
  {
    roleKey: 'consultant_ssm',
    displayName: 'SSM Consultant',
    description: 'Occupational health & safety consultant - SSM operations',
    permissions: {
      employees: ['create', 'read', 'update', 'export'],
      trainings: ['create', 'read', 'update', 'manage', 'generate'],
      medical: ['create', 'read', 'update', 'export'],
      equipment: ['create', 'read', 'update', 'export'],
      documents: ['create', 'read', 'update', 'generate'],
      alerts: ['create', 'read', 'update'],
      reports: ['create', 'read', 'generate', 'export'],
      organizations: ['read'],
      audit: ['read'],
      penalties: ['create', 'read', 'update'],
    },
  },
  {
    roleKey: 'consultant_psi',
    displayName: 'PSI Consultant',
    description: 'Fire safety consultant - PSI operations',
    permissions: {
      employees: ['read', 'update', 'export'],
      trainings: ['create', 'read', 'update', 'manage', 'generate'],
      equipment: ['create', 'read', 'update', 'export'],
      documents: ['create', 'read', 'update', 'generate'],
      alerts: ['create', 'read', 'update'],
      reports: ['create', 'read', 'generate', 'export'],
      organizations: ['read'],
      audit: ['read'],
      penalties: ['create', 'read', 'update'],
    },
  },
  {
    roleKey: 'consultant_manager',
    displayName: 'Consultant Manager',
    description: 'Manages consultant operations and client relationships',
    permissions: {
      employees: ['read', 'update', 'export'],
      trainings: ['read', 'update', 'generate'],
      medical: ['read', 'export'],
      equipment: ['read', 'export'],
      documents: ['read', 'update', 'generate'],
      alerts: ['read', 'update'],
      reports: ['create', 'read', 'generate', 'export'],
      organizations: ['read'],
      users: ['read'],
      audit: ['read'],
      penalties: ['read', 'update'],
    },
  },
  {
    roleKey: 'consultant_assistant',
    displayName: 'Consultant Assistant',
    description: 'Administrative support for consultant operations',
    permissions: {
      employees: ['read', 'update'],
      trainings: ['read', 'update'],
      medical: ['read'],
      equipment: ['read', 'update'],
      documents: ['read', 'update'],
      alerts: ['read'],
      reports: ['read', 'generate'],
      organizations: ['read'],
    },
  },
  {
    roleKey: 'consultant_viewer',
    displayName: 'Consultant Viewer',
    description: 'Read-only access for consultant firms',
    permissions: {
      employees: ['read'],
      trainings: ['read'],
      medical: ['read'],
      equipment: ['read'],
      documents: ['read'],
      alerts: ['read'],
      reports: ['read'],
      organizations: ['read'],
    },
  },

  // ==================== ORGANIZATION LEVEL ====================
  {
    roleKey: 'org_admin',
    displayName: 'Organization Administrator',
    description: 'Full organization management - all internal operations',
    permissions: {
      employees: ['create', 'read', 'update', 'delete', 'export'],
      trainings: ['create', 'read', 'update', 'manage'],
      medical: ['create', 'read', 'update', 'export'],
      equipment: ['create', 'read', 'update', 'delete', 'export'],
      documents: ['create', 'read', 'update', 'export'],
      alerts: ['read', 'update'],
      reports: ['read', 'generate', 'export'],
      users: ['create', 'read', 'update'],
      audit: ['read'],
      settings: ['read', 'update'],
    },
  },
  {
    roleKey: 'org_manager',
    displayName: 'Organization Manager',
    description: 'Department manager - manages employees and compliance',
    permissions: {
      employees: ['create', 'read', 'update', 'export'],
      trainings: ['read', 'update', 'manage'],
      medical: ['read', 'update', 'export'],
      equipment: ['read', 'update', 'export'],
      documents: ['read', 'update'],
      alerts: ['read', 'update'],
      reports: ['read', 'generate', 'export'],
      users: ['read'],
    },
  },
  {
    roleKey: 'org_hr',
    displayName: 'HR Manager',
    description: 'Human resources - employee data and training coordination',
    permissions: {
      employees: ['create', 'read', 'update', 'export'],
      trainings: ['create', 'read', 'update', 'manage'],
      medical: ['read', 'update', 'export'],
      documents: ['read', 'update'],
      alerts: ['read'],
      reports: ['read', 'generate', 'export'],
    },
  },
  {
    roleKey: 'org_safety_officer',
    displayName: 'Safety Officer',
    description: 'Internal safety officer - monitors compliance and incidents',
    permissions: {
      employees: ['read', 'export'],
      trainings: ['create', 'read', 'update', 'manage'],
      medical: ['read', 'export'],
      equipment: ['create', 'read', 'update', 'export'],
      documents: ['read', 'update'],
      alerts: ['create', 'read', 'update'],
      reports: ['create', 'read', 'generate', 'export'],
      penalties: ['read'],
    },
  },
  {
    roleKey: 'org_supervisor',
    displayName: 'Supervisor',
    description: 'Team supervisor - monitors team compliance',
    permissions: {
      employees: ['read'],
      trainings: ['read', 'update'],
      medical: ['read'],
      equipment: ['read', 'update'],
      documents: ['read'],
      alerts: ['read', 'update'],
      reports: ['read'],
    },
  },
  {
    roleKey: 'org_coordinator',
    displayName: 'Coordinator',
    description: 'Training and document coordinator',
    permissions: {
      employees: ['read'],
      trainings: ['read', 'update', 'manage'],
      documents: ['read', 'update'],
      alerts: ['read'],
      reports: ['read', 'generate'],
    },
  },
  {
    roleKey: 'org_viewer',
    displayName: 'Organization Viewer',
    description: 'Read-only access to organization data',
    permissions: {
      employees: ['read'],
      trainings: ['read'],
      medical: ['read'],
      equipment: ['read'],
      documents: ['read'],
      alerts: ['read'],
      reports: ['read'],
    },
  },

  // ==================== WORKER LEVEL ====================
  {
    roleKey: 'worker',
    displayName: 'Worker',
    description: 'Standard employee - own data only',
    permissions: {
      employees: ['read'], // own profile only
      trainings: ['read'], // own trainings only
      medical: ['read'], // own medical records only
      equipment: ['read'], // assigned equipment only
      documents: ['read'], // own documents only
      alerts: ['read'], // own alerts only
    },
  },
  {
    roleKey: 'worker_team_lead',
    displayName: 'Team Lead',
    description: 'Team leader - can view team member data',
    permissions: {
      employees: ['read'], // team members only
      trainings: ['read', 'update'], // team trainings
      medical: ['read'],
      equipment: ['read', 'update'],
      documents: ['read'],
      alerts: ['read', 'update'],
      reports: ['read'],
    },
  },

  // ==================== INSPECTOR LEVEL ====================
  {
    roleKey: 'inspector',
    displayName: 'Inspector',
    description: 'External inspector - audit and compliance checks',
    permissions: {
      employees: ['read', 'export'],
      trainings: ['read', 'export'],
      medical: ['read', 'export'],
      equipment: ['read', 'export'],
      documents: ['read', 'export'],
      alerts: ['read'],
      reports: ['read', 'export'],
      audit: ['read', 'export'],
      penalties: ['create', 'read', 'update'],
    },
  },
  {
    roleKey: 'inspector_ssm',
    displayName: 'SSM Inspector',
    description: 'Occupational safety inspector',
    permissions: {
      employees: ['read', 'export'],
      trainings: ['read', 'export'],
      medical: ['read', 'export'],
      equipment: ['read', 'export'],
      documents: ['read', 'export'],
      reports: ['read', 'export'],
      penalties: ['create', 'read', 'update'],
    },
  },
  {
    roleKey: 'inspector_psi',
    displayName: 'PSI Inspector',
    description: 'Fire safety inspector',
    permissions: {
      equipment: ['read', 'export'],
      documents: ['read', 'export'],
      reports: ['read', 'export'],
      penalties: ['create', 'read', 'update'],
    },
  },

  // ==================== MEDICAL LEVEL ====================
  {
    roleKey: 'medical_doctor',
    displayName: 'Occupational Doctor',
    description: 'Medical professional - manages medical records',
    permissions: {
      employees: ['read', 'export'],
      medical: ['create', 'read', 'update', 'export'],
      documents: ['create', 'read', 'approve'],
      reports: ['create', 'read', 'generate', 'export'],
      alerts: ['read'],
    },
  },
  {
    roleKey: 'medical_nurse',
    displayName: 'Occupational Nurse',
    description: 'Medical assistant - updates medical records',
    permissions: {
      employees: ['read'],
      medical: ['read', 'update'],
      documents: ['read'],
      reports: ['read'],
    },
  },

  // ==================== TRAINER LEVEL ====================
  {
    roleKey: 'trainer',
    displayName: 'Trainer',
    description: 'External trainer - conducts and certifies training',
    permissions: {
      employees: ['read'],
      trainings: ['read', 'update', 'manage'],
      documents: ['create', 'read', 'generate'],
      reports: ['create', 'read', 'generate'],
    },
  },
  {
    roleKey: 'trainer_ssm',
    displayName: 'SSM Trainer',
    description: 'Occupational safety trainer',
    permissions: {
      employees: ['read'],
      trainings: ['read', 'update', 'manage'],
      documents: ['create', 'read', 'generate'],
      reports: ['create', 'read', 'generate'],
    },
  },
  {
    roleKey: 'trainer_psi',
    displayName: 'PSI Trainer',
    description: 'Fire safety trainer',
    permissions: {
      employees: ['read'],
      trainings: ['read', 'update', 'manage'],
      documents: ['create', 'read', 'generate'],
      reports: ['create', 'read', 'generate'],
    },
  },

  // ==================== EXTERNAL LEVEL ====================
  {
    roleKey: 'external_auditor',
    displayName: 'External Auditor',
    description: 'Third-party auditor - read-only compliance audit',
    permissions: {
      employees: ['read', 'export'],
      trainings: ['read', 'export'],
      medical: ['read', 'export'],
      equipment: ['read', 'export'],
      documents: ['read', 'export'],
      reports: ['read', 'export'],
      audit: ['read', 'export'],
    },
  },
];

/**
 * Get permissions for a specific role
 */
export function getRolePermissions(roleKey: string): RolePermission | undefined {
  return ROLE_PERMISSIONS.find((role) => role.roleKey === roleKey);
}

/**
 * Check if a role has a specific permission
 *
 * @param roleKey - The role key to check (e.g., 'consultant_ssm')
 * @param resource - The resource/module (e.g., 'employees', 'trainings')
 * @param action - The action to check (e.g., 'create', 'read', 'update')
 * @returns true if the role has the permission, false otherwise
 *
 * @example
 * hasPermission('consultant_ssm', 'employees', 'create') // true
 * hasPermission('worker', 'employees', 'delete') // false
 */
export function hasPermission(
  roleKey: string,
  resource: string,
  action: PermissionAction
): boolean {
  const role = getRolePermissions(roleKey);
  if (!role) {
    return false;
  }

  const modulePermissions = role.permissions[resource];
  if (!modulePermissions) {
    return false;
  }

  return modulePermissions.includes(action);
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(
  roleKey: string,
  resource: string,
  actions: PermissionAction[]
): boolean {
  return actions.some((action) => hasPermission(roleKey, resource, action));
}

/**
 * Check if a role has ALL of the specified permissions
 */
export function hasAllPermissions(
  roleKey: string,
  resource: string,
  actions: PermissionAction[]
): boolean {
  return actions.every((action) => hasPermission(roleKey, resource, action));
}

/**
 * Get all permissions for a specific resource across a role
 */
export function getResourcePermissions(
  roleKey: string,
  resource: string
): PermissionAction[] {
  const role = getRolePermissions(roleKey);
  if (!role) {
    return [];
  }

  return role.permissions[resource] || [];
}

/**
 * Get all resources a role has access to
 */
export function getRoleResources(roleKey: string): string[] {
  const role = getRolePermissions(roleKey);
  if (!role) {
    return [];
  }

  return Object.keys(role.permissions);
}

/**
 * Get all role keys
 */
export function getAllRoleKeys(): string[] {
  return ROLE_PERMISSIONS.map((role) => role.roleKey);
}

/**
 * Get roles by permission - find all roles that have a specific permission
 */
export function getRolesByPermission(
  resource: string,
  action: PermissionAction
): RolePermission[] {
  return ROLE_PERMISSIONS.filter((role) =>
    hasPermission(role.roleKey, resource, action)
  );
}

/**
 * Check if a role is a super admin
 */
export function isSuperAdmin(roleKey: string): boolean {
  return roleKey === 'super_admin';
}

/**
 * Check if a role is an admin at any level
 */
export function isAdmin(roleKey: string): boolean {
  return roleKey.includes('admin') || roleKey === 'super_admin';
}

/**
 * Check if a role is a consultant
 */
export function isConsultant(roleKey: string): boolean {
  return roleKey.startsWith('consultant_');
}

/**
 * Check if a role is organization-level
 */
export function isOrgRole(roleKey: string): boolean {
  return roleKey.startsWith('org_');
}

/**
 * Check if a role is worker-level
 */
export function isWorker(roleKey: string): boolean {
  return roleKey.startsWith('worker');
}
