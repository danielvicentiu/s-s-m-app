// scripts/create-stripe-products.ts
// Script one-time: creare produse și prețuri Stripe pe FIECARE connected account
// Rulează: npx tsx scripts/create-stripe-products.ts
// Copiază output-ul în .env.local și Vercel Dashboard

import Stripe from 'stripe'
import { getBillingEntities } from '../lib/billing/entities'

const PLANS = [
  { key: 'direct',      name: 'Direct',           priceRon: 9900,  interval: 'month' as const },
  { key: 'partner',     name: 'Partner Founding',  priceRon: 9900,  interval: 'month' as const },
  { key: 'selfservice', name: 'Self-Service',       priceRon: 7900,  interval: 'month' as const },
]

async function createProducts() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover' as any,
  })

  console.log('Creare produse Stripe pe connected accounts s-s-m.ro...\n')

  for (const entity of getBillingEntities()) {
    console.log(`=== ${entity.name} (${entity.id}) — ${entity.stripeAccountId} ===`)

    for (const plan of PLANS) {
      const product = await stripe.products.create(
        {
          name: `s-s-m.ro ${plan.name}`,
          description: `Abonament ${plan.name} — ${entity.name}`,
          metadata: { plan_key: plan.key, entity_id: entity.id },
        },
        { stripeAccount: entity.stripeAccountId }
      )

      const price = await stripe.prices.create(
        {
          product: product.id,
          unit_amount: plan.priceRon,
          currency: 'ron',
          recurring: { interval: plan.interval },
        },
        { stripeAccount: entity.stripeAccountId }
      )

      const envKey = `STRIPE_PRICE_${entity.id}_${plan.key.toUpperCase()}`
      console.log(`  ${envKey}=${price.id}`)
    }

    console.log()
  }

  console.log('✅ Copiază valorile de mai sus în .env.local și Vercel Dashboard!')
  console.log('📌 Înlocuiește STRIPE_PRICE_{ENTITY}_{PLAN} cu valorile reale\n')
}

createProducts().catch((err) => {
  console.error('Eroare:', err)
  process.exit(1)
})
