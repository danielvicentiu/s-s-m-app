// S-S-M.RO — Alert Sender Logic
// Logica de citire expirări și trimitere alerte email

import { createSupabaseServer } from '@/lib/supabase/server'
import { sendAlertEmail } from './resend-client'
import { generateExpiryAlertHtml, ExpiryItem, AlertEmailData } from './alert-templates'

export interface AlertEmailResult {
  sent: boolean
  recipients: number
  expiredItems: number
  error?: string
  organizationName?: string
}

export interface BulkAlertResult {
  totalOrganizations: number
  successfulAlerts: number
  failedAlerts: number
  totalExpiries: number
  errors: Array<{ organizationId: string; error: string }>
}

/**
 * Calculează zilele rămase până la expirare
 */
function calculateDaysRemaining(expiryDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Formatează data în format românesc
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Citește fișele medicale expirate/în expirare pentru o organizație
 */
async function getMedicalExpiries(
  supabase: any,
  organizationId: string
): Promise<ExpiryItem[]> {
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

  const { data, error } = await supabase
    .from('medical_examinations')
    .select('id, employee_name, examination_type, expiry_date')
    .eq('organization_id', organizationId)
    .lte('expiry_date', threeMonthsFromNow.toISOString().split('T')[0])
    .order('expiry_date', { ascending: true })

  if (error) {
    console.error('Error fetching medical expiries:', error)
    return []
  }

  return (data || []).map((item: any) => ({
    type: 'medical' as const,
    identifier: item.employee_name,
    category: item.examination_type,
    expiryDate: formatDate(item.expiry_date),
    daysRemaining: calculateDaysRemaining(item.expiry_date),
  }))
}

/**
 * Citește echipamentele PSI expirate/în expirare pentru o organizație
 */
async function getPsiExpiries(
  supabase: any,
  organizationId: string
): Promise<ExpiryItem[]> {
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

  const { data, error } = await supabase
    .from('psi_equipment')
    .select('id, identifier, equipment_type, next_inspection_date')
    .eq('organization_id', organizationId)
    .lte('next_inspection_date', threeMonthsFromNow.toISOString().split('T')[0])
    .order('next_inspection_date', { ascending: true })

  if (error) {
    console.error('Error fetching PSI expiries:', error)
    return []
  }

  return (data || []).map((item: any) => ({
    type: 'psi' as const,
    identifier: item.identifier,
    category: item.equipment_type,
    expiryDate: formatDate(item.next_inspection_date),
    daysRemaining: calculateDaysRemaining(item.next_inspection_date),
  }))
}

/**
 * Citește echipamentele ISCIR expirate/în expirare pentru o organizație
 */
async function getIscirExpiries(
  supabase: any,
  organizationId: string
): Promise<ExpiryItem[]> {
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

  const { data, error } = await supabase
    .from('iscir_equipment')
    .select('id, identifier, equipment_type, next_verification_date')
    .eq('organization_id', organizationId)
    .lte('next_verification_date', threeMonthsFromNow.toISOString().split('T')[0])
    .order('next_verification_date', { ascending: true })

  if (error) {
    console.error('Error fetching ISCIR expiries:', error)
    return []
  }

  return (data || []).map((item: any) => ({
    type: 'iscir' as const,
    identifier: item.identifier,
    category: item.equipment_type,
    expiryDate: formatDate(item.next_verification_date),
    daysRemaining: calculateDaysRemaining(item.next_verification_date),
  }))
}

/**
 * Găsește email-urile consultanților pentru o organizație
 */
async function getConsultantEmails(
  supabase: any,
  organizationId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('memberships')
    .select(`
      user_id,
      profiles!inner (
        id,
        full_name
      )
    `)
    .eq('organization_id', organizationId)
    .eq('role', 'consultant')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching consultant memberships:', error)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  // Extragem user_ids și căutăm emailurile din auth.users
  const userIds = data.map((m: any) => m.user_id)

  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('Error fetching auth users:', authError)
    return []
  }

  const emails = authUsers.users
    .filter((user: any) => userIds.includes(user.id))
    .map((user: any) => user.email)
    .filter((email: string | undefined): email is string => !!email)

  return emails
}

/**
 * Trimite alerte pentru o organizație specifică
 */
