// lib/services/realtime-dashboard.ts
// Supabase Realtime — Dashboard widget auto-refresh subscriptions
// Subscriptions: alerts (medical + equipment expiry), employees, trainings
// Auto-refresh dashboard widgets when data changes (INSERT, UPDATE, DELETE)
// Cleanup on unmount to prevent memory leaks

import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ── TYPES ──

export interface AlertItem {
  type: 'medical' | 'equipment'
  employee_name?: string
  equipment_type?: string
  description?: string
  location?: string
  expiry_date: string
  days_left: number
  urgency: 'info' | 'warning' | 'critical' | 'expired'
  organization_id: string
}

export interface EmployeeChange {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  old: Record<string, any> | null
  new: Record<string, any> | null
}

export interface TrainingUpdate {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  old: Record<string, any> | null
  new: Record<string, any> | null
}

export interface AlertCallback {
  (alert: AlertItem): void
}

export interface EmployeeChangeCallback {
  (change: EmployeeChange): void
}

export interface TrainingUpdateCallback {
  (update: TrainingUpdate): void
}

// ── SINGLETON CHANNELS MAP ──
// Prevents duplicate subscriptions per organization
const channelsMap = new Map<string, RealtimeChannel>()

// ── HELPER: Calculate days until expiry ──
function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

// ── HELPER: Calculate urgency based on days left ──
function calculateUrgency(daysLeft: number): 'info' | 'warning' | 'critical' | 'expired' {
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 3) return 'critical'
  if (daysLeft <= 7) return 'warning'
  return 'info'
}

// ── PUBLIC API ──

/**
 * Subscribe to new alerts (medical examinations expiring)
 * Monitors medical_examinations table for items expiring within 30 days
 * Triggers callback when new expiring records are inserted or updated
 *
 * @param orgId - Organization UUID
 * @param onNewAlert - Callback function called with alert details
 * @returns Cleanup function to call on unmount
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = subscribeToAlerts(orgId, (alert) => {
 *     if (alert.urgency === 'expired' || alert.urgency === 'critical') {
 *       toast.error(`Alertă: ${alert.employee_name} - ${alert.urgency}`)
 *       refreshDashboard()
 *     }
 *   })
 *   return cleanup
 * }, [orgId])
 * ```
 */
export function subscribeToAlerts(
  orgId: string,
  onNewAlert: AlertCallback
): () => void {
  const supabase = createSupabaseBrowser()
  const channelName = `alerts:${orgId}`

  try {
    // Get or create channel
    let channel = channelsMap.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName)
      channelsMap.set(channelName, channel)
    }

    // Calculate 30 days from now (alert threshold)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const alertThreshold = thirtyDaysFromNow.toISOString().split('T')[0]

    // Subscribe to medical examinations changes
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medical_examinations',
          filter: `organization_id=eq.${orgId}`,
        },
        (payload) => {
          const record = payload.new as any

          // Only trigger for records expiring within 30 days
          if (record && record.expiry_date && record.expiry_date <= alertThreshold) {
            const daysLeft = daysUntil(record.expiry_date)
            const urgency = calculateUrgency(daysLeft)

            const alert: AlertItem = {
              type: 'medical',
              employee_name: record.employee_name,
              expiry_date: record.expiry_date,
              days_left: daysLeft,
              urgency,
              organization_id: record.organization_id,
            }

            onNewAlert(alert)
          }
        }
      )
      // Subscribe to safety equipment changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'safety_equipment',
          filter: `organization_id=eq.${orgId}`,
        },
        (payload) => {
          const record = payload.new as any

          // Only trigger for records expiring within 30 days
          if (record && record.expiry_date && record.expiry_date <= alertThreshold) {
            const daysLeft = daysUntil(record.expiry_date)
            const urgency = calculateUrgency(daysLeft)

            const alert: AlertItem = {
              type: 'equipment',
              equipment_type: record.equipment_type,
              description: record.description,
              location: record.location,
              expiry_date: record.expiry_date,
              days_left: daysLeft,
              urgency,
              organization_id: record.organization_id,
            }

            onNewAlert(alert)
          }
        }
      )
      .subscribe()

    // Cleanup function
    return () => {
      try {
        supabase.removeChannel(channel)
        channelsMap.delete(channelName)
      } catch (error) {
        console.error('[RealtimeDashboard] Failed to unsubscribe from alerts:', error)
      }
    }
  } catch (error) {
    console.error('[RealtimeDashboard] Failed to subscribe to alerts:', error)
    return () => {} // No-op cleanup
  }
}

/**
 * Subscribe to employee changes (INSERT, UPDATE, DELETE)
 * Monitors employees table for any changes in the organization
 * Triggers callback to refresh employee list/widgets
 *
 * @param orgId - Organization UUID
 * @param onChange - Callback function called with change details
 * @returns Cleanup function to call on unmount
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = subscribeToEmployeeChanges(orgId, (change) => {
 *     console.log(`Employee ${change.eventType}:`, change.new)
 *     refetchEmployees()
 *   })
 *   return cleanup
 * }, [orgId])
 * ```
 */
