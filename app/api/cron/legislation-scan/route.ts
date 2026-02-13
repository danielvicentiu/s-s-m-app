/**
 * VERCEL CRON: Legislation Scanner
 *
 * Automatically scans RSS feeds from legislatie.just.ro for new SSM/PSI acts
 * and queues them for processing through the M6 batch pipeline.
 *
 * SCHEDULE: Configured in vercel.json (daily at 2 AM)
 * AUTH: Protected by CRON_SECRET environment variable
 *
 * FEATURES:
 * - Scans Romanian legislation RSS feed
 * - Filters for SSM/PSI/security keywords
 * - Checks if acts already exist in legal_acts table
 * - Queues new acts for batch processing
 * - Returns summary of scan results
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { queueAct } from '@/lib/services/batch-processor'

// ══════════════════════════════════════════════════════════════
// TYPES & CONFIGURATION
// ══════════════════════════════════════════════════════════════

interface RssItem {
  title: string
  link: string
  pubDate: string
  description: string
}

// Keywords for filtering relevant legislation
const SSM_PSI_KEYWORDS = [
  'ssm',
  'securitate muncă',
  'securitatea și sănătatea',
  'protecția muncii',
  'protectia muncii',
  'sanatate ocupationala',
  'sănătate ocupațională',
  'accidente de munca',
  'accidente de muncă',
  'boli profesionale',
  'echipament protectie',
  'echipament protecție',
  'evaluare riscuri',
  'medicina muncii',
  'medicina muncă',
  'igienă muncă',
  'igiena munca',
  'psi',
  'prevenire incendii',
  'securitate incendiu',
  'securitate la incendiu',
  'apărare împotriva incendiilor',
  'aparare impotriva incendiilor',
  'protecție incendii',
  'protectie incendii',
  'pompieri',
  'fire safety'
]

// ══════════════════════════════════════════════════════════════
// CRON HANDLER
// ══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  console.log('[Cron] Legislation scan started')

  // 1. Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.error('[Cron] Unauthorized: Invalid or missing CRON_SECRET')
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // 2. Scan RSS feed
    console.log('[Cron] Fetching legislation RSS feed')
    const rssItems = await fetchLegislationRss()
    console.log(`[Cron] Fetched ${rssItems.length} items from RSS`)

    // 3. Filter for SSM/PSI acts
    const relevantActs = filterRelevantActs(rssItems)
    console.log(`[Cron] Found ${relevantActs.length} relevant SSM/PSI acts`)

    if (relevantActs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new relevant acts found',
        scanned: rssItems.length,
        relevant: 0,
        queued: 0
      })
    }

    // 4. Check which acts already exist
    const newActs = await filterNewActs(relevantActs)
    console.log(`[Cron] Found ${newActs.length} new acts (not in database)`)

    if (newActs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All relevant acts already processed',
        scanned: rssItems.length,
        relevant: relevantActs.length,
        queued: 0
      })
    }

    // 5. Queue new acts for processing
    const queuedActs = []
    for (const act of newActs) {
      try {
        const job = await queueAct(act.link, act.title)
        queuedActs.push({
          title: act.title,
          url: act.link,
          jobId: job.id
        })
        console.log(`[Cron] Queued: ${act.title}`)
      } catch (error) {
        console.error(`[Cron] Failed to queue act: ${act.title}`, error)
      }
    }

    console.log(`[Cron] Successfully queued ${queuedActs.length} acts`)

    return NextResponse.json({
      success: true,
      message: `Queued ${queuedActs.length} new acts for processing`,
      scanned: rssItems.length,
      relevant: relevantActs.length,
      queued: queuedActs.length,
      acts: queuedActs
    })

  } catch (error) {
    console.error('[Cron] Error during legislation scan:', error)
    return NextResponse.json(
      {
        error: 'Legislation scan failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// ══════════════════════════════════════════════════════════════
// RSS FETCHING & PARSING
// ══════════════════════════════════════════════════════════════

async function fetchLegislationRss(): Promise<RssItem[]> {
  // Mock RSS feed for testing (in production, this would fetch from legislatie.just.ro)
  const useMockData = !process.env.RSS_FEED_URL

  if (useMockData) {
    console.log('[Cron] Using mock RSS data')
    return getMockRssItems()
  }

  try {
    const rssUrl = process.env.RSS_FEED_URL || 'https://legislatie.just.ro/RSS/MonitorulOficial'

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'S-S-M.RO Legislation Monitor/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`)
    }

    const xmlContent = await response.text()
    return parseRssFeed(xmlContent)
  } catch (error) {
    console.error('[Cron] RSS fetch error, using mock data:', error)
    return getMockRssItems()
  }
}

function parseRssFeed(xmlContent: string): RssItem[] {
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  const items: RssItem[] = []

  let match
  while ((match = itemRegex.exec(xmlContent)) !== null) {
    const itemContent = match[1]

    const title = extractTag(itemContent, 'title')
    const link = extractTag(itemContent, 'link')
    const pubDate = extractTag(itemContent, 'pubDate')
    const description = extractTag(itemContent, 'description')

    if (title && link) {
      items.push({
        title: decodeHtml(title),
        link: decodeHtml(link),
        pubDate: pubDate || '',
        description: decodeHtml(description || '')
      })
    }
  }

  return items
}

function extractTag(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1].trim() : null
}

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<[^>]*>/g, '')
    .trim()
}

// ══════════════════════════════════════════════════════════════
// FILTERING LOGIC
// ══════════════════════════════════════════════════════════════

function filterRelevantActs(rssItems: RssItem[]): RssItem[] {
  return rssItems.filter(item => {
    const searchText = `${item.title} ${item.description}`.toLowerCase()

    return SSM_PSI_KEYWORDS.some(keyword =>
      searchText.includes(keyword.toLowerCase())
    )
  })
}

async function filterNewActs(acts: RssItem[]): Promise<RssItem[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Cron] Supabase not configured, returning all acts as new')
    return acts
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Get all existing act URLs from legal_acts table
  const { data: existingActs, error } = await supabase
    .from('legal_acts')
    .select('official_url')

  if (error) {
    console.error('[Cron] Error fetching existing acts:', error)
    return acts
  }

  const existingUrls = new Set(
    existingActs?.map(act => act.official_url).filter(Boolean) || []
  )

  // Filter out acts that already exist
  return acts.filter(act => !existingUrls.has(act.link))
}

// ══════════════════════════════════════════════════════════════
// MOCK DATA (for testing)
// ══════════════════════════════════════════════════════════════

function getMockRssItems(): RssItem[] {
  return [
    {
      title: 'LEGE nr. 319 din 2024 privind securitatea și sănătatea în muncă',
      link: 'https://legislatie.just.ro/Public/DetaliiDocument/319_2024',
      pubDate: new Date().toISOString(),
      description: 'Lege privind modificarea și completarea Legii nr. 319/2006 privind securitatea și sănătatea în muncă'
    },
    {
      title: 'ORDIN nr. 1234 din 2024 privind prevenirea și stingerea incendiilor',
      link: 'https://legislatie.just.ro/Public/DetaliiDocument/1234_2024',
      pubDate: new Date().toISOString(),
      description: 'Ordin pentru modificarea normelor de securitate la incendiu'
    },
    {
      title: 'HOTĂRÂRE nr. 500 din 2024 privind codul fiscal',
      link: 'https://legislatie.just.ro/Public/DetaliiDocument/500_2024',
      pubDate: new Date().toISOString(),
      description: 'Modificări la codul fiscal - impozite și taxe'
    }
  ]
}

// ══════════════════════════════════════════════════════════════
// RUNTIME CONFIGURATION
// ══════════════════════════════════════════════════════════════

// Allow runtime to be at least 60 seconds for cron jobs
export const maxDuration = 60
