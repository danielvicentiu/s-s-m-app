// S-S-M.RO — Cron: Escaladare Alerte
// GET /api/cron/escalate-alerts — rulează la fiecare 6 ore
// Vercel Cron: "0 */6 * * *"
//
// Cascadă:
//   Level 1 (0–24h)  → Email cu template AlerteConformitate via Resend
//   Level 2 (24–48h) → SMS via Twilio
//   Level 3 (48–72h) → WhatsApp via Twilio
//   Level 4 (>72h + critical) → Apel vocal via Twilio

import { NextResponse } from 'next/server'
import { render } from '@react-email/components'
import { createSupabaseServer } from '@/lib/supabase/server'
import { sendAlertEmail } from '@/lib/email/resend-client'
import { sendSMS, sendWhatsApp, makeCall } from '@/lib/twilio-client'
import { AlerteConformitate, AlertRow } from '@/components/email-templates/AlerteConformitate'

interface EscalationResult {
  processed: number
  escalated: {
    email: number
    sms: number
    whatsapp: number
    call: number
  }
  errors: string[]
}

/**
 * Calculează ore scurse de la o dată
 */
function hoursElapsed(date: string | Date): number {
  const created = new Date(date)
  const now = new Date()
  return (now.getTime() - created.getTime()) / (1000 * 60 * 60)
}

/**
 * Verifică dacă un nivel de escaladare a fost deja trimis pentru o alertă
 */
async function wasAlreadySent(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  alertId: string,
  level: number
): Promise<boolean> {
  const { data } = await supabase
    .from('alerts_escalation')
    .select('id')
    .eq('alert_id', alertId)
    .eq('level', level)
    .in('status', ['sent', 'confirmed'])
    .limit(1)

  return Boolean(data && data.length > 0)
}

/**
 * Înregistrează o escaladare în baza de date
 */
async function logEscalation(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  params: {
    alertId: string
    employeeId?: string | null
    organizationId?: string | null
    level: number
    channel: 'email' | 'sms' | 'whatsapp' | 'call'
    status: 'sent' | 'failed'
    errorMessage?: string
  }
): Promise<void> {
  await supabase.from('alerts_escalation').insert({
    alert_id: params.alertId,
    employee_id: params.employeeId ?? null,
    organization_id: params.organizationId ?? null,
    level: params.level,
    channel: params.channel,
    sent_at: new Date().toISOString(),
    status: params.status,
    error_message: params.errorMessage ?? null,
  })
}

