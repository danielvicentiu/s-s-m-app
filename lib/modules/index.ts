/**
 * Module Registry - Central management for all platform modules
 *
 * This registry manages all 11 modules of the SSM/PSI platform:
 * - Module registration and retrieval
 * - Dependency tree management
 * - Module activation/deactivation
 * - Organization-specific module state
 */

import { createSupabaseServer } from '@/lib/supabase/server'
import type { ModuleKey, OrganizationModule } from './types'
import { ssmCoreModule } from './ssm-core'
import { alertsModule } from './alerts-module'
import { psiModule } from './psi-module'
import { equipmentModule } from './equipment-module'
import { incidentsModule } from './incidents-module'
import { legislationModule } from './legislation-module'
import { documentsModule } from './documents-module'
import { reportsModule } from './reports-module'

// Note: GDPR and NIS2 modules use a different interface structure
// They will be registered separately when their interfaces are updated

// ── Module Interface ──
export interface IModule {
  key: ModuleKey
  name_en: string
  name_localized: Record<string, string>
  description_en: string
  icon: string
  category: 'core' | 'standalone' | 'premium'
  is_base: boolean
  depends_on: ModuleKey[]
  incompatible: ModuleKey[]
  getDefaultConfig: () => any
  validateConfig: (config: any) => boolean
}

/**
 * Module Registry - Singleton class for managing all platform modules
 */
