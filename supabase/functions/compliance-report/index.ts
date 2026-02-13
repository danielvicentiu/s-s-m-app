// Supabase Edge Function: Generate compliance reports
// Deploy: supabase functions deploy compliance-report

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

// Types
interface ComplianceReportRequest {
  org_id: string;
  period: "monthly" | "quarterly";
  end_date?: string; // ISO date, defaults to today
}

interface ComplianceBreakdown {
  category: "training" | "medical" | "equipment" | "documents";
  total_count: number;
  compliant_count: number;
  expiring_count: number;
  expired_count: number;
  compliance_percentage: number;
}

interface CategoryTrend {
  category: "training" | "medical" | "equipment" | "documents";
  current_percentage: number;
  previous_percentage: number;
  change_percentage: number;
  trend: "improving" | "declining" | "stable";
}

interface ComplianceReport {
  organization_id: string;
  organization_name: string;
  period: "monthly" | "quarterly";
  report_date: string;
  date_range: {
    start: string;
    end: string;
  };
  overall_compliance: {
    total_items: number;
    compliant_items: number;
    compliance_percentage: number;
  };
  breakdown: ComplianceBreakdown[];
  trends: CategoryTrend[];
  critical_alerts: {
    category: string;
    item_name: string;
    expiry_date: string;
    days_until_expiry: number;
  }[];
  generated_at: string;
}

