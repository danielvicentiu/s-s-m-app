// FIȘIER: app/api/admin/legal-validate/route.ts
// M3: Validator structural — verifică completitudinea extracției AI
//
// Endpoint: POST /api/admin/legal-validate
// Body: { act_id: string } (un act) SAU { batch: true } (toate actele extrase)
//
// Validări:
// 1. Acoperire articole: câte articole din text au fost extrase vs total
// 2. Sancțiuni: sumele au sens (>0, min < max, range rezonabil)
// 3. Referințe: target acts există în DB?
// 4. Obligații: au article_ref valid, severity completă
// 5. Metadata: total_articles_found vs nr real din text

import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ==========================================
// TIPURI
// ==========================================

interface ValidationCheck {
  name: string
  status: 'ok' | 'warning' | 'error'
  message: string
  details?: any
}

interface ValidationResult {
  act_id: string
  act_short_name: string
  overall_status: 'ok' | 'warning' | 'error'
  score: number // 0-100
  checks: ValidationCheck[]
  validated_at: string
}

// ==========================================
// FUNCȚII VALIDARE
// ==========================================

/**
 * Numără articolele unice din full_text folosind regex
 */
function countArticlesInText(fullText: string): { total: number; articles: string[] } {
  // Pattern: Art. 1, Art. 12, Art. 123 (cu sau fără punct, cu sau fără spațiu)
  const articlePattern = /\bArt\.\s*(\d+)/gi
  const found = new Set<number>()
  let match

  while ((match = articlePattern.exec(fullText)) !== null) {
    found.add(parseInt(match[1]))
  }

  return {
    total: found.size,
    articles: Array.from(found).sort((a, b) => a - b).map(n => `Art. ${n}`),
  }
}

/**
 * Extrage articolele unice referențiate în obligații
 */
function getArticlesFromObligations(obligations: any[]): { total: number; articles: string[] } {
  const found = new Set<string>()
  for (const o of obligations) {
    if (o.article_ref) {
      // Extrage doar "Art. X" din "Art. X alin. (Y) lit. z)"
      const match = o.article_ref.match(/Art\.\s*(\d+)/i)
      if (match) {found.add(`Art. ${match[1]}`)}
    }
  }
  return {
    total: found.size,
    articles: Array.from(found).sort((a, b) => {
      const numA = parseInt(a.replace('Art. ', ''))
      const numB = parseInt(b.replace('Art. ', ''))
      return numA - numB
    }),
  }
}

/**
 * Validează un singur act
 */
