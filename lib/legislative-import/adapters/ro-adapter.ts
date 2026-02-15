// ============================================================
// lib/legislative-import/adapters/ro-adapter.ts
// M7 Legislative Monitor — RO Adapter (Hybrid)
// 
// Citește actele monitorizate din tabelul legal_acts_monitor
// (nu hardcodat) → SOAP search → HTML full-text → DB compare
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { getToken, searchActs, findAct, type LegislativeActResult } from '../ro-soap-client';
import { fetchAndParseAct, computeHash, type ParsedLegalAct } from '../ro-html-parser';

// ─── Types ───────────────────────────────────────────────────

export interface MonitoredAct {
  id: string;
  key: string;
  tip_act: string;
  numar: string;
  an: number;
  titlu_scurt: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  country_code: string;
  portal_id: string | null;
  portal_url: string | null;
  source: string;
  last_content_hash: string | null;
  last_checked_at: string | null;
  consecutive_errors: number;
  check_frequency: string;
}

export interface ImportResult {
  actKey: string;
  titluScurt: string;
  status: 'unchanged' | 'updated' | 'new' | 'error';
  changes?: string[];
  error?: string;
  durationMs: number;
}

// ─── Supabase Client (service role for cron) ─────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── MAIN: Load monitored acts from DB ───────────────────────

export async function getMonitoredActs(): Promise<MonitoredAct[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('legal_acts_monitor')
    .select('*')
    .eq('is_active', true)
    .eq('country_code', 'RO')
    .order('priority', { ascending: true });

  if (error) {
    throw new Error(`Failed to load monitored acts: ${error.message}`);
  }

  return (data || []) as MonitoredAct[];
}

// ─── Check & Import a single act ─────────────────────────────

export async function checkAndImportAct(act: MonitoredAct): Promise<ImportResult> {
  const supabase = getSupabase();
  const startTime = Date.now();

  try {
    // Step 1: Search via SOAP API
    const soapResult = await findAct(act.tip_act, act.numar, act.an);

    if (!soapResult && !act.portal_id && !act.portal_url) {
      throw new Error('Act not found in SOAP API and no portal_id/url configured');
    }

    // Determine portal URL (priority: manual override > SOAP result > portal_id)
    const portalUrl = act.portal_url
      || soapResult?.portalUrl
      || (act.portal_id ? `https://legislatie.just.ro/Public/DetaliiDocument/${act.portal_id}` : null);

    if (!portalUrl) {
      throw new Error('Cannot determine portal URL for full-text fetch');
    }

    // Step 2: Fetch & parse full HTML content
    const parsed = await fetchAndParseAct(portalUrl);

    // Step 3: Compare hash with last known
    if (act.last_content_hash && act.last_content_hash === parsed.contentHash) {
      // No changes — update last_checked_at only
      await supabase
        .from('legal_acts_monitor')
        .update({
          last_checked_at: new Date().toISOString(),
          last_error: null,
          consecutive_errors: 0,
        })
        .eq('id', act.id);

      await logImport(supabase, act.key, 'unchanged', parsed.contentHash, null, Date.now() - startTime);

      return {
        actKey: act.key,
        titluScurt: act.titlu_scurt,
        status: 'unchanged',
        durationMs: Date.now() - startTime,
      };
    }

    // Step 4: Changed or new — upsert into legal_acts
    const isNew = !act.last_content_hash;
    const actData = {
      title: parsed.title || act.titlu_scurt,
      title_short: act.titlu_scurt,
      act_type: mapActType(act.tip_act),
      act_number: act.numar,
      act_year: act.an,
      country_code: 'RO',
      source: act.source,
      source_reference: act.key,
      source_url: portalUrl,
      content_hash: parsed.contentHash,
      full_text: parsed.fullText,
      status: 'active',
      priority: act.priority,
      last_checked_at: new Date().toISOString(),
      imported_at: new Date().toISOString(),
      monitor_id: act.id,
    };

    const { data: upserted, error: upsertError } = await supabase
      .from('legal_acts')
      .upsert(actData, { onConflict: 'source_reference,country_code' })
      .select('id')
      .single();

    if (upsertError) throw upsertError;

    // Step 5: Upsert sections
    if (upserted && parsed.sections.length > 0) {
      await supabase
        .from('legal_act_sections')
        .delete()
        .eq('legal_act_id', upserted.id);

      const sectionRows = parsed.sections.map((s) => ({
        legal_act_id: upserted.id,
        order_index: s.orderIndex,
        section_type: s.sectionType,
        section_number: s.sectionNumber,
        title: s.title,
        content: s.content,
      }));

      const { error: sectError } = await supabase
        .from('legal_act_sections')
        .insert(sectionRows);

      if (sectError) {
        console.warn(`[M7] Sections insert warning for ${act.key}:`, sectError.message);
      }
    }

    // Step 6: Update monitor state
    await supabase
      .from('legal_acts_monitor')
      .update({
        last_content_hash: parsed.contentHash,
        last_checked_at: new Date().toISOString(),
        last_changed_at: new Date().toISOString(),
        last_error: null,
        consecutive_errors: 0,
      })
      .eq('id', act.id);

    await logImport(supabase, act.key, isNew ? 'new' : 'updated', parsed.contentHash, null, Date.now() - startTime);

    return {
      actKey: act.key,
      titluScurt: act.titlu_scurt,
      status: isNew ? 'new' : 'updated',
      changes: isNew
        ? [`Import inițial — ${parsed.sections.length} secțiuni`]
        : ['Content hash schimbat — re-import complet'],
      durationMs: Date.now() - startTime,
    };

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);

    // Update monitor with error
    await supabase
      .from('legal_acts_monitor')
      .update({
        last_checked_at: new Date().toISOString(),
        last_error: errMsg,
        consecutive_errors: (act.consecutive_errors || 0) + 1,
      })
      .eq('id', act.id);

    // Auto-disable after 5 consecutive errors
    if ((act.consecutive_errors || 0) + 1 >= 5) {
      await supabase.rpc('auto_disable_failing_monitors');
    }

    await logImport(supabase, act.key, 'error', null, errMsg, Date.now() - startTime);

    return {
      actKey: act.key,
      titluScurt: act.titlu_scurt,
      status: 'error',
      error: errMsg,
      durationMs: Date.now() - startTime,
    };
  }
}

