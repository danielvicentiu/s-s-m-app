// app/api/cron/medical-alerts/route.ts
// CRON: Alerte expirare fișe medicale
// GET /api/cron/medical-alerts — Vercel Cron: zilnic 07:30 (30 7 * * *)
//
// Logică:
//   1. Interogăm v_medical_expiring (view existent) cu alert_level IN ('urgent','expirat','atentie')
//   2. Grupăm pe organization_id
//   3. Trimitem câte un email per organizație la contact_email
//   4. Autentificare via CRON_SECRET header

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendAlertEmail } from '@/lib/email/resend-client'

// ============================================================
// TYPES
// ============================================================

interface ExpiringRecord {
  id: string
  organization_id: string
  employee_id: string | null
  employee_name: string
  full_name: string | null
  job_title: string | null
  examination_type: string
  expiry_date: string
  days_until_expiry: number | null
  alert_level: 'urgent' | 'expirat' | 'atentie' | string
  org_name: string
  org_cui: string | null
}

interface Organization {
  id: string
  name: string
  contact_email: string | null
}

// ============================================================
// HELPER: Supabase service-role client (bypasses RLS)
// ============================================================

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, key)
}

// ============================================================
// HELPER: HTML email template for an organization
// ============================================================

function buildEmailHtml(orgName: string, records: ExpiringRecord[]): string {
  const rows = records
    .map((r) => {
      const name = r.full_name || r.employee_name
      const days = r.days_until_expiry ?? 0
      const daysText =
        days < 0
          ? `<strong style="color:#dc2626">Expirat ${Math.abs(days)} zile</strong>`
          : days === 0
          ? '<strong style="color:#dc2626">Expiră AZI</strong>'
          : `<strong style="color:${days <= 7 ? '#dc2626' : '#ea580c'}">${days} zile</strong>`

      const levelColors: Record<string, string> = {
        expirat: '#dc2626',
        urgent: '#ea580c',
        atentie: '#ca8a04',
      }
      const levelLabels: Record<string, string> = {
        expirat: 'EXPIRAT',
        urgent: 'URGENT',
        atentie: 'ATENȚIE',
      }
      const levelColor = levelColors[r.alert_level] ?? '#ca8a04'
      const levelLabel = levelLabels[r.alert_level] ?? 'ATENȚIE'

      const examDate = r.expiry_date
        ? new Date(r.expiry_date).toLocaleDateString('ro-RO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '—'

      return `
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 14px;font-size:14px;color:#111827;">${name}</td>
          <td style="padding:10px 14px;font-size:13px;color:#6b7280;">${r.job_title ?? '—'}</td>
          <td style="padding:10px 14px;font-size:13px;color:#374151;">${examDate}</td>
          <td style="padding:10px 14px;">${daysText}</td>
          <td style="padding:10px 14px;">
            <span style="display:inline-block;padding:3px 10px;background:${levelColor};color:#fff;font-size:11px;font-weight:700;border-radius:9999px;">
              ${levelLabel}
            </span>
          </td>
        </tr>`
    })
    .join('')

  return `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><title>Alertă Medicină Muncii — ${orgName}</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f9fafb;">
  <div style="max-width:680px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

    <!-- Header -->
    <div style="background:#1e40af;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">
        🩺 Alertă Medicină Muncii
      </h1>
      <p style="margin:6px 0 0;color:#bfdbfe;font-size:14px;">${orgName}</p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="color:#374151;font-size:15px;margin:0 0 20px;">
        Următorii angajați au fișe medicale de aptitudine <strong>expirate sau care expiră în curând</strong>.
        Vă rugăm să programați examinările necesare.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Angajat</th>
            <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Funcție</th>
            <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Data expirare</th>
            <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Zile rămase</th>
            <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Prioritate</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="margin-top:24px;padding:16px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;">
        <p style="margin:0;font-size:13px;color:#1e40af;">
          <strong>Bază legală:</strong> HG 355/2007 privind supravegherea sănătății lucrătorilor,
          Ordinul MS 1169/2023. Angajații inapți sau fără fișă valabilă nu pot desfășura activitate.
        </p>
      </div>

      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
        Gestionați fișele medicale în platforma S-S-M.ro → Medicină Muncii → Fișe medicale.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Alertă automată generată de <a href="https://app.s-s-m.ro" style="color:#3b82f6;">S-S-M.ro</a>
        · ${new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })}
      </p>
    </div>
  </div>
</body>
</html>`
}

// ============================================================
// CRON HANDLER
// ============================================================

export async function GET(request: Request) {
  // --- Auth ---
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[CRON medical-alerts] Start:', new Date().toISOString())

  try {
    const supabase = getServiceClient()

    // 1. Fetch expiring medical records (next 30 days + already expired)
    const { data: expiringRecords, error: viewError } = await supabase
      .from('v_medical_expiring')
      .select('*')
      .in('alert_level', ['expirat', 'urgent', 'atentie'])

    if (viewError) {
      console.error('[CRON medical-alerts] View error:', viewError)
      return NextResponse.json({ error: viewError.message }, { status: 500 })
    }

    if (!expiringRecords || expiringRecords.length === 0) {
      console.log('[CRON medical-alerts] No expiring records found.')
      return NextResponse.json({
        success: true,
        emails_sent: 0,
        records_found: 0,
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      })
    }

    const records = expiringRecords as ExpiringRecord[]

    // 2. Group by organization_id
    const byOrg: Record<string, ExpiringRecord[]> = {}
    for (const rec of records) {
      if (!byOrg[rec.organization_id]) byOrg[rec.organization_id] = []
      byOrg[rec.organization_id].push(rec)
    }

    const orgIds = Object.keys(byOrg)

    // 3. Fetch organization contact emails
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, contact_email')
      .in('id', orgIds)

    if (orgError) {
      console.error('[CRON medical-alerts] Org fetch error:', orgError)
      return NextResponse.json({ error: orgError.message }, { status: 500 })
    }

    // 4. Send one email per organization
    const results: Array<{ org: string; records: number; status: string; error?: string }> = []
    let emailsSent = 0

    for (const org of (orgs || []) as Organization[]) {
      if (!org.contact_email) {
        results.push({ org: org.name, records: 0, status: 'skip_no_email' })
        continue
      }

      const orgRecords = byOrg[org.id] ?? []
      if (orgRecords.length === 0) continue

      // Sort: expirat first, then by days_until_expiry ascending
      orgRecords.sort((a, b) => {
        if (a.alert_level === 'expirat' && b.alert_level !== 'expirat') return -1
        if (a.alert_level !== 'expirat' && b.alert_level === 'expirat') return 1
        return (a.days_until_expiry ?? 0) - (b.days_until_expiry ?? 0)
      })

      try {
        const html = buildEmailHtml(org.name, orgRecords)
        const expiredCount = orgRecords.filter((r) => r.alert_level === 'expirat').length
        const subject =
          expiredCount > 0
            ? `⚠️ ${expiredCount} fișe medicale expirate — ${org.name}`
            : `🔔 ${orgRecords.length} fișe medicale expiră în curând — ${org.name}`

        const result = await sendAlertEmail({
          to: org.contact_email,
          subject,
          html,
        })

        if (result.success) {
          emailsSent++
          results.push({ org: org.name, records: orgRecords.length, status: 'sent' })
        } else {
          results.push({ org: org.name, records: orgRecords.length, status: 'error', error: result.error })
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`[CRON medical-alerts] Email error for ${org.name}:`, msg)
        results.push({ org: org.name, records: orgRecords.length, status: 'error', error: msg })
      }
    }

    const duration = Date.now() - startTime
    console.log(
      `[CRON medical-alerts] Done: ${emailsSent} emails, ${records.length} records, ${duration}ms`
    )

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      records_found: records.length,
      organizations_processed: orgIds.length,
      emails_sent: emailsSent,
      duration_ms: duration,
      details: results,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[CRON medical-alerts] Fatal error:', message)
    return NextResponse.json(
      { success: false, error: message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
