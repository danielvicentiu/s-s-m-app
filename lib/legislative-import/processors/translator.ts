// lib/legislative-import/processors/translator.ts
// DeepL API translation processor for legislative texts

import { env, COUNTRY_CONFIGS, COST_ESTIMATES } from '../config';
import { splitText, reassembleChunks } from '../utils/text-splitter';
import { RateLimiter, withRetry } from '../utils/rate-limiter';
import type {
  RawLegislation,
  TranslatedLegislation,
  TranslatedSection,
  CountryCode,
} from '../types';

// ============================================================================
// DeepL API Types
// ============================================================================

interface DeepLTranslation {
  detected_source_language: string;
  text: string;
}

interface DeepLResponse {
  translations: DeepLTranslation[];
}

// ============================================================================
// Translator
// ============================================================================

export class LegislativeTranslator {
  private rateLimiter: RateLimiter;
  private totalCharactersUsed = 0;

  constructor() {
    this.rateLimiter = new RateLimiter(
      env.deeplRateLimit,
      200, // 200ms between calls
    );
  }

  /**
   * Translate a raw legislation act to Romanian
   * Skips translation if text is already in RO (EU acts, RO acts)
   */
  async translate(raw: RawLegislation): Promise<TranslatedLegislation> {
    const countryConfig = COUNTRY_CONFIGS[raw.countryCode as CountryCode];

    // Skip translation for Romanian/EU texts already in RO
    if (!countryConfig.requiresTranslation || raw.languageOriginal === 'ro') {
      console.log(`[translator] Skipping translation for ${raw.sourceId} (already ${raw.languageOriginal})`);
      return {
        ...raw,
        titleRo: raw.titleOriginal,
        textRo: raw.textOriginal,
        translationProvider: 'none',
        deeplCharactersUsed: 0,
        translationCostEur: 0,
        sections: raw.sections?.map((s) => ({
          ...s,
          textRo: s.textOriginal,
        })),
      };
    }

    console.log(`[translator] Translating ${raw.sourceId} from ${raw.languageOriginal} to RO (${raw.textOriginal.length} chars)`);

    const sourceLang = countryConfig.deeplSourceLang;

    // Translate title
    const titleRo = await this.translateText(raw.titleOriginal, sourceLang);

    // Translate full text (with chunking for large texts)
    const textRo = await this.translateLargeText(raw.textOriginal, sourceLang);

    // Translate sections if present
    let translatedSections: TranslatedSection[] | undefined;
    if (raw.sections && raw.sections.length > 0) {
      translatedSections = [];
      for (const section of raw.sections) {
        const sectionTextRo = await this.translateText(section.textOriginal, sourceLang);
        const sectionTitleRo = section.sectionTitle
          ? await this.translateText(section.sectionTitle, sourceLang)
          : undefined;
        
        translatedSections.push({
          ...section,
          textRo: sectionTextRo,
          sectionTitle: sectionTitleRo || section.sectionTitle,
        });
      }
    }

    const totalChars = this.totalCharactersUsed;
    const cost = totalChars * COST_ESTIMATES.deeplPerCharEur;

    console.log(`[translator] Done: ${raw.sourceId} — ${totalChars} chars, €${cost.toFixed(4)}`);

    return {
      ...raw,
      titleRo,
      textRo,
      translationProvider: 'deepl',
      deeplCharactersUsed: totalChars,
      translationCostEur: cost,
      sections: translatedSections,
    };
  }

  /**
   * Translate large text with automatic chunking
   */
  private async translateLargeText(text: string, sourceLang: string): Promise<string> {
    const chunks = splitText(text);

    if (chunks.length === 1) {
      return this.translateText(text, sourceLang);
    }

    console.log(`[translator] Text split into ${chunks.length} chunks`);

    const translatedChunks: Array<{ text: string; chunkIndex: number }> = [];

    for (const chunk of chunks) {
      const translated = await this.translateText(chunk.text, sourceLang);
      translatedChunks.push({ text: translated, chunkIndex: chunk.chunkIndex });
    }

    return reassembleChunks(translatedChunks);
  }

  /**
   * Translate a single text string via DeepL API
   */
  private async translateText(text: string, sourceLang: string): Promise<string> {
    if (!text || text.trim().length === 0) return '';

    if (!env.deeplApiKey) {
      throw new Error('DEEPL_API_KEY not configured');
    }

    return this.rateLimiter.withLimit(async () => {
      return withRetry(async () => {
        const response = await fetch(`${env.deeplApiUrl}/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `DeepL-Auth-Key ${env.deeplApiKey}`,
          },
          body: JSON.stringify({
            text: [text],
            source_lang: sourceLang.toUpperCase(),
            target_lang: 'RO',
            formality: 'more', // Legal texts should be formal
            tag_handling: 'html', // Preserve any residual HTML structure
            split_sentences: 'nonewlines',
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`DeepL API error ${response.status}: ${errorBody}`);
        }

        const data = (await response.json()) as DeepLResponse;

        if (!data.translations || data.translations.length === 0) {
          throw new Error('DeepL returned empty translations array');
        }

        this.totalCharactersUsed += text.length;
        return data.translations[0].text;
      }, 3, 1000, 'deepl-translate');
    });
  }

  /**
   * Get current DeepL usage stats
   */
  async getUsage(): Promise<{ characterCount: number; characterLimit: number }> {
    if (!env.deeplApiKey) {
      throw new Error('DEEPL_API_KEY not configured');
    }

    const response = await fetch(`${env.deeplApiUrl}/usage`, {
      headers: {
        Authorization: `DeepL-Auth-Key ${env.deeplApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`DeepL usage check failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      characterCount: data.character_count || 0,
      characterLimit: data.character_limit || 0,
    };
  }

  /** Reset character counter (call at start of batch) */
  resetCounter(): void {
    this.totalCharactersUsed = 0;
  }

  /** Get characters used in current session */
  getCharactersUsed(): number {
    return this.totalCharactersUsed;
  }
}
