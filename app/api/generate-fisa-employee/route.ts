// app/api/generate-fisa-employee/route.ts
// Generate ITM-compliant training record for employee
// POST { employeeId, organizationId }

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { generateEmployeeTrainingRecord } from '@/lib/generate-employee-training-record'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const body = await request.json()
    const { employeeId, organizationId } = body

    if (!employeeId || !organizationId) {
      return NextResponse.json(
        { error: 'employeeId and organizationId are required' },
        { status: 400 }
      )
    }

    // Fetch organization data
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('name, cui, address')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Fetch employee data
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('first_name, last_name, full_name, cnp, job_title, department')
      .eq('id', employeeId)
      .eq('organization_id', organizationId)
      .single()

    if (empError || !employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Fetch training records for this employee
    const { data: trainings, error: trainingsError } = await supabase
      .from('safety_trainings')
      .select('training_date, training_type, duration_hours, materials_provided, instructor_name')
      .eq('employee_id', employeeId)
      .eq('organization_id', organizationId)
      .order('training_date', { ascending: false })

    if (trainingsError) {
      console.error('Error fetching trainings:', trainingsError)
    }

    // Build training records
    const trainingRecords = (trainings || []).map((t: any) => ({
      date: t.training_date ? new Date(t.training_date).toLocaleDateString('ro-RO') : '—',
      type: t.training_type || 'periodic',
      duration_hours: t.duration_hours || 0,
      materials: t.materials_provided || 'Material instruire SSM',
      instructor: t.instructor_name || 'Consultant SSM',
    }))

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'N/A'

    // Generate PDF
    const pdfBuffer = await generateEmployeeTrainingRecord({
      organization_name: org.name,
      organization_cui: org.cui || '',
      organization_address: org.address || '',
      employee_name: employee.full_name || `${employee.first_name} ${employee.last_name}`,
      employee_cnp: employee.cnp || '',
      employee_job_title: employee.job_title || '',
      employee_department: employee.department || '',
      trainings: trainingRecords,
      generated_date: new Date().toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      generated_ip: ip,
    })

    // Generate filename
    const employeeSlug = (employee.full_name || 'angajat')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
    const filename = `Fisa_Instruire_${employeeSlug}_${new Date().toISOString().split('T')[0]}.pdf`

    // Convert Buffer to Uint8Array for Response
    const uint8Array = new Uint8Array(pdfBuffer)

    return new Response(uint8Array, {
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
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    )
  }
}