// ─── Batch: Check ALL active monitored acts ──────────────────

export async function checkAllMonitoredActs(): Promise<ImportResult[]> {
  const acts = await getMonitoredActs();
  const results: ImportResult[] = [];

  console.log(`[M7] Starting RO monitoring — ${acts.length} active acts`);

  for (const act of acts) {
    // Rate limiting: 2s between requests
    if (results.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(`[M7] Checking: ${act.key} (${act.titlu_scurt})`);
    const result = await checkAndImportAct(act);
    results.push(result);
    console.log(`[M7] ${act.key}: ${result.status} (${result.durationMs}ms)`);
  }

  const summary = {
    total: results.length,
    unchanged: results.filter((r) => r.status === 'unchanged').length,
    updated: results.filter((r) => r.status === 'updated').length,
    new: results.filter((r) => r.status === 'new').length,
    errors: results.filter((r) => r.status === 'error').length,
  };

  console.log(`[M7] RO monitoring complete:`, JSON.stringify(summary));

  return results;
}

// ─── Helpers ─────────────────────────────────────────────────

function mapActType(tipAct: string): string {
  const map: Record<string, string> = {
    Lege: 'law',
    OUG: 'emergency_ordinance',
    OG: 'government_ordinance',
    HG: 'government_decision',
    Cod: 'code',
    Ordin: 'ministerial_order',
    Decizie: 'decision',
  };
  return map[tipAct] || 'other';
}

async function logImport(
  supabase: ReturnType<typeof createClient>,
  reference: string,
  status: string,
  contentHash: string | null,
  error: string | null,
  durationMs: number
) {
  await supabase.from('legislation_import_log').insert({
    source: 'legislatie.just.ro',
    country_code: 'RO',
    reference,
    status,
    content_hash: contentHash,
    error_message: error,
    duration_ms: durationMs,
    metadata: { adapter: 'ro-adapter-hybrid', version: '1.0' },
    created_at: new Date().toISOString(),
  });
}

// ─── Admin: Add new act to monitoring ────────────────────────

export async function addActToMonitor(params: {
  key: string;
  tipAct: string;
  numar: string;
  an: number;
  titluScurt: string;
  priority?: string;
  portalId?: string;
  notes?: string;
  tags?: string[];
}) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('legal_acts_monitor')
    .insert({
      key: params.key,
      tip_act: params.tipAct,
      numar: params.numar,
      an: params.an,
      titlu_scurt: params.titluScurt,
      priority: params.priority || 'normal',
      portal_id: params.portalId || null,
      notes: params.notes || null,
      tags: params.tags || [],
      country_code: 'RO',
      source: 'legislatie.just.ro',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Admin: Toggle active status ─────────────────────────────

export async function toggleActMonitoring(key: string, isActive: boolean) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('legal_acts_monitor')
    .update({ is_active: isActive })
    .eq('key', key);

  if (error) throw error;
}
