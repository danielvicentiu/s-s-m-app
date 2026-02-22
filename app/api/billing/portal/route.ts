// app/api/billing/portal/route.ts
// Stripe Customer Portal pe connected account-ul corect

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { getStripeForEntity } from '@/lib/stripe'
import { getEntityById, type BillingEntityId } from '@/lib/billing/entities'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 })
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, billing_entity_id')
      .eq('organization_id', membership.organization_id)
      .single()

    if (!sub?.stripe_customer_id || !sub?.billing_entity_id) {
      return NextResponse.json({ error: 'Niciun abonament activ' }, { status: 404 })
    }

    const entity = getEntityById(sub.billing_entity_id as BillingEntityId)
    const stripeClient = getStripeForEntity(entity)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripeClient.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${appUrl}/ro/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[portal] Eroare:', err)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}