export function subscribeToEmployeeChanges(
  orgId: string,
  onChange: EmployeeChangeCallback
): () => void {
  const supabase = createSupabaseBrowser()
  const channelName = `employees:${orgId}`

  try {
    // Get or create channel
    let channel = channelsMap.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName)
      channelsMap.set(channelName, channel)
    }

    // Subscribe to employees table changes
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees',
          filter: `organization_id=eq.${orgId}`,
        },
        (payload) => {
          const change: EmployeeChange = {
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            old: payload.old as Record<string, any> | null,
            new: payload.new as Record<string, any> | null,
          }

          onChange(change)
        }
      )
      .subscribe()

    // Cleanup function
    return () => {
      try {
        supabase.removeChannel(channel)
        channelsMap.delete(channelName)
      } catch (error) {
        console.error('[RealtimeDashboard] Failed to unsubscribe from employee changes:', error)
      }
    }
  } catch (error) {
    console.error('[RealtimeDashboard] Failed to subscribe to employee changes:', error)
    return () => {} // No-op cleanup
  }
}

/**
 * Subscribe to training updates (INSERT, UPDATE, DELETE)
 * Monitors trainings table for any changes in the organization
 * Triggers callback to refresh training list/widgets
 *
 * @param orgId - Organization UUID
 * @param onUpdate - Callback function called with update details
 * @returns Cleanup function to call on unmount
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = subscribeToTrainingUpdates(orgId, (update) => {
 *     console.log(`Training ${update.eventType}:`, update.new)
 *     refetchTrainings()
 *   })
 *   return cleanup
 * }, [orgId])
 * ```
 */
export function subscribeToTrainingUpdates(
  orgId: string,
  onUpdate: TrainingUpdateCallback
): () => void {
  const supabase = createSupabaseBrowser()
  const channelName = `trainings:${orgId}`

  try {
    // Get or create channel
    let channel = channelsMap.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName)
      channelsMap.set(channelName, channel)
    }

    // Subscribe to trainings table changes
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trainings',
          filter: `organization_id=eq.${orgId}`,
        },
        (payload) => {
          const update: TrainingUpdate = {
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            old: payload.old as Record<string, any> | null,
            new: payload.new as Record<string, any> | null,
          }

          onUpdate(update)
        }
      )
      .subscribe()

    // Cleanup function
    return () => {
      try {
        supabase.removeChannel(channel)
        channelsMap.delete(channelName)
      } catch (error) {
        console.error('[RealtimeDashboard] Failed to unsubscribe from training updates:', error)
      }
    }
  } catch (error) {
    console.error('[RealtimeDashboard] Failed to subscribe to training updates:', error)
    return () => {} // No-op cleanup
  }
}

/**
 * Subscribe to all dashboard changes at once
 * Combines alerts, employees, and trainings subscriptions
 * Returns a single cleanup function that unsubscribes from all
 *
 * @param orgId - Organization UUID
 * @param callbacks - Object with all callback functions
 * @returns Cleanup function to call on unmount
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = subscribeToAllDashboardChanges(orgId, {
 *     onAlert: (alert) => {
 *       toast.warning(`Alertă nouă: ${alert.employee_name}`)
 *       setAlerts(prev => [...prev, alert])
 *     },
 *     onEmployeeChange: (change) => {
 *       refetchEmployees()
 *     },
 *     onTrainingUpdate: (update) => {
 *       refetchTrainings()
 *     }
 *   })
 *   return cleanup
 * }, [orgId])
 * ```
 */
export function subscribeToAllDashboardChanges(
  orgId: string,
  callbacks: {
    onAlert?: AlertCallback
    onEmployeeChange?: EmployeeChangeCallback
    onTrainingUpdate?: TrainingUpdateCallback
  }
): () => void {
  const cleanups: Array<() => void> = []

  try {
    // Subscribe to alerts if callback provided
    if (callbacks.onAlert) {
      const cleanup = subscribeToAlerts(orgId, callbacks.onAlert)
      cleanups.push(cleanup)
    }

    // Subscribe to employee changes if callback provided
    if (callbacks.onEmployeeChange) {
      const cleanup = subscribeToEmployeeChanges(orgId, callbacks.onEmployeeChange)
      cleanups.push(cleanup)
    }

    // Subscribe to training updates if callback provided
    if (callbacks.onTrainingUpdate) {
      const cleanup = subscribeToTrainingUpdates(orgId, callbacks.onTrainingUpdate)
      cleanups.push(cleanup)
    }

    // Return combined cleanup function
    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  } catch (error) {
    console.error('[RealtimeDashboard] Failed to subscribe to dashboard changes:', error)
    return () => {} // No-op cleanup
  }
}

/**
 * Cleanup all active subscriptions
 * Useful when user logs out or switches organizations
 * Removes all channels and clears the channels map
 */
export function cleanupAllSubscriptions(): void {
  try {
    const supabase = createSupabaseBrowser()

    // Remove all channels
    channelsMap.forEach((channel, channelName) => {
      try {
        supabase.removeChannel(channel)
      } catch (error) {
        console.error(`[RealtimeDashboard] Failed to remove channel ${channelName}:`, error)
      }
    })

    // Clear the map
    channelsMap.clear()
  } catch (error) {
    console.error('[RealtimeDashboard] Failed to cleanup all subscriptions:', error)
  }
}

/**
 * Get count of active subscriptions
 * Useful for debugging and monitoring
 *
 * @returns Number of active channels
 */
export function getActiveSubscriptionsCount(): number {
  return channelsMap.size
}

/**
 * Get list of active channel names
 * Useful for debugging and monitoring
 *
 * @returns Array of active channel names
 */
export function getActiveChannelNames(): string[] {
  return Array.from(channelsMap.keys())
}
