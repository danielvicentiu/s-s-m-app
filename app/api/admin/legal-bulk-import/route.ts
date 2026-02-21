// ============================================================
// app/api/admin/legal-bulk-import/route.ts
// M6 Bulk Import — Import ONE act at a time (client loops with delay)
// POST /api/admin/legal-bulk-import
// Body: { act: LegislativeActResult }
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { isSuperAdmin, getMyRoles } from '@/lib/rbac';
import { type LegislativeActResult } from '@/lib/legislative-import/ro-soap-client';
import { fetchAndParseAct } from '@/lib/legislative-import/ro-html-parser';

export const maxDuration = 30;

// ─── Allowed roles (besides super_admin) ─────────────────────

const ALLOWED_ROLE_KEYS = ['consultant_ssm', 'consultant', 'firma_admin'];

// ─── Service role Supabase client ────────────────────────────

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Act key helper ──────────────────────────────────────────

function getActKey(act: LegislativeActResult): string {
  return act.id || `${act.tipAct}_${act.numar}_${act.an}`;
}

// ─── POST handler ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Auth — check session
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Autentificare necesară.' },
      { status: 401 }
    );
  }

  // Auth — check role
  const superAdmin = await isSuperAdmin();
  if (!superAdmin) {
    const roles = await getMyRoles();
    const allowed = roles.some((r) => ALLOWED_ROLE_KEYS.includes(r.role_key));
    if (!allowed) {
      return NextResponse.json(
        { error: 'Acces interzis. Rol insuficient.' },
        { status: 403 }
      );
    }
  }

  // Parse body
  let act: LegislativeActResult;
  try {
    const body = await request.json();
    act = body.act;
  } catch {
    return NextResponse.json(
      { error: 'Corp cerere invalid. Se așteaptă JSON cu câmpul "act".' },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!act || !act.portalUrl) {
    return NextResponse.json(
      { error: 'Câmpurile "act" și "act.portalUrl" sunt obligatorii.' },
      { status: 400 }
    );
  }

  const actKey = getActKey(act);
  const shortName = `${act.tipAct} ${act.numar}/${act.an}`;
  const supabaseAdmin = getSupabaseAdmin();

  try {
    // Step 1: Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from('legal_acts')
      .select('id, act_short_name')
      .eq('act_type', act.tipAct)
      .eq('act_number', act.numar)
      .eq('act_year', act.an)
      .eq('country_code', 'RO')
      .maybeSingle();

    if (existing) {
      const durationMs = Date.now() - startTime;
      await logImport(supabaseAdmin, actKey, 'duplicate', null, null, durationMs);
      return NextResponse.json({
        status: 'duplicate',
        message: `${shortName} există deja în baza de date.`,
      });
    }

    // Step 2: Fetch and parse full HTML
    const parsed = await fetchAndParseAct(act.portalUrl);

    const now = new Date().toISOString();
    const actFullName = parsed.title || act.titlu || shortName;

    // Step 3: Insert into legal_acts
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('legal_acts')
      .insert({
        act_type: act.tipAct,
        act_number: act.numar,
        act_year: act.an,
        act_full_name: actFullName,
        title: actFullName,
        act_short_name: shortName,
        title_short: shortName,
        full_text: parsed.fullText,
        content_hash: parsed.contentHash,
        country_code: 'RO',
        source: 'legislatie.just.ro',
        source_url: act.portalUrl,
        source_reference: actKey,
        status: 'active',
        domains: ['SSM'],
        relevant_for_platform: true,
        confidence_level: 'imported_raw',
        research_phase: 'text_imported',
        research_source: 'legislatie.just.ro',
        imported_at: now,
        last_checked_at: now,
      })
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    const actId = inserted.id;

    // Step 4: Insert sections
    if (parsed.sections.length > 0) {
      const sectionRows = parsed.sections.map((s) => ({
        legal_act_id: actId,
        order_index: s.orderIndex,
        section_type: s.sectionType,
        section_number: s.sectionNumber,
        title: s.title,
        content: s.content,
      }));

      const { error: sectError } = await supabaseAdmin
        .from('legal_act_sections')
        .insert(sectionRows);

      if (sectError) {
        console.warn(`[bulk-import] Sections insert warning for ${actKey}:`, sectError.message);
      }
    }

    // Step 5: Log success
    const durationMs = Date.now() - startTime;
    await logImport(supabaseAdmin, actKey, 'new', parsed.contentHash, null, durationMs);

    return NextResponse.json({
      status: 'imported',
      message: `${shortName} importat cu succes — ${parsed.sections.length} secțiuni.`,
      actId,
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error
      ? err.message
      : typeof err === 'object' && err !== null
        ? JSON.stringify(err)
        : String(err);

    console.error(`[bulk-import] Error importing ${actKey}:`, err);

    const durationMs = Date.now() - startTime;
    await logImport(supabaseAdmin, actKey, 'error', null, errMsg, durationMs).catch(() => {
      // Swallow log errors so we still return the real error
    });

    return NextResponse.json(
      {
        status: 'error',
        message: `Eroare la importul ${shortName}: ${errMsg}`,
        error: errMsg,
      },
      { status: 500 }
    );
  }
}

// ─── Log helper ───────────────────────────────────────────────

async function logImport(
  supabaseAdmin: any,
  reference: string,
  status: string,
  contentHash: string | null,
  errorMessage: string | null,
  durationMs: number
): Promise<void> {
  await supabaseAdmin.from('legislation_import_log').insert({
    source: 'legislatie.just.ro',
    country_code: 'RO',
    reference,
    status,
    content_hash: contentHash,
    error_message: errorMessage,
    duration_ms: durationMs,
    metadata: { adapter: 'bulk-import', version: '1.0' },
    created_at: new Date().toISOString(),
  } as any);
}
