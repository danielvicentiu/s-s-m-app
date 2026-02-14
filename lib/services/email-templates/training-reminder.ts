// lib/services/email-templates/training-reminder.ts
// Email Template: Training Reminder — Instruire SSM/PSI expiră
// Trimite email personalizat la administratori cu lista angajați cu instruiri care expiră
// Integrare: Resend API
// Data: 14 Februarie 2026

import { Resend } from 'resend'

// ── Types ──

export type TrainingReminderSeverity = 'urgent' | 'warning' | 'reminder'

export interface ExpiringTraining {
  employeeName: string
  trainingType: string
  expiryDate: string
  daysRemaining: number
}

export interface TrainingReminderParams {
  orgId: string
  orgName: string
  adminEmail: string
  adminName: string
  expiringTrainings: ExpiringTraining[]
  severity: TrainingReminderSeverity
  dashboardUrl?: string
}

// ── Severity Config ──

const SEVERITY_CONFIG: Record<
  TrainingReminderSeverity,
  {
    emoji: string
    label: string
    color: string
    bgColor: string
    subjectPrefix: string
  }
> = {
  urgent: {
    emoji: '🚨',
    label: 'URGENT',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    subjectPrefix: '🚨 URGENT'
  },
  warning: {
    emoji: '⚠️',
    label: 'ATENȚIE',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    subjectPrefix: '⚠️ Atenție'
  },
  reminder: {
    emoji: '🔔',
    label: 'REMINDER',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    subjectPrefix: '🔔 Reminder'
  }
}

// ── Subject Line ──

/**
 * Generate subject line based on severity and training count
 */
function generateSubjectLine(
  severity: TrainingReminderSeverity,
  count: number,
  orgName: string
): string {
  const config = SEVERITY_CONFIG[severity]
  const trainingWord = count === 1 ? 'instruire' : 'instruiri'

  return `${config.subjectPrefix}: ${count} ${trainingWord} expiră — ${orgName}`
}

// ── HTML Email Template ──

/**
 * Generate HTML email body for training reminder
 */
