// S-S-M.RO — API Routes: Training Sessions CRUD
// GET: Listare sesiuni de instruire cu filtrare
// POST: Înregistrare sesiune nouă cu validare ITM compliance

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { TrainingSession, RecordSessionPayload, VerificationResult } from '@/lib/training-types'

// ────────────────────────────────────────────────────────────
// GET /api/trainings/sessions
// Query params: page, limit, organization_id, worker_id, module_id, verification_result, session_date_from, session_date_to
// ────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Verificare autentificare
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautentificat' },
        { status: 401 }
      )
    }

    // Extragere parametri query
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const organizationId = searchParams.get('organization_id')
    const workerId = searchParams.get('worker_id')
    const moduleId = searchParams.get('module_id')
    const verificationResult = searchParams.get('verification_result')
    const sessionDateFrom = searchParams.get('session_date_from')
    const sessionDateTo = searchParams.get('session_date_to')

    // Validare parametri
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parametri invalizi: page >= 1, limit între 1-100' },
        { status: 400 }
      )
    }

    // Construire query cu RLS automat aplicat
    let query = supabase
      .from('training_sessions')
      .select(`
        *,
        training_modules(id, code, title, category, training_type),
        profiles(id, full_name, email),
        organizations(id, name)
      `, { count: 'exact' })
      .order('session_date', { ascending: false })

    // Filtrare după organization_id
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    // Filtrare după worker_id
    if (workerId) {
      query = query.eq('worker_id', workerId)
    }

    // Filtrare după module_id
    if (moduleId) {
      query = query.eq('module_id', moduleId)
    }

    // Filtrare după verification_result
    if (verificationResult) {
      query = query.eq('verification_result', verificationResult)
    }

    // Filtrare după session_date (de la)
    if (sessionDateFrom) {
      query = query.gte('session_date', sessionDateFrom)
    }

    // Filtrare după session_date (până la)
    if (sessionDateTo) {
      query = query.lte('session_date', sessionDateTo)
    }

    // Paginare
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching training sessions:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea sesiunilor de instruire' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as TrainingSession[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/trainings/sessions:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// POST /api/trainings/sessions
// Body: RecordSessionPayload (instructor_name este OBLIGATORIU pentru ITM)
// ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Verificare autentificare
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautentificat' },
        { status: 401 }
      )
    }

    // Parsare body
    const body: RecordSessionPayload = await request.json()
    const {
      organization_id,
      module_id,
      worker_id,
      instructor_name,
      session_date,
      duration_minutes,
      language,
      location,
      test_score,
      test_questions_total,
      test_questions_correct
    } = body

    // Validare câmpuri obligatorii
    if (!organization_id || typeof organization_id !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: organization_id (UUID string)' },
        { status: 400 }
      )
    }

    if (!module_id || typeof module_id !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: module_id (UUID string)' },
        { status: 400 }
      )
    }

    if (!worker_id || typeof worker_id !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: worker_id (UUID string)' },
        { status: 400 }
      )
    }

    // CRITICAL: instructor_name este OBLIGATORIU pentru compliance ITM
    if (!instructor_name || typeof instructor_name !== 'string' || instructor_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Câmp OBLIGATORIU pentru ITM: instructor_name (string non-gol)' },
        { status: 400 }
      )
    }

    if (!session_date || typeof session_date !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: session_date (YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    if (!duration_minutes || typeof duration_minutes !== 'number' || duration_minutes <= 0) {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: duration_minutes (număr pozitiv)' },
        { status: 400 }
      )
    }

    // Validare session_date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(session_date)) {
      return NextResponse.json(
        { error: 'Format session_date invalid (așteptat YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validare test_score (dacă este furnizat)
    if (test_score !== undefined && test_score !== null) {
      if (typeof test_score !== 'number' || test_score < 0 || test_score > 100) {
        return NextResponse.json(
          { error: 'test_score trebuie să fie între 0 și 100' },
          { status: 400 }
        )
      }
    }

    // Validare test questions (dacă sunt furnizate)
    if (test_questions_total !== undefined && test_questions_total !== null) {
      if (typeof test_questions_total !== 'number' || test_questions_total < 0) {
        return NextResponse.json(
          { error: 'test_questions_total trebuie să fie un număr pozitiv' },
          { status: 400 }
        )
      }
    }

    if (test_questions_correct !== undefined && test_questions_correct !== null) {
      if (typeof test_questions_correct !== 'number' || test_questions_correct < 0) {
        return NextResponse.json(
          { error: 'test_questions_correct trebuie să fie un număr pozitiv' },
          { status: 400 }
        )
      }

      if (test_questions_total !== undefined && test_questions_correct > test_questions_total) {
        return NextResponse.json(
          { error: 'test_questions_correct nu poate fi mai mare decât test_questions_total' },
          { status: 400 }
        )
      }
    }

    // Calcul automat test_score dacă nu e furnizat dar avem questions
    let finalTestScore = test_score
    if (!finalTestScore && test_questions_total && test_questions_correct !== undefined) {
      finalTestScore = Math.round((test_questions_correct / test_questions_total) * 100)
    }

    // Determinare verification_result bazat pe test_score și modulul specificat
    let verificationResult: VerificationResult = 'pending'

    // Fetch module pentru a obține min_pass_score
    const { data: module, error: moduleError } = await supabase
      .from('training_modules')
      .select('id, min_pass_score, is_active')
      .eq('id', module_id)
      .single()

    if (moduleError || !module) {
      return NextResponse.json(
        { error: 'Modulul de instruire specificat nu există' },
        { status: 404 }
      )
    }

    if (!module.is_active) {
      return NextResponse.json(
        { error: 'Modulul de instruire specificat nu este activ' },
        { status: 400 }
      )
    }

    // Dacă avem test_score, determinăm rezultatul
    if (finalTestScore !== undefined && finalTestScore !== null) {
      verificationResult = finalTestScore >= module.min_pass_score ? 'admis' : 'respins'
    }

    // Verificare worker există
    const { data: worker, error: workerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', worker_id)
      .single()

    if (workerError || !worker) {
      return NextResponse.json(
        { error: 'Lucrătorul specificat nu există' },
        { status: 404 }
      )
    }

    // Construire obiect session
    const sessionData = {
      organization_id,
      module_id,
      worker_id,
      instructor_name: instructor_name.trim(),
      session_date,
      duration_minutes,
      language: language || 'ro',
      location: location || null,
      test_score: finalTestScore || null,
      test_questions_total: test_questions_total || null,
      test_questions_correct: test_questions_correct || null,
      verification_result: verificationResult,
      audit_trail: {
        created_by: user.id,
        created_at: new Date().toISOString(),
        user_agent: request.headers.get('user-agent') || 'unknown'
      }
    }

    // Insert în DB cu RLS automat aplicat
    const { data, error } = await supabase
      .from('training_sessions')
      .insert([sessionData])
      .select(`
        *,
        training_modules(id, code, title, category),
        profiles(id, full_name, email)
      `)
      .single()

    if (error) {
      console.error('Error creating training session:', error)

      // Verificare erori comune
      if (error.code === '23503') {
        return NextResponse.json(
          { error: 'Organizația, modulul sau lucrătorul specificat nu există sau nu aveți acces' },
          { status: 400 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a înregistra sesiuni de instruire pentru această organizație' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la crearea sesiunii de instruire' },
        { status: 500 }
      )
    }

    // Actualizare automată a training_assignment asociat (dacă există)
    // Setăm status = 'completed' și session_id
    const { error: updateError } = await supabase
      .from('training_assignments')
      .update({
        status: verificationResult === 'admis' ? 'completed' : 'in_progress',
        session_id: data.id,
        completed_at: verificationResult === 'admis' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('organization_id', organization_id)
      .eq('module_id', module_id)
      .eq('worker_id', worker_id)
      .in('status', ['assigned', 'in_progress', 'overdue'])

    if (updateError) {
      console.warn('Warning: Could not update training_assignment:', updateError)
      // Nu returnăm eroare, sesiunea a fost creată cu succes
    }

    return NextResponse.json({
      data: data as TrainingSession,
      message: 'Sesiune de instruire înregistrată cu succes'
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/trainings/sessions:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
