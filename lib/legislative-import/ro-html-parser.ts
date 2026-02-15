// ============================================================
// lib/legislative-import/ro-html-parser.ts
// Parser HTML pentru legislatie.just.ro/Public/DetaliiDocument/
// Extrage full-text structurat din portal
// ============================================================

import crypto from 'crypto';

export interface ParsedSection {
  orderIndex: number;
  sectionType: string;
  sectionNumber: string;
  title: string;
  content: string;
}

export interface ParsedLegalAct {
  title: string;
  fullText: string;
  sections: ParsedSection[];
  contentHash: string;
}

// ─── Main: Fetch & Parse ─────────────────────────────────────

export async function fetchAndParseAct(portalUrl: string): Promise<ParsedLegalAct> {
  const response = await fetch(portalUrl, {
    headers: {
      'User-Agent': 'SSM-RO-Legislative-Monitor/1.0 (compliance platform)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'ro,en;q=0.5',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch act from portal: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  return parseActHtml(html);
}

// ─── Parse HTML ──────────────────────────────────────────────

function parseActHtml(html: string): ParsedLegalAct {
  // Remove scripts, styles, comments
  let clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Try to extract main content area
  const contentMatch =
    clean.match(/<div[^>]*class="[^"]*(?:document-content|act-content|detalii-document)[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>|<div[^>]*class="[^"]*footer)/i) ||
    clean.match(/<div[^>]*id="TextAct[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
    clean.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);

  const contentHtml = contentMatch?.[1] || clean;

  // Extract title
  const titleMatch =
    contentHtml.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i) ||
    html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = stripHtml(titleMatch?.[1] || 'Unknown');

  // Convert to structured text
  const fullText = htmlToText(contentHtml);

  // Extract sections
  const sections = extractSections(fullText);

  // Hash
  const contentHash = computeHash(fullText);

  return { title, fullText, sections, contentHash };
}

// ─── HTML → Text ─────────────────────────────────────────────

function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Extract Sections ────────────────────────────────────────

function extractSections(text: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let orderIndex = 0;

  const patterns: Array<{ type: string; regex: RegExp }> = [
    { type: 'title', regex: /^.*TITLUL\s+([\w^]+)\s*[-–]?\s*(.*)/i },
    { type: 'chapter', regex: /^.*CAPITOLUL\s+([\w^]+)\s*[-–]?\s*(.*)/i },
    { type: 'section', regex: /^.*SEC[ȚT]IUNEA\s+(?:a\s+)?(\d+)[-–]?a?\s*(.*)/i },
    { type: 'article', regex: /^.*Art(?:icolul)?\.?\s*(\d+(?:\^?\d+)?)\s*[-–]?\s*(.*)/i },
    { type: 'annex', regex: /^.*ANEX[AĂ]\s*([\w\d]*)\s*[-–]?\s*(.*)/i },
  ];

  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    for (const { type, regex } of patterns) {
      const match = trimmed.match(regex);
      if (match) {
        sections.push({
          orderIndex: orderIndex++,
          sectionType: type,
          sectionNumber: (match[1] || '').trim(),
          title: (match[2] || '').trim(),
          content: trimmed,
        });
        break;
      }
    }
  }

  return sections;
}

// ─── Helpers ─────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export function computeHash(text: string): string {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}
