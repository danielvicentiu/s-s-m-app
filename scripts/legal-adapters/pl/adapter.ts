import type { LegalActImport } from '../common/types.js';
import type { BhpActRef } from './bhp-acts.js';

export const SEJM_API_BASE = 'https://api.sejm.gov.pl/eli';
export const ADAPTER_VERSION = 'pl-v1.0';

// --- Sejm API response shape (partial) ---

interface SejmActResponse {
  ELI?: string;
  title?: string;
  publisher?: string;
  year?: number;
  pos?: number | string;
  announcementDate?: string;
  entryIntoForce?: string;
  type?: string;
  status?: string;
  // Additional fields returned by the API
  [key: string]: unknown;
}

// --- Fetch helpers ---

/**
 * Fetch act metadata JSON from Sejm ELI API.
 * Endpoint: GET /acts/{eli}
 * Example: /acts/DU/2023/1465
 */
export async function fetchAct(eli: string): Promise<SejmActResponse> {
  const url = `${SEJM_API_BASE}/acts/${eli}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Sejm API error for ${eli}: HTTP ${res.status} ${res.statusText} (${url})`);
  }

  return res.json() as Promise<SejmActResponse>;
}

/**
 * Fetch act full text HTML from Sejm ELI API.
 * Endpoint: GET /acts/{eli}/text.html
 * Returns null if the endpoint returns 404 or another error.
 */
export async function fetchActHtml(eli: string): Promise<string | null> {
  const url = `${SEJM_API_BASE}/acts/${eli}/text.html`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'text/html' },
    });

    if (!res.ok) {
      console.warn(`  [WARN] No HTML text for ${eli}: HTTP ${res.status}`);
      return null;
    }

    return res.text();
  } catch (err) {
    console.warn(`  [WARN] Failed to fetch HTML for ${eli}:`, err);
    return null;
  }
}

// --- Mapping ---

/**
 * Normalise Sejm API status string to our internal values.
 */
function mapStatus(sejmStatus: string | undefined): string {
  if (!sejmStatus) return 'unknown';
  const s = sejmStatus.toLowerCase();
  if (s.includes('obowiązujący') || s.includes('obowiazujacy') || s.includes('in force')) {
    return 'in_force';
  }
  if (s.includes('zmieniony') || s.includes('amended')) return 'amended';
  if (s.includes('uchylony') || s.includes('repealed')) return 'repealed';
  if (s.includes('projekt') || s.includes('draft')) return 'draft';
  return s;
}

/**
 * Derive a basic English title from the Polish title.
 * For now we prepend "[PL] " as a placeholder; proper translation
 * should happen via a translation API or manual review.
 */
function deriveEnTitle(titlePl: string): string {
  return `[PL] ${titlePl}`;
}

/**
 * Map raw Sejm API response + BHP act ref to our LegalActImport shape.
 */
export function mapToLegalAct(
  raw: SejmActResponse,
  ref: BhpActRef,
  fullText: string | null
): LegalActImport {
  // ELI parts: e.g. "DU/2023/1465"
  const [journal, yearStr, number] = ref.eli.split('/');
  const year = parseInt(yearStr, 10);

  // Build canonical ELI URI used by eli.gov.pl
  // The API may return a full URL or just the path segment — normalise to full URL
  const rawEli = raw.ELI;
  const eliUri =
    rawEli && rawEli.startsWith('http')
      ? rawEli
      : `https://eli.gov.pl/eli/${ref.eli}/ogl`;

  const sourceUrl = `https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU${yearStr}${number.padStart(4, '0')}`;
  const fullTextUrl = `${SEJM_API_BASE}/acts/${ref.eli}/text.html`;

  const titleOriginal =
    raw.title ?? `Akt prawny ${journal}/${yearStr}/${number}`;

  return {
    country: 'PL',
    act_type: raw.type ?? 'ustawa',
    act_type_en: 'act',
    number,
    year,
    title_original: titleOriginal,
    title_en: deriveEnTitle(titleOriginal),
    publication_date: raw.announcementDate ?? `${yearStr}-01-01`,
    entry_into_force: raw.entryIntoForce ?? null,
    source_url: sourceUrl,
    full_text_url: fullTextUrl,
    full_text: fullText,
    domains: ref.domains,
    status: mapStatus(raw.status),
    eli_uri: eliUri,
    keywords: ref.keywords,
    imported_at: new Date().toISOString(),
    adapter_version: ADAPTER_VERSION,
  };
}
