// S-S-M.RO — CRON: Verificare expirări zilnice
// GET /api/cron/check-expiries — Vercel Cron: zilnic la 06:00 (0 6 * * *)
// Cascade: WhatsApp → SMS → Email pentru fiecare element care expiră

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkExpiries, sendAlert, processEscalation } from '@/lib/alerts/alertService'
import type { AlertConfig } from '@/lib/alerts/alertService'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: Request) {
  // Verificare CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[CRON check-expiries] Start:', new Date().toISOString())
  const startTime = Date.now()

  try {
    const supabase = getSupabase()

    // Fetch toate organizațiile cu configurare alerte
    const { data: configs, error: configError } = await supabase
      .from('alert_configurations')
      .select('*, organizations(id, name, contact_email)')

    if (configError) {
      console.error('[CRON check-expiries] Config error:', configError)
      return NextResponse.json({ error: configError.message }, { status: 500 })
    }

    if (!configs || configs.length === 0) {
      // Fallback: verifică TOATE organizațiile cu email_enabled implicit
      const { data: orgs } = await supabase
        .from('organizations')
        .select('id, name, contact_email')

      if (!orgs || orgs.length === 0) {
        return NextResponse.json({ success: true, message: 'Nicio organizație de procesat' })
      }

      // Procesăm cu config default (email only)
      const defaultConfig: AlertConfig = {
        whatsapp_enabled: false,
        sms_enabled: false,
        email_enabled: true,
        alert_days: [30, 14, 7, 1],
        escalation_enabled: false,
        escalation_after_hours: 48,
        escalation_contact_name: null,
        escalation_contact_phone: null,
        escalation_contact_email: null,
        monthly_report_enabled: true,
        monthly_report_day: 1,
      }

      let processed = 0
      for (const org of orgs) {
        if (!org.contact_email) continue
        const items = await checkExpiries(org.id, defaultConfig.alert_days)
        for (const item of items) {
          await sendAlert({
            organizationId: org.id,
            orgName: org.name,
            alertType: item.type,
            recipientName: item.recipientName,
            recipientEmail: org.contact_email,
            entityName: item.entityName,
            entityType: item.entityType,
            entityId: item.entityId,
            expiryDate: item.expiryDate,
            daysUntilExpiry: item.daysUntilExpiry,
            config: defaultConfig,
          })
          processed++
        }
      }

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        alerts_sent: processed,
        duration_ms: Date.now() - startTime,
      })
    }

    let totalAlerts = 0
    const results: Array<{ org: string; alerts: number; status: string }> = []

    for (const config of configs) {
      const org = Array.isArray(config.organizations)
        ? config.organizations[0]
        : config.organizations

      if (!org) continue

      const alertConfig: AlertConfig = {
        whatsapp_enabled: config.whatsapp_enabled,
        sms_enabled: config.sms_enabled,
        email_enabled: config.email_enabled,
        alert_days: config.alert_days || [30, 14, 7, 1],
        escalation_enabled: config.escalation_enabled,
        escalation_after_hours: config.escalation_after_hours || 48,
        escalation_contact_name: config.escalation_contact_name,
        escalation_contact_phone: config.escalation_contact_phone,
        escalation_contact_email: config.escalation_contact_email,
        monthly_report_enabled: config.monthly_report_enabled,
        monthly_report_day: config.monthly_report_day || 1,
      }

      try {
        const items = await checkExpiries(config.organization_id, alertConfig.alert_days)

        for (const item of items) {
          await sendAlert({
            organizationId: config.organization_id,
            orgName: org.name,
            alertType: item.type,
            recipientName: item.recipientName,
            recipientPhone: item.recipientPhone,
            recipientEmail: item.recipientEmail || org.contact_email,
            entityName: item.entityName,
            entityType: item.entityType,
            entityId: item.entityId,
            expiryDate: item.expiryDate,
            daysUntilExpiry: item.daysUntilExpiry,
            config: alertConfig,
          })
          totalAlerts++
        }

        results.push({ org: org.name, alerts: items.length, status: 'ok' })
      } catch (err) {
        console.error(`[CRON check-expiries] Error for ${org.name}:`, err)
        results.push({ org: org.name, alerts: 0, status: 'error' })
      }
    }

    // Procesează escaladările neconfirmate
    try {
      await processEscalation()
    } catch (err) {
      console.error('[CRON check-expiries] Escalation error:', err)
    }

    const duration = Date.now() - startTime
    console.log(`[CRON check-expiries] Done: ${totalAlerts} alerte, ${duration}ms`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      organizations_processed: configs.length,
      alerts_sent: totalAlerts,
      duration_ms: duration,
      details: results,
    })
  } catch (error) {
    console.error('[CRON check-expiries] Fatal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
