// lib/billing/fgo.ts
// FGO API — emitere e-factură la confirmare plată Stripe
// Docs: https://api.fgo.ro/v1/
// Auth: Bearer token (FGO_API_KEY)

import { createClient } from '@supabase/supabase-js'
import type { BillingEntity } from './entities'
import type Stripe from 'stripe'

const FGO_BASE = process.env.FGO_API_BASE_URL || 'https://api.fgo.ro/v1'

// Admin client — bypass RLS (FGO rulează din webhook server-side)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface FgoInvoicePayload {
  emitent: {
    denumire: string
    cui: string
  }
  client: {
    denumire: string
    cui: string
    adresa?: string
  }
  produse: Array<{
    denumire: string
    cantitate: number
    pret_unitar: number
    cota_tva: number
  }>
  moneda: 'RON'
  data_emitere: string
}

interface FgoInvoiceResult {
  id?: string
  numar?: number
  serie?: string
}

/**
 * Emite e-factură FGO la confirmarea plății (invoice.paid webhook).
 * Dacă FGO_API_KEY nu e configurat, loghează warning și returnează null.
 * Dacă FGO eșuează, aruncă eroare — webhook-ul o prinde și loghează fără a bloca.
 */
export async function emitFgoInvoice(params: {
  entity: BillingEntity
  invoice: Stripe.Invoice
}): Promise<FgoInvoiceResult | null> {
  const fgoKey = process.env.FGO_API_KEY

  if (!fgoKey || fgoKey === 'PLACEHOLDER_Daniel_completeaza') {
    console.warn('[FGO] API key neconfigurat — skip emitere factură')
    return null
  }

  const { entity, invoice } = params

  // Obține organizația din subscriptions
  const subscriptionId = (invoice as any).subscription as string | null
  if (!subscriptionId) {
    throw new Error('[FGO] invoice.subscription lipsă')
  }

  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (!sub) {
    throw new Error(`[FGO] Nicio subscripție găsită pentru stripe_subscription_id=${subscriptionId}`)
  }

  const { data: org } = await supabaseAdmin
    .from('organizations')
    .select('name, cui, address')
    .eq('id', sub.organization_id)
    .single()

  if (!org) {
    throw new Error(`[FGO] Nicio organizație găsită pentru id=${sub.organization_id}`)
  }

  // Calcul TVA
  const cotaTva = entity.isVatPayer ? 19 : 0
  const amountRon = (invoice.amount_paid ?? 0) / 100
  const pretFaraTva = cotaTva > 0
    ? Math.round((amountRon / 1.19) * 100) / 100
    : amountRon

  const descriere = invoice.lines?.data?.[0]?.description
    || `Abonament s-s-m.ro — ${entity.id}`

  const payload: FgoInvoicePayload = {
    emitent: {
      denumire: entity.name,
      cui: entity.cui,
    },
    client: {
      denumire: (org as any).name || 'Client',
      cui: (org as any).cui || '',
      adresa: (org as any).address || '',
    },
    produse: [
      {
        denumire: descriere,
        cantitate: 1,
        pret_unitar: pretFaraTva,
        cota_tva: cotaTva,
      },
    ],
    moneda: 'RON',
    data_emitere: new Date().toISOString().split('T')[0],
  }

  const response = await fetch(`${FGO_BASE}/factura/emitere`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${fgoKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`[FGO] API error ${response.status}: ${errorText}`)
  }

  const result: FgoInvoiceResult = await response.json()

  console.log(
    `[FGO] Factură emisă: ${result.serie ?? ''}${result.numar ?? result.id} ` +
    `pentru org=${sub.organization_id} entity=${entity.id}`
  )

  // Marchează automat ca încasată — plata confirmată de Stripe
  if (result.id) {
    await markFgoInvoicePaid(result.id, fgoKey)
  }

  return result
}

async function markFgoInvoicePaid(fgoInvoiceId: string, fgoKey: string): Promise<void> {
  try {
    const response = await fetch(`${FGO_BASE}/factura/incasare`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${fgoKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: fgoInvoiceId,
        data_incasare: new Date().toISOString().split('T')[0],
        mod_incasare: 'Card bancar (Stripe)',
      }),
    })

    if (!response.ok) {
      console.error('[FGO] Eroare marcare încasată:', await response.text())
    } else {
      console.log(`[FGO] Factură ${fgoInvoiceId} marcată încasată`)
    }
  } catch (err) {
    console.error('[FGO] Excepție marcare încasată:', err)
  }
}
