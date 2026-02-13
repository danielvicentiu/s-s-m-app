// app/[locale]/admin/organizations/page.tsx
// Admin — Organizations Management (Super Admin only)
// Lista organizații cu search, filtrare și acțiuni admin

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrganizationsClient from './OrganizationsClient'

export default async function AdminOrganizationsPage() {
  const supabase = await createSupabaseServer()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if user is super admin (check memberships or user_roles)
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', user.id)
    .single()

  // For now, only consultants can access admin (will be replaced with proper RBAC)
  if (membership?.role !== 'consultant') {
    redirect('/dashboard')
  }

  // Fetch all organizations with employee count
  const { data: organizations, error } = await supabase
    .from('organizations')
    .select(`
      id,
      name,
      cui,
      created_at,
      cooperation_status,
      employee_count,
      contact_email,
      contact_phone,
      county,
      address
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching organizations:', error)
  }

  return (
    <OrganizationsClient
      organizations={organizations || []}
      userId={user.id}
    />
  )
}
