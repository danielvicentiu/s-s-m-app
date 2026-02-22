// lib/billing/entities.ts
// Definire billing entities (firme separate cu IBAN propriu) + logică selecție automată
// 3 firme: URIEL (TVA, platformă), FAIRY (fără TVA, platformă), AUM (fără TVA, consultanță SSM)

import Stripe from 'stripe'

export type BillingEntityId = 'URIEL' | 'FAIRY' | 'AUM'
export type PlanKey = 'direct' | 'partner' | 'selfservice'

export interface BillingEntity {
  id: BillingEntityId
  name: string
  cui: string
  iban: string
  banca: string
  isVatPayer: boolean
  type: 'platform' | 'ssm_consultancy'
  stripeAccountId: string
  webhookSecret: string
  // Price IDs per plan (setate din env după create-stripe-products.ts)
  prices: Record<PlanKey, string>
}

export function getBillingEntities(): BillingEntity[] {
  return [
    {
      id: 'URIEL',
      name: process.env.BILLING_ENTITY_1_NAME!,
      cui: process.env.BILLING_ENTITY_1_CUI!,
      iban: process.env.BILLING_ENTITY_1_IBAN!,
      banca: process.env.BILLING_ENTITY_1_BANCA!,
      isVatPayer: process.env.BILLING_ENTITY_1_VAT === 'true',
      type: 'platform',
      stripeAccountId: process.env.STRIPE_CONNECT_ACCOUNT_URIEL!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_URIEL!,
      prices: {
        direct: process.env.STRIPE_PRICE_URIEL_DIRECT!,
        partner: process.env.STRIPE_PRICE_URIEL_PARTNER!,
        selfservice: process.env.STRIPE_PRICE_URIEL_SELFSERVICE!,
      },
    },
    {
      id: 'FAIRY',
      name: process.env.BILLING_ENTITY_2_NAME!,
      cui: process.env.BILLING_ENTITY_2_CUI!,
      iban: process.env.BILLING_ENTITY_2_IBAN!,
      banca: process.env.BILLING_ENTITY_2_BANCA!,
      isVatPayer: process.env.BILLING_ENTITY_2_VAT === 'true',
      type: 'platform',
      stripeAccountId: process.env.STRIPE_CONNECT_ACCOUNT_FAIRY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_FAIRY!,
      prices: {
        direct: process.env.STRIPE_PRICE_FAIRY_DIRECT!,
        partner: process.env.STRIPE_PRICE_FAIRY_PARTNER!,
        selfservice: process.env.STRIPE_PRICE_FAIRY_SELFSERVICE!,
      },
    },
    {
      id: 'AUM',
      name: process.env.BILLING_ENTITY_3_NAME!,
      cui: process.env.BILLING_ENTITY_3_CUI!,
      iban: process.env.BILLING_ENTITY_3_IBAN!,
      banca: process.env.BILLING_ENTITY_3_BANCA!,
      isVatPayer: process.env.BILLING_ENTITY_3_VAT === 'true',
      type: 'ssm_consultancy',
      stripeAccountId: process.env.STRIPE_CONNECT_ACCOUNT_AUM!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_AUM!,
      prices: {
        direct: process.env.STRIPE_PRICE_AUM_DIRECT!,
        partner: process.env.STRIPE_PRICE_AUM_PARTNER!,
        selfservice: process.env.STRIPE_PRICE_AUM_SELFSERVICE!,
      },
    },
  ]
}

/**
 * Selectează automat billing entity pe baza criteriilor:
 * 1. Override manual → orice entitate
 * 2. Servicii consultanță SSM → AUM
 * 3. Client plătitor TVA → URIEL
 * 4. Client neplătitor TVA (default) → FAIRY
 */
export function selectBillingEntity(params: {
  isVatPayer: boolean
  serviceType?: 'platform' | 'ssm_consultancy'
  entityOverride?: BillingEntityId
}): BillingEntity {
  const entities = getBillingEntities()

  if (params.entityOverride) {
    const found = entities.find(e => e.id === params.entityOverride)
    if (found) return found
  }

  if (params.serviceType === 'ssm_consultancy') {
    return entities.find(e => e.id === 'AUM')!
  }

  if (params.isVatPayer) {
    return entities.find(e => e.id === 'URIEL')!
  }

  return entities.find(e => e.id === 'FAIRY')!
}

/**
 * Determină care entitate a trimis un webhook Stripe prin
 * verificarea semnăturii cu secretele fiecărei entități.
 * Returnează undefined dacă niciun secret nu se potrivește.
 */
export function detectEntityFromWebhook(
  stripeClient: Stripe,
  body: string,
  signature: string
): BillingEntity | undefined {
  for (const entity of getBillingEntities()) {
    try {
      stripeClient.webhooks.constructEvent(body, signature, entity.webhookSecret)
      return entity
    } catch {
      // Semnătura nu se potrivește cu această entitate — continuă
    }
  }
  return undefined
}

export function getEntityById(id: BillingEntityId): BillingEntity {
  const entity = getBillingEntities().find(e => e.id === id)
  if (!entity) throw new Error(`[entities] Entitate necunoscută: ${id}`)
  return entity
}
