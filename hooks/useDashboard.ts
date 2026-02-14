// hooks/useDashboard.ts
// React hook pentru dashboard stats cu auto-refresh și stale-while-revalidate
// Fetch /api/dashboard/stats cu revalidare la fiecare 5 minute

'use client'

import { useState, useEffect, useCallback } from 'react'

export interface DashboardStats {
  medical: {
    total: number
    expired: number
    expiring: number
    valid: number
  }
  equipment: {
    total: number
    expired: number
    expiring: number
    valid: number
  }
  employees: {
    total: number
    active: number
  }
  alerts: {
    total: number
    unread: number
  }
  riskScore: {
    value: number
    level: 'Scăzut' | 'MEDIU' | 'RIDICAT' | 'CRITIC'
  }
  completeness: number
  organizationId?: string
}

interface UseDashboardReturn {
  stats: DashboardStats | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minute
const CACHE_KEY = 'dashboard_stats_cache'

/**
 * Hook pentru fetch dashboard stats cu auto-refresh și stale-while-revalidate pattern
 *
 * @param orgId - ID organizație (optional, default = toate organizațiile userului)
 * @returns {UseDashboardReturn} stats, isLoading, error, refetch
 *
 * @example
 * const { stats, isLoading, error, refetch } = useDashboard()
 * const { stats: orgStats } = useDashboard('org-id-123')
 */
export default function useDashboard(orgId?: string): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Încarcă din cache la mount (stale-while-revalidate)
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const cacheKey = orgId ? `${CACHE_KEY}_${orgId}` : CACHE_KEY
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        // Verifică dacă cache-ul nu e mai vechi de 10 minute
        if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
          setStats(parsed.data)
        }
      }
    } catch (err) {
      console.error('[useDashboard] Error loading cache:', err)
    }
  }, [orgId])

  // Fetch stats from API
  const fetchStats = useCallback(async () => {
    try {
      setError(null)

      const url = orgId
        ? `/api/dashboard/stats?orgId=${encodeURIComponent(orgId)}`
        : '/api/dashboard/stats'

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Validare date
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format')
      }

      setStats(data)

      // Salvează în cache (stale-while-revalidate)
      if (typeof window !== 'undefined') {
        try {
          const cacheKey = orgId ? `${CACHE_KEY}_${orgId}` : CACHE_KEY
          localStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
          }))
        } catch (err) {
          console.error('[useDashboard] Error saving cache:', err)
        }
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error occurred')
      setError(errorObj)
      console.error('[useDashboard] Fetch error:', errorObj)
    } finally {
      setIsLoading(false)
    }
  }, [orgId])

  // Initial fetch
  useEffect(() => {
    let mounted = true

    if (mounted) {
      setIsLoading(true)
      fetchStats()
    }

    return () => {
      mounted = false
    }
  }, [fetchStats])

  // Auto-refresh la fiecare 5 minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats()
    }, REFRESH_INTERVAL)

    return () => {
      clearInterval(interval)
    }
  }, [fetchStats])

  // Refetch manual (pentru refresh button)
  const refetch = useCallback(async () => {
    setIsLoading(true)
    await fetchStats()
  }, [fetchStats])

  return {
    stats,
    isLoading,
    error,
    refetch,
  }
}
