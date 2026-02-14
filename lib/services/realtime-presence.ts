// lib/services/realtime-presence.ts
// Supabase Realtime Presence — Tracking online users per organization
// Shows who is online in dashboard with green avatar dots
// Broadcast channel per org for real-time presence updates

import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js'

// ── TYPES ──

export interface PresenceUser {
  userId: string
  fullName: string
  avatarUrl: string | null
  role: 'consultant' | 'firma_admin' | 'angajat'
  joinedAt: string
  lastSeenAt: string
}

export interface PresenceState {
  [key: string]: PresenceUser[]
}

export interface PresenceCallback {
  (onlineUsers: PresenceUser[]): void
}

// ── SINGLETON CHANNELS MAP ──
// Prevents duplicate subscriptions per org
const channelsMap = new Map<string, RealtimeChannel>()

// ── PUBLIC API ──

/**
 * Track user presence in an organization
 * Automatically sends heartbeat and handles cleanup on unmount
 *
 * @param userId - User UUID
 * @param orgId - Organization UUID
 * @param userData - User profile data (name, avatar, role)
 * @returns Cleanup function to call on unmount
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = trackPresence(user.id, orgId, {
 *     fullName: profile.full_name,
 *     avatarUrl: profile.avatar_url,
 *     role: membership.role
 *   })
 *   return cleanup
 * }, [user.id, orgId])
 * ```
 */
export function trackPresence(
  userId: string,
  orgId: string,
  userData: {
    fullName: string
    avatarUrl: string | null
    role: 'consultant' | 'firma_admin' | 'angajat'
  }
): () => void {
  const supabase = createSupabaseBrowser()
  const channelName = `presence:org:${orgId}`

  try {
    // Get or create channel
    let channel = channelsMap.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName, {
        config: {
          presence: {
            key: userId,
          },
        },
      })
      channelsMap.set(channelName, channel)
    }

    // Track presence
    const presenceData: PresenceUser = {
      userId,
      fullName: userData.fullName,
      avatarUrl: userData.avatarUrl,
      role: userData.role,
      joinedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    }

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Send initial presence
        await channel.track(presenceData)

        // Update lastSeenAt every 30 seconds (heartbeat)
        const heartbeatInterval = setInterval(async () => {
          try {
            await channel.track({
              ...presenceData,
              lastSeenAt: new Date().toISOString(),
            })
          } catch (error) {
            console.error('[Presence] Heartbeat failed:', error)
          }
        }, 30000)

        // Store interval for cleanup
        ;(channel as any)._heartbeatInterval = heartbeatInterval
      }
    })

    // Cleanup function
    return () => {
      try {
        // Clear heartbeat
        if ((channel as any)._heartbeatInterval) {
          clearInterval((channel as any)._heartbeatInterval)
        }

        // Untrack presence
        channel.untrack()

        // Remove channel if no more subscriptions
        setTimeout(() => {
          if (channel.listeners?.['presence']?.length === 0) {
            supabase.removeChannel(channel)
            channelsMap.delete(channelName)
          }
        }, 1000)
      } catch (error) {
        console.error('[Presence] Cleanup failed:', error)
      }
    }
  } catch (error) {
    console.error('[Presence] Failed to track presence:', error)
    return () => {} // No-op cleanup
  }
}

/**
 * Get currently online users for an organization
 * Returns a snapshot of presence state
 *
 * @param orgId - Organization UUID
 * @returns Promise with array of online users
 *
 * @example
 * ```tsx
 * const onlineUsers = await getOnlineUsers(orgId)
 * console.log(`${onlineUsers.length} users online`)
 * ```
 */
export async function getOnlineUsers(orgId: string): Promise<PresenceUser[]> {
  const supabase = createSupabaseBrowser()
  const channelName = `presence:org:${orgId}`

  try {
    // Get or create channel
    let channel = channelsMap.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName)
      channelsMap.set(channelName)

      // Subscribe to get presence state
      await new Promise<void>((resolve) => {
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            resolve()
          }
        })
      })
    }

    // Get presence state
    const presenceState: RealtimePresenceState<PresenceUser> = channel.presenceState()

    // Flatten presence state (each user can have multiple entries)
    const onlineUsers: PresenceUser[] = []
    for (const userId in presenceState) {
      const presences = presenceState[userId]
      if (presences && presences.length > 0) {
        // Take the most recent presence entry
        const latest = presences.reduce((prev, current) => {
          return new Date(current.lastSeenAt) > new Date(prev.lastSeenAt) ? current : prev
        })
        onlineUsers.push(latest)
      }
    }

    return onlineUsers
  } catch (error) {
    console.error('[Presence] Failed to get online users:', error)
    return []
  }
}

/**
 * Subscribe to presence changes for an organization
 * Callback is called whenever someone joins, leaves, or updates presence
 *
 * @param orgId - Organization UUID
 * @param callback - Function called with updated online users list
 * @returns Cleanup function to call on unmount
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = subscribeToPresence(orgId, (users) => {
 *     setOnlineUsers(users)
 *   })
 *   return cleanup
 * }, [orgId])
 * ```
 */
