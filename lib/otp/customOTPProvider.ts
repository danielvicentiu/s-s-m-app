// lib/otp/customOTPProvider.ts
// Custom OTP provider skeleton for future SMS providers (e.g. SMSLink.ro)
// Generates 6-digit code, bcrypt-hashes it to otp_sessions.code_hash
// Replace sendSMS() with real API call when provider is chosen

import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import type { OTPProvider, OTPChannel, OTPSendResult, OTPCheckResult } from './types'

// Generate a cryptographically secure 6-digit OTP code
export function generateCode(): string {
  const bytes = crypto.randomBytes(4)
  const num = bytes.readUInt32BE(0) % 1_000_000
  return num.toString().padStart(6, '0')
}

// Hash OTP code for safe storage (bcrypt, 10 rounds)
export async function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10)
}

// Compare plain code to stored hash
export async function verifyCodeHash(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash)
}

// ─── SMSLink.ro API skeleton ───────────────────────────────────────────────
// Full API docs: https://www.smslink.ro/sms-gateway-documentatie.html
//
// To integrate SMSLink.ro:
// 1. Set env vars: SMSLINK_CONNECTION_ID, SMSLINK_PASSWORD
// 2. Replace sendSMS() body with the fetch call below (uncomment and configure)
//
// Example request (SMSLink REST API v2):
//   POST https://secure.smslink.ro/sms/gateway/communicate/index.php
//   Content-Type: application/x-www-form-urlencoded
//   Body: connection_id=<ID>&password=<PASS>&to=<PHONE>&message=<MSG>
//
// async function sendSMSLinkSMS(phone: string, message: string): Promise<boolean> {
//   const body = new URLSearchParams({
//     connection_id: process.env.SMSLINK_CONNECTION_ID!,
//     password: process.env.SMSLINK_PASSWORD!,
//     to: phone.replace('+', ''), // strip + prefix if needed
//     message,
//   })
//   const res = await fetch(
//     'https://secure.smslink.ro/sms/gateway/communicate/index.php',
//     { method: 'POST', body: body.toString(),
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//   )
//   const text = await res.text()
//   return text.includes('MESSAGE_ID')
// }
// ──────────────────────────────────────────────────────────────────────────

// Placeholder — logs to console, replace with real provider call
async function sendSMS(phone: string, message: string): Promise<boolean> {
  console.log(`[customOTPProvider] SMS to ${phone}: ${message}`)
  // TODO: integrate SMSLink.ro or another Romanian SMS provider
  return true
}

export class CustomOTPProvider implements OTPProvider {
  // Stores generated code + hash in caller's session — returned in OTPSendResult.sid
  async sendCode(phone: string, _channel: OTPChannel): Promise<OTPSendResult> {
    try {
      const code = generateCode()
      const codeHash = await hashCode(code)

      const message = `Codul dumneavoastră SSM este: ${code}. Valabil 10 minute. Nu îl partajați.`
      const sent = await sendSMS(phone, message)

      if (!sent) {
        return { success: false, error: 'Nu s-a putut trimite SMS-ul.' }
      }

      // Return hash as sid so API route can persist it to otp_sessions.code_hash
      return { success: true, sid: codeHash }
    } catch (err) {
      console.error('CustomOTPProvider.sendCode error:', err)
      return { success: false, error: 'Eroare la generarea codului OTP.' }
    }
  }

  // checkCode is handled in the API route (needs DB lookup of code_hash)
  // This stub validates format only
  async checkCode(_phone: string, code: string): Promise<OTPCheckResult> {
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return { valid: false, error: 'Codul trebuie să aibă exact 6 cifre.' }
    }
    return { valid: true }
  }
}
