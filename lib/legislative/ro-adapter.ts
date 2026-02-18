// ============================================================
// lib/legislative/ro-adapter.ts
// M7 Legislative Monitor — RO Adapter (SOAP + HTML Fallback)
//
// Conectare la SOAP API legislatie.just.ro
// SOAP endpoint: /Public/WebServices/LegislativeWebService.asmx
// Fallback: HTML scraping dacă SOAP eșuează
// Timeout: 30s per request
// ============================================================

import { parseStringPromise, processors } from 'xml2js'
import { createClient } from '@supabase/supabase-js'
import { fetchAndParseAct, computeHash } from '@/lib/legislative-import/ro-html-parser'

// ─── Constants ────────────────────────────────────────────────

const SOAP_ENDPOINT =
  'http://legislatie.just.ro/Public/WebServices/LegislativeWebService.asmx'
// Namespace from WSDL — standard for this ASP.NET .asmx service
const SOAP_NS = 'http://legislatie.just.ro/'
const TIMEOUT_MS = 30_000
const RATE_LIMIT_MS = 1500

// ─── Types ────────────────────────────────────────────────────

export interface ActMeta {
  titlu: string
  numar: string
  an: string
  tip: string
  dataPublicarii: string | null
  dataIntrariiVigoare: string | null
  numarMO: string | null
  emitent: string | null
  portalId: string | null
  portalUrl: string | null
  stare: string | null
}

export interface FetchActResult {
  titlu: string
  continut: string
  meta: ActMeta
}

export interface UpdatedAct {
  actId: string
  actKey: string | null
  numar: string
  an: string
  tip: string
  oldCheckedAt: string | null
  newVersionDate: string | null
  portalUrl: string | null
  diff: string
}

export interface ImportStats {
  imported: number
  skipped: number
  errors: number
  acts: { key: string; status: 'imported' | 'skipped' | 'error'; error?: string }[]
}

// ─── Supabase (service role) ──────────────────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── XML Helpers ──────────────────────────────────────────────

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function parseXml(xml: string): Promise<Record<string, unknown>> {
  return parseStringPromise(xml, {
    explicitArray: false,
    ignoreAttrs: true,
    tagNameProcessors: [processors.stripPrefix],
    charkey: '_text',
  }) as Promise<Record<string, unknown>>
}

// Deep-safe string extractor for parsed XML objects
function safeStr(obj: unknown, ...keys: string[]): string | null {
  let cur: unknown = obj
  for (const k of keys) {
    if (!cur || typeof cur !== 'object') return null
    cur = (cur as Record<string, unknown>)[k]
  }
  if (cur === null || cur === undefined) return null
  // Handle xml2js text nodes
  if (typeof cur === 'object' && '_text' in (cur as Record<string, unknown>)) {
    const t = (cur as Record<string, unknown>)['_text']
    return t ? String(t).trim() || null : null
  }
  return String(cur).trim() || null
}

// ─── SOAP Request ─────────────────────────────────────────────

