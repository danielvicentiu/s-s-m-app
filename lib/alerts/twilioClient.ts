// S-S-M.RO — Twilio REST API Client
// WhatsApp și SMS via Twilio API direct (fără SDK)
// Credentials: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, TWILIO_SMS_FROM

export interface TwilioResult {
  success: boolean
  sid?: string
  error?: string
}

function getTwilioAuth(): string {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || ''
  const authToken = process.env.TWILIO_AUTH_TOKEN || ''
  return Buffer.from(`${accountSid}:${authToken}`).toString('base64')
}

function isTwilioConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  )
}

/**
 * Trimite mesaj WhatsApp via Twilio API
 */
export async function sendWhatsApp(to: string, body: string): Promise<TwilioResult> {
  if (!isTwilioConfigured()) {
    console.warn('[Twilio] TWILIO_ACCOUNT_SID sau TWILIO_AUTH_TOKEN lipsesc — WhatsApp nesolicitat')
    return { success: false, error: 'Twilio neconfigurat' }
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID!
  const from = process.env.TWILIO_WHATSAPP_FROM || '+14155238886'

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + getTwilioAuth(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: `whatsapp:${from}`,
          To: `whatsapp:${to}`,
          Body: body,
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      console.log('[Twilio] WhatsApp trimis:', data.sid)
      return { success: true, sid: data.sid }
    }

    console.error('[Twilio] WhatsApp error:', data.message || data)
    return { success: false, error: data.message || 'Twilio API error' }
  } catch (error) {
    console.error('[Twilio] WhatsApp fetch error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

/**
 * Trimite SMS via Twilio API
 */
export async function sendSMS(to: string, body: string): Promise<TwilioResult> {
  if (!isTwilioConfigured()) {
    console.warn('[Twilio] TWILIO_ACCOUNT_SID sau TWILIO_AUTH_TOKEN lipsesc — SMS nesolicitat')
    return { success: false, error: 'Twilio neconfigurat' }
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID!
  const from = process.env.TWILIO_SMS_FROM || ''

  if (!from) {
    console.warn('[Twilio] TWILIO_SMS_FROM lipsește')
    return { success: false, error: 'TWILIO_SMS_FROM neconfigurat' }
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + getTwilioAuth(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: from,
          To: to,
          Body: body,
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      console.log('[Twilio] SMS trimis:', data.sid)
      return { success: true, sid: data.sid }
    }

    console.error('[Twilio] SMS error:', data.message || data)
    return { success: false, error: data.message || 'Twilio API error' }
  } catch (error) {
    console.error('[Twilio] SMS fetch error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}
