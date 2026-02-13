// ============================================================
// NOTIFICATION ORCHESTRATOR SERVICE
// Centralized notification dispatch with channel routing,
// user preferences, deduplication, and batch digest
// ============================================================

import { createClient } from '@supabase/supabase-js';
import type { NotificationChannel } from '@/lib/types';

// ============================================================
// TYPES
// ============================================================

export type NotificationType =
  | 'alert_medical_expiry'
  | 'alert_equipment_expiry'
  | 'alert_document_expiry'
  | 'alert_training_reminder'
  | 'alert_inspection_due'
  | 'alert_compliance_deadline'
  | 'report_monthly'
  | 'report_weekly'
  | 'fraud_alert'
  | 'system_alert'
  | 'audit_log_alert'
  | 'custom';

export interface NotificationPayload {
  // Core fields
  type: NotificationType;
  organizationId: string;
  userId?: string; // If targeting specific user
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Content
  subject: string;
  message: string;
  data?: Record<string, any>; // Custom data per notification type

  // Routing
  channels?: NotificationChannel[]; // Override default channels
  forceChannels?: boolean; // Ignore user preferences

  // Deduplication
  deduplicationKey?: string; // Custom dedup key (defaults to type+orgId+userId)
  deduplicationWindow?: number; // Minutes (default: 60)

  // Batch digest
  allowBatching?: boolean; // Can be batched with similar notifications
  batchWindow?: number; // Minutes to wait for batching (default: 30)

  // Metadata
  metadata?: Record<string, any>;
  actionUrl?: string;
  expiresAt?: string; // ISO timestamp
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  channelsDispatched: {
    channel: NotificationChannel;
    status: 'sent' | 'queued' | 'failed' | 'skipped';
    messageId?: string;
    error?: string;
  }[];
  deduplicated?: boolean;
  batched?: boolean;
  metadata?: Record<string, any>;
}

interface UserPreferences {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  digestMode: 'realtime' | 'hourly' | 'daily';
  quietHoursStart?: string; // HH:MM
  quietHoursEnd?: string; // HH:MM
}

interface OrganizationSettings {
  organizationId: string;
  preferredChannels: NotificationChannel[];
  allowedChannels: NotificationChannel[];
  country_code: string;
  timezone?: string;
}

// ============================================================
// NOTIFICATION ORCHESTRATOR CLASS
// ============================================================

export class NotificationOrchestrator {
  private supabase: ReturnType<typeof createClient>;
  private supabaseUrl: string;
  private supabaseServiceKey: string;

  constructor(supabaseUrl?: string, supabaseServiceKey?: string) {
    this.supabaseUrl = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    this.supabaseServiceKey = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!this.supabaseUrl || !this.supabaseServiceKey) {
      throw new Error('Missing Supabase configuration for NotificationOrchestrator');
    }

