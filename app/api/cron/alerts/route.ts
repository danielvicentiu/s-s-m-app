// ============================================================
// FIȘIER: app/api/cron/alerts/route.ts
// SCOP: Vercel Cron job zilnic — verifică examene medicale + echipamente PSI
//       care expiră în 30/7/0 zile, trimite email alerte via Resend
// CRON: Rulează automat zilnic la 08:00 UTC via Vercel Cron
// AUTOR: Claude Code
// DATA: 2026-02-13
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import type { MedicalExamination, SafetyEquipment } from '@/lib/types'

// Lazy-init clienți (evită crash la build time)
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY missing in environment variables')
  }
  return new Resend(apiKey)
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials missing in environment variables')
  }

  return createClient(url, key) // Service role = bypass RLS
}

// ============================================================
// TIPURI
// ============================================================

interface AlertItem {
  type: 'medical' | 'equipment'
  employee_name?: string
  cnp_hash?: string
  job_title?: string
  examination_type?: string
  equipment_type?: string
  description?: string
  location?: string
  serial_number?: string
  expiry_date: string
  days_left: number
  urgency: 'urgent' | 'warning' | 'info' // 0 zile, 7 zile, 30 zile
  result?: string
  restrictions?: string
  doctor_name?: string
  clinic_name?: string
}

