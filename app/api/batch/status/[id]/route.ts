// app/api/batch/status/[id]/route.ts
// M6 BATCH PROCESSING — Get Batch Job by ID
// GET: returnează statusul și detaliile unui job specific
// Data: 18 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

/**
 * GET /api/batch/status/[id]
 * Returnează detaliile complete ale unui job batch după ID.
 * Acces: consultanții văd toate job-urile; ceilalți văd doar job-urile org-ului propriu.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'ID-ul job-ului este obligatoriu' }, { status: 400 })
    }

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
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
    }

    const { data: job, error: jobError } = await supabase
      .from('batch_jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job-ul nu a fost găsit' }, { status: 404 })
    }

    // Non-consultanții văd doar job-urile din org-ul lor
    const isConsultant = membership.role === 'consultant'
    if (!isConsultant && job.org_id !== membership.organization_id) {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
    }

    // Calculează durata
    let durationMs: number | null = null
    if (job.started_at && job.completed_at) {
      durationMs = new Date(job.completed_at).getTime() - new Date(job.started_at).getTime()
    } else if (job.started_at) {
      durationMs = Date.now() - new Date(job.started_at).getTime()
    }

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        duration_ms: durationMs,
        progress_pct:
          job.items_total > 0
            ? Math.round((job.items_processed / job.items_total) * 100)
            : job.status === 'done' ? 100 : 0,
      },
    })
  } catch (error) {
    console.error('[API /api/batch/status/[id]] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Eroare necunoscută',
    }, { status: 500 })
  }
}
