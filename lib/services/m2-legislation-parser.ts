/**
 * M2 LEGISLATION PARSER SERVICE
 *
 * Parsează text legislativ raw în structură:
 * - Identifică articole, aliniate, paragrafe
 * - Detectează capitole, secțiuni, anexe
 * - Extrage referințe cross-law (ex: "conform art. 5 din Legea 319/2006")
 * - Identifică secțiuni de sancțiuni/amenzi
 * - Marchează keywords de obligație (trebuie, obligatoriu, interzis, nu are voie)
 *
 * Suportă pattern-uri românești (LEGE, ORDIN, HG) și multilingual (BG, HU, DE, PL)
 */

export interface LegislationParsed {
  // Meta
  rawText: string
  language: 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en'
  detectedActType: 'law' | 'order' | 'decree' | 'regulation' | 'unknown'

  // Structură
  structure: {
    chapters: Chapter[]
    articles: Article[]
    annexes: Annex[]
  }

  // Analiză
  analysis: {
    totalArticles: number
    totalChapters: number
    totalAnnexes: number
    hasPenaltiesSection: boolean
    penaltiesArticles: string[]  // IDs articole cu amenzi
    crossReferences: CrossReference[]
    obligationKeywords: ObligationKeyword[]
  }

  // Stats
  parsedAt: string
  parsingWarnings: string[]
}

export interface Chapter {
  id: string                    // "CAP_1", "CAP_2", "SECTION_1_1"
  type: 'chapter' | 'section' | 'title' | 'part'
  number: string | null         // "I", "II", "1", "2"
  title: string
  level: number                 // 0 = top-level, 1 = subsection, etc.
  articles: string[]            // IDs articole conținute
  startIndex: number            // Poziție în text raw
  endIndex: number
}

export interface Article {
  id: string                    // "ART_1", "ART_5_1" (articol.aliniat)
  number: string                // "1", "5", "23^1" (articol adăugat)
  type: 'article' | 'paragraph' | 'point' | 'letter'
  title: string | null          // Unele articole au titlu
  content: string               // Text complet articol
  paragraphs: Paragraph[]       // Aliniate
  hasObligations: boolean       // Conține keywords obligație
  hasPenalties: boolean         // Conține sancțiuni
  crossReferences: string[]     // IDs referințe externe
  chapterId: string | null      // În ce capitol aparține
  startIndex: number
  endIndex: number
}

export interface Paragraph {
  id: string                    // "ART_5_1_A" (articol.aliniat.litera)
  number: string | null         // "(1)", "a)", "i."
  content: string
  hasObligations: boolean
  hasPenalties: boolean
}

export interface Annex {
  id: string                    // "ANNEX_1"
  number: string | null         // "1", "nr. 2"
  title: string
  content: string               // Text complet anexă
  startIndex: number
  endIndex: number
}

export interface CrossReference {
  id: string
  sourceArticleId: string       // Unde apare referința
  referencedAct: string | null  // "Legea 319/2006", "OUG 75/2021"
  referencedArticle: string | null  // "art. 5", "art. 12 alin. (3)"
  rawText: string               // Text original referință
  position: number              // Poziție în text
}

export interface ObligationKeyword {
  id: string
  articleId: string
  keyword: string               // "trebuie", "obligatoriu", "interzis"
  type: 'mandatory' | 'forbidden' | 'recommended' | 'optional'
  context: string               // 50 caractere context
  position: number
}

// ══════════════════════════════════════════════════════════════
// MAIN PARSER FUNCTION
// ══════════════════════════════════════════════════════════════

