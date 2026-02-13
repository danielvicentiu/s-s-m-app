'use client'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface UseRealtimeSubscriptionOptions<T> {
  table: string
  filter?: string
  event?: RealtimeEvent | RealtimeEvent[]
  enabled?: boolean
  onInsert?: (payload: RealtimePostgresChangesPayload<T>) => void
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void
  onDelete?: (payload: RealtimePostgresChangesPayload<T>) => void
}

interface UseRealtimeSubscriptionReturn<T> {
  data: T[]
  isConnected: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useRealtimeSubscription<T = any>(
  options: UseRealtimeSubscriptionOptions<T>
): UseRealtimeSubscriptionReturn<T> {
  const {
    table,
    filter,
    event = '*',
    enabled = true,
    onInsert,
    onUpdate,
    onDelete,
  } = options

  const [data, setData] = useState<T[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  const supabase = createSupabaseBrowser()

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setError(null)
      let query = supabase.from(table).select('*')

      if (filter) {
        // Parse simple filter like "column=eq.value"
        const [column, operator] = filter.split('=')
        if (column && operator) {
          const [op, value] = operator.split('.')
          if (op === 'eq' && value) {
            query = query.eq(column, value)
          }
        }
      }

      const { data: fetchedData, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setData((fetchedData as T[]) || [])
    } catch (err) {
      console.error(`Error fetching data from ${table}:`, err)
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    }
  }, [table, filter, supabase])

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Fetch initial data
    fetchData()

    // Set up realtime subscription
    const channelName = `realtime:${table}:${filter || 'all'}:${Date.now()}`
    let realtimeChannel = supabase.channel(channelName)

    // Determine events to listen to
    const events = Array.isArray(event) ? event : [event]

    // Subscribe to each event type
    events.forEach((eventType) => {
      if (eventType === '*' || eventType === 'INSERT') {
        realtimeChannel = realtimeChannel.on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table,
            filter,
          },
          (payload: RealtimePostgresChangesPayload<T>) => {
            console.log(`Realtime INSERT on ${table}:`, payload)
            setData((prev) => [...prev, payload.new as T])
            onInsert?.(payload)
          }
        )
      }

      if (eventType === '*' || eventType === 'UPDATE') {
        realtimeChannel = realtimeChannel.on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table,
            filter,
          },
          (payload: RealtimePostgresChangesPayload<T>) => {
            console.log(`Realtime UPDATE on ${table}:`, payload)
            setData((prev) =>
              prev.map((item) =>
                (item as any).id === (payload.new as any).id
                  ? (payload.new as T)
                  : item
              )
            )
            onUpdate?.(payload)
          }
        )
      }

      if (eventType === '*' || eventType === 'DELETE') {
        realtimeChannel = realtimeChannel.on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table,
            filter,
          },
          (payload: RealtimePostgresChangesPayload<T>) => {
            console.log(`Realtime DELETE on ${table}:`, payload)
            setData((prev) =>
              prev.filter((item) => (item as any).id !== (payload.old as any).id)
            )
            onDelete?.(payload)
          }
        )
      }
    })

    // Subscribe and set connection status
    realtimeChannel
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status)
        setIsConnected(status === 'SUBSCRIBED')
        if (status === 'CHANNEL_ERROR') {
          setError(new Error('Realtime channel error'))
        }
      })

    setChannel(realtimeChannel)

    // Cleanup on unmount
    return () => {
      console.log(`Unsubscribing from realtime channel: ${channelName}`)
      realtimeChannel.unsubscribe()
      setIsConnected(false)
    }
  }, [table, filter, event, enabled, fetchData, onInsert, onUpdate, onDelete])

  return {
    data,
    isConnected,
    error,
    refetch: fetchData,
  }
}
