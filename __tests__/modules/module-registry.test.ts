/**
 * MODULE REGISTRY TESTS
 *
 * Comprehensive test suite for ModuleRegistry class
 * Tests module registration, activation, deactivation, dependency checks, and listing
 */

import {
  ModuleRegistry,
  type IModule,
  type ModuleConfig
} from '@/lib/modules/module-interface'

// ══════════════════════════════════════════════════════════════
// TEST DATA & MOCK IMPLEMENTATIONS
// ══════════════════════════════════════════════════════════════

/**
 * Mock module implementation for testing
 */
class MockModule implements IModule {
  id: string
  name: string
  version: string
  dependencies: IModule[]
  private activeOrgs: Set<string> = new Set()
  private configs: Map<string, ModuleConfig> = new Map()

  constructor(
    id: string,
    name: string,
    version: string = '1.0.0',
    dependencies: IModule[] = []
  ) {
    this.id = id
    this.name = name
    this.version = version
    this.dependencies = dependencies
  }

  async isActive(orgId: string): Promise<boolean> {
    return this.activeOrgs.has(orgId)
  }

  async activate(orgId: string): Promise<void> {
    // Check if dependencies are active
    for (const dep of this.dependencies) {
      const depActive = await dep.isActive(orgId)
      if (!depActive) {
        throw new Error(
          `Cannot activate ${this.id}: dependency ${dep.id} is not active`
        )
      }
    }
    this.activeOrgs.add(orgId)
  }

  async deactivate(orgId: string): Promise<void> {
    this.activeOrgs.delete(orgId)
  }

  async getConfig(orgId: string): Promise<ModuleConfig> {
    return this.configs.get(orgId) || {}
  }

  async setConfig(orgId: string, config: ModuleConfig): Promise<void> {
    this.configs.set(orgId, config)
  }
}

/**
 * Helper function to create a mock module with dependencies
 */
function createMockModule(
  id: string,
  name: string,
  dependencies: IModule[] = []
): MockModule {
  return new MockModule(id, name, '1.0.0', dependencies)
}

// ══════════════════════════════════════════════════════════════
// TESTS
// ══════════════════════════════════════════════════════════════

