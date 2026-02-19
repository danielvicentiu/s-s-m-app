// lib/otp/twilioVerifyProvider.ts
// OTP provider using Twilio Verify REST API
// Docs: https://www.twilio.com/docs/verify/api
// Channels: whatsapp, sms, voice, email

import type { OTPProvider, OTPChannel, OTPSendResult, OTPCheckResult } from './types'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID!

const BASE_URL = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}`

function buildBasicAuth(): string {
  const credentials = `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
  return `Basic ${Buffer.from(credentials).toString('base64')}`
}

export class TwilioVerifyProvider implements OTPProvider {
  async sendCode(phone: string, channel: OTPChannel): Promise<OTPSendResult> {
    try {
      const body = new URLSearchParams({
        To: phone,
        Channel: channel,
      })

      const response = await fetch(`${BASE_URL}/Verifications`, {
        method: 'POST',
        headers: {
          Authorization: buildBasicAuth(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Twilio Verify sendCode error:', data)
        return {
          success: false,
          error: data.message || `Twilio error code ${data.code}`,
        }
      }

      return {
        success: true,
        sid: data.sid,
      }
    } catch (err) {
      console.error('TwilioVerifyProvider.sendCode unexpected error:', err)
      return {
        success: false,
        error: 'Eroare de conexiune la serviciul de verificare.',
      }
    }
  }

  async checkCode(phone: string, code: string): Promise<OTPCheckResult> {
    try {
      const body = new URLSearchParams({
        To: phone,
        Code: code,
      })

      const response = await fetch(`${BASE_URL}/VerificationCheck`, {
        method: 'POST',
        headers: {
          Authorization: buildBasicAuth(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Twilio Verify checkCode error:', data)
        // Code 60202 = max check attempts, 60203 = already approved
        return {
          valid: false,
          error: data.message || `Twilio error code ${data.code}`,
        }
      }

      const isValid = data.status === 'approved'
      return { valid: isValid }
    } catch (err) {
      console.error('TwilioVerifyProvider.checkCode unexpected error:', err)
      return {
        valid: false,
        error: 'Eroare de conexiune la serviciul de verificare.',
      }
    }
  }
}
