// app/[locale]/dashboard/settings/api-keys/page.tsx
// Pagina gestionare chei API — generare, listare, revocare chei
// Server component — fetch chei existente

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ApiKeysClient from './ApiKeysClient'

export default async function ApiKeysPage() {
  const supabase = await createSupabaseServer()

  // Verifică user autentificat
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

  // Fetch chei API existente
  const { data: apiKeys, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching API keys:', error)
  }

  return <ApiKeysClient user={user} apiKeys={apiKeys || []} />
}
