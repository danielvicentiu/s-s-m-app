// S-S-M.RO — API Routes: Training Session Individual Operations
// GET: Detalii sesiune cu relații complete
// PATCH: Actualizare parțială sesiune (verification_result, test_score, etc.)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { TrainingSession, VerificationResult } from '@/lib/training-types'

// ────────────────────────────────────────────────────────────
// GET /api/trainings/sessions/[id]
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
      .from('training_sessions')
      .select(`
        *,
        training_modules(
          id, code, title, description, category, training_type,
          duration_minutes_required, min_pass_score, legal_basis
        ),
        profiles(id, full_name, email, phone),
        organizations(id, name, cui),
        generated_documents(id, file_name, storage_path, created_at)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Sesiunea de instruire nu există sau nu aveți acces' },
          { status: 404 }
        )
      }

      console.error('Error fetching training session:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea sesiunii de instruire' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data as TrainingSession })
  } catch (error) {
    console.error('Unexpected error in GET /api/trainings/sessions/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// PATCH /api/trainings/sessions/[id]
// Body: { verification_result?, test_score?, test_questions_correct?, fisa_document_id?, location?, notes? }
// ────────────────────────────────────────────────────────────
export async function PATCH(
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
      verification_result,
      test_score,
      test_questions_correct,
      test_questions_total,
      fisa_document_id,
      location,
      quickvalid_timestamp,
      quickvalid_confidence,
      quickvalid_photo_url
    } = body

    // Validare verification_result (dacă este furnizat)
    const validResults: VerificationResult[] = ['pending', 'admis', 'respins']
    if (verification_result && !validResults.includes(verification_result)) {
      return NextResponse.json(
        { error: `verification_result invalid. Valori permise: ${validResults.join(', ')}` },
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

    // Validare quickvalid_confidence (dacă este furnizat)
    if (quickvalid_confidence !== undefined && quickvalid_confidence !== null) {
      if (typeof quickvalid_confidence !== 'number' || quickvalid_confidence < 0 || quickvalid_confidence > 100) {
        return NextResponse.json(
          { error: 'quickvalid_confidence trebuie să fie între 0 și 100' },
          { status: 400 }
        )
      }
    }

    // Fetch sesiunea existentă pentru a construi audit trail
    const { data: existingSession, error: fetchError } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Sesiunea de instruire nu există sau nu aveți acces' },
          { status: 404 }
        )
      }

      console.error('Error fetching existing session:', fetchError)
      return NextResponse.json(
        { error: 'Eroare la verificarea sesiunii de instruire' },
        { status: 500 }
      )
    }

    // Construire obiect update doar cu câmpurile furnizate
    const updateData: Partial<TrainingSession> = {
      updated_at: new Date().toISOString()
    }

    if (verification_result !== undefined) updateData.verification_result = verification_result
    if (test_score !== undefined) updateData.test_score = test_score
    if (test_questions_correct !== undefined) updateData.test_questions_correct = test_questions_correct
    if (test_questions_total !== undefined) updateData.test_questions_total = test_questions_total
    if (fisa_document_id !== undefined) {
      updateData.fisa_document_id = fisa_document_id
      // Dacă se atașează un document, marcăm și timestamp-ul
      if (fisa_document_id) {
        updateData.fisa_generated_at = new Date().toISOString()
      }
    }
    if (location !== undefined) updateData.location = location
    if (quickvalid_timestamp !== undefined) updateData.quickvalid_timestamp = quickvalid_timestamp
    if (quickvalid_confidence !== undefined) updateData.quickvalid_confidence = quickvalid_confidence
    if (quickvalid_photo_url !== undefined) updateData.quickvalid_photo_url = quickvalid_photo_url

    // Actualizare audit_trail cu modificările
    const auditTrail = existingSession.audit_trail || {}
    const modifications = auditTrail.modifications || []
    modifications.push({
      modified_by: user.id,
      modified_at: new Date().toISOString(),
      fields_changed: Object.keys(updateData).filter(k => k !== 'updated_at' && k !== 'audit_trail'),
      user_agent: request.headers.get('user-agent') || 'unknown'
    })
    updateData.audit_trail = {
      ...auditTrail,
      modifications
    }

    // Update în DB cu RLS automat aplicat
    const { data, error } = await supabase
      .from('training_sessions')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        training_modules(id, code, title, category),
        profiles(id, full_name, email)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Sesiunea de instruire nu există sau nu aveți acces' },
          { status: 404 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a actualiza această sesiune de instruire' },
          { status: 403 }
        )
      }

      console.error('Error updating training session:', error)
      return NextResponse.json(
        { error: 'Eroare la actualizarea sesiunii de instruire' },
        { status: 500 }
      )
    }

    // Dacă verification_result a fost schimbat la 'admis', actualizăm și assignment-ul asociat
    if (verification_result === 'admis' && existingSession.verification_result !== 'admis') {
      const { error: updateAssignmentError } = await supabase
        .from('training_assignments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('organization_id', existingSession.organization_id)
        .eq('module_id', existingSession.module_id)
        .eq('worker_id', existingSession.worker_id)
        .eq('session_id', id)

      if (updateAssignmentError) {
        console.warn('Warning: Could not update training_assignment:', updateAssignmentError)
        // Nu returnăm eroare, sesiunea a fost actualizată cu succes
      }
    }

    return NextResponse.json({
      data: data as TrainingSession,
      message: 'Sesiune de instruire actualizată cu succes'
    })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/trainings/sessions/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
