import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImportRow {
  firstName: string
  lastName: string
  cnp: string
  email?: string
  phone?: string
  position?: string
  department?: string
  hireDate?: string
}

interface ValidationResult {
  valid: ImportRow[]
  errors: Array<{ row: number; field: string; message: string; data: any }>
  warnings: Array<{ row: number; field: string; message: string }>
}

// CNP checksum validation for Romanian Personal Identification Number
function validateCNP(cnp: string): boolean {
  if (!cnp || cnp.length !== 13) return false
  if (!/^\d{13}$/.test(cnp)) return false

  // Check valid sex digit (1-8)
  const sex = parseInt(cnp[0])
  if (sex < 1 || sex > 8) return false

  // Extract year, month, day
  let year = parseInt(cnp.substring(1, 3))
  const month = parseInt(cnp.substring(3, 5))
  const day = parseInt(cnp.substring(5, 7))

  // Determine century based on sex digit
  if (sex === 1 || sex === 2) year += 1900
  else if (sex === 3 || sex === 4) year += 1800
  else if (sex === 5 || sex === 6) year += 2000
  else if (sex === 7 || sex === 8) year += 1900 // Foreign residents

  // Validate month (1-12)
  if (month < 1 || month > 12) return false

  // Validate day (1-31, simplified)
  if (day < 1 || day > 31) return false

  // Checksum validation
  const checkKey = '279146358279'
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnp[i]) * parseInt(checkKey[i])
  }
  const checkDigit = sum % 11 === 10 ? 1 : sum % 11

  return checkDigit === parseInt(cnp[12])
}

function validateEmail(email: string): boolean {
  if (!email) return true // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.trim().split('\n')
  const rows: string[][] = []

  for (const line of lines) {
    // Simple CSV parsing - handles quoted fields
    const row: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    row.push(current.trim())
    rows.push(row)
  }

  return rows
}