async function soapCall(
  method: string,
  params: Record<string, string>
): Promise<Record<string, unknown>> {
  const paramXml = Object.entries(params)
    .map(([k, v]) => `        <${k}>${escapeXml(v)}</${k}>`)
    .join('\n')

  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <${method} xmlns="${SOAP_NS}">
${paramXml}
    </${method}>
  </soap:Body>
</soap:Envelope>`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(SOAP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: `"${SOAP_NS}${method}"`,
        'User-Agent': 'SSM-M7-Monitor/1.0 (+https://app.s-s-m.ro)',
        Accept: 'text/xml',
      },
      body: envelope,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`SOAP HTTP ${response.status}: ${response.statusText}`)
    }

    const text = await response.text()

    if (!text.trim().startsWith('<')) {
      throw new Error(`SOAP response is not XML: ${text.substring(0, 100)}`)
    }

    return parseXml(text)
  } finally {
    clearTimeout(timer)
  }
}

// ─── SOAP Methods ─────────────────────────────────────────────

async function getCodificareAct(
  numar: string,
  an: string,
  tip: string
): Promise<ActMeta | null> {
  try {
    const res = await soapCall('getCodificareActPublicatInMO', {
      nrAct: numar,
      anAct: an,
      tipAct: tip,
    })

    // Navigate: Envelope → Body → getCodificareActPublicatInMOResponse → getCodificareActPublicatInMOResult
    const body = safeGetBody(res)
    if (!body) return null

    const result = safeGetResult(body, 'getCodificareActPublicatInMOResponse', 'getCodificareActPublicatInMOResult')
    if (!result) return null

    const portalId =
      safeStr(result, 'Id') ??
      safeStr(result, 'DocumentId') ??
      safeStr(result, 'IdDocument')

    return {
      titlu:
        safeStr(result, 'Titlu') ??
        safeStr(result, 'DenumireAct') ??
        safeStr(result, 'TitluAct') ??
        `${tip} nr. ${numar}/${an}`,
      numar,
      an,
      tip,
      dataPublicarii:
        safeStr(result, 'DataPublicarii') ??
        safeStr(result, 'DataDocument') ??
        safeStr(result, 'DataEmitere'),
      dataIntrariiVigoare:
        safeStr(result, 'DataIntrariiVigoare') ??
        safeStr(result, 'DataInVigoare') ??
        safeStr(result, 'DataVigoare'),
      numarMO:
        safeStr(result, 'NumarMO') ??
        safeStr(result, 'NrMonitorOficial') ??
        safeStr(result, 'MonitorOficial'),
      emitent:
        safeStr(result, 'Emitent') ??
        safeStr(result, 'OrganEmitent') ??
        safeStr(result, 'Organ'),
      portalId,
      portalUrl: portalId
        ? `https://legislatie.just.ro/Public/DetaliiDocument/${portalId}`
        : null,
      stare:
        safeStr(result, 'Stare') ??
        safeStr(result, 'StareAct') ??
        safeStr(result, 'Status'),
    }
  } catch (err) {
    console.warn(`[RO SOAP] getCodificareAct failed for ${tip} ${numar}/${an}:`, err)
    return null
  }
}

async function getActContent(
  numar: string,
  an: string,
  tip: string
): Promise<string | null> {
  try {
    const res = await soapCall('getActPublicatInMO', {
      nrAct: numar,
      anAct: an,
      tipAct: tip,
    })

    const body = safeGetBody(res)
    if (!body) return null

    const result = safeGetResult(body, 'getActPublicatInMOResponse', 'getActPublicatInMOResult')
    if (!result) return null

    return (
      safeStr(result, 'ContinutAct') ??
      safeStr(result, 'ContiutAct') ??   // known typo in some versions of the API
      safeStr(result, 'TextAct') ??
      safeStr(result, 'Content') ??
      safeStr(result, 'HtmlContent')
    )
  } catch (err) {
    console.warn(`[RO SOAP] getActContent failed for ${tip} ${numar}/${an}:`, err)
    return null
  }
}

export async function checkActUpdate(portalId: string): Promise<{
  hasUpdate: boolean
  versionDate: string | null
} | null> {
  try {
    const res = await soapCall('getActualizareAct', { idDocument: portalId })

    const body = safeGetBody(res)
    if (!body) return null

    const result = safeGetResult(body, 'getActualizareActResponse', 'getActualizareActResult')
    if (!result) return null

    const r = result as Record<string, unknown>
    const flagVal =
      safeStr(r, 'EsteActualizat') ??
      safeStr(r, 'Actualizat') ??
      safeStr(r, 'HasUpdate') ??
      'false'
    const hasUpdate = flagVal.toLowerCase() === 'true' || flagVal === '1'

    const versionDate =
      safeStr(r, 'DataUltimaActualizare') ??
      safeStr(r, 'DataActualizare') ??
      safeStr(r, 'DataModificare')

    return { hasUpdate, versionDate }
  } catch (err) {
    console.warn(`[RO SOAP] checkActUpdate failed for portalId ${portalId}:`, err)
    return null
  }
}

// ─── XML navigation helpers ───────────────────────────────────

