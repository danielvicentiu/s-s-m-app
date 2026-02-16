/**
 * API Route: /api/scan-pipeline/extract
 * POST: Extrage date din imagine folosind AI (Anthropic Claude Vision)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { ScanService } from '@/lib/scan-pipeline';
import type { CreateScanRequest, CreateScanResponse, ScanTemplate } from '@/lib/scan-pipeline';

export async function POST(request: NextRequest) {
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

    // 2. Parsează body-ul request-ului
    const body: CreateScanRequest = await request.json();
    const { imageBase64, templateKey, orgId, filename } = body;

    if (!imageBase64 || !templateKey || !orgId || !filename) {
      return NextResponse.json(
        { success: false, error: 'Parametri lipsă: imageBase64, templateKey, orgId, filename' },
        { status: 400 }
      );
    }

    // 3. Verifică dacă user-ul are acces la org
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('id')
      .eq('org_id', orgId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { success: false, error: 'Acces interzis la această organizație' },
        { status: 403 }
      );
    }

    // 4. Preia template-ul din baza de date
    const { data: template, error: templateError } = await supabase
      .from('document_scan_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { success: false, error: `Template-ul ${templateKey} nu a fost găsit sau este inactiv` },
        { status: 404 }
      );
    }

    const scanTemplate = template as unknown as ScanTemplate;

    // 5. Creează intrare în document_scans cu status 'processing'
    const { data: scan, error: scanError } = await supabase
      .from('document_scans')
      .insert({
        org_id: orgId,
        template_key: templateKey,
        original_filename: filename,
        status: 'processing',
        created_by: user.id,
      })
      .select()
      .single();

    if (scanError || !scan) {
      console.error('Error creating scan record:', scanError);
      return NextResponse.json(
        { success: false, error: 'Eroare la crearea înregistrării scan' },
        { status: 500 }
      );
    }

    try {
      // 6. Apelează ScanService pentru extragere AI
      const scanService = new ScanService(process.env.ANTHROPIC_API_KEY);
      const result = await scanService.extractFromImage(
        imageBase64,
        scanTemplate.fields,
        scanTemplate.extraction_prompt || undefined
      );

      // 7. Actualizează scan cu rezultatele
      const { error: updateError } = await supabase
        .from('document_scans')
        .update({
          extracted_data: result.fields,
          confidence_score: result.confidence,
          status: 'completed',
        })
        .eq('id', scan.id);

      if (updateError) {
        console.error('Error updating scan with results:', updateError);
        throw new Error('Failed to update scan record');
      }

      // 8. Returnează rezultatul
      const response: CreateScanResponse = {
        success: true,
        scan_id: scan.id,
        extracted_data: result.fields,
        confidence_score: result.confidence,
      };

      return NextResponse.json(response, { status: 200 });
    } catch (extractionError) {
      // Marchează scan ca 'failed'
      await supabase
        .from('document_scans')
        .update({ status: 'failed' })
        .eq('id', scan.id);

      console.error('Extraction error:', extractionError);
      return NextResponse.json(
        {
          success: false,
          error: `Eroare la extragere: ${
            extractionError instanceof Error ? extractionError.message : 'Unknown error'
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in /api/scan-pipeline/extract:', error);
    return NextResponse.json(
      {
        success: false,
        error: `Eroare server: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
