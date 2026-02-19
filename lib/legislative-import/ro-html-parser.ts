// ============================================================
// lib/legislative-import/ro-html-parser.ts  (v2 — REAL selectors)
// Parser HTML pentru legislatie.just.ro/Public/DetaliiDocument/
// Based on actual HTML structure analyzed from Legea 319/2006
// ============================================================

import crypto from 'crypto';

// ─── Types ───────────────────────────────────────────────────

export interface ParsedSection {
  orderIndex: number;
  sectionType: 'title' | 'chapter' | 'section' | 'article' | 'paragraph' | 'annex' | 'note';
  sectionNumber: string;
  title: string;
  content: string;
}

export interface ParsedLegalAct {
  title: string;
  fullText: string;
  sections: ParsedSection[];
  contentHash: string;
  portalActId?: string;   // hidden input id_act value
  emitent?: string;
  publicatIn?: string;
}

// ─── Main: Fetch & Parse ─────────────────────────────────────

export async function fetchAndParseAct(portalUrl: string): Promise<ParsedLegalAct> {
  const response = await fetch(portalUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  return parseActHtml(html);
}

// ─── Parse HTML ──────────────────────────────────────────────

export function parseActHtml(html: string): ParsedLegalAct {
  // 1. Extract portal act ID from hidden input
  const actIdMatch = html.match(/<input[^>]*id="id_act"[^>]*value="(\d+)"/i);
  const portalActId = actIdMatch?.[1];

  // 2. Extract title from S_DEN + S_HDR spans
  const denMatch = html.match(/<span\s+class="S_DEN">([\s\S]*?)<\/span>/i);
  const hdrMatch = html.match(/<span\s+class="S_HDR">([\s\S]*?)<\/span>/i);
  const title = stripHtml(
    (denMatch?.[1] || '') + ' ' + (hdrMatch?.[1] || '')
  ).replace(/\s+/g, ' ').trim();

  // 3. Extract emitent
  const emtMatch = html.match(/<span\s+class="S_EMT_BDY">([\s\S]*?)<\/span>/i);
  const emitent = emtMatch ? stripHtml(emtMatch[1]).trim() : undefined;

  // 4. Extract publication info
  const pubMatch = html.match(/<span\s+class="S_PUB_BDY">([\s\S]*?)<\/span>/i);
  const publicatIn = pubMatch ? stripHtml(pubMatch[1]).trim() : undefined;

  // 5. Extract main content from the consolidated form div
  //    Real selector: div#div_Formaconsolidata.content_forma_act
  //    Fallback: div#infoactinfoact
  let contentHtml = '';
  
  const consolidataMatch = html.match(
    /<div\s+id="div_Formaconsolidata"[^>]*class="content_forma_act"[^>]*>([\s\S]*?)<\/div>\s*<div\s+id="div_Forme/i
  );
  
  if (consolidataMatch) {
    contentHtml = consolidataMatch[1];
  } else {
    // Fallback: try the broader content area
    const infoactMatch = html.match(
      /<div[^>]*id="infoactinfoact"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i
    );
    if (infoactMatch) {
      contentHtml = infoactMatch[1];
    } else {
      // Last resort: everything between document_info and footer
      const docInfoMatch = html.match(
        /<div[^>]*id="document_info"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i
      );
      contentHtml = docInfoMatch?.[1] || html;
    }
  }

  // 6. Remove scripts, styles, comments, hidden elements
  let clean = contentHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove collapsed indicators (+ marks)
    .replace(/<span\s+class="TAG_COLLAPSED"[\s\S]*?<\/span>/gi, '')
    // Remove short/collapsed text
    .replace(/<span[^>]*class="S_\w+_SHORT"[^>]*>[\s\S]*?<\/span>/gi, '');

  // 7. Convert to structured text
  const fullText = htmlToStructuredText(clean);

  // 8. Extract sections using CSS class-based parsing
  const sections = extractSectionsFromHtml(clean);

  // 9. Compute hash
  const contentHash = computeHash(fullText);

  return {
    title: title || 'Unknown',
    fullText,
    sections,
    contentHash,
    portalActId,
    emitent,
    publicatIn,
  };
}

// ─── HTML → Structured Text ─────────────────────────────────

function htmlToStructuredText(html: string): string {
  return html
    // S_CAP_TTL, S_SEC_TTL, S_ART_TTL → prefix with newlines for structure
    .replace(/<span\s+class="S_CAP_TTL"[^>]*>([\s\S]*?)<\/span>/gi, '\n\n=== $1 ===\n')
    .replace(/<span\s+class="S_SEC_TTL"[^>]*>([\s\S]*?)<\/span>/gi, '\n\n--- $1 ---\n')
    .replace(/<span\s+class="S_ART_TTL"[^>]*>([\s\S]*?)<\/span>/gi, '\n\n$1\n')
    .replace(/<span\s+class="S_ALN_TTL"[^>]*>([\s\S]*?)<\/span>/gi, '\n$1 ')
    .replace(/<span\s+class="S_LIT_TTL"[^>]*>([\s\S]*?)<\/span>/gi, '\n  $1 ')
    // Preserve paragraph breaks
    .replace(/<span\s+class="S_PAR"[^>]*>/gi, '\n')
    // Standard HTML → text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&[a-zA-Z]+;/g, ' ')
    // Clean whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/\n /g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Extract Sections from HTML using real CSS classes ────────

function extractSectionsFromHtml(html: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let orderIndex = 0;

  let match;

  // Simpler approach: extract by class patterns
  // Chapters
  const capTtlRegex = /<span\s+class="S_CAP_TTL"[^>]*>(.*?)<\/span>/gi;
  while ((match = capTtlRegex.exec(html)) !== null) {
    const capTitle = stripHtml(match[1]).trim();
    const capNumMatch = capTitle.match(/(?:Capitolul|Capitol)\s+([\w]+)/i);
    sections.push({
      orderIndex: orderIndex++,
      sectionType: 'chapter',
      sectionNumber: capNumMatch?.[1] || String(orderIndex),
      title: capTitle,
      content: '', // Chapter title only; content is in sub-sections
    });
  }

  // Sections (Secțiuni)
  const secTtlRegex = /<span\s+class="S_SEC_TTL"[^>]*>(.*?)<\/span>/gi;
  while ((match = secTtlRegex.exec(html)) !== null) {
    const secTitle = stripHtml(match[1]).trim();
    const secNumMatch = secTitle.match(/Sec[țt]iunea\s+(?:a\s+)?(\d+|[\w]+)/i);
    sections.push({
      orderIndex: orderIndex++,
      sectionType: 'section',
      sectionNumber: secNumMatch?.[1] || String(orderIndex),
      title: secTitle,
      content: '',
    });
  }

  // Simpler: match article titles and their body content
  const artTtlRegex = /<span\s+class="S_ART_TTL"[^>]*id="id_artA(\d+)_ttl"[^>]*>(.*?)<\/span>/gi;
  while ((match = artTtlRegex.exec(html)) !== null) {
    const artId = match[1];
    const artTitle = stripHtml(match[2]).trim();
    const artNumMatch = artTitle.match(/Art(?:icolul)?\s*\.?\s*(\d+(?:\^\d+)?)/i);
    
    // Find corresponding body
    const bodyRegex = new RegExp(
      `<span\\s+class="S_ART_BDY"\\s+id="id_artA${artId}_bdy">([\\s\\S]*?)(?=<\\/span>\\s*<\\/span>)`,
      'i'
    );
    const bodyMatch = html.match(bodyRegex);
    const bodyText = bodyMatch ? stripHtml(bodyMatch[1]).trim() : '';

    sections.push({
      orderIndex: orderIndex++,
      sectionType: 'article',
      sectionNumber: artNumMatch?.[1] || artId,
      title: artTitle,
      content: bodyText.substring(0, 5000), // Limit per article
    });
  }

  // Notes (S_NTA)
  const ntaRegex = /<span\s+class="S_NTA_PAR"[^>]*>([\s\S]*?)<\/span>/gi;
  while ((match = ntaRegex.exec(html)) !== null) {
    sections.push({
      orderIndex: orderIndex++,
      sectionType: 'note',
      sectionNumber: String(orderIndex),
      title: 'Notă',
      content: stripHtml(match[1]).trim().substring(0, 2000),
    });
  }

  return sections;
}

// ─── Utilities ───────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

export function computeHash(text: string): string {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

