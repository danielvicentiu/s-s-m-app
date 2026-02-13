// Supabase Edge Function: Daily Alert Digest
// Colectează alerte noi din ultimele 24h, grupează per severity, trimite email via Resend
// Deploy: supabase functions deploy alert-digest
// Scheduled: Configurați cron job să ruleze zilnic (ex: 08:00 UTC)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

// Types
interface AlertDigestRequest {
  org_id: string;
}

interface AlertData {
  id: string;
  organization_id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical' | 'expired';
  title: string;
  description: string | null;
  entity_type: string | null;
  entity_id: string | null;
  expiry_date: string | null;
  days_until_expiry: number | null;
  created_at: string;
}

interface GroupedAlerts {
  critical: AlertData[];
  expired: AlertData[];
  warning: AlertData[];
  info: AlertData[];
}

interface ResendResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

// Severitate în ordine de prioritate
const SEVERITY_ORDER: Array<'critical' | 'expired' | 'warning' | 'info'> = [
  'critical',
  'expired',
  'warning',
  'info'
];

const SEVERITY_LABELS: Record<string, { ro: string; emoji: string; color: string }> = {
  critical: { ro: 'Criticas', emoji: '🔴', color: '#DC2626' },
  expired: { ro: 'Expirate', emoji: '⛔', color: '#991B1B' },
  warning: { ro: 'Atenționări', emoji: '⚠️', color: '#F59E0B' },
  info: { ro: 'Informări', emoji: 'ℹ️', color: '#3B82F6' },
};

/**
 * Colectează toate alertele noi din ultimele 24h pentru o organizație
 */
async function collectAlerts(
  supabase: any,
  orgId: string
): Promise<AlertData[]> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('v_active_alerts')
    .select('*')
    .eq('organization_id', orgId)
    .gte('created_at', twentyFourHoursAgo)
    .order('severity', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching alerts:', error);
    throw new Error(`Failed to fetch alerts: ${error.message}`);
  }

  return data || [];
}

/**
 * Grupează alertele după severity
 */
function groupAlertsBySeverity(alerts: AlertData[]): GroupedAlerts {
  return {
    critical: alerts.filter(a => a.severity === 'critical'),
    expired: alerts.filter(a => a.severity === 'expired'),
    warning: alerts.filter(a => a.severity === 'warning'),
    info: alerts.filter(a => a.severity === 'info'),
  };
}

/**
 * Generează HTML pentru un alert
 */
function generateAlertHTML(alert: AlertData): string {
  const severityInfo = SEVERITY_LABELS[alert.severity];
  const daysText = alert.days_until_expiry !== null
    ? `<span style="color: #6B7280;">Expire peste ${alert.days_until_expiry} zile</span>`
    : '';

  return `
    <div style="margin-bottom: 16px; padding: 12px; background-color: #F9FAFB; border-left: 4px solid ${severityInfo.color}; border-radius: 4px;">
      <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">
        ${alert.title}
      </div>
      ${alert.description ? `<div style="color: #4B5563; font-size: 14px; margin-bottom: 4px;">${alert.description}</div>` : ''}
      ${alert.expiry_date ? `<div style="color: #6B7280; font-size: 13px;">Data expirare: ${new Date(alert.expiry_date).toLocaleDateString('ro-RO')}</div>` : ''}
      ${daysText}
      ${alert.entity_type ? `<div style="color: #9CA3AF; font-size: 12px; margin-top: 4px;">Tip: ${alert.entity_type}</div>` : ''}
    </div>
  `;
}

/**
 * Generează secțiunea HTML pentru un grup de alerte
 */
function generateSeveritySectionHTML(
  severity: 'critical' | 'expired' | 'warning' | 'info',
  alerts: AlertData[]
): string {
  if (alerts.length === 0) return '';

  const severityInfo = SEVERITY_LABELS[severity];

  return `
    <div style="margin-bottom: 32px;">
      <h2 style="color: ${severityInfo.color}; font-size: 18px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center;">
        <span style="margin-right: 8px;">${severityInfo.emoji}</span>
        ${severityInfo.ro} (${alerts.length})
      </h2>
      ${alerts.map(alert => generateAlertHTML(alert)).join('')}
    </div>
  `;
}

/**
 * Generează emailul HTML complet cu toate alertele grupate
 */
