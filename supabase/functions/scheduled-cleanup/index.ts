// Supabase Edge Function: Scheduled Cleanup
// Deploy: supabase functions deploy scheduled-cleanup
// Schedule: Weekly via Supabase Cron (every Sunday at 2 AM)
// Environment variables required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Types
interface CleanupResult {
  task: string;
  success: boolean;
  recordsDeleted: number;
  error?: string;
  details?: string;
}

interface CleanupSummary {
  timestamp: string;
  totalRecordsDeleted: number;
  totalErrors: number;
  results: CleanupResult[];
  executionTimeMs: number;
}

// Constants
const SOFT_DELETE_RETENTION_DAYS = 90; // Delete soft-deleted records older than 90 days
const AUDIT_LOG_RETENTION_DAYS = 365; // Delete audit logs older than 1 year
const SESSION_RETENTION_DAYS = 30; // Delete expired sessions older than 30 days
const DELIVERY_LOG_RETENTION_DAYS = 180; // Delete email/WhatsApp logs older than 6 months

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper: Get date threshold for cleanup
function getDateThreshold(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// Task 1: Delete soft-deleted records older than 90 days
async function cleanupSoftDeletedRecords(supabase: any): Promise<CleanupResult> {
  const threshold = getDateThreshold(SOFT_DELETE_RETENTION_DAYS);
  let totalDeleted = 0;

  try {
    // List of tables that support soft delete (deleted_at timestamp)
    // Note: Based on project analysis, we'll check common tables
    // If tables don't have deleted_at, they'll be skipped gracefully
    const tablesWithSoftDelete = [
      'organizations',
      'employees',
      'medical_examinations',
      'safety_equipment',
      'trainings',
      'documents',
      'generated_documents',
      'alerts',
      'fraud_alerts',
      'penalties',
      'equipment_types',
      'alert_categories',
      'obligation_types'
    ];

    const deletionResults = [];

    for (const table of tablesWithSoftDelete) {
      try {
        // Check if table has deleted_at column
        const { data: columns } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_schema', 'public')
          .eq('table_name', table)
          .eq('column_name', 'deleted_at');

        if (!columns || columns.length === 0) {
          // Table doesn't have deleted_at column, skip
          continue;
        }

        // Delete records with deleted_at older than threshold
        const { error, count } = await supabase
          .from(table)
          .delete({ count: 'exact' })
          .not('deleted_at', 'is', null)
          .lt('deleted_at', threshold);

        if (error) {
          console.error(`Error deleting from ${table}:`, error);
          deletionResults.push(`${table}: error - ${error.message}`);
        } else {
          const deleted = count || 0;
          totalDeleted += deleted;
          if (deleted > 0) {
            deletionResults.push(`${table}: ${deleted} records`);
          }
        }
      } catch (tableError) {
        console.error(`Exception cleaning ${table}:`, tableError);
        deletionResults.push(`${table}: exception - ${tableError.message}`);
      }
    }

    return {
      task: "Soft-deleted records cleanup",
      success: true,
      recordsDeleted: totalDeleted,
      details: deletionResults.join(', ') || 'No soft-deleted records found'
    };
  } catch (error) {
    console.error("Error in cleanupSoftDeletedRecords:", error);
    return {
      task: "Soft-deleted records cleanup",
      success: false,
      recordsDeleted: 0,
      error: error.message
    };
  }
}

// Task 2: Delete orphaned files from Storage
async function cleanupOrphanedFiles(supabase: any): Promise<CleanupResult> {
  try {
    let totalDeleted = 0;
    const deletionDetails = [];

    // Get all buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      throw bucketsError;
    }

    // Check each bucket for orphaned files
    for (const bucket of buckets || []) {
      try {
        // List all files in bucket
        const { data: files, error: listError } = await supabase
          .storage
          .from(bucket.name)
          .list('', {
            limit: 1000,
            sortBy: { column: 'created_at', order: 'asc' }
          });

        if (listError || !files) {
          console.error(`Error listing files in bucket ${bucket.name}:`, listError);
          continue;
        }

        // Check if files are referenced in database
        for (const file of files) {
          if (!file.name) continue;

          const storagePath = `${bucket.name}/${file.name}`;

          // Check if file is referenced in generated_documents
          const { data: docRefs } = await supabase
            .from('generated_documents')
            .select('id')
            .eq('storage_path', storagePath)
            .limit(1);

          // Check if file is referenced in profiles (avatar_url)
          const { data: profileRefs } = await supabase
            .from('profiles')
            .select('id')
            .like('avatar_url', `%${file.name}%`)
            .limit(1);

          // If file is not referenced anywhere, it's orphaned
          if ((!docRefs || docRefs.length === 0) &&
              (!profileRefs || profileRefs.length === 0)) {

            // Delete orphaned file
            const { error: deleteError } = await supabase
              .storage
              .from(bucket.name)
              .remove([file.name]);

            if (deleteError) {
              console.error(`Error deleting orphaned file ${file.name}:`, deleteError);
            } else {
              totalDeleted++;
              deletionDetails.push(`${bucket.name}/${file.name}`);
            }
          }
        }
      } catch (bucketError) {
        console.error(`Exception processing bucket ${bucket.name}:`, bucketError);
      }
    }

    return {
      task: "Orphaned files cleanup",
      success: true,
      recordsDeleted: totalDeleted,
      details: totalDeleted > 0
        ? `Deleted files: ${deletionDetails.slice(0, 10).join(', ')}${totalDeleted > 10 ? '...' : ''}`
        : 'No orphaned files found'
    };
  } catch (error) {
    console.error("Error in cleanupOrphanedFiles:", error);
    return {
      task: "Orphaned files cleanup",
      success: false,
      recordsDeleted: 0,
      error: error.message
    };
  }
}

