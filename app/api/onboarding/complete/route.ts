// app/api/onboarding/complete/route.ts
// Finalizare onboarding: creează organizație + membership + subscription trial

import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

interface OnboardingPayload {
  activities: { code: string; label: string }[]
  employee_range: string
  company?: {
    name?: string
    cui?: string
    address?: string
    county?: string
    caen_code?: string
    tva?: boolean
  }
  email: string
  phone?: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()

    // Verifică autentificare
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautentificat.' }, { status: 401 })
    }

    const body: OnboardingPayload = await request.json()
    const { activities, employee_range, company, email, phone } = body

    if (!activities || activities.length === 0) {
      return NextResponse.json({ error: 'Selectați cel puțin o activitate.' }, { status: 400 })
    }

    if (!employee_range) {
      return NextResponse.json({ error: 'Selectați numărul de angajați.' }, { status: 400 })
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalid.' }, { status: 400 })
    }

    // Estimare angajați
    const employeeMap: Record<string, number> = {
      '1-5': 3,
      '6-10': 8,
      '11-20': 15,
      '21-50': 35,
      '51-100': 75,
      '100+': 150,
    }
    const employeeCount = employeeMap[employee_range] ?? 10

    const caenCodes = activities.map((a) => a.code)

    const orgName =
      company?.name?.trim() ||
      email.split('@')[1]?.split('.')[0]?.toUpperCase() ||
      'Organizație nouă'

    // 1. Creează organizație
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: orgName,
        cui: company?.cui?.trim() || null,
        address: company?.address?.trim() || null,
        county: company?.county?.trim() || null,
        contact_email: email.trim(),
        contact_phone: phone?.trim() || null,
        caen_code: caenCodes[0] || null,
        caen_description: activities[0]?.label || null,
        data_completeness: company?.name ? 50 : 20,
        exposure_score: 'necalculat',
        preferred_channels: ['email'],
        cooperation_status: 'active',
        country_code: 'RO',
      })
      .select()
      .single()

    if (orgError) {
      console.error('org insert error:', orgError)
      return NextResponse.json(
        { error: 'Eroare la crearea organizației.' },
        { status: 500 }
      )
    }

    // 2. Creează membership
    const { error: memberError } = await supabase.from('memberships').insert({
      user_id: user.id,
      organization_id: org.id,
      role: 'firma_admin',
      is_active: true,
    })

    if (memberError) {
      console.error('membership insert error:', memberError)
      await supabase.from('organizations').delete().eq('id', org.id)
      return NextResponse.json(
        { error: 'Eroare la crearea accesului.' },
        { status: 500 }
      )
    }

    // 3. Caută plan Trial sau Starter
    const { data: trialPlan } = await supabase
      .from('subscription_plans')
      .select('id')
      .in('name', ['Trial', 'Starter'])
      .eq('is_active', true)
      .order('price_ron', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (trialPlan) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 14)

      const { error: subError } = await supabase.from('subscriptions').insert({
        organization_id: org.id,
        plan_id: trialPlan.id,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        auto_renew: false,
        metadata: {
          trial: true,
          onboarding: true,
          activities: caenCodes,
          employee_range,
        },
      })

      if (subError) {
        console.error('subscription insert error (non-fatal):', subError)
      }
    }

    return NextResponse.json({
      success: true,
      organization_id: org.id,
      redirect: '/dashboard',
    })
  } catch (error) {
    console.error('onboarding complete error:', error)
    return NextResponse.json(
      { error: 'Eroare internă. Încercați din nou.' },
      { status: 500 }
    )
  }
}
