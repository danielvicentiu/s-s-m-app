// ============================================================
// app/api/admin/legal-bulk-search/route.ts
// M6 Bulk Import — Search legislative acts via SOAP API
// GET /api/admin/legal-bulk-search?tipAct=Lege&an=2006&numar=319&titlu=...&pagina=0
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { isSuperAdmin, getMyRoles } from '@/lib/rbac';
import { searchActs, getToken, type LegislativeActResult } from '@/lib/legislative-import/ro-soap-client';

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
    // SOAP caps at 10 results per call regardless of RezultatePagina.
    // SOAP uses 1-based pages: NumarPagina=1 is the first page.
    //
    // Without tipAct: fetch 3 SOAP pages per UI page (30 results shown).
    //   soapStart = pagina * 3 + 1
    //
    // With tipAct: SOAP has no native type filter — fetch 10 SOAP pages (100 raw
    //   results) and post-filter by type.
    //   soapStart = pagina * 10 + 1
    //
    // OUG/OG special case: these types don't appear in the first 100+ SOAP results
    //   when searching by year alone (SOAP orders them much later). However, a
    //   SearchTitlu keyword ("urgenta"/"ordonanta") does return them — but SOAP
    //   ignores SearchAn when SearchTitlu is present, so we drop SearchAn from the
    //   SOAP query and apply the year filter ourselves in post-processing.
    //   This path is only taken when no numar and no user-provided titlu are given
    //   (if numar is present, SearchAn+SearchNumar finds the act directly).
    const SOAP_PAGE_SIZE = 10;
    const SOAP_PAGES = tipAct ? 10 : 3;
    const soapStart = pagina * SOAP_PAGES + 1; // 1-based

    const SPARSE_TYPES: Record<string, string> = { oug: 'urgenta', og: 'ordonanta' };
    const sparseHint = tipAct && !numar && !titlu
      ? SPARSE_TYPES[tipAct.toLowerCase()]
      : undefined;

    // For sparse types: use title hint, no year in SOAP (SOAP ignores year+title combo).
    // For all other cases: pass year and user-provided title as-is.
    const soapAn    = sparseHint ? undefined : an;
    const soapTitlu = sparseHint ?? titlu;

    // Pre-warm token once — parallel searchActs calls share the cached token.
    // Without this, parallel calls each try to fetch their own token and the
    // SOAP server only keeps the last one valid (race condition).
    await getToken();

    const batches = await Promise.all(
      Array.from({ length: SOAP_PAGES }, (_, i) =>
        searchActs({ an: soapAn, numar, titlu: soapTitlu, pagina: soapStart + i, rezultatePePagina: SOAP_PAGE_SIZE })
      )
    );

    const lastBatch = batches[batches.length - 1];
    const hasMore = lastBatch.length >= SOAP_PAGE_SIZE;

    // Deduplicate across batches
    const seen = new Set<string>();
    const allDeduped = batches.flat().filter((r) => {
      const key = getActKey(r);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Post-filter by tipAct (always) and by year when sparseHint path was used
    // (because SOAP year filter was intentionally omitted for OUG/OG).
    const results = tipAct
      ? allDeduped.filter((r) => {
          const typeMatch = r.tipAct.toLowerCase() === tipAct.toLowerCase();
          const yearMatch = sparseHint && an ? r.an === an : true;
          return typeMatch && yearMatch;
        })
      : allDeduped;

    const uniqueNormalized = [...new Set(allDeduped.map(r => r.tipAct))];
    const uniqueRaw = [...new Set(allDeduped.map(r => r.rawTipAct))];
    console.log(`[bulk-search] tipAct=${tipAct || 'none'} page=${pagina} soapStart=${soapStart} raw=${allDeduped.length} filtered=${results.length} hasMore=${hasMore} normalizedTypes=[${uniqueNormalized.join(',')}] rawTypes=[${uniqueRaw.map(v => JSON.stringify(v)).join(',')}]`);

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

    return NextResponse.json(
      {
        results,
        page: pagina,
        hasMore,
        existingIds: Array.from(existingKeys),
        // Debug: raw TipAct values as SOAP sends them — helps diagnose normalization issues
        _debugRawTypes: uniqueRaw,
        _debugNormalizedTypes: uniqueNormalized,
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
