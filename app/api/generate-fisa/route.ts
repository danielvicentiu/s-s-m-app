// ============================================================
// S-S-M.RO — API Route: Generate Fișă de Instruire PDF
// File: app/api/generate-fisa/route.ts
//
// 100% Node.js — funcționează pe Vercel fără Python
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Language labels
const LANGUAGE_LABELS: Record<string, string> = {
  ro: 'Română',
  en: 'English',
  ne: 'नेपाली (Nepali)',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
  ar: 'العربية (Arabic)',
  tr: 'Türkçe (Turkish)',
};

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { generateFisaPDF } = require('@/lib/generate-fisa');

    const body = await request.json();
    const { session_id, organization_id } = body;

    if (!session_id || !organization_id) {
      return NextResponse.json(
        { error: 'session_id and organization_id are required' },
        { status: 400 }
      );
    }

    // ============================================================
    // 1. Fetch data from Supabase
    // ============================================================

    // Session + module
    const { data: session, error: sessionError } = await supabase
      .from('training_sessions')
      .select(`
        *,
        training_modules (
          code, title, category, training_type,
          legal_basis, duration_minutes_required,
          periodicity_months, min_pass_score, description
        )
      `)
      .eq('id', session_id)
      .eq('organization_id', organization_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    // Worker profile
    const { data: worker } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', session.worker_id)
      .single();

    // Organization
    const { data: org } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organization_id)
      .single();

    // Worker role
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', session.worker_id)
      .eq('organization_id', organization_id)
      .single();

    // Next due date from assignment
    let nextDueDate = null;
    const { data: assignments } = await supabase
      .from('training_assignments')
      .select('next_due_date')
      .eq('session_id', session_id)
      .limit(1);

    if (assignments && assignments.length > 0) {
      nextDueDate = assignments[0].next_due_date;
    }

    const mod = session.training_modules as any;

    // ============================================================
    // 2. Build PDF data
    // ============================================================
    const pdfData = {
      organization_name: org?.name || 'Organizație',
      organization_details: '',
      document_number: `FI-${new Date().getFullYear()}-${session_id.substring(0, 6).toUpperCase()}`,

      worker_name: worker?.full_name || 'Necunoscut',
      worker_position: membership?.role || '',
      worker_department: '',
      worker_hire_date: '',
      work_location: session.location || '',

      training_type: mod?.training_type || 'periodic',
      module_code: mod?.code || '',
      module_title: mod?.title || '',
      session_date: session.session_date
        ? new Date(session.session_date).toLocaleDateString('ro-RO')
        : '',
      duration_minutes: session.duration_minutes || 0,
      duration_required: mod?.duration_minutes_required || 60,
      language: session.language || 'ro',
      language_label: LANGUAGE_LABELS[session.language] || session.language,
      location: session.location || 'Sediu angajator',
      legal_basis: mod?.legal_basis || [],
      periodicity_months: mod?.periodicity_months || null,
      next_due_date: nextDueDate
        ? new Date(nextDueDate).toLocaleDateString('ro-RO')
        : null,

      test_questions_total: session.test_questions_total || 0,
      test_questions_correct: session.test_questions_correct || 0,
      test_score: session.test_score || 0,
      min_pass_score: mod?.min_pass_score || 70,
      verification_result: session.verification_result || 'pending',

      instructor_name: session.instructor_name || '',
      instructor_authorization: '',
      quickvalid_timestamp: session.quickvalid_timestamp || null,
    };

    // ============================================================
    // 3. Generate PDF (in-memory)
    // ============================================================
    const pdfBuffer: Buffer = await generateFisaPDF(pdfData);

    // ============================================================
    // 4. Update session
    // ============================================================
    await supabase
      .from('training_sessions')
      .update({ fisa_generated_at: new Date().toISOString() })
      .eq('id', session_id);

    // ============================================================
    // 5. Return PDF
    // ============================================================
    const workerSlug = (worker?.full_name || 'angajat')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    const filename = `Fisa_Instruire_${workerSlug}_${session.session_date || 'nedatat'}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    );
  }
}
