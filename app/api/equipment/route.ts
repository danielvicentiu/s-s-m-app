// ============================================================
// S-S-M.RO — API Route: Equipment (GET, POST)
// Endpoint: /api/equipment
// Includes periodic inspections support
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
// GET /api/equipment
// Query params: organization_id (required), is_compliant (optional)
// ============================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id')
    const isCompliant = searchParams.get('is_compliant')
    const includeInspections = searchParams.get('include_inspections')

    // Validare organization_id obligatoriu
    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id este obligatoriu' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Construim query pentru echipamente
    let query = supabase
      .from('safety_equipment')
      .select('*')
      .eq('organization_id', organizationId)
      .order('expiry_date', { ascending: true })

    // Filtru optional is_compliant
    if (isCompliant !== null && isCompliant !== undefined) {
      const compliantFilter = isCompliant === 'true' || isCompliant === '1'
      query = query.eq('is_compliant', compliantFilter)
    }

    const { data: equipment, error: equipmentError } = await query

    if (equipmentError) {
      console.error('[GET /api/equipment] Supabase error:', equipmentError)
      return NextResponse.json(
        { error: 'Eroare la citire echipamente', details: equipmentError.message },
        { status: 500 }
      )
    }

    // Dacă se solicită și inspecțiile periodice
    let inspectionsData = null
    if (includeInspections === 'true' && equipment && equipment.length > 0) {
      const equipmentIds = equipment.map(e => e.id)
      const { data: inspections, error: inspectionsError } = await supabase
        .from('equipment_inspections')
        .select('*')
        .in('equipment_id', equipmentIds)
        .order('inspection_date', { ascending: false })

      if (!inspectionsError) {
        inspectionsData = inspections
      }
    }

    return NextResponse.json({
      success: true,
      data: equipment,
      inspections: inspectionsData,
      count: equipment?.length || 0
    })
  } catch (err: any) {
    console.error('[GET /api/equipment] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/equipment
// Body: equipment data (JSON)
// Optional: include periodic inspection creation
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validare câmpuri obligatorii
    const requiredFields = ['equipment_type', 'expiry_date', 'organization_id']
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

    // Validare equipment_type
    const validTypes = [
      'stingator', 'trusa_prim_ajutor', 'hidrant', 'detector_fum',
      'detector_gaz', 'iluminat_urgenta', 'panou_semnalizare',
      'trusa_scule', 'eip', 'altul'
    ]
    if (!validTypes.includes(body.equipment_type)) {
      return NextResponse.json(
        {
          error: 'Tip echipament invalid',
          validTypes
        },
        { status: 400 }
      )
    }

    // Validare expiry_date (format ISO)
    if (!isValidISODate(body.expiry_date)) {
      return NextResponse.json(
        { error: 'Format dată expirare invalid (folosește YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validare last_inspection_date dacă este furnizat
    if (body.last_inspection_date && !isValidISODate(body.last_inspection_date)) {
      return NextResponse.json(
        { error: 'Format dată ultimă inspecție invalid (folosește YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validare next_inspection_date dacă este furnizat
    if (body.next_inspection_date && !isValidISODate(body.next_inspection_date)) {
      return NextResponse.json(
        { error: 'Format dată următoare inspecție invalid (folosește YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Pregătire date pentru insert
    const equipmentData = {
      equipment_type: body.equipment_type,
      description: body.description?.trim() || null,
      location: body.location?.trim() || null,
      serial_number: body.serial_number?.trim() || null,
      last_inspection_date: body.last_inspection_date || null,
      expiry_date: body.expiry_date,
      next_inspection_date: body.next_inspection_date || null,
      inspector_name: body.inspector_name?.trim() || null,
      is_compliant: body.is_compliant !== undefined ? body.is_compliant : true,
      notes: body.notes?.trim() || null,
      organization_id: body.organization_id,
      content_version: body.content_version || 1,
      legal_basis_version: body.legal_basis_version || '1.0'
    }

    const supabase = getSupabase()

    // Verificare dacă organizația există
    const { data: orgExists, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', equipmentData.organization_id)
      .single()

    if (orgError || !orgExists) {
      return NextResponse.json(
        { error: 'Organizația specificată nu există' },
        { status: 404 }
      )
    }

    // Insert echipament
    const { data, error } = await supabase
      .from('safety_equipment')
      .insert([equipmentData])
      .select()
      .single()

    if (error) {
      console.error('[POST /api/equipment] Supabase error:', error)
      return NextResponse.json(
        { error: 'Eroare la creare echipament', details: error.message },
        { status: 500 }
      )
    }

    // Dacă există date de inspecție inițială, creăm și înregistrarea
    let inspectionData = null
    if (body.createInitialInspection && body.last_inspection_date) {
      const inspection = {
        equipment_id: data.id,
        inspection_date: body.last_inspection_date,
        inspector_name: body.inspector_name?.trim() || null,
        inspection_type: body.inspection_type || 'periodica',
        result: body.inspection_result || 'conform',
        notes: body.inspection_notes?.trim() || null,
        next_inspection_date: body.next_inspection_date || null
      }

      const { data: inspectionResult, error: inspectionError } = await supabase
        .from('equipment_inspections')
        .insert([inspection])
        .select()
        .single()

      if (!inspectionError) {
        inspectionData = inspectionResult
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Echipament creat cu succes',
        data,
        inspection: inspectionData
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[POST /api/equipment] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
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
