import { LeftPanel } from '@/components/auth/LeftPanel'
import { MobileBanner } from '@/components/auth/MobileBanner'
import { RightPanel } from '@/components/auth/RightPanel'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile: banner sus */}
      <MobileBanner />

      {/* Desktop: panel stânga (branding) */}
      <LeftPanel />

      {/* Panel dreapta: tabs autentificare */}
      <RightPanel />
    </div>
  )
}
