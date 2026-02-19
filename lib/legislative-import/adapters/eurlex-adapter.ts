// lib/legislative-import/adapters/eurlex-adapter.ts
// EUR-Lex adapter v3 — Direct HTML fetch, CELEX type fix, title fix
import { BaseAdapter } from './base-adapter';
import { EURLEX_PRIORITY_ACTS } from '../config';
import { hashContent, extractSections } from '../utils/text-splitter';
import { withRetry } from '../utils/rate-limiter';
import type { RawLegislation, SearchParams, UpdateCheckResult, RawSection } from '../types';

export class EurLexAdapter extends BaseAdapter {
  readonly adapterType = 'eurlex' as const;
  readonly countryCode = 'EU' as const;

  constructor() {
    super(2, 1000);
  }

  async fetchAct(celex: string): Promise<RawLegislation> {
    this.log(`Fetching: ${celex}`);

    let textOriginal = '';
    let languageOriginal = 'ro';
    let htmlRaw = '';

    try {
      htmlRaw = await this.fetchHtml(celex, 'RO');
      textOriginal = this.cleanHtml(htmlRaw);
    } catch (err) {
      this.warn(`No RO HTML for ${celex}, trying EN`);
    }

    if (!textOriginal || textOriginal.trim().length < 100) {
      htmlRaw = await this.fetchHtml(celex, 'EN');
      textOriginal = this.cleanHtml(htmlRaw);
      languageOriginal = 'en';
    }

    if (!textOriginal || textOriginal.trim().length < 100) {
      throw new Error(`No text found for ${celex} in RO or EN`);
    }

    const title = this.extractTitleFromHtml(htmlRaw, celex);

    const sections = extractSections(textOriginal, 'EU').map((s, i): RawSection => ({
      sectionNumber: s.sectionNumber,
      sectionTitle: s.sectionTitle,
      textOriginal: s.text,
      sortOrder: i,
    }));

    const priorityInfo = EURLEX_PRIORITY_ACTS.find(a => a.celex === celex);
    const actType = this.mapCelexToActType(celex);
    const actNumber = this.formatActNumber(celex);
    const actYear = this.extractYear(celex);

    const result: RawLegislation = {
      sourceId: celex,
      sourceUrl: `https://eur-lex.europa.eu/legal-content/RO/TXT/HTML/?uri=CELEX:${celex}`,
      titleOriginal: priorityInfo?.title || title,
      actType,
      actNumber,
      dateAdopted: undefined,
      dateInForce: undefined,
      inForce: true,
      textOriginal,
      languageOriginal,
      countryCode: 'EU',
      contentHash: hashContent(textOriginal),
      sections,
      metadata: {
        celex,
        actYear,
        actShortName: priorityInfo?.title?.split(' — ')[0] || `${actType} ${actNumber}`,
        actFullName: priorityInfo?.title || title,
      },
    };

    this.log(`Done: ${celex} — ${textOriginal.length} chars, ${sections.length} sections`);
    return result;
  }

  async searchActs(_params: SearchParams): Promise<RawLegislation[]> {
    this.log('EUR-Lex search: using priority acts list');
    const acts: RawLegislation[] = [];
    const ids = await this.getPriorityActs();
    for (const celex of ids.slice(0, _params.limit || 5)) {
      try { acts.push(await this.fetchAct(celex)); } catch (err) { this.warn(`Failed: ${celex}`, { error: String(err) }); }
    }
    return acts;
  }

  async checkForUpdates(sourceId: string, lastHash: string): Promise<UpdateCheckResult> {
    try {
      const html = await this.fetchHtml(sourceId, 'RO');
      const text = this.cleanHtml(html);
      const newHash = hashContent(text);
      return { sourceId, hasChanged: newHash !== lastHash, newHash };
    } catch { return { sourceId, hasChanged: false }; }
  }

  async getPriorityActs(): Promise<string[]> {
    return EURLEX_PRIORITY_ACTS.map(a => a.celex);
  }

  // --- Direct HTML fetch ---

  private async fetchHtml(celex: string, lang: string): Promise<string> {
    const url = `https://eur-lex.europa.eu/legal-content/${lang}/TXT/HTML/?uri=CELEX:${celex}`;
    return withRetry(async () => {
      const response = await this.fetchWithLimit(url, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': `${lang.toLowerCase()},en;q=0.9`,
          'User-Agent': 'Mozilla/5.0 (compatible; SSM-RO-Bot/1.0; legislative-import)',
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
      return response.text();
    }, 3, 2000, `html:${celex}:${lang}`);
  }

  private extractTitleFromHtml(html: string, celex: string): string {
    // Priority 1: use known title from config (most reliable)
    const priorityInfo = EURLEX_PRIORITY_ACTS.find(a => a.celex === celex);
    if (priorityInfo?.title) return priorityInfo.title;

    // Priority 2: EUR-Lex specific HTML patterns
    const patterns = [
      /<p[^>]*class="[^"]*oj-doc-ti[^"]*"[^>]*>([\s\S]*?)<\/p>/i,
      /<p[^>]*class="[^"]*ti-doc[^"]*"[^>]*>([\s\S]*?)<\/p>/i,
      /<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<p[^>]*class="[^"]*doc-ti[^"]*"[^>]*>([\s\S]*?)<\/p>/i,
    ];
    for (const pat of patterns) {
      const match = html.match(pat);
      if (match && match[1]) {
        const title = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (title.length > 20 && !title.includes('.xml')) return title;
      }
    }

    // Priority 3: extract from first lines of cleaned text
    const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,5000})/i);
    if (bodyMatch) {
      const firstText = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const dirMatch = firstText.match(/(Directiva|Regulamentul|Decizia|Council Directive|Regulation)[^.]{10,200}/i);
      if (dirMatch) return dirMatch[0].trim();
    }

    return `EUR-Lex ${celex}`;
  }

  private cleanHtml(html: string): string {
    let t = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    const contentPatterns = [
      /<div[^>]*id="TexteOnly"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
      /<div[^>]*id="docContent"[^>]*>([\s\S]*?)<\/div>\s*$/im,
      /<div[^>]*class="[^"]*eli-main-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<body[^>]*>([\s\S]*?)<\/body>/i,
    ];
    for (const pat of contentPatterns) {
      const match = t.match(pat);
      if (match && match[1] && match[1].length > 500) {
        t = match[1];
        break;
      }
    }

    return t
      .replace(/<\/?(p|div|br|h[1-6]|li|tr|table|tbody|thead)[^>]*>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n• ')
      .replace(/<td[^>]*>/gi, ' | ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c)))
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  // --- Helpers ---

  private formatActNumber(celex: string): string {
    const m = celex.match(/^3(\d{4})([A-Z])(\d{4})$/);
    if (!m) return celex;
    const suffix = parseInt(m[1]) < 1993 ? 'CEE' : parseInt(m[1]) < 2009 ? 'CE' : 'UE';
    return `${m[1].slice(2)}/${parseInt(m[3])}/${suffix}`;
  }

  private mapCelexToActType(celex: string): string {
    // CELEX format: 3[year][type][number] e.g. 31989L0391
    // Sector digit 3 + 4 year digits + type letter
    const t = celex.match(/^3\d{4}([A-Z])/)?.[1];
    return ({ L: 'DIRECTIVA', R: 'REGULAMENT', D: 'DECIZIE' } as Record<string, string>)[t || ''] || 'ACT_UE';
  }

  private extractYear(celex: string): number {
    return parseInt(celex.match(/^3(\d{4})/)?.[1] || '0');
  }
}