// Task 3: Delete audit logs older than 1 year
async function cleanupAuditLogs(supabase: any): Promise<CleanupResult> {
  const threshold = getDateThreshold(AUDIT_LOG_RETENTION_DAYS);

  try {
    // Check if audit_log table exists
    const { data: tableExists } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'audit_log')
      .single();

    if (!tableExists) {
      return {
        task: "Audit logs cleanup",
        success: true,
        recordsDeleted: 0,
        details: 'audit_log table does not exist'
      };
    }

    // Delete old audit logs
    const { error, count } = await supabase
      .from('audit_log')
      .delete({ count: 'exact' })
      .lt('created_at', threshold);

    if (error) {
      throw error;
    }

    return {
      task: "Audit logs cleanup",
      success: true,
      recordsDeleted: count || 0,
      details: `Deleted audit logs older than ${AUDIT_LOG_RETENTION_DAYS} days`
    };
  } catch (error) {
    console.error("Error in cleanupAuditLogs:", error);
    return {
      task: "Audit logs cleanup",
      success: false,
      recordsDeleted: 0,
      error: error.message
    };
  }
}

// Task 4: Delete expired sessions
async function cleanupExpiredSessions(supabase: any): Promise<CleanupResult> {
  const threshold = getDateThreshold(SESSION_RETENTION_DAYS);

  try {
    // Delete expired sessions from auth.sessions
    // Note: This requires service_role key with proper permissions
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    // Use RPC to clean expired sessions (would need to be created in migration)
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('cleanup_expired_sessions', { threshold_date: threshold });

    if (rpcError) {
      // If RPC doesn't exist, we'll log it but not fail
      console.log("cleanup_expired_sessions RPC not found, skipping session cleanup");
      return {
        task: "Expired sessions cleanup",
        success: true,
        recordsDeleted: 0,
        details: 'Session cleanup RPC not configured (optional)'
      };
    }

    return {
      task: "Expired sessions cleanup",
      success: true,
      recordsDeleted: rpcData || 0,
      details: `Deleted expired sessions older than ${SESSION_RETENTION_DAYS} days`
    };
  } catch (error) {
    console.error("Error in cleanupExpiredSessions:", error);
    return {
      task: "Expired sessions cleanup",
      success: false,
      recordsDeleted: 0,
      error: error.message
    };
  }
}

