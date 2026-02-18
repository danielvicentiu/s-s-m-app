// app/api/cron/psi-alerts/route.ts
// M2_PSI: Cron job — verificare echipamente PSI cu inspecție expirată sau în curând
// GET /api/cron/psi-alerts — Vercel Cron: zilnic la 07:00 (0 7 * * *)
// Trimite email via Resend la contact_email al organizației

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface PSIAlertRow {
  id: string
  identifier: string
  equipment_type: string
  location: string | null
  next_inspection_date: string
  days_until_due: number
  alert_level: 'expired' | 'critical' | 'warning' | 'info' | 'ok'
  organization_id: string
  organization_name: string
  organization_cui: string | null
}

interface OrgAlerts {
  orgName: string
  orgId: string
  contactEmail: string
  items: PSIAlertRow[]
}

const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  stingator: 'Stingător',
  hidrant_interior: 'Hidrant interior',
  hidrant_exterior: 'Hidrant exterior',
  detector_fum: 'Detector fum',
  detector_co: 'Detector CO',
  alarma_incendiu: 'Alarmă incendiu',
  iluminat_urgenta: 'Iluminat urgență',
  sistem_stingere: 'Sistem stingere',
  altul: 'Alt echipament PSI'
}

function buildEmailHtml(orgName: string, items: PSIAlertRow[]): string {
  const expired = items.filter(i => i.alert_level === 'expired')
  const critical = items.filter(i => i.alert_level === 'critical')
  const warning = items.filter(i => i.alert_level === 'warning')

  const rowStyle = 'padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;'
  const thStyle = 'padding: 8px 12px; background: #f3f4f6; font-size: 12px; text-align: left; text-transform: uppercase; color: #6b7280;'

  const renderRows = (list: PSIAlertRow[]) => list.map(item => {
    const dayLabel = item.days_until_due < 0
      ? `<span style="color:#dc2626;">Expirat ${Math.abs(item.days_until_due)} zile</span>`
      : item.days_until_due <= 7
        ? `<span style="color:#dc2626;">${item.days_until_due} zile</span>`
        : `<span style="color:#d97706;">${item.days_until_due} zile</span>`

    return `<tr>
      <td style="${rowStyle}">${EQUIPMENT_TYPE_LABELS[item.equipment_type] || item.equipment_type}</td>
      <td style="${rowStyle}"><strong>${item.identifier}</strong></td>
      <td style="${rowStyle}">${item.location || '—'}</td>
      <td style="${rowStyle}">${item.next_inspection_date}</td>
      <td style="${rowStyle}">${dayLabel}</td>
    </tr>`
  }).join('')

  const sections: string[] = []

  if (expired.length > 0) {
    sections.push(`
      <h3 style="color:#dc2626;margin:20px 0 8px;">Expirate (${expired.length})</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead><tr>
          <th style="${thStyle}">Tip</th><th style="${thStyle}">Identificator</th>
          <th style="${thStyle}">Locație</th><th style="${thStyle}">Dată insp.</th><th style="${thStyle}">Zile</th>
        </tr></thead>
        <tbody>${renderRows(expired)}</tbody>
      </table>`)
  }

  if (critical.length > 0) {
    sections.push(`
      <h3 style="color:#d97706;margin:20px 0 8px;">Critice — expiră în 30 zile (${critical.length})</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead><tr>
          <th style="${thStyle}">Tip</th><th style="${thStyle}">Identificator</th>
          <th style="${thStyle}">Locație</th><th style="${thStyle}">Dată insp.</th><th style="${thStyle}">Zile</th>
        </tr></thead>
        <tbody>${renderRows(critical)}</tbody>
      </table>`)
  }

  if (warning.length > 0) {
    sections.push(`
      <h3 style="color:#ca8a04;margin:20px 0 8px;">Atenție — expiră în 60 zile (${warning.length})</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead><tr>
          <th style="${thStyle}">Tip</th><th style="${thStyle}">Identificator</th>
          <th style="${thStyle}">Locație</th><th style="${thStyle}">Dată insp.</th><th style="${thStyle}">Zile</th>
        </tr></thead>
        <tbody>${renderRows(warning)}</tbody>
      </table>`)
  }

  return `
    <!DOCTYPE html>
    <html lang="ro">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="font-family:system-ui,-apple-system,sans-serif;background:#f9fafb;margin:0;padding:20px;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <div style="background:#dc2626;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">🔥 Alertă PSI — ${orgName}</h1>
          <p style="color:#fecaca;margin:8px 0 0;font-size:14px;">
            ${items.length} echipament${items.length !== 1 ? 'e' : ''} necesit${items.length !== 1 ? 'ă' : 'ă'} atenție
          </p>
        </div>
        <div style="padding:24px 32px;">
          <p style="color:#374151;font-size:14px;margin:0 0 16px;">
            Platforma <strong>s-s-m.ro</strong> a detectat echipamente PSI cu inspecții expirate sau apropiate de expirare.
            Accesează platforma pentru a înregistra noile inspecții.
          </p>
          ${sections.join('')}
          <div style="margin-top:24px;padding:16px;background:#f3f4f6;border-radius:8px;text-align:center;">
            <a href="https://app.s-s-m.ro/ro/dashboard/psi"
               style="display:inline-block;background:#2563eb;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Accesează Modulul PSI
            </a>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin:16px 0 0;text-align:center;">
            Acest email a fost trimis automat de s-s-m.ro | Data: ${new Date().toLocaleDateString('ro-RO')}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[CRON psi-alerts] Start:', new Date().toISOString())

  try {
    const supabase = getSupabase()

    // Fetch equipment expiring within 60 days (warning + critical + expired) from view
    const sixtyDaysFromNow = new Date()
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60)
    const maxDateStr = sixtyDaysFromNow.toISOString().split('T')[0]

    const { data: alertRows, error: viewError } = await supabase
      .from('v_psi_expiring')
      .select('*')
      .lte('next_inspection_date', maxDateStr)
      .in('alert_level', ['expired', 'critical', 'warning'])
      .order('organization_id')
      .order('next_inspection_date', { ascending: true })

    if (viewError) {
      console.error('[CRON psi-alerts] View error:', viewError)
      return NextResponse.json({ error: viewError.message }, { status: 500 })
    }

    if (!alertRows || alertRows.length === 0) {
      console.log('[CRON psi-alerts] No alerts to send')
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        emails_sent: 0,
        duration_ms: Date.now() - startTime
      })
    }

    // Group by organization
    const orgMap = new Map<string, PSIAlertRow[]>()
    for (const row of alertRows as PSIAlertRow[]) {
      const existing = orgMap.get(row.organization_id) || []
      existing.push(row)
      orgMap.set(row.organization_id, existing)
    }

    // Fetch organization contact emails
    const orgIds = Array.from(orgMap.keys())
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, contact_email')
      .in('id', orgIds)

    if (orgError) {
      console.error('[CRON psi-alerts] Org error:', orgError)
      return NextResponse.json({ error: orgError.message }, { status: 500 })
    }

    // Build per-org alert batches with email
    const batches: OrgAlerts[] = []
    for (const org of orgs || []) {
      if (!org.contact_email) continue
      const items = orgMap.get(org.id)
      if (!items || items.length === 0) continue

      batches.push({
        orgId: org.id,
        orgName: org.name,
        contactEmail: org.contact_email,
        items
      })
    }

    if (batches.length === 0) {
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        message: 'Alerte găsite dar nicio organizație cu email configurat',
        emails_sent: 0,
        duration_ms: Date.now() - startTime
      })
    }

    // Initialize Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('[CRON psi-alerts] RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const resend = new Resend(resendApiKey)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'alerte@s-s-m.ro'

    let emailsSent = 0
    const results: Array<{ org: string; emails_queued: number; status: string; error?: string }> = []

    for (const batch of batches) {
      try {
        const html = buildEmailHtml(batch.orgName, batch.items)
        const expiredCount = batch.items.filter(i => i.alert_level === 'expired').length
        const subject = expiredCount > 0
          ? `⚠️ PSI Alert: ${expiredCount} echipament${expiredCount !== 1 ? 'e expirate' : ' expirat'} — ${batch.orgName}`
          : `📋 PSI Reminder: ${batch.items.length} echipament${batch.items.length !== 1 ? 'e' : ''} necesit${batch.items.length !== 1 ? 'ă' : 'ă'} inspecție — ${batch.orgName}`

        const { error: sendError } = await resend.emails.send({
          from: fromEmail,
          to: batch.contactEmail,
          subject,
          html
        })

        if (sendError) {
          console.error(`[CRON psi-alerts] Send error for ${batch.orgName}:`, sendError)
          results.push({ org: batch.orgName, emails_queued: 0, status: 'error', error: String(sendError) })
        } else {
          emailsSent++
          results.push({ org: batch.orgName, emails_queued: batch.items.length, status: 'sent' })
        }
      } catch (err) {
        console.error(`[CRON psi-alerts] Error for ${batch.orgName}:`, err)
        results.push({ org: batch.orgName, emails_queued: 0, status: 'error', error: String(err) })
      }
    }

    const duration = Date.now() - startTime
    console.log(`[CRON psi-alerts] Done: ${emailsSent} emails sent, ${duration}ms`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      organizations_with_alerts: orgMap.size,
      emails_sent: emailsSent,
      duration_ms: duration,
      details: results
    })
  } catch (error) {
    console.error('[CRON psi-alerts] Fatal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
