// Supabase Edge Function: Excel Export
// Deploy: supabase functions deploy export-excel
// Usage: POST /export-excel with { org_id, export_type, filters? }
// Returns: { download_url, file_name, expires_at }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs";

// ============================================================
// TYPES
// ============================================================

type ExportType = 'employees' | 'trainings' | 'medical' | 'equipment' | 'compliance';

interface ExportRequest {
  org_id: string;
  export_type: ExportType;
  filters?: Record<string, any>;
}

interface ExportResult {
  success: boolean;
  download_url?: string;
  file_name?: string;
  expires_at?: string;
  error?: string;
  records_count?: number;
}

interface EmployeeRow {
  id: string;
  full_name: string;
  cnp_hash?: string;
  job_title?: string;
  cor_code?: string;
  department?: string;
  hire_date?: string;
  employment_type?: string;
  is_active?: boolean;
  email?: string;
  phone?: string;
  created_at?: string;
}

interface TrainingRow {
  assignment_id: string;
  worker_name: string;
  module_code: string;
  module_title: string;
  category: string;
  training_type: string;
  is_mandatory: boolean;
  status: string;
  due_date?: string;
  completed_at?: string;
  session_date?: string;
  instructor_name?: string;
  test_score?: number;
  duration_minutes?: number;
  next_due_date?: string;
}

interface MedicalRow {
  id: string;
  employee_name: string;
  job_title?: string;
  examination_type: string;
  examination_date: string;
  expiry_date: string;
  result: string;
  restrictions?: string;
  doctor_name?: string;
  clinic_name?: string;
  notes?: string;
  days_until_expiry?: number;
  status?: string;
}

interface EquipmentRow {
  id: string;
  equipment_type: string;
  description?: string;
  location?: string;
  serial_number?: string;
  last_inspection_date?: string;
  expiry_date: string;
  next_inspection_date?: string;
  inspector_name?: string;
  is_compliant: boolean;
  notes?: string;
  days_until_expiry?: number;
  status?: string;
}

interface ComplianceRow {
  category: string;
  total_items: number;
  compliant: number;
  expiring_30d: number;
  expired: number;
  compliance_rate: string;
  status: string;
}

// ============================================================
// CORS HEADERS
// ============================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ro-RO');
}

function calculateDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(expiryDate: string): string {
  const days = calculateDaysUntilExpiry(expiryDate);
  if (days < 0) return 'EXPIRAT';
  if (days <= 7) return 'URGENT';
  if (days <= 30) return 'ATENȚIE';
  return 'VALABIL';
}

function autoFitColumns(worksheet: XLSX.WorkSheet): void {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  const colWidths: number[] = [];

  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        const cellLength = cell.v.toString().length;
        maxWidth = Math.max(maxWidth, Math.min(cellLength, 50));
      }
    }
    colWidths[C] = maxWidth + 2;
  }

  worksheet['!cols'] = colWidths.map(w => ({ width: w }));
}

function makeBoldHeader(worksheet: XLSX.WorkSheet): void {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "E5E7EB" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
  }
}

// ============================================================
// DATA FETCHERS
// ============================================================

async function fetchEmployees(
  supabase: any,
  orgId: string,
  filters?: Record<string, any>
): Promise<EmployeeRow[]> {
  let query = supabase
    .from('employees')
    .select('*')
    .eq('organization_id', orgId)
    .order('full_name');

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }

  if (filters?.department) {
    query = query.eq('department', filters.department);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

async function fetchTrainings(
  supabase: any,
  orgId: string,
  filters?: Record<string, any>
): Promise<TrainingRow[]> {
  let query = supabase
    .from('training_assignments')
    .select(`
      id,
      status,
      due_date,
      completed_at,
      next_due_date,
      worker_id,
      module_id,
      training_modules (
        code,
        title,
        category,
        training_type,
        is_mandatory
      ),
      training_sessions (
        session_date,
        instructor_name,
        test_score,
        duration_minutes
      ),
      employees (
        full_name
      )
    `)
    .eq('organization_id', orgId)
    .order('due_date', { ascending: true });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.category) {
    query = query.eq('training_modules.category', filters.category);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row: any) => ({
    assignment_id: row.id,
    worker_name: row.employees?.full_name || '',
    module_code: row.training_modules?.code || '',
    module_title: row.training_modules?.title || '',
    category: row.training_modules?.category || '',
    training_type: row.training_modules?.training_type || '',
    is_mandatory: row.training_modules?.is_mandatory || false,
    status: row.status,
    due_date: row.due_date,
    completed_at: row.completed_at,
    session_date: row.training_sessions?.[0]?.session_date,
    instructor_name: row.training_sessions?.[0]?.instructor_name,
    test_score: row.training_sessions?.[0]?.test_score,
    duration_minutes: row.training_sessions?.[0]?.duration_minutes,
    next_due_date: row.next_due_date,
  }));
}

