// app/api/v1/webhooks/[id]/route.ts
// API endpoint for individual webhook operations

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { updateWebhook, deleteWebhook, getWebhook } from '@/lib/services/webhook-outgoing'
import { WebhookEventType } from '@/lib/types'

export const dynamic = 'force-dynamic'

// GET /api/v1/webhooks/[id] - Get webhook by ID
export async function GET(
  _request: NextRequest,
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

    const result = await getWebhook(webhookId, webhook.organization_id)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }

    // Get delivery stats
    const { data: lastDelivery } = await supabase
      .from('webhook_delivery_log')
      .select('*')
      .eq('webhook_id', webhookId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const { count: successCount } = await supabase
      .from('webhook_delivery_log')
      .select('*', { count: 'exact', head: true })
      .eq('webhook_id', webhookId)
      .eq('status', 'success')

    const { count: failedCount } = await supabase
      .from('webhook_delivery_log')
      .select('*', { count: 'exact', head: true })
      .eq('webhook_id', webhookId)
      .eq('status', 'failed')

    return NextResponse.json({
      webhook: {
        ...result.webhook,
        last_delivery: lastDelivery || null,
        stats: {
          success_count: successCount || 0,
          failed_count: failedCount || 0
        }
      }
    })
  } catch (error) {
    console.error('Error in GET /api/v1/webhooks/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare server' },
      { status: 500 }
    )
  }
}

// PATCH /api/v1/webhooks/[id] - Update webhook
export async function PATCH(
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

    const body = await request.json()
    const updates: {
      url?: string
      events?: WebhookEventType[]
      is_active?: boolean
    } = {}

    if (body.url) updates.url = body.url
    if (body.events) updates.events = body.events
    if (typeof body.is_active === 'boolean') updates.is_active = body.is_active

    const result = await updateWebhook(webhookId, webhook.organization_id, updates)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ webhook: result.webhook })
  } catch (error) {
    console.error('Error in PATCH /api/v1/webhooks/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare server' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/webhooks/[id] - Delete webhook
export async function DELETE(
  _request: NextRequest,
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

    const result = await deleteWebhook(webhookId, webhook.organization_id)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/v1/webhooks/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare server' },
      { status: 500 }
    )
  }
}
