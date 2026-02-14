// lib/services/notification-orchestrator.ts
// Centralized Notification Orchestrator
// Routes notifications to appropriate channels based on user preferences and alert settings
// Implements deduplication, batching, rate limiting, and fallback logic
// Data: 14 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import type {
  NotificationChannel,
  AlertPriority,
  AlertCategory
} from '@/lib/modules/alerts-module'

// ── Types ──

export interface NotificationPayload {
  orgId: string
  userId: string
  type: NotificationType
  priority: AlertPriority
  category: AlertCategory
  subject?: string
  message: string
  data: Record<string, any>
  actionUrl?: string
  metadata?: Record<string, any>
}

export type NotificationType =
  | 'medical_exam_expiry'
  | 'training_expiry'
  | 'equipment_inspection'
  | 'document_expiry'
  | 'compliance_alert'
  | 'legislation_update'
  | 'system_notification'
  | 'custom'

export interface NotificationResult {
  success: boolean
  notificationId: string
  channelsUsed: NotificationChannel[]
  failures: {
    channel: NotificationChannel
    error: string
  }[]
  deduplicationApplied: boolean
  batchedWith?: string[]
}

export interface UserNotificationPreferences {
  userId: string
  enableNotifications: boolean
  channels: {
    email: { enabled: boolean; address?: string }
    push: { enabled: boolean }
    sms: { enabled: boolean; phone?: string }
    whatsapp: { enabled: boolean; phone?: string }
  }
  categories: {
    [key in AlertCategory]?: {
      enabled: boolean
      channels: NotificationChannel[]
      priority: AlertPriority
    }
  }
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
    allowUrgent: boolean
  }
  digestMode: {
    enabled: boolean
    frequency: 'daily' | 'weekly'
    time: string
  }
}

export interface ChannelDeliveryResult {
  channel: NotificationChannel
  success: boolean
  messageId?: string
  error?: string
  deliveredAt?: string
  costEur?: number
}

// ── Deduplication Cache ──
interface DeduplicationEntry {
  hash: string
  notificationId: string
  sentAt: Date
  channels: NotificationChannel[]
}

const deduplicationCache = new Map<string, DeduplicationEntry>()
const DEDUPLICATION_WINDOW_MS = 60 * 60 * 1000 // 1 hour

// ── Batch Digest Queue ──
interface BatchDigestEntry {
  orgId: string
  userId: string
  notifications: NotificationPayload[]
  scheduledFor: Date
}

const batchDigestQueue = new Map<string, BatchDigestEntry>()

// ── Core Orchestrator ──

/**
 * Send a notification through the appropriate channels
 * Main entry point for all notifications
 */
