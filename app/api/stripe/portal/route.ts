// S-S-M.RO — STRIPE BILLING PORTAL SESSION
// Creează Stripe Billing Portal Session pentru gestionarea subscripției
// Portal permite: actualizare metodă plată, vizualizare facturi, anulare subscripție
// Data: 14 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServer } from '@/lib/supabase/server'

// ── CONFIGURARE STRIPE ──

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

// ── TIPURI ──

interface PortalRequestBody {
  orgId: string
  returnUrl?: string
}

interface PortalResponse {
  url: string
}

interface ErrorResponse {
  error: string
  details?: string
}

// ── FUNCȚII HELPER ──

/**
 * Verifică dacă organizația există și dacă user-ul are acces la ea
 */
async function validateOrganizationAccess(
  orgId: string,
  userId: string
): Promise<{ valid: boolean; error?: string }> {
  const supabase = await createSupabaseServer()

  // Verifică dacă organizația există
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', orgId)
    .single()

  if (orgError || !org) {
    return { valid: false, error: 'Organizația nu a fost găsită' }
  }

  // Verifică dacă user-ul are membership activ în organizație
  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('id, role, is_active')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (membershipError || !membership) {
    return { valid: false, error: 'Nu aveți acces la această organizație' }
  }

  // Doar consultant și firma_admin pot gestiona subscripții
  if (membership.role !== 'consultant' && membership.role !== 'firma_admin') {
    return { valid: false, error: 'Nu aveți permisiuni pentru a gestiona subscripția' }
  }

  return { valid: true }
}

/**
 * Obține Stripe Customer ID pentru organizație
 */
async function getStripeCustomerId(
  orgId: string
): Promise<{ customerId: string | null; error?: string }> {
  const supabase = await createSupabaseServer()

  // Citește customer ID din organizație
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('stripe_customer_id, name')
    .eq('id', orgId)
    .single()

  if (orgError || !org) {
    return { customerId: null, error: 'Eroare la citirea organizației' }
  }

  if (!org.stripe_customer_id) {
    return { customerId: null, error: 'Organizația nu are o subscripție Stripe activă' }
  }

  return { customerId: org.stripe_customer_id }
}

// ── API ROUTE ──

/**
 * POST /api/stripe/portal
 * Creează Stripe Billing Portal Session și returnează URL-ul
 *
 * Portal permite:
 * - Actualizare metodă de plată
 * - Vizualizare facturi și istoric plăți
 * - Anulare subscripție
 * - Reactivare subscripție
 * - Upgrade/downgrade plan
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Autentificare
    const supabase = await createSupabaseServer()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // 2. Validare body
    let body: PortalRequestBody
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { orgId, returnUrl } = body

    if (!orgId) {
      return NextResponse.json<ErrorResponse>(
        { error: 'orgId este obligatoriu' },
        { status: 400 }
      )
    }

    // 3. Validare acces la organizație
    const accessValidation = await validateOrganizationAccess(orgId, user.id)
    if (!accessValidation.valid) {
      return NextResponse.json<ErrorResponse>(
        { error: accessValidation.error || 'Acces interzis' },
        { status: 403 }
      )
    }

    // 4. Obține Stripe Customer ID
    const { customerId, error: customerError } = await getStripeCustomerId(orgId)
    if (customerError || !customerId) {
      return NextResponse.json<ErrorResponse>(
        {
          error: customerError || 'Organizația nu are o subscripție Stripe activă',
          details: 'Pentru a gestiona subscripția, trebuie să o activezi mai întâi prin checkout.',
        },
        { status: 400 }
      )
    }

    // 5. Construiește return URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const defaultReturnUrl = `${baseUrl}/dashboard/billing`
    const finalReturnUrl = returnUrl || defaultReturnUrl

    // 6. Creează Billing Portal Session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: finalReturnUrl,
    })

    if (!portalSession.url) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Eroare la crearea sesiunii portal' },
        { status: 500 }
      )
    }

    // 7. Log în audit_log pentru tracking
    await supabase.from('audit_log').insert({
      user_id: user.id,
      organization_id: orgId,
      action: 'billing_portal_accessed',
      table_name: 'subscriptions',
      details: {
        session_id: portalSession.id,
        customer_id: customerId,
      },
    })

    // 8. Returnează URL-ul portal-ului
    return NextResponse.json<PortalResponse>(
      {
        url: portalSession.url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error creating billing portal session:', error)

    return NextResponse.json<ErrorResponse>(
      {
        error: 'Eroare internă la crearea sesiunii portal',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
