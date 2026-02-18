// app/api/batch/process/route.ts
// M6 BATCH PROCESSING — Process Next Pending Job
// POST: preia și procesează primul job pending (cron + trigger manual)
// Data: 18 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase/server'

export const maxDuration = 120
export const dynamic = 'force-dynamic'

interface ErrorLogEntry {
  item: string
  error: string
  timestamp: string
}

type ServiceSupabase = ReturnType<typeof getServiceSupabase>

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── Item-level processors ──────────────────────────────────────────────────

async function processItem(
  supabase: ServiceSupabase,
  type: string,
  item: Record<string, unknown>,
): Promise<void> {
  switch (type) {
    case 'psi_check': {
      const id = item.id as string
      if (!id) throw new Error('Lipsă equipment id în payload')
      const { error } = await supabase
        .from('safety_equipment')
        .select('id, expiry_date, is_compliant')
        .eq('id', id)
        .single()
      if (error) throw new Error(`safety_equipment fetch: ${error.message}`)
      break
    }
    case 'medical_check': {
      const id = item.id as string
      if (!id) throw new Error('Lipsă examination id în payload')
      const { error } = await supabase
        .from('medical_examinations')
        .select('id, expiry_date, result')
        .eq('id', id)
        .single()
      if (error) throw new Error(`medical_examinations fetch: ${error.message}`)
      break
    }
    case 'iscir_check': {
      const id = item.id as string
      if (!id) throw new Error('Lipsă iscir equipment id în payload')
      const { error } = await supabase
        .from('iscir_equipment')
        .select('id, next_verification_date, status')
        .eq('id', id)
        .single()
      if (error) throw new Error(`iscir_equipment fetch: ${error.message}`)
      break
    }
    case 'legislative_update': {
      const id = item.id as string
      if (!id) throw new Error('Lipsă act legislativ id în payload')
      // Hook rezervat pentru pipeline M1-M5
      break
    }
    default:
      throw new Error(`Tip job necunoscut: ${type}`)
  }
}

// ── Single-action processor (fără array de items) ──────────────────────────

async function processSingleAction(
  supabase: ServiceSupabase,
  type: string,
  orgId: string | null,
): Promise<void> {
  switch (type) {
    case 'psi_check': {
      let query = supabase.from('safety_equipment').select('id').order('expiry_date')
      if (orgId) query = query.eq('organization_id', orgId)
      const { error } = await query
      if (error) throw new Error(`psi_check: ${error.message}`)
      break
    }
    case 'medical_check': {
      let query = supabase.from('medical_examinations').select('id').order('expiry_date')
      if (orgId) query = query.eq('organization_id', orgId)
      const { error } = await query
      if (error) throw new Error(`medical_check: ${error.message}`)
      break
    }
    case 'iscir_check': {
      let query = supabase.from('iscir_equipment').select('id').eq('status', 'activ')
      if (orgId) query = query.eq('organization_id', orgId)
      const { error } = await query
      if (error) throw new Error(`iscir_check: ${error.message}`)
      break
    }
    case 'legislative_update':
      // Hook rezervat pentru pipeline M1-M5
      break
    default:
      throw new Error(`Tip job necunoscut: ${type}`)
  }
}

// ── Core job runner ────────────────────────────────────────────────────────