async function validateAct(actId: string): Promise<ValidationResult> {
  const checks: ValidationCheck[] = []

  // 1. Citește actul din DB
  const { data: act, error: actError } = await supabaseAdmin
    .from('legal_acts')
    .select('id, act_short_name, act_type, full_text, full_text_metadata, ai_extraction_result, ai_extraction_date')
    .eq('id', actId)
    .single()

  if (actError || !act) {
    return {
      act_id: actId,
      act_short_name: 'NECUNOSCUT',
      overall_status: 'error',
      score: 0,
      checks: [{ name: 'act_exists', status: 'error', message: `Act negăsit: ${actError?.message || 'ID invalid'}` }],
      validated_at: new Date().toISOString(),
    }
  }

  if (!act.ai_extraction_result || !act.ai_extraction_date) {
    return {
      act_id: actId,
      act_short_name: act.act_short_name,
      overall_status: 'error',
      score: 0,
      checks: [{ name: 'has_extraction', status: 'error', message: 'Actul nu a fost extras cu AI. Rulează M2 întâi.' }],
      validated_at: new Date().toISOString(),
    }
  }

  const extraction = act.ai_extraction_result

  // ==========================================
  // CHECK 1: Acoperire articole
  // ==========================================
  const textArticles = countArticlesInText(act.full_text || '')
  const extractedArticles = getArticlesFromObligations(extraction.obligations || [])

  const coveragePercent = textArticles.total > 0
    ? Math.round((extractedArticles.total / textArticles.total) * 100)
    : 0

  // Articole din text care NU au fost extrase
  const missingArticles = textArticles.articles.filter(a => !extractedArticles.articles.includes(a))

  // Nu toate articolele conțin obligații — un coverage de 30%+ e normal
  // Sub 20% e warning, sub 10% e error
  const coverageStatus = coveragePercent >= 20 ? 'ok' : coveragePercent >= 10 ? 'warning' : 'error'

  checks.push({
    name: 'article_coverage',
    status: coverageStatus,
    message: `${extractedArticles.total}/${textArticles.total} articole au obligații extrase (${coveragePercent}%)`,
    details: {
      text_articles: textArticles.total,
      extracted_articles: extractedArticles.total,
      coverage_percent: coveragePercent,
      missing_articles: missingArticles.slice(0, 30), // Primele 30 lipsă
      missing_total: missingArticles.length,
    },
  })

  // ==========================================
  // CHECK 2: AI total_articles_found vs regex count
  // ==========================================
  const aiArticleCount = extraction.total_articles_found || 0
  const m1ArticleCount = act.full_text_metadata?.articles || 0
  const regexArticleCount = textArticles.total

  // Compară cele 3 surse
  const articleCountDiff = Math.abs(aiArticleCount - regexArticleCount)
  const articleCountStatus = articleCountDiff <= 5 ? 'ok' : articleCountDiff <= 20 ? 'warning' : 'error'

  checks.push({
    name: 'article_count_consistency',
    status: articleCountStatus,
    message: `Articole: AI=${aiArticleCount}, M1 regex=${m1ArticleCount}, M3 regex=${regexArticleCount} (diferență: ${articleCountDiff})`,
    details: {
      ai_count: aiArticleCount,
      m1_count: m1ArticleCount,
      m3_count: regexArticleCount,
      difference: articleCountDiff,
    },
  })

  // ==========================================
  // CHECK 3: Obligații — calitate
  // ==========================================
  const obligations = extraction.obligations || []
  const oblWithoutArticle = obligations.filter((o: any) => !o.article_ref || o.article_ref.trim() === '')
  const oblWithoutSeverity = obligations.filter((o: any) => !o.severity)
  const oblWithoutType = obligations.filter((o: any) => !o.obligation_type)
  const oblLowConfidence = obligations.filter((o: any) => o.confidence === 'low')

  const oblIssues = oblWithoutArticle.length + oblWithoutSeverity.length + oblWithoutType.length
  const oblStatus = oblIssues === 0 ? 'ok' : oblIssues <= 3 ? 'warning' : 'error'

  checks.push({
    name: 'obligations_quality',
    status: oblStatus,
    message: `${obligations.length} obligații: ${oblWithoutArticle.length} fără articol, ${oblWithoutSeverity.length} fără severity, ${oblLowConfidence.length} low confidence`,
    details: {
      total: obligations.length,
      without_article: oblWithoutArticle.length,
      without_severity: oblWithoutSeverity.length,
      without_type: oblWithoutType.length,
      low_confidence: oblLowConfidence.length,
      by_type: {
        employer: obligations.filter((o: any) => o.obligation_type === 'employer').length,
        employee: obligations.filter((o: any) => o.obligation_type === 'employee').length,
        sepp: obligations.filter((o: any) => o.obligation_type === 'sepp').length,
        authority: obligations.filter((o: any) => o.obligation_type === 'authority').length,
        general: obligations.filter((o: any) => o.obligation_type === 'general').length,
      },
      by_severity: {
        critical: obligations.filter((o: any) => o.severity === 'critical').length,
        important: obligations.filter((o: any) => o.severity === 'important').length,
        informative: obligations.filter((o: any) => o.severity === 'informative').length,
      },
    },
  })

  // ==========================================
  // CHECK 4: Sancțiuni — validitate sume
  // ==========================================
  const penalties = extraction.penalties || []
  const penaltyIssues: string[] = []

  for (const p of penalties) {
    if (p.min_amount_lei != null && p.min_amount_lei < 0) {
      penaltyIssues.push(`${p.article_ref}: min negativ (${p.min_amount_lei})`)
    }
    if (p.max_amount_lei != null && p.max_amount_lei < 0) {
      penaltyIssues.push(`${p.article_ref}: max negativ (${p.max_amount_lei})`)
    }
    if (p.min_amount_lei != null && p.max_amount_lei != null && p.min_amount_lei > p.max_amount_lei) {
      penaltyIssues.push(`${p.article_ref}: min (${p.min_amount_lei}) > max (${p.max_amount_lei})`)
    }
    // Sancțiuni SSM tipice: 2.000 - 200.000 LEI. Peste 1.000.000 e suspect
    if (p.max_amount_lei != null && p.max_amount_lei > 1_000_000) {
      penaltyIssues.push(`${p.article_ref}: sumă suspecta mare (${p.max_amount_lei} LEI)`)
    }
    if (p.min_amount_lei != null && p.min_amount_lei > 0 && p.min_amount_lei < 100) {
      penaltyIssues.push(`${p.article_ref}: sumă suspecta mică (${p.min_amount_lei} LEI)`)
    }
  }

  const penStatus = penaltyIssues.length === 0 ? 'ok' : penaltyIssues.length <= 2 ? 'warning' : 'error'

  checks.push({
    name: 'penalties_validity',
    status: penalties.length === 0 ? 'ok' : penStatus,
    message: penalties.length === 0
      ? 'Fără sancțiuni (poate fi corect — nu toate actele au sancțiuni)'
      : `${penalties.length} sancțiuni, ${penaltyIssues.length} probleme`,
    details: {
      total: penalties.length,
      issues: penaltyIssues,
      range: penalties.length > 0 ? {
        min: Math.min(...penalties.filter((p: any) => p.min_amount_lei != null).map((p: any) => p.min_amount_lei)),
        max: Math.max(...penalties.filter((p: any) => p.max_amount_lei != null).map((p: any) => p.max_amount_lei)),
      } : null,
    },
  })

  // ==========================================
  // CHECK 5: Referințe — target acts există în DB?
  // ==========================================
  const crossRefs = extraction.cross_references || []
  let refsInDB = 0
  let refsMissing = 0
  const missingRefs: any[] = []

  if (crossRefs.length > 0) {
    // Citește toate actele din DB pentru comparare
    const { data: allActs } = await supabaseAdmin
      .from('legal_acts')
      .select('id, act_type, act_number, act_year')

    const actMap = new Map<string, string>()
    for (const a of allActs || []) {
      const key = `${a.act_type}-${a.act_number}-${a.act_year}`
      actMap.set(key, a.id)
    }

    for (const cr of crossRefs) {
      const key = `${cr.target_act_type}-${cr.target_act_number}-${cr.target_act_year}`
      if (actMap.has(key)) {
        refsInDB++
      } else {
        refsMissing++
        missingRefs.push({
          target: `${cr.target_act_type} ${cr.target_act_number}/${cr.target_act_year}`,
          source_article: cr.source_article,
          type: cr.reference_type,
        })
      }
    }
  }

  const refsStatus = crossRefs.length === 0 ? 'ok'
    : refsMissing === 0 ? 'ok'
    : refsMissing <= crossRefs.length * 0.5 ? 'warning'
    : 'error'

  checks.push({
    name: 'cross_references',
    status: refsStatus,
    message: crossRefs.length === 0
      ? 'Fără referințe încrucișate'
      : `${crossRefs.length} referințe: ${refsInDB} în DB, ${refsMissing} lipsă (acte neimportate)`,
    details: {
      total: crossRefs.length,
      in_db: refsInDB,
      missing: refsMissing,
      missing_acts: missingRefs.slice(0, 20),
    },
  })

  // ==========================================
  // CHECK 6: Definiții — are sens?
  // ==========================================
  const definitions = extraction.key_definitions || []
  const defsWithoutArticle = definitions.filter((d: any) => !d.article_ref)
  const defsWithoutDefinition = definitions.filter((d: any) => !d.definition || d.definition.trim().length < 10)

  checks.push({
    name: 'definitions_quality',
    status: defsWithoutArticle.length === 0 && defsWithoutDefinition.length === 0 ? 'ok' : 'warning',
    message: `${definitions.length} definiții: ${defsWithoutArticle.length} fără articol, ${defsWithoutDefinition.length} incomplete`,
    details: {
      total: definitions.length,
      without_article: defsWithoutArticle.length,
      incomplete: defsWithoutDefinition.length,
    },
  })

  // ==========================================
  // SCOR GENERAL
  // ==========================================
  const weights: Record<string, number> = {
    article_coverage: 25,
    article_count_consistency: 15,
    obligations_quality: 25,
    penalties_validity: 15,
    cross_references: 10,
    definitions_quality: 10,
  }

  let score = 0
  let overallStatus: 'ok' | 'warning' | 'error' = 'ok'

  for (const check of checks) {
    const weight = weights[check.name] || 10
    if (check.status === 'ok') {score += weight}
    else if (check.status === 'warning') {score += weight * 0.5}
    // error = 0 points

    if (check.status === 'error') {overallStatus = 'error'}
    else if (check.status === 'warning' && overallStatus !== 'error') {overallStatus = 'warning'}
  }

  score = Math.round(score)

  const result: ValidationResult = {
    act_id: actId,
    act_short_name: act.act_short_name,
    overall_status: overallStatus,
    score,
    checks,
    validated_at: new Date().toISOString(),
  }

  // Salvează rezultatul în DB
  await supabaseAdmin
    .from('legal_acts')
    .update({
      validation_result: result,
      validation_date: result.validated_at,
      updated_at: new Date().toISOString(),
    })
    .eq('id', actId)

  return result
}