export class ModuleRegistry {
  private modules: Map<ModuleKey, IModule> = new Map()
  private static instance: ModuleRegistry | null = null

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry()
      ModuleRegistry.instance.registerAllModules()
    }
    return ModuleRegistry.instance
  }

  /**
   * Register all platform modules
   * Called automatically during singleton initialization
   */
  private registerAllModules(): void {
    // Register 9 modules that follow the IModule interface
    // (GDPR and NIS2 use a different interface and will be added separately)
    this.register(ssmCoreModule as IModule)
    this.register(alertsModule as IModule)
    this.register(psiModule as IModule)
    this.register(equipmentModule as IModule)
    this.register(incidentsModule as IModule)
    this.register(legislationModule as IModule)
    this.register(documentsModule as IModule)
    this.register(reportsModule as IModule)
  }

  /**
   * Register a module in the registry
   * @param module - Module instance to register
   * @throws Error if module with same key already exists
   */
  register(module: IModule): void {
    if (this.modules.has(module.key)) {
      throw new Error(`Module with key '${module.key}' is already registered`)
    }
    this.modules.set(module.key, module)
  }

  /**
   * Get a module by key
   * @param moduleKey - Module key to retrieve
   * @returns Module instance or undefined if not found
   */
  getModule(moduleKey: ModuleKey): IModule | undefined {
    return this.modules.get(moduleKey)
  }

  /**
   * Get all registered modules
   * @returns Array of all modules in the registry
   */
  getAllModules(): IModule[] {
    return Array.from(this.modules.values())
  }

  /**
   * Get all active modules for a specific organization
   * Queries the database to check which modules are active
   * @param orgId - Organization ID
   * @returns Promise resolving to array of active modules
   */
  async getActiveModules(orgId: string): Promise<IModule[]> {
    const supabase = await createSupabaseServer()

    const { data: orgModules, error } = await supabase
      .from('organization_modules')
      .select('module_key, status, expires_at, trial_expires_at')
      .eq('organization_id', orgId)
      .in('status', ['active', 'trial'])

    if (error) {
      console.error('Error fetching active modules:', error)
      return []
    }

    const activeModules: IModule[] = []

    for (const orgModule of orgModules || []) {
      const module = this.getModule(orgModule.module_key as ModuleKey)
      if (!module) continue

      // Check if module is still valid (not expired)
      const isValid = this.isModuleValid(orgModule)
      if (isValid) {
        activeModules.push(module)
      }
    }

    return activeModules
  }

  /**
   * Check if a module is valid (not expired)
   * @param orgModule - Organization module record
   * @returns true if module is valid
   */
  private isModuleValid(orgModule: OrganizationModule): boolean {
    const now = new Date()

    if (orgModule.status === 'active') {
      return !orgModule.expires_at || new Date(orgModule.expires_at) > now
    }

    if (orgModule.status === 'trial') {
      return !orgModule.trial_expires_at || new Date(orgModule.trial_expires_at) > now
    }

    return false
  }

  /**
   * Activate a module for an organization
   * Checks dependencies and creates activation record in database
   * @param orgId - Organization ID
   * @param moduleKey - Module key to activate
   * @param status - Module status (default: 'active')
   * @returns Promise that resolves when activation is complete
   * @throws Error if dependencies are not met or activation fails
   */
  async activateModule(
    orgId: string,
    moduleKey: ModuleKey,
    status: 'active' | 'trial' = 'active'
  ): Promise<void> {
    const module = this.getModule(moduleKey)
    if (!module) {
      throw new Error(`Module '${moduleKey}' not found in registry`)
    }

    // Check dependencies
    const missingDeps = await this.checkDependencies(orgId, moduleKey)
    if (missingDeps.length > 0) {
      throw new Error(
        `Cannot activate module '${moduleKey}'. Missing dependencies: ${missingDeps.join(', ')}`
      )
    }

    // Check incompatibilities
    const conflicts = await this.checkIncompatibilities(orgId, moduleKey)
    if (conflicts.length > 0) {
      throw new Error(
        `Cannot activate module '${moduleKey}'. Conflicts with: ${conflicts.join(', ')}`
      )
    }

    const supabase = await createSupabaseServer()

    // Check if module is already active
    const { data: existing } = await supabase
      .from('organization_modules')
      .select('id, status')
      .eq('organization_id', orgId)
      .eq('module_key', moduleKey)
      .single()

    const now = new Date().toISOString()
    const defaultConfig = module.getDefaultConfig()

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('organization_modules')
        .update({
          status,
          activated_at: now,
          config: defaultConfig,
          updated_at: now,
        })
        .eq('id', existing.id)

      if (error) {
        throw new Error(`Failed to activate module: ${error.message}`)
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('organization_modules')
        .insert({
          organization_id: orgId,
          module_key: moduleKey,
          status,
          activated_at: now,
          config: defaultConfig,
          created_at: now,
          updated_at: now,
        })

      if (error) {
        throw new Error(`Failed to activate module: ${error.message}`)
      }
    }
  }

  /**
   * Deactivate a module for an organization
   * Checks if other modules depend on this module
   * @param orgId - Organization ID
   * @param moduleKey - Module key to deactivate
   * @returns Promise that resolves when deactivation is complete
   * @throws Error if other modules depend on this module
   */
  async deactivateModule(orgId: string, moduleKey: ModuleKey): Promise<void> {
    const module = this.getModule(moduleKey)
    if (!module) {
      throw new Error(`Module '${moduleKey}' not found in registry`)
    }

    // Check if module is a base module
    if (module.is_base) {
      throw new Error(`Cannot deactivate base module '${moduleKey}'`)
    }

    // Check if other active modules depend on this module
    const dependents = await this.getDependentModules(orgId, moduleKey)
    if (dependents.length > 0) {
      throw new Error(
        `Cannot deactivate module '${moduleKey}'. The following modules depend on it: ${dependents.join(', ')}`
      )
    }

    const supabase = await createSupabaseServer()

    // Deactivate the module
    const { error } = await supabase
      .from('organization_modules')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('organization_id', orgId)
      .eq('module_key', moduleKey)

    if (error) {
      throw new Error(`Failed to deactivate module: ${error.message}`)
    }
  }

  /**
   * Check module dependencies
   * @param orgId - Organization ID
   * @param moduleKey - Module key to check
   * @returns Promise resolving to array of missing dependencies
   */
  private async checkDependencies(orgId: string, moduleKey: ModuleKey): Promise<ModuleKey[]> {
    const module = this.getModule(moduleKey)
    if (!module || module.depends_on.length === 0) {
      return []
    }

    const activeModules = await this.getActiveModules(orgId)
    const activeKeys = new Set(activeModules.map(m => m.key))

    const missing: ModuleKey[] = []
    for (const dep of module.depends_on) {
      if (!activeKeys.has(dep)) {
        missing.push(dep)
      }
    }

    return missing
  }

  /**
   * Check for incompatible modules
   * @param orgId - Organization ID
   * @param moduleKey - Module key to check
   * @returns Promise resolving to array of conflicting modules
   */
  private async checkIncompatibilities(
    orgId: string,
    moduleKey: ModuleKey
  ): Promise<ModuleKey[]> {
    const module = this.getModule(moduleKey)
    if (!module || module.incompatible.length === 0) {
      return []
    }

    const activeModules = await this.getActiveModules(orgId)
    const activeKeys = new Set(activeModules.map(m => m.key))

    const conflicts: ModuleKey[] = []
    for (const incomp of module.incompatible) {
      if (activeKeys.has(incomp)) {
        conflicts.push(incomp)
      }
    }

    return conflicts
  }

  /**
   * Get modules that depend on the specified module
   * @param orgId - Organization ID
   * @param moduleKey - Module key to check
   * @returns Promise resolving to array of dependent module keys
   */
  private async getDependentModules(orgId: string, moduleKey: ModuleKey): Promise<ModuleKey[]> {
    const activeModules = await this.getActiveModules(orgId)

    const dependents: ModuleKey[] = []
    for (const activeModule of activeModules) {
      if (activeModule.depends_on.includes(moduleKey)) {
        dependents.push(activeModule.key)
      }
    }

    return dependents
  }

  /**
   * Get dependency tree for a specific module
   * Returns all modules that the given module depends on, recursively
   * @param moduleKey - Module key to get dependencies for
   * @returns Array of modules in dependency order (dependencies first)
   * @throws Error if module not found or circular dependency detected
   */
  getModuleTree(moduleKey: ModuleKey): IModule[] {
    const module = this.getModule(moduleKey)
    if (!module) {
      throw new Error(`Module '${moduleKey}' not found in registry`)
    }

    const visited = new Set<ModuleKey>()
    const result: IModule[] = []

    const visit = (currentModule: IModule, ancestorKeys: Set<ModuleKey> = new Set()) => {
      // Check for circular dependencies
      if (ancestorKeys.has(currentModule.key)) {
        throw new Error(
          `Circular dependency detected: ${Array.from(ancestorKeys).join(' -> ')} -> ${currentModule.key}`
        )
      }

      // Skip if already processed
      if (visited.has(currentModule.key)) {
        return
      }

      // Add current module to ancestor path for circular dependency detection
      const newAncestors = new Set(ancestorKeys)
      newAncestors.add(currentModule.key)

      // Process dependencies first (depth-first)
      for (const depKey of currentModule.depends_on) {
        const depModule = this.getModule(depKey)
        if (depModule) {
          visit(depModule, newAncestors)
        }
      }

      // Mark as visited and add to result
      visited.add(currentModule.key)
      result.push(currentModule)
    }

    visit(module)
    return result
  }

  /**
   * Get visual representation of module dependency tree
   * @param moduleKey - Module key to visualize
   * @returns String representation of dependency tree
   */
  visualizeModuleTree(moduleKey: ModuleKey): string {
    const tree = this.getModuleTree(moduleKey)
    const lines: string[] = []

    for (let i = 0; i < tree.length; i++) {
      const module = tree[i]
      const indent = '  '.repeat(i)
      const icon = module.icon || '📦'
      lines.push(`${indent}${icon} ${module.name_en} (${module.key})`)

      if (module.depends_on.length > 0) {
        lines.push(`${indent}  └─ depends on: ${module.depends_on.join(', ')}`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Check if a module has the same ID
   * @param moduleKey - Module key to check
   * @returns True if module is registered
   */
  has(moduleKey: ModuleKey): boolean {
    return this.modules.has(moduleKey)
  }

  /**
   * Unregister a module (use with caution, mainly for testing)
   * @param moduleKey - Module key to unregister
   * @returns True if module was unregistered, false if not found
   */
  unregister(moduleKey: ModuleKey): boolean {
    return this.modules.delete(moduleKey)
  }

  /**
   * Clear all registered modules (use with caution, mainly for testing)
   */
  clear(): void {
    this.modules.clear()
  }
}

// Export singleton instance for global module registry
export const moduleRegistry = ModuleRegistry.getInstance()

// Re-export module types and individual modules
export type { ModuleKey, OrganizationModule }
export {
  ssmCoreModule,
  alertsModule,
  psiModule,
  equipmentModule,
  incidentsModule,
  legislationModule,
  documentsModule,
  reportsModule,
}