async function runJob(
  supabase: ServiceSupabase,
  jobId: string,
  type: string,
  payload: Record<string, unknown>,
  orgId: string | null,
): Promise<{ itemsProcessed: number; itemsFailed: number; status: 'done' | 'failed' }> {
  const errorLog: ErrorLogEntry[] = []
  let itemsProcessed = 0
  let itemsFailed = 0

  const items: Record<string, unknown>[] = Array.isArray(payload?.items)
    ? (payload.items as Record<string, unknown>[])
    : []
  const totalItems = items.length || 1

  // Marchează ca processing
  await supabase
    .from('batch_jobs')
    .update({
      status: 'processing',
      started_at: new Date().toISOString(),
      items_total: totalItems,
    })
    .eq('id', jobId)

  try {
    if (items.length > 0) {
      for (const item of items) {
        try {
          await processItem(supabase, type, item)
          itemsProcessed++
          // Actualizează progresul după fiecare item
          await supabase
            .from('batch_jobs')
            .update({ items_processed: itemsProcessed })
            .eq('id', jobId)
        } catch (itemErr) {
          itemsFailed++
          errorLog.push({
            item: JSON.stringify(item).slice(0, 200),
            error: itemErr instanceof Error ? itemErr.message : 'Eroare necunoscută',
            timestamp: new Date().toISOString(),
          })
        }
      }
    } else {
      // Job fără array de items — acțiune globală pentru org
      await processSingleAction(supabase, type, orgId)
      itemsProcessed = 1
    }

    const finalStatus: 'done' | 'failed' =
      itemsFailed > 0 && itemsProcessed === 0 ? 'failed' : 'done'

    await supabase
      .from('batch_jobs')
      .update({
        status: finalStatus,
        completed_at: new Date().toISOString(),
        items_processed: itemsProcessed,
        items_failed: itemsFailed,
        error_log: errorLog,
      })
      .eq('id', jobId)

    return { itemsProcessed, itemsFailed, status: finalStatus }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Eroare necunoscută'
    await supabase
      .from('batch_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        items_processed: itemsProcessed,
        items_failed: itemsFailed + 1,
        error_log: [
          ...errorLog,
          { item: 'job', error: errMsg, timestamp: new Date().toISOString() },
        ],
      })
      .eq('id', jobId)
    throw error
  }
}

// ── Route handler ──────────────────────────────────────────────────────────

/**
 * POST /api/batch/process
 * Preia și procesează primul job pending.
 * Autentificare: Bearer CRON_SECRET (cron) SAU sesiune utilizator (consultant)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Suportă atât cron (Bearer token) cât și trigger manual (sesiune user)
    const authHeader = request.headers.get('authorization')
    const isCron =
      !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`

    if (!isCron) {
      const supabaseServer = await createSupabaseServer()
      const { data: { user }, error: authError } = await supabaseServer.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
      }
      const { data: membership } = await supabaseServer
        .from('memberships')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'consultant')
        .maybeSingle()
      if (!membership) {
        return NextResponse.json(
          { error: 'Acces interzis. Doar consultanții pot procesa batch-uri.' },
          { status: 403 },
        )
      }
    }

    const supabase = getServiceSupabase()

    // Preia primul job pending (FIFO)
    const { data: job, error: fetchError } = await supabase
      .from('batch_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (fetchError) throw new Error(fetchError.message)

    if (!job) {
      return NextResponse.json({
        success: true,
        message: 'Nu există job-uri în așteptare',
        processed: false,
        duration_ms: Date.now() - startTime,
      })
    }

    console.log('[API /api/batch/process] Procesare job:', {
      jobId: job.id,
      type: job.type,
      isCron,
    })

    const result = await runJob(
      supabase,
      job.id,
      job.type as string,
      (job.payload ?? {}) as Record<string, unknown>,
      job.org_id as string | null,
    )

    console.log('[API /api/batch/process] Job finalizat:', {
      jobId: job.id,
      status: result.status,
      itemsProcessed: result.itemsProcessed,
      itemsFailed: result.itemsFailed,
    })

    return NextResponse.json({
      success: true,
      processed: true,
      jobId: job.id,
      type: job.type,
      status: result.status,
      itemsProcessed: result.itemsProcessed,
      itemsFailed: result.itemsFailed,
      duration_ms: Date.now() - startTime,
    })
  } catch (error) {
    console.error('[API /api/batch/process] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută',
      duration_ms: Date.now() - startTime,
    }, { status: 500 })
  }
}
