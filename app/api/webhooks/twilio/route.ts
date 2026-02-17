// S-S-M.RO — Twilio Webhook
// POST /api/webhooks/twilio — Status delivery callbacks + reply acknowledgment
// Actualizează alert_logs.delivery_status bazat pe Twilio webhook data
// Dacă mesaj inbound conține "DA" sau "OK" → marchează alertele ca acknowledged

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Status mapping Twilio → DB
const STATUS_MAP: Record<string, string> = {
  queued: 'queued',
  sent: 'sent',
  delivered: 'delivered',
  read: 'read',
  failed: 'failed',
  undelivered: 'undelivered',
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let body: Record<string, string> = {}

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text()
      const params = new URLSearchParams(text)
      params.forEach((value, key) => {
        body[key] = value
      })
    } else {
      body = await request.json().catch(() => ({}))
    }

    const supabase = getSupabase()
    const messageSid = body.MessageSid || body.SmsSid || ''
    const messageStatus = body.MessageStatus || body.SmsStatus || ''
    const messageBody = (body.Body || '').trim().toUpperCase()
    const fromNumber = body.From || ''

    // 1. Actualizare status delivery
    if (messageSid && messageStatus) {
      const dbStatus = STATUS_MAP[messageStatus.toLowerCase()] || messageStatus.toLowerCase()

      const { error } = await supabase
        .from('alert_logs')
        .update({
          delivery_status: dbStatus,
          delivery_updated_at: new Date().toISOString(),
        })
        .eq('twilio_message_sid', messageSid)

      if (error) {
        console.error('[Webhook Twilio] Update status error:', error)
      } else {
        console.log(`[Webhook Twilio] Updated ${messageSid} → ${dbStatus}`)
      }
    }

    // 2. Reply inbound — marcare acknowledged
    // Dacă body conține DA/OK, marcăm alertele neconfirmate de la acel număr
    if (fromNumber && (messageBody === 'DA' || messageBody === 'OK' || messageBody.includes('CONFIRM'))) {
      // Normalizăm numărul (eliminăm prefixul whatsapp:)
      const phone = fromNumber.replace(/^whatsapp:/i, '')

      const { error: ackError } = await supabase
        .from('alert_logs')
        .update({
          acknowledged: true,
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: 'whatsapp_reply',
        })
        .eq('recipient_phone', phone)
        .eq('acknowledged', false)

      if (ackError) {
        console.error('[Webhook Twilio] Acknowledge error:', ackError)
      } else {
        console.log(`[Webhook Twilio] Acknowledged alerts for ${phone}`)
      }
    }

    // Twilio așteaptă TwiML sau 200 OK
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    )
  } catch (error) {
    console.error('[Webhook Twilio] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
