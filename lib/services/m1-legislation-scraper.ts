/**
 * M1 LEGISLATION SCRAPER SERVICE
 *
 * Pipeline pentru scraping legislație SSM/PSI/GDPR din RSS-uri oficiale:
 * - legislatie.just.ro (România)
 * - lex.bg (Bulgaria)
 * - njt.hu (Ungaria)
 * - gesetze-im-internet.de (Germania)
 * - dziennikustaw.gov.pl (Polonia)
 */

// Types
type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
type LegislationDomain = 'SSM' | 'PSI' | 'GDPR' | 'LABOR' | 'OTHER'

interface LegislationEntry {
  title: string
  link: string
  pubDate: string
  domain: LegislationDomain
  countryCode: CountryCode
}

// RSS endpoints per țară
const RSS_ENDPOINTS: Record<CountryCode, string> = {
  RO: 'https://legislatie.just.ro/RSS/MonitorulOficial',
  BG: 'https://www.lex.bg/rss',
  HU: 'https://njt.hu/rss',
  DE: 'https://www.gesetze-im-internet.de/rss',
  PL: 'https://dziennikustaw.gov.pl/rss'
}

// Keywords pentru clasificare domeniu
const DOMAIN_KEYWORDS: Record<LegislationDomain, string[]> = {
  SSM: [
    'securitate muncă', 'securitatea și sănătatea',
    'protecția muncii', 'sanatate ocupationala',
    'accidente de munca', 'boli profesionale',
    'echipament protectie', 'evaluare riscuri',
    'medicina muncii', 'igienă muncă',
    'SSM', 'OSH', 'occupational safety',
    'Arbeitsschutz', 'Gesundheitsschutz',
    'zdravlje i sigurnost', 'zawodowych'
  ],
  PSI: [
    'prevenire incendii', 'securitate la incendiu',
    'apărare împotriva incendiilor', 'PSI',
    'protecție incendii', 'pompieri',
    'fire safety', 'fire protection',
    'Brandschutz', 'противопожарна',
    'ochrona przeciwpożarowa'
  ],
  GDPR: [
    'protecția datelor', 'date cu caracter personal',
    'prelucrare date', 'GDPR', 'RGPD',
    'data protection', 'personal data',
    'Datenschutz', 'защита на данни',
    'ochrona danych'
  ],
  LABOR: [
    'codul muncii', 'contractul individual',
    'relații de muncă', 'salarizare',
    'concedii', 'timpul de muncă',
    'labor code', 'employment',
    'Arbeitsrecht', 'трудово право',
    'kodeks pracy'
  ],
  OTHER: []
}

/**
 * Parse RSS XML și extrage entries
 */
async function parseRssFeed(xmlContent: string): Promise<RssItem[]> {
  // Parse manual XML (fără dependențe externe)
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  const items: RssItem[] = []

  let match
  while ((match = itemRegex.exec(xmlContent)) !== null) {
    const itemContent = match[1]

    const title = extractTag(itemContent, 'title')
    const link = extractTag(itemContent, 'link')
    const pubDate = extractTag(itemContent, 'pubDate')
    const description = extractTag(itemContent, 'description')
    const guid = extractTag(itemContent, 'guid')

    if (title && link) {
      items.push({
        title: decodeHtml(title),
        link: decodeHtml(link),
        pubDate: pubDate || '',
        description: decodeHtml(description || ''),
        guid: guid || link
      })
    }
  }

  return items
}

interface RssItem {
  title: string
  link: string
  pubDate: string
  description: string
  guid: string
}

/**
 * Extract tag content din XML
 */
function extractTag(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1].trim() : null
}

/**
 * Decode HTML entities
 */
function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim()
}

/**
 * Clasifică domeniul bazat pe keywords
 */
function classifyDomain(title: string, description: string): LegislationDomain {
  const text = `${title} ${description}`.toLowerCase()

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (domain === 'OTHER') continue

    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return domain as LegislationDomain
      }
    }
  }

  return 'OTHER'
}

/**
 * MAIN FUNCTION: Scrape legislație nouă pentru o țară
 */
export async function scrapeLegislatie(
  country: CountryCode,
  options: {
    sinceDays?: number      // Filtrează entries din ultimele N zile
    maxEntries?: number     // Limitează număr entries returnate
    filterDomains?: LegislationDomain[]  // Filtrează doar domenii specifice
  } = {}
): Promise<LegislationEntry[]> {
  const { sinceDays = 30, maxEntries = 100, filterDomains } = options

  try {
    // Fetch RSS feed
    const rssUrl = RSS_ENDPOINTS[country]
    console.log(`[M1 Scraper] Fetching RSS for ${country}: ${rssUrl}`)

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'S-S-M.RO Legislation Monitor/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`)
    }

    const xmlContent = await response.text()
    const rssItems = await parseRssFeed(xmlContent)

    console.log(`[M1 Scraper] Parsed ${rssItems.length} RSS items for ${country}`)

    // Filtru date
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - sinceDays)

    // Transform în LegislationEntry
    const entries: LegislationEntry[] = []

    for (const item of rssItems) {
      // Skip intrări prea vechi
      if (item.pubDate) {
        const itemDate = new Date(item.pubDate)
        if (itemDate < cutoffDate) continue
      }

      // Clasificare domeniu
      const domain = classifyDomain(item.title, item.description)

      // Filtrare domenii dacă specificat
      if (filterDomains && !filterDomains.includes(domain)) {
        continue
      }

      // Skip dacă e OTHER și nu e solicitat explicit
      if (domain === 'OTHER' && filterDomains && !filterDomains.includes('OTHER')) {
        continue
      }

      const entry: LegislationEntry = {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        domain,
        countryCode: country
      }

      entries.push(entry)

      // Limită număr
      if (entries.length >= maxEntries) break
    }

    console.log(
      `[M1 Scraper] Extracted ${entries.length} legislation entries for ${country}`,
      `(SSM: ${entries.filter(e => e.domain === 'SSM').length}, ` +
      `PSI: ${entries.filter(e => e.domain === 'PSI').length}, ` +
      `GDPR: ${entries.filter(e => e.domain === 'GDPR').length})`
    )

    return entries

  } catch (error) {
    console.error(`[M1 Scraper] Error scraping ${country}:`, error)
    throw new Error(
      `Failed to scrape legislation for ${country}: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Scrape toate țările în paralel
 */
export async function scrapeLegislatieAll(
  options: {
    sinceDays?: number
    maxEntries?: number
    filterDomains?: LegislationDomain[]
  } = {}
): Promise<Record<CountryCode, LegislationEntry[]>> {
  const countries: CountryCode[] = ['RO', 'BG', 'HU', 'DE', 'PL']

  const results = await Promise.allSettled(
    countries.map(country => scrapeLegislatie(country, options))
  )

  const output: Record<string, LegislationEntry[]> = {}

  results.forEach((result, index) => {
    const country = countries[index]
    if (result.status === 'fulfilled') {
      output[country] = result.value
    } else {
      console.error(`[M1 Scraper] Failed to scrape ${country}:`, result.reason)
      output[country] = []
    }
  })

  return output as Record<CountryCode, LegislationEntry[]>
}