export function parseLegislation(rawText: string): LegislationParsed {
  const warnings: string[] = []
  const parsedAt = new Date().toISOString()

  // Detectare limbă și tip act
  const language = detectLanguage(rawText)
  const actType = detectActType(rawText, language)

  // Parsare structură
  const chapters = parseChapters(rawText, language)
  const articles = parseArticles(rawText, language, chapters)
  const annexes = parseAnnexes(rawText, language)

  // Analiză cross-references
  const crossReferences = extractCrossReferences(rawText, articles)

  // Analiză keywords obligații
  const obligationKeywords = extractObligationKeywords(rawText, articles, language)

  // Identificare secțiuni sancțiuni
  const penaltiesArticles = identifyPenaltiesArticles(articles, language)

  // Warnings
  if (articles.length === 0) {
    warnings.push('No articles detected - text may not be properly formatted legislation')
  }
  if (chapters.length === 0) {
    warnings.push('No chapters detected - legislation may be short or unstructured')
  }

  return {
    rawText,
    language,
    detectedActType: actType,
    structure: {
      chapters,
      articles,
      annexes
    },
    analysis: {
      totalArticles: articles.length,
      totalChapters: chapters.length,
      totalAnnexes: annexes.length,
      hasPenaltiesSection: penaltiesArticles.length > 0,
      penaltiesArticles,
      crossReferences,
      obligationKeywords
    },
    parsedAt,
    parsingWarnings: warnings
  }
}

// ══════════════════════════════════════════════════════════════
// LANGUAGE & ACT TYPE DETECTION
// ══════════════════════════════════════════════════════════════

function detectLanguage(text: string): 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en' {
  const markers = {
    ro: ['articol', 'alineat', 'hotărâre', 'ordin', 'legea', 'prezenta lege'],
    bg: ['член', 'алинея', 'закон', 'наредба', 'постановление'],
    hu: ['cikk', 'bekezdés', 'törvény', 'rendelet', 'határozat'],
    de: ['artikel', 'absatz', 'gesetz', 'verordnung', 'paragraph'],
    pl: ['artykuł', 'ustęp', 'ustawa', 'rozporządzenie', 'zarządzenie'],
    en: ['article', 'paragraph', 'section', 'act', 'regulation']
  }

  const lowerText = text.toLowerCase()
  let maxScore = 0
  let detectedLang: 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en' = 'ro'

  for (const [lang, keywords] of Object.entries(markers)) {
    let score = 0
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = lowerText.match(regex)
      if (matches) score += matches.length
    }
    if (score > maxScore) {
      maxScore = score
      detectedLang = lang as typeof detectedLang
    }
  }

  return detectedLang
}

function detectActType(text: string, language: string): LegislationParsed['detectedActType'] {
  const lowerText = text.toLowerCase()

  const patterns: Record<string, RegExp[]> = {
    law: [
      /\blege[a]?\s+nr\.?\s*\d+/i,
      /\bзакон\b/i,
      /\btörvény\b/i,
      /\bgesetz\b/i,
      /\bustawa\b/i
    ],
    order: [
      /\bordin\s+nr\.?\s*\d+/i,
      /\bнаредба\b/i,
      /\brendelet\b/i,
      /\bverordnung\b/i,
      /\brozporządzenie\b/i
    ],
    decree: [
      /\bhotărâre\s+guvern/i,
      /\bhg\s+nr/i,
      /\bпостановление\b/i,
      /\bhatározat\b/i,
      /\bbeschluss\b/i,
      /\bzarządzenie\b/i
    ],
    regulation: [
      /\bregualment/i,
      /\bnorme\s+metodologice/i,
      /\bправилник\b/i,
      /\bszabályzat\b/i
    ]
  }

  for (const [type, regexes] of Object.entries(patterns)) {
    for (const regex of regexes) {
      if (regex.test(lowerText)) {
        return type as LegislationParsed['detectedActType']
      }
    }
  }

  return 'unknown'
}

// ══════════════════════════════════════════════════════════════
// CHAPTERS PARSING
// ══════════════════════════════════════════════════════════════

