// hooks/useAlerts.ts
// React hook pentru gestionare alerte SSM/PSI
// Fetch /api/alerts, returnează alerte + counts + funcții manage
// Auto-poll pentru critical alerts la fiecare 2 minute

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ── TYPES ──

export interface Alert {
  id: string
  organization_id: string
  alert_type: 'medical_expiry' | 'equipment_expiry' | 'training_expiry' | 'document_missing' | 'compliance_issue' | 'safety_incident'
  severity: 'info' | 'warning' | 'critical' | 'expired'
  title: string
  description: string
  related_entity_type: 'employee' | 'equipment' | 'training' | 'document' | 'general'
  related_entity_id: string | null
  action_required: string
  due_date: string | null
  is_acknowledged: boolean
  acknowledged_at: string | null
  acknowledged_by: string | null
  is_resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  updated_at: string
}

export interface AlertsResponse {
  success: boolean
  alerts: Alert[]
  timestamp: string
  organization_id?: string
  summary?: {
    total: number
    expired: number
    critical: number
    warning: number
    info: number
  }
}

export interface UseAlertsReturn {
  alerts: Alert[]
  activeCount: number
  criticalCount: number
  acknowledgeAlert: (alertId: string) => Promise<boolean>
  resolveAlert: (alertId: string) => Promise<boolean>
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// ── HOOK ──

export default function useAlerts(
  severityFilter?: ('info' | 'warning' | 'critical' | 'expired')[]
): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  // ── FETCH ALERTS ──
  const fetchAlerts = useCallback(async () => {
    try {
      setError(null)

      const response = await fetch('/api/alerts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.status} ${response.statusText}`)
      }

      const data: AlertsResponse = await response.json()

      if (!mountedRef.current) return

      if (data.success && data.alerts) {
        // Aplică filtru severity dacă este setat
        let filteredAlerts = data.alerts
        if (severityFilter && severityFilter.length > 0) {
          filteredAlerts = data.alerts.filter(alert =>
            severityFilter.includes(alert.severity)
          )
        }

        setAlerts(filteredAlerts)
      } else {
        setAlerts([])
      }

      setIsLoading(false)
    } catch (err) {
      if (!mountedRef.current) return

      console.error('Error fetching alerts:', err)
      setError(err instanceof Error ? err : new Error('Unknown error fetching alerts'))
      setIsLoading(false)
    }
  }, [severityFilter])

  // ── ACKNOWLEDGE ALERT ──
  const acknowledgeAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertId,
          action: 'acknowledge',
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to acknowledge alert: ${response.status}`)
      }

      // Actualizează starea locală
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? { ...alert, is_acknowledged: true, acknowledged_at: new Date().toISOString() }
            : alert
        )
      )

      return true
    } catch (err) {
      console.error('Error acknowledging alert:', err)
      return false
    }
  }, [])

  // ── RESOLVE ALERT ──
  const resolveAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertId,
          action: 'resolve',
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to resolve alert: ${response.status}`)
      }

      // Actualizează starea locală — elimină alerta rezolvată
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))

      return true
    } catch (err) {
      console.error('Error resolving alert:', err)
      return false
    }
  }, [])

  // ── CALCUL COUNTS ──
  const activeCount = alerts.filter(a => !a.is_resolved).length
  const criticalCount = alerts.filter(
    a => !a.is_resolved && (a.severity === 'critical' || a.severity === 'expired')
  ).length

  // ── AUTO-POLL PENTRU CRITICAL ALERTS ──
  useEffect(() => {
    // Fetch inițial
    fetchAlerts()

    // Setează polling pentru critical alerts
    if (criticalCount > 0 || isLoading) {
      // Poll la fiecare 2 minute (120000ms) dacă există alerte critice
      pollingIntervalRef.current = setInterval(() => {
        fetchAlerts()
      }, 120000) // 2 minute
    }

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [criticalCount, isLoading, fetchAlerts])

  // ── CLEANUP ON UNMOUNT ──
  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  return {
    alerts,
    activeCount,
    criticalCount,
    acknowledgeAlert,
    resolveAlert,
    isLoading,
    error,
    refetch: fetchAlerts,
  }
}
