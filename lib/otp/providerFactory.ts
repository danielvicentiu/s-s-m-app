// lib/otp/providerFactory.ts
// Returns the correct OTP provider based on org configuration

import { TwilioVerifyProvider } from './twilioVerifyProvider'
import { TOTPProvider } from './totpProvider'
import { CustomOTPProvider } from './customOTPProvider'
import type { OTPConfig, OTPProvider } from './types'
import type { SupabaseClient } from '@supabase/supabase-js'

// Get the appropriate provider for an org's OTP config
export function getProvider(config?: OTPConfig | null): OTPProvider {
  const preferred = config?.preferred_provider ?? 'twilio_verify'

  switch (preferred) {
    case 'totp':
      return new TOTPProvider()
    case 'custom_sms':
      return new CustomOTPProvider()
    case 'twilio_verify':
    default:
      return new TwilioVerifyProvider()
  }
}

// Load org OTP config from Supabase and return the matching provider
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProviderForOrg(
  supabase: SupabaseClient<any>,
  orgId: string
): Promise<OTPProvider> {
  const { data: config, error } = await supabase
    .from('otp_configurations')
    .select('preferred_provider, is_active')
    .eq('org_id', orgId)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('getProviderForOrg error:', error)
  }

  return getProvider(config as OTPConfig | null)
}
