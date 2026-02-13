// Supabase Edge Function: CUI Lookup via ANAF API
// Deploy: supabase functions deploy cui-lookup
// API: https://openapi.anaf.ro

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Types
interface CUIRequest {
  cui: string;
}

interface ANAFCompanyData {
  cui: number;
  denumire: string;
  adresa: string;
  nrRegCom: string;
  telefon: string;
  fax: string;
  codPostal: string;
  act: string;
  stare_inregistrare: string;
  data_inregistrare: string;
  cod_CAEN: string;
  iban: string;
  statusRO_e_Factura: boolean;
  organFiscalCompetent: string;
  forma_de_proprietate: string;
  forma_organizare: string;
  forma_juridica: string;
  scpTVA?: boolean;
  dataInceputTVA?: string;
  dataSfarsitTVA?: string;
  dataActualizareTVA?: string;
  dataPublicareTVA?: string;
  tipActTVA?: string;
  statusInactivTVA?: boolean;
  dataInactivTVA?: string;
  dataReactivareTVA?: string;
  statusSplitTVA?: boolean;
  dataAnulareSplitTVA?: string;
}

interface ANAFResponse {
  cod: number;
  message: string;
  found: ANAFCompanyData[];
  notfound: number[];
}

interface RateLimitEntry {
  count: number;
  reset_at: number;
}

// In-memory rate limiter (60 requests/hour per IP)
const rateLimiter = new Map<string, RateLimitEntry>();

/**
 * Validate CUI format and extract numeric value
 * CUI can be: 12345678, RO12345678, or with spaces
 */
function normalizeCUI(cui: string): string {
  // Remove spaces and convert to uppercase
  const normalized = cui.trim().toUpperCase().replace(/\s+/g, '');

  // Remove RO prefix if present
  const cuiNumber = normalized.startsWith('RO') ? normalized.substring(2) : normalized;

  // Validate that it contains only digits
  if (!/^\d+$/.test(cuiNumber)) {
    throw new Error('CUI invalid: trebuie să conțină doar cifre');
  }

  // CUI should be between 2 and 10 digits
  if (cuiNumber.length < 2 || cuiNumber.length > 10) {
    throw new Error('CUI invalid: lungime incorectă (2-10 cifre)');
  }

  return cuiNumber;
}

/**
 * Validate CUI checksum according to Romanian algorithm
 * Algorithm: https://www.cnp.ro/cui-validation
 */
function validateCUIChecksum(cui: string): boolean {
  const cuiDigits = cui.split('').map(Number);

  // Control key for CUI validation
  const controlKey = [7, 5, 3, 2, 1, 7, 5, 3, 2];

  // If CUI has less than 10 digits, pad with zeros on the left
  const paddedCUI = cui.padStart(10, '0');
  const digits = paddedCUI.split('').map(Number);

  // Extract check digit (last digit)
  const checkDigit = digits[9];

  // Calculate sum: multiply each digit (except last) by control key
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * controlKey[i];
  }

  // Calculate control value
  const controlValue = sum * 10 % 11;

  // If control value is 10, it should be 0
  const expectedCheckDigit = controlValue === 10 ? 0 : controlValue;

  return checkDigit === expectedCheckDigit;
}

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; reset_at: number } {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  const limit = 60;

  const entry = rateLimiter.get(ip);

  // Clean up expired entries
  if (entry && entry.reset_at < now) {
    rateLimiter.delete(ip);
  }

  const currentEntry = rateLimiter.get(ip);

  if (!currentEntry) {
    // First request in this hour
    const reset_at = now + hourInMs;
    rateLimiter.set(ip, { count: 1, reset_at });
    return { allowed: true, remaining: limit - 1, reset_at };
  }

  if (currentEntry.count >= limit) {
    return { allowed: false, remaining: 0, reset_at: currentEntry.reset_at };
  }

  // Increment counter
  currentEntry.count += 1;
  rateLimiter.set(ip, currentEntry);

  return { allowed: true, remaining: limit - currentEntry.count, reset_at: currentEntry.reset_at };
}

/**
 * Call ANAF API to get company data
 */
async function fetchANAFData(cui: string): Promise<ANAFCompanyData> {
  const url = "https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva";

  const requestBody = [
    {
      cui: parseInt(cui, 10),
      data: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    },
  ];

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`ANAF API error: ${response.status} ${response.statusText}`);
    }

    const data: ANAFResponse = await response.json();

    // Check if company was found
    if (data.found && data.found.length > 0) {
      return data.found[0];
    }

    // Check if company was not found
    if (data.notfound && data.notfound.length > 0) {
      throw new Error('Firma nu a fost găsită în baza de date ANAF');
    }

    throw new Error('Răspuns invalid de la ANAF API');
  } catch (error) {
    console.error("ANAF API error:", error);

    if (error.message.includes('găsită')) {
      throw error;
    }

    throw new Error(`Eroare la apelarea API ANAF: ${error.message}`);
  }
}

/**
 * Get client IP from request
 */
function getClientIP(req: Request): string {
  // Try various headers that might contain the IP
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback to a default value (not ideal, but needed for rate limiting)
  return "unknown";
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.reset_at);
      return new Response(
        JSON.stringify({
          error: "Rate limit depășit",
          message: "Maxim 60 cereri pe oră",
          reset_at: resetDate.toISOString(),
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Limit": "60",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.reset_at.toString(),
          },
        }
      );
    }

    // Parse request body
    const body: CUIRequest = await req.json();
    const { cui } = body;

    // Validate input
    if (!cui) {
      return new Response(
        JSON.stringify({ error: "CUI lipsește" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize and validate CUI format
    let normalizedCUI: string;
    try {
      normalizedCUI = normalizeCUI(cui);
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "CUI invalid",
          message: error.message,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate CUI checksum
    const isValidChecksum = validateCUIChecksum(normalizedCUI);
    if (!isValidChecksum) {
      return new Response(
        JSON.stringify({
          error: "CUI invalid",
          message: "Cifra de control este incorectă",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch data from ANAF
    const anafData = await fetchANAFData(normalizedCUI);

    // Format response
    const responseData = {
      success: true,
      cui: anafData.cui,
      denumire: anafData.denumire,
      adresa: anafData.adresa,
      nrRegCom: anafData.nrRegCom,
      telefon: anafData.telefon || null,
      fax: anafData.fax || null,
      codPostal: anafData.codPostal || null,
      stare_inregistrare: anafData.stare_inregistrare,
      data_inregistrare: anafData.data_inregistrare,
      cod_CAEN: anafData.cod_CAEN || null,
      tva: {
        platitor_tva: anafData.scpTVA || false,
        data_inceput_tva: anafData.dataInceputTVA || null,
        data_sfarsit_tva: anafData.dataSfarsitTVA || null,
        data_actualizare_tva: anafData.dataActualizareTVA || null,
        inactiv_tva: anafData.statusInactivTVA || false,
        data_inactiv_tva: anafData.dataInactivTVA || null,
        split_tva: anafData.statusSplitTVA || false,
      },
      forma_juridica: anafData.forma_juridica || null,
      iban: anafData.iban || null,
      rate_limit: {
        remaining: rateLimit.remaining,
        reset_at: new Date(rateLimit.reset_at).toISOString(),
      },
    };

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.reset_at.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Error in CUI lookup:", error);

    return new Response(
      JSON.stringify({
        error: "Eroare internă",
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