export function subscribeToPresence(
  orgId: string,
  callback: PresenceCallback
): () => void {
  const supabase = createSupabaseBrowser()
  const channelName = `presence:org:${orgId}`

  try {
    // Get or create channel
    let channel = channelsMap.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName)
      channelsMap.set(channelName)
    }

    // Helper to extract online users from presence state
    const extractOnlineUsers = (state: RealtimePresenceState<PresenceUser>): PresenceUser[] => {
      const users: PresenceUser[] = []
      for (const userId in state) {
        const presences = state[userId]
        if (presences && presences.length > 0) {
          const latest = presences.reduce((prev, current) => {
            return new Date(current.lastSeenAt) > new Date(prev.lastSeenAt) ? current : prev
          })
          users.push(latest)
        }
      }
      return users
    }

    // Subscribe to presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceUser>()
        callback(extractOnlineUsers(state))
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const state = channel.presenceState<PresenceUser>()
        callback(extractOnlineUsers(state))
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const state = channel.presenceState<PresenceUser>()
        callback(extractOnlineUsers(state))
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Send initial state
          const state = channel.presenceState<PresenceUser>()
          callback(extractOnlineUsers(state))
        }
      })

    // Cleanup function
    return () => {
      try {
        supabase.removeChannel(channel)
        channelsMap.delete(channelName)
      } catch (error) {
        console.error('[Presence] Failed to unsubscribe:', error)
      }
    }
  } catch (error) {
    console.error('[Presence] Failed to subscribe to presence:', error)
    return () => {} // No-op cleanup
  }
}

/**
 * Broadcast a custom event to all users in the organization
 * Useful for real-time notifications, updates, etc.
 *
 * @param orgId - Organization UUID
 * @param eventName - Custom event name
 * @param payload - Event data
 *
 * @example
 * ```tsx
 * await broadcastToOrganization(orgId, 'document_uploaded', {
 *   documentId: '123',
 *   fileName: 'raport.pdf'
 * })
 * ```
 */
export async function broadcastToOrganization(
  orgId: string,
  eventName: string,
  payload: Record<string, any>
): Promise<void> {
  const supabase = createSupabaseBrowser()
  const channelName = `presence:org:${orgId}`

  try {
    let channel = channelsMap.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName)
      channelsMap.set(channelName)

      // Subscribe first
      await new Promise<void>((resolve) => {
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            resolve()
          }
        })
      })
    }

    await channel.send({
      type: 'broadcast',
      event: eventName,
      payload,
    })
  } catch (error) {
    console.error('[Presence] Failed to broadcast event:', error)
    throw error
  }
}

/**
 * Subscribe to custom broadcast events in the organization
 *
 * @param orgId - Organization UUID
 * @param eventName - Custom event name to listen for
 * @param callback - Function called when event is received
 * @returns Cleanup function
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = subscribeToBroadcast(orgId, 'document_uploaded', (payload) => {
 *     toast.success(`Document uploaded: ${payload.fileName}`)
 *   })
 *   return cleanup
 * }, [orgId])
 * ```
 */
export function subscribeToBroadcast(
  orgId: string,
  eventName: string,
  callback: (payload: Record<string, any>) => void
): () => void {
  const supabase = createSupabaseBrowser()
  const channelName = `presence:org:${orgId}`

  try {
    let channel = channelsMap.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName)
      channelsMap.set(channelName)
    }

    channel
      .on('broadcast', { event: eventName }, ({ payload }) => {
        callback(payload)
      })
      .subscribe()

    return () => {
      try {
        supabase.removeChannel(channel)
        channelsMap.delete(channelName)
      } catch (error) {
        console.error('[Presence] Failed to unsubscribe from broadcast:', error)
      }
    }
  } catch (error) {
    console.error('[Presence] Failed to subscribe to broadcast:', error)
    return () => {}
  }
}

/**
 * Check if a specific user is currently online
 *
 * @param userId - User UUID to check
 * @param orgId - Organization UUID
 * @returns Promise with boolean indicating online status
 */
export async function isUserOnline(userId: string, orgId: string): Promise<boolean> {
  try {
    const onlineUsers = await getOnlineUsers(orgId)
    return onlineUsers.some(user => user.userId === userId)
  } catch (error) {
    console.error('[Presence] Failed to check user online status:', error)
    return false
  }
}

/**
 * Get the number of online users for an organization
 *
 * @param orgId - Organization UUID
 * @returns Promise with count of online users
 */
export async function getOnlineUserCount(orgId: string): Promise<number> {
  try {
    const onlineUsers = await getOnlineUsers(orgId)
    return onlineUsers.length
  } catch (error) {
    console.error('[Presence] Failed to get online user count:', error)
    return 0
  }
}
