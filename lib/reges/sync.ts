// ============================================================
// S-S-M.RO — REGES Employee Sync Logic
// File: lib/reges/sync.ts
//
// Sincronizare automată angajați: REGES → Supabase
// Upsert pe CNP + diff calculation (noi/plecați)
// ============================================================

import { createSupabaseServer } from '@/lib/supabase/server';
import { getEmployees, type RegesEmployee } from './client';

// ============================================================
// Types
// ============================================================
export interface SyncResult {
  success: boolean;
  totalEmployees: number;
  newEmployees: number;
  departedEmployees: number;
  errors: string[];
  newEmployeesList?: Array<{ cnp: string; full_name: string }>;
  departedEmployeesList?: Array<{ cnp: string; full_name: string }>;
}

// ============================================================
// Sync Employees from REGES
// ============================================================
/**
 * Sincronizează angajați din REGES în Supabase
 *
 * Flow:
 * 1. Fetch employees din REGES API
 * 2. Obține snapshot anterior pentru diff
 * 3. Calculate diff (angajați noi vs plecați)
 * 4. Insert new snapshots în DB
 * 5. Update connection last_sync_at
 *
 * @param connectionId - ID conexiune REGES
 * @returns Rezultat sincronizare cu statistici
 *
 * @throws Error dacă conexiunea nu există sau credențialele lipsesc
 */
