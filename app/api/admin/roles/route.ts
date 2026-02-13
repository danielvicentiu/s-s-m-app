// app/api/admin/roles/route.ts
// API: Create new role
// Access: super_admin only

import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { isSuperAdmin } from '@/lib/rbac';

export async function POST(request: Request) {
  try {
    // Check auth
    const admin = await isSuperAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse request
    const body = await request.json();
    const { role_key, role_name, description, country_code, is_system, metadata } = body;

    // Validation
    if (!role_key || !role_name) {
      return NextResponse.json(
        { error: 'role_key and role_name are required' },
        { status: 400 }
      );
    }

    // Check for duplicate role_key
    const { data: existing } = await supabase
      .from('roles')
      .select('id')
      .eq('role_key', role_key)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `Role with key "${role_key}" already exists` },
        { status: 409 }
      );
    }

    // Create role
    const { data: role, error } = await supabase
      .from('roles')
      .insert({
        role_key,
        role_name,
        description: description || null,
        country_code: country_code || null,
        is_system: is_system || false,
        metadata: metadata || {},
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating role:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ role }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/roles error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
