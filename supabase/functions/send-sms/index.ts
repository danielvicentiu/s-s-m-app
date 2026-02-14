// Edge Function: send-sms
// Trimite SMS via Twilio cu country code detection, rate limiting, și cost tracking

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')! // Ex: +40123456789
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const MAX_SMS_LENGTH = 160
const RATE_LIMIT_PER_ORG_PER_HOUR = 100
const COST_PER_SMS_EUR = 0.05 // Estimare cost per SMS

interface SendSMSRequest {
  phone: string
  message: string
  locale?: string
  organizationId?: string
  metadata?: Record<string, unknown>
}

interface SendSMSResponse {
  success: boolean
  messageId?: string
  error?: string
  details?: {
    phone: string
    messageLength: number
    estimatedCost: number
    countryCode: string
  }
}

// Detectează country code din număr de telefon
function detectCountryCode(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')

  if (cleaned.startsWith('+40') || cleaned.startsWith('0040')) return 'RO'
  if (cleaned.startsWith('+359') || cleaned.startsWith('00359')) return 'BG'
  if (cleaned.startsWith('+36') || cleaned.startsWith('0036')) return 'HU'
  if (cleaned.startsWith('+49') || cleaned.startsWith('0049')) return 'DE'
  if (cleaned.startsWith('+1')) return 'US'
  if (cleaned.startsWith('+44')) return 'UK'

  return 'UNKNOWN'
}

// Normalizează număr de telefon la format internațional
function normalizePhoneNumber(phone: string, countryCode: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')

  // Dacă începe cu +, returnează direct
  if (cleaned.startsWith('+')) {
    return cleaned
  }

  // Înlocuiește 00 cu +
  if (cleaned.startsWith('00')) {
    return '+' + cleaned.slice(2)
  }

  // Adaugă prefix bazat pe country code detectat
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1) // Elimină 0 de la început
  }

  switch (countryCode) {
    case 'RO':
      return '+40' + cleaned
    case 'BG':
      return '+359' + cleaned
    case 'HU':
      return '+36' + cleaned
    case 'DE':
      return '+49' + cleaned
    default:
      return cleaned.startsWith('+') ? cleaned : '+' + cleaned
  }
}

// Verifică rate limiting
async function checkRateLimit(
  supabase: any,
  organizationId: string
): Promise<{ allowed: boolean; count: number }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('sms_delivery_log')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .gte('created_at', oneHourAgo)

  if (error) {
    console.error('Rate limit check error:', error)
    return { allowed: true, count: 0 }
  }

  const count = data || 0
  return {
    allowed: count < RATE_LIMIT_PER_ORG_PER_HOUR,
    count
  }
}

// Trimite SMS via Twilio
async function sendSMSViaTwilio(
  to: string,
  body: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

    const formData = new URLSearchParams()
    formData.append('To', to)
    formData.append('From', TWILIO_PHONE_NUMBER)
    formData.append('Body', body)

    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: formData.toString()
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Twilio API error:', errorData)
      return {
        success: false,
        error: `Twilio API error: ${response.status}`
      }
    }

    const result = await response.json()

    return {
      success: true,
      messageId: result.sid
    }
  } catch (error) {
    console.error('SMS send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Log delivery în baza de date
async function logSMSDelivery(
  supabase: any,
  data: {
    organizationId?: string
    phone: string
    message: string
    messageId?: string
    status: 'sent' | 'failed'
    error?: string
    costEur: number
    countryCode: string
    metadata?: Record<string, unknown>
  }
): Promise<void> {
  try {
    await supabase.from('sms_delivery_log').insert({
      organization_id: data.organizationId || null,
      phone: data.phone,
      message: data.message,
      message_id: data.messageId || null,
      status: data.status,
      error_message: data.error || null,
      cost_eur: data.costEur,
      country_code: data.countryCode,
      metadata: data.metadata || {},
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to log SMS delivery:', error)
  }
}

serve(async (req: Request): Promise<Response> => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  }

  try {
    // Verifică metoda HTTP
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const body: SendSMSRequest = await req.json()
    const { phone, message, locale = 'ro', organizationId, metadata } = body

    // Validare input
    if (!phone || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: phone, message'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Verifică lungime mesaj
    if (message.length > MAX_SMS_LENGTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Message too long. Maximum ${MAX_SMS_LENGTH} characters allowed.`,
          details: {
            messageLength: message.length,
            maxLength: MAX_SMS_LENGTH
          }
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Detectează country code
    const countryCode = detectCountryCode(phone)
    const normalizedPhone = normalizePhoneNumber(phone, countryCode)

    console.log('SMS request:', {
      originalPhone: phone,
      normalizedPhone,
      countryCode,
      messageLength: message.length,
      locale,
      organizationId
    })

    // Inițializează Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Verifică rate limiting dacă avem organizationId
    if (organizationId) {
      const rateLimit = await checkRateLimit(supabase, organizationId)

      if (!rateLimit.allowed) {
        await logSMSDelivery(supabase, {
          organizationId,
          phone: normalizedPhone,
          message,
          status: 'failed',
          error: 'Rate limit exceeded',
          costEur: 0,
          countryCode,
          metadata
        })

        return new Response(
          JSON.stringify({
            success: false,
            error: `Rate limit exceeded. Maximum ${RATE_LIMIT_PER_ORG_PER_HOUR} SMS per hour.`,
            details: {
              currentCount: rateLimit.count,
              limit: RATE_LIMIT_PER_ORG_PER_HOUR
            }
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Trimite SMS via Twilio
    const result = await sendSMSViaTwilio(normalizedPhone, message)

    // Log delivery
    await logSMSDelivery(supabase, {
      organizationId,
      phone: normalizedPhone,
      message,
      messageId: result.messageId,
      status: result.success ? 'sent' : 'failed',
      error: result.error,
      costEur: result.success ? COST_PER_SMS_EUR : 0,
      countryCode,
      metadata
    })

    // Returnează răspuns
    const response: SendSMSResponse = {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      details: {
        phone: normalizedPhone,
        messageLength: message.length,
        estimatedCost: result.success ? COST_PER_SMS_EUR : 0,
        countryCode
      }
    }

    return new Response(JSON.stringify(response), {
      status: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Edge Function error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
