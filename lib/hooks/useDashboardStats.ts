// lib/hooks/useDashboardStats.ts
// Hook pentru statistici dashboard SSM/PSI
// Fetch optimizat cu queries paralele
// Data: 13 Februarie 2026

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

export interface DashboardStats {
  totalEmployees: number
  activeTrainings: number
  expiredTrainings: number
  pendingMedical: number
  equipmentDue: number
  activeAlerts: number
  complianceScore: number
}

interface UseDashboardStatsReturn {
  stats: DashboardStats
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const INITIAL_STATS: DashboardStats = {
  totalEmployees: 0,
  activeTrainings: 0,
  expiredTrainings: 0,
  pendingMedical: 0,
  equipmentDue: 0,
  activeAlerts: 0,
  complianceScore: 0
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createSupabaseBrowser()

      // 1. Get user's organization
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Utilizator neautentificat')
      }

      const { data: membership } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!membership?.organization_id) {
        throw new Error('Organizație negăsită')
      }

      const orgId = membership.organization_id
      const today = new Date().toISOString().split('T')[0]
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      // 2. Fetch all stats in parallel
      const [
        employeesResult,
        trainingsResult,
        expiredTrainingsResult,
        medicalResult,
        equipmentResult,
        alertsResult
      ] = await Promise.all([
        // Total employees (using medical_examinations as proxy)
        supabase
          .from('medical_examinations')
          .select('employee_name', { count: 'exact', head: false })
          .eq('organization_id', orgId),

        // Active trainings (future or recent)
        supabase
          .from('trainings')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .gte('completion_date', today),

        // Expired trainings (past completion date)
        supabase
          .from('trainings')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .lt('completion_date', today),

        // Pending medical (expired or expiring in 30 days)
        supabase
          .from('medical_examinations')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .lte('expiry_date', thirtyDaysFromNow),

        // Equipment due (expired or expiring in 30 days)
        supabase
          .from('safety_equipment')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .lte('expiry_date', thirtyDaysFromNow),

        // Active alerts (fraud alerts pending)
        supabase
          .from('fraud_alerts')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .eq('resolution_status', 'pending')
      ])

      // 3. Extract unique employee count
      const uniqueEmployees = new Set(
        employeesResult.data?.map((e: any) => e.employee_name) || []
      ).size

      // 4. Calculate compliance score (0-100)
      const totalEmployees = uniqueEmployees || 1 // Avoid division by zero
      const medicalCompliant = totalEmployees - (medicalResult.count || 0)
      const equipmentCompliant = 10 - Math.min(equipmentResult.count || 0, 10)
      const trainingCompliant = Math.max(0, 5 - (expiredTrainingsResult.count || 0))

      const complianceScore = Math.round(
        ((medicalCompliant / totalEmployees) * 40 +
          (equipmentCompliant / 10) * 30 +
          (trainingCompliant / 5) * 30)
      )

      // 5. Set stats
      setStats({
        totalEmployees: uniqueEmployees,
        activeTrainings: trainingsResult.count || 0,
        expiredTrainings: expiredTrainingsResult.count || 0,
        pendingMedical: medicalResult.count || 0,
        equipmentDue: equipmentResult.count || 0,
        activeAlerts: alertsResult.count || 0,
        complianceScore: Math.min(100, Math.max(0, complianceScore))
      })
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err : new Error('Eroare necunoscută'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}
