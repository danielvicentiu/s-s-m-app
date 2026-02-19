// app/api/otp/devices/route.ts
// GET  — list user trusted devices
// DELETE {deviceId} — revoke specific device

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { listDevices, revokeDevice, revokeAllDevices } from '@/lib/otp/deviceTrust'

// GET /api/otp/devices
export async function GET(_req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat.' }, { status: 401 })
    }

    const devices = await listDevices(user.id)
    return NextResponse.json({ devices })
  } catch (err) {
    console.error('GET /api/otp/devices error:', err)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}

// DELETE /api/otp/devices
// Body: {deviceId} to revoke one, {all: true} to revoke all
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat.' }, { status: 401 })
    }

    const body = await req.json()
    const { deviceId, all } = body as { deviceId?: string; all?: boolean }

    if (all) {
      const ok = await revokeAllDevices(user.id)
      return NextResponse.json({ success: ok })
    }

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId obligatoriu.' }, { status: 400 })
    }

    // Verify device belongs to user before revoking
    const { data: device, error: fetchError } = await supabase
      .from('trusted_devices')
      .select('id')
      .eq('id', deviceId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError || !device) {
      return NextResponse.json({ error: 'Dispozitiv negăsit.' }, { status: 404 })
    }

    const ok = await revokeDevice(deviceId)
    return NextResponse.json({ success: ok })
  } catch (err) {
    console.error('DELETE /api/otp/devices error:', err)
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 })
  }
}
