/**
 * SSM Core Module
 * Base module providing core SSM (Securitate și Sănătate în Muncă) functionality
 *
 * Features:
 * - Employee management
 * - Training tracking and assignments
 * - Medical examinations tracking
 * - Compliance score calculation
 *
 * Dependencies: None (base module)
 * Status: Always active
 */

import { IModule, IModuleConfig } from './module-interface';
import { createSupabaseServer } from '@/lib/supabase/server';

/**
 * Configuration interface for SSM Core Module
 */
export interface SSMCoreConfig extends IModuleConfig {
  /** Training frequency configuration (in months) */
  trainingFrequencies: {
    introductiv_general: number;      // Default: 12 months
    la_locul_de_munca: number;        // Default: 12 months
    periodic: number;                  // Default: 12 months
    suplimentar: number;               // Default: on-demand
    psi: number;                       // Default: 12 months
    situatii_urgenta: number;          // Default: 12 months
  };

  /** Medical examination frequency configuration (in months) */
  medicalFrequencies: {
    periodic: number;                  // Default: 12 months
    angajare: number;                  // Default: once (0)
    reluare: number;                   // Default: once (0)
    la_cerere: number;                 // Default: on-demand (0)
    supraveghere: number;              // Default: 6 months
  };

  /** Alert threshold configuration (days before expiry) */
  alertThresholds: {
    critical: number;                  // Default: 7 days
    warning: number;                   // Default: 15 days
    info: number;                      // Default: 30 days
  };

  /** Compliance score weights */
  complianceWeights: {
    trainings: number;                 // Default: 0.4 (40%)
    medicalExams: number;              // Default: 0.4 (40%)
    equipment: number;                 // Default: 0.2 (20%)
  };

  /** Minimum compliance score for "good" status (0-100) */
  minComplianceScore: number;          // Default: 80

  /** Enable automatic alert notifications */
  autoAlerts: boolean;                 // Default: true

  /** Enable automatic compliance score calculation */
  autoComplianceCalc: boolean;         // Default: true
}

/**
 * Default configuration for SSM Core Module
 */
const DEFAULT_CONFIG: SSMCoreConfig = {
  trainingFrequencies: {
    introductiv_general: 12,
    la_locul_de_munca: 12,
    periodic: 12,
    suplimentar: 0,  // on-demand
    psi: 12,
    situatii_urgenta: 12,
  },
  medicalFrequencies: {
    periodic: 12,
    angajare: 0,     // once
    reluare: 0,      // once
    la_cerere: 0,    // on-demand
    supraveghere: 6,
  },
  alertThresholds: {
    critical: 7,
    warning: 15,
    info: 30,
  },
  complianceWeights: {
    trainings: 0.4,
    medicalExams: 0.4,
    equipment: 0.2,
  },
  minComplianceScore: 80,
  autoAlerts: true,
  autoComplianceCalc: true,
};

/**
 * SSM Core Module Implementation
 *
 * This is the base module that provides core SSM functionality.
 * It is always active and has no dependencies.
 */
class SSMCoreModule implements IModule {
  public readonly id = 'ssm-core';
  public readonly name = 'SSM Core';
  public readonly version = '1.0.0';
  public readonly dependencies: IModule[] = [];

  /**
   * Check if module is active for organization
   * SSM Core is always active (base module)
   */
  async isActive(orgId: string): Promise<boolean> {
    // Verify organization exists
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', orgId)
      .single();

    if (error || !data) {
      return false;
    }

    // SSM Core is always active for valid organizations
    return true;
  }

  /**
   * Activate module for organization
   * SSM Core is automatically active, but this ensures config exists
   */
  async activate(orgId: string): Promise<void> {
    const supabase = await createSupabaseServer();

    // Verify organization exists
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', orgId)
      .single();

    if (orgError || !org) {
      throw new Error(`Organization ${orgId} not found`);
    }

    // Check if config already exists
    const existingConfig = await this.getConfig(orgId);

    // If no config exists, create default configuration
    if (!existingConfig || Object.keys(existingConfig).length === 0) {
      await this.setConfig(orgId, DEFAULT_CONFIG);
    }

    console.log(`[SSM Core] Module activated for organization ${orgId}`);
  }

  /**
   * Deactivate module for organization
   * SSM Core cannot be deactivated (base module)
   */
  async deactivate(orgId: string): Promise<void> {
    throw new Error('SSM Core module cannot be deactivated - it is a base module required for platform operation');
  }

