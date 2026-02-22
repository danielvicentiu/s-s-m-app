// scripts/create-stripe-products.ts
// Script one-time: creare produse și prețuri Stripe pentru s-s-m.ro
// Rulează: npx ts-node scripts/create-stripe-products.ts
// Copiază output-ul în .env.local și Vercel Dashboard

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover' as any,
  typescript: true,
})

async function createProducts() {
  console.log('Creare produse Stripe pentru s-s-m.ro...\n')

  // ── Direct — 99 RON/lună ──
  const directProduct = await stripe.products.create({
    name: 's-s-m.ro Direct',
    description: 'Patron vine singur. Toate modulele SSM+PSI.',
    metadata: { plan_type: 'direct' },
  })
  const directPrice = await stripe.prices.create({
    product: directProduct.id,
    unit_amount: 9900, // 99 RON în bani
    currency: 'ron',
    recurring: { interval: 'month' },
  })
  console.log(`STRIPE_PRICE_DIRECT_99=${directPrice.id}`)

  // ── Partner-Billed — 99 RON/lună ──
  const partnerProduct = await stripe.products.create({
    name: 's-s-m.ro Partner-Billed',
    description: 'Wholesale pentru consultanți SSM/SEPP.',
    metadata: { plan_type: 'partner_billed' },
  })
  const partnerPrice = await stripe.prices.create({
    product: partnerProduct.id,
    unit_amount: 9900,
    currency: 'ron',
    recurring: { interval: 'month' },
  })
  console.log(`STRIPE_PRICE_PARTNER_99=${partnerPrice.id}`)

  // ── Self-Service — 79 RON/lună ──
  const selfProduct = await stripe.products.create({
    name: 's-s-m.ro Self-Service',
    description: 'Firme ≤9 angajați cu patron desemnat SSM.',
    metadata: { plan_type: 'self_service' },
  })
  const selfPrice = await stripe.prices.create({
    product: selfProduct.id,
    unit_amount: 7900, // 79 RON în bani
    currency: 'ron',
    recurring: { interval: 'month' },
  })
  console.log(`STRIPE_PRICE_SELFSERVICE_79=${selfPrice.id}`)

  console.log('\n✅ Copiază valorile de mai sus în .env.local și Vercel Dashboard!')
  console.log('📌 Înlocuiește STRIPE_PRICE_DIRECT_99, STRIPE_PRICE_PARTNER_99, STRIPE_PRICE_SELFSERVICE_79')
}

createProducts().catch((err) => {
  console.error('Eroare:', err)
  process.exit(1)
})
