// ============================================================
// app/api/admin/legal-bulk-search/route.ts
// M6 Bulk Import — Search legislative acts via SOAP API
// GET /api/admin/legal-bulk-search?tipAct=Lege&an=2006&numar=319&titlu=...&pagina=0
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { isSuperAdmin, getMyRoles } from '@/lib/rbac';
import { searchActs, type LegislativeActResult } from '@/lib/legislative-import/ro-soap-client';

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

// ─── Composite key helper ────────────────────────────────────

function getActKey(act: LegislativeActResult): string {
  return act.id || `${act.tipAct}_${act.numar}_${act.an}`;
}

// ─── GET handler ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
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

  // Parse query params
  const { searchParams } = new URL(request.url);
  const tipAct = searchParams.get('tipAct') || '';
  const an = searchParams.get('an') ? parseInt(searchParams.get('an')!) : undefined;
  const numar = searchParams.get('numar') || undefined;
  const titlu = searchParams.get('titlu') || undefined;
  const pagina = searchParams.get('pagina') ? parseInt(searchParams.get('pagina')!) : 0;

  try {
    // Call SOAP search
    let results = await searchActs({
      an,
      numar,
      titlu,
      pagina,
      rezultatePePagina: 20,
    });

    // Post-filter by tipAct if provided (SOAP doesn't support it natively)
    if (tipAct) {
      results = results.filter(
        (r) => r.tipAct.toLowerCase() === tipAct.toLowerCase()
      );
    }

    // Check which results already exist in DB
    const supabaseAdmin = getSupabaseAdmin();
    const actNumbers = results.map((r) => r.numar).filter(Boolean);

    let existingKeys = new Set<string>();

    if (actNumbers.length > 0) {
      const { data: dbActs } = await supabaseAdmin
        .from('legal_acts')
        .select('act_type, act_number, act_year')
        .in('act_number', actNumbers)
        .eq('country_code', 'RO');

      if (dbActs && dbActs.length > 0) {
        const dbKeys = new Set(
          dbActs.map(
            (a) => `${a.act_type}_${a.act_number}_${a.act_year}`
          )
        );

        for (const result of results) {
          const compositeKey = `${result.tipAct}_${result.numar}_${result.an}`;
          if (dbKeys.has(compositeKey)) {
            existingKeys.add(getActKey(result));
          }
        }
      }
    }

    return NextResponse.json({
      results,
      page: pagina,
      hasMore: results.length >= 20,
      existingIds: Array.from(existingKeys),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Eroare la căutare SOAP.';
    console.error('[bulk-search] SOAP search error:', err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
