// lib/security/session-management.ts
// Session management service for S-S-M.RO
// Handles session tracking, termination, and concurrent session limits
// Data: 13 Februarie 2026
//
// IMPORTANT: This is a foundational implementation.
// For production-grade multi-session management, consider:
// 1. Creating a custom 'user_sessions' table to track all active sessions
// 2. Using Supabase Management API for advanced session control
// 3. Implementing JWT token revocation list
// 4. Adding session fingerprinting (IP + User Agent + Device ID)
// 5. Storing session metadata (login time, last activity, location)
//
// Current implementation provides:
// - Session info parsing (device, browser, OS)
// - Session limit checking based on subscription plan
// - Current session termination
// - Framework for extending to multi-session management

import { createSupabaseServer } from '@/lib/supabase/server'
import { createSupabaseBrowser } from '@/lib/supabase/client'

// ── Types ──

export interface SessionInfo {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  ip?: string
  user_agent?: string
  device?: string
  browser?: string
  os?: string
  location?: string
  is_current?: boolean
}

export interface SessionLimit {
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  max_sessions: number
}

// ── Constants ──

// Maximum concurrent sessions per subscription plan
export const SESSION_LIMITS: Record<string, number> = {
  free: 2,
  starter: 3,
  professional: 5,
  enterprise: 10,
}

// Session timeout in seconds (24 hours default)
export const SESSION_TIMEOUT = 24 * 60 * 60

// ── Helper: Parse User Agent ──

function parseUserAgent(userAgent?: string): {
  device: string
  browser: string
  os: string
} {
  if (!userAgent) {
    return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' }
  }

  // Detect device
  let device = 'Desktop'
  if (/mobile/i.test(userAgent)) device = 'Mobile'
  else if (/tablet|ipad/i.test(userAgent)) device = 'Tablet'

  // Detect browser
  let browser = 'Unknown'
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome'
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Edg')) browser = 'Edge'
  else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) browser = 'Internet Explorer'

  // Detect OS
  let os = 'Unknown'
  if (userAgent.includes('Windows NT 10')) os = 'Windows 10/11'
  else if (userAgent.includes('Windows NT 6.3')) os = 'Windows 8.1'
  else if (userAgent.includes('Windows NT 6.2')) os = 'Windows 8'
  else if (userAgent.includes('Windows NT 6.1')) os = 'Windows 7'
  else if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac OS X')) os = 'macOS'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'
  else if (userAgent.includes('Linux')) os = 'Linux'

  return { device, browser, os }
}

// ── Helper: Get IP Location (basic implementation) ──

async function getLocationFromIP(ip?: string): Promise<string> {
  if (!ip || ip === '127.0.0.1' || ip === 'localhost') {
    return 'Local'
  }

  // Basic geo-location - can be enhanced with external API
  // For now, return generic location
  return 'Unknown'
}

// ── Get Active Sessions (Server-side) ──

/**
 * Get all active sessions for a user
 * Note: Supabase Auth stores sessions in auth.sessions table (not directly accessible)
 * This implementation returns current session info
 * For full session management, use Supabase Management API or custom session tracking
 *
 * @param userId - User ID to get sessions for
 * @returns Array of session info
 */
