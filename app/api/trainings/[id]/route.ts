// ============================================================
// S-S-M.RO — API Route: Training Assignment by ID (GET, PUT, DELETE)
// Endpoint: /api/trainings/[id]
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

// Type pentru params Next.js 14 App Router
type RouteParams = {
  params: Promise<{ id: string }>
}

// ============================================================
// GET /api/trainings/[id]
// Returnează un singur training assignment cu toate relațiile
// Include: module, worker profile, training sessions, participants
// ============================================================
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    // Validare UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID invalid (format UUID așteptat)' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Query cu toate relațiile
    const { data, error } = await supabase
      .from('training_assignments')
      .select(`
        *,
        training_modules(
          id,
          code,
          title,
          description,
          category,
          training_type,
          duration_minutes_required,
          periodicity_months,
          is_mandatory,
          min_test_questions,
          min_pass_score,
          legal_basis,
          available_languages,
          applicable_risk_categories
        ),
        profiles!training_assignments_worker_id_fkey(
          id,
          full_name,
          phone
        ),
        training_sessions(
          id,
          session_date,
          duration_minutes,
          language,
          location,
          test_score,
          test_questions_total,
          test_questions_correct,
          verification_result,
          instructor_name,
          fisa_document_id,
          fisa_generated_at,
          quickvalid_timestamp,
          quickvalid_confidence,
          quickvalid_photo_url,
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Training assignment negăsit' },
          { status: 404 }
        )
      }

      console.error(`[GET /api/trainings/${id}] Supabase error:`, error)
      return NextResponse.json(
        { error: 'Eroare la citire training assignment', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (err: any) {
    console.error('[GET /api/trainings/[id]] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// PUT /api/trainings/[id]
// Actualizează training assignment
// Poate actualiza: status, due_date, notes, session_id, completed_at, next_due_date
// Include opțiune de a crea și training_session în aceeași operație
// ============================================================
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    // Validare UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID invalid (format UUID așteptat)' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validare că există cel puțin un câmp de actualizat
    const allowedFields = [
      'status',
      'due_date',
      'notes',
      'session_id',
      'completed_at',
      'next_due_date'
    ]

    const updateFields = Object.keys(body).filter(key =>
      allowedFields.includes(key) || key === 'create_session'
    )

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'Niciun câmp valid de actualizat', allowed_fields: allowedFields },
        { status: 400 }
      )
    }

    // Validare status dacă este furnizat
    const validStatuses = ['assigned', 'in_progress', 'completed', 'overdue', 'expired', 'exempted']
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Status invalid', valid_statuses: validStatuses },
        { status: 400 }
      )
    }

    // Validare date dacă sunt furnizate
    if (body.due_date && !isValidISODate(body.due_date)) {
      return NextResponse.json(
        { error: 'Format dată scadentă invalid (folosește YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    if (body.next_due_date && !isValidISODate(body.next_due_date)) {
      return NextResponse.json(
        { error: 'Format dată următoare scadență invalid (folosește YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    if (body.completed_at && !isValidISODateTime(body.completed_at)) {
      return NextResponse.json(
        { error: 'Format dată completare invalid (folosește ISO 8601)' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Verificare dacă assignment-ul există
    const { data: exists, error: existsError } = await supabase
      .from('training_assignments')
      .select('id, organization_id, module_id, worker_id')
      .eq('id', id)
      .single()

    if (existsError || !exists) {
      return NextResponse.json(
        { error: 'Training assignment negăsit' },
        { status: 404 }
      )
    }

    let sessionId = body.session_id

    // Dacă există create_session, creăm întâi sesiunea
    if (body.create_session) {
      const session = body.create_session

      // Validare câmpuri obligatorii pentru sesiune
      const requiredSessionFields = ['instructor_name', 'session_date', 'duration_minutes']
      const missingSessionFields = requiredSessionFields.filter(field => !session[field])

      if (missingSessionFields.length > 0) {
        return NextResponse.json(
          {
            error: 'Câmpuri obligatorii lipsă pentru sesiune',
            missing: missingSessionFields
          },
          { status: 400 }
        )
      }

      // Validare test_score și verificare
      if (session.test_score !== undefined && session.test_score !== null) {
        if (session.test_score < 0 || session.test_score > 100) {
          return NextResponse.json(
            { error: 'test_score trebuie să fie între 0 și 100' },
            { status: 400 }
          )
        }
      }

      // Creare training session
      const { data: newSession, error: sessionError } = await supabase
        .from('training_sessions')
        .insert({
          organization_id: exists.organization_id,
          module_id: exists.module_id,
          worker_id: exists.worker_id,
          instructor_name: session.instructor_name,
          session_date: session.session_date,
          duration_minutes: session.duration_minutes,
          language: session.language || 'ro',
          location: session.location || null,
          test_score: session.test_score || null,
          test_questions_total: session.test_questions_total || null,
          test_questions_correct: session.test_questions_correct || null,
          verification_result: session.verification_result || 'pending',
          quickvalid_timestamp: session.quickvalid_timestamp || null,
          quickvalid_confidence: session.quickvalid_confidence || null,
          quickvalid_photo_url: session.quickvalid_photo_url || null,
          audit_trail: session.audit_trail || null
        })
        .select()
        .single()

      if (sessionError) {
        console.error('[PUT /api/trainings/[id]] Session creation error:', sessionError)
        return NextResponse.json(
          { error: 'Eroare la creare sesiune training', details: sessionError.message },
          { status: 500 }
        )
      }

      sessionId = newSession.id
    }

    // Pregătire date pentru update assignment
    const updateData: Record<string, any> = {}

    if (body.status !== undefined) updateData.status = body.status
    if (body.due_date !== undefined) updateData.due_date = body.due_date || null
    if (body.notes !== undefined) updateData.notes = body.notes?.trim() || null
    if (sessionId !== undefined) updateData.session_id = sessionId
    if (body.next_due_date !== undefined) updateData.next_due_date = body.next_due_date || null

    // Dacă status devine completed, setăm completed_at
    if (body.status === 'completed' && !body.completed_at) {
      updateData.completed_at = new Date().toISOString()
    } else if (body.completed_at !== undefined) {
      updateData.completed_at = body.completed_at || null
    }

    // Adaugă updated_at
    updateData.updated_at = new Date().toISOString()

    // Update assignment
    const { data, error } = await supabase
      .from('training_assignments')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        training_modules(code, title, category),
        profiles!training_assignments_worker_id_fkey(full_name),
        training_sessions(
          id,
          session_date,
          test_score,
          verification_result,
          instructor_name
        )
      `)
      .single()

    if (error) {
      console.error(`[PUT /api/trainings/${id}] Supabase error:`, error)
      return NextResponse.json(
        { error: 'Eroare la actualizare training assignment', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Training assignment actualizat cu succes',
      data
    })
  } catch (err: any) {
    console.error('[PUT /api/trainings/[id]] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// DELETE /api/trainings/[id]
// Șterge training assignment
// Query param: cascade=true pentru a șterge și sesiunile asociate
// ============================================================
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    // Validare UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID invalid (format UUID așteptat)' },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const cascade = searchParams.get('cascade') === 'true'

    const supabase = getSupabase()

    // Verificare dacă assignment-ul există
    const { data: exists, error: existsError } = await supabase
      .from('training_assignments')
      .select(`
        id,
        training_modules(title),
        profiles!training_assignments_worker_id_fkey(full_name)
      `)
      .eq('id', id)
      .single()

    if (existsError || !exists) {
      return NextResponse.json(
        { error: 'Training assignment negăsit' },
        { status: 404 }
      )
    }

    // Dacă cascade=true, ștergem întâi sesiunile asociate
    if (cascade) {
      const { error: sessionsError } = await supabase
        .from('training_sessions')
        .delete()
        .eq('organization_id', (exists as any).organization_id)
        .eq('worker_id', (exists as any).worker_id)
        .in('id', [(exists as any).session_id].filter(Boolean))

      if (sessionsError) {
        console.error(`[DELETE /api/trainings/${id}] Sessions delete error:`, sessionsError)
        // Nu oprim procesul, doar logăm
      }
    }

    // Ștergere assignment
    const { error } = await supabase
      .from('training_assignments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`[DELETE /api/trainings/${id}] Delete error:`, error)
      return NextResponse.json(
        { error: 'Eroare la ștergere training assignment', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Training assignment șters cu succes',
      deleted_assignment: {
        module: (exists as any).training_modules?.title,
        worker: (exists as any).profiles?.full_name
      }
    })
  } catch (err: any) {
    console.error('[DELETE /api/trainings/[id]] Unexpected error:', err)
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

function isValidISODateTime(dateTime: string): boolean {
  const parsed = new Date(dateTime)
  return !isNaN(parsed.getTime())
}
