/**
 * Role-Permissions Matrix
 *
 * Defines a comprehensive permissions matrix for the SSM/PSI platform.
 * This matrix maps roles to resources and their allowed actions.
 *
 * Roles:
 * - super_admin: Platform administrator with full access
 * - org_admin: Organization administrator
 * - manager: Department/team manager
 * - employee: Standard employee
 * - viewer: Read-only access user
 *
 * Resources:
 * - employees: Employee management
 * - trainings: Training records and scheduling
 * - medical: Medical records and examinations
 * - equipment: Equipment and PPE management
 * - documents: Document management
 * - reports: Reports and analytics
 * - settings: Organization and system settings
 * - team: Team/department management
 * - alerts: Alerts and notifications
 * - audit: Audit logs and compliance records
 *
 * Actions:
 * - create: Create new records
 * - read: View/read records
 * - update: Edit existing records
 * - delete: Delete records
 * - export: Export data
 */

export type Role = 'super_admin' | 'org_admin' | 'manager' | 'employee' | 'viewer';

export type Resource =
  | 'employees'
  | 'trainings'
  | 'medical'
  | 'equipment'
  | 'documents'
  | 'reports'
  | 'settings'
  | 'team'
  | 'alerts'
  | 'audit';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'export';

export type Permission = `${Resource}:${Action}`;

type RolePermissionsMatrix = {
  [K in Role]: {
    [R in Resource]: {
      [A in Action]: boolean;
    };
  };
};

/**
 * Complete permissions matrix
 * Each role has granular permissions for every resource/action combination
 */
export const rolePermissionsMatrix: RolePermissionsMatrix = {
  super_admin: {
    employees: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    trainings: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    medical: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    equipment: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    documents: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    reports: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    settings: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    team: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    alerts: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    audit: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
  },

  org_admin: {
    employees: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    trainings: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    medical: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    equipment: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    documents: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    reports: {
      create: true,
      read: true,
      update: true,
      delete: false, // Can't delete reports
      export: true,
    },
    settings: {
      create: false, // Can't create new settings categories
      read: true,
      update: true,
      delete: false,
      export: false,
    },
    team: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    alerts: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    },
    audit: {
      create: false, // Audit logs are auto-generated
      read: true,
      update: false, // Audit logs are immutable
      delete: false,
      export: true,
    },
  },

  manager: {
    employees: {
      create: true,
      read: true,
      update: true,
      delete: false, // Can't delete employees
      export: true,
    },
    trainings: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
    },
    medical: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
    },
    equipment: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
    },
    documents: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
    },
    reports: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
    },
    settings: {
      create: false,
      read: true,
      update: false, // Can only view settings
      delete: false,
      export: false,
    },
    team: {
      create: true, // Can add team members
      read: true,
      update: true,
      delete: false,
      export: true,
    },
    alerts: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: false,
    },
    audit: {
      create: false,
      read: true, // Can view audit logs for their team
      update: false,
      delete: false,
      export: false,
    },
  },

  employee: {
    employees: {
      create: false,
      read: true, // Can view colleagues
      update: false,
      delete: false,
      export: false,
    },
    trainings: {
      create: false,
      read: true, // Can view own trainings
      update: false,
      delete: false,
      export: false,
    },
    medical: {
      create: false,
      read: true, // Can view own medical records
      update: false,
      delete: false,
      export: false,
    },
    equipment: {
      create: false,
      read: true, // Can view assigned equipment
      update: false,
      delete: false,
      export: false,
    },
    documents: {
      create: false,
      read: true, // Can view relevant documents
      update: false,
      delete: false,
      export: false,
    },
    reports: {
      create: false,
      read: true, // Can view reports they're mentioned in
      update: false,
      delete: false,
      export: false,
    },
    settings: {
      create: false,
      read: true, // Can view their own settings
      update: true, // Can update their own preferences
      delete: false,
      export: false,
    },
    team: {
      create: false,
      read: true, // Can view team structure
      update: false,
      delete: false,
      export: false,
    },
    alerts: {
      create: false,
      read: true, // Can view their own alerts
      update: true, // Can mark alerts as read
      delete: false,
      export: false,
    },
    audit: {
      create: false,
      read: false, // Cannot view audit logs
      update: false,
      delete: false,
      export: false,
    },
  },

  viewer: {
    employees: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
    },
    trainings: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
    },
    medical: {
      create: false,
      read: false, // Viewers cannot access medical records
      update: false,
      delete: false,
      export: false,
    },
    equipment: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
    },
    documents: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
    },
    reports: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
    },
    settings: {
      create: false,
      read: false, // Cannot view settings
      update: false,
      delete: false,
      export: false,
    },
    team: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
    },
    alerts: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
    },
    audit: {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
    },
  },
};

/**
 * Helper function to check if a role has permission for a specific action on a resource
 */
export function hasPermission(
  role: Role,
  resource: Resource,
  action: Action
): boolean {
  return rolePermissionsMatrix[role][resource][action];
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(role: Role): Permission[] {
  const permissions: Permission[] = [];
  const rolePerms = rolePermissionsMatrix[role];

  for (const resource in rolePerms) {
    const resourcePerms = rolePerms[resource as Resource];
    for (const action in resourcePerms) {
      if (resourcePerms[action as Action]) {
        permissions.push(`${resource}:${action}` as Permission);
      }
    }
  }

  return permissions;
}

/**
 * Get all allowed actions for a role on a specific resource
 */
export function getAllowedActions(role: Role, resource: Resource): Action[] {
  const actions: Action[] = [];
  const resourcePerms = rolePermissionsMatrix[role][resource];

  for (const action in resourcePerms) {
    if (resourcePerms[action as Action]) {
      actions.push(action as Action);
    }
  }

  return actions;
}

/**
 * Check if a role can perform any action on a resource
 */
export function canAccessResource(role: Role, resource: Resource): boolean {
  const resourcePerms = rolePermissionsMatrix[role][resource];
  return Object.values(resourcePerms).some((hasPermission) => hasPermission);
}

/**
 * Get summary of permissions for a role
 */
export function getRolePermissionsSummary(role: Role): {
  resource: Resource;
  actions: Action[];
}[] {
  const summary: { resource: Resource; actions: Action[] }[] = [];

  for (const resource in rolePermissionsMatrix[role]) {
    const actions = getAllowedActions(role, resource as Resource);
    if (actions.length > 0) {
      summary.push({
        resource: resource as Resource,
        actions,
      });
    }
  }

  return summary;
}
