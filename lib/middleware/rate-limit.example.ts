/**
 * Usage examples for rate limiter
 *
 * These examples demonstrate how to use the rate limiter in API routes
 */

import { rateLimiter, withRateLimit, getIdentifier } from './rate-limit'

// Example 1: Manual rate limiting
// File: app/api/some-endpoint/route.ts
export async function POST_Manual(request: Request) {
  // Create rate limiter: 10 requests per minute
  const limiter = rateLimiter({
    maxRequests: 10,
    windowMs: 60000 // 1 minute
  })

  const identifier = getIdentifier(request)
  const result = limiter.check(identifier)

  if (!result.allowed) {
    return Response.json(
      {
        error: 'Prea multe cereri. Încercați din nou mai târziu.',
        resetAt: result.resetAt.toISOString()
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetAt.toISOString()
        }
      }
    )
  }

  // Your API logic here
  return Response.json({ success: true })
}

// Example 2: Using wrapper (recommended)
// File: app/api/some-endpoint/route.ts
const handler = async (request: Request) => {
  // Your API logic here
  const body = await request.json()
  // ... process request ...
  return Response.json({ success: true })
}

export const POST = withRateLimit(
  {
    maxRequests: 10,
    windowMs: 60000 // 1 minute
  },
  handler
)

// Example 3: Different limits for different endpoints
// File: app/api/auth/login/route.ts
export const POST_Login = withRateLimit(
  {
    maxRequests: 5, // Stricter limit for login
    windowMs: 900000 // 15 minutes
  },
  async (request: Request) => {
    const { email, password } = await request.json()
    // ... authentication logic ...
    return Response.json({ success: true })
  }
)

// File: app/api/data/route.ts
export const GET_Data = withRateLimit(
  {
    maxRequests: 100, // More lenient for data fetching
    windowMs: 60000 // 1 minute
  },
  async (request: Request) => {
    // ... fetch data ...
    return Response.json({ data: [] })
  }
)

// Example 4: Using with user ID instead of IP
// File: app/api/protected-endpoint/route.ts
export async function POST_UserBased(request: Request) {
  const limiter = rateLimiter({
    maxRequests: 20,
    windowMs: 60000
  })

  // Get user ID from session/token
  const userId = 'user-123' // Replace with actual user ID from auth

  const result = limiter.check(userId)

  if (!result.allowed) {
    return Response.json(
      { error: 'Prea multe cereri' },
      { status: 429 }
    )
  }

  // Your API logic here
  return Response.json({ success: true })
}

// Example 5: Global rate limiter instance (shared across requests)
// File: lib/rate-limiters.ts
export const apiLimiter = rateLimiter({
  maxRequests: 100,
  windowMs: 60000
})

export const authLimiter = rateLimiter({
  maxRequests: 5,
  windowMs: 900000
})

// Then in your API routes:
// import { apiLimiter } from '@/lib/rate-limiters'
