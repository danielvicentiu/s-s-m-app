// lib/modules/reports-module.ts
// OP-LEGO — Reports Module
// Report generation, scheduled reports, export CSV/PDF/Excel, custom report builder, compliance dashboard
// Data: 14 Februarie 2026 (Enhanced Version)

import type { ModuleKey } from './types'

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
  getDefaultConfig: () => ReportsModuleConfig
  validateConfig: (config: any) => boolean
}

// ── Report Types ──
export type ReportType =
  | 'compliance_overview'         // Compliance dashboard snapshot
  | 'medical_expiry_forecast'     // Medical exams expiring in next N months
  | 'equipment_inspection_due'    // Equipment inspections due
  | 'training_compliance'         // Training completion status
  | 'employee_roster'             // Employee list with key dates
  | 'incident_summary'            // Incident/accident summary
  | 'audit_trail'                 // Audit log export
  | 'cost_analysis'               // Cost tracking (penalties, training, equipment)
  | 'obligation_tracker'          // Legal obligations tracking
  | 'custom'                      // User-defined custom report

export type ReportFormat = 'csv' | 'pdf' | 'excel' | 'json'
export type ReportScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'manual'
export type ReportDeliveryMethod = 'email' | 'download' | 'webhook' | 'storage'

// ── Reports Module Configuration ──
export interface ReportsModuleConfig {
  // Active report types
  activeReportTypes: {
    complianceOverview: boolean
    medicalExpiryForecast: boolean
    equipmentInspectionDue: boolean
    trainingCompliance: boolean
    employeeRoster: boolean
    incidentSummary: boolean
    auditTrail: boolean
    costAnalysis: boolean
    obligationTracker: boolean
    customReports: boolean
  }

  // Export formats enabled
  enabledFormats: {
    csv: boolean
    pdf: boolean
    excel: boolean
    json: boolean
  }

  // Scheduling configuration
  schedulingConfig: {
    enableScheduledReports: boolean
    maxScheduledReportsPerOrg: number  // Default: 10
    defaultFrequency: ReportScheduleFrequency
    allowedFrequencies: ReportScheduleFrequency[]
    defaultDeliveryTime: string        // HH:MM format, e.g., "09:00"
    timezone: string                   // Default: "Europe/Bucharest"
  }

  // Delivery configuration
  deliveryConfig: {
    email: {
      enabled: boolean
      maxRecipientsPerReport: number   // Default: 10
      subjectPrefix: string            // Ex: "[S-S-M] Report:"
      includeLogo: boolean
      includeAttachment: boolean
    }
    download: {
      enabled: boolean
      retentionDays: number            // Default: 30 days
      maxSizeBytes: number             // Default: 50MB
    }
    webhook: {
      enabled: boolean
      requiresAuthentication: boolean
      maxRetries: number               // Default: 3
      timeoutSeconds: number           // Default: 30
    }
    storage: {
      enabled: boolean
      path: string                     // Storage path pattern
      retentionDays: number            // Default: 90 days
    }
  }

  // Custom report builder configuration
  customReportBuilder: {
    enabled: boolean
    maxCustomReportsPerOrg: number     // Default: 20
    allowedDataSources: string[]       // Tables/views available for custom reports
    maxColumns: number                 // Default: 50
    maxRows: number                    // Default: 10000
    allowAggregations: boolean         // SUM, AVG, COUNT, etc.
    allowJoins: boolean                // Join multiple tables
    allowFilters: boolean              // WHERE conditions
  }

  // Compliance dashboard configuration
  complianceDashboard: {
    enabled: boolean
    refreshIntervalMinutes: number     // Default: 60 minutes
    includeCharts: boolean
    includeTrends: boolean
    historicalDataMonths: number       // Default: 12 months
    kpis: {
      medicalComplianceRate: boolean
      equipmentComplianceRate: boolean
      trainingComplianceRate: boolean
      alertResponseRate: boolean
      documentCompleteness: boolean
      overdueItems: boolean
    }
  }

  // Report generation limits
  generationLimits: {
    maxConcurrentGenerations: number   // Default: 3
    timeoutSeconds: number             // Default: 300 (5 minutes)
    maxFileSizeBytes: number           // Default: 100MB
    retryFailedAttempts: number        // Default: 2
  }

  // Data filters and privacy
  dataFilters: {
    anonymizePersonalData: boolean     // Anonymize CNP, personal info
    includeDeletedRecords: boolean     // Include soft-deleted records
    dateRangeDefault: number           // Default: 365 days
    requiresApproval: boolean          // Consultant approval required
  }

