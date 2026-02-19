import type { Metadata } from "next"
import { LeftPanel } from "@/components/auth/left-panel"
import { RightPanel } from "@/components/auth/right-panel"
import { MobileBanner } from "@/components/auth/mobile-banner"

export const metadata: Metadata = {
  title: "Autentificare — s-s-m.ro",
  description:
    "Conectează-te la platforma s-s-m.ro pentru securitatea și sănătatea în muncă.",
}

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col bg-card lg:flex-row">
      {/* Mobile: compact banner */}
      <MobileBanner />

      {/* Desktop: left 60% dark panel */}
      <LeftPanel />

      {/* Right: form panel */}
      <RightPanel />
    </div>
  )
}
