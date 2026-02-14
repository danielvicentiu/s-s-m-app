// app/api/pdf/decizie-cssm/[orgId]/route.ts
// API route pentru generare și download PDF Decizie constituire CSSM

import { NextRequest, NextResponse } from 'next/server'
import { generateDecizieCSSDMPDF } from '@/lib/services/pdf-generators/decizie-cssm'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { orgId } = params

    // Verificare autentificare
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautorizat. Te rugăm să te autentifici.' },
        { status: 401 }
      )
    }

    // Verificare acces la organizație
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'Nu ai acces la această organizație.' },
        { status: 403 }
      )
    }

    // Only consultants and firma_admin can generate this document
    if (membership.role !== 'consultant' && membership.role !== 'firma_admin') {
      return NextResponse.json(
        { error: 'Nu ai permisiunea de a genera acest document.' },
        { status: 403 }
      )
    }

    // Get optional query parameters
    const searchParams = request.nextUrl.searchParams
    const decisionNumber = searchParams.get('decisionNumber') || undefined
    const decisionDate = searchParams.get('decisionDate') || undefined
    const establishmentReason = searchParams.get('establishmentReason') || undefined

    // Verificare că organizația există
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', orgId)
      .single()

    if (orgError || !organization) {
      return NextResponse.json(
        { error: 'Organizația nu a fost găsită.' },
        { status: 404 }
      )
    }

    // Generare PDF
    const pdfBuffer = await generateDecizieCSSDMPDF(orgId, {
      decisionNumber,
      decisionDate,
      establishmentReason
    })

    // Sanitize filename - remove special characters
    const sanitizedName = organization.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
      .replace(/\s+/g, '_') // Replace spaces with underscore

    const fileName = `Decizie_CSSM_${sanitizedName}.pdf`

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('[API] Error generating CSSM decision PDF:', error)

    const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută'

    return NextResponse.json(
      { error: `Eroare la generarea PDF: ${errorMessage}` },
      { status: 500 }
    )
  }
}
