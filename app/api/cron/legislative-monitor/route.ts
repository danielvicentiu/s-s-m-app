// ============================================================
// app/api/cron/legislative-monitor/route.ts
// M7 Legislative Monitor — CRON Job
//
// GET /api/cron/legislative-monitor
// Verifică actele legislative RO pentru modificări
// Declanșat: zilnic via Vercel Cron (adaugă în vercel.json când ești gata)
// Auth: Bearer ${CRON_SECRET}
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkForUpdates } from '@/lib/legislative/ro-adapter'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  // ─── Auth: CRON_SECRET ──────────────────────────────────────
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[CRON legislative-monitor] Start:', new Date().toISOString())

  const supabase = getSupabase()
  const errors: { actId?: string; message: string }[] = []

  try {
    // ─── Step 1: Load active RO acts from legal_acts ───────────
    const { data: acts, error: fetchError } = await supabase
      .from('legal_acts')
      .select('id')
      .eq('country_code', 'RO')
      .eq('status', 'active')
      .order('last_checked_at', { ascending: true, nullsFirst: true })
      // Limit batch to 50 to stay within Vercel function timeout
      .limit(50)

    if (fetchError) {
      console.error('[CRON legislative-monitor] DB fetch error:', fetchError)
      return NextResponse.json(
        {
          success: false,
          error: fetchError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    if (!acts || acts.length === 0) {
      console.log('[CRON legislative-monitor] No active RO acts to check')

      await logCronRun(supabase, {
        acts_checked: 0,
        acts_updated: 0,
        acts_new: 0,
        errors: [],
        duration_ms: Date.now() - startTime,
        triggered_by: 'cron',
      })

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        acts_checked: 0,
        acts_updated: 0,
        message: 'Niciun act activ RO de verificat',
        duration_ms: Date.now() - startTime,
      })
    }

    console.log(`[CRON legislative-monitor] Checking ${acts.length} acts`)

    // ─── Step 2: Check for updates ────────────────────────────
    const actIds = acts.map((a) => a.id as string)
    const updatedActs = await checkForUpdates(actIds)

    // ─── Step 3: Mark updated acts ────────────────────────────
    if (updatedActs.length > 0) {
      console.log(
        `[CRON legislative-monitor] ${updatedActs.length} acts have updates`
      )

      for (const updated of updatedActs) {
        try {
          // Update last_checked_at; surface change via source_url if portal URL improved
          const updatePayload: Record<string, unknown> = {
            last_checked_at: new Date().toISOString(),
          }

          if (updated.portalUrl) {
            updatePayload.source_url = updated.portalUrl
          }

          await supabase
            .from('legal_acts')
            .update(updatePayload)
            .eq('id', updated.actId)
        } catch (updateErr) {
          const msg =
            updateErr instanceof Error ? updateErr.message : String(updateErr)
          errors.push({ actId: updated.actId, message: msg })
          console.error(
            `[CRON legislative-monitor] Update error for ${updated.actId}:`,
            msg
          )
        }
      }
    }

    // ─── Step 4: Update last_checked_at for non-updated acts ──
    const updatedIds = new Set(updatedActs.map((u) => u.actId))
    const unchangedIds = actIds.filter((id) => !updatedIds.has(id))

    if (unchangedIds.length > 0) {
      // Batch update in chunks of 20
      for (let i = 0; i < unchangedIds.length; i += 20) {
        const chunk = unchangedIds.slice(i, i + 20)
        await supabase
          .from('legal_acts')
          .update({ last_checked_at: new Date().toISOString() })
          .in('id', chunk)
          .eq('country_code', 'RO')
      }
    }

    // ─── Step 5: Log cron run ─────────────────────────────────
    const duration = Date.now() - startTime

    await logCronRun(supabase, {
      acts_checked: acts.length,
      acts_updated: updatedActs.length,
      acts_new: 0,
      errors,
      duration_ms: duration,
      triggered_by: 'cron',
    })

    console.log(
      `[CRON legislative-monitor] Done: ${acts.length} checked, ${updatedActs.length} updated (${duration}ms)`
    )

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      acts_checked: acts.length,
      acts_updated: updatedActs.length,
      updated_keys: updatedActs.map((u) => u.actKey ?? u.actId),
      errors_count: errors.length,
      duration_ms: duration,
    })
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error('[CRON legislative-monitor] Fatal error:', err)

    await logCronRun(supabase, {
      acts_checked: 0,
      acts_updated: 0,
      acts_new: 0,
      errors: [{ message: errMsg }],
      duration_ms: Date.now() - startTime,
      triggered_by: 'cron',
    }).catch((): null => null)

    return NextResponse.json(
      {
        success: false,
        error: errMsg,
        timestamp: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
      },
      { status: 500 }
    )
  }
}

// ─── Log helper ───────────────────────────────────────────────

async function logCronRun(
  supabase: ReturnType<typeof createClient>,
  data: {
    acts_checked: number
    acts_updated: number
    acts_new: number
    errors: unknown[]
    duration_ms: number
    triggered_by: string
  }
) {
  const { error } = await supabase.from('ro_cron_log').insert({
    run_at: new Date().toISOString(),
    acts_checked: data.acts_checked,
    acts_updated: data.acts_updated,
    acts_new: data.acts_new,
    errors: data.errors,
    duration_ms: data.duration_ms,
    triggered_by: data.triggered_by,
  })

  if (error) {
    // Table may not exist yet — log warning but don't throw
    console.warn('[CRON legislative-monitor] Could not write to ro_cron_log:', error.message)
  }
}
