// app/api/v1/webhooks/[id]/test/route.ts
// API endpoint for testing webhooks

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { testWebhook } from '@/lib/services/webhook-outgoing'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const webhookId = params.id

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // Get webhook to verify organization
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('organization_id')
      .eq('id', webhookId)
      .is('deleted_at', null)
      .single()

    if (webhookError || !webhook) {
      return NextResponse.json(
        { error: 'Webhook nu a fost găsit' },
        { status: 404 }
      )
    }

    // Verify admin role
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', webhook.organization_id)
      .is('deleted_at', null)
      .single()

    if (membershipError || !membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Acces interzis' },
        { status: 403 }
      )
    }

    const result = await testWebhook(webhookId, webhook.organization_id)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, message: 'Webhook de test trimis' })
  } catch (error) {
    console.error('Error in POST /api/v1/webhooks/[id]/test:', error)
    return NextResponse.json(
      { error: 'Eroare server' },
      { status: 500 }
    )
  }
}