export async function syncEmployees(connectionId: string): Promise<SyncResult> {
  const supabase = await createSupabaseServer();
  const errors: string[] = [];

  try {
    // 1. Get connection with credentials
    const { data: connection, error: connError } = await supabase
      .from('reges_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (connError || !connection) {
      throw new Error(`Connection not found: ${connError?.message || 'Unknown error'}`);
    }

    if (!connection.encrypted_credentials) {
      throw new Error('No credentials configured for this connection');
    }

    console.log(`[REGES Sync] Starting sync for connection ${connectionId}`);

    // 2. Fetch employees from REGES
    let employees: RegesEmployee[];
    try {
      employees = await getEmployees(connectionId, connection.encrypted_credentials);
      console.log(`[REGES Sync] Fetched ${employees.length} employees from REGES`);
    } catch (error) {
      throw new Error(
        `Failed to fetch employees from REGES: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    // 3. Get previous snapshot for diff calculation
    const { data: previousSnapshot } = await supabase
      .from('reges_employee_snapshots')
      .select('cnp, full_name, employment_status')
      .eq('connection_id', connectionId)
      .order('snapshot_date', { ascending: false });

    // Get previous active CNPs
    const previousCNPs = new Set(
      (previousSnapshot || [])
        .filter((s) => s.employment_status === 'active')
        .map((s) => s.cnp)
    );

    // Get current active CNPs
    const currentCNPs = new Set(
      employees.filter((e) => e.status === 'activ').map((e) => e.cnp)
    );

    // 4. Calculate diff
    const newEmployeesCNPs = [...currentCNPs].filter((cnp) => !previousCNPs.has(cnp));
    const departedCNPs = [...previousCNPs].filter((cnp) => !currentCNPs.has(cnp));

    console.log(`[REGES Sync] Diff: ${newEmployeesCNPs.length} new, ${departedCNPs.length} departed`);

    // Build new/departed employee lists
    const newEmployeesList = employees
      .filter((emp) => newEmployeesCNPs.includes(emp.cnp))
      .map((emp) => ({
        cnp: emp.cnp,
        full_name: `${emp.nume} ${emp.prenume}`,
      }));

    const departedEmployeesList = (previousSnapshot || [])
      .filter((snap) => departedCNPs.includes(snap.cnp))
      .map((snap) => ({
        cnp: snap.cnp,
        full_name: snap.full_name,
      }));

    // 5. Insert snapshots
    const snapshots = employees.map((emp) => ({
      connection_id: connectionId,
      organization_id: connection.organization_id,
      cnp: emp.cnp,
      full_name: `${emp.nume} ${emp.prenume}`,
      reges_employee_id: emp.id,
      position: emp.functie || null,
      contract_type: emp.tipContract || null,
      employment_status:
        emp.status === 'activ' ? 'active' : emp.status === 'plecat' ? 'departed' : 'suspended',
      start_date: emp.dataAngajare || null,
      end_date: emp.dataIncetare || null,
      raw_data: emp as any,
      snapshot_date: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from('reges_employee_snapshots')
      .insert(snapshots);

    if (insertError) {
      errors.push(`Insert error: ${insertError.message}`);
      console.error('[REGES Sync] Insert error:', insertError);
    }

    // 6. Update connection last_sync
    const { error: updateError } = await supabase
      .from('reges_connections')
      .update({
        last_sync_at: new Date().toISOString(),
        status: 'active',
        error_message: null,
      })
      .eq('id', connectionId);

    if (updateError) {
      errors.push(`Update connection error: ${updateError.message}`);
      console.error('[REGES Sync] Update connection error:', updateError);
    }

    console.log(`[REGES Sync] Sync completed successfully`);

    return {
      success: true,
      totalEmployees: employees.length,
      newEmployees: newEmployeesCNPs.length,
      departedEmployees: departedCNPs.length,
      errors,
      newEmployeesList,
      departedEmployeesList,
    };
  } catch (error) {
    console.error('[REGES Sync] Sync failed:', error);

    // Update connection with error status
    await supabase
      .from('reges_connections')
      .update({
        status: 'error',
        error_message: error instanceof Error ? error.message : String(error),
      })
      .eq('id', connectionId);

    throw error;
  }
}

// ============================================================
// Get Latest Snapshot for Connection
// ============================================================
/**
 * Obține ultimul snapshot pentru o conexiune REGES
 *
 * @param connectionId - ID conexiune REGES
 * @returns Lista angajați din ultimul snapshot
 */
export async function getLatestSnapshot(connectionId: string) {
  const supabase = await createSupabaseServer();

  // Get latest snapshot date
  const { data: latestDate } = await supabase
    .from('reges_employee_snapshots')
    .select('snapshot_date')
    .eq('connection_id', connectionId)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  if (!latestDate) {
    return [];
  }

  // Get all snapshots from that date
  const { data: snapshots } = await supabase
    .from('reges_employee_snapshots')
    .select('*')
    .eq('connection_id', connectionId)
    .eq('snapshot_date', latestDate.snapshot_date)
    .order('full_name');

  return snapshots || [];
}

// ============================================================
// Get Diff Between Two Snapshots
// ============================================================
/**
 * Compară două snapshot-uri și returnează diferențele
 *
 * @param connectionId - ID conexiune REGES
 * @param date1 - Prima dată (mai veche)
 * @param date2 - A doua dată (mai nouă)
 * @returns Diferențe între snapshot-uri
 */
export async function getDiffBetweenSnapshots(
  connectionId: string,
  date1: string,
  date2: string
) {
  const supabase = await createSupabaseServer();

  const { data: snapshot1 } = await supabase
    .from('reges_employee_snapshots')
    .select('cnp, full_name, employment_status')
    .eq('connection_id', connectionId)
    .eq('snapshot_date', date1);

  const { data: snapshot2 } = await supabase
    .from('reges_employee_snapshots')
    .select('cnp, full_name, employment_status')
    .eq('connection_id', connectionId)
    .eq('snapshot_date', date2);

  const cnps1 = new Set((snapshot1 || []).filter((s) => s.employment_status === 'active').map((s) => s.cnp));
  const cnps2 = new Set((snapshot2 || []).filter((s) => s.employment_status === 'active').map((s) => s.cnp));

  const added = [...cnps2].filter((cnp) => !cnps1.has(cnp));
  const removed = [...cnps1].filter((cnp) => !cnps2.has(cnp));

  return {
    added: (snapshot2 || []).filter((s) => added.includes(s.cnp)),
    removed: (snapshot1 || []).filter((s) => removed.includes(s.cnp)),
    total1: snapshot1?.length || 0,
    total2: snapshot2?.length || 0,
  };
}
