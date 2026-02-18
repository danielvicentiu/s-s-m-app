// app/[locale]/dashboard/iscir/[id]/page.tsx
// M9_ISCIR: Equipment detail server component

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ISCIRDetailClient from './ISCIRDetailClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Detalii echipament ISCIR | s-s-m.ro',
  description: 'Detalii tehnice, istoricul verificărilor și verificări zilnice ISCIR',
}

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function ISCIRDetailPage({ params }: PageProps) {
  const { locale, id } = await params
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch equipment with org info
  const { data: equipment, error: equipmentError } = await supabase
    .from('iscir_equipment')
    .select('*, organizations(id, name, cui)')
    .eq('id', id)
    .single()

  if (equipmentError || !equipment) {
    notFound()
  }

  // Fetch verification history (newest first)
  const { data: verifications } = await supabase
    .from('iscir_verifications')
    .select('*')
    .eq('equipment_id', id)
    .order('verification_date', { ascending: false })
    .limit(50)

  // Fetch daily checks – last 30 days (only if equipment requires it)
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - 30)

  const { data: rawDailyChecks } = equipment.daily_check_required
    ? await supabase
        .from('iscir_daily_checks')
        .select('*')
        .eq('equipment_id', id)
        .gte('check_date', fromDate.toISOString().split('T')[0])
        .order('check_date', { ascending: false })
    : { data: [] }

  const dailyChecks = rawDailyChecks || []

  return (
    <ISCIRDetailClient
      user={{ id: user.id, email: user.email || '' }}
      equipment={equipment}
      verifications={verifications || []}
      dailyChecks={dailyChecks}
      locale={locale}
    />
  )
}
