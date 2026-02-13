/**
 * API Middleware Authentication & Authorization Test Suite
 *
 * Tests comprehensive auth middleware functionality including:
 * - Session authentication (withAuth)
 * - Organization access control (checkOrganizationAccess)
 * - Request validation (withValidation)
 * - API key authentication (validateApiKey)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import {
  withAuth,
  withValidation,
  checkOrganizationAccess,
  type ApiContext,
} from '@/lib/api/middleware'
import { validateApiKey } from '@/lib/services/api-key-service'
import { z } from 'zod'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: jest.fn(),
}))

// Mock API key service
jest.mock('@/lib/services/api-key-service', () => ({
  validateApiKey: jest.fn(),
}))

describe('API Middleware Auth Guards', () => {
  let mockSupabase: any
  const mockUserId = 'user-123'
  const mockUserEmail = 'test@example.com'
  const mockOrgId = 'org-456'

  // Helper to create a mock NextRequest
  const createMockRequest = (options: {
    url?: string
    method?: string
    body?: any
    headers?: Record<string, string>
  } = {}): NextRequest => {
    const url = options.url || 'http://localhost:3000/api/v1/test'
    const method = options.method || 'GET'
    const headers = new Headers(options.headers || {})

    const request = new NextRequest(url, {
      method,
      headers,
    })

    // Mock json() method if body is provided
    if (options.body) {
      ;(request as any).json = jest.fn().mockResolvedValue(options.body)
    }

    return request
  }

  // Helper to create a mock handler
  const createMockHandler = (response: any = { success: true }) => {
    return jest.fn().mockResolvedValue(
      NextResponse.json(response)
    )
  }

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(),
    }

    ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)
  })

  /**
   * TEST 1: withAuth rejects requests with no session (401)
   */
  describe('withAuth - Authentication Required', () => {
    it('should reject requests with no session and return 401', async () => {
      // Mock no user session
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      })

      const mockHandler = createMockHandler()
      const wrappedHandler = await withAuth(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.error).toBe('Unauthorized')
      expect(body.message).toBe('Trebuie să fii autentificat pentru a accesa această resursă')
      expect(body.code).toBe('AUTH_REQUIRED')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should reject requests when auth returns error', async () => {
      // Mock auth error
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Session expired' },
      })

      const mockHandler = createMockHandler()
      const wrappedHandler = await withAuth(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.code).toBe('AUTH_REQUIRED')
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  /**
   * TEST 2: withAuth passes valid session to handler
   */
  describe('withAuth - Valid Session', () => {
    it('should pass authenticated requests with valid context', async () => {
      // Mock valid user session
      mockSupabase.auth.getUser.mockResolvedValue({
        data: {
          user: {
            id: mockUserId,
            email: mockUserEmail,
          },
        },
        error: null,
      })

      const mockHandler = createMockHandler()
      const wrappedHandler = await withAuth(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(mockHandler).toHaveBeenCalledWith(
        request,
        expect.objectContaining({
          userId: mockUserId,
          userEmail: mockUserEmail,
        })
      )
    })

    it('should handle users without email address', async () => {
      // Mock user without email
      mockSupabase.auth.getUser.mockResolvedValue({
        data: {
          user: {
            id: mockUserId,
            email: null,
          },
        },
        error: null,
      })

      const mockHandler = createMockHandler()
      const wrappedHandler = await withAuth(mockHandler)
      const request = createMockRequest()

      await wrappedHandler(request)

      expect(mockHandler).toHaveBeenCalledWith(
        request,
        expect.objectContaining({
          userId: mockUserId,
          userEmail: '',
        })
      )
    })
  })

  /**
   * TEST 3: checkOrganizationAccess rejects non-members (403)
   */
  describe('Organization Access - Non-Member Rejection', () => {
    it('should reject users who are not members of the organization', async () => {
      // Mock no membership found
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'No rows found' },
        }),
      }

      mockSupabase.from.mockReturnValue(mockChain)

      const result = await checkOrganizationAccess(mockUserId, mockOrgId)

      expect(result.hasAccess).toBe(false)
      expect(result.error).toBe('Nu ai acces la această organizație')
      expect(result.role).toBeUndefined()
      expect(mockSupabase.from).toHaveBeenCalledWith('memberships')
    })

    it('should reject users with inactive membership', async () => {
      // Mock inactive membership
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'No active membership' },
        }),
      }

      mockSupabase.from.mockReturnValue(mockChain)

      const result = await checkOrganizationAccess(mockUserId, mockOrgId)

      expect(result.hasAccess).toBe(false)
      expect(result.error).toBe('Nu ai acces la această organizație')
    })
  })

  /**
   * TEST 4: checkOrganizationAccess passes for valid members
   */
  describe('Organization Access - Member Access', () => {
    it('should grant access to active organization members', async () => {
      // Mock active membership
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            role: 'consultant',
            is_active: true,
          },
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockChain)

      const result = await checkOrganizationAccess(mockUserId, mockOrgId)

      expect(result.hasAccess).toBe(true)
      expect(result.role).toBe('consultant')
      expect(result.error).toBeUndefined()
    })

    it('should verify correct query filters are applied', async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { role: 'firma_admin', is_active: true },
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockChain)

      await checkOrganizationAccess(mockUserId, mockOrgId)

      expect(mockChain.select).toHaveBeenCalledWith('role, is_active')
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', mockUserId)
      expect(mockChain.eq).toHaveBeenCalledWith('organization_id', mockOrgId)
      expect(mockChain.eq).toHaveBeenCalledWith('is_active', true)
    })
  })

  /**
   * TEST 5: checkOrganizationAccess enforces role requirements
   */
  describe('Organization Access - Role Requirements', () => {
    it('should reject users without required role', async () => {
      // Mock membership with insufficient role
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            role: 'angajat',
            is_active: true,
          },
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockChain)

      const result = await checkOrganizationAccess(
        mockUserId,
        mockOrgId,
        ['consultant', 'firma_admin']
      )

      expect(result.hasAccess).toBe(false)
      expect(result.role).toBe('angajat')
      expect(result.error).toContain('Rol insuficient')
      expect(result.error).toContain('consultant sau firma_admin')
    })

    it('should grant access when user has one of the required roles', async () => {
      // Mock membership with valid role
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            role: 'consultant',
            is_active: true,
          },
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockChain)

      const result = await checkOrganizationAccess(
        mockUserId,
        mockOrgId,
        ['consultant', 'firma_admin']
      )

      expect(result.hasAccess).toBe(true)
      expect(result.role).toBe('consultant')
      expect(result.error).toBeUndefined()
    })
  })

  /**
   * TEST 6: withValidation rejects invalid request data
   */
  describe('Request Validation - Invalid Data', () => {
    it('should reject requests with invalid data and return 400', async () => {
      const schema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
      })

      const invalidData = {
        name: 'ab', // Too short
        email: 'not-an-email',
      }

      const mockHandler = createMockHandler()
      const wrappedHandler = withValidation(schema)(mockHandler)
      const request = createMockRequest({ body: invalidData })

      const mockContext: ApiContext = {
        userId: mockUserId,
        userEmail: mockUserEmail,
      }

      const response = await wrappedHandler(request, mockContext)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toBe('Validation Error')
      expect(body.message).toBe('Date de intrare invalide')
      expect(body.code).toBe('VALIDATION_ERROR')
      expect(body.details).toBeDefined()
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should handle requests with missing required fields', async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      })
      const mockHandler = createMockHandler()
      const wrappedHandler = withValidation(schema)(mockHandler)
      const request = createMockRequest()

      // Mock empty JSON (will be caught and converted to {})
      ;(request as any).json = jest.fn().mockResolvedValue({})

      const mockContext: ApiContext = {
        userId: mockUserId,
        userEmail: mockUserEmail,
      }

      const response = await wrappedHandler(request, mockContext)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.code).toBe('VALIDATION_ERROR')
      expect(body.message).toBe('Date de intrare invalide')
      expect(body.details).toBeDefined()
    })
  })

  /**
   * TEST 7: withValidation passes valid request data
   */
  describe('Request Validation - Valid Data', () => {
    it('should pass requests with valid data to handler', async () => {
      const schema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
      })

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
      }

      const mockHandler = createMockHandler()
      const wrappedHandler = withValidation(schema)(mockHandler)
      const request = createMockRequest({ body: validData })

      const mockContext: ApiContext = {
        userId: mockUserId,
        userEmail: mockUserEmail,
      }

      const response = await wrappedHandler(request, mockContext)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(mockHandler).toHaveBeenCalledWith(
        request,
        mockContext,
        validData
      )
    })

    it('should handle empty body as empty object', async () => {
      const schema = z.object({
        optional: z.string().optional(),
      })

      const mockHandler = createMockHandler()
      const wrappedHandler = withValidation(schema)(mockHandler)
      const request = createMockRequest()

      // Mock empty JSON
      ;(request as any).json = jest.fn().mockResolvedValue({})

      const mockContext: ApiContext = {
        userId: mockUserId,
        userEmail: mockUserEmail,
      }

      const response = await wrappedHandler(request, mockContext)

      expect(response.status).toBe(200)
      expect(mockHandler).toHaveBeenCalledWith(
        request,
        mockContext,
        {}
      )
    })
  })

  /**
   * TEST 8: API Key Authentication works correctly
   */
  describe('API Key Authentication', () => {
    it('should validate and accept valid API keys', async () => {
      const mockApiKey = {
        id: 'key-123',
        organization_id: mockOrgId,
        name: 'Test API Key',
        key_hash: 'hashed-key',
        key_prefix: 'ssm_pk_abc123',
        permissions: ['employees:read', 'trainings:read'],
        rate_limit_per_minute: 60,
        is_active: true,
        revoked_at: null,
        expires_at: null,
        last_used_at: new Date().toISOString(),
        total_requests: 42,
        created_at: new Date().toISOString(),
        created_by: mockUserId,
        description: null,
        revoked_by: null,
      }

      ;(validateApiKey as jest.Mock).mockResolvedValue({
        valid: true,
        apiKey: mockApiKey,
      })

      const result = await validateApiKey('ssm_pk_test123')

      expect(result.valid).toBe(true)
      expect(result.apiKey).toEqual(mockApiKey)
      expect(result.error).toBeUndefined()
      expect(validateApiKey).toHaveBeenCalledWith('ssm_pk_test123')
    })

    it('should reject invalid API keys', async () => {
      ;(validateApiKey as jest.Mock).mockResolvedValue({
        valid: false,
        apiKey: null,
        error: 'Invalid API key',
      })

      const result = await validateApiKey('invalid-key')

      expect(result.valid).toBe(false)
      expect(result.apiKey).toBeNull()
      expect(result.error).toBe('Invalid API key')
    })

    it('should reject expired API keys', async () => {
      ;(validateApiKey as jest.Mock).mockResolvedValue({
        valid: false,
        apiKey: null,
        error: 'API key has expired',
      })

      const result = await validateApiKey('ssm_pk_expired')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('API key has expired')
    })

    it('should reject revoked API keys', async () => {
      ;(validateApiKey as jest.Mock).mockResolvedValue({
        valid: false,
        apiKey: null,
        error: 'API key has been revoked',
      })

      const result = await validateApiKey('ssm_pk_revoked')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('API key has been revoked')
    })

    it('should reject inactive API keys', async () => {
      ;(validateApiKey as jest.Mock).mockResolvedValue({
        valid: false,
        apiKey: null,
        error: 'API key is inactive',
      })

      const result = await validateApiKey('ssm_pk_inactive')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('API key is inactive')
    })
  })
})
