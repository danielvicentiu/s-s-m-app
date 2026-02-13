// lib/services/data-migration.ts
// Data Migration Service pentru actualizări schema
// Suportă transformări, backfill, validare, rollback
// Data: 13 Februarie 2026

import { createSupabaseBrowser } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Migration result status
 */
export type MigrationStatus = 'success' | 'failed' | 'rolled_back' | 'skipped'

/**
 * Individual migration result
 */
export interface MigrationResult {
  orgId: string
  orgName: string
  status: MigrationStatus
  error?: string
  recordsMigrated?: number
  recordsValidated?: number
  recordsRolledBack?: number
  duration?: number // milliseconds
  timestamp: string
}

/**
 * Batch migration progress
 */
export interface BatchMigrationProgress {
  total: number
  completed: number
  succeeded: number
  failed: number
  skipped: number
  results: MigrationResult[]
  startedAt: string
  completedAt?: string
}

/**
 * Migration options
 */
export interface MigrationOptions {
  dryRun?: boolean // Simulate without committing changes
  validateOnly?: boolean // Only validate, don't migrate
  autoRollback?: boolean // Rollback on failure
  batchSize?: number // Number of records to process at once
  skipValidation?: boolean // Skip post-migration validation
}

/**
 * Migration snapshot pentru rollback
 */
interface MigrationSnapshot {
  tableName: string
  records: Record<string, any>[]
  timestamp: string
}

/**
 * Migrează o organizație de la V1 la V2 schema
 *
 * Transformări:
 * - Adaugă coloane noi (e.g., content_version, legal_basis_version)
 * - Backfill valori default pentru înregistrări existente
 * - Validează integritatea datelor după migrare
 * - Rollback automat în caz de eroare
 *
 * @param orgId - Organization ID to migrate
 * @param options - Migration options
 * @returns Migration result
 */
export async function migrateV1toV2(
  orgId: string,
  options: MigrationOptions = {}
): Promise<MigrationResult> {
  const startTime = Date.now()
  const supabase = createSupabaseBrowser()

  const {
    dryRun = false,
    validateOnly = false,
    autoRollback = true,
    batchSize = 100,
    skipValidation = false,
  } = options

  const snapshots: MigrationSnapshot[] = []

  try {
    console.log(`[Migration] Starting V1→V2 migration for org ${orgId}`, {
      dryRun,
      validateOnly,
      autoRollback,
      batchSize,
    })

    // 1. Verifică dacă organizația există
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', orgId)
      .single()

    if (orgError || !org) {
      throw new Error(`Organizație ${orgId} nu există: ${orgError?.message}`)
    }

    // 2. Verifică dacă migrarea a fost deja executată
    const alreadyMigrated = await checkIfAlreadyMigrated(supabase, orgId)
    if (alreadyMigrated) {
      console.log(`[Migration] Org ${orgId} deja migrat, skip`)
      return {
        orgId,
        orgName: org.name,
        status: 'skipped',
        error: 'Organizația a fost deja migrată',
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      }
    }

    if (validateOnly) {
      // Doar validează schema curentă
      const validation = await validateMigrationReadiness(supabase, orgId)
      return {
        orgId,
        orgName: org.name,
        status: validation.isValid ? 'success' : 'failed',
        error: validation.errors.join(', '),
        recordsValidated: validation.recordsChecked,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      }
    }

    let totalMigrated = 0

    // 3. Migrează medical_records
    const medicalSnapshot = await createSnapshot(supabase, 'medical_records', orgId)
    snapshots.push(medicalSnapshot)

    if (!dryRun) {
      const migratedMedical = await migrateMedicalRecords(
        supabase,
        orgId,
        batchSize
      )
      totalMigrated += migratedMedical
      console.log(`[Migration] Migrated ${migratedMedical} medical records`)
    }

    // 4. Migrează safety_equipment
    const equipmentSnapshot = await createSnapshot(supabase, 'safety_equipment', orgId)
    snapshots.push(equipmentSnapshot)

    if (!dryRun) {
      const migratedEquipment = await migrateSafetyEquipment(
        supabase,
        orgId,
        batchSize
      )
      totalMigrated += migratedEquipment
      console.log(`[Migration] Migrated ${migratedEquipment} safety equipment records`)
    }

    // 5. Migrează generated_documents
    const docsSnapshot = await createSnapshot(supabase, 'generated_documents', orgId)
    snapshots.push(docsSnapshot)

    if (!dryRun) {
      const migratedDocs = await migrateGeneratedDocuments(
        supabase,
        orgId,
        batchSize
      )
      totalMigrated += migratedDocs
      console.log(`[Migration] Migrated ${migratedDocs} document records`)
    }

    // 6. Validare post-migrare
    let validatedRecords = 0
    if (!skipValidation && !dryRun) {
      const validation = await validateMigratedData(supabase, orgId)
      validatedRecords = validation.recordsChecked

      if (!validation.isValid) {
        throw new Error(`Validare eșuată: ${validation.errors.join(', ')}`)
      }

      console.log(`[Migration] Validation passed: ${validatedRecords} records`)
    }

    // 7. Marchează migrarea ca finalizată
    if (!dryRun) {
      await markMigrationComplete(supabase, orgId)
    }

    const result: MigrationResult = {
      orgId,
      orgName: org.name,
      status: 'success',
      recordsMigrated: totalMigrated,
      recordsValidated: validatedRecords,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    }

    console.log(`[Migration] Success for org ${orgId}:`, result)
    return result

  } catch (error: any) {
    console.error(`[Migration] Failed for org ${orgId}:`, error)

    // Rollback automat în caz de eroare
    if (autoRollback && !dryRun && snapshots.length > 0) {
      console.log(`[Migration] Starting rollback for org ${orgId}`)
      const rolledBack = await rollbackMigration(supabase, snapshots)

      return {
        orgId,
        orgName: 'Unknown',
        status: 'rolled_back',
        error: error.message || 'Migration failed',
        recordsRolledBack: rolledBack,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      }
    }

    return {
      orgId,
      orgName: 'Unknown',
      status: 'failed',
      error: error.message || 'Migration failed',
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    }
  }
}

