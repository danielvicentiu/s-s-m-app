// lib/hooks/useAlerts.ts
// Hook React client-side pentru alerte SSM/PSI (fișe medicale + echipamente + instruiri)
// Pattern identic cu hooks/usePermission.ts și hooks/useOrgModules.ts
// Include realtime subscription pentru actualizări live
// Data: 13 Februarie 2026

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { getAlertCategoriesForCountry, calculateAlertUrgency } from '@/lib/dashboard-helpers'
import type { AlertCategory } from '@/lib/types'

// ── TIPURI ──

export type AlertType = 'medical' | 'equipment' | 'training'
export type AlertUrgency = 'info' | 'warning' | 'critical' | 'expired'

export interface Alert {
  id: string
  type: AlertType
  urgency: AlertUrgency
  organization_id: string

  // Date comune
  expiry_date: string
  days_left: number

  // Fișe medicale
  employee_name?: string
  job_title?: string
  examination_type?: string
  result?: string

  // Echipamente
  equipment_type?: string
  description?: string
  location?: string
  serial_number?: string

  // Instruiri
  module_title?: string
  worker_name?: string
  due_date?: string
  status?: string

  // Metadata
  alert_category?: string
  created_at?: string
  updated_at?: string
}

export interface AlertCounts {
  total: number
  active: number
  urgent: number
  expired: number
  critical: number
  warning: number
  info: number

  // Per tip
  medical: number
  equipment: number
  training: number
}

// ── HOOK PRINCIPAL ──

export interface UseAlertsOptions {
  organizationId: string | null
  countryCode?: string
  enableRealtime?: boolean
  autoRefreshInterval?: number // milliseconds (default: 0 = disabled)
}

