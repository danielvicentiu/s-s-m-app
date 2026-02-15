// lib/legislative-import/pipelines/update-check.ts
// Weekly update check — compares content hashes to detect legislation changes

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, COUNTRY_CONFIGS } from '../config';
import { EurLexAdapter } from '../adapters/eurlex-adapter';
import { BgLexAdapter } from '../adapters/bg-adapter';
import { LegislativeTranslator } from '../processors/translator';
import { LegislativeStructurer } from '../processors/structurer';
import type { CountryCode, AdapterType, LegislativeAdapter } from '../types';

interface UpdateResult {
  countryCode: string;
  totalChecked: number;
  updatesFound: number;
  updatesApplied: number;
  errors: string[];
  duration: number;
}

export class UpdateCheckPipeline {
  private supabase: SupabaseClient;
  private translator: LegislativeTranslator;
  private structurer: LegislativeStructurer;

  constructor() {
    this.supabase = createClient(env.supabaseUrl, env.supabaseServiceKey);
    this.translator = new LegislativeTranslator();
    this.structurer = new LegislativeStructurer();
  }

  /**
   * Check all imported acts for a country for updates
   */
  async checkCountry(countryCode: CountryCode): Promise<UpdateResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let updatesFound = 0;
    let updatesApplied = 0;

    console.log(`[update-check] Checking updates for ${countryCode}...`);

    // Get all imported acts for this country
    const { data: acts, error } = await this.supabase
      .from('legislation')
      .select('id, source_id, content_hash, import_status')
      .eq('country_code', countryCode)
      .in('import_status', ['structured', 'published'])
      .order('updated_at', { ascending: true }); // Check oldest first

    if (error || !acts) {
      return {
        countryCode,
        totalChecked: 0,
        updatesFound: 0,
        updatesApplied: 0,
        errors: [`Failed to fetch acts: ${error?.message}`],
        duration: Date.now() - startTime,
      };
    }

    const adapter = this.getAdapter(COUNTRY_CONFIGS[countryCode].adapterType);

    for (const act of acts) {
      try {
        const result = await adapter.checkForUpdates(act.source_id, act.content_hash || '');

        if (result.hasChanged) {
          updatesFound++;
          console.log(`[update-check] Update found: ${act.source_id}`);

          // Re-fetch, re-translate, re-structure
          try {
            const raw = await adapter.fetchAct(act.source_id);
            const translated = await this.translator.translate(raw);
            const structured = await this.structurer.structure(translated);

            // Update in Supabase
            await this.supabase
              .from('legislation')
              .update({
                text_original: structured.textOriginal,
                text_ro: structured.textRo,
                title_ro: structured.titleRo,
                content_hash: structured.contentHash,
                date_last_amended: structured.dateLastAmended,
                domains: structured.domains,
                op_lego_modules: structured.opLegoModules,
                ssm_relevance_score: structured.ssmRelevanceScore,
                keywords: structured.keywords,
                summary_ro: structured.summaryRo,
                obligations_json: structured.obligations,
                review_status: 'needs_revision', // Flag for manual review
                update_history: this.supabase.rpc ? undefined : [],
              })
              .eq('id', act.id);

            updatesApplied++;
          } catch (err) {
            errors.push(`Failed to update ${act.source_id}: ${err}`);
          }
        }
      } catch (err) {
        errors.push(`Check failed for ${act.source_id}: ${err}`);
      }
    }

    const result: UpdateResult = {
      countryCode,
      totalChecked: acts.length,
      updatesFound,
      updatesApplied,
      errors,
      duration: Date.now() - startTime,
    };

    // Log the update check
    await this.supabase.from('legislation_import_log').insert({
      country_code: countryCode,
      adapter_type: COUNTRY_CONFIGS[countryCode].adapterType,
      run_type: 'update_check',
      status: errors.length === 0 ? 'completed' : 'partial',
      completed_at: new Date().toISOString(),
      acts_found: acts.length,
      acts_updated: updatesApplied,
      errors,
      summary: `Checked ${acts.length} acts, ${updatesFound} updates found, ${updatesApplied} applied`,
      triggered_by: 'cron',
    });

    console.log(
      `[update-check] Done ${countryCode}: ${acts.length} checked, ` +
      `${updatesFound} updates, ${errors.length} errors`
    );

    return result;
  }

  /**
   * Run update check for all active countries
   */
  async checkAll(): Promise<UpdateResult[]> {
    const countries: CountryCode[] = ['EU', 'BG']; // Add more as adapters are ready
    const results: UpdateResult[] = [];

    for (const country of countries) {
      const result = await this.checkCountry(country);
      results.push(result);
    }

    return results;
  }

  private getAdapter(adapterType: AdapterType): LegislativeAdapter {
    switch (adapterType) {
      case 'eurlex': return new EurLexAdapter();
      case 'bg_lex': return new BgLexAdapter();
      default: throw new Error(`Adapter not implemented: ${adapterType}`);
    }
  }
}