// ==========================================
// POST: Validează un act sau batch
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { act_id, batch } = body

    if (!act_id && !batch) {
      return NextResponse.json(
        { error: 'Trimite act_id (un act) sau batch: true (toate actele extrase).' },
        { status: 400 }
      )
    }

    // Validare un singur act
    if (act_id) {
      const result = await validateAct(act_id)
      return NextResponse.json({ success: true, result })
    }

    // Batch — validează toate actele extrase cu AI
    const { data: extractedActs, error: fetchError } = await supabaseAdmin
      .from('legal_acts')
      .select('id')
      .not('ai_extraction_date', 'is', null)
      .order('act_year', { ascending: true })

    if (fetchError || !extractedActs) {
      return NextResponse.json(
        { error: `Eroare la citirea actelor: ${fetchError?.message}` },
        { status: 500 }
      )
    }

    if (extractedActs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Niciun act extras cu AI. Rulează M2 întâi.',
        results: [],
      })
    }

    // Validează fiecare act
    const results: ValidationResult[] = []
    for (const act of extractedActs) {
      const result = await validateAct(act.id)
      results.push(result)
    }

    // Statistici batch
    const batchStats = {
      total: results.length,
      ok: results.filter(r => r.overall_status === 'ok').length,
      warning: results.filter(r => r.overall_status === 'warning').length,
      error: results.filter(r => r.overall_status === 'error').length,
      avg_score: Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length),
    }

    return NextResponse.json({
      success: true,
      batch_stats: batchStats,
      results,
    })

  } catch (err: any) {
    console.error('[M3] Validation error:', err)
    return NextResponse.json(
      { error: err.message || 'Eroare la validare.' },
      { status: 500 }
    )
  }
}
