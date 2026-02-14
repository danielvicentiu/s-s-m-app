// S-S-M.RO — API KEY SERVICE
// Server-side service for API key management
// Data: 13 Februarie 2026
// Updated: 14 Februarie 2026 - Enhanced with rate limiting and comprehensive management

import { createSupabaseServer } from '@/lib/supabase/server'
import { ApiKey, ApiKeyPermission } from '@/lib/types'
import crypto from 'crypto'

// Constants
const API_KEY_PREFIX = 'sk_live_'
const API_KEY_LENGTH = 32

/**
 * Generate a new API key with prefix sk_live_
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(API_KEY_LENGTH)
  const randomPart = randomBytes.toString('base64url') // URL-safe base64
  return `${API_KEY_PREFIX}${randomPart}`
}

/**
 * Hash an API key using SHA-256
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Get key prefix for display (first 8 chars visible)
 */
export function getKeyPrefix(key: string): string {
  return key.substring(0, 8)
}

/**
 * Create a new API key with enhanced rate limiting
 */
export async function createApiKey(params: {
  organizationId: string
  name: string
  description?: string | null
  permissions: ApiKeyPermission[]
  rateLimitPerHour?: number
  rateLimitPerDay?: number
  expiresAt?: Date | null
  createdBy: string
}): Promise<{ apiKey: ApiKey; plainTextKey: string }> {
  const supabase = await createSupabaseServer()

  // Verify user has permission to create API keys for this org
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', params.createdBy)
    .eq('organization_id', params.organizationId)
    .single()

  if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
    throw new Error('Insufficient permissions to create API keys')
  }

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
      rate_limit_per_hour: params.rateLimitPerHour || 1000,
      rate_limit_per_day: params.rateLimitPerDay || 10000,
      expires_at: params.expiresAt?.toISOString() || null,
      created_by: params.createdBy,
      is_active: true,
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
 * Revoke an API key with reason tracking
 */
export async function revokeApiKey(params: {
  keyId: string
  revokedBy: string
  reason?: string
}): Promise<ApiKey> {
  const supabase = await createSupabaseServer()

  // Verify permissions
  const { data: apiKey } = await supabase
    .from('api_keys')
    .select('organization_id')
    .eq('id', params.keyId)
    .single()

  if (!apiKey) {
    throw new Error('API key not found')
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', params.revokedBy)
    .eq('organization_id', apiKey.organization_id)
    .single()

  if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
    throw new Error('Insufficient permissions to revoke API keys')
  }

  const { data, error } = await supabase
    .from('api_keys')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoked_by: params.revokedBy,
      revoked_reason: params.reason || null,
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
 * Log API key usage using database function for better performance
 */
export async function logApiKeyUsage(params: {
  apiKeyId: string
  endpoint: string
  method: string
  statusCode?: number
  ipAddress?: string
  userAgent?: string
  responseTimeMs?: number
}): Promise<void> {
  const supabase = await createSupabaseServer()

  // Use the database function for logging (more efficient)
  const { error } = await supabase.rpc('log_api_key_usage', {
    p_api_key_id: params.apiKeyId,
    p_endpoint: params.endpoint,
    p_method: params.method,
    p_ip_address: params.ipAddress || null,
    p_user_agent: params.userAgent || null,
    p_status_code: params.statusCode || null,
    p_response_time_ms: params.responseTimeMs || null,
  })

  if (error) {
    console.error('Error logging API key usage:', error)
    // Don't throw - logging failures shouldn't break the API call
  }
}

/**
 * Check rate limit status for an API key
 */
export async function checkRateLimit(keyId: string): Promise<{
  hourly_count: number
  daily_count: number
  hourly_limit_exceeded: boolean
  daily_limit_exceeded: boolean
}> {
  const supabase = await createSupabaseServer()

  // Get the API key to retrieve rate limits
  const { data: apiKey, error: keyError } = await supabase
    .from('api_keys')
    .select('rate_limit_per_hour, rate_limit_per_day')
    .eq('id', keyId)
    .single()

  if (keyError || !apiKey) {
    throw new Error('API key not found')
  }

  // Call the database function to check rate limits
  const { data, error } = await supabase
    .rpc('check_api_key_rate_limit', {
      p_api_key_id: keyId,
      p_rate_limit_per_hour: apiKey.rate_limit_per_hour,
      p_rate_limit_per_day: apiKey.rate_limit_per_day,
    })
    .single()

  if (error) {
    throw new Error(`Failed to check rate limit: ${error.message}`)
  }

  return data
}

/**
 * Validate an API key and return its details if valid
 */
export async function validateApiKey(plainTextKey: string): Promise<{
  valid: boolean
  apiKey?: ApiKey
  error?: string
}> {
  const supabase = await createSupabaseServer()

  // Basic format validation
  if (!plainTextKey.startsWith(API_KEY_PREFIX)) {
    return { valid: false, error: 'Invalid API key format' }
  }

  const keyHash = hashApiKey(plainTextKey)

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_hash', keyHash)
    .single()

  if (error || !data) {
    return { valid: false, error: 'API key not found' }
  }

  // Check if key is active
  if (!data.is_active) {
    return { valid: false, error: 'API key has been revoked' }
  }

  // Check if key has expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'API key has expired' }
  }

  return { valid: true, apiKey: data as ApiKey }
}

