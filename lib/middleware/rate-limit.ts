/**
 * Simple in-memory rate limiter
 * Usage: rateLimit(identifier, maxRequests, windowMs)
 * Returns: {success: boolean, remaining: number, resetAt: Date}
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
}

interface RateLimitConfig {
  max: number;
  window: number; // milliseconds
}

// In-memory storage for rate limit entries
const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup interval to remove expired entries (every 60 seconds)
const CLEANUP_INTERVAL_MS = 60000;

// Start cleanup interval
let cleanupInterval: NodeJS.Timeout | null = null;

function startCleanup(): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((entry, key) => {
      if (entry.resetAt < now) {
        rateLimitMap.delete(key);
      }
    });
  }, CLEANUP_INTERVAL_MS);

  // Don't prevent Node.js from exiting
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

// Start cleanup on module load
startCleanup();

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result with success status, remaining count, and reset time
 */
export function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // If no entry exists or window has expired, create new entry
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt,
    });

    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: new Date(resetAt),
    };
  }

  // Entry exists and is still valid
  if (entry.count < maxRequests) {
    entry.count++;
    rateLimitMap.set(identifier, entry);

    return {
      success: true,
      remaining: maxRequests - entry.count,
      resetAt: new Date(entry.resetAt),
    };
  }

  // Rate limit exceeded
  return {
    success: false,
    remaining: 0,
    resetAt: new Date(entry.resetAt),
  };
}

/**
 * Higher-order function to wrap API route handlers with rate limiting
 * @param handler - The API route handler function
 * @param config - Rate limit configuration (max requests, time window)
 * @returns Wrapped handler with rate limiting
 */
export function withRateLimit<T = any>(
  handler: (req: Request, context?: any) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (req: Request, context?: any): Promise<Response> => {
    // Get identifier from request (IP, user ID, etc.)
    const identifier = getIdentifier(req);

    // Check rate limit
    const result = rateLimit(identifier, config.max, config.window);

    // Add rate limit headers to response
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', config.max.toString());
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', result.resetAt.toISOString());

    // If rate limit exceeded, return 429 Too Many Requests
    if (!result.success) {
      const retryAfter = Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
      headers.set('Retry-After', retryAfter.toString());

      return new Response(
        JSON.stringify({
          error: 'Prea multe cereri. Vă rugăm să încercați mai târziu.',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(headers.entries()),
          },
        }
      );
    }

    // Call original handler
    const response = await handler(req, context);

    // Add rate limit headers to successful response
    const newHeaders = new Headers(response.headers);
    headers.forEach((value, key) => {
      newHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}

/**
 * Extract identifier from request (IP address or user ID)
 * Priority: User ID > IP address > 'anonymous'
 */
function getIdentifier(req: Request): string {
  // Try to get IP address from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');

  const ip = forwarded?.split(',')[0].trim() || realIp || cfConnectingIp || 'anonymous';

  return ip;
}

/**
 * Stop cleanup interval (for testing purposes)
 */
export function stopCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

/**
 * Clear all rate limit entries (for testing purposes)
 */
export function clearRateLimits(): void {
  rateLimitMap.clear();
}
