// app/api/otp/send/route.ts
// POST {phone, channel} — send OTP code via selected provider
// Rate limit: max 5 sends per phone per hour

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { getProvider } from '@/lib/otp/providerFactory'
import type { OTPChannel } from '@/lib/otp/types'

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MINUTES = 60
const OTP_EXPIRY_MINUTES = 10

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat.' }, { status: 401 })
    }

    const body = await req.json()
    const { phone, channel } = body as { phone?: string; channel?: OTPChannel }

    if (!phone || !channel) {
      return NextResponse.json({ error: 'Număr de telefon și canal obligatorii.' }, { status: 400 })
    }

    const allowedChannels: OTPChannel[] = ['whatsapp', 'sms', 'voice', 'email']
    if (!allowedChannels.includes(channel)) {
      return NextResponse.json({ error: 'Canal invalid.' }, { status: 400 })
    }

    // Rate limiting: max RATE_LIMIT_MAX sends per phone per hour
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()
    const { count, error: rateError } = await supabase
      .from('otp_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('phone', phone)
      .gte('created_at', windowStart)

    if (rateError) {
      console.error('Rate limit check error:', rateError)
    } else if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'Prea multe cereri. Încercați din nou într-o oră.' },
        { status: 429 }
      )
    }

    // Get org config to select provider
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

    const provider = getProvider(orgConfig)
    const result = await provider.sendCode(phone, channel)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Eroare la trimiterea codului.' }, { status: 500 })
    }

    // Log to otp_sessions
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString()
    await supabase.from('otp_sessions').insert({
      user_id: user.id,
      phone,
      channel,
      // code_hash stored for custom provider (returned as sid), null for Twilio (Twilio manages it)
      code_hash: result.sid?.startsWith('$2') ? result.sid : null,
      provider: orgConfig?.preferred_provider ?? 'twilio_verify',
      status: 'pending',
      expires_at: expiresAt,
    })

    return NextResponse.json({ success: true, expiresAt })
  } catch (err) {
    console.error('POST /api/otp/send error:', err)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
