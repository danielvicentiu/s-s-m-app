// app/api/admin/roles/[id]/permissions/route.ts
// API: Update role permissions
// Access: super_admin only

import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { isSuperAdmin } from '@/lib/rbac';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check auth
    const admin = await isSuperAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = await createSupabaseServer();
    const { id: roleId } = await params;

    // Parse request
    const body = await request.json();
    const { permissions } = body;

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'permissions must be an array' },
        { status: 400 }
      );
    }

    // Check if role exists
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('id, is_system')
      .eq('id', roleId)
      .single();

    if (roleError || !role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (role.is_system) {
      return NextResponse.json(
        { error: 'Cannot modify system role permissions' },
        { status: 403 }
      );
    }

    // Deactivate all existing permissions
    await supabase
      .from('permissions')
      .update({ is_active: false })
      .eq('role_id', roleId);

    // Insert new permissions
    if (permissions.length > 0) {
      const newPermissions = permissions.map((p: any) => ({
        role_id: roleId,
        resource: p.resource,
        action: p.action,
        field_restrictions: p.field_restrictions || {},
        conditions: p.conditions || {},
        country_code: p.country_code || null,
      }));

      const { data: inserted, error: insertError } = await supabase
        .from('permissions')
        .insert(newPermissions)
        .select();

      if (insertError) {
        console.error('Error inserting permissions:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ permissions: inserted }, { status: 200 });
    }

    return NextResponse.json({ permissions: [] }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/admin/roles/[id]/permissions error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
