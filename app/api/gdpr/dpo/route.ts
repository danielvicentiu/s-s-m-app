import { createSupabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    // Get user's organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('gdpr_dpo')
      .select('*')
      .eq('organization_id', membership.organization_id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching DPO:', error);
      return NextResponse.json({ error: 'Eroare la încărcare' }, { status: 500 });
    }

    return NextResponse.json(data || null);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    const body = await request.json();

    // Get user's organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 });
    }

    // Upsert DPO (one per organization)
    const { data, error } = await supabase
      .from('gdpr_dpo')
      .upsert({
        ...body,
        organization_id: membership.organization_id,
        created_by: user.id,
      }, {
        onConflict: 'organization_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting DPO:', error);
      return NextResponse.json({ error: 'Eroare la salvare' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 });
  }
}
