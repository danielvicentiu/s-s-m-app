// ============================================================
// S-S-M.RO — API Route: Medical Examination by ID (GET, PUT, DELETE)
// Endpoint: /api/medical/[id]
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

// Helper pentru calculare status expirare
function getExpiryStatus(expiryDate: string): 'valid' | 'expiring' | 'expired' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'expiring'
  return 'valid'
}

// ============================================================
// GET /api/medical/[id]
// Returnează o singură examinare medicală după ID
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

    const { data, error } = await supabase
      .from('medical_examinations')
      .select('*, organizations(name, cui)')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Examinare medicală negăsită' },
          { status: 404 }
        )
      }

      console.error(`[GET /api/medical/${id}] Supabase error:`, error)
      return NextResponse.json(
        { error: 'Eroare la citire examinare medicală', details: error.message },
        { status: 500 }
      )
    }

    // Calculare status
    const status = getExpiryStatus(data.expiry_date)

    return NextResponse.json({
      success: true,
      data,
      status
    })
  } catch (err: any) {
    console.error('[GET /api/medical/[id]] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// PUT /api/medical/[id]
// Actualizează examinare medicală existentă
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
      'employee_id',
      'employee_name',
      'cnp_hash',
      'job_title',
      'examination_type',
      'examination_date',
      'expiry_date',
      'result',
      'restrictions',
      'doctor_name',
      'clinic_name',
      'notes',
      'location_id'
    ]

    const updateFields = Object.keys(body).filter(key => allowedFields.includes(key))

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'Niciun câmp valid de actualizat', allowed_fields: allowedFields },
        { status: 400 }
      )
    }

    // Validări specifice pe câmpuri
    if (body.employee_name !== undefined) {
      if (typeof body.employee_name !== 'string' || body.employee_name.trim().length < 2) {
        return NextResponse.json(
          { error: 'Numele angajatului trebuie să aibă minim 2 caractere' },
          { status: 400 }
        )
      }
    }

    if (body.examination_type !== undefined) {
      const validExamTypes = ['periodic', 'angajare', 'reluare', 'la_cerere', 'supraveghere', 'adaptare']
      if (!validExamTypes.includes(body.examination_type)) {
        return NextResponse.json(
          { error: `Tip examinare invalid. Valori acceptate: ${validExamTypes.join(', ')}` },
          { status: 400 }
        )
      }
    }

    if (body.result !== undefined) {
      const validResults = ['apt', 'apt_conditionat', 'inapt_temporar', 'inapt']
      if (!validResults.includes(body.result)) {
        return NextResponse.json(
          { error: `Rezultat invalid. Valori acceptate: ${validResults.join(', ')}` },
          { status: 400 }
        )
      }
    }

    if (body.examination_date !== undefined && body.examination_date !== null) {
      if (!isValidISODate(body.examination_date)) {
        return NextResponse.json(
          { error: 'Format dată examinare invalid (folosește YYYY-MM-DD)' },
          { status: 400 }
        )
      }
    }

    if (body.expiry_date !== undefined && body.expiry_date !== null) {
      if (!isValidISODate(body.expiry_date)) {
        return NextResponse.json(
          { error: 'Format dată expirare invalid (folosește YYYY-MM-DD)' },
          { status: 400 }
        )
      }
    }

    // Validare logică: expiry_date trebuie să fie după examination_date
    if (body.examination_date && body.expiry_date) {
      const examDate = new Date(body.examination_date)
      const expiryDate = new Date(body.expiry_date)
      if (expiryDate <= examDate) {
        return NextResponse.json(
          { error: 'Data expirare trebuie să fie după data examinării' },
          { status: 400 }
        )
      }
    }

    // Pregătire date pentru update
    const updateData: Record<string, any> = {}

    if (body.employee_id !== undefined) updateData.employee_id = body.employee_id || null
    if (body.employee_name !== undefined) updateData.employee_name = body.employee_name.trim()
    if (body.cnp_hash !== undefined) updateData.cnp_hash = body.cnp_hash || null
    if (body.job_title !== undefined) updateData.job_title = body.job_title?.trim() || null
    if (body.examination_type !== undefined) updateData.examination_type = body.examination_type
    if (body.examination_date !== undefined) updateData.examination_date = body.examination_date
    if (body.expiry_date !== undefined) updateData.expiry_date = body.expiry_date
    if (body.result !== undefined) updateData.result = body.result
    if (body.restrictions !== undefined) updateData.restrictions = body.restrictions?.trim() || null
    if (body.doctor_name !== undefined) updateData.doctor_name = body.doctor_name?.trim() || null
    if (body.clinic_name !== undefined) updateData.clinic_name = body.clinic_name?.trim() || null
    if (body.notes !== undefined) updateData.notes = body.notes?.trim() || null
    if (body.location_id !== undefined) updateData.location_id = body.location_id || null

    // Adaugă updated_at
    updateData.updated_at = new Date().toISOString()

    const supabase = getSupabase()

    // Verificare dacă examinarea există
    const { data: exists, error: existsError } = await supabase
      .from('medical_examinations')
      .select('id, organization_id, expiry_date')
      .eq('id', id)
      .single()

    if (existsError || !exists) {
      return NextResponse.json(
        { error: 'Examinare medicală negăsită' },
        { status: 404 }
      )
    }

    // Verificare dacă employee_id există (dacă furnizat)
    if (updateData.employee_id) {
      const { data: empExists, error: empError } = await supabase
        .from('employees')
        .select('id')
        .eq('id', updateData.employee_id)
        .single()

      if (empError || !empExists) {
        return NextResponse.json(
          { error: 'Angajatul specificat nu există' },
          { status: 404 }
        )
      }
    }

    // Update examinare medicală
    const { data, error } = await supabase
      .from('medical_examinations')
      .update(updateData)
      .eq('id', id)
      .select('*, organizations(name, cui)')
      .single()

    if (error) {
      console.error(`[PUT /api/medical/${id}] Supabase error:`, error)
      return NextResponse.json(
        { error: 'Eroare la actualizare examinare medicală', details: error.message },
        { status: 500 }
      )
    }

    // Calculare status
    const status = getExpiryStatus(data.expiry_date)

    // Check if status changed and needs alert update
    const oldStatus = getExpiryStatus(exists.expiry_date)
    if (status !== oldStatus) {
      // Update or create alerts (non-blocking)
      updateExamAlert(supabase, data, status).catch(err => {
        console.error('[PUT /api/medical] Error updating alert:', err)
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Examinare medicală actualizată cu succes',
      data,
      status
    })
  } catch (err: any) {
    console.error('[PUT /api/medical/[id]] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// DELETE /api/medical/[id]
// Șterge examinare medicală
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

    const supabase = getSupabase()

    // Verificare dacă examinarea există
    const { data: exists, error: existsError } = await supabase
      .from('medical_examinations')
      .select('id, employee_name, organization_id')
      .eq('id', id)
      .single()

    if (existsError || !exists) {
      return NextResponse.json(
        { error: 'Examinare medicală negăsită' },
        { status: 404 }
      )
    }

    // Delete examinare medicală
    const { error } = await supabase
      .from('medical_examinations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`[DELETE /api/medical/${id}] Delete error:`, error)
      return NextResponse.json(
        { error: 'Eroare la ștergere examinare medicală', details: error.message },
        { status: 500 }
      )
    }

    // Delete associated alerts (non-blocking)
    deleteExamAlerts(supabase, id).catch(err => {
      console.error('[DELETE /api/medical] Error deleting alerts:', err)
    })

    return NextResponse.json({
      success: true,
      message: 'Examinare medicală ștearsă definitiv',
      deleted_employee: exists.employee_name
    })
  } catch (err: any) {
    console.error('[DELETE /api/medical/[id]] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// Helper: Update alert for exam
// ============================================================
async function updateExamAlert(supabase: any, exam: any, status: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiryDate = new Date(exam.expiry_date)
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Delete existing unresolved alerts
  await supabase
    .from('alerts')
    .delete()
    .eq('reference_id', exam.id)
    .eq('reference_type', 'medical_record')
    .eq('is_resolved', false)

  // Create new alert if needed
  if (status === 'expired' || status === 'expiring') {
    let severity: 'info' | 'warning' | 'critical' | 'expired' = 'expired'
    let title = ''
    let message = ''

    if (daysUntilExpiry < 0) {
      severity = 'expired'
      title = `Fișă medicală expirată: ${exam.employee_name}`
      message = `Fișa de medicina muncii pentru ${exam.employee_name} (${exam.job_title || 'fără funcție'}) a expirat cu ${Math.abs(daysUntilExpiry)} zile. Este necesară reexaminarea.`
    } else if (daysUntilExpiry <= 7) {
      severity = 'critical'
      title = `Fișă medicală expiră în ${daysUntilExpiry} zile: ${exam.employee_name}`
      message = `Fișa de medicina muncii pentru ${exam.employee_name} (${exam.job_title || 'fără funcție'}) expiră în ${daysUntilExpiry} zile. Programați reexaminare urgentă.`
    } else if (daysUntilExpiry <= 15) {
      severity = 'warning'
      title = `Fișă medicală expiră în ${daysUntilExpiry} zile: ${exam.employee_name}`
      message = `Fișa de medicina muncii pentru ${exam.employee_name} (${exam.job_title || 'fără funcție'}) expiră în ${daysUntilExpiry} zile. Programați reexaminare.`
    } else if (daysUntilExpiry <= 30) {
      severity = 'info'
      title = `Fișă medicală expiră în ${daysUntilExpiry} zile: ${exam.employee_name}`
      message = `Fișa de medicina muncii pentru ${exam.employee_name} (${exam.job_title || 'fără funcție'}) expiră în ${daysUntilExpiry} zile.`
    }

    await supabase
      .from('alerts')
      .insert({
        organization_id: exam.organization_id,
        type: 'medical_expiry',
        severity,
        title,
        message,
        reference_id: exam.id,
        reference_type: 'medical_record',
        due_date: exam.expiry_date,
        is_resolved: false
      })
  }
}

// ============================================================
// Helper: Delete alerts for exam
// ============================================================
async function deleteExamAlerts(supabase: any, examId: string) {
  await supabase
    .from('alerts')
    .delete()
    .eq('reference_id', examId)
    .eq('reference_type', 'medical_record')
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
