// app/[locale]/admin/email-templates/page.tsx
// Admin UI: Editor template-uri email cu preview și test send
// Acces: super_admin

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/rbac'
import EmailTemplatesClient from './EmailTemplatesClient'

export default async function AdminEmailTemplatesPage() {
  // GUARD: Verificare super_admin
  const admin = await isSuperAdmin()
  if (!admin) redirect('/unauthorized')

  const supabase = await createSupabaseServer()

  // Fetch toate template-urile
  const { data: templates, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching email templates:', error)
  }

  const templatesData = templates || []

  // Statistici
  const stats = {
    total: templatesData.length,
    active: templatesData.filter(t => t.is_active).length,
    system: templatesData.filter(t => t.is_system).length,
    alerts: templatesData.filter(t => t.category === 'alerts').length,
  }

  return <EmailTemplatesClient templates={templatesData} stats={stats} />
}
