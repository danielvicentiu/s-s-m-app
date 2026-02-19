// S-S-M.RO — Alert Service
// Cascade: WhatsApp → SMS → Email
// Funcții: sendAlert, checkExpiries, processEscalation, generateMonthlyReport

import { createClient } from '@supabase/supabase-js'
import { sendWhatsApp, sendSMS } from './twilioClient'
import { sendAlertEmail } from '@/lib/email/resend-client'
import {
  ALERT_TEMPLATES,
  generateExpiryAlertEmailHtml,
  generateMonthlyReportEmailHtml,
} from './messageTemplates'

// ─── Types ───────────────────────────────────────────────────────────────────

export type AlertType =
  | 'training_expiry'
  | 'medical_expiry'
  | 'psi_expiry'
  | 'iscir_expiry'
  | 'monthly_report'
  | 'escalation'
  | 'compliance_warning'

export type AlertChannel = 'whatsapp' | 'sms' | 'email'

export interface AlertConfig {
  whatsapp_enabled: boolean
  sms_enabled: boolean
  email_enabled: boolean
  alert_days: number[]
  escalation_enabled: boolean
  escalation_after_hours: number
  escalation_contact_name: string | null
  escalation_contact_phone: string | null
  escalation_contact_email: string | null
  monthly_report_enabled: boolean
  monthly_report_day: number
}

export interface SendAlertParams {
  organizationId: string
  orgName: string
  alertType: AlertType
  recipientName?: string
  recipientPhone?: string
  recipientEmail?: string
  entityName: string
  entityType?: string
  entityId?: string
  expiryDate?: string
  daysUntilExpiry?: number
  config: AlertConfig
}

export interface ExpiryItem {
  type: AlertType
  entityId: string
  entityName: string
  entityType: string
  expiryDate: string
  daysUntilExpiry: number
  recipientName?: string
  recipientPhone?: string
  recipientEmail?: string
}

// ─── Supabase client (service role, bypass RLS) ───────────────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.s-s-m.ro'

// ─── sendAlert — Cascade WhatsApp → SMS → Email ──────────────────────────────

