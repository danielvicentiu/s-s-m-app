/**
 * API Route: GET /api/iscir/qr/[id]
 * Returns QR code URL for an ISCIR equipment's daily check page.
 * The QR image is generated via the free api.qrserver.com service (no npm dependency).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const { id } = await params

    // Verify equipment exists and user has access (RLS handles org scoping)
    const { data: equipment, error } = await supabase
      .from('iscir_equipment')
      .select('id, identifier, equipment_type, organization_id, daily_check_required')
      .eq('id', id)
      .single()

    if (error || !equipment) {
      return NextResponse.json({ error: 'Echipament negăsit' }, { status: 404 })
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://app.s-s-m.ro'

    // Direct URL the QR code will open when scanned
    const targetUrl = `${appUrl}/dashboard/iscir/daily?equipment=${id}`

    // QR code image URL via qrserver.com (free, no auth needed)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      targetUrl
    )}&format=png&margin=10&color=1e3a5f`

    return NextResponse.json({
      equipment_id: id,
      identifier: equipment.identifier,
      equipment_type: equipment.equipment_type,
      daily_check_required: equipment.daily_check_required,
      target_url: targetUrl,
      qr_image_url: qrImageUrl,
    })
  } catch (error) {
    console.error('Error in GET /api/iscir/qr/[id]:', error)
    return NextResponse.json(
      { error: 'Eroare la generarea codului QR' },
      { status: 500 }
    )
  }
}