export async function sendOrganizationAlerts(
  organizationId: string
): Promise<AlertEmailResult> {
  try {
    const supabase = await createSupabaseServer()

    // Citim numele organizației
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return {
        sent: false,
        recipients: 0,
        expiredItems: 0,
        error: 'Organization not found',
      }
    }

    // Citim expirările din toate tabelele
    const [medicalExpiries, psiExpiries, iscirExpiries] = await Promise.all([
      getMedicalExpiries(supabase, organizationId),
      getPsiExpiries(supabase, organizationId),
      getIscirExpiries(supabase, organizationId),
    ])

    const totalExpiries = medicalExpiries.length + psiExpiries.length + iscirExpiries.length

    // Dacă nu sunt expirări, nu trimitem email
    if (totalExpiries === 0) {
      return {
        sent: false,
        recipients: 0,
        expiredItems: 0,
        organizationName: org.name,
      }
    }

    // Găsim consultanții
    const consultantEmails = await getConsultantEmails(supabase, organizationId)

    if (consultantEmails.length === 0) {
      return {
        sent: false,
        recipients: 0,
        expiredItems: totalExpiries,
        error: 'No consultant emails found',
        organizationName: org.name,
      }
    }

    // Generăm HTML-ul emailului
    const emailData: AlertEmailData = {
      organizationName: org.name,
      medicalExpiries,
      psiExpiries,
      iscirExpiries,
      dashboardUrl: 'https://app.s-s-m.ro/dashboard',
    }

    const html = generateExpiryAlertHtml(emailData)

    // Trimitem emailul
    const result = await sendAlertEmail({
      to: consultantEmails,
      subject: `🔔 Alerte Expirări - ${org.name} (${totalExpiries} items)`,
      html,
    })

    if (!result.success) {
      return {
        sent: false,
        recipients: consultantEmails.length,
        expiredItems: totalExpiries,
        error: result.error,
        organizationName: org.name,
      }
    }

    // Log în batch_jobs
    await supabase.from('batch_jobs').insert({
      organization_id: organizationId,
      job_type: 'alert_email',
      status: 'completed',
      results: {
        recipients: consultantEmails.length,
        expiredItems: totalExpiries,
        messageId: result.messageId,
      },
    })

    return {
      sent: true,
      recipients: consultantEmails.length,
      expiredItems: totalExpiries,
      organizationName: org.name,
    }
  } catch (error) {
    console.error('Error sending organization alerts:', error)
    return {
      sent: false,
      recipients: 0,
      expiredItems: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Trimite alerte pentru toate organizațiile
 */
export async function sendAllOrganizationAlerts(): Promise<BulkAlertResult> {
  const supabase = await createSupabaseServer()

  // Citim toate organizațiile
  const { data: organizations, error } = await supabase
    .from('organizations')
    .select('id, name')
    .order('name')

  if (error || !organizations) {
    console.error('Error fetching organizations:', error)
    return {
      totalOrganizations: 0,
      successfulAlerts: 0,
      failedAlerts: 0,
      totalExpiries: 0,
      errors: [],
    }
  }

  const result: BulkAlertResult = {
    totalOrganizations: organizations.length,
    successfulAlerts: 0,
    failedAlerts: 0,
    totalExpiries: 0,
    errors: [],
  }

  // Procesăm fiecare organizație secvențial cu pauză (rate limit)
  for (const org of organizations) {
    try {
      const alertResult = await sendOrganizationAlerts(org.id)

      if (alertResult.sent) {
        result.successfulAlerts++
        result.totalExpiries += alertResult.expiredItems
      } else if (alertResult.expiredItems > 0) {
        // Avea expirări dar nu s-a trimis (ex: fără consultanți)
        result.failedAlerts++
        result.errors.push({
          organizationId: org.id,
          error: alertResult.error || 'No consultants found',
        })
      }

      // Pauză de 1 secundă între emailuri (rate limit Resend)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      result.failedAlerts++
      result.errors.push({
        organizationId: org.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // Log rezultatul general în batch_jobs
  await supabase.from('batch_jobs').insert({
    organization_id: null,
    job_type: 'bulk_alert_emails',
    status: 'completed',
    results: result,
  })

  return result
}