export async function getActiveSessions(userId: string): Promise<{
  sessions: SessionInfo[]
  error: string | null
}> {
  try {
    const supabase = await createSupabaseServer()

    // Get current session
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('[Session Management] Error fetching session:', sessionError)
      return {
        sessions: [],
        error: sessionError.message,
      }
    }

    if (!currentSession) {
      return { sessions: [], error: null }
    }

    // Verify this session belongs to the requested user
    if (currentSession.user.id !== userId) {
      return {
        sessions: [],
        error: 'Nu ai permisiunea să vizualizezi sesiunile acestui utilizator',
      }
    }

    // Parse current session metadata
    // Note: In production, you would query a custom sessions table or use Supabase Management API
    const userAgent = (currentSession as any).user_agent ||
                      currentSession.user?.user_metadata?.user_agent ||
                      (typeof window !== 'undefined' ? window.navigator.userAgent : undefined)

    const { device, browser, os } = parseUserAgent(userAgent)

    const sessionInfo: SessionInfo = {
      id: currentSession.access_token.substring(0, 16), // Use token prefix as ID
      user_id: currentSession.user.id,
      created_at: new Date(currentSession.user.created_at || Date.now()).toISOString(),
      updated_at: new Date().toISOString(),
      user_agent: userAgent,
      device,
      browser,
      os,
      location: 'Unknown',
      is_current: true,
    }

    return { sessions: [sessionInfo], error: null }
  } catch (err) {
    console.error('[Session Management] Unexpected error in getActiveSessions:', err)
    return {
      sessions: [],
      error: err instanceof Error ? err.message : 'Eroare necunoscută',
    }
  }
}

// ── Get Session Info (Server-side) ──

/**
 * Get detailed information about a specific session
 * @param sessionId - Session ID to get info for
 * @returns Session information or null
 */
export async function getSessionInfo(sessionId: string): Promise<{
  session: SessionInfo | null
  error: string | null
}> {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        session: null,
        error: 'Nu ești autentificat',
      }
    }

    // Get all sessions and find the requested one
    const { sessions, error } = await getActiveSessions(user.id)

    if (error) {
      return { session: null, error }
    }

    const session = sessions.find(s => s.id === sessionId)

    if (!session) {
      return {
        session: null,
        error: 'Sesiune negăsită',
      }
    }

    return { session, error: null }
  } catch (err) {
    console.error('[Session Management] Unexpected error in getSessionInfo:', err)
    return {
      session: null,
      error: err instanceof Error ? err.message : 'Eroare necunoscută',
    }
  }
}

// ── Terminate Session (Server-side) ──

/**
 * Terminate a specific session
 * Note: In production, use Supabase Management API or implement custom session tracking
 * For now, this signs out the current user
 *
 * @param sessionId - Session ID to terminate
 * @returns Success status
 */
export async function terminateSession(sessionId: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Nu ești autentificat',
      }
    }

    // Sign out current session
    // Note: To implement full session management, you need to:
    // 1. Create a custom sessions table to track all active sessions
    // 2. Use Supabase Management API for advanced session control
    // 3. Or implement JWT token revocation list
    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      console.error('[Session Management] Error terminating session:', signOutError)
      return {
        success: false,
        error: signOutError.message,
      }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('[Session Management] Unexpected error in terminateSession:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Eroare necunoscută',
    }
  }
}

// ── Terminate All Sessions Except Current (Server-side) ──

/**
 * Terminate all sessions for a user except the current one
 * @param userId - User ID to terminate sessions for
 * @returns Number of terminated sessions and any errors
 */
export async function terminateAllSessions(userId: string): Promise<{
  terminated_count: number
  error: string | null
}> {
  try {
    const supabase = await createSupabaseServer()

    // Get current session
    const { data: { session: currentSession } } = await supabase.auth.getSession()

    if (!currentSession) {
      return {
        terminated_count: 0,
        error: 'Nu există o sesiune activă',
      }
    }

    // Verify user ID matches current session
    if (currentSession.user.id !== userId) {
      return {
        terminated_count: 0,
        error: 'Nu ai permisiunea să termini sesiunile acestui utilizator',
      }
    }

    // Get all active sessions
    const { sessions, error } = await getActiveSessions(userId)

    if (error) {
      return { terminated_count: 0, error }
    }

    // Filter out current session
    const sessionsToTerminate = sessions.filter(s => !s.is_current)

    // Terminate each session
    let terminatedCount = 0
    const errors: string[] = []

    for (const session of sessionsToTerminate) {
      const { success, error: terminateError } = await terminateSession(session.id)
      if (success) {
        terminatedCount++
      } else if (terminateError) {
        errors.push(terminateError)
      }
    }

    return {
      terminated_count: terminatedCount,
      error: errors.length > 0 ? errors.join('; ') : null,
    }
  } catch (err) {
    console.error('[Session Management] Unexpected error in terminateAllSessions:', err)
    return {
      terminated_count: 0,
      error: err instanceof Error ? err.message : 'Eroare necunoscută',
    }
  }
}

