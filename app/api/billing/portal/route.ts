// app/api/billing/portal/route.ts
// Stripe Customer Portal — self-service (upgrade/downgrade/anulare)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

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
      .select('stripe_customer_id')
      .eq('organization_id', membership.organization_id)
      .single()

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'Niciun abonament activ' }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${appUrl}/ro/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[portal] Eroare:', err)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}
