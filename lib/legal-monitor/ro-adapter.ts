// ============================================================
// lib/legal-monitor/ro-adapter.ts
// M7 Legislative Monitor — RO Adapter (Simplified)
//
// Verifică dacă actele legislative RO au fost modificate
// prin scraping de pe legislatie.just.ro (fără SOAP API)
// ============================================================

export interface RoCheckResult {
  actKey: string
  hasChanges: boolean
  currentVersionDate: string | null
  sourceUrl: string
  rawHtml?: string
  error?: string
  durationMs: number
}

interface SearchResult {
  url: string | null
  title: string | null
  lastModifiedDate: string | null
}

// ─── MAIN: Check Romanian Act ────────────────────────────────

export async function checkRomanianAct(actKey: string): Promise<RoCheckResult> {
  const startTime = Date.now()

  try {
    // Step 1: Construiește URL de search
    const searchUrl = buildSearchUrl(actKey)

    // Step 2: Fetch search results cu timeout
    const searchHtml = await fetchWithTimeout(searchUrl, 10000)

    // Step 3: Parse search results pentru a găsi URL-ul actului
    const searchResult = parseSearchResults(searchHtml, actKey)

    if (!searchResult.url) {
      return {
        actKey,
        hasChanges: false,
        currentVersionDate: null,
        sourceUrl: searchUrl,
        error: 'Act nu a fost găsit în rezultatele căutării',
        durationMs: Date.now() - startTime,
      }
    }

    // Step 4: Fetch pagina actului
    const actHtml = await fetchWithTimeout(searchResult.url, 10000)

    // Step 5: Parse data ultimei modificări
    const versionDate = parseVersionDate(actHtml)

    return {
      actKey,
      hasChanges: false, // va fi setat de ro-checker.ts comparând cu DB
      currentVersionDate: versionDate,
      sourceUrl: searchResult.url,
      rawHtml: actHtml.substring(0, 500), // primele 500 chars pentru debug
      durationMs: Date.now() - startTime,
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    return {
      actKey,
      hasChanges: false,
      currentVersionDate: null,
      sourceUrl: '',
      error: errMsg,
      durationMs: Date.now() - startTime,
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function buildSearchUrl(actKey: string): string {
  // Convertește act_key (ex: L-319-2006) în query pentru search
  // Format: "Legea 319/2006" sau "OUG 195/2002"
  const parts = actKey.split('-')
  if (parts.length < 3) {
    throw new Error(`Invalid act_key format: ${actKey}`)
  }

  const actTypeMap: Record<string, string> = {
    L: 'Legea',
    OUG: 'Ordonanta de urgenta',
    OG: 'Ordonanta',
    HG: 'Hotararea Guvernului',
    OM: 'Ordinul',
  }

  const actType = actTypeMap[parts[0]] || parts[0]
  const number = parts[1]
  const year = parts[2]

  const searchTerm = `${actType} ${number}/${year}`
  const encodedTerm = encodeURIComponent(searchTerm)

  // legislatie.just.ro folosește acest pattern de search
  return `https://legislatie.just.ro/Public/RezultateCautare?searchMode=simple&searchText=${encodedTerm}`
}

async function fetchWithTimeout(url: string, timeoutMs: number, retryCount = 1): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Dacă e timeout sau network error, retry
      if (attempt < retryCount) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        continue
      }
    }
  }

  throw lastError || new Error('Failed to fetch after retries')
}

function parseSearchResults(html: string, actKey: string): SearchResult {
  // Caută link-uri către DetaliiDocument în HTML-ul de search results
  // Pattern: <a href="/Public/DetaliiDocument/123456">Legea 319/2006...</a>

  const linkPattern =
    /<a\s+href="\/Public\/DetaliiDocument\/(\d+)"[^>]*>([^<]+)<\/a>/gi
  let match

  while ((match = linkPattern.exec(html)) !== null) {
    const documentId = match[1]
    const linkText = match[2].trim()

    // Verifică dacă link-ul conține numărul și anul actului
    const parts = actKey.split('-')
    const number = parts[1]
    const year = parts[2]

    if (linkText.includes(number) && linkText.includes(year)) {
      return {
        url: `https://legislatie.just.ro/Public/DetaliiDocument/${documentId}`,
        title: linkText,
        lastModifiedDate: null,
      }
    }
  }

  // Fallback: caută primul rezultat
  const firstMatch = linkPattern.exec(html)
  if (firstMatch) {
    return {
      url: `https://legislatie.just.ro/Public/DetaliiDocument/${firstMatch[1]}`,
      title: firstMatch[2].trim(),
      lastModifiedDate: null,
    }
  }

  return {
    url: null,
    title: null,
    lastModifiedDate: null,
  }
}

function parseVersionDate(html: string): string | null {
  // Caută pattern-uri comune pentru data ultimei modificări în HTML
  // Exemplu: "Ultima modificare: 15.03.2024"
  // Exemplu: "Republicat în M.Of. nr. 123 din 15.03.2024"
  // Exemplu: <span class="date">15.03.2024</span>

  const patterns = [
    /Ultima\s+modificare[:\s]+(\d{2}\.\d{2}\.\d{4})/i,
    /Republicat[^<]*?(\d{2}\.\d{2}\.\d{4})/i,
    /Data\s+actului[:\s]+(\d{2}\.\d{2}\.\d{4})/i,
    /M\.Of\.\s+nr\.\s+\d+\s+din\s+(\d{2}\.\d{2}\.\d{4})/i,
    /<span[^>]*class="date"[^>]*>(\d{2}\.\d{2}\.\d{4})<\/span>/i,
    /data:\s*(\d{2}\.\d{2}\.\d{4})/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      // Convertește din DD.MM.YYYY în YYYY-MM-DD pentru PostgreSQL
      const [day, month, year] = match[1].split('.')
      return `${year}-${month}-${day}`
    }
  }

  // Fallback: caută orice dată în format DD.MM.YYYY
  const anyDatePattern = /(\d{2}\.\d{2}\.\d{4})/
  const match = html.match(anyDatePattern)
  if (match && match[1]) {
    const [day, month, year] = match[1].split('.')
    return `${year}-${month}-${day}`
  }

  return null
}
