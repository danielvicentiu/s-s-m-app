// app/api/email/send/route.ts
// Endpoint unificat pentru trimitere email-uri cu Resend + React Email

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { createElement } from 'react'
import { createSupabaseServer } from '@/lib/supabase/server'
import { BunVenit, AlerteConformitate, InstruireProgramata } from '@/components/emails'
import type { BunVenitProps } from '@/components/emails'
import type { AlertRow } from '@/components/emails'
import type { InstruireProgramataProps } from '@/components/emails'

type EmailType = 'welcome' | 'compliance-alert' | 'training'

interface BasePayload {
  type: EmailType
  to: string | string[]
  subject: string
}

interface WelcomePayload extends BasePayload {
  type: 'welcome'
  props: BunVenitProps
}

interface ComplianceAlertPayload extends BasePayload {
  type: 'compliance-alert'
  props: {
    alerts: AlertRow[]
    organizationName?: string
    reportDate?: string
    dashboardUrl?: string
  }
}

interface TrainingPayload extends BasePayload {
  type: 'training'
  props: InstruireProgramataProps
}

type SendEmailPayload = WelcomePayload | ComplianceAlertPayload | TrainingPayload

function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

function getSenderAddress(type: EmailType): string {
  switch (type) {
    case 'welcome':
      return 'noreply@s-s-m.ro'
    case 'compliance-alert':
      return 'alerte@s-s-m.ro'
    case 'training':
      return 'instruiri@s-s-m.ro'
    default:
      return 'noreply@s-s-m.ro'
  }
}

async function renderTemplate(payload: SendEmailPayload): Promise<string> {
  switch (payload.type) {
    case 'welcome': {
      const element = createElement(BunVenit, payload.props)
      return await render(element)
    }
    case 'compliance-alert': {
      const element = createElement(AlerteConformitate, payload.props)
      return await render(element)
    }
    case 'training': {
      const element = createElement(InstruireProgramata, payload.props)
      return await render(element)
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verificare autentificare
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    const body: SendEmailPayload = await req.json()

    // Validare câmpuri obligatorii
    if (!body.type || !body.to || !body.subject) {
      return NextResponse.json(
        { error: 'Câmpurile type, to și subject sunt obligatorii' },
        { status: 400 }
      )
    }

    if (!['welcome', 'compliance-alert', 'training'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Tip email invalid. Valori acceptate: welcome, compliance-alert, training' },
        { status: 400 }
      )
    }

    // Randare template React Email → HTML
    const html = await renderTemplate(body)

    // Trimitere via Resend
    const resend = getResendClient()
    const result = await resend.emails.send({
      from: getSenderAddress(body.type),
      to: Array.isArray(body.to) ? body.to : [body.to],
      subject: body.subject,
      html,
    })

    if (result.error) {
      console.error('Resend API error:', result.error)
      return NextResponse.json(
        { error: result.error.message || 'Eroare la trimiterea email-ului' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
    })
  } catch (error) {
    console.error('Error in email send endpoint:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare internă' },
      { status: 500 }
    )
  }
}