function safeGetBody(res: Record<string, unknown>): Record<string, unknown> | null {
  // Handles both prefixed (Envelope.Body) and unprefixed
  const envelope =
    (res['Envelope'] as Record<string, unknown> | undefined) ??
    (res['soap:Envelope'] as Record<string, unknown> | undefined)

  if (!envelope) return null

  const body =
    (envelope['Body'] as Record<string, unknown> | undefined) ??
    (envelope['soap:Body'] as Record<string, unknown> | undefined)

  return body ?? null
}

function safeGetResult(
  body: Record<string, unknown>,
  responseName: string,
  resultName: string
): Record<string, unknown> | null {
  const response = body[responseName] as Record<string, unknown> | undefined
  if (response) {
    const result = response[resultName]
    if (result && typeof result === 'object') {
      return result as Record<string, unknown>
    }
  }

  // Fallback: result directly on body
  const directResult = body[resultName]
  if (directResult && typeof directResult === 'object') {
    return directResult as Record<string, unknown>
  }

  return null
}

// ─── HTML Fallback ────────────────────────────────────────────

async function fetchActHtmlFallback(
  numar: string,
  an: string,
  tip: string
): Promise<{ titlu: string; continut: string; portalUrl: string } | null> {
  try {
    // Step 1: Search page
    const tipMap: Record<string, string> = {
      HG: 'Hotararea Guvernului',
      Lege: 'Legea',
      OUG: 'Ordonanta de urgenta',
      OG: 'Ordonanta Guvernului',
      Ordin: 'Ordinul',
      OM: 'Ordinul ministrului',
      Decizie: 'Decizia',
      Cod: 'Codul',
    }
    const tipSearch = tipMap[tip] ?? tip
    const q = encodeURIComponent(`${tipSearch} ${numar}/${an}`)
    const searchUrl = `https://legislatie.just.ro/Public/RezultateCautare?searchMode=simple&searchText=${q}`

    const searchHtml = await fetchWithTimeout(searchUrl)

    // Extract DetaliiDocument link — prefer match on number + year
    let portalId: string | null = null
    const linkRe = /<a\s+href="\/Public\/DetaliiDocument\/(\d+)"[^>]*>([^<]+)<\/a>/gi
    let m: RegExpExecArray | null

    while ((m = linkRe.exec(searchHtml)) !== null) {
      if (m[2].includes(numar) && m[2].includes(an)) {
        portalId = m[1]
        break
      }
    }

    // Fallback to first result
    if (!portalId) {
      const first = searchHtml.match(/\/Public\/DetaliiDocument\/(\d+)/)
      if (first) portalId = first[1]
    }

    if (!portalId) {
      console.warn(`[RO HTML] No DetaliiDocument link found for ${tip} ${numar}/${an}`)
      return null
    }

    const portalUrl = `https://legislatie.just.ro/Public/DetaliiDocument/${portalId}`

    // Step 2: Fetch & parse using existing parser
    const parsed = await fetchAndParseAct(portalUrl)

    return {
      titlu: parsed.title,
      continut: parsed.fullText,
      portalUrl,
    }
  } catch (err) {
    console.warn(`[RO HTML] fetchActHtmlFallback failed for ${tip} ${numar}/${an}:`, err)
    return null
  }
}