/**
 * Migrează multiple organizații în batch cu progress tracking
 *
 * @param orgIds - Array of organization IDs
 * @param options - Migration options
 * @param onProgress - Progress callback
 * @returns Batch migration progress
 */
export async function runMigrationBatch(
  orgIds: string[],
  options: MigrationOptions = {},
  onProgress?: (progress: BatchMigrationProgress) => void
): Promise<BatchMigrationProgress> {
  const startedAt = new Date().toISOString()

  const progress: BatchMigrationProgress = {
    total: orgIds.length,
    completed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    results: [],
    startedAt,
  }

  console.log(`[Migration Batch] Starting batch migration for ${orgIds.length} organizations`)

  for (const orgId of orgIds) {
    try {
      const result = await migrateV1toV2(orgId, options)
      progress.results.push(result)
      progress.completed++

      if (result.status === 'success') {
        progress.succeeded++
      } else if (result.status === 'failed' || result.status === 'rolled_back') {
        progress.failed++
      } else if (result.status === 'skipped') {
        progress.skipped++
      }

      // Call progress callback
      if (onProgress) {
        onProgress({ ...progress })
      }

      console.log(
        `[Migration Batch] Progress: ${progress.completed}/${progress.total} ` +
        `(✓${progress.succeeded} ✗${progress.failed} ⊘${progress.skipped})`
      )

      // Pauză scurtă între migrări pentru a nu supraîncărca DB
      if (progress.completed < orgIds.length) {
        await sleep(500)
      }

    } catch (error: any) {
      console.error(`[Migration Batch] Unexpected error for org ${orgId}:`, error)

      progress.results.push({
        orgId,
        orgName: 'Unknown',
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      })
      progress.completed++
      progress.failed++

      if (onProgress) {
        onProgress({ ...progress })
      }
    }
  }

  progress.completedAt = new Date().toISOString()

  console.log(`[Migration Batch] Completed:`, {
    total: progress.total,
    succeeded: progress.succeeded,
    failed: progress.failed,
    skipped: progress.skipped,
  })

  return progress
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifică dacă organizația a fost deja migrată
 */
async function checkIfAlreadyMigrated(
  supabase: SupabaseClient,
  orgId: string
): Promise<boolean> {
  // Verifică dacă există un marker în audit_log sau o coloană specială
  const { data, error } = await supabase
    .from('audit_log')
    .select('id')
    .eq('organization_id', orgId)
    .eq('action', 'migration_v1_to_v2_completed')
    .maybeSingle()

  if (error) {
    console.warn('[Migration] Could not check migration status:', error)
    return false
  }

  return !!data
}

/**
 * Validează dacă organizația e pregătită pentru migrare
 */
async function validateMigrationReadiness(
  supabase: SupabaseClient,
  orgId: string
): Promise<{ isValid: boolean; errors: string[]; recordsChecked: number }> {
  const errors: string[] = []
  let recordsChecked = 0

  // Verifică integritatea referințelor
  const { data: medicalRecords, error: medError } = await supabase
    .from('medical_records')
    .select('id, organization_id, employee_name')
    .eq('organization_id', orgId)

  if (medError) {
    errors.push(`Eroare citire medical_records: ${medError.message}`)
  } else {
    recordsChecked += medicalRecords?.length || 0
  }

  const { data: equipment, error: eqError } = await supabase
    .from('safety_equipment')
    .select('id, organization_id, equipment_type')
    .eq('organization_id', orgId)

  if (eqError) {
    errors.push(`Eroare citire safety_equipment: ${eqError.message}`)
  } else {
    recordsChecked += equipment?.length || 0
  }

  return {
    isValid: errors.length === 0,
    errors,
    recordsChecked,
  }
}

/**
 * Creează snapshot pentru rollback
 */
async function createSnapshot(
  supabase: SupabaseClient,
  tableName: string,
  orgId: string
): Promise<MigrationSnapshot> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('organization_id', orgId)

  if (error) {
    console.error(`[Migration] Error creating snapshot for ${tableName}:`, error)
    throw new Error(`Failed to create snapshot: ${error.message}`)
  }

  return {
    tableName,
    records: data || [],
    timestamp: new Date().toISOString(),
  }
}