async function fetchMedical(
  supabase: any,
  orgId: string,
  filters?: Record<string, any>
): Promise<MedicalRow[]> {
  let query = supabase
    .from('medical_examinations')
    .select('*')
    .eq('organization_id', orgId)
    .order('expiry_date', { ascending: true });

  if (filters?.result) {
    query = query.eq('result', filters.result);
  }

  if (filters?.examination_type) {
    query = query.eq('examination_type', filters.examination_type);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    employee_name: row.employee_name,
    job_title: row.job_title,
    examination_type: row.examination_type,
    examination_date: row.examination_date,
    expiry_date: row.expiry_date,
    result: row.result,
    restrictions: row.restrictions,
    doctor_name: row.doctor_name,
    clinic_name: row.clinic_name,
    notes: row.notes,
    days_until_expiry: calculateDaysUntilExpiry(row.expiry_date),
    status: getExpiryStatus(row.expiry_date),
  }));
}

async function fetchEquipment(
  supabase: any,
  orgId: string,
  filters?: Record<string, any>
): Promise<EquipmentRow[]> {
  let query = supabase
    .from('safety_equipment')
    .select('*')
    .eq('organization_id', orgId)
    .order('expiry_date', { ascending: true });

  if (filters?.equipment_type) {
    query = query.eq('equipment_type', filters.equipment_type);
  }

  if (filters?.is_compliant !== undefined) {
    query = query.eq('is_compliant', filters.is_compliant);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    equipment_type: row.equipment_type,
    description: row.description,
    location: row.location,
    serial_number: row.serial_number,
    last_inspection_date: row.last_inspection_date,
    expiry_date: row.expiry_date,
    next_inspection_date: row.next_inspection_date,
    inspector_name: row.inspector_name,
    is_compliant: row.is_compliant,
    notes: row.notes,
    days_until_expiry: calculateDaysUntilExpiry(row.expiry_date),
    status: getExpiryStatus(row.expiry_date),
  }));
}

