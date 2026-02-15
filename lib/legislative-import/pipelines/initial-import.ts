// lib/legislative-import/pipelines/initial-import.ts
// Pipeline: Adapter → Translator → Structurer → legal_acts + legal_act_sections

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, getDefaultImportConfig, COUNTRY_CONFIGS } from '../config';
import { EurLexAdapter } from '../adapters/eurlex-adapter';
import { BgLexAdapter } from '../adapters/bg-adapter';
import { LegislativeTranslator } from '../processors/translator';
import { LegislativeStructurer } from '../processors/structurer';
import type {
  CountryCode, AdapterType, ImportResult, ImportError,
  RawLegislation, StructuredLegislation, LegislativeAdapter,
} from '../types';

export class ImportPipeline {
  private supabase: SupabaseClient;
  private translator: LegislativeTranslator;
  private structurer: LegislativeStructurer;
  private errors: ImportError[] = [];
  private warnings: string[] = [];
  private logId: string | null = null;

  constructor() {
    this.supabase = createClient(env.supabaseUrl, env.supabaseServiceKey);
    this.translator = new LegislativeTranslator();
    this.structurer = new LegislativeStructurer();
  }

  /** Run initial import for a country — priority acts */
  async runInitialImport(countryCode: CountryCode): Promise<ImportResult> {
    const config = getDefaultImportConfig(countryCode);
    const adapter = this.getAdapter(config.adapterType);

    console.log(`\n${'='.repeat(60)}\n[pipeline] INITIAL IMPORT: ${countryCode}\n${'='.repeat(60)}\n`);

    this.logId = await this.createLogEntry(countryCode, config.adapterType, 'initial');
    const startTime = Date.now();
    const stats = { actsFound: 0, actsNew: 0, actsUpdated: 0, actsTranslated: 0, actsStructured: 0, actsSkipped: 0 };

    try {
      const priorityIds = await adapter.getPriorityActs();
      stats.actsFound = priorityIds.length;

      for (let i = 0; i < priorityIds.length; i++) {
        const sourceId = priorityIds[i];
        console.log(`\n--- [${i + 1}/${priorityIds.length}] ${sourceId} ---`);

        try {
          // Check duplicate in legal_acts
          const existing = await this.findExisting(countryCode, sourceId);
          if (existing) {
            console.log(`[pipeline] Already exists: ${sourceId}, skipping`);
            stats.actsSkipped++;
            continue;
          }

          // 1. Fetch
          const raw = await adapter.fetchAct(sourceId);
          console.log(`[pipeline] ✅ Fetched: ${raw.titleOriginal.substring(0, 50)}... (${raw.textOriginal.length} chars)`);

          // 2. Translate (if needed)
          let translated;
          if (config.translateEnabled) {
            translated = await this.translator.translate(raw);
            stats.actsTranslated++;
          } else {
            translated = { ...raw, titleRo: raw.titleOriginal, textRo: raw.textOriginal, translationProvider: 'none' as const, deeplCharactersUsed: 0, translationCostEur: 0 };
          }

          // 3. Structure with Claude
          let structured: StructuredLegislation;
          if (config.structureEnabled) {
            structured = await this.structurer.structure(translated);
            stats.actsStructured++;
          } else {
            structured = { ...translated, domains: [], opLegoModules: [], ssmRelevanceScore: 0, keywords: [], summaryRo: '', obligations: [], crossReferences: [], structurerModel: '', structurerTokensUsed: 0, structurerCostUsd: 0 };
          }

          // 4. Save to legal_acts + legal_act_sections
          await this.saveToLegalActs(structured);
          stats.actsNew++;
          console.log(`[pipeline] ✅ Saved → legal_acts`);

        } catch (err) {
          this.errors.push({
            sourceId,
            step: this.detectErrorStep(err),
            message: err instanceof Error ? err.message : String(err),
            timestamp: new Date().toISOString(),
          });
          console.error(`[pipeline] ❌ ${sourceId}: ${err}`);
        }
      }

      const duration = Date.now() - startTime;
      const result: ImportResult = {
        logId: this.logId!, status: this.errors.length === 0 ? 'completed' : 'partial',
        ...stats,
        deeplCharactersUsed: this.translator.getCharactersUsed(),
        claudeTokensUsed: this.structurer.getTokensUsed().total,
        estimatedCostEur: this.calculateCostEur(),
        errors: this.errors, warnings: this.warnings, duration,
      };

      await this.finalizeLog(result);
      console.log(`\n[pipeline] DONE: ${stats.actsNew} new, ${stats.actsSkipped} skipped, ${this.errors.length} errors — €${result.estimatedCostEur.toFixed(4)} — ${(duration/1000).toFixed(1)}s\n`);
      return result;

    } catch (err) {
      await this.finalizeLog({ logId: this.logId!, status: 'failed', ...stats, deeplCharactersUsed: 0, claudeTokensUsed: 0, estimatedCostEur: 0, errors: [{ sourceId: '', step: 'fetch', message: String(err), timestamp: new Date().toISOString() }], warnings: [], duration: Date.now() - startTime });
      throw err;
    }
  }