export async function sendAlert(params: SendAlertParams): Promise<void> {
  const {
    organizationId,
    orgName,
    alertType,
    recipientName,
    recipientPhone,
    recipientEmail,
    entityName,
    entityType,
    entityId,
    expiryDate,
    daysUntilExpiry,
    config,
  } = params

  const supabase = getSupabase()
  const link = `${APP_URL}/dashboard/alerts`
  const expiryDateStr = expiryDate
    ? new Date(expiryDate).toLocaleDateString('ro-RO')
    : 'N/A'

  let channelUsed: AlertChannel | null = null
  let messageContent = ''
  let twilioSid: string | undefined
  let deliveryStatus: string = 'queued'

  // 1. Încearcă WhatsApp
  if (config.whatsapp_enabled && recipientPhone) {
    let waMessage = ''

    if (alertType === 'training_expiry') {
      waMessage = ALERT_TEMPLATES.training_expiry.whatsapp(
        orgName, entityName, recipientName || '', expiryDateStr, link
      )
    } else if (alertType === 'medical_expiry') {
      waMessage = ALERT_TEMPLATES.medical_expiry.whatsapp(
        orgName, recipientName || entityName, expiryDateStr, link
      )
    } else if (alertType === 'psi_expiry') {
      waMessage = ALERT_TEMPLATES.psi_expiry.whatsapp(
        orgName, entityName, expiryDateStr, link
      )
    } else if (alertType === 'iscir_expiry') {
      waMessage = ALERT_TEMPLATES.iscir_expiry.whatsapp(
        orgName, entityName, expiryDateStr, link
      )
    }

    if (waMessage) {
      const result = await sendWhatsApp(recipientPhone, waMessage)
      if (result.success) {
        channelUsed = 'whatsapp'
        messageContent = waMessage
        twilioSid = result.sid
        deliveryStatus = 'sent'
      }
    }
  }

  // 2. Fallback la SMS dacă WhatsApp a eșuat
  if (!channelUsed && config.sms_enabled && recipientPhone) {
    let smsMessage = ''

    if (alertType === 'training_expiry') {
      smsMessage = ALERT_TEMPLATES.training_expiry.sms(
        orgName, entityName, recipientName || '', expiryDateStr
      )
    } else if (alertType === 'medical_expiry') {
      smsMessage = ALERT_TEMPLATES.medical_expiry.sms(
        orgName, recipientName || entityName, expiryDateStr
      )
    } else if (alertType === 'psi_expiry') {
      smsMessage = ALERT_TEMPLATES.psi_expiry.sms(orgName, entityName, expiryDateStr)
    } else if (alertType === 'iscir_expiry') {
      smsMessage = ALERT_TEMPLATES.iscir_expiry.sms(orgName, entityName, expiryDateStr)
    }

    if (smsMessage) {
      const result = await sendSMS(recipientPhone, smsMessage)
      if (result.success) {
        channelUsed = 'sms'
        messageContent = smsMessage
        twilioSid = result.sid
        deliveryStatus = 'sent'
      }
    }
  }

  // 3. Fallback la Email (sau dacă email_enabled și nu s-a trimis nimic)
  if (!channelUsed && config.email_enabled && recipientEmail) {
    let subject = ''
    const html = generateExpiryAlertEmailHtml({
      orgName,
      alertType,
      entityName,
      expiryDate: expiryDateStr,
      daysUntilExpiry: daysUntilExpiry ?? 0,
      link,
    })

    if (alertType === 'training_expiry') {
      subject = ALERT_TEMPLATES.training_expiry.email_subject(
        entityName, recipientName || ''
      )
    } else if (alertType === 'medical_expiry') {
      subject = ALERT_TEMPLATES.medical_expiry.email_subject(
        recipientName || entityName
      )
    } else if (alertType === 'psi_expiry') {
      subject = ALERT_TEMPLATES.psi_expiry.email_subject(entityName)
    } else if (alertType === 'iscir_expiry') {
      subject = ALERT_TEMPLATES.iscir_expiry.email_subject(entityName)
    } else {
      subject = `[SSM] Alertă ${alertType} — ${orgName}`
    }

    messageContent = subject
    const result = await sendAlertEmail({ to: recipientEmail, subject, html })
    if (result.success) {
      channelUsed = 'email'
      deliveryStatus = 'sent'
    } else {
      channelUsed = 'email'
      deliveryStatus = 'failed'
    }
  }

  // 4. Log în alert_logs
  if (channelUsed) {
    await supabase.from('alert_logs').insert({
      organization_id: organizationId,
      alert_type: alertType,
      channel: channelUsed,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      recipient_email: recipientEmail,
      message_content: messageContent,
      related_entity_type: entityType,
      related_entity_id: entityId,
      expiry_date: expiryDate,
      days_until_expiry: daysUntilExpiry,
      twilio_message_sid: twilioSid,
      delivery_status: deliveryStatus,
      delivery_updated_at: new Date().toISOString(),
    })

    // 5. Actualizează alert_usage
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const monthStr = monthStart.toISOString().split('T')[0]

    const costPerChannel: Record<AlertChannel, number> = {
      whatsapp: 0.05,
      sms: 0.05,
      email: 0.001,
    }

    await supabase.rpc('increment_alert_usage', {
      p_org_id: organizationId,
      p_month: monthStr,
      p_channel: channelUsed,
      p_cost: costPerChannel[channelUsed],
    }).then(({ error }) => {
      if (error) {
        // Fallback manual upsert dacă RPC nu există
        return supabase.from('alert_usage').upsert(
          {
            organization_id: organizationId,
            month: monthStr,
            [`${channelUsed}_count`]: 1,
            total_cost_eur: costPerChannel[channelUsed],
          },
          { onConflict: 'organization_id,month', ignoreDuplicates: false }
        )
      }
    })
  }
}

// ─── checkExpiries — Găsește toate elementele care expiră ────────────────────

