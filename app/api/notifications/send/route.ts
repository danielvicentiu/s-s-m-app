// app/api/notifications/send/route.ts
// Trimite notificări push FCM către utilizatori specificați
// Acces restricționat: service_role sau admin

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

const FCM_SEND_URL = 'https://fcm.googleapis.com/fcm/send'

interface SendBody {
  user_ids: string[]
  title: string
  body: string
  data?: Record<string, string>
}

interface FcmToken {
  token: string
  user_id: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    // Verifică că utilizatorul este admin (rol consultant sau super_admin)
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .in('role', ['consultant', 'firma_admin'])
      .maybeSingle()

    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)
      .maybeSingle()

    const isAdmin = !!membership || (userRole?.roles as any)?.name === 'super_admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
    }

    const body: SendBody = await request.json()
    const { user_ids, title, body: notifBody, data } = body

    if (!user_ids?.length || !title || !notifBody) {
      return NextResponse.json(
        { error: 'user_ids, title și body sunt obligatorii' },
        { status: 400 }
      )
    }

    const serverKey = process.env.FIREBASE_SERVER_KEY
    if (!serverKey) {
      return NextResponse.json({ error: 'FIREBASE_SERVER_KEY neconfigurat' }, { status: 500 })
    }

    // Ia token-urile active pentru utilizatorii specificați
    const { data: tokens, error: tokensError } = await supabase
      .from('fcm_tokens')
      .select('token, user_id')
      .in('user_id', user_ids)
      .eq('is_active', true)

    if (tokensError) {
      console.error('[FCM] send: error fetching tokens:', tokensError)
      return NextResponse.json({ error: 'Eroare la obținerea token-urilor' }, { status: 500 })
    }

    if (!tokens?.length) {
      return NextResponse.json({ sent: 0, failed: 0, errors: [] })
    }

    const tokenList = tokens.map((t: FcmToken) => t.token)
    const results = await sendFcmBatch(serverKey, tokenList, title, notifBody, data)

    // Curăță token-urile invalide
    if (results.invalidTokens.length > 0) {
      await supabase
        .from('fcm_tokens')
        .update({ is_active: false })
        .in('token', results.invalidTokens)
    }

    return NextResponse.json({
      sent: results.sent,
      failed: results.failed,
      errors: results.errors,
    })
  } catch (error) {
    console.error('[FCM] send error:', error)
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// sendFcmBatch — trimite la FCM legacy API în batch-uri de max 1000 tokens
// ---------------------------------------------------------------------------
async function sendFcmBatch(
  serverKey: string,
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<{ sent: number; failed: number; errors: string[]; invalidTokens: string[] }> {
  const BATCH_SIZE = 1000
  let sent = 0
  let failed = 0
  const errors: string[] = []
  const invalidTokens: string[] = []

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE)

    const payload = {
      registration_ids: batch,
      notification: { title, body, icon: '/favicon.ico' },
      data: { url: '/dashboard/alerts', ...data },
    }

    const response = await fetch(FCM_SEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('[FCM] batch send error:', response.status, errText)
      failed += batch.length
      errors.push(`HTTP ${response.status}: ${errText}`)
      continue
    }

    const result = await response.json()
    sent += result.success || 0
    failed += result.failure || 0

    // Procesează rezultatele individuale pentru token-uri invalide
    if (result.results) {
      result.results.forEach((r: { error?: string }, idx: number) => {
        if (r.error === 'NotRegistered' || r.error === 'InvalidRegistration') {
          invalidTokens.push(batch[idx])
        } else if (r.error) {
          errors.push(`Token ${batch[idx].slice(0, 20)}...: ${r.error}`)
        }
      })
    }
  }

  return { sent, failed, errors, invalidTokens }
}
