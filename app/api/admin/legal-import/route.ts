// FIȘIER: app/[locale]/admin/legal-import/api/route.ts
// SAU: app/api/admin/legal-import/route.ts (depinde de structura ta)
//
// INSTRUCȚIUNI: Copiază acest fișier în locația potrivită din proiect.
// Dacă ai API routes în app/api/, pune-l acolo.
// Dacă nu, creează app/[locale]/admin/legal-import/api/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Server-side Supabase client (cu service role key pentru insert fără RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ==========================================
// REGEX PATTERNS pentru auto-detect metadata
// ==========================================

const PATTERNS = {
  // Detectează: HOTĂRÂRE nr. 1425 din 11 octombrie 2006
  // sau: LEGE nr. 319 din 14 iulie 2006
  // sau: ORDONANȚĂ DE URGENȚĂ nr. 36 din 2021
  actType: /^(HOTĂRÂRE|LEGE|ORDONANȚĂ DE URGENȚĂ|ORDONANȚĂ|ORDIN|DECIZIE|REGULAMENT|NORMĂ|INSTRUCȚIUNE)/im,

  actNumber: /nr\.\s*([\d.]+)/i,

  actYear: /din\s+\d{1,2}\s+\w+\s+(\d{4})/i,
  actYearAlt: /\/(\d{4})/,  // fallback: 1425/2006

  // Monitorul Oficial nr. 882 din 30 octombrie 2006
  // sau: Publicat în MONITORUL OFICIAL nr. 882 din 30.10.2006
  officialJournal: /MONITORUL\s+OFICIAL\s+(?:AL\s+ROMÂNIEI\s+)?(?:,\s*PARTEA\s+I\s*,?\s*)?nr\.\s*([\d.]+)\s+din\s+([\d\w\s.]+\d{4})/i,

  // Directiva 89/391/CEE sau Directiva 2003/88/CE
  euDirective: /Directiv[aă]\s+([\d\/]+\/CE[E]?)/gi,

  // Contoare structurale
  articles: /Art(?:icolul|\.)?\s*(\d+)/gi,
  chapters: /CAP(?:ITOLUL|\.)?\s*([\dIVXLC]+)/gi,
  sections: /SECȚIUNEA\s*([\dIVXLC]+)/gi,
  annexes: /ANEX[AĂ]\s*([\dIVXLC]+)/gi,
  alineat: /alin\.\s*[\(\[]?(\d+)/gi,
}

// Mapare tip act din text în cod scurt
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
}

// ==========================================
// FUNCȚIE: Extrage metadata din text
// ==========================================

export function extractMetadata(text: string) {
  const firstLines = text.substring(0, 2000) // Primele 2000 caractere pentru metadata

  // Tip act
  const typeMatch = firstLines.match(PATTERNS.actType)
  const rawType = typeMatch ? typeMatch[1].toUpperCase() : null
  const actType = rawType ? (ACT_TYPE_MAP[rawType] || rawType) : null

  // Număr act (suportă punct separator de mii: "nr. 1.425" → "1425")
  // Fix special: Norme Metodologice nu au nr. propriu — preiau de la HG-ul părinte
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

  // An act
  const yearMatch = firstLines.match(PATTERNS.actYear)
  const actYearAlt = firstLines.match(PATTERNS.actYearAlt)
  const actYear = yearMatch ? parseInt(yearMatch[1]) : (actYearAlt ? parseInt(actYearAlt[1]) : null)

  // Monitorul Oficial (strip punct separator de mii)
  const mojMatch = firstLines.match(PATTERNS.officialJournal)
  const officialJournal = mojMatch ? `M.Of. nr. ${mojMatch[1].replace(/\./g, '')} din ${mojMatch[2].trim()}` : null

  // Directive UE
  const euDirectives: string[] = []
  let euMatch
  while ((euMatch = PATTERNS.euDirective.exec(firstLines)) !== null) {
    euDirectives.push(euMatch[1])
  }

  // Titlu complet — caută până la newline dublu, EMITENT, Publicat sau MONITORUL
  const titleMatch = firstLines.match(/(privind|pentru aprobarea|referitoare la)([\s\S]*?)(?=\n\s*\n|\n\s*EMITENT|\n\s*Publicat|\n\s*MONITORUL|$)/i)
  const titleSuffix = titleMatch ? (titleMatch[1] + titleMatch[2]).replace(/\s+/g, ' ').trim() : ''

  const actFullName = actType && actNumber && actYear
    ? `${actType} ${actNumber}/${actYear} ${titleSuffix}`
    : ''

  const actShortName = actType && actNumber && actYear
    ? `${actType} ${actNumber}/${actYear}`
    : ''

  // ==========================================
  // CONTOARE STRUCTURALE (fără AI, doar regex)
  // ==========================================

  // Resetăm lastIndex pentru regex globale
  PATTERNS.articles.lastIndex = 0
  PATTERNS.chapters.lastIndex = 0
  PATTERNS.sections.lastIndex = 0
  PATTERNS.annexes.lastIndex = 0
  PATTERNS.alineat.lastIndex = 0

  const articleNumbers = new Set<string>()
  let artMatch
  while ((artMatch = PATTERNS.articles.exec(text)) !== null) {
    articleNumbers.add(artMatch[1])
  }

  const chapterNumbers = new Set<string>()
  let chapMatch
  while ((chapMatch = PATTERNS.chapters.exec(text)) !== null) {
    chapterNumbers.add(chapMatch[1])
  }

  const sectionNumbers = new Set<string>()
  let secMatch
  while ((secMatch = PATTERNS.sections.exec(text)) !== null) {
    sectionNumbers.add(secMatch[1])
  }

  const annexNumbers = new Set<string>()
  let annMatch
  while ((annMatch = PATTERNS.annexes.exec(text)) !== null) {
    annexNumbers.add(annMatch[1])
  }

  const alineatCount = (text.match(PATTERNS.alineat) || []).length

  const metadata = {
    actType,
    actNumber,
    actYear,
    actFullName,
    actShortName,
    officialJournal,
    euDirectives,
    counts: {
      articles: articleNumbers.size,
      chapters: chapterNumbers.size,
      sections: sectionNumbers.size,
      annexes: annexNumbers.size,
      alineate: alineatCount,
      characters: text.length,
      estimatedTokens: Math.round(text.length / 4),
    },
  }

  return metadata
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
      status,
      country_code,
      eu_directives,
      full_text_metadata,
      notes,
    } = body

    // Validare minimală
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
      // UPDATE (upsert) — actualizează textul existent
      const { data, error } = await supabaseAdmin
        .from('legal_acts')
        .update({
          full_text,
          act_full_name: act_full_name || existing.act_short_name,
          act_short_name: act_short_name || existing.act_short_name,
          official_journal,
          full_text_metadata,
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
        domain: domain || 'SSM',
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

// ==========================================
// GET: Auto-detect metadata (fără insert)
// Folosit pentru preview înainte de import
// ==========================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Text prea scurt pentru analiză.' },
        { status: 400 }
      )
    }

    const metadata = extractMetadata(text)

    return NextResponse.json({
      success: true,
      metadata,
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
