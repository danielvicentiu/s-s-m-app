// lib/twilio-client.ts
// Client Twilio pentru SMS, WhatsApp și apeluri vocale

import twilio from 'twilio'

let twilioInstance: ReturnType<typeof twilio> | null = null

function getTwilioClient() {
  if (!twilioInstance) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials missing')
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
    return true
  } catch (error) {
    console.error('Twilio SMS error:', error)
    return false
  }
}

export async function sendWhatsApp(to: string, body: string): Promise<boolean> {
  try {
    const client = getTwilioClient()
    await client.messages.create({
      body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER!}`,
      to: `whatsapp:${to}`,
    })
    return true
  } catch (error) {
    console.error('Twilio WhatsApp error:', error)
    return false
  }
}

export async function makeCall(to: string, message: string): Promise<boolean> {
  try {
    const client = getTwilioClient()
    await client.calls.create({
      twiml: `<Response><Say language="ro-RO">${message}</Say></Response>`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })
    return true
  } catch (error) {
    console.error('Twilio call error:', error)
    return false
  }
}
