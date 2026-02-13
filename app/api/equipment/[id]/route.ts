// S-S-M.RO — API Routes: Single Equipment Operations
// GET: Obține un echipament specific
// PUT: Actualizează un echipament existent
// DELETE: Șterge un echipament (hard delete)

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { SafetyEquipment } from '@/lib/types'

// ────────────────────────────────────────────────────────────
// GET /api/equipment/[id]
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

    // Obținere echipament cu RLS automat aplicat
    const { data, error } = await supabase
      .from('safety_equipment')
      .select('*, organizations(name, cui)')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching equipment:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Echipament negăsit sau nu aveți acces' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la încărcarea echipamentului' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as SafetyEquipment
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/equipment/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// PUT /api/equipment/[id]
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

    // Construire obiect update (doar câmpurile furnizate)
    const updateData: Partial<SafetyEquipment> = {}

    // Validare equipment_type
    if (equipment_type !== undefined) {
      const validTypes = [
        'stingator', 'trusa_prim_ajutor', 'hidrant', 'detector_fum',
        'detector_gaz', 'iluminat_urgenta', 'panou_semnalizare',
        'trusa_scule', 'eip', 'altul'
      ]
      if (!validTypes.includes(equipment_type)) {
        return NextResponse.json(
          { error: `equipment_type invalid (${validTypes.join(', ')})` },
          { status: 400 }
        )
      }
      updateData.equipment_type = equipment_type
    }

    if (description !== undefined) updateData.description = description || null
    if (location !== undefined) updateData.location = location || null
    if (serial_number !== undefined) updateData.serial_number = serial_number || null
    if (inspector_name !== undefined) updateData.inspector_name = inspector_name || null
    if (notes !== undefined) updateData.notes = notes || null

    // Validare date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    if (last_inspection_date !== undefined) {
      if (last_inspection_date !== null && (typeof last_inspection_date !== 'string' || !dateRegex.test(last_inspection_date))) {
        return NextResponse.json(
          { error: 'Format last_inspection_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
      updateData.last_inspection_date = last_inspection_date
    }

    if (expiry_date !== undefined) {
      if (typeof expiry_date !== 'string' || !dateRegex.test(expiry_date)) {
        return NextResponse.json(
          { error: 'Format expiry_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
      updateData.expiry_date = expiry_date
    }

    if (next_inspection_date !== undefined) {
      if (next_inspection_date !== null && (typeof next_inspection_date !== 'string' || !dateRegex.test(next_inspection_date))) {
        return NextResponse.json(
          { error: 'Format next_inspection_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
      updateData.next_inspection_date = next_inspection_date
    }

    // Validare is_compliant
    if (is_compliant !== undefined) {
      if (typeof is_compliant !== 'boolean') {
        return NextResponse.json(
          { error: 'is_compliant trebuie să fie boolean' },
          { status: 400 }
        )
      }
      updateData.is_compliant = is_compliant
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
      .from('safety_equipment')
      .update(updateData)
      .eq('id', id)
      .select('*, organizations(name, cui)')
      .single()

    if (error) {
      console.error('Error updating equipment:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Echipament negăsit sau nu aveți acces' },
          { status: 404 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a actualiza acest echipament' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la actualizarea echipamentului' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as SafetyEquipment,
      message: 'Echipament actualizat cu succes'
    })
  } catch (error) {
    console.error('Unexpected error in PUT /api/equipment/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// DELETE /api/equipment/[id]
// Hard delete din DB
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

    // Hard delete din DB cu RLS automat aplicat
    const { error } = await supabase
      .from('safety_equipment')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting equipment:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Echipament negăsit sau nu aveți acces' },
          { status: 404 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a șterge acest echipament' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la ștergerea echipamentului' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Echipament șters cu succes'
    })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/equipment/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