function validateAndParseCSV(csvContent: string): ValidationResult {
  const result: ValidationResult = {
    valid: [],
    errors: [],
    warnings: []
  }

  const rows = parseCSV(csvContent)

  if (rows.length === 0) {
    result.errors.push({
      row: 0,
      field: 'csv',
      message: 'CSV-ul este gol',
      data: null
    })
    return result
  }

  // Expected header: firstName,lastName,cnp,email,phone,position,department,hireDate
  const header = rows[0].map(h => h.toLowerCase().trim())
  const requiredFields = ['firstname', 'lastname', 'cnp']

  // Validate header
  for (const field of requiredFields) {
    if (!header.includes(field)) {
      result.errors.push({
        row: 0,
        field: 'header',
        message: `Lipsește coloana obligatorie: ${field}`,
        data: header
      })
    }
  }

  if (result.errors.length > 0) {
    return result
  }

  // Map header indices
  const fieldIndex: Record<string, number> = {}
  header.forEach((field, index) => {
    fieldIndex[field] = index
  })

  // Process data rows (skip header)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 1

    // Skip empty rows
    if (row.every(cell => !cell || cell.trim() === '')) {
      result.warnings.push({
        row: rowNum,
        field: 'row',
        message: 'Rând gol ignorat'
      })
      continue
    }

    const firstName = row[fieldIndex['firstname']]?.trim() || ''
    const lastName = row[fieldIndex['lastname']]?.trim() || ''
    const cnp = row[fieldIndex['cnp']]?.trim() || ''
    const email = row[fieldIndex['email']]?.trim() || ''
    const phone = row[fieldIndex['phone']]?.trim() || ''
    const position = row[fieldIndex['position']]?.trim() || ''
    const department = row[fieldIndex['department']]?.trim() || ''
    const hireDate = row[fieldIndex['hiredate']]?.trim() || ''

    let hasError = false

    // Validate required fields
    if (!firstName) {
      result.errors.push({
        row: rowNum,
        field: 'firstName',
        message: 'Prenumele este obligatoriu',
        data: { firstName, lastName, cnp }
      })
      hasError = true
    }

    if (!lastName) {
      result.errors.push({
        row: rowNum,
        field: 'lastName',
        message: 'Numele este obligatoriu',
        data: { firstName, lastName, cnp }
      })
      hasError = true
    }

    if (!cnp) {
      result.errors.push({
        row: rowNum,
        field: 'cnp',
        message: 'CNP-ul este obligatoriu',
        data: { firstName, lastName, cnp }
      })
      hasError = true
    } else if (!validateCNP(cnp)) {
      result.errors.push({
        row: rowNum,
        field: 'cnp',
        message: 'CNP invalid (lungime sau checksum incorect)',
        data: { firstName, lastName, cnp }
      })
      hasError = true
    }

    // Validate email format if provided
    if (email && !validateEmail(email)) {
      result.errors.push({
        row: rowNum,
        field: 'email',
        message: 'Format email invalid',
        data: { firstName, lastName, cnp, email }
      })
      hasError = true
    }

    // Validate hire date format if provided
    if (hireDate && hireDate !== '') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(hireDate)) {
        result.warnings.push({
          row: rowNum,
          field: 'hireDate',
          message: `Dată angajare format invalid: ${hireDate} (așteptat YYYY-MM-DD)`
        })
      }
    }

    if (!hasError) {
      result.valid.push({
        firstName,
        lastName,
        cnp,
        email: email || undefined,
        phone: phone || undefined,
        position: position || undefined,
        department: department || undefined,
        hireDate: hireDate || undefined
      })
    }
  }

  return result
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Neautorizat' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { csvContent, orgId, confirm = false } = await req.json()

    if (!csvContent || !orgId) {
      return new Response(
        JSON.stringify({ error: 'Lipsește csvContent sau orgId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Verify user has access to organization
    const { data: membership, error: membershipError } = await supabaseClient
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', orgId)
      .single()

    if (membershipError || !membership) {
      return new Response(
        JSON.stringify({ error: 'Nu ai acces la această organizație' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Only consultants and firma_admin can import
    if (!['consultant', 'firma_admin'].includes(membership.role)) {
      return new Response(
        JSON.stringify({ error: 'Nu ai permisiunea de a importa angajați' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse and validate CSV
    const validation = validateAndParseCSV(csvContent)

    // If not confirming, just return validation results
    if (!confirm) {
      return new Response(
        JSON.stringify({
          validCount: validation.valid.length,
          errorCount: validation.errors.length,
          warningCount: validation.warnings.length,
          errors: validation.errors,
          warnings: validation.warnings,
          preview: validation.valid.slice(0, 5) // First 5 valid rows as preview
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // If confirm=true, proceed with insertion
    if (validation.errors.length > 0) {
      return new Response(
        JSON.stringify({
          error: 'CSV conține erori. Corectează erorile înainte de import.',
          errors: validation.errors
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (validation.valid.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Niciun angajat valid de importat' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check for duplicate CNPs in database
    const cnps = validation.valid.map(v => v.cnp)
    const { data: existingEmployees } = await supabaseClient
      .from('employees')
      .select('cnp')
      .eq('organization_id', orgId)
      .in('cnp', cnps)

    const existingCNPs = new Set(existingEmployees?.map(e => e.cnp) || [])
    const duplicates: string[] = []
    const toInsert = validation.valid.filter(emp => {
      if (existingCNPs.has(emp.cnp)) {
        duplicates.push(emp.cnp)
        return false
      }
      return true
    })

    if (duplicates.length > 0) {
      return new Response(
        JSON.stringify({
          error: `CNP-uri duplicate găsite în baza de date: ${duplicates.join(', ')}`,
          duplicates
        }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Prepare data for insertion
    const employeesToInsert = toInsert.map(emp => ({
      organization_id: orgId,
      first_name: emp.firstName,
      last_name: emp.lastName,
      cnp: emp.cnp,
      email: emp.email || null,
      phone: emp.phone || null,
      position: emp.position || null,
      department: emp.department || null,
      hire_date: emp.hireDate || null,
      created_by: user.id
    }))

    // Insert employees (Supabase handles transaction internally)
    const { data: insertedEmployees, error: insertError } = await supabaseClient
      .from('employees')
      .insert(employeesToInsert)
      .select('id, first_name, last_name, cnp')

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(
        JSON.stringify({
          error: 'Eroare la inserarea angajaților în baza de date',
          details: insertError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: insertedEmployees?.length || 0,
        employees: insertedEmployees,
        warnings: validation.warnings
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Bulk import error:', error)
    return new Response(
      JSON.stringify({
        error: 'Eroare server la procesarea importului',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