  /** Import a single act */
  async importSingleAct(countryCode: CountryCode, sourceId: string): Promise<StructuredLegislation> {
    const config = getDefaultImportConfig(countryCode);
    const adapter = this.getAdapter(config.adapterType);
    const raw = await adapter.fetchAct(sourceId);
    const translated = await this.translator.translate(raw);
    const structured = await this.structurer.structure(translated);
    await this.saveToLegalActs(structured);
    return structured;
  }

  // --------------------------------------------------------------------------
  // Save to legal_acts (NOT legislation table)
  // --------------------------------------------------------------------------

  private async findExisting(countryCode: string, sourceId: string) {
    const { data } = await this.supabase
      .from('legal_acts')
      .select('id, content_hash')
      .eq('country_code', countryCode)
      .eq('source_id', sourceId)
      .maybeSingle();
    return data;
  }

  private async saveToLegalActs(act: StructuredLegislation): Promise<string> {
    const meta = act.metadata as Record<string, any> || {};
    const actYear = meta.actYear || this.extractYearFromDate(act.dateAdopted);

    const { data, error } = await this.supabase
      .from('legal_acts')
      .insert({
        // --- Câmpuri existente legal_acts ---
        act_type: act.actType,
        act_number: act.actNumber,
        act_year: actYear,
        act_short_name: meta.actShortName || `${act.actType} ${act.actNumber}`,
        act_full_name: meta.actFullName || act.titleOriginal,
        full_text: act.textRo || act.textOriginal,  // text_ro dacă e tradus, altfel original
        country_code: act.countryCode,
        domain: act.domains?.[0] || 'SSM',
        domains: act.domains?.length ? act.domains : ['SSM'],
        status: act.inForce ? 'in_vigoare' : 'abrogat',
        relevant_for_platform: true,
        confidence_level: 'ai_structured',
        research_phase: 'structured',
        research_source: act.sourceUrl,

        // --- Câmpuri NOI (din ALTER TABLE) ---
        source_id: act.sourceId,
        source_url: act.sourceUrl,
        title_ro: act.titleRo || act.titleOriginal,
        text_original: act.textOriginal,
        language_original: act.languageOriginal,
        content_hash: act.contentHash,
        translation_provider: act.translationProvider,
        deepl_characters_used: act.deeplCharactersUsed,
        translation_cost_eur: act.translationCostEur,
        structurer_model: act.structurerModel,
        structurer_tokens_used: act.structurerTokensUsed,
        structurer_cost_usd: act.structurerCostUsd,
        ssm_relevance_score: act.ssmRelevanceScore,
        op_lego_modules: act.opLegoModules,
        keywords: act.keywords,
        summary_ro: act.summaryRo,
        obligations_json: act.obligations,
        review_status: 'unreviewed',
        import_batch_id: this.logId,
        import_source: act.countryCode === 'EU' ? 'eurlex' : `${act.countryCode.toLowerCase()}_lex`,
        in_force: act.inForce,
        date_in_force: act.dateInForce || null,
        date_last_amended: act.dateLastAmended || null,
      })
      .select('id')
      .single();

    if (error) throw new Error(`Supabase legal_acts insert failed: ${error.message}`);
    const actId = data.id;

    // Insert sections into legal_act_sections
    if (act.sections && act.sections.length > 0) {
      const sectionsData = act.sections.map((s) => ({
        legal_act_id: actId,
        section_number: s.sectionNumber,
        section_title: s.sectionTitle || null,
        text_original: s.textOriginal,
        text_ro: ('textRo' in s) ? (s as any).textRo : null,
        relevance_score: ('relevanceScore' in s) ? (s as any).relevanceScore : 5,
        domains: act.domains || [],
        obligations_json: [],
        sort_order: s.sortOrder,
      }));

      const { error: secError } = await this.supabase.from('legal_act_sections').insert(sectionsData);
      if (secError) this.warnings.push(`Sections insert failed for ${act.sourceId}: ${secError.message}`);
    }

    // Insert cross-references into existing legal_cross_references
    if (act.crossReferences && act.crossReferences.length > 0) {
      for (const ref of act.crossReferences) {
        const { error: xrefError } = await this.supabase.from('legal_cross_references').insert({
          act_a_id: actId,
          relationship_type: ref.referenceType,
          description: ref.targetReferenceText,
          source_article: ref.sourceSection || null,
          target_act_type: null,
          target_act_number: ref.targetCelex || null,
          reference_type: ref.referenceType,
        });
        if (xrefError) this.warnings.push(`Xref insert: ${xrefError.message}`);
      }
    }

    return actId;
  }

