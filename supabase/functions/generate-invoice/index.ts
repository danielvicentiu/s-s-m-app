import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';

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

Deno.serve(async (req) => {
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
      .select('*, subscription_plans(*)')
      .eq('organization_id', org_id)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      throw new Error('No active subscription found')
    }

    // Calculate invoice items
    const items: InvoiceItem[] = []

    // Base subscription
    const basePriceRON = subscription.subscription_plans?.price_ron || 0
    const basePriceEUR = subscription.subscription_plans?.price_eur || 0
    const basePrice = currency === 'RON' ? basePriceRON : basePriceEUR

    items.push({
      description: `Abonament ${subscription.subscription_plans?.name || 'Standard'} - ${period}`,
      quantity: 1,
      unit_price: basePrice,
      total: basePrice,
    })

    // Extra users (if applicable)
    const { count: userCount } = await supabaseClient
      .from('memberships')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', org_id)

    const includedUsers = subscription.subscription_plans?.max_users || 5
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
    const pdfContent = await generatePDFContent({
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

async function generatePDFContent(data: {
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
}): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size in points

  // Load fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const { width, height } = page.getSize()
  const margin = 50
  let y = height - margin

  // Brand color
  const brandBlue = rgb(0.145, 0.388, 0.922) // #2563eb
  const textGray = rgb(0.2, 0.2, 0.2)
  const lightGray = rgb(0.9, 0.9, 0.9)

  // Header - Logo and Provider Info (LEFT)
  page.drawText('S-S-M.RO', {
    x: margin,
    y: y,
    size: 24,
    font: boldFont,
    color: brandBlue,
  })
  y -= 25

  const providerInfo = [
    data.provider.name,
    `CUI: ${data.provider.cui || 'N/A'}`,
    `Reg. Com.: ${data.provider.reg_com || 'N/A'}`,
    data.provider.address || '',
    `${data.provider.city || ''}, ${data.provider.country || ''}`,
    `Email: ${data.provider.email || ''}`,
    `Tel: ${data.provider.phone || ''}`,
  ]

  for (const line of providerInfo) {
    if (line.trim()) {
      page.drawText(line, {
        x: margin,
        y: y,
        size: 9,
        font: regularFont,
        color: textGray,
      })
      y -= 14
    }
  }

  // Invoice Details (RIGHT)
  let rightY = height - margin
  page.drawText('FACTURĂ', {
    x: width - margin - 150,
    y: rightY,
    size: 20,
    font: boldFont,
    color: textGray,
  })
  rightY -= 30

  const invoiceDetails = [
    `Nr: ${data.invoiceNumber}`,
    `Data: ${data.invoiceDate.toLocaleDateString('ro-RO')}`,
    `Perioada: ${data.period}`,
  ]

  for (const line of invoiceDetails) {
    page.drawText(line, {
      x: width - margin - 150,
      y: rightY,
      size: 10,
      font: regularFont,
      color: textGray,
    })
    rightY -= 16
  }

  // Separator line
  y = rightY - 20
  page.drawLine({
    start: { x: margin, y: y },
    end: { x: width - margin, y: y },
    thickness: 2,
    color: brandBlue,
  })

  // Client Section
  y -= 30
  page.drawText('CLIENT', {
    x: margin,
    y: y,
    size: 12,
    font: boldFont,
    color: brandBlue,
  })
  y -= 20

  const clientInfo = [
    data.client.name,
    `CUI: ${data.client.cui || 'N/A'}`,
    `Reg. Com.: ${data.client.reg_com || 'N/A'}`,
    data.client.address || '',
    `${data.client.city || ''}, ${data.client.country || ''}`,
    data.client.email ? `Email: ${data.client.email}` : '',
    data.client.phone ? `Tel: ${data.client.phone}` : '',
  ]

  for (const line of clientInfo) {
    if (line.trim()) {
      page.drawText(line, {
        x: margin,
        y: y,
        size: 9,
        font: regularFont,
        color: textGray,
      })
      y -= 14
    }
  }

  // Items Table
  y -= 30
  const tableTop = y
  const colWidths = [250, 80, 100, 90]
  const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2]]

  // Table header background
  page.drawRectangle({
    x: margin,
    y: y - 20,
    width: width - 2 * margin,
    height: 25,
    color: lightGray,
  })

  // Table headers
  const headers = ['Descriere', 'Cantitate', 'Preț unitar', 'Total']
  headers.forEach((header, i) => {
    page.drawText(header, {
      x: colX[i] + 5,
      y: y - 15,
      size: 10,
      font: boldFont,
      color: textGray,
    })
  })

  y -= 25

  // Table rows
  for (const item of data.items) {
    y -= 20

    const rowData = [
      item.description,
      item.quantity.toString(),
      `${item.unit_price.toFixed(2)} ${data.currency}`,
      `${item.total.toFixed(2)} ${data.currency}`,
    ]

    rowData.forEach((text, i) => {
      const align = i === 0 ? 'left' : 'right'
      const xPos = align === 'left' ? colX[i] + 5 : colX[i] + colWidths[i] - 5

      page.drawText(text, {
        x: xPos,
        y: y,
        size: 9,
        font: regularFont,
        color: textGray,
      })
    })

    // Row separator
    page.drawLine({
      start: { x: margin, y: y - 5 },
      end: { x: width - margin, y: y - 5 },
      thickness: 0.5,
      color: lightGray,
    })
  }

  // Totals section
  y -= 40
  const totalsX = width - margin - 200

  const totals = [
    { label: 'Subtotal:', value: `${data.subtotal.toFixed(2)} ${data.currency}` },
    { label: `TVA (${(data.vatRate * 100).toFixed(0)}%):`, value: `${data.vatAmount.toFixed(2)} ${data.currency}` },
  ]

  for (const total of totals) {
    page.drawText(total.label, {
      x: totalsX,
      y: y,
      size: 10,
      font: regularFont,
      color: textGray,
    })

    page.drawText(total.value, {
      x: width - margin - 5,
      y: y,
      size: 10,
      font: regularFont,
      color: textGray,
    })

    y -= 18
  }

  // Grand total with separator
  page.drawLine({
    start: { x: totalsX, y: y + 10 },
    end: { x: width - margin, y: y + 10 },
    thickness: 2,
    color: brandBlue,
  })

  y -= 8

  page.drawText('TOTAL:', {
    x: totalsX,
    y: y,
    size: 14,
    font: boldFont,
    color: textGray,
  })

  page.drawText(`${data.total.toFixed(2)} ${data.currency}`, {
    x: width - margin - 5,
    y: y,
    size: 14,
    font: boldFont,
    color: textGray,
  })

  // Footer
  y = margin + 40
  page.drawLine({
    start: { x: margin, y: y },
    end: { x: width - margin, y: y },
    thickness: 0.5,
    color: lightGray,
  })

  y -= 20
  page.drawText('Factură generată automat de platforma S-S-M.RO', {
    x: margin + (width - 2 * margin) / 2 - 150,
    y: y,
    size: 9,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 14
  page.drawText(`Pentru orice întrebări, vă rugăm să ne contactați la ${data.provider.email}`, {
    x: margin + (width - 2 * margin) / 2 - 180,
    y: y,
    size: 9,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  })

  // Save the PDF
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
