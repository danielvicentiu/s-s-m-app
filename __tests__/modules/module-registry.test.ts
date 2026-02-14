/**
 * MODULE REGISTRY TESTS
 *
 * Comprehensive test suite for lib/modules/index.ts ModuleRegistry
 * Covers module registration, retrieval, activation/deactivation, dependency checks
 *
 * TEST COVERAGE:
 * 1. Registers module - verifies all 10 modules are registered on initialization
 * 2. Gets module by id - retrieves a specific module by its key
 * 3. Activates module - successfully activates a module for an organization
 * 4. Deactivates module - successfully deactivates a module for an organization
 * 5. Checks dependencies before activate - auto-activates dependencies when activating a module
 * 6. Prevents deactivate if dependents active - blocks deactivation if other modules depend on it
 * 7. Lists active modules for org - retrieves all active/trial modules with valid expiry dates
 * 8. Handles incompatible modules - prevents activation of incompatible modules
 */

import { ModuleRegistry } from '@/lib/modules'
import type { ModuleKey, ModuleStatus, OrganizationModule } from '@/lib/modules/types'

// ══════════════════════════════════════════════════════════════
// MOCKS
// ══════════════════════════════════════════════════════════════

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(),
}

jest.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowser: jest.fn(() => mockSupabase),
}))

// ══════════════════════════════════════════════════════════════
// TEST DATA FACTORIES
// ══════════════════════════════════════════════════════════════

function createMockOrganizationModule(
  moduleKey: ModuleKey,
  status: ModuleStatus = 'active',
  overrides: Partial<OrganizationModule> = {}
): OrganizationModule {
  const now = new Date()
  const futureExpiry = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now

  return {
    id: `module_${moduleKey}_${Date.now()}`,
    organization_id: 'org_test_123',
    module_key: moduleKey,
    status,
    trial_started_at: null,
    trial_expires_at: null,
    activated_at: now.toISOString(),
    expires_at: status === 'active' ? futureExpiry.toISOString() : null,
    config: {},
    activated_by: 'user_test_123',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    ...overrides,
  }
}

// ══════════════════════════════════════════════════════════════
// TESTS
// ══════════════════════════════════════════════════════════════