function parseChapters(text: string, language: string): Chapter[] {
  const chapters: Chapter[] = []

  // Patterns pentru capitole (RO focus, extensibil)
  const chapterPatterns = [
    // RO: "CAPITOLUL I", "Cap. 2", "SECȚIUNEA 1"
    /(?:CAPITOLUL|CAP\.?)\s+([IVXLCDM]+|\d+)\s*[:\-—]?\s*([^\n]+)/gi,
    /SECȚIUNEA\s+(\d+)\s*[:\-—]?\s*([^\n]+)/gi,
    /TITLUL\s+([IVXLCDM]+|\d+)\s*[:\-—]?\s*([^\n]+)/gi,
    // EN: "CHAPTER I", "Section 1"
    /CHAPTER\s+([IVXLCDM]+|\d+)\s*[:\-—]?\s*([^\n]+)/gi,
    /SECTION\s+(\d+)\s*[:\-—]?\s*([^\n]+)/gi
  ]

  let chapterCounter = 0

  for (const pattern of chapterPatterns) {
    let match
    pattern.lastIndex = 0

    while ((match = pattern.exec(text)) !== null) {
      chapterCounter++
      const number = match[1].trim()
      const title = match[2].trim()
      const startIndex = match.index

      // Determină tipul
      let type: Chapter['type'] = 'chapter'
      if (/SECȚIUNE|SECTION/i.test(match[0])) type = 'section'
      if (/TITLU|TITLE/i.test(match[0])) type = 'title'

      chapters.push({
        id: `${type.toUpperCase()}_${chapterCounter}`,
        type,
        number,
        title,
        level: 0,
        articles: [],
        startIndex,
        endIndex: startIndex + match[0].length
      })
    }
  }

  // Sort by position
  chapters.sort((a, b) => a.startIndex - b.startIndex)

  // Calculate endIndex (până la următorul capitol sau end of text)
  for (let i = 0; i < chapters.length; i++) {
    if (i < chapters.length - 1) {
      chapters[i].endIndex = chapters[i + 1].startIndex
    } else {
      chapters[i].endIndex = text.length
    }
  }

  return chapters
}

// ══════════════════════════════════════════════════════════════
// ARTICLES PARSING
// ══════════════════════════════════════════════════════════════

function parseArticles(text: string, language: string, chapters: Chapter[]): Article[] {
  const articles: Article[] = []

  // Pattern articole: "Art. 5", "Articolul 12"
  const articlePattern = /(?:Articolul|Art\.|Article)\s+(\d+(?:\^?\d)?)\s*\.?\s*([^\n]*)/gi

  let match
  let articleCounter = 0

  while ((match = articlePattern.exec(text)) !== null) {
    articleCounter++
    const number = match[1].trim()
    const titleOrContent = match[2].trim()
    const startIndex = match.index

    // Find end of article (next article or next chapter or end)
    let endIndex = text.length
    const nextArticleMatch = articlePattern.exec(text)
    if (nextArticleMatch) {
      endIndex = nextArticleMatch.index
      articlePattern.lastIndex = nextArticleMatch.index // Reset for next iteration
    }

    const content = text.substring(startIndex, endIndex).trim()

    // Parse paragraphs within article
    const paragraphs = parseParagraphs(content)

    // Determine chapter
    let chapterId: string | null = null
    for (const chapter of chapters) {
      if (startIndex >= chapter.startIndex && startIndex < chapter.endIndex) {
        chapterId = chapter.id
        chapter.articles.push(`ART_${number}`)
        break
      }
    }

    // Check obligations & penalties
    const hasObligations = checkObligations(content, language)
    const hasPenalties = checkPenalties(content, language)

    articles.push({
      id: `ART_${number}`,
      number,
      type: 'article',
      title: titleOrContent.length > 100 ? null : titleOrContent || null,
      content,
      paragraphs,
      hasObligations,
      hasPenalties,
      crossReferences: [],
      chapterId,
      startIndex,
      endIndex
    })
  }

  return articles
}

