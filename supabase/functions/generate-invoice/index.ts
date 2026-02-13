// Supabase Edge Function: Generate Invoice PDF
// Deploy: supabase functions deploy generate-invoice
// Environment variables required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Types
interface InvoiceRequest {
  org_id: string;
  period: string; // Format: "YYYY-MM" or "Q1-2026"
  currency?: "RON" | "EUR";
}

interface Organization {
  id: string;
  name: string;
  cui: string | null;
  address: string | null;
  county: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface InvoiceData {
  invoice_number: string;
  invoice_date: string;
  period: string;
  provider: {
    name: string;
    cui: string;
    address: string;
    email: string;
    phone: string;
    bank: string;
    iban: string;
  };
  client: Organization;
  items: InvoiceLineItem[];
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  currency: string;
}

// Constants
const VAT_RATE = 0.19; // 19% TVA
const PROVIDER_INFO = {
  name: "S-S-M.RO SRL",
  cui: "RO12345678",
  address: "Str. Exemplu nr. 1, București, România",
  email: "facturare@s-s-m.ro",
  phone: "+40 700 000 000",
  bank: "Banca Transilvania",
  iban: "RO49 AAAA 1B31 0075 9384 0000",
};

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate invoice number
function generateInvoiceNumber(orgId: string, period: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const orgPrefix = orgId.substring(0, 6).toUpperCase();
  const periodClean = period.replace(/[^0-9]/g, "");
  return `INV-${periodClean}-${orgPrefix}-${timestamp}`;
}

// Format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ro-RO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Calculate invoice items based on organization subscription
async function calculateInvoiceItems(
  supabase: any,
  orgId: string,
  currency: string
): Promise<InvoiceLineItem[]> {
  const items: InvoiceLineItem[] = [];

  // Fetch organization membership count
  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("id")
    .eq("organization_id", orgId)
    .eq("is_active", true);

  if (membershipsError) {
    console.error("Error fetching memberships:", membershipsError);
  }

  const userCount = memberships?.length || 0;

  // Base subscription plan (example pricing)
  const basePrice = currency === "EUR" ? 49.99 : 249.99;
  items.push({
    description: "Plan de bază SSM/PSI Digital - 1 utilizator inclus",
    quantity: 1,
    unit_price: basePrice,
    total: basePrice,
  });

  // Extra users (if more than 1)
  if (userCount > 1) {
    const extraUsers = userCount - 1;
    const pricePerUser = currency === "EUR" ? 9.99 : 49.99;
    const extraTotal = extraUsers * pricePerUser;
    items.push({
      description: `Utilizatori adițional (${extraUsers} x ${formatCurrency(pricePerUser, currency)})`,
      quantity: extraUsers,
      unit_price: pricePerUser,
      total: extraTotal,
    });
  }

  return items;
}

// Generate HTML invoice
function generateInvoiceHTML(data: InvoiceData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unit_price, data.currency)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatCurrency(item.total, data.currency)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Factură ${data.invoice_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #1f2937; background: white; }
    .invoice-container { max-width: 800px; margin: 40px auto; padding: 40px; background: white; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
    .logo { font-size: 32px; font-weight: bold; color: #2563eb; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 28px; color: #1f2937; margin-bottom: 8px; }
    .invoice-title p { color: #6b7280; font-size: 14px; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 40px; gap: 40px; }
    .party { flex: 1; }
    .party h3 { font-size: 14px; text-transform: uppercase; color: #6b7280; margin-bottom: 12px; font-weight: 600; }
    .party-info { background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb; }
    .party-info p { margin-bottom: 6px; font-size: 14px; }
    .party-info strong { color: #1f2937; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead { background: #f3f4f6; }
    thead th { padding: 12px; text-align: left; font-size: 13px; text-transform: uppercase; color: #6b7280; font-weight: 600; }
    thead th:nth-child(2) { text-align: center; }
    thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
    tbody td { font-size: 14px; color: #374151; }
    .totals { margin-left: auto; width: 300px; margin-top: 24px; }
    .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
    .total-row.subtotal { border-top: 1px solid #e5e7eb; }
    .total-row.grand-total { border-top: 2px solid #2563eb; padding-top: 16px; margin-top: 16px; font-size: 18px; font-weight: bold; color: #2563eb; }
    .footer { margin-top: 60px; padding-top: 24px; border-top: 2px solid #e5e7eb; text-align: center; }
    .footer p { font-size: 12px; color: #6b7280; margin-bottom: 6px; }
    .payment-info { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin-top: 32px; }
    .payment-info h4 { color: #92400e; margin-bottom: 12px; font-size: 14px; }
    .payment-info p { font-size: 13px; color: #78350f; margin-bottom: 6px; }
    @media print {
      body { background: white; }
      .invoice-container { margin: 0; padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">s-s-m.ro</div>
      <div class="invoice-title">
        <h1>FACTURĂ</h1>
        <p>Nr. ${data.invoice_number}</p>
        <p>Data: ${formatDate(new Date(data.invoice_date))}</p>
        <p>Perioada: ${data.period}</p>
      </div>
    </div>

    <!-- Provider and Client Information -->
    <div class="parties">
      <!-- Provider -->
      <div class="party">
        <h3>Furnizor</h3>
        <div class="party-info">
          <p><strong>${data.provider.name}</strong></p>
          <p>CUI: ${data.provider.cui}</p>
          <p>${data.provider.address}</p>
          <p>Email: ${data.provider.email}</p>
          <p>Telefon: ${data.provider.phone}</p>
        </div>
      </div>

      <!-- Client -->
      <div class="party">
        <h3>Client</h3>
        <div class="party-info">
          <p><strong>${data.client.name}</strong></p>
          ${data.client.cui ? `<p>CUI: ${data.client.cui}</p>` : ""}
          ${data.client.address ? `<p>${data.client.address}</p>` : ""}
          ${data.client.county ? `<p>${data.client.county}</p>` : ""}
          ${data.client.contact_email ? `<p>Email: ${data.client.contact_email}</p>` : ""}
          ${data.client.contact_phone ? `<p>Telefon: ${data.client.contact_phone}</p>` : ""}
        </div>
      </div>
    </div>

    <!-- Invoice Items -->
    <table>
      <thead>
        <tr>
          <th>Descriere</th>
          <th>Cantitate</th>
          <th>Preț unitar</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="total-row subtotal">
        <span>Subtotal:</span>
        <span>${formatCurrency(data.subtotal, data.currency)}</span>
      </div>
      <div class="total-row">
        <span>TVA (${(data.vat_rate * 100).toFixed(0)}%):</span>
        <span>${formatCurrency(data.vat_amount, data.currency)}</span>
      </div>
      <div class="total-row grand-total">
        <span>TOTAL:</span>
        <span>${formatCurrency(data.total, data.currency)}</span>
      </div>
    </div>

    <!-- Payment Information -->
    <div class="payment-info">
      <h4>Informații de plată</h4>
      <p><strong>Bancă:</strong> ${data.provider.bank}</p>
      <p><strong>IBAN:</strong> ${data.provider.iban}</p>
      <p><strong>Moneda:</strong> ${data.currency}</p>
      <p style="margin-top: 12px;">Plata se face în termen de 15 zile de la data emiterii facturii.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2026 s-s-m.ro | Platforma SSM & PSI Digital</p>
      <p>Acest document a fost generat automat de sistem</p>
      <p>Pentru întrebări: ${data.provider.email}</p>
    </div>
  </div>
</body>
</html>
`;
}

// Convert HTML to PDF using Puppeteer (via CDN)
// Note: For production, consider using a dedicated PDF service or library
async function generatePDFBuffer(html: string): Promise<Uint8Array> {
  // For Deno Edge Functions, we'll use a simple approach:
  // Return HTML content that can be printed to PDF client-side
  // or use an external PDF generation service

  // This is a placeholder - in production you would:
  // 1. Use a PDF generation service API (like PDFShift, DocRaptor)
  // 2. Use Puppeteer in a separate service
  // 3. Use a PDF library like pdfkit

  const encoder = new TextEncoder();
  return encoder.encode(html);
}

// Upload PDF to Supabase Storage
async function uploadPDFToStorage(
  supabase: any,
  buffer: Uint8Array,
  fileName: string
): Promise<string> {
  const bucket = "invoices";
  const filePath = `${new Date().getFullYear()}/${fileName}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Parse request body
    const body: InvoiceRequest = await req.json();
    const { org_id, period, currency = "RON" } = body;

    // Validate input
    if (!org_id || !period) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: org_id, period" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch organization data
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", org_id)
      .single();

    if (orgError || !org) {
      return new Response(
        JSON.stringify({ error: "Organization not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate invoice items
    const items = await calculateInvoiceItems(supabase, org_id, currency);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vatAmount = subtotal * VAT_RATE;
    const total = subtotal + vatAmount;

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber(org_id, period);
    const invoiceDate = new Date().toISOString();

    // Prepare invoice data
    const invoiceData: InvoiceData = {
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      period: period,
      provider: PROVIDER_INFO,
      client: org,
      items: items,
      subtotal: subtotal,
      vat_rate: VAT_RATE,
      vat_amount: vatAmount,
      total: total,
      currency: currency,
    };

    // Generate HTML
    const html = generateInvoiceHTML(invoiceData);

    // For now, we'll store the HTML content
    // In production, convert to PDF
    const pdfBuffer = await generatePDFBuffer(html);
    const fileName = `${invoiceNumber}.html`; // Change to .pdf when PDF generation is implemented

    // Upload to storage
    const publicUrl = await uploadPDFToStorage(supabase, pdfBuffer, fileName);

    // Store invoice record in database (optional)
    const { error: insertError } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoiceNumber,
        organization_id: org_id,
        period: period,
        subtotal: subtotal,
        vat_amount: vatAmount,
        total: total,
        currency: currency,
        file_url: publicUrl,
        status: "generated",
        issued_at: invoiceDate,
      });

    if (insertError) {
      console.error("Failed to store invoice record:", insertError);
      // Continue anyway - file is uploaded
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        invoice_number: invoiceNumber,
        url: publicUrl,
        invoice_data: {
          subtotal: formatCurrency(subtotal, currency),
          vat: formatCurrency(vatAmount, currency),
          total: formatCurrency(total, currency),
          currency: currency,
          period: period,
        },
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
    console.error("Error generating invoice:", error);

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