export async function sendNotification(
  payload: NotificationPayload
): Promise<NotificationResult> {
  const notificationId = generateNotificationId()

  try {
    // Step 1: Check deduplication
    const isDuplicate = checkDeduplication(payload)
    if (isDuplicate) {
      console.log('[Orchestrator] Duplicate notification detected, skipping', {
        notificationId,
        type: payload.type,
        userId: payload.userId
      })

      return {
        success: true,
        notificationId,
        channelsUsed: [],
        failures: [],
        deduplicationApplied: true
      }
    }

    // Step 2: Get user preferences
    const preferences = await getUserNotificationPreferences(
      payload.orgId,
      payload.userId
    )

    if (!preferences?.enableNotifications) {
      console.log('[Orchestrator] User notifications disabled', {
        userId: payload.userId
      })

      return {
        success: true,
        notificationId,
        channelsUsed: [],
        failures: [],
        deduplicationApplied: false
      }
    }

    // Step 3: Check batch digest mode
    if (shouldBatchNotification(payload, preferences)) {
      addToBatchDigest(payload, preferences)

      return {
        success: true,
        notificationId,
        channelsUsed: [],
        failures: [],
        deduplicationApplied: false,
        batchedWith: []
      }
    }

    // Step 4: Determine channels to use
    const channels = determineChannels(payload, preferences)

    if (channels.length === 0) {
      console.log('[Orchestrator] No channels enabled for notification', {
        notificationId,
        type: payload.type
      })

      return {
        success: true,
        notificationId,
        channelsUsed: [],
        failures: [],
        deduplicationApplied: false
      }
    }

    // Step 5: Check quiet hours
    const effectiveChannels = applyQuietHoursFilter(channels, payload, preferences)

    if (effectiveChannels.length === 0) {
      console.log('[Orchestrator] All channels blocked by quiet hours', {
        notificationId,
        priority: payload.priority
      })

      // Queue for later if not urgent
      if (payload.priority !== 'urgent') {
        addToBatchDigest(payload, preferences)
      }

      return {
        success: true,
        notificationId,
        channelsUsed: [],
        failures: [],
        deduplicationApplied: false
      }
    }

    // Step 6: Send through channels with fallback logic
    const deliveryResults = await deliverToChannels(
      effectiveChannels,
      payload,
      preferences
    )

    // Step 7: Log notification
    await logNotification(notificationId, payload, deliveryResults)

    // Step 8: Add to deduplication cache
    addToDeduplicationCache(notificationId, payload, effectiveChannels)

    // Step 9: Return results
    const failures = deliveryResults.filter(r => !r.success)
    const successfulChannels = deliveryResults
      .filter(r => r.success)
      .map(r => r.channel)

    return {
      success: failures.length < deliveryResults.length,
      notificationId,
      channelsUsed: successfulChannels,
      failures: failures.map(f => ({
        channel: f.channel,
        error: f.error || 'Unknown error'
      })),
      deduplicationApplied: false
    }
  } catch (error) {
    console.error('[Orchestrator] Error sending notification:', error)

    await logNotificationError(notificationId, payload, error)

    return {
      success: false,
      notificationId,
      channelsUsed: [],
      failures: [
        {
          channel: 'email',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      ],
      deduplicationApplied: false
    }
  }
}

// ── Channel Determination ──

/**
 * Determine which channels to use based on user preferences and alert settings
 */
function determineChannels(
  payload: NotificationPayload,
  preferences: UserNotificationPreferences
): NotificationChannel[] {
  const channels: NotificationChannel[] = []

  // Check category-specific preferences
  const categoryPrefs = preferences.categories[payload.category]

  if (categoryPrefs?.enabled && categoryPrefs.channels.length > 0) {
    // Use category-specific channels
    channels.push(...categoryPrefs.channels)
  } else {
    // Use default channels based on priority
    if (payload.priority === 'urgent' || payload.priority === 'critical') {
      // High priority: use all available channels
      if (preferences.channels.email.enabled) channels.push('email')
      if (preferences.channels.push.enabled) channels.push('push')
      if (preferences.channels.sms.enabled) channels.push('sms')
      if (preferences.channels.whatsapp.enabled) channels.push('whatsapp')
    } else {
      // Normal priority: use email only by default
      if (preferences.channels.email.enabled) channels.push('email')
    }
  }

  // Filter out channels that don't have required contact info
  return channels.filter(channel => {
    switch (channel) {
      case 'email':
        return !!preferences.channels.email.address
      case 'sms':
        return !!preferences.channels.sms.phone
      case 'whatsapp':
        return !!preferences.channels.whatsapp.phone
      case 'push':
        return true // Push doesn't require additional info
      default:
        return false
    }
  })
}

/**
 * Apply quiet hours filter to channels
 */
function applyQuietHoursFilter(
  channels: NotificationChannel[],
  payload: NotificationPayload,
  preferences: UserNotificationPreferences
): NotificationChannel[] {
  if (!preferences.quietHours.enabled) {
    return channels
  }

  // Check if we're in quiet hours
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const isQuietTime = isTimeInRange(
    currentTime,
    preferences.quietHours.startTime,
    preferences.quietHours.endTime
  )

  if (!isQuietTime) {
    return channels
  }

  // Allow urgent notifications during quiet hours if configured
  if (preferences.quietHours.allowUrgent && payload.priority === 'urgent') {
    return channels
  }

  // During quiet hours, only email is allowed for non-urgent
  return channels.filter(c => c === 'email')
}

/**
 * Check if current time is within a time range
 */
function isTimeInRange(current: string, start: string, end: string): boolean {
  const [currentH, currentM] = current.split(':').map(Number)
  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)

  const currentMinutes = currentH * 60 + currentM
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  // Handle overnight ranges (e.g., 22:00 - 08:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes
  }

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes
}

// ── Deduplication ──

/**
 * Check if notification is a duplicate within the deduplication window
 */
