// lib/services/alert.service.ts
// Alert Service — Typed Supabase queries pentru v_active_alerts + alert_categories
// Respectă Code Contract: camelCase, error handling, TypeScript strict

import { createSupabaseServer } from '@/lib/supabase/server'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { Alert, AlertSeverity } from '@/lib/types'

export interface AlertFilters {
  organizationId?: string
  alertType?: 'medical' | 'equipment'
  severity?: AlertSeverity
  minDaysRemaining?: number
  maxDaysRemaining?: number
}

export interface AlertCount {
  total: number
  expired: number
  critical: number
  warning: number
  info: number
}

export interface CreateAlertParams {
  organizationId: string
  alertType: 'medical' | 'equipment'
  severity: AlertSeverity
  sourceId: string
  employeeName?: string
  examinationType: string
  expiryDate: string
  locationName?: string
}

/**
 * AlertService — Class pentru operații cu alerte
 * Folosește view v_active_alerts (read-only) și alert_categories
 */
export class AlertService {
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
  }

  /**
   * getActive — Ia toate alertele active cu filtrare opțională
   */
  async getActive(filters?: AlertFilters): Promise<{ data: Alert[] | null; error: string | null }> {
    try {
      let query = this.supabase
        .from('v_active_alerts')
        .select('*')
        .order('days_remaining', { ascending: true })

      // Filtre opționale
      if (filters?.organizationId) {
        query = query.eq('organization_id', filters.organizationId)
      }

      if (filters?.alertType) {
        query = query.eq('alert_type', filters.alertType)
      }

      if (filters?.severity) {
        query = query.eq('severity', filters.severity)
      }

      if (filters?.minDaysRemaining !== undefined) {
        query = query.gte('days_remaining', filters.minDaysRemaining)
      }

      if (filters?.maxDaysRemaining !== undefined) {
        query = query.lte('days_remaining', filters.maxDaysRemaining)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching active alerts:', error)
        return { data: null, error: error.message }
      }

      return { data: data as Alert[], error: null }
    } catch (err) {
      console.error('Exception in getActive:', err)
      return { data: null, error: 'Eroare la încărcarea alertelor' }
    }
  }

  /**
   * getByType — Ia alerte filtrate după tip (medical/equipment)
   */
  async getByType(
    alertType: 'medical' | 'equipment',
    organizationId?: string
  ): Promise<{ data: Alert[] | null; error: string | null }> {
    return this.getActive({
      alertType,
      organizationId,
    })
  }

  /**
   * getCount — Returnează numărul de alerte per severitate
   */
  async getCount(organizationId?: string): Promise<{ data: AlertCount | null; error: string | null }> {
    try {
      const { data, error } = await this.getActive({ organizationId })

      if (error || !data) {
        return { data: null, error: error || 'Nu s-au găsit alerte' }
      }

      const count: AlertCount = {
        total: data.length,
        expired: data.filter((a) => a.severity === 'expired').length,
        critical: data.filter((a) => a.severity === 'critical').length,
        warning: data.filter((a) => a.severity === 'warning').length,
        info: data.filter((a) => a.severity === 'info').length,
      }

      return { data: count, error: null }
    } catch (err) {
      console.error('Exception in getCount:', err)
      return { data: null, error: 'Eroare la calcularea numărului de alerte' }
    }
  }

  /**
   * getUrgent — Ia doar alertele urgente (expired + critical)
   */
  async getUrgent(organizationId?: string): Promise<{ data: Alert[] | null; error: string | null }> {
    try {
      const { data, error } = await this.getActive({ organizationId })

      if (error || !data) {
        return { data: null, error: error || 'Nu s-au găsit alerte' }
      }

      const urgent = data.filter((a) => a.severity === 'expired' || a.severity === 'critical')

      return { data: urgent, error: null }
    } catch (err) {
      console.error('Exception in getUrgent:', err)
      return { data: null, error: 'Eroare la încărcarea alertelor urgente' }
    }
  }

  /**
   * create — Creare alertă manuală (NOTĂ: v_active_alerts este view read-only)
   * Această metodă va fi utilă când vom avea o tabelă alerts separată
   * Pentru moment, alertele se generează automat din medical_examinations + safety_equipment
   */
  async create(params: CreateAlertParams): Promise<{ data: any | null; error: string | null }> {
    try {
      // IMPORTANT: v_active_alerts este VIEW read-only
      // În viitor, când vom avea tabela alerts separată, implementăm aici
      console.warn('create() not implemented — v_active_alerts is a read-only view')
      console.warn('Alerts are auto-generated from medical_examinations + safety_equipment')

      return {
        data: null,
        error: 'Alertele se generează automat din fișele medicale și echipamente',
      }
    } catch (err) {
      console.error('Exception in create:', err)
      return { data: null, error: 'Eroare la crearea alertei' }
    }
  }

  /**
   * resolve — Rezolvare alertă (marchează ca rezolvată)
   * NOTĂ: v_active_alerts este view, deci acest lucru se face prin
   * actualizarea recordului sursă (medical_examinations sau safety_equipment)
   */
  async resolve(alertId: string, alertType: 'medical' | 'equipment'): Promise<{ success: boolean; error: string | null }> {
    try {
      // Pentru a rezolva o alertă, trebuie să actualizăm recordul sursă
      // alertId = source_id din view
      const tableName = alertType === 'medical' ? 'medical_examinations' : 'safety_equipment'

      // Opțiune 1: Actualizare expiry_date (extinde valabilitatea)
      // Opțiune 2: Marcare ca rezolvată (dacă există câmp is_resolved)
      // Opțiune 3: Ștergere soft (deleted_at)

      console.warn(`resolve() requires updating ${tableName} table directly`)
      console.warn('Recommended: Update expiry_date or add new examination/inspection')

      return {
        success: false,
        error: 'Pentru a rezolva alerta, actualizați înregistrarea sursă (fișă medicală/echipament)',
      }
    } catch (err) {
      console.error('Exception in resolve:', err)
      return { success: false, error: 'Eroare la rezolvarea alertei' }
    }
  }

  /**
   * bulkResolve — Rezolvare în masă (multiple alerte)
   */
  async bulkResolve(
    alertIds: string[],
    alertType: 'medical' | 'equipment'
  ): Promise<{ success: boolean; resolvedCount: number; error: string | null }> {
    try {
      if (alertIds.length === 0) {
        return { success: true, resolvedCount: 0, error: null }
      }

      // Similar cu resolve(), necesită actualizare în tabela sursă
      const tableName = alertType === 'medical' ? 'medical_examinations' : 'safety_equipment'

      console.warn(`bulkResolve() requires batch updating ${tableName} table`)
      console.warn('Recommended: Update expiry_date in batch or mark as reviewed')

      return {
        success: false,
        resolvedCount: 0,
        error: 'Pentru rezolvare în masă, actualizați înregistrările sursă',
      }
    } catch (err) {
      console.error('Exception in bulkResolve:', err)
      return { success: false, resolvedCount: 0, error: 'Eroare la rezolvarea în masă' }
    }
  }
}

/**
 * createAlertService — Factory pentru server-side
 */
export async function createAlertService() {
  const supabase = await createSupabaseServer()
  return new AlertService(supabase)
}

/**
 * createAlertServiceClient — Factory pentru client-side
 */
export function createAlertServiceClient() {
  const supabase = createSupabaseBrowser()
  return new AlertService(supabase)
}