function generateEmailHTML(
  groupedAlerts: GroupedAlerts,
  orgName: string,
  totalCount: number
): string {
  const sections = SEVERITY_ORDER
    .map(severity => generateSeveritySectionHTML(severity, groupedAlerts[severity]))
    .filter(section => section !== '')
    .join('');

  const now = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport Zilnic Alerte SSM/PSI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">
        📊 Raport Zilnic Alerte
      </h1>
      <p style="margin: 8px 0 0 0; color: #BFDBFE; font-size: 14px;">
        ${now}
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px;">

      <!-- Summary -->
      <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 16px; margin-bottom: 32px;">
        <div style="font-size: 14px; color: #1E40AF; margin-bottom: 4px;">
          <strong>${orgName}</strong>
        </div>
        <div style="font-size: 16px; color: #1E3A8A; font-weight: 600;">
          ${totalCount} ${totalCount === 1 ? 'alertă nouă' : 'alerte noi'} în ultimele 24 ore
        </div>
      </div>

      <!-- Alert Sections -->
      ${sections}

      <!-- Footer CTA -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB; text-align: center;">
        <a href="https://app.s-s-m.ro/ro/dashboard/alerts"
           style="display: inline-block; background-color: #2563EB; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Vizualizează toate alertele →
        </a>
      </div>

    </div>

    <!-- Email Footer -->
    <div style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
      <p style="margin: 0; color: #6B7280; font-size: 13px;">
        Acest email a fost generat automat de platforma <strong>S-S-M.RO</strong>
      </p>
      <p style="margin: 8px 0 0 0; color: #9CA3AF; font-size: 12px;">
        Consultanță SSM/PSI Digitală • Romania, Bulgaria, Ungaria, Germania, Polonia
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

/**
 * Trimite email via Resend API
 */
async function sendEmailViaResend(
  resendApiKey: string,
  to: string,
  subject: string,
  htmlContent: string
): Promise<ResendResponse> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Alerte SSM/PSI <alerte@s-s-m.ro>',
      to: [to],
      subject,
      html: htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

/**
 * Obține email-ul principal al organizației
 */
async function getOrganizationEmail(
  supabase: any,
  orgId: string
): Promise<{ email: string; orgName: string }> {
  const { data, error } = await supabase
    .from('organizations')
    .select('contact_email, name')
    .eq('id', orgId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to fetch organization: ${error?.message || 'Not found'}`);
  }

  if (!data.contact_email) {
    throw new Error('Organization does not have a contact email configured');
  }

  return {
    email: data.contact_email,
    orgName: data.name,
  };
}

/**
 * Main handler
 */
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Environment variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    if (!RESEND_API_KEY) {
      throw new Error("Missing Resend API key");
    }

    // Parse request
    const body: AlertDigestRequest = await req.json();
    const { org_id } = body;

    if (!org_id) {
      return new Response(
        JSON.stringify({ error: "Missing required field: org_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Step 1: Fetch alerts from last 24h
    console.log(`[${org_id}] Fetching alerts from last 24 hours...`);
    const alerts = await collectAlerts(supabase, org_id);

    // If no new alerts, skip sending email
    if (alerts.length === 0) {
      console.log(`[${org_id}] No new alerts in last 24h, skipping email`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "No new alerts to report",
          alert_count: 0
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Group by severity
    console.log(`[${org_id}] Found ${alerts.length} alerts, grouping by severity...`);
    const groupedAlerts = groupAlertsBySeverity(alerts);

    // Step 3: Get organization info
    const { email, orgName } = await getOrganizationEmail(supabase, org_id);
    console.log(`[${org_id}] Sending digest to ${email}`);

    // Step 4: Generate HTML email
    const htmlContent = generateEmailHTML(groupedAlerts, orgName, alerts.length);
    const subject = `📊 Raport Zilnic: ${alerts.length} ${alerts.length === 1 ? 'Alertă Nouă' : 'Alerte Noi'} - ${orgName}`;

    // Step 5: Send via Resend
    const resendResponse = await sendEmailViaResend(
      RESEND_API_KEY,
      email,
      subject,
      htmlContent
    );

    console.log(`[${org_id}] Email sent successfully: ${resendResponse.id}`);

    // Step 6: Log to notification_log (optional)
    try {
      await supabase.from('notification_log').insert({
        organization_id: org_id,
        notification_type: 'report_monthly', // sau creați un tip nou 'alert_digest'
        channel: 'email',
        recipient: email,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: {
          alert_count: alerts.length,
          critical_count: groupedAlerts.critical.length,
          expired_count: groupedAlerts.expired.length,
          warning_count: groupedAlerts.warning.length,
          info_count: groupedAlerts.info.length,
          resend_id: resendResponse.id,
        },
      });
    } catch (logError) {
      console.error('Failed to log notification:', logError);
      // Non-critical, continue
    }

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Alert digest sent successfully",
        org_id,
        email,
        alert_count: alerts.length,
        breakdown: {
          critical: groupedAlerts.critical.length,
          expired: groupedAlerts.expired.length,
          warning: groupedAlerts.warning.length,
          info: groupedAlerts.info.length,
        },
        resend_id: resendResponse.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in alert-digest function:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
