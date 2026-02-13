// lib/services/tenant-provisioning.ts
// Automated tenant setup with rollback capabilities
// Handles organization creation, departments, alerts, compliance, storage, and welcome email

import { createSupabaseServer } from '@/lib/supabase/server'
import type { CountryCode, Organization } from '@/lib/types'

export interface TenantProvisionData {
  // Organization basics
  name: string
  cui: string | null
  address: string | null
  county: string | null
  contact_email: string | null
  contact_phone: string | null
  country_code: CountryCode

  // Owner user
  owner_user_id: string
  owner_full_name: string
  owner_email: string

  // Optional configs
  preferred_channels?: string[]
  employee_count?: number
}

export interface ProvisionResult {
  success: boolean
  organization_id?: string
  organization?: Organization
  membership_id?: string
  steps_completed: string[]
  error?: string
  rollback_performed?: boolean
}

interface RollbackState {
  organization_id?: string
  membership_id?: string
  departments_created?: string[]
  alert_rules_created?: string[]
  storage_bucket_created?: boolean
  compliance_items_created?: string[]
}

/**
 * Provizionează un tenant complet (organizație + configurare inițială)
 * Cu rollback automat în caz de eroare
 */
export async function provisionTenant(
  data: TenantProvisionData
): Promise<ProvisionResult> {
  const supabase = await createSupabaseServer()
  const stepsCompleted: string[] = []
  const rollbackState: RollbackState = {}

  try {
    // ─────────────────────────────────────────────────────────
    // STEP 1: Create Organization
    // ─────────────────────────────────────────────────────────
    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: data.name,
        cui: data.cui,
        address: data.address,
        county: data.county,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        preferred_channels: data.preferred_channels || ['email'],
        employee_count: data.employee_count || 0,
        data_completeness: 0,
        exposure_score: 'necalculat',
        cooperation_status: 'active'
      })
      .select()
      .single()

    if (orgError || !newOrg) {
      throw new Error(`Failed to create organization: ${orgError?.message || 'Unknown error'}`)
    }

    rollbackState.organization_id = newOrg.id
    stepsCompleted.push('organization_created')

    // ─────────────────────────────────────────────────────────
    // STEP 2: Create Owner Membership
    // ─────────────────────────────────────────────────────────
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: data.owner_user_id,
        organization_id: newOrg.id,
        role: 'firma_admin', // Owner gets firma_admin role
        is_active: true
      })
      .select()
      .single()

    if (membershipError || !membership) {
      throw new Error(`Failed to create membership: ${membershipError?.message || 'Unknown error'}`)
    }

    rollbackState.membership_id = membership.id
    stepsCompleted.push('membership_created')

    // ─────────────────────────────────────────────────────────
    // STEP 3: Create Default Departments
    // ─────────────────────────────────────────────────────────
    const defaultDepartments = [
      { name: 'Administrație', code: 'ADMIN' },
      { name: 'Producție', code: 'PROD' },
      { name: 'Logistică', code: 'LOG' },
      { name: 'Vânzări', code: 'SALES' }
    ]

    const departmentsToInsert = defaultDepartments.map(dept => ({
      organization_id: newOrg.id,
      name: dept.name,
      code: dept.code,
      is_active: true
    }))

    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .insert(departmentsToInsert)
      .select()

    if (deptError) {
      console.warn('Warning: Failed to create departments:', deptError.message)
      // Non-critical, continue
    } else if (departments) {
      rollbackState.departments_created = departments.map(d => d.id)
      stepsCompleted.push('departments_created')
    }

    // ─────────────────────────────────────────────────────────
    // STEP 4: Create Default Alert Rules
    // ─────────────────────────────────────────────────────────
    const defaultAlertRules = [
      {
        organization_id: newOrg.id,
        alert_type: 'medical_expiry',
        days_before: 30,
        severity: 'warning',
        is_enabled: true,
        notify_channels: ['email']
      },
      {
        organization_id: newOrg.id,
        alert_type: 'medical_expiry',
        days_before: 7,
        severity: 'critical',
        is_enabled: true,
        notify_channels: ['email', 'whatsapp']
      },
      {
        organization_id: newOrg.id,
        alert_type: 'equipment_inspection',
        days_before: 30,
        severity: 'warning',
        is_enabled: true,
        notify_channels: ['email']
      },
      {
        organization_id: newOrg.id,
        alert_type: 'training_expiry',
        days_before: 15,
        severity: 'warning',
        is_enabled: true,
        notify_channels: ['email']
      }
    ]

    const { data: alertRules, error: alertError } = await supabase
      .from('alert_rules')
      .insert(defaultAlertRules)
      .select()

    if (alertError) {
      console.warn('Warning: Failed to create alert rules:', alertError.message)
      // Non-critical, continue
    } else if (alertRules) {
      rollbackState.alert_rules_created = alertRules.map(r => r.id)
      stepsCompleted.push('alert_rules_created')
    }

    // ─────────────────────────────────────────────────────────
    // STEP 5: Generate Initial Compliance Checklist
    // ─────────────────────────────────────────────────────────
    const complianceItems = [
      {
        organization_id: newOrg.id,
        category: 'SSM',
        title: 'Verificare Fișe Medicale Angajați',
        description: 'Asigurați-vă că toți angajații au control medical valabil',
        priority: 'high',
        status: 'pending',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      },
      {
        organization_id: newOrg.id,
        category: 'PSI',
        title: 'Verificare Stingătoare',
        description: 'Verificați că toate stingătoarele sunt verificate și în termen',
        priority: 'high',
        status: 'pending',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        organization_id: newOrg.id,
        category: 'SSM',
        title: 'Instruire Angajați Noi',
        description: 'Programați instruirea SSM pentru angajații din ultimele 30 zile',
        priority: 'medium',
        status: 'pending',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
      },
      {
        organization_id: newOrg.id,
        category: 'ADMIN',
        title: 'Configurare Completă Profil Organizație',
        description: 'Completați toate datele organizației pentru a crește scorul de completitudine',
        priority: 'low',
        status: 'pending',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }
    ]

    const { data: complianceList, error: complianceError } = await supabase
      .from('compliance_checklist')
      .insert(complianceItems)
      .select()

    if (complianceError) {
      console.warn('Warning: Failed to create compliance checklist:', complianceError.message)
      // Non-critical, continue
    } else if (complianceList) {
      rollbackState.compliance_items_created = complianceList.map(c => c.id)
      stepsCompleted.push('compliance_checklist_created')
    }

    // ─────────────────────────────────────────────────────────
    // STEP 6: Setup Storage Bucket
    // ─────────────────────────────────────────────────────────
    const bucketName = `org-${newOrg.id}`

    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
      })

    if (bucketError) {
      console.warn('Warning: Failed to create storage bucket:', bucketError.message)
      // Non-critical, continue
    } else {
      rollbackState.storage_bucket_created = true
      stepsCompleted.push('storage_bucket_created')

      // Create default folders
      const defaultFolders = ['documents', 'medical', 'equipment', 'trainings']
      for (const folder of defaultFolders) {
        await supabase.storage
          .from(bucketName)
          .upload(`${folder}/.keep`, new Blob([''], { type: 'text/plain' }), {
            upsert: false
          })
      }
    }

    // ─────────────────────────────────────────────────────────
    // STEP 7: Send Welcome Email
    // ─────────────────────────────────────────────────────────
    try {
      await sendWelcomeEmail({
        to: data.owner_email,
        owner_name: data.owner_full_name,
        organization_name: data.name,
        organization_id: newOrg.id
      })
      stepsCompleted.push('welcome_email_sent')
    } catch (emailError) {
      console.warn('Warning: Failed to send welcome email:', emailError)
      // Non-critical, continue
    }

    // ─────────────────────────────────────────────────────────
    // SUCCESS
    // ─────────────────────────────────────────────────────────
    return {
      success: true,
      organization_id: newOrg.id,
      organization: newOrg as Organization,
      membership_id: membership.id,
      steps_completed: stepsCompleted
    }

  } catch (error) {
    // ─────────────────────────────────────────────────────────
    // ROLLBACK ON FAILURE
    // ─────────────────────────────────────────────────────────
    console.error('Tenant provisioning failed, initiating rollback:', error)

    const rollbackSuccess = await performRollback(rollbackState)

    return {
      success: false,
      steps_completed: stepsCompleted,
      error: error instanceof Error ? error.message : 'Unknown error during provisioning',
      rollback_performed: rollbackSuccess
    }
  }
}

