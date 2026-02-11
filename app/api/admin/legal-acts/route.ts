// FIȘIER: app/api/admin/legal-acts/route.ts
// Listare acte legislative cu status extracție + filtrare pe domenii/subdomenii/tip/status

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Query params opționale pentru filtrare
    const domain = searchParams.get('domain') // SSM, PSI, etc.
    const actType = searchParams.get('act_type') // LEGE, HG, etc.
    const status = searchParams.get('status') // no_text, text_imported, ai_extracted, validated
    const search = searchParams.get('search') // text search

    let query = supabaseAdmin
      .from('legal_acts')
      .select(`
        id, act_type, act_number, act_year,
        act_short_name, act_full_name,
        domain, domains, subdomains,
        status, country_code,
        confidence_level, research_phase,
        full_text_metadata,
        ai_extraction_date, ai_extraction_result,
        has_penalties, penalty_min_lei, penalty_max_lei,
        validation_result, validation_date,
        display_mode, parent_act_id, hierarchy_order
      `)

    // Filtru domeniu — folosește JSONB contains pe domains array
    if (domain) {
      query = query.contains('domains', [domain])
    }

    // Filtru tip act
    if (actType) {
      query = query.eq('act_type', actType)
    }

    // Filtru search
    if (search) {
      query = query.or(`act_short_name.ilike.%${search}%,act_full_name.ilike.%${search}%`)
    }

    // Ordonare: hierarchy_order (legi primele), apoi an descrescător
    query = query
      .order('hierarchy_order', { ascending: true, nullsFirst: false })
      .order('act_year', { ascending: false })
      .order('act_type', { ascending: true })

    const { data, error } = await query

    if (error) throw error

    // Filtru status pipeline — se face client-side pentru că depinde de mai multe coloane
    let filteredData = data || []
    if (status) {
      filteredData = filteredData.filter((act: any) => {
        switch (status) {
          case 'validated': return !!act.validation_date
          case 'ai_extracted': return !!act.ai_extraction_date && !act.validation_date
          case 'text_imported': return act.full_text_metadata?.characters > 0 && !act.ai_extraction_date
          case 'no_text': return !act.full_text_metadata?.characters
          default: return true
        }
      })
    }

    return NextResponse.json({ acts: filteredData })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