  // Branding and customization
  branding: {
    includeLogo: boolean
    logoUrl: string | null
    companyName: string | null
    footer: string | null
    watermark: string | null
    customCss: string | null
  }

  // Country-specific settings
  countrySpecific: {
    legalReferences: string[]          // Relevant legal acts for reporting
    reportingAuthority: string | null  // Authority receiving reports
    mandatoryReports: ReportType[]     // Legally required reports
    reportingFrequency: Record<ReportType, ReportScheduleFrequency>
  }
}

// ── Reports Module Definition ──
export const reportsModule: IModule = {
  key: 'reports',
  name_en: 'Reports & Analytics',
  name_localized: {
    ro: 'Rapoarte și Analize',
    bg: 'Отчети и анализи',
    hu: 'Jelentések és elemzések',
    de: 'Berichte und Analysen',
    pl: 'Raporty i analizy',
    en: 'Reports & Analytics',
  },
  description_en: 'Comprehensive reporting: scheduled reports, CSV/PDF/Excel export, custom report builder, compliance dashboards',
  icon: 'BarChart3',
  category: 'premium',
  is_base: false,
  depends_on: ['ssm-core', 'documents'], // Requires core SSM data and document generation
  incompatible: [], // Compatible with all modules

  /**
   * Returns default Reports module configuration
   */
  getDefaultConfig(): ReportsModuleConfig {
    return {
      activeReportTypes: {
        complianceOverview: true,
        medicalExpiryForecast: true,
        equipmentInspectionDue: true,
        trainingCompliance: true,
        employeeRoster: true,
        incidentSummary: false,
        auditTrail: true,
        costAnalysis: false,
        obligationTracker: true,
        customReports: false,
      },

      enabledFormats: {
        csv: true,
        pdf: true,
        excel: true,
        json: false,
      },

      schedulingConfig: {
        enableScheduledReports: true,
        maxScheduledReportsPerOrg: 10,
        defaultFrequency: 'monthly',
        allowedFrequencies: ['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'manual'],
        defaultDeliveryTime: '09:00',
        timezone: 'Europe/Bucharest',
      },

      deliveryConfig: {
        email: {
          enabled: true,
          maxRecipientsPerReport: 10,
          subjectPrefix: '[S-S-M] Raport:',
          includeLogo: true,
          includeAttachment: true,
        },
        download: {
          enabled: true,
          retentionDays: 30,
          maxSizeBytes: 50 * 1024 * 1024, // 50MB
        },
        webhook: {
          enabled: false,
          requiresAuthentication: true,
          maxRetries: 3,
          timeoutSeconds: 30,
        },
        storage: {
          enabled: true,
          path: 'reports/{org_id}/{year}/{month}/',
          retentionDays: 90,
        },
      },

      customReportBuilder: {
        enabled: false,
        maxCustomReportsPerOrg: 20,
        allowedDataSources: [
          'employees',
          'medical_examinations',
          'safety_equipment',
          'trainings',
          'alerts',
          'documents',
          'audit_log',
        ],
        maxColumns: 50,
        maxRows: 10000,
        allowAggregations: true,
        allowJoins: true,
        allowFilters: true,
      },

      complianceDashboard: {
        enabled: true,
        refreshIntervalMinutes: 60,
        includeCharts: true,
        includeTrends: true,
        historicalDataMonths: 12,
        kpis: {
          medicalComplianceRate: true,
          equipmentComplianceRate: true,
          trainingComplianceRate: true,
          alertResponseRate: true,
          documentCompleteness: true,
          overdueItems: true,
        },
      },

      generationLimits: {
        maxConcurrentGenerations: 3,
        timeoutSeconds: 300,
        maxFileSizeBytes: 100 * 1024 * 1024, // 100MB
        retryFailedAttempts: 2,
      },

      dataFilters: {
        anonymizePersonalData: false,
        includeDeletedRecords: false,
        dateRangeDefault: 365,
        requiresApproval: false,
      },

      branding: {
        includeLogo: true,
        logoUrl: null,
        companyName: null,
        footer: 'Generated by S-S-M.RO Platform',
        watermark: null,
        customCss: null,
      },

      countrySpecific: {
        legalReferences: [
          'Legea 319/2006 - SSM',
          'Legea 307/2006 - PSI',
          'GDPR - Regulamentul 679/2016',
        ],
        reportingAuthority: 'Inspectoratul Teritorial de Muncă',
        mandatoryReports: ['compliance_overview', 'medical_expiry_forecast'],
        reportingFrequency: {
          compliance_overview: 'monthly',
          medical_expiry_forecast: 'monthly',
          equipment_inspection_due: 'monthly',
          training_compliance: 'quarterly',
          employee_roster: 'annual',
          incident_summary: 'manual',
          audit_trail: 'manual',
          cost_analysis: 'quarterly',
          obligation_tracker: 'monthly',
          custom: 'manual',
        },
      },
    }
  },

  /**
   * Validates Reports module configuration
   * @param config - Configuration object to validate
   * @returns true if valid, false otherwise
   */
  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false

    // Validate active report types
    if (!config.activeReportTypes || typeof config.activeReportTypes !== 'object') return false

    // Validate enabled formats
    if (!config.enabledFormats || typeof config.enabledFormats !== 'object') return false
    const hasAtLeastOneFormat = Object.values(config.enabledFormats).some((v) => v === true)
    if (!hasAtLeastOneFormat) return false

    // Validate scheduling config
    if (!config.schedulingConfig) return false
    const scheduling = config.schedulingConfig
    if (
      typeof scheduling.enableScheduledReports !== 'boolean' ||
      typeof scheduling.maxScheduledReportsPerOrg !== 'number' ||
      !Array.isArray(scheduling.allowedFrequencies) ||
      scheduling.maxScheduledReportsPerOrg <= 0
    ) {
      return false
    }

    // Validate delivery config
    if (!config.deliveryConfig) return false
    const delivery = config.deliveryConfig
    if (
      !delivery.email ||
      !delivery.download ||
      !delivery.webhook ||
      !delivery.storage ||
      typeof delivery.email.enabled !== 'boolean' ||
      typeof delivery.download.enabled !== 'boolean'
    ) {
      return false
    }

    // Validate email config
    if (delivery.email.enabled) {
      if (
        typeof delivery.email.maxRecipientsPerReport !== 'number' ||
        delivery.email.maxRecipientsPerReport <= 0 ||
        delivery.email.maxRecipientsPerReport > 100
      ) {
        return false
      }
    }

    // Validate custom report builder
    if (!config.customReportBuilder) return false
    const builder = config.customReportBuilder
    if (
      typeof builder.enabled !== 'boolean' ||
      typeof builder.maxCustomReportsPerOrg !== 'number' ||
      !Array.isArray(builder.allowedDataSources) ||
      builder.maxCustomReportsPerOrg <= 0
    ) {
      return false
    }

    // Validate compliance dashboard
    if (!config.complianceDashboard) return false
    const dashboard = config.complianceDashboard
    if (
      typeof dashboard.enabled !== 'boolean' ||
      typeof dashboard.refreshIntervalMinutes !== 'number' ||
      !dashboard.kpis ||
      typeof dashboard.kpis !== 'object' ||
      dashboard.refreshIntervalMinutes <= 0
    ) {
      return false
    }

    // Validate generation limits
    if (!config.generationLimits) return false
    const limits = config.generationLimits
    if (
      typeof limits.maxConcurrentGenerations !== 'number' ||
      typeof limits.timeoutSeconds !== 'number' ||
      typeof limits.maxFileSizeBytes !== 'number' ||
      limits.maxConcurrentGenerations <= 0 ||
      limits.timeoutSeconds <= 0 ||
      limits.maxFileSizeBytes <= 0
    ) {
      return false
    }

    // Validate data filters
    if (!config.dataFilters) return false
    const filters = config.dataFilters
    if (
      typeof filters.anonymizePersonalData !== 'boolean' ||
      typeof filters.includeDeletedRecords !== 'boolean' ||
      typeof filters.dateRangeDefault !== 'number' ||
      filters.dateRangeDefault <= 0
    ) {
      return false
    }

    // Validate branding
    if (!config.branding || typeof config.branding !== 'object') return false

    // Validate country specific
    if (!config.countrySpecific) return false
    const country = config.countrySpecific
    if (
      !Array.isArray(country.legalReferences) ||
      !Array.isArray(country.mandatoryReports) ||
      !country.reportingFrequency ||
      typeof country.reportingFrequency !== 'object'
    ) {
      return false
    }

    return true
  },
}