async function fetchComplianceOverview(
  supabase: any,
  orgId: string
): Promise<ComplianceRow[]> {
  const complianceData: ComplianceRow[] = [];

  // Medical Compliance
  const { data: medicalData } = await supabase
    .from('medical_examinations')
    .select('expiry_date, result')
    .eq('organization_id', orgId);

  if (medicalData) {
    const total = medicalData.length;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    let compliant = 0;
    let expiring30d = 0;
    let expired = 0;

    medicalData.forEach((row: any) => {
      const expiryDate = new Date(row.expiry_date);
      if (expiryDate < today) {
        expired++;
      } else if (expiryDate <= thirtyDaysFromNow) {
        expiring30d++;
      } else {
        compliant++;
      }
    });

    const complianceRate = total > 0 ? ((compliant / total) * 100).toFixed(1) : '0.0';
    const status = expired > 0 ? 'CRITIC' : expiring30d > 0 ? 'ATENȚIE' : 'CONFORM';

    complianceData.push({
      category: 'Medicina Muncii',
      total_items: total,
      compliant,
      expiring_30d: expiring30d,
      expired,
      compliance_rate: `${complianceRate}%`,
      status,
    });
  }

  // Equipment Compliance
  const { data: equipmentData } = await supabase
    .from('safety_equipment')
    .select('expiry_date, is_compliant')
    .eq('organization_id', orgId);

  if (equipmentData) {
    const total = equipmentData.length;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    let compliant = 0;
    let expiring30d = 0;
    let expired = 0;

    equipmentData.forEach((row: any) => {
      const expiryDate = new Date(row.expiry_date);
      if (expiryDate < today) {
        expired++;
      } else if (expiryDate <= thirtyDaysFromNow) {
        expiring30d++;
      } else if (row.is_compliant) {
        compliant++;
      }
    });

    const complianceRate = total > 0 ? ((compliant / total) * 100).toFixed(1) : '0.0';
    const status = expired > 0 ? 'CRITIC' : expiring30d > 0 ? 'ATENȚIE' : 'CONFORM';

    complianceData.push({
      category: 'Echipamente PSI',
      total_items: total,
      compliant,
      expiring_30d: expiring30d,
      expired,
      compliance_rate: `${complianceRate}%`,
      status,
    });
  }

  // Training Compliance
  const { data: trainingData } = await supabase
    .from('training_assignments')
    .select('status, due_date')
    .eq('organization_id', orgId);

  if (trainingData) {
    const total = trainingData.length;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    let compliant = 0;
    let expiring30d = 0;
    let expired = 0;

    trainingData.forEach((row: any) => {
      if (row.status === 'completed') {
        compliant++;
      } else if (row.status === 'overdue' || row.status === 'expired') {
        expired++;
      } else if (row.due_date) {
        const dueDate = new Date(row.due_date);
        if (dueDate <= thirtyDaysFromNow) {
          expiring30d++;
        }
      }
    });

    const complianceRate = total > 0 ? ((compliant / total) * 100).toFixed(1) : '0.0';
    const status = expired > 0 ? 'CRITIC' : expiring30d > 0 ? 'ATENȚIE' : 'CONFORM';

    complianceData.push({
      category: 'Instruiri SSM',
      total_items: total,
      compliant,
      expiring_30d: expiring30d,
      expired,
      compliance_rate: `${complianceRate}%`,
      status,
    });
  }

  return complianceData;
}

// ============================================================
// EXCEL GENERATORS
// ============================================================

function generateEmployeesWorkbook(data: EmployeeRow[]): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  // Main employees sheet
  const employeesSheet = [
    {
      'ID': '',
      'Nume Complet': '',
      'Funcție': '',
      'Cod COR': '',
      'Departament': '',
      'Data Angajare': '',
      'Tip Angajare': '',
      'Activ': '',
      'Email': '',
      'Telefon': '',
      'Data Creare': '',
    },
    ...data.map(emp => ({
      'ID': emp.id.substring(0, 8),
      'Nume Complet': emp.full_name,
      'Funcție': emp.job_title || '',
      'Cod COR': emp.cor_code || '',
      'Departament': emp.department || '',
      'Data Angajare': formatDate(emp.hire_date),
      'Tip Angajare': emp.employment_type || '',
      'Activ': emp.is_active ? 'Da' : 'Nu',
      'Email': emp.email || '',
      'Telefon': emp.phone || '',
      'Data Creare': formatDate(emp.created_at),
    }))
  ];

  const ws = XLSX.utils.json_to_sheet(employeesSheet, { skipHeader: true });
  makeBoldHeader(ws);
  autoFitColumns(ws);
  XLSX.utils.book_append_sheet(workbook, ws, 'Angajați');

  // Summary sheet
  const activeCount = data.filter(e => e.is_active).length;
  const inactiveCount = data.length - activeCount;
  const departments = [...new Set(data.map(e => e.department).filter(Boolean))];

  const summarySheet = XLSX.utils.json_to_sheet([
    { 'Indicator': 'Total Angajați', 'Valoare': data.length },
    { 'Indicator': 'Angajați Activi', 'Valoare': activeCount },
    { 'Indicator': 'Angajați Inactivi', 'Valoare': inactiveCount },
    { 'Indicator': 'Departamente Unice', 'Valoare': departments.length },
  ]);
  makeBoldHeader(summarySheet);
  autoFitColumns(summarySheet);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Sumar');

  return workbook;
}