function parseParagraphs(articleContent: string): Paragraph[] {
  const paragraphs: Paragraph[] = []

  // Patterns: (1), (2), a), b), i., ii.
  const patterns = [
    /\((\d+)\)\s*([^\n(]+)/g,     // (1), (2)
    /([a-z])\)\s*([^\n]+)/g,      // a), b)
    /([ivxlcdm]+)\.\s*([^\n]+)/gi // i., ii., iii.
  ]

  let counter = 0
  for (const pattern of patterns) {
    let match
    pattern.lastIndex = 0

    while ((match = pattern.exec(articleContent)) !== null) {
      counter++
      const number = match[1]
      const content = match[2].trim()

      paragraphs.push({
        id: `PAR_${counter}`,
        number: pattern === patterns[0] ? `(${number})` : `${number})`,
        content,
        hasObligations: checkObligations(content, 'ro'),
        hasPenalties: checkPenalties(content, 'ro')
      })
    }
  }

  return paragraphs
}

// ══════════════════════════════════════════════════════════════
// ANNEXES PARSING
// ══════════════════════════════════════════════════════════════

function parseAnnexes(text: string, language: string): Annex[] {
  const annexes: Annex[] = []

  // Pattern: "ANEXA 1", "Anexa nr. 2"
  const annexPattern = /(?:ANEXA|Anexa)\s+(?:nr\.?\s*)?(\d+)\s*[:\-—]?\s*([^\n]*)/gi

  let match
  let counter = 0

  while ((match = annexPattern.exec(text)) !== null) {
    counter++
    const number = match[1].trim()
    const title = match[2].trim() || `Anexa ${number}`
    const startIndex = match.index

    // Find end (next annex or end of text)
    let endIndex = text.length
    const nextMatch = annexPattern.exec(text)
    if (nextMatch) {
      endIndex = nextMatch.index
      annexPattern.lastIndex = nextMatch.index
    }

    const content = text.substring(startIndex, endIndex).trim()

    annexes.push({
      id: `ANNEX_${number}`,
      number,
      title,
      content,
      startIndex,
      endIndex
    })
  }

  return annexes
}

// ══════════════════════════════════════════════════════════════
// CROSS-REFERENCES EXTRACTION
// ══════════════════════════════════════════════════════════════

function extractCrossReferences(text: string, articles: Article[]): CrossReference[] {
  const references: CrossReference[] = []

  // Patterns: "conform art. 5 din Legea 319/2006"
  const patterns = [
    /(?:conform|potrivit|în sensul)\s+art\.?\s*(\d+)(?:\s+alin\.?\s*\((\d+)\))?\s+din\s+(Legea|Ordin(?:ul)?|HG|OUG)\s+nr\.?\s*([\d/]+)/gi,
    /art\.?\s*(\d+)(?:\s+alin\.?\s*\((\d+)\))?\s+din\s+(Legea|Ordin(?:ul)?|HG|OUG)\s+nr\.?\s*([\d/]+)/gi,
    /prevederile\s+(Legii|Ordinului|HG)\s+nr\.?\s*([\d/]+)/gi
  ]

  let refCounter = 0

  for (const pattern of patterns) {
    let match
    pattern.lastIndex = 0

    while ((match = pattern.exec(text)) !== null) {
      refCounter++

      // Find source article
      let sourceArticleId = 'UNKNOWN'
      for (const article of articles) {
        if (match.index >= article.startIndex && match.index < article.endIndex) {
          sourceArticleId = article.id
          article.crossReferences.push(`REF_${refCounter}`)
          break
        }
      }

      const referencedAct = match[3] ? `${match[3]} ${match[4]}` : match[1] + ' ' + match[2]
      const referencedArticle = match[1] ? `art. ${match[1]}${match[2] ? ` alin. (${match[2]})` : ''}` : null

      references.push({
        id: `REF_${refCounter}`,
        sourceArticleId,
        referencedAct,
        referencedArticle,
        rawText: match[0],
        position: match.index
      })
    }
  }

  return references
}