export async function GET(request: Request) {
  try {
    // Verificăm Authorization header (Vercel Cron trimite CRON_SECRET)
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    console.log('[CRON] Starting alert escalation job...')
    const startTime = Date.now()

    const supabase = await createSupabaseServer()

    const result: EscalationResult = {
      processed: 0,
      escalated: { email: 0, sms: 0, whatsapp: 0, call: 0 },
      errors: [],
    }

    // Query alerte neconfirmate din ultimele 7 zile
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: alerts, error: alertsError } = await supabase
      .from('alerts')
      .select(`
        id,
        organization_id,
        employee_id,
        type,
        severity,
        message,
        created_at,
        confirmed_at,
        organizations (
          id,
          name
        )
      `)
      .is('confirmed_at', null)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    if (alertsError) {
      console.error('[CRON] Error fetching alerts:', alertsError)
      return NextResponse.json(
        { error: 'Failed to fetch alerts', details: alertsError.message },
        { status: 500 }
      )
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unconfirmed alerts to process',
        processed: 0,
        escalated: result.escalated,
      })
    }

    console.log(`[CRON] Processing ${alerts.length} unconfirmed alerts`)

    for (const alert of alerts) {
      result.processed++
      const hours = hoursElapsed(alert.created_at)
      const orgId = alert.organization_id
      const orgName = (alert.organizations as any)?.name ?? 'Organizație'

      try {
        // ─── Level 1: 0–24h → Email ───────────────────────────────────────
        if (hours <= 24) {
          const alreadySent = await wasAlreadySent(supabase, alert.id, 1)
          if (!alreadySent) {
            const alertRows: AlertRow[] = [
              {
                tip: alert.type ?? 'Alertă',
                denumire: alert.message ?? '',
                data_expirare: new Date(alert.created_at).toLocaleDateString('ro-RO'),
                zile_ramase: -1,
              },
            ]

            const { data: memberships } = await supabase
              .from('memberships')
              .select('user_id')
              .eq('organization_id', orgId)
              .eq('role', 'consultant')
              .eq('is_active', true)
              .limit(5)

            if (memberships && memberships.length > 0) {
              const userIds = memberships.map((m: any) => m.user_id)
              const { data: authUsers } = await supabase.auth.admin.listUsers()
              const emails = authUsers?.users
                ?.filter((u: any) => userIds.includes(u.id))
                ?.map((u: any) => u.email)
                ?.filter(Boolean) ?? []

              if (emails.length > 0) {
                const emailHtml = await render(
                  AlerteConformitate({
                    organizationName: orgName,
                    alerts: alertRows,
                    dashboardUrl: 'https://app.s-s-m.ro/dashboard',
                  })
                )

                const emailResult = await sendAlertEmail({
                  to: emails,
                  subject: `⚠️ Alertă neconfirmată: ${orgName}`,
                  html: emailHtml,
                })

                if (emailResult.success) {
                  result.escalated.email++
                  await logEscalation(supabase, {
                    alertId: alert.id,
                    employeeId: alert.employee_id,
                    organizationId: orgId,
                    level: 1,
                    channel: 'email',
                    status: 'sent',
                  })
                } else {
                  await logEscalation(supabase, {
                    alertId: alert.id,
                    organizationId: orgId,
                    level: 1,
                    channel: 'email',
                    status: 'failed',
                    errorMessage: emailResult.error,
                  })
                }
              }
            }
          }
        }

        // ─── Level 2: 24–48h → SMS ────────────────────────────────────────
        else if (hours > 24 && hours <= 48) {
          const alreadySent = await wasAlreadySent(supabase, alert.id, 2)
          if (!alreadySent) {
            const { data: memberships } = await supabase
              .from('memberships')
              .select('profiles (phone)')
              .eq('organization_id', orgId)
              .eq('role', 'consultant')
              .eq('is_active', true)
              .limit(3)

            const phones: string[] = (memberships ?? [])
              .map((m: any) => m.profiles?.phone)
              .filter(Boolean)

            for (const phone of phones) {
              const smsBody = `[s-s-m.ro] Alertă neconfirmată: ${orgName} — ${alert.type ?? 'Alertă'}. Accesați app.s-s-m.ro/dashboard`
              const smsSent = await sendSMS(phone, smsBody)

              if (smsSent) {
                result.escalated.sms++
                await logEscalation(supabase, {
                  alertId: alert.id,
                  employeeId: alert.employee_id,
                  organizationId: orgId,
                  level: 2,
                  channel: 'sms',
                  status: 'sent',
                })
              } else {
                await logEscalation(supabase, {
                  alertId: alert.id,
                  organizationId: orgId,
                  level: 2,
                  channel: 'sms',
                  status: 'failed',
                })
              }
            }
          }
        }

        // ─── Level 3: 48–72h → WhatsApp ───────────────────────────────────
        else if (hours > 48 && hours <= 72) {
          const alreadySent = await wasAlreadySent(supabase, alert.id, 3)
          if (!alreadySent) {
            const { data: memberships } = await supabase
              .from('memberships')
              .select('profiles (phone)')
              .eq('organization_id', orgId)
              .eq('role', 'consultant')
              .eq('is_active', true)
              .limit(3)

            const phones: string[] = (memberships ?? [])
              .map((m: any) => m.profiles?.phone)
              .filter(Boolean)

            for (const phone of phones) {
              const waBody = `🔴 *s-s-m.ro — Alertă URGENTĂ*\n\nOrganizație: *${orgName}*\nTip: ${alert.type ?? 'Alertă'}\n\nAlerta nu a fost confirmată în ultimele 48h. Accesați platforma imediat:\nhttps://app.s-s-m.ro/dashboard`
              const waSent = await sendWhatsApp(phone, waBody)

              if (waSent) {
                result.escalated.whatsapp++
                await logEscalation(supabase, {
                  alertId: alert.id,
                  employeeId: alert.employee_id,
                  organizationId: orgId,
                  level: 3,
                  channel: 'whatsapp',
                  status: 'sent',
                })
              } else {
                await logEscalation(supabase, {
                  alertId: alert.id,
                  organizationId: orgId,
                  level: 3,
                  channel: 'whatsapp',
                  status: 'failed',
                })
              }
            }
          }
        }

        // ─── Level 4: >72h + critical → Apel vocal ────────────────────────
        else if (hours > 72 && alert.severity === 'critical') {
          const alreadySent = await wasAlreadySent(supabase, alert.id, 4)
          if (!alreadySent) {
            const { data: memberships } = await supabase
              .from('memberships')
              .select('profiles (phone)')
              .eq('organization_id', orgId)
              .eq('role', 'consultant')
              .eq('is_active', true)
              .limit(2)

            const phones: string[] = (memberships ?? [])
              .map((m: any) => m.profiles?.phone)
              .filter(Boolean)

            for (const phone of phones) {
              const callMessage = `Bună ziua. Acesta este un mesaj automat de la platforma s-s-m.ro. Organizația ${orgName} are o alertă critică neconfirmată de peste 72 de ore. Vă rugăm să accesați platforma imediat. Mulțumim.`
              const callMade = await makeCall(phone, callMessage)

              if (callMade) {
                result.escalated.call++
                await logEscalation(supabase, {
                  alertId: alert.id,
                  employeeId: alert.employee_id,
                  organizationId: orgId,
                  level: 4,
                  channel: 'call',
                  status: 'sent',
                })
              } else {
                await logEscalation(supabase, {
                  alertId: alert.id,
                  organizationId: orgId,
                  level: 4,
                  channel: 'call',
                  status: 'failed',
                })
              }
            }
          }
        }
      } catch (alertError) {
        const errMsg = alertError instanceof Error ? alertError.message : 'Unknown error'
        console.error(`[CRON] Error processing alert ${alert.id}:`, errMsg)
        result.errors.push(`Alert ${alert.id}: ${errMsg}`)
      }
    }

    const duration = Date.now() - startTime
    console.log('[CRON] Alert escalation job completed:', { duration: `${duration}ms`, result })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration,
      processed: result.processed,
      escalated: result.escalated,
      errors: result.errors,
    })
  } catch (error) {
    console.error('[CRON] Fatal error in escalate-alerts job:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run alert escalation job',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
