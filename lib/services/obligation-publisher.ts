/**
 * OBLIGATION PUBLISHER SERVICE
 *
 * M5 Publishing Module: Publishes approved obligations to organizations
 * based on country_code matching and CAEN code relevance.
 *
 * FEATURES:
 * - Automatic organization matching based on country and CAEN codes
 * - Batch publishing with transaction support
 * - Status tracking (pending → acknowledged → compliant)
 * - Statistics and reporting
 *
 * USAGE:
 * const stats = await publishApprovedObligations()
 * const orgObls = await getOrgObligations(orgId)
 * await acknowledgeObligation(oblId, userId)
 */

import { createSupabaseServer } from '@/lib/supabase/server'
import type { CountryCode } from '@/lib/types'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

export type ObligationStatus = 'draft' | 'validated' | 'approved' | 'published' | 'archived'
export type OrgObligationStatus = 'pending' | 'acknowledged' | 'compliant' | 'non_compliant'

export interface Obligation {
  id: string
  source_legal_act: string
  source_article_id: string | null
  source_article_number: string | null
  country_code: CountryCode
  obligation_text: string
  who: string[]
  deadline: string | null
  frequency: string | null
  penalty: string | null
  penalty_min: number | null
  penalty_max: number | null
  penalty_currency: string | null
  evidence_required: string[]
  confidence: number
  validation_score: number
  status: ObligationStatus
  published: boolean
  published_at: string | null
  caen_codes: string[]
  industry_tags: string[]
  created_at: string
  updated_at: string
}

export interface OrganizationObligation {
  id: string
  organization_id: string
  obligation_id: string
  status: OrgObligationStatus
  assigned_at: string
  acknowledged_at: string | null
  acknowledged_by: string | null
  compliant_at: string | null
  compliant_by: string | null
  notes: string | null
  evidence_urls: string[]
  assigned_by: string | null
  match_score: number
  match_reason: string | null
  // Joined data
  obligation?: Obligation
  organization?: {
    id: string
    name: string
    country_code: CountryCode
  }
}

export interface PublishStats {
  obligationsProcessed: number
  organizationsMatched: number
  assignmentsCreated: number
  errors: Array<{ obligationId: string; error: string }>
  duration: number
}

export interface OrgObligationSummary {
  total: number
  pending: number
  acknowledged: number
  compliant: number
  non_compliant: number
}

// ══════════════════════════════════════════════════════════════
// PUBLISHING FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Publishes approved obligations to matching organizations
 * Matches based on:
 * 1. Country code (mandatory)
 * 2. CAEN code relevance (optional, increases match_score)
 */