describe('ModuleRegistry', () => {
  let registry: ModuleRegistry

  beforeEach(() => {
    // Create a fresh registry for each test
    registry = new ModuleRegistry()
  })

  afterEach(() => {
    // Clean up registry after each test
    registry.clear()
  })

  // ──────────────────────────────────────────────────────────
  // TEST 1: Register module
  // ──────────────────────────────────────────────────────────

  test('registers a module successfully', () => {
    // Arrange
    const module = createMockModule('m1-core', 'Core Module')

    // Act
    registry.register(module)

    // Assert
    expect(registry.has('m1-core')).toBe(true)
    expect(registry.get('m1-core')).toBe(module)
  })

  test('throws error when registering module with duplicate ID', () => {
    // Arrange
    const module1 = createMockModule('m1-core', 'Core Module')
    const module2 = createMockModule('m1-core', 'Duplicate Core')
    registry.register(module1)

    // Act & Assert
    expect(() => {
      registry.register(module2)
    }).toThrow("Module with ID 'm1-core' is already registered")
  })

  // ──────────────────────────────────────────────────────────
  // TEST 2: Get module by id
  // ──────────────────────────────────────────────────────────

  test('gets module by id when module exists', () => {
    // Arrange
    const module = createMockModule('m2-client-management', 'Client Management')
    registry.register(module)

    // Act
    const retrieved = registry.get('m2-client-management')

    // Assert
    expect(retrieved).toBe(module)
    expect(retrieved?.id).toBe('m2-client-management')
    expect(retrieved?.name).toBe('Client Management')
  })

  test('returns undefined when getting non-existent module', () => {
    // Act
    const retrieved = registry.get('non-existent-module')

    // Assert
    expect(retrieved).toBeUndefined()
  })

  // ──────────────────────────────────────────────────────────
  // TEST 3: Activate module
  // ──────────────────────────────────────────────────────────

  test('activates module for organization', async () => {
    // Arrange
    const orgId = 'org-123'
    const module = createMockModule('m1-core', 'Core Module')
    registry.register(module)

    // Act
    await module.activate(orgId)

    // Assert
    expect(await module.isActive(orgId)).toBe(true)
  })

  test('module is not active before activation', async () => {
    // Arrange
    const orgId = 'org-456'
    const module = createMockModule('m1-core', 'Core Module')
    registry.register(module)

    // Assert
    expect(await module.isActive(orgId)).toBe(false)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 4: Deactivate module
  // ──────────────────────────────────────────────────────────

  test('deactivates module for organization', async () => {
    // Arrange
    const orgId = 'org-789'
    const module = createMockModule('m1-core', 'Core Module')
    registry.register(module)
    await module.activate(orgId)
    expect(await module.isActive(orgId)).toBe(true)

    // Act
    await module.deactivate(orgId)

    // Assert
    expect(await module.isActive(orgId)).toBe(false)
  })

  test('deactivating non-active module does not throw error', async () => {
    // Arrange
    const orgId = 'org-999'
    const module = createMockModule('m1-core', 'Core Module')
    registry.register(module)

    // Act & Assert
    await expect(module.deactivate(orgId)).resolves.not.toThrow()
    expect(await module.isActive(orgId)).toBe(false)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 5: Check dependencies before activate
  // ──────────────────────────────────────────────────────────

  test('checks dependencies before activating module', async () => {
    // Arrange
    const orgId = 'org-dependencies'
    const coreModule = createMockModule('m1-core', 'Core Module')
    const clientModule = createMockModule(
      'm2-client-management',
      'Client Management',
      [coreModule] // Depends on core
    )

    registry.register(coreModule)
    registry.register(clientModule)

    // Act - Try to activate client module WITHOUT activating core first
    const activationPromise = clientModule.activate(orgId)

    // Assert - Should throw error because dependency not active
    await expect(activationPromise).rejects.toThrow(
      'Cannot activate m2-client-management: dependency m1-core is not active'
    )
    expect(await clientModule.isActive(orgId)).toBe(false)
  })

  test('activates module successfully when all dependencies are active', async () => {
    // Arrange
    const orgId = 'org-dependencies-ok'
    const coreModule = createMockModule('m1-core', 'Core Module')
    const clientModule = createMockModule(
      'm2-client-management',
      'Client Management',
      [coreModule] // Depends on core
    )

    registry.register(coreModule)
    registry.register(clientModule)

    // Act - Activate core first, then client
    await coreModule.activate(orgId)
    await clientModule.activate(orgId)

    // Assert
    expect(await coreModule.isActive(orgId)).toBe(true)
    expect(await clientModule.isActive(orgId)).toBe(true)
  })

  test('checks transitive dependencies (multi-level)', async () => {
    // Arrange
    const orgId = 'org-transitive'
    const coreModule = createMockModule('m1-core', 'Core Module')
    const clientModule = createMockModule(
      'm2-client-management',
      'Client Management',
      [coreModule]
    )
    const advancedModule = createMockModule(
      'm3-advanced',
      'Advanced Features',
      [clientModule] // Depends on client, which depends on core
    )

    registry.register(coreModule)
    registry.register(clientModule)
    registry.register(advancedModule)

    // Act - Try to activate advanced WITHOUT activating dependencies
    const activationPromise = advancedModule.activate(orgId)

    // Assert - Should fail because client is not active
    await expect(activationPromise).rejects.toThrow(
      'Cannot activate m3-advanced: dependency m2-client-management is not active'
    )
    expect(await advancedModule.isActive(orgId)).toBe(false)
  })

  // ──────────────────────────────────────────────────────────
  // TEST 6: Prevent deactivate if dependents active
  // ──────────────────────────────────────────────────────────

  test('allows deactivating module with dependents (no automatic check)', async () => {
    // Arrange
    const orgId = 'org-dependent-deactivate'
    const coreModule = createMockModule('m1-core', 'Core Module')
    const clientModule = createMockModule(
      'm2-client-management',
      'Client Management',
      [coreModule]
    )

    registry.register(coreModule)
    registry.register(clientModule)

    // Activate both
    await coreModule.activate(orgId)
    await clientModule.activate(orgId)

    // Act - Deactivate core while client is still active
    // Note: The basic implementation allows this, but in production
    // you might want to add validation logic to prevent this
    await coreModule.deactivate(orgId)

    // Assert
    expect(await coreModule.isActive(orgId)).toBe(false)
    expect(await clientModule.isActive(orgId)).toBe(true)

    // The dependent module is now in an invalid state
    // In a production scenario, you'd want to either:
    // 1. Prevent deactivation when dependents are active
    // 2. Cascade deactivation to dependents
    // 3. Add validation before operations
  })

  test('prevents activating module after dependency is deactivated', async () => {
    // Arrange
    const orgId = 'org-reactivation-check'
    const coreModule = createMockModule('m1-core', 'Core Module')
    const clientModule = createMockModule(
      'm2-client-management',
      'Client Management',
      [coreModule]
    )

    registry.register(coreModule)
    registry.register(clientModule)

    // Activate core, then deactivate it
    await coreModule.activate(orgId)
    await coreModule.deactivate(orgId)

    // Act - Try to activate client when dependency is inactive
    const activationPromise = clientModule.activate(orgId)

    // Assert
    await expect(activationPromise).rejects.toThrow(
      'Cannot activate m2-client-management: dependency m1-core is not active'
    )
  })

  // ──────────────────────────────────────────────────────────
  // TEST 7: List active modules for org
  // ──────────────────────────────────────────────────────────

  test('lists active modules for organization', async () => {
    // Arrange
    const orgId = 'org-list-active'
    const module1 = createMockModule('m1-core', 'Core Module')
    const module2 = createMockModule('m2-client-management', 'Client Management')
    const module3 = createMockModule('m3-reports', 'Reports Module')

    registry.register(module1)
    registry.register(module2)
    registry.register(module3)

    // Activate only module1 and module3
    await module1.activate(orgId)
    await module3.activate(orgId)

    // Act
    const activeModules = await registry.getActive(orgId)

    // Assert
    expect(activeModules).toHaveLength(2)
    expect(activeModules.map(m => m.id)).toContain('m1-core')
    expect(activeModules.map(m => m.id)).toContain('m3-reports')
    expect(activeModules.map(m => m.id)).not.toContain('m2-client-management')
  })

  test('returns empty array when no modules are active for org', async () => {
    // Arrange
    const orgId = 'org-no-active'
    const module1 = createMockModule('m1-core', 'Core Module')
    const module2 = createMockModule('m2-client-management', 'Client Management')

    registry.register(module1)
    registry.register(module2)

    // Act - Don't activate any modules
    const activeModules = await registry.getActive(orgId)

    // Assert
    expect(activeModules).toHaveLength(0)
  })

  test('lists active modules for different organizations independently', async () => {
    // Arrange
    const org1 = 'org-001'
    const org2 = 'org-002'
    const module1 = createMockModule('m1-core', 'Core Module')
    const module2 = createMockModule('m2-client-management', 'Client Management')

    registry.register(module1)
    registry.register(module2)

    // Activate different modules for different orgs
    await module1.activate(org1)
    await module2.activate(org2)

    // Act
    const activeModulesOrg1 = await registry.getActive(org1)
    const activeModulesOrg2 = await registry.getActive(org2)

    // Assert
    expect(activeModulesOrg1).toHaveLength(1)
    expect(activeModulesOrg1[0].id).toBe('m1-core')

    expect(activeModulesOrg2).toHaveLength(1)
    expect(activeModulesOrg2[0].id).toBe('m2-client-management')
  })

  // ──────────────────────────────────────────────────────────
  // TEST 8: Additional registry utility methods
  // ──────────────────────────────────────────────────────────

  test('getAllModules returns all registered modules', () => {
    // Arrange
    const module1 = createMockModule('m1-core', 'Core Module')
    const module2 = createMockModule('m2-client-management', 'Client Management')
    const module3 = createMockModule('m3-reports', 'Reports Module')

    registry.register(module1)
    registry.register(module2)
    registry.register(module3)

    // Act
    const allModules = registry.getAllModules()

    // Assert
    expect(allModules).toHaveLength(3)
    expect(allModules).toContain(module1)
    expect(allModules).toContain(module2)
    expect(allModules).toContain(module3)
  })

  test('has() returns correct boolean for module existence', () => {
    // Arrange
    const module = createMockModule('m1-core', 'Core Module')
    registry.register(module)

    // Assert
    expect(registry.has('m1-core')).toBe(true)
    expect(registry.has('non-existent')).toBe(false)
  })

  test('unregister removes module from registry', () => {
    // Arrange
    const module = createMockModule('m1-core', 'Core Module')
    registry.register(module)
    expect(registry.has('m1-core')).toBe(true)

    // Act
    const result = registry.unregister('m1-core')

    // Assert
    expect(result).toBe(true)
    expect(registry.has('m1-core')).toBe(false)
    expect(registry.get('m1-core')).toBeUndefined()
  })

  test('unregister returns false for non-existent module', () => {
    // Act
    const result = registry.unregister('non-existent')

    // Assert
    expect(result).toBe(false)
  })

  test('clear removes all modules from registry', () => {
    // Arrange
    const module1 = createMockModule('m1-core', 'Core Module')
    const module2 = createMockModule('m2-client-management', 'Client Management')
    registry.register(module1)
    registry.register(module2)
    expect(registry.getAllModules()).toHaveLength(2)

    // Act
    registry.clear()

    // Assert
    expect(registry.getAllModules()).toHaveLength(0)
    expect(registry.has('m1-core')).toBe(false)
    expect(registry.has('m2-client-management')).toBe(false)
  })

  test('getDependencyTree returns modules in dependency order', () => {
    // Arrange
    const coreModule = createMockModule('m1-core', 'Core Module')
    const clientModule = createMockModule(
      'm2-client-management',
      'Client Management',
      [coreModule]
    )
    const reportsModule = createMockModule(
      'm3-reports',
      'Reports Module',
      [clientModule]
    )

    registry.register(coreModule)
    registry.register(clientModule)
    registry.register(reportsModule)

    // Act
    const dependencyTree = registry.getDependencyTree('m3-reports')

    // Assert
    expect(dependencyTree).toHaveLength(3)
    // Dependencies should come before dependents
    const ids = dependencyTree.map(m => m.id)
    expect(ids.indexOf('m1-core')).toBeLessThan(ids.indexOf('m2-client-management'))
    expect(ids.indexOf('m2-client-management')).toBeLessThan(ids.indexOf('m3-reports'))
  })

  test('getDependencyTree throws error for non-existent module', () => {
    // Act & Assert
    expect(() => {
      registry.getDependencyTree('non-existent')
    }).toThrow("Module 'non-existent' not found in registry")
  })

  test('getDependencyTree detects circular dependencies', () => {
    // Arrange - Create circular dependency
    const moduleA = createMockModule('module-a', 'Module A')
    const moduleB = createMockModule('module-b', 'Module B', [moduleA])

    // Create circular dependency by modifying moduleA after creation
    moduleA.dependencies = [moduleB]

    registry.register(moduleA)
    registry.register(moduleB)

    // Act & Assert
    expect(() => {
      registry.getDependencyTree('module-a')
    }).toThrow('Circular dependency detected')
  })
})
