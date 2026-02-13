/**
 * Auth Guard Middleware Test Suite
 *
 * Tests comprehensive authentication and authorization middleware including:
 * - withAuth: Basic authentication checks
 * - withOrgAccess: Organization membership verification
 * - withAdmin: Admin role verification
 * - withApiKey: API key authentication
 *
 * All Supabase calls are mocked to ensure fast, isolated tests.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  withAuth,
  withOrgAccess,
  withAdmin,
  withApiKey,
  checkOrganizationAccess,
  type ApiContext,
} from '@/lib/api/middleware'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: jest.fn(),
}))

// Mock API key service
jest.mock('@/lib/services/api-key-service', () => ({
  verifyApiKey: jest.fn(),
}))

import { createSupabaseServer } from '@/lib/supabase/server'
import { verifyApiKey } from '@/lib/services/api-key-service'

describe('Auth Guard Middleware', () => {
  // Helper to create a mock NextRequest
  const createMockRequest = (options: {
    url?: string
    method?: string
    headers?: Record<string, string>
  } = {}): NextRequest => {
    const url = options.url || 'http://localhost:3000/api/v1/test'
    const method = options.method || 'GET'
    const headers = new Headers(options.headers || {})

    return new NextRequest(url, {
      method,
      headers,
    })
  }

  // Helper to create a mock handler
  const createMockHandler = (response: any = { success: true }) => {
    return jest.fn().mockResolvedValue(NextResponse.json(response))
  }

  // Helper to create mock Supabase client
  const createMockSupabase = () => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  /**
   * TEST 1: withAuth rejects requests with no session (401)
   */
  describe('withAuth - No Session', () => {
    it('should reject requests when user is not authenticated', async () => {
      const mockSupabase = createMockSupabase()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const mockHandler = createMockHandler()
      const wrappedHandler = withAuth(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.error).toBe('Unauthorized')
      expect(body.code).toBe('AUTH_REQUIRED')
      expect(body.message).toBe('Trebuie să fii autentificat pentru a accesa această resursă')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should reject requests when user object is null', async () => {
      const mockSupabase = createMockSupabase()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const mockHandler = createMockHandler()
      const wrappedHandler = withAuth(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.code).toBe('AUTH_REQUIRED')
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  /**
   * TEST 2: withAuth passes requests with valid session
   */
  describe('withAuth - Valid Session', () => {
    it('should allow requests when user is authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      const mockSupabase = createMockSupabase()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const mockHandler = createMockHandler({ data: 'success' })
      const wrappedHandler = withAuth(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toBe('success')
      expect(mockHandler).toHaveBeenCalledTimes(1)

      // Verify context was created correctly
      const context: ApiContext = mockHandler.mock.calls[0][1]
      expect(context.userId).toBe('user-123')
      expect(context.userEmail).toBe('test@example.com')
    })

    it('should handle users without email', async () => {
      const mockUser = {
        id: 'user-456',
        email: undefined,
      }

      const mockSupabase = createMockSupabase()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const mockHandler = createMockHandler()
      const wrappedHandler = withAuth(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request)

      expect(response.status).toBe(200)
      expect(mockHandler).toHaveBeenCalledTimes(1)

      const context: ApiContext = mockHandler.mock.calls[0][1]
      expect(context.userId).toBe('user-456')
      expect(context.userEmail).toBe('')
    })
  })

  /**
   * TEST 3: withOrgAccess rejects non-members (403)
   */
  describe('withOrgAccess - Non-Member', () => {
    it('should reject requests when user is not a member of the organization', async () => {
      const mockSupabase = createMockSupabase()
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'No membership found' },
                }),
              }),
            }),
          }),
        }),
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const context: ApiContext = {
        userId: 'user-123',
        userEmail: 'test@example.com',
      }

      const mockHandler = createMockHandler()
      const wrappedHandler = withOrgAccess(mockHandler)
      const request = createMockRequest({
        url: 'http://localhost:3000/api/v1/organizations/org-456/employees',
      })

      const response = await wrappedHandler(request, context)
      const body = await response.json()

      expect(response.status).toBe(403)
      expect(body.error).toBe('Forbidden')
      expect(body.code).toBe('ORG_ACCESS_DENIED')
      expect(body.message).toBe('Nu ai acces la această organizație')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should reject requests when organization ID is missing from URL', async () => {
      const context: ApiContext = {
        userId: 'user-123',
        userEmail: 'test@example.com',
      }

      const mockHandler = createMockHandler()
      const wrappedHandler = withOrgAccess(mockHandler)
      const request = createMockRequest({
        url: 'http://localhost:3000/api/v1/employees',
      })

      const response = await wrappedHandler(request, context)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toBe('Bad Request')
      expect(body.code).toBe('ORG_ID_REQUIRED')
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  /**
   * TEST 4: withOrgAccess passes requests for organization members
   */
  describe('withOrgAccess - Valid Member', () => {
    it('should allow requests when user is a member of the organization', async () => {
      const mockMembership = {
        role: 'firma_admin',
        is_active: true,
      }

      const mockSupabase = createMockSupabase()
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockMembership,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const context: ApiContext = {
        userId: 'user-123',
        userEmail: 'test@example.com',
      }

      const mockHandler = createMockHandler({ data: 'organization data' })
      const wrappedHandler = withOrgAccess(mockHandler)
      const request = createMockRequest({
        url: 'http://localhost:3000/api/v1/organizations/org-456/employees',
      })

      const response = await wrappedHandler(request, context)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toBe('organization data')
      expect(mockHandler).toHaveBeenCalledTimes(1)

      // Verify context was enriched with org data
      const enrichedContext: ApiContext = mockHandler.mock.calls[0][1]
      expect(enrichedContext.organizationId).toBe('org-456')
      expect(enrichedContext.role).toBe('firma_admin')
    })

    it('should extract organization ID from various URL patterns', async () => {
      const mockMembership = {
        role: 'consultant',
        is_active: true,
      }

      const mockSupabase = createMockSupabase()
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockMembership,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const context: ApiContext = {
        userId: 'user-789',
        userEmail: 'consultant@example.com',
      }

      const mockHandler = createMockHandler()
      const wrappedHandler = withOrgAccess(mockHandler)

      // Test different URL patterns
      const urls = [
        'http://localhost:3000/api/v1/organizations/org-123/trainings',
        'http://localhost:3000/api/v1/organizations/org-123/employees/emp-456',
        'http://localhost:3000/api/v1/organizations/org-123',
      ]

      for (const url of urls) {
        const request = createMockRequest({ url })
        const response = await wrappedHandler(request, context)
        expect(response.status).toBe(200)
      }
    })
  })

  /**
   * TEST 5: withAdmin rejects non-admin users (403)
   */
  describe('withAdmin - Non-Admin', () => {
    it('should reject requests from users with employee role', async () => {
      const context: ApiContext = {
        userId: 'user-123',
        userEmail: 'employee@example.com',
        organizationId: 'org-456',
        role: 'angajat',
      }

      const mockHandler = createMockHandler()
      const wrappedHandler = withAdmin(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request, context)
      const body = await response.json()

      expect(response.status).toBe(403)
      expect(body.error).toBe('Forbidden')
      expect(body.code).toBe('ADMIN_REQUIRED')
      expect(body.message).toBe('Această acțiune necesită rol de administrator')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should reject requests when role information is missing', async () => {
      const context: ApiContext = {
        userId: 'user-123',
        userEmail: 'test@example.com',
        organizationId: 'org-456',
      }

      const mockHandler = createMockHandler()
      const wrappedHandler = withAdmin(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request, context)
      const body = await response.json()

      expect(response.status).toBe(403)
      expect(body.code).toBe('ROLE_INFO_MISSING')
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  /**
   * TEST 6: withAdmin passes requests from admin users
   */
  describe('withAdmin - Valid Admin', () => {
    it('should allow requests from consultant role', async () => {
      const context: ApiContext = {
        userId: 'user-123',
        userEmail: 'consultant@example.com',
        organizationId: 'org-456',
        role: 'consultant',
      }

      const mockHandler = createMockHandler({ data: 'admin data' })
      const wrappedHandler = withAdmin(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request, context)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toBe('admin data')
      expect(mockHandler).toHaveBeenCalledTimes(1)
    })

    it('should allow requests from firma_admin role', async () => {
      const context: ApiContext = {
        userId: 'user-789',
        userEmail: 'admin@company.com',
        organizationId: 'org-456',
        role: 'firma_admin',
      }

      const mockHandler = createMockHandler({ data: 'admin data' })
      const wrappedHandler = withAdmin(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request, context)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toBe('admin data')
      expect(mockHandler).toHaveBeenCalledTimes(1)
    })
  })

  /**
   * TEST 7: withApiKey rejects invalid API keys (401)
   */
  describe('withApiKey - Invalid Key', () => {
    it('should reject requests without API key header', async () => {
      const mockHandler = createMockHandler()
      const wrappedHandler = withApiKey(mockHandler)
      const request = createMockRequest()

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.error).toBe('Unauthorized')
      expect(body.code).toBe('API_KEY_REQUIRED')
      expect(body.message).toBe('API key lipsește. Folosește header X-API-Key')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should reject requests with invalid API key', async () => {
      ;(verifyApiKey as jest.Mock).mockResolvedValue(null)

      const mockHandler = createMockHandler()
      const wrappedHandler = withApiKey(mockHandler)
      const request = createMockRequest({
        headers: { 'X-API-Key': 'invalid-key-12345' },
      })

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.code).toBe('API_KEY_INVALID')
      expect(body.message).toBe('API key invalid sau expirat')
      expect(mockHandler).not.toHaveBeenCalled()
      expect(verifyApiKey).toHaveBeenCalledWith('invalid-key-12345')
    })

    it('should reject requests with expired API key', async () => {
      ;(verifyApiKey as jest.Mock).mockResolvedValue(null)

      const mockHandler = createMockHandler()
      const wrappedHandler = withApiKey(mockHandler)
      const request = createMockRequest({
        headers: { 'x-api-key': 'ssm_pk_expired123' },
      })

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.code).toBe('API_KEY_INVALID')
      expect(verifyApiKey).toHaveBeenCalledWith('ssm_pk_expired123')
    })
  })

  /**
   * TEST 8: withApiKey authenticates valid API keys
   */
  describe('withApiKey - Valid Key', () => {
    it('should allow requests with valid API key using X-API-Key header', async () => {
      const mockKeyData = {
        id: 'key-123',
        organization_id: 'org-789',
        created_by: 'user-456',
        name: 'Production API Key',
        is_active: true,
        expires_at: null,
      }

      ;(verifyApiKey as jest.Mock).mockResolvedValue(mockKeyData)

      const mockHandler = createMockHandler({ data: 'api response' })
      const wrappedHandler = withApiKey(mockHandler)
      const request = createMockRequest({
        headers: { 'X-API-Key': 'ssm_pk_valid123456' },
      })

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toBe('api response')
      expect(mockHandler).toHaveBeenCalledTimes(1)
      expect(verifyApiKey).toHaveBeenCalledWith('ssm_pk_valid123456')

      // Verify context was created with API key data
      const context: ApiContext = mockHandler.mock.calls[0][1]
      expect(context.userId).toBe('user-456')
      expect(context.organizationId).toBe('org-789')
      expect(context.role).toBe('api_key')
    })

    it('should allow requests with valid API key using lowercase x-api-key header', async () => {
      const mockKeyData = {
        id: 'key-456',
        organization_id: 'org-999',
        created_by: 'user-111',
        name: 'Dev API Key',
        is_active: true,
        expires_at: null,
      }

      ;(verifyApiKey as jest.Mock).mockResolvedValue(mockKeyData)

      const mockHandler = createMockHandler({ data: 'api response' })
      const wrappedHandler = withApiKey(mockHandler)
      const request = createMockRequest({
        headers: { 'x-api-key': 'ssm_pk_devkey789' },
      })

      const response = await wrappedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toBe('api response')
      expect(verifyApiKey).toHaveBeenCalledWith('ssm_pk_devkey789')

      const context: ApiContext = mockHandler.mock.calls[0][1]
      expect(context.organizationId).toBe('org-999')
    })
  })

  /**
   * TEST 9: checkOrganizationAccess utility function
   */
  describe('checkOrganizationAccess Utility', () => {
    it('should return access granted for valid membership', async () => {
      const mockMembership = {
        role: 'consultant',
        is_active: true,
      }

      const mockSupabase = createMockSupabase()
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockMembership,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await checkOrganizationAccess('user-123', 'org-456')

      expect(result.hasAccess).toBe(true)
      expect(result.role).toBe('consultant')
      expect(result.error).toBeUndefined()
    })

    it('should check required roles correctly', async () => {
      const mockMembership = {
        role: 'angajat',
        is_active: true,
      }

      const mockSupabase = createMockSupabase()
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockMembership,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await checkOrganizationAccess('user-123', 'org-456', [
        'consultant',
        'firma_admin',
      ])

      expect(result.hasAccess).toBe(false)
      expect(result.role).toBe('angajat')
      expect(result.error).toContain('Rol insuficient')
    })

    it('should return access denied for non-existent membership', async () => {
      const mockSupabase = createMockSupabase()
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Not found' },
                }),
              }),
            }),
          }),
        }),
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await checkOrganizationAccess('user-999', 'org-456')

      expect(result.hasAccess).toBe(false)
      expect(result.error).toBe('Nu ai acces la această organizație')
    })
  })

  /**
   * TEST 10: Middleware composition
   */
  describe('Middleware Composition', () => {
    it('should allow chaining withAuth and withOrgAccess', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      const mockMembership = {
        role: 'consultant',
        is_active: true,
      }

      const mockSupabase = createMockSupabase()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockMembership,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const mockHandler = createMockHandler({ data: 'protected data' })
      const composedHandler = withAuth(withOrgAccess(mockHandler))

      const request = createMockRequest({
        url: 'http://localhost:3000/api/v1/organizations/org-456/trainings',
      })

      const response = await composedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toBe('protected data')
      expect(mockHandler).toHaveBeenCalledTimes(1)
    })

    it('should allow chaining withAuth, withOrgAccess, and withAdmin', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@example.com',
      }

      const mockMembership = {
        role: 'consultant',
        is_active: true,
      }

      const mockSupabase = createMockSupabase()
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockMembership,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

      ;(createSupabaseServer as jest.Mock).mockResolvedValue(mockSupabase)

      const mockHandler = createMockHandler({ data: 'admin protected data' })
      const composedHandler = withAuth(withOrgAccess(withAdmin(mockHandler)))

      const request = createMockRequest({
        url: 'http://localhost:3000/api/v1/organizations/org-456/settings',
      })

      const response = await composedHandler(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toBe('admin protected data')
      expect(mockHandler).toHaveBeenCalledTimes(1)
    })
  })
})
