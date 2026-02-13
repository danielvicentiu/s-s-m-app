/**
 * Rate Limits Configuration
 *
 * Defines rate limiting rules per API endpoint and subscription plan.
 * Used by the rate limiting middleware to enforce request limits.
 */

export type PlanType = 'starter' | 'pro' | 'enterprise';

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Time window in milliseconds (derived)
   */
  windowMs: number;
}

export interface EndpointRateLimits {
  starter: RateLimitConfig;
  pro: RateLimitConfig;
  enterprise: RateLimitConfig;
}

/**
 * Rate limit configurations per endpoint
 * Format: requests per hour
 */
export const RATE_LIMITS: Record<string, EndpointRateLimits> = {
  // Employee management endpoints
  'api/employees': {
    starter: {
      maxRequests: 100,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    pro: {
      maxRequests: 1000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    enterprise: {
      maxRequests: 10000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
  },

  // Training management endpoints
  'api/trainings': {
    starter: {
      maxRequests: 100,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    pro: {
      maxRequests: 1000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    enterprise: {
      maxRequests: 10000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
  },

  // Report generation endpoints
  'api/reports': {
    starter: {
      maxRequests: 100,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    pro: {
      maxRequests: 1000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    enterprise: {
      maxRequests: 10000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
  },

  // Export endpoints (typically more resource-intensive)
  'api/export': {
    starter: {
      maxRequests: 100,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    pro: {
      maxRequests: 1000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    enterprise: {
      maxRequests: 10000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
  },

  // Import endpoints (typically more resource-intensive)
  'api/import': {
    starter: {
      maxRequests: 100,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    pro: {
      maxRequests: 1000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
    enterprise: {
      maxRequests: 10000,
      windowSeconds: 3600,
      windowMs: 3600000,
    },
  },
};

/**
 * Get rate limit configuration for a specific endpoint and plan
 */
export function getRateLimit(
  endpoint: string,
  plan: PlanType
): RateLimitConfig | null {
  const endpointLimits = RATE_LIMITS[endpoint];
  if (!endpointLimits) {
    return null;
  }
  return endpointLimits[plan];
}

/**
 * Get all available endpoints with rate limits
 */
export function getAvailableEndpoints(): string[] {
  return Object.keys(RATE_LIMITS);
}

/**
 * Default rate limit for endpoints not explicitly configured
 */
export const DEFAULT_RATE_LIMIT: EndpointRateLimits = {
  starter: {
    maxRequests: 100,
    windowSeconds: 3600,
    windowMs: 3600000,
  },
  pro: {
    maxRequests: 1000,
    windowSeconds: 3600,
    windowMs: 3600000,
  },
  enterprise: {
    maxRequests: 10000,
    windowSeconds: 3600,
    windowMs: 3600000,
  },
};
