import type { Metadata } from "next"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export const metadata: Metadata = {
  title: "Configurare cont — s-s-m.ro",
  description: "Configurează-ți contul s-s-m.ro în câteva minute.",
}

export default function OnboardingPage() {
  return <OnboardingWizard />
}