/**
 * Migrează medical_records: adaugă content_version, legal_basis_version
 */
async function migrateMedicalRecords(
  supabase: SupabaseClient,
  orgId: string,
  batchSize: number
): Promise<number> {
  const { data: records, error } = await supabase
    .from('medical_records')
    .select('id')
    .eq('organization_id', orgId)

  if (error) throw new Error(`Failed to fetch medical_records: ${error.message}`)
  if (!records || records.length === 0) return 0

  let migrated = 0
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    const ids = batch.map((r) => r.id)

    // Update cu valori default pentru V2
    const { error: updateError } = await supabase
      .from('medical_records')
      .update({
        content_version: 1,
        legal_basis_version: 'RO-2024-Q1',
        updated_at: new Date().toISOString(),
      })
      .in('id', ids)

    if (updateError) {
      throw new Error(`Failed to update medical_records: ${updateError.message}`)
    }

    migrated += batch.length
  }

  return migrated
}

/**
 * Migrează safety_equipment: adaugă content_version, legal_basis_version
 */
async function migrateSafetyEquipment(
  supabase: SupabaseClient,
  orgId: string,
  batchSize: number
): Promise<number> {
  const { data: records, error } = await supabase
    .from('safety_equipment')
    .select('id')
    .eq('organization_id', orgId)

  if (error) throw new Error(`Failed to fetch safety_equipment: ${error.message}`)
  if (!records || records.length === 0) return 0

  let migrated = 0
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    const ids = batch.map((r) => r.id)

    const { error: updateError } = await supabase
      .from('safety_equipment')
      .update({
        content_version: 1,
        legal_basis_version: 'RO-2024-Q1',
        updated_at: new Date().toISOString(),
      })
      .in('id', ids)

    if (updateError) {
      throw new Error(`Failed to update safety_equipment: ${updateError.message}`)
    }

    migrated += batch.length
  }

  return migrated
}

/**
 * Migrează generated_documents: adaugă content_version, legal_basis_version
 */
