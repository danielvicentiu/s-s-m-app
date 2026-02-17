/**
 * lib/email/alert-sender.ts
 * Logica centrală pentru trimitere emailuri de alertă folosind Resend
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import { getResendClient } from './resend-client';
import {
  generateAlertEmailHtml,
  generateAlertEmailSubject,
  generateAlertEmailText,
  type AlertEmailData,
} from './alert-templates';

export interface AlertRecord {
  id: string;
  alert_type: 'medical' | 'equipment' | 'training' | 'document' | 'other';
  title: string;
  description: string;
  expiry_date?: string;
  employee_name?: string;
  item_name?: string;
  organization_id: string;
  organization_name?: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  email_sent_at?: string;
}

export interface SendAlertEmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

/**
 * Trimite email pentru o singură alertă
 */
export async function sendAlertEmail(
  alert: AlertRecord
): Promise<SendAlertEmailResult> {
  try {
    const resend = getResendClient();
    
    if (!alert.user_email) {
      return {
        success: false,
        error: 'Adresa de email lipsește',
      };
    }

    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.s-s-m.ro'}/dashboard/alerts`;

    const emailData: AlertEmailData = {
      recipientName: alert.user_name || 'Utilizator',
      alertType: alert.alert_type,
      alertTitle: alert.title,
      alertDescription: alert.description,
      expiryDate: alert.expiry_date,
      employeeName: alert.employee_name,
      itemName: alert.item_name,
      organizationName: alert.organization_name || 'Organizația dumneavoastră',
      dashboardUrl: dashboardUrl,
    };

    const subject = generateAlertEmailSubject(alert.alert_type, alert.title);
    const html = generateAlertEmailHtml(emailData);
    const text = generateAlertEmailText(emailData);

    const result = await resend.emails.send({
      from: 'SSM Alerts <alerts@s-s-m.ro>',
      to: alert.user_email,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error('[sendAlertEmail] Resend error:', result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    await markAlertAsSent(alert.id);

    return {
      success: true,
      emailId: result.data?.id,
    };
  } catch (error) {
    console.error('[sendAlertEmail] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Marchează alertă ca trimisă în baza de date
 */
async function markAlertAsSent(alertId: string): Promise<void> {
  try {
    const supabase = await createSupabaseServer();
    
    const { error } = await supabase
      .from('alerts')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('id', alertId);

    if (error) {
      console.error('[markAlertAsSent] Error:', error);
    }
  } catch (error) {
    console.error('[markAlertAsSent] Exception:', error);
  }
}

/**
 * Citește alerte nesolicitate din baza de date și le trimite
 */
export async function sendPendingAlerts(): Promise<{
  total: number;
  sent: number;
  failed: number;
  results: Array<{ alertId: string; success: boolean; error?: string }>;
}> {
  const supabase = await createSupabaseServer();

  const { data: alerts, error } = await supabase
    .from('alerts')
    .select(`
      id,
      alert_type,
      title,
      description,
      expiry_date,
      employee_name,
      item_name,
      organization_id,
      user_id,
      email_sent_at,
      organizations!inner(name),
      profiles!inner(email, full_name)
    `)
    .is('email_sent_at', null)
    .eq('status', 'active')
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) {
    console.error('[sendPendingAlerts] DB error:', error);
    return { total: 0, sent: 0, failed: 0, results: [] };
  }

  if (!alerts || alerts.length === 0) {
    return { total: 0, sent: 0, failed: 0, results: [] };
  }

  const results: Array<{ alertId: string; success: boolean; error?: string }> = [];
  let sent = 0;
  let failed = 0;

  for (const alert of alerts) {
    const alertRecord: AlertRecord = {
      id: alert.id,
      alert_type: alert.alert_type,
      title: alert.title,
      description: alert.description,
      expiry_date: alert.expiry_date,
      employee_name: alert.employee_name,
      item_name: alert.item_name,
      organization_id: alert.organization_id,
      organization_name: (alert.organizations as any)?.name,
      user_id: alert.user_id,
      user_email: (alert.profiles as any)?.email,
      user_name: (alert.profiles as any)?.full_name,
      email_sent_at: alert.email_sent_at,
    };

    const result = await sendAlertEmail(alertRecord);
    
    results.push({
      alertId: alert.id,
      success: result.success,
      error: result.error,
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return {
    total: alerts.length,
    sent,
    failed,
    results,
  };
}
