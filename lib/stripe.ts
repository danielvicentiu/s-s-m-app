// lib/stripe.ts
// Stripe client singleton + plan definitions
// Currency: RON (lei) — all amounts in bani (1 RON = 100 bani)

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY lipsește din .env.local')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover' as any,
  typescript: true,
})

export const PLANS = {
  direct: {
    priceId: process.env.STRIPE_PRICE_DIRECT_99!,
    name: 'Direct',
    amount: 9900, // 99 RON în bani
    currency: 'ron',
    planType: 'direct' as const,
    description: 'Patron vine singur. Trial 14 zile gratuit.',
  },
  partner_billed: {
    priceId: process.env.STRIPE_PRICE_PARTNER_99!,
    name: 'Partner-Billed',
    amount: 9900,
    currency: 'ron',
    planType: 'partner_billed' as const,
    description: 'SEPP aduce clientul. Preț Founding 12 luni fix.',
  },
  self_service: {
    priceId: process.env.STRIPE_PRICE_SELFSERVICE_79!,
    name: 'Self-Service',
    amount: 7900, // 79 RON în bani
    currency: 'ron',
    planType: 'self_service' as const,
    description: 'Firmă ≤9 angajați cu patron desemnat.',
  },
} as const

export type PlanType = keyof typeof PLANS
