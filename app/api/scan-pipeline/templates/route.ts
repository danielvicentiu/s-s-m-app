/**
 * API Route: /api/scan-pipeline/templates
 * GET: Returnează toate template-urile active de documente
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { ScanTemplate } from '@/lib/scan-pipeline';

export async function GET(request: NextRequest) {
  try {
    // 1. Verifică autentificarea
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Neautentificat' },
        { status: 401 }
      );
    }

    // 2. Preia parametrul de categorie (opțional)
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // 3. Construiește query
    let query = supabase
      .from('document_scan_templates')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('name_ro');

    // Filtrează după categorie dacă este specificată
    if (category) {
      const validCategories = ['ssm', 'psi', 'medical', 'equipment', 'general', 'accounting'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { success: false, error: 'Categorie invalidă' },
          { status: 400 }
        );
      }
      query = query.eq('category', category);
    }

    // 4. Execută query
    const { data: templates, error: templatesError } = await query;

    if (templatesError) {
      console.error('Error fetching templates:', templatesError);
      return NextResponse.json(
        { success: false, error: 'Eroare la preluarea template-urilor' },
        { status: 500 }
      );
    }

    // 5. Returnează template-urile
    return NextResponse.json(
      {
        success: true,
        templates: templates as unknown as ScanTemplate[],
        count: templates?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/scan-pipeline/templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: `Eroare server: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
