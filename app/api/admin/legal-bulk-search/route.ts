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
export const dynamic = 'force-dynamic';

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
    // SOAP caps at 10 results/page. When filtering by tipAct (which SOAP doesn't support
    // natively), fetch 3 pages in parallel so we have 30 raw results to filter from.
    const SOAP_PAGE_SIZE = 10;
    const SOAP_PAGES_PER_UI_PAGE = tipAct ? 3 : 1;
    const soapStart = pagina * SOAP_PAGES_PER_UI_PAGE;

    const batches = await Promise.all(
      Array.from({ length: SOAP_PAGES_PER_UI_PAGE }, (_, i) =>
        searchActs({ an, numar, titlu, pagina: soapStart + i, rezultatePePagina: SOAP_PAGE_SIZE })
      )
    );
    // Deduplicate — SOAP may return same acts across pages when result set is small
    const seen = new Set<string>();
    const allResults = batches.flat().filter((r) => {
      const key = getActKey(r);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Post-filter by tipAct if provided (SOAP doesn't support it natively)
    const results = tipAct
      ? allResults.filter((r) => r.tipAct.toLowerCase() === tipAct.toLowerCase())
      : allResults;

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

    console.log(`[bulk-search] page=${pagina} soapPages=${SOAP_PAGES_PER_UI_PAGE} allResults=${allResults.length} filtered=${results.length} firstNumar=${results[0]?.numar ?? 'none'}`);

    return NextResponse.json(
      {
        results,
        page: pagina,
        // hasMore: only true if we got a full set of unique results (no dedup collapse)
        hasMore: seen.size >= SOAP_PAGE_SIZE * SOAP_PAGES_PER_UI_PAGE,
        existingIds: Array.from(existingKeys),
      },
      {
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Eroare la căutare SOAP.';
    console.error('[bulk-search] SOAP search error:', err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
