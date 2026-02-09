// app/api/generate-tematica/route.ts
// API Route: Generate Tematică de Instruire SSM PDF

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

const { generateTematicaPDF } = require('@/lib/generate-tematica')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employee_id,
      employee_name,
      job_title,
      organization_id,
      organization_name,
      organization_cui,
      organization_address,
    } = body

    if (!employee_name || !organization_id) {
      return NextResponse.json(
        { error: 'employee_name and organization_id are required' },
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
      document_number: `TI-${new Date().getFullYear()}-${employee_id?.substring(0, 6).toUpperCase() || Math.random().toString(36).substring(2, 8).toUpperCase()}`,

      employee_name,
      job_title: job_title || 'Angajat',

      training_type: 'introductiv_general',
      legal_basis: ['Legea 319/2006 Art.20 lit.c', 'HG 1425/2006 Art.95-99'],

      scop: 'Instruirea personalului în domeniul securității și sănătății în muncă, conform cerințelor legale în vigoare, pentru asigurarea unui mediu de lucru sigur și sănătos.',
      obiective: [
        'Cunoașterea legislației în domeniul SSM și PSI',
        'Identificarea riscurilor la locul de muncă',
        'Aplicarea măsurilor de prevenire și protecție',
        'Acționarea corectă în situații de urgență',
        'Utilizarea corectă a echipamentelor de protecție',
      ],

      topics: null, // Va folosi default din generator

      instructor_name: user.email || 'Instructor SSM',
      instructor_authorization: 'Conform Legii 319/2006',
      instructor_qualification: 'Evaluator de Risc SSM · Specialist Ergonomie',
      organization_representative: 'Reprezentant Legal Angajator',
    }

    // Generate PDF
    const pdfBuffer: Buffer = await generateTematicaPDF(pdfData)

    // Return PDF
    const filename = `Tematica_Instruire_${employee_name.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
