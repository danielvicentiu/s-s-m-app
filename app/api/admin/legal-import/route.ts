// FIȘIER: app/api/admin/legal-import/route.ts
// M1: Import legislativ — fetch URL + auto-detect metadata + insert/update în DB

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ==========================================
// REGEX PATTERNS pentru auto-detect metadata
// ==========================================

const PATTERNS = {
  actType: /^(HOTĂRÂRE|LEGE|ORDONANȚĂ DE URGENȚĂ|ORDONANȚĂ|ORDIN|DECIZIE|REGULAMENT|NORMĂ|INSTRUCȚIUNE|COD)/im,
  actNumber: /nr\.\s*([\d.]+)/i,
  actYear: /din\s+\d{1,2}\s+\w+\s+(\d{4})/i,
  actYearAlt: /\/(\d{4})/,
  officialJournal: /MONITORUL\s+OFICIAL\s+(?:AL\s+ROMÂNIEI\s+)?(?:,\s*PARTEA\s+I\s*,?\s*)?nr\.\s*([\d.]+)\s+din\s+([\d\w\s.]+\d{4})/i,
  euDirective: /Directiv[aă]\s+([\d\/]+\/CE[E]?)/gi,
  articles: /Art(?:icolul|\.)?\s*(\d+)/gi,
  chapters: /CAP(?:ITOLUL|\.)?\s*([\dIVXLC]+)/gi,
  sections: /SECȚIUNEA\s*([\dIVXLC]+)/gi,
  annexes: /ANEX[AĂ]\s*([\dIVXLC]+)/gi,
  alineat: /alin\.\s*[\(\[]?(\d+)/gi,
}

const ACT_TYPE_MAP: Record<string, string> = {
  'HOTĂRÂRE': 'HG',
  'LEGE': 'LEGE',
  'ORDONANȚĂ DE URGENȚĂ': 'OUG',
  'ORDONANȚĂ': 'OG',
  'ORDIN': 'ORDIN',
  'DECIZIE': 'DECIZIE',
  'REGULAMENT': 'REGULAMENT',
  'NORMĂ': 'NORMA',
  'INSTRUCȚIUNE': 'INSTRUCTIUNE',
  'COD': 'COD',
}

// ==========================================
// FUNCȚIE: Extrage metadata din text
// ==========================================

export function extractMetadata(text: string) {
  const firstLines = text.substring(0, 2000)

  const typeMatch = firstLines.match(PATTERNS.actType)
  const rawType = typeMatch ? typeMatch[1].toUpperCase() : null
  const actType = rawType ? (ACT_TYPE_MAP[rawType] || rawType) : null

  // Număr act — Norme Metodologice preiau nr de la HG părinte
  let actNumber: string | null = null
  const isNorme = /^(NORME?\s+METODOLOGIC[EĂ]|NORME?\s+GENERALE|NORME?\s+TEHNICE|NORME?\s+DE\s+APLICARE)/im.test(firstLines)

  if (isNorme) {
    const hgParentMatch = firstLines.match(/(?:Hotărâr(?:ii|ea)\s+Guvernului|H\.?G\.?)\s+nr\.\s*([\d.]+)/i)
    if (hgParentMatch) {
      actNumber = hgParentMatch[1].replace(/\./g, '')
    }
  }

  if (!actNumber) {
    const numberMatch = firstLines.match(PATTERNS.actNumber)
    actNumber = numberMatch ? numberMatch[1].replace(/\./g, '') : null
  }

  const yearMatch = firstLines.match(PATTERNS.actYear)
  const actYearAlt = firstLines.match(PATTERNS.actYearAlt)
  const actYear = yearMatch ? parseInt(yearMatch[1]) : (actYearAlt ? parseInt(actYearAlt[1]) : null)

  const mojMatch = firstLines.match(PATTERNS.officialJournal)
  const officialJournal = mojMatch ? `M.Of. nr. ${mojMatch[1].replace(/\./g, '')} din ${mojMatch[2].trim()}` : null

  const euDirectives: string[] = []
  let euMatch
  PATTERNS.euDirective.lastIndex = 0
  while ((euMatch = PATTERNS.euDirective.exec(firstLines)) !== null) {
    euDirectives.push(euMatch[1])
  }

  const titleMatch = firstLines.match(/(privind|pentru aprobarea|referitoare la)([\s\S]*?)(?=\n\s*\n|\n\s*EMITENT|\n\s*Publicat|\n\s*MONITORUL|$)/i)
  const titleSuffix = titleMatch ? (titleMatch[1] + titleMatch[2]).replace(/\s+/g, ' ').trim() : ''

  const actFullName = actType && actNumber && actYear
    ? `${actType} nr. ${actNumber}/${actYear} ${titleSuffix}`
    : ''

  const actShortName = actType && actNumber && actYear
    ? `${actType} ${actNumber}/${actYear}`
    : ''

  // Contoare structurale
  PATTERNS.articles.lastIndex = 0
  PATTERNS.chapters.lastIndex = 0
  PATTERNS.sections.lastIndex = 0
  PATTERNS.annexes.lastIndex = 0
  PATTERNS.alineat.lastIndex = 0

  const sets = { articles: new Set<string>(), chapters: new Set<string>(), sections: new Set<string>(), annexes: new Set<string>() }
  let m
  while ((m = PATTERNS.articles.exec(text)) !== null) sets.articles.add(m[1])
  while ((m = PATTERNS.chapters.exec(text)) !== null) sets.chapters.add(m[1])
  while ((m = PATTERNS.sections.exec(text)) !== null) sets.sections.add(m[1])
  while ((m = PATTERNS.annexes.exec(text)) !== null) sets.annexes.add(m[1])
  const alineatCount = (text.match(PATTERNS.alineat) || []).length

  return {
    actType, actNumber, actYear, actFullName, actShortName, officialJournal, euDirectives,
    counts: {
      articles: sets.articles.size,
      chapters: sets.chapters.size,
      sections: sets.sections.size,
      annexes: sets.annexes.size,
      alineate: alineatCount,
      characters: text.length,
      estimatedTokens: Math.round(text.length / 4),
    },
  }
}

// ==========================================
// PUT: Fetch text de pe legislatie.just.ro
// ==========================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL-ul este obligatoriu.' }, { status: 400 })
    }

    // Validare URL — trebuie să fie de pe legislatie.just.ro
    const parsedUrl = new URL(url)
    if (!parsedUrl.hostname.includes('legislatie.just.ro')) {
      return NextResponse.json(
        { error: 'URL-ul trebuie să fie de pe legislatie.just.ro' },
        { status: 400 }
      )
    }

    // Fetch pagina
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.8',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Eroare la descărcare: HTTP ${response.status} ${response.statusText}` },
        { status: 502 }
      )
    }

    const html = await response.text()

    // Extrage textul din HTML
    // legislatie.just.ro folosește <div class="act-content"> sau <pre> sau <div id="textActAct">
    let extractedText = ''

    // Strategia 1: Caută div cu conținutul actului
    const contentPatterns = [
      /<div[^>]*id="textActAct"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="act-content"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="document-content"[^>]*>([\s\S]*?)<\/div>/i,
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
    ]

    for (const pattern of contentPatterns) {
      const match = html.match(pattern)
      if (match && match[1] && match[1].length > 500) {
        extractedText = match[1]
        break
      }
    }

    // Strategia 2: Fallback — extrage tot textul din body
    if (!extractedText || extractedText.length < 500) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      if (bodyMatch) {
        extractedText = bodyMatch[1]
      }
    }

    // Curăță HTML → text plain
    extractedText = extractedText
      // Înlocuiește <br>, <p>, <div> cu newline
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      // Elimină toate tagurile HTML rămase
      .replace(/<[^>]+>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
      .replace(/&([a-z]+);/gi, ' ')
      // Curăță spații multiple
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    if (extractedText.length < 100) {
      return NextResponse.json(
        { error: 'Nu am putut extrage text suficient din pagina indicată. Încearcă să copiezi manual textul (Ctrl+A → Ctrl+C) de pe pagina „Text actualizat".' },
        { status: 422 }
      )
    }

    // Extrage metadata din textul obținut
    const metadata = extractMetadata(extractedText)

    return NextResponse.json({
      success: true,
      text: extractedText,
      metadata,
      source_url: url,
      characters: extractedText.length,
    })

  } catch (err: any) {
    console.error('[M1] URL fetch error:', err)

    // Eroare specifică pentru domenii blocate (egress proxy)
    if (err.message?.includes('fetch') || err.cause?.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Nu pot accesa legislatie.just.ro — domeniul poate fi blocat de proxy. Folosește metoda manuală: copiază textul de pe site (Ctrl+A → Ctrl+C) și lipește-l în câmpul de text.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { error: err.message || 'Eroare la descărcarea paginii.' },
      { status: 500 }
    )
  }
}

