// app/api/notifications/disable/route.ts
// Dezactivează toate token-urile FCM ale utilizatorului curent

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const { error } = await supabase
      .from('fcm_tokens')
      .update({ is_active: false })
      .eq('user_id', user.id)

    if (error) {
      console.error('[FCM] disable error:', error)
      return NextResponse.json({ error: 'Eroare la dezactivarea token-urilor' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[FCM] disable error:', error)
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 })
  }
}
