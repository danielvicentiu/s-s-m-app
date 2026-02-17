import { createSupabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const is_active = searchParams.get('is_active');
    const consent_type = searchParams.get('consent_type');
    const search = searchParams.get('search');

    let query = supabase
      .from('gdpr_consents')
      .select('*')
      .order('created_at', { ascending: false });

    if (is_active !== null) {
      query = query.eq('is_active', is_active === 'true');
    }

    if (consent_type) {
      query = query.eq('consent_type', consent_type);
    }

    if (search) {
      query = query.or(`person_name.ilike.%${search}%,person_email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching consents:', error);
      return NextResponse.json({ error: 'Eroare la încărcarea datelor' }, { status: 500 });
    }

    return NextResponse.json(data);
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

    const { data, error } = await supabase
      .from('gdpr_consents')
      .insert({
        ...body,
        organization_id: membership.organization_id,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating consent:', error);
      return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 });
  }
}
