// lib/services/realtime-presence.ts
// Supabase Realtime Presence — Track online users per organization
// Shows green dot on avatars for online users in dashboard
// Broadcast channel per organization

import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js'

// Presence data structure
export interface PresenceUser {
  userId: string
  fullName: string
  avatarUrl: string | null
  joinedAt: string
}

// Callback for presence updates
export type PresenceCallback = (onlineUsers: PresenceUser[]) => void

// Active channels registry (singleton per org)
const activeChannels = new Map<string, RealtimeChannel>()

/**
 * Track user presence in organization
 * Call this when user enters dashboard
 * @param userId - Current user ID
 * @param orgId - Organization ID
 * @param userData - User display data (name, avatar)
 */
export async function trackPresence(
  userId: string,
  orgId: string,
  userData: { fullName: string; avatarUrl: string | null }
): Promise<RealtimeChannel> {
  const supabase = createSupabaseBrowser()
  const channelName = `presence:org:${orgId}`

  // Reuse existing channel if already subscribed
  if (activeChannels.has(channelName)) {
    const channel = activeChannels.get(channelName)!

    // Update presence data
    await channel.track({
      userId,
      fullName: userData.fullName,
      avatarUrl: userData.avatarUrl,
      joinedAt: new Date().toISOString()
    })

    return channel
  }

  // Create new channel
  const channel = supabase.channel(channelName, {
    config: {
      presence: {
        key: userId // Unique key per user
      }
    }
  })

  // Subscribe and track presence
  await channel
    .on('presence', { event: 'sync' }, () => {
      // Presence state updated
      const state = channel.presenceState()
      console.log('[Presence] Sync:', Object.keys(state).length, 'users online')
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('[Presence] User joined:', key, newPresences)
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('[Presence] User left:', key, leftPresences)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Track current user
        await channel.track({
          userId,
          fullName: userData.fullName,
          avatarUrl: userData.avatarUrl,
          joinedAt: new Date().toISOString()
        })
      }
    })

  // Store channel reference
  activeChannels.set(channelName, channel)

  return channel
}

/**
 * Get currently online users in organization
 * @param orgId - Organization ID
 * @returns Array of online users
 */
export function getOnlineUsers(orgId: string): PresenceUser[] {
  const channelName = `presence:org:${orgId}`
  const channel = activeChannels.get(channelName)

  if (!channel) {
    return []
  }

  const state: RealtimePresenceState<PresenceUser> = channel.presenceState()
  const users: PresenceUser[] = []

  // Flatten presence state (each user can have multiple presences)
  Object.values(state).forEach((presences) => {
    if (presences.length > 0) {
      // Take first presence (most recent)
      users.push(presences[0] as PresenceUser)
    }
  })

  return users
}

/**
 * Subscribe to presence updates
 * @param orgId - Organization ID
 * @param callback - Called when presence changes
 * @returns Unsubscribe function
 */
export function subscribeToPresence(
  orgId: string,
  callback: PresenceCallback
): () => void {
  const channelName = `presence:org:${orgId}`
  const channel = activeChannels.get(channelName)

  if (!channel) {
    console.warn('[Presence] No active channel for org:', orgId)
    return () => {}
  }

  // Create listener for all presence events
  const handlePresenceChange = () => {
    const users = getOnlineUsers(orgId)
    callback(users)
  }

  // Subscribe to all presence events
  channel
    .on('presence', { event: 'sync' }, handlePresenceChange)
    .on('presence', { event: 'join' }, handlePresenceChange)
    .on('presence', { event: 'leave' }, handlePresenceChange)

  // Return unsubscribe function
  return () => {
    channel.unsubscribe()
    activeChannels.delete(channelName)
  }
}

/**
 * Untrack user presence (call on logout/page leave)
 * @param orgId - Organization ID
 */
export async function untrackPresence(orgId: string): Promise<void> {
  const channelName = `presence:org:${orgId}`
  const channel = activeChannels.get(channelName)

  if (channel) {
    await channel.untrack()
    await channel.unsubscribe()
    activeChannels.delete(channelName)
    console.log('[Presence] Untracked and unsubscribed from:', channelName)
  }
}

/**
 * Check if user is online in organization
 * @param userId - User ID to check
 * @param orgId - Organization ID
 * @returns true if user is online
 */
export function isUserOnline(userId: string, orgId: string): boolean {
  const onlineUsers = getOnlineUsers(orgId)
  return onlineUsers.some((user) => user.userId === userId)
}

/**
 * Get online user count for organization
 * @param orgId - Organization ID
 * @returns Number of online users
 */
export function getOnlineUserCount(orgId: string): number {
  return getOnlineUsers(orgId).length
}
