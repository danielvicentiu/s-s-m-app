import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { WebhookEventType } from '@/lib/types'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// GET /api/v1/webhooks - List organization webhooks
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // Get organization_id from query params
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Parametru organization_id lipsă' },
        { status: 400 }
      )
    }

    // Verify admin role
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single()

    if (membershipError || !membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Acces interzis. Necesită rol de admin.' },
        { status: 403 }
      )
    }

    // Get webhooks (RLS will filter by organization)
    const { data: webhooks, error: webhooksError } = await supabase
      .from('webhooks')
      .select(`
        id,
        organization_id,
        url,
        events,
        is_active,
        created_by,
        created_at,
        updated_at
      `)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (webhooksError) {
      console.error('Error fetching webhooks:', webhooksError)
      return NextResponse.json(
        { error: 'Eroare la obținerea webhook-urilor' },
        { status: 500 }
      )
    }

    // Get delivery stats for each webhook
    const webhooksWithStats = await Promise.all(
      (webhooks || []).map(async (webhook) => {
        const { data: lastDelivery } = await supabase
          .from('webhook_delivery_log')
          .select('*')
          .eq('webhook_id', webhook.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        const { count: successCount } = await supabase
          .from('webhook_delivery_log')
          .select('*', { count: 'exact', head: true })
          .eq('webhook_id', webhook.id)
          .eq('status', 'success')

        const { count: failedCount } = await supabase
          .from('webhook_delivery_log')
          .select('*', { count: 'exact', head: true })
          .eq('webhook_id', webhook.id)
          .eq('status', 'failed')

        return {
          ...webhook,
          last_delivery: lastDelivery || null,
          stats: {
            success_count: successCount || 0,
            failed_count: failedCount || 0
          }
        }
      })
    )

    return NextResponse.json({
      webhooks: webhooksWithStats,
      count: webhooksWithStats.length
    })

  } catch (error) {
    console.error('Unexpected error in GET /api/v1/webhooks:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// POST /api/v1/webhooks - Register new webhook
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { organizationId, url, events } = body

    // Validate required fields
    if (!organizationId || !url || !events) {
      return NextResponse.json(
        { error: 'Câmpuri obligatorii lipsă: organizationId, url, events' },
        { status: 400 }
      )
    }

    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json(
        { error: 'URL invalid. Trebuie să înceapă cu http:// sau https://' },
        { status: 400 }
      )
    }

    // Validate events array
    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'Parametru events trebuie să fie un array nevid' },
        { status: 400 }
      )
    }

    const validEvents: WebhookEventType[] = [
      'employee.created', 'employee.updated', 'employee.deleted',
      'training.created', 'training.completed', 'training.due',
      'medical.created', 'medical.expiring',
      'equipment.created', 'equipment.inspection_due',
      'alert.triggered',
      'compliance.changed',
      'document.uploaded',
      'organization.updated'
    ]

    const invalidEvents = events.filter((e: string) => !validEvents.includes(e as WebhookEventType))
    if (invalidEvents.length > 0) {
      return NextResponse.json(
        {
          error: 'Evenimente invalide',
          invalid_events: invalidEvents,
          valid_events: validEvents
        },
        { status: 400 }
      )
    }

    // Verify admin role
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single()

    if (membershipError || !membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Acces interzis. Necesită rol de admin.' },
        { status: 403 }
      )
    }

    // Generate secret for webhook signing
    const secret = crypto.randomBytes(32).toString('hex')

    // Create webhook
    const { data: webhook, error: createError } = await supabase
      .from('webhooks')
      .insert({
        organization_id: organizationId,
        url,
        events,
        secret,
        is_active: true,
        created_by: user.id
      })
      .select(`
        id,
        organization_id,
        url,
        events,
        secret,
        is_active,
        created_by,
        created_at,
        updated_at
      `)
      .single()

    if (createError) {
      console.error('Error creating webhook:', createError)
      return NextResponse.json(
        { error: 'Eroare la crearea webhook-ului' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      webhook,
      message: 'Webhook creat cu succes'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error in POST /api/v1/webhooks:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
