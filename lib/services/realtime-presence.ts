// lib/services/realtime-presence.ts
// Supabase Realtime Presence — track online users in organization
// Used by OnlineUsers sidebar widget

import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

export interface OnlineUser {
  userId: string
  fullName: string
  avatarUrl: string | null
  presenceRef: string
}

export interface PresenceState {
  [key: string]: OnlineUser[]
}

export class RealtimePresenceService {
  private channel: RealtimeChannel | null = null
  private supabase: SupabaseClient
  private organizationId: string
  private currentUserId: string

  constructor(supabase: SupabaseClient, organizationId: string, currentUserId: string) {
    this.supabase = supabase
    this.organizationId = organizationId
    this.currentUserId = currentUserId
  }

  // Subscribe to presence channel for organization
  subscribe(
    userId: string,
    fullName: string,
    avatarUrl: string | null,
    onPresenceChange: (users: OnlineUser[]) => void
  ) {
    // Create channel name per organization
    const channelName = `presence:org:${this.organizationId}`

    this.channel = this.supabase.channel(channelName, {
      config: {
        presence: {
          key: userId, // Unique key per user
        },
      },
    })

    // Track current user presence
    this.channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = this.channel!.presenceState<OnlineUser>()
        const users = this.extractUsersFromPresenceState(presenceState)
        onPresenceChange(users)
      })
      .on('presence', { event: 'join' }, () => {
        const presenceState = this.channel!.presenceState<OnlineUser>()
        const users = this.extractUsersFromPresenceState(presenceState)
        onPresenceChange(users)
      })
      .on('presence', { event: 'leave' }, () => {
        const presenceState = this.channel!.presenceState<OnlineUser>()
        const users = this.extractUsersFromPresenceState(presenceState)
        onPresenceChange(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user
          await this.channel!.track({
            userId,
            fullName,
            avatarUrl,
            presenceRef: userId,
            onlineAt: new Date().toISOString(),
          })
        }
      })

    return this.channel
  }

  // Extract unique users from presence state
  private extractUsersFromPresenceState(presenceState: PresenceState): OnlineUser[] {
    const usersMap = new Map<string, OnlineUser>()

    Object.values(presenceState).forEach((presences) => {
      presences.forEach((presence) => {
        if (!usersMap.has(presence.userId)) {
          usersMap.set(presence.userId, {
            userId: presence.userId,
            fullName: presence.fullName,
            avatarUrl: presence.avatarUrl,
            presenceRef: presence.presenceRef,
          })
        }
      })
    })

    return Array.from(usersMap.values())
  }

  // Unsubscribe from channel
  unsubscribe() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
  }

  // Update current user's presence data
  async updatePresence(fullName: string, avatarUrl: string | null) {
    if (this.channel) {
      await this.channel.track({
        userId: this.currentUserId,
        fullName,
        avatarUrl,
        presenceRef: this.currentUserId,
        onlineAt: new Date().toISOString(),
      })
    }
  }
}
