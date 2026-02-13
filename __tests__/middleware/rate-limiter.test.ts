/**
 * Rate Limiter Middleware Test Suite
 *
 * Tests comprehensive rate limiting functionality including:
 * - Allows requests under limit
 * - Blocks requests over limit
 * - Resets after time window expires
 * - Different limits per route
 * - Correct X-RateLimit-* headers
 * - Concurrent request handling
 * - Custom identifier functions
 * - Skip conditions
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  withRateLimit,
  checkRateLimit,
  incrementRateLimit,
  clearRateLimitStore,
  getRateLimitStoreSize,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
} from '@/lib/middleware/rate-limiter';

describe('Rate Limiter Middleware', () => {
  // Helper to create a mock NextRequest
  const createMockRequest = (options: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
  } = {}): NextRequest => {
    const url = options.url || 'http://localhost:3000/api/test';
    const method = options.method || 'GET';
    const headers = new Headers(options.headers || {});

    return new NextRequest(url, {
      method,
      headers,
    });
  };

  // Helper to create a mock handler
  const createMockHandler = (response: any = { success: true }) => {
    return jest.fn().mockResolvedValue(NextResponse.json(response));
  };

  // Helper to advance time (for testing time-based resets)
  const advanceTime = (ms: number) => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now + ms);
  };

  beforeEach(() => {
    // Clear rate limit store before each test
    clearRateLimitStore();
    // Clear all mocks
    jest.clearAllMocks();
    // Reset Date.now mock
    jest.spyOn(Date, 'now').mockRestore();
  });

  afterEach(() => {
    // Cleanup
    jest.restoreAllMocks();
  });

  /**
   * TEST 1: Allows requests under the limit
   */
  describe('Under Limit Behavior', () => {
    it('should allow requests under the rate limit', async () => {
      const config: RateLimitConfig = {
        maxRequests: 5,
        windowMs: 60000, // 1 minute
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);
      const request = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      // Make 5 requests (all should succeed)
      for (let i = 0; i < 5; i++) {
        const response = await wrappedHandler(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
        expect(response.headers.get('X-RateLimit-Remaining')).toBe(
          String(4 - i)
        );

        // Clone response before reading body to avoid "Body has already been read" error
        const body = await response.clone().json();
        expect(body.success).toBe(true);
      }

      expect(mockHandler).toHaveBeenCalledTimes(5);
    });

    it('should track different IPs separately', async () => {
      const config: RateLimitConfig = {
        maxRequests: 3,
        windowMs: 60000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);

      // IP 1 makes 3 requests
      const request1 = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });
      for (let i = 0; i < 3; i++) {
        const response = await wrappedHandler(request1);
        expect(response.status).toBe(200);
      }

      // IP 2 should also be able to make 3 requests
      const request2 = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.2' },
      });
      for (let i = 0; i < 3; i++) {
        const response = await wrappedHandler(request2);
        expect(response.status).toBe(200);
      }

      expect(mockHandler).toHaveBeenCalledTimes(6);
    });
  });

  /**
   * TEST 2: Blocks requests over the limit
   */
  describe('Over Limit Behavior', () => {
    it('should block requests that exceed the rate limit', async () => {
      const config: RateLimitConfig = {
        maxRequests: 3,
        windowMs: 60000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);
      const request = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      // Make 3 successful requests
      for (let i = 0; i < 3; i++) {
        const response = await wrappedHandler(request);
        expect(response.status).toBe(200);
      }

      // 4th request should be blocked
      const blockedResponse = await wrappedHandler(request);
      const blockedBody = await blockedResponse.json();

      expect(blockedResponse.status).toBe(429);
      expect(blockedBody.error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(blockedBody.error.message).toBe('Rate limit exceeded');
      expect(blockedBody.error.details.limit).toBe(3);
      expect(blockedResponse.headers.get('Retry-After')).toBeDefined();

      // Handler should only be called 3 times (not for the blocked request)
      expect(mockHandler).toHaveBeenCalledTimes(3);
    });

    it('should return correct error details when rate limit exceeded', async () => {
      const config: RateLimitConfig = {
        maxRequests: 1,
        windowMs: 30000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);
      const request = createMockRequest({
        headers: { 'x-forwarded-for': '10.0.0.1' },
      });

      // First request succeeds
      await wrappedHandler(request);

      // Second request is blocked
      const response = await wrappedHandler(request);
      const body = await response.json();

      expect(response.status).toBe(429);
      expect(body.error).toMatchObject({
        message: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        status: 429,
        details: {
          limit: 1,
          windowMs: 30000,
          retryAfter: expect.any(Number),
        },
      });
    });
  });

  /**
   * TEST 3: Resets after time window expires
   */
  describe('Time Window Reset', () => {
    it('should reset rate limit after the time window expires', async () => {
      const config: RateLimitConfig = {
        maxRequests: 2,
        windowMs: 1000, // 1 second window
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);
      const request = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      // Make 2 requests (reach limit)
      await wrappedHandler(request);
      await wrappedHandler(request);

      // 3rd request should be blocked
      let response = await wrappedHandler(request);
      expect(response.status).toBe(429);

      // Advance time past the window
      advanceTime(1100);

      // Should now allow requests again
      response = await wrappedHandler(request);
      expect(response.status).toBe(200);

      response = await wrappedHandler(request);
      expect(response.status).toBe(200);

      expect(mockHandler).toHaveBeenCalledTimes(4);
    });

    it('should maintain separate reset times for different identifiers', async () => {
      const config: RateLimitConfig = {
        maxRequests: 1,
        windowMs: 2000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);

      // IP1 makes a request at T=0
      const request1 = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });
      await wrappedHandler(request1);

      // Advance time by 1 second
      advanceTime(1000);

      // IP2 makes a request at T=1000
      const request2 = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.2' },
      });
      await wrappedHandler(request2);

      // Advance time by another 1.5 seconds (T=2500)
      // IP1's window should have reset (2000ms from T=0)
      // IP2's window should NOT have reset (only 1500ms from T=1000)
      advanceTime(1500);

      // IP1 should be allowed
      let response = await wrappedHandler(request1);
      expect(response.status).toBe(200);

      // IP2 should still be blocked
      response = await wrappedHandler(request2);
      expect(response.status).toBe(429);
    });
  });

  /**
   * TEST 4: Different limits per route
   */
  describe('Per-Route Limits', () => {
    it('should enforce different limits for different route configurations', async () => {
      const strictConfig: RateLimitConfig = {
        maxRequests: 2,
        windowMs: 60000,
      };

      const publicConfig: RateLimitConfig = {
        maxRequests: 10,
        windowMs: 60000,
      };

      const strictHandler = createMockHandler({ route: 'strict' });
      const publicHandler = createMockHandler({ route: 'public' });

      const wrappedStrict = withRateLimit(strictConfig)(strictHandler);
      const wrappedPublic = withRateLimit(publicConfig)(publicHandler);

      // Use different IPs to avoid cross-route interference
      const strictRequest = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const publicRequest = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.2' },
      });

      // Strict route: only 2 requests allowed
      await wrappedStrict(strictRequest);
      await wrappedStrict(strictRequest);
      let response = await wrappedStrict(strictRequest);
      expect(response.status).toBe(429);

      // Public route: 10 requests allowed
      for (let i = 0; i < 10; i++) {
        response = await wrappedPublic(publicRequest);
        expect(response.status).toBe(200);
      }

      response = await wrappedPublic(publicRequest);
      expect(response.status).toBe(429);
    });

    it('should use predefined RATE_LIMIT_CONFIGS correctly', () => {
      expect(RATE_LIMIT_CONFIGS.standard).toEqual({
        maxRequests: 60,
        windowMs: 60000,
      });

      expect(RATE_LIMIT_CONFIGS.strict).toEqual({
        maxRequests: 10,
        windowMs: 60000,
      });

      expect(RATE_LIMIT_CONFIGS.public).toEqual({
        maxRequests: 100,
        windowMs: 60000,
      });

      expect(RATE_LIMIT_CONFIGS.webhook).toEqual({
        maxRequests: 1000,
        windowMs: 60000,
      });
    });
  });

  /**
   * TEST 5: Returns correct X-RateLimit-* headers
   */
  describe('Rate Limit Headers', () => {
    it('should return correct X-RateLimit-Remaining header values', async () => {
      const config: RateLimitConfig = {
        maxRequests: 5,
        windowMs: 60000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);
      const request = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      // First request: 4 remaining
      let response = await wrappedHandler(request);
      expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('4');
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined();

      // Second request: 3 remaining
      response = await wrappedHandler(request);
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('3');

      // Third request: 2 remaining
      response = await wrappedHandler(request);
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('2');

      // Fourth request: 1 remaining
      response = await wrappedHandler(request);
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('1');

      // Fifth request: 0 remaining
      response = await wrappedHandler(request);
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');

      // Sixth request: blocked, should still have headers
      response = await wrappedHandler(request);
      expect(response.status).toBe(429);
      expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response.headers.get('Retry-After')).toBeDefined();
    });

    it('should include X-RateLimit-Reset header with correct timestamp', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      const config: RateLimitConfig = {
        maxRequests: 3,
        windowMs: 60000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);
      const request = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const response = await wrappedHandler(request);
      const resetHeader = response.headers.get('X-RateLimit-Reset');

      expect(resetHeader).toBeDefined();
      const resetTime = parseInt(resetHeader!, 10);

      // Reset time should be approximately now + windowMs (in seconds)
      const expectedReset = Math.ceil((now + 60000) / 1000);
      expect(resetTime).toBe(expectedReset);
    });

    it('should include Retry-After header when rate limit exceeded', async () => {
      const config: RateLimitConfig = {
        maxRequests: 1,
        windowMs: 30000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);
      const request = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      // First request succeeds
      await wrappedHandler(request);

      // Second request is blocked
      const response = await wrappedHandler(request);
      const retryAfter = response.headers.get('Retry-After');

      expect(retryAfter).toBeDefined();
      const retrySeconds = parseInt(retryAfter!, 10);
      expect(retrySeconds).toBeGreaterThan(0);
      expect(retrySeconds).toBeLessThanOrEqual(30); // Should be <= window duration
    });
  });

  /**
   * TEST 6: Handles concurrent requests correctly
   */
  describe('Concurrent Requests', () => {
    it('should handle concurrent requests from the same IP correctly', async () => {
      const config: RateLimitConfig = {
        maxRequests: 5,
        windowMs: 60000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);
      const request = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      // Make 10 concurrent requests
      const promises = Array(10)
        .fill(null)
        .map(() => wrappedHandler(request));

      const responses = await Promise.all(promises);

      // Count successful and blocked requests
      const successCount = responses.filter((r) => r.status === 200).length;
      const blockedCount = responses.filter((r) => r.status === 429).length;

      // Should have exactly 5 successful and 5 blocked
      expect(successCount).toBe(5);
      expect(blockedCount).toBe(5);
    });

    it('should handle concurrent requests from different IPs correctly', async () => {
      const config: RateLimitConfig = {
        maxRequests: 2,
        windowMs: 60000,
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);

      // Create requests from 5 different IPs, 3 requests each
      const promises: Promise<NextResponse>[] = [];
      for (let ip = 1; ip <= 5; ip++) {
        for (let req = 0; req < 3; req++) {
          const request = createMockRequest({
            headers: { 'x-forwarded-for': `192.168.1.${ip}` },
          });
          promises.push(wrappedHandler(request));
        }
      }

      const responses = await Promise.all(promises);

      // Each IP should have 2 successful and 1 blocked
      // Total: 10 successful, 5 blocked
      const successCount = responses.filter((r) => r.status === 200).length;
      const blockedCount = responses.filter((r) => r.status === 429).length;

      expect(successCount).toBe(10);
      expect(blockedCount).toBe(5);
    });
  });

  /**
   * TEST 7: Custom identifier function
   */
  describe('Custom Identifier', () => {
    it('should use custom identifier function when provided', async () => {
      // Custom identifier based on API key header
      const config: RateLimitConfig = {
        maxRequests: 2,
        windowMs: 60000,
        identifier: (req: NextRequest) => {
          return req.headers.get('x-api-key') || 'anonymous';
        },
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);

      // Requests with API key 'key-123'
      const request1 = createMockRequest({
        headers: {
          'x-api-key': 'key-123',
          'x-forwarded-for': '192.168.1.1',
        },
      });

      // Make 2 requests with key-123 (should succeed)
      await wrappedHandler(request1);
      await wrappedHandler(request1);

      // 3rd request with key-123 should be blocked
      let response = await wrappedHandler(request1);
      expect(response.status).toBe(429);

      // Request with different API key should succeed (different identifier)
      const request2 = createMockRequest({
        headers: {
          'x-api-key': 'key-456',
          'x-forwarded-for': '192.168.1.1', // Same IP, different key
        },
      });

      response = await wrappedHandler(request2);
      expect(response.status).toBe(200);
    });
  });

  /**
   * TEST 8: Skip condition
   */
  describe('Skip Condition', () => {
    it('should skip rate limiting when skip function returns true', async () => {
      // Skip rate limiting for requests with 'x-admin' header
      const config: RateLimitConfig = {
        maxRequests: 2,
        windowMs: 60000,
        skip: (req: NextRequest) => {
          return req.headers.get('x-admin') === 'true';
        },
      };

      const mockHandler = createMockHandler();
      const wrappedHandler = withRateLimit(config)(mockHandler);

      // Admin requests should bypass rate limiting
      const adminRequest = createMockRequest({
        headers: {
          'x-admin': 'true',
          'x-forwarded-for': '192.168.1.1',
        },
      });

      // Make 10 admin requests (all should succeed)
      for (let i = 0; i < 10; i++) {
        const response = await wrappedHandler(adminRequest);
        expect(response.status).toBe(200);
      }

      // Regular requests should still be rate limited
      const regularRequest = createMockRequest({
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      await wrappedHandler(regularRequest);
      await wrappedHandler(regularRequest);

      // 3rd regular request should be blocked
      const response = await wrappedHandler(regularRequest);
      expect(response.status).toBe(429);
    });
  });

  /**
   * TEST 9: Utility functions
   */
  describe('Utility Functions', () => {
    it('should clear rate limit store', () => {
      const config: RateLimitConfig = {
        maxRequests: 5,
        windowMs: 60000,
      };

      // Add some entries
      checkRateLimit('test-id-1', config);
      incrementRateLimit('test-id-1', config.windowMs);
      checkRateLimit('test-id-2', config);
      incrementRateLimit('test-id-2', config.windowMs);

      expect(getRateLimitStoreSize()).toBeGreaterThan(0);

      clearRateLimitStore();

      expect(getRateLimitStoreSize()).toBe(0);
    });

    it('should correctly check and increment rate limits', () => {
      const config: RateLimitConfig = {
        maxRequests: 3,
        windowMs: 60000,
      };

      // First check: allowed with 2 remaining
      let result = checkRateLimit('test-id', config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
      expect(result.limit).toBe(3);

      incrementRateLimit('test-id', config.windowMs);

      // Second check: allowed with 1 remaining
      result = checkRateLimit('test-id', config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(1);

      incrementRateLimit('test-id', config.windowMs);

      // Third check: allowed with 0 remaining
      result = checkRateLimit('test-id', config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(0);

      incrementRateLimit('test-id', config.windowMs);

      // Fourth check: not allowed
      result = checkRateLimit('test-id', config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeDefined();
    });
  });
});