/**
 * Rollback: șterge toate entitățile create în timpul provizionării eșuate
 */
async function performRollback(state: RollbackState): Promise<boolean> {
  const supabase = await createSupabaseServer()
  let allSuccess = true

  try {
    // Delete compliance checklist items
    if (state.compliance_items_created && state.compliance_items_created.length > 0) {
      const { error } = await supabase
        .from('compliance_checklist')
        .delete()
        .in('id', state.compliance_items_created)

      if (error) {
        console.error('Rollback: Failed to delete compliance items:', error.message)
        allSuccess = false
      }
    }

    // Delete alert rules
    if (state.alert_rules_created && state.alert_rules_created.length > 0) {
      const { error } = await supabase
        .from('alert_rules')
        .delete()
        .in('id', state.alert_rules_created)

      if (error) {
        console.error('Rollback: Failed to delete alert rules:', error.message)
        allSuccess = false
      }
    }

    // Delete departments
    if (state.departments_created && state.departments_created.length > 0) {
      const { error } = await supabase
        .from('departments')
        .delete()
        .in('id', state.departments_created)

      if (error) {
        console.error('Rollback: Failed to delete departments:', error.message)
        allSuccess = false
      }
    }

    // Delete storage bucket
    if (state.storage_bucket_created && state.organization_id) {
      const bucketName = `org-${state.organization_id}`
      const { error } = await supabase.storage.deleteBucket(bucketName)

      if (error) {
        console.error('Rollback: Failed to delete storage bucket:', error.message)
        allSuccess = false
      }
    }

    // Delete membership
    if (state.membership_id) {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('id', state.membership_id)

      if (error) {
        console.error('Rollback: Failed to delete membership:', error.message)
        allSuccess = false
      }
    }

    // Delete organization (CASCADE will handle remaining dependencies)
    if (state.organization_id) {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', state.organization_id)

      if (error) {
        console.error('Rollback: Failed to delete organization:', error.message)
        allSuccess = false
      }
    }

    return allSuccess
  } catch (error) {
    console.error('Critical error during rollback:', error)
    return false
  }
}

