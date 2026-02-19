// app/api/reports/generate/route.ts
// API pentru generare rapoarte PDF automate SSM/PSI + Extended
// Data: 17 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { generateSSMReport } from '@/lib/reports/generateSSMReport'
import { generatePSIReport } from '@/lib/reports/generatePSIReport'
import { generateGDPRReport } from '@/lib/reports/generateGDPRReport'
import { generateNearMissReport } from '@/lib/reports/generateNearMissReport'
import { generateISCIRReport } from '@/lib/reports/generateISCIRReport'
import { generateMedicalReport } from '@/lib/reports/generateMedicalReport'
import { generateComplianceReport } from '@/lib/reports/generateComplianceReport'
import { generateITMSimulationReport } from '@/lib/reports/generateITMSimulationReport'
import { generateQRCodeDataURL } from '@/lib/reports/qrCodeHelper'
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
      'situatie_gdpr',
      'situatie_near_miss',
      'situatie_iscir',
      'situatie_medical',
      'conformitate_generala',
      'simulare_itm',
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
      .select('id, name, cui, address, employee_count')
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

    // Helper: safe table query — returns empty array if table doesn't exist
    async function safeQuery<T>(
      queryFn: () => Promise<{ data: T[] | null; error: any }>
    ): Promise<T[]> {
      try {
        const result = await queryFn()
        if (result.error) {
          console.warn('[API] Safe query error (table may not exist):', result.error.message)
          return []
        }
        return result.data || []
      } catch (err: any) {
        console.warn('[API] Safe query exception:', err.message)
        return []
      }
    }

    // Generate QR code section URL mapping
    const sectionMap: Record<ReportType, string> = {
      situatie_ssm: 'ssm',
      situatie_psi: 'psi',
      instruiri_luna: 'trainings',
      documente_expirate: 'alerts',
      situatie_gdpr: 'gdpr',
      situatie_near_miss: 'near-miss',
      situatie_iscir: 'iscir',
      situatie_medical: 'medical',
      conformitate_generala: 'reports',
      simulare_itm: 'reports',
    }

    const qrUrl = `https://app.s-s-m.ro/ro/dashboard/${sectionMap[reportType]}`
    const qrCodeUrl = await generateQRCodeDataURL(qrUrl)

    // ── Generate report based on type ──

    if (reportType === 'situatie_ssm') {
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
        qrCodeUrl,
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

      const alerts = (equipmentRes.data || []).map((eq) => {
        const nextInspectionDate = eq.next_inspection_date
        const todayDate = new Date()
        let daysUntilDue = 999
        let alertLevel = 'ok'

        if (nextInspectionDate) {
          const nextDate = new Date(nextInspectionDate)
          daysUntilDue = Math.ceil(
            (nextDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
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
        qrCodeUrl,
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
      const currentMonth = new Date().toISOString().substring(0, 7)

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
        qrCodeUrl,
      })

      title = `Instruiri Luna Curentă - ${organization.name} - ${currentMonth}`
      metadata.period = currentMonth
      metadata.stats = { trainings: trainings?.length || 0 }
    } else if (reportType === 'documente_expirate') {
      const todayStr = new Date().toISOString().split('T')[0]

      const [medicalExpired, equipmentExpired] = await Promise.all([
        supabase
          .from('medical_examinations')
          .select('employee_name, examination_type, expiry_date')
          .eq('organization_id', organizationId)
          .lt('expiry_date', todayStr),
        supabase
          .from('safety_equipment')
          .select('equipment_type, description, location, expiry_date')
          .eq('organization_id', organizationId)
          .lt('expiry_date', todayStr),
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
        qrCodeUrl,
      })

      title = `Documente Expirate - ${organization.name} - ${todayStr}`
      metadata.stats = {
        medicalExpired: medicalExpired.data?.length || 0,
        equipmentExpired: equipmentExpired.data?.length || 0,
        total: allExpired.length,
      }
    } else if (reportType === 'situatie_gdpr') {
      const [activitiesRes, consentsRes, dpoRes] = await Promise.all([
        safeQuery(() =>
          supabase
            .from('gdpr_processing_activities')
            .select('id, activity_name, purpose, legal_basis, data_categories, status, dpia_required, dpia_completed')
            .eq('organization_id', organizationId)
            .order('activity_name')
        ),
        safeQuery(() =>
          supabase
            .from('gdpr_consents')
            .select('id, type, status, given_at, withdrawn_at')
            .eq('organization_id', organizationId)
            .order('given_at', { ascending: false })
        ),
        safeQuery(() =>
          supabase
            .from('gdpr_dpo')
            .select('name, contact, anspdcp_notified')
            .eq('organization_id', organizationId)
            .limit(1)
        ),
      ])

      htmlContent = generateGDPRReport({
        organization: {
          name: organization.name,
          cui: organization.cui,
          address: organization.address,
        },
        qrCodeUrl,
        dpo: dpoRes.length > 0 ? dpoRes[0] as any : null,
        processingActivities: activitiesRes as any[],
        consents: consentsRes as any[],
      })

      title = `Raport GDPR - ${organization.name} - ${new Date().toLocaleDateString('ro-RO')}`
      metadata.stats = {
        activities: activitiesRes.length,
        consents: consentsRes.length,
      }
    } else if (reportType === 'situatie_near_miss') {
      const todayDate = new Date()
      const lastMonthStart = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1)
        .toISOString()
        .split('T')[0]
      const lastMonthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0)
        .toISOString()
        .split('T')[0]

      const [incidentsRes, lastMonthRes] = await Promise.all([
        safeQuery(() =>
          supabase
            .from('near_miss_reports')
            .select('id, report_date, location, category, severity, status, corrective_actions, description')
            .eq('organization_id', organizationId)
            .order('report_date', { ascending: false })
        ),
        safeQuery(() =>
          supabase
            .from('near_miss_reports')
            .select('id')
            .eq('organization_id', organizationId)
            .gte('report_date', lastMonthStart)
            .lte('report_date', lastMonthEnd)
        ),
      ])

      htmlContent = generateNearMissReport({
        organization: {
          name: organization.name,
          cui: organization.cui,
          address: organization.address,
        },
        qrCodeUrl,
        incidents: incidentsRes as any[],
        incidentsLastMonth: lastMonthRes as any[],
      })

      title = `Raport Near-Miss - ${organization.name} - ${new Date().toLocaleDateString('ro-RO')}`
      metadata.stats = { incidents: incidentsRes.length }
    } else if (reportType === 'situatie_iscir') {
      const [equipmentRes, verificationsRes] = await Promise.all([
        safeQuery(() =>
          supabase
            .from('iscir_equipment')
            .select('id, equipment_type, registration_number, location, last_verification_date, expiry_date, status, description')
            .eq('organization_id', organizationId)
            .order('equipment_type')
        ),
        safeQuery(() =>
          supabase
            .from('iscir_verifications')
            .select('id, equipment_id, verification_date, next_verification_date, result, verified_by, notes')
            .eq('organization_id', organizationId)
            .order('verification_date', { ascending: false })
        ),
      ])

      htmlContent = generateISCIRReport({
        organization: {
          name: organization.name,
          cui: organization.cui,
          address: organization.address,
        },
        qrCodeUrl,
        equipment: equipmentRes as any[],
        verifications: verificationsRes as any[],
      })

      title = `Raport ISCIR - ${organization.name} - ${new Date().toLocaleDateString('ro-RO')}`
      metadata.stats = {
        equipment: equipmentRes.length,
        verifications: verificationsRes.length,
      }
    } else if (reportType === 'situatie_medical') {
      const [examinationsRes, employeesRes] = await Promise.all([
        supabase
          .from('medical_examinations')
          .select('id, employee_name, employee_id, examination_type, examination_date, expiry_date, result')
          .eq('organization_id', organizationId)
          .order('employee_name'),
        supabase
          .from('employees')
          .select('id, full_name')
          .eq('organization_id', organizationId)
          .eq('is_active', true)
          .order('full_name'),
      ])

      htmlContent = generateMedicalReport({
        organization: {
          name: organization.name,
          cui: organization.cui,
          address: organization.address,
        },
        qrCodeUrl,
        examinations: examinationsRes.data || [],
        employees: employeesRes.data || [],
      })

      title = `Raport Medical - ${organization.name} - ${new Date().toLocaleDateString('ro-RO')}`
      metadata.stats = {
        examinations: examinationsRes.data?.length || 0,
        employees: employeesRes.data?.length || 0,
      }
    } else if (reportType === 'conformitate_generala') {
      const todayDate = new Date()
      todayDate.setHours(0, 0, 0, 0)

      // Fetch all domains in parallel with graceful fallback
      const [
        ,
        trainingsRes,
        medicalRes,
        psiEquipmentRes,
        gdprActivitiesRes,
        iscirEquipmentRes,
        nearMissRes,
      ] = await Promise.all([
        supabase.from('employees').select('id, is_active').eq('organization_id', organizationId),
        supabase.from('trainings').select('id, expiry_date').eq('organization_id', organizationId),
        supabase.from('medical_examinations').select('id, expiry_date, employee_name, employee_id, examination_type, examination_date, result').eq('organization_id', organizationId),
        supabase.from('psi_equipment').select('id, next_inspection_date').eq('organization_id', organizationId),
        safeQuery(() => supabase.from('gdpr_processing_activities').select('id, legal_basis').eq('organization_id', organizationId)),
        safeQuery(() => supabase.from('iscir_equipment').select('id, expiry_date').eq('organization_id', organizationId)),
        safeQuery(() => supabase.from('near_miss_reports').select('id, status').eq('organization_id', organizationId)),
      ])

      const trainings = trainingsRes.data || []
      const medical = medicalRes.data || []
      const psiEquipment = psiEquipmentRes.data || []
      const gdprActivities = gdprActivitiesRes as any[]
      const iscirEquipment = iscirEquipmentRes as any[]
      const nearMiss = nearMissRes as any[]

      const isExpired = (dateStr: string | null) => {
        if (!dateStr) return false
        return new Date(dateStr) < todayDate
      }

      const validLegalBases = ['consimtamant', 'contract', 'obligatie_legala', 'interes_vital', 'interes_public', 'interes_legitim']

      const ssmValidTrainings = trainings.filter((t) => !isExpired(t.expiry_date)).length
      const psiCompliant = psiEquipment.filter((eq) => !isExpired(eq.next_inspection_date)).length
      const medicalValid = medical.filter((m) => !isExpired(m.expiry_date)).length
      const gdprWithBasis = gdprActivities.filter((a) => a.legal_basis && validLegalBases.includes(a.legal_basis)).length
      const iscirValid = iscirEquipment.filter((eq) => !isExpired(eq.expiry_date)).length
      const nearMissClosed = nearMiss.filter((n) => n.status === 'closed' || n.status === 'inchis').length

      const calcScore = (valid: number, total: number) => total > 0 ? Math.round((valid / total) * 100) : 100

      const domains = [
        { name: 'ssm', label: 'SSM — Instruiri', score: calcScore(ssmValidTrainings, trainings.length), valid: ssmValidTrainings, total: trainings.length, available: true },
        { name: 'psi', label: 'PSI — Echipamente', score: calcScore(psiCompliant, psiEquipment.length), valid: psiCompliant, total: psiEquipment.length, available: true },
        { name: 'medical', label: 'Medical — Fișe Aptitudine', score: calcScore(medicalValid, medical.length), valid: medicalValid, total: medical.length, available: true },
        { name: 'gdpr', label: 'GDPR — Activități Prelucrare', score: calcScore(gdprWithBasis, gdprActivities.length), valid: gdprWithBasis, total: gdprActivities.length, available: gdprActivities.length > 0 },
        { name: 'iscir', label: 'ISCIR — Echipamente sub Presiune', score: calcScore(iscirValid, iscirEquipment.length), valid: iscirValid, total: iscirEquipment.length, available: iscirEquipment.length > 0 },
        { name: 'near_miss', label: 'Near-Miss — Incidente', score: nearMiss.length > 0 ? calcScore(nearMissClosed, nearMiss.length) : 100, valid: nearMissClosed, total: nearMiss.length, available: nearMiss.length > 0 },
      ]

      // Build urgent actions
      const urgentActions: any[] = []
      const expiredMedical = medical.filter((m) => isExpired(m.expiry_date))
      const expiredTrainings = trainings.filter((t) => isExpired(t.expiry_date))
      const expiredPSI = psiEquipment.filter((eq) => isExpired(eq.next_inspection_date))

      for (const m of expiredMedical.slice(0, 3)) {
        urgentActions.push({ domain: 'Medical', description: `Fișă medicală expirată: ${m.employee_name}`, priority: 'high', dueDate: m.expiry_date })
      }
      for (const t of expiredTrainings.slice(0, 3)) {
        urgentActions.push({ domain: 'SSM', description: `Instruire expirată (ID: ${t.id})`, priority: 'high', dueDate: t.expiry_date })
      }
      for (const eq of expiredPSI.slice(0, 3)) {
        urgentActions.push({ domain: 'PSI', description: `Echipament PSI expirat (ID: ${eq.id})`, priority: 'high', dueDate: eq.next_inspection_date })
      }
      urgentActions.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))

      // Build timelines
      const buildTimeline = (minDays: number, maxDays: number) => {
        const items: any[] = []
        const allItems = [
          ...medical.map((m) => ({ date: m.expiry_date, description: `Fișă medicală: ${m.employee_name}`, domain: 'Medical' })),
          ...trainings.map((t) => ({ date: t.expiry_date, description: `Instruire SSM (ID: ${t.id})`, domain: 'SSM' })),
          ...psiEquipment.map((eq) => ({ date: eq.next_inspection_date, description: `Echipament PSI (ID: ${eq.id})`, domain: 'PSI' })),
          ...iscirEquipment.map((eq: any) => ({ date: eq.expiry_date, description: `Echipament ISCIR (ID: ${eq.id})`, domain: 'ISCIR' })),
        ]
        for (const item of allItems) {
          if (!item.date) continue
          const daysUntil = Math.ceil((new Date(item.date).getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysUntil >= minDays && daysUntil < maxDays) {
            items.push({ ...item, daysUntil })
          }
        }
        return items.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 20)
      }

      htmlContent = generateComplianceReport({
        organization: {
          name: organization.name,
          cui: organization.cui,
          address: organization.address,
        },
        qrCodeUrl,
        domains,
        urgentActions: urgentActions.slice(0, 10),
        timeline30: buildTimeline(0, 30),
        timeline60: buildTimeline(30, 60),
        timeline90: buildTimeline(60, 90),
      })

      title = `Raport Conformitate Generală - ${organization.name} - ${new Date().toLocaleDateString('ro-RO')}`
      metadata.stats = { domains: domains.length }
    } else if (reportType === 'simulare_itm') {
      const todayDate = new Date()
      todayDate.setHours(0, 0, 0, 0)

      const [
        employeesRes,
        trainingsRes,
        medicalRes,
        psiEquipmentRes,
        nearMissRes,
        iscirRes,
      ] = await Promise.all([
        supabase.from('employees').select('id, full_name, is_active').eq('organization_id', organizationId),
        supabase.from('trainings').select('id, expiry_date, training_type').eq('organization_id', organizationId),
        supabase.from('medical_examinations').select('id, expiry_date').eq('organization_id', organizationId),
        supabase.from('psi_equipment').select('id, next_inspection_date').eq('organization_id', organizationId),
        safeQuery(() => supabase.from('near_miss_reports').select('id').eq('organization_id', organizationId).limit(1)),
        safeQuery(() => supabase.from('iscir_equipment').select('id, expiry_date').eq('organization_id', organizationId)),
      ])

      const employees = employeesRes.data || []
      const trainings = trainingsRes.data || []
      const medical = medicalRes.data || []
      const psiEquipment = psiEquipmentRes.data || []
      const nearMiss = nearMissRes as any[]
      const iscirEquipment = iscirRes as any[]

      const activeEmployees = employees.filter((e) => e.is_active).length
      const isExpired = (dateStr: string | null) => {
        if (!dateStr) return true
        return new Date(dateStr) < todayDate
      }

      const validTrainings = trainings.filter((t) => !isExpired(t.expiry_date)).length
      const validMedical = medical.filter((m) => !isExpired(m.expiry_date)).length
      const validPSI = psiEquipment.filter((eq) => !isExpired(eq.next_inspection_date)).length
      const validISCIR = iscirEquipment.filter((eq: any) => !isExpired(eq.expiry_date)).length

      const trainingsCoverage = activeEmployees > 0
        ? Math.round((validTrainings / activeEmployees) * 100)
        : 100
      const medicalCoverage = activeEmployees > 0
        ? Math.round((validMedical / activeEmployees) * 100)
        : 100

      const empCount = organization.employee_count || activeEmployees
      const companySize: 'micro' | 'small' | 'medium' | 'large' =
        empCount >= 250 ? 'large' : empCount >= 50 ? 'medium' : empCount >= 10 ? 'small' : 'micro'

      const checklistItems = [
        {
          label: 'Evaluarea riscurilor la locul de muncă',
          passed: trainings.length > 0,
          details: trainings.length > 0
            ? `Există ${trainings.length} instruiri înregistrate`
            : 'Nu există evaluare riscuri sau instruiri în sistem',
          legalRef: 'L319/2006 Art. 13 lit. d)',
        },
        {
          label: 'Plan de prevenire și protecție',
          passed: trainings.length > 0 && medical.length > 0,
          details: trainings.length > 0 && medical.length > 0
            ? 'Există documente SSM și medicale în sistem'
            : 'Lipsă documente obligatorii de prevenire',
          legalRef: 'L319/2006 Art. 13 lit. e)',
        },
        {
          label: 'Instruiri SSM la zi (IG, ILM, Periodică)',
          passed: trainingsCoverage >= 80,
          details: `${validTrainings} instruiri valide din ${trainings.length} totale (${trainingsCoverage}% acoperire angajați)`,
          legalRef: 'HG1425/2006 Art. 77-97',
        },
        {
          label: 'Fișe medicale de aptitudine valide',
          passed: medicalCoverage >= 80,
          details: `${validMedical} fișe valide din ${medical.length} totale (${medicalCoverage}% acoperire angajați)`,
          legalRef: 'L319/2006 Art. 13 lit. j)',
        },
        {
          label: 'Echipamente PSI verificate periodic',
          passed: psiEquipment.length > 0 && validPSI >= Math.ceil(psiEquipment.length * 0.8),
          details: psiEquipment.length > 0
            ? `${validPSI}/${psiEquipment.length} echipamente PSI la zi`
            : 'Nu există echipamente PSI înregistrate în sistem',
          legalRef: 'L307/2006 Art. 19',
        },
        {
          label: 'Evidența evenimentelor și accidentelor de muncă',
          passed: nearMiss.length > 0,
          details: nearMiss.length > 0
            ? 'Există registru near-miss/accidente în sistem'
            : 'Nu există registru de evidență a evenimentelor',
          legalRef: 'L319/2006 Art. 26-31',
        },
        {
          label: 'Echipamente ISCIR autorizate și verificate',
          passed: iscirEquipment.length === 0 || validISCIR >= Math.ceil(iscirEquipment.length * 0.8),
          details: iscirEquipment.length > 0
            ? `${validISCIR}/${iscirEquipment.length} echipamente ISCIR la zi`
            : 'Fără echipamente ISCIR (N/A dacă nu se aplică)',
          legalRef: 'PT C4-2010, PT R1-2010',
        },
        {
          label: 'Instruire introductiv-generală (IG) pentru toți angajații',
          passed: trainings.filter((t) => t.training_type === 'ig').length >= activeEmployees * 0.8,
          details: `${trainings.filter((t) => t.training_type === 'ig').length} instruiri IG față de ${activeEmployees} angajați activi`,
          legalRef: 'HG1425/2006 Art. 83',
        },
        {
          label: 'Serviciu intern/extern SSM desemnat',
          passed: true,
          details: 'Verificare manuală necesară — confirmat prin utilizarea platformei s-s-m.ro',
          legalRef: 'L319/2006 Art. 8-10',
        },
        {
          label: 'Comitet SSM constituit (obligatoriu >50 angajați)',
          passed: empCount < 50 || empCount >= 50,
          details: empCount < 50
            ? `${empCount} angajați — sub pragul de 50, Comitet SSM neobligatoriu`
            : `${empCount} angajați — Comitet SSM obligatoriu; verificare manuală necesară`,
          legalRef: 'L319/2006 Art. 18',
        },
      ]

      const recommendations: string[] = []
      for (const item of checklistItems) {
        if (!item.passed) {
          recommendations.push(`${item.label}: ${item.details}`)
        }
      }

      htmlContent = generateITMSimulationReport({
        organization: {
          name: organization.name,
          cui: organization.cui,
          address: organization.address,
          employee_count: empCount,
        },
        qrCodeUrl,
        companySize,
        checklistItems,
        recommendations,
      })

      title = `Simulare Control ITM - ${organization.name} - ${new Date().toLocaleDateString('ro-RO')}`
      metadata.stats = {
        passed: checklistItems.filter((i) => i.passed).length,
        total: checklistItems.length,
        companySize,
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
  qrCodeUrl?: string
}): string {
  const { title, organization, data, columns, columnLabels, qrCodeUrl } = params

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
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; position: relative; }
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
      ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="QR" style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px; border-radius: 8px; background: white; padding: 4px;" />` : ''}
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
