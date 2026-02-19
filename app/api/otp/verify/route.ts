// app/api/otp/verify/route.ts
// POST {phone, code, trustDevice?} — verify OTP code via provider
// If trustDevice=true: trust this device for 30 days + set cookie

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { getProvider } from '@/lib/otp/providerFactory'
import { generateFingerprint, trustDevice } from '@/lib/otp/deviceTrust'
import { verifyCodeHash } from '@/lib/otp/customOTPProvider'
import type { OTPChannel } from '@/lib/otp/types'

const TRUST_DEVICE_DAYS = 30

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat.' }, { status: 401 })
    }

    const body = await req.json()
    const { phone, code, trustDevice: shouldTrust } = body as {
      phone?: string
      code?: string
      trustDevice?: boolean
    }

    if (!phone || !code) {
      return NextResponse.json({ error: 'Telefon și cod obligatorii.' }, { status: 400 })
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Codul trebuie să aibă 6 cifre.' }, { status: 400 })
    }

    // Get the active OTP session for this phone
    const now = new Date().toISOString()
    const { data: session, error: sessionError } = await supabase
      .from('otp_sessions')
      .select('id, provider, code_hash, status, expires_at')
      .eq('user_id', user.id)
      .eq('phone', phone)
      .eq('status', 'pending')
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (sessionError) {
      console.error('OTP session fetch error:', sessionError)
      return NextResponse.json({ error: 'Eroare la verificare.' }, { status: 500 })
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Sesiune OTP inexistentă sau expirată.' },
        { status: 400 }
      )
    }

    // Get org config for provider selection
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    let orgConfig = null
    if (membership?.organization_id) {
      const { data: config } = await supabase
        .from('otp_configurations')
        .select('preferred_provider, is_active')
        .eq('org_id', membership.organization_id)
        .eq('is_active', true)
        .maybeSingle()
      orgConfig = config
    }

    let valid = false

    if (session.provider === 'custom_sms' && session.code_hash) {
      // Verify against bcrypt hash in DB
      valid = await verifyCodeHash(code, session.code_hash)
    } else {
      // Twilio Verify — delegate to provider
      const provider = getProvider(orgConfig)
      const result = await provider.checkCode(phone, code)
      valid = result.valid
    }

    if (!valid) {
      return NextResponse.json({ error: 'Cod invalid sau expirat.' }, { status: 400 })
    }

    // Mark session as verified
    await supabase
      .from('otp_sessions')
      .update({ status: 'verified' })
      .eq('id', session.id)

    const response = NextResponse.json({ success: true })

    // Trust device if requested
    if (shouldTrust) {
      const fingerprint = generateFingerprint(req)
      const ua = req.headers.get('user-agent') || 'Dispozitiv'
      const deviceName = ua.length > 80 ? ua.slice(0, 80) : ua
      const trusted = await trustDevice(user.id, fingerprint, TRUST_DEVICE_DAYS, deviceName)

      if (trusted) {
        response.cookies.set('trusted_device', fingerprint, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: TRUST_DEVICE_DAYS * 24 * 60 * 60,
          path: '/',
        })
      }
    }

    return response
  } catch (err) {
    console.error('POST /api/otp/verify error:', err)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