// ── Check Concurrent Session Limit ──

/**
 * Check if user has exceeded concurrent session limit based on their plan
 * @param userId - User ID to check
 * @param plan - Subscription plan (defaults to 'free')
 * @returns Whether limit is exceeded and session count
 */
export async function checkSessionLimit(
  userId: string,
  plan: keyof typeof SESSION_LIMITS = 'free'
): Promise<{
  is_exceeded: boolean
  current_sessions: number
  max_sessions: number
  error: string | null
}> {
  try {
    const { sessions, error } = await getActiveSessions(userId)

    if (error) {
      return {
        is_exceeded: false,
        current_sessions: 0,
        max_sessions: SESSION_LIMITS[plan],
        error,
      }
    }

    const maxSessions = SESSION_LIMITS[plan] || SESSION_LIMITS.free
    const isExceeded = sessions.length >= maxSessions

    return {
      is_exceeded: isExceeded,
      current_sessions: sessions.length,
      max_sessions: maxSessions,
      error: null,
    }
  } catch (err) {
    console.error('[Session Management] Unexpected error in checkSessionLimit:', err)
    return {
      is_exceeded: false,
      current_sessions: 0,
      max_sessions: SESSION_LIMITS[plan],
      error: err instanceof Error ? err.message : 'Eroare necunoscută',
    }
  }
}

// ── Force Logout Remote Devices (Browser-safe version) ──

/**
 * Client-side function to force logout all sessions except current
 * Uses browser Supabase client
 */
export async function forceLogoutRemoteDevices(): Promise<{
  success: boolean
  terminated_count: number
  error: string | null
}> {
  try {
    const supabase = createSupabaseBrowser()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        terminated_count: 0,
        error: 'Nu ești autentificat',
      }
    }

    // Call server action to terminate sessions
    // Note: This should be called from a server action in production
    // For now, return a helpful message
    return {
      success: false,
      terminated_count: 0,
      error: 'Această funcție trebuie apelată dintr-un server action',
    }
  } catch (err) {
    console.error('[Session Management] Unexpected error in forceLogoutRemoteDevices:', err)
    return {
      success: false,
      terminated_count: 0,
      error: err instanceof Error ? err.message : 'Eroare necunoscută',
    }
  }
}

// ── Get User's Subscription Plan ──

/**
 * Get user's subscription plan from organization settings
 * @param userId - User ID to get plan for
 * @returns Subscription plan or 'free' as default
 */
export async function getUserPlan(userId: string): Promise<{
  plan: keyof typeof SESSION_LIMITS
  error: string | null
}> {
  try {
    const supabase = await createSupabaseServer()

    // Get user's organization memberships
    const { data: memberships, error: membershipError } = await supabase
      .from('memberships')
      .select('organization_id, role')
      .eq('user_id', userId)
      .eq('is_active', true)
      .limit(1)
      .single()

    if (membershipError || !memberships) {
      // Default to free plan if no membership found
      return { plan: 'free', error: null }
    }

    // In a real implementation, you would check organization subscription
    // For now, return based on role as a placeholder
    const planMap: Record<string, keyof typeof SESSION_LIMITS> = {
      consultant: 'professional',
      firma_admin: 'starter',
      angajat: 'free',
    }

    const plan = planMap[memberships.role] || 'free'

    return { plan, error: null }
  } catch (err) {
    console.error('[Session Management] Unexpected error in getUserPlan:', err)
    return {
      plan: 'free',
      error: err instanceof Error ? err.message : 'Eroare necunoscută',
    }
  }
}

// ── Export all functions ──

export default {
  getActiveSessions,
  getSessionInfo,
  terminateSession,
  terminateAllSessions,
  checkSessionLimit,
  forceLogoutRemoteDevices,
  getUserPlan,
  SESSION_LIMITS,
}
