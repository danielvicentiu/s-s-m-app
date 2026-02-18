// app/api/batch/create/route.ts
// M6 BATCH PROCESSING — Create Batch Job
// POST: creează un nou job în tabela batch_jobs
// Data: 18 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

const VALID_TYPES = ['legislative_update', 'psi_check', 'medical_check', 'iscir_check'] as const
type BatchJobType = (typeof VALID_TYPES)[number]

/**
 * POST /api/batch/create
 * Creează un job batch nou cu status='pending'
 *
 * Body:
 * {
 *   "type": "psi_check" | "medical_check" | "iscir_check" | "legislative_update",
 *   "org_id": "uuid" (opțional — consultanții pot omite),
 *   "payload": { "items": [...] } (opțional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const { data: membership } = await supabase
      .from('memberships')
      .select('role, organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (!membership) {
      return NextResponse.json({ error: 'Nu aveți un cont activ în platformă' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({})) as {
      type?: string
      payload?: Record<string, unknown>
      org_id?: string
    }

    const { type, payload, org_id } = body

    if (!type) {
      return NextResponse.json({ error: 'Câmpul type este obligatoriu' }, { status: 400 })
    }

    if (!VALID_TYPES.includes(type as BatchJobType)) {
      return NextResponse.json({
        error: `Tip invalid. Valori acceptate: ${VALID_TYPES.join(', ')}`,
      }, { status: 400 })
    }

    // Consultanții pot specifica org_id; ceilalți sunt limitați la propria org
    const orgId = org_id ?? (membership.role !== 'consultant' ? membership.organization_id : null)

    const items = Array.isArray(payload?.items) ? (payload.items as unknown[]).length : 0

    const { data: job, error: insertError } = await supabase
      .from('batch_jobs')
      .insert([{
        org_id: orgId,
        type,
        payload: payload ?? {},
        status: 'pending',
        created_by: user.id,
        items_total: items,
      }])
      .select()
      .single()

    if (insertError) throw new Error(insertError.message)

    console.log('[API /api/batch/create] Job creat:', { jobId: job.id, type, orgId })

    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (error) {
    console.error('[API /api/batch/create] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută',
    }, { status: 500 })
  }
}
