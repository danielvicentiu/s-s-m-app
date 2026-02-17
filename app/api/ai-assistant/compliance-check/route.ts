// app/api/ai-assistant/compliance-check/route.ts
// VA-AI: Comprehensive compliance check for an organization

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export interface ComplianceReport {
  organizationId: string
  organizationName: string
  generatedAt: string
  summary: {
    totalIssues: number
    critical: number
    warning: number
  }
  expiredTrainings: Array<{
    id: string
    employee_name?: string
    training_type?: string
    expired_at?: string
    status?: string
  }>
  expiredMedical: Array<{
    id: string
    employee_name?: string
    examination_type?: string
    expiry_date?: string
    result?: string
  }>
  psiIssues: Array<{
    id: string
    identifier?: string
    equipment_type?: string
    next_inspection_date?: string
    status?: string
    location?: string
  }>
  iscirIssues: Array<{
    id: string
    identifier?: string
    equipment_type?: string
    next_verification_date?: string
    status?: string
  }>
  gdprIssues: {
    processingActivitiesCount: number
    dpoAssigned: boolean
    dpoName?: string
  }
  openNearMiss: Array<{
    id: string
    title?: string
    severity?: string
    reported_at?: string
    location?: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organizationId } = body as { organizationId: string }

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId este obligatoriu' }, { status: 400 })
    }

    // Verify user membership
    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Run all compliance queries in parallel
    const [
      { data: org },
      { data: expiredTrainings },
      { data: expiredMedical },
      { data: psiIssues },
      { data: iscirIssues },
      { count: gdprCount },
      { data: dpoData },
      { data: openNearMiss }
    ] = await Promise.all([
      supabase.from('organizations').select('name').eq('id', organizationId).single(),

      supabase
        .from('training_sessions')
        .select('id, status, scheduled_date, training_type, employee_name')
        .eq('organization_id', organizationId)
        .eq('status', 'expired')
        .order('scheduled_date', { ascending: true })
        .limit(20),

      supabase
        .from('medical_examinations')
        .select('id, employee_name, examination_type, expiry_date, result')
        .eq('organization_id', organizationId)
        .lt('expiry_date', today)
        .order('expiry_date', { ascending: true })
        .limit(20),

      supabase
        .from('psi_equipment')
        .select('id, identifier, equipment_type, next_inspection_date, status, location')
        .eq('organization_id', organizationId)
        .or(`status.eq.expired,next_inspection_date.lt.${today}`)
        .order('next_inspection_date', { ascending: true })
        .limit(20),

      supabase
        .from('iscir_equipment')
        .select('id, identifier, equipment_type, next_verification_date, status')
        .eq('organization_id', organizationId)
        .or(`status.eq.expired,next_verification_date.lt.${today}`)
        .order('next_verification_date', { ascending: true })
        .limit(20),

      supabase
        .from('gdpr_processing_activities')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId),

      supabase
        .from('gdpr_dpo')
        .select('name')
        .eq('organization_id', organizationId)
        .limit(1),

      supabase
        .from('near_miss_reports')
        .select('id, title, severity, reported_at, location')
        .eq('organization_id', organizationId)
        .eq('status', 'open')
        .order('reported_at', { ascending: false })
        .limit(20)
    ])

    const totalIssues =
      (expiredTrainings?.length ?? 0) +
      (expiredMedical?.length ?? 0) +
      (psiIssues?.length ?? 0) +
      (iscirIssues?.length ?? 0) +
      (openNearMiss?.length ?? 0)

    const report: ComplianceReport = {
      organizationId,
      organizationName: org?.name || 'Organizație',
      generatedAt: new Date().toISOString(),
      summary: {
        totalIssues,
        critical: (expiredMedical?.length ?? 0) + (iscirIssues?.length ?? 0),
        warning: (expiredTrainings?.length ?? 0) + (psiIssues?.length ?? 0) + (openNearMiss?.length ?? 0)
      },
      expiredTrainings: (expiredTrainings || []).map(t => ({
        id: t.id,
        employee_name: t.employee_name,
        training_type: t.training_type,
        expired_at: t.scheduled_date,
        status: t.status
      })),
      expiredMedical: (expiredMedical || []).map(m => ({
        id: m.id,
        employee_name: m.employee_name,
        examination_type: m.examination_type,
        expiry_date: m.expiry_date,
        result: m.result
      })),
      psiIssues: (psiIssues || []).map(p => ({
        id: p.id,
        identifier: p.identifier,
        equipment_type: p.equipment_type,
        next_inspection_date: p.next_inspection_date,
        status: p.status,
        location: p.location
      })),
      iscirIssues: (iscirIssues || []).map(i => ({
        id: i.id,
        identifier: i.identifier,
        equipment_type: i.equipment_type,
        next_verification_date: i.next_verification_date,
        status: i.status
      })),
      gdprIssues: {
        processingActivitiesCount: gdprCount ?? 0,
        dpoAssigned: !!(dpoData && dpoData.length > 0),
        dpoName: dpoData?.[0]?.name
      },
      openNearMiss: (openNearMiss || []).map(n => ({
        id: n.id,
        title: n.title,
        severity: n.severity,
        reported_at: n.reported_at,
        location: n.location
      }))
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('[Compliance Check] Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 })
  }
}
