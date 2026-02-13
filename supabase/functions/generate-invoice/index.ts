import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvoiceRequest {
  org_id: string
  period: string // Format: YYYY-MM
  currency?: 'RON' | 'EUR'
}

interface Organization {
  id: string
  name: string
  cui?: string
  reg_com?: string
  address?: string
  city?: string
  country?: string
  email?: string
  phone?: string
}

interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { org_id, period, currency = 'RON' } = await req.json() as InvoiceRequest

    if (!org_id || !period) {
      throw new Error('Missing required fields: org_id, period')
    }

    // Validate period format
    const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/
    if (!periodRegex.test(period)) {
      throw new Error('Invalid period format. Use YYYY-MM')
    }

    // Verify user has access to this organization
    const { data: membership, error: membershipError } = await supabaseClient
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', org_id)
      .single()

    if (membershipError || !membership) {
      throw new Error('Access denied to this organization')
    }

    // Get organization details
    const { data: org, error: orgError } = await supabaseClient
      .from('organizations')
      .select('*')
      .eq('id', org_id)
      .single()

    if (orgError || !org) {
      throw new Error('Organization not found')
    }

    // Get subscription details
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('organization_id', org_id)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      throw new Error('No active subscription found')
    }

    // Calculate invoice items
    const items: InvoiceItem[] = []

    // Base subscription
    const basePriceRON = subscription.plans?.price_ron || 0
    const basePriceEUR = subscription.plans?.price_eur || 0
    const basePrice = currency === 'RON' ? basePriceRON : basePriceEUR

    items.push({
      description: `Abonament ${subscription.plans?.name || 'Standard'} - ${period}`,
      quantity: 1,
      unit_price: basePrice,
      total: basePrice,
    })

    // Extra users (if applicable)
    const { count: userCount } = await supabaseClient
      .from('memberships')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', org_id)

    const includedUsers = subscription.plans?.max_users || 5
    const extraUsers = Math.max(0, (userCount || 0) - includedUsers)

    if (extraUsers > 0) {
      const extraUserPriceRON = 50 // 50 RON per extra user
      const extraUserPriceEUR = 10 // 10 EUR per extra user
      const extraUserPrice = currency === 'RON' ? extraUserPriceRON : extraUserPriceEUR

      items.push({
        description: `Utilizatori suplimentari (${extraUsers})`,
        quantity: extraUsers,
        unit_price: extraUserPrice,
        total: extraUsers * extraUserPrice,
      })
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const vatRate = 0.19
    const vatAmount = subtotal * vatRate
    const total = subtotal + vatAmount

    // Generate invoice number
    const invoiceDate = new Date()
    const invoiceNumber = `SSM-${period.replace('-', '')}-${org_id.substring(0, 8).toUpperCase()}`

    // Generate PDF
    const pdfContent = generatePDFContent({
      invoiceNumber,
      invoiceDate,
      period,
      provider: {
        name: 'S-S-M.RO',
        cui: 'RO12345678',
        reg_com: 'J40/1234/2024',
        address: 'Str. Exemplu nr. 1',
        city: 'București',
        country: 'România',
        email: 'contact@s-s-m.ro',
        phone: '+40 722 123 456',
      },
      client: org as Organization,
      items,
      subtotal,
      vatRate,
      vatAmount,
      total,
      currency,
    })

    // Upload PDF to Supabase Storage
    const fileName = `invoices/${org_id}/${invoiceNumber}.pdf`
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('documents')
      .upload(fileName, pdfContent, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      throw new Error(`Failed to upload invoice: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabaseClient
      .storage
      .from('documents')
      .getPublicUrl(fileName)

    // Store invoice record in database
    const { error: insertError } = await supabaseClient
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        organization_id: org_id,
        period,
        subtotal,
        vat_amount: vatAmount,
        total,
        currency,
        status: 'issued',
        file_url: urlData.publicUrl,
        items: items,
        created_by: user.id,
      })

    if (insertError) {
      console.error('Failed to store invoice record:', insertError)
      // Not throwing - PDF is already uploaded
    }

    return new Response(
      JSON.stringify({
        success: true,
        invoice_number: invoiceNumber,
        url: urlData.publicUrl,
        total,
        currency,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error generating invoice:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function generatePDFContent(data: {
  invoiceNumber: string
  invoiceDate: Date
  period: string
  provider: Organization
  client: Organization
  items: InvoiceItem[]
  subtotal: number
  vatRate: number
  vatAmount: number
  total: number
  currency: string
}): Uint8Array {
  // Simple PDF generation using basic PDF structure
  // For production, consider using a library like jsPDF or pdfkit

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #2563eb;
    }
    .invoice-details {
      text-align: right;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
      color: #2563eb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 30px;
      float: right;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total-row.grand-total {
      font-weight: bold;
      font-size: 18px;
      border-top: 2px solid #2563eb;
      padding-top: 12px;
      margin-top: 8px;
    }
    .footer {
      margin-top: 60px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">S-S-M.RO</div>
      <p style="margin: 5px 0;">${data.provider.name}</p>
      <p style="margin: 5px 0;">CUI: ${data.provider.cui || 'N/A'}</p>
      <p style="margin: 5px 0;">Reg. Com.: ${data.provider.reg_com || 'N/A'}</p>
      <p style="margin: 5px 0;">${data.provider.address || ''}</p>
      <p style="margin: 5px 0;">${data.provider.city || ''}, ${data.provider.country || ''}</p>
      <p style="margin: 5px 0;">Email: ${data.provider.email || ''}</p>
      <p style="margin: 5px 0;">Tel: ${data.provider.phone || ''}</p>
    </div>
    <div class="invoice-details">
      <h1 style="margin: 0 0 10px 0;">FACTURĂ</h1>
      <p style="margin: 5px 0;"><strong>Nr:</strong> ${data.invoiceNumber}</p>
      <p style="margin: 5px 0;"><strong>Data:</strong> ${data.invoiceDate.toLocaleDateString('ro-RO')}</p>
      <p style="margin: 5px 0;"><strong>Perioada:</strong> ${data.period}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">CLIENT</div>
    <p style="margin: 5px 0;"><strong>${data.client.name}</strong></p>
    <p style="margin: 5px 0;">CUI: ${data.client.cui || 'N/A'}</p>
    <p style="margin: 5px 0;">Reg. Com.: ${data.client.reg_com || 'N/A'}</p>
    <p style="margin: 5px 0;">${data.client.address || ''}</p>
    <p style="margin: 5px 0;">${data.client.city || ''}, ${data.client.country || ''}</p>
    ${data.client.email ? `<p style="margin: 5px 0;">Email: ${data.client.email}</p>` : ''}
    ${data.client.phone ? `<p style="margin: 5px 0;">Tel: ${data.client.phone}</p>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Descriere</th>
        <th class="text-right">Cantitate</th>
        <th class="text-right">Preț unitar</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${data.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${item.unit_price.toFixed(2)} ${data.currency}</td>
          <td class="text-right">${item.total.toFixed(2)} ${data.currency}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>${data.subtotal.toFixed(2)} ${data.currency}</span>
    </div>
    <div class="total-row">
      <span>TVA (${(data.vatRate * 100).toFixed(0)}%):</span>
      <span>${data.vatAmount.toFixed(2)} ${data.currency}</span>
    </div>
    <div class="total-row grand-total">
      <span>TOTAL:</span>
      <span>${data.total.toFixed(2)} ${data.currency}</span>
    </div>
  </div>

  <div style="clear: both;"></div>

  <div class="footer">
    <p>Factură generată automat de platforma S-S-M.RO</p>
    <p>Pentru orice întrebări, vă rugăm să ne contactați la ${data.provider.email}</p>
  </div>
</body>
</html>
  `

  // Convert HTML to PDF using basic structure
  // In production, use a proper PDF library or external service
  // For now, returning HTML as bytes (would need proper PDF conversion)
  const encoder = new TextEncoder()
  return encoder.encode(htmlContent)
}
