// app/[locale]/dashboard/obligations/page.tsx
// Pagina completă obligații legale pentru organizație
// Folosește ObligationsWidget în mod full (compact=false)

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ObligationsWidget from '@/components/dashboard/ObligationsWidget'

export default async function ObligationsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Get user's organization from memberships
  const { data: membership } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  // Fallback: check user_preferences for selected_org
  let orgId = membership?.organization_id

  if (!orgId) {
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', 'selected_org')
      .single()

    if (prefs?.value) {
      try {
        orgId = JSON.parse(prefs.value)
      } catch {}
    }
  }

  if (!orgId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nu ești asociat la nicio organizație.</p>
          <p className="text-sm mt-2">Contactează administratorul pentru a fi adăugat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ObligationsWidget 
        organizationId={orgId} 
        locale={locale} 
        compact={false} 
      />
    </div>
  )
}
