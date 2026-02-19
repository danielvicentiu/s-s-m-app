// S-S-M.RO — Twilio Client
// SMS, WhatsApp si apeluri vocale pentru cascada de alerte

import twilio from 'twilio'

let twilioInstance: ReturnType<typeof twilio> | null = null

function getTwilioClient(): ReturnType<typeof twilio> {
  if (!twilioInstance) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    if (!accountSid || !authToken) {
      throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set')
    }
    twilioInstance = twilio(accountSid, authToken)
  }
  return twilioInstance
}

export async function sendSMS(to: string, body: string): Promise<boolean> {
  try {
    const client = getTwilioClient()
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })
    console.log('[TWILIO] SMS sent to ' + to)
    return true
  } catch (error) {
    console.error('[TWILIO] SMS error:', error)
    return false
  }
}

export async function sendWhatsApp(to: string, body: string): Promise<boolean> {
  try {
    const client = getTwilioClient()
    await client.messages.create({
      body,
      from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_FROM!,
      to: 'whatsapp:' + to,
    })
    console.log('[TWILIO] WhatsApp sent to ' + to)
    return true
  } catch (error) {
    console.error('[TWILIO] WhatsApp error:', error)
    return false
  }
}

export async function makeCall(to: string, message: string): Promise<boolean> {
  try {
    const client = getTwilioClient()
    await client.calls.create({
      twiml: '<Response><Say language="ro-RO">' + message + '</Say></Response>',
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })
    console.log('[TWILIO] Call initiated to ' + to)
    return true
  } catch (error) {
    console.error('[TWILIO] Call error:', error)
    return false
  }
}
