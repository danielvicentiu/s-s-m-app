// S-S-M.RO — PUSH NOTIFICATION TYPES
// Tipuri TypeScript pentru push notifications
// Data: 13 Februarie 2026

export interface PushSubscriptionDB {
  id: string
  user_id: string
  endpoint: string
  p256dh_key: string
  auth_key: string
  user_agent: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  url?: string
  badge?: string
  data?: Record<string, any>
}

export interface PushSubscriptionKeys {
  p256dh: string
  auth: string
}

export interface PushSubscriptionJSON {
  endpoint: string
  expirationTime?: number | null
  keys: PushSubscriptionKeys
}

export interface SendPushNotificationRequest {
  userId: string
  payload: PushNotificationPayload
}

export interface SendPushToOrganizationRequest {
  organizationId: string
  payload: PushNotificationPayload
}

export interface SendPushNotificationResponse {
  success: boolean
  error?: string
}

export interface SendPushToOrganizationResponse {
  sent: number
  failed: number
  total: number
}
