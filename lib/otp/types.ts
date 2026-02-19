// lib/otp/types.ts
// OTP provider interfaces and shared types

export type OTPChannel = 'whatsapp' | 'sms' | 'voice' | 'email'
export type OTPProviderType = 'twilio_verify' | 'totp' | 'custom_sms'
export type OTPStatus = 'pending' | 'verified' | 'expired' | 'failed'

// Core provider interface — all providers must implement this
export interface OTPProvider {
  sendCode(phone: string, channel: OTPChannel): Promise<OTPSendResult>
  checkCode(phone: string, code: string): Promise<OTPCheckResult>
}

export interface OTPSendResult {
  success: boolean
  sid?: string   // Twilio SID or internal session ID
  error?: string
}

export interface OTPCheckResult {
  valid: boolean
  error?: string
}

// Org-level configuration from otp_configurations table
export interface OTPConfig {
  id?: string
  org_id?: string
  preferred_provider: OTPProviderType
  allowed_channels?: OTPChannel[]
  is_active?: boolean
}

// Row shapes matching Supabase tables
export interface OTPSessionRow {
  id?: string
  user_id: string
  phone: string
  channel: OTPChannel
  code_hash?: string | null
  provider: OTPProviderType
  status: OTPStatus
  created_at?: string
  expires_at: string
}

export interface TrustedDeviceRow {
  id?: string
  user_id: string
  fingerprint: string
  device_name?: string
  trusted_until: string
  created_at?: string
  last_seen_at?: string
}

export interface TOTPSecretRow {
  id?: string
  user_id: string
  secret_encrypted: string
  is_active: boolean
  backup_codes?: string[] | null
  created_at?: string
}
