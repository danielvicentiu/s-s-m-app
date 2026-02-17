// app/api/upload/[token]/route.ts
// GET:  Validate token, return organization info (public endpoint)
// POST: Receive image, save to storage, create scan record (public endpoint)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ============================================================
// GET /api/upload/[token] - Validate token and return info
// ============================================================
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = createServiceRoleClient()

    const { data: link, error } = await supabase
      .from('upload_links')
      .select(`
        id,
        label,
        is_active,
        expires_at,
        organization:organizations (
          id,
          name
        )
      `)
      .eq('token', token)
      .single()

    if (error || !link) {
      return NextResponse.json(
        { valid: false, error: 'Link invalid sau expirat' },
        { status: 404 }
      )
    }

    if (!link.is_active) {
      return NextResponse.json(
        { valid: false, error: 'Acest link nu mai este activ' },
        { status: 410 }
      )
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Link-ul a expirat' },
        { status: 410 }
      )
    }

    const org = link.organization as { id: string; name: string } | null

    return NextResponse.json({
      valid: true,
      label: link.label,
      organization_name: org?.name || '',
    })
  } catch (err: any) {
    console.error('[API] upload token GET exception:', err)
    return NextResponse.json(
      { valid: false, error: 'Eroare server' },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/upload/[token] - Receive and process image
// ============================================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = createServiceRoleClient()

    // 1. Validate token
    const { data: link, error: linkError } = await supabase
      .from('upload_links')
      .select('id, organization_id, is_active, expires_at, label')
      .eq('token', token)
      .single()

    if (linkError || !link) {
      return NextResponse.json(
        { success: false, error: 'Link invalid' },
        { status: 404 }
      )
    }

    if (!link.is_active || (link.expires_at && new Date(link.expires_at) < new Date())) {
      return NextResponse.json(
        { success: false, error: 'Link invalid sau expirat' },
        { status: 410 }
      )
    }

    // 2. Parse FormData
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'Nicio imagine primită' },
        { status: 400 }
      )
    }

    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Fișierul trebuie să fie o imagine' },
        { status: 400 }
      )
    }

    // 3. Save to Supabase Storage
    const imageBuffer = await imageFile.arrayBuffer()
    const imageBytes = new Uint8Array(imageBuffer)
    const timestamp = Date.now()
    const ext = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    const storagePath = `${link.organization_id}/${token}/${timestamp}.${ext}`

    const { error: storageError } = await supabase.storage
      .from('uploads')
      .upload(storagePath, imageBytes, {
        contentType: imageFile.type,
        upsert: false,
      })

    if (storageError) {
      console.error('[API] upload storage error:', storageError)
      return NextResponse.json(
        { success: false, error: 'Eroare la salvarea imaginii' },
        { status: 500 }
      )
    }

    // 4. Create document_scans record (pending, to be reviewed by consultant)
    const { data: scan, error: scanError } = await supabase
      .from('document_scans')
      .insert({
        org_id: link.organization_id,
        template_key: null,        // Will be detected during review
        original_filename: imageFile.name,
        storage_path: storagePath,
        status: 'pending',
        created_by: null,          // Anonymous upload via link
      })
      .select('id')
      .single()

    if (scanError) {
      console.error('[API] upload scan record error:', scanError)
      // Don't fail — image is already saved in storage
    }

    // 5. Atomically increment scan_count on the upload link
    const { error: rpcError } = await supabase.rpc('increment_upload_link_count', {
      link_id: link.id,
    })

    if (rpcError) {
      console.error('[API] upload increment scan_count error:', rpcError)
      // Non-fatal, continue
    }

    return NextResponse.json({
      success: true,
      message: 'Documentul a fost trimis cu succes!',
      scan_id: scan?.id ?? null,
    })
  } catch (err: any) {
    console.error('[API] upload token POST exception:', err)
    return NextResponse.json(
      { success: false, error: 'Eroare server' },
      { status: 500 }
    )
  }
}
