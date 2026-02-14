/**
 * GDPR Consent Management Service
 *
 * Provides functions for recording, withdrawing, and retrieving user consent
 * for various data processing purposes in compliance with GDPR requirements.
 */

import { createSupabaseServer } from '@/lib/supabase/server';

/**
 * Valid consent purposes as per GDPR requirements
 */
export type ConsentPurpose = 'data_processing' | 'marketing' | 'analytics' | 'third_party';

/**
 * Consent record structure
 */
export interface ConsentRecord {
  id: string;
  user_id: string;
  purpose: ConsentPurpose;
  granted: boolean;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

/**
 * Current consent status for a user
 */
export interface ConsentStatus {
  purpose: ConsentPurpose;
  granted: boolean;
  lastUpdated: string;
}

/**
 * Record a user's consent for a specific purpose
 *
 * @param userId - User ID to record consent for
 * @param purpose - Purpose for which consent is being recorded
 * @param granted - Whether consent is granted (true) or withdrawn (false)
 * @param ipAddress - Optional IP address from which consent was given
 * @param userAgent - Optional browser user agent string
 * @returns The created consent record or null on error
 */
export async function recordConsent(
  userId: string,
  purpose: ConsentPurpose,
  granted: boolean,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<ConsentRecord | null> {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from('consents')
      .insert({
        user_id: userId,
        purpose,
        granted,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording consent:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in recordConsent:', err);
    return null;
  }
}

/**
 * Withdraw a user's consent for a specific purpose
 *
 * This creates a new consent record with granted=false to maintain audit trail.
 *
 * @param userId - User ID to withdraw consent for
 * @param purpose - Purpose for which consent is being withdrawn
 * @param ipAddress - Optional IP address from which consent was withdrawn
 * @param userAgent - Optional browser user agent string
 * @returns The created withdrawal record or null on error
 */
export async function withdrawConsent(
  userId: string,
  purpose: ConsentPurpose,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<ConsentRecord | null> {
  return recordConsent(userId, purpose, false, ipAddress, userAgent);
}

/**
 * Get the current consent status for all purposes for a user
 *
 * Returns the most recent consent record for each purpose.
 *
 * @param userId - User ID to get consents for
 * @returns Array of current consent statuses
 */
export async function getConsents(userId: string): Promise<ConsentStatus[]> {
  try {
    const supabase = await createSupabaseServer();

    // Get all consent purposes
    const purposes: ConsentPurpose[] = ['data_processing', 'marketing', 'analytics', 'third_party'];
    const consentStatuses: ConsentStatus[] = [];

    // For each purpose, get the most recent consent record
    for (const purpose of purposes) {
      const { data, error } = await supabase
        .from('consents')
        .select('purpose, granted, created_at')
        .eq('user_id', userId)
        .eq('purpose', purpose)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned", which is acceptable
        console.error(`Error fetching consent for ${purpose}:`, error);
        continue;
      }

      if (data) {
        consentStatuses.push({
          purpose: data.purpose as ConsentPurpose,
          granted: data.granted,
          lastUpdated: data.created_at,
        });
      }
    }

    return consentStatuses;
  } catch (err) {
    console.error('Exception in getConsents:', err);
    return [];
  }
}

/**
 * Get the full consent history for a user
 *
 * Returns all consent records for audit purposes.
 *
 * @param userId - User ID to get consent history for
 * @returns Array of all consent records, ordered by most recent first
 */
export async function getConsentHistory(userId: string): Promise<ConsentRecord[]> {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from('consents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching consent history:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception in getConsentHistory:', err);
    return [];
  }
}

/**
 * Check if a user has granted consent for a specific purpose
 *
 * @param userId - User ID to check
 * @param purpose - Purpose to check consent for
 * @returns true if consent is granted, false otherwise
 */
export async function hasConsent(userId: string, purpose: ConsentPurpose): Promise<boolean> {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from('consents')
      .select('granted')
      .eq('user_id', userId)
      .eq('purpose', purpose)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(`Error checking consent for ${purpose}:`, error);
      return false;
    }

    return data?.granted || false;
  } catch (err) {
    console.error('Exception in hasConsent:', err);
    return false;
  }
}

/**
 * Record multiple consents at once (e.g., during initial registration)
 *
 * @param userId - User ID to record consents for
 * @param consents - Object mapping purposes to granted status
 * @param ipAddress - Optional IP address
 * @param userAgent - Optional user agent string
 * @returns Array of created consent records
 */
export async function recordMultipleConsents(
  userId: string,
  consents: Partial<Record<ConsentPurpose, boolean>>,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<ConsentRecord[]> {
  const results: ConsentRecord[] = [];

  for (const [purpose, granted] of Object.entries(consents)) {
    if (granted !== undefined) {
      const record = await recordConsent(
        userId,
        purpose as ConsentPurpose,
        granted,
        ipAddress,
        userAgent
      );
      if (record) {
        results.push(record);
      }
    }
  }

  return results;
}

/**
 * Get consent statistics for admin/compliance purposes
 *
 * @returns Statistics about consent grants/withdrawals
 */
export async function getConsentStatistics(): Promise<{
  purpose: ConsentPurpose;
  totalGrants: number;
  totalWithdrawals: number;
  currentlyGranted: number;
}[]> {
  try {
    const supabase = await createSupabaseServer();

    const purposes: ConsentPurpose[] = ['data_processing', 'marketing', 'analytics', 'third_party'];
    const statistics = [];

    for (const purpose of purposes) {
      // Get total grants
      const { count: grants } = await supabase
        .from('consents')
        .select('*', { count: 'exact', head: true })
        .eq('purpose', purpose)
        .eq('granted', true);

      // Get total withdrawals
      const { count: withdrawals } = await supabase
        .from('consents')
        .select('*', { count: 'exact', head: true })
        .eq('purpose', purpose)
        .eq('granted', false);

      // Get currently granted (latest status for each user)
      const { data: latestConsents } = await supabase
        .rpc('get_latest_consents_by_purpose', { consent_purpose: purpose });

      const currentlyGranted = latestConsents?.filter((c: any) => c.granted).length || 0;

      statistics.push({
        purpose,
        totalGrants: grants || 0,
        totalWithdrawals: withdrawals || 0,
        currentlyGranted,
      });
    }

    return statistics;
  } catch (err) {
    console.error('Exception in getConsentStatistics:', err);
    return [];
  }
}