  /**
   * Get module configuration for organization
   */
  async getConfig(orgId: string): Promise<IModuleConfig> {
    // TODO: Implement persistent configuration storage when module_configs table is created
    // For now, return default configuration
    return DEFAULT_CONFIG;
  }

  /**
   * Set module configuration for organization
   */
  async setConfig(orgId: string, config: IModuleConfig): Promise<void> {
    // Validate config structure
    this.validateConfig(config);

    // TODO: Implement persistent configuration storage when module_configs table is created
    // For now, log the configuration update
    console.log(`[SSM Core] Configuration update requested for organization ${orgId}`);
    console.log('[SSM Core] Note: Persistent storage not yet implemented');
  }

  /**
   * Validate configuration object
   */
  private validateConfig(config: IModuleConfig): void {
    const ssmConfig = config as Partial<SSMCoreConfig>;

    // Validate training frequencies
    if (ssmConfig.trainingFrequencies) {
      const frequencies = ssmConfig.trainingFrequencies;
      for (const [key, value] of Object.entries(frequencies)) {
        if (typeof value !== 'number' || value < 0) {
          throw new Error(`Invalid training frequency for ${key}: must be a non-negative number`);
        }
      }
    }

    // Validate medical frequencies
    if (ssmConfig.medicalFrequencies) {
      const frequencies = ssmConfig.medicalFrequencies;
      for (const [key, value] of Object.entries(frequencies)) {
        if (typeof value !== 'number' || value < 0) {
          throw new Error(`Invalid medical frequency for ${key}: must be a non-negative number`);
        }
      }
    }

    // Validate alert thresholds
    if (ssmConfig.alertThresholds) {
      const thresholds = ssmConfig.alertThresholds;
      if (thresholds.critical && (thresholds.critical < 0 || thresholds.critical > 365)) {
        throw new Error('Critical alert threshold must be between 0 and 365 days');
      }
      if (thresholds.warning && (thresholds.warning < 0 || thresholds.warning > 365)) {
        throw new Error('Warning alert threshold must be between 0 and 365 days');
      }
      if (thresholds.info && (thresholds.info < 0 || thresholds.info > 365)) {
        throw new Error('Info alert threshold must be between 0 and 365 days');
      }
    }

    // Validate compliance weights
    if (ssmConfig.complianceWeights) {
      const weights = ssmConfig.complianceWeights;
      const totalWeight = (weights.trainings || 0) + (weights.medicalExams || 0) + (weights.equipment || 0);

      if (Math.abs(totalWeight - 1.0) > 0.01) {
        throw new Error('Compliance weights must sum to 1.0 (100%)');
      }

      if (weights.trainings && (weights.trainings < 0 || weights.trainings > 1)) {
        throw new Error('Training weight must be between 0 and 1');
      }
      if (weights.medicalExams && (weights.medicalExams < 0 || weights.medicalExams > 1)) {
        throw new Error('Medical exams weight must be between 0 and 1');
      }
      if (weights.equipment && (weights.equipment < 0 || weights.equipment > 1)) {
        throw new Error('Equipment weight must be between 0 and 1');
      }
    }

    // Validate minimum compliance score
    if (ssmConfig.minComplianceScore !== undefined) {
      if (ssmConfig.minComplianceScore < 0 || ssmConfig.minComplianceScore > 100) {
        throw new Error('Minimum compliance score must be between 0 and 100');
      }
    }
  }

