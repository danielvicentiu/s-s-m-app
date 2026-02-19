// app/api/auth/pin/route.ts
// POST: Verifică PIN-ul utilizatorului și returnează token_hash pentru sesiune
// Rate limit: 5 încercări → blocare 15 minute

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, pin } = body as { email?: string; pin?: string }

    if (!email || !pin || pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 })
    }

    // Căutăm înregistrarea PIN
    const { data: pinRecord, error: pinError } = await supabaseAdmin
      .from('user_pin_auth')
      .select('user_id, pin_hash, pin_attempts, pin_locked_until')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (pinError || !pinRecord) {
      return NextResponse.json({ error: 'PIN nesetat pentru acest cont' }, { status: 404 })
    }

    if (!pinRecord.pin_hash) {
      return NextResponse.json({ error: 'PIN nesetat pentru acest cont' }, { status: 404 })
    }

    // Verificare blocare
    if (pinRecord.pin_locked_until && new Date(pinRecord.pin_locked_until) > new Date()) {
      const minutesLeft = Math.ceil(
        (new Date(pinRecord.pin_locked_until).getTime() - Date.now()) / 60000
      )
      return NextResponse.json(
        { error: `Contul PIN blocat. Încearcă din nou peste ${minutesLeft} minute.` },
        { status: 429 }
      )
    }

    // Verificare PIN
    const isValid = await bcrypt.compare(pin, pinRecord.pin_hash)

    if (!isValid) {
      const newAttempts = (pinRecord.pin_attempts || 0) + 1
      const updates: Record<string, unknown> = { pin_attempts: newAttempts }

      if (newAttempts >= 5) {
        updates.pin_locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }

      await supabaseAdmin
        .from('user_pin_auth')
        .update(updates)
        .eq('user_id', pinRecord.user_id)

      const attemptsLeft = Math.max(0, 5 - newAttempts)
      return NextResponse.json(
        {
          error:
            attemptsLeft > 0
              ? `PIN incorect. Mai ai ${attemptsLeft} încercări.`
              : 'PIN incorect. Contul PIN blocat 15 minute.',
        },
        { status: 401 }
      )
    }

    // PIN corect — resetăm contorul
    await supabaseAdmin
      .from('user_pin_auth')
      .update({ pin_attempts: 0, pin_locked_until: null })
      .eq('user_id', pinRecord.user_id)

    // Generăm magic link pentru sesiune (fără email trimis)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase().trim(),
    })

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('PIN generate link error:', linkError)
      return NextResponse.json({ error: 'Eroare generare sesiune' }, { status: 500 })
    }

    return NextResponse.json({ token_hash: linkData.properties.hashed_token })
  } catch (error) {
    console.error('PIN auth error:', error)
    return NextResponse.json({ error: 'Eroare server intern' }, { status: 500 })
  }
}
