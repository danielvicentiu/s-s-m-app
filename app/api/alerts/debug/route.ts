// app/api/alerts/debug/route.ts
// TEMPORAR — diagnostic M4 engine. DE ȘTERS după debugging.
// GET ?organizationId=xxx

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase/server'

const SPRINT1_SLUGS = [
  'medical_expiry', 'medical_missing',
  'osh_training_expiry', 'osh_training_missing',
  'fire_training_expiry', 'fire_training_missing',
  'iscir_verification_expiry', 'iscir_authorization_expiry',
]

export async function GET(request: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get('organizationId')
  if (!organizationId) return NextResponse.json({ error: 'organizationId required' }, { status: 400 })

  const svc = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cutoff = new Date(today)
  cutoff.setDate(today.getDate() + 30)
  const todayStr = today.toISOString().split('T')[0]
  const cutoffStr = cutoff.toISOString().split('T')[0]

  // 1. organization_modules
  const { data: moduleCheck, error: moduleErr } = await svc
    .from('organization_modules')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('module_key', 'alerte')
    .single()

  // 2. org
  const { data: org, error: orgErr } = await svc
    .from('organizations')
    .select('id, name, country_code, contact_email')
    .eq('id', organizationId)
    .single()

  // 3. alert_categories
  const countryCode = org?.country_code ?? 'RO'
  const { data: categories, error: catErr } = await svc
    .from('alert_categories')
    .select('id, slug, name, country_code, is_active')
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .in('slug', SPRINT1_SLUGS)

  // 4. medical_examinations raw
  const { data: medExams, error: medErr } = await svc
    .from('medical_examinations')
    .select('id, employee_name, expiry_date, examination_type, organization_id')
    .eq('organization_id', organizationId)
    .lte('expiry_date', cutoffStr)

  // 5. employees raw
  const { data: employees, error: empErr } = await svc
    .from('employees')
    .select('id, full_name, is_active, termination_date')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .is('termination_date', null)

  // 6. medical_examinations valid (pentru missing check)
  const { data: validExams, error: validExamsErr } = await svc
    .from('medical_examinations')
    .select('employee_id')
    .eq('organization_id', organizationId)
    .gte('expiry_date', todayStr)
    .not('employee_id', 'is', null)

  // 7. iscir_equipment raw
  const { data: iscirEquip, error: iscirErr } = await svc
    .from('iscir_equipment')
    .select('id, equipment_type, identifier, next_verification_date, authorization_expiry, organization_id')
    .eq('organization_id', organizationId)

  // 8. alert_configurations
  const { data: config, error: configErr } = await svc
    .from('alert_configurations')
    .select('*')
    .eq('organization_id', organizationId)
    .single()

  return NextResponse.json({
    today: todayStr,
    cutoff: cutoffStr,
    org: org ?? { error: orgErr?.message },
    module: moduleCheck ?? { error: moduleErr?.message },
    config: config ?? { missing: true, fallback_alert_days: [30, 14, 7, 3, 1, 0] },
    categories: {
      count: categories?.length ?? 0,
      error: catErr?.message ?? null,
      countryCodeUsed: countryCode,
      rows: categories ?? [],
    },
    medical_examinations: {
      count: medExams?.length ?? 0,
      error: medErr?.message ?? null,
      rows: medExams ?? [],
    },
    employees: {
      count: employees?.length ?? 0,
      error: empErr?.message ?? null,
      rows: employees ?? [],
    },
    valid_exams_for_missing_check: {
      count: validExams?.length ?? 0,
      error: validExamsErr?.message ?? null,
      employee_ids: validExams?.map(e => e.employee_id) ?? [],
    },
    iscir_equipment: {
      count: iscirEquip?.length ?? 0,
      error: iscirErr?.message ?? null,
      rows: iscirEquip ?? [],
    },
  })
}
