// S-S-M.RO — API Routes: Training Assignments CRUD
// GET: Listare assignments cu filtrare per status și dată
// POST: Creare assignments noi cu validare

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { TrainingAssignment, AssignTrainingPayload } from '@/lib/training-types'

// ────────────────────────────────────────────────────────────
// GET /api/trainings
// Query params: page, limit, organization_id, status, worker_id, module_id, due_before, due_after
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
    const status = searchParams.get('status')
    const workerId = searchParams.get('worker_id')
    const moduleId = searchParams.get('module_id')
    const dueBefore = searchParams.get('due_before')
    const dueAfter = searchParams.get('due_after')

    // Validare parametri
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parametri invalizi: page >= 1, limit între 1-100' },
        { status: 400 }
      )
    }

    // Construire query cu RLS automat aplicat
    let query = supabase
      .from('training_assignments')
      .select(`
        *,
        training_modules(id, code, title, category, training_type),
        profiles!training_assignments_worker_id_fkey(id, full_name, email),
        training_sessions(id, session_date, test_score, verification_result)
      `, { count: 'exact' })
      .order('assigned_at', { ascending: false })

    // Filtrare după organization_id
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    // Filtrare după status
    if (status) {
      query = query.eq('status', status)
    }

    // Filtrare după worker_id
    if (workerId) {
      query = query.eq('worker_id', workerId)
    }

    // Filtrare după module_id
    if (moduleId) {
      query = query.eq('module_id', moduleId)
    }

    // Filtrare după due_date (înainte de)
    if (dueBefore) {
      query = query.lte('due_date', dueBefore)
    }

    // Filtrare după due_date (după)
    if (dueAfter) {
      query = query.gte('due_date', dueAfter)
    }

    // Paginare
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching training assignments:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea atribuirilor de instruire' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as TrainingAssignment[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/trainings:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// POST /api/trainings
// Body: AssignTrainingPayload { organization_id, module_id, worker_ids[], assigned_by, due_date? }
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
    const body: AssignTrainingPayload = await request.json()
    const {
      organization_id,
      module_id,
      worker_ids,
      assigned_by,
      due_date
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

    if (!worker_ids || !Array.isArray(worker_ids) || worker_ids.length === 0) {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: worker_ids (array non-gol de UUID-uri)' },
        { status: 400 }
      )
    }

    if (!assigned_by || typeof assigned_by !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: assigned_by (UUID string)' },
        { status: 400 }
      )
    }

    // Validare due_date format (YYYY-MM-DD) dacă este furnizat
    if (due_date && typeof due_date === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(due_date)) {
        return NextResponse.json(
          { error: 'Format due_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
    }

    // Validare există modulul specificat
    const { data: module, error: moduleError } = await supabase
      .from('training_modules')
      .select('id, is_active')
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

    // Verificare workers există
    const { data: workers, error: workersError } = await supabase
      .from('profiles')
      .select('id')
      .in('id', worker_ids)

    if (workersError || !workers || workers.length !== worker_ids.length) {
      return NextResponse.json(
        { error: 'Unul sau mai mulți lucrători specificați nu există' },
        { status: 400 }
      )
    }

    // Construire array de assignments
    const assignmentsData = worker_ids.map(worker_id => ({
      organization_id,
      module_id,
      worker_id,
      assigned_by,
      due_date: due_date || null,
      status: 'assigned' as const,
      assigned_at: new Date().toISOString(),
    }))

    // Insert în DB cu RLS automat aplicat (bulk insert)
    const { data, error } = await supabase
      .from('training_assignments')
      .insert(assignmentsData)
      .select(`
        *,
        training_modules(id, code, title, category),
        profiles!training_assignments_worker_id_fkey(id, full_name, email)
      `)

    if (error) {
      console.error('Error creating training assignments:', error)

      // Verificare erori comune
      if (error.code === '23503') {
        return NextResponse.json(
          { error: 'Organizația, modulul sau lucrătorii specificați nu există sau nu aveți acces' },
          { status: 400 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a atribui instruiri pentru această organizație' },
          { status: 403 }
        )
      }

      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Unul sau mai mulți lucrători au deja acest modul atribuit (duplicat)' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la crearea atribuirilor de instruire' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as TrainingAssignment[],
      message: `${data.length} atribuiri de instruire create cu succes`
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/trainings:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