// ── Report Definition Interfaces ──

/**
 * Scheduled report configuration
 */
export interface ScheduledReport {
  id: string
  organization_id: string
  report_type: ReportType
  report_name: string
  description: string | null
  frequency: ReportScheduleFrequency
  delivery_method: ReportDeliveryMethod[]
  format: ReportFormat
  recipients: string[]                   // Email addresses or webhook URLs
  filters: ReportFilters
  is_active: boolean
  next_run_at: string | null
  last_run_at: string | null
  last_run_status: 'success' | 'failed' | 'pending' | null
  created_by: string
  created_at: string
  updated_at: string
}

/**
 * Report filters and parameters
 */
export interface ReportFilters {
  dateRange?: {
    start: string                        // ISO date
    end: string                          // ISO date
    preset?: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'last_year' | 'custom'
  }
  departments?: string[]                 // Filter by department
  locations?: string[]                   // Filter by location
  employeeIds?: string[]                 // Specific employees
  categories?: string[]                  // Equipment categories, training types, etc.
  status?: string[]                      // Filter by status (valid, expiring, expired)
  includeArchived?: boolean              // Include archived/deleted records
  customFields?: Record<string, any>     // Custom filter fields
}

/**
 * Custom report definition
 */
export interface CustomReport {
  id: string
  organization_id: string
  report_name: string
  description: string | null
  data_sources: string[]                 // Tables to query
  columns: ReportColumn[]                // Columns to include
  filters: ReportFilters
  aggregations: ReportAggregation[]
  sorting: ReportSorting[]
  grouping: string[]                     // Group by columns
  is_public: boolean                     // Shared with org
  created_by: string
  created_at: string
  updated_at: string
}

