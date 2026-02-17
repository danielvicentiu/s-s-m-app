// app/api/reports/generate/route.ts
// API pentru generare rapoarte PDF automate SSM/PSI
// Data: 17 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { generateSSMReport } from '@/lib/reports/generateSSMReport'
import { generatePSIReport } from '@/lib/reports/generatePSIReport'
import { ReportType } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.organization_id) {
      return NextResponse.json(
        { error: 'organization_id is required' },
        { status: 400 }
      )
    }

    if (!body.report_type) {
      return NextResponse.json(
        { error: 'report_type is required' },
        { status: 400 }
      )
    }

    const validReportTypes: ReportType[] = [
      'situatie_ssm',
      'situatie_psi',
      'instruiri_luna',
      'documente_expirate',
    ]

    if (!validReportTypes.includes(body.report_type)) {
      return NextResponse.json(
        { error: 'Invalid report_type' },
        { status: 400 }
      )
    }

    const organizationId = body.organization_id
    const reportType = body.report_type as ReportType

    // Verify user has access to this organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      )
    }

    // Fetch organization details
    const { data: organization } = await supabase
      .from('organizations')
      .select('id, name, cui, address')
      .eq('id', organizationId)
      .single()

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    let htmlContent = ''
    let title = ''
    const metadata: Record<string, any> = {
      generated_at: new Date().toISOString(),
      organization_id: organizationId,
    }

    // Generate report based on type
    if (reportType === 'situatie_ssm') {
      // Fetch all data needed for SSM report
      const [employeesRes, medicalRes, trainingsRes, equipmentRes] = await Promise.all([
        supabase
          .from('employees')
          .select('id, full_name, job_title, hired_at, is_active')
          .eq('organization_id', organizationId)
          .order('full_name'),
        supabase
          .from('medical_examinations')
          .select('*')
          .eq('organization_id', organizationId)
          .order('examination_date', { ascending: false }),
        supabase
          .from('trainings')
          .select('id, employee_id, employee_name, training_type, training_date, expiry_date, status')
          .eq('organization_id', organizationId)
          .order('training_date', { ascending: false }),
        supabase
          .from('safety_equipment')
          .select('*')
          .eq('organization_id', organizationId)
          .order('expiry_date'),
      ])

      htmlContent = generateSSMReport({
        organization: {
          name: organization.name,
          cui: organization.cui,
          address: organization.address,
        },
        employees: employeesRes.data || [],
        medicalRecords: medicalRes.data || [],
        trainings: trainingsRes.data || [],
        equipment: equipmentRes.data || [],
      })

      title = `Raport SSM Complet - ${organization.name} - ${new Date().toLocaleDateString('ro-RO')}`
      metadata.stats = {
        employees: employeesRes.data?.length || 0,
        medicalRecords: medicalRes.data?.length || 0,
        trainings: trainingsRes.data?.length || 0,
        equipment: equipmentRes.data?.length || 0,
      }
    } else if (reportType === 'situatie_psi') {
      // Fetch all data needed for PSI report
      const [equipmentRes, inspectionsRes] = await Promise.all([
        supabase
          .from('psi_equipment')
          .select('*')
          .eq('organization_id', organizationId)
          .order('identifier'),
        supabase
          .from('psi_inspections')
          .select('*, psi_equipment(identifier, equipment_type)')
          .eq('organization_id', organizationId)
          .order('inspection_date', { ascending: false }),
      ])

      // Fetch alerts (calculate days until due)
      const alerts = (equipmentRes.data || []).map((eq) => {
        const nextInspectionDate = eq.next_inspection_date
        const today = new Date()
        let daysUntilDue = 999
        let alertLevel = 'ok'

        if (nextInspectionDate) {
          const nextDate = new Date(nextInspectionDate)
          daysUntilDue = Math.ceil(
            (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          )

          if (daysUntilDue < 0) alertLevel = 'expired'
          else if (daysUntilDue <= 30) alertLevel = 'critical'
          else if (daysUntilDue <= 60) alertLevel = 'warning'
          else alertLevel = 'ok'
        }

        return {
          id: eq.id,
          equipment_type: eq.equipment_type,
          identifier: eq.identifier,
          location: eq.location,
          next_inspection_date: nextInspectionDate || '',
          days_until_due: daysUntilDue,
          alert_level: alertLevel,
        }
      }).filter(a => a.days_until_due <= 90 || a.alert_level === 'expired')

      htmlContent = generatePSIReport({
        organization: {
          name: organization.name,
          cui: organization.cui,
          address: organization.address,
        },
        equipment: equipmentRes.data || [],
        inspections: inspectionsRes.data || [],
        alerts,
      })

      title = `Raport PSI Complet - ${organization.name} - ${new Date().toLocaleDateString('ro-RO')}`
      metadata.stats = {
        equipment: equipmentRes.data?.length || 0,
        inspections: inspectionsRes.data?.length || 0,
        alerts: alerts.length,
      }
    } else if (reportType === 'instruiri_luna') {
      // Instruiri luna curentă
      const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM

      const { data: trainings } = await supabase
        .from('trainings')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('training_date', `${currentMonth}-01`)
        .lt('training_date', `${currentMonth}-32`)
        .order('training_date', { ascending: false })

      htmlContent = generateSimpleReport({
        title: `Instruiri Luna Curentă - ${organization.name}`,
        organization,
        data: trainings || [],
        columns: ['employee_name', 'training_type', 'training_date', 'status'],
        columnLabels: {
          employee_name: 'Angajat',
          training_type: 'Tip Instruire',
          training_date: 'Data',
          status: 'Status',
        },
      })

      title = `Instruiri Luna Curentă - ${organization.name} - ${currentMonth}`
      metadata.period = currentMonth
      metadata.stats = { trainings: trainings?.length || 0 }
    } else if (reportType === 'documente_expirate') {
      // Documente expirate
      const today = new Date().toISOString().split('T')[0]

      const [medicalExpired, equipmentExpired] = await Promise.all([
        supabase
          .from('medical_examinations')
          .select('employee_name, examination_type, expiry_date')
          .eq('organization_id', organizationId)
          .lt('expiry_date', today),
        supabase
          .from('safety_equipment')
          .select('equipment_type, description, location, expiry_date')
          .eq('organization_id', organizationId)
          .lt('expiry_date', today),
      ])

      const allExpired = [
        ...(medicalExpired.data || []).map((m) => ({
          type: 'Fișă Medicală',
          details: `${m.employee_name} - ${m.examination_type}`,
          expiry_date: m.expiry_date,
        })),
        ...(equipmentExpired.data || []).map((e) => ({
          type: 'Echipament',
          details: `${e.equipment_type} - ${e.description || e.location || 'N/A'}`,
          expiry_date: e.expiry_date,
        })),
      ].sort((a, b) => a.expiry_date.localeCompare(b.expiry_date))

      htmlContent = generateSimpleReport({
        title: `Documente Expirate - ${organization.name}`,
        organization,
        data: allExpired,
        columns: ['type', 'details', 'expiry_date'],
        columnLabels: {
          type: 'Tip Document',
          details: 'Detalii',
          expiry_date: 'Data Expirare',
        },
      })

      title = `Documente Expirate - ${organization.name} - ${today}`
      metadata.stats = {
        medicalExpired: medicalExpired.data?.length || 0,
        equipmentExpired: equipmentExpired.data?.length || 0,
        total: allExpired.length,
      }
    }

    // Save report to database
    const { data: report, error: insertError } = await supabase
      .from('reports')
      .insert([
        {
          organization_id: organizationId,
          report_type: reportType,
          title,
          html_content: htmlContent,
          metadata,
          generated_by: user.id,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error('[API] Reports generate error:', insertError)
      return NextResponse.json(
        { error: 'Failed to save report', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        report,
        message: 'Report generated successfully',
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[API] Reports generate exception:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}

// Helper: Generate simple HTML report (for trainings and expired docs)
function generateSimpleReport(params: {
  title: string
  organization: { name: string; cui: string | null; address: string | null }
  data: any[]
  columns: string[]
  columnLabels: Record<string, string>
}): string {
  const { title, organization, data, columns, columnLabels } = params

  const today = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const formatValue = (value: any, key: string) => {
    if (!value) return '-'
    if (key.includes('date') && typeof value === 'string') {
      return new Date(value).toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }
    return value
  }

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #ffffff; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header .org-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.3); }
    .header .org-info div { margin: 5px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    thead { background: #f9fafb; border-bottom: 2px solid #e5e7eb; }
    thead th { padding: 12px 16px; text-align: left; font-weight: 600; font-size: 13px; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #f3f4f6; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    tbody tr:hover { background: #f3f4f6; }
    tbody td { padding: 12px 16px; font-size: 14px; color: #4b5563; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    .empty-state { text-align: center; padding: 40px; color: #9ca3af; font-style: italic; }
    @media print {
      body { padding: 0; }
      .header { background: #2563eb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tbody tr:nth-child(even) { background: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <div class="org-info">
        <div><strong>Organizație:</strong> ${organization.name}</div>
        ${organization.cui ? `<div><strong>CUI:</strong> ${organization.cui}</div>` : ''}
        <div><strong>Data raport:</strong> ${today}</div>
      </div>
    </div>
    ${
      data.length > 0
        ? `
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${columnLabels[col]}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${columns.map((col) => `<td>${formatValue(row[col], col)}</td>`).join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div style="text-align: right; color: #6b7280; font-size: 14px; margin-top: 10px;">
        Total înregistrări: <strong>${data.length}</strong>
      </div>
    `
        : '<div class="empty-state">Nu există date pentru această perioadă</div>'
    }
    <div class="footer">
      <div>Raport generat automat de platforma <strong>s-s-m.ro</strong></div>
      <div style="margin-top: 10px;">Data generare: ${today}</div>
      <div style="margin-top: 10px; font-size: 11px;">Pentru salvare ca PDF, folosiți funcția Print din browser și selectați "Save as PDF"</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}