function generateTrainingsWorkbook(data: TrainingRow[]): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  const trainingsSheet = [
    {
      'ID Atribuire': '',
      'Nume Angajat': '',
      'Cod Modul': '',
      'Titlu Modul': '',
      'Categorie': '',
      'Tip Instruire': '',
      'Obligatoriu': '',
      'Status': '',
      'Data Scadență': '',
      'Data Completare': '',
      'Data Sesiune': '',
      'Instructor': '',
      'Scor Test': '',
      'Durată (min)': '',
      'Următoarea Scadență': '',
    },
    ...data.map(tr => ({
      'ID Atribuire': tr.assignment_id.substring(0, 8),
      'Nume Angajat': tr.worker_name,
      'Cod Modul': tr.module_code,
      'Titlu Modul': tr.module_title,
      'Categorie': tr.category.toUpperCase(),
      'Tip Instruire': tr.training_type,
      'Obligatoriu': tr.is_mandatory ? 'Da' : 'Nu',
      'Status': tr.status.toUpperCase(),
      'Data Scadență': formatDate(tr.due_date),
      'Data Completare': formatDate(tr.completed_at),
      'Data Sesiune': formatDate(tr.session_date),
      'Instructor': tr.instructor_name || '',
      'Scor Test': tr.test_score ? `${tr.test_score}%` : '',
      'Durată (min)': tr.duration_minutes || '',
      'Următoarea Scadență': formatDate(tr.next_due_date),
    }))
  ];

  const ws = XLSX.utils.json_to_sheet(trainingsSheet, { skipHeader: true });
  makeBoldHeader(ws);
  autoFitColumns(ws);
  XLSX.utils.book_append_sheet(workbook, ws, 'Instruiri');

  // Statistics sheet
  const totalAssignments = data.length;
  const completed = data.filter(t => t.status === 'completed').length;
  const overdue = data.filter(t => t.status === 'overdue').length;
  const avgScore = data
    .filter(t => t.test_score !== null && t.test_score !== undefined)
    .reduce((sum, t) => sum + (t.test_score || 0), 0) /
    (data.filter(t => t.test_score !== null).length || 1);

  const statsSheet = XLSX.utils.json_to_sheet([
    { 'Indicator': 'Total Atribuiri', 'Valoare': totalAssignments },
    { 'Indicator': 'Completate', 'Valoare': completed },
    { 'Indicator': 'Depășite', 'Valoare': overdue },
    { 'Indicator': 'Rată Completare', 'Valoare': `${((completed / totalAssignments) * 100).toFixed(1)}%` },
    { 'Indicator': 'Scor Mediu Test', 'Valoare': `${avgScore.toFixed(1)}%` },
  ]);
  makeBoldHeader(statsSheet);
  autoFitColumns(statsSheet);
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistici');

  return workbook;
}

function generateMedicalWorkbook(data: MedicalRow[]): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  const medicalSheet = [
    {
      'ID': '',
      'Nume Angajat': '',
      'Funcție': '',
      'Tip Examinare': '',
      'Data Examinare': '',
      'Data Expirare': '',
      'Zile Până Expirare': '',
      'Status': '',
      'Rezultat': '',
      'Restricții': '',
      'Doctor': '',
      'Clinică': '',
      'Observații': '',
    },
    ...data.map(med => ({
      'ID': med.id.substring(0, 8),
      'Nume Angajat': med.employee_name,
      'Funcție': med.job_title || '',
      'Tip Examinare': med.examination_type,
      'Data Examinare': formatDate(med.examination_date),
      'Data Expirare': formatDate(med.expiry_date),
      'Zile Până Expirare': med.days_until_expiry,
      'Status': med.status || '',
      'Rezultat': med.result.toUpperCase(),
      'Restricții': med.restrictions || '',
      'Doctor': med.doctor_name || '',
      'Clinică': med.clinic_name || '',
      'Observații': med.notes || '',
    }))
  ];

  const ws = XLSX.utils.json_to_sheet(medicalSheet, { skipHeader: true });
  makeBoldHeader(ws);
  autoFitColumns(ws);
  XLSX.utils.book_append_sheet(workbook, ws, 'Medicina Muncii');

  // Status summary
  const valid = data.filter(m => m.status === 'VALABIL').length;
  const attention = data.filter(m => m.status === 'ATENȚIE').length;
  const urgent = data.filter(m => m.status === 'URGENT').length;
  const expired = data.filter(m => m.status === 'EXPIRAT').length;

  const statusSheet = XLSX.utils.json_to_sheet([
    { 'Status': 'VALABIL', 'Număr': valid, 'Procent': `${((valid / data.length) * 100).toFixed(1)}%` },
    { 'Status': 'ATENȚIE', 'Număr': attention, 'Procent': `${((attention / data.length) * 100).toFixed(1)}%` },
    { 'Status': 'URGENT', 'Număr': urgent, 'Procent': `${((urgent / data.length) * 100).toFixed(1)}%` },
    { 'Status': 'EXPIRAT', 'Număr': expired, 'Procent': `${((expired / data.length) * 100).toFixed(1)}%` },
  ]);
  makeBoldHeader(statusSheet);
  autoFitColumns(statusSheet);
  XLSX.utils.book_append_sheet(workbook, statusSheet, 'Status Sumar');

  return workbook;
}