export function useAlerts(options: UseAlertsOptions) {
  const {
    organizationId,
    countryCode = 'RO',
    enableRealtime = true,
    autoRefreshInterval = 0
  } = options

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertCategories, setAlertCategories] = useState<AlertCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ── Helper: calculează zile rămase ──
  const calculateDaysLeft = useCallback((dateStr: string): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }, [])

  // ── Helper: determină urgency bazat pe alert categories ──
  const determineUrgency = useCallback((daysLeft: number, categories: AlertCategory[]): AlertUrgency => {
    if (daysLeft <= 0) return 'expired'

    // Folosește cel mai permisiv threshold dintre categorii
    const mostPermissive = categories.reduce((acc, cat) => ({
      critical: Math.max(acc.critical, cat.critical_days_before),
      warning: Math.max(acc.warning, cat.warning_days_before)
    }), { critical: 3, warning: 7 })

    if (daysLeft <= mostPermissive.critical) return 'critical'
    if (daysLeft <= mostPermissive.warning) return 'warning'
    return 'info'
  }, [])

  // ── Funcție principală de fetch ──
  const fetchAlerts = useCallback(async () => {
    if (!organizationId) {
      setAlerts([])
      setLoading(false)
      return
    }

    try {
      setError(null)
      const supabase = createSupabaseBrowser()

      // 1. Fetch alert categories pentru țara organizației
      const categories = await getAlertCategoriesForCountry(countryCode)
      setAlertCategories(categories)

      // Determină max warning days pentru optimization
      const maxWarningDays = categories.length > 0
        ? Math.max(...categories.map(c => c.warning_days_before))
        : 30

      const today = new Date()
      const cutoffDate = new Date(today)
      cutoffDate.setDate(today.getDate() + maxWarningDays)
      const cutoffStr = cutoffDate.toISOString().split('T')[0]

      const newAlerts: Alert[] = []

      // 2. Fetch fișe medicale
      const { data: medicals, error: medError } = await supabase
        .from('medical_examinations')
        .select('id, employee_name, job_title, examination_type, result, expiry_date, created_at, updated_at')
        .eq('organization_id', organizationId)
        .lte('expiry_date', cutoffStr)
        .order('expiry_date', { ascending: true })

      if (medError) throw medError

      if (medicals) {
        for (const med of medicals) {
          const daysLeft = calculateDaysLeft(med.expiry_date)
          if (daysLeft <= maxWarningDays) {
            const urgency = determineUrgency(daysLeft, categories)
            newAlerts.push({
              id: `med-${med.id}`,
              type: 'medical',
              urgency,
              organization_id: organizationId,
              expiry_date: med.expiry_date,
              days_left: daysLeft,
              employee_name: med.employee_name,
              job_title: med.job_title || undefined,
              examination_type: med.examination_type,
              result: med.result,
              alert_category: categories[0]?.name,
              created_at: med.created_at,
              updated_at: med.updated_at,
            })
          }
        }
      }

      // 3. Fetch echipamente PSI
      const { data: equipment, error: equipError } = await supabase
        .from('safety_equipment')
        .select('id, equipment_type, description, location, serial_number, expiry_date, created_at, updated_at')
        .eq('organization_id', organizationId)
        .lte('expiry_date', cutoffStr)
        .order('expiry_date', { ascending: true })

      if (equipError) throw equipError

      if (equipment) {
        for (const eq of equipment) {
          const daysLeft = calculateDaysLeft(eq.expiry_date)
          if (daysLeft <= maxWarningDays) {
            const urgency = determineUrgency(daysLeft, categories)
            newAlerts.push({
              id: `eq-${eq.id}`,
              type: 'equipment',
              urgency,
              organization_id: organizationId,
              expiry_date: eq.expiry_date,
              days_left: daysLeft,
              equipment_type: eq.equipment_type,
              description: eq.description || undefined,
              location: eq.location || undefined,
              serial_number: eq.serial_number || undefined,
              alert_category: categories[0]?.name,
              created_at: eq.created_at,
              updated_at: eq.updated_at,
            })
          }
        }
      }

      // 4. Fetch instruiri restante
      const { data: trainings, error: trainError } = await supabase
        .from('training_assignments')
        .select('id, worker_name, employee_name, module_title, title, due_date, status, created_at, updated_at')
        .eq('organization_id', organizationId)
        .in('status', ['assigned', 'overdue'])
        .lte('due_date', cutoffStr)
        .order('due_date', { ascending: true })

      if (trainError && trainError.code !== 'PGRST116') {
        // PGRST116 = tabelul nu există (ok în early MVP)
        console.warn('Training assignments error:', trainError)
      }

      if (trainings) {
        for (const train of trainings) {
          const daysLeft = calculateDaysLeft(train.due_date)
          if (daysLeft <= maxWarningDays) {
            const urgency = determineUrgency(daysLeft, categories)
            newAlerts.push({
              id: `train-${train.id}`,
              type: 'training',
              urgency,
              organization_id: organizationId,
              expiry_date: train.due_date,
              due_date: train.due_date,
              days_left: daysLeft,
              worker_name: train.worker_name || train.employee_name || undefined,
              module_title: train.module_title || train.title || undefined,
              status: train.status,
              alert_category: categories[0]?.name,
              created_at: train.created_at,
              updated_at: train.updated_at,
            })
          }
        }
      }

      // 5. Sortează: expired first, apoi pe days_left
      newAlerts.sort((a, b) => {
        if (a.urgency === 'expired' && b.urgency !== 'expired') return -1
        if (b.urgency === 'expired' && a.urgency !== 'expired') return 1
        return a.days_left - b.days_left
      })

      setAlerts(newAlerts)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch alerts'))
      console.error('useAlerts error:', err)
    } finally {
      setLoading(false)
    }
  }, [organizationId, countryCode, calculateDaysLeft, determineUrgency])

  // ── Initial fetch ──
  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  // ── Auto-refresh interval (optional) ──
  useEffect(() => {
    if (!autoRefreshInterval || autoRefreshInterval <= 0) return

    const interval = setInterval(fetchAlerts, autoRefreshInterval)
    return () => clearInterval(interval)
  }, [fetchAlerts, autoRefreshInterval])

  // ── Realtime subscription (optional) ──
  useEffect(() => {
    if (!enableRealtime || !organizationId) return

    const supabase = createSupabaseBrowser()

    // Subscribe la toate tabelele relevante
    const channel = supabase
      .channel(`alerts-${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medical_examinations',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => fetchAlerts()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'safety_equipment',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => fetchAlerts()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'training_assignments',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => fetchAlerts()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [organizationId, enableRealtime, fetchAlerts])

  // ── Computed counts ──
  const counts: AlertCounts = useMemo(() => {
    const total = alerts.length
    const expired = alerts.filter(a => a.urgency === 'expired').length
    const critical = alerts.filter(a => a.urgency === 'critical').length
    const warning = alerts.filter(a => a.urgency === 'warning').length
    const info = alerts.filter(a => a.urgency === 'info').length

    return {
      total,
      active: total,
      urgent: expired + critical,
      expired,
      critical,
      warning,
      info,
      medical: alerts.filter(a => a.type === 'medical').length,
      equipment: alerts.filter(a => a.type === 'equipment').length,
      training: alerts.filter(a => a.type === 'training').length,
    }
  }, [alerts])

  // ── Action: resolve alert (soft delete sau marcare) ──
  const resolveAlert = useCallback(async (alertId: string): Promise<boolean> => {
    if (!organizationId) return false

    try {
      const supabase = createSupabaseBrowser()
      const alert = alerts.find(a => a.id === alertId)

      if (!alert) return false

      // Extract real ID și tip
      const [typePrefix, realId] = alertId.split('-')

      if (typePrefix === 'med') {
        // Pentru fișe medicale: nu ștergem, ci doar refresh (user trebuie să actualizeze data)
        // În viitor: poate adăugăm un câmp "acknowledged_at"
        console.log('Medical examination alert acknowledged:', realId)
      } else if (typePrefix === 'eq') {
        // Pentru echipamente: similar
        console.log('Equipment alert acknowledged:', realId)
      } else if (typePrefix === 'train') {
        // Pentru instruiri: poate marcăm ca "actioned"
        console.log('Training alert acknowledged:', realId)
      }

      // Refresh alertele după acknowledge
      await fetchAlerts()
      return true
    } catch (err) {
      console.error('Error resolving alert:', err)
      return false
    }
  }, [organizationId, alerts, fetchAlerts])

  // ── Action: resolve all alerts (bulk acknowledge) ──
  const resolveAll = useCallback(async (): Promise<boolean> => {
    if (!organizationId || alerts.length === 0) return false

    try {
      // Acknowledge toate alertele
      for (const alert of alerts) {
        await resolveAlert(alert.id)
      }

      await fetchAlerts()
      return true
    } catch (err) {
      console.error('Error resolving all alerts:', err)
      return false
    }
  }, [organizationId, alerts, resolveAlert, fetchAlerts])

  // ── Helper filters ──
  const getAlertsByType = useCallback((type: AlertType) => {
    return alerts.filter(a => a.type === type)
  }, [alerts])

  const getAlertsByUrgency = useCallback((urgency: AlertUrgency) => {
    return alerts.filter(a => a.urgency === urgency)
  }, [alerts])

  const getUrgentAlerts = useCallback(() => {
    return alerts.filter(a => a.urgency === 'expired' || a.urgency === 'critical')
  }, [alerts])

  return {
    // Core data
    alerts,
    alertCategories,
    loading,
    error,

    // Counts
    activeCount: counts.active,
    urgentCount: counts.urgent,
    counts,

    // Actions
    resolveAlert,
    resolveAll,
    refetch: fetchAlerts,

    // Filters
    getAlertsByType,
    getAlertsByUrgency,
    getUrgentAlerts,
  }
}

// ── HOOK SHORTCUT: useAlertCount() ──
// Returnează doar count-urile (lightweight, fără datele complete)
export function useAlertCount(organizationId: string | null, countryCode: string = 'RO') {
  const { activeCount, urgentCount, counts, loading } = useAlerts({
    organizationId,
    countryCode,
    enableRealtime: true,
  })

  return { activeCount, urgentCount, counts, loading }
}

// ── HOOK SHORTCUT: useHasUrgentAlerts() ──
// Boolean check rapid pentru badge-uri în UI
export function useHasUrgentAlerts(organizationId: string | null, countryCode: string = 'RO'): boolean {
  const { urgentCount, loading } = useAlertCount(organizationId, countryCode)
  return !loading && urgentCount > 0
}
