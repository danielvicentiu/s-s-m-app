// S-S-M.RO — NOTIFICATION SERVICE
// Serviciu pentru gestionarea notificărilor utilizatorilor
// Data: 13 Februarie 2026

import { SupabaseClient } from '@supabase/supabase-js'
import { Notification } from '@/lib/types'

export class NotificationService {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  /**
   * Obține toate notificările pentru utilizatorul curent
   */
  async getNotifications(options?: {
    limit?: number
    offset?: number
    unreadOnly?: boolean
  }): Promise<{ data: Notification[] | null; error: Error | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()

      if (!user) {
        return { data: null, error: new Error('User not authenticated') }
      }

      let query = this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (options?.unreadOnly) {
        query = query.eq('is_read', false)
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching notifications:', error)
        return { data: null, error: new Error(error.message) }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error in getNotifications:', error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error')
      }
    }
  }

  /**
   * Obține numărul de notificări necitite
   */
  async getUnreadCount(): Promise<{ count: number; error: Error | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()

      if (!user) {
        return { count: 0, error: new Error('User not authenticated') }
      }

      const { count, error } = await this.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) {
        console.error('Error fetching unread count:', error)
        return { count: 0, error: new Error(error.message) }
      }

      return { count: count || 0, error: null }
    } catch (error) {
      console.error('Error in getUnreadCount:', error)
      return {
        count: 0,
        error: error instanceof Error ? error : new Error('Unknown error')
      }
    }
  }

  /**
   * Marchează o notificare ca citită
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)

      if (error) {
        console.error('Error marking notification as read:', error)
        return { success: false, error: new Error(error.message) }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error in markAsRead:', error)
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }
    }
  }

  /**
   * Marchează toate notificările ca citite
   */
  async markAllAsRead(): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()

      if (!user) {
        return { success: false, error: new Error('User not authenticated') }
      }

      const { error } = await this.supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) {
        console.error('Error marking all notifications as read:', error)
        return { success: false, error: new Error(error.message) }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error in markAllAsRead:', error)
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }
    }
  }

  /**
   * Șterge o notificare
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) {
        console.error('Error deleting notification:', error)
        return { success: false, error: new Error(error.message) }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error in deleteNotification:', error)
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }
    }
  }

  /**
   * Creează o notificare nouă
   */
  async createNotification(notification: {
    user_id: string
    organization_id?: string | null
    type: Notification['type']
    title: string
    message: string
    action_url?: string | null
    metadata?: Record<string, any> | null
  }): Promise<{ data: Notification | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .insert([{
          user_id: notification.user_id,
          organization_id: notification.organization_id || null,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          action_url: notification.action_url || null,
          is_read: false,
          metadata: notification.metadata || null
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating notification:', error)
        return { data: null, error: new Error(error.message) }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error in createNotification:', error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error')
      }
    }
  }
}
