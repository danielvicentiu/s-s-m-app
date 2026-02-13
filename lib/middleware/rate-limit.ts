/**
 * Simple in-memory rate limiter for API routes
 *
 * Usage:
 * ```ts
 * import { rateLimiter } from '@/lib/middleware/rate-limit'
 *
 * const limiter = rateLimiter({ maxRequests: 10, windowMs: 60000 })
 * const result = await limiter.check(identifier)
 * if (!result.allowed) {
 *   return Response.json({ error: 'Rate limit exceeded' }, { status: 429 })
 * }
 * ```
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

interface RequestRecord {
  count: number
  resetAt: number
}

export class RateLimiter {
  private requests: Map<string, RequestRecord>
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.requests = new Map()
    this.config = config

    // Cleanup expired entries every minute
    setInterval(() => {
      const now = Date.now()
      for (const [key, record] of this.requests.entries()) {
        if (record.resetAt <= now) {
          this.requests.delete(key)
        }
      }
    }, 60000)
  }

  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier (e.g., IP address, user ID)
   * @returns Rate limit result with allowed status, remaining requests, and reset time
   */
  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const record = this.requests.get(identifier)

    // No record or expired record - create new one
    if (!record || record.resetAt <= now) {
      const resetAt = now + this.config.windowMs
      this.requests.set(identifier, {
        count: 1,
        resetAt
      })

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetAt: new Date(resetAt)
      }
    }

    // Record exists and is valid
    if (record.count < this.config.maxRequests) {
      record.count++
      this.requests.set(identifier, record)

      return {
        allowed: true,
        remaining: this.config.maxRequests - record.count,
        resetAt: new Date(record.resetAt)
      }
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(record.resetAt)
    }
  }

  /**
   * Reset rate limit for a specific identifier
   * @param identifier - Unique identifier to reset
   */
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }

  /**
   * Clear all rate limit records
   */
  clear(): void {
    this.requests.clear()
  }
}

/**
 * Factory function to create a rate limiter instance
 * @param config - Rate limit configuration
 * @returns RateLimiter instance
 */
export function rateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config)
}

/**
 * Helper function to extract identifier from request (IP address)
 * @param request - Next.js request object
 * @returns Identifier string (IP address or fallback)
 */
export function getIdentifier(request: Request): string {
  // Try to get IP from various headers (for production behind proxies)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  return (
    cfConnectingIp ||
    realIp ||
    forwardedFor?.split(',')[0].trim() ||
    'unknown'
  )
}

/**
 * Middleware wrapper for API routes with rate limiting
 * @param config - Rate limit configuration
 * @param handler - API route handler function
 * @returns Wrapped handler with rate limiting
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: Request) => Promise<Response>
) {
  const limiter = rateLimiter(config)

  return async (request: Request): Promise<Response> => {
    const identifier = getIdentifier(request)
    const result = limiter.check(identifier)

    // Add rate limit headers
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    headers.set('X-RateLimit-Remaining', result.remaining.toString())
    headers.set('X-RateLimit-Reset', result.resetAt.toISOString())

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Prea multe cereri. Încercați din nou mai târziu.',
          resetAt: result.resetAt.toISOString()
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(headers.entries())
          }
        }
      )
    }

    // Call the original handler
    const response = await handler(request)

    // Add rate limit headers to response
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value)
    }

    return response
  }
}