// Task 5: Delete old delivery logs (email + WhatsApp)
async function cleanupDeliveryLogs(supabase: any): Promise<CleanupResult> {
  const threshold = getDateThreshold(DELIVERY_LOG_RETENTION_DAYS);
  let totalDeleted = 0;

  try {
    const deliveryTables = [
      'email_delivery_log',
      'whatsapp_delivery_log'
    ];

    const deletionResults = [];

    for (const table of deliveryTables) {
      try {
        // Check if table exists
        const { data: tableExists } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .eq('table_name', table)
          .single();

        if (!tableExists) {
          deletionResults.push(`${table}: does not exist`);
          continue;
        }

        // Delete old delivery logs
        const { error, count } = await supabase
          .from(table)
          .delete({ count: 'exact' })
          .lt('sent_at', threshold);

        if (error) {
          console.error(`Error deleting from ${table}:`, error);
          deletionResults.push(`${table}: error - ${error.message}`);
        } else {
          const deleted = count || 0;
          totalDeleted += deleted;
          if (deleted > 0) {
            deletionResults.push(`${table}: ${deleted} records`);
          }
        }
      } catch (tableError) {
        console.error(`Exception cleaning ${table}:`, tableError);
        deletionResults.push(`${table}: exception - ${tableError.message}`);
      }
    }

    return {
      task: "Delivery logs cleanup",
      success: true,
      recordsDeleted: totalDeleted,
      details: deletionResults.join(', ') || 'No old delivery logs found'
    };
  } catch (error) {
    console.error("Error in cleanupDeliveryLogs:", error);
    return {
      task: "Delivery logs cleanup",
      success: false,
      recordsDeleted: 0,
      error: error.message
    };
  }
}

// Log cleanup results to database
async function logCleanupResults(
  supabase: any,
  summary: CleanupSummary
): Promise<void> {
  try {
    // Check if cleanup_log table exists
    const { data: tableExists } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'cleanup_log')
      .single();

    if (!tableExists) {
      console.log("cleanup_log table does not exist, skipping logging");
      return;
    }

    const { error } = await supabase
      .from('cleanup_log')
      .insert({
        execution_timestamp: summary.timestamp,
        total_records_deleted: summary.totalRecordsDeleted,
        total_errors: summary.totalErrors,
        results: summary.results,
        execution_time_ms: summary.executionTimeMs
      });

    if (error) {
      console.error("Failed to log cleanup results:", error);
    }
  } catch (error) {
    console.error("Exception in logCleanupResults:", error);
  }
}

// Main request handler
serve(async (req) => {
  const startTime = Date.now();

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

    // Verify authorization (optional: add secret token check)
    const authHeader = req.headers.get("authorization");
    const CLEANUP_SECRET = Deno.env.get("CLEANUP_SECRET");

    if (CLEANUP_SECRET && authHeader !== `Bearer ${CLEANUP_SECRET}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Starting scheduled cleanup tasks...");

    // Execute all cleanup tasks
    const results: CleanupResult[] = [];

    // Task 1: Clean soft-deleted records
    console.log("Task 1: Cleaning soft-deleted records...");
    results.push(await cleanupSoftDeletedRecords(supabase));

    // Task 2: Clean orphaned files
    console.log("Task 2: Cleaning orphaned files...");
    results.push(await cleanupOrphanedFiles(supabase));

    // Task 3: Clean audit logs
    console.log("Task 3: Cleaning audit logs...");
    results.push(await cleanupAuditLogs(supabase));

    // Task 4: Clean expired sessions
    console.log("Task 4: Cleaning expired sessions...");
    results.push(await cleanupExpiredSessions(supabase));

    // Task 5: Clean delivery logs
    console.log("Task 5: Cleaning delivery logs...");
    results.push(await cleanupDeliveryLogs(supabase));

    // Calculate summary
    const executionTimeMs = Date.now() - startTime;
    const totalRecordsDeleted = results.reduce((sum, r) => sum + r.recordsDeleted, 0);
    const totalErrors = results.filter(r => !r.success).length;

    const summary: CleanupSummary = {
      timestamp: new Date().toISOString(),
      totalRecordsDeleted,
      totalErrors,
      results,
      executionTimeMs
    };

    console.log("Cleanup summary:", summary);

    // Log results to database
    await logCleanupResults(supabase, summary);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        summary,
        message: `Cleanup completed: ${totalRecordsDeleted} records deleted in ${executionTimeMs}ms`
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
    console.error("Error in scheduled cleanup:", error);

    return new Response(
      JSON.stringify({
        error: "Cleanup failed",
        message: error.message,
        executionTimeMs: Date.now() - startTime
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
