// lib/alerts/engine-types.ts
// Tipuri partajate pentru M4 Alerting Engine

export interface AlertSourceItem {
  sourceId: string         // ID-ul entității sursă (employee.id, iscir_equipment.id etc.)
  alertType: string        // Slug din alert_categories (ex: 'medical_expiry')
  title: string            // Titlul alertei vizibil utilizatorului
  description?: string     // Detalii suplimentare opționale
  expiryDate?: string      // ISO date (YYYY-MM-DD), undefined pentru 'missing' alerts
  employeeName?: string    // Numele angajatului (pentru alerte per-angajat)
  itemName?: string        // Numele echipamentului (pentru alerte per-echipament)
  daysRemaining?: number   // Zile până la expirare (negativ = deja expirat)
}

export interface OrgConfig {
  organizationId: string
  orgName: string
  countryCode: string
  contactEmail: string | null
  alertDays: number[]      // Din alert_configurations.alert_days
  emailEnabled: boolean
  smsEnabled: boolean
  whatsappEnabled: boolean
}

export interface GenerateResult {
  organizationId: string
  orgName: string
  generated: number
  skipped: number          // Duplicate — deja existente
  errors: string[]
}
