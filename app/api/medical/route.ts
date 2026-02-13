// S-S-M.RO — API Routes: Medical Examinations CRUD
// GET: Listare examene medicale cu paginare și filtrare
// POST: Creare examen medical nou cu validare și alertare automată

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { MedicalExamination } from '@/lib/types'
import { checkAndCreateExpirationAlerts } from '@/lib/services/medical-alerts'

// ────────────────────────────────────────────────────────────
// GET /api/medical
// Query params: page, limit, organization_id, examination_type, result, employee_name, expiring_only, expired_only
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
    const examinationType = searchParams.get('examination_type')
    const result = searchParams.get('result')
    const employeeName = searchParams.get('employee_name')
    const expiringOnly = searchParams.get('expiring_only') === 'true'
    const expiredOnly = searchParams.get('expired_only') === 'true'

    // Validare parametri
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parametri invalizi: page >= 1, limit între 1-100' },
        { status: 400 }
      )
    }

    // Construire query cu RLS automat aplicat
    let query = supabase
      .from('medical_examinations')
      .select('*, organizations(name, cui)', { count: 'exact' })
      .order('examination_date', { ascending: false })

    // Filtrare după organization_id
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    // Filtrare după examination_type
    if (examinationType) {
      query = query.eq('examination_type', examinationType)
    }

    // Filtrare după result
    if (result) {
      query = query.eq('result', result)
    }

    // Căutare text în employee_name
    if (employeeName) {
      query = query.ilike('employee_name', `%${employeeName}%`)
    }

    // Filtrare după expiry_date (expiring în următoarele 30 zile)
    if (expiringOnly) {
      const today = new Date()
      const in30Days = new Date()
      in30Days.setDate(today.getDate() + 30)

      query = query
        .gte('expiry_date', today.toISOString().split('T')[0])
        .lte('expiry_date', in30Days.toISOString().split('T')[0])
    }

    // Filtrare după expiry_date (expired deja)
    if (expiredOnly) {
      const today = new Date()
      query = query.lt('expiry_date', today.toISOString().split('T')[0])
    }

    // Paginare
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching medical examinations:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea examenelor medicale' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as MedicalExamination[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/medical:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// POST /api/medical
// Body: { organization_id, employee_name, cnp_hash?, job_title?, examination_type, examination_date, expiry_date, result, restrictions?, doctor_name?, clinic_name?, notes? }
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
    const body = await request.json()
    const {
      organization_id,
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

    // Validare câmpuri obligatorii
    if (!organization_id || typeof organization_id !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: organization_id (UUID string)' },
        { status: 400 }
      )
    }

    if (!employee_name || typeof employee_name !== 'string' || employee_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: employee_name (string non-gol)' },
        { status: 400 }
      )
    }

    if (!examination_type || !['periodic', 'angajare', 'reluare', 'la_cerere', 'supraveghere'].includes(examination_type)) {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: examination_type (periodic, angajare, reluare, la_cerere, supraveghere)' },
        { status: 400 }
      )
    }

    if (!result || !['apt', 'apt_conditionat', 'inapt_temporar', 'inapt'].includes(result)) {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: result (apt, apt_conditionat, inapt_temporar, inapt)' },
        { status: 400 }
      )
    }

    // Validare examination_date format (YYYY-MM-DD)
    if (!examination_date || typeof examination_date !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: examination_date (format YYYY-MM-DD)' },
        { status: 400 }
      )
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(examination_date)) {
      return NextResponse.json(
        { error: 'Format examination_date invalid (așteptat YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validare expiry_date format (YYYY-MM-DD)
    if (!expiry_date || typeof expiry_date !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: expiry_date (format YYYY-MM-DD)' },
        { status: 400 }
      )
    }
    if (!dateRegex.test(expiry_date)) {
      return NextResponse.json(
        { error: 'Format expiry_date invalid (așteptat YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validare logică: expiry_date trebuie să fie după examination_date
    if (new Date(expiry_date) <= new Date(examination_date)) {
      return NextResponse.json(
        { error: 'Data expirării trebuie să fie după data examenului' },
        { status: 400 }
      )
    }

    // Construire obiect insert
    const medicalData = {
      organization_id,
      employee_name: employee_name.trim(),
      cnp_hash: cnp_hash || null,
      job_title: job_title || null,
      examination_type,
      examination_date,
      expiry_date,
      result,
      restrictions: restrictions || null,
      doctor_name: doctor_name || null,
      clinic_name: clinic_name || null,
      notes: notes || null,
      content_version: 1,
      legal_basis_version: '2026-RO-v1.0'
    }

    // Insert în DB cu RLS automat aplicat
    const { data, error } = await supabase
      .from('medical_examinations')
      .insert([medicalData])
      .select('*, organizations(name, cui)')
      .single()

    if (error) {
      console.error('Error creating medical examination:', error)

      // Verificare erori comune
      if (error.code === '23503') {
        return NextResponse.json(
          { error: 'Organizația specificată nu există sau nu aveți acces' },
          { status: 400 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a crea examene medicale pentru această organizație' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la crearea examenului medical' },
        { status: 500 }
      )
    }

    // Verificare și creare alerte automate pentru expirare
    try {
      await checkAndCreateExpirationAlerts(supabase, data as MedicalExamination)
    } catch (alertError) {
      console.error('Error creating expiration alerts:', alertError)
      // Nu returnăm eroare - examenul a fost creat cu succes, doar alertele au eșuat
    }

    return NextResponse.json({
      data: data as MedicalExamination,
      message: 'Examen medical creat cu succes'
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/medical:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
