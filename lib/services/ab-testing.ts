// S-S-M.RO — A/B TESTING SERVICE
// Simple hash-based deterministic A/B testing framework
// Data: 14 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'

// ── TYPES ──

export interface Experiment {
  id: string
  name: string
  description: string | null
  variants: ExperimentVariant[]
  is_active: boolean
  created_at: string
  updated_at: string
  started_at: string | null
  ended_at: string | null
}

export interface ExperimentVariant {
  name: string
  weight: number // 0-100, sum of all weights should be 100
}

export interface ExperimentAssignment {
  id: string
  experiment_id: string
  user_id: string
  variant_name: string
  assigned_at: string
}

export interface ExperimentConversion {
  id: string
  experiment_id: string
  user_id: string
  variant_name: string
  converted_at: string
  metadata: Record<string, any> | null
}

export interface ExperimentResults {
  experiment_id: string
  experiment_name: string
  variants: VariantResults[]
  total_participants: number
  started_at: string | null
  ended_at: string | null
}

export interface VariantResults {
  variant_name: string
  participants: number
  conversions: number
  conversion_rate: number
}

// ── HASH FUNCTION ──

/**
 * Simple deterministic hash function for user ID + experiment name
 * Returns a number between 0-99 for variant assignment
 */
function hashUserExperiment(userId: string, experimentName: string): number {
  const str = `${userId}:${experimentName}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash) % 100
}

/**
 * Assigns a variant based on hash and variant weights
 */
function assignVariant(hash: number, variants: ExperimentVariant[]): string {
  let cumulative = 0
  for (const variant of variants) {
    cumulative += variant.weight
    if (hash < cumulative) {
      return variant.name
    }
  }
  // Fallback to last variant if something goes wrong
  return variants[variants.length - 1].name
}

// ── EXPERIMENT MANAGEMENT ──

/**
 * Creates a new A/B test experiment
 * @param name - Unique experiment name (e.g., "landing_page_cta_v2")
 * @param variants - Array of variants with weights (must sum to 100)
 * @param description - Optional description
 * @returns Created experiment
 */
export async function createExperiment(
  name: string,
  variants: ExperimentVariant[],
  description?: string
): Promise<Experiment> {
  const supabase = await createSupabaseServer()

  // Validate weights sum to 100
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
  if (totalWeight !== 100) {
    throw new Error(`Variant weights must sum to 100, got ${totalWeight}`)
  }

  // Validate at least 2 variants
  if (variants.length < 2) {
    throw new Error('Experiment must have at least 2 variants')
  }

  const { data, error } = await supabase
    .from('ab_experiments')
    .insert({
      name,
      description: description || null,
      variants,
      is_active: true,
      started_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating experiment:', error)
    throw new Error(`Failed to create experiment: ${error.message}`)
  }

  return data
}

/**
 * Gets the variant for a specific user and experiment
 * Uses deterministic hash-based assignment
 * @param experimentName - Name of the experiment
 * @param userId - User ID to assign variant to
 * @returns Variant name assigned to this user
 */
export async function getVariant(
  experimentName: string,
  userId: string
): Promise<string> {
  const supabase = await createSupabaseServer()

  // Check if experiment exists and is active
  const { data: experiment, error: expError } = await supabase
    .from('ab_experiments')
    .select('*')
    .eq('name', experimentName)
    .eq('is_active', true)
    .single()

  if (expError || !experiment) {
    console.error('Experiment not found or inactive:', experimentName)
    // Return first variant as fallback (control group)
    return 'control'
  }

  // Check if user already has an assignment
  const { data: existingAssignment } = await supabase
    .from('ab_assignments')
    .select('variant_name')
    .eq('experiment_id', experiment.id)
    .eq('user_id', userId)
    .single()

  if (existingAssignment) {
    return existingAssignment.variant_name
  }

  // Assign new variant using deterministic hash
  const hash = hashUserExperiment(userId, experimentName)
  const variantName = assignVariant(hash, experiment.variants)

  // Store assignment
  await supabase
    .from('ab_assignments')
    .insert({
      experiment_id: experiment.id,
      user_id: userId,
      variant_name: variantName
    })

  return variantName
}

/**
 * Tracks a conversion event for a user in an experiment
 * @param experimentName - Name of the experiment
 * @param userId - User ID who converted
 * @param metadata - Optional metadata about the conversion
 */
export async function trackConversion(
  experimentName: string,
  userId: string,
  metadata?: Record<string, any>
): Promise<void> {
  const supabase = await createSupabaseServer()

  // Get experiment
  const { data: experiment, error: expError } = await supabase
    .from('ab_experiments')
    .select('*')
    .eq('name', experimentName)
    .single()

  if (expError || !experiment) {
    console.error('Experiment not found:', experimentName)
    return
  }

  // Get user's assignment
  const { data: assignment } = await supabase
    .from('ab_assignments')
    .select('variant_name')
    .eq('experiment_id', experiment.id)
    .eq('user_id', userId)
    .single()

  if (!assignment) {
    console.error('No assignment found for user in experiment')
    return
  }

  // Check if conversion already exists (prevent duplicates)
  const { data: existingConversion } = await supabase
    .from('ab_conversions')
    .select('id')
    .eq('experiment_id', experiment.id)
    .eq('user_id', userId)
    .single()

  if (existingConversion) {
    // Already converted, don't record again
    return
  }

  // Record conversion
  const { error: convError } = await supabase
    .from('ab_conversions')
    .insert({
      experiment_id: experiment.id,
      user_id: userId,
      variant_name: assignment.variant_name,
      metadata: metadata || null
    })

  if (convError) {
    console.error('Error tracking conversion:', convError)
  }
}

/**
 * Gets results for an experiment
 * @param experimentName - Name of the experiment
 * @returns Experiment results with conversion rates per variant
 */
export async function getExperimentResults(
  experimentName: string
): Promise<ExperimentResults | null> {
  const supabase = await createSupabaseServer()

  // Get experiment
  const { data: experiment, error: expError } = await supabase
    .from('ab_experiments')
    .select('*')
    .eq('name', experimentName)
    .single()

  if (expError || !experiment) {
    console.error('Experiment not found:', experimentName)
    return null
  }

  // Get all assignments
  const { data: assignments } = await supabase
    .from('ab_assignments')
    .select('variant_name')
    .eq('experiment_id', experiment.id)

  // Get all conversions
  const { data: conversions } = await supabase
    .from('ab_conversions')
    .select('variant_name')
    .eq('experiment_id', experiment.id)

  // Calculate results per variant
  const variantResults: VariantResults[] = experiment.variants.map(
    (variant: ExperimentVariant) => {
      const participants = assignments?.filter(
        (a) => a.variant_name === variant.name
      ).length || 0

      const conversionCount = conversions?.filter(
        (c) => c.variant_name === variant.name
      ).length || 0

      const conversion_rate = participants > 0
        ? (conversionCount / participants) * 100
        : 0

      return {
        variant_name: variant.name,
        participants,
        conversions: conversionCount,
        conversion_rate: Math.round(conversion_rate * 100) / 100 // 2 decimals
      }
    }
  )

  return {
    experiment_id: experiment.id,
    experiment_name: experiment.name,
    variants: variantResults,
    total_participants: assignments?.length || 0,
    started_at: experiment.started_at,
    ended_at: experiment.ended_at
  }
}

/**
 * Stops an active experiment
 * @param experimentName - Name of the experiment to stop
 */
export async function stopExperiment(experimentName: string): Promise<void> {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('ab_experiments')
    .update({
      is_active: false,
      ended_at: new Date().toISOString()
    })
    .eq('name', experimentName)

  if (error) {
    console.error('Error stopping experiment:', error)
    throw new Error(`Failed to stop experiment: ${error.message}`)
  }
}

/**
 * Lists all experiments
 * @param activeOnly - If true, only returns active experiments
 */
export async function listExperiments(
  activeOnly = false
): Promise<Experiment[]> {
  const supabase = await createSupabaseServer()

  let query = supabase
    .from('ab_experiments')
    .select('*')
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error listing experiments:', error)
    return []
  }

  return data || []
}
