// S-S-M.RO — GDPR DATA EXPORT SERVICE
// GDPR Article 15 - Right of Access: export ALL personal data
// Generates JSON + PDF summary with 7-day expiry link
// Data: 13 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import crypto from 'crypto'
import { jsPDF } from 'jspdf'

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface GdprDataExport {
  metadata: {
    exportDate: string
    userId: string
    organizationId: string
    requestedBy: string
    dataVersion: string
  }
  personalData: {
    profile: any
    preferences: any[]
    memberships: any[]
    employees: any[]
    trainings: any[]
    medicalRecords: any[]
    documents: any[]
    activityLog: any[]
    apiKeys: any[]
    webhooks: any[]
    ssoSessions: any[]
    invoices: any[]
    organizationObligations: any[]
    emailDeliveryLog: any[]
    whatsappDeliveryLog: any[]
    notifications: any[]
  }
  summary: {
    totalRecords: number
    recordsByCategory: Record<string, number>
    oldestRecord: string | null
    newestRecord: string | null
  }
}

export interface GdprExportResult {
  success: boolean
  exportUrl?: string
  expiresAt?: string
  filePath?: string
  error?: string
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT FUNCTION
// ─────────────────────────────────────────────────────────────

/**
 * Generate complete GDPR data export for a user
 * Collects ALL personal data across all tables
 * Uploads to Supabase Storage with 7-day expiry
 */
export async function generateDataExport(
  userId: string,
  organizationId: string
): Promise<GdprExportResult> {
  try {
    const supabase = await createSupabaseServer()

    // Get current user to verify permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify user has access to this data (either own data or admin)
    if (user.id !== userId) {
      // Check if user is admin/super_admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id)
        .eq('organization_id', organizationId)
        .single()

      const isAdmin = userRole?.roles?.name === 'super_admin' ||
                      userRole?.roles?.name === 'consultant_ssm' ||
                      userRole?.roles?.name === 'firma_admin'

      if (!isAdmin) {
        return { success: false, error: 'Unauthorized: can only export own data' }
      }
    }

    console.log(`[GDPR Export] Starting data export for user ${userId} in org ${organizationId}`)

    // Collect all personal data
    const exportData = await collectAllPersonalData(userId, organizationId)

    // Generate JSON file
    const jsonContent = JSON.stringify(exportData, null, 2)
    const jsonBlob = Buffer.from(jsonContent, 'utf-8')

    // Generate PDF summary
    const pdfContent = await generatePdfSummary(exportData)

    // Upload to Supabase Storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const exportId = crypto.randomBytes(8).toString('hex')
    const basePath = `gdpr-exports/${organizationId}/${userId}/${exportId}`

    // Ensure bucket exists
    await ensureGdprExportBucket(supabase)

    // Upload JSON
    const jsonPath = `${basePath}/data-export-${timestamp}.json`
    const { error: jsonUploadError } = await supabase.storage
      .from('gdpr-exports')
      .upload(jsonPath, jsonBlob, {
        contentType: 'application/json',
        upsert: false,
      })

    if (jsonUploadError) {
      console.error('[GDPR Export] Failed to upload JSON:', jsonUploadError)
      return { success: false, error: `Upload failed: ${jsonUploadError.message}` }
    }

    // Upload PDF
    const pdfPath = `${basePath}/summary-${timestamp}.pdf`
    const { error: pdfUploadError } = await supabase.storage
      .from('gdpr-exports')
      .upload(pdfPath, pdfContent, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (pdfUploadError) {
      console.error('[GDPR Export] Failed to upload PDF:', pdfUploadError)
    }

    // Generate signed URL with 7-day expiry (GDPR requirement)
    const expiresIn = 7 * 24 * 60 * 60 // 7 days in seconds
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('gdpr-exports')
      .createSignedUrl(jsonPath, expiresIn)

    if (urlError) {
      console.error('[GDPR Export] Failed to create signed URL:', urlError)
      return { success: false, error: `URL generation failed: ${urlError.message}` }
    }

    // Log export in audit log
    await logGdprExport(userId, organizationId, jsonPath, exportData.summary.totalRecords)

    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    console.log(`[GDPR Export] Export completed: ${jsonPath}`)
    console.log(`[GDPR Export] Total records: ${exportData.summary.totalRecords}`)
    console.log(`[GDPR Export] Expires at: ${expiresAt}`)

    return {
      success: true,
      exportUrl: signedUrl.signedUrl,
      expiresAt,
      filePath: jsonPath,
    }

  } catch (error) {
    console.error('[GDPR Export] Fatal error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ─────────────────────────────────────────────────────────────
// DATA COLLECTION FUNCTIONS
// ─────────────────────────────────────────────────────────────

async function collectAllPersonalData(
  userId: string,
  organizationId: string
): Promise<GdprDataExport> {
  const supabase = await createSupabaseServer()
  const exportDate = new Date().toISOString()

  // 1. Profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  // 2. User preferences
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)

  // 3. Memberships (all organizations)
  const { data: memberships } = await supabase
    .from('memberships')
    .select('*, organizations(id, name, cui)')
    .eq('user_id', userId)

  // 4. Employee records (if user is an employee)
  // Note: employees table might link via CNP or name, not direct user_id
  let employees: any[] = []
  if (profile?.email) {
    const { data: employeeData } = await supabase
      .from('employees')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('email', profile.email)
    employees = employeeData || []
  }

  // 5. Training records
  const { data: trainings } = await supabase
    .from('training_sessions')
    .select('*, training_assignments(*), training_modules(*)')
    .eq('user_id', userId)

  // 6. Medical records (linked via employee)
  const employeeIds = employees?.map(e => e.id) || []
  let medicalRecords: any[] = []
  if (employeeIds.length > 0) {
    const { data: medical } = await supabase
      .from('medical_records')
      .select('*')
      .eq('organization_id', organizationId)
      .in('employee_id', employeeIds)
    medicalRecords = medical || []
  }

  // 7. Documents generated by/for user
  const { data: documents } = await supabase
    .from('generated_documents')
    .select('*')
    .eq('organization_id', organizationId)
    .or(`generated_by.eq.${userId}`)

  // 8. Activity log (audit trail)
  const { data: activityLog } = await supabase
    .from('audit_log')
    .select('*')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(1000) // Last 1000 activities

  // 9. API keys created by user
  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('id, name, description, permissions, created_at, last_used_at, total_requests')
    .eq('created_by', userId)
    .eq('organization_id', organizationId)

  // 10. Webhooks configured
  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('id, url, events, is_active, created_at')
    .eq('created_by', userId)
    .eq('organization_id', organizationId)

  // 11. SSO sessions
  const { data: ssoSessions } = await supabase
    .from('sso_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  // 12. Invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('organization_id', organizationId)

  // 13. Organization obligations (compliance data)
  const { data: orgObligations } = await supabase
    .from('organization_obligations')
    .select('*, obligations(*)')
    .eq('organization_id', organizationId)

  // 14. Email delivery log
  const { data: emailLog } = await supabase
    .from('email_delivery_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(500)

  // 15. WhatsApp delivery log
  const { data: whatsappLog } = await supabase
    .from('whatsapp_delivery_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(500)

  // 16. Notification log
  const { data: notifications } = await supabase
    .from('notification_log')
    .select('*')
    .eq('organization_id', organizationId)
    .order('sent_at', { ascending: false })
    .limit(500)

  // Compile export data
  const personalData = {
    profile: profile || null,
    preferences: preferences || [],
    memberships: memberships || [],
    employees: employees || [],
    trainings: trainings || [],
    medicalRecords: medicalRecords || [],
    documents: documents || [],
    activityLog: activityLog || [],
    apiKeys: apiKeys || [],
    webhooks: webhooks || [],
    ssoSessions: ssoSessions || [],
    invoices: invoices || [],
    organizationObligations: orgObligations || [],
    emailDeliveryLog: emailLog || [],
    whatsappDeliveryLog: whatsappLog || [],
    notifications: notifications || [],
  }

  // Calculate summary
  const recordsByCategory: Record<string, number> = {}
  let totalRecords = 0
  let allDates: string[] = []

  Object.entries(personalData).forEach(([category, data]) => {
    const count = Array.isArray(data) ? data.length : (data ? 1 : 0)
    recordsByCategory[category] = count
    totalRecords += count

    // Collect dates
    if (Array.isArray(data)) {
      data.forEach((record: any) => {
        if (record.created_at) allDates.push(record.created_at)
      })
    } else if (data?.created_at) {
      allDates.push(data.created_at)
    }
  })

  allDates.sort()
  const oldestRecord = allDates.length > 0 ? allDates[0] : null
  const newestRecord = allDates.length > 0 ? allDates[allDates.length - 1] : null

  const exportData: GdprDataExport = {
    metadata: {
      exportDate,
      userId,
      organizationId,
      requestedBy: userId,
      dataVersion: '1.0',
    },
    personalData,
    summary: {
      totalRecords,
      recordsByCategory,
      oldestRecord,
      newestRecord,
    },
  }

  return exportData
}

// ─────────────────────────────────────────────────────────────
// PDF GENERATION
// ─────────────────────────────────────────────────────────────

async function generatePdfSummary(exportData: GdprDataExport): Promise<Buffer> {
  const doc = new jsPDF()

  let yPos = 20

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('GDPR DATA EXPORT SUMMARY', 105, yPos, { align: 'center' })
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('GDPR Article 15 - Right of Access', 105, yPos, { align: 'center' })
  yPos += 15

  // Metadata Section
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Export Information', 20, yPos)
  yPos += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Export Date: ${new Date(exportData.metadata.exportDate).toLocaleString('ro-RO')}`, 20, yPos)
  yPos += 6
  doc.text(`User ID: ${exportData.metadata.userId}`, 20, yPos)
  yPos += 6
  doc.text(`Organization ID: ${exportData.metadata.organizationId}`, 20, yPos)
  yPos += 10

  // Summary Section
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Records: ${exportData.summary.totalRecords}`, 20, yPos)
  yPos += 10

  // Data by Category
  doc.setFontSize(11)
  doc.text('Data by Category:', 20, yPos)
  yPos += 7

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  Object.entries(exportData.summary.recordsByCategory).forEach(([category, count]) => {
    if (count > 0) {
      const displayName = category
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
      doc.text(`  ${displayName}: ${count} records`, 25, yPos)
      yPos += 5
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
    }
  })
  yPos += 5

  // Date Range
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Date Range:', 20, yPos)
  yPos += 7

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const oldestDate = exportData.summary.oldestRecord
    ? new Date(exportData.summary.oldestRecord).toLocaleString('ro-RO')
    : 'N/A'
  const newestDate = exportData.summary.newestRecord
    ? new Date(exportData.summary.newestRecord).toLocaleString('ro-RO')
    : 'N/A'
  doc.text(`  Oldest record: ${oldestDate}`, 20, yPos)
  yPos += 5
  doc.text(`  Newest record: ${newestDate}`, 20, yPos)
  yPos += 10

  // Profile Data
  if (exportData.personalData.profile) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Profile Information:', 20, yPos)
    yPos += 7

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`  Name: ${exportData.personalData.profile.full_name || 'N/A'}`, 20, yPos)
    yPos += 5
    doc.text(`  Email: ${exportData.personalData.profile.email || 'N/A'}`, 20, yPos)
    yPos += 5
    doc.text(`  Phone: ${exportData.personalData.profile.phone || 'N/A'}`, 20, yPos)
    yPos += 10
  }

  // Add new page for rights
  if (yPos > 200) {
    doc.addPage()
    yPos = 20
  }

  // GDPR Rights
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Your GDPR Rights:', 20, yPos)
  yPos += 7

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const rights = [
    'Right to rectification (Article 16) - Request correction of inaccurate data',
    'Right to erasure (Article 17) - Request deletion of your data',
    'Right to restrict processing (Article 18) - Limit how we use your data',
    'Right to data portability (Article 20) - Receive your data in a structured format',
    'Right to object (Article 21) - Object to processing of your data',
  ]

  rights.forEach((right) => {
    const lines = doc.splitTextToSize(right, 170)
    lines.forEach((line: string) => {
      doc.text(`  • ${line}`, 20, yPos)
      yPos += 5
    })
  })
  yPos += 5

  doc.text('To exercise your rights, contact: gdpr@s-s-m.ro', 20, yPos)
  yPos += 10

  // Footer
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text('This is a summary. Full data is available in the JSON export.', 105, yPos, { align: 'center' })
  yPos += 5
  doc.text('Generated by s-s-m.ro platform - GDPR compliant', 105, yPos, { align: 'center' })

  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer')
  return Buffer.from(pdfOutput)
}

// ─────────────────────────────────────────────────────────────
// STORAGE BUCKET SETUP
// ─────────────────────────────────────────────────────────────

async function ensureGdprExportBucket(supabase: any): Promise<void> {
  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some((b: any) => b.name === 'gdpr-exports')

  if (!bucketExists) {
    // Create bucket (private)
    const { error } = await supabase.storage.createBucket('gdpr-exports', {
      public: false,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['application/json', 'application/pdf'],
    })

    if (error && !error.message.includes('already exists')) {
      console.error('[GDPR Export] Failed to create bucket:', error)
    }
  }
}

// ─────────────────────────────────────────────────────────────
// AUDIT LOGGING
// ─────────────────────────────────────────────────────────────

async function logGdprExport(
  userId: string,
  organizationId: string,
  filePath: string,
  recordCount: number
): Promise<void> {
  const supabase = await createSupabaseServer()

  await supabase.from('audit_log').insert({
    organization_id: organizationId,
    user_id: userId,
    action: 'gdpr_data_export',
    resource_type: 'user_data',
    resource_id: userId,
    details: {
      filePath,
      recordCount,
      exportDate: new Date().toISOString(),
    },
    ip_address: null,
    user_agent: null,
  })
}

// ─────────────────────────────────────────────────────────────
// CLEANUP EXPIRED EXPORTS
// ─────────────────────────────────────────────────────────────

/**
 * Delete GDPR exports older than 7 days
 * Should be called via cron job
 */
export async function cleanupExpiredExports(): Promise<{
  deletedCount: number
  errors: string[]
}> {
  const supabase = await createSupabaseServer()
  const errors: string[] = []
  let deletedCount = 0

  try {
    // List all files in gdpr-exports bucket
    const { data: files, error: listError } = await supabase.storage
      .from('gdpr-exports')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'asc' },
      })

    if (listError) {
      errors.push(`Failed to list files: ${listError.message}`)
      return { deletedCount: 0, errors }
    }

    const now = Date.now()
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000

    // Delete files older than 7 days
    for (const file of files || []) {
      const fileAge = now - new Date(file.created_at).getTime()
      if (fileAge > sevenDaysMs) {
        const { error: deleteError } = await supabase.storage
          .from('gdpr-exports')
          .remove([file.name])

        if (deleteError) {
          errors.push(`Failed to delete ${file.name}: ${deleteError.message}`)
        } else {
          deletedCount++
        }
      }
    }

    console.log(`[GDPR Cleanup] Deleted ${deletedCount} expired exports`)
    return { deletedCount, errors }

  } catch (error) {
    console.error('[GDPR Cleanup] Fatal error:', error)
    errors.push(error instanceof Error ? error.message : 'Unknown error')
    return { deletedCount: 0, errors }
  }
}
