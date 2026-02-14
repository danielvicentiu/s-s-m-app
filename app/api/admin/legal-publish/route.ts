// app/api/admin/legal-publish/route.ts
// M5 Publishing — Hibrid auto-match + override + publish
// GET: Preview auto-match (obligații aprobate → organizații)
// POST: Publish (confirmă și inserează în organization_obligations)

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================================
// GET — Preview: ce obligații se vor publica la ce organizații
// ============================================================
export async function GET(request: NextRequest) {
  const supabase = supabaseAdmin

  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('mode') || 'country'
  const obligationIdsParam = searchParams.get('obligation_ids')
  const legalActId = searchParams.get('legal_act_id')

  try {
    // 1. Get approved obligations
    let obligationIds: string[] = []

    if (obligationIdsParam) {
      obligationIds = obligationIdsParam.split(',').filter(Boolean)
    } else {
      let query = supabase
        .from('legal_obligations')
        .select('id')
        .eq('review_status', 'approved')

      if (legalActId) {
        query = query.eq('legal_act_id', legalActId)
      }

      const { data: approvedObls, error } = await query
      if (error) throw error
      obligationIds = (approvedObls || []).map((o: any) => o.id)
    }

    if (obligationIds.length === 0) {
      return NextResponse.json({
        preview: [],
        stats: { obligations: 0, organizations: 0, assignments: 0, already_published: 0 },
        message: 'Nu există obligații aprobate pentru publicare'
      })
    }

    // 2. Call auto-match function
    const { data: matches, error: matchError } = await supabase
      .rpc('fn_m5_auto_match', {
        p_obligation_ids: obligationIds,
        p_match_mode: mode
      })

    if (matchError) throw matchError

    // 3. Get obligation details
    const { data: obligations } = await supabase
      .from('legal_obligations')
      .select(`
        id, article_ref, obligation_type, description, severity, confidence,
        legal_acts!inner(id, act_type, act_number, act_year, act_full_name, act_short_name, country_code, domain)
      `)
      .in('id', obligationIds)

    // 4. Get organizations
    const orgIds = [...new Set((matches || []).map((m: any) => m.organization_id))]
    const { data: organizations } = await supabase
      .from('organizations')
      .select('id, name, cui, country_code, caen_code, industry_domain')
      .in('id', orgIds)

    // 5. Build stats
    const newMatches = (matches || []).filter((m: any) => !m.already_published)
    const stats = {
      obligations: obligationIds.length,
      organizations: orgIds.length,
      assignments: newMatches.length,
      already_published: (matches || []).filter((m: any) => m.already_published).length
    }

    return NextResponse.json({
      preview: matches || [],
      obligations: obligations || [],
      organizations: organizations || [],
      stats,
      mode
    })

  } catch (error: any) {
    console.error('M5 Preview error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ============================================================
// POST — Publish: inserează obligațiile la organizații
// ============================================================
export async function POST(request: NextRequest) {
  const supabase = supabaseAdmin

  try {
    const body = await request.json()
    const { assignments, title, description, due_date } = body

    if (!assignments || !Array.isArray(assignments) || assignments.length === 0) {
      return NextResponse.json({ error: 'No assignments provided' }, { status: 400 })
    }

    // 1. Create publish batch
    const uniqueOblIds = [...new Set(assignments.map((a: any) => a.obligation_id))]
    const uniqueOrgIds = [...new Set(assignments.map((a: any) => a.organization_id))]

    const { data: batch, error: batchError } = await supabase
      .from('publish_batches')
      .insert({
        title: title || `Publicare ${assignments.length} atribuiri`,
        description,
        total_obligations: uniqueOblIds.length,
        total_organizations: uniqueOrgIds.length,
        total_assignments: assignments.length,
        match_config: { 
          assignments_count: assignments.length,
          due_date: due_date || null
        }
      })
      .select()
      .single()

    if (batchError) throw batchError

    // 2. Insert organization_obligations
    const rows = assignments.map((a: any) => ({
      organization_id: a.organization_id,
      obligation_id: a.obligation_id,
      match_type: a.match_type || 'manual',
      match_confidence: a.match_confidence || 1.0,
      batch_id: batch.id,
      due_date: due_date || null
    }))

    // Insert in chunks of 100
    const CHUNK_SIZE = 100
    let insertedCount = 0

    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE)
      
      const { data: inserted, error: insertError } = await supabase
        .from('organization_obligations')
        .upsert(chunk, { 
          onConflict: 'organization_id,obligation_id',
          ignoreDuplicates: true 
        })
        .select('id')

      if (insertError) throw insertError
      insertedCount += (inserted || []).length
    }

    const skippedCount = rows.length - insertedCount

    // 3. Update batch
    await supabase
      .from('publish_batches')
      .update({ total_assignments: insertedCount })
      .eq('id', batch.id)

    return NextResponse.json({
      success: true,
      batch_id: batch.id,
      inserted: insertedCount,
      skipped: skippedCount,
      message: `Publicat ${insertedCount} obligații la organizații (${skippedCount} duplicate ignorate)`
    })

  } catch (error: any) {
    console.error('M5 Publish error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
