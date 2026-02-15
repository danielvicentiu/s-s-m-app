// lib/legislative-import/utils/text-splitter.ts
// Splits long legal texts into chunks for DeepL API (max 128KB per request)

import { createHash } from 'crypto';

const DEEPL_MAX_CHARS = 50_000; // Conservative limit per request (DeepL allows 128KB)

export interface TextChunk {
  text: string;
  startIndex: number;
  endIndex: number;
  chunkIndex: number;
}

/**
 * Split text into chunks at natural boundaries (paragraphs, articles)
 * Preserves legal structure — never splits mid-article
 */
export function splitText(text: string, maxChars: number = DEEPL_MAX_CHARS): TextChunk[] {
  if (text.length <= maxChars) {
    return [{ text, startIndex: 0, endIndex: text.length, chunkIndex: 0 }];
  }

  const chunks: TextChunk[] = [];
  let currentStart = 0;
  let chunkIndex = 0;

  while (currentStart < text.length) {
    let endIndex = Math.min(currentStart + maxChars, text.length);

    // If not at end, find a good split point
    if (endIndex < text.length) {
      // Try to split at article/section boundaries first
      const articleBoundary = findLastBoundary(text, currentStart, endIndex, [
        /\n\s*Art\.\s*\d/g,
        /\n\s*Чл\.\s*\d/g,           // BG: Член
        /\n\s*§\s*\d/g,              // DE/HU
        /\n\s*Capitolul\s/gi,
        /\n\s*Глава\s/gi,            // BG: Глава (chapter)
        /\n\s*SECȚIUNEA\s/gi,
      ]);

      if (articleBoundary > currentStart) {
        endIndex = articleBoundary;
      } else {
        // Fallback: split at paragraph boundary
        const paragraphEnd = text.lastIndexOf('\n\n', endIndex);
        if (paragraphEnd > currentStart) {
          endIndex = paragraphEnd;
        } else {
          // Last resort: split at sentence boundary
          const sentenceEnd = text.lastIndexOf('. ', endIndex);
          if (sentenceEnd > currentStart) {
            endIndex = sentenceEnd + 1;
          }
        }
      }
    }

    chunks.push({
      text: text.slice(currentStart, endIndex).trim(),
      startIndex: currentStart,
      endIndex,
      chunkIndex: chunkIndex++,
    });

    currentStart = endIndex;
  }

  return chunks;
}

function findLastBoundary(
  text: string,
  start: number,
  end: number,
  patterns: RegExp[],
): number {
  let bestPos = -1;

  for (const pattern of patterns) {
    const searchRegion = text.slice(start, end);
    let match: RegExpExecArray | null;
    const re = new RegExp(pattern.source, pattern.flags);

    while ((match = re.exec(searchRegion)) !== null) {
      const absPos = start + match.index;
      if (absPos > bestPos && absPos > start + 1000) {
        // At least 1000 chars in chunk
        bestPos = absPos;
      }
    }
  }

  return bestPos;
}

/**
 * Reassemble translated chunks back into full text
 */
export function reassembleChunks(chunks: { text: string; chunkIndex: number }[]): string {
  return chunks
    .sort((a, b) => a.chunkIndex - b.chunkIndex)
    .map((c) => c.text)
    .join('\n\n');
}

/**
 * Generate SHA-256 hash of text content (for change detection)
 */
export function hashContent(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Extract sections from legal text (generic, works for most EU languages)
 */
export function extractSections(text: string, countryCode: string): Array<{
  sectionNumber: string;
  sectionTitle: string;
  text: string;
  sortOrder: number;
}> {
  // Patterns per country
  const patterns: Record<string, RegExp> = {
    EU: /(?:^|\n)(Articolul?\s+\d+[a-z]?(?:\s*\([^)]+\))?)\s*\n(.*?)(?=\nArticolul?\s+\d|$)/gs,
    RO: /(?:^|\n)(Art(?:icolul)?\.\s*\d+[a-z]?(?:\^?\d+)?)\s*[-—]?\s*(.*?)(?=\nArt(?:icolul)?\.\s*\d|$)/gs,
    BG: /(?:^|\n)(Чл\.\s*\d+[а-я]?\.?)\s*(.*?)(?=\nЧл\.\s*\d|$)/gs,
    HU: /(?:^|\n)(\d+\.\s*§)\s*(.*?)(?=\n\d+\.\s*§|$)/gs,
    DE: /(?:^|\n)(§\s*\d+[a-z]?)\s*(.*?)(?=\n§\s*\d|$)/gs,
    PL: /(?:^|\n)(Art\.\s*\d+[a-z]?\.?)\s*(.*?)(?=\nArt\.\s*\d|$)/gs,
  };

  const pattern = patterns[countryCode] || patterns.EU;
  const sections: Array<{
    sectionNumber: string;
    sectionTitle: string;
    text: string;
    sortOrder: number;
  }> = [];

  let match: RegExpExecArray | null;
  let order = 0;

  while ((match = pattern.exec(text)) !== null) {
    const fullMatch = match[0].trim();
    const sectionNumber = match[1].trim();
    const rest = match[2]?.trim() || '';

    // Try to extract title from first line
    const lines = rest.split('\n');
    const sectionTitle = lines[0]?.length < 200 ? lines[0].trim() : '';
    const sectionText = sectionTitle ? lines.slice(1).join('\n').trim() : rest;

    sections.push({
      sectionNumber,
      sectionTitle,
      text: sectionText || fullMatch,
      sortOrder: order++,
    });
  }

  return sections;
}
