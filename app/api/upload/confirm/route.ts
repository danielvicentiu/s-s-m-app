// app/api/upload/confirm/route.ts
// POST: Mark a document scan as reviewed (requires authentication)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const body = await request.json()
    const { scan_id } = body

    if (!scan_id) {
      return NextResponse.json({ error: 'scan_id este obligatoriu' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('document_scans')
      .update({
        status: 'reviewed',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', scan_id)

    if (updateError) {
      console.error('[API] confirm update error:', updateError)
      return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[API] confirm exception:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