// Helper: Calculate date ranges
function getDateRange(period: "monthly" | "quarterly", endDate: Date): { start: Date; end: Date } {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  if (period === "monthly") {
    start.setMonth(start.getMonth() - 1);
  } else {
    start.setMonth(start.getMonth() - 3);
  }
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

// Helper: Calculate days until expiry
function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Helper: Determine compliance status
function getComplianceStatus(expiryDate: string): "valid" | "expiring" | "expired" {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return "expired";
  if (days <= 30) return "expiring";
  return "valid";
}

// Query training compliance
async function getTrainingCompliance(supabase: any, orgId: string, endDate: Date) {
  // Note: Assuming a 'training_records' table exists with expiry_date
  // Adjust table/column names based on actual schema
  const { data, error } = await supabase
    .from("training_records")
    .select("id, employee_name, training_type, expiry_date")
    .eq("organization_id", orgId)
    .lte("created_at", endDate.toISOString());

  if (error) {
    console.error("Training query error:", error);
    return { total: 0, valid: 0, expiring: 0, expired: 0, criticalAlerts: [] };
  }

  const records = data || [];
  let valid = 0, expiring = 0, expired = 0;
  const criticalAlerts: any[] = [];

  for (const record of records) {
    if (!record.expiry_date) {
      expired++;
      continue;
    }

    const status = getComplianceStatus(record.expiry_date);
    if (status === "valid") valid++;
    else if (status === "expiring") {
      expiring++;
      const days = getDaysUntilExpiry(record.expiry_date);
      if (days <= 7) {
        criticalAlerts.push({
          category: "training",
          item_name: `${record.training_type || "Training"} - ${record.employee_name}`,
          expiry_date: record.expiry_date,
          days_until_expiry: days,
        });
      }
    } else {
      expired++;
      criticalAlerts.push({
        category: "training",
        item_name: `${record.training_type || "Training"} - ${record.employee_name}`,
        expiry_date: record.expiry_date,
        days_until_expiry: getDaysUntilExpiry(record.expiry_date),
      });
    }
  }

  return { total: records.length, valid, expiring, expired, criticalAlerts };
}

// Query medical compliance
async function getMedicalCompliance(supabase: any, orgId: string, endDate: Date) {
  const { data, error } = await supabase
    .from("medical_examinations")
    .select("id, employee_name, examination_type, expiry_date")
    .eq("organization_id", orgId)
    .lte("created_at", endDate.toISOString());

  if (error) {
    console.error("Medical query error:", error);
    return { total: 0, valid: 0, expiring: 0, expired: 0, criticalAlerts: [] };
  }

  const records = data || [];
  let valid = 0, expiring = 0, expired = 0;
  const criticalAlerts: any[] = [];

  for (const record of records) {
    if (!record.expiry_date) {
      expired++;
      continue;
    }

    const status = getComplianceStatus(record.expiry_date);
    if (status === "valid") valid++;
    else if (status === "expiring") {
      expiring++;
      const days = getDaysUntilExpiry(record.expiry_date);
      if (days <= 7) {
        criticalAlerts.push({
          category: "medical",
          item_name: `Medical - ${record.employee_name}`,
          expiry_date: record.expiry_date,
          days_until_expiry: days,
        });
      }
    } else {
      expired++;
      criticalAlerts.push({
        category: "medical",
        item_name: `Medical - ${record.employee_name}`,
        expiry_date: record.expiry_date,
        days_until_expiry: getDaysUntilExpiry(record.expiry_date),
      });
    }
  }

  return { total: records.length, valid, expiring, expired, criticalAlerts };
}

// Query equipment compliance
async function getEquipmentCompliance(supabase: any, orgId: string, endDate: Date) {
  const { data, error } = await supabase
    .from("safety_equipment")
    .select("id, equipment_type, description, location, expiry_date, is_compliant")
    .eq("organization_id", orgId)
    .lte("created_at", endDate.toISOString());

  if (error) {
    console.error("Equipment query error:", error);
    return { total: 0, valid: 0, expiring: 0, expired: 0, criticalAlerts: [] };
  }

  const records = data || [];
  let valid = 0, expiring = 0, expired = 0;
  const criticalAlerts: any[] = [];

  for (const record of records) {
    if (!record.expiry_date) {
      expired++;
      continue;
    }

    const status = getComplianceStatus(record.expiry_date);
    // Also consider is_compliant flag
    if (status === "valid" && record.is_compliant !== false) valid++;
    else if (status === "expiring") {
      expiring++;
      const days = getDaysUntilExpiry(record.expiry_date);
      if (days <= 7) {
        criticalAlerts.push({
          category: "equipment",
          item_name: `${record.equipment_type} - ${record.location || record.description || "Unknown"}`,
          expiry_date: record.expiry_date,
          days_until_expiry: days,
        });
      }
    } else {
      expired++;
      criticalAlerts.push({
        category: "equipment",
        item_name: `${record.equipment_type} - ${record.location || record.description || "Unknown"}`,
        expiry_date: record.expiry_date,
        days_until_expiry: getDaysUntilExpiry(record.expiry_date),
      });
    }
  }

  return { total: records.length, valid, expiring, expired, criticalAlerts };
}

// Query documents compliance
async function getDocumentsCompliance(supabase: any, orgId: string, endDate: Date) {
  // Note: Assuming generated_documents table - adjust based on actual schema
  const { data, error } = await supabase
    .from("generated_documents")
    .select("id, document_type, file_name, created_at")
    .eq("organization_id", orgId)
    .lte("created_at", endDate.toISOString());

  if (error) {
    console.error("Documents query error:", error);
    return { total: 0, valid: 0, expiring: 0, expired: 0, criticalAlerts: [] };
  }

  const records = data || [];
  // Documents compliance is based on recency (e.g., documents older than 90 days are "expiring")
  let valid = 0, expiring = 0, expired = 0;
  const now = new Date();

  for (const record of records) {
    const createdAt = new Date(record.created_at);
    const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    if (ageInDays <= 90) {
      valid++;
    } else if (ageInDays <= 180) {
      expiring++;
    } else {
      expired++;
    }
  }

  return { total: records.length, valid, expiring, expired, criticalAlerts: [] };
}

// Calculate trends by comparing with previous period
async function calculateTrends(
  supabase: any,
  orgId: string,
  currentBreakdown: ComplianceBreakdown[],
  period: "monthly" | "quarterly",
  currentEndDate: Date
): Promise<CategoryTrend[]> {
  const previousDateRange = getDateRange(period, new Date(currentEndDate.getTime() - 1));

  // Get previous period data
  const prevTraining = await getTrainingCompliance(supabase, orgId, previousDateRange.end);
  const prevMedical = await getMedicalCompliance(supabase, orgId, previousDateRange.end);
  const prevEquipment = await getEquipmentCompliance(supabase, orgId, previousDateRange.end);
  const prevDocuments = await getDocumentsCompliance(supabase, orgId, previousDateRange.end);

  const previousData = [
    { category: "training" as const, ...prevTraining },
    { category: "medical" as const, ...prevMedical },
    { category: "equipment" as const, ...prevEquipment },
    { category: "documents" as const, ...prevDocuments },
  ];

  const trends: CategoryTrend[] = [];

  for (const current of currentBreakdown) {
    const previous = previousData.find((p) => p.category === current.category);
    if (!previous || previous.total === 0) {
      trends.push({
        category: current.category,
        current_percentage: current.compliance_percentage,
        previous_percentage: 0,
        change_percentage: 0,
        trend: "stable",
      });
      continue;
    }

    const prevPercentage = (previous.valid / previous.total) * 100;
    const change = current.compliance_percentage - prevPercentage;

    let trend: "improving" | "declining" | "stable" = "stable";
    if (change > 2) trend = "improving";
    else if (change < -2) trend = "declining";

    trends.push({
      category: current.category,
      current_percentage: current.compliance_percentage,
      previous_percentage: prevPercentage,
      change_percentage: change,
      trend,
    });
  }

  return trends;
}

serve(async (req) => {
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

    // Parse request body
    const body: ComplianceReportRequest = await req.json();
    const { org_id, period, end_date } = body;

    // Validate input
    if (!org_id || !period) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: org_id, period" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["monthly", "quarterly"].includes(period)) {
      return new Response(
        JSON.stringify({ error: "Invalid period. Must be 'monthly' or 'quarterly'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get organization details
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("id", org_id)
      .single();

    if (orgError || !org) {
      return new Response(
        JSON.stringify({ error: "Organization not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate date range
    const endDate = end_date ? new Date(end_date) : new Date();
    const dateRange = getDateRange(period, endDate);

    // Fetch compliance data for each category
    const training = await getTrainingCompliance(supabase, org_id, endDate);
    const medical = await getMedicalCompliance(supabase, org_id, endDate);
    const equipment = await getEquipmentCompliance(supabase, org_id, endDate);
    const documents = await getDocumentsCompliance(supabase, org_id, endDate);

    // Build breakdown
    const breakdown: ComplianceBreakdown[] = [
      {
        category: "training",
        total_count: training.total,
        compliant_count: training.valid,
        expiring_count: training.expiring,
        expired_count: training.expired,
        compliance_percentage: training.total > 0 ? (training.valid / training.total) * 100 : 0,
      },
      {
        category: "medical",
        total_count: medical.total,
        compliant_count: medical.valid,
        expiring_count: medical.expiring,
        expired_count: medical.expired,
        compliance_percentage: medical.total > 0 ? (medical.valid / medical.total) * 100 : 0,
      },
      {
        category: "equipment",
        total_count: equipment.total,
        compliant_count: equipment.valid,
        expiring_count: equipment.expiring,
        expired_count: equipment.expired,
        compliance_percentage: equipment.total > 0 ? (equipment.valid / equipment.total) * 100 : 0,
      },
      {
        category: "documents",
        total_count: documents.total,
        compliant_count: documents.valid,
        expiring_count: documents.expiring,
        expired_count: documents.expired,
        compliance_percentage: documents.total > 0 ? (documents.valid / documents.total) * 100 : 0,
      },
    ];

    // Calculate overall compliance
    const totalItems = breakdown.reduce((sum, b) => sum + b.total_count, 0);
    const compliantItems = breakdown.reduce((sum, b) => sum + b.compliant_count, 0);
    const overallCompliance = totalItems > 0 ? (compliantItems / totalItems) * 100 : 0;

    // Calculate trends
    const trends = await calculateTrends(supabase, org_id, breakdown, period, endDate);

    // Collect critical alerts (expired or expiring within 7 days)
    const criticalAlerts = [
      ...training.criticalAlerts,
      ...medical.criticalAlerts,
      ...equipment.criticalAlerts,
    ]
      .sort((a, b) => a.days_until_expiry - b.days_until_expiry)
      .slice(0, 20); // Limit to top 20 critical alerts

    // Build report
    const report: ComplianceReport = {
      organization_id: org_id,
      organization_name: org.name,
      period,
      report_date: endDate.toISOString().split("T")[0],
      date_range: {
        start: dateRange.start.toISOString().split("T")[0],
        end: dateRange.end.toISOString().split("T")[0],
      },
      overall_compliance: {
        total_items: totalItems,
        compliant_items: compliantItems,
        compliance_percentage: parseFloat(overallCompliance.toFixed(2)),
      },
      breakdown,
      trends,
      critical_alerts: criticalAlerts,
      generated_at: new Date().toISOString(),
    };

    // Return success response
    return new Response(JSON.stringify(report), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating compliance report:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
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
