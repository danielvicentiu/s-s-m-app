// app/[locale]/dashboard/trainings/page.tsx
// Server wrapper for TrainingsPageClient

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import TrainingsPageClient from './TrainingsPageClient'

export default async function TrainingsPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <TrainingsPageClient />
}