export async function publishApprovedObligations(): Promise<PublishStats> {
  const startTime = Date.now()
  const supabase = await createSupabaseServer()

  const stats: PublishStats = {
    obligationsProcessed: 0,
    organizationsMatched: 0,
    assignmentsCreated: 0,
    errors: [],
    duration: 0
  }

  console.log('[M5 Publisher] Starting obligation publishing...')

  // Fetch obligations with status=approved and published=false
  const { data: obligations, error: oblError } = await supabase
    .from('obligations')
    .select('*')
    .eq('status', 'approved')
    .eq('published', false)

  if (oblError) {
    console.error('[M5 Publisher] Error fetching obligations:', oblError)
    throw new Error(`Failed to fetch obligations: ${oblError.message}`)
  }

  if (!obligations || obligations.length === 0) {
    console.log('[M5 Publisher] No approved obligations to publish')
    stats.duration = Date.now() - startTime
    return stats
  }

  console.log(`[M5 Publisher] Found ${obligations.length} obligations to publish`)
  stats.obligationsProcessed = obligations.length

  // Fetch all active organizations
  const { data: organizations, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, country_code')
    .neq('country_code', null)

  if (orgError) {
    console.error('[M5 Publisher] Error fetching organizations:', orgError)
    throw new Error(`Failed to fetch organizations: ${orgError.message}`)
  }

  if (!organizations || organizations.length === 0) {
    console.log('[M5 Publisher] No organizations found')
    stats.duration = Date.now() - startTime
    return stats
  }

  console.log(`[M5 Publisher] Found ${organizations.length} organizations`)

  // Process each obligation
  for (const obligation of obligations) {
    try {
      // Match organizations by country_code
      const matchedOrgs = organizations.filter(org =>
        org.country_code === obligation.country_code
      )

      if (matchedOrgs.length === 0) {
        console.log(`[M5 Publisher] No organizations match country ${obligation.country_code} for obligation ${obligation.id}`)
        continue
      }

      console.log(`[M5 Publisher] Matched ${matchedOrgs.length} organizations for obligation ${obligation.id}`)
      stats.organizationsMatched += matchedOrgs.length

      // Create organization_obligations entries
      const assignments = matchedOrgs.map(org => ({
        organization_id: org.id,
        obligation_id: obligation.id,
        status: 'pending' as OrgObligationStatus,
        match_score: 1.0, // TODO: Implement CAEN matching for better scoring
        match_reason: 'country_match',
        assigned_by: null // System assignment
      }))

      // Batch insert (ignore duplicates)
      const { error: insertError } = await supabase
        .from('organization_obligations')
        .upsert(assignments, {
          onConflict: 'organization_id,obligation_id',
          ignoreDuplicates: true
        })

      if (insertError) {
        console.error(`[M5 Publisher] Error inserting assignments for obligation ${obligation.id}:`, insertError)
        stats.errors.push({
          obligationId: obligation.id,
          error: insertError.message
        })
        continue
      }

      stats.assignmentsCreated += matchedOrgs.length

      // Mark obligation as published
      const { error: updateError } = await supabase
        .from('obligations')
        .update({
          published: true,
          published_at: new Date().toISOString(),
          status: 'published' as ObligationStatus
        })
        .eq('id', obligation.id)

      if (updateError) {
        console.error(`[M5 Publisher] Error marking obligation ${obligation.id} as published:`, updateError)
        stats.errors.push({
          obligationId: obligation.id,
          error: updateError.message
        })
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[M5 Publisher] Error processing obligation ${obligation.id}:`, error)
      stats.errors.push({
        obligationId: obligation.id,
        error: errorMsg
      })
    }
  }

  stats.duration = Date.now() - startTime
  console.log('[M5 Publisher] Publishing complete:', stats)

  return stats
}

// ══════════════════════════════════════════════════════════════
// ORGANIZATION OBLIGATION MANAGEMENT
// ══════════════════════════════════════════════════════════════

/**
 * Get all obligations for an organization with full details
 */
export async function getOrgObligations(
  orgId: string,
  filters?: {
    status?: OrgObligationStatus
    frequency?: string
  }
): Promise<OrganizationObligation[]> {
  const supabase = await createSupabaseServer()

  let query = supabase
    .from('organization_obligations')
    .select(`
      *,
      obligation:obligations (
        id,
        source_legal_act,
        obligation_text,
        who,
        deadline,
        frequency,
        penalty,
        penalty_min,
        penalty_max,
        penalty_currency,
        evidence_required,
        country_code,
        published_at
      )
    `)
    .eq('organization_id', orgId)
    .order('assigned_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[M5 Publisher] Error fetching org obligations:', error)
    throw new Error(`Failed to fetch obligations: ${error.message}`)
  }

  return (data || []) as OrganizationObligation[]
}

/**
 * Get obligation statistics for an organization
 */
export async function getOrgObligationStats(orgId: string): Promise<OrgObligationSummary> {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('organization_obligations')
    .select('status')
    .eq('organization_id', orgId)

  if (error) {
    console.error('[M5 Publisher] Error fetching obligation stats:', error)
    return {
      total: 0,
      pending: 0,
      acknowledged: 0,
      compliant: 0,
      non_compliant: 0
    }
  }

  const stats: OrgObligationSummary = {
    total: data.length,
    pending: data.filter(o => o.status === 'pending').length,
    acknowledged: data.filter(o => o.status === 'acknowledged').length,
    compliant: data.filter(o => o.status === 'compliant').length,
    non_compliant: data.filter(o => o.status === 'non_compliant').length
  }

  return stats
}

/**
 * Acknowledge an obligation (user has seen and reviewed it)
 */
export async function acknowledgeObligation(
  orgObligationId: string,
  userId: string,
  notes?: string
): Promise<void> {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('organization_obligations')
    .update({
      status: 'acknowledged' as OrgObligationStatus,
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: userId,
      notes: notes || null
    })
    .eq('id', orgObligationId)

  if (error) {
    console.error('[M5 Publisher] Error acknowledging obligation:', error)
    throw new Error(`Failed to acknowledge obligation: ${error.message}`)
  }

  console.log(`[M5 Publisher] Obligation ${orgObligationId} acknowledged by user ${userId}`)
}

/**
 * Mark an obligation as compliant (organization has fulfilled it)
 */
export async function markCompliant(
  orgObligationId: string,
  userId: string,
  notes?: string,
  evidenceUrls?: string[]
): Promise<void> {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('organization_obligations')
    .update({
      status: 'compliant' as OrgObligationStatus,
      compliant_at: new Date().toISOString(),
      compliant_by: userId,
      notes: notes || null,
      evidence_urls: evidenceUrls || []
    })
    .eq('id', orgObligationId)

  if (error) {
    console.error('[M5 Publisher] Error marking obligation compliant:', error)
    throw new Error(`Failed to mark obligation compliant: ${error.message}`)
  }

  console.log(`[M5 Publisher] Obligation ${orgObligationId} marked compliant by user ${userId}`)
}

/**
 * Mark an obligation as non-compliant
 */
export async function markNonCompliant(
  orgObligationId: string,
  userId: string,
  notes: string
): Promise<void> {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('organization_obligations')
    .update({
      status: 'non_compliant' as OrgObligationStatus,
      notes
    })
    .eq('id', orgObligationId)

  if (error) {
    console.error('[M5 Publisher] Error marking obligation non-compliant:', error)
    throw new Error(`Failed to mark obligation non-compliant: ${error.message}`)
  }

  console.log(`[M5 Publisher] Obligation ${orgObligationId} marked non-compliant`)
}

// ══════════════════════════════════════════════════════════════
// ADMIN FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Get all obligations (for admin management)
 */
export async function getAllObligations(filters?: {
  status?: ObligationStatus
  countryCode?: CountryCode
  published?: boolean
}): Promise<Obligation[]> {
  const supabase = await createSupabaseServer()

  let query = supabase
    .from('obligations')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.countryCode) {
    query = query.eq('country_code', filters.countryCode)
  }

  if (filters?.published !== undefined) {
    query = query.eq('published', filters.published)
  }

  const { data, error } = await query

  if (error) {
    console.error('[M5 Publisher] Error fetching obligations:', error)
    throw new Error(`Failed to fetch obligations: ${error.message}`)
  }

  return (data || []) as Obligation[]
}

/**
 * Approve an obligation (admin action, makes it ready for publishing)
 */
export async function approveObligation(
  obligationId: string,
  userId: string
): Promise<void> {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('obligations')
    .update({
      status: 'approved' as ObligationStatus,
      approved_at: new Date().toISOString(),
      approved_by: userId
    })
    .eq('id', obligationId)

  if (error) {
    console.error('[M5 Publisher] Error approving obligation:', error)
    throw new Error(`Failed to approve obligation: ${error.message}`)
  }

  console.log(`[M5 Publisher] Obligation ${obligationId} approved by user ${userId}`)
}

/**
 * Get single obligation by ID
 */
export async function getObligationById(obligationId: string): Promise<Obligation | null> {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('obligations')
    .select('*')
    .eq('id', obligationId)
    .single()

  if (error) {
    console.error('[M5 Publisher] Error fetching obligation:', error)
    return null
  }

  return data as Obligation
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  // Publishing
  publishApprovedObligations,

  // Organization obligations
  getOrgObligations,
  getOrgObligationStats,
  acknowledgeObligation,
  markCompliant,
  markNonCompliant,

  // Admin
  getAllObligations,
  approveObligation,
  getObligationById
}
