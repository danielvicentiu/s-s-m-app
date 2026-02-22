// app/api/billing/checkout/route.ts
// Creare sesiune Stripe Checkout cu selecție automată billing entity (Connect)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { createConnectCheckoutSession, PLAN_KEY_MAP } from '@/lib/stripe'
import { selectBillingEntity, type BillingEntityId } from '@/lib/billing/entities'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const {
      planType,
      billingOwner = 'patron',
      serviceType,
      entityOverride,
    } = await req.json() as {
      planType: string
      billingOwner?: 'patron' | 'sepp'
      serviceType?: 'platform' | 'ssm_consultancy'
      entityOverride?: BillingEntityId
    }

    const planKey = PLAN_KEY_MAP[planType]
    if (!planKey) {
      return NextResponse.json({ error: 'Plan invalid' }, { status: 400 })
    }

    // Obține organizația utilizatorului
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

    // Obține datele organizației pentru determinare TVA
    const { data: org } = await supabase
      .from('organizations')
      .select('name, cui, is_vat_payer')
      .eq('id', orgId)
      .single()

    // Selectează billing entity automat
    const entity = selectBillingEntity({
      isVatPayer: (org as any)?.is_vat_payer ?? false,
      serviceType: serviceType ?? 'platform',
      entityOverride,
    })

    // Verifică dacă există deja Stripe customer pe acest connected account
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, billing_entity_id')
      .eq('organization_id', orgId)
      .maybeSingle()

    // Folosim customer-ul existent doar dacă e pe același connected account
    const existingCustomerId =
      existingSub?.billing_entity_id === entity.id
        ? existingSub.stripe_customer_id
        : null

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await createConnectCheckoutSession({
      entity,
      planKey,
      customerId: existingCustomerId,
      organizationId: orgId,
      billingOwner,
      successUrl: `${appUrl}/ro/dashboard?billing=success`,
      cancelUrl: `${appUrl}/ro/pricing?billing=canceled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] Eroare:', err)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}
