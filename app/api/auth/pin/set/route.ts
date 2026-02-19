// app/api/auth/pin/set/route.ts
// POST: Setează sau actualizează PIN-ul utilizatorului curent
// Necesită sesiune Supabase activă

import { createClient } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(req: NextRequest) {
  try {
    // Verificare sesiune activă
    const supabase = await createSupabaseServer()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const body = await req.json()
    const { pin } = body as { pin?: string }

    if (!pin || pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN invalid. Folosește 4-6 cifre.' },
        { status: 400 }
      )
    }

    const pinHash = await bcrypt.hash(pin, 12)
    const email = user.email?.toLowerCase().trim()

    if (!email) {
      return NextResponse.json({ error: 'Email lipsă din cont' }, { status: 400 })
    }

    // Upsert înregistrare PIN
    const { error: upsertError } = await supabaseAdmin
      .from('user_pin_auth')
      .upsert(
        {
          user_id: user.id,
          email,
          pin_hash: pinHash,
          pin_attempts: 0,
          pin_locked_until: null,
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      console.error('PIN set error:', upsertError)
      return NextResponse.json({ error: 'Eroare salvare PIN' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'PIN setat cu succes' })
  } catch (error) {
    console.error('PIN set error:', error)
    return NextResponse.json({ error: 'Eroare server intern' }, { status: 500 })
  }
}
