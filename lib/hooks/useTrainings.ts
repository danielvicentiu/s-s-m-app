// ============================================================
// S-S-M.RO — useTrainings Hook
// File: lib/hooks/useTrainings.ts
// React hook pentru gestionarea instruirilor cu realtime updates
// Data: 13 Februarie 2026
// ============================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import {
  getTrainingDashboard,
  getTrainingStats,
  assignTraining,
  updateAssignmentStatus,
  recordTrainingSession,
  getTrainingModules,
  checkOverdueAssignments,
} from '@/lib/training-queries'
import type {
  TrainingDashboardRow,
  TrainingStats,
  TrainingModule,
  AssignTrainingPayload,
  RecordSessionPayload,
} from '@/lib/training-types'

// ============================================================
// INTERFACE
// ============================================================

interface UseTrainingsOptions {
  organizationId: string | null
  filters?: {
    status?: string
    category?: string
    workerId?: string
  }
  autoRefresh?: boolean
}

interface UseTrainingsReturn {
  trainings: TrainingDashboardRow[]
  stats: TrainingStats | null
  modules: TrainingModule[]
  loading: boolean
  error: Error | null
  scheduleTraining: (payload: AssignTrainingPayload) => Promise<void>
  cancelTraining: (assignmentId: string, notes?: string) => Promise<void>
  recordSession: (payload: RecordSessionPayload) => Promise<void>
  getExpiring: (days?: number) => TrainingDashboardRow[]
  refetch: () => Promise<void>
}

// ============================================================
// HOOK
// ============================================================

export function useTrainings({
  organizationId,
  filters,
  autoRefresh = true,
}: UseTrainingsOptions): UseTrainingsReturn {
  const [trainings, setTrainings] = useState<TrainingDashboardRow[]>([])
  const [stats, setStats] = useState<TrainingStats | null>(null)
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ── FETCH DATA ──
  const fetchData = useCallback(async () => {
    if (!organizationId) {
      setTrainings([])
      setStats(null)
      setModules([])
      setLoading(false)
      return
    }

    try {
      setError(null)
      setLoading(true)

      // Fetch în paralel pentru performanță
      const [dashboardData, statsData, modulesData] = await Promise.all([
        getTrainingDashboard(organizationId, filters),
        getTrainingStats(organizationId),
        getTrainingModules(),
      ])

      setTrainings(dashboardData)
      setStats(statsData)
      setModules(modulesData)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch trainings')
      setError(error)
      console.error('[useTrainings] Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [organizationId, filters])

  // ── INITIAL FETCH ──
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── REALTIME SUBSCRIPTION ──
  useEffect(() => {
    if (!organizationId || !autoRefresh) return

    const supabase = createSupabaseBrowser()

    // Subscribe la schimbări în training_assignments
    const channel = supabase
      .channel(`trainings-${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'training_assignments',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => {
          // Re-fetch pe orice schimbare
          fetchData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'training_sessions',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => {
          // Re-fetch când se adaugă sesiuni noi
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [organizationId, autoRefresh, fetchData])

  // ── SCHEDULE TRAINING ──
  const scheduleTraining = useCallback(
    async (payload: AssignTrainingPayload) => {
      try {
        await assignTraining(payload)
        await fetchData() // Refresh după adăugare
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to schedule training')
        console.error('[useTrainings] Schedule error:', error)
        throw error
      }
    },
    [fetchData]
  )

  // ── CANCEL TRAINING ──
  const cancelTraining = useCallback(
    async (assignmentId: string, notes?: string) => {
      try {
        await updateAssignmentStatus(assignmentId, 'exempted', notes)
        await fetchData() // Refresh după anulare
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to cancel training')
        console.error('[useTrainings] Cancel error:', error)
        throw error
      }
    },
    [fetchData]
  )

  // ── RECORD SESSION ──
  const recordSession = useCallback(
    async (payload: RecordSessionPayload) => {
      try {
        await recordTrainingSession(payload)
        await fetchData() // Refresh după înregistrare
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to record session')
        console.error('[useTrainings] Record session error:', error)
        throw error
      }
    },
    [fetchData]
  )

  // ── GET EXPIRING ──
  const getExpiring = useCallback(
    (days: number = 30): TrainingDashboardRow[] => {
      const today = new Date()
      const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

      return trainings.filter((training) => {
        if (!training.due_date) return false
        if (training.status === 'completed') return false

        const dueDate = new Date(training.due_date)
        return dueDate >= today && dueDate <= futureDate
      })
    },
    [trainings]
  )

  // ── MANUAL REFETCH ──
  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  return {
    trainings,
    stats,
    modules,
    loading,
    error,
    scheduleTraining,
    cancelTraining,
    recordSession,
    getExpiring,
    refetch,
  }
}

// ============================================================
// HELPER HOOKS
// ============================================================

/**
 * Hook simplificat pentru a verifica trainings care expiră
 * Folosit pentru notificări și alerte
 */
export function useExpiringTrainings(organizationId: string | null, days: number = 30) {
  const { trainings, loading, getExpiring } = useTrainings({
    organizationId,
    filters: { status: 'assigned' },
  })

  return {
    expiring: getExpiring(days),
    loading,
  }
}

/**
 * Hook pentru statistici training
 * Folosit în dashboard-uri și rapoarte
 */
export function useTrainingStats(organizationId: string | null) {
  const [stats, setStats] = useState<TrainingStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!organizationId) {
      setStats(null)
      setLoading(false)
      return
    }

    let mounted = true

    async function fetch() {
      try {
        const data = await getTrainingStats(organizationId)
        if (mounted) setStats(data)
      } catch (err) {
        console.error('[useTrainingStats] Error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetch()
    return () => {
      mounted = false
    }
  }, [organizationId])

  return { stats, loading }
}

/**
 * Hook pentru verificare automată assignments depășite
 * Rulează periodic în background
 */
export function useOverdueCheck(enabled: boolean = false) {
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  useEffect(() => {
    if (!enabled) return

    async function check() {
      try {
        await checkOverdueAssignments()
        setLastCheck(new Date())
      } catch (err) {
        console.error('[useOverdueCheck] Error:', err)
      }
    }

    // Check imediat
    check()

    // Check la fiecare 5 minute
    const interval = setInterval(check, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [enabled])

  return { lastCheck }
}
