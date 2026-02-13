// S-S-M.RO — API KEY MANAGEMENT SERVICE
// External integrations API key management with hashing, rate limiting, and rotation
// Data: 13 Februarie 2026

import { createClient } from '@supabase/supabase-js'
import { ApiKey, ApiKeyPermission, ApiKeyUsageLog } from '@/lib/types'
import crypto from 'crypto'

// Configuration
const API_KEY_LENGTH = 32 // 32 bytes = 64 hex characters
const KEY_PREFIX = 'ssm_pk' // SSM Platform Key
const RATE_LIMIT_WINDOW_MS = 60000 // 1 minute

// In-memory rate limit cache (in production, use Redis)
const rateLimitCache = new Map<string, { count: number; resetAt: number }>()

interface GenerateApiKeyResult {
  apiKey: ApiKey
  plainTextKey: string // Only returned once, never stored
}

interface ValidationResult {
  valid: boolean
  apiKey: ApiKey | null
  error?: string
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Generate a new API key for an organization
 * Returns the plain text key ONCE - it will never be shown again
 */
export async function generateApiKey(
  organizationId: string,
  name: string,
  permissions: ApiKeyPermission[],
  options?: {
    description?: string
    rateLimitPerMinute?: number
    expiresAt?: string
    createdBy?: string
  }
): Promise<GenerateApiKeyResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate random API key
    const randomBytes = crypto.randomBytes(API_KEY_LENGTH)
    const plainTextKey = `${KEY_PREFIX}_${randomBytes.toString('hex')}`

    // Hash the key for storage (SHA-256)
    const keyHash = crypto
      .createHash('sha256')
      .update(plainTextKey)
      .digest('hex')

    // Extract prefix for identification (first 16 chars after ssm_pk_)
    const keyPrefix = plainTextKey.substring(0, 16)

    // Insert into database
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        organization_id: organizationId,
        name,
        description: options?.description || null,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        permissions,
        rate_limit_per_minute: options?.rateLimitPerMinute || 60,
        expires_at: options?.expiresAt || null,
        created_by: options?.createdBy || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating API key:', error)
      throw new Error(`Failed to create API key: ${error.message}`)
    }

    console.log(`API key created: ${name} for org ${organizationId}`)

    return {
      apiKey: data as ApiKey,
      plainTextKey,
    }
  } catch (error) {
    console.error('Error in generateApiKey:', error)
    throw error
  }
}

/**
 * Validate an API key and return its details
 * Also checks if key is active, not expired, and not revoked
 */
export async function validateApiKey(
  plainTextKey: string
): Promise<ValidationResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Hash the provided key
    const keyHash = crypto
      .createHash('sha256')
      .update(plainTextKey)
      .digest('hex')

    // Find the API key
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', keyHash)
      .single()

    if (error || !data) {
      return {
        valid: false,
        apiKey: null,
        error: 'Invalid API key',
      }
    }

    const apiKey = data as ApiKey

    // Check if key is active
    if (!apiKey.is_active) {
      return {
        valid: false,
        apiKey: null,
        error: 'API key is inactive',
      }
    }

    // Check if key is revoked
    if (apiKey.revoked_at) {
      return {
        valid: false,
        apiKey: null,
        error: 'API key has been revoked',
      }
    }

    // Check if key is expired
    if (apiKey.expires_at) {
      const expiryDate = new Date(apiKey.expires_at)
      if (expiryDate < new Date()) {
        return {
          valid: false,
          apiKey: null,
          error: 'API key has expired',
        }
      }
    }

    // Update last_used_at and total_requests
    await supabase
      .from('api_keys')
      .update({
        last_used_at: new Date().toISOString(),
        total_requests: apiKey.total_requests + 1,
      })
      .eq('id', apiKey.id)

    return {
      valid: true,
      apiKey,
    }
  } catch (error) {
    console.error('Error in validateApiKey:', error)
    return {
      valid: false,
      apiKey: null,
      error: 'Validation failed',
    }
  }
}

/**
 * Check rate limit for an API key
 * Returns whether the request is allowed and remaining quota
 */
export async function checkRateLimit(apiKey: ApiKey): Promise<RateLimitResult> {
  const now = Date.now()
  const cacheKey = apiKey.id

  // Get current rate limit data
  let rateLimitData = rateLimitCache.get(cacheKey)

  // Reset if window has passed
  if (!rateLimitData || now >= rateLimitData.resetAt) {
    rateLimitData = {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    }
  }

  // Check if limit exceeded
  if (rateLimitData.count >= apiKey.rate_limit_per_minute) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: rateLimitData.resetAt,
    }
  }

  // Increment counter
  rateLimitData.count++
  rateLimitCache.set(cacheKey, rateLimitData)

  return {
    allowed: true,
    remaining: apiKey.rate_limit_per_minute - rateLimitData.count,
    resetAt: rateLimitData.resetAt,
  }
}

/**
 * Revoke an API key (soft delete)
 * Marks the key as revoked with timestamp and user
 */
export async function revokeApiKey(
  keyId: string,
  revokedBy?: string
): Promise<void> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('api_keys')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: revokedBy || null,
      })
      .eq('id', keyId)

    if (error) {
      console.error('Error revoking API key:', error)
      throw new Error(`Failed to revoke API key: ${error.message}`)
    }

    // Clear from rate limit cache
    rateLimitCache.delete(keyId)

    console.log(`API key revoked: ${keyId}`)
  } catch (error) {
    console.error('Error in revokeApiKey:', error)
    throw error
  }
}

/**
 * List all API keys for an organization
 * Optionally filter by active status
 */