// ==========================================
// POST: Import legal act into Supabase
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      full_text,
      act_type,
      act_number,
      act_year,
      act_full_name,
      act_short_name,
      official_journal,
      domain,
      domains,
      subdomains,
      status,
      country_code,
      eu_directives,
      full_text_metadata,
      notes,
    } = body

    if (!full_text || full_text.length < 100) {
      return NextResponse.json(
        { error: 'Textul legii trebuie să aibă minim 100 de caractere.' },
        { status: 400 }
      )
    }

    if (!act_type || !act_number || !act_year) {
      return NextResponse.json(
        { error: 'Tip act, număr și an sunt obligatorii.' },
        { status: 400 }
      )
    }

    // Verificare duplicat
    const { data: existing } = await supabaseAdmin
      .from('legal_acts')
      .select('id, act_short_name')
      .eq('act_type', act_type)
      .eq('act_number', String(act_number))
      .eq('act_year', act_year)
      .eq('country_code', country_code || 'RO')
      .maybeSingle()

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('legal_acts')
        .update({
          full_text,
          act_full_name: act_full_name || existing.act_short_name,
          act_short_name: act_short_name || existing.act_short_name,
          official_journal,
          full_text_metadata,
          domains: domains || null,
          subdomains: subdomains || null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        action: 'updated',
        message: `${act_short_name} actualizat cu succes. Textul anterior a fost înlocuit.`,
        data,
      })
    }

    // INSERT nou
    const { data, error } = await supabaseAdmin
      .from('legal_acts')
      .insert({
        full_text,
        act_type,
        act_number: String(act_number),
        act_year,
        act_full_name: act_full_name || `${act_type} ${act_number}/${act_year}`,
        act_short_name: act_short_name || `${act_type} ${act_number}/${act_year}`,
        official_journal: official_journal || null,
        domain: domain || (domains && domains[0]) || 'SSM',
        domains: domains || (domain ? [domain] : ['SSM']),
        subdomains: subdomains || [],
        status: status || 'in_vigoare',
        country_code: country_code || 'RO',
        full_text_metadata,
        notes: notes || null,
        relevant_for_platform: true,
        confidence_level: 'imported_raw',
        research_phase: 'text_imported',
        research_source: 'legislatie.just.ro',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      action: 'inserted',
      message: `${act_short_name || act_type + ' ' + act_number + '/' + act_year} importat cu succes!`,
      data,
    })

  } catch (err: any) {
    console.error('Legal import error:', err)
    return NextResponse.json(
      { error: err.message || 'Eroare la import.' },
      { status: 500 }
    )
  }
}
