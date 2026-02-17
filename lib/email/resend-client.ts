// S-S-M.RO — Resend Email Client
// Configurare client Resend pentru trimitere alerte

import { Resend } from 'resend'

// Lazy initialization - creăm clientul doar când e necesar
let resendInstance: Resend | null = null

export function getResendClient(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in environment variables')
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
}

export interface SendEmailResult {
  success: boolean
  error?: string
  messageId?: string
}

/**
 * Trimite email folosind Resend
 * @param params - Parametri email (to, subject, html)
 * @returns Rezultat cu success/error
 */
export async function sendAlertEmail(
  params: SendEmailParams
): Promise<SendEmailResult> {
  try {
    const { to, subject, html } = params
    const resend = getResendClient()

    const result = await resend.emails.send({
      from: 'alerte@s-s-m.ro',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (result.error) {
      console.error('Resend API error:', result.error)
      return {
        success: false,
        error: result.error.message || 'Failed to send email',
      }
    }

    return {
      success: true,
      messageId: result.data?.id,
    }
  } catch (error) {
    console.error('Error sending email with Resend:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
