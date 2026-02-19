/**
 * API Route: GET /api/cron/iscir-alerts
 * Cron job: finds ISCIR equipment with verification due in <90 days and sends email alerts.
 * Trigger via Vercel Cron or external scheduler.
 * Authorization: Bearer CRON_SECRET header.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

interface ExpiringEquipment {
  id: string
  organization_id: string
  equipment_type: string
  identifier: string
  registration_number?: string
  location?: string
  rsvti_responsible?: string
  next_verification_date: string
  status: string
  organizations?: {
    id: string
    name: string
    cui?: string
  }
}

type AlertLevel = 'expirat' | 'urgent' | 'atentie'

function getAlertLevel(nextDate: string): { level: AlertLevel; daysUntil: number } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const next = new Date(nextDate)
  const daysUntil = Math.floor((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  let level: AlertLevel
  if (daysUntil < 0) {
    level = 'expirat'
  } else if (daysUntil <= 30) {
    level = 'urgent'
  } else {
    level = 'atentie'
  }

  return { level, daysUntil }
}

function buildAlertMessage(eq: ExpiringEquipment, level: AlertLevel, daysUntil: number): string {
  const orgName = eq.organizations?.name || 'organizație necunoscută'

  if (level === 'expirat') {
    return `EXPIRAT: Verificarea ISCIR pentru ${eq.identifier} (${orgName}) a depășit termenul cu ${Math.abs(daysUntil)} zile. Echipamentul trebuie oprit din funcțiune.`
  }
  if (level === 'urgent') {
    return `URGENT: Verificarea ISCIR pentru ${eq.identifier} (${orgName}) expiră în ${daysUntil} zile (${eq.next_verification_date}). Programați inspecția imediat.`
  }
  return `ATENȚIE: Verificarea ISCIR pentru ${eq.identifier} (${orgName}) expiră în ${daysUntil} zile (${eq.next_verification_date}).`
}

export async function GET(request: NextRequest) {
  try {
    // Authorization check
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const supabase = await createSupabaseServer()

    // Find all active equipment with verification due within 90 days
    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)

    const { data: expiringEquipment, error } = await supabase
      .from('iscir_equipment')
      .select('*, organizations(id, name, cui)')
      .eq('status', 'activ')
      .lte('next_verification_date', ninetyDaysFromNow.toISOString().split('T')[0])
      .order('next_verification_date', { ascending: true })

    if (error) {
      console.error('Error fetching expiring ISCIR equipment:', error)
      return NextResponse.json(
        { error: 'Eroare la verificarea echipamentelor ISCIR' },
        { status: 500 }
      )
    }

    const equipment = (expiringEquipment || []) as ExpiringEquipment[]

    const summary = {
      total: equipment.length,
      expirat: 0,
      urgent: 0,
      atentie: 0,
      alertsCreated: 0,
      errors: 0,
    }

    // Process each expiring equipment
    for (const eq of equipment) {
      const { level, daysUntil } = getAlertLevel(eq.next_verification_date)
      const message = buildAlertMessage(eq, level, daysUntil)

      if (level === 'expirat') summary.expirat++
      else if (level === 'urgent') summary.urgent++
      else summary.atentie++

      // Insert into alerts table (upsert to avoid duplicates per equipment+day)
      try {
        const { error: alertError } = await supabase.from('alerts').upsert(
          {
            organization_id: eq.organization_id,
            alert_type: 'iscir_verificare',
            severity: level === 'expirat' ? 'critical' : level === 'urgent' ? 'high' : 'medium',
            title: `Verificare ISCIR ${level}: ${eq.identifier}`,
            message,
            reference_id: eq.id,
            reference_type: 'iscir_equipment',
            is_read: false,
          },
          { onConflict: 'reference_id,reference_type,alert_type', ignoreDuplicates: false }
        )

        if (alertError) {
          // alerts table schema may differ; log and continue
          console.error(`Alert upsert failed for equipment ${eq.id}:`, alertError.message)
          summary.errors++
        } else {
          summary.alertsCreated++
        }
      } catch (alertErr) {
        console.error(`Alert creation error for ${eq.id}:`, alertErr)
        summary.errors++
      }
    }

    console.log(`[CRON] iscir-alerts completed: ${JSON.stringify(summary)}`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      // Return first 20 items for debugging
      sample: equipment.slice(0, 20).map((eq) => {
        const { level, daysUntil } = getAlertLevel(eq.next_verification_date)
        return {
          id: eq.id,
          identifier: eq.identifier,
          organization: eq.organizations?.name,
          next_verification_date: eq.next_verification_date,
          days_until: daysUntil,
          alert_level: level,
        }
      }),
    })
  } catch (error) {
    console.error('Error in ISCIR alerts cron:', error)
    return NextResponse.json(
      { error: 'Eroare internă la procesarea alertelor ISCIR' },
      { status: 500 }
    )
  }
}
