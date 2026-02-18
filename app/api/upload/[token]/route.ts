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

    // 6. AI extraction pipeline (non-blocking)
    if (scan?.id) {
      try {
        // 6b. Call Claude Vision API using base64 (Claude API does not accept external URLs)
        const base64String = Buffer.from(imageBytes).toString('base64')

        const anthropicApiKey = process.env.ANTHROPIC_API_KEY
        if (!anthropicApiKey) {
          throw new Error('ANTHROPIC_API_KEY not configured')
        }

        const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            system: 'Esti un expert in extragerea datelor din documente romanesti (bonuri fiscale, facturi, chitante, extrase bancare). Analizeaza imaginea si extrage TOATE datele disponibile in format JSON valid fara markdown. Structura JSON obligatorie: { "tip_document": "bon fiscal/factura/chitanta/extras bancar/contract/altul", "furnizor_nume": "numele complet al vanzatorului", "furnizor_cui": "CUI/CIF vanzator cu sau fara RO", "furnizor_adresa": "adresa completa vanzator", "cumparator_nume": "numele cumparatorului daca apare", "cumparator_cui": "CUI cumparator daca apare", "data_document": "DD.MM.YYYY", "numar_document": "numar factura/bon/chitanta", "produse": [{"denumire": "numele produsului/serviciului", "cantitate": 1, "unitate": "buc/kg/l/ore", "pret_unitar": 0.00, "valoare_fara_tva": 0.00, "tva_procent": 19, "tva_valoare": 0.00, "valoare_cu_tva": 0.00}], "subtotal_fara_tva": 0.00, "tva_total": 0.00, "total_cu_tva": 0.00, "moneda": "RON/EUR", "metoda_plata": "numerar/card/transfer", "cota_tva_detalii": [{"procent": 19, "baza": 0.00, "tva": 0.00}] }. Extrage FIECARE produs separat cu pretul defalcat. La bonuri fiscale, CUI-ul e dupa textul CUI sau CIF. Numarul bonului e dupa BON FISCAL NR sau NR. Data e in diverse formate, converteste la DD.MM.YYYY. Daca un camp nu e vizibil in document, seteaza null.',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: imageFile.type,
                      data: base64String,
                    },
                  },
                  {
                    type: 'text',
                    text: 'Extrage datele din acest document.',
                  },
                ],
              },
            ],
          }),
        })

        if (!aiResponse.ok) {
          const errText = await aiResponse.text()
          throw new Error(`Claude API error: ${aiResponse.status} - ${errText}`)
        }

        const aiData = await aiResponse.json()
        const rawText: string = aiData.content?.[0]?.text || ''

        // 6c. Parse JSON response
        const jsonMatch = rawText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error('No JSON found in AI response')
        }
        const extractedData = JSON.parse(jsonMatch[0])

        // 6d. Update document_scans with extracted data
        const { error: updateError } = await supabase
          .from('document_scans')
          .update({
            extracted_data: extractedData,
            confidence_score: 85,
            status: 'completed',
            template_key: null,
          })
          .eq('id', scan.id)

        if (updateError) {
          console.error('[API] upload AI update scan error:', updateError)
        }
      } catch (aiErr: any) {
        // 6e. Non-fatal: leave status as pending, log error
        console.error('[API] upload AI extraction error:', aiErr)
      }
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
