// Supabase Edge Function: Send WhatsApp messages via Twilio API
// Deploy: supabase functions deploy send-whatsapp

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Types
interface WhatsAppRequest {
  phone: string;
  template_name: string;
  template_params?: Record<string, string>;
  locale?: string;
}

interface TwilioResponse {
  sid: string;
  status: string;
  error_code?: string;
  error_message?: string;
}

interface RateLimitEntry {
  count: number;
  reset_at: number;
}

// Approved WhatsApp templates (localized)
const APPROVED_TEMPLATES: Record<string, Record<string, string>> = {
  training_reminder: {
    ro: "Reminder: Aveți instruire SSM programată pe {date} la {time}. Locație: {location}",
    en: "Reminder: You have SSM training scheduled on {date} at {time}. Location: {location}",
    bg: "Напомняне: Имате обучение по ЗБУТ на {date} в {time}. Местоположение: {location}",
    hu: "Emlékeztető: SSM képzés {date} napon {time} órakor. Helyszín: {location}",
    de: "Erinnerung: Sie haben eine Arbeitssicherheitsschulung am {date} um {time}. Ort: {location}",
  },
  medical_expiry: {
    ro: "Atenție! Avizul medical expiră pe {expiry_date}. Vă rugăm să programați o consultație.",
    en: "Attention! Your medical certificate expires on {expiry_date}. Please schedule a consultation.",
    bg: "Внимание! Вашето медицинско свидетелство изтича на {expiry_date}. Моля, насрочете консултация.",
    hu: "Figyelem! Az egészségügyi igazolása {expiry_date} napon lejár. Kérjük, időpontot foglaljon.",
    de: "Achtung! Ihr ärztliches Attest läuft am {expiry_date} ab. Bitte vereinbaren Sie einen Termin.",
  },
  equipment_inspection: {
    ro: "Echipamentul {equipment_name} necesită verificare tehnică până pe {deadline}.",
    en: "Equipment {equipment_name} requires technical inspection by {deadline}.",
    bg: "Оборудването {equipment_name} изисква технически преглед до {deadline}.",
    hu: "A(z) {equipment_name} berendezés műszaki ellenőrzést igényel {deadline} dátumig.",
    de: "Die Ausrüstung {equipment_name} erfordert eine technische Prüfung bis {deadline}.",
  },
  document_expiry: {
    ro: "Documentul {document_name} expiră pe {expiry_date}. Acțiune necesară.",
    en: "Document {document_name} expires on {expiry_date}. Action required.",
    bg: "Документът {document_name} изтича на {expiry_date}. Необходимо действие.",
    hu: "A(z) {document_name} dokumentum lejár {expiry_date} napon. Intézkedés szükséges.",
    de: "Das Dokument {document_name} läuft am {expiry_date} ab. Maßnahme erforderlich.",
  },
  alert_notification: {
    ro: "Alertă SSM: {alert_message}. Prioritate: {priority}",
    en: "SSM Alert: {alert_message}. Priority: {priority}",
    bg: "Сигнал за ЗБУТ: {alert_message}. Приоритет: {priority}",
    hu: "SSM Riasztás: {alert_message}. Prioritás: {priority}",
    de: "Arbeitssicherheitswarnung: {alert_message}. Priorität: {priority}",
  },
};

// In-memory rate limiter (100 requests/hour per phone)
const rateLimiter = new Map<string, RateLimitEntry>();

function checkRateLimit(phone: string): { allowed: boolean; remaining: number; reset_at: number } {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  const limit = 100;

  const entry = rateLimiter.get(phone);

  // Clean up expired entries
  if (entry && entry.reset_at < now) {
    rateLimiter.delete(phone);
  }

  const currentEntry = rateLimiter.get(phone);

  if (!currentEntry) {
    // First request in this hour
    const reset_at = now + hourInMs;
    rateLimiter.set(phone, { count: 1, reset_at });
    return { allowed: true, remaining: limit - 1, reset_at };
  }

  if (currentEntry.count >= limit) {
    return { allowed: false, remaining: 0, reset_at: currentEntry.reset_at };
  }

  // Increment counter
  currentEntry.count += 1;
  rateLimiter.set(phone, currentEntry);

  return { allowed: true, remaining: limit - currentEntry.count, reset_at: currentEntry.reset_at };
}

function formatTemplate(template: string, params?: Record<string, string>): string {
  if (!params) return template;

  let formatted = template;
  for (const [key, value] of Object.entries(params)) {
    formatted = formatted.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return formatted;
}

function validatePhone(phone: string): boolean {
  // WhatsApp format: +<country_code><number> (e.g., +40712345678)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

async function sendTwilioWhatsApp(
  phone: string,
  message: string,
  twilioAccountSid: string,
  twilioAuthToken: string,
  twilioWhatsAppFrom: string
): Promise<TwilioResponse> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

  const body = new URLSearchParams({
    To: `whatsapp:${phone}`,
    From: `whatsapp:${twilioWhatsAppFrom}`,
    Body: message,
  });

  const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Twilio API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    sid: data.sid,
    status: data.status,
    error_code: data.error_code,
    error_message: data.error_message,
  };
}

async function logDeliveryStatus(
  supabase: any,
  phone: string,
  templateName: string,
  messageId: string,
  status: string,
  errorMessage?: string
) {
  try {
    await supabase.from("whatsapp_delivery_log").insert({
      phone,
      template_name: templateName,
      message_id: messageId,
      status,
      error_message: errorMessage,
      sent_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log delivery status:", error);
  }
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TWILIO_WHATSAPP_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
      throw new Error("Missing Twilio configuration");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Parse request body
    const body: WhatsAppRequest = await req.json();
    const { phone, template_name, template_params, locale = "ro" } = body;

    // Validate input
    if (!phone || !template_name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: phone, template_name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validatePhone(phone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone format. Use international format: +40712345678" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(phone);
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.reset_at);
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: "Maximum 100 messages per hour",
          reset_at: resetDate.toISOString(),
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.reset_at.toString(),
          },
        }
      );
    }

    // Get template
    const templates = APPROVED_TEMPLATES[template_name];
    if (!templates) {
      return new Response(
        JSON.stringify({
          error: "Template not found",
          available_templates: Object.keys(APPROVED_TEMPLATES),
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const templateText = templates[locale] || templates.ro;
    const message = formatTemplate(templateText, template_params);

    // Send WhatsApp message via Twilio
    const twilioResponse = await sendTwilioWhatsApp(
      phone,
      message,
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_WHATSAPP_FROM
    );

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Log delivery status
    await logDeliveryStatus(
      supabase,
      phone,
      template_name,
      twilioResponse.sid,
      twilioResponse.status,
      twilioResponse.error_message
    );

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        messageId: twilioResponse.sid,
        status: twilioResponse.status,
        phone,
        template_name,
        locale,
        rate_limit: {
          remaining: rateLimit.remaining,
          reset_at: new Date(rateLimit.reset_at).toISOString(),
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.reset_at.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);

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
