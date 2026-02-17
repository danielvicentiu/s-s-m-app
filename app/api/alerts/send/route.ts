// S-S-M.RO — Manual Alert Sending API
// POST /api/alerts/send - trimite alerte manual pentru o org sau toate

import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import {
  sendOrganizationAlerts,
  sendAllOrganizationAlerts,
} from '@/lib/email/alert-sender'

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()

    // Verificăm autentificarea
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautentificat' },
        { status: 401 }
      )
    }

    // Verificăm dacă userul e consultant (are cel puțin o membership cu role consultant)
    const { data: memberships, error: membershipError } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'consultant')
      .eq('is_active', true)
      .limit(1)

    if (membershipError || !memberships || memberships.length === 0) {
      return NextResponse.json(
        { error: 'Acces interzis - doar consultanții pot trimite alerte' },
        { status: 403 }
      )
    }

    // Citim body-ul
    const body = await request.json()
    const { organizationId } = body

    // Dacă avem organizationId specific, trimitem doar pentru acea org
    if (organizationId) {
      // Verificăm că userul e consultant pentru acea org
      const { data: orgMembership, error: orgMembershipError } = await supabase
        .from('memberships')
        .select('id')
        .eq('user_id', user.id)
        .eq('organization_id', organizationId)
        .eq('role', 'consultant')
        .eq('is_active', true)
        .single()

      if (orgMembershipError || !orgMembership) {
        return NextResponse.json(
          { error: 'Nu aveți acces la această organizație' },
          { status: 403 }
        )
      }

      const result = await sendOrganizationAlerts(organizationId)

      return NextResponse.json({
        success: true,
        type: 'single',
        result,
      })
    }

    // Altfel, trimitem pentru toate organizațiile (doar dacă e consultant)
    const result = await sendAllOrganizationAlerts()

    return NextResponse.json({
      success: true,
      type: 'bulk',
      result,
    })
  } catch (error) {
    console.error('Error in /api/alerts/send:', error)
    return NextResponse.json(
      {
        error: 'Eroare la trimiterea alertelor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
