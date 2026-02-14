// app/api/pdf/fisa-eip/[employeeId]/route.ts
// API route pentru generare și download PDF Fișă individuală de atribuire EIP

import { NextRequest, NextResponse } from 'next/server'
import { generateFisaEIPPDF } from '@/lib/services/pdf-generators/fisa-eip'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const { employeeId } = params

    // Verificare autentificare
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautorizat. Te rugăm să te autentifici.' },
        { status: 401 }
      )
    }

    // Get organization ID from query params
    const searchParams = request.nextUrl.searchParams
    const orgId = searchParams.get('orgId')

    if (!orgId) {
      return NextResponse.json(
        { error: 'Parametru lipsă: orgId' },
        { status: 400 }
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

    // Verificare că angajatul aparține organizației
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('id, full_name')
      .eq('id', employeeId)
      .eq('organization_id', orgId)
      .single()

    if (empError || !employee) {
      return NextResponse.json(
        { error: 'Angajatul nu a fost găsit.' },
        { status: 404 }
      )
    }

    // Generare PDF
    const pdfBuffer = await generateFisaEIPPDF(employeeId, orgId)

    // Sanitize filename - remove special characters
    const sanitizedName = employee.full_name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
      .replace(/\s+/g, '_') // Replace spaces with underscore

    const fileName = `Fisa_EIP_${sanitizedName}.pdf`

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('[API] Error generating PDF:', error)

    const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută'

    return NextResponse.json(
      { error: `Eroare la generarea PDF: ${errorMessage}` },
      { status: 500 }
    )
  }
}
