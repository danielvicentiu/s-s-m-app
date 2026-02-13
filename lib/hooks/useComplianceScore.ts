// lib/hooks/useComplianceScore.ts
// React Hook pentru gestionarea scorului de conformitate SSM/PSI
// Oferă score, breakdown, history, recommendations și funcție de refetch

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  complianceService,
  type ComplianceScore,
  type ComplianceBreakdown,
  type ComplianceHistoryEntry,
  type ComplianceRecommendation,
} from '@/lib/services/ComplianceService'

export interface UseComplianceScoreResult {
  // Scor curent
  score: number
  breakdown: ComplianceBreakdown
  recommendations: ComplianceRecommendation[]

  // Istoric 12 luni
  history: ComplianceHistoryEntry[]

  // State management
  loading: boolean
  error: string | null

  // Actions
  refetch: () => Promise<void>
}

/**
 * Hook pentru gestionarea scorului de conformitate
 * @param organizationId ID-ul organizației pentru care se calculează scorul
 * @param autoFetch Dacă se încarcă automat datele la mount (default: true)
 * @returns UseComplianceScoreResult
 *
 * @example
 * ```tsx
 * function ComplianceDashboard({ orgId }: { orgId: string }) {
 *   const { score, breakdown, history, loading, recommendations, refetch } = useComplianceScore(orgId)
 *
 *   if (loading) return <Spinner />
 *
 *   return (
 *     <div>
 *       <h1>Scor conformitate: {score}%</h1>
 *       <div>SSM: {breakdown.ssm}% | PSI: {breakdown.psi}%</div>
 *       <button onClick={refetch}>Actualizează</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useComplianceScore(
  organizationId: string | null | undefined,
  autoFetch: boolean = true
): UseComplianceScoreResult {
  const [score, setScore] = useState<number>(0)
  const [breakdown, setBreakdown] = useState<ComplianceBreakdown>({
    ssm: 0,
    psi: 0,
    medical: 0,
    equipment: 0,
  })
  const [recommendations, setRecommendations] = useState<ComplianceRecommendation[]>([])
  const [history, setHistory] = useState<ComplianceHistoryEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Funcție pentru încărcarea datelor de conformitate
   */
  const fetchComplianceData = useCallback(async () => {
    if (!organizationId) {
      setLoading(false)
      setError('ID organizație lipsă')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Încarcă scorul curent și istoricul în paralel
      const [complianceScore, complianceHistory] = await Promise.all([
        complianceService.calculateComplianceScore(organizationId),
        complianceService.getComplianceHistory(organizationId),
      ])

      // Actualizează state-ul
      setScore(complianceScore.overall)
      setBreakdown(complianceScore.breakdown)
      setRecommendations(complianceScore.recommendations)
      setHistory(complianceHistory)
    } catch (err) {
      console.error('[useComplianceScore] Error fetching compliance data:', err)
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor de conformitate')

      // Reset la valori default în caz de eroare
      setScore(0)
      setBreakdown({
        ssm: 0,
        psi: 0,
        medical: 0,
        equipment: 0,
      })
      setRecommendations([])
      setHistory([])
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  /**
   * Funcție publică pentru re-fetch manual
   */
  const refetch = useCallback(async () => {
    await fetchComplianceData()
  }, [fetchComplianceData])

  /**
   * Effect pentru încărcarea inițială a datelor
   */
  useEffect(() => {
    if (autoFetch && organizationId) {
      fetchComplianceData()
    } else {
      setLoading(false)
    }
  }, [organizationId, autoFetch, fetchComplianceData])

  return {
    score,
    breakdown,
    recommendations,
    history,
    loading,
    error,
    refetch,
  }
}

/**
 * Tip export pentru utilizare în alte componente
 */
export type {
  ComplianceScore,
  ComplianceBreakdown,
  ComplianceHistoryEntry,
  ComplianceRecommendation,
} from '@/lib/services/ComplianceService'
