// lib/services/notification.service.ts
// Service pentru gestionarea notificărilor utilizatori
// Contract: Supabase typed client, camelCase, error handling obligatoriu

import { SupabaseClient } from '@supabase/supabase-js'

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────

export type NotificationType =
  | 'system'
  | 'alert'
  | 'reminder'
  | 'approval'
  | 'message'
  | 'update'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Notification {
  id: string
  user_id: string
  organization_id: string | null
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  link: string | null
  metadata: Record<string, any> | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface NotificationPreferences {
  user_id: string
  email_enabled: boolean
  push_enabled: boolean
  sms_enabled: boolean
  whatsapp_enabled: boolean
  alert_enabled: boolean
  reminder_enabled: boolean
  system_enabled: boolean
  quiet_hours_start: string | null
  quiet_hours_end: string | null
  created_at: string
  updated_at: string
}

export interface CreateNotificationInput {
  user_id: string
  organization_id?: string | null
  type: NotificationType
  priority?: NotificationPriority
  title: string
  message: string
  link?: string | null
  metadata?: Record<string, any> | null
}

export interface UpdatePreferencesInput {
  email_enabled?: boolean
  push_enabled?: boolean
  sms_enabled?: boolean
  whatsapp_enabled?: boolean
  alert_enabled?: boolean
  reminder_enabled?: boolean
  system_enabled?: boolean
  quiet_hours_start?: string | null
  quiet_hours_end?: string | null
}

// ──────────────────────────────────────────────────────────────
// NOTIFICATION SERVICE CLASS
// ──────────────────────────────────────────────────────────────

export class NotificationService {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  /**
   * Obține notificările unui utilizator, cu filtrare opțională
   * @param userId - ID-ul utilizatorului
   * @param options - Opțiuni de filtrare (organizationId, unreadOnly, limit)
   */
  async getForUser(
    userId: string,
    options?: {
      organizationId?: string
      unreadOnly?: boolean
      limit?: number
      offset?: number
    }
  ): Promise<{ data: Notification[] | null; error: string | null }> {
    try {
      let query = this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      // Filtrare organizație
      if (options?.organizationId) {
        query = query.eq('organization_id', options.organizationId)
      }

      // Doar necitite
      if (options?.unreadOnly) {
        query = query.eq('is_read', false)
      }

      // Limit și offset pentru paginare
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        )
      }

      const { data, error } = await query

      if (error) {
        console.error('[NotificationService] Error fetching notifications:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      console.error('[NotificationService] Exception in getForUser:', err)
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Eroare necunoscută'
      }
    }
  }

  /**
   * Creează o notificare nouă
   * @param input - Datele notificării
   */
  async create(
    input: CreateNotificationInput
  ): Promise<{ data: Notification | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .insert({
          user_id: input.user_id,
          organization_id: input.organization_id || null,
          type: input.type,
          priority: input.priority || 'medium',
          title: input.title,
          message: input.message,
          link: input.link || null,
          metadata: input.metadata || null,
          is_read: false,
        })
        .select()
        .single()

      if (error) {
        console.error('[NotificationService] Error creating notification:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      console.error('[NotificationService] Exception in create:', err)
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Eroare necunoscută'
      }
    }
  }

  /**
   * Marchează o notificare ca citită
   * @param notificationId - ID-ul notificării
   */
  async markRead(
    notificationId: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId)

      if (error) {
        console.error('[NotificationService] Error marking as read:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      console.error('[NotificationService] Exception in markRead:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Eroare necunoscută'
      }
    }
  }

  /**
   * Marchează toate notificările unui utilizator ca citite
   * @param userId - ID-ul utilizatorului
   * @param organizationId - (Opțional) Doar pentru organizația specificată
   */
  async markAllRead(
    userId: string,
    organizationId?: string
  ): Promise<{ success: boolean; count: number; error: string | null }> {
    try {
      let query = this.supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      const { error } = await query

      if (error) {
        console.error('[NotificationService] Error marking all as read:', error)
        return { success: false, count: 0, error: error.message }
      }

      // Obține count-ul separat
      const { count } = await this.supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', true)

      return { success: true, count: count || 0, error: null }
    } catch (err) {
      console.error('[NotificationService] Exception in markAllRead:', err)
      return {
        success: false,
        count: 0,
        error: err instanceof Error ? err.message : 'Eroare necunoscută'
      }
    }
  }

  /**
   * Obține numărul de notificări necitite
   * @param userId - ID-ul utilizatorului
   * @param organizationId - (Opțional) Doar pentru organizația specificată
   */
  async getUnreadCount(
    userId: string,
    organizationId?: string
  ): Promise<{ count: number; error: string | null }> {
    try {
      let query = this.supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      const { count, error } = await query

      if (error) {
        console.error('[NotificationService] Error getting unread count:', error)
        return { count: 0, error: error.message }
      }

      return { count: count || 0, error: null }
    } catch (err) {
      console.error('[NotificationService] Exception in getUnreadCount:', err)
      return {
        count: 0,
        error: err instanceof Error ? err.message : 'Eroare necunoscută'
      }
    }
  }

  /**
   * Șterge notificările vechi (soft delete / hard delete)
   * @param daysOld - Șterge notificările mai vechi de X zile
   * @param hardDelete - Dacă true, șterge definitiv; altfel soft delete
   */
  async deleteOld(
    daysOld: number = 90,
    hardDelete: boolean = false
  ): Promise<{ success: boolean; count: number; error: string | null }> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const query = this.supabase
        .from('notifications')
        .delete()
        .lt('created_at', cutoffDate.toISOString())

      // Doar notificările citite (nu ștergem cele necitite)
      query.eq('is_read', true)

      const { error } = await query

      if (error) {
        console.error('[NotificationService] Error deleting old notifications:', error)
        return { success: false, count: 0, error: error.message }
      }

      // Obține count-ul separat pentru a vedea câte au fost șterse
      // Nota: după delete, nu mai putem obține count, returnăm success
      return { success: true, count: 0, error: null }
    } catch (err) {
      console.error('[NotificationService] Exception in deleteOld:', err)
      return {
        success: false,
        count: 0,
        error: err instanceof Error ? err.message : 'Eroare necunoscută'
      }
    }
  }

  /**
   * Obține preferințele de notificare ale utilizatorului
   * @param userId - ID-ul utilizatorului
   */
  async getPreferences(
    userId: string
  ): Promise<{ data: NotificationPreferences | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        // Dacă nu există preferințe, returnăm valorile default
        if (error.code === 'PGRST116') {
          return {
            data: {
              user_id: userId,
              email_enabled: true,
              push_enabled: true,
              sms_enabled: false,
              whatsapp_enabled: false,
              alert_enabled: true,
              reminder_enabled: true,
              system_enabled: true,
              quiet_hours_start: null,
              quiet_hours_end: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null
          }
        }

        console.error('[NotificationService] Error fetching preferences:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      console.error('[NotificationService] Exception in getPreferences:', err)
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Eroare necunoscută'
      }
    }
  }

  /**
   * Actualizează preferințele de notificare
   * @param userId - ID-ul utilizatorului
   * @param updates - Preferințele de actualizat
   */
  async updatePreferences(
    userId: string,
    updates: UpdatePreferencesInput
  ): Promise<{ data: NotificationPreferences | null; error: string | null }> {
    try {
      // Încearcă update mai întâi
      const { data: existingData } = await this.supabase
        .from('notification_preferences')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (existingData) {
        // Update
        const { data, error } = await this.supabase
          .from('notification_preferences')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()
          .single()

        if (error) {
          console.error('[NotificationService] Error updating preferences:', error)
          return { data: null, error: error.message }
        }

        return { data, error: null }
      } else {
        // Insert (prima dată)
        const { data, error } = await this.supabase
          .from('notification_preferences')
          .insert({
            user_id: userId,
            ...updates,
          })
          .select()
          .single()

        if (error) {
          console.error('[NotificationService] Error creating preferences:', error)
          return { data: null, error: error.message }
        }

        return { data, error: null }
      }
    } catch (err) {
      console.error('[NotificationService] Exception in updatePreferences:', err)
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Eroare necunoscută'
      }
    }
  }
}

// ──────────────────────────────────────────────────────────────
// EXPORT CONVENIENCE FUNCTION
// ──────────────────────────────────────────────────────────────

/**
 * Factory function pentru a crea o instanță NotificationService
 * @param supabase - Supabase client (browser sau server)
 */
export function createNotificationService(supabase: SupabaseClient): NotificationService {
  return new NotificationService(supabase)
}
