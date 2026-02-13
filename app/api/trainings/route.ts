// ============================================================
// S-S-M.RO — API Route: Trainings (GET, POST)
// Endpoint: /api/trainings
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase client cu service role pentru bypass RLS
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

// ============================================================
// GET /api/trainings
// Query params: organization_id (required), status, category, worker_id
// Returnează training_assignments cu relații la sessions și participants
// ============================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const workerId = searchParams.get('worker_id')

    // Validare organization_id obligatoriu
    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id este obligatoriu' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Construim query pentru assignments cu relații
    let query = supabase
      .from('training_assignments')
      .select(`
        *,
        training_modules!inner(
          id,
          code,
          title,
          category,
          training_type,
          duration_minutes_required,
          is_mandatory
        ),
        profiles!training_assignments_worker_id_fkey(
          id,
          full_name
        ),
        training_sessions(
          id,
          session_date,
          duration_minutes,
          test_score,
          verification_result,
          instructor_name
        )
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    // Filtru optional status
    if (status) {
      query = query.eq('status', status)
    }

    // Filtru optional category (pe modul)
    if (category) {
      query = query.eq('training_modules.category', category)
    }

    // Filtru optional worker_id
    if (workerId) {
      query = query.eq('worker_id', workerId)
    }

    const { data, error } = await query

    if (error) {
      console.error('[GET /api/trainings] Supabase error:', error)
      return NextResponse.json(
        { error: 'Eroare la citire training-uri', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0
    })
  } catch (err: any) {
    console.error('[GET /api/trainings] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/trainings
// Body: { organization_id, module_id, worker_ids[], assigned_by, due_date? }
// Creează training assignments pentru unul sau mai mulți lucrători
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validare câmpuri obligatorii
    const requiredFields = ['organization_id', 'module_id', 'worker_ids', 'assigned_by']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Câmpuri obligatorii lipsă',
          missing: missingFields
        },
        { status: 400 }
      )
    }

    // Validare worker_ids este array
    if (!Array.isArray(body.worker_ids) || body.worker_ids.length === 0) {
      return NextResponse.json(
        { error: 'worker_ids trebuie să fie un array cu minim un element' },
        { status: 400 }
      )
    }

    // Validare UUID pentru module_id
    if (!isValidUUID(body.module_id)) {
      return NextResponse.json(
        { error: 'module_id invalid (format UUID așteptat)' },
        { status: 400 }
      )
    }

    // Validare UUID pentru assigned_by
    if (!isValidUUID(body.assigned_by)) {
      return NextResponse.json(
        { error: 'assigned_by invalid (format UUID așteptat)' },
        { status: 400 }
      )
    }

    // Validare due_date dacă este furnizat
    if (body.due_date && !isValidISODate(body.due_date)) {
      return NextResponse.json(
        { error: 'Format dată scadentă invalid (folosește YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Verificare dacă organizația există
    const { data: orgExists, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', body.organization_id)
      .single()

    if (orgError || !orgExists) {
      return NextResponse.json(
        { error: 'Organizația specificată nu există' },
        { status: 404 }
      )
    }

    // Verificare dacă modulul există și este activ
    const { data: moduleExists, error: moduleError } = await supabase
      .from('training_modules')
      .select('id, is_active')
      .eq('id', body.module_id)
      .single()

    if (moduleError || !moduleExists) {
      return NextResponse.json(
        { error: 'Modulul de training specificat nu există' },
        { status: 404 }
      )
    }

    if (!moduleExists.is_active) {
      return NextResponse.json(
        { error: 'Modulul de training nu este activ' },
        { status: 400 }
      )
    }

    // Pregătire date pentru insert
    const assignments = body.worker_ids.map((workerId: string) => ({
      organization_id: body.organization_id,
      module_id: body.module_id,
      worker_id: workerId,
      assigned_by: body.assigned_by,
      assigned_at: new Date().toISOString(),
      due_date: body.due_date || null,
      status: 'assigned',
      notes: body.notes?.trim() || null
    }))

    // Insert assignments
    const { data, error } = await supabase
      .from('training_assignments')
      .insert(assignments)
      .select(`
        *,
        training_modules(code, title),
        profiles!training_assignments_worker_id_fkey(full_name)
      `)

    if (error) {
      console.error('[POST /api/trainings] Supabase error:', error)
      return NextResponse.json(
        { error: 'Eroare la creare assignment-uri training', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `${data.length} assignment(uri) de training create cu succes`,
        data
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[POST /api/trainings] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// Funcții validare
// ============================================================

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

function isValidISODate(date: string): boolean {
  // Format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false

  const parsed = new Date(date)
  return !isNaN(parsed.getTime())
}