describe('ModuleRegistry', () => {
  let registry: ModuleRegistry

  // Silence console logs during tests
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    registry = ModuleRegistry.getInstance()
  })

  // ──────────────────────────────────────────────────────────
  // TEST 1: Registers module
  // ──────────────────────────────────────────────────────────

  test('registers all 10 modules on initialization', () => {
    // Act
    const allModules = registry.getAllModules()

    // Assert - Should have 10 modules registered
    expect(allModules).toHaveLength(10)

    // Assert - Check specific modules are registered
    const moduleKeys = allModules.map(m => m.key)
    expect(moduleKeys).toContain('ssm-core')
    expect(moduleKeys).toContain('psi')
    expect(moduleKeys).toContain('gdpr')
    expect(moduleKeys).toContain('nis2')
    expect(moduleKeys).toContain('echipamente')
    expect(moduleKeys).toContain('near_miss')
    expect(moduleKeys).toContain('legislatie')
    expect(moduleKeys).toContain('alerte')
    expect(moduleKeys).toContain('documents')
    expect(moduleKeys).toContain('reports')

    // Assert - Each module has required properties
    allModules.forEach(module => {
      expect(module.key).toBeDefined()
      expect(module.name_en).toBeDefined()
      expect(module.name_localized).toBeDefined()
      expect(module.description_en).toBeDefined()
      expect(module.icon).toBeDefined()
      expect(module.category).toMatch(/^(core|standalone|premium)$/)
      expect(typeof module.is_base).toBe('boolean')
      expect(Array.isArray(module.depends_on)).toBe(true)
      expect(Array.isArray(module.incompatible)).toBe(true)
      expect(typeof module.getDefaultConfig).toBe('function')
      expect(typeof module.validateConfig).toBe('function')
    })
  })

  // ──────────────────────────────────────────────────────────
  // TEST 2: Gets module by id
  // ──────────────────────────────────────────────────────────

  test('gets module by id successfully', () => {
    // Act
    const ssmModule = registry.getModule('ssm-core')
    const gdprModule = registry.getModule('gdpr')
    const nonExistentModule = registry.getModule('non-existent' as ModuleKey)

    // Assert - SSM Core module exists
    expect(ssmModule).toBeDefined()
    expect(ssmModule?.key).toBe('ssm-core')
    expect(ssmModule?.name_en).toBe('SSM Core')
    expect(ssmModule?.category).toBe('core')
    expect(ssmModule?.is_base).toBe(true)

    // Assert - GDPR module exists
    expect(gdprModule).toBeDefined()
    expect(gdprModule?.key).toBe('gdpr')
    expect(gdprModule?.category).toBe('premium')

    // Assert - Non-existent module returns undefined
    expect(nonExistentModule).toBeUndefined()
  })

  // ──────────────────────────────────────────────────────────
  // TEST 3: Activates module
  // ──────────────────────────────────────────────────────────

  test('activates module for organization successfully', async () => {
    // Arrange
    const orgId = 'org_test_123'
    const moduleKey: ModuleKey = 'alerte'

    // Mock getActiveModules (no active modules yet)
    const mockSelect = jest.fn().mockReturnThis()
    const mockEq = jest.fn().mockResolvedValue({
      data: [],
      error: null,
    })
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
      upsert: jest.fn().mockResolvedValue({ error: null }),
    })
    mockSelect.mockReturnValue({
      eq: mockEq,
    })

    // Act
    const result = await registry.activateModule(orgId, moduleKey)

    // Assert - Activation successful
    expect(result.success).toBe(true)
    expect(result.message).toContain('activated successfully')
    expect(result.activated).toContain(moduleKey)
    expect(result.errors).toBeUndefined()
  })

  // ──────────────────────────────────────────────────────────
  // TEST 4: Deactivates module
  // ──────────────────────────────────────────────────────────

  test('deactivates module for organization successfully', async () => {
    // Arrange
    const orgId = 'org_test_123'
    const moduleKey: ModuleKey = 'alerte'

    // Mock getActiveModules (only 'alerte' is active, no dependents)
    const mockSelect = jest.fn().mockReturnThis()
    const mockEq = jest.fn().mockResolvedValue({
      data: [createMockOrganizationModule(moduleKey)],
      error: null,
    })

    // Mock update chain
    const mockUpdateEq1 = jest.fn().mockReturnThis()
    const mockUpdateEq2 = jest.fn().mockResolvedValue({ error: null })
    const mockUpdate = jest.fn(() => ({
      eq: mockUpdateEq1,
    }))
    mockUpdateEq1.mockReturnValue({
      eq: mockUpdateEq2,
    })

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
      update: mockUpdate,
    })
    mockSelect.mockReturnValue({ eq: mockEq })

    // Act
    const result = await registry.deactivateModule(orgId, moduleKey)

    // Assert - Deactivation successful
    expect(result.success).toBe(true)
    expect(result.message).toContain('deactivated successfully')
    expect(result.errors).toBeUndefined()
  })

  // ──────────────────────────────────────────────────────────
  // TEST 5: Checks dependencies before activate
  // ──────────────────────────────────────────────────────────

  test('checks dependencies and auto-activates them before activating module', async () => {
    // Arrange
    const orgId = 'org_test_123'
    const moduleKey: ModuleKey = 'legislatie' // legislatie depends on ssm-core

    // Mock getActiveModules (no active modules)
    const mockSelect = jest.fn().mockReturnThis()
    const mockEq = jest.fn().mockResolvedValue({
      data: [],
      error: null,
    })

    const mockUpsert = jest.fn().mockResolvedValue({ error: null })

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
      upsert: mockUpsert,
    })
    mockSelect.mockReturnValue({ eq: mockEq })

    // Act
    const result = await registry.activateModule(orgId, moduleKey)

    // Assert - Both module and its dependencies activated
    expect(result.success).toBe(true)
    expect(result.message).toContain('activated successfully')
    expect(result.message).toContain('with dependencies')
    expect(result.activated).toBeDefined()

    // Assert - Dependencies were activated first
    const legislationModule = registry.getModule(moduleKey)
    expect(legislationModule?.depends_on.length).toBeGreaterThan(0)

    // Assert - Upsert called multiple times (once for each dependency + the module itself)
    const expectedCallCount = 1 + (legislationModule?.depends_on.length || 0)
    expect(mockUpsert).toHaveBeenCalledTimes(expectedCallCount)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 6: Prevents deactivate if dependents active
  // ──────────────────────────────────────────────────────────

  test('prevents deactivation if other active modules depend on it', async () => {
    // Arrange
    const orgId = 'org_test_123'
    const baseModuleKey: ModuleKey = 'ssm-core' // Base module that others depend on
    const dependentModuleKey: ModuleKey = 'legislatie' // Depends on ssm-core

    // Mock getActiveModules (both ssm-core and legislatie are active)
    const mockSelect = jest.fn().mockReturnThis()
    const mockEq = jest.fn().mockResolvedValue({
      data: [
        createMockOrganizationModule(baseModuleKey),
        createMockOrganizationModule(dependentModuleKey),
      ],
      error: null,
    })

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    })
    mockSelect.mockReturnValue({ eq: mockEq })

    // Act
    const result = await registry.deactivateModule(orgId, baseModuleKey)

    // Assert - Deactivation blocked
    expect(result.success).toBe(false)
    expect(result.message).toContain('required by other active modules')
    expect(result.errors).toBeDefined()
    expect(result.errors!.length).toBeGreaterThan(0)
    expect(result.errors![0]).toContain('depend on')
    expect(result.errors![1]).toContain('deactivate dependent modules first')
  })

  // ──────────────────────────────────────────────────────────
  // TEST 7: Lists active modules for org
  // ──────────────────────────────────────────────────────────

  test('lists active modules for organization with valid expiry dates', async () => {
    // Arrange
    const orgId = 'org_test_123'
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) // 10 days ago

    // Mock organization_modules with various statuses
    const mockSelect = jest.fn().mockReturnThis()
    const mockEq = jest.fn().mockResolvedValue({
      data: [
        // Active module with future expiry - should be included
        {
          module_key: 'ssm-core',
          status: 'active',
          trial_expires_at: null,
          expires_at: futureDate.toISOString(),
        },
        // Trial module with future expiry - should be included
        {
          module_key: 'gdpr',
          status: 'trial',
          trial_expires_at: futureDate.toISOString(),
          expires_at: null,
        },
        // Inactive module - should NOT be included
        {
          module_key: 'psi',
          status: 'inactive',
          trial_expires_at: null,
          expires_at: null,
        },
        // Expired module - should NOT be included
        {
          module_key: 'nis2',
          status: 'active',
          trial_expires_at: null,
          expires_at: pastDate.toISOString(),
        },
        // Active module with no expiry (permanent) - should be included
        {
          module_key: 'alerte',
          status: 'active',
          trial_expires_at: null,
          expires_at: null,
        },
      ],
      error: null,
    })

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    })
    mockSelect.mockReturnValue({ eq: mockEq })

    // Act
    const activeModules = await registry.getActiveModules(orgId)

    // Assert - Only valid active/trial modules returned
    expect(activeModules).toHaveLength(3)

    const activeKeys = activeModules.map(m => m.key)
    expect(activeKeys).toContain('ssm-core')
    expect(activeKeys).toContain('gdpr')
    expect(activeKeys).toContain('alerte')
    expect(activeKeys).not.toContain('psi') // inactive
    expect(activeKeys).not.toContain('nis2') // expired

    // Assert - All returned modules are valid module definitions
    activeModules.forEach(module => {
      expect(module.key).toBeDefined()
      expect(module.name_en).toBeDefined()
      expect(typeof module.getDefaultConfig).toBe('function')
    })
  })

  // ──────────────────────────────────────────────────────────
  // TEST 8: Handles incompatible modules
  // ──────────────────────────────────────────────────────────

  test('prevents activation of incompatible modules', async () => {
    // Arrange
    const orgId = 'org_test_123'

    // Get a module and manually set an incompatible module for testing
    // Since current modules don't have incompatibilities, we'll create a test scenario
    const testModule = registry.getModule('gdpr')

    // Mock that an incompatible module is already active
    // For this test, let's simulate that 'nis2' is incompatible with 'gdpr'
    if (testModule) {
      testModule.incompatible = ['nis2'] // Temporarily set for testing
    }

    const mockSelect = jest.fn().mockReturnThis()
    const mockEq = jest.fn().mockResolvedValue({
      data: [
        createMockOrganizationModule('nis2'), // NIS2 is active
      ],
      error: null,
    })

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    })
    mockSelect.mockReturnValue({ eq: mockEq })

    // Act
    const result = await registry.activateModule(orgId, 'gdpr')

    // Assert - Activation blocked due to incompatibility
    expect(result.success).toBe(false)
    expect(result.message).toContain('incompatible')
    expect(result.errors).toBeDefined()
    expect(result.errors!.length).toBeGreaterThan(0)
    expect(result.errors![0]).toContain('must be deactivated first')

    // Cleanup - reset incompatible list
    if (testModule) {
      testModule.incompatible = []
    }
  })
})
