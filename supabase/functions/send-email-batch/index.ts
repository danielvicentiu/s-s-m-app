// Supabase Edge Function: Send email batches via Resend API
// Deploy: supabase functions deploy send-email-batch
// Environment variables required: RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Types
interface EmailRecipient {
  email: string;
  name?: string;
  params?: Record<string, string>;
}

interface EmailBatchRequest {
  recipients: EmailRecipient[];
  template: string;
  subject: string;
  from?: {
    email: string;
    name?: string;
  };
  params?: Record<string, string>; // Global params applied to all recipients
}

interface ResendBatchResponse {
  id: string;
  data: Array<{
    id: string;
    email: string;
  }>;
}

interface DeliveryLogEntry {
  email: string;
  template_name: string;
  message_id: string;
  batch_id: string;
  status: string;
  error_message?: string;
}

// Email templates (HTML with variable substitution)
const EMAIL_TEMPLATES: Record<string, string> = {
  training_reminder: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reminder: Instruire SSM Programată</h1>
    </div>
    <div class="content">
      <p>Bună ziua{name ? ' ' + name : ''},</p>
      <p>Vă reamintim că aveți instruire SSM programată:</p>
      <ul>
        <li><strong>Data:</strong> {date}</li>
        <li><strong>Ora:</strong> {time}</li>
        <li><strong>Locație:</strong> {location}</li>
      </ul>
      <p>Vă rugăm să confirmați participarea.</p>
      <a href="{confirm_url}" class="button">Confirmă Participarea</a>
    </div>
    <div class="footer">
      <p>Acest email a fost trimis automat de platforma s-s-m.ro</p>
      <p>&copy; 2026 s-s-m.ro | SSM & PSI Digital</p>
    </div>
  </div>
</body>
</html>`,

  medical_expiry: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .alert { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Atenție: Aviz Medical Expirat</h1>
    </div>
    <div class="content">
      <p>Bună ziua{name ? ' ' + name : ''},</p>
      <div class="alert">
        <strong>⚠️ Aviz medical expiră pe: {expiry_date}</strong>
      </div>
      <p>Avizul medical de medicina muncii expiră în curând. Conform legislației SSM, trebuie să programați o nouă consultație înainte de expirare.</p>
      <p><strong>Acțiune necesară:</strong> Contactați medicul de medicina muncii pentru programare.</p>
      <a href="{schedule_url}" class="button">Programează Consultație</a>
    </div>
    <div class="footer">
      <p>Acest email a fost trimis automat de platforma s-s-m.ro</p>
      <p>&copy; 2026 s-s-m.ro | SSM & PSI Digital</p>
    </div>
  </div>
</body>
</html>`,

  equipment_inspection: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ea580c; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .equipment { background: white; border: 2px solid #ea580c; padding: 15px; margin: 20px 0; border-radius: 6px; }
    .button { display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verificare Tehnică Necesară</h1>
    </div>
    <div class="content">
      <p>Bună ziua{name ? ' ' + name : ''},</p>
      <div class="equipment">
        <strong>Echipament:</strong> {equipment_name}<br>
        <strong>Verificare până la:</strong> {deadline}<br>
        <strong>Serie/Cod:</strong> {equipment_code}
      </div>
      <p>Echipamentul necesită verificare tehnică periodică conform normelor ISCIR/SSM.</p>
      <a href="{details_url}" class="button">Vezi Detalii</a>
    </div>
    <div class="footer">
      <p>Acest email a fost trimis automat de platforma s-s-m.ro</p>
      <p>&copy; 2026 s-s-m.ro | SSM & PSI Digital</p>
    </div>
  </div>
</body>
</html>`,

  document_expiry: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #d97706; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .document { background: white; border: 2px solid #d97706; padding: 15px; margin: 20px 0; border-radius: 6px; }
    .button { display: inline-block; background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Document Expirat</h1>
    </div>
    <div class="content">
      <p>Bună ziua{name ? ' ' + name : ''},</p>
      <div class="document">
        <strong>Document:</strong> {document_name}<br>
        <strong>Expiră pe:</strong> {expiry_date}<br>
        <strong>Tip:</strong> {document_type}
      </div>
      <p>Documentul expiră în curând. Acțiune necesară pentru reînnoire.</p>
      <a href="{renew_url}" class="button">Reînnoiește Document</a>
    </div>
    <div class="footer">
      <p>Acest email a fost trimis automat de platforma s-s-m.ro</p>
      <p>&copy; 2026 s-s-m.ro | SSM & PSI Digital</p>
    </div>
  </div>
</body>
</html>`,

  alert_notification: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #7c3aed; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .alert { background: #faf5ff; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0; }
    .priority-high { background: #fef2f2; border-left-color: #dc2626; }
    .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Alertă SSM</h1>
    </div>
    <div class="content">
      <p>Bună ziua{name ? ' ' + name : ''},</p>
      <div class="alert{priority === 'high' ? ' priority-high' : ''}">
        <strong>{alert_message}</strong><br>
        <strong>Prioritate:</strong> {priority}
      </div>
      <p>{alert_details}</p>
      <a href="{action_url}" class="button">Vezi Alertă</a>
    </div>
    <div class="footer">
      <p>Acest email a fost trimis automat de platforma s-s-m.ro</p>
      <p>&copy; 2026 s-s-m.ro | SSM & PSI Digital</p>
    </div>
  </div>
</body>
</html>`,
};

// Constants
const MAX_BATCH_SIZE = 100; // Resend API limit
const DEFAULT_FROM = {
  email: "noreply@s-s-m.ro",
  name: "s-s-m.ro Platform",
};

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validate email format
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format template with parameters
function formatTemplate(template: string, params: Record<string, string>): string {
  let formatted = template;

  // Replace {variable} placeholders with actual values
  for (const [key, value] of Object.entries(params)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    formatted = formatted.replace(regex, value || '');
  }

  // Remove any unreplaced placeholders (set to empty string)
  formatted = formatted.replace(/\{[^}]+\}/g, '');

  return formatted;
}

// Log delivery status to database
async function logDeliveryBatch(
  supabase: any,
  logs: DeliveryLogEntry[]
): Promise<void> {
  try {
    const entries = logs.map(log => ({
      email: log.email,
      template_name: log.template_name,
      message_id: log.message_id,
      batch_id: log.batch_id,
      status: log.status,
      error_message: log.error_message,
      sent_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("email_delivery_log")
      .insert(entries);

    if (error) {
      console.error("Failed to log delivery status:", error);
    }
  } catch (error) {
    console.error("Exception in logDeliveryBatch:", error);
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Parse request body
    const body: EmailBatchRequest = await req.json();
    const { recipients, template, subject, from, params: globalParams = {} } = body;

    // Validate input
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing or empty recipients array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (recipients.length > MAX_BATCH_SIZE) {
      return new Response(
        JSON.stringify({
          error: `Batch size exceeds maximum of ${MAX_BATCH_SIZE} recipients`,
          provided: recipients.length,
          max_allowed: MAX_BATCH_SIZE,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!template || !subject) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: template, subject" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate all recipient emails
    const invalidEmails = recipients.filter(r => !validateEmail(r.email));
    if (invalidEmails.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid email addresses found",
          invalid_emails: invalidEmails.map(r => r.email),
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if template exists
    const templateHtml = EMAIL_TEMPLATES[template];
    if (!templateHtml) {
      return new Response(
        JSON.stringify({
          error: "Template not found",
          available_templates: Object.keys(EMAIL_TEMPLATES),
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Prepare personalized content for each recipient
    const personalizedRecipients = recipients.map(recipient => {
      // Merge global params with recipient-specific params
      const mergedParams = { ...globalParams, ...recipient.params };

      // Add recipient name to params if available
      if (recipient.name) {
        mergedParams.name = recipient.name;
      }

      return {
        email: recipient.email,
        name: recipient.name,
        html: formatTemplate(templateHtml, mergedParams),
      };
    });

    // Send batch via Resend (need to update function call)
    const resendEmails = personalizedRecipients.map(p => ({
      from: (from || DEFAULT_FROM).name
        ? `${(from || DEFAULT_FROM).name} <${(from || DEFAULT_FROM).email}>`
        : (from || DEFAULT_FROM).email,
      to: p.email,
      subject: subject,
      html: p.html,
    }));

    const resendUrl = "https://api.resend.com/emails/batch";
    const resendApiResponse = await fetch(resendUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendEmails),
    });

    if (!resendApiResponse.ok) {
      const error = await resendApiResponse.json();
      throw new Error(`Resend API error: ${error.message || resendApiResponse.statusText}`);
    }

    const resendResponse = await resendApiResponse.json();

    // Generate batch ID for tracking
    const batchId = resendResponse.id || crypto.randomUUID();

    // Prepare delivery logs
    const deliveryLogs: DeliveryLogEntry[] = resendResponse.data.map((item, idx) => ({
      email: item.email || recipients[idx].email,
      template_name: template,
      message_id: item.id,
      batch_id: batchId,
      status: "sent",
    }));

    // Log delivery status asynchronously
    await logDeliveryBatch(supabase, deliveryLogs);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        batchId: batchId,
        status: "sent",
        recipients_count: recipients.length,
        template: template,
        messages: resendResponse.data.map(item => ({
          email: item.email,
          messageId: item.id,
        })),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email batch:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
