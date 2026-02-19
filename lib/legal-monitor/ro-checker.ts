// ============================================================
// lib/legal-monitor/ro-checker.ts
// M7 Legislative Monitor — RO Checker Orchestrator
//
// Citește acte din legal_acts_monitor, verifică modificări,
// scrie rezultate în ro_monitor_log
// ============================================================

import { createClient } from '@supabase/supabase-js'
import { checkRomanianAct } from './ro-adapter'
import type { LegalActMonitor } from '@/lib/types'

export interface CheckSummary {
  total: number
  checked: number
  changed: number
  unchanged: number
  errors: number
  duration_ms: number
  details: {
    act_key: string
    status: 'changed' | 'unchanged' | 'error'
    error?: string
  }[]
}

// ─── Supabase Client (service role) ──────────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── MAIN: Run Romanian Monitor Check ────────────────────────

export async function runRomanianMonitorCheck(): Promise<CheckSummary> {
  const supabase = getSupabase()
  const startTime = Date.now()

  const summary: CheckSummary = {
    total: 0,
    checked: 0,
    changed: 0,
    unchanged: 0,
    errors: 0,
    duration_ms: 0,
    details: [],
  }

  try {
    // Step 1: Fetch active monitored acts from DB
    const { data: acts, error: fetchError } = await supabase
      .from('legal_acts_monitor')
      .select('*')
      .eq('country_code', 'RO')
      .eq('status', 'active')
      .order('priority', { ascending: true })
      .order('act_key', { ascending: true })

    if (fetchError) {
      throw new Error(`Failed to fetch monitored acts: ${fetchError.message}`)
    }

    if (!acts || acts.length === 0) {
      console.log('[RO Monitor] No active acts to monitor')
      summary.duration_ms = Date.now() - startTime
      return summary
    }

    summary.total = acts.length
    console.log(`[RO Monitor] Starting check for ${acts.length} acts`)

    // Step 2: Check each act sequentially with 2s pause
    for (let i = 0; i < acts.length; i++) {
      const act = acts[i] as unknown as LegalActMonitor

      // Rate limiting: 2s pause between requests (except first)
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      console.log(`[RO Monitor] Checking ${i + 1}/${acts.length}: ${act.act_key}`)

      // Step 3: Check the act
      const result = await checkRomanianAct(act.act_key)

      summary.checked++

      // Step 4: Process result
      if (result.error) {
        summary.errors++
        summary.details.push({
          act_key: act.act_key,
          status: 'error',
          error: result.error,
        })

        await logMonitorResult(supabase, act.act_key, 'error', {
          error_message: result.error,
          duration_ms: result.durationMs,
        })

        console.log(`[RO Monitor] ${act.act_key}: ERROR - ${result.error}`)
        continue
      }

      // Step 5: Compare version dates
      const hasChanges = hasVersionChanged(
        act.current_version_date,
        result.currentVersionDate
      )

      if (hasChanges) {
        summary.changed++
        summary.details.push({
          act_key: act.act_key,
          status: 'changed',
        })

        // Update legal_acts_monitor
        await supabase
          .from('legal_acts_monitor')
          .update({
            current_version_date: result.currentVersionDate,
            last_checked_at: new Date().toISOString(),
            needs_review: true,
            source_url: result.sourceUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', act.id)

        await logMonitorResult(supabase, act.act_key, 'changed', {
          version_date_found: result.currentVersionDate,
          source_url: result.sourceUrl,
          duration_ms: result.durationMs,
        })

        console.log(
          `[RO Monitor] ${act.act_key}: CHANGED (${act.current_version_date} → ${result.currentVersionDate})`
        )
      } else {
        summary.unchanged++
        summary.details.push({
          act_key: act.act_key,
          status: 'unchanged',
        })

        // Update only last_checked_at
        await supabase
          .from('legal_acts_monitor')
          .update({
            last_checked_at: new Date().toISOString(),
          })
          .eq('id', act.id)

        await logMonitorResult(supabase, act.act_key, 'no_change', {
          version_date_found: result.currentVersionDate,
          source_url: result.sourceUrl,
          duration_ms: result.durationMs,
        })

        console.log(`[RO Monitor] ${act.act_key}: NO CHANGE`)
      }
    }

    summary.duration_ms = Date.now() - startTime

    console.log(
      `[RO Monitor] Complete: ${summary.checked} checked, ${summary.changed} changed, ${summary.unchanged} unchanged, ${summary.errors} errors (${summary.duration_ms}ms)`
    )

    return summary
  } catch (error) {
    console.error('[RO Monitor] Fatal error:', error)
    summary.duration_ms = Date.now() - startTime
    throw error
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function hasVersionChanged(
  oldDate: string | null,
  newDate: string | null
): boolean {
  // Dacă nu avem date vechi, considerăm că nu e schimbare (evităm false positives)
  if (!oldDate) return false

  // Dacă am găsit o dată nouă diferită, e schimbare
  if (newDate && oldDate !== newDate) return true

  return false
}

async function logMonitorResult(
  supabase: any,
  actKey: string,
  status: 'success' | 'error' | 'no_change' | 'changed',
  details: {
    version_date_found?: string | null
    source_url?: string
    error_message?: string
    duration_ms?: number
  }
) {
  await supabase.from('ro_monitor_log').insert({
    act_key: actKey,
    checked_at: new Date().toISOString(),
    status,
    details: JSON.stringify(details),
    version_date_found: details.version_date_found || null,
    error_message: details.error_message || null,
    duration_ms: details.duration_ms || null,
  })
}
