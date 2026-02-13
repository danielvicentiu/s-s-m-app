// M2 LEGISLATION PARSER SERVICE
// Parses legislative HTML into structured articles with obligation detection

import type { CountryCode } from '@/lib/types'

// ══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ══════════════════════════════════════════════════════════════

export interface Article {
  id: string                  // e.g., "ART_5"
  number: string              // e.g., "5", "5^1", "5a"
  title?: string              // Optional article title
  content: string             // Full article text
  hasObligations: boolean     // True if contains obligation keywords
}

export interface LegislationParsed {
  articles: Article[]
  metadata: {
    country: CountryCode
    language: string
    parsedAt: string
    totalArticles: number
    articlesWithObligations: number
  }
}

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════

/**
 * Keywords that indicate an article contains obligations
 * Romanian legislative language patterns
 */
const OBLIGATION_KEYWORDS = [
  // Obligation verbs
  'obligația', 'obligatoriu', 'obligat', 'obligă',
  'trebuie să', 'are datoria', 'este dator',

  // Action verbs (often used in obligations)
  'asigură', 'răspunde', 'efectuează', 'verifică',
  'realizează', 'îndeplinește', 'aplică', 'respectă',
  'comunică', 'notifică', 'informează', 'raportează',
  'organizează', 'desemnează', 'stabilește',

  // Penalty/sanction indicators (imply obligations)
  'sancțiune', 'amendă', 'contravenție',
  'răspundere', 'culpă',

  // Prohibition (negative obligations)
  'interzice', 'nu este permis', 'nu are voie',

  // Requirements
  'necesar', 'cerință', 'condiție',
  'prevăzut', 'stabilit'
]

/**
 * Article detection patterns for different countries
 * Romanian: Art. 5, Articolul 10, Art. 15^1, Art. 20a
 * Note: Using [\s\S] instead of . with 's' flag for ES5 compatibility
 */
const ARTICLE_PATTERNS: Record<CountryCode, RegExp> = {
  RO: /(?:^|\n)\s*(?:Art(?:icolul|\.)?\s*(\d+(?:[a-z]|\^\d+)?)[.\s])([\s\S]*?)(?=\n\s*Art(?:icolul|\.)?\s*\d+|$)/gi,
  BG: /(?:^|\n)\s*(?:Член|чл\.|Чл\.)\s*(\d+(?:[а-я])?)[.\s]([\s\S]*?)(?=\n\s*(?:Член|чл\.|Чл\.)\s*\d+|$)/gi,
  HU: /(?:^|\n)\s*(\d+)\.\s*§([\s\S]*?)(?=\n\s*\d+\.\s*§|$)/gi,
  DE: /(?:^|\n)\s*(?:Artikel|Art\.)\s*(\d+[a-z]?)[.\s]([\s\S]*?)(?=\n\s*(?:Artikel|Art\.)\s*\d+|$)/gi,
  PL: /(?:^|\n)\s*(?:Art\.|Artykuł)\s*(\d+[a-z]?)[.\s]([\s\S]*?)(?=\n\s*(?:Art\.|Artykuł)\s*\d+|$)/gi
}

// ══════════════════════════════════════════════════════════════
// MAIN PARSER FUNCTION
// ══════════════════════════════════════════════════════════════

/**
 * Parse legislative HTML into structured articles
 *
 * @param rawHtml - Raw HTML from legislation website
 * @param actTitle - Title of the legislative act (for logging)
 * @param country - Country code for language-specific parsing
 * @returns Parsed legislation with articles and metadata
 */