export async function listApiKeys(
  organizationId: string,
  options?: {
    activeOnly?: boolean
    includeRevoked?: boolean
  }
): Promise<ApiKey[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('api_keys')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    // Filter by active status
    if (options?.activeOnly) {
      query = query.eq('is_active', true)
    }

    // Filter out revoked keys unless explicitly requested
    if (!options?.includeRevoked) {
      query = query.is('revoked_at', null)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error listing API keys:', error)
      throw new Error(`Failed to list API keys: ${error.message}`)
    }

    return (data || []) as ApiKey[]
  } catch (error) {
    console.error('Error in listApiKeys:', error)
    throw error
  }
}

/**
 * Rotate an API key
 * Revokes the old key and generates a new one with the same permissions
 */
export async function rotateApiKey(
  keyId: string,
  rotatedBy?: string
): Promise<GenerateApiKeyResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the old key details
    const { data: oldKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', keyId)
      .single()

    if (fetchError || !oldKey) {
      throw new Error('API key not found')
    }

    const oldApiKey = oldKey as ApiKey

    // Generate a new key with the same settings
    const newKeyResult = await generateApiKey(
      oldApiKey.organization_id,
      `${oldApiKey.name} (rotated)`,
      oldApiKey.permissions,
      {
        description: oldApiKey.description || undefined,
        rateLimitPerMinute: oldApiKey.rate_limit_per_minute,
        expiresAt: oldApiKey.expires_at || undefined,
        createdBy: rotatedBy,
      }
    )

    // Revoke the old key
    await revokeApiKey(keyId, rotatedBy)

    console.log(`API key rotated: ${keyId} -> ${newKeyResult.apiKey.id}`)

    return newKeyResult
  } catch (error) {
    console.error('Error in rotateApiKey:', error)
    throw error
  }
}

/**
 * Log API key usage
 * Records detailed usage information for analytics and monitoring
 */
export async function logApiKeyUsage(
  apiKeyId: string,
  usage: {
    endpoint: string
    method: string
    statusCode?: number
    ipAddress?: string
    userAgent?: string
    requestSizeBytes?: number
    responseSizeBytes?: number
    durationMs?: number
    errorMessage?: string
  }
): Promise<void> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase.from('api_key_usage_log').insert({
      api_key_id: apiKeyId,
      endpoint: usage.endpoint,
      method: usage.method,
      status_code: usage.statusCode || null,
      ip_address: usage.ipAddress || null,
      user_agent: usage.userAgent || null,
      request_size_bytes: usage.requestSizeBytes || null,
      response_size_bytes: usage.responseSizeBytes || null,
      duration_ms: usage.durationMs || null,
      error_message: usage.errorMessage || null,
    })

    if (error) {
      console.error('Error logging API key usage:', error)
      // Don't throw - logging failure shouldn't break the API call
    }
  } catch (error) {
    console.error('Error in logApiKeyUsage:', error)
    // Don't throw - logging failure shouldn't break the API call
  }
}

/**
 * Get usage statistics for an API key
 * Returns aggregated usage data
 */
export async function getApiKeyUsageStats(
  apiKeyId: string,
  options?: {
    startDate?: string
    endDate?: string
    limit?: number
  }
): Promise<{
  total_requests: number
  successful_requests: number
  failed_requests: number
  avg_duration_ms: number
  recent_usage: ApiKeyUsageLog[]
}> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('api_key_usage_log')
      .select('*')
      .eq('api_key_id', apiKeyId)

    if (options?.startDate) {
      query = query.gte('created_at', options.startDate)
    }

    if (options?.endDate) {
      query = query.lte('created_at', options.endDate)
    }

    query = query.order('created_at', { ascending: false })

    if (options?.limit) {
      query = query.limit(options.limit)
    } else {
      query = query.limit(100)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching API key usage stats:', error)
      throw new Error(`Failed to fetch usage stats: ${error.message}`)
    }

    const logs = (data || []) as ApiKeyUsageLog[]

    // Calculate statistics
    const totalRequests = logs.length
    const successfulRequests = logs.filter(
      (log) => log.status_code && log.status_code >= 200 && log.status_code < 300
    ).length
    const failedRequests = totalRequests - successfulRequests

    const durations = logs
      .map((log) => log.duration_ms)
      .filter((d) => d !== null) as number[]
    const avgDuration =
      durations.length > 0
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length
        : 0

    return {
      total_requests: totalRequests,
      successful_requests: successfulRequests,
      failed_requests: failedRequests,
      avg_duration_ms: Math.round(avgDuration),
      recent_usage: logs.slice(0, 20), // Return most recent 20
    }
  } catch (error) {
    console.error('Error in getApiKeyUsageStats:', error)
    throw error
  }
}

/**
 * Check if an API key has a specific permission
 */
export function hasPermission(
  apiKey: ApiKey,
  permission: ApiKeyPermission
): boolean {
  // 'admin:all' grants all permissions
  if (apiKey.permissions.includes('admin:all')) {
    return true
  }

  return apiKey.permissions.includes(permission)
}

/**
 * Clean up old usage logs (older than retention period)
 * Should be run periodically via cron job
 */
export async function cleanupOldUsageLogs(
  retentionDays: number = 90
): Promise<number> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the database function
    const { data, error } = await supabase.rpc('cleanup_old_api_key_usage_logs', {
      retention_days: retentionDays,
    })

    if (error) {
      console.error('Error cleaning up old usage logs:', error)
      throw error
    }

    console.log(`Cleaned up ${data} old API key usage logs`)
    return data || 0
  } catch (error) {
    console.error('Error in cleanupOldUsageLogs:', error)
    throw error
  }
}

// Export configuration constants for testing and documentation
export const API_KEY_CONFIG = {
  KEY_PREFIX,
  API_KEY_LENGTH,
  RATE_LIMIT_WINDOW_MS,
}