function generateHTMLBody(params: TrainingReminderParams): string {
  const config = SEVERITY_CONFIG[params.severity]
  const dashboardUrl = params.dashboardUrl || 'https://app.s-s-m.ro/dashboard/trainings'

  // Sort trainings by days remaining (most urgent first)
  const sortedTrainings = [...params.expiringTrainings].sort(
    (a, b) => a.daysRemaining - b.daysRemaining
  )

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder Instruiri SSM/PSI</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1F2937;
      margin: 0;
      padding: 0;
      background-color: #F9FAFB;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .tagline {
      color: #DBEAFE;
      font-size: 14px;
      margin: 8px 0 0 0;
    }
    .severity-badge {
      display: inline-block;
      padding: 12px 20px;
      background-color: ${config.bgColor};
      color: ${config.color};
      border-radius: 8px;
      font-size: 18px;
      font-weight: 700;
      margin: 24px 0;
      border: 2px solid ${config.color};
    }
    .content {
      padding: 32px 24px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #111827;
    }
    .message {
      font-size: 16px;
      color: #4B5563;
      margin: 0 0 24px 0;
    }
    .stats {
      background-color: #F3F4F6;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .stats-value {
      font-size: 48px;
      font-weight: 700;
      color: ${config.color};
      margin: 0;
    }
    .stats-label {
      font-size: 14px;
      color: #6B7280;
      margin: 8px 0 0 0;
    }
    .table-container {
      margin: 24px 0;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background-color: #F9FAFB;
      color: #374151;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #E5E7EB;
    }
    td {
      padding: 16px 12px;
      font-size: 14px;
      border-bottom: 1px solid #F3F4F6;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover {
      background-color: #F9FAFB;
    }
    .training-type {
      font-weight: 500;
      color: #111827;
    }
    .employee-name {
      color: #4B5563;
    }
    .expiry-date {
      color: #6B7280;
      font-size: 13px;
    }
    .days-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    .days-critical {
      background-color: #FEE2E2;
      color: #DC2626;
    }
    .days-warning {
      background-color: #FEF3C7;
      color: #F59E0B;
    }
    .days-info {
      background-color: #DBEAFE;
      color: #3B82F6;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
      color: #FFFFFF;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }
    .footer {
      background-color: #F9FAFB;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer-text {
      font-size: 13px;
      color: #6B7280;
      margin: 8px 0;
    }
    .footer-link {
      color: #3B82F6;
      text-decoration: none;
    }
    .footer-link:hover {
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .content {
        padding: 24px 16px;
      }
      .stats-value {
        font-size: 36px;
      }
      th, td {
        padding: 10px 8px;
        font-size: 12px;
      }
      .cta-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">s-s-m.ro</h1>
      <p class="tagline">Platformă SSM/PSI Digitală</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Severity Badge -->
      <div style="text-align: center;">
        <div class="severity-badge">
          ${config.emoji} ${config.label}
        </div>
      </div>

      <!-- Greeting -->
      <p class="greeting">Bună ziua, ${params.adminName},</p>

      <!-- Message -->
      <p class="message">
        Ai <strong>${params.expiringTrainings.length}</strong> angajați cu instruiri SSM/PSI care
        ${params.severity === 'urgent' ? 'au expirat sau expiră în următoarele zile' :
          params.severity === 'warning' ? 'expiră în următoarele 15 zile' :
          'expiră în următoarele 30 de zile'}.
      </p>

      <!-- Stats -->
      <div class="stats">
        <p class="stats-value">${params.expiringTrainings.length}</p>
        <p class="stats-label">Instruiri care necesită atenție</p>
      </div>

      <!-- Training Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Angajat</th>
              <th>Tip Instruire</th>
              <th>Data Expirare</th>
              <th>Zile Rămase</th>
            </tr>
          </thead>
          <tbody>
            ${sortedTrainings
              .map(
                (training) => `
              <tr>
                <td class="employee-name">${training.employeeName}</td>
                <td class="training-type">${training.trainingType}</td>
                <td class="expiry-date">${formatDate(training.expiryDate)}</td>
                <td>
                  <span class="days-badge ${getDaysBadgeClass(training.daysRemaining)}">
                    ${training.daysRemaining <= 0
                      ? 'EXPIRAT'
                      : `${training.daysRemaining} ${training.daysRemaining === 1 ? 'zi' : 'zile'}`
                    }
                  </span>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="cta-button">
          📅 Programează Instruiri
        </a>
      </div>

      <!-- Additional Info -->
      <p class="message" style="margin-top: 24px; font-size: 14px;">
        ${params.severity === 'urgent'
          ? '⚠️ <strong>Acțiune imediată necesară!</strong> Angajații cu instruiri expirate nu pot lucra în condiții de siguranță conform legislației SSM.'
          : params.severity === 'warning'
          ? '⏰ <strong>Acționează acum</strong> pentru a evita întreruperile în activitate. Programează instruirile din timp.'
          : '💡 <strong>Planifică din timp</strong> pentru a asigura continuitatea instruirilor și conformitatea cu legislația.'
        }
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        <strong>${params.orgName}</strong>
      </p>
      <p class="footer-text">
        Acest email a fost trimis automat de platforma
        <a href="https://app.s-s-m.ro" class="footer-link">s-s-m.ro</a>
      </p>
      <p class="footer-text">
        Pentru întrebări, contactați-ne la
        <a href="mailto:support@s-s-m.ro" class="footer-link">support@s-s-m.ro</a>
      </p>
      <p class="footer-text" style="margin-top: 16px; font-size: 12px; color: #9CA3AF;">
        © ${new Date().getFullYear()} s-s-m.ro — Toate drepturile rezervate
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// ── Helper Functions ──

/**
 * Get CSS class for days remaining badge based on urgency
 */
function getDaysBadgeClass(daysRemaining: number): string {
  if (daysRemaining <= 0) return 'days-critical'
  if (daysRemaining <= 7) return 'days-critical'
  if (daysRemaining <= 15) return 'days-warning'
  return 'days-info'
}

/**
 * Format date to Romanian format (DD.MM.YYYY)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

/**
 * Generate plain text version of the email
 */
function generatePlainTextBody(params: TrainingReminderParams): string {
  const config = SEVERITY_CONFIG[params.severity]
  const dashboardUrl = params.dashboardUrl || 'https://app.s-s-m.ro/dashboard/trainings'

  const sortedTrainings = [...params.expiringTrainings].sort(
    (a, b) => a.daysRemaining - b.daysRemaining
  )

  return `
${config.emoji} ${config.label}: Instruiri SSM/PSI care expiră

Bună ziua, ${params.adminName},

Ai ${params.expiringTrainings.length} angajați cu instruiri SSM/PSI care ${
    params.severity === 'urgent'
      ? 'au expirat sau expiră în următoarele zile'
      : params.severity === 'warning'
      ? 'expiră în următoarele 15 zile'
      : 'expiră în următoarele 30 de zile'
  }.

LISTA INSTRUIRI:
${sortedTrainings
  .map(
    (t) =>
      `• ${t.employeeName} — ${t.trainingType} — ${formatDate(t.expiryDate)} — ${
        t.daysRemaining <= 0 ? 'EXPIRAT' : `${t.daysRemaining} zile`
      }`
  )
  .join('\n')}

ACȚIUNE NECESARĂ:
Programează instruirile pentru angajații de mai sus pentru a menține conformitatea cu legislația SSM/PSI.

Accesează Dashboard-ul:
${dashboardUrl}

${
  params.severity === 'urgent'
    ? '⚠️ ACȚIUNE IMEDIATĂ NECESARĂ! Angajații cu instruiri expirate nu pot lucra în condiții de siguranță conform legislației SSM.'
    : params.severity === 'warning'
    ? '⏰ Acționează acum pentru a evita întreruperile în activitate. Programează instruirile din timp.'
    : '💡 Planifică din timp pentru a asigura continuitatea instruirilor și conformitatea cu legislația.'
}

---
${params.orgName}
Platformă s-s-m.ro — SSM/PSI Digitală
https://app.s-s-m.ro

Pentru întrebări: support@s-s-m.ro
  `.trim()
}

// ── Main Function: Send Training Reminder Email ──

/**
 * Send training reminder email to organization admin
 *
 * @param params - Training reminder parameters
 * @returns Promise with success status and message ID
 */
export async function sendTrainingReminder(
  params: TrainingReminderParams
): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    // Validate Resend API key
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured in environment')
    }

    // Initialize Resend client
    const resend = new Resend(apiKey)

    // Validate params
    if (!params.adminEmail) {
      throw new Error('Admin email is required')
    }

    if (!params.expiringTrainings || params.expiringTrainings.length === 0) {
      throw new Error('No expiring trainings provided')
    }

    // Generate subject line
    const subject = generateSubjectLine(
      params.severity,
      params.expiringTrainings.length,
      params.orgName
    )

    // Generate email bodies
    const html = generateHTMLBody(params)
    const text = generatePlainTextBody(params)

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 's-s-m.ro <notificari@s-s-m.ro>',
      to: [params.adminEmail],
      subject,
      html,
      text,
      tags: [
        {
          name: 'type',
          value: 'training_reminder'
        },
        {
          name: 'severity',
          value: params.severity
        },
        {
          name: 'org_id',
          value: params.orgId
        }
      ]
    })

    if (error) {
      console.error('[TrainingReminder] Resend API error:', error)
      throw error
    }

    console.log('[TrainingReminder] Email sent successfully', {
      messageId: data?.id,
      recipient: params.adminEmail,
      severity: params.severity,
      trainingCount: params.expiringTrainings.length
    })

    return {
      success: true,
      messageId: data?.id
    }
  } catch (error) {
    console.error('[TrainingReminder] Error sending email:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// ── Batch Send: Multiple Admins ──

/**
 * Send training reminder emails to multiple organization admins
 * Useful for sending reminders to all organizations at once
 *
 * @param reminders - Array of training reminder parameters
 * @returns Promise with results for each email
 */
export async function sendTrainingReminderBatch(
  reminders: TrainingReminderParams[]
): Promise<
  {
    orgId: string
    adminEmail: string
    success: boolean
    messageId?: string
    error?: string
  }[]
> {
  const results = []

  for (const reminder of reminders) {
    const result = await sendTrainingReminder(reminder)

    results.push({
      orgId: reminder.orgId,
      adminEmail: reminder.adminEmail,
      success: result.success,
      messageId: result.messageId,
      error: result.error
    })

    // Add small delay between emails to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return results
}

// ── Export ──

export default sendTrainingReminder