// ══════════════════════════════════════════════════════════════
// OBLIGATION KEYWORDS EXTRACTION
// ══════════════════════════════════════════════════════════════

function extractObligationKeywords(
  text: string,
  articles: Article[],
  language: string
): ObligationKeyword[] {
  const keywords: ObligationKeyword[] = []

  const obligationPatterns = {
    ro: {
      mandatory: ['trebuie', 'obligatoriu', 'obligația', 'în mod obligatoriu', 'are obligația'],
      forbidden: ['interzis', 'nu are voie', 'nu este permis', 'se interzice', 'nu se admite'],
      recommended: ['recomandabil', 'se recomandă', 'este indicat'],
      optional: ['poate', 'are dreptul', 'facultativ']
    },
    en: {
      mandatory: ['must', 'shall', 'required', 'mandatory', 'obligatory'],
      forbidden: ['forbidden', 'prohibited', 'must not', 'shall not'],
      recommended: ['should', 'recommended', 'advisable'],
      optional: ['may', 'can', 'optional']
    }
  }

  const patterns = obligationPatterns[language as keyof typeof obligationPatterns] || obligationPatterns.ro

  let keywordCounter = 0

  for (const [type, words] of Object.entries(patterns)) {
    for (const word of words) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      let match

      while ((match = regex.exec(text)) !== null) {
        keywordCounter++

        // Find article
        let articleId = 'UNKNOWN'
        for (const article of articles) {
          if (match.index >= article.startIndex && match.index < article.endIndex) {
            articleId = article.id
            break
          }
        }

        // Extract context (50 chars before/after)
        const contextStart = Math.max(0, match.index - 50)
        const contextEnd = Math.min(text.length, match.index + match[0].length + 50)
        const context = text.substring(contextStart, contextEnd).replace(/\s+/g, ' ').trim()

        keywords.push({
          id: `KW_${keywordCounter}`,
          articleId,
          keyword: word,
          type: type as ObligationKeyword['type'],
          context,
          position: match.index
        })
      }
    }
  }

  return keywords
}

// ══════════════════════════════════════════════════════════════
// PENALTIES IDENTIFICATION
// ══════════════════════════════════════════════════════════════

function identifyPenaltiesArticles(articles: Article[], language: string): string[] {
  return articles
    .filter(article => article.hasPenalties)
    .map(article => article.id)
}

function checkPenalties(text: string, language: string): boolean {
  const penaltyKeywords = {
    ro: ['amendă', 'sancțiune', 'contravenție', 'pedeapsă', 'lei', 'RON'],
    en: ['fine', 'penalty', 'sanction', 'punishment', 'EUR', 'USD'],
    bg: ['глоба', 'наказание', 'санкция'],
    hu: ['bírság', 'büntetés', 'szankció'],
    de: ['geldstrafe', 'busse', 'strafe'],
    pl: ['kara', 'grzywna', 'sankcja']
  }

  const keywords = penaltyKeywords[language as keyof typeof penaltyKeywords] || penaltyKeywords.ro
  const lowerText = text.toLowerCase()

  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))
}

function checkObligations(text: string, language: string): boolean {
  const obligationKeywords = {
    ro: ['trebuie', 'obligatoriu', 'obligația', 'interzis', 'nu are voie'],
    en: ['must', 'shall', 'required', 'mandatory', 'forbidden', 'prohibited'],
    bg: ['трябва', 'задължителен', 'забранено'],
    hu: ['kell', 'kötelező', 'tilos'],
    de: ['muss', 'verpflichtet', 'verboten'],
    pl: ['musi', 'obowiązkowy', 'zabroniony']
  }

  const keywords = obligationKeywords[language as keyof typeof obligationKeywords] || obligationKeywords.ro
  const lowerText = text.toLowerCase()

  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))
}