/**
 * List all API keys for an organization
 */
export async function listApiKeys(
  organizationId: string,
  options?: {
    includeRevoked?: boolean
    includeExpired?: boolean
  }
): Promise<ApiKey[]> {
  const supabase = await createSupabaseServer()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User must be authenticated to list API keys')
  }

  // Verify user has access to this org
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', organizationId)
    .single()

  if (!membership) {
    throw new Error('User is not a member of this organization')
  }

  // Build query
  let query = supabase
    .from('api_keys')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  // Filter by active status if needed
  if (!options?.includeRevoked) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to list API keys: ${error.message}`)
  }

  // Filter expired keys if needed
  let results = data || []
  if (!options?.includeExpired) {
    const now = new Date()
    results = results.filter(
      (key) => !key.expires_at || new Date(key.expires_at) > now
    )
  }

  return results as ApiKey[]
}

/**
 * Update API key settings (name, permissions, rate limits)
 */
export async function updateApiKey(
  keyId: string,
  updates: {
    name?: string
    permissions?: ApiKeyPermission[]
    rateLimitPerHour?: number
    rateLimitPerDay?: number
    expiresAt?: Date | null
  }
): Promise<ApiKey> {
  const supabase = await createSupabaseServer()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User must be authenticated to update API keys')
  }

  // Get the API key to verify permissions
  const { data: apiKey } = await supabase
    .from('api_keys')
    .select('organization_id')
    .eq('id', keyId)
    .single()

  if (!apiKey) {
    throw new Error('API key not found')
  }

  // Verify user has permission
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', apiKey.organization_id)
    .single()

  if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
    throw new Error('Insufficient permissions to update API keys')
  }

  // Build update object
  const updateData: any = {}
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.permissions !== undefined) updateData.permissions = updates.permissions
  if (updates.rateLimitPerHour !== undefined)
    updateData.rate_limit_per_hour = updates.rateLimitPerHour
  if (updates.rateLimitPerDay !== undefined)
    updateData.rate_limit_per_day = updates.rateLimitPerDay
  if (updates.expiresAt !== undefined)
    updateData.expires_at = updates.expiresAt?.toISOString() ?? null

  // Update the key
  const { data, error: updateError } = await supabase
    .from('api_keys')
    .update(updateData)
    .eq('id', keyId)
    .select()
    .single()

  if (updateError) {
    throw new Error(`Failed to update API key: ${updateError.message}`)
  }

  return data as ApiKey
}

/**
 * Get usage statistics for an API key
 */
export async function getApiKeyUsageStats(
  keyId: string,
  options?: {
    startDate?: Date
    endDate?: Date
    limit?: number
  }
): Promise<any[]> {
  const supabase = await createSupabaseServer()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User must be authenticated to view usage stats')
  }

  // Verify access to the API key
  const { data: apiKey } = await supabase
    .from('api_keys')
    .select('organization_id')
    .eq('id', keyId)
    .single()

  if (!apiKey) {
    throw new Error('API key not found')
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', apiKey.organization_id)
    .single()

  if (!membership) {
    throw new Error('User is not a member of this organization')
  }

  // Build query
  let query = supabase
    .from('api_key_usage_log')
    .select('*')
    .eq('api_key_id', keyId)
    .order('created_at', { ascending: false })

  if (options?.startDate) {
    query = query.gte('created_at', options.startDate.toISOString())
  }

  if (options?.endDate) {
    query = query.lte('created_at', options.endDate.toISOString())
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  } else {
    query = query.limit(100) // Default limit
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to get usage stats: ${error.message}`)
  }

  return data || []
}
