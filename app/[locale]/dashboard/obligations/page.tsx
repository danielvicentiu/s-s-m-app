// app/[locale]/dashboard/obligations/page.tsx
// Dashboard: Vizualizare Obligații Legale
// Acces: consultant_ssm, firma_admin, angajat

import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getOrgObligations, getOrgObligationStats } from '@/lib/services/obligation-publisher';
import { ObligationsClient } from './ObligationsClient';

export default async function ObligationsPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user's organization(s)
  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (!memberships || memberships.length === 0) {
    redirect('/unauthorized');
  }

  const orgId = memberships[0].organization_id;

  // Get organization details
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, country_code')
    .eq('id', orgId)
    .single();

  if (!org) {
    redirect('/dashboard');
  }

  // Fetch obligations for this organization
  const obligations = await getOrgObligations(orgId);
  const stats = await getOrgObligationStats(orgId);

  return (
    <div className="min-h-screen bg-gray-50">
      <ObligationsClient
        obligations={obligations}
        stats={stats}
        organizationName={org.name}
        organizationId={orgId}
        userId={user.id}
        userRole={memberships[0].role}
      />
    </div>
  );
}
