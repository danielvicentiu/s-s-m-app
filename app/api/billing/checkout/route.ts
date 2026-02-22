// app/api/billing/checkout/route.ts
// Creare sesiune Stripe Checkout pentru abonamente

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { stripe, PLANS, PlanType } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const { planType, billingOwner = 'patron' } = await req.json() as {
      planType: PlanType
      billingOwner?: 'patron' | 'sepp'
    }

    const plan = PLANS[planType]
    if (!plan) {
      return NextResponse.json({ error: 'Plan invalid' }, { status: 400 })
    }

    // Obține organizația utilizatorului prin memberships
    const { data: membership, error: memError } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (memError || !membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 })
    }

    const orgId = membership.organization_id

    // Verifică dacă există deja Stripe customer
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', orgId)
      .single()

    let customerId = existingSub?.stripe_customer_id ?? null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          organization_id: orgId,
          user_id: user.id,
        },
      })
      customerId = customer.id
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Creare sesiune checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: plan.priceId, quantity: 1 }],
      currency: 'ron',
      success_url: `${appUrl}/ro/dashboard?billing=success`,
      cancel_url: `${appUrl}/ro/pricing?billing=canceled`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          organization_id: orgId,
          plan_type: planType,
          billing_owner: billingOwner,
        },
      },
      metadata: {
        organization_id: orgId,
        plan_type: planType,
        billing_owner: billingOwner,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] Eroare:', err)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}