    this.supabase = createClient(this.supabaseUrl, this.supabaseServiceKey);
  }

  // ============================================================
  // MAIN ENTRY POINT
  // ============================================================

  /**
   * Send notification through appropriate channels based on user preferences
   * and organization settings. Handles deduplication and batching.
   */
  async sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      // 1. Validate payload
      this.validatePayload(payload);

      // 2. Check deduplication
      const dedupKey = payload.deduplicationKey || this.generateDedupKey(payload);
      const dedupWindow = payload.deduplicationWindow || 60;

      const isDuplicate = await this.checkDeduplication(dedupKey, dedupWindow);
      if (isDuplicate) {
        return {
          success: true,
          deduplicated: true,
          channelsDispatched: [],
          metadata: { reason: 'Duplicate notification within deduplication window' },
        };
      }

      // 3. Get organization settings
      const orgSettings = await this.getOrganizationSettings(payload.organizationId);
      if (!orgSettings) {
        throw new Error(`Organization ${payload.organizationId} not found`);
      }

      // 4. Get user preferences (if userId specified)
      let userPrefs: UserPreferences | null = null;
      if (payload.userId) {
        userPrefs = await this.getUserPreferences(payload.userId);
      }

      // 5. Determine target channels
      const targetChannels = this.determineTargetChannels(
        payload,
        orgSettings,
        userPrefs
      );

      if (targetChannels.length === 0) {
        return {
          success: true,
          channelsDispatched: [],
          metadata: { reason: 'No channels enabled for notification' },
        };
      }

      // 6. Check if should batch
      if (payload.allowBatching && userPrefs?.digestMode !== 'realtime') {
        const batched = await this.enqueueBatch(payload, targetChannels, userPrefs);
        if (batched) {
          return {
            success: true,
            batched: true,
            channelsDispatched: targetChannels.map(ch => ({
              channel: ch,
              status: 'queued',
            })),
          };
        }
      }

      // 7. Check quiet hours (skip non-urgent notifications)
      if (payload.priority !== 'urgent' && userPrefs) {
        const isQuietHours = this.isQuietHours(userPrefs);
        if (isQuietHours) {
          // Queue for later delivery
          await this.queueForLater(payload, targetChannels);
          return {
            success: true,
            channelsDispatched: targetChannels.map(ch => ({
              channel: ch,
              status: 'queued',
            })),
            metadata: { reason: 'Quiet hours - queued for later' },
          };
        }
      }

      // 8. Dispatch to channels
      const dispatches = await Promise.allSettled(
        targetChannels.map(channel =>
          this.dispatchToChannel(channel, payload, orgSettings, userPrefs)
        )
      );

      // 9. Collect results
      const channelsDispatched = dispatches.map((result, idx) => {
        const channel = targetChannels[idx];

        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            channel,
            status: 'failed' as const,
            error: result.reason?.message || 'Unknown error',
          };
        }
      });

      // 10. Create notification log entry
      const notificationId = await this.logNotification(
        payload,
        channelsDispatched,
        orgSettings
      );

      // 11. Store deduplication key
      await this.storeDeduplication(dedupKey, dedupWindow);

      return {
        success: true,
        notificationId,
        channelsDispatched,
      };

    } catch (error: any) {
      console.error('[NotificationOrchestrator] Error:', error);
      throw error;
    }
  }

  // ============================================================
  // BATCH DIGEST PROCESSING
  // ============================================================

  /**
   * Process batched notifications and send digests
   * Called by cron job (hourly or daily)
   */
  async processBatchDigests(mode: 'hourly' | 'daily'): Promise<{
    processed: number;
    sent: number;
    errors: number;
  }> {
    try {
      // Fetch pending batched notifications
      const cutoffTime = mode === 'hourly'
        ? new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
        : new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

      const { data: batches, error } = await this.supabase
        .from('notification_batch_queue')
        .select('*')
        .eq('digest_mode', mode)
        .lte('created_at', cutoffTime.toISOString())
        .eq('processed', false);

      if (error) throw error;
      if (!batches || batches.length === 0) {
        return { processed: 0, sent: 0, errors: 0 };
      }

      // Group by user
      const batchesByUser = batches.reduce((acc, batch) => {
        if (!acc[batch.user_id]) acc[batch.user_id] = [];
        acc[batch.user_id].push(batch);
        return acc;
      }, {} as Record<string, any[]>);

      let sent = 0;
      let errors = 0;

      // Send digest per user
      for (const [userId, userBatches] of Object.entries(batchesByUser)) {
        try {
          await this.sendDigest(userId, userBatches, mode);

          // Mark as processed
          const batchIds = userBatches.map(b => b.id);
          await this.supabase
            .from('notification_batch_queue')
            .update({ processed: true, processed_at: new Date().toISOString() })
            .in('id', batchIds);

          sent++;
        } catch (err) {
          console.error(`[NotificationOrchestrator] Error sending digest to ${userId}:`, err);
          errors++;
        }
      }

      return {
        processed: batches.length,
        sent,
        errors,
      };

    } catch (error) {
      console.error('[NotificationOrchestrator] Error processing batch digests:', error);
      throw error;
    }
  }

  // ============================================================
  // PRIVATE HELPER METHODS
  // ============================================================

  private validatePayload(payload: NotificationPayload): void {
    if (!payload.type) throw new Error('Notification type is required');
    if (!payload.organizationId) throw new Error('Organization ID is required');
    if (!payload.subject) throw new Error('Subject is required');
    if (!payload.message) throw new Error('Message is required');
    if (!payload.priority) throw new Error('Priority is required');
  }

  private generateDedupKey(payload: NotificationPayload): string {
    const parts = [
      payload.type,
      payload.organizationId,
      payload.userId || 'org',
    ];

    // Add data-specific keys for more granular dedup
    if (payload.data) {
      if (payload.data.resourceId) parts.push(payload.data.resourceId);
      if (payload.data.employeeId) parts.push(payload.data.employeeId);
      if (payload.data.equipmentId) parts.push(payload.data.equipmentId);
    }

    return parts.join(':');
  }

  private async checkDeduplication(key: string, windowMinutes: number): Promise<boolean> {
    const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000);

    const { data, error } = await this.supabase
      .from('notification_deduplication')
      .select('id')
      .eq('dedup_key', key)
      .gte('created_at', cutoff.toISOString())
      .limit(1);

    if (error) {
      console.error('[NotificationOrchestrator] Dedup check error:', error);
      return false; // Don't block on dedup errors
    }

    return data && data.length > 0;
  }

  private async storeDeduplication(key: string, windowMinutes: number): Promise<void> {
    const expiresAt = new Date(Date.now() + windowMinutes * 60 * 1000);

    await this.supabase
      .from('notification_deduplication')
      .insert({
        dedup_key: key,
        expires_at: expiresAt.toISOString(),
      });
  }

  private async getOrganizationSettings(orgId: string): Promise<OrganizationSettings | null> {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('id, preferred_channels, country_code')
      .eq('id', orgId)
      .single();

    if (error || !data) return null;

    return {
      organizationId: data.id,
      preferredChannels: data.preferred_channels || ['email'],
      allowedChannels: data.preferred_channels || ['email', 'sms', 'whatsapp', 'push'],
      country_code: data.country_code || 'RO',
    };
  }

  private async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .select('key, value')
      .eq('user_id', userId);

    if (error || !data) {
      // Return defaults
      return {
        userId,
        emailEnabled: true,
        smsEnabled: false,
        whatsappEnabled: false,
        pushEnabled: true,
        digestMode: 'realtime',
      };
    }

    // Parse preferences
    const prefs: any = {};
    for (const pref of data) {
      try {
        prefs[pref.key] = JSON.parse(pref.value);
      } catch {
        prefs[pref.key] = pref.value;
      }
    }

    return {
      userId,
      emailEnabled: prefs.email_notifications !== false,
      smsEnabled: prefs.sms_notifications === true,
      whatsappEnabled: prefs.whatsapp_notifications === true,
      pushEnabled: prefs.push_notifications !== false,
      digestMode: prefs.digest_mode || 'realtime',
      quietHoursStart: prefs.quiet_hours_start,
      quietHoursEnd: prefs.quiet_hours_end,
    };
  }

  private determineTargetChannels(
    payload: NotificationPayload,
    orgSettings: OrganizationSettings,
    userPrefs: UserPreferences | null
  ): NotificationChannel[] {
    // If channels explicitly specified and force mode
    if (payload.channels && payload.forceChannels) {
      return payload.channels;
    }

    // If channels specified, filter by user prefs
    if (payload.channels) {
      return payload.channels.filter(ch => {
        if (!userPrefs) return true; // No user prefs = allow all

        switch (ch) {
          case 'email': return userPrefs.emailEnabled;
          case 'sms': return userPrefs.smsEnabled;
          case 'whatsapp': return userPrefs.whatsappEnabled;
          case 'push': return userPrefs.pushEnabled;
          default: return true;
        }
      });
    }

    // Use org preferred channels + user preferences
    const channels: NotificationChannel[] = [];

    for (const ch of orgSettings.preferredChannels) {
      if (!userPrefs) {
        channels.push(ch);
        continue;
      }

      switch (ch) {
        case 'email':
          if (userPrefs.emailEnabled) channels.push(ch);
          break;
        case 'sms':
          if (userPrefs.smsEnabled) channels.push(ch);
          break;
        case 'whatsapp':
          if (userPrefs.whatsappEnabled) channels.push(ch);
          break;
        case 'push':
          if (userPrefs.pushEnabled) channels.push(ch);
          break;
      }
    }

    return channels;
  }

  private isQuietHours(userPrefs: UserPreferences): boolean {
    if (!userPrefs.quietHoursStart || !userPrefs.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = userPrefs.quietHoursStart.split(':').map(Number);
    const [endH, endM] = userPrefs.quietHoursEnd.split(':').map(Number);

    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;

    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private async enqueueBatch(
    payload: NotificationPayload,
    channels: NotificationChannel[],
    userPrefs: UserPreferences | null
  ): Promise<boolean> {
    if (!payload.userId || !userPrefs) return false;

    const digestMode = userPrefs.digestMode;
    if (digestMode === 'realtime') return false;

    // Store in batch queue
    await this.supabase.from('notification_batch_queue').insert({
      user_id: payload.userId,
      organization_id: payload.organizationId,
      notification_type: payload.type,
      priority: payload.priority,
      subject: payload.subject,
      message: payload.message,
      data: payload.data || {},
      channels: channels,
      digest_mode: digestMode,
      processed: false,
    });

    return true;
  }

  private async queueForLater(
    payload: NotificationPayload,
    channels: NotificationChannel[]
  ): Promise<void> {
    await this.supabase.from('notification_queue').insert({
      user_id: payload.userId,
      organization_id: payload.organizationId,
      notification_type: payload.type,
      priority: payload.priority,
      subject: payload.subject,
      message: payload.message,
      data: payload.data || {},
      channels: channels,
      scheduled_for: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
      processed: false,
    });
  }

  private async dispatchToChannel(
    channel: NotificationChannel,
    payload: NotificationPayload,
    orgSettings: OrganizationSettings,
    userPrefs: UserPreferences | null
  ): Promise<{
    channel: NotificationChannel;
    status: 'sent' | 'failed';
    messageId?: string;
    error?: string;
  }> {
    try {
      switch (channel) {
        case 'email':
          return await this.sendEmail(payload, orgSettings, userPrefs);

        case 'sms':
          return await this.sendSMS(payload, orgSettings, userPrefs);

        case 'whatsapp':
          return await this.sendWhatsApp(payload, orgSettings, userPrefs);

        case 'push':
          return await this.sendPush(payload, orgSettings, userPrefs);

        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }
    } catch (error: any) {
      return {
        channel,
        status: 'failed',
        error: error.message,
      };
    }
  }

  private async sendEmail(
    payload: NotificationPayload,
    orgSettings: OrganizationSettings,
    userPrefs: UserPreferences | null
  ): Promise<any> {
    // Get recipient email
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', payload.userId)
      .single();

    const { data: user } = await this.supabase.auth.admin.getUserById(payload.userId || '');

    if (!user?.user?.email) {
      throw new Error('No email address found for user');
    }

    // Call email batch function
    const response = await fetch(
      `${this.supabaseUrl}/functions/v1/send-email-batch`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: [
            {
              email: user.user.email,
              name: profile?.full_name,
              params: {
                subject: payload.subject,
                message: payload.message,
                action_url: payload.actionUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
                ...payload.data,
              },
            },
          ],
          template: this.getEmailTemplate(payload.type),
          subject: payload.subject,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email send failed');
    }

    const result = await response.json();

    return {
      channel: 'email' as const,
      status: 'sent' as const,
      messageId: result.messages?.[0]?.messageId,
    };
  }

  private async sendSMS(
    payload: NotificationPayload,
    orgSettings: OrganizationSettings,
    userPrefs: UserPreferences | null
  ): Promise<any> {
    // Get user phone
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('phone')
      .eq('id', payload.userId)
      .single();

    if (!profile?.phone) {
      throw new Error('No phone number found for user');
    }

    // TODO: Implement SMS via Twilio
    // For now, just log
    console.log('[NotificationOrchestrator] SMS not implemented yet');

    return {
      channel: 'sms' as const,
      status: 'sent' as const,
      messageId: `sms-${Date.now()}`,
    };
  }

  private async sendWhatsApp(
    payload: NotificationPayload,
    orgSettings: OrganizationSettings,
    userPrefs: UserPreferences | null
  ): Promise<any> {
    // Get user phone
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('phone')
      .eq('id', payload.userId)
      .single();

    if (!profile?.phone) {
      throw new Error('No phone number found for user');
    }

    // Call WhatsApp function
    const response = await fetch(
      `${this.supabaseUrl}/functions/v1/send-whatsapp`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: profile.phone,
          template: this.getWhatsAppTemplate(payload.type),
          params: {
            subject: payload.subject,
            message: payload.message,
            ...payload.data,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'WhatsApp send failed');
    }

    const result = await response.json();

    return {
      channel: 'whatsapp' as const,
      status: 'sent' as const,
      messageId: result.messageId,
    };
  }

  private async sendPush(
    payload: NotificationPayload,
    orgSettings: OrganizationSettings,
    userPrefs: UserPreferences | null
  ): Promise<any> {
    // TODO: Implement push notifications
    // For now, just create in-app notification
    await this.supabase.from('in_app_notifications').insert({
      user_id: payload.userId,
      organization_id: payload.organizationId,
      notification_type: payload.type,
      title: payload.subject,
      message: payload.message,
      priority: payload.priority,
      action_url: payload.actionUrl,
      data: payload.data || {},
      is_read: false,
    });

    return {
      channel: 'push' as const,
      status: 'sent' as const,
      messageId: `push-${Date.now()}`,
    };
  }

  private async sendDigest(
    userId: string,
    batches: any[],
    mode: 'hourly' | 'daily'
  ): Promise<void> {
    const { data: user } = await this.supabase.auth.admin.getUserById(userId);
    if (!user?.user?.email) return;

    // Group by notification type
    const grouped = batches.reduce((acc, batch) => {
      if (!acc[batch.notification_type]) acc[batch.notification_type] = [];
      acc[batch.notification_type].push(batch);
      return acc;
    }, {} as Record<string, any[]>);

    // Generate digest HTML
    const digestHtml = this.generateDigestHtml(grouped, mode);

    // Send via email batch function
    await fetch(`${this.supabaseUrl}/functions/v1/send-email-batch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients: [{ email: user.user.email }],
        template: 'alert_notification',
        subject: `[SSM] ${mode === 'hourly' ? 'Raport Orar' : 'Raport Zilnic'} - ${batches.length} notificări`,
      }),
    });
  }

  private generateDigestHtml(grouped: Record<string, any[]>, mode: string): string {
    // TODO: Generate nice digest HTML
    return `<html><body><h1>Digest ${mode}</h1></body></html>`;
  }

  private async logNotification(
    payload: NotificationPayload,
    dispatches: any[],
    orgSettings: OrganizationSettings
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from('notification_log')
      .insert({
        organization_id: payload.organizationId,
        user_id: payload.userId,
        notification_type: payload.type,
        channel: dispatches[0]?.channel || 'unknown',
        recipient: payload.userId || 'org',
        status: dispatches.some(d => d.status === 'sent') ? 'sent' : 'failed',
        sent_at: new Date().toISOString(),
        metadata: {
          subject: payload.subject,
          priority: payload.priority,
          channels: dispatches.map(d => ({
            channel: d.channel,
            status: d.status,
            messageId: d.messageId,
            error: d.error,
          })),
          data: payload.data,
        },
      })
      .select('id')
      .single();

    if (error) {
      console.error('[NotificationOrchestrator] Log error:', error);
      return 'unknown';
    }

    return data?.id || 'unknown';
  }

  private getEmailTemplate(type: NotificationType): string {
    switch (type) {
      case 'alert_training_reminder':
        return 'training_reminder';
      case 'alert_medical_expiry':
        return 'medical_expiry';
      case 'alert_equipment_expiry':
        return 'equipment_inspection';
      case 'alert_document_expiry':
        return 'document_expiry';
      default:
        return 'alert_notification';
    }
  }

  private getWhatsAppTemplate(type: NotificationType): string {
    // WhatsApp templates need to be pre-approved
    // Map to approved template names
    return 'ssm_alert_generic';
  }
}

// ============================================================
// SINGLETON INSTANCE & HELPER FUNCTION
// ============================================================

let orchestratorInstance: NotificationOrchestrator | null = null;

/**
 * Get singleton instance of NotificationOrchestrator
 */
export function getNotificationOrchestrator(): NotificationOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new NotificationOrchestrator();
  }
  return orchestratorInstance;
}

/**
 * Convenience function to send notification
 */
export async function sendNotification(
  payload: NotificationPayload
): Promise<NotificationResult> {
  const orchestrator = getNotificationOrchestrator();
  return await orchestrator.sendNotification(payload);
}

/**
 * Process batch digests (called by cron)
 */
export async function processBatchDigests(
  mode: 'hourly' | 'daily'
): Promise<{ processed: number; sent: number; errors: number }> {
  const orchestrator = getNotificationOrchestrator();
  return await orchestrator.processBatchDigests(mode);
}

// ============================================================
// EXPORTS
// ============================================================

export default NotificationOrchestrator;