async function migrateGeneratedDocuments(
  supabase: SupabaseClient,
  orgId: string,
  batchSize: number
): Promise<number> {
  const { data: records, error } = await supabase
    .from('generated_documents')
    .select('id')
    .eq('organization_id', orgId)

  if (error) throw new Error(`Failed to fetch generated_documents: ${error.message}`)
  if (!records || records.length === 0) return 0

  let migrated = 0
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    const ids = batch.map((r) => r.id)

    const { error: updateError } = await supabase
      .from('generated_documents')
      .update({
        content_version: 1,
        legal_basis_version: 'RO-2024-Q1',
      })
      .in('id', ids)

    if (updateError) {
      throw new Error(`Failed to update generated_documents: ${updateError.message}`)
    }

    migrated += batch.length
  }

  return migrated
}

/**
 * Validează datele după migrare
 */
async function validateMigratedData(
  supabase: SupabaseClient,
  orgId: string
): Promise<{ isValid: boolean; errors: string[]; recordsChecked: number }> {
  const errors: string[] = []
  let recordsChecked = 0

  // Verifică că toate înregistrările au content_version și legal_basis_version
  const { data: medical, error: medError } = await supabase
    .from('medical_records')
    .select('id, content_version, legal_basis_version')
    .eq('organization_id', orgId)

  if (medError) {
    errors.push(`Eroare validare medical_records: ${medError.message}`)
  } else if (medical) {
    recordsChecked += medical.length
    const invalid = medical.filter(
      (r) => !r.content_version || !r.legal_basis_version
    )
    if (invalid.length > 0) {
      errors.push(`${invalid.length} medical_records fără content_version/legal_basis_version`)
    }
  }

  const { data: equipment, error: eqError } = await supabase
    .from('safety_equipment')
    .select('id, content_version, legal_basis_version')
    .eq('organization_id', orgId)

  if (eqError) {
    errors.push(`Eroare validare safety_equipment: ${eqError.message}`)
  } else if (equipment) {
    recordsChecked += equipment.length
    const invalid = equipment.filter(
      (r) => !r.content_version || !r.legal_basis_version
    )
    if (invalid.length > 0) {
      errors.push(`${invalid.length} safety_equipment fără content_version/legal_basis_version`)
    }
  }

  const { data: docs, error: docsError } = await supabase
    .from('generated_documents')
    .select('id, content_version, legal_basis_version')
    .eq('organization_id', orgId)

  if (docsError) {
    errors.push(`Eroare validare generated_documents: ${docsError.message}`)
  } else if (docs) {
    recordsChecked += docs.length
    const invalid = docs.filter(
      (r) => !r.content_version || !r.legal_basis_version
    )
    if (invalid.length > 0) {
      errors.push(`${invalid.length} generated_documents fără content_version/legal_basis_version`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    recordsChecked,
  }
}

/**
 * Rollback migration folosind snapshots
 */
async function rollbackMigration(
  supabase: SupabaseClient,
  snapshots: MigrationSnapshot[]
): Promise<number> {
  let rolledBack = 0

  for (const snapshot of snapshots) {
    try {
      console.log(`[Rollback] Restoring ${snapshot.tableName}...`)

      for (const record of snapshot.records) {
        const { error } = await supabase
          .from(snapshot.tableName)
          .update(record)
          .eq('id', record.id)

        if (error) {
          console.error(`[Rollback] Error restoring ${snapshot.tableName} record ${record.id}:`, error)
        } else {
          rolledBack++
        }
      }

      console.log(`[Rollback] Restored ${snapshot.records.length} records from ${snapshot.tableName}`)
    } catch (error: any) {
      console.error(`[Rollback] Failed to rollback ${snapshot.tableName}:`, error)
    }
  }

  return rolledBack
}

/**
 * Marchează migrarea ca finalizată în audit_log
 */
async function markMigrationComplete(
  supabase: SupabaseClient,
  orgId: string
): Promise<void> {
  const { error } = await supabase.from('audit_log').insert({
    organization_id: orgId,
    user_id: null, // System action
    action: 'migration_v1_to_v2_completed',
    entity_type: 'organization',
    entity_id: orgId,
    changes: {
      migration_version: 'v2',
      completed_at: new Date().toISOString(),
    },
  })

  if (error) {
    console.warn('[Migration] Could not mark migration as complete:', error)
    // Nu aruncă eroare - migrarea a reușit oricum
  }
}

/**
 * Helper: sleep pentru a nu supraîncărca DB
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export {
  checkIfAlreadyMigrated,
  validateMigrationReadiness,
  createSnapshot,
  rollbackMigration,
}
