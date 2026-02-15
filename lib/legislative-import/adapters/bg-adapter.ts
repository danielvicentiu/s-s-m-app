// lib/legislative-import/adapters/bg-adapter.ts
// Bulgaria lex.bg scraping adapter → scrie în legal_acts

import { BaseAdapter } from './base-adapter';
import { BG_LEX_CONFIG } from '../config';
import { hashContent, extractSections } from '../utils/text-splitter';
import { withRetry } from '../utils/rate-limiter';
import type { RawLegislation, SearchParams, UpdateCheckResult, RawSection } from '../types';

type CheerioAPI = typeof import('cheerio');

export class BgLexAdapter extends BaseAdapter {
  readonly adapterType = 'bg_lex' as const;
  readonly countryCode = 'BG' as const;
  private cheerio: CheerioAPI | null = null;

  constructor() {
    super(1, 2000); // polite: 1 concurrent, 2s delay
  }

  private async getCheerio(): Promise<CheerioAPI> {
    if (!this.cheerio) this.cheerio = await import('cheerio');
    return this.cheerio;
  }

  async fetchAct(sourceId: string): Promise<RawLegislation> {
    this.log(`Fetching BG act: ${sourceId}`);
    const url = `${BG_LEX_CONFIG.baseUrl}/laws/ldoc/${sourceId}`;

    const html = await withRetry(async () => {
      const response = await this.fetchWithLimit(url, {
        headers: { 'User-Agent': BG_LEX_CONFIG.userAgent, Accept: 'text/html', 'Accept-Language': 'bg,en;q=0.9' },
      });
      return response.text();
    }, 3, 3000, `fetchBG:${sourceId}`);

    const cheerio = await this.getCheerio();
    const $ = cheerio.load(html);

    const title = this.extractTitle($);
    const { actType, actNumber } = this.detectActInfo(title, sourceId);
    const { dateAdopted, dateLastAmended } = this.extractDates($);
    const textOriginal = this.extractFullText($);

    if (!textOriginal || textOriginal.trim().length < 50) {
      throw new Error(`No text for BG act ${sourceId}`);
    }

    const sections = extractSections(textOriginal, 'BG').map((s, i): RawSection => ({
      sectionNumber: s.sectionNumber,
      sectionTitle: s.sectionTitle,
      textOriginal: s.text,
      sortOrder: i,
    }));

    return {
      sourceId,
      sourceUrl: url,
      titleOriginal: title,
      actType,
      actNumber,
      dateAdopted,
      dateLastAmended,
      inForce: true,
      textOriginal,
      languageOriginal: 'bg',
      countryCode: 'BG',
      contentHash: hashContent(textOriginal),
      sections,
      metadata: {
        lexBgId: sourceId,
        scrapedAt: new Date().toISOString(),
        actShortName: actNumber,
        actFullName: title,
      },
    };
  }

  async searchActs(params: SearchParams): Promise<RawLegislation[]> {
    this.log('BG: using priority list (no search API)');
    const ids = await this.getPriorityActs();
    const acts: RawLegislation[] = [];
    for (const id of ids.slice(0, params.limit || 10)) {
      try { acts.push(await this.fetchAct(id)); } catch (err) { this.warn(`Failed BG ${id}`, { error: String(err) }); }
    }
    return acts;
  }

  async checkForUpdates(sourceId: string, lastHash: string): Promise<UpdateCheckResult> {
    try {
      const act = await this.fetchAct(sourceId);
      return { sourceId, hasChanged: act.contentHash !== lastHash, newHash: act.contentHash };
    } catch { return { sourceId, hasChanged: false }; }
  }

  async getPriorityActs(): Promise<string[]> {
    return BG_LEX_CONFIG.priorityActs.map((a) => a.id);
  }

  // --- HTML Parsing ---

  private extractTitle($: ReturnType<CheerioAPI['load']>): string {
    return ($('h1.DocumentTitle').first().text().trim() ||
      $('h1').first().text().trim() ||
      $('.law-title').first().text().trim() ||
      $('title').text().trim()).replace(/\s+/g, ' ').trim();
  }

  private detectActInfo(title: string, sourceId: string): { actType: string; actNumber: string } {
    const priority = BG_LEX_CONFIG.priorityActs.find((a) => a.id === sourceId);
    if (priority) return { actType: title.includes('Кодекс') ? 'КОДЕКС' : title.includes('Закон') ? 'ЗАКОН' : 'НАРЕДБА', actNumber: priority.actNumber };

    const lower = title.toLowerCase();
    if (lower.includes('кодекс')) return { actType: 'КОДЕКС', actNumber: title.substring(0, 30) };
    if (lower.includes('закон')) return { actType: 'ЗАКОН', actNumber: title.substring(0, 30) };
    if (lower.includes('наредба')) {
      const num = title.match(/наредба\s*№?\s*(\d+)/i);
      return { actType: 'НАРЕДБА', actNumber: num ? `Наредба ${num[1]}` : title.substring(0, 30) };
    }
    return { actType: 'ЗАКОН', actNumber: title.substring(0, 30) };
  }

  private extractDates($: ReturnType<CheerioAPI['load']>): { dateAdopted?: string; dateLastAmended?: string } {
    const meta = $('.DocumentInfo, .law-info, .doc-info').text();
    const adopted = meta.match(/обн\.\s*ДВ[^,]*бр\.\s*\d+\s*от\s*(\d{1,2}\.\d{1,2}\.\d{4})/);
    const amended = meta.match(/изм\.\s*(?:и допълн?\.\s*)?ДВ[^,]*бр\.\s*\d+\s*от\s*(\d{1,2}\.\d{1,2}\.\d{4})/g);

    const parseBg = (d: string) => { const p = d.split('.'); return p.length === 3 ? `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}` : d; };

    return {
      dateAdopted: adopted ? parseBg(adopted[1]) : undefined,
      dateLastAmended: amended?.length ? (() => { const m = amended[amended.length-1].match(/(\d{1,2}\.\d{1,2}\.\d{4})/); return m ? parseBg(m[1]) : undefined; })() : undefined,
    };
  }

  private extractFullText($: ReturnType<CheerioAPI['load']>): string {
    const selectors = ['.DocumentText', '#DocumentText', '.law-content', '.document-content', 'article'];
    let container = null;
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length > 0 && el.text().trim().length > 100) { container = el; break; }
    }
    if (!container) container = $('body');

    const clone = container.clone();
    clone.find('nav, header, footer, .sidebar, script, style, .ads').remove();

    let text = clone.text();
    return text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  }
}
