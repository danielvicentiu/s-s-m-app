// app/[locale]/dashboard/settings/billing/page.tsx
// Pagină facturare — server component pentru fetch date abonament

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const supabase = await createSupabaseServer()

  // Verifică user autentificat
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

  // Fetch organizația și membership-ul userului
  const { data: membership } = await supabase
    .from('memberships')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .single()

  // Mock data pentru billing (deocamdată fără tabelă dedicată)
  // În viitor: tabel subscriptions + stripe integration
  const billingData = {
    currentPlan: 'Professional',
    planPrice: 299,
    currency: 'RON',
    billingCycle: 'lunar',
    nextPaymentDate: '2026-03-15',
    paymentMethod: {
      type: 'card' as const,
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2028
    },
    invoices: [
      {
        id: 'INV-2026-002',
        date: '2026-02-01',
        amount: 299,
        status: 'paid' as const,
        description: 'Abonament Professional - Februarie 2026',
        pdfUrl: '#'
      },
      {
        id: 'INV-2026-001',
        date: '2026-01-01',
        amount: 299,
        status: 'paid' as const,
        description: 'Abonament Professional - Ianuarie 2026',
        pdfUrl: '#'
      },
      {
        id: 'INV-2025-012',
        date: '2025-12-01',
        amount: 299,
        status: 'paid' as const,
        description: 'Abonament Professional - Decembrie 2025',
        pdfUrl: '#'
      },
      {
        id: 'INV-2025-011',
        date: '2025-11-01',
        amount: 299,
        status: 'paid' as const,
        description: 'Abonament Professional - Noiembrie 2025',
        pdfUrl: '#'
      }
    ]
  }

  return (
    <BillingClient
      user={user}
      organizationId={membership?.organization_id || null}
      billingData={billingData}
    />
  )
}