  // --------------------------------------------------------------------------
  // Import log
  // --------------------------------------------------------------------------

  private async createLogEntry(countryCode: string, adapterType: string, runType: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('legislation_import_log')
      .insert({ country_code: countryCode, adapter_type: adapterType, run_type: runType, status: 'running', triggered_by: 'system' })
      .select('id').single();
    if (error) throw new Error(`Log create failed: ${error.message}`);
    return data.id;
  }

  private async finalizeLog(result: ImportResult): Promise<void> {
    if (!this.logId) return;
    await this.supabase.from('legislation_import_log').update({
      completed_at: new Date().toISOString(), status: result.status,
      acts_found: result.actsFound, acts_new: result.actsNew, acts_updated: result.actsUpdated,
      acts_translated: result.actsTranslated, acts_structured: result.actsStructured, acts_skipped: result.actsSkipped,
      deepl_characters_used: result.deeplCharactersUsed, claude_tokens_used: result.claudeTokensUsed,
      estimated_cost_eur: result.estimatedCostEur, errors: result.errors, warnings: result.warnings,
      summary: `${result.status}: ${result.actsNew} new, ${result.actsSkipped} skipped, ${result.errors.length} errors. €${result.estimatedCostEur.toFixed(4)}`,
    }).eq('id', this.logId);
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  private getAdapter(adapterType: AdapterType): LegislativeAdapter {
    switch (adapterType) {
      case 'eurlex': return new EurLexAdapter();
      case 'bg_lex': return new BgLexAdapter();
      default: throw new Error(`Adapter not implemented: ${adapterType}`);
    }
  }

  private detectErrorStep(err: unknown): 'fetch' | 'translate' | 'structure' | 'save' {
    const msg = String(err);
    if (msg.includes('DeepL') || msg.includes('translat')) return 'translate';
    if (msg.includes('Claude') || msg.includes('structur')) return 'structure';
    if (msg.includes('Supabase') || msg.includes('insert')) return 'save';
    return 'fetch';
  }

  private calculateCostEur(): number {
    const deepl = this.translator.getCharactersUsed() * 0.00002;
    const t = this.structurer.getTokensUsed();
    const claude = (t.input * 0.000003 + t.output * 0.000015) * 0.92;
    return deepl + claude;
  }

  private extractYearFromDate(date?: string): number {
    if (!date) return new Date().getFullYear();
    return parseInt(date.split('-')[0]) || new Date().getFullYear();
  }
}
