// ============================================================
// S-S-M.RO — API Route: Medical Examinations (GET, POST)
// Endpoint: /api/medical
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
// GET /api/medical
// Query params: organization_id (required), status (optional), employee_id (optional)
// ============================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id')
    const status = searchParams.get('status')
    const employeeId = searchParams.get('employee_id')

    // Validare organization_id obligatoriu
    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id este obligatoriu' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Construim query
    let query = supabase
      .from('medical_examinations')
      .select('*, organizations(name, cui)')
      .eq('organization_id', organizationId)
      .order('expiry_date', { ascending: true })

    // Filtru optional employee_id
    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    const { data, error } = await query

    if (error) {
      console.error('[GET /api/medical] Supabase error:', error)
      return NextResponse.json(
        { error: 'Eroare la citire examinări medicale', details: error.message },
        { status: 500 }
      )
    }

    let filteredData = data || []

    // Filtru status (expired, expiring, valid)
    if (status && ['expired', 'expiring', 'valid'].includes(status)) {
      filteredData = filteredData.filter(exam => getExpiryStatus(exam.expiry_date) === status)
    }

    // Calculare statistici
    const stats = {
      total: data?.length || 0,
      expired: data?.filter(exam => getExpiryStatus(exam.expiry_date) === 'expired').length || 0,
      expiring: data?.filter(exam => getExpiryStatus(exam.expiry_date) === 'expiring').length || 0,
      valid: data?.filter(exam => getExpiryStatus(exam.expiry_date) === 'valid').length || 0
    }

    // Check for expired exams and create alerts
    const expiredExams = data?.filter(exam => getExpiryStatus(exam.expiry_date) === 'expired') || []

    if (expiredExams.length > 0) {
      // Create alerts for expired exams (non-blocking)
      createExpiredExamAlerts(supabase, expiredExams).catch(err => {
        console.error('[GET /api/medical] Error creating alerts:', err)
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      stats,
      count: filteredData.length
    })
  } catch (err: any) {
    console.error('[GET /api/medical] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/medical
// Body: medical examination data (JSON)
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validare câmpuri obligatorii
    const requiredFields = ['organization_id', 'employee_name', 'examination_type', 'examination_date', 'expiry_date', 'result']
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

    // Validare employee_name (min 2 caractere)
    if (body.employee_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Numele angajatului trebuie să aibă minim 2 caractere' },
        { status: 400 }
      )
    }

    // Validare examination_type
    const validExamTypes = ['periodic', 'angajare', 'reluare', 'la_cerere', 'supraveghere', 'adaptare']
    if (!validExamTypes.includes(body.examination_type)) {
      return NextResponse.json(
        { error: `Tip examinare invalid. Valori acceptate: ${validExamTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validare result
    const validResults = ['apt', 'apt_conditionat', 'inapt_temporar', 'inapt']
    if (!validResults.includes(body.result)) {
      return NextResponse.json(
        { error: `Rezultat invalid. Valori acceptate: ${validResults.join(', ')}` },
        { status: 400 }
      )
    }

    // Validare date
    if (!isValidISODate(body.examination_date)) {
      return NextResponse.json(
        { error: 'Format dată examinare invalid (folosește YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    if (!isValidISODate(body.expiry_date)) {
      return NextResponse.json(
        { error: 'Format dată expirare invalid (folosește YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validare logică: expiry_date trebuie să fie după examination_date
    const examDate = new Date(body.examination_date)
    const expiryDate = new Date(body.expiry_date)
    if (expiryDate <= examDate) {
      return NextResponse.json(
        { error: 'Data expirare trebuie să fie după data examinării' },
        { status: 400 }
      )
    }

    // Pregătire date pentru insert
    const medicalData = {
      organization_id: body.organization_id,
      employee_id: body.employee_id || null,
      employee_name: body.employee_name.trim(),
      cnp_hash: body.cnp_hash || null,
      job_title: body.job_title?.trim() || null,
      examination_type: body.examination_type,
      examination_date: body.examination_date,
      expiry_date: body.expiry_date,
      result: body.result,
      restrictions: body.restrictions?.trim() || null,
      doctor_name: body.doctor_name?.trim() || null,
      clinic_name: body.clinic_name?.trim() || null,
      notes: body.notes?.trim() || null,
      location_id: body.location_id || null,
      content_version: 1,
      legal_basis_version: 'OMS_181_2022'
    }

    const supabase = getSupabase()

    // Verificare dacă organizația există
    const { data: orgExists, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', medicalData.organization_id)
      .single()

    if (orgError || !orgExists) {
      return NextResponse.json(
        { error: 'Organizația specificată nu există' },
        { status: 404 }
      )
    }

    // Verificare dacă employee_id există (dacă furnizat)
    if (medicalData.employee_id) {
      const { data: empExists, error: empError } = await supabase
        .from('employees')
        .select('id')
        .eq('id', medicalData.employee_id)
        .single()

      if (empError || !empExists) {
        return NextResponse.json(
          { error: 'Angajatul specificat nu există' },
          { status: 404 }
        )
      }
    }

    // Insert medical examination
    const { data, error } = await supabase
      .from('medical_examinations')
      .insert([medicalData])
      .select('*, organizations(name, cui)')
      .single()

    if (error) {
      console.error('[POST /api/medical] Supabase error:', error)
      return NextResponse.json(
        { error: 'Eroare la creare examinare medicală', details: error.message },
        { status: 500 }
      )
    }

    // Check if newly created exam is already expired or expiring
    const status = getExpiryStatus(data.expiry_date)
    if (status === 'expired') {
      // Create alert for expired exam (non-blocking)
      createExpiredExamAlerts(supabase, [data]).catch(err => {
        console.error('[POST /api/medical] Error creating alert:', err)
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Examinare medicală creată cu succes',
        data,
        status
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[POST /api/medical] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// Helper: Create alerts for expired medical exams
// ============================================================
async function createExpiredExamAlerts(supabase: any, exams: any[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const alertsToCreate = []

  for (const exam of exams) {
    const expiryDate = new Date(exam.expiry_date)
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Check if alert already exists for this exam
    const { data: existingAlert } = await supabase
      .from('alerts')
      .select('id')
      .eq('reference_id', exam.id)
      .eq('reference_type', 'medical_record')
      .eq('is_resolved', false)
      .single()

    if (existingAlert) continue // Alert already exists

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
    } else {
      continue // No alert needed for exams expiring in more than 30 days
    }

    alertsToCreate.push({
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

  if (alertsToCreate.length > 0) {
    const { error } = await supabase
      .from('alerts')
      .insert(alertsToCreate)

    if (error) {
      console.error('[createExpiredExamAlerts] Error inserting alerts:', error)
      throw error
    }

    console.log(`[createExpiredExamAlerts] Created ${alertsToCreate.length} alerts`)
  }
}

// ============================================================
// Funcții validare
// ============================================================

function isValidISODate(date: string): boolean {
  // Format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false

  const parsed = new Date(date)
  return !isNaN(parsed.getTime())
}
