'use client'

import type { ObligationType } from '@/lib/types'
import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { TrustedBy } from '@/components/landing/trusted-by'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Stats } from '@/components/landing/stats'
import { PricingSection } from '@/components/pricing/pricing-section'
import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

interface Props {
  obligations: ObligationType[]
}

export default function LandingClient({ obligations: _obligations }: Props) {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Stats />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
