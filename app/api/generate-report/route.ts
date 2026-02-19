// app/api/generate-report/route.ts
// Generate monthly compliance report
// POST { organizationId, month: "2026-02", type: "monthly" }

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { generateMonthlyReport } from '@/lib/generate-monthly-report'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const body = await request.json()
    const { organizationId, month } = body

    if (!organizationId || !month) {
      return NextResponse.json(
        { error: 'organizationId and month are required' },
        { status: 400 }
      )
    }

    // Parse month (format: YYYY-MM)
    const [year, monthNum] = month.split('-')
    const monthStart = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
    const monthEnd = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59)

    const monthLabel = monthStart.toLocaleDateString('ro-RO', {
      month: 'long',
      year: 'numeric',
    })

    // Fetch organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('name, cui')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // === A. COMPLIANCE SUMMARY ===

    // Active employees
    const { count: activeEmployees } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_active', true)

    // Trainings this month
    const { count: trainingsThisMonth } = await supabase
      .from('safety_trainings')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('training_date', monthStart.toISOString())
      .lte('training_date', monthEnd.toISOString())

    // Overdue trainings (mock calculation)
    const trainingsOverdue = 0 // TODO: Implement overdue logic

    // === B. MEDICAL EXAMS ===

    const { data: medicalExams } = await supabase
      .from('medical_examinations')
      .select('*, employees(full_name, first_name, last_name)')
      .eq('organization_id', organizationId)

    const now = new Date()
    const nextMonthStart = new Date(monthEnd.getTime() + 1)
    const nextMonthEnd = new Date(parseInt(year), parseInt(monthNum) + 1, 0)

    const medicalValidList = (medicalExams || []).filter((m: any) => new Date(m.expiry_date) > now)
    const medicalExpiringNext = (medicalExams || []).filter((m: any) => {
      const expiry = new Date(m.expiry_date)
      return expiry > now && expiry >= nextMonthStart && expiry <= nextMonthEnd
    })

    // Calculate medical compliance percentage
    const totalMedical = (medicalExams || []).length
    const medicalValidPercent = totalMedical > 0 ? Math.round((medicalValidList.length / totalMedical) * 100) : 100

    // === C. EQUIPMENT ===

    const { count: totalEquipment } = await supabase
      .from('safety_equipment')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)

    const { count: checkedThisMonth } = await supabase
      .from('safety_equipment')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('last_check_date', monthStart.toISOString())
      .lte('last_check_date', monthEnd.toISOString())

    const { data: expiredEquipment } = await supabase
      .from('safety_equipment')
      .select('equipment_type, serial_number, location, last_check_date, expiry_date')
      .eq('organization_id', organizationId)
      .lt('expiry_date', now.toISOString())

    // Calculate equipment compliance percentage
    const equipmentValidPercent = totalEquipment && totalEquipment > 0
      ? Math.round(((totalEquipment - (expiredEquipment?.length || 0)) / totalEquipment) * 100)
      : 100

    // === D. TRAININGS ===

    const { data: trainings } = await supabase
      .from('safety_trainings')
      .select('*, employees(full_name, first_name, last_name)')
      .eq('organization_id', organizationId)
      .gte('training_date', monthStart.toISOString())
      .lte('training_date', monthEnd.toISOString())
      .order('training_date', { ascending: false })

    // Calculate training compliance score
    const trainingsScore = trainingsOverdue === 0 ? 100 : 70

    // Calculate overall compliance score
    const complianceScore = Math.round((medicalValidPercent + equipmentValidPercent + trainingsScore) / 3)

    // === E. RECOMMENDATIONS ===

    const recommendations: any[] = []

    if (medicalExpiringNext.length > 0) {
      recommendations.push({
        priority: 'high',
        action: `Programați ${medicalExpiringNext.length} examen(e) medical(e) care expiră luna viitoare`,
      })
    }

    if ((expiredEquipment || []).length > 0) {
      recommendations.push({
        priority: 'high',
        action: `Verificați și înlocuiți ${expiredEquipment.length} echipament(e) PSI expirat(e)`,
      })
    }

    if (trainingsOverdue > 0) {
      recommendations.push({
        priority: 'high',
        action: `Completați ${trainingsOverdue} instruiri restante`,
      })
    }

    if (complianceScore >= 90) {
      recommendations.push({
        priority: 'low',
        action: 'Conformitate excelentă! Continuați monitorizarea lunară.',
      })
    } else if (complianceScore < 70) {
      recommendations.push({
        priority: 'high',
        action: 'Atenție: Scor conformitate scăzut. Recomandăm audit complet SSM.',
      })
    }

    // Generate PDF
    const pdfBuffer = await generateMonthlyReport({
      organization_name: org.name,
      organization_cui: org.cui || '',
      month,
      month_label: monthLabel,
      summary: {
        score: complianceScore,
        active_employees: activeEmployees || 0,
        trainings_this_month: trainingsThisMonth || 0,
        trainings_overdue: trainingsOverdue,
      },
      medical_exams: {
        valid_count: medicalValidList.length,
        total_count: (medicalExams || []).length,
        expiring_next_month: medicalExpiringNext.map((m: any) => ({
          employee_name: m.employees?.full_name || `${m.employees?.first_name} ${m.employees?.last_name}` || 'Necunoscut',
          exam_date: new Date(m.examination_date).toLocaleDateString('ro-RO'),
          expiry_date: new Date(m.expiry_date).toLocaleDateString('ro-RO'),
          status: 'expiring' as const,
        })),
      },
      equipment: {
        total_count: totalEquipment || 0,
        checked_this_month: checkedThisMonth || 0,
        expired: (expiredEquipment || []).map((e: any) => ({
          type: e.equipment_type || 'Echipament',
          serial_number: e.serial_number || 'N/A',
          location: e.location || 'N/A',
          last_check: e.last_check_date ? new Date(e.last_check_date).toLocaleDateString('ro-RO') : 'N/A',
          expiry_date: new Date(e.expiry_date).toLocaleDateString('ro-RO'),
          status: 'expired' as const,
        })),
      },
      trainings: (trainings || []).map((t: any) => ({
        employee_name: t.employees?.full_name || `${t.employees?.first_name} ${t.employees?.last_name}` || 'Necunoscut',
        type: t.training_type || 'Periodic',
        date: new Date(t.training_date).toLocaleDateString('ro-RO'),
        status: 'completed' as const,
      })),
      recommendations,
      generated_date: new Date().toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })

    const filename = `Raport_${org.name.replace(/\s+/g, '_')}_${month}.pdf`

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
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report', details: String(error) },
      { status: 500 }
    )
  }
}
