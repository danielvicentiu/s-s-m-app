// Supabase Edge Function: send-push-notification
// Trimite notificări push prin Firebase Cloud Messaging (FCM)
// Suportă batch de max 500 tokens per request FCM cu split automat
// Data actualizată: 19 Februarie 2026

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FCM_SEND_URL = 'https://fcm.googleapis.com/fcm/send'
const FCM_BATCH_SIZE = 500

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  user_ids: string[]
  title: string
  body: string
  data?: Record<string, string>
}

interface FcmBatchResult {
  sent: number
  failed: number
  errors: string[]
  invalidTokens: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const serverKey = Deno.env.get('FIREBASE_SERVER_KEY')
    if (!serverKey) {
      console.error('[FCM Edge] FIREBASE_SERVER_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'FIREBASE_SERVER_KEY neconfigurat' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: RequestBody = await req.json()
    const { user_ids, title, body: notifBody, data } = body

    if (!user_ids?.length || !title || !notifBody) {
      return new Response(
        JSON.stringify({ success: false, error: 'user_ids, title și body sunt obligatorii' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Ia token-urile active din fcm_tokens pentru user_ids dați
    const { data: tokens, error: tokensError } = await supabase
      .from('fcm_tokens')
      .select('token, user_id')
      .in('user_id', user_ids)
      .eq('is_active', true)

    if (tokensError) {
      console.error('[FCM Edge] Error fetching tokens:', tokensError)
      return new Response(
        JSON.stringify({ success: false, error: 'Eroare la obținerea token-urilor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!tokens?.length) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, failed: 0, errors: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenList = tokens.map((t: { token: string }) => t.token)
    const result = await sendFcmBatch(serverKey, tokenList, title, notifBody, data)

    // Curăță token-urile invalide (marcate ca inactive)
    if (result.invalidTokens.length > 0) {
      const { error: cleanupError } = await supabase
        .from('fcm_tokens')
        .update({ is_active: false })
        .in('token', result.invalidTokens)

      if (cleanupError) {
        console.error('[FCM Edge] Error cleaning invalid tokens:', cleanupError)
      } else {
        console.log(`[FCM Edge] Marked ${result.invalidTokens.length} tokens as inactive`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: result.sent,
        failed: result.failed,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[FCM Edge] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Eroare necunoscută',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// ---------------------------------------------------------------------------
// sendFcmBatch — trimite la FCM legacy API în batch-uri de max FCM_BATCH_SIZE
// Split automat dacă tokenList > FCM_BATCH_SIZE
// ---------------------------------------------------------------------------
async function sendFcmBatch(
  serverKey: string,
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<FcmBatchResult> {
  let sent = 0
  let failed = 0
  const errors: string[] = []
  const invalidTokens: string[] = []

  for (let i = 0; i < tokens.length; i += FCM_BATCH_SIZE) {
    const batch = tokens.slice(i, i + FCM_BATCH_SIZE)
    console.log(`[FCM Edge] Sending batch ${Math.floor(i / FCM_BATCH_SIZE) + 1}: ${batch.length} tokens`)

    const payload = {
      registration_ids: batch,
      notification: {
        title,
        body,
        icon: '/favicon.ico',
      },
      data: {
        url: '/dashboard/alerts',
        ...data,
      },
    }

    let response: Response
    try {
      response = await fetch(FCM_SEND_URL, {
        method: 'POST',
        headers: {
          Authorization: `key=${serverKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (fetchError) {
      console.error('[FCM Edge] Fetch error:', fetchError)
      failed += batch.length
      errors.push(`Fetch error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
      continue
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => 'unknown')
      console.error('[FCM Edge] HTTP error:', response.status, errText)
      failed += batch.length
      errors.push(`HTTP ${response.status}: ${errText}`)
      continue
    }

    const fcmResult = await response.json()
    sent += fcmResult.success || 0
    failed += fcmResult.failure || 0

    // Procesează rezultatele individuale pentru a identifica token-uri invalide
    if (fcmResult.results) {
      fcmResult.results.forEach((r: { error?: string }, idx: number) => {
        if (r.error === 'NotRegistered' || r.error === 'InvalidRegistration') {
          invalidTokens.push(batch[idx])
        } else if (r.error) {
          errors.push(`Token error: ${r.error}`)
        }
      })
    }
  }

  return { sent, failed, errors, invalidTokens }
}
