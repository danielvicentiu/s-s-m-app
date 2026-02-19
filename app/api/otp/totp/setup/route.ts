// app/api/otp/totp/setup/route.ts
// POST — generate TOTP secret, encrypt and save to totp_secrets,
// generate 10 backup codes (hashed in DB, plain returned once),
// return otpauth:// URI and plain backup codes

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { createSupabaseServer } from '@/lib/supabase/server'
import { generateTOTPSecret, encryptSecret } from '@/lib/otp/totpProvider'

const BACKUP_CODE_COUNT = 10

function generateBackupCode(): string {
  // Format: XXXX-XXXX (8 alphanumeric chars split by dash)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  const bytes = crypto.randomBytes(8)
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length]
  }
  return `${code.slice(0, 4)}-${code.slice(4)}`
}

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat.' }, { status: 401 })
    }

    // Generate TOTP secret
    const label = user.email || user.id
    const { secretBase32, uri } = generateTOTPSecret(label)

    // Encrypt secret for storage
    const secretEncrypted = encryptSecret(secretBase32)

    // Generate 10 backup codes — hash for storage, return plain once
    const plainCodes: string[] = []
    const hashedCodes: string[] = []

    for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
      const code = generateBackupCode()
      plainCodes.push(code)
      hashedCodes.push(await bcrypt.hash(code, 10))
    }

    // Deactivate any existing TOTP setup for this user
    await supabase
      .from('totp_secrets')
      .update({ is_active: false })
      .eq('user_id', user.id)

    // Insert new TOTP secret (is_active=false until first verify)
    const { error: insertError } = await supabase.from('totp_secrets').insert({
      user_id: user.id,
      secret_encrypted: secretEncrypted,
      is_active: false,
      backup_codes: hashedCodes,
    })

    if (insertError) {
      console.error('totp_secrets insert error:', insertError)
      return NextResponse.json({ error: 'Eroare la salvarea secretului TOTP.' }, { status: 500 })
    }

    return NextResponse.json({
      uri,
      backupCodes: plainCodes,
    })
  } catch (err) {
    console.error('POST /api/otp/totp/setup error:', err)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