function generateEquipmentWorkbook(data: EquipmentRow[]): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  const equipmentSheet = [
    {
      'ID': '',
      'Tip Echipament': '',
      'Descriere': '',
      'Locație': '',
      'Serie': '',
      'Ultima Inspecție': '',
      'Data Expirare': '',
      'Zile Până Expirare': '',
      'Status': '',
      'Următoarea Inspecție': '',
      'Inspector': '',
      'Conform': '',
      'Observații': '',
    },
    ...data.map(eq => ({
      'ID': eq.id.substring(0, 8),
      'Tip Echipament': eq.equipment_type,
      'Descriere': eq.description || '',
      'Locație': eq.location || '',
      'Serie': eq.serial_number || '',
      'Ultima Inspecție': formatDate(eq.last_inspection_date),
      'Data Expirare': formatDate(eq.expiry_date),
      'Zile Până Expirare': eq.days_until_expiry,
      'Status': eq.status || '',
      'Următoarea Inspecție': formatDate(eq.next_inspection_date),
      'Inspector': eq.inspector_name || '',
      'Conform': eq.is_compliant ? 'Da' : 'Nu',
      'Observații': eq.notes || '',
    }))
  ];

  const ws = XLSX.utils.json_to_sheet(equipmentSheet, { skipHeader: true });
  makeBoldHeader(ws);
  autoFitColumns(ws);
  XLSX.utils.book_append_sheet(workbook, ws, 'Echipamente PSI');

  // Equipment type summary
  const typeGroups: Record<string, number> = {};
  data.forEach(eq => {
    typeGroups[eq.equipment_type] = (typeGroups[eq.equipment_type] || 0) + 1;
  });

  const typeSheet = XLSX.utils.json_to_sheet(
    Object.entries(typeGroups).map(([type, count]) => ({
      'Tip Echipament': type,
      'Număr': count,
      'Procent': `${((count / data.length) * 100).toFixed(1)}%`
    }))
  );
  makeBoldHeader(typeSheet);
  autoFitColumns(typeSheet);
  XLSX.utils.book_append_sheet(workbook, typeSheet, 'Pe Tipuri');

  return workbook;
}

