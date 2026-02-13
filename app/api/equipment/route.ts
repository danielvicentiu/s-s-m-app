// S-S-M.RO — API Routes: Equipment CRUD
// GET: Listare echipamente PSI cu paginare și filtrare
// POST: Creare echipament nou cu validare și alertare automată

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { SafetyEquipment } from '@/lib/types'

// ────────────────────────────────────────────────────────────
// GET /api/equipment
// Query params: page, limit, organization_id, equipment_type, location, is_compliant, expiring_only, expired_only
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
    const equipmentType = searchParams.get('equipment_type')
    const location = searchParams.get('location')
    const isCompliant = searchParams.get('is_compliant')
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
      .from('safety_equipment')
      .select('*, organizations(name, cui)', { count: 'exact' })
      .order('expiry_date', { ascending: true })

    // Filtrare după organization_id
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    // Filtrare după equipment_type
    if (equipmentType) {
      query = query.eq('equipment_type', equipmentType)
    }

    // Căutare text în location
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    // Filtrare după is_compliant
    if (isCompliant !== null && isCompliant !== undefined) {
      query = query.eq('is_compliant', isCompliant === 'true')
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
      console.error('Error fetching equipment:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea echipamentelor' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as SafetyEquipment[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/equipment:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// POST /api/equipment
// Body: { organization_id, equipment_type, description?, location?, serial_number?, last_inspection_date?, expiry_date, next_inspection_date?, inspector_name?, is_compliant, notes? }
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
      equipment_type,
      description,
      location,
      serial_number,
      last_inspection_date,
      expiry_date,
      next_inspection_date,
      inspector_name,
      is_compliant,
      notes
    } = body

    // Validare câmpuri obligatorii
    if (!organization_id || typeof organization_id !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: organization_id (UUID string)' },
        { status: 400 }
      )
    }

    // Validare equipment_type
    const validTypes = [
      'stingator', 'trusa_prim_ajutor', 'hidrant', 'detector_fum',
      'detector_gaz', 'iluminat_urgenta', 'panou_semnalizare',
      'trusa_scule', 'eip', 'altul'
    ]
    if (!equipment_type || !validTypes.includes(equipment_type)) {
      return NextResponse.json(
        { error: `Câmp obligatoriu: equipment_type (${validTypes.join(', ')})` },
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
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(expiry_date)) {
      return NextResponse.json(
        { error: 'Format expiry_date invalid (așteptat YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validare last_inspection_date format (dacă e furnizat)
    if (last_inspection_date && typeof last_inspection_date === 'string') {
      if (!dateRegex.test(last_inspection_date)) {
        return NextResponse.json(
          { error: 'Format last_inspection_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
    }

    // Validare next_inspection_date format (dacă e furnizat)
    if (next_inspection_date && typeof next_inspection_date === 'string') {
      if (!dateRegex.test(next_inspection_date)) {
        return NextResponse.json(
          { error: 'Format next_inspection_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
    }

    // Validare is_compliant
    if (is_compliant === undefined || typeof is_compliant !== 'boolean') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: is_compliant (boolean)' },
        { status: 400 }
      )
    }

    // Validare logică: next_inspection_date trebuie să fie după last_inspection_date (dacă ambele sunt furnizate)
    if (last_inspection_date && next_inspection_date) {
      if (new Date(next_inspection_date) <= new Date(last_inspection_date)) {
        return NextResponse.json(
          { error: 'Data următoarei inspecții trebuie să fie după ultima inspecție' },
          { status: 400 }
        )
      }
    }

    // Construire obiect insert
    const equipmentData = {
      organization_id,
      equipment_type,
      description: description || null,
      location: location || null,
      serial_number: serial_number || null,
      last_inspection_date: last_inspection_date || null,
      expiry_date,
      next_inspection_date: next_inspection_date || null,
      inspector_name: inspector_name || null,
      is_compliant,
      notes: notes || null,
      content_version: 1,
      legal_basis_version: '2026-RO-v1.0'
    }

    // Insert în DB cu RLS automat aplicat
    const { data, error } = await supabase
      .from('safety_equipment')
      .insert([equipmentData])
      .select('*, organizations(name, cui)')
      .single()

    if (error) {
      console.error('Error creating equipment:', error)

      // Verificare erori comune
      if (error.code === '23503') {
        return NextResponse.json(
          { error: 'Organizația specificată nu există sau nu aveți acces' },
          { status: 400 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a crea echipamente pentru această organizație' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la crearea echipamentului' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as SafetyEquipment,
      message: 'Echipament creat cu succes'
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/equipment:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
