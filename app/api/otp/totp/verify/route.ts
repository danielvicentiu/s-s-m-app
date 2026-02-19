// app/api/otp/totp/verify/route.ts
// POST {code} — verify TOTP code or backup code
// If first successful verify: set is_active=true on totp_secrets
// Backup codes are one-time use — nulled after consumption

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createSupabaseServer } from '@/lib/supabase/server'
import { verifyTOTPCode, decryptSecret } from '@/lib/otp/totpProvider'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat.' }, { status: 401 })
    }

    const body = await req.json()
    const { code } = body as { code?: string }

    if (!code) {
      return NextResponse.json({ error: 'Cod obligatoriu.' }, { status: 400 })
    }

    // Get TOTP secret (most recent, active or pending activation)
    const { data: totpRow, error: fetchError } = await supabase
      .from('totp_secrets')
      .select('id, secret_encrypted, is_active, backup_codes')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError || !totpRow) {
      return NextResponse.json(
        { error: 'TOTP neconfigurate. Mergeți la Setări → Securitate.' },
        { status: 404 }
      )
    }

    const cleanCode = code.replace(/[-\s]/g, '').toUpperCase()

    // Try TOTP code first (6 digits)
    if (/^\d{6}$/.test(cleanCode)) {
      const secretBase32 = decryptSecret(totpRow.secret_encrypted)
      const valid = verifyTOTPCode(secretBase32, cleanCode)

      if (!valid) {
        return NextResponse.json({ error: 'Cod TOTP invalid.' }, { status: 400 })
      }

      // Activate TOTP on first successful verify
      if (!totpRow.is_active) {
        await supabase
          .from('totp_secrets')
          .update({ is_active: true })
          .eq('id', totpRow.id)
      }

      return NextResponse.json({ success: true, method: 'totp' })
    }

    // Try backup code (format XXXX-XXXX → 8 chars after strip)
    if (/^[A-Z0-9]{8}$/.test(cleanCode)) {
      const hashedCodes: string[] = totpRow.backup_codes || []

      let matchIndex = -1
      for (let i = 0; i < hashedCodes.length; i++) {
        if (await bcrypt.compare(cleanCode, hashedCodes[i])) {
          matchIndex = i
          break
        }
      }

      if (matchIndex === -1) {
        return NextResponse.json({ error: 'Cod de rezervă invalid.' }, { status: 400 })
      }

      // Consume the backup code (replace with empty string to mark as used)
      const updatedCodes = [...hashedCodes]
      updatedCodes[matchIndex] = ''

      await supabase
        .from('totp_secrets')
        .update({
          backup_codes: updatedCodes,
          is_active: true,
        })
        .eq('id', totpRow.id)

      return NextResponse.json({ success: true, method: 'backup_code' })
    }

    return NextResponse.json({ error: 'Format cod invalid.' }, { status: 400 })
  } catch (err) {
    console.error('POST /api/otp/totp/verify error:', err)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