async function fetchWithTimeout(url: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.5',
      },
      signal: controller.signal,
    })

    if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`)
    return r.text()
  } finally {
    clearTimeout(timer)
  }
}

// ─── Normalization ────────────────────────────────────────────

function normalizeHtmlContent(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ─── Type mapping ─────────────────────────────────────────────

function mapActType(tip: string): string {
  const map: Record<string, string> = {
    Lege: 'law',
    OUG: 'emergency_ordinance',
    OG: 'government_ordinance',
    HG: 'government_decision',
    Cod: 'code',
    Ordin: 'ministerial_order',
    OM: 'ministerial_order',
    Decizie: 'decision',
    NV: 'norm',
    Instructiuni: 'instruction',
  }
  return map[tip] || 'other'
}

function mapActTypeReverse(dbType: string): string {
  const map: Record<string, string> = {
    law: 'Lege',
    emergency_ordinance: 'OUG',
    government_ordinance: 'OG',
    government_decision: 'HG',
    code: 'Cod',
    ministerial_order: 'Ordin',
    decision: 'Decizie',
  }
  return map[dbType] || ''
}

function extractPortalId(url: string | null): string | null {
  if (!url) return null
  const m = url.match(/\/DetaliiDocument\/(\d+)/)
  return m?.[1] ?? null
}

function parseActQuery(query: string): { tip: string; numar: string; an: string } | null {
  // "HG 1425/2006" → { tip: 'HG', numar: '1425', an: '2006' }
  const m = query.trim().match(/^([A-Za-z]+)\s+(\d+)\s*\/\s*(\d{4})$/)
  if (!m) return null
  return { tip: m[1].toUpperCase(), numar: m[2], an: m[3] }
}

function buildDefaultMeta(numar: string, an: string, tip: string): ActMeta {
  return {
    titlu: `${tip} nr. ${numar}/${an}`,
    numar,
    an,
    tip,
    dataPublicarii: null,
    dataIntrariiVigoare: null,
    numarMO: null,
    emitent: null,
    portalId: null,
    portalUrl: null,
    stare: null,
  }
}

// ─── Exported Functions ───────────────────────────────────────

/**
 * Fetch a legislative act from legislatie.just.ro
 *
 * Strategy:
 *  1. getCodificareActPublicatInMO → titlu, meta (SOAP)
 *  2. getActPublicatInMO          → continut HTML (SOAP)
 *  3. Fallback HTML scraping if SOAP fails or returns no content
 */
export async function fetchActFromLegislatie(
  numar: string,
  an: string,
  tip: string
): Promise<FetchActResult> {
  console.log(`[RO Adapter] fetchAct: ${tip} ${numar}/${an}`)

  // Try SOAP in parallel
  const [metaResult, contentResult] = await Promise.allSettled([
    getCodificareAct(numar, an, tip),
    getActContent(numar, an, tip),
  ])

  const meta = metaResult.status === 'fulfilled' ? metaResult.value : null
  const rawContent = contentResult.status === 'fulfilled' ? contentResult.value : null

  // If SOAP returned HTML content, normalize it
  if (rawContent) {
    const continut = rawContent.trim().startsWith('<')
      ? normalizeHtmlContent(rawContent)
      : rawContent.trim()

    console.log(`[RO Adapter] SOAP success: ${tip} ${numar}/${an} (${continut.length} chars)`)

    return {
      titlu: meta?.titlu ?? `${tip} nr. ${numar}/${an}`,
      continut,
      meta: meta ?? buildDefaultMeta(numar, an, tip),
    }
  }

  // Fallback: HTML scraping
  console.log(`[RO Adapter] SOAP no content for ${tip} ${numar}/${an} — trying HTML fallback`)

  const html = await fetchActHtmlFallback(numar, an, tip)

  if (html) {
    return {
      titlu: meta?.titlu ?? html.titlu,
      continut: html.continut,
      meta: meta
        ? { ...meta, portalUrl: meta.portalUrl ?? html.portalUrl }
        : { ...buildDefaultMeta(numar, an, tip), portalUrl: html.portalUrl },
    }
  }

  throw new Error(
    `Nu s-a putut obține conținutul actului ${tip} ${numar}/${an} nici via SOAP nici via HTML scraping`
  )
}

/**
 * Check if acts from the legal_acts table have been updated on legislatie.just.ro
 *
 * @param actIds — array of IDs from legal_acts table (country_code='RO')
 * @returns array of acts that have updates available
 */
export async function checkForUpdates(actIds: string[]): Promise<UpdatedAct[]> {
  if (actIds.length === 0) return []

  const supabase = getSupabase()
  const updated: UpdatedAct[] = []

  // Load act metadata from DB
  const { data: acts, error } = await supabase
    .from('legal_acts')
    .select('id, act_number, act_year, act_type, source_reference, source_url, last_checked_at')
    .in('id', actIds)
    .eq('country_code', 'RO')

  if (error) throw new Error(`DB error loading acts: ${error.message}`)
  if (!acts || acts.length === 0) return []

  console.log(`[RO Adapter] checkForUpdates: checking ${acts.length} acts`)

  for (let i = 0; i < acts.length; i++) {
    const act = acts[i]

    if (i > 0) {
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS))
    }

    try {
      const numar = String(act.act_number ?? '')
      const an = String(act.act_year ?? '')
      const tip = mapActTypeReverse(act.act_type ?? '')
      const portalId = extractPortalId(act.source_url)

      if (portalId) {
        // Best path: direct SOAP check via getActualizareAct
        const updateInfo = await checkActUpdate(portalId)

        if (updateInfo?.hasUpdate) {
          updated.push({
            actId: act.id,
            actKey: act.source_reference ?? null,
            numar,
            an,
            tip,
            oldCheckedAt: act.last_checked_at,
            newVersionDate: updateInfo.versionDate,
            portalUrl: act.source_url ?? null,
            diff: 'Actualizare detectată via SOAP getActualizareAct',
          })

          console.log(`[RO Adapter] UPDATED: ${act.source_reference ?? act.id}`)
        } else {
          console.log(`[RO Adapter] No change: ${act.source_reference ?? act.id}`)
        }
      } else if (numar && an && tip) {
        // Fallback: re-fetch HTML and compare hash
        const html = await fetchActHtmlFallback(numar, an, tip)

        if (html) {
          const freshHash = computeHash(html.continut)
          // We can't compare without old hash — mark as needs checking
          // Only flag if this is a known-important act
          console.log(`[RO Adapter] Hash check fallback for ${act.source_reference ?? act.id}: ${freshHash.substring(0, 8)}`)
        }
      } else {
        console.warn(`[RO Adapter] Cannot check act ${act.id}: missing portalId and numar/an/tip`)
      }
    } catch (err) {
      console.error(`[RO Adapter] checkForUpdates error for act ${act.id}:`, err)
    }
  }

  return updated
}

/**
 * Search for and import new legislative acts into legal_acts table
 * Deduplication by (act_number, act_year, act_type, country_code)
 *
 * @param query — e.g. "HG 1425/2006" or "Lege 319/2006"
 */
export async function importNewActs(query: string): Promise<ImportStats> {
  const supabase = getSupabase()
  const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, acts: [] }

  const parsed = parseActQuery(query)
  if (!parsed) {
    throw new Error(
      `Query "${query}" nu poate fi parsat. Format valid: "TIP NR/AN" (ex: "HG 1425/2006")`
    )
  }

  const { tip, numar, an } = parsed
  const actType = mapActType(tip)
  const actKey = `${tip}-${numar}-${an}`

  console.log(`[RO Adapter] importNewActs: ${actKey}`)

  // Deduplication check
  const { data: existing } = await supabase
    .from('legal_acts')
    .select('id')
    .eq('country_code', 'RO')
    .eq('act_number', numar)
    .eq('act_year', parseInt(an))
    .eq('act_type', actType)
    .limit(1)

  if (existing && existing.length > 0) {
    stats.skipped++
    stats.acts.push({ key: actKey, status: 'skipped' })
    console.log(`[RO Adapter] Skipped (already exists): ${actKey}`)
    return stats
  }

  try {
    const result = await fetchActFromLegislatie(numar, an, tip)
    const contentHash = computeHash(result.continut)

    const { error: insertError } = await supabase.from('legal_acts').insert({
      title: result.titlu,
      title_short: result.titlu.substring(0, 255),
      act_type: actType,
      act_number: numar,
      act_year: parseInt(an),
      country_code: 'RO',
      source: 'legislatie.just.ro',
      source_reference: actKey,
      source_url: result.meta.portalUrl,
      content_hash: contentHash,
      full_text: result.continut,
      status: 'active',
      priority: 'normal',
      last_checked_at: new Date().toISOString(),
      imported_at: new Date().toISOString(),
    })

    if (insertError) throw insertError

    stats.imported++
    stats.acts.push({ key: actKey, status: 'imported' })
    console.log(`[RO Adapter] Imported: ${actKey} (${result.continut.length} chars)`)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    stats.errors++
    stats.acts.push({ key: actKey, status: 'error', error: errMsg })
    console.error(`[RO Adapter] Import error for ${actKey}:`, errMsg)
  }

  return stats
}
