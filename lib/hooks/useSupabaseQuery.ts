'use client'

import { useState, useEffect, useCallback, DependencyList } from 'react'

interface UseSupabaseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Generic hook for Supabase queries with automatic fetching and state management
 *
 * @param queryFn - Async function that executes the Supabase query
 * @param deps - Dependency array that triggers refetch when values change
 * @returns Object containing data, loading state, error, and refetch function
 *
 * @example
 * const { data, loading, error, refetch } = useSupabaseQuery(
 *   async () => {
 *     const supabase = createSupabaseBrowser()
 *     const { data, error } = await supabase
 *       .from('employees')
 *       .select('*')
 *     if (error) throw error
 *     return data
 *   },
 *   []
 * )
 */
export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  deps: DependencyList = []
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await queryFn()
      setData(result)
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('A apărut o eroare la încărcarea datelor')
      setError(errorObj)
      console.error('useSupabaseQuery error:', err)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch
  }
}