export async function parseLegislation(
  rawHtml: string,
  actTitle: string,
  country: CountryCode = 'RO'
): Promise<LegislationParsed> {
  console.log(`[M2 Parser] Parsing legislation: ${actTitle} (${country})`)

  // Step 1: Clean HTML to plain text
  const cleanText = cleanHtmlToText(rawHtml)

  if (cleanText.length < 500) {
    throw new Error('Extracted text too short (< 500 chars). HTML structure may be invalid.')
  }

  console.log(`[M2 Parser] Cleaned text: ${cleanText.length} characters`)

  // Step 2: Extract articles
  const articles = extractArticles(cleanText, country)

  if (articles.length === 0) {
    throw new Error('No articles found. Text may not be in expected legislative format.')
  }

  console.log(`[M2 Parser] Extracted ${articles.length} articles`)

  // Step 3: Detect obligations in each article
  const articlesWithObligations = articles.filter(art => art.hasObligations).length

  console.log(`[M2 Parser] Found ${articlesWithObligations} articles with obligations`)

  // Step 4: Build metadata
  const metadata = {
    country,
    language: getLanguageFromCountry(country),
    parsedAt: new Date().toISOString(),
    totalArticles: articles.length,
    articlesWithObligations
  }

  return {
    articles,
    metadata
  }
}

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Clean HTML to plain text
 * Removes scripts, styles, navigation, and converts to readable text
 */
function cleanHtmlToText(html: string): string {
  let text = html

  // Step 1: Extract main content area (skip headers, navigation)
  // legislatie.just.ro uses these containers
  const contentPatterns = [
    /<div[^>]*id="textActAct"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="act-content"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="document-content"[^>]*>([\s\S]*?)<\/div>/i,
    /<pre[^>]*>([\s\S]*?)<\/pre>/i,
  ]

  for (const pattern of contentPatterns) {
    const match = html.match(pattern)
    if (match && match[1] && match[1].length > 500) {
      text = match[1]
      break
    }
  }

  // Fallback: extract from body if no content div found
  if (text === html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      text = bodyMatch[1]
    }
  }

  // Step 2: Convert HTML tags to text
  text = text
    // Remove scripts and styles completely
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

    // Replace block elements with newlines
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')

    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')

    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))

    // Clean up whitespace
    .replace(/\t+/g, ' ')           // Tabs to spaces
    .replace(/ +/g, ' ')            // Multiple spaces to single
    .replace(/\n\s+\n/g, '\n\n')    // Clean empty lines
    .replace(/\n{3,}/g, '\n\n')     // Max 2 consecutive newlines
    .trim()

  return text
}

/**
 * Extract individual articles from cleaned text
 */
function extractArticles(text: string, country: CountryCode): Article[] {
  const articles: Article[] = []
  const pattern = ARTICLE_PATTERNS[country]

  // Reset regex state
  pattern.lastIndex = 0

  let match
  while ((match = pattern.exec(text)) !== null) {
    const articleNumber = match[1].trim()
    const articleContent = match[2].trim()

    // Skip empty articles
    if (articleContent.length < 10) {
      continue
    }

    // Extract title if present (first line in bold/uppercase)
    let title: string | undefined
    let content = articleContent

    const titleMatch = articleContent.match(/^([A-ZĂÂÎȘȚ][A-ZĂÂÎȘȚ\s]{3,50})\n/)
    if (titleMatch) {
      title = titleMatch[1].trim()
      content = articleContent.substring(titleMatch[0].length).trim()
    }

    // Detect if article contains obligations
    const hasObligations = detectObligations(content)

    articles.push({
      id: `ART_${articleNumber.replace(/[^0-9a-z]/gi, '_')}`,
      number: articleNumber,
      title,
      content,
      hasObligations
    })
  }

  return articles
}

/**
 * Detect if text contains obligation-related keywords
 */
function detectObligations(text: string): boolean {
  const lowerText = text.toLowerCase()

  return OBLIGATION_KEYWORDS.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  )
}

/**
 * Get language code from country code
 */
function getLanguageFromCountry(country: CountryCode): string {
  const languageMap: Record<CountryCode, string> = {
    RO: 'ro',
    BG: 'bg',
    HU: 'hu',
    DE: 'de',
    PL: 'pl'
  }

  return languageMap[country] || 'ro'
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default parseLegislation