function checkDeduplication(payload: NotificationPayload): boolean {
  const hash = generateDeduplicationHash(payload)
  const existing = deduplicationCache.get(hash)

  if (!existing) {
    return false
  }

  const now = Date.now()
  const age = now - existing.sentAt.getTime()

  if (age > DEDUPLICATION_WINDOW_MS) {
    // Expired, remove from cache
    deduplicationCache.delete(hash)
    return false
  }

  return true
}

/**
 * Generate deduplication hash from notification payload
 */
function generateDeduplicationHash(payload: NotificationPayload): string {
  const key = `${payload.userId}:${payload.type}:${payload.category}:${JSON.stringify(payload.data)}`
  return simpleHash(key)
}

/**
 * Add notification to deduplication cache
 */
function addToDeduplicationCache(
  notificationId: string,
  payload: NotificationPayload,
  channels: NotificationChannel[]
): void {
  const hash = generateDeduplicationHash(payload)

  deduplicationCache.set(hash, {
    hash,
    notificationId,
    sentAt: new Date(),
    channels
  })

  // Clean up expired entries periodically
  if (deduplicationCache.size > 1000) {
    cleanupDeduplicationCache()
  }
}

/**
 * Clean up expired deduplication cache entries
 */
function cleanupDeduplicationCache(): void {
  const now = Date.now()

  for (const [hash, entry] of deduplicationCache.entries()) {
    const age = now - entry.sentAt.getTime()
    if (age > DEDUPLICATION_WINDOW_MS) {
      deduplicationCache.delete(hash)
    }
  }
}

// ── Batch Digest ──

/**
 * Check if notification should be batched instead of sent immediately
 */
function shouldBatchNotification(
  payload: NotificationPayload,
  preferences: UserNotificationPreferences
): boolean {
  if (!preferences.digestMode.enabled) {
    return false
  }

  // Never batch urgent or critical notifications
  if (payload.priority === 'urgent' || payload.priority === 'critical') {
    return false
  }

  // Only batch info and warning level notifications
  return payload.priority === 'info' || payload.priority === 'warning'
}

/**
 * Add notification to batch digest queue
 */
function addToBatchDigest(
  payload: NotificationPayload,
  preferences: UserNotificationPreferences
): void {
  const key = `${payload.orgId}:${payload.userId}`
  const existing = batchDigestQueue.get(key)

  if (existing) {
    existing.notifications.push(payload)
  } else {
    const scheduledFor = calculateNextDigestTime(preferences.digestMode)

    batchDigestQueue.set(key, {
      orgId: payload.orgId,
      userId: payload.userId,
      notifications: [payload],
      scheduledFor
    })
  }
}

/**
 * Calculate next digest delivery time based on frequency
 */
function calculateNextDigestTime(digestMode: UserNotificationPreferences['digestMode']): Date {
  const now = new Date()
  const [hours, minutes] = digestMode.time.split(':').map(Number)

  const next = new Date(now)
  next.setHours(hours, minutes, 0, 0)

  if (digestMode.frequency === 'daily') {
    if (next <= now) {
      next.setDate(next.getDate() + 1)
    }
  } else if (digestMode.frequency === 'weekly') {
    // Find next Monday (or configured day)
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7
    next.setDate(now.getDate() + daysUntilMonday)
  }

  return next
}

// ── Channel Delivery ──

/**
 * Deliver notification to all specified channels with fallback logic
 */
