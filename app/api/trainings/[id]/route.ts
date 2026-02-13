// S-S-M.RO — API Routes: Training Assignment Individual Operations
// GET: Detalii assignment cu relații complete
// PUT: Actualizare status/notes assignment
// DELETE: Ștergere assignment

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { TrainingAssignment, AssignmentStatus } from '@/lib/training-types'

// ────────────────────────────────────────────────────────────
// GET /api/trainings/[id]
// ────────────────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Validare UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID invalid (așteptat UUID)' },
        { status: 400 }
      )
    }

    // Query cu RLS automat aplicat + relații complete
    const { data, error } = await supabase
      .from('training_assignments')
      .select(`
        *,
        training_modules(
          id, code, title, description, category, training_type,
          duration_minutes_required, is_mandatory, legal_basis
        ),
        profiles!training_assignments_worker_id_fkey(id, full_name, email, phone),
        profiles!training_assignments_assigned_by_fkey(id, full_name),
        training_sessions(
          id, session_date, duration_minutes, test_score,
          verification_result, instructor_name, location, language
        ),
        organizations(id, name, cui)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Atribuirea de instruire nu există sau nu aveți acces' },
          { status: 404 }
        )
      }

      console.error('Error fetching training assignment:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea atribuirii de instruire' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data as TrainingAssignment })
  } catch (error) {
    console.error('Unexpected error in GET /api/trainings/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// PUT /api/trainings/[id]
// Body: { status?, notes?, due_date?, completed_at?, session_id?, next_due_date? }
// ────────────────────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Validare UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID invalid (așteptat UUID)' },
        { status: 400 }
      )
    }

    // Parsare body
    const body = await request.json()
    const {
      status,
      notes,
      due_date,
      completed_at,
      session_id,
      next_due_date
    } = body

    // Validare status (dacă este furnizat)
    const validStatuses: AssignmentStatus[] = [
      'assigned', 'in_progress', 'completed', 'overdue', 'expired', 'exempted'
    ]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status invalid. Valori permise: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Validare date format (YYYY-MM-DD) pentru toate câmpurile de dată
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (due_date && !dateRegex.test(due_date)) {
      return NextResponse.json(
        { error: 'Format due_date invalid (așteptat YYYY-MM-DD)' },
        { status: 400 }
      )
    }
    if (next_due_date && !dateRegex.test(next_due_date)) {
      return NextResponse.json(
        { error: 'Format next_due_date invalid (așteptat YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validare completed_at format (ISO timestamp) dacă este furnizat
    if (completed_at && typeof completed_at === 'string') {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      if (!isoRegex.test(completed_at)) {
        return NextResponse.json(
          { error: 'Format completed_at invalid (așteptat ISO timestamp)' },
          { status: 400 }
        )
      }
    }

    // Construire obiect update doar cu câmpurile furnizate
    const updateData: Partial<TrainingAssignment> = {
      updated_at: new Date().toISOString()
    }

    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (due_date !== undefined) updateData.due_date = due_date
    if (completed_at !== undefined) updateData.completed_at = completed_at
    if (session_id !== undefined) updateData.session_id = session_id
    if (next_due_date !== undefined) updateData.next_due_date = next_due_date

    // Logică automată: dacă status = 'completed', setează completed_at dacă nu e deja setat
    if (status === 'completed' && !completed_at && !updateData.completed_at) {
      updateData.completed_at = new Date().toISOString()
    }

    // Update în DB cu RLS automat aplicat
    const { data, error } = await supabase
      .from('training_assignments')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        training_modules(id, code, title, category),
        profiles!training_assignments_worker_id_fkey(id, full_name, email)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Atribuirea de instruire nu există sau nu aveți acces' },
          { status: 404 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a actualiza această atribuire de instruire' },
          { status: 403 }
        )
      }

      console.error('Error updating training assignment:', error)
      return NextResponse.json(
        { error: 'Eroare la actualizarea atribuirii de instruire' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as TrainingAssignment,
      message: 'Atribuire de instruire actualizată cu succes'
    })
  } catch (error) {
    console.error('Unexpected error in PUT /api/trainings/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// DELETE /api/trainings/[id]
// ────────────────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Validare UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID invalid (așteptat UUID)' },
        { status: 400 }
      )
    }

    // Verificare dacă există sesiune completată asociată
    const { data: assignment, error: checkError } = await supabase
      .from('training_assignments')
      .select('session_id, status')
      .eq('id', id)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Atribuirea de instruire nu există sau nu aveți acces' },
          { status: 404 }
        )
      }

      console.error('Error checking training assignment:', checkError)
      return NextResponse.json(
        { error: 'Eroare la verificarea atribuirii de instruire' },
        { status: 500 }
      )
    }

    // Prevenire ștergere atribuiri completate (protecție audit trail)
    if (assignment.status === 'completed' && assignment.session_id) {
      return NextResponse.json(
        { error: 'Nu se pot șterge atribuiri completate cu sesiuni asociate (audit trail)' },
        { status: 409 }
      )
    }

    // Delete din DB cu RLS automat aplicat
    const { error } = await supabase
      .from('training_assignments')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a șterge această atribuire de instruire' },
          { status: 403 }
        )
      }

      console.error('Error deleting training assignment:', error)
      return NextResponse.json(
        { error: 'Eroare la ștergerea atribuirii de instruire' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Atribuire de instruire ștearsă cu succes'
    })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/trainings/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
