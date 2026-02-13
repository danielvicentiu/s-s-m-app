// ============================================================
// S-S-M.RO — API Route: Equipment by ID (GET, PUT, DELETE)
// Endpoint: /api/equipment/[id]
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

// Type pentru params Next.js 14 App Router
type RouteParams = {
  params: Promise<{ id: string }>
}

// ============================================================
// GET /api/equipment/[id]
// Returnează un singur echipament după ID
// Query param: include_inspections=true pentru a include istoricul inspecțiilor
// ============================================================
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeInspections = searchParams.get('include_inspections')

    // Validare UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID invalid (format UUID așteptat)' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('safety_equipment')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Echipament negăsit' },
          { status: 404 }
        )
      }

      console.error(`[GET /api/equipment/${id}] Supabase error:`, error)
      return NextResponse.json(
        { error: 'Eroare la citire echipament', details: error.message },
        { status: 500 }
      )
    }

    // Dacă se solicită și inspecțiile
    let inspectionsData = null
    if (includeInspections === 'true') {
      const { data: inspections, error: inspectionsError } = await supabase
        .from('equipment_inspections')
        .select('*')
        .eq('equipment_id', id)
        .order('inspection_date', { ascending: false })

      if (!inspectionsError) {
        inspectionsData = inspections
      }
    }

    return NextResponse.json({
      success: true,
      data,
      inspections: inspectionsData
    })
  } catch (err: any) {
    console.error('[GET /api/equipment/[id]] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// PUT /api/equipment/[id]
// Actualizează echipament existent
// Optional: can also add a new inspection record
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
      'equipment_type',
      'description',
      'location',
      'serial_number',
      'last_inspection_date',
      'expiry_date',
      'next_inspection_date',
      'inspector_name',
      'is_compliant',
      'notes',
      'content_version',
      'legal_basis_version'
    ]

    const updateFields = Object.keys(body).filter(key => allowedFields.includes(key))

    if (updateFields.length === 0 && !body.addInspection) {
      return NextResponse.json(
        { error: 'Niciun câmp valid de actualizat', allowed_fields: allowedFields },
        { status: 400 }
      )
    }

    // Validări specifice pe câmpuri
    if (body.equipment_type !== undefined) {
      const validTypes = [
        'stingator', 'trusa_prim_ajutor', 'hidrant', 'detector_fum',
        'detector_gaz', 'iluminat_urgenta', 'panou_semnalizare',
        'trusa_scule', 'eip', 'altul'
      ]
      if (!validTypes.includes(body.equipment_type)) {
        return NextResponse.json(
          { error: 'Tip echipament invalid', validTypes },
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

    if (body.last_inspection_date !== undefined && body.last_inspection_date !== null) {
      if (!isValidISODate(body.last_inspection_date)) {
        return NextResponse.json(
          { error: 'Format dată ultimă inspecție invalid (folosește YYYY-MM-DD)' },
          { status: 400 }
        )
      }
    }

    if (body.next_inspection_date !== undefined && body.next_inspection_date !== null) {
      if (!isValidISODate(body.next_inspection_date)) {
        return NextResponse.json(
          { error: 'Format dată următoare inspecție invalid (folosește YYYY-MM-DD)' },
          { status: 400 }
        )
      }
    }

    const supabase = getSupabase()

    // Verificare dacă echipamentul există
    const { data: exists, error: existsError } = await supabase
      .from('safety_equipment')
      .select('id, equipment_type')
      .eq('id', id)
      .single()

    if (existsError || !exists) {
      return NextResponse.json(
        { error: 'Echipament negăsit' },
        { status: 404 }
      )
    }

    // Pregătire date pentru update (doar dacă există câmpuri)
    let data = null
    if (updateFields.length > 0) {
      const updateData: Record<string, any> = {}

      if (body.equipment_type !== undefined) updateData.equipment_type = body.equipment_type
      if (body.description !== undefined) updateData.description = body.description?.trim() || null
      if (body.location !== undefined) updateData.location = body.location?.trim() || null
      if (body.serial_number !== undefined) updateData.serial_number = body.serial_number?.trim() || null
      if (body.last_inspection_date !== undefined) updateData.last_inspection_date = body.last_inspection_date || null
      if (body.expiry_date !== undefined) updateData.expiry_date = body.expiry_date
      if (body.next_inspection_date !== undefined) updateData.next_inspection_date = body.next_inspection_date || null
      if (body.inspector_name !== undefined) updateData.inspector_name = body.inspector_name?.trim() || null
      if (body.is_compliant !== undefined) updateData.is_compliant = Boolean(body.is_compliant)
      if (body.notes !== undefined) updateData.notes = body.notes?.trim() || null
      if (body.content_version !== undefined) updateData.content_version = body.content_version
      if (body.legal_basis_version !== undefined) updateData.legal_basis_version = body.legal_basis_version

      // Adaugă updated_at
      updateData.updated_at = new Date().toISOString()

      // Update echipament
      const { data: updateResult, error } = await supabase
        .from('safety_equipment')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error(`[PUT /api/equipment/${id}] Supabase error:`, error)
        return NextResponse.json(
          { error: 'Eroare la actualizare echipament', details: error.message },
          { status: 500 }
        )
      }

      data = updateResult
    } else {
      // Dacă nu există update-uri de echipament, obținem datele curente
      const { data: currentData } = await supabase
        .from('safety_equipment')
        .select('*')
        .eq('id', id)
        .single()
      data = currentData
    }

    // Dacă se solicită adăugarea unei noi inspecții
    let inspectionData = null
    if (body.addInspection && body.addInspection.inspection_date) {
      const inspection = {
        equipment_id: id,
        inspection_date: body.addInspection.inspection_date,
        inspector_name: body.addInspection.inspector_name?.trim() || null,
        inspection_type: body.addInspection.inspection_type || 'periodica',
        result: body.addInspection.result || 'conform',
        notes: body.addInspection.notes?.trim() || null,
        next_inspection_date: body.addInspection.next_inspection_date || null
      }

      const { data: inspectionResult, error: inspectionError } = await supabase
        .from('equipment_inspections')
        .insert([inspection])
        .select()
        .single()

      if (!inspectionError) {
        inspectionData = inspectionResult

        // Update last_inspection_date și next_inspection_date pe echipament
        await supabase
          .from('safety_equipment')
          .update({
            last_inspection_date: inspection.inspection_date,
            next_inspection_date: inspection.next_inspection_date,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
      }
    }

    return NextResponse.json({
      success: true,
      message: inspectionData
        ? 'Echipament actualizat și inspecție adăugată cu succes'
        : 'Echipament actualizat cu succes',
      data,
      inspection: inspectionData
    })
  } catch (err: any) {
    console.error('[PUT /api/equipment/[id]] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Eroare server', details: err.message },
      { status: 500 }
    )
  }
}

// ============================================================
// DELETE /api/equipment/[id]
// Șterge echipament (soft delete prin is_compliant = false)
// Query param: hard_delete=true pentru ștergere definitivă
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
    const hardDelete = searchParams.get('hard_delete') === 'true'

    const supabase = getSupabase()

    // Verificare dacă echipamentul există
    const { data: exists, error: existsError } = await supabase
      .from('safety_equipment')
      .select('id, equipment_type, description')
      .eq('id', id)
      .single()

    if (existsError || !exists) {
      return NextResponse.json(
        { error: 'Echipament negăsit' },
        { status: 404 }
      )
    }

    if (hardDelete) {
      // HARD DELETE — Ștergere definitivă din baza de date
      // Mai întâi șterge inspecțiile asociate
      await supabase
        .from('equipment_inspections')
        .delete()
        .eq('equipment_id', id)

      // Apoi șterge echipamentul
      const { error } = await supabase
        .from('safety_equipment')
        .delete()
        .eq('id', id)

      if (error) {
        console.error(`[DELETE /api/equipment/${id}] Hard delete error:`, error)
        return NextResponse.json(
          { error: 'Eroare la ștergere echipament', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Echipament șters definitiv',
        deleted_equipment: exists.description || exists.equipment_type
      })
    } else {
      // SOFT DELETE — Setare is_compliant = false (recomandat)
      const { data, error } = await supabase
        .from('safety_equipment')
        .update({
          is_compliant: false,
          notes: (exists as any).notes
            ? `${(exists as any).notes}\n[Dezactivat: ${new Date().toISOString()}]`
            : `[Dezactivat: ${new Date().toISOString()}]`,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error(`[DELETE /api/equipment/${id}] Soft delete error:`, error)
        return NextResponse.json(
          { error: 'Eroare la dezactivare echipament', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Echipament dezactivat cu succes',
        data
      })
    }
  } catch (err: any) {
    console.error('[DELETE /api/equipment/[id]] Unexpected error:', err)
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
