// S-S-M.RO — API KEY SERVICE
// Server-side service for API key management
// Data: 13 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import { ApiKey, ApiKeyPermission } from '@/lib/types'
import crypto from 'crypto'

/**
 * Generate a new API key with prefix ssm_pk_
 */
export function generateApiKey(): string {
  const prefix = 'ssm_pk'
  const randomBytes = crypto.randomBytes(32)
  const randomPart = randomBytes.toString('hex')
  return `${prefix}_${randomPart}`
}

/**
 * Hash an API key using SHA-256
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Get key prefix for display (first 16 chars + ...)
 */
export function getKeyPrefix(key: string): string {
  return key.substring(0, 16) + '...'
}

/**
 * Create a new API key
 */
export async function createApiKey(params: {
  organizationId: string
  name: string
  description?: string | null
  permissions: ApiKeyPermission[]
  rateLimit?: number
  createdBy: string
}): Promise<{ apiKey: ApiKey; plainTextKey: string }> {
  const supabase = await createSupabaseServer()

  const plainTextKey = generateApiKey()
  const keyHash = hashApiKey(plainTextKey)
  const keyPrefix = getKeyPrefix(plainTextKey)

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      organization_id: params.organizationId,
      name: params.name,
      description: params.description || null,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      permissions: params.permissions,
      rate_limit_per_minute: params.rateLimit || 60,
      created_by: params.createdBy,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create API key: ${error.message}`)
  }

  return {
    apiKey: data as ApiKey,
    plainTextKey,
  }
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(params: {
  keyId: string
  revokedBy: string
}): Promise<ApiKey> {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('api_keys')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoked_by: params.revokedBy,
    })
    .eq('id', params.keyId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to revoke API key: ${error.message}`)
  }

  return data as ApiKey
}

/**
 * Rotate an API key (revoke old, create new with same permissions)
 */
export async function rotateApiKey(params: {
  keyId: string
  rotatedBy: string
}): Promise<{ apiKey: ApiKey; plainTextKey: string }> {
  const supabase = await createSupabaseServer()

  // Get the old key
  const { data: oldKey, error: fetchError } = await supabase
    .from('api_keys')
    .select('*')
    .eq('id', params.keyId)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch API key: ${fetchError.message}`)
  }

  // Generate new key
  const plainTextKey = generateApiKey()
  const keyHash = hashApiKey(plainTextKey)
  const keyPrefix = getKeyPrefix(plainTextKey)

  // Update the existing record with new key
  const { data, error } = await supabase
    .from('api_keys')
    .update({
      key_hash: keyHash,
      key_prefix: keyPrefix,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.keyId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to rotate API key: ${error.message}`)
  }

  return {
    apiKey: data as ApiKey,
    plainTextKey,
  }
}

/**
 * Verify an API key and return the key data if valid
 */
export async function verifyApiKey(plainTextKey: string): Promise<ApiKey | null> {
  const supabase = await createSupabaseServer()

  const keyHash = hashApiKey(plainTextKey)

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  return data as ApiKey
}

/**
 * Log API key usage
 */
export async function logApiKeyUsage(params: {
  apiKeyId: string
  endpoint: string
  method: string
  statusCode: number
  ipAddress?: string
  userAgent?: string
  requestSizeBytes?: number
  responseSizeBytes?: number
  durationMs?: number
  errorMessage?: string
}): Promise<void> {
  const supabase = await createSupabaseServer()

  // Insert usage log
  await supabase.from('api_key_usage_log').insert({
    api_key_id: params.apiKeyId,
    endpoint: params.endpoint,
    method: params.method,
    status_code: params.statusCode,
    ip_address: params.ipAddress,
    user_agent: params.userAgent,
    request_size_bytes: params.requestSizeBytes,
    response_size_bytes: params.responseSizeBytes,
    duration_ms: params.durationMs,
    error_message: params.errorMessage,
  })

  // Update key statistics
  await supabase
    .from('api_keys')
    .update({
      last_used_at: new Date().toISOString(),
      // TODO: Implement total_requests increment using RPC or fetch-update pattern
    })
    .eq('id', params.apiKeyId)
}
