/**
 * Module System Interface
 * Provides core interfaces and registry for the modular SSM/PSI platform
 */

/**
 * Module configuration object - can be extended by specific modules
 */
export interface ModuleConfig {
  [key: string]: unknown;
}

/**
 * Core module interface that all modules must implement
 */
export interface IModule {
  /** Unique module identifier (e.g., 'm1-core', 'm2-client-management') */
  id: string;

  /** Human-readable module name */
  name: string;

  /** Semantic version (e.g., '1.0.0') */
  version: string;

  /** Array of module dependencies - modules that must be active for this module to work */
  dependencies: IModule[];

  /**
   * Check if module is active for a specific organization
   * @param orgId - Organization ID to check
   * @returns Promise resolving to true if module is active
   */
  isActive(orgId: string): Promise<boolean>;

  /**
   * Activate the module for a specific organization
   * @param orgId - Organization ID
   * @returns Promise that resolves when activation is complete
   */
  activate(orgId: string): Promise<void>;

  /**
   * Deactivate the module for a specific organization
   * @param orgId - Organization ID
   * @returns Promise that resolves when deactivation is complete
   */
  deactivate(orgId: string): Promise<void>;

  /**
   * Get module configuration for a specific organization
   * @param orgId - Organization ID
   * @returns Promise resolving to module configuration object
   */
  getConfig(orgId: string): Promise<ModuleConfig>;

  /**
   * Set module configuration for a specific organization
   * @param orgId - Organization ID
   * @param config - Configuration object to set
   * @returns Promise that resolves when configuration is saved
   */
  setConfig(orgId: string, config: ModuleConfig): Promise<void>;
}

/**
 * Module registry for managing all platform modules
 */
export class ModuleRegistry {
  private modules: Map<string, IModule> = new Map();

  /**
   * Register a module in the registry
   * @param module - Module instance to register
   * @throws Error if module with same ID already exists
   */
  register(module: IModule): void {
    if (this.modules.has(module.id)) {
      throw new Error(`Module with ID '${module.id}' is already registered`);
    }
    this.modules.set(module.id, module);
  }

  /**
   * Get a module by ID
   * @param moduleId - Module ID to retrieve
   * @returns Module instance or undefined if not found
   */
  get(moduleId: string): IModule | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Get all active modules for a specific organization
   * @param orgId - Organization ID
   * @returns Promise resolving to array of active modules
   */
  async getActive(orgId: string): Promise<IModule[]> {
    const activeModules: IModule[] = [];

    for (const module of this.modules.values()) {
      const isActive = await module.isActive(orgId);
      if (isActive) {
        activeModules.push(module);
      }
    }

    return activeModules;
  }

  /**
   * Get dependency tree for a specific module
   * Returns all modules that the given module depends on, recursively
   * @param moduleId - Module ID to get dependencies for
   * @returns Array of modules in dependency order (dependencies first)
   * @throws Error if module not found or circular dependency detected
   */
  getDependencyTree(moduleId: string): IModule[] {
    const module = this.get(moduleId);
    if (!module) {
      throw new Error(`Module '${moduleId}' not found in registry`);
    }

    const visited = new Set<string>();
    const result: IModule[] = [];

    const visit = (currentModule: IModule, ancestorIds: Set<string> = new Set()) => {
      // Check for circular dependencies
      if (ancestorIds.has(currentModule.id)) {
        throw new Error(
          `Circular dependency detected: ${Array.from(ancestorIds).join(' -> ')} -> ${currentModule.id}`
        );
      }

      // Skip if already processed
      if (visited.has(currentModule.id)) {
        return;
      }

      // Add current module to ancestor path for circular dependency detection
      const newAncestors = new Set(ancestorIds);
      newAncestors.add(currentModule.id);

      // Process dependencies first (depth-first)
      for (const dependency of currentModule.dependencies) {
        visit(dependency, newAncestors);
      }

      // Mark as visited and add to result
      visited.add(currentModule.id);
      result.push(currentModule);
    };

    visit(module);
    return result;
  }

  /**
   * Get all registered modules
   * @returns Array of all modules in the registry
   */
  getAllModules(): IModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Check if a module is registered
   * @param moduleId - Module ID to check
   * @returns True if module is registered
   */
  has(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }

  /**
   * Unregister a module (use with caution)
   * @param moduleId - Module ID to unregister
   * @returns True if module was unregistered, false if not found
   */
  unregister(moduleId: string): boolean {
    return this.modules.delete(moduleId);
  }

  /**
   * Clear all registered modules (use with caution, mainly for testing)
   */
  clear(): void {
    this.modules.clear();
  }
}

// Export singleton instance for global module registry
export const moduleRegistry = new ModuleRegistry();
