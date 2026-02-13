/**
 * Module Interface System
 * Provides a standardized interface for platform modules (features/packages)
 * with dependency management, activation state, and configuration per organization
 */

/**
 * Configuration object for a module instance
 */
export interface IModuleConfig {
  [key: string]: unknown;
}

/**
 * Core module interface
 * Each platform module must implement this interface
 */
export interface IModule {
  /** Unique identifier for the module */
  id: string;

  /** Human-readable name of the module */
  name: string;

  /** Semantic version (e.g., "1.0.0") */
  version: string;

  /** Array of module dependencies that must be active before this module can activate */
  dependencies: IModule[];

  /**
   * Check if module is active for a specific organization
   * @param orgId Organization UUID
   * @returns Promise resolving to activation status
   */
  isActive(orgId: string): Promise<boolean>;

  /**
   * Activate the module for a specific organization
   * @param orgId Organization UUID
   * @throws Error if dependencies are not met or activation fails
   */
  activate(orgId: string): Promise<void>;

  /**
   * Deactivate the module for a specific organization
   * @param orgId Organization UUID
   * @throws Error if other active modules depend on this one
   */
  deactivate(orgId: string): Promise<void>;

  /**
   * Get module configuration for a specific organization
   * @param orgId Organization UUID
   * @returns Promise resolving to module configuration object
   */
  getConfig(orgId: string): Promise<IModuleConfig>;

  /**
   * Set module configuration for a specific organization
   * @param orgId Organization UUID
   * @param config Configuration object to apply
   * @throws Error if configuration is invalid
   */
  setConfig(orgId: string, config: IModuleConfig): Promise<void>;
}

/**
 * Module Registry
 * Central registry for all platform modules with dependency resolution
 */
export class ModuleRegistry {
  private modules: Map<string, IModule> = new Map();

  /**
   * Register a new module in the registry
   * @param module Module instance to register
   * @throws Error if module with same ID already exists
   */
  register(module: IModule): void {
    if (this.modules.has(module.id)) {
      throw new Error(`Module with ID "${module.id}" is already registered`);
    }

    this.modules.set(module.id, module);
  }

  /**
   * Get a module by ID
   * @param moduleId Module identifier
   * @returns Module instance or undefined if not found
   */
  get(moduleId: string): IModule | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Get all active modules for a specific organization
   * @param orgId Organization UUID
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
   * Returns modules in the order they should be activated (dependencies first)
   * @param moduleId Module identifier
   * @returns Array of modules in dependency order
   * @throws Error if module not found or circular dependencies detected
   */
  getDependencyTree(moduleId: string): IModule[] {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module with ID "${moduleId}" not found in registry`);
    }

    const visited = new Set<string>();
    const visiting = new Set<string>();
    const result: IModule[] = [];

    const visit = (current: IModule): void => {
      if (visited.has(current.id)) {
        return;
      }

      if (visiting.has(current.id)) {
        throw new Error(
          `Circular dependency detected involving module "${current.id}"`
        );
      }

      visiting.add(current.id);

      // Visit dependencies first (depth-first traversal)
      for (const dependency of current.dependencies) {
        visit(dependency);
      }

      visiting.delete(current.id);
      visited.add(current.id);
      result.push(current);
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
   * @param moduleId Module identifier
   * @returns True if module exists in registry
   */
  has(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }

  /**
   * Unregister a module from the registry
   * @param moduleId Module identifier
   * @returns True if module was removed, false if not found
   */
  unregister(moduleId: string): boolean {
    return this.modules.delete(moduleId);
  }

  /**
   * Clear all modules from the registry
   */
  clear(): void {
    this.modules.clear();
  }
}

// Export singleton instance
export const moduleRegistry = new ModuleRegistry();