/**
 * Report column definition
 */
export interface ReportColumn {
  id: string
  source_table: string
  source_column: string
  display_name: string
  data_type: 'string' | 'number' | 'date' | 'boolean' | 'json'
  format?: string                        // Date format, number format, etc.
  width?: number                         // Column width (pixels or percentage)
  is_visible: boolean
  order: number
}

/**
 * Report aggregation
 */
export interface ReportAggregation {
  id: string
  column_id: string
  function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'DISTINCT'
  alias: string
}

/**
 * Report sorting
 */
export interface ReportSorting {
  column_id: string
  direction: 'ASC' | 'DESC'
  order: number
}

/**
 * Generated report instance
 */
export interface GeneratedReport {
  id: string
  organization_id: string
  scheduled_report_id: string | null
  report_type: ReportType
  report_name: string
  format: ReportFormat
  file_path: string | null
  file_size_bytes: number | null
  row_count: number | null
  generation_time_ms: number | null
  filters_applied: ReportFilters
  status: 'pending' | 'generating' | 'completed' | 'failed'
  error_message: string | null
  generated_by: string
  generated_at: string
  expires_at: string | null
}

// ── Helper Functions ──

/**
 * Get report type display name
 * @param reportType - Report type
 * @param locale - Locale (ro, en, etc.)
 * @returns Localized display name
 */
export function getReportTypeName(reportType: ReportType, locale: string = 'ro'): string {
  const names: Record<ReportType, Record<string, string>> = {
    compliance_overview: {
      ro: 'Situație generală conformitate',
      en: 'Compliance Overview',
      bg: 'Общ преглед на съответствието',
      hu: 'Megfelelőségi áttekintés',
      de: 'Compliance-Übersicht',
    },
    medical_expiry_forecast: {
      ro: 'Prognoză expirare controale medicale',
      en: 'Medical Expiry Forecast',
      bg: 'Прогноза за изтичащи медицински прегледи',
      hu: 'Orvosi vizsgálatok lejárati előrejelzés',
      de: 'Ablauf medizinischer Untersuchungen',
    },
    equipment_inspection_due: {
      ro: 'Verificări echipamente scadente',
      en: 'Equipment Inspection Due',
      bg: 'Предстоящи проверки на оборудване',
      hu: 'Esedékes felszerelés-ellenőrzések',
      de: 'Fällige Geräteprüfungen',
    },
    training_compliance: {
      ro: 'Conformitate instruiri',
      en: 'Training Compliance',
      bg: 'Съответствие на обученията',
      hu: 'Képzési megfelelőség',
      de: 'Schulungs-Compliance',
    },
    employee_roster: {
      ro: 'Listă angajați',
      en: 'Employee Roster',
      bg: 'Списък служители',
      hu: 'Munkavállalói nyilvántartás',
      de: 'Mitarbeiterliste',
    },
    incident_summary: {
      ro: 'Sumar incidente',
      en: 'Incident Summary',
      bg: 'Резюме на инциденти',
      hu: 'Incidensek összefoglalója',
      de: 'Vorfallzusammenfassung',
    },
    audit_trail: {
      ro: 'Jurnal audit',
      en: 'Audit Trail',
      bg: 'Одитна следа',
      hu: 'Audit napló',
      de: 'Prüfpfad',
    },
    cost_analysis: {
      ro: 'Analiză costuri',
      en: 'Cost Analysis',
      bg: 'Анализ на разходите',
      hu: 'Költségelemzés',
      de: 'Kostenanalyse',
    },
    obligation_tracker: {
      ro: 'Urmărire obligații legale',
      en: 'Obligation Tracker',
      bg: 'Проследяване на задължения',
      hu: 'Kötelezettség-nyomon követés',
      de: 'Pflichten-Tracker',
    },
    custom: {
      ro: 'Raport personalizat',
      en: 'Custom Report',
      bg: 'Персонализиран отчет',
      hu: 'Egyéni jelentés',
      de: 'Benutzerdefinierter Bericht',
    },
  }

  return names[reportType]?.[locale] || names[reportType]?.['en'] || reportType
}