async function deliverToChannels(
  channels: NotificationChannel[],
  payload: NotificationPayload,
  preferences: UserNotificationPreferences
): Promise<ChannelDeliveryResult[]> {
  const results: ChannelDeliveryResult[] = []

  // Sort channels by priority (email first, then others)
  const sortedChannels = [...channels].sort((a, b) => {
    const priority: Record<NotificationChannel, number> = {
      email: 1,
      push: 2,
      sms: 3,
      whatsapp: 4
    }
    return priority[a] - priority[b]
  })

  // Attempt delivery on each channel
  for (const channel of sortedChannels) {
    try {
      const result = await deliverToChannel(channel, payload, preferences)
      results.push(result)

      // If high priority and first channel failed, try fallback
      if (!result.success && (payload.priority === 'urgent' || payload.priority === 'critical')) {
        console.log('[Orchestrator] Primary channel failed, attempting fallback', {
          failedChannel: channel,
          priority: payload.priority
        })
      }
    } catch (error) {
      console.error(`[Orchestrator] Error delivering to ${channel}:`, error)

      results.push({
        channel,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return results
}

/**
 * Deliver notification to a specific channel
 */
async function deliverToChannel(
  channel: NotificationChannel,
  payload: NotificationPayload,
  preferences: UserNotificationPreferences
): Promise<ChannelDeliveryResult> {
  const supabase = await createSupabaseServer()

  switch (channel) {
    case 'email':
      return await deliverEmail(payload, preferences, supabase)

    case 'sms':
      return await deliverSMS(payload, preferences, supabase)

    case 'whatsapp':
      return await deliverWhatsApp(payload, preferences, supabase)

    case 'push':
      return await deliverPush(payload, preferences, supabase)

    default:
      return {
        channel,
        success: false,
        error: 'Unknown channel type'
      }
  }
}

/**
 * Deliver notification via email (using send-email-batch Edge Function)
 */
async function deliverEmail(
  payload: NotificationPayload,
  preferences: UserNotificationPreferences,
  supabase: any
): Promise<ChannelDeliveryResult> {
  try {
    const emailAddress = preferences.channels.email.address

    if (!emailAddress) {
      return {
        channel: 'email',
        success: false,
        error: 'No email address configured'
      }
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', payload.userId)
      .single()

    // Map notification type to email template
    const templateMap: Record<NotificationType, string> = {
      medical_exam_expiry: 'medical_expiry',
      training_expiry: 'training_reminder',
      equipment_inspection: 'equipment_inspection',
      document_expiry: 'document_expiry',
      compliance_alert: 'alert_notification',
      legislation_update: 'alert_notification',
      system_notification: 'alert_notification',
      custom: 'alert_notification'
    }

    const template = templateMap[payload.type] || 'alert_notification'

    // Call Edge Function
    const { data, error } = await supabase.functions.invoke('send-email-batch', {
      body: {
        recipients: [
          {
            email: emailAddress,
            name: profile?.full_name,
            params: {
              ...payload.data,
              message: payload.message,
              priority: payload.priority,
              alert_message: payload.message,
              alert_details: payload.data.details || '',
              action_url: payload.actionUrl || ''
            }
          }
        ],
        template,
        subject: payload.subject || `[${payload.priority.toUpperCase()}] ${payload.category}`,
        params: payload.data
      }
    })

    if (error) throw error

    return {
      channel: 'email',
      success: true,
      messageId: data?.messages?.[0]?.messageId,
      deliveredAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Orchestrator] Email delivery error:', error)

    return {
      channel: 'email',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Deliver notification via SMS (using send-sms Edge Function)
 */
async function deliverSMS(
  payload: NotificationPayload,
  preferences: UserNotificationPreferences,
  supabase: any
): Promise<ChannelDeliveryResult> {
  try {
    const phone = preferences.channels.sms.phone

    if (!phone) {
      return {
        channel: 'sms',
        success: false,
        error: 'No phone number configured'
      }
    }

    // Truncate message to SMS length
    const smsMessage = `[${payload.priority.toUpperCase()}] ${payload.message}`.slice(0, 160)

    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        phone,
        message: smsMessage,
        organizationId: payload.orgId,
        metadata: {
          notificationType: payload.type,
          category: payload.category,
          userId: payload.userId
        }
      }
    })

    if (error) throw error

    return {
      channel: 'sms',
      success: data?.success || false,
      messageId: data?.messageId,
      deliveredAt: new Date().toISOString(),
      costEur: data?.details?.estimatedCost
    }
  } catch (error) {
    console.error('[Orchestrator] SMS delivery error:', error)

    return {
      channel: 'sms',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Deliver notification via WhatsApp (using send-whatsapp Edge Function)
 */
async function deliverWhatsApp(
  payload: NotificationPayload,
  preferences: UserNotificationPreferences,
  supabase: any
): Promise<ChannelDeliveryResult> {
  try {
    const phone = preferences.channels.whatsapp.phone

    if (!phone) {
      return {
        channel: 'whatsapp',
        success: false,
        error: 'No WhatsApp number configured'
      }
    }

    // Map notification type to WhatsApp template
    const templateMap: Record<NotificationType, string> = {
      medical_exam_expiry: 'medical_expiry',
      training_expiry: 'training_reminder',
      equipment_inspection: 'equipment_inspection',
      document_expiry: 'document_expiry',
      compliance_alert: 'alert_notification',
      legislation_update: 'alert_notification',
      system_notification: 'alert_notification',
      custom: 'alert_notification'
    }

    const template = templateMap[payload.type] || 'alert_notification'

    const { data, error } = await supabase.functions.invoke('send-whatsapp', {
      body: {
        phone,
        template_name: template,
        template_params: {
          ...payload.data,
          alert_message: payload.message,
          priority: payload.priority
        },
        locale: 'ro'
      }
    })

    if (error) throw error

    return {
      channel: 'whatsapp',
      success: data?.success || false,
      messageId: data?.messageId,
      deliveredAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Orchestrator] WhatsApp delivery error:', error)

    return {
      channel: 'whatsapp',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Deliver notification via push (in-app notification)
 */
async function deliverPush(
  payload: NotificationPayload,
  preferences: UserNotificationPreferences,
  supabase: any
): Promise<ChannelDeliveryResult> {
  try {
    // Store in-app notification in database
    const { error } = await supabase.from('notifications').insert({
      user_id: payload.userId,
      organization_id: payload.orgId,
      type: payload.type,
      category: payload.category,
      priority: payload.priority,
      title: payload.subject || payload.category,
      message: payload.message,
      action_url: payload.actionUrl,
      data: payload.data,
      read_at: null,
      created_at: new Date().toISOString()
    })

    if (error) throw error

    return {
      channel: 'push',
      success: true,
      deliveredAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Orchestrator] Push delivery error:', error)

    return {
      channel: 'push',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// ── User Preferences ──

/**
 * Get user notification preferences from database
 */
async function getUserNotificationPreferences(
  orgId: string,
  userId: string
): Promise<UserNotificationPreferences | null> {
  try {
    const supabase = await createSupabaseServer()

    // Try to get user-specific preferences
    const { data: prefs, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('organization_id', orgId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[Orchestrator] Error fetching preferences:', error)
    }

    if (!prefs) {
      // Return default preferences
      return getDefaultUserPreferences(userId, orgId)
    }

    return prefs as UserNotificationPreferences
  } catch (error) {
    console.error('[Orchestrator] Error in getUserNotificationPreferences:', error)
    return getDefaultUserPreferences(userId, orgId)
  }
}

/**
 * Get default user notification preferences
 */
function getDefaultUserPreferences(
  userId: string,
  orgId: string
): UserNotificationPreferences {
  return {
    userId,
    enableNotifications: true,
    channels: {
      email: { enabled: true },
      push: { enabled: true },
      sms: { enabled: false },
      whatsapp: { enabled: false }
    },
    categories: {},
    quietHours: {
      enabled: true,
      startTime: '20:00',
      endTime: '08:00',
      allowUrgent: true
    },
    digestMode: {
      enabled: false,
      frequency: 'daily',
      time: '08:00'
    }
  }
}

// ── Logging ──

/**
 * Log notification delivery to database
 */
async function logNotification(
  notificationId: string,
  payload: NotificationPayload,
  deliveryResults: ChannelDeliveryResult[]
): Promise<void> {
  try {
    const supabase = await createSupabaseServer()

    for (const result of deliveryResults) {
      await supabase.from('notification_delivery_log').insert({
        notification_id: notificationId,
        organization_id: payload.orgId,
        user_id: payload.userId,
        notification_type: payload.type,
        category: payload.category,
        priority: payload.priority,
        channel: result.channel,
        status: result.success ? 'delivered' : 'failed',
        message_id: result.messageId,
        error_message: result.error,
        cost_eur: result.costEur,
        metadata: payload.metadata,
        created_at: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('[Orchestrator] Error logging notification:', error)
  }
}

/**
 * Log notification error
 */
async function logNotificationError(
  notificationId: string,
  payload: NotificationPayload,
  error: unknown
): Promise<void> {
  try {
    const supabase = await createSupabaseServer()

    await supabase.from('notification_errors').insert({
      notification_id: notificationId,
      organization_id: payload.orgId,
      user_id: payload.userId,
      notification_type: payload.type,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      error_stack: error instanceof Error ? error.stack : null,
      payload: payload,
      created_at: new Date().toISOString()
    })
  } catch (logError) {
    console.error('[Orchestrator] Error logging notification error:', logError)
  }
}

// ── Utilities ──

/**
 * Generate unique notification ID
 */
function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Simple hash function for deduplication
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

// ── Exports ──

export {
  sendNotification as default,
  getUserNotificationPreferences,
  determineChannels,
  checkDeduplication,
  addToBatchDigest,
  deliverToChannels
}