export async function checkExpiries(
  organizationId: string,
  alertDays: number[] = [30, 14, 7, 1]
): Promise<ExpiryItem[]> {
  const supabase = getSupabase()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDays = Math.max(...alertDays)

  const cutoff = new Date(today)
  cutoff.setDate(today.getDate() + maxDays)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const items: ExpiryItem[] = []

  function daysUntil(dateStr: string): number {
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  function isAlertDay(days: number): boolean {
    return alertDays.includes(days) || days <= 0
  }

  // 1. Instruiri (training_sessions)
  try {
    const { data: trainings } = await supabase
      .from('training_sessions')
      .select('id, training_type, expiry_date, employee_id, employees(full_name)')
      .eq('organization_id', organizationId)
      .lte('expiry_date', cutoffStr)
      .order('expiry_date', { ascending: true })

    if (trainings) {
      for (const t of trainings) {
        const days = daysUntil(t.expiry_date)
        if (isAlertDay(days)) {
          const emp = Array.isArray(t.employees) ? t.employees[0] : t.employees
          items.push({
            type: 'training_expiry',
            entityId: t.id,
            entityName: t.training_type || 'Instruire',
            entityType: 'training_session',
            expiryDate: t.expiry_date,
            daysUntilExpiry: days,
            recipientName: emp?.full_name,
          })
        }
      }
    }
  } catch (err) {
    console.error('[checkExpiries] training_sessions error:', err)
  }

  // 2. Examene medicale
  try {
    const { data: medicals } = await supabase
      .from('medical_examinations')
      .select('id, employee_name, expiry_date, examination_type')
      .eq('organization_id', organizationId)
      .lte('expiry_date', cutoffStr)
      .order('expiry_date', { ascending: true })

    if (medicals) {
      for (const m of medicals) {
        const days = daysUntil(m.expiry_date)
        if (isAlertDay(days)) {
          items.push({
            type: 'medical_expiry',
            entityId: m.id,
            entityName: m.employee_name || 'Angajat',
            entityType: 'employee',
            expiryDate: m.expiry_date,
            daysUntilExpiry: days,
            recipientName: m.employee_name,
          })
        }
      }
    }
  } catch (err) {
    console.error('[checkExpiries] medical_examinations error:', err)
  }

  // 3. Echipamente PSI
  try {
    const { data: psiEquip } = await supabase
      .from('psi_equipment')
      .select('id, name, next_inspection_date, location')
      .eq('organization_id', organizationId)
      .lte('next_inspection_date', cutoffStr)
      .order('next_inspection_date', { ascending: true })

    if (psiEquip) {
      for (const p of psiEquip) {
        const days = daysUntil(p.next_inspection_date)
        if (isAlertDay(days)) {
          items.push({
            type: 'psi_expiry',
            entityId: p.id,
            entityName: p.name || 'Echipament PSI',
            entityType: 'psi_equipment',
            expiryDate: p.next_inspection_date,
            daysUntilExpiry: days,
          })
        }
      }
    }
  } catch (err) {
    console.error('[checkExpiries] psi_equipment error:', err)
  }

  // 4. Echipamente ISCIR (dacă tabela există)
  try {
    const { data: iscirEquip } = await supabase
      .from('iscir_equipment')
      .select('id, equipment_name, next_verification_date')
      .eq('organization_id', organizationId)
      .lte('next_verification_date', cutoffStr)
      .order('next_verification_date', { ascending: true })

    if (iscirEquip) {
      for (const i of iscirEquip) {
        const days = daysUntil(i.next_verification_date)
        if (isAlertDay(days)) {
          items.push({
            type: 'iscir_expiry',
            entityId: i.id,
            entityName: i.equipment_name || 'Echipament ISCIR',
            entityType: 'iscir_equipment',
            expiryDate: i.next_verification_date,
            daysUntilExpiry: days,
          })
        }
      }
    }
  } catch (err) {
    // ISCIR poate să nu existe — ignorăm silențios
    console.log('[checkExpiries] iscir_equipment not available or error:', err)
  }

  return items
}

// ─── processEscalation — Trimite alerte neconfirmate la contact escaladare ────

export async function processEscalation(): Promise<void> {
  const supabase = getSupabase()

  // Fetch organizații cu escalation activat
  const { data: configs } = await supabase
    .from('alert_configurations')
    .select('*, organizations(id, name, contact_email)')
    .eq('escalation_enabled', true)

  if (!configs || configs.length === 0) return

  for (const config of configs) {
    const org = Array.isArray(config.organizations)
      ? config.organizations[0]
      : config.organizations

    if (!org) continue

    const hoursAgo = new Date()
    hoursAgo.setHours(hoursAgo.getHours() - (config.escalation_after_hours || 48))

    // Găsește alertele neconfirmate mai vechi de N ore
    const { data: unacked } = await supabase
      .from('alert_logs')
      .select('id, alert_type, recipient_name, message_content, created_at')
      .eq('organization_id', config.organization_id)
      .eq('acknowledged', false)
      .eq('is_escalation', false)
      .lte('created_at', hoursAgo.toISOString())

    if (!unacked || unacked.length === 0) continue

    const count = unacked.length
    const link = `${APP_URL}/dashboard/alerts`

    // Trimite escaladare
    const escalationConfig: AlertConfig = {
      whatsapp_enabled: config.whatsapp_enabled && !!config.escalation_contact_phone,
      sms_enabled: config.sms_enabled && !!config.escalation_contact_phone,
      email_enabled: config.email_enabled && !!config.escalation_contact_email,
      alert_days: config.alert_days || [30, 14, 7, 1],
      escalation_enabled: false,
      escalation_after_hours: config.escalation_after_hours,
      escalation_contact_name: config.escalation_contact_name,
      escalation_contact_phone: config.escalation_contact_phone,
      escalation_contact_email: config.escalation_contact_email,
      monthly_report_enabled: config.monthly_report_enabled,
      monthly_report_day: config.monthly_report_day,
    }

    // Trimite WhatsApp/SMS la contact escaladare
    if (escalationConfig.whatsapp_enabled && config.escalation_contact_phone) {
      const msg = ALERT_TEMPLATES.escalation.whatsapp(org.name, count, link)
      const result = await sendWhatsApp(config.escalation_contact_phone, msg)

      await supabase.from('alert_logs').insert({
        organization_id: config.organization_id,
        alert_type: 'escalation',
        channel: 'whatsapp',
        recipient_name: config.escalation_contact_name,
        recipient_phone: config.escalation_contact_phone,
        message_content: msg,
        twilio_message_sid: result.sid,
        delivery_status: result.success ? 'sent' : 'failed',
        is_escalation: true,
        delivery_updated_at: new Date().toISOString(),
      })
    } else if (escalationConfig.sms_enabled && config.escalation_contact_phone) {
      const msg = ALERT_TEMPLATES.escalation.sms(org.name, count)
      const result = await sendSMS(config.escalation_contact_phone, msg)

      await supabase.from('alert_logs').insert({
        organization_id: config.organization_id,
        alert_type: 'escalation',
        channel: 'sms',
        recipient_name: config.escalation_contact_name,
        recipient_phone: config.escalation_contact_phone,
        message_content: msg,
        twilio_message_sid: result.sid,
        delivery_status: result.success ? 'sent' : 'failed',
        is_escalation: true,
        delivery_updated_at: new Date().toISOString(),
      })
    } else if (escalationConfig.email_enabled && config.escalation_contact_email) {
      const subject = ALERT_TEMPLATES.escalation.email_subject(org.name)
      const html = `<p>Există <strong>${count} alerte neconfirmate</strong> de peste ${config.escalation_after_hours} ore pentru <strong>${org.name}</strong>.</p><p><a href="${link}">Accesați platforma</a></p>`

      await sendAlertEmail({
        to: config.escalation_contact_email,
        subject,
        html,
      })

      await supabase.from('alert_logs').insert({
        organization_id: config.organization_id,
        alert_type: 'escalation',
        channel: 'email',
        recipient_name: config.escalation_contact_name,
        recipient_email: config.escalation_contact_email,
        message_content: subject,
        delivery_status: 'sent',
        is_escalation: true,
        delivery_updated_at: new Date().toISOString(),
      })
    }
  }
}

// ─── generateMonthlyReport — Raport lunar pentru o organizație ──────────────

export async function generateMonthlyReport(organizationId: string): Promise<void> {
  const supabase = getSupabase()

  // Fetch config
  const { data: config } = await supabase
    .from('alert_configurations')
    .select('*, organizations(id, name, contact_email)')
    .eq('organization_id', organizationId)
    .single()

  if (!config || !config.monthly_report_enabled) return

  const org = Array.isArray(config.organizations)
    ? config.organizations[0]
    : config.organizations

  if (!org) return

  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const nextMonthStr = nextMonth.toISOString().split('T')[0]

  // Numără elemente care expiră luna viitoare
  let trainings = 0
  let medical = 0
  let equipment = 0

  try {
    const { count: tc } = await supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('expiry_date', today.toISOString().split('T')[0])
      .lt('expiry_date', nextMonthStr)
    trainings = tc || 0
  } catch (_) {}

  try {
    const { count: mc } = await supabase
      .from('medical_examinations')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('expiry_date', today.toISOString().split('T')[0])
      .lt('expiry_date', nextMonthStr)
    medical = mc || 0
  } catch (_) {}

  try {
    const { count: pc } = await supabase
      .from('psi_equipment')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('next_inspection_date', today.toISOString().split('T')[0])
      .lt('next_inspection_date', nextMonthStr)
    equipment = pc || 0
  } catch (_) {}

  const monthName = today.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })
  const link = `${APP_URL}/dashboard/alerts`

  const alertConfig: AlertConfig = {
    whatsapp_enabled: config.whatsapp_enabled,
    sms_enabled: config.sms_enabled,
    email_enabled: config.email_enabled,
    alert_days: config.alert_days || [30, 14, 7, 1],
    escalation_enabled: false,
    escalation_after_hours: config.escalation_after_hours,
    escalation_contact_name: config.escalation_contact_name,
    escalation_contact_phone: config.escalation_contact_phone,
    escalation_contact_email: config.escalation_contact_email,
    monthly_report_enabled: config.monthly_report_enabled,
    monthly_report_day: config.monthly_report_day,
  }

  const contactEmail = org.contact_email

  // Trimitere cascade
  let channelUsed: AlertChannel | null = null
  let messageContent = ''

  if (alertConfig.whatsapp_enabled) {
    // Folosim contactul de escaladare sau emailul org (fără telefon specific în org)
    const phone = config.escalation_contact_phone
    if (phone) {
      const msg = ALERT_TEMPLATES.monthly_report.whatsapp(
        org.name, trainings, medical, equipment, link
      )
      const result = await sendWhatsApp(phone, msg)
      if (result.success) {
        channelUsed = 'whatsapp'
        messageContent = msg
      }
    }
  }

  if (!channelUsed && alertConfig.sms_enabled) {
    const phone = config.escalation_contact_phone
    if (phone) {
      const msg = ALERT_TEMPLATES.monthly_report.sms(org.name, trainings, medical, equipment)
      const result = await sendSMS(phone, msg)
      if (result.success) {
        channelUsed = 'sms'
        messageContent = msg
      }
    }
  }

  if (!channelUsed && alertConfig.email_enabled && contactEmail) {
    const subject = ALERT_TEMPLATES.monthly_report.email_subject(org.name, monthName)
    const html = generateMonthlyReportEmailHtml({
      orgName: org.name,
      month: monthName,
      trainings,
      medical,
      equipment,
      link,
    })
    messageContent = subject
    await sendAlertEmail({ to: contactEmail, subject, html })
    channelUsed = 'email'
  }

  if (channelUsed) {
    await supabase.from('alert_logs').insert({
      organization_id: organizationId,
      alert_type: 'monthly_report',
      channel: channelUsed,
      recipient_email: contactEmail,
      message_content: messageContent,
      delivery_status: 'sent',
      delivery_updated_at: new Date().toISOString(),
    })
  }
}