/**
 * Get report format MIME type
 * @param format - Report format
 * @returns MIME type
 */
export function getReportMimeType(format: ReportFormat): string {
  const mimeTypes: Record<ReportFormat, string> = {
    csv: 'text/csv',
    pdf: 'application/pdf',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    json: 'application/json',
  }
  return mimeTypes[format]
}

/**
 * Get report format file extension
 * @param format - Report format
 * @returns File extension
 */
export function getReportFileExtension(format: ReportFormat): string {
  const extensions: Record<ReportFormat, string> = {
    csv: '.csv',
    pdf: '.pdf',
    excel: '.xlsx',
    json: '.json',
  }
  return extensions[format]
}

/**
 * Calculate next scheduled run time
 * @param frequency - Schedule frequency
 * @param lastRunAt - Last run timestamp (ISO string)
 * @param deliveryTime - Delivery time (HH:MM format)
 * @param timezone - Timezone
 * @returns Next run timestamp (ISO string)
 */
export function calculateNextRunTime(
  frequency: ReportScheduleFrequency,
  lastRunAt: string | null,
  deliveryTime: string = '09:00',
  _timezone: string = 'Europe/Bucharest'
): string {
  const now = new Date()
  const [hours, minutes] = deliveryTime.split(':').map(Number)

  let nextRun: Date

  if (!lastRunAt) {
    // First run - schedule for tomorrow at delivery time
    nextRun = new Date(now)
    nextRun.setDate(now.getDate() + 1)
    nextRun.setHours(hours, minutes, 0, 0)
  } else {
    const lastRun = new Date(lastRunAt)

    switch (frequency) {
      case 'daily':
        nextRun = new Date(lastRun)
        nextRun.setDate(lastRun.getDate() + 1)
        nextRun.setHours(hours, minutes, 0, 0)
        break

      case 'weekly':
        nextRun = new Date(lastRun)
        nextRun.setDate(lastRun.getDate() + 7)
        nextRun.setHours(hours, minutes, 0, 0)
        break

      case 'monthly':
        nextRun = new Date(lastRun)
        nextRun.setMonth(lastRun.getMonth() + 1)
        nextRun.setHours(hours, minutes, 0, 0)
        break

      case 'quarterly':
        nextRun = new Date(lastRun)
        nextRun.setMonth(lastRun.getMonth() + 3)
        nextRun.setHours(hours, minutes, 0, 0)
        break

      case 'annual':
        nextRun = new Date(lastRun)
        nextRun.setFullYear(lastRun.getFullYear() + 1)
        nextRun.setHours(hours, minutes, 0, 0)
        break

      case 'manual':
      default:
        // Manual reports don't have next run time
        return ''
    }
  }

  return nextRun.toISOString()
}

/**
 * Validate report filters
 * @param filters - Report filters to validate
 * @returns true if valid, false otherwise
 */
export function validateReportFilters(filters: ReportFilters): boolean {
  if (!filters || typeof filters !== 'object') return false

  // Validate date range if present
  if (filters.dateRange) {
    const { start, end } = filters.dateRange
    if (!start || !end) return false
    if (new Date(start) > new Date(end)) return false
  }

  // Validate arrays if present
  if (filters.departments && !Array.isArray(filters.departments)) return false
  if (filters.locations && !Array.isArray(filters.locations)) return false
  if (filters.employeeIds && !Array.isArray(filters.employeeIds)) return false
  if (filters.categories && !Array.isArray(filters.categories)) return false
  if (filters.status && !Array.isArray(filters.status)) return false

  return true
}

// ── Exports ──
export default reportsModule
