// app/api/generate-fisa-post/route.ts
// API Route: Generate Fișă de Post SSM PDF

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

const { generateFisaPostPDF } = require('@/lib/generate-fisa-post')

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [API/generate-fisa-post] Request received')

    const body = await request.json()
    console.log('🔍 [API/generate-fisa-post] Request body:', JSON.stringify(body, null, 2))

    const {
      employee_id,
      employee_name,
      job_title,
      cor_code,
      organization_id,
      organization_name,
      organization_cui,
      organization_address,
      department,
    } = body

    if (!employee_name || !job_title || !organization_id) {
      console.error('❌ [API/generate-fisa-post] Missing required fields:', { employee_name, job_title, organization_id })
      return NextResponse.json(
        { error: 'employee_name, job_title, and organization_id are required' },
        { status: 400 }
      )
    }

    // Verificare autentificare
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Build PDF data
    const pdfData = {
      organization_name: organization_name || 'Organizație',
      organization_details: organization_cui
        ? `CUI: ${organization_cui}${organization_address ? ` · ${organization_address}` : ''}`
        : organization_address || '',
      document_number: `FP-${new Date().getFullYear()}-${employee_id?.substring(0, 6).toUpperCase() || Math.random().toString(36).substring(2, 8).toUpperCase()}`,

      employee_name,
      job_title,
      cor_code: cor_code || 'Neclasificat',
      department: department || 'Conform organigramă',

      tasks: null, // Va folosi default din generator
      risks: null, // Va folosi default din generator
      eip: null, // Va folosi default din generator
      cerinte: null, // Va folosi default din generator

      prepared_by: user.email || 'Responsabil SSM',
    }

    // Generate PDF
    console.log('🔍 [API/generate-fisa-post] Generating PDF with data:', JSON.stringify(pdfData, null, 2))
    const pdfBuffer: Buffer = await generateFisaPostPDF(pdfData)
    console.log('✅ [API/generate-fisa-post] PDF generated successfully, buffer size:', pdfBuffer.length)

    // Return PDF
    const filename = `Fisa_Post_${job_title.replace(/\s+/g, '_')}_${employee_name.replace(/\s+/g, '_')}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('❌ [API/generate-fisa-post] PDF generation error:', error)
    console.error('❌ [API/generate-fisa-post] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('❌ [API/generate-fisa-post] Error message:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
