// S-S-M.RO — API Routes: Single Medical Examination Operations
// GET: Obține un examen medical specific
// PUT: Actualizează un examen medical existent
// DELETE: Șterge un examen medical (soft delete)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { MedicalExamination } from '@/lib/types'
import { checkAndCreateExpirationAlerts } from '@/lib/services/medical-alerts'

// ────────────────────────────────────────────────────────────
// GET /api/medical/[id]
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

    // Validare ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID invalid (așteptat UUID)' },
        { status: 400 }
      )
    }

    // Obținere examen medical cu RLS automat aplicat
    const { data, error } = await supabase
      .from('medical_examinations')
      .select('*, organizations(name, cui)')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching medical examination:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Examen medical negăsit sau nu aveți acces' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la încărcarea examenului medical' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as MedicalExamination
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/medical/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// PUT /api/medical/[id]
// Body: Câmpuri de actualizat (parțiale)
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

    // Validare ID format
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
      employee_name,
      cnp_hash,
      job_title,
      examination_type,
      examination_date,
      expiry_date,
      result,
      restrictions,
      doctor_name,
      clinic_name,
      notes
    } = body

    // Construire obiect update (doar câmpurile furnizate)
    const updateData: Partial<MedicalExamination> = {}

    if (employee_name !== undefined) {
      if (typeof employee_name !== 'string' || employee_name.trim().length === 0) {
        return NextResponse.json(
          { error: 'employee_name trebuie să fie un string non-gol' },
          { status: 400 }
        )
      }
      updateData.employee_name = employee_name.trim()
    }

    if (cnp_hash !== undefined) updateData.cnp_hash = cnp_hash || null
    if (job_title !== undefined) updateData.job_title = job_title || null

    if (examination_type !== undefined) {
      if (!['periodic', 'angajare', 'reluare', 'la_cerere', 'supraveghere'].includes(examination_type)) {
        return NextResponse.json(
          { error: 'examination_type invalid (periodic, angajare, reluare, la_cerere, supraveghere)' },
          { status: 400 }
        )
      }
      updateData.examination_type = examination_type
    }

    if (result !== undefined) {
      if (!['apt', 'apt_conditionat', 'inapt_temporar', 'inapt'].includes(result)) {
        return NextResponse.json(
          { error: 'result invalid (apt, apt_conditionat, inapt_temporar, inapt)' },
          { status: 400 }
        )
      }
      updateData.result = result
    }

    // Validare examination_date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (examination_date !== undefined) {
      if (typeof examination_date !== 'string' || !dateRegex.test(examination_date)) {
        return NextResponse.json(
          { error: 'Format examination_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
      updateData.examination_date = examination_date
    }

    // Validare expiry_date format (YYYY-MM-DD)
    if (expiry_date !== undefined) {
      if (typeof expiry_date !== 'string' || !dateRegex.test(expiry_date)) {
        return NextResponse.json(
          { error: 'Format expiry_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
      updateData.expiry_date = expiry_date
    }

    // Validare logică: expiry_date trebuie să fie după examination_date (dacă ambele sunt furnizate)
    if (examination_date && expiry_date) {
      if (new Date(expiry_date) <= new Date(examination_date)) {
        return NextResponse.json(
          { error: 'Data expirării trebuie să fie după data examenului' },
          { status: 400 }
        )
      }
    }

    if (restrictions !== undefined) updateData.restrictions = restrictions || null
    if (doctor_name !== undefined) updateData.doctor_name = doctor_name || null
    if (clinic_name !== undefined) updateData.clinic_name = clinic_name || null
    if (notes !== undefined) updateData.notes = notes || null

    // Adăugare updated_at
    updateData.updated_at = new Date().toISOString()

    // Verificare dacă există cel puțin un câmp de actualizat
    if (Object.keys(updateData).length === 1) { // doar updated_at
      return NextResponse.json(
        { error: 'Nu au fost furnizate câmpuri de actualizat' },
        { status: 400 }
      )
    }

    // Update în DB cu RLS automat aplicat
    const { data, error } = await supabase
      .from('medical_examinations')
      .update(updateData)
      .eq('id', id)
      .select('*, organizations(name, cui)')
      .single()

    if (error) {
      console.error('Error updating medical examination:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Examen medical negăsit sau nu aveți acces' },
          { status: 404 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a actualiza acest examen medical' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la actualizarea examenului medical' },
        { status: 500 }
      )
    }

    // Verificare și actualizare alerte dacă expiry_date s-a schimbat
    if (expiry_date) {
      try {
        await checkAndCreateExpirationAlerts(supabase, data as MedicalExamination)
      } catch (alertError) {
        console.error('Error updating expiration alerts:', alertError)
        // Nu returnăm eroare - update-ul a fost făcut cu succes
      }
    }

    return NextResponse.json({
      data: data as MedicalExamination,
      message: 'Examen medical actualizat cu succes'
    })
  } catch (error) {
    console.error('Unexpected error in PUT /api/medical/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// DELETE /api/medical/[id]
// Soft delete: setează deleted_at timestamp (dacă există) sau hard delete
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

    // Validare ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID invalid (așteptat UUID)' },
        { status: 400 }
      )
    }

    // Verificare dacă tabela are coloană deleted_at (soft delete)
    // Pentru medical_examinations, folosim hard delete direct
    // Dacă în viitor se adaugă soft delete, se va folosi:
    // const { data, error } = await supabase
    //   .from('medical_examinations')
    //   .update({ deleted_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()
    //   .single()

    // Hard delete din DB cu RLS automat aplicat
    const { error } = await supabase
      .from('medical_examinations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting medical examination:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Examen medical negăsit sau nu aveți acces' },
          { status: 404 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a șterge acest examen medical' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la ștergerea examenului medical' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Examen medical șters cu succes'
    })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/medical/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
