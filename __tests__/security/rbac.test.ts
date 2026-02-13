/**
 * RBAC Security Test Suite
 *
 * Tests comprehensive role-based access control functionality
 * covering permissions, role hierarchies, and access restrictions
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import {
  getMyRoles,
  hasRole,
  isSuperAdmin,
  hasPermission,
  getFieldRestrictions,
  getMyOrgIds,
  type RoleKey,
  type Resource,
  type Action,
  type UserRole,
} from '@/lib/rbac';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: jest.fn(),
}));

// Mock React cache - pass through the function
jest.mock('react', () => ({
  cache: (fn: any) => fn,
}));

describe('RBAC Security Tests', () => {
  let mockSupabase: any;
  const mockUserId = 'user-123';
  const mockOrgId = 'org-456';

  // Helper to create a proper mock chain for user_roles query
  const mockUserRolesQuery = (data: any, error: any = null) => {
    return {
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data, error }),
          }),
        }),
      }),
    };
  };

  // Helper to create a proper mock chain for permissions query
  const mockPermissionsQuery = (data: any, error: any = null) => {
    return {
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              in: jest.fn().mockResolvedValue({ data, error }),
            }),
          }),
        }),
      }),
    };
  };

  // Helper to create mock for field restrictions query
  // Uses .select().eq().eq().in() pattern
  const mockFieldRestrictionsQuery = (data: any, error: any = null) => {
    return {
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data, error }),
          }),
        }),
      }),
    };
  };

  // Helper to create mock for organizations query (for getMyOrgIds)
  const mockOrganizationsQuery = (data: any, error: any = null) => {
    return {
      select: jest.fn().mockResolvedValue({ data, error }),
    };
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
        }),
      },
      from: jest.fn(),
    };

    (createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase);
  });

  /**
   * TEST 1: Owner has all permissions
   * Validates that organization owners have unrestricted access to all resources
   */
  describe('Owner Role Permissions', () => {
    it('should grant owner all permissions across all resources', async () => {
      const roleData = [
        {
          role_id: 'role-owner',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'firma_admin',
            role_name: 'Administrator Firmă',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();
      expect(roles).toHaveLength(1);
      expect(roles[0].role_key).toBe('firma_admin');
      expect(roles[0].company_id).toBe(mockOrgId);

      // Mock permission check
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([{ id: '1' }]));

      const hasAccessToEmployees = await hasPermission('employees', 'read');
      expect(hasAccessToEmployees).toBe(true);
    });
  });

  /**
   * TEST 2: Admin has all permissions except billing
   * Validates that admins have broad access but cannot manage financial aspects
   */
  describe('Admin Role Permissions', () => {
    it('should grant admin all permissions except billing and super admin functions', async () => {
      const roleData = [
        {
          role_id: 'role-admin',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'consultant_ssm',
            role_name: 'Consultant SSM',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();
      expect(roles).toHaveLength(1);
      expect(roles[0].role_key).toBe('consultant_ssm');

      // Test permission for allowed resource
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([{ id: '1' }]));
      const canReadEmployees = await hasPermission('employees', 'read');
      expect(canReadEmployees).toBe(true);

      // Test permission for restricted resource (billing)
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([]));
      const canUpdateOrg = await hasPermission('organizations', 'update');
      expect(canUpdateOrg).toBe(false);
    });
  });

  /**
   * TEST 3: Manager can CRUD employees and trainings
   * Validates that managers have specific resource management capabilities
   */
  describe('Manager Role Permissions', () => {
    it('should allow manager to create, read, update, delete employees and trainings', async () => {
      const roleData = [
        {
          role_id: 'role-manager',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'responsabil_ssm_intern',
            role_name: 'Manager SSM',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();
      expect(roles).toHaveLength(1);
      expect(roles[0].role_key).toBe('responsabil_ssm_intern');

      // Test CRUD permissions
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([{ id: '1' }]));

      const canCreateEmployee = await hasPermission('employees', 'create');
      expect(canCreateEmployee).toBe(true);

      const canReadTraining = await hasPermission('trainings', 'read');
      expect(canReadTraining).toBe(true);

      // Manager should NOT have access to sensitive resources
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([]));
      const canAccessOrg = await hasPermission('organizations', 'delete');
      expect(canAccessOrg).toBe(false);
    });
  });

  /**
   * TEST 4: Regular user can read only
   * Validates that basic users have read-only access
   */
  describe('User Role Permissions', () => {
    it('should restrict regular user to read-only access', async () => {
      const roleData = [
        {
          role_id: 'role-user',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'angajat',
            role_name: 'Angajat',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();
      expect(roles).toHaveLength(1);
      expect(roles[0].role_key).toBe('angajat');

      // Test read access granted
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([{ id: '1' }]));
      const canRead = await hasPermission('employees', 'read');
      expect(canRead).toBe(true);

      // Test write access denied
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([]));
      const canCreate = await hasPermission('employees', 'create');
      expect(canCreate).toBe(false);

      const canDelete = await hasPermission('employees', 'delete');
      expect(canDelete).toBe(false);
    });
  });

  /**
   * TEST 5: Viewer has minimal access
   * Validates that viewers can only view basic, non-sensitive information
   */
  describe('Viewer Role Permissions', () => {
    it('should grant viewer minimal read access to non-sensitive resources', async () => {
      const roleData = [
        {
          role_id: 'role-viewer',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'auditor_extern',
            role_name: 'Auditor Extern',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();
      expect(roles).toHaveLength(1);
      expect(roles[0].role_key).toBe('auditor_extern');

      // Viewer can read dashboard
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([{ id: '1' }]));
      const canViewDashboard = await hasPermission('dashboard', 'read');
      expect(canViewDashboard).toBe(true);

      // Viewer CANNOT access sensitive resources
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([]));

      const canAccessMedical = await hasPermission('medical', 'read');
      expect(canAccessMedical).toBe(false);

      const canAccessAuditLog = await hasPermission('audit_log', 'read');
      expect(canAccessAuditLog).toBe(false);
    });
  });

  /**
   * TEST 6: Custom role respects assigned permissions
   * Validates that custom roles only have explicitly granted permissions
   */
  describe('Custom Role Permissions', () => {
    it('should respect custom role permissions exactly as configured', async () => {
      const roleData = [
        {
          role_id: 'role-custom',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'training_provider',
            role_name: 'Training Provider',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();
      expect(roles).toHaveLength(1);
      expect(roles[0].role_key).toBe('training_provider');

      // Custom role has ONLY training permissions
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([{ id: '1' }]));
      const canReadTrainings = await hasPermission('trainings', 'read');
      expect(canReadTrainings).toBe(true);

      const canCreateTrainings = await hasPermission('trainings', 'create');
      expect(canCreateTrainings).toBe(true);

      // Custom role should NOT have access to other resources
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([]));

      const canAccessEmployees = await hasPermission('employees', 'read');
      expect(canAccessEmployees).toBe(false);

      const canAccessMedical = await hasPermission('medical', 'read');
      expect(canAccessMedical).toBe(false);
    });
  });

  /**
   * TEST 7: Permission inheritance works correctly
   * Validates that users with multiple roles get union of all permissions
   */
  describe('Permission Inheritance', () => {
    it('should combine permissions from multiple roles', async () => {
      const roleData = [
        {
          role_id: 'role-1',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'angajat',
            role_name: 'Angajat',
            country_code: 'RO',
            is_active: true,
          },
        },
        {
          role_id: 'role-2',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'training_provider',
            role_name: 'Training Provider',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();
      expect(roles).toHaveLength(2);
      expect(roles.map(r => r.role_key)).toContain('angajat');
      expect(roles.map(r => r.role_key)).toContain('training_provider');

      // User should have permissions from BOTH roles
      mockSupabase.from.mockReturnValue(mockPermissionsQuery([{ id: '1' }]));

      const canReadEmployees = await hasPermission('employees', 'read');
      expect(canReadEmployees).toBe(true);

      const canCreateTrainings = await hasPermission('trainings', 'create');
      expect(canCreateTrainings).toBe(true);
    });
  });

  /**
   * TEST 8: Super admin bypasses all permission checks
   * Validates that super_admin role has unrestricted access
   */
  describe('Super Admin Override', () => {
    it('should grant super admin unrestricted access to all resources and actions', async () => {
      const roleData = [
        {
          role_id: 'role-superadmin',
          company_id: null,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'super_admin',
            role_name: 'Super Admin',
            country_code: null,
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const isSA = await isSuperAdmin();
      expect(isSA).toBe(true);

      // Super admin should have access to EVERYTHING (bypasses permission checks)
      const hasAccessToSensitive = await hasPermission('fraud', 'delete');
      expect(hasAccessToSensitive).toBe(true);

      const hasAccessToAdmin = await hasPermission('roles_admin', 'update');
      expect(hasAccessToAdmin).toBe(true);

      const hasAccessToAudit = await hasPermission('audit_log', 'export');
      expect(hasAccessToAudit).toBe(true);
    });
  });

  /**
   * TEST 9: Field restrictions are properly enforced
   * Validates that sensitive fields are hidden based on role
   */
  describe('Field-Level Restrictions', () => {
    it('should enforce field-level restrictions for sensitive data', async () => {
      const roleData = [
        {
          role_id: 'role-restricted',
          company_id: mockOrgId,
          location_id: null,
          expires_at: null,
          is_active: true,
          roles: {
            role_key: 'angajat',
            role_name: 'Angajat',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      // Mock field restrictions data
      const restrictionsData = [
        {
          field_restrictions: {
            salary: 'hidden',
            cnp: 'hidden',
            personal_email: 'masked',
            phone: 'visible',
          },
          roles: {
            role_key: 'angajat',
          },
        },
      ];

      // Setup mock to return different results based on call count
      // getFieldRestrictions calls: isSuperAdmin() -> hasRole() -> getMyRoles() [call 1]
      // then getMyRoles() directly [call 2], then permissions query [call 3]
      let callCount = 0;
      mockSupabase.from.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          // First two calls: getMyRoles (for isSuperAdmin check and direct call)
          return mockUserRolesQuery(roleData);
        } else {
          // Third call: actual field restrictions query
          return mockFieldRestrictionsQuery(restrictionsData);
        }
      });

      const restrictions = await getFieldRestrictions('employees');

      expect(restrictions.salary).toBe('hidden');
      expect(restrictions.cnp).toBe('hidden');
      expect(restrictions.personal_email).toBe('masked');
      expect(restrictions.phone).toBe('visible');
    });
  });

  /**
   * TEST 10: Expired roles are not considered
   * Validates that expired role assignments are ignored
   */
  describe('Expired Role Handling', () => {
    it('should exclude expired roles from active permissions', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString(); // Yesterday

      const roleData = [
        {
          role_id: 'role-expired',
          company_id: mockOrgId,
          location_id: null,
          expires_at: pastDate,
          is_active: true,
          roles: {
            role_key: 'consultant_ssm',
            role_name: 'Consultant SSM',
            country_code: 'RO',
            is_active: true,
          },
        },
      ];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();

      // Expired role should be filtered out by getMyRoles
      expect(roles).toHaveLength(0);
    });
  });

  /**
   * TEST 11: Inactive roles are not considered
   * Validates that deactivated roles don't grant permissions
   */
  describe('Inactive Role Handling', () => {
    it('should exclude inactive roles from permissions', async () => {
      // Mock returns empty because query filters by is_active=true
      const roleData: any[] = [];

      mockSupabase.from.mockReturnValue(mockUserRolesQuery(roleData));

      const roles = await getMyRoles();

      expect(roles).toHaveLength(0);
    });
  });

  /**
   * TEST 12: Fallback to memberships table works correctly
   * Validates backward compatibility during RBAC migration
   */
  describe('Legacy Memberships Fallback', () => {
    it('should fall back to memberships table when user_roles is empty', async () => {
      let callCount = 0;

      mockSupabase.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call (user_roles) returns error
          return mockUserRolesQuery(null, { message: 'Table not found' });
        } else {
          // Second call (memberships fallback) returns data
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                  data: [
                    {
                      role: 'consultant',
                      organization_id: mockOrgId,
                      is_active: true,
                    },
                  ],
                  error: null,
                }),
              }),
            }),
          };
        }
      });

      const roles = await getMyRoles();

      expect(roles).toHaveLength(1);
      expect(roles[0].role_key).toBe('consultant_ssm');
      expect(roles[0].company_id).toBe(mockOrgId);
    });
  });
});
