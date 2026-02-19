// lib/otp/deviceTrust.ts
// Trusted device management — fingerprint generation, trust/revoke helpers

import crypto from 'crypto'
import type { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// Build a deterministic fingerprint from request headers
// Uses: User-Agent + Accept-Language + Sec-CH-UA (or timezone hint)
export function generateFingerprint(req: NextRequest | Request): string {
  const headers = req.headers
  const ua = headers.get('user-agent') || ''
  const lang = headers.get('accept-language') || ''
  const tz = headers.get('x-timezone') || headers.get('cf-timezone') || ''
  const secUa = headers.get('sec-ch-ua') || ''

  const raw = `${ua}|${lang}|${tz}|${secUa}`
  return crypto.createHash('sha256').update(raw).digest('hex')
}

// Check if a fingerprint is trusted for a user
export async function isDeviceTrusted(
  userId: string,
  fingerprint: string
): Promise<boolean> {
  try {
    const supabase = await createSupabaseServer()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('trusted_devices')
      .select('id, trusted_until')
      .eq('user_id', userId)
      .eq('fingerprint', fingerprint)
      .gt('trusted_until', now)
      .maybeSingle()

    if (error) {
      console.error('isDeviceTrusted query error:', error)
      return false
    }

    if (data) {
      // Update last_seen_at
      await supabase
        .from('trusted_devices')
        .update({ last_seen_at: now })
        .eq('id', data.id)
    }

    return !!data
  } catch (err) {
    console.error('isDeviceTrusted unexpected error:', err)
    return false
  }
}

// Trust a device for N days
export async function trustDevice(
  userId: string,
  fingerprint: string,
  days: number = 30,
  deviceName?: string
): Promise<{ id: string } | null> {
  try {
    const supabase = await createSupabaseServer()
    const trustedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    const now = new Date().toISOString()

    // Upsert — update if fingerprint already exists for user, otherwise insert
    const { data, error } = await supabase
      .from('trusted_devices')
      .upsert(
        {
          user_id: userId,
          fingerprint,
          device_name: deviceName || 'Dispozitiv necunoscut',
          trusted_until: trustedUntil,
          last_seen_at: now,
        },
        { onConflict: 'user_id,fingerprint' }
      )
      .select('id')
      .single()

    if (error) {
      console.error('trustDevice upsert error:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('trustDevice unexpected error:', err)
    return null
  }
}

// Revoke a specific trusted device by its ID
export async function revokeDevice(deviceId: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseServer()
    const { error } = await supabase
      .from('trusted_devices')
      .delete()
      .eq('id', deviceId)

    if (error) {
      console.error('revokeDevice error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('revokeDevice unexpected error:', err)
    return false
  }
}

// Revoke ALL trusted devices for a user
export async function revokeAllDevices(userId: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseServer()
    const { error } = await supabase
      .from('trusted_devices')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('revokeAllDevices error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('revokeAllDevices unexpected error:', err)
    return false
  }
}

// List all trusted devices for a user (non-expired and expired)
export async function listDevices(userId: string) {
  try {
    const supabase = await createSupabaseServer()
    const { data, error } = await supabase
      .from('trusted_devices')
      .select('id, device_name, trusted_until, created_at, last_seen_at')
      .eq('user_id', userId)
      .order('last_seen_at', { ascending: false })

    if (error) {
      console.error('listDevices error:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('listDevices unexpected error:', err)
    return []
  }
}
