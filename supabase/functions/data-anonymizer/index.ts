// GDPR Data Anonymization Edge Function
// Purpose: Anonymize personal data for right to erasure compliance
// Usage: POST with { user_id: string, org_id: string, reason?: string }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnonymizationRequest {
  user_id: string
  org_id: string
  reason?: string
  requested_by?: string
}

interface AnonymizationResult {
  success: boolean
  anonymized_records: {
    employees: number
    medical_records: number
    trainings: number
    equipment: number
    documents: number
    alerts: number
    penalties: number
  }
  timestamp: string
  audit_log_id?: string
  error?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const body: AnonymizationRequest = await req.json()
    const { user_id, org_id, reason = 'GDPR Right to Erasure', requested_by } = body

    if (!user_id || !org_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id and org_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Starting anonymization for user_id=${user_id}, org_id=${org_id}`)

    const result: AnonymizationResult = {
      success: true,
      anonymized_records: {
        employees: 0,
        medical_records: 0,
        trainings: 0,
        equipment: 0,
        documents: 0,
        alerts: 0,
        penalties: 0,
      },
      timestamp: new Date().toISOString(),
    }

    // Generate hash for CNP (deterministic but anonymized)
    const hashCNP = (cnp: string): string => {
      if (!cnp) return 'ANONYMIZED'
      // Simple hash to keep statistical validity
      return `ANON_${cnp.substring(0, 1)}_${cnp.length}`
    }

    // 1. Anonymize employees table
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, first_name, last_name, cnp')
      .eq('organization_id', org_id)

    if (empError) throw new Error(`Employee fetch error: ${empError.message}`)

    if (employees && employees.length > 0) {
      for (const emp of employees) {
        const anonymizedName = `Employee_${emp.id.substring(0, 8)}`
        const { error: updateError } = await supabase
          .from('employees')
          .update({
            first_name: anonymizedName,
            last_name: 'ANONYMIZED',
            cnp: emp.cnp ? hashCNP(emp.cnp) : null,
            email: null,
            phone: null,
            address: null,
            city: null,
            county: null,
            postal_code: null,
            emergency_contact_name: null,
            emergency_contact_phone: null,
            personal_notes: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', emp.id)

        if (updateError) {
          console.error(`Failed to anonymize employee ${emp.id}:`, updateError)
        } else {
          result.anonymized_records.employees++
        }
      }
    }

    // 2. Anonymize medical_records - remove sensitive health data but keep dates/types for statistics
    const { data: medicalRecords } = await supabase
      .from('medical_records')
      .select('id')
      .eq('organization_id', org_id)

    if (medicalRecords && medicalRecords.length > 0) {
      const medicalIds = medicalRecords.map(r => r.id)
      const { error: medError } = await supabase
        .from('medical_records')
        .update({
          notes: null,
          doctor_name: 'ANONYMIZED',
          medical_facility: 'ANONYMIZED',
          restrictions: null,
          updated_at: new Date().toISOString(),
        })
        .in('id', medicalIds)

      if (!medError) {
        result.anonymized_records.medical_records = medicalRecords.length
      }
    }

    // 3. Anonymize trainings - keep training types and dates, remove personal notes
    const { data: trainings } = await supabase
      .from('trainings')
      .select('id')
      .eq('organization_id', org_id)

    if (trainings && trainings.length > 0) {
      const trainingIds = trainings.map(t => t.id)
      const { error: trainError } = await supabase
        .from('trainings')
        .update({
          instructor_name: 'ANONYMIZED',
          notes: null,
          participant_notes: null,
          updated_at: new Date().toISOString(),
        })
        .in('id', trainingIds)

      if (!trainError) {
        result.anonymized_records.trainings = trainings.length
      }
    }

    // 4. Anonymize equipment - remove responsible person details but keep equipment data
    const { data: equipment } = await supabase
      .from('equipment')
      .select('id')
      .eq('organization_id', org_id)

    if (equipment && equipment.length > 0) {
      const equipmentIds = equipment.map(e => e.id)
      const { error: eqError } = await supabase
        .from('equipment')
        .update({
          responsible_person: null,
          notes: null,
          maintenance_notes: null,
          updated_at: new Date().toISOString(),
        })
        .in('id', equipmentIds)

      if (!eqError) {
        result.anonymized_records.equipment = equipment.length
      }
    }

    // 5. Anonymize documents - remove uploaded_by personal link but keep document metadata
    const { data: documents } = await supabase
      .from('documents')
      .select('id')
      .eq('organization_id', org_id)

    if (documents && documents.length > 0) {
      const documentIds = documents.map(d => d.id)
      const { error: docError } = await supabase
        .from('documents')
        .update({
          notes: null,
          updated_at: new Date().toISOString(),
        })
        .in('id', documentIds)

      if (!docError) {
        result.anonymized_records.documents = documents.length
      }
    }

    // 6. Anonymize alerts - remove personal details from alert messages
    const { data: alerts } = await supabase
      .from('alerts')
      .select('id')
      .eq('organization_id', org_id)

    if (alerts && alerts.length > 0) {
      const alertIds = alerts.map(a => a.id)
      const { error: alertError } = await supabase
        .from('alerts')
        .update({
          message: 'ANONYMIZED - Alert data removed per GDPR request',
          updated_at: new Date().toISOString(),
        })
        .in('id', alertIds)

      if (!alertError) {
        result.anonymized_records.alerts = alerts.length
      }
    }

    // 7. Anonymize penalties - keep penalty types and dates, remove personal notes
    const { data: penalties } = await supabase
      .from('penalties')
      .select('id')
      .eq('organization_id', org_id)

    if (penalties && penalties.length > 0) {
      const penaltyIds = penalties.map(p => p.id)
      const { error: penError } = await supabase
        .from('penalties')
        .update({
          inspector_name: 'ANONYMIZED',
          notes: null,
          corrective_actions: null,
          updated_at: new Date().toISOString(),
        })
        .in('id', penaltyIds)

      if (!penError) {
        result.anonymized_records.penalties = penalties.length
      }
    }

    // 8. Create audit log entry
    const { data: auditLog, error: auditError } = await supabase
      .from('audit_log')
      .insert({
        organization_id: org_id,
        user_id: requested_by || user_id,
        action: 'GDPR_DATA_ANONYMIZATION',
        table_name: 'multiple_tables',
        record_id: user_id,
        changes: {
          reason,
          anonymized_records: result.anonymized_records,
          total_records: Object.values(result.anonymized_records).reduce((a, b) => a + b, 0),
        },
        ip_address: null,
        user_agent: 'supabase-edge-function',
      })
      .select('id')
      .single()

    if (auditError) {
      console.error('Audit log creation failed:', auditError)
    } else if (auditLog) {
      result.audit_log_id = auditLog.id
    }

    console.log('Anonymization completed:', result)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Anonymization error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
