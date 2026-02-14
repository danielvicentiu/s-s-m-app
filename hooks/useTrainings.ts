// hooks/useTrainings.ts
// React Hook pentru Training Assignments API
// Pattern: createSupabaseBrowser() + fetch /api/v1/trainings
// Optimistic updates pentru create și update
// Data: 14 Februarie 2026

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import type {
  TrainingAssignment,
  AssignmentStatus,
  TrainingCategory,
  TrainingType
} from '@/lib/training-types'

// ── TYPES ──

export interface TrainingWithDetails extends TrainingAssignment {
  workers?: {
    id: string
    full_name: string
    email?: string
    job_title?: string
    is_active?: boolean
  }
  modules?: {
    id: string
    code: string
    title: string
    category: TrainingCategory
    training_type: TrainingType
    duration_minutes_required: number
    is_mandatory: boolean
  }
  sessions?: {
    id: string
    session_date: string
    instructor_name: string
    test_score: number | null
    verification_result: string
  }
}

export interface TrainingFilters {
  type?: TrainingType
  category?: TrainingCategory
  status?: AssignmentStatus
  worker_id?: string
  module_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

export interface CreateTrainingInput {
  organization_id: string
  module_id: string
  worker_ids: string[]
  assigned_by: string
  due_date?: string
  notes?: string
}

export interface UpdateTrainingInput {
  status?: AssignmentStatus
  due_date?: string
  notes?: string
  completed_at?: string
  next_due_date?: string
}

export interface UseTrainingsResult {
  trainings: TrainingWithDetails[]
  isLoading: boolean
  error: Error | null
  createTraining: (input: CreateTrainingInput) => Promise<void>
  updateTraining: (id: string, input: UpdateTrainingInput) => Promise<void>
  deleteTraining: (id: string) => Promise<void>
  refetch: () => Promise<void>
  // Pagination
  page: number
  limit: number
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

// ── MAIN HOOK ──

export default function useTrainings(
  organizationId: string | null,
  filters?: TrainingFilters,
  options?: {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
): UseTrainingsResult {
  const [trainings, setTrainings] = useState<TrainingWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Pagination state
  const [page, setPage] = useState(options?.page || 1)
  const [limit, setLimit] = useState(options?.limit || 20)
  const [total, setTotal] = useState(0)

  // Build query params
  const queryParams = useMemo(() => {
    const params = new URLSearchParams()

    if (!organizationId) return params

    params.set('organization_id', organizationId)
    params.set('page', page.toString())
    params.set('limit', limit.toString())

    if (options?.sortBy) {
      params.set('sort_by', options.sortBy)
    }
    if (options?.sortOrder) {
      params.set('sort_order', options.sortOrder)
    }

    // Apply filters
    if (filters?.type) {
      params.set('training_type', filters.type)
    }
    if (filters?.category) {
      params.set('category', filters.category)
    }
    if (filters?.status) {
      params.set('status', filters.status)
    }
    if (filters?.worker_id) {
      params.set('worker_id', filters.worker_id)
    }
    if (filters?.module_id) {
      params.set('module_id', filters.module_id)
    }
    if (filters?.date_from) {
      params.set('date_from', filters.date_from)
    }
    if (filters?.date_to) {
      params.set('date_to', filters.date_to)
    }
    if (filters?.search) {
      params.set('search', filters.search)
    }

    return params
  }, [organizationId, page, limit, options?.sortBy, options?.sortOrder, filters])

  // Fetch trainings
  const fetchTrainings = useCallback(async () => {
    if (!organizationId) {
      setTrainings([])
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      const supabase = createSupabaseBrowser()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Sesiune expirată. Te rugăm să te autentifici din nou.')
      }

      const response = await fetch(`/api/v1/trainings?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Eroare la încărcarea instruirilor: ${response.status}`
        )
      }

      const result = await response.json()

      setTrainings(result.data || [])
      setTotal(result.pagination?.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Eroare la încărcarea instruirilor'))
      console.error('[useTrainings] Fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [organizationId, queryParams])

  // Initial fetch
  useEffect(() => {
    fetchTrainings()
  }, [fetchTrainings])

  // Realtime subscription
  useEffect(() => {
    if (!organizationId) return

    const supabase = createSupabaseBrowser()

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
          // Re-fetch on any change
          fetchTrainings()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [organizationId, fetchTrainings])

  // Create training with optimistic update
  const createTraining = useCallback(async (input: CreateTrainingInput) => {
    try {
      setError(null)

      const supabase = createSupabaseBrowser()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Sesiune expirată. Te rugăm să te autentifici din nou.')
      }

      const response = await fetch('/api/v1/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Eroare la crearea instruirii: ${response.status}`
        )
      }

      const result = await response.json()

      // Optimistic update: add new trainings to the list
      if (result.data && Array.isArray(result.data)) {
        setTrainings(prev => [...result.data, ...prev])
        setTotal(prev => prev + result.data.length)
      }

      // Re-fetch to ensure consistency
      await fetchTrainings()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Eroare la crearea instruirii'))
      throw err
    }
  }, [fetchTrainings])

  // Update training with optimistic update
  const updateTraining = useCallback(async (id: string, input: UpdateTrainingInput) => {
    try {
      setError(null)

      // Optimistic update
      setTrainings(prev =>
        prev.map(training =>
          training.id === id
            ? { ...training, ...input, updated_at: new Date().toISOString() }
            : training
        )
      )

      const supabase = createSupabaseBrowser()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Sesiune expirată. Te rugăm să te autentifici din nou.')
      }

      const response = await fetch(`/api/v1/trainings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        // Rollback optimistic update
        await fetchTrainings()
        throw new Error(
          errorData?.message || `Eroare la actualizarea instruirii: ${response.status}`
        )
      }

      // Re-fetch to ensure consistency
      await fetchTrainings()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Eroare la actualizarea instruirii'))
      throw err
    }
  }, [fetchTrainings])

  // Delete training
  const deleteTraining = useCallback(async (id: string) => {
    try {
      setError(null)

      // Optimistic update
      setTrainings(prev => prev.filter(training => training.id !== id))
      setTotal(prev => Math.max(0, prev - 1))

      const supabase = createSupabaseBrowser()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Sesiune expirată. Te rugăm să te autentifici din nou.')
      }

      const response = await fetch(`/api/v1/trainings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        // Rollback optimistic update
        await fetchTrainings()
        throw new Error(
          errorData?.message || `Eroare la ștergerea instruirii: ${response.status}`
        )
      }

      // Re-fetch to ensure consistency
      await fetchTrainings()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Eroare la ștergerea instruirii'))
      throw err
    }
  }, [fetchTrainings])

  // Pagination helpers
  const hasNextPage = page * limit < total
  const hasPreviousPage = page > 1

  return {
    trainings,
    isLoading,
    error,
    createTraining,
    updateTraining,
    deleteTraining,
    refetch: fetchTrainings,
    page,
    limit,
    total,
    hasNextPage,
    hasPreviousPage,
    setPage,
    setLimit,
  }
}