  /**
   * Calculate compliance score for organization
   *
   * @param orgId Organization UUID
   * @returns Compliance score (0-100)
   */
  async calculateComplianceScore(orgId: string): Promise<number> {
    try {
      const supabase = await createSupabaseServer();
      const config = await this.getConfig(orgId) as SSMCoreConfig;

      // Get total employee count
      const { count: employeeCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .eq('is_active', true);

      if (!employeeCount || employeeCount === 0) {
        return 100; // No employees = perfect compliance
      }

      // Calculate training compliance
      const { count: trainingsCompleted } = await supabase
        .from('training_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .eq('status', 'completed')
        .gte('completed_at', this.getDateThreshold(12)); // Last 12 months

      const trainingScore = trainingsCompleted ? Math.min((trainingsCompleted / employeeCount) * 100, 100) : 0;

      // Calculate medical exam compliance
      const { count: medicalExamsValid } = await supabase
        .from('medical_examinations')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .gte('expiry_date', new Date().toISOString().split('T')[0]);

      const medicalScore = medicalExamsValid ? Math.min((medicalExamsValid / employeeCount) * 100, 100) : 0;

      // Calculate equipment compliance
      const { count: equipmentTotal } = await supabase
        .from('safety_equipment')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

      const { count: equipmentCompliant } = await supabase
        .from('safety_equipment')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .eq('is_compliant', true)
        .gte('expiry_date', new Date().toISOString().split('T')[0]);

      const equipmentScore = (equipmentTotal && equipmentCompliant)
        ? (equipmentCompliant / equipmentTotal) * 100
        : 100;

      // Calculate weighted compliance score
      const weights = config.complianceWeights;
      const totalScore =
        (trainingScore * weights.trainings) +
        (medicalScore * weights.medicalExams) +
        (equipmentScore * weights.equipment);

      return Math.round(totalScore);
    } catch (error) {
      console.error('[SSM Core] Error calculating compliance score:', error);
      return 0; // Return 0 on error
    }
  }

  /**
   * Get alerts for organization based on expiring items
   *
   * @param orgId Organization UUID
   * @returns Array of alert items
   */
  async getAlerts(orgId: string): Promise<Array<{
    type: 'training' | 'medical' | 'equipment';
    severity: 'critical' | 'warning' | 'info';
    entityId: string;
    entityName: string;
    expiryDate: string;
    daysUntilExpiry: number;
  }>> {
    try {
      const supabase = await createSupabaseServer();
      const config = await this.getConfig(orgId) as SSMCoreConfig;
      const alerts: Array<any> = [];

      const today = new Date();
      const criticalDate = this.addDays(today, config.alertThresholds.critical);
      const warningDate = this.addDays(today, config.alertThresholds.warning);
      const infoDate = this.addDays(today, config.alertThresholds.info);

      // Check training assignments
      const { data: trainings } = await supabase
        .from('training_assignments')
        .select('id, worker_id, due_date')
        .eq('organization_id', orgId)
        .in('status', ['assigned', 'in_progress'])
        .lte('due_date', infoDate.toISOString().split('T')[0]);

      if (trainings) {
        for (const training of trainings) {
          const daysUntil = this.getDaysUntil(training.due_date);
          alerts.push({
            type: 'training',
            severity: this.getSeverity(daysUntil, config.alertThresholds),
            entityId: training.id,
            entityName: `Training Assignment ${training.worker_id}`,
            expiryDate: training.due_date,
            daysUntilExpiry: daysUntil,
          });
        }
      }

      // Check medical examinations
      const { data: medicals } = await supabase
        .from('medical_examinations')
        .select('id, employee_name, expiry_date')
        .eq('organization_id', orgId)
        .lte('expiry_date', infoDate.toISOString().split('T')[0]);

      if (medicals) {
        for (const medical of medicals) {
          const daysUntil = this.getDaysUntil(medical.expiry_date);
          alerts.push({
            type: 'medical',
            severity: this.getSeverity(daysUntil, config.alertThresholds),
            entityId: medical.id,
            entityName: medical.employee_name,
            expiryDate: medical.expiry_date,
            daysUntilExpiry: daysUntil,
          });
        }
      }

      // Check equipment
      const { data: equipment } = await supabase
        .from('safety_equipment')
        .select('id, equipment_type, description, expiry_date')
        .eq('organization_id', orgId)
        .lte('expiry_date', infoDate.toISOString().split('T')[0]);

      if (equipment) {
        for (const item of equipment) {
          const daysUntil = this.getDaysUntil(item.expiry_date);
          alerts.push({
            type: 'equipment',
            severity: this.getSeverity(daysUntil, config.alertThresholds),
            entityId: item.id,
            entityName: item.description || item.equipment_type,
            expiryDate: item.expiry_date,
            daysUntilExpiry: daysUntil,
          });
        }
      }

      // Sort by severity and days until expiry
      return alerts.sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        if (a.severity !== b.severity) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return a.daysUntilExpiry - b.daysUntilExpiry;
      });
    } catch (error) {
      console.error('[SSM Core] Error fetching alerts:', error);
      return []; // Return empty array on error
    }
  }

  /**
   * Helper: Get severity level based on days until expiry
   */
  private getSeverity(
    daysUntil: number,
    thresholds: { critical: number; warning: number; info: number }
  ): 'critical' | 'warning' | 'info' {
    if (daysUntil <= thresholds.critical) return 'critical';
    if (daysUntil <= thresholds.warning) return 'warning';
    return 'info';
  }

  /**
   * Helper: Get days until date
   */
  private getDaysUntil(dateString: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Helper: Add days to date
   */
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Helper: Get date threshold for queries (N months ago)
   */
  private getDateThreshold(months: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split('T')[0];
  }
}

/**
 * Export singleton instance
 */
export const ssmCoreModule = new SSMCoreModule();
