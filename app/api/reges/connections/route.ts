// ============================================================
// S-S-M.RO — API Route: Create REGES Connection
// File: app/api/reges/connections/route.ts
//
// Creare conexiune REGES cu credențiale criptate
// IMPORTANT: Encryption TREBUIE server-side (nu client-side)
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { encryptCredentials } from '@/lib/reges/encryption';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organization_id,
      cui,
      reges_user_id,
      reges_employer_id,
      username,
      password,
    } = body;

    // Validation
    if (
      !organization_id ||
      !cui ||
      !reges_user_id ||
      !reges_employer_id ||
      !username ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: organization_id, cui, reges_user_id, reges_employer_id, username, password',
        },
        { status: 400 }
      );
    }

    // Verify user has access
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is member of organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('organization_id', organization_id)
      .eq('is_active', true)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'User is not a member of this organization' },
        { status: 403 }
      );
    }

    // Encrypt credentials (SERVER-SIDE ONLY)
    let encryptedCredentials: string;
    try {
      encryptedCredentials = encryptCredentials({ username, password });
    } catch (error) {
      console.error('Encryption error:', error);
      return NextResponse.json(
        {
          error: `Failed to encrypt credentials: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
        { status: 500 }
      );
    }

    // Insert connection
    const { data: connection, error: insertError } = await supabase
      .from('reges_connections')
      .insert({
        organization_id,
        cui,
        reges_user_id,
        reges_employer_id,
        encrypted_credentials: encryptedCredentials,
        encryption_key_version: 'v1',
        status: 'active',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);

      // Check for unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'A connection already exists for this organization and CUI' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: `Failed to create connection: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Log to audit
    await supabase.from('audit_log').insert({
      organization_id,
      user_id: user.id,
      action: 'create',
      entity_type: 'reges_connection',
      entity_id: connection.id,
      new_values: {
        cui,
        reges_user_id,
        reges_employer_id,
        // DO NOT log credentials
      },
    });

    return NextResponse.json({
      success: true,
      connection: {
        id: connection.id,
        cui: connection.cui,
        reges_user_id: connection.reges_user_id,
        reges_employer_id: connection.reges_employer_id,
        status: connection.status,
        // DO NOT return encrypted_credentials
      },
    });
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json(
      {
        error: `Internal server error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