interface OrganizationAlerts {
  org_id: string
  org_name: string
  contact_email: string
  country_code: string
  items: AlertItem[]
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculează zilele rămase până la expirare
 */
function daysUntilExpiry(expiryDateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiryDate = new Date(expiryDateStr)
  expiryDate.setHours(0, 0, 0, 0)
  return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Determină urgența alertei bazat pe zilele rămase
 */
function calculateUrgency(daysLeft: number): 'urgent' | 'warning' | 'info' {
  if (daysLeft <= 0) return 'urgent'      // Expirat sau expiră astăzi
  if (daysLeft <= 7) return 'urgent'      // 7 zile sau mai puțin
  if (daysLeft <= 30) return 'warning'    // 30 zile sau mai puțin
  return 'info'                            // > 30 zile
}

/**
 * Generează HTML email pentru alertele unei organizații
 */
function generateAlertEmail(orgName: string, items: AlertItem[]): string {
  // Grupare pe urgență
  const urgent = items.filter(i => i.urgency === 'urgent')
  const warning = items.filter(i => i.urgency === 'warning')
  const info = items.filter(i => i.urgency === 'info')

  const renderSection = (
    title: string,
    emoji: string,
    color: string,
    sectionItems: AlertItem[]
  ) => {
    if (sectionItems.length === 0) return ''

    return `
      <div style="margin-bottom: 24px;">
        <h2 style="color: ${color}; margin-bottom: 12px; font-size: 18px;">
          ${emoji} ${title} (${sectionItems.length})
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Tip</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Detalii</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Data expirare</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${sectionItems.map(item => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top;">
                  ${item.type === 'medical' ? '🏥 <strong>Examen medical</strong>' : '🧯 <strong>Echipament PSI</strong>'}
                  ${item.examination_type ? `<br><small style="color: #666;">${item.examination_type}</small>` : ''}
                  ${item.equipment_type ? `<br><small style="color: #666;">${item.equipment_type}</small>` : ''}
                </td>
                <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top;">
                  ${item.type === 'medical'
                    ? `
                      <strong>${item.employee_name || 'N/A'}</strong><br>
                      ${item.job_title ? `<small style="color: #666;">${item.job_title}</small><br>` : ''}
                      ${item.result ? `<small>Rezultat: ${item.result}</small><br>` : ''}
                      ${item.restrictions ? `<small style="color: #d32f2f;">⚠️ Restricții: ${item.restrictions}</small><br>` : ''}
                      ${item.doctor_name ? `<small>Dr. ${item.doctor_name}</small>` : ''}
                      ${item.clinic_name ? ` - <small>${item.clinic_name}</small>` : ''}
                    `
                    : `
                      <strong>${item.description || item.equipment_type || 'N/A'}</strong><br>
                      ${item.location ? `<small style="color: #666;">📍 ${item.location}</small><br>` : ''}
                      ${item.serial_number ? `<small>Serie: ${item.serial_number}</small>` : ''}
                    `
                  }
                </td>
                <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top; white-space: nowrap;">
                  ${new Date(item.expiry_date).toLocaleDateString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
                <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top; color: ${color}; font-weight: bold;">
                  ${item.days_left <= 0
                    ? '🔴 EXPIRAT'
                    : `${item.days_left} ${item.days_left === 1 ? 'zi' : 'zile'}`
                  }
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  }

  const totalMedical = items.filter(i => i.type === 'medical').length
  const totalEquipment = items.filter(i => i.type === 'equipment').length

  return `
    <!DOCTYPE html>
    <html lang="ro">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alerte SSM - ${orgName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
      <div style="max-width: 800px; margin: 0 auto; background: #ffffff;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #2d3561 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0 0 10px; font-size: 28px; font-weight: 600;">
            ⚠️ Alerte SSM & PSI
          </h1>
          <p style="margin: 0; font-size: 20px; opacity: 0.95;">
            ${orgName}
          </p>
          <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.8;">
            Raport zilnic — ${new Date().toLocaleDateString('ro-RO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <!-- Summary -->
        <div style="padding: 24px 20px; background: ${urgent.length > 0 ? '#fff3e0' : '#e3f2fd'}; border-left: 4px solid ${urgent.length > 0 ? '#f57c00' : '#1976d2'};">
          <p style="margin: 0; font-size: 16px; color: #333; line-height: 1.6;">
            ${urgent.length > 0
              ? `<strong style="color: #d32f2f;">⚠️ ATENȚIE!</strong> Aveți <strong>${urgent.length} element${urgent.length === 1 ? '' : 'e'}</strong> care necesită acțiune imediată (expirate sau expiră în max. 7 zile).`
              : `Aveți <strong>${items.length} alerte</strong> care necesită atenție în următoarele 30 de zile.`
            }
          </p>
          <p style="margin: 10px 0 0; font-size: 14px; color: #666;">
            📋 Total: ${totalMedical} examene medicale, ${totalEquipment} echipamente PSI
          </p>
        </div>

        <!-- Alerts Content -->
        <div style="padding: 24px 20px;">
          ${renderSection(
            'URGENT — Acțiune Imediată Necesară',
            '🔴',
            '#d32f2f',
            urgent
          )}

          ${renderSection(
            'ATENȚIE — Expiră în max. 30 zile',
            '🟡',
            '#f57c00',
            warning
          )}

          ${renderSection(
            'INFORMARE',
            '🔵',
            '#1976d2',
            info
          )}
        </div>

        <!-- Call to Action -->
        <div style="padding: 24px 20px; background: #f5f5f5; text-align: center;">
          <p style="margin: 0 0 16px; font-size: 15px; color: #333;">
            Accesați platforma pentru detalii complete și gestionare
          </p>
          <a href="https://app.s-s-m.ro/dashboard"
             style="display: inline-block; padding: 12px 32px; background: #1976d2; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;">
            Acces Dashboard SSM
          </a>
        </div>

        <!-- Footer -->
        <div style="padding: 20px; background: #1a1a2e; color: white; text-align: center; font-size: 13px;">
          <p style="margin: 0 0 8px; opacity: 0.9;">
            <strong>s-s-m.ro</strong> — Platformă Digitală SSM & PSI
          </p>
          <p style="margin: 0; opacity: 0.7;">
            Multilingv: RO 🇷🇴 • BG 🇧🇬 • HU 🇭🇺 • DE 🇩🇪 • PL 🇵🇱
          </p>
          <p style="margin: 8px 0 0; opacity: 0.6; font-size: 11px;">
            Acest email a fost trimis automat. Pentru întrebări, contactați-ne la <a href="mailto:contact@s-s-m.ro" style="color: #64b5f6;">contact@s-s-m.ro</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// ============================================================
// MAIN HANDLER — GET (apelat de Vercel Cron)
// ============================================================

export async function GET(request: Request) {
  const startTime = Date.now()

  // Protecție: verifică CRON_SECRET sau authorization header
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.error('Unauthorized cron attempt')
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const supabase = getSupabase()
    const resend = getResend()

    console.log('[CRON] Starting daily alerts check...')

    // ============================================================
    // 1. FETCH TOATE ORGANIZAȚIILE CU CONTACT EMAIL
    // ============================================================

    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, contact_email, country_code')
      .not('contact_email', 'is', null)

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError)
      throw orgsError
    }

    if (!organizations || organizations.length === 0) {
      console.log('[CRON] No organizations with contact email found')
      return NextResponse.json({
        success: true,
        message: 'No organizations to process',
        organizations_checked: 0,
        emails_sent: 0,
        total_alerts: 0,
      })
    }

    console.log(`[CRON] Found ${organizations.length} organizations`)

    // ============================================================
    // 2. PENTRU FIECARE ORGANIZAȚIE, VERIFICĂ ALERTE
    // ============================================================

    let emailsSent = 0
    let totalAlerts = 0
    const results: any[] = []

    // Calculăm data limită: astăzi + 30 zile
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const in30Days = new Date(today)
    in30Days.setDate(today.getDate() + 30)
    const cutoffDate = in30Days.toISOString().split('T')[0]

    for (const org of organizations) {
      const alerts: AlertItem[] = []

      // ────────────────────────────────────────────────────────
      // 2a. EXAMENE MEDICALE care expiră în următoarele 30 zile
      // ────────────────────────────────────────────────────────

      const { data: medicalExams, error: medicalError } = await supabase
        .from('medical_examinations')
        .select('*')
        .eq('organization_id', org.id)
        .lte('expiry_date', cutoffDate)
        .order('expiry_date', { ascending: true })

      if (medicalError) {
        console.error(`Error fetching medical exams for org ${org.id}:`, medicalError)
      } else if (medicalExams && medicalExams.length > 0) {
        for (const exam of medicalExams) {
          const daysLeft = daysUntilExpiry(exam.expiry_date)

          // Filtrare: doar 0, 7, 30 zile
          if (daysLeft === 0 || daysLeft === 7 || daysLeft === 30) {
            alerts.push({
              type: 'medical',
              employee_name: exam.employee_name,
              cnp_hash: exam.cnp_hash,
              job_title: exam.job_title,
              examination_type: exam.examination_type,
              expiry_date: exam.expiry_date,
              days_left: daysLeft,
              urgency: calculateUrgency(daysLeft),
              result: exam.result,
              restrictions: exam.restrictions,
              doctor_name: exam.doctor_name,
              clinic_name: exam.clinic_name,
            })
          }
        }
      }

      // ────────────────────────────────────────────────────────
      // 2b. ECHIPAMENTE PSI care expiră în următoarele 30 zile
      // ────────────────────────────────────────────────────────

      const { data: equipment, error: equipmentError } = await supabase
        .from('safety_equipment')
        .select('*')
        .eq('organization_id', org.id)
        .lte('expiry_date', cutoffDate)
        .order('expiry_date', { ascending: true })

      if (equipmentError) {
        console.error(`Error fetching equipment for org ${org.id}:`, equipmentError)
      } else if (equipment && equipment.length > 0) {
        for (const eq of equipment) {
          const daysLeft = daysUntilExpiry(eq.expiry_date)

          // Filtrare: doar 0, 7, 30 zile
          if (daysLeft === 0 || daysLeft === 7 || daysLeft === 30) {
            alerts.push({
              type: 'equipment',
              equipment_type: eq.equipment_type,
              description: eq.description,
              location: eq.location,
              serial_number: eq.serial_number,
              expiry_date: eq.expiry_date,
              days_left: daysLeft,
              urgency: calculateUrgency(daysLeft),
            })
          }
        }
      }

      // ────────────────────────────────────────────────────────
      // 3. TRIMITE EMAIL DACĂ SUNT ALERTE
      // ────────────────────────────────────────────────────────

      if (alerts.length > 0) {
        // Sortare: mai întâi expirate/urgente, apoi după data expirării
        alerts.sort((a, b) => {
          if (a.urgency !== b.urgency) {
            const urgencyOrder = { urgent: 0, warning: 1, info: 2 }
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
          }
          return a.days_left - b.days_left
        })

        const hasUrgent = alerts.some(a => a.urgency === 'urgent')
        const urgentCount = alerts.filter(a => a.urgency === 'urgent').length

        // Subject line dinamic
        let subject = `[SSM] ${org.name} — `
        if (hasUrgent) {
          subject += `🔴 ${urgentCount} URGENT${urgentCount === 1 ? '' : 'E'}`
        } else {
          subject += `${alerts.length} alerte în următoarele 30 zile`
        }

        try {
          const { data: emailResult, error: emailError } = await resend.emails.send({
            from: 'Alerte SSM <alerte@s-s-m.ro>',
            to: [org.contact_email],
            subject: subject,
            html: generateAlertEmail(org.name, alerts),
          })

          if (emailError) {
            console.error(`Email error for ${org.name}:`, emailError)
            results.push({
              org: org.name,
              status: 'email_error',
              error: emailError.message,
              alerts_count: alerts.length,
            })
          } else {
            emailsSent++
            totalAlerts += alerts.length

            // ────────────────────────────────────────────────────
            // 4. LOG ÎN notification_log
            // ────────────────────────────────────────────────────

            const { error: logError } = await supabase
              .from('notification_log')
              .insert({
                organization_id: org.id,
                notification_type: hasUrgent ? 'alert_mm_7d' : 'alert_mm_30d',
                channel: 'email',
                recipient: org.contact_email,
                status: 'sent',
                sent_at: new Date().toISOString(),
                metadata: {
                  subject: subject,
                  total_alerts: alerts.length,
                  urgent_count: urgentCount,
                  medical_count: alerts.filter(a => a.type === 'medical').length,
                  equipment_count: alerts.filter(a => a.type === 'equipment').length,
                  resend_id: emailResult?.id,
                  country_code: org.country_code || 'RO',
                  cron_run_timestamp: new Date().toISOString(),
                },
              })

            if (logError) {
              console.error(`Error logging notification for ${org.name}:`, logError)
            }

            results.push({
              org: org.name,
              country: org.country_code || 'RO',
              status: 'sent',
              alerts: alerts.length,
              urgent: urgentCount,
              resend_id: emailResult?.id,
            })

            console.log(`[CRON] ✓ Email sent to ${org.name} (${alerts.length} alerts)`)
          }
        } catch (emailException) {
          console.error(`Exception sending email to ${org.name}:`, emailException)
          results.push({
            org: org.name,
            status: 'exception',
            error: emailException instanceof Error ? emailException.message : 'Unknown error',
            alerts_count: alerts.length,
          })
        }
      } else {
        results.push({
          org: org.name,
          status: 'no_alerts',
          message: 'No items expiring in 0/7/30 days',
        })
      }
    }

    // ============================================================
    // 5. RETURNARE REZULTAT FINAL
    // ============================================================

    const executionTime = Date.now() - startTime

    console.log(`[CRON] Completed in ${executionTime}ms: ${emailsSent} emails sent, ${totalAlerts} total alerts`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      execution_time_ms: executionTime,
      organizations_checked: organizations.length,
      emails_sent: emailsSent,
      total_alerts: totalAlerts,
      details: results,
    })

  } catch (error) {
    console.error('[CRON] Fatal error:', error)

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
