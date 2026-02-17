// FIȘIER: app/api/admin/legal-taxonomy/route.ts
// Listare taxonomie legislativă (domenii + subdomenii)
// Folosit de UI-ul de filtrare din /admin/legal-acts

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin()
  try {
    const { data, error } = await supabaseAdmin
      .from('legal_taxonomy')
      .select('id, domain_code, domain_name, subdomain_code, subdomain_name, description, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ taxonomy: data || [] })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
