// app/api/notifications/register-token/route.ts
// Înregistrează un FCM token pentru utilizatorul autentificat

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const body = await request.json()
    const { token } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token FCM lipsă sau invalid' }, { status: 400 })
    }

    // Upsert: dacă token-ul există deja, actualizează last_used; altfel inserează
    const { error } = await supabase
      .from('fcm_tokens')
      .upsert(
        {
          user_id: user.id,
          token,
          is_active: true,
          last_used: new Date().toISOString(),
        },
        {
          onConflict: 'token',
          ignoreDuplicates: false,
        }
      )

    if (error) {
      console.error('[FCM] register-token upsert error:', error)
      return NextResponse.json({ error: 'Eroare la salvarea token-ului' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[FCM] register-token error:', error)
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 })
  }
}