function generateComplianceWorkbook(data: ComplianceRow[]): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  const complianceSheet = [
    {
      'Categorie': '',
      'Total Elemente': '',
      'Conforme': '',
      'Expiră în 30 zile': '',
      'Expirate': '',
      'Rată Conformitate': '',
      'Status': '',
    },
    ...data.map(comp => ({
      'Categorie': comp.category,
      'Total Elemente': comp.total_items,
      'Conforme': comp.compliant,
      'Expiră în 30 zile': comp.expiring_30d,
      'Expirate': comp.expired,
      'Rată Conformitate': comp.compliance_rate,
      'Status': comp.status,
    }))
  ];

  const ws = XLSX.utils.json_to_sheet(complianceSheet, { skipHeader: true });
  makeBoldHeader(ws);
  autoFitColumns(ws);
  XLSX.utils.book_append_sheet(workbook, ws, 'Conformitate Generală');

  // Overall metrics
  const totalItems = data.reduce((sum, c) => sum + c.total_items, 0);
  const totalCompliant = data.reduce((sum, c) => sum + c.compliant, 0);
  const totalExpiring = data.reduce((sum, c) => sum + c.expiring_30d, 0);
  const totalExpired = data.reduce((sum, c) => sum + c.expired, 0);
  const overallRate = totalItems > 0 ? ((totalCompliant / totalItems) * 100).toFixed(1) : '0.0';

  const metricsSheet = XLSX.utils.json_to_sheet([
    { 'Indicator': 'Total Elemente', 'Valoare': totalItems },
    { 'Indicator': 'Conforme', 'Valoare': totalCompliant },
    { 'Indicator': 'Expiră în 30 zile', 'Valoare': totalExpiring },
    { 'Indicator': 'Expirate', 'Valoare': totalExpired },
    { 'Indicator': 'Rată Conformitate Generală', 'Valoare': `${overallRate}%` },
  ]);
  makeBoldHeader(metricsSheet);
  autoFitColumns(metricsSheet);
  XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Indicatori Generali');

  return workbook;
}

// ============================================================
// MAIN HANDLER
// ============================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request
    const { org_id, export_type, filters }: ExportRequest = await req.json();

    if (!org_id || !export_type) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing org_id or export_type' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate export type
    const validTypes: ExportType[] = ['employees', 'trainings', 'medical', 'equipment', 'compliance'];
    if (!validTypes.includes(export_type)) {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid export_type. Must be one of: ${validTypes.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Supabase credentials
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log(`Generating ${export_type} export for org: ${org_id}`);

    // Fetch data based on export type
    let workbook: XLSX.WorkBook;
    let fileName: string;
    let recordsCount = 0;

    switch (export_type) {
      case 'employees': {
        const data = await fetchEmployees(supabase, org_id, filters);
        workbook = generateEmployeesWorkbook(data);
        fileName = `Angajati_${new Date().toISOString().split('T')[0]}.xlsx`;
        recordsCount = data.length;
        break;
      }
      case 'trainings': {
        const data = await fetchTrainings(supabase, org_id, filters);
        workbook = generateTrainingsWorkbook(data);
        fileName = `Instruiri_${new Date().toISOString().split('T')[0]}.xlsx`;
        recordsCount = data.length;
        break;
      }
      case 'medical': {
        const data = await fetchMedical(supabase, org_id, filters);
        workbook = generateMedicalWorkbook(data);
        fileName = `Medicina_Muncii_${new Date().toISOString().split('T')[0]}.xlsx`;
        recordsCount = data.length;
        break;
      }
      case 'equipment': {
        const data = await fetchEquipment(supabase, org_id, filters);
        workbook = generateEquipmentWorkbook(data);
        fileName = `Echipamente_PSI_${new Date().toISOString().split('T')[0]}.xlsx`;
        recordsCount = data.length;
        break;
      }
      case 'compliance': {
        const data = await fetchComplianceOverview(supabase, org_id);
        workbook = generateComplianceWorkbook(data);
        fileName = `Raport_Conformitate_${new Date().toISOString().split('T')[0]}.xlsx`;
        recordsCount = data.length;
        break;
      }
    }

    // Generate Excel file as buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Upload to Supabase Storage (temporary bucket)
    const storagePath = `exports/${org_id}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('temp-exports')
      .upload(storagePath, excelBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Generate signed URL (valid for 1 hour)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('temp-exports')
      .createSignedUrl(storagePath, 3600);

    if (urlError || !urlData) {
      throw new Error(`Failed to generate download URL: ${urlError?.message}`);
    }

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const result: ExportResult = {
      success: true,
      download_url: urlData.signedUrl,
      file_name: fileName,
      expires_at: expiresAt.toISOString(),
      records_count: recordsCount
    };

    console.log(`Export successful: ${fileName} (${recordsCount} records)`);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in export-excel:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
