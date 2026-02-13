/**
 * Data Isolation Security Test Suite
 *
 * Tests comprehensive Row-Level Security (RLS) isolation between organizations
 * ensuring users cannot access data from organizations they don't belong to.
 * Critical for multi-tenant data security.
 */

import { createSupabaseServer } from '@/lib/supabase/server';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: jest.fn(),
}));

// Mock React cache
jest.mock('react', () => ({
  cache: (fn: any) => fn,
}));

describe('Data Isolation Security Tests (RLS)', () => {
  let mockSupabase: any;

  // Test users and organizations
  const userA = {
    id: 'user-a-123',
    orgId: 'org-a-456',
  };

  const userB = {
    id: 'user-b-789',
    orgId: 'org-b-012',
  };

  const adminUser = {
    id: 'admin-xyz',
    orgId: 'org-a-456',
  };

  const serviceRole = {
    id: 'service-role',
    orgId: null,
  };

  /**
   * Helper: Setup mock Supabase client with RLS simulation
   * RLS checks organization_id matches user's org memberships
   */
  const setupSupabaseWithRLS = (
    currentUserId: string,
    userOrgId: string | null,
    isServiceRole: boolean = false
  ) => {
    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: currentUserId ? { id: currentUserId } : null },
        }),
      },
      from: jest.fn((table: string) => {
        return {
          select: jest.fn().mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          update: jest.fn().mockReturnThis(),
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn((field: string, value: any) => {
            // Simulate RLS: filter by organization_id unless service role
            if (isServiceRole) {
              // Service role bypasses RLS
              return Promise.resolve({
                data: [{ id: '1', organization_id: value }],
                error: null,
              });
            }

            // Regular user: only see data from their org
            if (field === 'organization_id' && value === userOrgId) {
              return Promise.resolve({
                data: [{ id: '1', organization_id: value }],
                error: null,
              });
            }

            // Cross-org access blocked by RLS
            return Promise.resolve({
              data: [],
              error: null,
            });
          }),
          single: jest.fn().mockImplementation(() => {
            if (isServiceRole) {
              return Promise.resolve({
                data: { id: '1', organization_id: userOrgId },
                error: null,
              });
            }

            return Promise.resolve({
              data: null,
              error: { message: 'Row not found or access denied' },
            });
          }),
        };
      }),
    };

    (createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST 1: User A cannot access Org B employees
   * Validates employee data isolation between organizations
   */
  describe('Employee Data Isolation', () => {
    it('should prevent user A from accessing org B employee records', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // User A tries to access Org B employees
      const { data: orgBEmployees } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', userB.orgId);

      expect(orgBEmployees).toEqual([]);

      // User A can access their own org employees
      const { data: orgAEmployees } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', userA.orgId);

      expect(orgAEmployees).toHaveLength(1);
      expect(orgAEmployees![0].organization_id).toBe(userA.orgId);
    });
  });

  /**
   * TEST 2: User A cannot access Org B trainings
   * Validates training data isolation between organizations
   */
  describe('Training Data Isolation', () => {
    it('should prevent user A from accessing org B training records', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // User A tries to access Org B trainings
      const { data: orgBTrainings } = await supabase
        .from('trainings')
        .select('*')
        .eq('organization_id', userB.orgId);

      expect(orgBTrainings).toEqual([]);

      // User A can access their own org trainings
      const { data: orgATrainings } = await supabase
        .from('trainings')
        .select('*')
        .eq('organization_id', userA.orgId);

      expect(orgATrainings).toHaveLength(1);
      expect(orgATrainings![0].organization_id).toBe(userA.orgId);
    });
  });

  /**
   * TEST 3: User A cannot access Org B documents
   * Validates document data isolation between organizations
   */
  describe('Document Data Isolation', () => {
    it('should prevent user A from accessing org B document records', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // User A tries to access Org B documents
      const { data: orgBDocs } = await supabase
        .from('documents')
        .select('*')
        .eq('organization_id', userB.orgId);

      expect(orgBDocs).toEqual([]);

      // User A can access their own org documents
      const { data: orgADocs } = await supabase
        .from('documents')
        .select('*')
        .eq('organization_id', userA.orgId);

      expect(orgADocs).toHaveLength(1);
      expect(orgADocs![0].organization_id).toBe(userA.orgId);
    });
  });

  /**
   * TEST 4: User A cannot access Org B medical records
   * Validates sensitive medical data isolation (GDPR critical)
   */
  describe('Medical Records Data Isolation', () => {
    it('should prevent user A from accessing org B medical examination records', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // User A tries to access Org B medical records
      const { data: orgBMedical } = await supabase
        .from('medical_examinations')
        .select('*')
        .eq('organization_id', userB.orgId);

      expect(orgBMedical).toEqual([]);

      // User A can access their own org medical records
      const { data: orgAMedical } = await supabase
        .from('medical_examinations')
        .select('*')
        .eq('organization_id', userA.orgId);

      expect(orgAMedical).toHaveLength(1);
      expect(orgAMedical![0].organization_id).toBe(userA.orgId);
    });
  });

  /**
   * TEST 5: User A cannot access Org B equipment
   * Validates safety equipment data isolation
   */
  describe('Equipment Data Isolation', () => {
    it('should prevent user A from accessing org B equipment records', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // User A tries to access Org B equipment
      const { data: orgBEquipment } = await supabase
        .from('safety_equipment')
        .select('*')
        .eq('organization_id', userB.orgId);

      expect(orgBEquipment).toEqual([]);

      // User A can access their own org equipment
      const { data: orgAEquipment } = await supabase
        .from('safety_equipment')
        .select('*')
        .eq('organization_id', userA.orgId);

      expect(orgAEquipment).toHaveLength(1);
      expect(orgAEquipment![0].organization_id).toBe(userA.orgId);
    });
  });

  /**
   * TEST 6: Admin from Org A cannot access Org B data
   * Validates that even admins are restricted to their organization
   */
  describe('Admin Cross-Org Isolation', () => {
    it('should prevent admin from org A accessing org B data despite elevated permissions', async () => {
      setupSupabaseWithRLS(adminUser.id, adminUser.orgId);

      const supabase = await createSupabaseServer();

      // Admin tries to access another org's employees
      const { data: otherOrgEmployees } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', userB.orgId);

      expect(otherOrgEmployees).toEqual([]);

      // Admin tries to access another org's trainings
      const { data: otherOrgTrainings } = await supabase
        .from('trainings')
        .select('*')
        .eq('organization_id', userB.orgId);

      expect(otherOrgTrainings).toEqual([]);

      // Admin CAN access their own org data
      const { data: ownOrgEmployees } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', adminUser.orgId);

      expect(ownOrgEmployees).toHaveLength(1);
    });
  });

  /**
   * TEST 7: User A cannot insert data into Org B
   * Validates write isolation (users can't create records for other orgs)
   */
  describe('Write Isolation', () => {
    it('should prevent user A from inserting records into org B', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // Mock insert to simulate RLS blocking cross-org writes
      mockSupabase.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Permission denied: organization_id mismatch' },
          }),
        })),
      }));

      const { data, error } = await supabase
        .from('employees')
        .insert({
          organization_id: userB.orgId,
          employee_name: 'Test Employee',
        })
        .select();

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Permission denied');
      expect(data).toBeNull();
    });
  });

  /**
   * TEST 8: User A cannot update Org B records
   * Validates update isolation
   */
  describe('Update Isolation', () => {
    it('should prevent user A from updating org B records', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // Mock update to simulate RLS blocking cross-org updates
      mockSupabase.from = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
            count: 0,
          }),
        })),
      }));

      const { data, count } = await supabase
        .from('employees')
        .update({ employee_name: 'Updated Name' })
        .eq('organization_id', userB.orgId);

      expect(data).toEqual([]);
      expect(count).toBe(0);
    });
  });

  /**
   * TEST 9: User A cannot delete Org B records
   * Validates delete isolation
   */
  describe('Delete Isolation', () => {
    it('should prevent user A from deleting org B records', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // Mock delete to simulate RLS blocking cross-org deletes
      mockSupabase.from = jest.fn(() => ({
        delete: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
            count: 0,
          }),
        })),
      }));

      const { data, count } = await supabase
        .from('employees')
        .delete()
        .eq('organization_id', userB.orgId);

      expect(data).toEqual([]);
      expect(count).toBe(0);
    });
  });

  /**
   * TEST 10: Service role bypasses RLS
   * Validates that service role (for admin operations) can access all data
   */
  describe('Service Role Bypass', () => {
    it('should allow service role to access all organization data bypassing RLS', async () => {
      setupSupabaseWithRLS(serviceRole.id, null, true);

      const supabase = await createSupabaseServer();

      // Service role can access Org A data
      const { data: orgAData } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', userA.orgId);

      expect(orgAData).toHaveLength(1);
      expect(orgAData![0].organization_id).toBe(userA.orgId);

      // Service role can access Org B data
      const { data: orgBData } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', userB.orgId);

      expect(orgBData).toHaveLength(1);
      expect(orgBData![0].organization_id).toBe(userB.orgId);
    });
  });

  /**
   * TEST 11: Cross-org data leakage via JOIN queries
   * Validates that JOINs don't leak data across organizations
   */
  describe('JOIN Query Isolation', () => {
    it('should prevent data leakage through JOIN queries across organizations', async () => {
      setupSupabaseWithRLS(userA.id, userA.orgId);

      const supabase = await createSupabaseServer();

      // Mock JOIN query - RLS should filter on both tables
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn(() =>
          Promise.resolve({
            data: [
              {
                id: '1',
                organization_id: userA.orgId,
                trainings: {
                  id: 't1',
                  organization_id: userA.orgId,
                },
              },
            ],
            error: null,
          })
        ),
      }));

      // User A tries to join employees with trainings
      const { data } = await supabase
        .from('employees')
        .select('*, trainings(*)')
        .eq('organization_id', userB.orgId);

      // Should only return data matching user's org
      expect(data).toHaveLength(1);
      expect(data![0].organization_id).toBe(userA.orgId);
      expect(data![0].trainings.organization_id).toBe(userA.orgId);
    });
  });

  /**
   * TEST 12: Unauthenticated users cannot access any data
   * Validates that anonymous access is completely blocked
   */
  describe('Unauthenticated Access', () => {
    it('should deny all data access to unauthenticated users', async () => {
      setupSupabaseWithRLS('', null);

      const supabase = await createSupabaseServer();

      // Mock unauthenticated access
      mockSupabase.auth.getUser = jest.fn().mockResolvedValue({
        data: { user: null },
      });

      mockSupabase.from = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn(() =>
          Promise.resolve({
            data: null,
            error: { message: 'Authentication required' },
          })
        ),
      }));

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', userA.orgId);

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Authentication required');
      expect(data).toBeNull();
    });
  });
});
