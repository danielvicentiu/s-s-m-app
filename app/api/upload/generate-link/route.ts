// app/api/upload/generate-link/route.ts
// POST: Generate a unique upload link for a client (requires authentication)
// Returns a URL that can be shared with clients for document upload without login

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const body = await request.json()
    const { organization_id, label, expires_days = 30 } = body

    if (!organization_id) {
      return NextResponse.json(
        { error: 'organization_id este obligatoriu' },
        { status: 400 }
      )
    }

    // Verify membership in the organization
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('id')
      .eq('organization_id', organization_id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Acces interzis la această organizație' },
        { status: 403 }
      )
    }

    // Calculate expiry date
    const expires_at = new Date()
    expires_at.setDate(expires_at.getDate() + expires_days)

    // Create the upload link
    const { data: link, error: insertError } = await supabase
      .from('upload_links')
      .insert({
        organization_id,
        label: label || 'Link upload documente',
        created_by: user.id,
        expires_at: expires_at.toISOString(),
      })
      .select()
      .single()

    if (insertError || !link) {
      console.error('[API] generate-link insert error:', insertError)
      return NextResponse.json(
        { error: 'Eroare la generarea linkului' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.s-s-m.ro'
    const uploadUrl = `${baseUrl}/ro/upload/${link.token}`

    return NextResponse.json(
      { link, url: uploadUrl },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[API] generate-link exception:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
