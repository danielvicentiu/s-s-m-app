// Supabase Edge Function: Send SMS via Twilio API
// Deploy: supabase functions deploy send-sms
// ENV: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Types
interface SMSRequest {
  phone: string;
  message: string;
  locale?: string;
  organization_id?: string;
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

interface CountryInfo {
  code: string;
  name: string;
  cost_usd: number;
}

// Country code detection based on phone prefix
const COUNTRY_CODES: Record<string, CountryInfo> = {
  "40": { code: "RO", name: "Romania", cost_usd: 0.0155 },
  "359": { code: "BG", name: "Bulgaria", cost_usd: 0.0191 },
  "36": { code: "HU", name: "Hungary", cost_usd: 0.0201 },
  "49": { code: "DE", name: "Germany", cost_usd: 0.0747 },
  "43": { code: "AT", name: "Austria", cost_usd: 0.0654 },
  "420": { code: "CZ", name: "Czech Republic", cost_usd: 0.0234 },
  "421": { code: "SK", name: "Slovakia", cost_usd: 0.0312 },
  "48": { code: "PL", name: "Poland", cost_usd: 0.0187 },
  "1": { code: "US", name: "United States", cost_usd: 0.0079 },
  "44": { code: "GB", name: "United Kingdom", cost_usd: 0.0447 },
  "33": { code: "FR", name: "France", cost_usd: 0.0730 },
  "39": { code: "IT", name: "Italy", cost_usd: 0.0734 },
  "34": { code: "ES", name: "Spain", cost_usd: 0.0797 },
  "351": { code: "PT", name: "Portugal", cost_usd: 0.0512 },
  "32": { code: "BE", name: "Belgium", cost_usd: 0.0701 },
  "31": { code: "NL", name: "Netherlands", cost_usd: 0.0981 },
  "41": { code: "CH", name: "Switzerland", cost_usd: 0.0451 },
  "46": { code: "SE", name: "Sweden", cost_usd: 0.0512 },
  "47": { code: "NO", name: "Norway", cost_usd: 0.0631 },
  "45": { code: "DK", name: "Denmark", cost_usd: 0.0423 },
  "358": { code: "FI", name: "Finland", cost_usd: 0.0834 },
};

// In-memory rate limiter (100 requests/hour per phone)
const rateLimiter = new Map<string, RateLimitEntry>();

function detectCountry(phone: string): CountryInfo {
  // Remove + prefix
  const phoneNumber = phone.startsWith("+") ? phone.substring(1) : phone;

  // Try matching from longest to shortest prefix
  for (const prefix of Object.keys(COUNTRY_CODES).sort((a, b) => b.length - a.length)) {
    if (phoneNumber.startsWith(prefix)) {
      return COUNTRY_CODES[prefix];
    }
  }

  // Default to Romania if not found
  return { code: "UNKNOWN", name: "Unknown", cost_usd: 0.0200 };
}

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

function validatePhone(phone: string): boolean {
  // International format: +<country_code><number> (e.g., +40712345678)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

function truncateMessage(message: string, maxLength: number = 160): string {
  if (message.length <= maxLength) {
    return message;
  }
  // Truncate and add ellipsis
  return message.substring(0, maxLength - 3) + "...";
}

async function sendTwilioSMS(
  phone: string,
  message: string,
  twilioAccountSid: string,
  twilioAuthToken: string,
  twilioSmsFrom: string
): Promise<TwilioResponse> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

  const body = new URLSearchParams({
    To: phone,
    From: twilioSmsFrom,
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
  organizationId: string | undefined,
  phone: string,
  message: string,
  messageId: string,
  countryCode: string,
  status: string,
  costUsd: number,
  errorMessage?: string
) {
  try {
    await supabase.from("sms_delivery_log").insert({
      organization_id: organizationId || null,
      phone,
      message,
      message_id: messageId,
      country_code: countryCode,
      status,
      cost_usd: costUsd,
      error_message: errorMessage,
      sent_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log SMS delivery status:", error);
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
    const TWILIO_SMS_FROM = Deno.env.get("TWILIO_SMS_FROM");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_SMS_FROM) {
      throw new Error("Missing Twilio configuration");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Parse request body
    const body: SMSRequest = await req.json();
    const { phone, message, locale = "ro", organization_id } = body;

    // Validate input
    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: phone, message" }),
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
          message: "Maximum 100 SMS per hour per phone number",
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

    // Detect country and estimate cost
    const country = detectCountry(phone);

    // Truncate message to 160 characters (SMS limit)
    const truncatedMessage = truncateMessage(message, 160);

    if (truncatedMessage.length < message.length) {
      console.warn(`Message truncated from ${message.length} to 160 characters for ${phone}`);
    }

    // Send SMS via Twilio
    const twilioResponse = await sendTwilioSMS(
      phone,
      truncatedMessage,
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_SMS_FROM
    );

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Log delivery status with cost tracking
    await logDeliveryStatus(
      supabase,
      organization_id,
      phone,
      truncatedMessage,
      twilioResponse.sid,
      country.code,
      twilioResponse.status,
      country.cost_usd,
      twilioResponse.error_message
    );

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        messageId: twilioResponse.sid,
        status: twilioResponse.status,
        phone,
        message: truncatedMessage,
        message_length: truncatedMessage.length,
        truncated: truncatedMessage.length < message.length,
        country: {
          code: country.code,
          name: country.name,
        },
        cost_usd: country.cost_usd,
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
    console.error("Error sending SMS:", error);

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
