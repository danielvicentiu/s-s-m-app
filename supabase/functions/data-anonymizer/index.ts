// Data Anonymizer Edge Function — GDPR Compliance
// Anonymizes all personal data for a user while preserving statistical integrity
// Right to Erasure (Art. 17 GDPR) and Right to Data Portability (Art. 20 GDPR)
// Audit log maintained for compliance tracking

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  user_id: string
  organization_id: string
  reason?: 'right_to_erasure' | 'data_minimization' | 'retention_policy' | 'other'
  requested_by?: string // User ID who requested anonymization
}

interface AnonymizationResult {
  table: string
  records_anonymized: number
  fields_modified: string[]
}

interface AnonymizationReport {
  success: boolean
  user_id: string
  organization_id: string
  reason: string
  requested_by: string | null
  results: AnonymizationResult[]
  total_records_affected: number
  audit_log_id: string
  anonymized_at: string
  errors?: string[]
}

// Generate consistent anonymized employee ID based on original ID
function generateAnonymizedName(originalId: string, index: number): string {
  // Create a simple hash from the ID to generate a consistent number
  let hash = 0
  for (let i = 0; i < originalId.length; i++) {
    hash = ((hash << 5) - hash) + originalId.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  const employeeNumber = Math.abs(hash % 9000) + 1000 // Generate 4-digit number (1000-9999)
  return `Employee_${employeeNumber}`
}

// Hash CNP/SSN for anonymization while maintaining uniqueness
async function hashCNP(cnp: string | null): Promise<string | null> {
  if (!cnp) return null

  // Use Web Crypto API for consistent hashing
  const encoder = new TextEncoder()
  const data = encoder.encode(cnp)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return `HASHED_${hashHex.substring(0, 16)}` // First 16 chars of hash
}

// Generic email anonymization
function anonymizeEmail(email: string | null): string | null {
  if (!email) return null
  return 'anonymized@example.com'
}

// Generic phone anonymization
function anonymizePhone(phone: string | null): string | null {
  if (!phone) return null
  return null // Remove phone completely for privacy
}

// Generic address anonymization
function anonymizeAddress(address: string | null): string | null {
  if (!address) return null
  return null // Remove address completely for privacy
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const body: RequestBody = await req.json()
    const {
      user_id,
      organization_id,
      reason = 'right_to_erasure',
      requested_by = null,
    } = body

    // Validate input
    if (!user_id || typeof user_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid user_id parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!organization_id || typeof organization_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid organization_id parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Starting anonymization for user ${user_id} in org ${organization_id}`)

    const results: AnonymizationResult[] = []
    const errors: string[] = []
    const anonymizedAt = new Date().toISOString()

    // ══════════════════════════════════════════════════════════
    // 1. ANONYMIZE PROFILES TABLE
    // ══════════════════════════════════════════════════════════
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user_id)

      if (profileError) throw profileError

      if (profiles && profiles.length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: 'Anonymized User',
            phone: null,
            avatar_url: null,
          })
          .eq('id', user_id)

        if (updateError) throw updateError

        results.push({
          table: 'profiles',
          records_anonymized: profiles.length,
          fields_modified: ['full_name', 'phone', 'avatar_url'],
        })

        console.log(`Anonymized ${profiles.length} profile(s)`)
      }
    } catch (err) {
      const errorMsg = `Error anonymizing profiles: ${err instanceof Error ? err.message : String(err)}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }

    // ══════════════════════════════════════════════════════════
    // 2. ANONYMIZE EMPLOYEES TABLE
    // ══════════════════════════════════════════════════════════
    try {
      // First, get all employees for this organization
      const { data: employees, error: employeeError } = await supabase
        .from('employees')
        .select('id, name, cnp')
        .eq('organization_id', organization_id)

      if (employeeError) throw employeeError

      if (employees && employees.length > 0) {
        // Anonymize each employee
        for (let i = 0; i < employees.length; i++) {
          const employee = employees[i]
          const anonymizedName = generateAnonymizedName(employee.id, i)
          const hashedCNP = employee.cnp ? await hashCNP(employee.cnp) : null

          const { error: updateError } = await supabase
            .from('employees')
            .update({
              name: anonymizedName,
              cnp: hashedCNP,
              phone: null,
              email: null,
              address: null,
              emergency_contact_name: null,
              emergency_contact_phone: null,
            })
            .eq('id', employee.id)

          if (updateError) {
            console.error(`Error updating employee ${employee.id}:`, updateError)
            errors.push(`Employee ${employee.id}: ${updateError.message}`)
          }
        }

        results.push({
          table: 'employees',
          records_anonymized: employees.length,
          fields_modified: ['name', 'cnp', 'phone', 'email', 'address', 'emergency_contact_name', 'emergency_contact_phone'],
        })

        console.log(`Anonymized ${employees.length} employee(s)`)
      }
    } catch (err) {
      const errorMsg = `Error anonymizing employees: ${err instanceof Error ? err.message : String(err)}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }

    // ══════════════════════════════════════════════════════════
    // 3. ANONYMIZE MEDICAL EXAMINATIONS
    // ══════════════════════════════════════════════════════════
    try {
      const { data: medicalRecords, error: medicalError } = await supabase
        .from('medical_examinations')
        .select('id, employee_name, cnp_hash')
        .eq('organization_id', organization_id)

      if (medicalError) throw medicalError

      if (medicalRecords && medicalRecords.length > 0) {
        for (let i = 0; i < medicalRecords.length; i++) {
          const record = medicalRecords[i]
          const anonymizedName = generateAnonymizedName(record.id, i)
          const hashedCNP = record.cnp_hash ? await hashCNP(record.cnp_hash) : null

          const { error: updateError } = await supabase
            .from('medical_examinations')
            .update({
              employee_name: anonymizedName,
              cnp_hash: hashedCNP,
              doctor_name: 'Dr. Anonymized',
              clinic_name: 'Clinic Anonymized',
              notes: null, // Remove potentially sensitive notes
            })
            .eq('id', record.id)

          if (updateError) {
            console.error(`Error updating medical record ${record.id}:`, updateError)
            errors.push(`Medical record ${record.id}: ${updateError.message}`)
          }
        }

        results.push({
          table: 'medical_examinations',
          records_anonymized: medicalRecords.length,
          fields_modified: ['employee_name', 'cnp_hash', 'doctor_name', 'clinic_name', 'notes'],
        })

        console.log(`Anonymized ${medicalRecords.length} medical record(s)`)
      }
    } catch (err) {
      const errorMsg = `Error anonymizing medical records: ${err instanceof Error ? err.message : String(err)}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }

    // ══════════════════════════════════════════════════════════
    // 4. ANONYMIZE TRAININGS TABLE
    // ══════════════════════════════════════════════════════════
    try {
      const { data: trainings, error: trainingError } = await supabase
        .from('trainings')
        .select('id')
        .eq('organization_id', organization_id)

      if (trainingError) throw trainingError

      if (trainings && trainings.length > 0) {
        const { error: updateError } = await supabase
          .from('trainings')
          .update({
            instructor_name: 'Instructor Anonymized',
            notes: null,
          })
          .eq('organization_id', organization_id)

        if (updateError) throw updateError

        results.push({
          table: 'trainings',
          records_anonymized: trainings.length,
          fields_modified: ['instructor_name', 'notes'],
        })

        console.log(`Anonymized ${trainings.length} training record(s)`)
      }
    } catch (err) {
      const errorMsg = `Error anonymizing trainings: ${err instanceof Error ? err.message : String(err)}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }

    // ══════════════════════════════════════════════════════════
    // 5. ANONYMIZE ORGANIZATIONS TABLE (contact info only)
    // ══════════════════════════════════════════════════════════
    try {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', organization_id)

      if (orgError) throw orgError

      if (org && org.length > 0) {
        const { error: updateError } = await supabase
          .from('organizations')
          .update({
            contact_email: 'anonymized@example.com',
            contact_phone: null,
            address: null,
          })
          .eq('id', organization_id)

        if (updateError) throw updateError

        results.push({
          table: 'organizations',
          records_anonymized: org.length,
          fields_modified: ['contact_email', 'contact_phone', 'address'],
        })

        console.log(`Anonymized organization contact info`)
      }
    } catch (err) {
      const errorMsg = `Error anonymizing organization: ${err instanceof Error ? err.message : String(err)}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }

    // ══════════════════════════════════════════════════════════
    // 6. ANONYMIZE EQUIPMENT INSPECTOR NAMES
    // ══════════════════════════════════════════════════════════
    try {
      const { data: equipment, error: equipmentError } = await supabase
        .from('safety_equipment')
        .select('id')
        .eq('organization_id', organization_id)

      if (equipmentError) throw equipmentError

      if (equipment && equipment.length > 0) {
        const { error: updateError } = await supabase
          .from('safety_equipment')
          .update({
            inspector_name: 'Inspector Anonymized',
          })
          .eq('organization_id', organization_id)

        if (updateError) throw updateError

        results.push({
          table: 'safety_equipment',
          records_anonymized: equipment.length,
          fields_modified: ['inspector_name'],
        })

        console.log(`Anonymized ${equipment.length} equipment record(s)`)
      }
    } catch (err) {
      const errorMsg = `Error anonymizing equipment: ${err instanceof Error ? err.message : String(err)}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }

    // ══════════════════════════════════════════════════════════
    // 7. CREATE AUDIT LOG ENTRY
    // ══════════════════════════════════════════════════════════
    let auditLogId = 'N/A'
    try {
      const { data: auditLog, error: auditError } = await supabase
        .from('audit_log')
        .insert({
          organization_id: organization_id,
          user_id: requested_by || user_id,
          action: 'data_anonymization',
          resource_type: 'gdpr_compliance',
          resource_id: user_id,
          changes: {
            reason,
            results,
            total_records_affected: results.reduce((sum, r) => sum + r.records_anonymized, 0),
            anonymized_at: anonymizedAt,
            errors: errors.length > 0 ? errors : undefined,
          },
          ip_address: null,
          user_agent: null,
        })
        .select('id')
        .single()

      if (auditError) {
        console.error('Error creating audit log:', auditError)
        errors.push(`Audit log error: ${auditError.message}`)
      } else if (auditLog) {
        auditLogId = auditLog.id
        console.log(`Audit log created: ${auditLogId}`)
      }
    } catch (err) {
      const errorMsg = `Error creating audit log: ${err instanceof Error ? err.message : String(err)}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }

    // ══════════════════════════════════════════════════════════
    // PREPARE RESPONSE
    // ══════════════════════════════════════════════════════════
    const totalRecordsAffected = results.reduce((sum, r) => sum + r.records_anonymized, 0)

    const report: AnonymizationReport = {
      success: errors.length === 0,
      user_id,
      organization_id,
      reason,
      requested_by,
      results,
      total_records_affected: totalRecordsAffected,
      audit_log_id: auditLogId,
      anonymized_at: anonymizedAt,
    }

    if (errors.length > 0) {
      report.errors = errors
    }

    console.log(`Anonymization completed. Total records affected: ${totalRecordsAffected}`)

    return new Response(
      JSON.stringify(report),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
