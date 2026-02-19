import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { TrustedBy } from "@/components/landing/trusted-by"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Stats } from "@/components/landing/stats"
import { PricingSection } from "@/components/pricing/pricing-section"
import { ComparisonTable } from "@/components/pricing/comparison-table"
import { Faq } from "@/components/pricing/faq"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Stats />
      <PricingSection />
      <ComparisonTable />
      <Faq />
      <CtaSection />
      <Footer />
    </main>
  )
}