/**
 * Trimite email de bun venit noului tenant
 */
async function sendWelcomeEmail(params: {
  to: string
  owner_name: string
  organization_name: string
  organization_id: string
}): Promise<void> {
  const welcomeEmailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .checklist { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .checklist-item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Bine ați venit la S-S-M.RO!</h1>
    </div>
    <div class="content">
      <p>Bună, <strong>${params.owner_name}</strong>!</p>

      <p>Felicitări! Organizația <strong>${params.organization_name}</strong> a fost configurată cu succes pe platforma S-S-M.RO.</p>

      <p>Sunteți acum gata să gestionați conformitatea SSM și PSI în cel mai simplu mod posibil.</p>

      <a href="https://app.s-s-m.ro/dashboard" class="button">Accesează Dashboard-ul →</a>

      <div class="checklist">
        <h3>✅ Pași următori:</h3>
        <div class="checklist-item">
          <strong>1. Completați profilul organizației</strong><br>
          Adăugați detalii complete pentru un scor mai bun de completitudine
        </div>
        <div class="checklist-item">
          <strong>2. Adăugați angajații</strong><br>
          Importați sau adăugați manual lista de angajați
        </div>
        <div class="checklist-item">
          <strong>3. Încărcați fișele medicale</strong><br>
          Digitalizați controalele medicale existente
        </div>
        <div class="checklist-item">
          <strong>4. Verificați echipamentele PSI</strong><br>
          Inventariați stingătoarele și echipamentele de siguranță
        </div>
        <div class="checklist-item">
          <strong>5. Configurați alertele</strong><br>
          Setați notificări automate pentru scadențe
        </div>
      </div>

      <p><strong>💡 Aveți nevoie de ajutor?</strong><br>
      Consultați <a href="https://app.s-s-m.ro/help">Centrul de Ajutor</a> sau contactați echipa noastră la <a href="mailto:support@s-s-m.ro">support@s-s-m.ro</a></p>

      <div class="footer">
        <p>© 2026 S-S-M.RO — Platforma digitală SSM/PSI<br>
        <a href="https://s-s-m.ro">s-s-m.ro</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()

  // Send via Supabase Edge Function or direct email service
  // For now, log to console (replace with actual email service call)
  const emailPayload = {
    to: params.to,
    from: 'alerte@s-s-m.ro',
    subject: `Bun venit la S-S-M.RO — ${params.organization_name}`,
    html: welcomeEmailBody
  }

  // TODO: Integrate with Resend API or Supabase Edge Function
  // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailPayload) })

  console.log('Welcome email prepared for:', params.to)
  console.log('Email payload:', emailPayload)
}

/**
 * Helper: Verifică dacă o organizație există deja (după CUI)
 */
export async function checkOrganizationExists(cui: string): Promise<{
  exists: boolean
  organization?: Organization
}> {
  if (!cui) {
    return { exists: false }
  }

  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('cui', cui)
    .single()

  if (error || !data) {
    return { exists: false }
  }

  return { exists: true, organization: data as Organization }
}

/**
 * Helper: Obține statistici tenant după provizionare
 */
export async function getTenantStats(organizationId: string): Promise<{
  employee_count: number
  medical_records_count: number
  equipment_count: number
  pending_alerts: number
  data_completeness: number
}> {
  const supabase = await createSupabaseServer()

  // Get counts in parallel
  const [employees, medicals, equipment, alerts, org] = await Promise.all([
    supabase.from('employees').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('medical_examinations').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('safety_equipment').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('compliance_checklist').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId).eq('status', 'pending'),
    supabase.from('organizations').select('data_completeness').eq('id', organizationId).single()
  ])

  return {
    employee_count: employees.count || 0,
    medical_records_count: medicals.count || 0,
    equipment_count: equipment.count || 0,
    pending_alerts: alerts.count || 0,
    data_completeness: org.data?.data_completeness || 0
  }
}
